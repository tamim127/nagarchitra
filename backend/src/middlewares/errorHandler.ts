import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && statusCode === 500
    ? 'Internal Server Error'
    : (err.message || 'Internal Server Error');

  console.error(`[Error] ${req.method} ${req.url} - ${statusCode}: ${err.message}`);
  if (err.stack && !isProduction) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: isProduction ? undefined : (err.errors || undefined),
    stack: isProduction ? undefined : err.stack,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
}
