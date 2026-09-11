'use strict';

const crypto = require('crypto');
const { verifySignature, mapAgentPhoneWebhook } = require('./adapter');
const { shouldStartRescue } = require('../provider-core/normalize-event');

const secret = 'dry-run-secret-not-for-production';
const timestamp = String(Math.floor(Date.now() / 1000));
const deliveryId = 'wh_demo_delivery_001';

const fixture = {
  event: 'agent.call_ended',
  channel: 'voice',
  timestamp: new Date().toISOString(),
  agentId: 'agt_demo_001',
  data: {
    callId: 'call_demo_001',
    numberId: 'num_demo_001',
    from: '+15555550100',
    to: '+15555550199',
    direction: 'inbound',
    status: 'no-answer',
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    durationSeconds: 0,
    transcript: [],
    callSuccessful: false
  }
};

const rawBody = JSON.stringify(fixture);
const digest = crypto
  .createHmac('sha256', secret)
  .update(`${timestamp}.${rawBody}`)
  .digest('hex');
const signature = `sha256=${digest}`;

const signatureVerified = verifySignature({
  rawBody,
  signature,
  timestamp,
  secret
});

const event = mapAgentPhoneWebhook(fixture, {
  'x-webhook-id': deliveryId,
  'x-webhook-event': fixture.event
});
const rescue = signatureVerified && shouldStartRescue(event);

const evidence = {
  dryRun: true,
  externalSendPerformed: false,
  signatureVerified,
  replayProtectionSeconds: 300,
  deliveryId,
  normalizedEvent: event,
  rescueDecision: rescue ? 'START_RESCUE' : 'NO_ACTION',
  proposedActions: rescue ? [
    'UPSERT_AIRTABLE_LEAD',
    'GENERATE_RECOVERY_SMS',
    'QUEUE_OWNER_CALLBACK_ALERT'
  ] : []
};

if (!rescue) {
  console.error(JSON.stringify(evidence, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(evidence, null, 2));
