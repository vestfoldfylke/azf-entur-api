# Azure Functions EnTur API Wrapper for Telemark County

A serverless Azure Functions application that provides an API for Norwegian public transport data using EnTur's GTFS (General Transit Feed Specification) data. 

## 🚀 Overview

This application fetches and processes public transport data from EnTur (Norway's national journey planner) and provides RESTful API endpoints to access route types, lines, and stop places information. The data is stored in MongoDB and automatically updated daily.

## 📋 Features

- **Route Types API**: Get available route types from GTFS data
- **Lines API**: Retrieve transport lines, optionally filtered by transport mode
- **Stop Places API**: Get stop places for specific routes
- **Automatic Data Updates**: Daily GTFS data processing via timer function
- **MongoDB Integration**: Persistent storage for transport data
- **EnTur GraphQL Integration**: Real-time stop places data

## 🏗️ Architecture

### Azure Functions

- **routeTypes** - HTTP trigger for route types data
- **lines** - HTTP trigger for transport lines (with optional filtering)
- **stopPlaces** - HTTP trigger for stop places by route ID
- **processGTFSFileData** - Timer trigger for daily data updates (04:00 UTC)

### Data Sources

- **EnTur GTFS**: Static transport data (routes, route types)
- **EnTur GraphQL API**: Real-time stop places information

### Storage

- **MongoDB**: Persistent storage for lines and stop places data

## 🔧 API Endpoints

### Get Route Types
```
GET /api/routeTypes
```
Returns available route types from the GTFS data.

### Get Lines
```
GET /api/lines
GET /api/lines/{netexMode}
```

Parameters:
- `netexMode` (optional): Filter by transport mode (e.g., `bus`, `rail`, `ferry`, `metro`)

### Get Stop Places
```
GET /api/stopPlaces/{routeId}
```

Parameters:
- `routeId` (required): The route identifier (e.g., `TEL:Line:8011`)

## 🛠️ Setup and Installation

### Prerequisites

- Node.js 18.x or later
- Azure Functions Core Tools
- MongoDB instance
- Azure subscription (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd azf-entur-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   GTFS_URL for entire Norway or your prefferd provider of public transport can be found here:
   [EnTur Stops and timetable data](https://developer.entur.org/stops-and-timetable-data)

   Create a `local.settings.json` file:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "MONGODB_DB_NAME": "your-database-name",
       "MONGODB_CONNECTION_STRING": "your-mongodb-connection-string",
       "MONGODB_LINES_COLLECTION": "lines",
       "ET_CLIENT_NAME": "your-client-name",
       "GTFS_URL": "https://storage.googleapis.com/marduk-production/outbound/gtfs/rb_nsb-aggregated-gtfs.zip",
       "EN_TUR_JOURNEY_PLANNER_API_URL": "https://api.entur.io/journey-planner/v3/graphql"
     }
   }
   ```

4. **Start the development server**
   ```bash
   func start
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_DB_NAME` | MongoDB database name | Yes |
| `MONGODB_CONNECTION_STRING` | MongoDB connection string | Yes |
| `MONGODB_LINES_COLLECTION` | Collection name for lines data | Yes |
| `ET_CLIENT_NAME` | EnTur client identifier | Yes |
| `GTFS_URL` | URL to GTFS data file | Yes |
| `EN_TUR_JOURNEY_PLANNER_API_URL` | EnTur GraphQL API endpoint | Yes |

## 🚀 Deployment

### Deploy to Azure

1. **Create Azure resources**
   - Azure Function App
   - MongoDB Atlas or Azure Cosmos DB

2. **Configure application settings**
   Set the environment variables in your Azure Function App configuration.

3. **Deploy your code**

## 📊 Data Processing

The application processes GTFS data daily at 04:00 UTC through the `processGTFSFileData` timer function:

1. Downloads the latest GTFS zip file from EnTur
2. Extracts and parses `routes.txt`
3. Clears existing data in MongoDB
4. Imports new route data

## 🗺️ Transport Mode Mapping

The application supports filtering by NeTEx transport modes:

- `air` - Air services (flights, helicopters)
- `bus` - Bus services (local, regional, express, night buses)
- `coach` - Coach services (national, international, tourist)
- `ferry` - Ferry services
- `rail` - Railway services (local, regional, international)
- `metro` - Metro services
- `cableway` - Cable car services
- `funicular` - Funicular services
- `lift` - Lift services

## 🔍 Example Responses

### Route Types Response
```json
{
	"routeTypes": [
		{
			"netexMode": "bus",
			"netexSubmode": "localBus",
			"gtfsRouteTypeName": "LOCAL_BUS_SERVICE",
			"gtfsRouteTypeCode": 704,
			"prettyName": "Buss"
		},
		{
			"netexMode": "water",
			"netexSubmode": "localCarFerry",
			"gtfsRouteTypeName": "LOCAL_CAR_FERRY_SERVICE",
			"gtfsRouteTypeCode": 1004,
			"prettyName": "Ferje"
		}
	]
}
```

### Lines Response
```json
[
	{
		"_id": "68bed30d989302c302e419af",
		"routeId": "TEL:Line:8011",
		"routeShortName": "1",
		"routeLongName": "Notodden-Høgås",
		"routeType": "704"
	},
	{
		"_id": "68bed30d989302c302e419b0",
		"routeId": "TEL:Line:8012",
		"routeShortName": "2",
		"routeLongName": "Notodden-Sjukehuset-Anundskås",
		"routeType": "704"
	}
]
```

### Stop Places Response
```json
{
	"stopPlaces": [
		{
			"name": "Skien Hjellebrygga",
			"stopPlace": {
				"id": "NSR:StopPlace:59360",
				"transportMode": [
					"water"
				]
			}
		},
		{
			"name": "Løveid sluse",
			"stopPlace": {
				"id": "NSR:StopPlace:20223",
				"transportMode": [
					"water"
				]
			}
		}
    ]
}
```
## 📝 Dependencies

### Production Dependencies
- `@azure/functions` - Azure Functions runtime
- `@vtfk/logger` - Logging utilities
- `adm-zip` - ZIP file processing
- `axios` - HTTP client
- `mongodb` - MongoDB driver

### Development Dependencies
- `azure-functions-core-tools` - Local development tools

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 🔗 Related Resources

- [EnTur Developer Portal](https://developer.entur.org/)
    - [EnTur NSR](https://developer.entur.org/pages-nsr-nsr)
    - [EnTur journeyplanner](https://developer.entur.org/pages-journeyplanner-journeyplanner)
- [EnTur netex-gtfs-converter](https://github.com/entur/netex-gtfs-converter-java)
- [GTFS Specification](https://developers.google.com/transit/gtfs)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [NeTEx Standard](http://netex-cen.eu/)

## 🐛 Issues and Support

For issues and support, please create an issue in the repository.