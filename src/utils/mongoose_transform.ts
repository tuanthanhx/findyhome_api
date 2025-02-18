import { Schema } from 'mongoose';

export const transformPlugin = (schema: Schema): void => {
  schema.set('toJSON', {
    virtuals: true,
    transform: function (_doc: any, ret: Record<string, any>) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id: ret.id, ...ret };
    },
  });

  schema.set('toObject', {
    virtuals: true,
    transform: function (_doc: any, ret: Record<string, any>) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id: ret.id, ...ret };
    },
  });
};
