const { enTur } = require("../../../../config.js");
const { logger } = require("@vestfoldfylke/loglady");

/**
 * Helper function to add stopPlaces to a provided line, using the routeId from GTFS data in EnTur stored in MongoDB
 * Data is stored in the stopPlaces collection in MongoDB
 *
 * @param {string} routeId - The routeId of the line to get stopPlaces for
 * @returns {Promise<Array>} - Returns an array of stopPlace objects associated with the line
 */

const getStopPlacesForLine = async (routeId) => {
  if (!routeId) {
    logger.error("routeId must be provided");
    throw new Error("routeId must be provided");
  }

  logger.info("Fetching stopPlaces for line with RouteId {RouteId}", routeId);

  const headers = {
    "Content-Type": "application/json",
    "ET-Client-Name": enTur.ETClientName
  };

  /**
   * GraphQL query to fetch stopPlaces for a given line (routeId)
   */
  const graphQLQuery = {
    query: `{
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
  };

  // Making the POST request to EnTur GraphQL API
  try {
    logger.info("Making request to EnTur GraphQL API for RouteId {RouteId}", routeId);

    const response = await fetch(enTur.journeyPlannerApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(graphQLQuery)
    });
    if (!response.ok) {
      throw new Error(`EnTur GraphQL API responded with ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    if (responseData.errors) {
      logger.error("Error in GraphQL response for RouteId {RouteId}: {@Errors}", routeId, responseData.errors);
      throw new Error("Error in GraphQL response");
    }

    logger.info("Fetched {StopPlaceCount} stopPlaces for line with RouteId {RouteId}", responseData.data.line.quays.length, routeId);

    return responseData.data.line.quays;
  } catch (error) {
    logger.errorException(error, "Error fetching stopPlaces from EnTur GraphQL API for RouteId {RouteId}", routeId);
    throw new Error("Error fetching stopPlaces from EnTur GraphQL API");
  }
};

module.exports = {
  getStopPlacesForLine
};
