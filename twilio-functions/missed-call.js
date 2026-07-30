/**
 * FlowLink Missed Call Rescue - Missed-call handler
 * Twilio Function path: /missed-call
 * Required env:
 *   BUSINESS_PHONE, BUSINESS_NAME
 * Optional env:
 *   AUTO_REPLY_MESSAGE, OWNER_ALERT_MESSAGE
 */
exports.handler = async function handler(context, event, callback) {
  const response = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  const caller = event.From;
  const twilioNumber = event.To;
  const dialStatus = String(event.DialCallStatus || '').toLowerCase();
  const missedStatuses = new Set(['no-answer', 'busy', 'failed', 'canceled']);

  // The owner answered. End normally and send nothing.
  if (!missedStatuses.has(dialStatus)) {
    return callback(null, response);
  }

  if (!caller || !twilioNumber) {
    console.error('Missing From or To on Twilio event', { caller, twilioNumber, dialStatus });
    return callback(null, response);
  }

  const businessName = context.BUSINESS_NAME || 'our team';
  const businessPhone = context.BUSINESS_PHONE;
  const autoReply = (context.AUTO_REPLY_MESSAGE ||
    `Thanks for calling ${businessName}. Sorry we missed you. Reply with your name, what you need, and the best time to call back.`)
    .replaceAll('{Business Name}', businessName);

  const ownerAlert = (context.OWNER_ALERT_MESSAGE ||
    `Missed call from ${caller}. An automatic text reply was sent. Call status: ${dialStatus}.`)
    .replaceAll('{Caller}', caller)
    .replaceAll('{Status}', dialStatus);

  const jobs = [
    client.messages.create({
      to: caller,
      from: twilioNumber,
      body: autoReply,
    }),
  ];

  if (businessPhone) {
    jobs.push(client.messages.create({
      to: businessPhone,
      from: twilioNumber,
      body: ownerAlert,
    }));
  }

  try {
    const messages = await Promise.all(jobs);
    console.log('Missed Call Rescue completed', {
      dialStatus,
      caller,
      messageSids: messages.map((message) => message.sid),
    });
    return callback(null, response);
  } catch (error) {
    console.error('Missed Call Rescue failed', {
      dialStatus,
      caller,
      code: error.code,
      message: error.message,
    });
    return callback(error);
  }
};
