const { app } = require('@azure/functions');
const { downloadGTFSFileAndImportLines } = require('../lib/jobs/getLines');
const { logger } = require('@vtfk/logger');

app.timer('processGTFSFileData', {
    schedule: '0 4 * * *', // Every day at 04:00
    handler: async (myTimer, context) => {
        logger('info', 'Starting scheduled function processGTFSFileData', { source: 'processGTFSFileData' })
        const result = await downloadGTFSFileAndImportLines()
        logger('info', 'Finished scheduled function processGTFSFileData', { source: 'processGTFSFileData', result })
        return {status: 200, jsonBody: result}

    }
});
