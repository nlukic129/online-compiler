const checkRequiredParams = (reqParams, checkParams, errorStatus = 400) => {
  for (const param of checkParams) {
    if (!reqParams[param]) {
      const error = new Error(`Missing parameter: ${param}`);
      error.status = errorStatus;
      throw error;
    }
  }
};

module.exports = {
  checkRequiredParams,
};
