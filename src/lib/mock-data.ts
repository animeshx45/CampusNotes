
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
    id: 'cse-s3-dbms',
    title: 'Database Management Systems (CST203)',
    description: 'SQL, ER-Diagrams, and Normalization. Essential for backend development.',
    branch: 'Computer Science & Engineering',
    semester: 3,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/dbms/1200/1600',
    author: 'Knowledge Gate',
    uploaderId: 'system',
    downloadCount: 560,
    views: 1500,
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
    id: 'it-s4-toc',
    title: 'Theory of Computation (CST253)',
    description: 'Automata Theory, Finite State Machines, and Grammars.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGzK5HMTpS5eunH0jV_A9yW',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 500,
    views: 1400,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 5 ---
  {
    id: 'cse-s5-daa',
    title: 'Design & Analysis of Algorithms (CST306)',
    description: 'Sorting, Searching, Greedy, and Dynamic Programming. Analysis of time and space complexity.',
    branch: 'Computer Science & Engineering',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkfzjtadpW96on6F_oXny',
    author: 'Abdul Bari',
    uploaderId: 'system',
    downloadCount: 2500,
    views: 6000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-os',
    title: 'Operating Systems (CST309)',
    description: 'Process management, Scheduling, Deadlocks, and Memory management.',
    branch: 'Information Technology',
    semester: 5,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/os/1200/1600',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 2000,
    views: 4500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cse-s5-mp',
    title: 'Microprocessor (CST307)',
    description: 'Study of 8085 and 8086 architectures and assembly language programming.',
    branch: 'Computer Science & Engineering',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiw8V-N_mHeUizP5z_mFhY1',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 1200,
    views: 3000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s5-python',
    title: 'Python Programming (CST310)',
    description: 'Learning Python from basics to advanced concepts for software development.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agICnT8L9zKWQqTuLxz96mG',
    author: 'CodeWithHarry',
    uploaderId: 'system',
    downloadCount: 1800,
    views: 5000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 6 ---
  {
    id: 'cse-s6-ai',
    title: 'Artificial Intelligence (CST354)',
    description: 'Heuristic Search, Machine Learning basics, and Logic programming.',
    branch: 'Computer Science & Engineering',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5n5nmfSIZ',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1100,
    views: 3000,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-networks',
    title: 'Computer Networks (CST356)',
    description: 'OSI Model, TCP/IP, Routing Algorithms, and Network Security.',
    branch: 'Information Technology',
    semester: 6,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/networks/1200/1600',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 1500,
    views: 3800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cse-s6-coa',
    title: 'Computer Organization & Architecture (CST358)',
    description: 'Understanding computer hardware, ALU, CPU, and instruction sets.',
    branch: 'Computer Science & Engineering',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1300,
    views: 3200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-java',
    title: 'Java Programming (CST359)',
    description: 'Advanced Java concepts, Swing, AWT, and Collections framework.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLVlQjwv71P1V9U26L3-7L4v8k-8y7d8y0',
    author: 'Saurabh Shukla',
    uploaderId: 'system',
    downloadCount: 1600,
    views: 4200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 7 ---
  {
    id: 'it-s7-cloud',
    title: 'Cloud Computing',
    description: 'AWS, Virtualization, and Distributed Systems concepts.',
    branch: 'Information Technology',
    semester: 7,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/cloud/1200/1600',
    author: 'Animesh Kumar',
    uploaderId: 'system',
    downloadCount: 400,
    views: 1200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 8 ---
  {
    id: 'it-s8-bigdata',
    title: 'Big Data & Hadoop',
    description: 'MapReduce, Spark, and Massive data processing technologies.',
    branch: 'Information Technology',
    semester: 8,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJknxjK3nx7p5mD8e',
    author: 'Edureka',
    uploaderId: 'system',
    downloadCount: 450,
    views: 1300,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
