import { Schema, model } from 'mongoose';
import { User as IUser } from '@automatch/types';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wishlist: [{ type: Schema.Types.ObjectId as any, ref: 'Car' }]
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  const user = this as any;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password as string, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

export const UserModel = model<IUser>('User', userSchema);
