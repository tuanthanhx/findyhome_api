import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';
import { getNextReferralId } from '../counter/counter.service';

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, sparse: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    roles: {
      type: [Number],
      required: true,
      default: [2],
    },
    status: { type: Number, required: true },
    referralId: { type: Number, sparse: true, unique: true },
    referrerId: { type: Number },
    avatar: { type: String },
    name: { type: String },
    dob: { type: Date },
    nationalId: { type: String, sparse: true, unique: true },
    phone: { type: String, sparse: true, unique: true },
    address: { type: String },
    socialProfile: {
      facebook: { type: String, default: null },
      tiktok: { type: String, default: null },
    },
    baseSalary: { type: Number },
    bankAccount: {
      bankName: { type: String },
      branch: { type: String },
      accountNumber: { type: String, sparse: true, unique: true },
    },
    bio: { type: String },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre<IUser>(
  'save',
  async function preSaveHook(next: (err?: CallbackError) => void) {
    if (!this.referralId) {
      const referralId = await getNextReferralId();
      if (referralId) {
        this.referralId = referralId;
      }
    }
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(8);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err as CallbackError);
    }
  },
);

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
