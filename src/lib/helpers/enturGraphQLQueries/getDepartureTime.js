const { enTur } = require("../../../../config.js");
const { logger } = require("@vestfoldfylke/loglady");

const convertToTimeOnly = (isoString) => {
  const date = new Date(isoString);
  return date.toTimeString().split("T")[0].split(" ")[0]; // Returns "HH:MM:SS"
};

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
    logger.error("quayId, date and line must be provided");
    throw new Error("quayId, date and line must be provided");
  }

  // Validate date format "2025-12-02T00:00:000.000Z"
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{3}\.\d{3}Z$/;

  if (!dateRegex.test(date)) {
    // Try to convert to ISO 8601
    logger.warn("Date {Date} is not ISO 8601, attempting to convert", date);

    const isoDate = new Date(date).toISOString();
    if (Number.isNaN(Date.parse(isoDate))) {
      logger.error("Invalid date format for {Date}. Must be ISO 8601", date);
      throw new Error("Invalid date format. Must be ISO 8601");
    }

    date = isoDate;
  }

  logger.info("Fetching departure time for QuayId {QuayId}, Date {Date}, Line {Line}", quayId, date, line);

  const headers = {
    "Content-Type": "application/json",
    "ET-Client-Name": enTur.ETClientName
  };

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
  };

  // Making the POST request to EnTur GraphQL API
  try {
    logger.info("Making request to EnTur GraphQL API for QuayId {QuayId}, Date {Date}, Line {Line}", quayId, date, line);

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
      logger.error("Error in GraphQL response for QuayId {QuayId}, Date {Date}, Line {Line}: {@Errors}", quayId, date, line, responseData.errors);
      throw new Error("Error in GraphQL response");
    }

    logger.info("Fetched {DepartureCount} departure times for QuayId {QuayId}, Date {Date}, Line {Line}", responseData.data.stopPlace.estimatedCalls.length, quayId, date, line);
    const departureTimes = responseData.data.stopPlace.estimatedCalls.map((call) => ({
      expectedDepartureTime: convertToTimeOnly(call.expectedDepartureTime)
    }));

    return departureTimes;
  } catch (error) {
    logger.errorException(error, "Error fetching departure times from EnTur GraphQL API for QuayId {QuayId}, Date {Date}, Line {Line}", quayId, date, line);
    throw new Error("Error fetching departure times from EnTur GraphQL API");
  }
};

module.exports = {
  getDepartureTime
};
