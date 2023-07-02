import path from "path";
import { fileURLToPath } from "url";
import { scheduleJob } from "node-schedule";

import repository, { COLLECTIONS } from "#src/services/repository.mjs";
import utils from "#src/services/utils.mjs";
const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const executeOperation = async (test) => {
  try {
    console.log("\x1b[33m", "Operation", test, "\x1b[0m");
    //TODO do something about this item
  } catch (error) {
    utils.logError(error, ["job", scriptName]);
  }
};

const jobHandler = scheduleJob("*/5 * * * * *", async function (fireDate) {
  try {
    console.log("\x1b[33m", "# Job Triggered", scriptName, "\x1b[0m");
    const test = await repository.findOneDoc(COLLECTIONS.TEST, {
      status: "queued",
    });
    if (!test) {
      console.log("\x1b[33m", "no test in queue", "\x1b[0m");
      return;
    }
    console.log("\x1b[33m", "found", test, "\x1b[0m");
    await executeOperation(todo);
  } catch (error) {
    utils.logError(error, ["job", scriptName]);
  }
});

[
  "SIGHUP",
  "SIGINT",
  "SIGQUIT",
  "SIGILL",
  "SIGTRAP",
  "SIGABRT",
  "SIGBUS",
  "SIGFPE",
  "SIGUSR1",
].forEach((element) => {
  process.on(element, () => {
    console.log(`\r\n\r\n"Kill signal received.", ${new Date()} \r\n`);
    console.info("Kill signal received.");
    console.log("Canceling jobber.", scriptName);
    jobHandler.cancel();
    process.exit(0);
  });
});
