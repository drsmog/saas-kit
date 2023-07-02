import { Center, Container } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BuyCredits } from "./BuyCredits";
import { SubscriptionPlanCard } from "#src/shared/components/SubscriptionPlanCard";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const BillingPageView = ({ serverData }) => {
  return (
    <Container maxW={"1100px"} mb="140px" w="100%">
      <Elements stripe={stripePromise}>
        <BuyCredits mt="56px" />
      </Elements>
      {/* {registeredUser.stripeSubscriptionId && <CancelSubscription mt="56px" />}
      <RedeemCodes mt="56px" />
      <PaymentList mt="56px" /> */}
      <Center mt="60px">
        <SubscriptionPlanCard />
      </Center>
    </Container>
  );
};

export default BillingPageView;
