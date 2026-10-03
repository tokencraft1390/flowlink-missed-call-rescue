'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  applyLeadReply,
  isOptOut,
  nextQuestion,
  recoverySnapshot,
  urgencyScore,
} = require('../provider-core/recovery-engine');

test('qualifies a lead through provider-neutral fields', () => {
  let lead = { leadId: 'lead-1', caller: '+16075550100', status: 'NEW' };
  assert.equal(nextQuestion(lead).key, 'name');
  lead = applyLeadReply(lead, 'Sam').lead;
  lead = applyLeadReply(lead, '14901').lead;
  lead = applyLeadReply(lead, 'no heat furnace repair').lead;
  lead = applyLeadReply(lead, 'urgent').lead;
  assert.equal(lead.status, 'URGENT');
  assert.ok(lead.urgencyScore > 0);
  assert.equal(recoverySnapshot(lead).bookingReady, true);
});

test('honors SMS opt-out keywords', () => {
  assert.equal(isOptOut('STOP'), true);
  const result = applyLeadReply({ status: 'QUALIFYING' }, 'stop');
  assert.equal(result.optOut, true);
  assert.equal(result.lead.status, 'OPTED_OUT');
});

test('does not infer payment or contact evidence', () => {
  const snapshot = recoverySnapshot({ status: 'QUALIFIED', zip: '14901', jobType: 'plumbing' });
  assert.equal(snapshot.paymentEvidence, null);
  assert.equal(snapshot.externalContactEvidence, null);
});

test('scores emergency language without claiming a booking', () => {
  assert.ok(urgencyScore('burst pipe emergency') >= 2);
});
