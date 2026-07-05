
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
    title: 'Object Oriented Programming (CST201)',
    description: 'Master Classes, Objects, and Inheritance. Core 3rd semester subject for IT and CSE.',
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
    description: 'HTML, CSS, and JS fundamentals for building modern websites.',
    branch: 'Information Technology',
    semester: 3,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/webdev/1200/1600',
    author: 'NITian Body',
    uploaderId: 'system',
    downloadCount: 300,
    views: 800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 4 ---
  {
    id: 'it-s4-ds',
    title: 'Data Structures (CST250)',
    description: 'Stacks, Queues, Linked Lists, Trees, and Graphs. Very important for coding interviews.',
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
    description: 'Mathematical foundations for data science and engineering.',
    branch: 'Information Technology',
    semester: 4,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/stats/1200/1600',
    author: 'Math Dept',
    uploaderId: 'system',
    downloadCount: 400,
    views: 900,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s4-digital',
    title: 'Digital Electronics & Logic Design',
    description: 'Study of logic gates, flip-flops, and circuit minimization.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTVHIco2TCp',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 600,
    views: 1500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 5 ---
  {
    id: 'it-s5-daa',
    title: 'Design & Analysis of Algorithms',
    description: 'Advanced algorithms, Greedy, and Dynamic Programming.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkfzjtadpW96on6F_oXny',
    author: 'Abdul Bari',
    uploaderId: 'system',
    downloadCount: 2200,
    views: 5500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-os',
    title: 'Operating Systems',
    description: 'Process management, Scheduling, Deadlocks, and Memory.',
    branch: 'Information Technology',
    semester: 5,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/os-notes/1200/1600',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1800,
    views: 4000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-dbms',
    title: 'Database Management System',
    description: 'SQL, ER Modeling, and Database Internals.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGGhOHV-nwb0HR5n5nmfSIZ',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1500,
    views: 3500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-co',
    title: 'Computer Organization',
    description: 'Hardware architecture and internal components of computers.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: '',
    author: 'Standard Resource',
    uploaderId: 'system',
    downloadCount: 0,
    views: 100,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 6 ---
  {
    id: 'it-s6-ai',
    title: 'Artificial Intelligence',
    description: 'AI concepts, logic, and intelligent agents.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5n5nmfSIZ',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1200,
    views: 3200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-toc',
    title: 'Theory of Computation',
    description: 'Automata theory and formal languages.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGzK5HMTpS5eunH0jV_A9yW',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 900,
    views: 2500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-networks',
    title: 'Computer Networks',
    description: 'Networking protocols, OSI model, and security.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 2000,
    views: 4800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-java',
    title: 'Java Programming',
    description: 'Advanced Java and OOP principles.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLVlQjwv71P1V9U26L3-7L4v8k-8y7d8y0',
    author: 'Saurabh Shukla',
    uploaderId: 'system',
    downloadCount: 1400,
    views: 3600,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-graphics',
    title: 'Computer Graphics',
    description: 'Rendering, transformations, and visual algorithms.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: '',
    author: 'Faculty Notes',
    uploaderId: 'system',
    downloadCount: 100,
    views: 400,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 7 ---
  {
    id: 'it-s7-compiler',
    title: 'Compiler Design',
    description: 'Lexical analysis, parsing, and code generation.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYUsAEnkSpmqO1zC',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 800,
    views: 2200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s7-cloud',
    title: 'Cloud Computing',
    description: 'Cloud architectures, AWS, and deployment models.',
    branch: 'Information Technology',
    semester: 7,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/cloud-sem7/1200/1600',
    author: 'NITian Collective',
    uploaderId: 'system',
    downloadCount: 500,
    views: 1300,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s7-ml',
    title: 'Machine Learning',
    description: 'Supervised and unsupervised learning techniques.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Krish Naik',
    uploaderId: 'system',
    downloadCount: 1600,
    views: 4500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 8 ---
  {
    id: 'it-s8-bigdata',
    title: 'Big Data',
    description: 'Large scale data processing and analytics.',
    branch: 'Information Technology',
    semester: 8,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Standard Resource',
    uploaderId: 'system',
    downloadCount: 400,
    views: 1100,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s8-wireless',
    title: 'Wireless Communication',
    description: 'Mobile networking and wireless protocols.',
    branch: 'Information Technology',
    semester: 8,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/wireless/1200/1600',
    author: 'Dept Library',
    uploaderId: 'system',
    downloadCount: 300,
    views: 800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s8-android',
    title: 'Android Programming',
    description: 'Mobile app development for Android.',
    branch: 'Information Technology',
    semester: 8,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYh4jtL7xA4Uup6ne',
    author: 'CodeWithHarry',
    uploaderId: 'system',
    downloadCount: 900,
    views: 2400,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
