import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan'
import cors from 'cors';

import { router as api } from './api/v1/index.ts';
import { APIError } from './types.ts';

export const app = express();

// CORS
app.use(cors());

// LOGS
app.use(morgan('tiny'))

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api', api);
app.use('/api/v1', api);

// No route found handler
app.use((req, res, next) => {
  next({
    message: 'Route Not Found',
    status: 404,
  });
});

// Error handler
app.use((err: APIError, req: Request, res: Response, next: NextFunction): void => {
  const { message = '', error, status = 500 } = err;

  res.json({
    error: {
      message,
      status,
      error,
    },
  });
  res.status(status)
});

