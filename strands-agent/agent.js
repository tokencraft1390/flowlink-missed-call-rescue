import { Agent, tool } from '@strands-agents/sdk';
import { z } from 'zod';

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

export const rescueAgent = new Agent({
  systemPrompt: [
    'You are FlowLink Missed Call Rescue, a professional agent for small service businesses.',
    'Your job is to triage normalized phone events and decide whether a missed-call recovery workflow should be prepared.',
    'Use classify_rescue_event for every event.',
    'Never claim a message was sent unless explicit provider delivery evidence is supplied.',
    'Never claim revenue or conversion without payment evidence.',
    'Keep externalSendPerformed false unless a separate approved delivery tool is explicitly added and succeeds.',
  ].join(' '),
  tools: [classifyRescueEvent],
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const event = process.argv[2] ?? 'missed';
  const result = await rescueAgent.invoke(
    `Triage this normalized call event: eventType=${event}. Return the decision and next action.`
  );
  console.log(String(result));
}
