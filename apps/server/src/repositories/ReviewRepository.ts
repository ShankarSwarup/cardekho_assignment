import { ReviewModel } from '../models/Review.js';
import { Review as IReview } from '../types/index.js';

export class ReviewRepository {
  async findByCarId(carId: string): Promise<IReview[]> {
    return ReviewModel.find({ carId }).populate('userId', 'fullName').exec();
  }

  async findById(id: string): Promise<IReview | null> {
    return ReviewModel.findById(id).exec();
  }

  async findByUserAndCar(userId: string, carId: string): Promise<IReview | null> {
    return ReviewModel.findOne({ userId, carId }).exec();
  }

  async create(reviewData: Partial<IReview>): Promise<IReview> {
    const newReview = new ReviewModel(reviewData);
    return newReview.save();
  }

  async update(id: string, rating: number, review: string): Promise<IReview | null> {
    return ReviewModel.findByIdAndUpdate(
      id,
      { rating, review },
      { new: true }
    ).exec();
  }

  async delete(id: string): Promise<IReview | null> {
    return ReviewModel.findByIdAndDelete(id).exec();
  }
}
