const { prettifyRouteType } = require("../helpers/lib/prettyRouteType.js");
const { getLines } = require("../helpers/mongoDBQueries/getLines.js");
const { routeTypesTemplate } = require("./routeTypeTemplate.js");
const { logger } = require("@vestfoldfylke/loglady");

/**
 * Fetches the valid route types from the routeTypeTemplate.js file
 * and checks them agains the route types saved in the lines collection in MongoDB
 *
 * Returns an array of route type objects that are both in the template and in use in the lines collection
 * @returns {Promise<Array>} - Returns an array of valid route type objects ['Buss', 'Tog', etc.]
 */
const getCurrentValidRouteTypes = async () => {
  try {
    const lines = await getLines();

    const routeTypesInUse = [...new Set(lines.map((line) => line.routeType))]; // Get unique route types from lines
    let validRouteTypes = routeTypesTemplate.filter((rt) => routeTypesInUse.includes(rt.gtfsRouteTypeCode.toString()));
    // Get unique netexModes from validRouteTypes
    validRouteTypes = [...new Set(validRouteTypes.map((rt) => rt.netexMode))].map((netexMode) => {
      return validRouteTypes.find((rt) => rt.netexMode === netexMode);
    });
    validRouteTypes = prettifyRouteType(validRouteTypes); // Add a pretty route name that can be used in the frontend
    logger.info("Found {RouteTypeCount} valid route types in use", validRouteTypes.length);

    return validRouteTypes;
  } catch (error) {
    logger.errorException(error, "Failed to get current valid route types");
    throw new Error("Failed to get current valid route types");
  }
};

module.exports = {
  getCurrentValidRouteTypes
};
