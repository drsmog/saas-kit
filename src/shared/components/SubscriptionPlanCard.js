import { Flex, Text, Box, Image, Tooltip, Center } from "@chakra-ui/react";
import useErrorHandler from "#src/shared/error/useErrorHandler";
import { useApi } from "#src/shared/hooks/useApi";
import UIButton from "#src/shared/components/UIButton";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { trackEvent } from "#src/shared/analitics";

export const SubscriptionPlanCard = () => {
  const errorHandler = useErrorHandler();
  const api = useApi();
  const { data: session } = useSession();
  const router = useRouter();
  const [referCode, setReferCode] = useState("");

  useEffect(() => {
    if (!router.query) {
      return;
    }
    if (router.query.refer) {
      setReferCode(router.query.refer);
    }
  }, [router]);

  const handleSubscribe = async () => {
    try {
      trackEvent("subscribe-click");
      if (!session) {
        signIn("google", {
          callbackUrl: `/`,
        });
        return;
      }
      const response = await api.call(
        "POST",
        `/api/billing/create-checkout-session`
      );

      window.location.href = response.sessionUrl;
    } catch (error) {
      errorHandler(error);
    }
  };
  return (
    <Box
      background="#FFFFFF"
      border="1px solid #F3F4F6"
      boxShadow="-1px 0px 4px rgba(0, 0, 0, 0.25), 2px 4px 4px rgba(0, 0, 0, 0.25)"
      borderRadius="36px"
      p="24px"
      w="334px"
    >
      <Flex alignItems={"center"}>
        <Image
          src="/icons/billing/payment.png"
          h="18px"
          w="16px"
          alt="pricing logo"
        />
        <Text ml="10px" fontSize={"20px"} fontWeight={700} color="#4D5562">
          Public alpha
        </Text>
      </Flex>

      <Flex alignItems={"center"}>
        <Text
          fontSize={"36px"}
          textDecor="line-through"
          fontWeight={700}
          color="#BEBEBE"
        >
          $10
        </Text>
        <Text fontSize={"36px"} fontWeight={700} color="#333333" ml="12px">
          $8
        </Text>
        <Tooltip
          hasArrow={true}
          label="Get started with $10 worth of credits for only $8. Credits are applied towards your usage. Any additional usage will only be charged to your card if you top up credits."
          borderRadius={"8px"}
          fontWeight={600}
          p="20px"
        >
          <Text color={"#333333"} fontWeight={700} ml="12px" cursor={"pointer"}>
            per month*
          </Text>
        </Tooltip>
      </Flex>
      <Flex mt="12px">
        <Text
          fontWeight={600}
          color="#5CC083"
          background="#E5F5EB"
          borderRadius="8px"
          pl="12px"
          pr="12px"
          pt="6px"
          pb="6px"
        >
          Save 20% for a limited time
        </Text>
      </Flex>
      <Flex flexDirection={"column"} mt="24px">
        <Text fontWeight={600}>
          ℹ️ $10 credit enables around 15,000 image generations using our A5000
          GPUs.
        </Text>
        <Text fontWeight={600} mt="12px">
          ℹ️ After credits are used, any additional usage is priced at
          $0.000277/second.
        </Text>
        <Text fontWeight={600} mt="12px">
          ✅ Dedicated 1 on 1 feature support.
        </Text>
        <Text fontWeight={600} mt="12px">
          ✅ Pre-installed models and support to help with any other models
          desired.
        </Text>
        <Text fontWeight={600} mt="12px">
          ✅ Merge and train custom models and embeddings.
        </Text>
        <Text fontWeight={600} mt="12px">
          ✅ API Access.
        </Text>
        <Text fontWeight={600} mt="12px">
          ✅ Unlock future access bonuses and perks from Spellbook Labs.
        </Text>
      </Flex>
      <Center mt="24px">
        <UIButton w="286px" type="special3" onClick={handleSubscribe}>
          Subscribe
        </UIButton>
      </Center>
    </Box>
  );
};
