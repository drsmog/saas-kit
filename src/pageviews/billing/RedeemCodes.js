import {
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  useToast,
  Input,
} from "@chakra-ui/react";
import { usePageState } from "#src/pageviews/billing/billingPageState";
import useErrorHandler from "#src/shared/error/useErrorHandler";
import { useApi } from "#src/shared/hooks/useApi";
import format from "date-fns/format";
import { useState } from "react";
import UIButton from "#src/shared/components/UIButton";
import { trackEvent } from "#src/shared/analitics";

const RedeemCodes = ({ ...props }) => {
  const placeTag = "RedeemCodes";
  const errorHandler = useErrorHandler();
  const api = useApi();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [{ codes }, { addRedeemedCodeInList }] = usePageState();

  const handleRedeemCode = async () => {
    try {
      trackEvent("redeem-code");
      const response = await api.call("POST", `/api/spell-art/redeem-code`, {
        code,
      });

      addRedeemedCodeInList(response.code);
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
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
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
        Credit Codes
      </Text>
      <Flex mt="24px">
        <Input
          placeholder="Redeem Code"
          maxW={"320px"}
          onChange={handleCodeChange}
        />
        <UIButton type="special6" ml="20px" onClick={handleRedeemCode}>
          Redeem Code
        </UIButton>
      </Flex>

      <Box></Box>

      <TableContainer mt="36px">
        <Table>
          <Thead>
            <Tr borderBottom={"3px solid #E9EAED"} backgroundColor="#FFF9EB">
              <Th color={"#656E84"} fontWeight={600}>
                CODE
              </Th>
              <Th color={"#656E84"} fontWeight={600}>
                REDEEMED AT
              </Th>

              <Th color={"#656E84"} fontWeight={600} isNumeric>
                AMOUNT
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {codes &&
              codes.map((codeItem, codeItemIndex) => {
                return (
                  <Tr
                    key={codeItem._id}
                    backgroundColor={
                      codeItemIndex % 2 === 0 ? "#fcfff1" : "#e9e9e9"
                    }
                  >
                    <Td>{codeItem.code}</Td>
                    <Td>
                      {format(
                        new Date(codeItem.redeemedDate),
                        "MM/dd/yyyy HH:mm:ss"
                      )}
                    </Td>
                    <Td isNumeric>
                      ${parseFloat(codeItem.amount / 100).toFixed(2)}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
