import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';

export const checkHealth = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});
