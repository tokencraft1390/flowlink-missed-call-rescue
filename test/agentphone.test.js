'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { mapAgentPhoneWebhook, verifySignature } = require('../agentphone/adapter');
const { shouldStartRescue } = require('../provider-core/normalize-event');

test('maps no-answer call_end to CALL_MISSED and starts rescue', () => {
  const event = mapAgentPhoneWebhook({
    id: 'evt_test_001',
    event: 'agent.call_ended',
    created_at: '2026-09-13T12:00:00Z',
    data: {
      call_id: 'call_test_001',
      from: '+15555550100',
      to: '+15555550199',
      status: 'no-answer'
    }
  });

  assert.equal(event.type, 'CALL_MISSED');
  assert.equal(event.callId, 'call_test_001');
  assert.equal(shouldStartRescue(event), true);
});

test('does not start rescue for completed call', () => {
  const event = mapAgentPhoneWebhook({
    id: 'evt_test_002',
    event: 'agent.call_ended',
    data: {
      call_id: 'call_test_002',
      status: 'completed'
    }
  });

  assert.equal(event.type, 'CALL_ENDED');
  assert.equal(shouldStartRescue(event), false);
});

test('accepts valid HMAC and rejects invalid HMAC', () => {
  const secret = 'test-only-secret';
  const rawBody = Buffer.from('{"event":"agent.call_ended"}');
  const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  assert.equal(verifySignature({ rawBody, signature, secret }), true);
  assert.equal(verifySignature({ rawBody, signature: '00', secret }), false);
});
