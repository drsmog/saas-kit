const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import { apiWrapper } from "#src/services/apiWrapper.mjs";
import registeredUserService from "#src/services/registeredUser.mjs";

const handler = async (req, res, session) => {
  const registeredUser = await registeredUserService.getRegisteredUserByEmail(
    session.user.email
  );

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: registeredUser.email,
    mode: "subscription",
    success_url: `${req.headers.origin}/billing?success=true`,
    cancel_url: `${req.headers.origin}/billing?canceled=true`,
  });

  res.status(200).json({
    data: {
      ok: "ok",
      sessionUrl: stripeSession.url,
    },
  });
};

const wrappedHandler = (req, res) =>
  apiWrapper("POST", req, res, handler, true);
export default wrappedHandler;
