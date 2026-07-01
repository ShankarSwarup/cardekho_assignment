import { Types } from 'mongoose';
import { CarModel } from '../models/Car.js';
import { Car as ICar } from '../types/index.js';

export interface CarQueryFilters {
  keyword?: string;
  brand?: string;
  model?: string;
  fuel?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  bodyType?: string;
  performance?: string;
  safetyRating?: number;
  seatingCapacity?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
}

export class CarRepository {
  async findById(id: string): Promise<ICar | null> {
    let car = await CarModel.findById(new Types.ObjectId(id)).lean().exec();
    return car;
  }

  async findByIds(ids: string[]): Promise<ICar[]> {
    let cars = await CarModel.find({ _id: { $in: ids.map(id => new Types.ObjectId(id)) } }).lean().exec();
    console.log(cars,ids);
    return cars;
  }

  async findWithPagination(
    filters: CarQueryFilters,
    page: number,
    limit: number,
    sortField: string = 'price',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ cars: ICar[]; total: number }> {
    const query: any = {};

    if (filters.keyword && filters.keyword !== '') {
      query.$or = [
        { make: { $regex: new RegExp(filters.keyword, 'i') } },
        { model: { $regex: new RegExp(filters.keyword, 'i') } },
        { variant: { $regex: new RegExp(filters.keyword, 'i') } }
      ];
    }
    if (filters.brand && filters.brand !== '') {
      query.make = { $regex: new RegExp(filters.brand, 'i') };
    }
    if (filters.model && filters.model !== '') {
      query.model = { $regex: new RegExp(filters.model, 'i') };
    }
    if (filters.fuel && filters.fuel !== 'Any') {
      query.fuelType = filters.fuel;
    }
    if (filters.transmission && filters.transmission !== 'Any') {
      query.transmission = filters.transmission;
    }
    if (filters.bodyType && filters.bodyType !== 'Any') {
      query.bodyType = filters.bodyType;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    if (filters.safetyRating !== undefined && filters.safetyRating > 0) {
      query.safetyRating = { $gte: filters.safetyRating };
    }
    if (filters.seatingCapacity !== undefined && filters.seatingCapacity > 0) {
      query.seatingCapacity = filters.seatingCapacity;
    }
    if (filters.minYear !== undefined || filters.maxYear !== undefined) {
      query.year = {};
      if (filters.minYear !== undefined) query.year.$gte = filters.minYear;
      if (filters.maxYear !== undefined) query.year.$lte = filters.maxYear;
    }
    if (filters.minMileage !== undefined && filters.minMileage > 0) {
      query.mileage = { $gte: filters.minMileage };
    }
    if (filters.performance && filters.performance !== 'Any') {
      if (filters.performance === 'Eco') {
        query.engine = { $regex: '9\\d\\d\\s*cc|1[01]\\d\\d\\s*cc|PMS\\s*Motor', $options: 'i' };
      } else if (filters.performance === 'Medium') {
        query.engine = { $regex: '1[2-6]\\d\\d\\s*cc', $options: 'i' };
      } else if (filters.performance === 'High') {
        query.engine = { $regex: '1[7-9]\\d\\d\\s*cc|[2-9]\\d\\d\\d\\s*cc', $options: 'i' };
      }
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const [cars, total] = await Promise.all([
      CarModel.find(query).sort(sort).skip(skip).limit(limit).lean().exec() as Promise<ICar[]>,
      CarModel.countDocuments(query).exec()
    ]);

    return { cars, total };
  }

  async searchCars(keyword: string, brand?: string, model?: string): Promise<ICar[]> {
    const query: any = {};

    if (keyword) {
      query.$or = [
        { make: { $regex: new RegExp(keyword, 'i') } },
        { model: { $regex: new RegExp(keyword, 'i') } },
        { variant: { $regex: new RegExp(keyword, 'i') } }
      ];
    }
    if (brand) {
      query.make = { $regex: new RegExp(brand, 'i') };
    }
    if (model) {
      query.model = { $regex: new RegExp(model, 'i') };
    }

    return CarModel.find(query).limit(20).lean().exec() as Promise<ICar[]>;
  }

  async findAllCandidates(preferences: any): Promise<ICar[]> {
    const { familySize, fuel, transmission } = preferences;

    const query: any = {};
    if (familySize) {
      query.seatingCapacity = { $gte: familySize };
    }
    if (fuel && fuel !== 'Any') {
      query.fuelType = fuel;
    }
    if (transmission && transmission !== 'Any') {
      query.transmission = transmission;
    }

    let cars = (await CarModel.find(query).lean().exec()) as ICar[];
    if (cars.length > 0) return cars;

    const queryRelaxedTrans: any = {};
    if (familySize) {
      queryRelaxedTrans.seatingCapacity = { $gte: familySize };
    }
    if (fuel && fuel !== 'Any') {
      queryRelaxedTrans.fuelType = fuel;
    }
    cars = (await CarModel.find(queryRelaxedTrans).lean().exec()) as ICar[];
    if (cars.length > 0) return cars;

    const queryRelaxedAll: any = {};
    if (familySize) {
      queryRelaxedAll.seatingCapacity = { $gte: familySize };
    }
    cars = (await CarModel.find(queryRelaxedAll).lean().exec()) as ICar[];
    if (cars.length > 0) return cars;

    return CarModel.find({}).limit(20).lean().exec() as Promise<ICar[]>;
  }

  async getDistinctFilters(): Promise<{
    brands: string[];
    models: string[];
    brandModels: Record<string, string[]>;
    fuelTypes: string[];
    transmissions: string[];
    bodyTypes: string[];
    seatingCapacities: number[];
    safetyRatings: number[];
    years: number[];
  }> {
    const [brands, models, fuelTypes, transmissions, bodyTypes, seatingCapacities, safetyRatings, years, brandModelPairs] = await Promise.all([
      CarModel.distinct('make').exec(),
      CarModel.distinct('model').exec(),
      CarModel.distinct('fuelType').exec(),
      CarModel.distinct('transmission').exec(),
      CarModel.distinct('bodyType').exec(),
      CarModel.distinct('seatingCapacity').exec(),
      CarModel.distinct('safetyRating').exec(),
      CarModel.distinct('year').exec(),
      CarModel.aggregate([
        { $group: { _id: '$make', models: { $addToSet: '$model' } } }
      ]).exec()
    ]);

    const brandModelsMap: Record<string, string[]> = {};
    brandModelPairs.forEach((item: any) => {
      brandModelsMap[item._id] = item.models.sort();
    });

    return {
      brands: brands.sort(),
      models: models.sort(),
      brandModels: brandModelsMap,
      fuelTypes: fuelTypes.sort(),
      transmissions: transmissions.sort(),
      bodyTypes: bodyTypes.sort(),
      seatingCapacities: seatingCapacities.sort((a, b) => a - b),
      safetyRatings: safetyRatings.sort((a, b) => a - b),
      years: years.sort((a, b) => b - a)
    };
  }
}
