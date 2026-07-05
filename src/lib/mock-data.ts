
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
const generateFirstYearSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();

  BRANCHES.forEach(branch => {
    // --- SEMESTER 1 ---
    const sem1Common = [
      { id: 'HSIR11', title: 'English for Communication (Theory + Lab)', desc: 'Academic English and communication skills.' },
      { id: 'MAIR11', title: 'Matrices and Calculus', desc: 'Linear algebra and foundational calculus.' },
      { id: 'CHIR11', title: 'Chemistry', desc: 'Engineering chemistry principles.' },
      { id: 'EEIR11', title: 'Basics of Electrical & Electronics Engineering', desc: 'Intro to circuits and devices.' },
      { id: 'MEIR12', title: 'Engineering Graphics', desc: 'Design principles and CAD basics.' },
      { id: 'CHIR12', title: 'Chemistry Lab', desc: 'Practical chemical analysis.' }
    ];

    sem1Common.forEach(sub => {
      materials.push({
        id: `s1-${branch.toLowerCase().replace(/ /g, '-')}-${sub.id}`,
        title: `${sub.title} (${sub.id})`,
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
        createdAt: now
      });
    });

    // Sem 1 Branch Specific Intro
    let introCourse = null;
    if (branch === 'Chemical Engineering') introCourse = { id: 'CLIR15', title: 'Intro to Chemical Engineering' };
    if (branch === 'Civil Engineering') {
      introCourse = { id: 'CEIR15', title: 'Intro to Civil Engineering' };
      // Extra for CE
      materials.push({
        id: `s1-ce-meir11`,
        title: 'Basics of Mechanical Engineering (MEIR11)',
        description: 'Fundamental mechanical concepts for civil engineers.',
        branch: 'Civil Engineering',
        semester: 1,
        type: 'Note',
        fileUrl: '',
        author: 'Mech Dept Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    }
    if (branch === 'Mechanical Engineering') introCourse = { id: 'MEIR15', title: 'Intro to Mechanical Engineering' };
    if (branch === 'Metallurgical & Materials Engineering') introCourse = { id: 'MTIR15', title: 'Intro to Metallurgical & Materials Engineering' };

    if (introCourse) {
      materials.push({
        id: `s1-${branch.toLowerCase().replace(/ /g, '-')}-${introCourse.id}`,
        title: `${introCourse.title} (${introCourse.id})`,
        description: `Introduction to the principles of ${branch}.`,
        branch,
        semester: 1,
        type: 'Note',
        fileUrl: '',
        author: 'Department Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    }

    // --- SEMESTER 2 ---
    const sem2Common = [
      { id: 'MAIR21', title: 'Complex Analysis & Differential Equations', desc: 'Advanced math for engineering modeling.' },
      { id: 'PHIR11', title: 'Physics', desc: 'Core engineering physics.' },
      { id: 'CSIR12', title: 'Intro to Computer Programming (Theory + Lab)', desc: 'C Programming and logic building.' },
      { id: 'ENIR11', title: 'Energy & Environmental Engineering', desc: 'Sustainability and energy systems.' },
      { id: 'PRIR11', title: 'Engineering Practice', desc: 'Hands-on workshop skills.' },
      { id: 'PHIR12', title: 'Physics Lab', desc: 'Physics experimental work.' }
    ];

    sem2Common.forEach(sub => {
      materials.push({
        id: `s2-${branch.toLowerCase().replace(/ /g, '-')}-${sub.id}`,
        title: `${sub.title} (${sub.id})`,
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
        createdAt: now
      });
    });

    // Sem 2 Branch Specific
    if (['Chemical Engineering', 'Mechanical Engineering', 'Metallurgical & Materials Engineering'].includes(branch)) {
      materials.push({
        id: `s2-${branch.toLowerCase().replace(/ /g, '-')}-ceir11`,
        title: 'Basics of Civil Engineering (CEIR11)',
        description: 'Fundamental civil engineering concepts for other branches.',
        branch,
        semester: 2,
        type: 'Note',
        fileUrl: '',
        author: 'Civil Dept Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    }

    let coreCourse = null;
    if (branch === 'Chemical Engineering') coreCourse = { id: 'CLPC11', title: 'Process Calculations' };
    if (branch === 'Civil Engineering') coreCourse = { id: 'CEPC10', title: 'Engineering Mechanics' };
    if (branch === 'Mechanical Engineering') coreCourse = { id: 'MEPC10', title: 'Engineering Mechanics' };
    if (branch === 'Metallurgical & Materials Engineering') coreCourse = { id: 'MTPC11', title: 'Metallurgical Thermodynamics & Kinetics' };

    if (coreCourse) {
      materials.push({
        id: `s2-${branch.toLowerCase().replace(/ /g, '-')}-${coreCourse.id}`,
        title: `${coreCourse.title} (${coreCourse.id})`,
        description: `Major core subject for ${branch}.`,
        branch,
        semester: 2,
        type: 'Note',
        fileUrl: '',
        author: 'Department Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    }
  });

  return materials;
};

// Chemical Engineering Syllabus (Sem 3-8)
const generateChemicalEngineeringSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();
  const branch = 'Chemical Engineering';

  const chemicalSyllabus = [
    // Sem 3
    { sem: 3, id: 'CET-201', title: 'Introduction to Chemical Engineering' },
    { sem: 3, id: 'CET-202', title: 'Material and Energy Balance' },
    { sem: 3, id: 'CET-203', title: 'Process Fluid Mechanics' },
    { sem: 3, id: 'CET-204', title: 'Thermodynamics & Chemical Kinetics' },
    { sem: 3, id: 'ECT-205', title: 'Basic Electronics Engineering' },
    { sem: 3, id: 'HST-201', title: 'Ethics & Self Awareness' },
    { sem: 3, id: 'MAT-201', title: 'Chemical Engineering Mathematics-I' },
    // Sem 4
    { sem: 4, id: 'CET-250', title: 'Chemical Engineering Thermodynamics' },
    { sem: 4, id: 'CET-251', title: 'Heat Transfer' },
    { sem: 4, id: 'CET-252', title: 'Mechanical Operations' },
    { sem: 4, id: 'CET-253', title: 'Material Science & Technology' },
    { sem: 4, id: 'CET-254', title: 'Process Instrumentation' },
    { sem: 4, id: 'MAT-250', title: 'Chemical Engineering Mathematics-II' },
    { sem: 4, id: 'CEL-255', title: 'Fluid Mechanics & Mechanical Operations Lab' },
    { sem: 4, id: 'ECL-256', title: 'Basic Electronics Engineering Lab' },
    // Sem 5
    { sem: 5, id: 'CET-305', title: 'Process Equipment Design-I' },
    { sem: 5, id: 'CET-306', title: 'Chemical Reaction Engineering' },
    { sem: 5, id: 'CET-307', title: 'Mass Transfer-I' },
    { sem: 5, id: 'CET-308', title: 'Chemical Technology-I' },
    { sem: 5, id: 'HST-309', title: 'Basic Management Principles' },
    { sem: 5, id: 'MAT-310', title: 'Numerical Methods' },
    { sem: 5, id: 'CEL-311', title: 'Heat Transfer Lab' },
    { sem: 5, id: 'CEL-312', title: 'Computer Simulation Lab' },
    // Sem 6
    { sem: 6, id: 'CET-355', title: 'Process Equipment Design-II' },
    { sem: 6, id: 'CET-356', title: 'Mass Transfer-II' },
    { sem: 6, id: 'CET-357', title: 'Chemical Technology-II' },
    { sem: 6, id: 'CET-358', title: 'Energy Technology' },
    { sem: 6, id: 'CET-359', title: 'Chemical Process Safety' },
    { sem: 6, id: 'CET-360', title: 'Transport Phenomena' },
    { sem: 6, id: 'CEL-361', title: 'Energy Technology Lab' },
    { sem: 6, id: 'CEL-362', title: 'Thermodynamics & Reaction Engineering Lab' },
    // Sem 7
    { sem: 7, id: 'CET-415', title: 'Process Dynamics & Control' },
    { sem: 7, id: 'CET-416', title: 'Process Economics & Plant Design' },
    { sem: 7, id: 'CET-417', title: 'Biochemical Engineering' },
    { sem: 7, id: 'CEL-418', title: 'Process Dynamics & Control Lab' },
    { sem: 7, id: 'CEL-419', title: 'Mass Transfer Lab' },
    // Sem 8
    { sem: 8, id: 'CET-465', title: 'Bioresource Technology' },
    { sem: 8, id: 'CEL-466', title: 'Biochemical Engineering Lab' },
    { sem: 8, id: 'CET-467', title: 'Modeling & Simulation of Chemical Process Systems' },
    { sem: 8, id: 'CET-468', title: 'Industrial Pollution Abatement' },
  ];

  chemicalSyllabus.forEach(item => {
    materials.push({
      id: `chem-${item.sem}-${item.id.toLowerCase()}`,
      title: `${item.title} (${item.id})`,
      description: `Core academic resource for Chemical Engineering students in semester ${item.sem}.`,
      branch,
      semester: item.sem as Semester,
      type: item.id.includes('L-') ? 'Lab Manual' : 'Note',
      fileUrl: '',
      author: 'Dept of Chemical Engineering',
      uploaderId: 'system',
      downloadCount: 0,
      views: 0,
      status: 'approved',
      createdAt: now
    });
  });

  return materials;
};

export const MOCK_MATERIALS: StudyMaterial[] = [
  ...generateFirstYearSyllabus(),
  ...generateChemicalEngineeringSyllabus(),
  // IT & CSE Core Subjects (Sem 3-8)
  {
    id: 'it-s3-oop',
    title: 'Object Oriented Programming (CST201)',
    description: 'Classes, Objects, Inheritance and Polymorphism in C++.',
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
    description: 'SQL, Normalization, and Transaction Control.',
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
  {
    id: 'cse-s5-os',
    title: 'Operating Systems (CST302)',
    description: 'Process management, Memory management, and File systems.',
    branch: 'Computer Science & Engineering',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donxtWsi5OzBn690wz-',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 900,
    views: 2800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-s6-ai',
    title: 'Artificial Intelligence (CST351)',
    description: 'Search algorithms, Knowledge representation, and Intro to ML.',
    branch: 'Information Technology',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5n5hlFi7j',
    author: 'Gate Smashers',
    uploaderId: 'system',
    downloadCount: 300,
    views: 1100,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
