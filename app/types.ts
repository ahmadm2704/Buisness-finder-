
export interface Business {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    email: string | null;
    facebook: string | null;
    instagram: string | null;
    rating: number | null;
    reviews: number | null;
    type: string;
    hasWebsite: boolean;
    website: string | null;
    placeId: string;
}
