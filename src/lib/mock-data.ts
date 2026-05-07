
import { ServiceCategory, WorkerProfile } from './types';

export const CITIES = ['Delhi', 'Srinagar', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Pune', 'Hyderabad'];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat1', name: 'Plumbing', iconName: 'Droplets', description: 'Leaky pipes, faucet repair, and installations.' },
  { id: 'cat2', name: 'Electrician', iconName: 'Zap', description: 'Wiring, circuit repairs, and light fittings.' },
  { id: 'cat3', name: 'Cleaning', iconName: 'Brush', description: 'Deep house cleaning, sofa cleaning, and dusting.' },
  { id: 'cat4', name: 'Babysitting', iconName: 'Baby', description: 'Caring for your little ones safely with verified sitters.' },
  { id: 'cat5', name: 'AC Repair', iconName: 'Wind', description: 'Cooling issues, gas refilling, and servicing.' },
  { id: 'cat6', name: 'Carpenter', iconName: 'Hammer', description: 'Furniture repair, assembly, and woodwork.' },
  { id: 'cat7', name: 'Painting', iconName: 'Paintbrush', description: 'Interior, exterior painting and waterproof coating.' },
  { id: 'cat8', name: 'Pest Control', iconName: 'Bug', description: 'Termite, cockroach, and general pest management.' },
  { id: 'cat9', name: 'Gardening', iconName: 'Leaf', description: 'Lawn mowing, plant care, and garden design.' },
  { id: 'cat10', name: 'Appliance Repair', iconName: 'Cpu', description: 'Washing machine, fridge, and microwave repairs.' },
];

export const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'w1',
    userId: 'user101',
    fullName: 'Rajesh Kumar',
    skills: ['Kitchen Plumbing', 'Bathroom Fittings', 'Pipe Leakage'],
    baseCharge: 350,
    rating: 4.8,
    reviewCount: 124,
    bio: 'Professional plumber with 10 years experience in Delhi NCR. Specializing in modern bathroom fixtures.',
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
    skills: ['House Wiring', 'Inverter Setup', 'Panel Repair'],
    baseCharge: 500,
    rating: 4.9,
    reviewCount: 89,
    bio: 'Certified electrician serving Srinagar city for over 5 years. Available for emergency repairs.',
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
    skills: ['Infant Care', 'Toddler Care', 'Educational Play'],
    baseCharge: 400,
    rating: 4.7,
    reviewCount: 56,
    bio: 'Kind and patient babysitter with background check clearance. Loves engaging kids with creative activities.',
    isVerified: true,
    availability: 'Evening & Night shifts',
    profileImageUrl: 'https://picsum.photos/seed/worker3/400/400',
    categoryId: 'cat4',
    categoryName: 'Babysitting',
    city: 'Mumbai'
  },
  {
    id: 'w4',
    userId: 'user104',
    fullName: 'Vikram Singh',
    skills: ['Sofa Cleaning', 'Bathroom Deep Cleaning', 'Floor Polishing'],
    baseCharge: 800,
    rating: 4.6,
    reviewCount: 210,
    bio: 'Expert in house cleaning and sanitization. We use eco-friendly cleaning agents.',
    isVerified: true,
    availability: 'Flexible Hours',
    profileImageUrl: 'https://picsum.photos/seed/worker4/400/400',
    categoryId: 'cat3',
    categoryName: 'Cleaning',
    city: 'Bangalore'
  },
  {
    id: 'w5',
    userId: 'user105',
    fullName: 'Amit Patel',
    skills: ['Split AC Repair', 'Window AC Servicing', 'Gas Refill'],
    baseCharge: 450,
    rating: 4.9,
    reviewCount: 342,
    bio: 'Prompt AC servicing specialist. Guaranteed cooling improvement in one visit.',
    isVerified: true,
    availability: 'Mon-Sun, 8AM-8PM',
    profileImageUrl: 'https://picsum.photos/seed/worker5/400/400',
    categoryId: 'cat5',
    categoryName: 'AC Repair',
    city: 'Mumbai'
  },
  {
    id: 'w6',
    userId: 'user106',
    fullName: 'David Momin',
    skills: ['Furniture Assembly', 'Door Repair', 'Cabinet Work'],
    baseCharge: 600,
    rating: 4.5,
    reviewCount: 45,
    bio: 'Skillful carpenter for all your furniture needs. Assembly and repair expert.',
    isVerified: false,
    availability: 'Mon-Fri',
    profileImageUrl: 'https://picsum.photos/seed/worker6/400/400',
    categoryId: 'cat6',
    categoryName: 'Carpenter',
    city: 'Kolkata'
  }
];
