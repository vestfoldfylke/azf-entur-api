const { enTur, mongoDB } = require("../../../config.js");
const { logger } = require("@vestfoldfylke/loglady");
const AdmZip = require("adm-zip");
const { addNewLines } = require("../helpers/mongoDBQueries/addNewLines.js");
const { deleteAllEntries } = require("../helpers/mongoDBQueries/deleteAllEntires.js");

/**
 * Get the GTFS file from EnTur and store it in MongoDB
 * The GTFS file is a zip file containing several text files, we are interested in routes.txt
 *
 * @returns {Promise<void>}
 */

const downloadGTFSFileAndImportLines = async () => {
  const linesObjects = [];

  try {
    const response = await fetch(enTur.gtfsUrl);
    if (!response.ok) {
      throw new Error(`GTFS download responded with ${response.status} ${response.statusText}`);
    }

    const zip = new AdmZip(Buffer.from(await response.arrayBuffer()));
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      if (entry.entryName === "routes.txt") {
        const csvData = entry.getData().toString("utf8");

        // Skip headers
        csvData
          .split("\n")
          .slice(1)
          .forEach((line) => {
            const columns = line.split(",");
            if (columns.length >= 4) {
              const routeId = columns[1];
              const routeShortName = columns[2];
              const routeLongName = columns[3];
              const routeType = columns[4];

              linesObjects.push({
                routeId,
                routeShortName,
                routeLongName,
                routeType
              });
            }
          });
      }
    }
  } catch (error) {
    logger.errorException(error, "Failed to download or process GTFS file from {GtfsUrl}", enTur.gtfsUrl);
    throw new Error("Failed to download or process GTFS file");
  }

  if (linesObjects.length === 0) {
    logger.error("No lines found in routes.txt in GTFS file from {GtfsUrl}", enTur.gtfsUrl);
    throw new Error("No lines found in GTFS file, something went wrong");
  }

  // Delete all existing lines and add the new ones
  await deleteAllEntries(mongoDB.linesCollection);

  // Add new lines to MongoDB
  await addNewLines(linesObjects);

  return { message: `Successfully imported ${linesObjects.length} lines from GTFS file` };
};

module.exports = {
  downloadGTFSFileAndImportLines
};
