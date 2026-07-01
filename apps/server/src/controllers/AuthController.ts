import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';
import { asyncHandler } from '../middleware/error.js';

const authService = new AuthService();

/**
 * Handle new user registration.
 * Validates request body, hashes password, inserts user into database, and returns user details.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { userId: user._id, email: user.email }
  });
});

/**
 * Handle user authentication (Login).
 * Verifies email/password credentials, issues short-lived accessToken in payload,
 * and sets long-lived refreshToken inside a secure HTTP-Only cookie.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  // Set Refresh Token as HTTP-Only Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken }
  });
});

/**
 * Renew access token using refresh token HTTP-Only cookie.
 * Validates existence of refresh token cookie, decodes and verifies signature,
 * and issues a fresh short-lived JWT.
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_004',
      message: 'Refresh token is missing',
      errors: [],
      traceId: req.traceId
    });
  }

  try {
    const decoded = authService.verifyRefreshToken(refreshToken);
    const accessToken = authService.generateAccessToken({ _id: decoded.userId } as any);
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken }
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_003',
      message: 'Invalid or expired refresh token',
      errors: [],
      traceId: req.traceId
    });
  }
});

/**
 * Handle user logout.
 * Clears the HTTP-only refreshToken cookie, terminating user session.
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return res.status(200).json({
    success: true,
    message: 'Logout successful',
    data: {}
  });
});
