
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
  // --- IT & CSE DEPARTMENT (Existing) ---
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
    id: 'it-s5-daa',
    title: 'Design & Analysis of Algorithms (CST306)',
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

  // --- CHEMICAL ENGINEERING DEPARTMENT ---
  
  // Semester 3
  {
    id: 'chem-s3-cet201',
    title: 'Introduction to Chemical Engineering (CET-201)',
    description: 'Foundational concepts of chemical engineering processes.',
    branch: 'Chemical Engineering',
    semester: 3,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 120,
    views: 450,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s3-cet202',
    title: 'Material and Energy Balance (CET-202)',
    description: 'Core principles of stoichiometry and energy conservation.',
    branch: 'Chemical Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PL3aG174n4m9Ok2Bw0W76a_w9Q4u_GkXp6',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 200,
    views: 600,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s3-cet203',
    title: 'Process Fluid Mechanics (CET-203)',
    description: 'Fluid flow, Bernoulli equation, and pipe flow calculations.',
    branch: 'Chemical Engineering',
    semester: 3,
    type: 'Note',
    fileUrl: '',
    author: 'Standard Resource',
    uploaderId: 'system',
    downloadCount: 95,
    views: 300,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s3-cet204',
    title: 'Thermodynamics & Chemical Kinetics (CET-204)',
    description: 'Laws of thermodynamics and reaction rate theories.',
    branch: 'Chemical Engineering',
    semester: 3,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 80,
    views: 280,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s3-ect205',
    title: 'Basic Electronics Engineering (ECT-205)',
    description: 'Electronics fundamentals for non-circuital branches.',
    branch: 'Chemical Engineering',
    semester: 3,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiw-GZRqfnlV46nChdzadLU',
    author: 'Neso Academy',
    uploaderId: 'system',
    downloadCount: 150,
    views: 500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // Semester 4
  {
    id: 'chem-s4-cet250',
    title: 'Chemical Engineering Thermodynamics (CET-250)',
    description: 'Phase equilibria and chemical reaction equilibria.',
    branch: 'Chemical Engineering',
    semester: 4,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PL441A975E6D8A6F00',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 180,
    views: 550,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s4-cet251',
    title: 'Heat Transfer (CET-251)',
    description: 'Conduction, convection, and radiation in chemical processes.',
    branch: 'Chemical Engineering',
    semester: 4,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Library',
    uploaderId: 'system',
    downloadCount: 220,
    views: 700,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s4-cet252',
    title: 'Mechanical Operations (CET-252)',
    description: 'Size reduction, filtration, and solid handling.',
    branch: 'Chemical Engineering',
    semester: 4,
    type: 'Note',
    fileUrl: '',
    author: 'Standard Resource',
    uploaderId: 'system',
    downloadCount: 140,
    views: 400,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s4-cet253',
    title: 'Material Science & Technology (CET-253)',
    description: 'Structure and properties of engineering materials.',
    branch: 'Chemical Engineering',
    semester: 4,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 110,
    views: 320,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // Semester 5
  {
    id: 'chem-s5-cet306',
    title: 'Chemical Reaction Engineering (CET-306)',
    description: 'Design of ideal reactors and reaction kinetics.',
    branch: 'Chemical Engineering',
    semester: 5,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PL441A975E6D8A6F00',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 250,
    views: 800,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s5-cet307',
    title: 'Mass Transfer-I (CET-307)',
    description: 'Diffusion and interphase mass transfer principles.',
    branch: 'Chemical Engineering',
    semester: 5,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 190,
    views: 600,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s5-cet308',
    title: 'Chemical Technology-I (CET-308)',
    description: 'Inorganic chemical industries and processing.',
    branch: 'Chemical Engineering',
    semester: 5,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Library',
    uploaderId: 'system',
    downloadCount: 130,
    views: 400,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // Semester 6
  {
    id: 'chem-s6-cet356',
    title: 'Mass Transfer-II (CET-356)',
    description: 'Distillation, extraction, and absorption operations.',
    branch: 'Chemical Engineering',
    semester: 6,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 210,
    views: 750,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s6-cet360',
    title: 'Transport Phenomena (CET-360)',
    description: 'Unified study of momentum, heat, and mass transport.',
    branch: 'Chemical Engineering',
    semester: 6,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PLbMVogVj5nJSfJ3q7lVzC4j5X_gR4yT3v',
    author: 'NPTEL',
    uploaderId: 'system',
    downloadCount: 180,
    views: 550,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // Semester 7
  {
    id: 'chem-s7-cet415',
    title: 'Process Dynamics & Control (CET-415)',
    description: 'Dynamic behavior of processes and control systems.',
    branch: 'Chemical Engineering',
    semester: 7,
    type: 'YouTube Playlist',
    fileUrl: 'https://www.youtube.com/playlist?list=PL441A975E6D8A6F00',
    author: 'Standard Resource',
    uploaderId: 'system',
    downloadCount: 140,
    views: 480,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s7-cet416',
    title: 'Process Economics & Plant Design (CET-416)',
    description: 'Cost estimation and plant layout optimization.',
    branch: 'Chemical Engineering',
    semester: 7,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 160,
    views: 520,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s7-cet417',
    title: 'Biochemical Engineering (CET-417)',
    description: 'Microbial kinetics and bioreactor design.',
    branch: 'Chemical Engineering',
    semester: 7,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Library',
    uploaderId: 'system',
    downloadCount: 110,
    views: 390,
    status: 'approved',
    createdAt: new Date().toISOString()
  },

  // Semester 8
  {
    id: 'chem-s8-cet467',
    title: 'Modeling & Simulation of Chemical Process Systems (CET-467)',
    description: 'Numerical simulation of steady and unsteady state processes.',
    branch: 'Chemical Engineering',
    semester: 8,
    type: 'Note',
    fileUrl: '',
    author: 'Standard Resource',
    uploaderId: 'system',
    downloadCount: 90,
    views: 310,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s8-cet468',
    title: 'Industrial Pollution Abatement (CET-468)',
    description: 'Techniques for waste management and pollution control.',
    branch: 'Chemical Engineering',
    semester: 8,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 140,
    views: 450,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chem-s8-cet465',
    title: 'Bioresource Technology (CET-465)',
    description: 'Conversion of biomass into energy and chemicals.',
    branch: 'Chemical Engineering',
    semester: 8,
    type: 'Note',
    fileUrl: '',
    author: 'Dept Faculty',
    uploaderId: 'system',
    downloadCount: 75,
    views: 260,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];
