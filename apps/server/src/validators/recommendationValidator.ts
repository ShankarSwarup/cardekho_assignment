import { z } from 'zod';

export const recommendationSchema = z.object({
  body: z.object({
    budget: z.number().positive('Budget must be a positive number'),
    familySize: z.number().int().min(1, 'Family size must be at least 1'),
    fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Any']),
    transmission: z.enum(['Manual', 'Automatic', 'Any']),
    dailyDistance: z.number().nonnegative('Daily distance must be a positive number'),
    priority: z.enum(['Safety', 'Budget', 'Mileage', 'Performance']),
    brandPreference: z.string().optional()
  })
});
