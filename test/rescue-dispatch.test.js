'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildRescuePayload,
  dispatchRescue,
  isDispatchConfigured,
} = require('../provider-core/rescue-dispatch');

test('dispatch is disabled when no endpoint is configured', async () => {
  assert.equal(isDispatchConfigured({}), false);
  const result = await dispatchRescue({ callId: 'call-1' }, { env: {} });
  assert.deepEqual(result, { performed: false, reason: 'dispatch_not_configured' });
});

test('payload keeps Reality Contracting as payment entity and requires safety gate', () => {
  const payload = buildRescuePayload({
    id: 'evt-1',
    callId: 'call-1',
    from: '+16075550100',
    to: '+16075550101',
    type: 'CALL_MISSED',
    status: 'no-answer',
  }, '2026-10-15T04:00:00.000Z');

  assert.equal(payload.business, 'Reality Contracting Construction Inc.');
  assert.equal(payload.paymentEntity, 'Reality Contracting Construction Inc.');
  assert.equal(payload.safetyGateRequired, true);
  assert.equal(payload.normalizedType, 'CALL_MISSED');
  assert.match(payload.firstResponse, /we received your missed call/i);
  assert.doesNotMatch(payload.firstResponse, /I’m on a job/i);
});

test('configured dispatch posts one rescue request with bearer auth', async () => {
  let request;
  const fakeFetch = async (url, options) => {
    request = { url, options };
    return { ok: true, status: 202 };
  };

  const result = await dispatchRescue(
    { callId: 'call-2', from: '+16075550100', type: 'CALL_MISSED' },
    {
      env: {
        RESCUE_DISPATCH_URL: 'https://automation.example.test/missed-call',
        RESCUE_DISPATCH_TOKEN: 'secret-token',
        RESCUE_DISPATCH_TIMEOUT_MS: '1000',
      },
      fetchImpl: fakeFetch,
    }
  );

  assert.equal(result.performed, true);
  assert.equal(result.status, 202);
  assert.equal(request.url, 'https://automation.example.test/missed-call');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.authorization, 'Bearer secret-token');
  const body = JSON.parse(request.options.body);
  assert.equal(body.callId, 'call-2');
  assert.equal(body.paymentEntity, 'Reality Contracting Construction Inc.');
});
