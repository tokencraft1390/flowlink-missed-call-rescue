'use strict';

const crypto = require('crypto');
const { normalizeEvent } = require('../provider-core/normalize-event');

function timingSafeEqualHex(a, b) {
  const ab = Buffer.from(String(a || ''), 'hex');
  const bb = Buffer.from(String(b || ''), 'hex');
  if (ab.length === 0 || ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function verifySignature({ rawBody, signature, secret }) {
  if (!secret) throw new Error('AGENTPHONE_WEBHOOK_SECRET is required');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const supplied = String(signature || '').replace(/^sha256=/i, '');
  return timingSafeEqualHex(expected, supplied);
}

function mapAgentPhoneWebhook(payload) {
  const eventName = String(payload.event || payload.type || '').toLowerCase();
  const data = payload.data || payload;

  let type;
  let disposition = data.disposition || data.status || null;

  if (eventName.includes('message')) type = 'MESSAGE_RECEIVED';
  else if (eventName.includes('voicemail')) type = 'VOICEMAIL_RECEIVED';
  else if (eventName.includes('call_ended') || eventName.includes('call-ended')) {
    const d = String(disposition || '').toLowerCase();
    type = ['missed', 'no-answer', 'busy', 'unanswered'].includes(d) ? 'CALL_MISSED' : 'CALL_ENDED';
  } else if (eventName.includes('call')) type = 'CALL_STARTED';
  else throw new Error(`unsupported AgentPhone event: ${eventName || '<empty>'}`);

  return normalizeEvent({
    provider: 'agentphone',
    type,
    id: payload.id || data.id,
    occurredAt: payload.created_at || payload.createdAt || data.created_at || data.createdAt,
    from: data.from || data.from_number || data.caller,
    to: data.to || data.to_number || data.number,
    providerEventId: payload.id || data.event_id,
    callId: data.call_id || data.callId,
    messageId: data.message_id || data.messageId,
    body: data.body || data.text || data.message,
    transcript: data.transcript || data.transcription,
    disposition,
    raw: payload
  });
}

module.exports = { verifySignature, mapAgentPhoneWebhook };
