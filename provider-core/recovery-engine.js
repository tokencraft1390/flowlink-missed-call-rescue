'use strict';

const DEFAULT_QUESTIONS = Object.freeze([
  { key: 'name', prompt: 'What is your name?' },
  { key: 'zip', prompt: 'What ZIP code is the job in?' },
  { key: 'jobType', prompt: 'What type of service do you need?' },
  { key: 'urgency', prompt: 'Is this urgent or an emergency?' },
]);

const URGENCY_TERMS = [
  'emergency', 'urgent', 'no heat', 'no ac', 'no cooling', 'burst pipe',
  'flood', 'leak', 'sparking', 'electrical smell', 'no power', 'roof leak'
];

function normalizeText(value) {
  return String(value || '').trim();
}

function isOptOut(message) {
  return /^(stop|unsubscribe|cancel|end|quit)$/i.test(normalizeText(message));
}

function urgencyScore(message) {
  const text = normalizeText(message).toLowerCase();
  return URGENCY_TERMS.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
}

function nextQuestion(lead, questions = DEFAULT_QUESTIONS) {
  return questions.find(({ key }) => !normalizeText(lead[key])) || null;
}

function applyLeadReply(lead, message, questions = DEFAULT_QUESTIONS) {
  const body = normalizeText(message);
  if (!body) return { lead: { ...lead }, changed: false, optOut: false };

  if (isOptOut(body)) {
    return {
      lead: { ...lead, optedOutAt: new Date().toISOString(), status: 'OPTED_OUT' },
      changed: true,
      optOut: true,
    };
  }

  const q = nextQuestion(lead, questions);
  if (!q) {
    return {
      lead: { ...lead, notes: [lead.notes, body].filter(Boolean).join(' | ') },
      changed: true,
      optOut: false,
    };
  }

  const updated = { ...lead, [q.key]: body };
  const score = urgencyScore([updated.jobType, updated.urgency, body].filter(Boolean).join(' '));
  updated.urgencyScore = score;
  updated.status = score > 0 ? 'URGENT' : (nextQuestion(updated, questions) ? 'QUALIFYING' : 'QUALIFIED');
  return { lead: updated, changed: true, optOut: false };
}

function recoverySnapshot(lead) {
  const qualified = ['QUALIFIED', 'URGENT'].includes(lead.status);
  return {
    leadId: lead.leadId || null,
    caller: lead.caller || null,
    status: lead.status || 'NEW',
    urgencyScore: Number(lead.urgencyScore || 0),
    qualified,
    bookingReady: qualified && Boolean(lead.zip && lead.jobType),
    recoveredValueEstimate: Number(lead.recoveredValueEstimate || 0),
    externalContactEvidence: lead.externalContactEvidence || null,
    paymentEvidence: lead.paymentEvidence || null,
  };
}

module.exports = {
  DEFAULT_QUESTIONS,
  applyLeadReply,
  isOptOut,
  nextQuestion,
  recoverySnapshot,
  urgencyScore,
};
