export interface Experience {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  dates: string[];
  activities: { title: string; description?: string; image?: string }[];
  address: {
    country: string;
    city: string;
  };
  starRating: number;
  hostName?: string;
  hostEmail?: string;
}
