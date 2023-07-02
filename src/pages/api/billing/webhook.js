import { buffer } from "micro";
import Stripe from "stripe";
import * as amplitude from "@amplitude/analytics-node";
import { apiWrapper } from "#src/services/apiWrapper.mjs";
import registeredUserService from "#src/services/registeredUser.mjs";
import paymentService from "#src/services/payments.mjs";
import utils from "#src/services/utils.mjs";

amplitude.init("2dc9041a65f16ed3bbdfb46258ce1160");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleReferralLogic = async (registeredUser) => {
  try {
    if (!registeredUser.referredByCode) {
      return;
    }
    const invitedByRegisteredUser =
      await registeredUserService.getUserByReferralCode(
        registeredUser.referredByCode
      );
    if (!invitedByRegisteredUser) {
      throw Error("Cant find user by referral code");
    }
    await paymentService.savePaymentTransactionBecauseOfReferral(
      registeredUser._id,
      {
        fromRegisteredUserId: invitedByRegisteredUser._id,
        toRegisteredUserId: registeredUser._id,
      },
      "referral-was-invited"
    );
    await paymentService.savePaymentTransactionBecauseOfReferral(
      invitedByRegisteredUser._id,
      {
        fromRegisteredUserId: invitedByRegisteredUser._id,
        toRegisteredUserId: registeredUser._id,
      },
      "referral-invited-friend"
    );
    amplitude.track(
      "invit-friend",
      {},
      { user_id: invitedByRegisteredUser.email }
    );
    amplitude.track(
      "used-referral-code-to-subscribe",
      {},
      { user_id: registeredUser.email }
    );
  } catch (error) {
    utils.logError(error, ["stripe", "webhook", "referral-logic"]);
  }
};

const handler = async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    if (event.type === "invoice.paid") {
      const registeredUser =
        await registeredUserService.getRegisteredUserByEmail(
          event.data.object.customer_email
        );
      await registeredUserService.updateRegisteredUserWithStripeData(
        registeredUser._id,
        {
          stripeCustomerId: event.data.object.customer,
          stripeSubscriptionId: event.data.object.lines.data[0].subscription,
        }
      );

      const paymentIntent = {
        amount: event.data.object.amount_paid,
        id: event.data.object.payment_intent,
      };
      //
      //TODO some logic here
      //
      await paymentService.savePaymentTransaction(
        registeredUser._id,
        event.data.object.customer,
        paymentIntent,
        "subscription"
      );

      if (event.data.object.billing_reason == "subscription_create") {
        await handleReferralLogic(registeredUser);
      }

      amplitude.track(
        event.data.object.billing_reason,
        {},
        { user_id: registeredUser.email }
      );
      //TODO set product id , price and quantity
      const trackEvent = new amplitude.Revenue()
        .setProductId("subscription-product")
        .setPrice(8)
        .setQuantity(1);

      amplitude.revenue(trackEvent, {
        user_id: registeredUser.email,
      });
    }
  } catch (err) {
    utils.logError(err, ["stripe", "webhook"]);
    return res.status(400).send(`Webhook Error: ${err.message}`).end();
  }

  res.status(200).end();
};

const wrappedHandler = (req, res) =>
  apiWrapper("POST", req, res, handler, false);
export default wrappedHandler;
