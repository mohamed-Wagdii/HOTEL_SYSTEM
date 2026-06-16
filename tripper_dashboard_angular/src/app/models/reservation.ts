export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  hotelName?: string;
  experienceName?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guestsCount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}
