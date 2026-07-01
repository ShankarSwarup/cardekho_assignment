import { UserModel } from '../models/User.js';
import { User as IUser } from '../types/index.js';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).populate('wishlist').exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).populate('wishlist').exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(userData);
    return newUser.save();
  }

  async addToWishlist(userId: string, carId: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: carId } },
      { new: true }
    ).populate('wishlist').exec();
  }

  async removeFromWishlist(userId: string, carId: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: carId } },
      { new: true }
    ).populate('wishlist').exec();
  }
}
