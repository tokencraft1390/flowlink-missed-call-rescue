# V1_CALL-E Fit Check — FlowLink Missed Call Rescue

**Decision:** CONDITIONAL GO for a bounded build; **NOT READY** for Devpost submission.

**Checked:** 2026-09-04  
**Source branch:** `main` at `4d2c5ecdbbdfc7e4395c00892cfe6d4cdd2d9942`  
**Target challenge:** [CALL-E: Your Code Is Calling](https://call-e.devpost.com/)

## Why this is a real fit

FlowLink Missed Call Rescue already addresses a specific phone-work problem: a service business misses an inbound call, the caller receives a text, and the owner receives an alert. The repository contains:

- Twilio Functions for inbound call routing, missed-call detection, automatic SMS response, and reply forwarding.
- A launch page and product copy aimed at phone-driven service businesses.
- An intake authorization statement.
- `SECURITY.md` and `CODEOWNERS` controls for phone numbers, messages, credentials, consent, external actions, and release approval.
- Initial source commits dated 2026-07-30, after the challenge submission period opened on 2026-07-23.

This supports the event's real-world-impact criterion. It does **not** yet satisfy the required CALL-E technical implementation.

## Live rule and submission facts verified

The Devpost source of truth was fetched on 2026-09-04.

- Submission deadline: 2026-09-14 15:45 UTC / 11:45 AM EDT.
- Existing work is allowed only if significantly updated during the submission period. This repository's source was first committed during the period, so it can be classified as newly created.
- A functional project must actually use CALL-E's API, SDK, MCP, CLI, or Skill.
- The project must install and run consistently and work as depicted.
- Required evidence includes a text description, a public demonstration video under three minutes, the CALL-E account email, testing instructions, and a pull request to `CALLE-AI/awesome-phone-call-agents`.
- A testable project must remain available free of charge through judging.
- The project must be original, owned by the entrant, and compliant with third-party licenses.
- Prize selection is contest-contingent; this document does not treat any prize as revenue.

## Current readiness matrix

| Gate | Current evidence | Status |
| --- | --- | --- |
| Specific phone-work problem | Missed-call recovery for service businesses | PASS |
| New during contest window | First source commits: 2026-07-30 | PASS |
| Existing functional workflow | Twilio routing/SMS functions exist | PARTIAL — not runtime-tested here |
| CALL-E used at runtime | No CALL-E code or dependency found | FAIL |
| Non-trivial CALL-E contribution | No CALL-E workflow exists | FAIL |
| Safe side-effect boundary | Security policy and intake consent exist | PARTIAL |
| Dry-run / no-call path | Not implemented | FAIL |
| Idempotency / duplicate-call prevention | Not implemented | FAIL |
| Structured CALL-E result | Not implemented | FAIL |
| Automated tests | No test suite found | FAIL |
| Root README and run instructions | Only Twilio subdirectory README exists | FAIL |
| License / provenance | No root license or provenance register found | FAIL |
| Public source or submission PR | Repository is private; no CALL-E PR found | FAIL |
| Demo video / screenshots | No verified evidence found | FAIL |
| Devpost registration and rules acceptance | Not verified | BLOCKED |

## Recommended project shape

**Working title:** FlowLink Consent-First Missed Call Recovery

**Contribution type:** small runnable app or workflow plugin, not a marketing page.

**Proposed behavior:**

1. Receive a normalized missed-call event from the existing Twilio handler.
2. Send the existing SMS response with a clear opt-in phrase for an AI-assisted callback.
3. Record explicit caller opt-in and a stable event/idempotency key.
4. Present a masked callback preview to the business owner.
5. Require explicit owner approval for exactly one disclosed CALL-E callback.
6. Use CALL-E to collect only:
   - reason for calling;
   - urgency category;
   - preferred human callback window; and
   - consent to receive the human callback.
7. Return a strict result schema with `unknown` preserved.
8. Never quote a price, make a promise, book work, accept payment, or call another number automatically.
9. Treat voicemail, refusal, low confidence, or unexpected status as human-review outcomes.
10. Keep a fixture-backed no-call demo as the default.

## Differentiation risk

The CALL-E community repository already lists callback-coordination projects. A generic callback app would be weak and potentially duplicative. The defensible contribution is the **missed inbound call → double-consent → owner-approved CALL-E callback → structured lead handoff** chain, including replay protection and a no-call fixture.

Before building, compare the final scope against the existing `callback-coordinator`, `evidence-grounded-callback`, and `lead-follow-up-booking` entries. If the only difference is branding or copy, stop.

## Minimum build required

- [ ] Add a root README with verified setup and architecture.
- [ ] Add an MIT or Apache-compatible license after ownership/provenance approval.
- [ ] Add a dedicated CALL-E adapter using the documented Python or TypeScript SDK.
- [ ] Add strict request and result schemas.
- [ ] Add a preview-only default and explicit execution approval gate.
- [ ] Add stable idempotency and duplicate-call protection.
- [ ] Add fictional fixtures and unit tests requiring no phone credentials.
- [ ] Add masked logging and retention limits for phone/transcript data.
- [ ] Add cancellation, failure, and rollback instructions.
- [ ] Run tests and record exact output.
- [ ] Prepare a public-safe contribution folder with no secrets or customer data.
- [ ] Obtain explicit approval before account creation, real calls, repository publication, PR creation, video publication, or Devpost submission.

## Go / no-go checkpoint

Proceed to implementation only if all four conditions are true:

1. The contribution remains meaningfully distinct from existing CALL-E community entries.
2. A complete fixture-only demo can be built and tested before any real call.
3. Phone numbers, credentials, transcript data, pricing, scheduling, and commitments remain fail-closed.
4. The owner explicitly accepts the official rules and approves the public contribution path.

If any condition fails, retain the existing Twilio offer as a separate private FlowLink product and do not force it into the hackathon.

## Current result

The fit check is complete. The project has credible problem fit and contest-window timing, but it is **not an eligible CALL-E submission today**. The highest-value next technical action is a fixture-first adapter spike; no account, call, public repository, pull request, video, or Devpost entry is authorized by this document.
