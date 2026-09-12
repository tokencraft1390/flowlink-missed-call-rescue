import json
import subprocess
from pathlib import Path

from rescue_agent.agent import run_offline_evidence
from rescue_agent.core import analyze_event, bounded_plan

ROOT = Path(__file__).resolve().parents[1]


def test_missed_call_starts_bounded_rescue():
    decision = analyze_event({"id": "evt-1", "type": "CALL_MISSED", "disposition": "no-answer"})
    plan = bounded_plan(decision)
    assert decision["decision"] == "START_RESCUE"
    assert plan["human_approval_required"] is True
    assert plan["external_send_performed"] is False
    assert {a["status"] for a in plan["actions"]} == {"PROPOSED_ONLY"}


def test_answered_call_takes_no_action():
    decision = analyze_event({"id": "evt-2", "type": "CALL_ENDED", "disposition": "completed"})
    assert decision["decision"] == "NO_ACTION"
    assert bounded_plan(decision)["actions"] == []


def test_strands_registered_tools_execute_offline():
    evidence = run_offline_evidence({"id": "evt-3", "type": "CALL_MISSED", "disposition": "busy"})
    assert evidence["strands_agent_created"] is True
    assert evidence["strands_tools_executed"] == ["analyze_missed_call", "prepare_recovery_plan"]
    assert evidence["external_send_performed"] is False


def test_existing_agentphone_fixture_matches_boundary():
    completed = subprocess.run(
        ["node", "agentphone/dry-run.js"], cwd=ROOT, check=True, capture_output=True, text=True
    )
    evidence = json.loads(completed.stdout)
    assert evidence["rescueDecision"] == "START_RESCUE"
    assert evidence["externalSendPerformed"] is False
