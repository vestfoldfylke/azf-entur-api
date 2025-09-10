const { app } = require('@azure/functions');
const { getLines } = require('../lib/helpers/mongoDBQueries/getLines');
const { routeTypesTemplate } = require('../lib/data/routeTypeTemplate');


app.http('lines', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'lines/{netexMode?}',
    handler: async (request, context) => {
        // Returnes the lines found with the filter provided in the query string, or all lines if no filter is provided
        const netexMode = request.params.netexMode || null;
        // If netexMode is provided, we filter the lines by routeType. Find the routeType codes for each netexMode in routeTypeTemplate.js
        const routeTypeCodes = routeTypesTemplate.filter(rt => rt.netexMode === netexMode).map(rt => rt.gtfsRouteTypeCode);
        const routeTypes = routeTypeCodes.length > 0 ? { routeTypeCodes } : null;

        // If no netexMode is provided, we return all lines
        if(!netexMode) {
            const allLines = await getLines();
            return { status: 200, jsonBody: allLines };
        }
        // If netexMode is provided, but no matching routeTypes are found, we return all lines
        if(!routeTypes) {
            const allLines = await getLines();
            return { status: 200, jsonBody: allLines };
        }

        // If routeTypes are found, we fetch lines matching any of the routeType codes
        const lines = []
        for(const routeTypeCode of routeTypes.routeTypeCodes) {
            const linesForRouteType = await getLines(routeTypeCode.toString())
            lines.push(...linesForRouteType);
        }

        return { status: 200, jsonBody: lines };
    }
});
