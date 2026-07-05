
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
  // --- SEMESTER 3 (Based on CSE Scheme) ---
  {
    id: 'it-s3-oop',
    title: 'Object Oriented Programming (CST201)',
    description: 'Learn Classes, Objects, and Inheritance. This is a core 3rd semester subject for IT and CSE.',
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
    description: 'Master SQL, ER-Diagrams, and Normalization. Essential for backend development.',
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
  {
    id: 'it-s3-se',
    title: 'Software Engineering (CST205)',
    description: 'SDLC models, Agile, and Software Testing fundamentals.',
    branch: 'Information Technology',
    semester: 3,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/software/1200/1600',
    author: 'Animesh Kumar',
    uploaderId: 'system',
    downloadCount: 300,
    views: 900,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cse-s3-dm',
    title: 'Discrete Mathematics (MAT207)',
    description: 'Sets, Relations, Functions, and Graph Theory for computer scientists.',
    branch: 'Computer Science & Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLf5f_hV6V0S3',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 720,
    views: 1800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 4 (Based on CSE Scheme) ---
  {
    id: 'it-s4-ds',
    title: 'Data Structures (CST250)',
    description: 'Crucial subject covering Stacks, Queues, Linked Lists, Trees, and Graphs.',
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
    id: 'cse-s4-iwt',
    title: 'Internet & Web Technologies (CST252)',
    description: 'Full stack development notes: HTML, CSS, JS, and PHP.',
    branch: 'Computer Science & Engineering',
    semester: 4,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/webtech/1200/1600',
    author: 'Animesh Kumar',
    uploaderId: 'system',
    downloadCount: 900,
    views: 2200,
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
  {
    id: 'cse-s4-deld',
    title: 'Digital Electronics & Logic Design (ECT251)',
    description: 'Logic gates, Boolean algebra, and Sequential Circuits.',
    branch: 'Computer Science & Engineering',
    semester: 4,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/digital/1200/1600',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 850,
    views: 2100,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s4-stats',
    title: 'Probability & Statistics (MAT217)',
    description: 'Distributions, Hypothesis Testing, and Statistical Analysis for Engineers.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLU6n9Vo6S2_vH0R0I-YvV1eUf6-k5f0wO',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 400,
    views: 1100,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // --- SEMESTER 5 ---
  {
    id: 'it-s5-os',
    title: 'Operating Systems',
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
    id: 'it-s5-daa',
    title: 'Design and Analysis of Algorithms',
    description: 'Sorting, Searching, Greedy, and Dynamic Programming algorithms.',
    branch: 'Information Technology',
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

  // --- SEMESTER 6 ---
  {
    id: 'it-s6-ai',
    title: 'Artificial Intelligence',
    description: 'Heuristic Search, Machine Learning basics, and Logic programming.',
    branch: 'Information Technology',
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
    id: 'cse-s6-networks',
    title: 'Computer Networks',
    description: 'OSI Model, TCP/IP, Routing Algorithms, and Network Security.',
    branch: 'Computer Science & Engineering',
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
  {
    id: 'cse-s7-compiler',
    title: 'Compiler Design',
    description: 'Parsing, Syntax-Directed Translation, and Code Generation.',
    branch: 'Computer Science & Engineering',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGpx4v8Knt49Zt8G38_Y6h1',
    author: 'Knowledge Gate',
    uploaderId: 'system',
    downloadCount: 600,
    views: 1900,
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
  },
  {
    id: 'cse-s8-wireless',
    title: 'Wireless Communication',
    description: 'Cellular networks, 5G, and Wireless protocol architectures.',
    branch: 'Computer Science & Engineering',
    semester: 8,
    type: 'Note',
    fileUrl: 'https://picsum.photos/seed/wireless/1200/1600',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 300,
    views: 850,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
