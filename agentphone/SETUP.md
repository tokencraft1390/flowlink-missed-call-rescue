# AgentPhone setup for Call Rescue

## Runtime contract

Call Rescue accepts AgentPhone webhooks only after all of the following pass:

1. `X-Webhook-Signature` is present as `sha256=<hex>`.
2. `X-Webhook-Timestamp` is present and within 300 seconds of server time.
3. Signature matches HMAC-SHA256 over `${timestamp}.${rawBody}` using `AGENTPHONE_WEBHOOK_SECRET`.
4. `X-Webhook-ID` is captured as the provider event id for idempotency.

Do not parse and reserialize the JSON before signature verification. Verify against the exact raw request body bytes.

## Required environment

- `AGENTPHONE_API_KEY` — server-side only; never commit it.
- `AGENTPHONE_WEBHOOK_SECRET` — returned when the project webhook is created/updated; never commit it.
- `CALL_RESCUE_DRY_RUN=true` for the MVP proof path.

## Project webhook

Register the deployed HTTPS Call Rescue endpoint as the AgentPhone project webhook with `POST /v1/webhooks`. Save the returned signing secret directly into the deployment secret store.

Start with `contextLimit: 0` unless recent conversation history is explicitly needed; `agent.call_ended` already contains the complete transcript.

## MVP evidence sequence

1. Run `node agentphone/dry-run.js` locally/CI.
2. Require `signatureVerified: true`.
3. Require `externalSendPerformed: false`.
4. Require `rescueDecision: START_RESCUE` only for an explicit missed/no-answer/busy/unanswered disposition.
5. Configure an AgentPhone test number and webhook.
6. Use only a controlled test caller while `CALL_RESCUE_DRY_RUN=true`.
7. Capture the normalized event and proposed Airtable/recovery actions.

## Fail-closed boundary

AgentPhone's public webhook documentation defines `agent.call_ended`, `status`, `callSuccessful`, and `disconnectionReason`, but does not publish a canonical missed-call disposition vocabulary. Therefore Call Rescue does not infer a missed call merely from a failed or short call. It starts automatic recovery only when an explicit missed/no-answer/busy/unanswered value is present. Unknown dispositions remain `CALL_ENDED` until verified from real controlled test payloads.
