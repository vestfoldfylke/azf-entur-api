const { default: axios } = require("axios")
const { enTur } = require("../../../../config")
const { logger } = require("@vtfk/logger")

const convertToTimeOnly = (isoString) => {
    const date = new Date(isoString);
    return date.toTimeString().split("T")[0].split(" ")[0] // Returns "HH:MM:SS"
}

/**
 * Helper function to get departure times from a given quayId, date and line using EnTur GraphQL API
 *
 * @param {string} quayId - The quayId to get departure times for. Example: "NSR:StopPlace:19984"
 * @param {string} date - The date and time to get departure times from. Example: "2025-12-02T00:00:000.000Z"
 * @param {string} line - The line to filter departure times for. Example: "TEL:Line:8046"
 * @returns {Promise<Array>} - Returns an array of departure time objects
 */

const getDepartureTime = async (quayId, date, line) => {
    if (!quayId || !date || !line) {
        logger('error', ['enturGraphQLQueries', 'getDepartureTime', 'quayId, date and line must be provided'])
        throw new Error('quayId, date and line must be provided')
    }

    // Validate date format "2025-12-02T00:00:000.000Z"
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{3}\.\d{3}Z$/
    if (!dateRegex.test(date)) {
        // Try to convert to ISO 8601
        logger('warn', ['enturGraphQLQueries', 'getDepartureTime', 'Date format is not ISO 8601, attempting to convert'])
        const isoDate = new Date(date).toISOString();
        if (isNaN(Date.parse(isoDate))) {
            logger('error', ['enturGraphQLQueries', 'getDepartureTime', 'Invalid date format. Must be ISO 8601'])
            throw new Error('Invalid date format. Must be ISO 8601')
        }
        date = isoDate;
    }

    logger('info', ['enturGraphQLQueries', 'getDepartureTime', `Fetching departure time for quayId: ${quayId}, date: ${date}, line: ${line}`])
    const headers = { 
        'Content-Type': 'application/json',
        'ET-Client-Name': enTur.ETClientName
    }

    /**
     * GraphQL query to fetch departure times for a given quayId, date and line
    */
    const graphQLQuery = {
        query: `{
            stopPlace(id: "${quayId}") {
                name
                estimatedCalls(
                    arrivalDeparture: departures
                    startTime: "${date}"
                    whiteListed: {lines: "${line}"}
                    numberOfDepartures: 100
                    includeCancelledTrips: true
                ) 
                {
                    expectedDepartureTime
                }
            }
        }`
    }
    // Making the POST request to EnTur GraphQL API
    try {
        logger('info', ['enturGraphQLQueries', 'getDepartureTime', `Making request to EnTur GraphQL API for quayId: ${quayId}, date: ${date}, line: ${line}`])
        const response = await axios.post(enTur.journeyPlannerApiUrl, graphQLQuery, { headers })
        if (response.data.errors) {
            logger('error', ['enturGraphQLQueries', 'getDepartureTime', 'Error in GraphQL response', response.data.errors])
            throw new Error('Error in GraphQL response')
        }
        logger('info', ['enturGraphQLQueries', 'getDepartureTime', `Fetched ${response.data.data.stopPlace.estimatedCalls.length} departure times for quayId: ${quayId}, date: ${date}, line: ${line}`])
        const departureTimes = response.data.data.stopPlace.estimatedCalls.map(call => ({
            expectedDepartureTime: convertToTimeOnly(call.expectedDepartureTime)
        }))
        return departureTimes
    } catch (error) {
        logger('error', ['enturGraphQLQueries', 'getDepartureTime', 'Error making request to EnTur GraphQL API', error])
        throw new Error('Error fetching departure times from EnTur GraphQL API')
    }
}

module.exports = {
    getDepartureTime
}