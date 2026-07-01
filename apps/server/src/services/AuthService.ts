import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository.js';
import { User as IUser } from '@automatch/types';
import { AuthenticationError } from '../middleware/error.js';

export class AuthService {
  private userRepository = new UserRepository();
  private jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
  private jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret';

  async register(userData: Partial<IUser>): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(userData.email || '');
    if (existing) {
      throw new Error('Email already registered');
    }
    return this.userRepository.create(userData);
  }

  async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError();
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      throw new AuthenticationError();
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Convert mongoose document if necessary, sanitizing password
    const userObj = (user as any).toObject ? (user as any).toObject() : { ...user };
    delete userObj.password;

    return {
      user: userObj as IUser,
      accessToken,
      refreshToken
    };
  }

  generateAccessToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id, role: user.role },
      this.jwtSecret,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      this.jwtRefreshSecret,
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token: string): { userId: string; role: 'user' | 'admin' } {
    return jwt.verify(token, this.jwtSecret) as { userId: string; role: 'user' | 'admin' };
  }

  verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, this.jwtRefreshSecret) as { userId: string };
  }
}
