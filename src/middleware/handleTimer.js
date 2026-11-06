const { logger } = require("@vestfoldfylke/loglady");
const { runInContext } = require("./asyncLocalContext.js");

const handleTimer = async (timer, context, next) => {
  const logContext = {
    contextId: context.invocationId
  };

  await runInContext(logContext, async () => {
    try {
      await next(timer, context);
    } catch (error) {
      logger.errorException(error, "Error in TimerTrigger {Name}", context.functionName);
      throw error;
    } finally {
      await logger.flush();
    }
  });
};

module.exports = {
  handleTimer
};
