# Missed-call triage and service lead recovery

Package: `FL-WF-CALL-001` · Version: 0.1.0 · Prepared: 2026-10-01  
Status: **Draft documentation and evaluation plan. Not a completed runtime demonstration, customer engagement or licensed dataset.**  
Operator/contact: Zachary Ribble, FlowLink Revenue AI LLC · tokencraft1390@gmail.com

## Buyer and bounded offer

**Buyer:** Service businesses, customer-operations AI evaluation teams, phone-agent integrators

A bounded implementation or evaluation package for provider event normalization, rescue classification and reviewable follow-up preparation. Delivery and conversion proof are separate milestones.

Primary conversion event: a buyer agrees in writing to a bounded sample evaluation or pilot scope. Payment, rights and delivery must be recorded separately. Unpriced engagements require a quote after scope discovery. Existing prices mentioned here are repository offer terms, not evidence of a sale or independent valuation.

## Source and evidence level

Reviewed source: [docs/architecture.md](docs/architecture.md); source Git blob SHA: `7af67d2c6f82d26de8194f9aba4ddcfaddb0dc91`. A blob SHA identifies this document's contents, not the entire repository version. Pin an exact repository commit before executing or exporting a sample.

- Architecture documents provider adapter, neutral event contract, Strands tool and CALL-E adapter.
- README documents controlled dry-run evidence; no external delivery or paid conversion is inferred.
- Reality Contracting Airtable has three workflow definitions; missed-call connector is recorded Blocked. Active labels on other definitions do not independently prove their scheduler is running.

This pass inspected documentation and linked project records. It did not run repository tests, independently certify deployment behavior or collect customer records. Statements taken from documentation retain that evidence level. New runtime proof must include the exact commit, environment, command, exit code and retained output.

## Operating procedure

**Trigger:** a written, bounded request to evaluate this workflow; production triggers follow the repository's existing configuration.

**Required inputs:** task/need ID; approved scope; source and input version; applicable policy/configuration; environment; permitted action; expected output; source citations; owner and review criteria. Missing required evidence becomes an explicit gap.

1. Receive an authorized provider event and authenticate it before processing.
2. Normalize event identity, call outcome and provider provenance.
3. Classify missed/no-answer/busy events as candidates while preserving no-action outcomes.
4. Prepare a bounded recovery action; do not invent scope, price or availability.
5. For Reality Contracting, route to canonical Leads and Follow Ups by urgency, profitability, deadline and scheduling fit; this is the integration specification until connectors are verified.
6. Require the approved execution path, authorized destination and idempotency controls before external contact.
7. Record provider delivery, qualification, booking and payment as separate observed outcomes.

**Outputs:** process description, traceable decision/output, observed result, evidence references, review notes, limitations and a delivery manifest. External effects require their own receipts.

**Failure handling:** stop the affected operation on invalid input, unsupported scope or unavailable required evidence; retain a redacted failure receipt; state whether retry is safe; assign the unresolved item to the operator. Do not convert a failure into a success through narrative.

## Need-to-satisfier traceability

| Need | Satisfier | Supporting artifact |
| --- | --- | --- |
| Recover genuine missed calls | Provider normalizer and classify_rescue_event | Architecture component map |
| Prevent fabricated outreach | Dry-run externalSendPerformed false | README evidence path |
| Prioritize service work | RC Airtable routing rules | Workflow Control records |

Trace every delivered example through `need_id → workflow_step → component/policy → expected_result → observed_result → evidence → reviewer`. An unsatisfied need must retain a gap, owner and next action.

## Named tension

**Missed-call triage and service lead recovery: operational trade-off.** Rapid response versus consent and reliable delivery. Measure acknowledgement timing only when provider evidence exists; the two-minute RC acknowledgement is a target.

A reviewer records the selected resolution, rejected alternatives, residual limitation and affected need IDs. A trade-off cannot silently remove a hard boundary.

## Roles and tools

| Role | Responsibility | Authority boundary |
| --- | --- | --- |
| Founder/operator | Scope, source selection, delivery and factual review | Owns commercial commitments and rights review |
| AI assistant | Extract, classify, draft and explain from cited sources | Cannot invent observations or become an employee through tooling |
| Deterministic code | Validation, policy/constraint resolution and defined transformations | Authority derives only from applicable configured controls |
| GitHub | Source, review and version evidence | PR/CI status alone proves neither revenue nor commercial ownership |
| Airtable | Package and proof registry | A configured row or Active label does not prove a running integration |
| Linear | Proof gaps, acceptance criteria and next actions | Done status is project evidence, not independent runtime certification |

Describe capacity as founder-led and tool-assisted. State actual human headcount accurately. Software tools and agents are not employees. Any buyer's staffing or operating-history requirements require direct confirmation; no program acceptance is assumed.

## Evaluation plan

[Machine-readable cases](WORKFLOW_EVALUATION_CASES.json) are **unexecuted synthetic evaluation plans**. They contain descriptions and expected outcomes, not captured customer records or executable tests. A harness or operator must map them to this repository's actual interfaces and retain observations.

