# FlowLink Missed Call Rescue

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/tokencraft1390/flowlink-missed-call-rescue/actions/workflows/ci.yml/badge.svg)](https://github.com/tokencraft1390/flowlink-missed-call-rescue/actions/workflows/ci.yml)

**Live service:** https://flowlink-missed-call-rescue.onrender.com  
**Architecture:** [`docs/architecture.md`](docs/architecture.md)  
**Agents for Humans demo script:** [`docs/demo-script-agents-for-humans.md`](docs/demo-script-agents-for-humans.md)  
**CALL-E adapter:** [`src/call-e-adapter.mjs`](src/call-e-adapter.mjs)

FlowLink Missed Call Rescue is a provider-normalized workflow for turning missed service-business calls into reviewable recovery opportunities while keeping external actions and evidence claims explicit.

## Verified now

- AgentPhone-style webhook payloads can be normalized into a provider-neutral event schema.
- No-answer, busy, missed, and unanswered call outcomes are classified as rescue candidates.
- Webhook signatures are checked with HMAC-SHA256 using timing-safe comparison in the AgentPhone adapter.
- A controlled dry-run emits machine-readable evidence without performing an external send.
- GitHub Actions runs the automated evidence path.
- A Strands Agents SDK implementation defines a real agent and a purpose-built `classify_rescue_event` tool.
- The Node application is deployed on Render.
- A separate CALL-E adapter imports the official `@call-e/calle` server SDK and is wired to `client.calls.createAndWait(...)` behind explicit credential, number, idempotency, and execution guards.

## Not claimed without additional evidence

This repository does **not** by itself prove:

- customer revenue or paid conversion,
- SMS or phone-call delivery,
- a completed CALL-E call,
- production-scale uptime,
- a reference customer.

Those claims require the corresponding provider, payment, or customer evidence.

## Agents for Humans / Strands

The Strands implementation lives in [`strands-agent/`](strands-agent/). It keeps the existing Node service boundary intact while giving the hackathon entry an explicit agent/tool layer for missed-call triage.

```bash
cd strands-agent
npm install
node agent.js missed
```

The Strands instructions require evidence discipline: the agent may prepare a follow-up decision, but it must not claim an external send or revenue without the corresponding evidence.

## CALL-E runtime path

The CALL-E competition path uses the sponsor's official `@call-e/calle` server SDK. The adapter is deliberately fail-closed. It will not place a phone call unless all required runtime values exist and `CALL_E_EXECUTE=1` is explicitly set.

```bash
npm install
export CALLE_API_KEY='<secret>'
export CALLE_TEST_PHONE='<authorized-e164-number>'
export CALLE_IDEMPOTENCY_KEY='flowlink-demo-001'
export CALL_E_EXECUTE=1
npm run calle:proof
```

Use only a phone number authorized for the test. Do not commit API keys or phone numbers. Until this command completes against CALL-E and provider-returned evidence is retained, the repository describes the CALL-E path as an implemented integration, not a completed call.

## Local evidence path

```bash
npm install
npm test
npm run dry-run
```

The dry-run emits the normalized event, rescue decision, proposed actions, and an explicit `externalSendPerformed: false` marker.

## Evidence chain

The intended production chain is:

`provider event -> normalized event -> Strands decision -> approved recovery action -> provider outcome -> qualification -> payment evidence`

Each link must be observed before downstream claims are made. Missing evidence stays an explicit gap rather than being inferred from architecture or test output.

## Core boundaries

- Secrets belong in deployment/provider secret stores, never source control.
- Webhook verification must fail closed when required authentication material is missing or invalid.
- Dry-runs must never send messages or initiate phone calls.
- The CALL-E adapter requires an explicit execution flag and authorized destination.
- Revenue claims require actual payment records.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the system diagram, sequence, stack, traceability matrix, tensions/controls, and hackathon definitions of done.

## Submission material

- Agents for Humans narration + shot list: [`docs/demo-script-agents-for-humans.md`](docs/demo-script-agents-for-humans.md)
- CALL-E contribution PR draft: [`docs/call-e-submission-pr.md`](docs/call-e-submission-pr.md)

## License

MIT. See [`LICENSE`](LICENSE).
