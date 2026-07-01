import { z } from 'zod';

export const carQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    brand: z.string().optional(),
    keyword: z.string().optional(),
    fuel: z.string().optional(),
    transmission: z.string().optional(),
    bodyType: z.string().optional(),
    minPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    maxPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    performance: z.string().optional(),
    sortBy: z.string().optional().default('price'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
  })
});

export const carSearchSchema = z.object({
  query: z.object({
    keyword: z.string().optional().default(''),
    brand: z.string().optional(),
    model: z.string().optional()
  })
});

export const carCompareSchema = z.object({
  query: z.object({
    ids: z.string().refine(val => {
      const split = val.split(',');
      return split.length >= 1 && split.length <= 4;
    }, 'Must provide between 1 and 4 comma-separated vehicle IDs')
  })
});
