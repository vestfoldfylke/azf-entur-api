const { getMongoClient } = require("../../mongoDB/mongoClient.js");
const { mongoDB } = require("../../../../config.js");
const { logger } = require("@vestfoldfylke/loglady");

/**
 * Helper function to add new lines to MongoDB collection
 *
 * @param {Array} linesArray - Array of line objects to be added to the collection
 * @returns {Promise<void>}
 */
const addNewLines = async (linesArray) => {
  const mongoClient = await getMongoClient();

  try {
    logger.info("Adding {LineCount} new lines to collection {Collection}", linesArray.length, mongoDB.linesCollection);
    await mongoClient.db(mongoDB.dbName).collection(mongoDB.linesCollection).insertMany(linesArray);
  } catch (error) {
    logger.errorException(error, "Failed to add new lines to collection {Collection}", mongoDB.linesCollection);
    throw new Error("Failed to add new lines");
  }
};

module.exports = {
  addNewLines
};
