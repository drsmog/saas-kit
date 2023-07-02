import {
  Text,
  Box,
  Image,
  Flex,
  Center,
  useToast,
  Button,
} from "@chakra-ui/react";
import useErrorHandler from "#src/shared/error/useErrorHandler";
import { useApi } from "#src/shared/hooks/useApi";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { trackEvent, trackRevenue } from "#src/shared/analitics";

export const BuyCredits = ({ ...props }) => {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const amounts = [5, 10, 15, 20, 25, 30, 50, 60];

  const placeTag = "RechargeBalanceView";
  const errorHandler = useErrorHandler();
  const api = useApi();
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        console.log("error: stripe is not loaded yet");
        return;
      }
      setIsPaymentProcessing(true);
      const cardElement = elements.getElement(CardElement);

      const paymentIntentResponse = await api.call(
        "POST",
        `/api/billing/recharge`,
        {
          amount: selectedAmount,
        }
      );

      const stripeResult = await stripe.confirmCardPayment(
        paymentIntentResponse.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: paymentIntentResponse.email,
            },
          },
        }
      );

      if (stripeResult.error) {
        toast({
          title: `Oops: something went wrong`,
          description: `${stripeResult.error.message} `,
          position: "bottom-right",
          isClosable: true,
          variant: "solid",
          status: "error",
        });
        setIsPaymentProcessing(false);
        console.error(stripeResult);
        return;
      }

      const saveTransactionResponse = await api.call(
        "POST",
        `/api/billing/save-payment-transaction-record`,
        { paymentIntentId: paymentIntentResponse.paymentIntentId }
      );
      setIsPaymentProcessing(false);
      trackEvent("balance-recharge");
      trackRevenue("recharge", selectedAmount, 1);
      toast({
        title: `Your balance has been updated`,
        description: `Enjoy crafting beautiful art!`,
        position: "bottom-right",
        isClosable: true,
        variant: "solid",
        status: "success",
      });
    } catch (error) {
      errorHandler(error, [placeTag], null, true);
      setIsPaymentProcessing(false);
    }

    return "asd";
  };

  return (
    <Box
      background="#FFFEFB"
      border="1px solid #B8B8B8"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.25)"
      borderRadius="24px"
      p="24px"
      w="100%"
      {...props}
    >
      <Text fontSize={"20px"} fontWeight={700}>
        Buy Credits
      </Text>
      <Text fontSize={"16px"}>
        A $1 worth of credit will provide around 1,500+ generations or about 1
        hour of intense GPU playground usage.
      </Text>
      {amounts.map((amount, amountIndex) => {
        return (
          <Button
            type={amount === selectedAmount ? "special4-selected" : "special4"}
            key={`amount-${amountIndex}`}
            onClick={() => {
              setSelectedAmount(amount);
            }}
            w="200px"
            ml="12px"
            mt="12px"
            fontWeight={600}
          >
            ${amount}.00 USD
          </Button>
        );
      })}

      <Box mt="24px" display={"flex"}>
        <Flex flexDirection={"column"}>
          <Text fontWeight={700} fontSize="16px">
            Total Amount
          </Text>
          <Flex
            background=" #F1F1F1"
            border="1px solid #CACACA"
            borderRadius=" 4px"
            alignItems={"center"}
            p="8px"
            pl="12px"
            pr="12px"
            mt="12px"
          >
            <Image
              src="/icons/billing/payment.png"
              alt="payment-logo"
              w="34px"
              h="34px"
            />
            <Text fontSize={"20px"} fontWeight={600}>
              ${selectedAmount}.00 USD
            </Text>
          </Flex>
        </Flex>
        <Box flexGrow={1} ml="34px">
          <Flex w="400px" flexDirection={"column"}>
            <Box
              border="1px solid #CACACA"
              boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25), -1px 0px 4px rgba(0, 0, 0, 0.25)"
              borderRadius="4px 4px 0px 0px"
              pl="12px"
            >
              <CardElement
                options={{
                  hidePostalCode: true,
                  disabled: isPaymentProcessing,
                  style: {
                    base: {
                      iconColor: "grey",
                      color: "#31325F",
                      lineHeight: "40px",
                      fontWeight: 600,
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                      fontSize: "15px",
                      backgroundColor: "white",
                      border: "1px solid black",
                      padding: "20px",
                      "::placeholder": {
                        color: "grey",
                      },
                    },
                  },
                }}
              />
            </Box>
            <Button
              type="special5"
              onClick={handlePayment}
              fontWeight={700}
              disabled={isPaymentProcessing}
              w="400px"
              borderRadius="unset"
              borderBottomLeftRadius="8px"
              borderBottomRightRadius="8px"
            >
              Pay with card
            </Button>
            <Center mt="10px">
              <Text fontSize={"12px"}>
                100% secure checkout powered by Stripe
              </Text>
            </Center>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
