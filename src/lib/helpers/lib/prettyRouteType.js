/**
 * Adds a pretty name to the returned routetype objects in the routeTypes array. 
 * E.g. 'Buss' instead of 'bus' or 'Ferje' instead of 'water'
 * 
 * @param {Array} routeTypes - Array of route type objects to prettify
 * @returns {Array} - Returns an array of route type objects with pretty names added
 * 
 */

const prettifyRouteType = (routeTypes) => {
    return routeTypes.map(rt => {
        let prettyName = rt.netexMode; // Default to netexMode if no match found
        switch (rt.netexMode) {
            case 'bus':
                prettyName = 'Buss';
                break;
            case 'air':
                prettyName = 'Fly';
                break;
            case 'cableway':
                prettyName = 'Kabelbane';
                break;
            case 'coach':
                prettyName = 'Buss';
                break;
            case 'ferry':
                prettyName = 'Ferje';
                break;
            case 'funicular':
                prettyName = 'Kabelbane';
                break;
            case 'metro':
                prettyName = 'T-bane';
                break;
            case 'rail':
                prettyName = 'Tog';
                break;
            case 'tram':
                prettyName = 'Trikk';
                break;
            case 'trolleyBus':
                prettyName = 'Buss';
                break;
            case 'water':
                prettyName = 'Ferje';
                break;
            case 'lift':
                prettyName = 'Heis';
                break;
        }
        return { ...rt, prettyName };
    });
}
module.exports = {
    prettifyRouteType
}
