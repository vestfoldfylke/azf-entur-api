const { AsyncLocalStorage } = require("node:async_hooks");
const { logger } = require("@vestfoldfylke/loglady");

const asyncLocalStorage = new AsyncLocalStorage();

logger.setContextProvider(() => asyncLocalStorage.getStore());

const runInContext = async (logConfig, callback) => asyncLocalStorage.run(logConfig, callback);

module.exports = {
  runInContext
};
