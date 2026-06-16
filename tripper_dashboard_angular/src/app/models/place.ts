export interface Place {
  _id?: string;
  name: string;
  description?: string;
  images: string[];
  address?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  starRating?: number;
  createdAt?: string;
  updatedAt?: string;
}