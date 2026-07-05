
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

/**
 * Generates the common 1st year syllabus (Sem 1 & 2) for all branches.
 * These are the same across all departments at NIT Srinagar.
 */
const generateFirstYearSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();

  BRANCHES.forEach(branch => {
    // --- SEMESTER 1 ---
    const sem1Common = [
      { id: 'HSIR11', title: 'English for Communication', type: 'Note' },
      { id: 'MAIR11', title: 'Matrices and Calculus', type: 'Note' },
      { id: 'CHIR11', title: 'Chemistry', type: 'Note' },
      { id: 'EEIR11', title: 'Basics of Electrical & Electronics Engineering', type: 'Note' },
      { id: 'MEIR12', title: 'Engineering Graphics', type: 'Note' },
      { id: 'CHIR12', title: 'Chemistry Lab', type: 'Lab Manual' }
    ];

    sem1Common.forEach(sub => {
      materials.push({
        id: `s1-${branch.toLowerCase().replace(/ /g, '-')}-${sub.id}`,
        title: `${sub.title} (${sub.id})`,
        description: `Common foundation course for first-year students.`,
        branch,
        semester: 1,
        type: sub.type as MaterialType,
        fileUrl: '',
        author: 'NIT Srinagar Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    });

    // Branch specific Intro for Sem 1
    if (branch === 'Civil Engineering') {
      materials.push({
        id: `s1-ce-meir11`,
        title: 'Basics of Mechanical Engineering (MEIR11)',
        description: 'Mechanical foundations for civil engineers.',
        branch: 'Civil Engineering',
        semester: 1,
        type: 'Note',
        fileUrl: '',
        author: 'Dept of ME',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    }

    // --- SEMESTER 2 ---
    const sem2Common = [
      { id: 'MAIR21', title: 'Complex Analysis & Differential Equations', type: 'Note' },
      { id: 'PHIR11', title: 'Physics', type: 'Note' },
      { id: 'CSIR12', title: 'Intro to Computer Programming', type: 'Note' },
      { id: 'ENIR11', title: 'Energy & Environmental Engineering', type: 'Note' },
      { id: 'PRIR11', title: 'Engineering Practice', type: 'Lab Manual' },
      { id: 'PHIR12', title: 'Physics Lab', type: 'Lab Manual' }
    ];

    sem2Common.forEach(sub => {
      materials.push({
        id: `s2-${branch.toLowerCase().replace(/ /g, '-')}-${sub.id}`,
        title: `${sub.title} (${sub.id})`,
        description: `Foundation course for second semester students.`,
        branch,
        semester: 2,
        type: sub.type as MaterialType,
        fileUrl: '',
        author: 'NIT Srinagar Faculty',
        uploaderId: 'system',
        downloadCount: 0,
        views: 0,
        status: 'approved',
        createdAt: now
      });
    });
  });

  return materials;
};

/**
 * Generates the Chemical Engineering syllabus for Sem 3-8.
 */
const generateChemicalSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();
  const branch = 'Chemical Engineering';

  const subjects = [
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
    // Sem 5
    { sem: 5, id: 'CET-305', title: 'Process Equipment Design-I' },
    { sem: 5, id: 'CET-306', title: 'Chemical Reaction Engineering' },
    { sem: 5, id: 'CET-307', title: 'Mass Transfer-I' },
    { sem: 5, id: 'CET-308', title: 'Chemical Technology-I' },
    // Sem 6
    { sem: 6, id: 'CET-355', title: 'Process Equipment Design-II' },
    { sem: 6, id: 'CET-356', title: 'Mass Transfer-II' },
    { sem: 6, id: 'CET-357', title: 'Chemical Technology-II' },
    { sem: 6, id: 'CET-358', title: 'Energy Technology' },
    { sem: 6, id: 'CET-360', title: 'Transport Phenomena' },
    // Sem 7
    { sem: 7, id: 'CET-415', title: 'Process Dynamics & Control' },
    { sem: 7, id: 'CET-416', title: 'Process Economics & Plant Design' },
    { sem: 7, id: 'CET-417', title: 'Biochemical Engineering' },
    // Sem 8
    { sem: 8, id: 'CET-465', title: 'Bioresource Technology' },
    { sem: 8, id: 'CET-467', title: 'Modeling & Simulation of Chemical Systems' },
    { sem: 8, id: 'CET-468', title: 'Industrial Pollution Abatement' },
  ];

  subjects.forEach(sub => {
    materials.push({
      id: `chem-${sub.sem}-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      description: `Academic course for Chemical Engineering, Semester ${sub.sem}.`,
      branch,
      semester: sub.sem as Semester,
      type: sub.id.startsWith('CEL') ? 'Lab Manual' : 'Note',
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

/**
 * Generates the IT and CSE syllabus for Sem 3-8.
 */
const generateITCSESyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();

  const branches: Branch[] = ['Information Technology', 'Computer Science & Engineering'];

  branches.forEach(branch => {
    const subjects = [
      // Sem 3
      { sem: 3, id: 'CST201', title: 'Data Structures' },
      { sem: 3, id: 'CST202', title: 'Discrete Mathematics' },
      { sem: 3, id: 'CST203', title: 'Object Oriented Programming' },
      // Sem 4
      { sem: 4, id: 'CST251', title: 'Database Management Systems' },
      { sem: 4, id: 'CST252', title: 'Theory of Computation' },
      { sem: 4, id: 'CST253', title: 'Software Engineering' },
      // Sem 5
      { sem: 5, id: 'CST301', title: 'Operating Systems' },
      { sem: 5, id: 'CST302', title: 'Design & Analysis of Algorithms' },
      { sem: 5, id: 'CST303', title: 'Computer Organization' },
      // Sem 6
      { sem: 6, id: 'CST351', title: 'Computer Networks' },
      { sem: 6, id: 'CST352', title: 'Artificial Intelligence' },
      { sem: 6, id: 'CST353', title: 'Compiler Design' },
      // Sem 7
      { sem: 7, id: 'CST401', title: 'Cloud Computing' },
      { sem: 7, id: 'CST402', title: 'Cyber Security' },
      { sem: 7, id: 'CST403', title: 'Machine Learning' },
      // Sem 8
      { sem: 8, id: 'CST451', title: 'Big Data Analytics' },
      { sem: 8, id: 'CST452', title: 'Internet of Things' },
      { sem: 8, id: 'CST453', title: 'Neural Networks' },
    ];

    subjects.forEach(sub => {
      materials.push({
        id: `${branch.substring(0,2).toLowerCase()}-${sub.sem}-${sub.id.toLowerCase()}`,
        title: `${sub.title} (${sub.id})`,
        description: `Academic course for ${branch}, Semester ${sub.sem}.`,
        branch,
        semester: sub.sem as Semester,
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
  });

  return materials;
};

export const MOCK_MATERIALS: StudyMaterial[] = [
  ...generateFirstYearSyllabus(),
  ...generateChemicalSyllabus(),
  ...generateITCSESyllabus()
];
