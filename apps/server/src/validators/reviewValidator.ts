import { z } from 'zod';

export const reviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
    review: z.string().min(5, 'Review must be at least 5 characters').max(1000, 'Review cannot exceed 1000 characters')
  })
});
