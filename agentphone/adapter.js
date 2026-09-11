'use strict';

const crypto = require('crypto');
const { normalizeEvent } = require('../provider-core/normalize-event');

const MAX_WEBHOOK_AGE_SECONDS = 300;

function timingSafeEqualText(a, b) {
  const ab = Buffer.from(String(a || ''), 'utf8');
  const bb = Buffer.from(String(b || ''), 'utf8');
  if (ab.length === 0 || ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * AgentPhone webhook verification, per the documented contract:
 *   X-Webhook-Signature: sha256=<hex>
 *   X-Webhook-Timestamp: Unix seconds
 * signed bytes = `${timestamp}.${rawBody}`
 */
function verifySignature({ rawBody, signature, timestamp, secret, nowSeconds = Math.floor(Date.now() / 1000) }) {
  if (!secret) throw new Error('AGENTPHONE_WEBHOOK_SECRET is required');
  if (rawBody === undefined || rawBody === null) throw new Error('raw webhook body is required');
  if (!signature) return false;
  if (!timestamp || !/^\d+$/.test(String(timestamp))) return false;

  const ts = Number(timestamp);
  if (!Number.isSafeInteger(ts)) return false;
  if (Math.abs(nowSeconds - ts) > MAX_WEBHOOK_AGE_SECONDS) return false;

  const signedString = `${timestamp}.${Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody)}`;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(signedString).digest('hex')}`;
  return timingSafeEqualText(expected, String(signature));
}

function mapAgentPhoneWebhook(payload, headers = {}) {
  const eventName = String(payload.event || '').toLowerCase();
  const channel = String(payload.channel || '').toLowerCase();
  const data = payload.data || {};
  const deliveryId = headers['x-webhook-id'] || headers['X-Webhook-ID'] || null;

  let type;
  let disposition = data.disposition || data.status || data.disconnectionReason || null;

  if (eventName === 'agent.message') {
    type = channel === 'voice' ? 'CALL_TRANSCRIPT' : 'MESSAGE_RECEIVED';
  } else if (eventName === 'agent.call_ended') {
    // AgentPhone documents status/callSuccessful/disconnectionReason, but does not
    // currently document a canonical "missed call" status vocabulary. Fail closed:
    // only emit CALL_MISSED for explicit missed/no-answer/busy/unanswered values.
    const explicit = [data.disposition, data.status, data.disconnectionReason]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());
    const missedValues = new Set(['missed', 'no-answer', 'no_answer', 'busy', 'unanswered']);
    type = explicit.some(v => missedValues.has(v)) ? 'CALL_MISSED' : 'CALL_ENDED';
  } else if (eventName === 'agent.reaction') {
    type = 'MESSAGE_REACTION';
  } else {
    throw new Error(`unsupported AgentPhone event: ${eventName || '<empty>'}`);
  }

  return normalizeEvent({
    provider: 'agentphone',
    type,
    id: deliveryId || data.callId || data.messageId || data.conversationId,
    occurredAt: payload.timestamp || data.receivedAt || data.endedAt || data.createdAt,
    from: data.from || data.fromNumber || null,
    to: data.to || data.toNumber || null,
    providerEventId: deliveryId,
    callId: data.callId,
    messageId: data.messageId,
    body: data.message || data.messageBody || null,
    transcript: data.transcript || null,
    disposition,
    raw: payload
  });
}

module.exports = {
  MAX_WEBHOOK_AGE_SECONDS,
  verifySignature,
  mapAgentPhoneWebhook
};
