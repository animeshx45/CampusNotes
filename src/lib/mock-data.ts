
import { ServiceCategory, WorkerProfile } from './types';

export const CITIES = ['Delhi', 'Srinagar', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai'];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat1', name: 'Plumbing', iconName: 'Droplets', description: 'Leaky pipes, faucet repair, and installations.' },
  { id: 'cat2', name: 'Electrician', iconName: 'Zap', description: 'Wiring, circuit repairs, and light fittings.' },
  { id: 'cat3', name: 'Cleaning', iconName: 'Brush', description: 'Deep house cleaning and dusting.' },
  { id: 'cat4', name: 'Babysitting', iconName: 'Baby', description: 'Caring for your little ones safely.' },
  { id: 'cat5', name: 'AC Repair', iconName: 'Wind', description: 'Cooling issues and servicing.' },
  { id: 'cat6', name: 'Carpenter', iconName: 'Hammer', description: 'Furniture repair and woodwork.' },
];

export const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'w1',
    userId: 'user101',
    fullName: 'Rajesh Kumar',
    skills: ['Kitchen Plumbing', 'Bathroom Fittings'],
    baseCharge: 350,
    rating: 4.8,
    reviewCount: 124,
    bio: 'Professional plumber with 10 years experience in Delhi NCR.',
    isVerified: true,
    availability: 'Mon-Sat, 9AM-6PM',
    profileImageUrl: 'https://picsum.photos/seed/worker1/400/400',
    categoryId: 'cat1',
    categoryName: 'Plumbing',
    city: 'Delhi'
  },
  {
    id: 'w2',
    userId: 'user102',
    fullName: 'Sajad Ahmad',
    skills: ['House Wiring', 'Inverter Setup'],
    baseCharge: 500,
    rating: 4.9,
    reviewCount: 89,
    bio: 'Certified electrician serving Srinagar city for over 5 years.',
    isVerified: true,
    availability: 'All days, Emergency Support',
    profileImageUrl: 'https://picsum.photos/seed/worker2/400/400',
    categoryId: 'cat2',
    categoryName: 'Electrician',
    city: 'Srinagar'
  },
  {
    id: 'w3',
    userId: 'user103',
    fullName: 'Anita Sharma',
    skills: ['Infant Care', 'Toddler Care'],
    baseCharge: 400,
    rating: 4.7,
    reviewCount: 56,
    bio: 'Kind and patient babysitter with background check clearance.',
    isVerified: true,
    availability: 'Evening & Night shifts',
    profileImageUrl: 'https://picsum.photos/seed/worker3/400/400',
    categoryId: 'cat4',
    categoryName: 'Babysitting',
    city: 'Mumbai'
  }
];
