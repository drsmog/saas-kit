import { Button, Flex } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export const NotAuthenticatedFallbackView = () => {
  const handleSignIn = (e) => {
    e.preventDefault();
    signIn("google", {
      callbackUrl: "/",
    });
  };
  return (
    <Flex
      backgroundColor="#FEFEFE"
      backgroundSize={"cover"}
      minW={"100vw"}
      minH={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Button colorScheme="orange" onClick={handleSignIn}>
        G - SignUp With Google
      </Button>
    </Flex>
  );
};
