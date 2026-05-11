
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
    id: 'yt-it-1',
    title: 'Computer Networks Full Course',
    description: 'Comprehensive playlist covering OSI layers, TCP/IP, and network security basics for IT students.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 450,
    views: 1200,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-cse-1',
    title: 'Data Structures and Algorithms',
    description: 'Best resource for mastering DSA using C++. Perfect for placement preparation.',
    branch: 'Computer Science & Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ',
    author: 'Apna College',
    uploaderId: 'system',
    downloadCount: 890,
    views: 3400,
    createdAt: new Date().toISOString()
  }
];
