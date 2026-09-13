# FlowLink Missed Call Rescue — Evidence-Tiered Architecture

This document separates demonstrated behavior from implemented-but-unverified behavior and planned dependencies. No revenue, conversion, provider delivery, or runtime claim is treated as proven without direct evidence.

## Evidence legend

- 🟢 **Working / evidenced** — present in the repository and covered by reproducible code, CI, deployment, or captured provider evidence.
- 🟡 **Implemented / not runtime-verified** — code path exists, but no successful external runtime evidence is attached yet.
- ⚪ **Planned / external dependency** — design intent only; do not present as implemented.

## System path

```text
Inbound call / provider event
        |
        v
🟢 AgentPhone webhook adapter
        |
        v
🟢 Provider-normalized call event
        |
        v
🟢 Strands Agent
   | classify_rescue_event
   | call_e_recovery
        |
        +--------------------------+
        |                          |
        v                          v
🟢 guarded preparation      🟡 CALL-E live recovery call
(no external call)          @call-e/calle
                            CalleClient
                            calls.createAndWait(...)
                            hard gate: CALL_E_EXECUTE=1
                            authorized E.164 test recipient only
        |
        v
🟢 Render-hosted proof surface / service
```

## Current evidence state

### 🟢 Working / repository-evidenced

1. Provider normalization and missed-call rescue decision logic are implemented in the repository.
2. A Strands agent is implemented with an explicit custom tool contract using `@strands-agents/sdk`.
3. The CALL-E SDK dependency is pinned to `@call-e/calle@0.7.0`.
4. The CALL-E adapter imports `CalleClient` and contains a real `client.calls.createAndWait(...)` runtime path.
5. The CALL-E path is fail-closed for live execution unless `CALL_E_EXECUTE=1` and required environment variables are supplied.
6. The Strands agent registers `call_e_recovery` as a tool and routes it through the guarded adapter.
7. CI installs dependencies, runs tests, verifies the CALL-E adapter can be imported, syntax-checks the Strands wiring, and preserves controlled dry-run evidence.

### 🟡 Implemented but not yet runtime-verified

1. A successful outbound CALL-E recovery call from the current repository commit.
2. Provider-returned CALL-E call ID, final status, structured result, or evidence payload from an authorized live test.
3. End-to-end missed-call event → Strands decision → CALL-E call completion in one captured run.

These remain yellow until a controlled authorized test produces sanitized provider evidence tied to the exact commit being submitted.

### ⚪ Not claimed

- Customer adoption or paying customers.
- Recovered revenue or conversion rate.
- Production-scale autonomous calling.
- Appointment booking unless explicit provider evidence shows the recipient agreed and the downstream booking action actually occurred.

## Runtime safety boundary

The CALL-E tool may prepare a request without placing a call. A real external call requires all of the following:

- `CALLE_API_KEY` is present.
- `CALLE_TEST_PHONE` or the tool-provided phone is a valid authorized E.164 number.
- an idempotency key is supplied.
- `CALL_E_EXECUTE=1` is explicitly set.

Without those conditions, the adapter fails closed or reports that no external call was performed.

## Evidence chain for Devpost

Use evidence in this order:

1. public repository commit SHA
2. green GitHub Actions run for that SHA
3. live Render URL
4. Strands agent source showing registered tools
5. CALL-E adapter source showing `CalleClient` and `createAndWait`
6. sanitized authorized CALL-E runtime result, only after successful execution
7. architecture diagram / this document
8. short demo video tied to the same evidence state

If a runtime CALL-E test has not succeeded before submission, keep CALL-E yellow and describe it as implemented but not runtime-verified.
