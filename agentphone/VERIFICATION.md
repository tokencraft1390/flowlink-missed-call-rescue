# Verification status

As of 2026-09-11, AgentPhone's public documentation confirms:

- `agent.message` and `agent.call_ended` webhook events.
- `X-Webhook-Signature: sha256=<hex_digest>`.
- `X-Webhook-Timestamp` Unix timestamp.
- `X-Webhook-ID` unique delivery identifier for idempotency.
- HMAC-SHA256 signing input exactly `${timestamp}.${raw_body}`.
- A 5-minute freshness check for replay protection.
- `agent.call_ended` includes `callId`, `from`, `to`, `direction`, `status`, `durationSeconds`, `disconnectionReason`, full `transcript`, and optional `callSuccessful`.

The public docs do not currently define a canonical vocabulary for missed-call outcomes. The adapter therefore remains fail-closed and will not convert an arbitrary failed call into `CALL_MISSED` unless a controlled test payload proves an explicit disposition that should trigger recovery.
