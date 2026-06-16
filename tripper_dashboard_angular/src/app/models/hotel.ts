export interface Address {
  country: string;
  city: string;
  street: string;
  latitude?: number;
  longitude?: number;
}

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  amenities: string[];
  address: Address;
  starRating: number;
  hostName?: string;
  hostEmail?: string;
  createdAt?: string;
}
