const { getMongoClient } = require('../../mongoDB/mongoClient')
const { mongoDB } = require('../../../../config')
const { logger } = require('@vtfk/logger')

/**
 * Helper function to delete all entries from a specified MongoDB collection
 * @param {string} collection - The name of the collection from which to delete all entries [e.g., 'lines', 'stopPlaces']
 * @returns {Promise<void>}
 */
const deleteAllEntries = async (collection) => {
    if(!collection) {
        throw new Error('Collection name must be provided')
    }

    const mongoClient = await getMongoClient()
    try {
        logger('info', ['mongoDBQueries', 'deleteAllEntries', `Deleting all entries from collection ${collection}`])
        await mongoClient.db(mongoDB.dbName).collection(collection).deleteMany({})
    } catch (error) {
        logger('error', ['mongoDBQueries', 'deleteAllEntries', 'Failed to delete entries', error.message])
        throw new Error('Failed to delete entries')
    }
}

module.exports = {
    deleteAllEntries
}