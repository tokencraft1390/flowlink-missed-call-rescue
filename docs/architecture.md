# FlowLink Missed Call Rescue Architecture

## System diagram

```mermaid
flowchart LR
  A[Missed service-business call] --> B[Phone provider webhook]
  B --> C[Provider adapter]
  C --> D[Normalize + validate]
  D --> E[Strands Agent]
  E --> F[classify_rescue_event tool]
  F --> G{Rescue candidate?}
  G -- No --> H[Record no action]
  G -- Yes --> I[Prepare bounded recovery]
  I --> J[Human approval boundary]
  J --> K[Render-hosted service]
  K --> L[Controlled provider action]
  L --> M[Delivery / outcome evidence]

  I -. CALL-E competition path .-> N[CALL-E adapter]
  N --> O[@call-e/calle server SDK]
  O --> P[Authorized outbound call]
  P --> Q[Structured CALL-E result]
```

The production service is hosted at https://flowlink-missed-call-rescue.onrender.com. The current Agents for Humans path uses Strands Agents for decisioning. The CALL-E path is a separate adapter that requires CALL-E credentials and an explicitly authorized destination before it can place a call.

## End-to-end sequence

1. A service business misses an inbound call.
2. The provider event enters the adapter boundary.
3. The event is normalized into a provider-neutral call-event contract.
4. The Strands agent receives the normalized event.
5. `classify_rescue_event` decides whether recovery should start.
6. A bounded recovery action is prepared. No message, callback, database write, or revenue claim is inferred from this decision.
7. The workflow stops at a human-approval boundary unless a separately configured production adapter is enabled.
8. The Node service is deployed on Render and exposes the live application boundary.
9. For the CALL-E hackathon path, an explicit CALL-E adapter uses the official `@call-e/calle` server SDK. It refuses to run without a CALL-E API key, an authorized E.164 number, and an idempotency key.
10. A successful CALL-E execution returns provider-side call status and structured evidence that can be retained as runtime proof.

## Components

| Component | Responsibility | Current evidence |
|---|---|---|
| `agentphone/adapter.js` | Map provider payloads to the neutral event contract | Automated tests + dry-run |
| `provider-core/normalize-event.js` | Normalize and classify provider events | Automated tests |
| `strands-agent/agent.js` | Real Strands Agent + `classify_rescue_event` tool | Source on `main`; CI passes |
| `server.js` | Render-hosted application boundary | Live Render deployment |
| `src/call-e-adapter.mjs` | Official CALL-E SDK boundary for authorized runtime calls | Source integration; live proof requires account credentials + authorized number |
| GitHub Actions | Repeatable regression/evidence checks | Green CI on `main` |

## Technology stack

- Node.js 20+
- Strands Agents SDK
- Zod tool schema validation
- CALL-E TypeScript/JavaScript server SDK (`@call-e/calle`)
- Provider-neutral event normalization
- GitHub Actions
- Render

## Traceability

| Need | Satisfying component | Evidence |
|---|---|---|
| Detect a missed service call | Provider adapter + normalizer | CI test / dry-run output |
| Make an agentic decision | Strands `Agent` + `classify_rescue_event` | `strands-agent/agent.js` |
| Avoid fabricated external actions | Explicit `externalSendPerformed: false` boundary | Dry-run evidence |
| Provide a public runtime | Render web service | https://flowlink-missed-call-rescue.onrender.com |
| Support real phone-agent execution for CALL-E | `@call-e/calle` adapter | Requires authenticated CALL-E runtime proof |
| Preserve retry safety | Durable idempotency key | CALL-E adapter rejects missing key |
| Prove commercial value | Paid pilot receipt tied to a call chain | Not yet claimed |

## Tensions and controls

**Speed vs. evidence quality.** Shipping quickly matters, but architecture, CI, or a provider call cannot be represented as paid traction. Revenue requires payment evidence.

**Automation vs. consent.** Phone and messaging automation can create customer-contact risk. The CALL-E adapter requires an explicitly supplied authorized destination and does not contain a baked-in phone number.

**Agent autonomy vs. operational control.** The Strands agent can classify and prepare a recovery action, while customer contact remains behind an explicit execution boundary.

**Provider specificity vs. portability.** AgentPhone-style inbound events and CALL-E outbound calls remain separate adapters around a provider-neutral core.

## Evidence links

- Live service: https://flowlink-missed-call-rescue.onrender.com
- Repository: https://github.com/tokencraft1390/flowlink-missed-call-rescue
- GitHub Actions: https://github.com/tokencraft1390/flowlink-missed-call-rescue/actions
- Strands implementation: `strands-agent/agent.js`
- CALL-E integration: `src/call-e-adapter.mjs`

## Definition of done

### Agents for Humans

A submission-quality proof contains a public repository with MIT or Apache licensing, this architecture artifact, a working Strands agent, green CI, the live Render endpoint, a public demo video, and the participant's AWS Builder ID.

### CALL-E

A submission-quality proof additionally requires the official CALL-E SDK to execute at runtime against an authorized number, provider-returned call evidence, the required contribution PR to `CALLE-AI/awesome-phone-call-agents`, and a public demo video.
