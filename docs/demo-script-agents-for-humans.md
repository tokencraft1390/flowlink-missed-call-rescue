# Agents for Humans Demo Script

Target length: 3:15 to 3:45.

## 0:00-0:25 — Problem

“Small service businesses lose real opportunities when the owner cannot answer the phone because they are driving, on a ladder, with another customer, or simply away from the phone. FlowLink Missed Call Rescue turns that missed-call event into a bounded recovery workflow instead of another forgotten voicemail.”

Screen: project title, then live Render URL.

## 0:25-0:55 — Who it is for and why it matters

“This is built for small service businesses where one missed call can be the difference between an empty schedule slot and paid work. The repetitive part is detecting the event and preparing the recovery. The judgment-heavy part is deciding whether action is appropriate and what the next step should be. That is where the agent sits.”

Screen: README problem statement and architecture diagram.

## 0:55-1:35 — Technical implementation

“The inbound event is normalized into a provider-neutral call contract. A real Strands Agent receives that normalized event and has a purpose-built tool called `classify_rescue_event`. The agent is instructed to use the tool for every event, never claim a message was sent without delivery evidence, and never claim revenue without payment evidence.”

Screen: `strands-agent/agent.js`. Highlight the Strands import, tool definition, system prompt, and tool registration.

“The tool distinguishes missed, no-answer, busy, and unanswered events from calls that need no recovery. For a rescue candidate it prepares the allowed next action while preserving an explicit external-send boundary.”

## 1:35-2:05 — Working evidence

“Here is the repeatable evidence path. The automated tests and dry-run normalize a missed-call fixture, classify it as a rescue candidate, and emit machine-readable output. The important detail is that `externalSendPerformed` stays false, so the demo cannot accidentally manufacture customer-contact evidence.”

Screen: GitHub Actions green run, then terminal or saved dry-run output.

## 2:05-2:35 — Product experience

“The service is also deployed on Render, so this is not only repository architecture. The live application boundary is running at `flowlink-missed-call-rescue.onrender.com`. The product model is intentionally quiet: routine classification happens in the workflow, while a consequential customer-contact step remains behind an explicit approval or production adapter boundary.”

Screen: live Render URL, then architecture diagram showing the human approval boundary.

## 2:35-3:05 — Originality and extension

“The differentiator is not ‘AI answers a phone.’ The design separates provider events, agent judgment, execution, and evidence. That means the phone provider can change without rewriting the decision model, and every claim can be traced to a real event or provider result. A separate CALL-E adapter demonstrates how the same recovery contract can drive an authorized phone-agent workflow without coupling the Strands decision logic to one carrier.”

Screen: `src/call-e-adapter.mjs`, showing the official `@call-e/calle` import and execution guard.

## 3:05-3:30 — Close

“FlowLink Missed Call Rescue gives small service businesses an agent that handles the repetitive missed-call triage, preserves human control where it matters, and creates an evidence chain that can eventually connect a missed call to a real customer outcome. What is demonstrated today is the agent, classification workflow, automated evidence, and live deployment. Revenue, delivery, or conversion are only claimed when the corresponding real-world evidence exists.”

Screen: final architecture diagram with live URL and repository.

## Shot checklist

1. Project title + live Render endpoint.
2. README: problem and verified behavior.
3. `docs/architecture.md` Mermaid diagram.
4. `strands-agent/agent.js`: SDK import, tool, system prompt, registration.
5. GitHub Actions green CI run.
6. Dry-run output with rescue decision and `externalSendPerformed: false`.
7. Live Render endpoint responding.
8. `src/call-e-adapter.mjs`: official CALL-E SDK import, execution guard, `createAndWait` call.
9. Final architecture/evidence slide.

## Recording rules

- Keep the video under five minutes.
- Do not claim a paid customer, revenue, SMS delivery, or completed CALL-E call unless that evidence exists before recording.
- Do not expose API keys, phone numbers, webhook secrets, AWS credentials, or customer information.
- If the CALL-E live proof has not been run yet, describe it as an implemented integration boundary, not a completed provider call.
