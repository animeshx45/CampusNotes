
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
    title: 'C Programming (Core Syllabus)',
    description: 'The foundation for IT students. Covers basics to pointers. Perfect for 1st sem lab and theory.',
    branch: 'Information Technology',
    semester: 1,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhX6r2uhhlubu67yE9z27KT',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 1500,
    views: 6000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s3',
    title: 'Data Structures & Algorithms (IT Core)',
    description: 'Master arrays, linked lists, and sorting. Essential for 3rd sem exams and placements.',
    branch: 'Information Technology',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ',
    author: 'Apna College',
    uploaderId: 'system',
    downloadCount: 3000,
    views: 12000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s4',
    title: 'Operating Systems (Sem 4)',
    description: 'Complete guide to CPU scheduling, memory management, and file systems.',
    branch: 'Information Technology',
    semester: 4,
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
    id: 'yt-it-s5',
    title: 'Computer Networks (Sem 5)',
    description: 'Understand the internet. Covers TCP/IP, OSI layers, and socket programming basics.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 2800,
    views: 9000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s6',
    title: 'DBMS & SQL (Sem 6)',
    description: 'Learn database design and SQL queries. Very helpful for IT projects and core exams.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8KuIs_zxlBYWCPWT7',
    author: 'Knowledge Gate',
    uploaderId: 'system',
    downloadCount: 1900,
    views: 4800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-it-s7',
    title: 'Machine Learning (IT Advanced)',
    description: 'Introduction to AI models and data science. Great for 7th sem advanced electives.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Krish Naik',
    uploaderId: 'system',
    downloadCount: 1100,
    views: 3500,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
