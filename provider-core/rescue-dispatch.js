'use strict';

const DEFAULT_TIMEOUT_MS = 5000;

function getDispatchConfig(env = process.env) {
  return {
    url: (env.RESCUE_DISPATCH_URL || '').trim(),
    token: (env.RESCUE_DISPATCH_TOKEN || '').trim(),
    timeoutMs: Number(env.RESCUE_DISPATCH_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
  };
}

function isDispatchConfigured(env = process.env) {
  const { url } = getDispatchConfig(env);
  return Boolean(url);
}

function buildRescuePayload(event, receivedAt = new Date().toISOString()) {
  return {
    event: 'MISSED_CALL_RESCUE_REQUESTED',
    receivedAt,
    providerEventId: event.providerEventId || event.id || null,
    callId: event.callId || null,
    from: event.from || null,
    to: event.to || null,
    normalizedType: event.type || null,
    disposition: event.disposition || event.status || null,
    business: 'Reality Contracting Construction Inc.',
    workflow: 'reality-contracting-emergency-call-to-cash',
    firstResponse: 'Reality Contracting Emergency Service — we received your missed call. Are you dealing with 1) lockout, 2) active water leak, 3) electrical/no-heat issue, or 4) another urgent repair? Reply with the number and property ZIP and we’ll confirm availability.',
    safetyGateRequired: true,
    paymentEntity: 'Reality Contracting Construction Inc.',
  };
}

async function dispatchRescue(event, { env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const { url, token, timeoutMs } = getDispatchConfig(env);
  if (!url) {
    return { performed: false, reason: 'dispatch_not_configured' };
  }
  if (typeof fetchImpl !== 'function') {
    throw new Error('fetch_unavailable');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_TIMEOUT_MS);

  try {
    const headers = { 'content-type': 'application/json' };
    if (token) headers.authorization = `Bearer ${token}`;

    const response = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildRescuePayload(event)),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`dispatch_http_${response.status}`);
    }

    return { performed: true, status: response.status };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  buildRescuePayload,
  dispatchRescue,
  getDispatchConfig,
  isDispatchConfigured,
};
