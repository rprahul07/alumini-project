export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data })
  };
};

export const handleError = (error, req, res) => {
  console.error(`Error in ${req.method} ${req.originalUrl}:`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      createResponse(false, error.message)
    );
  }

  // Prisma error handling
  if (error.code === 'P2002') {
    const field = error.meta?.target?.includes('email') ? 'Email' : 'Roll number';
    return res.status(409).json(
      createResponse(false, `${field} already exists`)
    );
  }

  // JWT error handling
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json(
      createResponse(false, 'Invalid token')
    );
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json(
      createResponse(false, 'Token expired')
    );
  }

  // Default error
  return res.status(500).json(
    createResponse(false, 'Internal server error')
  );
}; 