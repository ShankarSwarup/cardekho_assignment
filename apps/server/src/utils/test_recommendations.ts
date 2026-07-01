import mongoose from 'mongoose';
import { RecommendationService } from '../services/RecommendationService.js';
import { UserModel } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const test = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/automatch';
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Fetch the test user john@example.com
    const user = await UserModel.findOne({ email: 'john@example.com' }).exec();
    if (!user) {
      console.error('Test user john@example.com not found. Please run the seed script first.');
      process.exit(1);
    }

    console.log(`Using user ID: ${user._id} (${user.fullName})`);

    const recommendationService = new RecommendationService();

    const dummyPreferences = {
      budget: 1500000,
      familySize: 5,
      fuel: 'Petrol',
      transmission: 'Automatic',
      dailyDistance: 40,
      priority: 'Safety' as const,
      brandPreference: 'Tata'
    };

    console.log('Computing recommendations with dummy inputs:', dummyPreferences);
    
    const result = await recommendationService.generateRecommendations(
      user._id.toString(),
      dummyPreferences
    );

    console.log('\n--- SUCCESS: RECOMMENDATION RESULT RECEIVED ---');
    console.log(`Explanation:\n"${result.explanation}"\n`);
    console.log('Shortlisted Vehicles:');
    result.recommendations.forEach((rec: any, idx: number) => {
      console.log(`\n#${idx + 1} Match Score: ${rec.score}%`);
      console.log(`Vehicle: ${rec.carDetails?.make} ${rec.carDetails?.model} (${rec.carDetails?.variant}) - ₹${rec.carDetails?.price.toLocaleString()}`);
      console.log(`Reason: ${rec.reason}`);
      console.log(`Trade-off: ${rec.tradeOff}`);
    });
    console.log('-----------------------------------------------\n');

    await mongoose.disconnect();
    console.log('Disconnected. Test finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Recommendation test failed:', error);
    process.exit(1);
  }
};

test();
