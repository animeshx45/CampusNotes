
import { StudyMaterial, Branch } from './types';

export const BRANCHES: Branch[] = [
  'Information Technology',
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Electronics & Communication Engineering'
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms Notes',
    description: 'Comprehensive notes covering Linked Lists, Stacks, Queues, and Trees with examples in C++.',
    branch: 'Computer Science & Engineering',
    semester: 3,
    type: 'Note',
    author: 'Aadil Hussain',
    fileUrl: '#',
    createdAt: '2024-02-15',
    downloadCount: 145
  },
  {
    id: '2',
    title: 'Thermodynamics Problem Set',
    description: 'Selected problems from previous semester exams on Heat Engines and Entropy.',
    branch: 'Mechanical Engineering',
    semester: 4,
    type: 'Assignment',
    author: 'Sadaf Jan',
    fileUrl: '#',
    createdAt: '2024-03-01',
    downloadCount: 89
  },
  {
    id: '3',
    title: 'Network Analysis Question Paper',
    description: 'End-semester question paper for the session 2022-2023.',
    branch: 'Electrical Engineering',
    semester: 4,
    type: 'Previous Year Paper',
    author: 'Muneeb Ahmad',
    fileUrl: '#',
    createdAt: '2024-01-20',
    downloadCount: 210
  },
  {
    id: '4',
    title: 'Operating Systems Lab Manual',
    description: 'Manual for OS Lab covering basic Linux commands and process scheduling algorithms.',
    branch: 'Information Technology',
    semester: 5,
    type: 'Lab Manual',
    author: 'Zaid Bin Tariq',
    fileUrl: '#',
    createdAt: '2023-11-12',
    downloadCount: 76
  }
];
