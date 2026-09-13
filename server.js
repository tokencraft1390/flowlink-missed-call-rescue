'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { verifySignature, mapAgentPhoneWebhook } = require('./agentphone/adapter');
const { shouldStartRescue } = require('./provider-core/normalize-event');

const PORT = Number(process.env.PORT || 10000);
const WEBHOOK_SECRET = process.env.AGENTPHONE_WEBHOOK_SECRET || '';
const MAX_BODY_BYTES = 1024 * 1024;

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store'
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', chunk => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error('body_too_large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, {
      ok: true,
      service: 'flowlink-missed-call-rescue',
      webhookConfigured: Boolean(WEBHOOK_SECRET)
    });
  }

  if (req.method === 'GET' && url.pathname === '/') {
    const file = path.join(__dirname, 'launch-page', 'index.html');
    try {
      const html = fs.readFileSync(file);
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-length': html.length
      });
      return res.end(html);
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: 'launch_page_unavailable' });
    }
  }

  if (req.method === 'POST' && url.pathname === '/webhooks/agentphone') {
    if (!WEBHOOK_SECRET) {
      return sendJson(res, 503, { ok: false, error: 'webhook_not_configured' });
    }

    try {
      const rawBody = await readBody(req);
      const signature = req.headers['x-agentphone-signature'] || req.headers['x-signature'] || '';
      const valid = verifySignature({ rawBody, signature, secret: WEBHOOK_SECRET });
      if (!valid) return sendJson(res, 401, { ok: false, error: 'invalid_signature' });

      const payload = JSON.parse(rawBody.toString('utf8'));
      const event = mapAgentPhoneWebhook(payload);
      const rescue = shouldStartRescue(event);

      const evidence = {
        event: 'agentphone_webhook_received',
        receivedAt: new Date().toISOString(),
        providerEventId: event.providerEventId,
        callId: event.callId,
        normalizedType: event.type,
        disposition: event.disposition,
        rescueDecision: rescue ? 'START_RESCUE' : 'NO_ACTION',
        externalSendPerformed: false
      };
      console.log(JSON.stringify(evidence));

      return sendJson(res, 202, {
        ok: true,
        accepted: true,
        rescueDecision: evidence.rescueDecision,
        callId: event.callId || null
      });
    } catch (err) {
      console.error(JSON.stringify({ event: 'webhook_error', error: String(err.message || err) }));
      return sendJson(res, 400, { ok: false, error: 'invalid_webhook' });
    }
  }

  return sendJson(res, 404, { ok: false, error: 'not_found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(JSON.stringify({
    event: 'service_started',
    port: PORT,
    webhookConfigured: Boolean(WEBHOOK_SECRET)
  }));
});
