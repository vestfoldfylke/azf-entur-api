const { MongoClient } = require("mongodb");
const { mongoDB } = require("../../../config.js");
const { logger } = require("@vestfoldfylke/loglady");

let client = null;

/**
 *
 * @returns { import('mongodb').MongoClient }
 */
const getMongoClient = async () => {
  if (!client) {
    logger.info("MongoClient does not exist - creating");
    client = new MongoClient(mongoDB.connectionString);
    logger.info("MongoClient created");
  }

  return client;
};

const closeMongoClient = () => {
  if (client) {
    client.close();
  }

  client = null;
};

module.exports = {
  getMongoClient,
  closeMongoClient
};
