const { app } = require('@azure/functions');

app.http('stopPlaces', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'stopPlaces/{routeId}',
    handler: async (request, context) => {
        const { getStopPlacesForLine } = require('../lib/helpers/enturGraphQLQueries/getStopPlacesForLine');
        // Returns the stopPlaces for a given line (routeId) from EnTur GraphQL API
        if (!request.params.routeId) {
            return { status: 400, jsonBody: { error: 'routeId parameter is required' } };
        }
        const stopPlaces = await getStopPlacesForLine(request.params.routeId);

        return { status: 200, jsonBody: { stopPlaces } };
    }
});
