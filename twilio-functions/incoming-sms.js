/**
 * Optional: forward customer SMS replies to the business owner.
 * Twilio Function path: /incoming-sms
 * Required env: BUSINESS_PHONE
 */
exports.handler = async function handler(context, event, callback) {
  const client = context.getTwilioClient();
  const businessPhone = context.BUSINESS_PHONE;
  const twilioNumber = event.To;
  const caller = event.From;
  const body = event.Body || '(empty message)';

  if (!businessPhone || !twilioNumber || !caller) {
    return callback(null, 'Missing configuration or event data');
  }

  try {
    await client.messages.create({
      to: businessPhone,
      from: twilioNumber,
      body: `Lead reply from ${caller}: ${body}`,
    });
    return callback(null, 'Reply forwarded');
  } catch (error) {
    console.error('Reply forwarding failed', { code: error.code, message: error.message });
    return callback(error);
  }
};
