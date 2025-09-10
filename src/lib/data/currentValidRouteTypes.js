const { prettifyRouteType } = require('../helpers/lib/prettyRouteType')
const { getLines } = require('../helpers/mongoDBQueries/getLines')
const { routeTypesTemplate } = require('./routeTypeTemplate')
const { logger } = require('@vtfk/logger')

/**
 * Fetches the valid route types from the routeTypeTemplate.js file
 * and checks them agains the route types saved in the lines collection in MongoDB
 * 
 * Returns an array of route type objects that are both in the template and in use in the lines collection
 * @returns {Promise<Array>} - Returns an array of valid route type objects ['Buss', 'Tog', etc.]
 */
const getCurrentValidRouteTypes = async () => {
    try {
        const lines = await getLines()
        const routeTypesInUse = [...new Set(lines.map(line => line.routeType))] // Get unique route types from lines
        let validRouteTypes = routeTypesTemplate.filter(rt => routeTypesInUse.includes(rt.gtfsRouteTypeCode.toString()))
        // Get unique netexModes from validRouteTypes
        validRouteTypes = [...new Set(validRouteTypes.map(rt => rt.netexMode))].map(netexMode => {
            return validRouteTypes.find(rt => rt.netexMode === netexMode)
        })
        validRouteTypes = prettifyRouteType(validRouteTypes) // Add a pretty route name that can be used in the frontend
        logger('info', ['currentValidRouteTypes', 'getCurrentValidRouteTypes', `Found ${validRouteTypes.length} valid route types in use`])
        return validRouteTypes
    } catch (error) {
        logger('error', ['currentValidRouteTypes', 'getCurrentValidRouteTypes', 'Failed to get current valid route types', error.message])
        throw new Error('Failed to get current valid route types')
    }
}
module.exports = {
    getCurrentValidRouteTypes
}

