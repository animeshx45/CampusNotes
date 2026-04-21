
import { StudyMaterial } from './types';

export const BRANCHES = [
  'Information Technology',
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Electronics & Communication Engineering',
  'Metallurgical & Materials Engineering'
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: 'yt-1',
    title: 'Data Structures & Algorithms - Complete Playlist',
    description: 'The famous CodeHelp DSA series by Love Babbar. Comprehensive coverage of C++, STL, and advanced algorithms for placements and exams.',
    branch: 'Computer Science & Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    author: 'CodeHelp - Love Babbar',
    fileUrl: 'https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtxdpb6fy2204nENvpDl',
    createdAt: '2024-01-01',
    downloadCount: 5000
  },
  {
    id: 'yt-2',
    title: 'Operating Systems Full Course',
    description: 'Gate Smashers OS playlist covering Process Management, Memory Management, and File Systems. Essential for GATE and semester exams.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    author: 'Gate Smashers',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donLog0dfL06qpItv3l',
    createdAt: '2024-01-02',
    downloadCount: 4200
  },
  {
    id: 'yt-3',
    title: 'Database Management Systems (DBMS)',
    description: 'Complete DBMS playlist including SQL, Normalization, and Transaction Control by Gate Smashers.',
    branch: 'Computer Science & Engineering',
    semester: 4,
    type: 'YouTube Playlist',
    author: 'Gate Smashers',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGGWpRLNI88Ot8ak4O8_i43',
    createdAt: '2024-01-03',
    downloadCount: 3800
  },
  {
    id: 'yt-4',
    title: 'Computer Networks - Comprehensive Series',
    description: 'Neso Academy CN playlist covering OSI layers, TCP/IP, and network protocols in detail.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    author: 'Neso Academy',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
    createdAt: '2024-01-04',
    downloadCount: 3100
  },
  {
    id: 'yt-5',
    title: 'Computer Organization & Architecture (COA)',
    description: 'Detailed explanation of CPU design, pipelines, and instruction sets by Gate Smashers.',
    branch: 'Computer Science & Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    author: 'Gate Smashers',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX',
    createdAt: '2024-01-05',
    downloadCount: 2900
  },
  {
    id: 'yt-6',
    title: 'Software Engineering - Full Series',
    description: 'SDLC models, Agile, and software testing concepts explained simply for university exams.',
    branch: 'Information Technology',
    semester: 5,
    type: 'YouTube Playlist',
    author: 'Gate Smashers',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKADgnMV6StH5F0iW8',
    createdAt: '2024-01-06',
    downloadCount: 2500
  },
  {
    id: 'yt-7',
    title: 'Information Security & Cryptography',
    description: 'Neso Academy playlist covering RSA, AES, digital signatures, and cyber security fundamentals.',
    branch: 'Information Technology',
    semester: 7,
    type: 'YouTube Playlist',
    author: 'Neso Academy',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgP6W0MvYVMeOqI3m0kAtu7',
    createdAt: '2024-01-07',
    downloadCount: 2100
  },
  {
    id: 'yt-8',
    title: 'Computer Graphics (CG)',
    description: 'Algorithms for line drawing, clipping, and transformations by Neso Academy.',
    branch: 'Computer Science & Engineering',
    semester: 6,
    type: 'YouTube Playlist',
    author: 'Neso Academy',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgS_0_7K0v1P922B1-W6H8a',
    createdAt: '2024-01-08',
    downloadCount: 1900
  },
  {
    id: 'yt-9',
    title: 'Network Theory / Circuit Analysis',
    description: 'Complete playlist on KVL, KCL, Network Theorems, and AC Analysis. Essential for Electrical and Electronics students.',
    branch: 'Electrical Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    author: 'Neso Academy',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRir5ruidAszSAtK6xLueT7x',
    createdAt: '2024-01-09',
    downloadCount: 1500
  },
  {
    id: 'yt-10',
    title: 'Control Systems Engineering',
    description: 'Detailed coverage of Root Locus, Bode Plots, and Nyquist Stability by Gate Smashers.',
    branch: 'Electrical Engineering',
    semester: 5,
    type: 'YouTube Playlist',
    author: 'Gate Smashers',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEonCTYstW0m_GlsxG_r_8s',
    createdAt: '2024-01-10',
    downloadCount: 1200
  },
  {
    id: 'yt-11',
    title: 'Digital Electronics / Logic Design',
    description: 'Boolean Algebra, K-Maps, Combinational and Sequential Circuits. Core subject for CSE, IT, ECE, and EE.',
    branch: 'Electronics & Communication Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    author: 'Neso Academy',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm',
    createdAt: '2024-01-11',
    downloadCount: 3500
  },
  {
    id: 'yt-12',
    title: 'Signals and Systems',
    description: 'In-depth series on Fourier Transform, Z-Transform, and LTI systems by Neso Academy.',
    branch: 'Electronics & Communication Engineering',
    semester: 4,
    type: 'YouTube Playlist',
    author: 'Neso Academy',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhG6s3jYIU48CqsT5cyiDTO',
    createdAt: '2024-01-12',
    downloadCount: 2200
  }
];
