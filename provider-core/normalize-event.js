'use strict';

const ALLOWED_TYPES = new Set([
  'CALL_STARTED',
  'CALL_ENDED',
  'CALL_MISSED',
  'MESSAGE_RECEIVED',
  'VOICEMAIL_RECEIVED'
]);

function normalizeEvent(input) {
  if (!input || typeof input !== 'object') throw new TypeError('event payload must be an object');
  const type = String(input.type || '').toUpperCase();
  if (!ALLOWED_TYPES.has(type)) throw new Error(`unsupported event type: ${type || '<empty>'}`);

  const occurredAt = input.occurredAt || new Date().toISOString();
  const id = String(input.id || `${input.provider || 'unknown'}:${type}:${occurredAt}`);

  return Object.freeze({
    schemaVersion: '1.0',
    id,
    provider: String(input.provider || 'unknown'),
    type,
    occurredAt,
    from: input.from ? String(input.from) : null,
    to: input.to ? String(input.to) : null,
    providerEventId: input.providerEventId ? String(input.providerEventId) : null,
    callId: input.callId ? String(input.callId) : null,
    messageId: input.messageId ? String(input.messageId) : null,
    body: input.body ? String(input.body) : null,
    transcript: input.transcript ? String(input.transcript) : null,
    disposition: input.disposition ? String(input.disposition) : null,
    raw: input.raw || null
  });
}

function shouldStartRescue(event) {
  return event.type === 'CALL_MISSED' ||
    (event.type === 'CALL_ENDED' && ['missed', 'no-answer', 'busy', 'unanswered'].includes(String(event.disposition || '').toLowerCase()));
}

module.exports = { normalizeEvent, shouldStartRescue, ALLOWED_TYPES };
