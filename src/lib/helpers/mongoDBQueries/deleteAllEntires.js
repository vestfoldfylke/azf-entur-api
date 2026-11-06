const { getMongoClient } = require("../../mongoDB/mongoClient.js");
const { mongoDB } = require("../../../../config.js");
const { logger } = require("@vestfoldfylke/loglady");

/**
 * Helper function to delete all entries from a specified MongoDB collection
 * @param {string} collection - The name of the collection from which to delete all entries [e.g., 'lines', 'stopPlaces']
 * @returns {Promise<void>}
 */
const deleteAllEntries = async (collection) => {
  if (!collection) {
    throw new Error("Collection name must be provided");
  }

  const mongoClient = await getMongoClient();

  try {
    logger.info("Deleting all entries from collection {Collection}", collection);
    await mongoClient.db(mongoDB.dbName).collection(collection).deleteMany({});
  } catch (error) {
    logger.errorException(error, "Failed to delete entries from collection {Collection}", collection);
    throw new Error("Failed to delete entries");
  }
};

module.exports = {
  deleteAllEntries
};
