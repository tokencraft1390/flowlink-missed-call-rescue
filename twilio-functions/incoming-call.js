/**
 * FlowLink Missed Call Rescue - Incoming call router
 * Twilio Function path: /incoming-call
 * Required env: BUSINESS_PHONE (E.164, e.g. +16075551234)
 */
exports.handler = function handler(context, event, callback) {
  const response = new Twilio.twiml.VoiceResponse();
  const businessPhone = context.BUSINESS_PHONE;

  if (!businessPhone) {
    response.say('We are unable to connect your call right now. Please try again shortly.');
    return callback(null, response);
  }

  const dial = response.dial({
    answerOnBridge: true,
    timeout: Number(context.RING_TIMEOUT_SECONDS || 20),
    action: '/missed-call',
    method: 'POST',
  });

  dial.number(businessPhone);
  return callback(null, response);
};