| Case | Input/scenario | Expected result |
| --- | --- | --- |
| missed | Valid missed-call event | rescue_candidate |
| answered | Valid answered-call event | no_recovery |
| signature | Invalid authentication | rejected |
| dry_run | Recovery dry-run | external_send_false |
| credentials | CALL-E credentials or authorized number absent | execution_blocked |

Suggested source verification procedure (not executed in this pass):

```text
npm install
npm test
npm run dry-run
```

Acceptance for a sample:
1. Pin the repository commit and environment.
2. Execute at least one supported case and one failure/authority-boundary case.
3. Retain command/request, output, exit/status, timestamps and evidence integrity information.
4. Compare observations to the expected results; any mismatch blocks that claim.
5. Confirm privacy and rights review for every exported item.
6. Deliver only a manifest whose counts reconcile with actual files.

Five plan cases are not five completed workflow runs. Forecasts, samples, modeled economics and live observations stay separately labeled.

## Proposed sample and dataset specification

Initial deliverable: this SOP, the evaluation plan, two or more actual observed cases after proof capture, a needs/decisions trace, limitations, and an evidence manifest. Do not promise unavailable operating history or minimum dataset volume.

Each actual trace should contain:
- `package_id`, `case_id`, `need_ids`, `source_repo`, `commit_sha`, `captured_at` and `environment`;
- `input_provenance`, `policy_or_config_identity`, `workflow_steps`, `expected_result` and `observed_result`;
- `decision_reason`, `citations`, `review_status`, `external_effects` and `limitations`;
- `artifact_uri`, `artifact_sha256`, `hash_preimage_definition`, `data_class`, `rights_status` and `redaction_status`.

Use UTC timestamps and hashes over explicitly defined original bytes or canonical serialization. Preserve originals in an approved private location; export a redacted derivative with its own hash and transformation record. Split evaluation examples by source/project and chronology where needed to prevent train/test leakage.

## Redaction and rights review

No customer export occurs as part of this documentation change. Start with synthetic or approved non-sensitive examples. Exclude secrets, keys, access tokens, personal/customer identifiers, unapproved internal communications and third-party material without reuse rights.

Before commercial sharing, inventory contributor/assignment status, third-party licenses and data-use restrictions per artifact. Repository access and company operation are not substitutes for chain of title. Preserve existing license terms; this document grants no new IP or data rights.

Proposed commercial agreement fields: buyer, dataset/workflow scope, permitted training/evaluation purpose, permitted recipients, confidentiality, redaction acceptance, retention/deletion period, security handling, price/payment milestones, acceptance criteria and termination. Ownership, exclusivity, sublicensing, model-training use and derivatives require explicit written terms. This is a scoping checklist, not a signed agreement.

## Delivery and support

Delivery format: Markdown SOP, JSON evaluation plans, actual JSON/text receipts when available, manifest and concise findings. Code access is only included if separately agreed and compatible with existing rights.

Workflow: scope → sample preparation → operator review → buyer evaluation → agreement/payment milestone → bounded delivery → acceptance → support/closing report. Do not infer payment from an application, approved scope or checkout redirect.

Support scope and response times are agreed per engagement; no 24/7 or production SLA is created here. A buyer-facing claim is released only when its supporting artifact and rights status are reviewable.

## Measurement

| Measure | Definition | Current state |
| --- | --- | --- |
| Prepared plan cases | Cases in the companion JSON | 5 unexecuted cases |
| Actual observed cases | Retained receipts tied to pinned commit | Not collected in this pass |
| Eligible export artifacts | Rights-cleared and redacted artifacts | Not established |
| Accepted engagements | Written buyer acceptance | No new acceptance verified |
| Paid revenue | Reconciled payment receipt | No new payment verified |

Decision rule: advance to a buyer sample once current supported and failure-case receipts pass and rights/redaction review clears. If either fails, resolve the narrow gap before promising that capability.

## Remaining proof and delivery tasks

- [ ] Connect and verify the production RC event source.
- [ ] Capture one authorized provider outcome with retry/idempotency evidence.
- [ ] Verify any customer communication policy before enabling outreach.
- [ ] A recovered call is not a sale; tie payment to the actual accepted work.

Documentation review checks: expected-case count reconciles to JSON; source link and blob identity are present; no fabricated observations, headcount, payment or runtime status; existing source/license files remain unchanged.

## Buyer summary

FlowLink can offer a bounded, documented evaluation of **Missed-call triage and service lead recovery**. The package makes inputs, decisions, checks, evidence and unresolved gaps explicit. Initial sharing is limited to a reviewed sample; price, reuse rights and delivery commitments are finalized only after fit and scope are confirmed.

## FLOWLINK HANDOFF

Offer: A bounded implementation or evaluation package for provider event normalization, rescue classification and reviewable follow-up preparation. Delivery and conversion proof are separate milestones.  
Buyer: Service businesses, customer-operations AI evaluation teams, phone-agent integrators  
Conversion: agreed bounded evaluation/pilot scope.  
Assets: SOP, traceability/tension mapping, evaluation plan, proof checklist and commercial scope.  
Measurement: observed cases, cleared artifacts, buyer acceptance and reconciled payment.  
Constraints/blockers: listed proof gaps; truthful human headcount; rights and redaction review.  
Next stage: product package, then release QA after actual proof capture.
