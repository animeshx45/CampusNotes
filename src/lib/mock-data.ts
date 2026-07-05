
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

// Helper to generate universal Sem 1 & 2 subjects for all branches
const generateCommonFirstYear = (): StudyMaterial[] => {
  const commonMaterials: StudyMaterial[] = [];
  
  BRANCHES.forEach(branch => {
    // --- SEMESTER 1 ---
    const sem1Subjects = [
      { id: 'hsir11', title: 'English for Communication (HSIR11)', desc: 'Theory and Lab for effective academic communication.' },
      { id: 'mair11', title: 'Matrices and Calculus (MAIR11)', desc: 'Fundamental math for engineering analysis.' },
      { id: 'chir11', title: 'Chemistry (CHIR11)', desc: 'General chemistry principles for engineers.' },
      { id: 'eeir11', title: 'Basics of Electrical & Electronics (EEIR11)', desc: 'Intro to circuits, components, and electronics.' },
      { id: 'meir12', title: 'Engineering Graphics (MEIR12)', desc: 'Principles of engineering drawing and CAD.' },
      { id: 'chir12', title: 'Chemistry Lab (CHIR12)', desc: 'Practical experiments in chemical analysis.' }
    ];

    sem1Subjects.forEach(sub => {
      commonMaterials.push({
        id: `${branch.toLowerCase().replace(/ /g, '-')}-s1-${sub.id}`,
        title: sub.title,
        description: sub.desc,
        branch,
        semester: 1,
        type: 'Note',
        fileUrl: '',
        author: 'NIT Srinagar Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: new Date().toISOString()
      });
    });

    // Branch specific Intro Course (Sem 1)
    let introCourse = null;
    if (branch === 'Chemical Engineering') introCourse = { id: 'clir15', title: 'Intro to Chemical Engineering (CLIR15)' };
    else if (branch === 'Civil Engineering') introCourse = { id: 'ceir15', title: 'Intro to Civil Engineering (CEIR15)' };
    else if (branch === 'Mechanical Engineering') introCourse = { id: 'meir15', title: 'Intro to Mechanical Engineering (MEIR15)' };
    else if (branch === 'Metallurgical & Materials Engineering') introCourse = { id: 'mtir15', title: 'Intro to Metallurgical Engineering (MTIR15)' };

    if (introCourse) {
      commonMaterials.push({
        id: `${branch.toLowerCase().replace(/ /g, '-')}-s1-${introCourse.id}`,
        title: introCourse.title,
        description: `Introduction to the principles and scope of ${branch}.`,
        branch,
        semester: 1,
        type: 'Note',
        fileUrl: '',
        author: 'Department Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: new Date().toISOString()
      });
    }

    // --- SEMESTER 2 ---
    const sem2Subjects = [
      { id: 'mair21', title: 'Complex Analysis & Diff Equations (MAIR21)', desc: 'Advanced calculus and differential modeling.' },
      { id: 'phir11', title: 'Physics (PHIR11)', desc: 'Engineering physics and mechanics.' },
      { id: 'csir12', title: 'Intro to Computer Programming (CSIR12)', desc: 'Basic programming concepts using C.' },
      { id: 'enir11', title: 'Energy & Environmental Engineering (ENIR11)', desc: 'Sustainability and energy systems.' },
      { id: 'prir11', title: 'Engineering Practice (PRIR11)', desc: 'Workshop practice and hands-on engineering.' },
      { id: 'phir12', title: 'Physics Lab (PHIR12)', desc: 'Practical physics experiments.' }
    ];

    sem2Subjects.forEach(sub => {
      commonMaterials.push({
        id: `${branch.toLowerCase().replace(/ /g, '-')}-s2-${sub.id}`,
        title: sub.title,
        description: sub.desc,
        branch,
        semester: 2,
        type: 'Note',
        fileUrl: '',
        author: 'NIT Srinagar Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: new Date().toISOString()
      });
    });

    // Branch specific Core (Sem 2)
    let coreCourse = null;
    if (branch === 'Chemical Engineering') coreCourse = { id: 'clpc11', title: 'Process Calculations (CLPC11)' };
    else if (branch === 'Civil Engineering') coreCourse = { id: 'cepc10', title: 'Engineering Mechanics (CEPC10)' };
    else if (branch === 'Mechanical Engineering') coreCourse = { id: 'mepc10', title: 'Engineering Mechanics (MEPC10)' };
    else if (branch === 'Metallurgical & Materials Engineering') coreCourse = { id: 'mtpc11', title: 'Metallurgical Thermodynamics (MTPC11)' };

    if (coreCourse) {
      commonMaterials.push({
        id: `${branch.toLowerCase().replace(/ /g, '-')}-s2-${coreCourse.id}`,
        title: coreCourse.title,
        description: `Fundamental core course for ${branch} students.`,
        branch,
        semester: 2,
        type: 'Note',
        fileUrl: '',
        author: 'Department Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: new Date().toISOString()
      });
    }
  });

  return commonMaterials;
};

export const MOCK_MATERIALS: StudyMaterial[] = [
  ...generateCommonFirstYear(),
  // --- IT & CSE DEPARTMENT (Comprehensive 3rd-8th Sem) ---
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
    id: 'it-s4-dbms',
    title: 'Database Management Systems (CST250)',
    description: 'SQL, Normalization, and Database Design principles.',
    branch: 'Information Technology',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8KuIsVinqnKVn67p-',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 1500,
    views: 4200,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  // Add other IT/CSE/Chemical subjects here...
  {
    id: 'chem-s3-cet201',
    title: 'CET-201: Introduction to Chemical Engineering',
    description: 'Basic principles and calculations in chemical engineering.',
    branch: 'Chemical Engineering',
    semester: 3,
    type: 'Note',
    fileUrl: '',
    author: 'Standard Faculty',
    uploaderId: 'system',
    downloadCount: 0,
    views: 0,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
