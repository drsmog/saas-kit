import utils from "#src/services/utils.mjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { level, message, stack, tags, meta } = req.body;
      if (level === "info") {
        utils.logInfo(message, tags, meta);
      }
      if (level === "error") {
        const newError = new Error(message);
        newError.stack = stack;
        utils.logError(newError, ["frontend", ...tags], meta);
      }

      res.status(200).json({
        data: {
          done: "ok",
        },
      });
    } catch (error) {
      utils.logError(error, ["service-api", "log"], {
        requestQuery: req.query,
        requestBody: req.body,
        url: req.url,
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
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
