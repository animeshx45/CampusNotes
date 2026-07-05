
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
    title: 'Object Oriented Programming Structure (OOPS)',
    description: 'Learn Classes, Objects, and Polymorphism. Based on the 2023 core curriculum.',
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
    title: 'Web Development Materials',
    description: 'Complete guide for HTML, CSS, and JS. Essential for the IT/CSE department.',
    branch: 'Information Technology',
    semester: 3,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/webnotes/1200/1600',
    author: 'Animesh Kumar',
    uploaderId: 'system',
    downloadCount: 890,
    views: 2500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 4 ---
  {
    id: 'it-s4-ds',
    title: 'Data Structure (CSE/IT/ECE)',
    description: 'Covers Trees, Graphs, and Algorithms. Crucial for semester exams.',
    branch: 'Information Technology',
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
    id: 'it-s4-prob',
    title: 'Probability and Statistics',
    description: 'Math notes covering Distributions, Mean, and Variance.',
    branch: 'Information Technology',
    semester: 4,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/mathnotes/1200/1600',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 300,
    views: 800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 5 ---
  {
    id: 'it-s5-os',
    title: 'Operating System',
    description: 'Notes on Process Management and Memory. Matches the 2023 syllabus.',
    branch: 'Information Technology',
    semester: 5,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/osnotes/1200/1600',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 2200,
    views: 5500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-dbms',
    title: 'Data Base Management System',
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
  {
    id: 'it-s5-algo',
    title: 'Design and Analysis of Algorithms (CSE/IT)',
    description: 'Advanced algorithms notes including Dynamic Programming.',
    branch: 'Information Technology',
    semester: 5,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/algonotes/1200/1600',
    author: 'Abdul Bari',
    uploaderId: 'system',
    downloadCount: 2500,
    views: 6000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 6 ---
  {
    id: 'it-s6-ai',
    title: 'Artificial Intelligence',
    description: 'Syllabus covering Heuristic Search and Logic.',
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
    description: 'Notes on OSI layers, TCP/IP, and Protocols.',
    branch: 'Information Technology',
    semester: 6,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/networknotes/1200/1600',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 1400,
    views: 3900,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 7 ---
  {
    id: 'it-s7-compiler',
    title: 'Compiler Design',
    description: 'Detailed lecture notes on Lexical and Syntax analysis.',
    branch: 'Information Technology',
    semester: 7,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/compilernotes/1200/1600',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 600,
    views: 1800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s7-cloud',
    title: 'Cloud Computing',
    description: 'Virtualization, AWS, and Cloud service models.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Edureka',
    uploaderId: 'system',
    downloadCount: 400,
    views: 1100,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 8 ---
  {
    id: 'it-s8-wireless',
    title: 'Wireless Communication',
    description: 'Mobile networking and 5G concepts.',
    branch: 'Information Technology',
    semester: 8,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/wirelessnotes/1200/1600',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 340,
    views: 900,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s8-bigdata',
    title: 'Big Data',
    description: 'Hadoop and massive data processing notes.',
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
  }
];
