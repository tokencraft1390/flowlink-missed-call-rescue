'use strict';

const { mapAgentPhoneWebhook } = require('./adapter');
const { shouldStartRescue } = require('../provider-core/normalize-event');

const fixture = {
  id: 'evt_demo_missed_001',
  event: 'agent.call_ended',
  created_at: '2026-09-11T23:00:00Z',
  data: {
    call_id: 'call_demo_001',
    from: '+15555550100',
    to: '+15555550199',
    status: 'no-answer'
  }
};

const event = mapAgentPhoneWebhook(fixture);
const rescue = shouldStartRescue(event);
const evidence = {
  dryRun: true,
  externalSendPerformed: false,
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
