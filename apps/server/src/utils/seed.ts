import mongoose from 'mongoose';
import { CarModel } from '../models/Car.js';
import { UserModel } from '../models/User.js';
import { ReviewModel } from '../models/Review.js';
import { RecommendationModel } from '../models/Recommendation.js';
import dotenv from 'dotenv';

dotenv.config();

const modelConfig: Record<string, {
  make: string;
  bodyType: string;
  fuelTypes: string[];
  transmissions: string[];
  basePrice: number;
  maxPrice: number;
  engine: string;
  mileage: number;
  safetyRating: number;
  seatingCapacity: number;
  image: string;
}> = {
  'Swift': {
    make: 'Maruti Suzuki',
    bodyType: 'Hatchback',
    fuelTypes: ['Petrol', 'CNG'],
    transmissions: ['Manual', 'Automatic', 'AMT'],
    basePrice: 649000,
    maxPrice: 964000,
    engine: '1197 cc',
    mileage: 22.38,
    safetyRating: 3,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'
  },
  'i20': {
    make: 'Hyundai',
    bodyType: 'Hatchback',
    fuelTypes: ['Petrol'],
    transmissions: ['Manual', 'Automatic', 'CVT'],
    basePrice: 704000,
    maxPrice: 1121000,
    engine: '1197 cc',
    mileage: 19.65,
    safetyRating: 3,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  },
  'Nexon': {
    make: 'Tata',
    bodyType: 'SUV',
    fuelTypes: ['Petrol', 'Diesel'],
    transmissions: ['Manual', 'Automatic', 'DCT', 'AMT'],
    basePrice: 815000,
    maxPrice: 1580000,
    engine: '1199 cc Turbo',
    mileage: 17.01,
    safetyRating: 5,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
  },
  'Nexon EV': {
    make: 'Tata',
    bodyType: 'SUV',
    fuelTypes: ['Electric'],
    transmissions: ['Automatic'],
    basePrice: 1449000,
    maxPrice: 1929000,
    engine: 'PMS Motor (100 kW)',
    mileage: 35.0,
    safetyRating: 5,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  },
  'City': {
    make: 'Honda',
    bodyType: 'Sedan',
    fuelTypes: ['Petrol', 'Hybrid'],
    transmissions: ['Manual', 'Automatic', 'CVT'],
    basePrice: 1182000,
    maxPrice: 1635000,
    engine: '1498 cc',
    mileage: 18.4,
    safetyRating: 5,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80'
  },
  'Fortuner': {
    make: 'Toyota',
    bodyType: 'SUV',
    fuelTypes: ['Petrol', 'Diesel'],
    transmissions: ['Manual', 'Automatic'],
    basePrice: 3343000,
    maxPrice: 5144000,
    engine: '2755 cc',
    mileage: 14.4,
    safetyRating: 5,
    seatingCapacity: 7,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80'
  },
  'XUV700': {
    make: 'Mahindra',
    bodyType: 'SUV',
    fuelTypes: ['Petrol', 'Diesel'],
    transmissions: ['Manual', 'Automatic'],
    basePrice: 1399000,
    maxPrice: 2699000,
    engine: '2198 cc',
    mileage: 15.5,
    safetyRating: 5,
    seatingCapacity: 7,
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80'
  },
  '3 Series': {
    make: 'BMW',
    bodyType: 'Sedan',
    fuelTypes: ['Petrol', 'Diesel'],
    transmissions: ['Automatic'],
    basePrice: 6060000,
    maxPrice: 7290000,
    engine: '1998 cc',
    mileage: 15.39,
    safetyRating: 5,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
  },
  'Slavia': {
    make: 'Skoda',
    bodyType: 'Sedan',
    fuelTypes: ['Petrol'],
    transmissions: ['Manual', 'Automatic', 'CVT'],
    basePrice: 1163000,
    maxPrice: 1912000,
    engine: '999 cc TSI',
    mileage: 19.47,
    safetyRating: 5,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80'
  },
  'Virtus': {
    make: 'Volkswagen',
    bodyType: 'Sedan',
    fuelTypes: ['Petrol'],
    transmissions: ['Manual', 'Automatic', 'DCT'],
    basePrice: 1156000,
    maxPrice: 1941000,
    engine: '1498 cc TSI',
    mileage: 18.67,
    safetyRating: 5,
    seatingCapacity: 5,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80'
  }
};

