import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';
import { getNextReferralId } from '../counter/counter.service';
// import { transformPlugin } from '../../utils/mongoose_transform';
// import { paginate } from '../../utils/pagination';

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 2 },
    status: { type: Number, required: true },
    referralId: { type: Number, unique: true },
    referrerId: { type: Number },
    avatar: { type: String },
    name: { type: String },
    dob: { type: Date },
    nationalId: { type: String, unique: true },
    phone: { type: String, unique: true },
    address: { type: String },
    socialProfile: {
      facebook: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    baseSalary: { type: Number },
    bankAccount: {
      bankName: { type: String },
      branch: { type: String },
      accountNumber: { type: String, unique: true },
    },
    bio: { type: String },
  },
  {
    timestamps: true,
  },
);

// UserSchema.plugin(transformPlugin);
// UserSchema.plugin(paginate);

UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
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
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

export default mongoose.model<IUser>('User', UserSchema);
