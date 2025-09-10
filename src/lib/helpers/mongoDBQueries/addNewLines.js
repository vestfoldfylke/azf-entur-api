const { getMongoClient } = require('../../mongoDB/mongoClient')
const { mongoDB } = require('../../../../config')
const { logger } = require('@vtfk/logger')

/**
 * Helper function to add new lines to MongoDB collection
 * 
 * @param {Array} linesArray - Array of line objects to be added to the collection
 * @returns {Promise<void>}
 */
const addNewLines = async (linesArray) => {
    const mongoClient = await getMongoClient()
    try {
        logger('info', ['mongoDBQueries', 'addNewLines', `Adding ${linesArray.length} new lines to collection ${mongoDB.linesCollection}`])
        await mongoClient.db(mongoDB.dbName).collection(mongoDB.linesCollection).insertMany(linesArray)
    } catch (error) {
        logger('error', ['mongoDBQueries', 'addNewLines', 'Failed to add new lines', error.message])
        throw new Error('Failed to add new lines')
    }
}

module.exports = {
  addNewLines
}
