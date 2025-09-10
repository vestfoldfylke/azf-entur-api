const { app } = require('@azure/functions');
const { downloadGTFSFileAndImportLines } = require('../lib/jobs/getLines');

app.http('devTest', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {
        const result = await downloadGTFSFileAndImportLines();
        return {status: 200, jsonBody: result}
    }
});
