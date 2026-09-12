"""CLI evidence harness. Default mode is offline and side-effect free."""

from __future__ import annotations

import argparse
import json

from .agent import build_agent, run_offline_evidence

FIXTURE = {
    "schemaVersion": "1.0",
    "id": "evt_demo_missed_001",
    "provider": "agentphone",
    "type": "CALL_MISSED",
    "occurredAt": "2026-09-11T23:00:00Z",
    "from": "+15555550100",
    "to": "+15555550199",
    "callId": "call_demo_001",
    "disposition": "no-answer",
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--live-model", action="store_true", help="Invoke the configured Bedrock model")
    args = parser.parse_args()
    if args.live_model:
        prompt = "Analyze this normalized missed-call event and prepare the bounded recovery plan: " + json.dumps(FIXTURE)
        print(build_agent()(prompt))
        return
    print(json.dumps(run_offline_evidence(FIXTURE), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
