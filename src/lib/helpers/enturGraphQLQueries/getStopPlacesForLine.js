const { default: axios } = require("axios")
const { enTur } = require("../../../../config")
const { logger } = require("@vtfk/logger")

/**
 * Helper function to add stopPlaces to a provided line, using the routeId from GTFS data in EnTur stored in MongoDB
 * Data is stored in the stopPlaces collection in MongoDB
 * 
 * @param {string} routeId - The routeId of the line to get stopPlaces for
 * @returns {Promise<Array>} - Returns an array of stopPlace objects associated with the line
 */

const getStopPlacesForLine = async (routeId) => {
    if (!routeId) {
        logger('error', ['enturGraphQLQueries', 'getStopPlacesForLine', 'routeId must be provided'])
        throw new Error('routeId must be provided')
    }
    logger('info', ['enturGraphQLQueries', 'getStopPlacesForLine', `Fetching stopPlaces for line with routeId: ${routeId}`])
    const headers = { 
        'Content-Type': 'application/json',
        'ET-Client-Name': enTur.ETClientName
    }

    /**
     * GraphQL query to fetch stopPlaces for a given line (routeId)
     */

    const graphQLQuery = {
        "query": `{
            line(id: "${routeId}") {
                id
                quays {
                    name
                    stopPlace {
                        id
                        transportMode
                    }
                }
            }
        }`
    }
    // Making the POST request to EnTur GraphQL API
    try {
        logger('info', ['enturGraphQLQueries', 'getStopPlacesForLine', `Making request to EnTur GraphQL API for routeId: ${routeId}`])
        // const response = await axios.post(enTur.journeyPlannerApiUrl, graphQLQuery, { headers })
        const response = await fetch(enTur.journeyPlannerApiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(graphQLQuery)
        })
        const responseData = await response.json()
        logger('info', ['enturGraphQLQueries', 'getStopPlacesForLine', `Received response from EnTur GraphQL API for routeId: ${routeId}`])

        if (responseData.errors) {
            logger('error', ['enturGraphQLQueries', 'getStopPlacesForLine', 'Error in GraphQL response', responseData.errors])
            throw new Error('Error in GraphQL response')
        }
        logger('info', ['enturGraphQLQueries', 'getStopPlacesForLine', `Fetched ${responseData.data.line.quays.length} stopPlaces for line with routeId: ${routeId}`])
        return responseData.data.line.quays
    } catch (error) {
        logger('error', ['enturGraphQLQueries', 'getStopPlacesForLine', 'Error making request to EnTur GraphQL API', error])
        logger('error', ['enturGraphQLQueries', 'getStopPlacesForLine', 'Error fetching stopPlaces from EnTur GraphQL API', error.message])
        throw new Error('Error fetching stopPlaces from EnTur GraphQL API')
    }

}

module.exports = {
    getStopPlacesForLine
}
