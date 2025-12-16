import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.register(email, password);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: req.user,
  });
});
