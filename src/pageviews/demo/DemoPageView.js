import { Box, Button, Container } from "@chakra-ui/react";
import useErrorHandler from "#src/shared/error/useErrorHandler";
import { useApi } from "#src/shared/hooks/useApi";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

export default function DemoPageView({ serverData }) {
  const dispatch = useDispatch();
  const { selectedTodo, todos } = useSelector((state) => state.layout);
  const { data: session } = useSession();
  const api = useApi();
  const errorHandler = useErrorHandler();

  const handleClick = () => {
    try {
      console.log(serverData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleAPIClick = async () => {
    try {
      const data = await api.call("GET", "/api/test");
      console.log("data", data);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <Box
      backgroundColor="#FEFEFE"
      backgroundSize={"auto"}
      minW={"100vw"}
      minH={"100vh"}
      pb="140px"
    >
      <Container maxW={"1110px"}>
        Demo page content - {serverData.test}
        <Button onClick={handleClick}>Click</Button>
        <Button onClick={handleAPIClick}>API</Button>
      </Container>
    </Box>
  );
}
