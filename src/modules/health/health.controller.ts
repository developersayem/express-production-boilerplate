import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';

export const checkHealth = catchAsync(async (req: Request, res: Response) => {
  const data = {
    status: 'UP',
    timestamp: new Date().toISOString(),
  };
  
  res.status(200).json(new ApiResponse(200, data, 'Server is healthy'));
});
