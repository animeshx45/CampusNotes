
import { Branch, MaterialType, Semester, StudyMaterial } from './types';

export const BRANCHES: Branch[] = [
  'Information Technology',
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Electronics & Communication Engineering',
  'Metallurgical & Materials Engineering'
];

export const SEMESTERS: Semester[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const MATERIAL_TYPES: MaterialType[] = [
  'Note',
  'Assignment',
  'Previous Year Paper',
  'Textbook',
  'Lab Manual',
  'YouTube Playlist'
];

export const MOCK_MATERIALS: StudyMaterial[] = [
  // --- SEMESTER 3 ---
  {
    id: 'it-s3-oop',
    title: 'Object Oriented Programming (OOPS)',
    description: 'Learn Classes, Objects, and Polymorphism in C++. Essential for IT and CSE students.',
    branch: 'Information Technology',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLVlQjwv71P1W5_0nreD9_9H1Gk8nJ6i9f',
    author: 'Saurabh Shukla',
    uploaderId: 'system',
    downloadCount: 450,
    views: 1200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s3-web',
    title: 'Web Development Basics',
    description: 'HTML, CSS, and JS. Start building your first website with these simple notes.',
    branch: 'Information Technology',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0ia4KnZ3',
    author: 'CodeWithHarry',
    uploaderId: 'system',
    downloadCount: 890,
    views: 2500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 4 ---
  {
    id: 'it-s4-ds',
    title: 'Data Structures & Algorithms',
    description: 'Advanced data structures like Trees, Graphs, and Hashing.',
    branch: 'Computer Science & Engineering',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9ahIiruHhsRRPIvUvsq8Zt1l',
    author: 'CodeWithHarry',
    uploaderId: 'system',
    downloadCount: 1200,
    views: 4000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s4-de',
    title: 'Digital Electronics & Logic Design',
    description: 'Binary logic, K-maps, and Circuit Design simplified for exam prep.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 670,
    views: 1500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 5 ---
  {
    id: 'it-s5-os',
    title: 'Operating Systems (Detailed)',
    description: 'Process Management, Scheduling, and Memory. Every core concept covered.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbJDcyTC2m2hOn90z9B4',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 2200,
    views: 5500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-dbms',
    title: 'Database Management Systems',
    description: 'SQL, Normalization, and ER Diagrams. Perfect for IT/CSE 5th semester.',
    branch: 'Computer Science & Engineering',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8KuIs_zxlBYWCPWT7',
    author: 'Knowledge Gate',
    uploaderId: 'system',
    downloadCount: 1800,
    views: 4200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 6 ---
  {
    id: 'it-s6-ai',
    title: 'Artificial Intelligence',
    description: 'Searching, Logic, and Neural Network basics for beginners.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5n5nmfSIZ',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 950,
    views: 2800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-cn',
    title: 'Computer Networks',
    description: 'TCP/IP, OSI layers, and simple networking protocols.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 1400,
    views: 3900,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 7 ---
  {
    id: 'it-s7-ml',
    title: 'Machine Learning',
    description: 'Supervised and Unsupervised learning. The best guide for 7th sem projects.',
    branch: 'Computer Science & Engineering',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Krish Naik',
    uploaderId: 'system',
    downloadCount: 1500,
    views: 4500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s7-compiler',
    title: 'Compiler Design',
    description: 'Lexical analysis, Parsing, and Code Generation explained simply.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRj666872aR-H7mRz3u5S8Fk',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 600,
    views: 1800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 8 ---
  {
    id: 'it-s8-bigdata',
    title: 'Big Data Analysis',
    description: 'Hadoop, MapReduce, and massive data processing for 8th sem students.',
    branch: 'Information Technology',
    semester: 8,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PL9ooVrP1hQOGHNaCT7_fwe9AabjZI1RjI',
    author: 'Edureka',
    uploaderId: 'system',
    downloadCount: 500,
    views: 1200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s8-wireless',
    title: 'Wireless Communication',
    description: '5G, Wi-Fi protocols, and mobile network architectures.',
    branch: 'Information Technology',
    semester: 8,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLV8vIYTIdSnZ6_3vQj9zE6x_R29b0f7sH',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 340,
    views: 900,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
