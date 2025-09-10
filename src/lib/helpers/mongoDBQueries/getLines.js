const { getMongoClient } = require('../../mongoDB/mongoClient')
const { mongoDB } = require('../../../../config')
const { logger } = require('@vtfk/logger')

/**
 * Get all lines from MongoDB. With optional filtering by routeType.
 * 
 * @param {string} [routeType] - Optional routeType to filter lines by (e.g., '1015', '704', etc.) | (Any filter you want to apply to the routeType field in the lines collection)
 * @returns {Promise<Array>} - Returns an array of line objects
*/
const getLines = async (routeTypeFilter) => {
    const mongoClient = await getMongoClient()
    try {
        logger('info', ['mongoDBQueries', 'getLines', `Fetching lines from collection ${mongoDB.linesCollection}`])
        const query = routeTypeFilter ? { routeType: routeTypeFilter } : {} // use filter or return all lines
        const lines = await mongoClient.db(mongoDB.dbName).collection(mongoDB.linesCollection).find(query).toArray()
        return lines
    } catch (error) {
        logger('error', ['mongoDBQueries', 'getLines', 'Failed to fetch lines', error.message])
        throw new Error('Failed to fetch lines')
    }
}

module.exports = {
    getLines
}