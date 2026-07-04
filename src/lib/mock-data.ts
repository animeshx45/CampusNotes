
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
  {
    id: 'yt-it-s1',
    title: 'C Programming for Beginners',
    description: 'Learn C programming from zero. Great for your first semester IT lab and theory.',
    branch: 'Information Technology',
    semester: 1,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhX6r2uhhlubu67yE9z27KT',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 1200,
    views: 5000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s3',
    title: 'Data Structures & Algorithms',
    description: 'Master arrays, linked lists, and trees. Essential for your 3rd semester core exams.',
    branch: 'Information Technology',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ',
    author: 'Apna College',
    uploaderId: 'system',
    downloadCount: 2500,
    views: 8000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s4',
    title: 'Operating Systems Guide',
    description: 'Easy explanations of CPU scheduling, memory management, and deadlocks.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbJDcyTC2m2hOn90z9B4',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1800,
    views: 4500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s5',
    title: 'Computer Networks Full Course',
    description: 'Understand how the internet works. Covers OSI layers and TCP/IP for your 5th semester.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 2100,
    views: 6000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s6',
    title: 'Database Management Systems (DBMS)',
    description: 'Learn SQL and database design. Very helpful for your 6th semester projects.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8KuIs_zxlBYWCPWT7',
    author: 'Knowledge Gate',
    uploaderId: 'system',
    downloadCount: 1500,
    views: 4000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s7',
    title: 'Machine Learning for Engineers',
    description: 'Introduction to AI and ML models. Perfect for your 7th semester advanced electives.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Krish Naik',
    uploaderId: 'system',
    downloadCount: 950,
    views: 3200,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