const variants = ['XE', 'XM', 'XT', 'XZ+', 'Fearless', 'Adventure', 'LXI', 'VXI', 'ZXI', 'Alpha', 'Zeta', 'Sigma', 'Era', 'Magna', 'Sportz', 'Asta', 'Asta (O)', 'Active', 'Ambition', 'Style', 'AX5', 'AX7', 'MX3', 'MX5', 'ZX', 'VX', 'GX'];
const models = Object.keys(modelConfig);

const generateMockCars = (count: number) => {
  const generated: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const model = models[i % models.length];
    const config = modelConfig[model];
    
    // Determine variant name
    const variantIndex = Math.floor(i / models.length);
    const variantName = variants[variantIndex % variants.length];
    
    // Fuel type
    const fuelType = config.fuelTypes[variantIndex % config.fuelTypes.length];
    
    // Transmission
    const transmission = config.transmissions[variantIndex % config.transmissions.length];
    
    // Calculate variant price based on basePrice and constraints
    const priceStep = Math.floor((config.maxPrice - config.basePrice) / variants.length);
    const variantPrice = config.basePrice + (variantIndex % variants.length) * priceStep;
    
    // Engine capacity variation
    let engine = config.engine;
    if (variantIndex % 3 === 1 && !config.engine.includes('Motor')) {
      engine = config.engine.replace('cc', 'cc Turbo');
    }
    
    // Mileage slight variation
    const mileageVar = -1.5 + (variantIndex % 5) * 0.75;
    const mileage = parseFloat((config.mileage + (fuelType === 'Electric' ? 0 : mileageVar)).toFixed(2));
    
    const secondaryImages: Record<string, string[]> = {
      'Hatchback': [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      ],
      'SUV': [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80'
      ],
      'Sedan': [
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
      ]
    };
    const extra = secondaryImages[config.bodyType] || [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80'
    ];

    generated.push({
      make: config.make,
      model,
      variant: `${variantName} ${transmission}`,
      year: 2023 + (variantIndex % 2),
      bodyType: config.bodyType,
      fuelType,
      transmission,
      engine,
      mileage,
      safetyRating: config.safetyRating,
      seatingCapacity: config.seatingCapacity,
      price: variantPrice,
      images: [config.image, ...extra]
    });
  }
  
  return generated;
};

const seed = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/automatch';
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing old collections data...');
    await CarModel.deleteMany({});
    await UserModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await RecommendationModel.deleteMany({});
    console.log('Collections cleared.');

    console.log('Generating 400 real-world vehicles...');
    const generatedCars = generateMockCars(400);
    console.log('Inserting vehicles seed data...');
    const insertedCars = await CarModel.insertMany(generatedCars);
    console.log(`Inserted ${insertedCars.length} vehicles.`);

    // Create an Admin user and a Default Test user
    console.log('Creating users...');
    const defaultUser = await UserModel.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Password@123', // encrypted via pre-save hook
      role: 'user',
      wishlist: [insertedCars[0]._id, insertedCars[2]._id]
    });

    const adminUser = await UserModel.create({
      fullName: 'System Administrator',
      email: 'admin@automatch.ai',
      password: 'SecureAdminPassword123!',
      role: 'admin',
      wishlist: []
    });

    console.log('Creating sample reviews...');
    await ReviewModel.create([
      {
        userId: defaultUser._id,
        carId: insertedCars[2]._id,
        rating: 5,
        review: 'Excellent build quality and very comfortable ride. The safety features make me feel highly secure.'
      },
      {
        userId: defaultUser._id,
        carId: insertedCars[0]._id,
        rating: 4,
        review: 'Amazing mileage and perfect for tight city traffic, but build quality could be better.'
      }
    ]);

    console.log('Database seeding successfully completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
};

seed();
