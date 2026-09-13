# FlowLink Missed Call Rescue

FlowLink Missed Call Rescue is a provider-normalized workflow for recovering missed service-business calls into qualified follow-up opportunities.

## What is verified in this repository

- AgentPhone webhook payloads can be normalized into a provider-neutral event schema.
- No-answer, busy, missed, and unanswered call outcomes are classified as rescue candidates.
- AgentPhone webhook signatures are checked with HMAC-SHA256 using a timing-safe comparison.
- A controlled dry-run produces machine-readable evidence without sending an external message or spending customer funds.
- CI runs the automated tests and uploads the dry-run evidence as a workflow artifact.

## What is not yet claimed

This repository does **not** by itself prove customer revenue, paid conversions, SMS delivery, production uptime, or a reference customer. Those claims require live provider and customer evidence.

## Run locally

```bash
npm test
npm run dry-run
```

The dry-run emits JSON containing the normalized event, rescue decision, proposed actions, and an explicit `externalSendPerformed: false` marker.

## Production proof sequence

1. Receive one controlled missed call from the configured AgentPhone number.
2. Persist the webhook event with provider event ID, call ID, timestamp, caller, destination, and normalized event type.
3. Generate the recovery follow-up.
4. Deliver one controlled follow-up and retain provider delivery evidence.
5. Complete one qualification tied to the original call ID.
6. Run one paid pilot and retain payment/receipt evidence privately.

Only after steps 1–6 should the project be represented as having paid commercial traction.

## Core boundaries

- Secrets belong in the deployment provider's environment-variable store, never in source control.
- Webhook signature validation must fail closed when the webhook secret is absent or invalid.
- Controlled dry-runs must never send messages or initiate paid actions.
- Revenue claims must be grounded in receipts/payment records, not architecture or test output.

## Architecture

See [`docs/architecture.md`](docs/architecture.md).
