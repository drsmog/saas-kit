import { Box } from "@chakra-ui/react";
import Head from "next/head";
import utils from "#src/services/utils.mjs";
import registeredUserService from "#src/services/registeredUser.mjs";
import { getSession } from "next-auth/react";
import LandingPageView from "#src/pageviews/LandingPage";

export function LandingPage({ data, error }) {
  return (
    <>
      <Head>
        <title>Start Kit</title>
      </Head>
      <Box w="100%">
        {error && <Box>Something went wrong: {error}</Box>}
        {!error && <LandingPageView serverData={data} />}
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    let registeredUser;
    if (session) {
      registeredUser = await registeredUserService.getRegisteredUserByEmail(
        session.user.email
      );
    }
    return {
      props: {
        data: { registeredUser },
      },
    };
  } catch (error) {
    utils.logError(error, ["getServerSideProps", "LandingPage"], {
      contextQuery: context?.query,
    });
    return { props: { error: error.message } };
  }
}
export default LandingPage;
