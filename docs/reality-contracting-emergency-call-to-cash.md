# Reality Contracting 24/7 Emergency Call-to-Cash

Business: Reality Contracting Construction Inc.
Service area: Caton / Corning / Elmira / Horseheads core zone, with extended emergency work toward Binghamton only when travel time, ticket value, and capacity justify it.

## Goal

Convert missed after-hours calls into qualified, card-paid emergency jobs without routing Reality Contracting revenue through another company.

## Flow

`MISSED_CALL -> SEND_SMS_30S -> WAIT_90S -> IF_NO_REPLY SEND_SECOND_TOUCH -> CAPTURE_REPLY -> CLASSIFY_ISSUE -> LIFE_SAFETY_GATE -> IF_IMMEDIATE_HAZARD STOP_BOOKING_AND_ESCALATE_TO_911_OR_UTILITY -> IF_SITE_SAFE CAPTURE_ZIP -> QUALIFY_SERVICE_AREA_AND_SCOPE -> IF_INELIGIBLE TERMINAL_DECLINE_OR_REFER -> IF_ELIGIBLE SEND_PAYMENT_LINK -> PAYMENT_CONFIRMED -> BOOK_SLOT -> SEND_ETA -> JOB_COMPLETE -> CHARGE/INVOICE -> SEND_RECEIPT -> MORNING_FOLLOWUP_ONLY_IF_ELIGIBLE_UNRESOLVED_AND_NOT_BOOKED`

## First response, T+30 seconds

> Reality Contracting Emergency Service — we received your missed call. Are you dealing with 1) lockout, 2) active water leak, 3) electrical/no-heat issue, or 4) another urgent repair? Reply with the number and property ZIP and we’ll confirm availability.

## Second touch, T+2 minutes if no reply

> Hi, this is Reality Contracting Construction Inc. I saw your missed call for emergency service. I may be on another job, but I can hold the next available emergency slot. Text back with the property ZIP, problem, and whether the property is occupied.

## Qualification response

> Got it. We handle urgent repair and specialty-trade service in the Elmira–Corning area and extended service toward Binghamton when capacity allows. Emergency dispatch is card-paid to book. What is the property address, is it occupied, and what is actively happening right now?

Qualification gates:

- Immediate threat to life, fire, gas odor, arcing/live electrical hazard, carbon-monoxide concern, flooding near energized equipment, or another unsafe condition: stop contractor booking. Instruct the caller to get to safety and contact 911 and/or the appropriate utility/emergency service first. Resume contractor dispatch only after the immediate hazard is controlled and the site is safe to enter.
- Urgent property-damage risk without an immediate life-safety hazard: continue emergency contractor flow.
- Can reasonably wait until standard hours: offer next available standard slot.
- Outside service capability, licensing scope, or service area: decline or refer and preserve that terminal status.

## Booking close

> Perfect. I can hold the next emergency window for that address. I’ll send a secure card link for the dispatch fee. Once paid, the slot is confirmed and I’ll send ETA updates.

## Payment policy

Emergency dispatch and job payment are card-only. No personal checks, Venmo, or Zelle.

Invoice/footer language:

> Emergency Service: card payment required to book. Visa, Mastercard, American Express and other supported card methods accepted. Dispatch fee confirms the emergency slot and is applied according to the written estimate/invoice terms.

Before dispatch:

- Property address confirmed.
- Occupancy confirmed.
- Emergency type confirmed.
- Life-safety gate cleared and site safe to enter.
- Service area and scope eligibility confirmed.
- Card payment or dispatch authorization confirmed.
- Actual ETA window sent.

After completion:

- Charge approved balance through the Reality Contracting payment processor.
- Send itemized receipt.
- Attach job photos where appropriate.
- Put the property address on the receipt for owner/property-manager bookkeeping.

## Service-zone rules

Core operating radius remains the Reality Contracting 33-mile zone around Caton, including Corning, Elmira, Horseheads and nearby service areas.

Extended emergency work toward Binghamton is accepted only when travel, job value and capacity justify it. Quote any travel surcharge before dispatch.

Do not promise a universal 45- or 90-minute ETA. Quote the actual available window per job.

## Morning recovery loop

At 7:00 AM, follow up only eligible, unresolved after-hours leads that did not book. Do not reopen leads marked declined, referred, outside service area, outside capability/licensing scope, unsafe-site hold, or otherwise terminal.

> Morning, this is Reality Contracting following up on your emergency call from last night. Did you get the issue handled? If not, I have service availability today and can invoice by card for the property.

Track outcome as: booked / solved elsewhere / no response / not qualified / referred / unsafe-site hold / follow-up date.

## Lead record

Persist at minimum:

- Timestamp
- Caller number
- ZIP
- Property address
- Property manager/company when applicable
- Issue type
- Occupied yes/no
- Life-safety gate status
- Service-area/scope eligibility
- Lead status
- Dispatch fee quoted
- Payment status
- Booking status
- ETA
- Final ticket value
- Receipt sent
- Follow-up outcome

## KPIs

Weekly:

- After-hours calls received
- Missed calls captured by automation
- Response rate
- Qualified emergency leads
- Payment links sent
- Dispatch fees paid
- Jobs completed
- Average emergency ticket
- Revenue recovered from missed calls
- Property-manager repeat bookings

## Claim control

Do not publish a “58% miss rate” or “$800 average emergency job” as a business fact until Reality Contracting call logs and paid invoices support those numbers. Until then, public messaging should say the system is built to stop after-hours emergency lead leakage and increase captured emergency revenue.

## Entity separation

Reality Contracting jobs, receipts, merchant descriptions and customer-facing payment links must use Reality Contracting Construction Inc. payment rails. Do not route these transactions through FlowLink Revenue AI LLC merely because that Stripe account is already connected.

## Provenance

Founder-directed. AI-assisted where noted. Founder provenance remains supported by repository and project evidence. Rights and third-party obligations are tracked separately and do not erase founder contribution.
