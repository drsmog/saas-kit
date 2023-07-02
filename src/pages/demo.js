import { Box } from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import registeredUserService from "#src/services/registeredUser.mjs";
import { NotAuthenticatedFallbackView } from "#src/shared/components/NotAuthenticatedFallbackView";
import { withNextServerSideAdapter } from "#src/services/withNextServerSideAdapter";

const DemoPageView = dynamic(async () => import("#src/pageviews/demo"), {
  ssr: false,
});

export function DemoPage({ data, error }) {
  return (
    <>
      <Head>
        <title>Start Kit: Demo</title>
      </Head>
      <Box w="100%">
        {error && error.code === "401" && <NotAuthenticatedFallbackView />}
        {error && error.code === "500" && (
          <Box>Something Went wrong: {error.message}</Box>
        )}

        {!error && <DemoPageView serverData={data} />}
      </Box>
    </>
  );
}

const serverSideHandler = async (context, session) => {
  let registeredUser;
  if (session) {
    registeredUser = await registeredUserService.getRegisteredUserByEmail(
      session.user.email
    );
  }
  return {
    registeredUser,
    test: "test data",
  };
};

export const getServerSideProps = (context) =>
  withNextServerSideAdapter(context, serverSideHandler);

export default DemoPage;
