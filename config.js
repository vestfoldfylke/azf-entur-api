module.exports = {
    mongoDB: {
        dbName: process.env.MONGODB_DB_NAME,
        connectionString: process.env.MONGODB_CONNECTION_STRING,
        linesCollection: process.env.MONGODB_LINES_COLLECTION,
    },
    enTur: {
        ETClientName: process.env.ET_CLIENT_NAME,
        gtfsUrl: process.env.GTFS_URL,
        journeyPlannerApiUrl: process.env.EN_TUR_JOURNEY_PLANNER_API_URL
    }
}