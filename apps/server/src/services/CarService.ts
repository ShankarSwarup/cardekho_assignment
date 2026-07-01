import { CarRepository, CarQueryFilters } from '../repositories/CarRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { Car as ICar, User as IUser } from '@automatch/types';

export class CarService {
  private carRepository = new CarRepository();
  private userRepository = new UserRepository();

  async getCarById(id: string): Promise<ICar | null> {
    return this.carRepository.findById(id);
  }

  async getCars(
    filters: CarQueryFilters,
    page: number,
    limit: number,
    sortField: string = 'price',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ cars: ICar[]; total: number; hasNext: boolean }> {
    const { cars, total } = await this.carRepository.findWithPagination(
      filters,
      page,
      limit,
      sortField,
      sortOrder
    );

    const hasNext = page * limit < total;
    return { cars, total, hasNext };
  }

  async searchCars(keyword: string, brand?: string, model?: string): Promise<ICar[]> {
    return this.carRepository.searchCars(keyword, brand, model);
  }

  async compareCars(ids: string[]): Promise<any> {
    if (ids.length > 4) {
      throw new Error('Maximum comparison limit is 4 cars');
    }
    const cars = await this.carRepository.findByIds(ids);
    if (cars.length === 0) {
      throw new Error('No valid vehicles found for comparison');
    }

    // Align properties for side-by-side comparison table
    const specs = [
      { key: 'make', label: 'Make' },
      { key: 'model', label: 'Model' },
      { key: 'variant', label: 'Variant' },
      { key: 'price', label: 'Price' },
      { key: 'year', label: 'Year' },
      { key: 'bodyType', label: 'Body Type' },
      { key: 'fuelType', label: 'Fuel Type' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'engine', label: 'Engine Capacity' },
      { key: 'mileage', label: 'Mileage (km/l)' },
      { key: 'safetyRating', label: 'Safety (NCAP Stars)' },
      { key: 'seatingCapacity', label: 'Seating Capacity' }
    ];

    const comparisonTable = specs.map((spec) => {
      const row: any = { label: spec.label, key: spec.key };
      cars.forEach((car: any, idx) => {
        row[`car${idx + 1}`] = car[spec.key];
      });
      return row;
    });

    return {
      vehicles: cars,
      comparisonTable
    };
  }

  async toggleWishlist(userId: string, carId: string, action: 'add' | 'remove'): Promise<IUser | null> {
    const car = await this.carRepository.findById(carId);
    if (!car) {
      throw new Error('Vehicle not found');
    }

    if (action === 'add') {
      return this.userRepository.addToWishlist(userId, carId);
    } else {
      return this.userRepository.removeFromWishlist(userId, carId);
    }
  }

  /**
   * Retrieves unique filter values from the repository.
   * @returns Dynamic filter lists (brands, fuelTypes, transmissions, bodyTypes).
   */
  async getDistinctFilters(): Promise<any> {
    return this.carRepository.getDistinctFilters();
  }
}
