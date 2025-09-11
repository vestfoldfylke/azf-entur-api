const { app } = require('@azure/functions');
const { getCurrentValidRouteTypes } = require('../lib/data/currentValidRouteTypes');
const { logger } = require('@vtfk/logger');

app.http('routeTypes', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {
        // Returns the route types found in the GTFS data from EnTur
        const routeTypes = await getCurrentValidRouteTypes()

        return { status: 200, jsonBody: routeTypes }
    }
});
