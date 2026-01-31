
import { z } from 'zod';

export const SearchRequestSchema = z.object({
    country: z.string().min(1, 'Country name is required'),
    query: z.string().min(1, 'Business type search term is required'),
});

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const BusinessSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
    rating: z.number().nullable(),
    reviews: z.number().nullable(),
    type: z.string(),
    hasWebsite: z.boolean(),
    website: z.string().nullable(),
    placeId: z.string(),
});

export type Business = z.infer<typeof BusinessSchema>;
