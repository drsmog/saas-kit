import fs from "fs";
import superJson from "superjson";
import loggly from "node-loggly-bulk";
const { createClient } = loggly;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const client = createClient({
  subdomain: process.env.LOGGLY_SUBDOMAIN,
  token: process.env.LOGGLY_TOKEN,
  json: true,
});

const logError = (error, tags, meta) => {
  console.log("\n\n");
  console.log("\x1b[31m", "ERROR --------");
  console.log("MESSAGE:", error.message);
  console.log("ENV:", process.env.NODE_ENV);
  console.log("TAGS:", tags);
  console.log("META:", meta);
  console.log("\n\n");
  console.log(error);
  console.log("END ERROR --------", "\x1b[0m");
  client.log(
    {
      level: "error",
      message: error.message,
      stack: error.stack,
      meta,
      timestamp: new Date(),
      env: process.env.NODE_ENV,
    },
    [process.env.NODE_ENV, ...tags],
    function (err, result) {
      if (result && result.response == "ok") {
        console.log("Error Log message sent successfully");
      } else {
        console.error("ERROR SENDING LOGS", err);
      }
    }
  );
};

const logInfo = (message, tags, meta) => {
  console.log("\n\n");
  console.log("\x1b[33m", "INFO --------");
  console.log("MESSAGE:", message);
  console.log("ENV:", process.env.NODE_ENV);
  console.log("TAGS:", tags);
  console.log("META:", meta);
  console.log("\n\n");
  console.log("END INFO --------", "\x1b[0m");
  client.log(
    {
      level: "info",
      message: message,
      meta,
      timestamp: new Date(),
      env: process.env.NODE_ENV,
    },
    [process.env.NODE_ENV, ...tags],
    function (err, result) {
      if (result && result.response == "ok") {
        console.log("Info Log message sent successfully");
      } else {
        console.error("ERROR SENDING LOGS", err);
      }
    }
  );
};

const fixJsonData = (data) => {
  const stringData = superJson.stringify(data);
  return superJson.parse(stringData);
};

const downloadFile = async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const exports = {
  downloadFile,
  fixJsonData,
  logError,
  logInfo,
  sleep,
};
export default exports;
