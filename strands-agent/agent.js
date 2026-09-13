import { Agent, tool } from '@strands-agents/sdk';
import { z } from 'zod';
import { runCalleRecoveryProof } from '../src/call-e-adapter.mjs';

const classifyRescueEvent = tool({
  name: 'classify_rescue_event',
  description: 'Classify a normalized phone event and return the allowed next action for FlowLink Missed Call Rescue.',
  inputSchema: z.object({
    eventType: z.string(),
    caller: z.string().optional(),
    callId: z.string().optional(),
  }),
  callback: async ({ eventType, caller, callId }) => {
    const rescueTypes = new Set(['missed', 'no_answer', 'busy', 'unanswered']);
    const rescueCandidate = rescueTypes.has(eventType.toLowerCase());

    return {
      rescueCandidate,
      callId: callId ?? null,
      caller: caller ?? null,
      nextAction: rescueCandidate
        ? 'prepare_human_reviewed_follow_up'
        : 'record_no_action',
      externalSendPerformed: false,
    };
  },
});

export const callERecoveryTool = tool({
  name: 'call_e_recovery',
  description: 'Prepare or execute a guarded CALL-E recovery call for an explicitly authorized E.164 test number. Live execution remains blocked unless CALL_E_EXECUTE=1 and required CALL-E environment variables are present.',
  inputSchema: z.object({
    phone: z.string(),
    missedCallId: z.string(),
  }),
  callback: async ({ phone, missedCallId }) => {
    return runCalleRecoveryProof({
      phone,
      idempotencyKey: `missed-call:${missedCallId}:recovery:v1`,
      execute: process.env.CALL_E_EXECUTE === '1',
    });
  },
});

export const rescueAgent = new Agent({
  systemPrompt: [
    'You are FlowLink Missed Call Rescue, a professional agent for small service businesses.',
    'Your job is to triage normalized phone events and decide whether a missed-call recovery workflow should be prepared.',
    'Use classify_rescue_event for every event.',
    'Use call_e_recovery only for an explicitly authorized test recipient after a rescue candidate is identified.',
    'Never claim a CALL-E call occurred unless the tool returns externalCallPerformed=true and provider result evidence.',
    'Never claim a message was sent unless explicit provider delivery evidence is supplied.',
    'Never claim revenue or conversion without payment evidence.',
  ].join(' '),
  tools: [classifyRescueEvent, callERecoveryTool],
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const event = process.argv[2] ?? 'missed';
  const result = await rescueAgent.invoke(
    `Triage this normalized call event: eventType=${event}. Return the decision and next action.`
  );
  console.log(String(result));
}
