export interface Car {
  _id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  engine: string;
  mileage: number;
  safetyRating: number;
  seatingCapacity: number;
  price: number;
  images: string[];
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  wishlist: string[]; // Car IDs
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  carId: string;
  rating: number; // 1-5
  review: string;
  createdAt: string;
}

export interface RecommendationPreferences {
  budget: number;
  familySize: number;
  fuel: string;
  transmission: string;
  dailyDistance: number;
  priority: 'Safety' | 'Budget' | 'Mileage' | 'Performance';
  brandPreference?: string;
}

export interface RecommendationResult {
  carId: string;
  score: number;
  reason: string;
  tradeOff: string;
}

export interface RecommendationSession {
  _id: string;
  userId: string;
  preferences: RecommendationPreferences;
  shortlistedCars: string[]; // Car IDs
  advisorExplanation: string;
  createdAt: string;
}
