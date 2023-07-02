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
} from "@chakra-ui/react";
import format from "date-fns/format";

const PaymentList = ({ payments, ...props }) => {
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
        Recent Transactions
      </Text>
      <TableContainer mt="36px">
        <Table>
          <Thead>
            <Tr borderBottom={"3px solid #E9EAED"} backgroundColor="#FFF9EB">
              <Th color={"#656E84"} fontWeight={600}>
                DATE
              </Th>

              <Th color={"#656E84"} fontWeight={600}>
                TIME
              </Th>
              <Th color={"#656E84"} fontWeight={600} isNumeric>
                AMOUNT
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment, paymentIndex) => {
              return (
                <Tr
                  key={payment._id}
                  backgroundColor={
                    paymentIndex % 2 === 0 ? "#fcfff1" : "#e9e9e9"
                  }
                >
                  <Td>{format(new Date(payment.createDate), "MM/dd/yyyy")}</Td>
                  <Td>{format(new Date(payment.createDate), "HH:mm:ss")}</Td>
                  <Td isNumeric>
                    ${parseFloat(payment.amount / 100).toFixed(2)}
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
