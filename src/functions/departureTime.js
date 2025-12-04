const { app } = require('@azure/functions');
const { getDepartureTime } = require('../lib/helpers/enturGraphQLQueries/getDepartureTime');

app.http('departureTime', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'departureTime/{quayId}/{date}/{line}',
    handler: async (request, context) => {
        const { quayId, date, line } = request.params;
        const departureTimes = await getDepartureTime(quayId, date, line);
        return { status: 200, jsonBody: departureTimes };
    }
});
