import { Branch, MaterialType, Semester, StudyMaterial } from './types';

export const BRANCHES: Branch[] = [
  'Information Technology',
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Electronics & Communication Engineering',
  'Metallurgical & Materials Engineering',
  'Common to All'
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

// A reliable sample PDF for testing purposes
const SAMPLE_PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

/**
 * Generates the common 1st year syllabus (Sem 1 & 2) for all branches.
 */
const generateFirstYearSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();

  // Create core common subjects as "Common to All"
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
      id: `common-s1-${sub.id}`,
      title: `${sub.title} (${sub.id})`,
      description: `Foundation course required for all first-year NIT Srinagar students.`,
      branch: 'Common to All',
      semester: 1,
      type: sub.type as MaterialType,
      fileUrl: sub.type === 'YouTube Playlist' ? 'https://www.youtube.com/playlist?list=PLg49R-X49HjQvBf6_S9i9Z_wYq2fKx6_y' : SAMPLE_PDF_URL,
      author: 'NIT Srinagar Faculty',
      uploaderId: 'system',
      downloadCount: 45,
      views: 120,
      status: 'approved',
      createdAt: now
    });
  });

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
      id: `common-s2-${sub.id}`,
      title: `${sub.title} (${sub.id})`,
      description: `Foundation course for all second semester students.`,
      branch: 'Common to All',
      semester: 2,
      type: sub.type as MaterialType,
      fileUrl: sub.type === 'YouTube Playlist' ? 'https://www.youtube.com/playlist?list=PLg49R-X49HjQvBf6_S9i9Z_wYq2fKx6_y' : SAMPLE_PDF_URL,
      author: 'NIT Srinagar Faculty',
      uploaderId: 'system',
      downloadCount: 32,
      views: 89,
      status: 'approved',
      createdAt: now
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
    { sem: 3, id: 'CET-201', title: 'Introduction to Chemical Engineering' },
    { sem: 3, id: 'CET-202', title: 'Material and Energy Balance' },
    { sem: 3, id: 'CET-203', title: 'Process Fluid Mechanics' },
    { sem: 4, id: 'CET-251', title: 'Heat Transfer' },
    { sem: 5, id: 'CET-306', title: 'Chemical Reaction Engineering' },
  ];

  subjects.forEach(sub => {
    materials.push({
      id: `chem-${sub.sem}-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      description: `Academic course for Chemical Engineering, Semester ${sub.sem}.`,
      branch,
      semester: sub.sem as Semester,
      type: 'Note',
      fileUrl: SAMPLE_PDF_URL,
      author: 'Dept of Chemical Engineering',
      uploaderId: 'system',
      downloadCount: 15,
      views: 40,
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
      { sem: 3, id: 'CST201', title: 'Data Structures' },
      { sem: 4, id: 'CST251', title: 'Database Management Systems' },
      { sem: 5, id: 'CST301', title: 'Operating Systems' },
    ];

    subjects.forEach(sub => {
      materials.push({
        id: `${branch.substring(0,2).toLowerCase()}-${sub.sem}-${sub.id.toLowerCase()}`,
        title: `${sub.title} (${sub.id})`,
        description: `Academic course for ${branch}, Semester ${sub.sem}.`,
        branch,
        semester: sub.sem as Semester,
        type: 'Note',
        fileUrl: SAMPLE_PDF_URL,
        author: 'NIT Srinagar Faculty',
        uploaderId: 'system',
        downloadCount: 50,
        views: 110,
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
