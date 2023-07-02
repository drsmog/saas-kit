import dynamic from "next/dynamic";
import React from "react";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import registeredUserService from "#src/services/registeredUser.mjs";
import paymentsService from "#src/services/payments.mjs";
import { NotAuthenticatedFallbackView } from "#src/shared/components/NotAuthenticatedFallbackView";
import { withNextServerSideAdapter } from "#src/services/withNextServerSideAdapter";

const BillingPageView = dynamic(async () => import("#src/pageviews/billing"), {
  ssr: false,
});

export function BillingPage({ data, error, hostData }) {
  return (
    <>
      <Head>
        <title>SAAS start kit : Billing</title>
      </Head>
      <Box w="100%">
        {error && error.code === "401" && <NotAuthenticatedFallbackView />}
        {error && error.code === "500" && (
          <Box>Something Went wrong: {error.message}</Box>
        )}

        {!error && <BillingPageView serverData={data} />}
      </Box>
    </>
  );
}

const serverSideHandler = async (context, session) => {
  if (!session) {
    throw Error("user is not authenticated");
  }
  const registeredUser = await registeredUserService.getRegisteredUserByEmail(
    session.user.email
  );
  if (!registeredUser) {
    throw Error("Cant find registered user");
  }

  const payments = await paymentsService.fetchPaymentsOfRegisteredUser(
    registeredUser._id
  );

  return {
    payments,
    registeredUser,
  };
};

export const getServerSideProps = (context) =>
  withNextServerSideAdapter(context, serverSideHandler, true);

export default BillingPage;
