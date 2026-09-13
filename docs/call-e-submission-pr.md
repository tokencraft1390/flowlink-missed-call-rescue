# CALL-E Contribution PR Draft

## Suggested title

FlowLink Missed Call Rescue — bounded service-business callback recovery

## Contribution area

Workflow Plugin / Phone Call Agent use case. Follow the current `CALLE-AI/awesome-phone-call-agents` README taxonomy when opening the contribution PR and place the entry in the exact category requested by that repository.

## PR body

### What this contributes

FlowLink Missed Call Rescue is a reusable recovery workflow for small service businesses that miss inbound calls while the owner is driving, working with a customer, or away from the phone.

The project separates four concerns:

1. provider-neutral missed-call normalization,
2. agentic classification with Strands Agents,
3. an explicit human/execution boundary,
4. a CALL-E outbound adapter for an authorized recovery call.

### CALL-E usage

The CALL-E path uses the official `@call-e/calle` server SDK. `src/call-e-adapter.mjs` creates a `CalleClient` and, only when `CALL_E_EXECUTE=1` is explicitly enabled, calls `client.calls.createAndWait(...)` with:

- an authorized E.164 test recipient,
- a bounded recovery task,
- a durable idempotency key,
- structured recipient output for callback interest,
- workflow metadata for evidence correlation.

The default path refuses to place a call unless the API key, authorized number, idempotency key, and execution flag are supplied.

### Why this is useful

A missed service-business call is a narrow, high-value workflow where phone automation has a natural role. The agent is not a generic chatbot that happens to dial a number. It is a defined recovery step in a traceable operations pipeline, with retry protection and explicit boundaries around what can be claimed as completed.

### Demo

Live application boundary:
https://flowlink-missed-call-rescue.onrender.com

Source repository:
https://github.com/tokencraft1390/flowlink-missed-call-rescue

Demo video: ADD_PUBLIC_YOUTUBE_OR_VIMEO_URL

### Reproduce the CALL-E proof

```bash
npm install
export CALLE_API_KEY='<secret>'
export CALLE_TEST_PHONE='<authorized-e164-number>'
export CALLE_IDEMPOTENCY_KEY='flowlink-demo-001'
export CALL_E_EXECUTE=1
npm run calle:proof
```

Do not commit credentials or real phone numbers. Use only a number authorized for the test.

### Evidence boundary

Repository tests, dry-runs, and the deployed endpoint prove software behavior. A completed CALL-E call is only claimed after provider-returned runtime evidence exists. Commercial revenue is outside this contribution and is not inferred from the integration.
