const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import { apiWrapper } from "#src/services/apiWrapper.mjs";
import registeredUserService from "#src/services/registeredUser.mjs";

const handler = async (req, res, session) => {
  const { amount } = req.body;
  const registeredUser = await registeredUserService.getRegisteredUserByEmail(
    session.user.email
  );

  //create create customer
  let customer;

  if (registeredUser.stripeCustomerId) {
    customer = await stripe.customers.retrieve(registeredUser.stripeCustomerId);
  } else {
    customer = await stripe.customers.create({
      email: registeredUser.email,
    });
    await registeredUserService.updateRegisteredUserWithStripeData(
      registeredUser._id,
      { stripeCustomerId: customer.id }
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.status(200).json({
    data: {
      ok: "ok",
      client_secret: paymentIntent.client_secret,
      email: registeredUser.email,
      paymentIntentId: paymentIntent.id,
    },
  });
};

const wrappedHandler = (req, res) =>
  apiWrapper("POST", req, res, handler, true);
export default wrappedHandler;
