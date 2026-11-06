const { logger } = require("@vestfoldfylke/loglady");
const { runInContext } = require("./asyncLocalContext.js");

const handleTrigger = async (request, context, next) => {
  const logContext = {
    contextId: context.invocationId
  };

  return await runInContext(logContext, async () => {
    try {
      return await next(request, context);
    } catch (error) {
      const status = 500;
      logger.errorException(error, "Error on {Method} to {Url} with status {Status}", request.method, request.url, status);
      return {
        status,
        body: error.message
      };
    } finally {
      await logger.flush();
    }
  });
};

module.exports = {
  handleTrigger
};
