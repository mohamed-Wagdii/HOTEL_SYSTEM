export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  hostHotels: any[];
  hostExperiences: any[];
  identityImageUrl?: string;
  role: string[];
  activeRole: string;
  isConfirmed: boolean;
  isVerified: 'notVerified' | 'pending' | 'verified' | 'rejected';
  createdAt?: string;

}
