import utils from "#src/services/utils.mjs";
import { getSession } from "next-auth/react";
import { AuthenticationError } from "#src/shared/error/AuthenticationError";

export const withNextServerSideAdapter = async (
  context,
  serverSideFunction,
  shouldBeAuthenticated = false,
  allowedUserEmails = []
) => {
  try {
    const session = await getSession({ req: context.req });
    if (shouldBeAuthenticated && !session) {
      throw new AuthenticationError(
        "Not Authneticated or Authorised to access this resources"
      );
    }
    if (allowedUserEmails.length > 0 && !session) {
      throw new AuthenticationError(
        "Not Authneticated or Authorised to access this resources"
      );
    }
    if (
      allowedUserEmails.length > 0 &&
      !allowedUserEmails.includes(session.user.email)
    ) {
      throw new AuthenticationError(
        "Not Authneticated or Authorised to access this resources"
      );
    }
    return {
      props: {
        data: await serverSideFunction(context, session),
      },
    };
  } catch (error) {
    utils.logError(error, ["getServerSideProps"], {
      contextQuery: context?.query,
      url: `${context.req.headers.host}${context.req.url}`,
    });
    return {
      props: {
        error: {
          message: error.message,
          code: error.code || "500",
        },
      },
    };
  }
};
