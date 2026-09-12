# FlowLink Missed Call Rescue

## One-line Summary

A bounded Strands agent that turns a missed service-business call into a human-reviewable recovery plan without silently contacting the customer.

## Problem

Small service businesses lose work when the owner is on a ladder, driving, or already helping a customer and cannot answer the phone. The follow-up is repetitive but judgment-heavy: confirm the event, decide whether it needs recovery, prepare the next actions, and keep customer contact under human control.

## Solution

FlowLink Missed Call Rescue accepts a normalized phone event, uses a Strands agent with two bounded tools to classify the event and prepare a recovery plan, then produces an evidence record. In the current demo, lead capture, recovery SMS, and callback alert are proposals only; no external system is changed.

## Why This Matters

The project targets one concrete revenue leak for small service businesses while preserving a clear approval boundary. It demonstrates the decision path that can later sit between a phone provider and operational tools without pretending that those live integrations are complete.

## How We Used AI

Strands Agents provides the agent container, system instructions, tool registration, direct tool execution, and trace attributes. The agent has two purpose-built tools: `analyze_missed_call` and `prepare_recovery_plan`. The default evidence path executes those registered tools offline and deterministically. A Bedrock-backed natural-language invocation is implemented as an optional path but remains unverified until run with configured AWS credentials.

## How We Used Codex

Codex inspected the existing repository evidence, identified the hackathon-fit gap, designed the bounded Strands workflow, wrote the agent and tests, created the architecture diagram and documentation, and ran the local evidence suite. Codex was also used to keep demonstrated behavior separate from future integrations.

## Key Features

- Provider-neutral call-event normalization
- Missed-call classification for common no-answer outcomes
- Strands agent with two registered custom tools
- Proposed-only recovery plan with required human approval
- Offline evidence harness with no external side effects
- Cross-language regression test covering the existing Node.js fixture

## Architecture

AgentPhone webhook or fixture → normalized event → Strands agent → rescue decision and proposed plan → human approval boundary. The current demo stops before every external write or send. Required diagram: `docs/architecture.png`.

## Testing Instructions

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
python -m pytest -q
python -m rescue_agent.demo
```

Expected evidence includes `strands_agent_created: true`, both Strands tool names, `decision: START_RESCUE`, `human_approval_required: true`, and `external_send_performed: false`.

## Public Demo Link

Not yet available. This is optional under the event requirements and must not be claimed until deployed and verified.

## Public Repository Link

Current working repository: https://github.com/tokencraft1390/flowlink-missed-call-rescue

Blocker: the repository is currently private. It must be made public, include all files in this package, and show the Apache-2.0 license in GitHub's About area before entry.

## Demo Video

Required and not yet recorded. Maximum five minutes. Proposed outline:

1. The missed-call problem and target user.
2. Show the fixture and normalized event.
3. Run `python -m pytest -q`.
4. Run `python -m rescue_agent.demo` and point out the two Strands tools.
5. Show the proposed-only actions and no-send/human-approval boundary.
6. State the unproven live integrations plainly.

## Screenshot Shot List

1. Repository README with Built With and demonstrated/unproven sections.
2. Passing test output.
3. Offline Strands evidence JSON.
4. Architecture diagram.

## Submission Readiness Notes

- Track: Professional Agents.
- Registered Devpost account: verified.
- Submission deadline: September 14, 2026 at 5:00 PM Pacific / September 15 at 00:00 UTC.
- Required AWS Builder ID: not yet supplied.
- Required public video: not yet supplied.
- Required public repository: not yet satisfied because the repository is private.

## Known Limitations

- No live phone webhook has been received.
- No customer has been contacted.
- No Airtable record, SMS, or callback alert has been executed.
- Bedrock inference and AgentCore deployment are not verified.
- AgentPhone signature compatibility is not verified against live provider traffic.

## TODO Official Form Fields

- Submitter Type: Individual (confirm before entry)
- Country of Residence: United States (confirm before entry)
- Track: Professional Agents
- Public code repository URL: blocked until public
- Architecture diagram: `docs/architecture.png`
- AWS Builder ID: required from participant
- Optional live demo URL: blank until verified
- Optional testing instructions: use the commands above
- Optional builder.aws bonus post: not planned in the minimum package
