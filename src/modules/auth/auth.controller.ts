import { Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import User from '../user/user.model';
import { IUser } from '../user/user.interface';
import config from '../../config/config';

// interface UserPayload {
//   id: string;
//   roles: number[];
//   iat?: number;
//   exp?: number;
// }

const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, roles: user.roles }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, roles: user.roles },
    config.jwtRefreshSecret,
    {
      expiresIn: config.jwtRefreshExpiresIn,
    },
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    jwt.verify(
      refreshToken,
      config.jwtRefreshSecret,
      (err: VerifyErrors | null) => {
        if (err) {
          res.status(403).json({ message: 'Invalid refresh token' });
          return;
        }
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
      },
    );
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  login,
  logout,
  refresh,
};
