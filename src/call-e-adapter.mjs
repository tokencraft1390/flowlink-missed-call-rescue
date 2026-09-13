import { CalleClient } from '@call-e/calle';

const E164 = /^\+[1-9]\d{7,14}$/;

function required(name, value) {
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function buildRecoveryTask({ businessName = 'the service business', context = 'missed service call' } = {}) {
  return [
    `Call the authorized test recipient on behalf of ${businessName}.`,
    `Context: ${context}.`,
    'Confirm whether they would like a callback from the service business.',
    'Do not collect payment information.',
    'Do not claim an appointment is booked unless the recipient explicitly agrees.',
    'Return a concise structured outcome.'
  ].join(' ');
}

export async function runCalleRecoveryProof({
  phone = process.env.CALLE_TEST_PHONE,
  apiKey = process.env.CALLE_API_KEY,
  baseUrl = process.env.CALLE_BASE_URL || 'https://api.heycall-e.com',
  idempotencyKey = process.env.CALLE_IDEMPOTENCY_KEY,
  execute = process.env.CALL_E_EXECUTE === '1',
  businessName = process.env.CALLE_BUSINESS_NAME || 'FlowLink demo business'
} = {}) {
  required('CALLE_API_KEY', apiKey);
  required('CALLE_TEST_PHONE', phone);
  required('CALLE_IDEMPOTENCY_KEY', idempotencyKey);
  if (!E164.test(phone)) throw new Error('CALLE_TEST_PHONE must be E.164');

  const task = buildRecoveryTask({ businessName });
  const request = {
    task,
    recipients: [{ phones: [phone], region: 'US', locale: 'en-US' }],
    recipientResultSchema: {
      type: 'object',
      required: ['callback_requested'],
      properties: {
        callback_requested: { type: 'string', enum: ['yes', 'no', 'unclear'] },
        preferred_time: { type: ['string', 'null'] },
        notes: { type: ['string', 'null'] }
      }
    },
    metadata: {
      workflow: 'flowlink-missed-call-rescue',
      proof_mode: execute ? 'authorized-live-call' : 'guarded-no-call'
    }
  };

  const proof = {
    provider: 'CALL-E',
    sdk: '@call-e/calle',
    execute,
    phoneRedacted: `${phone.slice(0, 3)}***${phone.slice(-2)}`,
    idempotencyKey,
    task,
    requestPrepared: true,
    externalCallPerformed: false
  };

  if (!execute) {
    return {
      ...proof,
      blockedReason: 'Set CALL_E_EXECUTE=1 only for an authorized test number to place the real CALL-E call.'
    };
  }

  const client = new CalleClient({ apiKey, baseUrl });
  const call = await client.calls.createAndWait(request, { idempotencyKey });

  return {
    ...proof,
    externalCallPerformed: true,
    callId: call.id ?? call.callId ?? null,
    status: call.status ?? null,
    taskCompleted: call.taskCompleted ?? null,
    completionConfidence: call.completionConfidence ?? null,
    structuredResult: call.structuredResult ?? null,
    recipientResult: call.recipients?.[0]?.structuredResult ?? null,
    evidence: call.evidence ?? null
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const result = await runCalleRecoveryProof();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      provider: 'CALL-E',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, null, 2));
    process.exitCode = 1;
  }
}
