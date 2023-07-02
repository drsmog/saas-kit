import utils from "#src/services/utils.mjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "#src/pages/api/auth/[...nextauth]";
import path from "path";
const scriptName = path.basename(__filename);

export const apiWrapper = async (
  method,
  req,
  res,
  handler,
  shouldBeAuthorized = false
) => {
  if (req.method === method) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (shouldBeAuthorized) {
        if (!session) {
          const error = new Error("Unauthorized");
          utils.logError(error, ["service-api"], {
            requestQuery: req.query,
            requestBody: req.body,
            url: req.url,
            scriptName,
          });
          res
            .status(401)
            .json({ error: "Unauthorized", internalMessage: error.message });
          return;
        }
      }
      await handler(req, res, session);
    } catch (error) {
      utils.logError(error, ["service-api"], {
        requestQuery: req.query,
        requestBody: req.body,
        url: req.url,
        scriptName,
      });

      res
        .status(500)
        .json({ error: "API Error", internalMessage: error.message });
    }
  } else {
    utils.logError(new Error("Method Not Allowed"), ["service-api"], {
      requestQuery: req.query,
      requestBody: req.body,
      requestUrl: req.url,
      requestMethod: req.method,
    });
    res.setHeader("Allow", method);
    res.status(405).end("Method Not Allowed");
  }
};
