"""Pure decision functions used by the Strands tools and tests."""

from __future__ import annotations

from typing import Any

MISSED_DISPOSITIONS = {"missed", "no-answer", "busy", "unanswered"}


def analyze_event(event: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(event, dict):
        raise TypeError("event must be an object")
    event_type = str(event.get("type", "")).upper()
    disposition = str(event.get("disposition", "")).lower()
    rescue = event_type == "CALL_MISSED" or (
        event_type == "CALL_ENDED" and disposition in MISSED_DISPOSITIONS
    )
    return {
        "event_id": str(event.get("id", "")),
        "call_id": event.get("callId"),
        "decision": "START_RESCUE" if rescue else "NO_ACTION",
        "reason": "missed-call signal" if rescue else "event does not qualify",
    }


def bounded_plan(decision: dict[str, Any]) -> dict[str, Any]:
    if decision.get("decision") != "START_RESCUE":
        return {"actions": [], "human_approval_required": False, "external_send_performed": False}
    return {
        "actions": [
            {"name": "UPSERT_LEAD", "status": "PROPOSED_ONLY"},
            {"name": "DRAFT_RECOVERY_SMS", "status": "PROPOSED_ONLY"},
            {"name": "QUEUE_CALLBACK_ALERT", "status": "PROPOSED_ONLY"},
        ],
        "human_approval_required": True,
        "external_send_performed": False,
    }
