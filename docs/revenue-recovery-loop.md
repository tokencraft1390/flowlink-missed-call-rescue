# Revenue Recovery Loop

This module turns the existing missed-call rescue path into a measurable commercial operating loop without copying any competitor implementation.

## Public-market pattern

Current home-service recovery products consistently package the same outcome chain:

1. detect a missed or after-hours call,
2. text the caller immediately,
3. qualify the request,
4. escalate urgent/high-intent replies,
5. hand off for booking,
6. log recovery outcomes,
7. attribute recovered value only when evidence exists.

FlowLink implements that pattern through its own provider-neutral architecture and evidence rules.

## State model

`NEW -> QUALIFYING -> QUALIFIED | URGENT -> BOOKING_READY -> WON | LOST`

`OPTED_OUT` is terminal for automated SMS contact unless a new lawful consent basis is established.

## Required lead fields

- leadId
- caller
- name
- zip
- jobType
- urgency
- urgencyScore
- status
- source/provider
- firstResponseAt
- ownerAlertedAt
- bookingUrl or booking handoff
- outcome
- recoveredValueEstimate
- externalContactEvidence
- paymentEvidence

## Revenue evidence rule

A missed call is not revenue.

A reply is not revenue.

A qualified lead is not revenue.

A booking is not revenue unless the business's accounting policy explicitly treats it as booked sales and the supporting evidence is retained.

FlowLink's campaign scoreboard counts VERIFIED CASH RECEIVED only from payment evidence. Recovered-value estimates remain attribution telemetry.

## Commercial acceptance gate

A buyer installation can be represented as active only after:

- one authorized missed-call event,
- one verified outbound recovery message/provider outcome,
- one inbound reply or controlled acceptance test,
- one owner alert,
- one persisted recovery record,
- consent/opt-out behavior verified,
- booking/escalation handoff verified.

## Competitive upgrade targets

The next production adapters should provide:

- durable recovery-log persistence,
- configurable trade-specific question sets,
- booking URL/calendar handoff,
- CRM/webhook export,
- response-time and recovery-rate telemetry,
- lost/won outcome recording,
- recovered-value attribution,
- daily digest,
- consent and quiet-hours configuration.

These are product requirements, not claims that every adapter is already deployed.
