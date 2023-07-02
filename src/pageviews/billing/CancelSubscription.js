import { Text, Box, Flex, useToast } from "@chakra-ui/react";
import useErrorHandler from "#src/shared/error/useErrorHandler";
import { useApi } from "#src/shared/hooks/useApi";
import UIButton from "#src/shared/components/UIButton";
import { trackEvent } from "#src/shared/analitics";

const CancelSubscription = ({ ...props }) => {
  const placeTag = "CancelSubscription";
  const errorHandler = useErrorHandler();
  const api = useApi();
  const toast = useToast();

  const handleCancelSubscription = async () => {
    try {
      trackEvent("cancel-subscription-click");
      const response = await api.call(
        "POST",
        `/api/spell-art/cancel-subscription`,
        {}
      );

      toast({
        title: `Subscription Canceled`,
        description: `Subscription Canceled!`,
        position: "bottom-right",
        isClosable: true,
        variant: "solid",
        status: "success",
      });
    } catch (error) {
      errorHandler(error, [placeTag], null, true);
    }
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
        Cancel Subscription
      </Text>
      <Flex mt="24px" justifyContent={"center"}>
        <UIButton type="special6" ml="20px" onClick={handleCancelSubscription}>
          Cancel Subscription
        </UIButton>
      </Flex>
    </Box>
  );
};
