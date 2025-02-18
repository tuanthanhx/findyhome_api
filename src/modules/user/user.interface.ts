import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  role: number;
  status: number;
  referralId: number;
  referrerId?: number;
  avatar?: string;
  name?: string;
  dob?: Date;
  nationalId?: string;
  phone?: string;
  address?: string;
  socialProfile?: {
    facebook?: string;
    tiktok?: string;
  };
  baseSalary?: number;
  bankAccount?: {
    bankName?: string;
    branch?: string;
    accountNumber?: string;
  };
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
