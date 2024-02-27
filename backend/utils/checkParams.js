const checkRequiredParams = (reqParams, checkParams, HttpError, errorStatus = 400) => {
  for (const param of checkParams) {
    if (!reqParams[param]) {
      throw new HttpError(`Missing parameter: ${param}`, errorStatus);
    }
  }
};

module.exports = {
  checkRequiredParams,
};
