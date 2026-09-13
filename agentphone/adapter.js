'use strict';

const crypto = require('crypto');

/**
 * Maps AgentPhone webhook events to internal event format
 * @param {Object} webhook - The incoming webhook payload
 * @returns {Object} Mapped event object
 */
function mapAgentPhoneWebhook(webhook) {
  const event = {
    id: webhook.id,
    type: 'CALL_ENDED',
    timestamp: webhook.created_at,
    callId: webhook.data?.call_id,
    from: webhook.data?.from,
    to: webhook.data?.to,
    status: webhook.data?.status,
  };

  // Map 'no-answer' status to CALL_MISSED type
  if (webhook.data?.status === 'no-answer') {
    event.type = 'CALL_MISSED';
  }

  return event;
}

/**
 * Verifies the HMAC signature of a webhook payload
 * @param {Object} params - Verification parameters
 * @param {Buffer} params.rawBody - The raw request body
 * @param {string} params.signature - The signature from the webhook header
 * @param {string} params.secret - The webhook secret
 * @returns {boolean} True if signature is valid, false otherwise
 */
function verifySignature({ rawBody, signature, secret }) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return computedSignature === signature;
}

module.exports = {
  mapAgentPhoneWebhook,
  verifySignature,
};