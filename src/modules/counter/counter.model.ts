import mongoose, { Schema } from 'mongoose';
import { ICounter } from './counter.interface';

const CounterSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

export default mongoose.model<ICounter>('Counter', CounterSchema);
