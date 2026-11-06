const { app } = require("@azure/functions");
const { logger } = require("@vestfoldfylke/loglady");
const { downloadGTFSFileAndImportLines } = require("../lib/jobs/getLines.js");
const { handleTimer } = require("../middleware/handleTimer.js");

const handleProcessGTFSFileData = async () => {
  logger.info("Starting scheduled function processGTFSFileData");

  const result = await downloadGTFSFileAndImportLines();
  logger.info("Finished scheduled function processGTFSFileData: {@Result}", result);
};

app.timer("processGTFSFileData", {
  schedule: "0 0 4 * * *",
  handler: async (timer, context) => await handleTimer(timer, context, handleProcessGTFSFileData)
});
