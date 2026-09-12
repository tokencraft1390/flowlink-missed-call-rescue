"""Strands orchestration for bounded missed-call recovery."""

from __future__ import annotations

import json
from typing import Any

from strands import Agent, tool

from .core import analyze_event, bounded_plan

SYSTEM_PROMPT = """You are FlowLink Missed Call Rescue, an operations agent for small service businesses.
Analyze the normalized call event, prepare only the bounded recovery plan, and clearly state that every
external action is proposed-only. Never claim that a text, database write, or callback occurred. Human
approval is required before customer contact."""


@tool
def analyze_missed_call(event_json: str) -> dict[str, Any]:
    """Classify one normalized phone event and decide whether recovery should start."""
    return analyze_event(json.loads(event_json))


@tool
def prepare_recovery_plan(decision_json: str) -> dict[str, Any]:
    """Create a no-send, human-approved recovery plan from a rescue decision."""
    return bounded_plan(json.loads(decision_json))


def build_agent() -> Agent:
    return Agent(
        system_prompt=SYSTEM_PROMPT,
        tools=[analyze_missed_call, prepare_recovery_plan],
        callback_handler=None,
        trace_attributes={"service": "flowlink-call-rescue", "mode": "bounded-demo"},
    )


def _tool_payload(result: dict[str, Any]) -> dict[str, Any]:
    if result.get("status") != "success":
        raise RuntimeError(f"Strands tool failed: {result}")
    return json.loads(result["content"][0]["text"])


def run_offline_evidence(event: dict[str, Any]) -> dict[str, Any]:
    """Exercise registered Strands tools without model inference or external side effects."""
    agent = build_agent()
    decision = _tool_payload(agent.tool.analyze_missed_call(event_json=json.dumps(event)))
    plan = _tool_payload(agent.tool.prepare_recovery_plan(decision_json=json.dumps(decision)))
    return {
        "strands_agent_created": agent.__class__.__name__ == "Agent",
        "strands_tools_executed": ["analyze_missed_call", "prepare_recovery_plan"],
        "decision": decision,
        "plan": plan,
        "external_send_performed": False,
        "mode": "offline-evidence",
    }
