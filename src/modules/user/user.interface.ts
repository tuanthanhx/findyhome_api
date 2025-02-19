import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string | null;
  password: string;
  refreshToken?: string;
  roles: number[];
  status: number;
  referralId: number;
  referrerId?: number | null;
  avatar?: string | null;
  name?: string | null;
  dob?: Date | null;
  nationalId?: string | null;
  phone?: string | null;
  address?: string | null;
  socialProfile?: {
    facebook?: string | null;
    tiktok?: string | null;
  } | null;
  baseSalary?: number | null;
  bankAccount?: {
    bankName?: string | null;
    branch?: string | null;
    accountNumber?: string | null;
  } | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
