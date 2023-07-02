import { apiWrapper } from "#src/services/apiWrapper.mjs";

const handler = async (req, res, session) => {
  res.status(200).json({
    data: { test: "Test" },
  });
};
const wrappedHandler = (req, res) => apiWrapper("GET", req, res, handler, true);
export default wrappedHandler;
