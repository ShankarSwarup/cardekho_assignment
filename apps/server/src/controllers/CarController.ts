import { Request, Response } from 'express';
import { CarService } from '../services/CarService.js';
import { asyncHandler } from '../middleware/error.js';

const carService = new CarService();

/**
 * Retrieve paginated cars matching specified search and filter criteria.
 * Filters include: brand, fuel, transmission, minPrice, maxPrice, bodyType, keyword, and performance.
 */
export const getCars = asyncHandler(async (req: Request, res: Response) => {
  const {
    page,
    limit,
    brand,
    model,
    fuel,
    transmission,
    minPrice,
    maxPrice,
    bodyType,
    sortBy,
    sortOrder,
    keyword,
    performance,
    safetyRating,
    seatingCapacity,
    minYear,
    maxYear,
    minMileage
  } = req.query as any;

  const parsedPage = parseInt(page as string, 10) || 1;
  const parsedLimit = parseInt(limit as string, 10) || 6;
  const parsedMinPrice = minPrice ? parseFloat(minPrice as string) : undefined;
  const parsedMaxPrice = maxPrice ? parseFloat(maxPrice as string) : undefined;

  const parsedSafetyRating = safetyRating ? parseInt(safetyRating as string, 10) : undefined;
  const parsedSeatingCapacity = seatingCapacity ? parseInt(seatingCapacity as string, 10) : undefined;
  const parsedMinYear = minYear ? parseInt(minYear as string, 10) : undefined;
  const parsedMaxYear = maxYear ? parseInt(maxYear as string, 10) : undefined;
  const parsedMinMileage = minMileage ? parseFloat(minMileage as string) : undefined;

  const result = await carService.getCars(
    {
      brand,
      model,
      fuel,
      transmission,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      bodyType,
      keyword,
      performance,
      safetyRating: parsedSafetyRating,
      seatingCapacity: parsedSeatingCapacity,
      minYear: parsedMinYear,
      maxYear: parsedMaxYear,
      minMileage: parsedMinMileage
    },
    parsedPage,
    parsedLimit,
    sortBy,
    sortOrder
  );

  return res.status(200).json({
    success: true,
    message: 'Vehicles retrieved successfully',
    data: {
      cars: result.cars,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: result.total,
        hasNext: result.hasNext
      }
    }
  });
});

/**
 * Retrieve detailed specification of a specific car by its unique ID.
 */
export const getCarById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const car = await carService.getCarById(id);

  if (!car) {
    return res.status(404).json({
      success: false,
      code: 'CAR_001',
      message: 'Vehicle not found',
      errors: [],
      traceId: req.traceId
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Vehicle details retrieved successfully',
    data: car
  });
});

/**
 * Search cars matching a keyword or specific make/model.
 */
export const searchCars = asyncHandler(async (req: Request, res: Response) => {
  const { keyword, brand, model } = req.query as any;
  const cars = await carService.searchCars(keyword, brand, model);

  return res.status(200).json({
    success: true,
    message: 'Search query executed successfully',
    data: cars
  });
});

/**
 * Compare details of up to 4 selected vehicles side-by-side.
 */
export const compareCars = asyncHandler(async (req: Request, res: Response) => {
  const ids = (req.query.ids as string).split(',');
  const comparison = await carService.compareCars(ids);

  return res.status(200).json({
    success: true,
    message: 'Vehicle specs comparison generated',
    data: comparison
  });
});

/**
 * Add or remove a car to/from the authenticated user's wishlist.
 */
export const toggleWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { carId, action } = req.body;
  const userId = req.userId!;

  if (action !== 'add' && action !== 'remove') {
    return res.status(400).json({
      success: false,
      code: 'VAL_001',
      message: "Action must be 'add' or 'remove'",
      errors: [],
      traceId: req.traceId
    });
  }

  const updatedUser = await carService.toggleWishlist(userId, carId, action);
  return res.status(200).json({
    success: true,
    message: action === 'add' ? 'Added to wishlist' : 'Removed from wishlist',
    data: updatedUser
  });
});

/**
 * Retrieve user's saved wishlist cars from the backend database.
 */
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const user = await carService.getWishlist(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      code: 'AUTH_003',
      message: 'User not found',
      errors: [],
      traceId: req.traceId
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Wishlist retrieved successfully',
    data: user.wishlist
  });
});

/**
 * Retrieve unique categories (makes, fuelTypes, transmissions, bodyTypes)
 * from the database to feed frontend filters dynamically.
 */
export const getCarFilters = asyncHandler(async (req: Request, res: Response) => {
  const filters = await carService.getDistinctFilters();
  return res.status(200).json({
    success: true,
    message: 'Unique vehicle filter options retrieved',
    data: filters
  });
});
