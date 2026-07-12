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
  'YouTube Playlist',
  'Folder'
];

// A reliable sample PDF for testing purposes
const SAMPLE_PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf';

/**
 * Generates the common 1st year syllabus (Sem 1 & 2) for all branches.
 */
const generateFirstYearSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();

  // Create core common subjects as "Common to All"
  const sem1Common = [
    { id: 'MET:101', title: 'Elements of Mechanical Engineering', type: 'Note' },
    { id: 'PHT:101', title: 'Engineering Physics', type: 'Note' },
    { id: 'HST:101', title: 'Basic English and Communication Skills', type: 'Note' },
    { id: 'CVT:101', title: 'Engineering Mechanics', type: 'Note' },
    { id: 'EET:101', title: 'Basic Electrical Engineering', type: 'Note' },
    { id: 'HSL:101', title: 'English Language Lab', type: 'Lab Manual' },
    { id: 'PHL:101', title: 'Engineering & Applied Physics Laboratory', type: 'Lab Manual' },
    { id: 'WSL:101', title: 'Workshop Practice', type: 'Lab Manual' }
  ];

  sem1Common.forEach(sub => {
    materials.push({
      id: `common-s1-${sub.id.toLowerCase().replace(':', '-')}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Foundation course required for all first-year NIT Srinagar students.`,
      branch: 'Common to All',
      semester: 1,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
      author: 'NIT Srinagar Faculty',
      uploaderId: 'system',
      downloadCount: 45,
      views: 120,
      status: 'approved',
      createdAt: now
    });
  });

  const sem2Common = [
    { id: 'CHT:101', title: 'Engineering Chemistry', type: 'Note' },
    { id: 'CHL:101', title: 'Chemistry Laboratory', type: 'Lab Manual' },
    { id: 'CHT:102', title: 'Environmental Studies', type: 'Note' },
    { id: 'CVT:102', title: 'Engineering Drawing', type: 'Note' },
    { id: 'ITT:101', title: 'Computer Programming', type: 'Note' },
    { id: 'ITL:101', title: 'Computer Programming Laboratory', type: 'Lab Manual' },
    { id: 'NBA:101', title: 'Fundamental Knowledge of Accreditation', type: 'Note' },
    { id: 'MAT102-B23', title: 'Mathematics II', type: 'Note' }
  ];

  sem2Common.forEach(sub => {
    materials.push({
      id: `common-s2-${sub.id.toLowerCase().replace(':', '-')}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Foundation course for all second semester students.`,
      branch: 'Common to All',
      semester: 2,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
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
      subject: sub.title,
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
        subject: sub.title,
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

const generateMechanicalSyllabus = (): StudyMaterial[] => {
  const materials: StudyMaterial[] = [];
  const now = new Date().toISOString();

  // Sem 3
  const sem3Mech = [
    { id: 'MET201', title: 'Mechanics of Materials-I', type: 'Note' },
    { id: 'MET202', title: 'Fundamentals of Dynamics', type: 'Note' },
    { id: 'MET203', title: 'Manufacturing Processes-I', type: 'Note' },
    { id: 'MET204', title: 'Engineering Thermodynamics', type: 'Note' },
    { id: 'MET205', title: 'Fluid Mechanics-I', type: 'Note' },
    { id: 'HST059', title: 'Society and Sensitivity', type: 'Note' },
    { id: 'MEL211', title: 'Manufacturing Processes-I Lab', type: 'Lab Manual' },
    { id: 'MEL212', title: 'Fluid Mechanics Lab', type: 'Lab Manual' },
    { id: 'MEL213', title: 'Machine Drawing & Solid Modeling Lab', type: 'Lab Manual' }
  ];

  sem3Mech.forEach(sub => {
    materials.push({
      id: `mech-s3-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Semester 3rd core course for Mechanical Engineering department at NIT Srinagar.`,
      branch: 'Mechanical Engineering',
      semester: 3,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
      author: 'Mechanical Engineering Faculty',
      uploaderId: 'system',
      downloadCount: 15,
      views: 45,
      status: 'approved',
      createdAt: now
    });
  });

  // Sem 4
  const sem4Mech = [
    { id: 'MET251', title: 'Mechanics of Materials-II', type: 'Note' },
    { id: 'MET252', title: 'Theory of Machines-I', type: 'Note' },
    { id: 'MET253', title: 'Manufacturing Processes-II', type: 'Note' },
    { id: 'MET254', title: 'Heat Transfer', type: 'Note' },
    { id: 'MET255', title: 'Applied Thermodynamics-I', type: 'Note' },
    { id: 'MAT204', title: 'Mathematics-III', type: 'Note' },
    { id: 'MEL261', title: 'Mechanics of Materials Lab', type: 'Lab Manual' },
    { id: 'MEL262', title: 'Theory of Machines-I Lab', type: 'Lab Manual' },
    { id: 'MEL263', title: 'Manufacturing Processes-II Lab', type: 'Lab Manual' },
    { id: 'MEL264', title: 'Heat Transfer Lab', type: 'Lab Manual' }
  ];

  sem4Mech.forEach(sub => {
    materials.push({
      id: `mech-s4-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Semester 4th core course for Mechanical Engineering department at NIT Srinagar.`,
      branch: 'Mechanical Engineering',
      semester: 4,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
      author: 'Mechanical Engineering Faculty',
      uploaderId: 'system',
      downloadCount: 18,
      views: 52,
      status: 'approved',
      createdAt: now
    });
  });

  // Sem 5
  const sem5Mech = [
    { id: 'MET301', title: 'Machine Design-I', type: 'Note' },
    { id: 'MET302', title: 'Theory of Machines-II', type: 'Note' },
    { id: 'MET303', title: 'Material Science and Engineering', type: 'Note' },
    { id: 'MET304', title: 'Applied Thermodynamics-II', type: 'Note' },
    { id: 'MET305', title: 'Industrial Engineering-I', type: 'Note' },
    { id: 'MET901', title: 'Introduction to Mechatronics', type: 'Note' },
    { id: 'MET902', title: 'Introduction to Electric Vehicle', type: 'Note' },
    { id: 'MEL311', title: 'Theory of Machines-II Lab', type: 'Lab Manual' },
    { id: 'MEL312', title: 'Thermal Engineering Lab', type: 'Lab Manual' },
    { id: 'MEL313', title: 'Research Lab', type: 'Lab Manual' }
  ];

  sem5Mech.forEach(sub => {
    materials.push({
      id: `mech-s5-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Semester 5th core course for Mechanical Engineering department at NIT Srinagar.`,
      branch: 'Mechanical Engineering',
      semester: 5,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
      author: 'Mechanical Engineering Faculty',
      uploaderId: 'system',
      downloadCount: 22,
      views: 65,
      status: 'approved',
      createdAt: now
    });
  });

  // Sem 6
  const sem6Mech = [
    { id: 'MET351', title: 'Machine Design-II', type: 'Note' },
    { id: 'MET352', title: 'Fluid Mechanics-II', type: 'Note' },
    { id: 'MET353', title: 'Industrial Engineering-II', type: 'Note' },
    { id: 'MAT214', title: 'Mathematics-IV', type: 'Note' },
    { id: 'MET0_ELECT1', title: 'Elective-I', type: 'Note' },
    { id: 'MET903', title: 'Basic Robot Mechanics', type: 'Note' },
    { id: 'MET904', title: 'Sustainable Engineering', type: 'Note' },
    { id: 'MEL361', title: 'Industrial Engineering Lab', type: 'Lab Manual' },
    { id: 'MEI371', title: 'Industrial Training', type: 'Note' },
    { id: 'MES381', title: 'Seminar', type: 'Note' }
  ];

  sem6Mech.forEach(sub => {
    materials.push({
      id: `mech-s6-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Semester 6th core course for Mechanical Engineering department at NIT Srinagar.`,
      branch: 'Mechanical Engineering',
      semester: 6,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
      author: 'Mechanical Engineering Faculty',
      uploaderId: 'system',
      downloadCount: 14,
      views: 39,
      status: 'approved',
      createdAt: now
    });
  });

  // Sem 7
  const sem7Mech = [
    { id: 'MET401', title: 'Measurement and Instrumentation', type: 'Note' },
    { id: 'HST052', title: 'Engineering Economics', type: 'Note' },
    { id: 'MET0_ELECT2', title: 'Elective-II', type: 'Note' },
    { id: 'MET0_ELECT3', title: 'Elective-III', type: 'Note' },
    { id: 'MET0_ELECT4', title: 'Elective-IV', type: 'Note' },
    { id: 'MEL411', title: 'Simulation Lab', type: 'Lab Manual' },
    { id: 'MEP421', title: 'Pre Project', type: 'Note' }
  ];

  sem7Mech.forEach(sub => {
    materials.push({
      id: `mech-s7-${sub.id.toLowerCase()}`,
      title: `${sub.title} (${sub.id})`,
      subject: sub.title,
      description: `Semester 7th core course for Mechanical Engineering department at NIT Srinagar.`,
      branch: 'Mechanical Engineering',
      semester: 7,
      type: sub.type as MaterialType,
      fileUrl: SAMPLE_PDF_URL,
      author: 'Mechanical Engineering Faculty',
      uploaderId: 'system',
      downloadCount: 19,
      views: 55,
      status: 'approved',
      createdAt: now
    });
  });

  return materials;
};

export const MOCK_MATERIALS: StudyMaterial[] = [];
