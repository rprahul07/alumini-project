// Utility to create a standard JSON response
export const createResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data !== null && { data }),
  };
};

// Centralized error handler middleware
export const handleError = (error, req, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json(createResponse(false, message));
};


