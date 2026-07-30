# Twilio deployment

## Environment variables

- `BUSINESS_NAME`: client business name
- `BUSINESS_PHONE`: owner's destination phone in E.164 format
- `RING_TIMEOUT_SECONDS`: optional; default `20`
- `AUTO_REPLY_MESSAGE`: optional customer text
- `OWNER_ALERT_MESSAGE`: optional owner alert

## Function routes

Create one Twilio Functions service and add:

- `/incoming-call` → paste `incoming-call.js`
- `/missed-call` → paste `missed-call.js`
- `/incoming-sms` → paste `incoming-sms.js`

Set all functions to **Protected** after testing.

## Number configuration

For the Twilio number:

1. Voice: **A call comes in** → Function → `/incoming-call` → HTTP POST.
2. Messaging: **A message comes in** → Function → `/incoming-sms` → HTTP POST.
3. Call the Twilio number. It rings `BUSINESS_PHONE`.
4. Let it time out. Confirm the caller receives the rescue text and the owner receives an alert.
5. Call again and answer. Confirm no rescue text is sent.

## Important launch limits

A Twilio trial may restrict calling and messaging to verified recipients. Production SMS in the United States can require registration/compliance steps. Verify current Twilio requirements before onboarding a live client.
