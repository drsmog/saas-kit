const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import { apiWrapper } from "#src/services/apiWrapper.mjs";
import paymentsService from "#src/services/payments.mjs";
import registeredUserService from "#src/services/registeredUser.mjs";

const handler = async (req, res, session) => {
  const registeredUser = await registeredUserService.getRegisteredUserByEmail(
    session.user.email
  );

  const paymentIntent = await stripe.paymentIntents.retrieve(
    req.body.paymentIntentId
  );

  const savedPaymentTransaction = await paymentsService.savePaymentTransaction(
    registeredUser._id,
    registeredUser.stripeCustomerId,
    paymentIntent,
    "one-time-recharge"
  );

  res.status(200).json({
    data: {
      ok: "ok",
    },
  });
};

const wrappedHandler = (req, res) =>
  apiWrapper("POST", req, res, handler, true);
export default wrappedHandler;
