
export type UserRole = 'customer' | 'worker' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  city?: string;
  createdAt: any;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string; // Denormalized for display
  skills: string[];
  baseCharge: number;
  rating: number;
  reviewCount: number;
  bio: string;
  isVerified: boolean;
  availability: string;
  profileImageUrl: string;
  categoryId: string;
  categoryName: string; // Denormalized for display
  city: string; // Denormalized from user
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: any;
  totalAmount: number;
  serviceDetails: string;
}
