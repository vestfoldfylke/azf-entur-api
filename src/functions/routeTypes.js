const { app } = require("@azure/functions");
const { getCurrentValidRouteTypes } = require("../lib/data/currentValidRouteTypes.js");
const { handleTrigger } = require("../middleware/handleTrigger.js");

const handleRouteTypes = async () => {
  // Returns the route types found in the GTFS data from EnTur
  const routeTypes = await getCurrentValidRouteTypes();

  return {
    status: 200,
    jsonBody: routeTypes
  };
};

app.http("routeTypes", {
  methods: ["GET"],
  authLevel: "function",
  handler: async (request, context) => await handleTrigger(request, context, handleRouteTypes)
});
