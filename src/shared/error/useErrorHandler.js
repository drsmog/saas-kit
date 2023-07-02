import { useToast } from "@chakra-ui/react";

const useErrorHandler = () => {
  const toast = useToast();
  const handler = async (error, tags = [], meta = {}, showToast = true) => {
    try {
      console.error(error);
      console.log(tags, meta);

      const headers = { "Content-Type": "application/json" };

      await fetch("/api/log", {
        body: JSON.stringify({
          level: "error",
          message: error.message,
          stack: error.stack,
          tags,
          meta: {
            ...meta,
            href: window?.location?.href,
          },
        }),
        headers,
        method: "post",
      });
      if (showToast) {
        toast({
          title: "Oops! something went wrong",
          description: error.message,
          position: "bottom-right",
          isClosable: true,
          variant: "solid",
          status: "error",
        });
      }
    } catch (error) {
      console.log("LOGGER ERROR", error);
    }
  };
  return handler;
};

export default useErrorHandler;
