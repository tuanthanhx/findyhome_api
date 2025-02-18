import { Document } from 'mongoose';

export interface ICounter extends Document {
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}
