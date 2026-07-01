import { Car as ICar, User as IUser, Review as IReview } from '@automatch/types';

export const MOCK_CARS: ICar[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'LXI AMT',
    year: 2023,
    bodyType: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '1197 cc',
    mileage: 22.38,
    safetyRating: 3,
    seatingCapacity: 5,
    price: 649000,
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439012',
    make: 'Hyundai',
    model: 'i20',
    variant: 'Asta IVT',
    year: 2023,
    bodyType: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '1197 cc',
    mileage: 19.65,
    safetyRating: 3,
    seatingCapacity: 5,
    price: 704000,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439013',
    make: 'Tata',
    model: 'Nexon',
    variant: 'XZ Plus',
    year: 2023,
    bodyType: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: '1199 cc Turbo',
    mileage: 17.01,
    safetyRating: 5,
    seatingCapacity: 5,
    price: 815000,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439014',
    make: 'Tata',
    model: 'Nexon EV',
    variant: 'Empowered Plus',
    year: 2024,
    bodyType: 'SUV',
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'PMS Motor (100 kW)',
    mileage: 35.0,
    safetyRating: 5,
    seatingCapacity: 5,
    price: 1449000,
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439015',
    make: 'Honda',
    model: 'City',
    variant: 'ZX CVT',
    year: 2024,
    bodyType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '1498 cc',
    mileage: 18.4,
    safetyRating: 5,
    seatingCapacity: 5,
    price: 1182000,
    images: [
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439016',
    make: 'Toyota',
    model: 'Fortuner',
    variant: 'Sigma 4 Automatic',
    year: 2024,
    bodyType: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engine: '2755 cc',
    mileage: 14.4,
    safetyRating: 5,
    seatingCapacity: 7,
    price: 3343000,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439017',
    make: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 Luxury Manual',
    year: 2024,
    bodyType: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Manual',
    engine: '2198 cc',
    mileage: 15.5,
    safetyRating: 5,
    seatingCapacity: 7,
    price: 1399000,
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439018',
    make: 'BMW',
    model: '3 Series',
    variant: '330i M Sport',
    year: 2024,
    bodyType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '1998 cc',
    mileage: 15.39,
    safetyRating: 5,
    seatingCapacity: 5,
    price: 6060000,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

export const MOCK_USERS: IUser[] = [];
export const MOCK_REVIEWS: IReview[] = [];
export const MOCK_RECOMMENDATIONS: any[] = [];
