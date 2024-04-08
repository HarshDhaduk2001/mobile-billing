exports.ResponseData = (res, statusCode, status, responseData, message) => {
  return res.status(statusCode).json({
    ResponseStatus: status.toLowerCase(),
    ResponseData: responseData,
    Message: message,
  });
};
