"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, MOCK_MATERIALS, SEMESTERS } from '@/lib/mock-data';
import { StudyMaterial, Branch } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, FileText, ArrowRight,
  Filter, X, GraduationCap, Video, Globe,
  Folder, FolderClosed, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import placeholderData from "@/app/lib/placeholder-images.json";

const getSubjectsForFilter = (branch: Branch, semester: number): string[] => {
  if (semester === 1) {
    return [
      'Elements of Mechanical Engineering',
      'Engineering Physics',
      'Basic English and Communication Skills',
      'Engineering Mechanics',
      'Basic Electrical Engineering',
      'English Language Lab',
      'Engineering & Applied Physics Laboratory',
      'Workshop Practice'
    ];
  }
  if (semester === 2) {
    return [
      'Engineering Chemistry',
      'Chemistry Laboratory',
      'Environmental Studies',
      'Engineering Drawing',
      'Computer Programming',
      'Computer Programming Laboratory',
      'Fundamental Knowledge of Accreditation',
      'Mathematics II'
    ];
  }
  if (semester === 3 && branch === 'Mechanical Engineering') {
    return [
      'Mechanics of Materials-I',
      'Fundamentals of Dynamics',
      'Manufacturing Processes-I',
      'Engineering Thermodynamics',
      'Fluid Mechanics-I',
      'Society and Sensitivity',
      'Manufacturing Processes-I Lab',
      'Fluid Mechanics Lab',
      'Machine Drawing & Solid Modeling Lab'
    ];
  }
  if (semester === 4 && branch === 'Mechanical Engineering') {
    return [
      'Mechanics of Materials-II',
      'Theory of Machines-I',
      'Manufacturing Processes-II',
      'Heat Transfer',
      'Applied Thermodynamics-I',
      'Mathematics-III',
      'Mechanics of Materials Lab',
      'Theory of Machines-I Lab',
      'Manufacturing Processes-II Lab',
      'Heat Transfer Lab'
    ];
  }
  if (semester === 5 && branch === 'Mechanical Engineering') {
    return [
      'Machine Design-I',
      'Theory of Machines-II',
      'Material Science and Engineering',
      'Applied Thermodynamics-II',
      'Industrial Engineering-I',
      'Introduction to Mechatronics',
      'Introduction to Electric Vehicle',
      'Theory of Machines-II Lab',
      'Thermal Engineering Lab',
      'Research Lab'
    ];
  }
  if (semester === 6 && branch === 'Mechanical Engineering') {
    return [
      'Machine Design-II',
      'Fluid Mechanics-II',
      'Industrial Engineering-II',
      'Mathematics-IV',
      'Elective-I',
      'Basic Robot Mechanics',
      'Sustainable Engineering',
      'Industrial Engineering Lab',
      'Industrial Training',
      'Seminar'
    ];
  }
  if (semester === 7 && branch === 'Mechanical Engineering') {
    return [
      'Measurement and Instrumentation',
      'Engineering Economics',
      'Elective-II',
      'Elective-III',
      'Elective-IV',
      'Simulation Lab',
      'Pre Project'
    ];
  }

  // Chemical Engineering
  if (branch === 'Chemical Engineering') {
    if (semester === 3) {
      return [
        'Chemical Process Calculations',
        'Process Fluid Mechanics',
        'Mechanical Operations',
        'Process Instrumentation',
        'Chemical Engineering Thermodynamics-I',
        'Engineering Ethics',
        'Numerical Methods',
        'Mechanical Operations Laboratory'
      ];
    }
    if (semester === 4) {
      return [
        'Chemical Reaction Engineering-I',
        'Chemical Engineering Thermodynamics-II',
        'Heat Transfer',
        'Chemical Process Technology',
        'Chemical Engineering Mathematics',
        'Engineering Economics and Management',
        'Energy Technology Laboratory',
        'Fluid Mechanics Laboratory'
      ];
    }
    if (semester === 5) {
      return [
        'Process Equipment Design-I',
        'Chemical Reaction Engineering-II',
        'Mass Transfer-I',
        'Biochemical Engineering',
        'Elective-I',
        'Institute Open Elective-I',
        'Heat Transfer Laboratory',
        'Computer Simulation Laboratory',
        'Applied Mathematics for Chemical Engineers'
      ];
    }
    if (semester === 6) {
      return [
        'Process Equipment Design-II',
        'Chemical Process Safety',
        'Process Dynamics and Control',
        'Mass Transfer-II',
        'Elective-II',
        'Institute Open Elective-II',
        'Chemical Reaction Engineering Laboratory',
        'Mass Transfer Laboratory',
        'Industrial/Research Training and Presentation',
        'Seminar',
        'Membrane Science and Engineering'
      ];
    }
    if (semester === 7) {
      return [
        'Pre-project work',
        'Transport Phenomena',
        'Process Economics and Plant Design',
        'Elective-III',
        'Elective-IV',
        'Elective-V',
        'Process Dynamics and Control Laboratory'
      ];
    }
  }

  // Electronics & Communication Engineering
  if (branch === 'Electronics & Communication Engineering') {
    if (semester === 3) {
      return [
        'Electronics-I',
        'Network Analysis',
        'Signals and Systems',
        'Electronic Engineering Materials',
        'Philosophy for Engineers: Society, Culture and Ethics',
        'Mathematics III',
        'Electronics-I Lab',
        'Circuit Analysis Lab',
        'Signals & Systems Lab'
      ];
    }
    if (semester === 4) {
      return [
        'Electronics-II',
        'Digital Elect. & Logic Design',
        'Communication-I',
        'Applied EMF & Waves',
        'Control Systems',
        'Mathematics IV',
        'Electronics-II Lab',
        'DELD Lab',
        'Communication-I Lab'
      ];
    }
    if (semester === 5) {
      return [
        'Microprocessor',
        'Electronic Devices',
        'Communication-II',
        'Antenna and Wave Propagation',
        'Mathematics-V',
        'Institute Elective I',
        'Microprocessor Lab',
        'Communication-II Lab'
      ];
    }
    if (semester === 6) {
      return [
        'Digital Signal Processing',
        'VLSI Design',
        'Computer Organization & Architecture',
        'Data Communication',
        'Elective II',
        'Institute Elective-II',
        'Seminar',
        'VLSI Design Lab',
        'Digital Signal Processing Lab',
        'Industrial Training'
      ];
    }
    if (semester === 7) {
      return [
        'Microwave Engineering',
        'Wireless Communication',
        'Electronic M&I',
        'Industrial Organization & Management',
        'Project pre-work',
        'Elective IV',
        'Microwave Engineering Lab',
        'EDA Tools I'
      ];
    }
  }

  // Metallurgical & Materials Engineering
  if (branch === 'Metallurgical & Materials Engineering') {
    if (semester === 3) {
      return [
        'Electronic, Magnetic and Di-electric Materials',
        'Thermodynamics of Materials',
        'Physical Metallurgy',
        'Mineral Dressing & Principles of Extractive Metallurgy',
        'Probability and Statistics',
        'Entrepreneurship Development',
        'Laboratory Practice in Physical Metallurgy',
        'Laboratory Practice in Mineral Dressing & Principles of Extractive Metallurgy'
      ];
    }
    if (semester === 4) {
      return [
        'Phase Transformation and Heat Treatment of Metals',
        'Kinetics of Metallurgical Processes',
        'Non-Ferrous Metal Extraction',
        'Joining of Materials',
        'Numerical Methods',
        'Engineering Economics and Management',
        'Laboratory Practice in Heat Treatment',
        'Laboratory Practice in Joining of Materials'
      ];
    }
    if (semester === 5) {
      return [
        'Corrosion Engineering',
        'Iron Making',
        'Mechanical Behaviour of Materials',
        'Materials Characterisation',
        'Professional Elective - I',
        'Institute Open Elective - I',
        'Laboratory Practice in Corrosion Engineering',
        'Laboratory Practice in Mechanical Behaviour of Materials',
        'Laboratory Practice in Materials Characterisation',
        'Honours Elective - I'
      ];
    }
    if (semester === 6) {
      return [
        'Ceramic Technology',
        'Steel Making',
        'Powder Metallurgy',
        'Mechanical Working of Materials',
        'Professional Elective - II',
        'Institute Open Elective - II',
        'Laboratory Practice in Ceramic Technology',
        'Laboratory Practice in Mechanical Working of Materials',
        'Industrial Training/Internship',
        'Seminar',
        'Honours Elective - II'
      ];
    }
    if (semester === 7) {
      return [
        'Metal Casting',
        'Polymer Technology',
        'Professional Elective - III',
        'Professional Elective - IV',
        'Professional Elective - V',
        'Laboratory Practice in Metal Casting',
        'Laboratory Practice in Polymer Technology',
        'Project Preliminary Work',
        'Honours Elective - III',
        'Honours Elective - IV'
      ];
    }
  }

  // Computer Science & Engineering
  if (branch === 'Computer Science & Engineering') {
    if (semester === 3) {
      return [
        'Object Oriented Programming',
        'Database Management Systems',
        'Software Engineering',
        'Electronic Devices and Circuits',
        'Discrete Mathematics',
        'Entrepreneurship Development',
        'Object Oriented Programming-Lab',
        'Database Management System Lab'
      ];
    }
    if (semester === 4) {
      return [
        'Data Structures',
        'Internet & Web Technologies',
        'Theory of Computation',
        'Digital Electronics & Logic Design',
        'Probability & Statistics',
        'Project Management',
        'Data Structures-Lab',
        'Digital Electronics & Logic Design Lab'
      ];
    }
    if (semester === 5) {
      return [
        'Design & Analysis of Algorithms',
        'Microprocessor',
        'Operating Systems',
        'Python Programming',
        'Open Elective-I',
        'Communication Systems',
        'Microprocessor-Lab',
        'Python Programming-Lab'
      ];
    }
    if (semester === 6) {
      return [
        'Artificial Intelligence',
        'Computer Networks',
        'Computer Organization & Architecture',
        'Java Programming',
        'Open Elective-II',
        'Elective-I',
        'Artificial Intelligence-Lab',
        'Computer Networks-Lab'
      ];
    }
    if (semester === 7) {
      return [
        'Network Security',
        'Compiler Design',
        'Elective-II',
        'Elective-III',
        'Elective-IV',
        'Network Security-Lab',
        'Pre-Project',
        'Seminar'
      ];
    }
  }

  // Information Technology
  if (branch === 'Information Technology') {
    if (semester === 3) {
      return [
        'Data Structures',
        'Control System',
        'Logic and Graphic Theory',
        'Object Oriented Programming',
        'Electronic Devices and Circuits',
        'Discrete Mathematics',
        'Data Structures Lab',
        'Object-Oriented Programming Lab',
        'Electronics Devices and Circuits Lab',
        'Web Programming'
      ];
    }
    if (semester === 4) {
      return [
        'Operating Systems',
        'Software Engineering',
        'Digital Electronics and Logic Design',
        'Database Management System',
        'Introduction to Probability and Statistics',
        'Signal and Systems',
        'Digital Electronics and Logic Design Lab',
        'Operating System Lab',
        'Database Management System Lab'
      ];
    }
    if (semester === 5) {
      return [
        'Design and Analysis of Algorithms',
        'Artificial Intelligence',
        'Computer Organization & Architecture',
        'Theory of Computation',
        'Elective I',
        'Institute Open Elective I',
        'Design & Analysis of Algorithms Lab',
        'Artificial Intelligence Lab'
      ];
    }
    if (semester === 6) {
      return [
        'Computer Networks',
        'Machine Learning',
        'Big Data',
        'Elective II',
        'Institute Open Elective II',
        'Computer Networks Lab',
        'Machine Learning Lab',
        'Seminar',
        'Industrial Training and Internship',
        'Elective III'
      ];
    }
    if (semester === 7) {
      return [
        'Image Processing',
        'Entrepreneurship Development',
        'Elective IV',
        'Elective V',
        'Elective VI',
        'Image Processing Lab',
        'Elective VII',
        'Pre-Project'
      ];
    }
  }

  // Civil Engineering
  if (branch === 'Civil Engineering') {
    if (semester === 3) {
      return [
        'Structural Analysis-I',
        'Structural Analysis Lab',
        'Fluid Mechanics',
        'Fluid Mechanics Lab-I',
        'Surveying-I',
        'Surveying Lab-I',
        'Mathematics-III',
        'Building Materials and Construction',
        'Basics of Industrial Economics and Management'
      ];
    }
    if (semester === 4) {
      return [
        'Structural Analysis-II',
        'Fluid Flow in Pipes and Channels',
        'Fluid Mechanics Lab-II',
        'Surveying-II',
        'Surveying Lab-II',
        'Engineering Geology',
        'Geology Lab',
        'Civil Engineering Drawing',
        'Survey Camp',
        'Mathematics-IV'
      ];
    }
    if (semester === 5) {
      return [
        'Design of Reinforced Concrete Structures-I',
        'Concrete Lab',
        'Highway Engineering',
        'Highway Engineering Lab',
        'Geotechnical Engineering-I',
        'Geotechnical Lab-I',
        'Water Resources Engineering',
        'Quantity Surveying and Cost Evaluation',
        'Philosophy for Engineers: Society, Culture and Ethics',
        'Honors Elective-I',
        'Quantity Surveying and Cost Evaluation (Institute Elective-I)',
        'Building Materials and Construction (Institute Elective-II)'
      ];
    }
    if (semester === 6) {
      return [
        'Design of Steel Structures',
        'Traffic Engineering',
        'Traffic Engineering Lab.',
        'Geotechnical Engineering-II',
        'Geotechnical Lab-II',
        'Environmental Engineering-I',
        'Water Quality Lab',
        'Industrial Training and Presentation',
        'Elective-I',
        'Elective-II',
        'Honors Elective-II',
        'Environmental Engineering (Institute Elective-I)',
        'Civil Engineering Drawing (Institute Elective-II)'
      ];
    }
    if (semester === 7) {
      return [
        'Elective-III',
        'Elective-IV',
        'Elective-V',
        'Elective-VI',
        'Seminar',
        'Pre-Project work',
        'Honours Elective-III',
        'Honours Elective-IV',
        'Honours Elective-V'
      ];
    }
  }

  // Electrical Engineering
  if (branch === 'Electrical Engineering') {
    if (semester === 3) {
      return [
        'Mathematics III',
        'Electric Circuit Analysis',
        'Electric Machines I',
        'Signals & Systems',
        'Electronic Devices and Circuits',
        'Electromagnetic Field & Waves',
        'Electric Circuit Analysis Lab',
        'Electronic Devices and Circuits Lab',
        'Python Programming Lab'
      ];
    }
    if (semester === 4) {
      return [
        'Electrical Measurements and Instrumentation',
        'Electric Machines II',
        'Power Systems I',
        'Control Systems I',
        'Digital Electronics & Logic Design',
        'Basic Management Principles',
        'Electric Machines Lab I',
        'Control Systems LAB',
        'Electrical Measurements and Instrumentation Lab'
      ];
    }
    if (semester === 5) {
      return [
        'Mathematics IV',
        'Control Systems II',
        'Power Systems II',
        'Power Electronics',
        'Electric Machines III',
        'Program Elective I',
        'Institute Elective I',
        'Power Systems Lab I',
        'Power Electronics Lab',
        'Electric Machines Lab II'
      ];
    }
    if (semester === 6) {
      return [
        'Power Systems III',
        'Electric Drives',
        'Design of Electric Machines',
        'Microprocessors',
        'Program Elective II',
        'Program Elective III',
        'Institute Elective II',
        'Power Systems Lab II',
        'Microprocessors Lab',
        'Seminar',
        'Industrial Training & Viva'
      ];
    }
    if (semester === 7) {
      return [
        'Power System Protection',
        'Program Elective IV',
        'Program Elective V',
        'Program Elective VI',
        'Program Elective VII',
        'Program Elective VIII',
        'Personal Financial Planning',
        'Power System Protection Lab',
        'Pre-Project',
        'Program Elective Lab I'
      ];
    }
  }

  return [];
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  
  const [selectedBranch, setSelectedBranch] = useState<string>(searchParams.get('branch') || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>(searchParams.get('semester') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const [dbMaterials, setDbMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch('/api/materials');
        if (res.ok) {
          const json = await res.json();
          setDbMaterials(json.data || []);
        }
      } catch (e) {
        console.error("Failed to load materials", e);
      }
    };
    fetchMaterials();
  }, []);

  // Sync state with url searchParams on change
  useEffect(() => {
    const search = searchParams.get('search');
    setSearchQuery(search || '');
    const branch = searchParams.get('branch');
    setSelectedBranch(branch || 'all');
    const semester = searchParams.get('semester');
    setSelectedSemester(semester || 'all');
  }, [searchParams]);

  useEffect(() => {
    setSelectedSubject('All Subjects');
    setActiveFolder(null);
  }, [selectedBranch, selectedSemester, searchQuery]);

  const filteredMaterials = useMemo(() => {
    const combined = [...MOCK_MATERIALS, ...(dbMaterials || [])];
    
    return combined.filter(m => {
      // If a specific branch is selected, show its materials AND "Common to All" materials
      const branchMatch = selectedBranch === 'all' || 
                          m.branch === selectedBranch || 
                          m.branch === 'Common to All';
      
      const semMatch = selectedSemester === 'all' || m.semester.toString() === selectedSemester;
      const searchMatch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.type.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && semMatch && searchMatch;
    });
  }, [selectedBranch, selectedSemester, searchQuery, dbMaterials]);

  const subjects = useMemo(() => {
    const unique = new Set<string>();
    const semNum = parseInt(selectedSemester);
    if (!isNaN(semNum)) {
      const branchToQuery = (semNum === 1 || semNum === 2) ? 'Common to All' : selectedBranch;
      const whitelisted = getSubjectsForFilter(branchToQuery as Branch, semNum);
      whitelisted.forEach(sub => unique.add(sub));
    } else {
      [1, 2, 3, 4, 5, 6, 7].forEach(s => {
        const branchToQuery = (s === 1 || s === 2) ? 'Common to All' : selectedBranch;
        const branches = branchToQuery === 'all' 
          ? ['Mechanical Engineering', 'Chemical Engineering', 'Electronics & Communication Engineering', 'Metallurgical & Materials Engineering', 'Computer Science & Engineering', 'Information Technology', 'Civil Engineering', 'Electrical Engineering'] 
          : [branchToQuery];
        branches.forEach(br => {
          const whitelisted = getSubjectsForFilter(br as Branch, s);
          whitelisted.forEach(sub => unique.add(sub));
        });
      });
    }

    filteredMaterials.forEach(m => {
      const sub = m.subject || m.title.split('(')[0].trim() || 'General';
      unique.add(sub);
    });

    return ['All Subjects', ...Array.from(unique)];
  }, [filteredMaterials, selectedBranch, selectedSemester]);

  const materialsToShow = useMemo(() => {
    if (selectedSubject === 'All Subjects') return filteredMaterials;
    return filteredMaterials.filter(m => {
      const sub = m.subject || m.title.split('(')[0].trim() || 'General';
      return sub.toLowerCase() === selectedSubject.toLowerCase();
    });
  }, [filteredMaterials, selectedSubject]);

  const subjectFolders = useMemo(() => {
    const foldersMap: Record<string, StudyMaterial[]> = {};
    const semestersToPopulate = selectedSemester === 'all' ? [1, 2, 3, 4, 5, 6, 7] : [parseInt(selectedSemester)];
    
    semestersToPopulate.forEach(semNum => {
      if (isNaN(semNum)) return;
      if (semNum === 1 || semNum === 2) {
        const whitelisted = getSubjectsForFilter('Common to All', semNum);
        whitelisted.forEach(sub => {
          foldersMap[sub.trim().toUpperCase()] = [];
        });
      } else {
        const branchesToPopulate = selectedBranch === 'all' 
          ? ['Mechanical Engineering', 'Chemical Engineering', 'Electronics & Communication Engineering', 'Metallurgical & Materials Engineering', 'Computer Science & Engineering', 'Information Technology', 'Civil Engineering', 'Electrical Engineering'] 
          : [selectedBranch];
        branchesToPopulate.forEach(br => {
          const whitelisted = getSubjectsForFilter(br as Branch, semNum);
          whitelisted.forEach(sub => {
            foldersMap[sub.trim().toUpperCase()] = [];
          });
        });
      }
    });

    filteredMaterials.forEach(m => {
      const sub = m.subject || m.title.split('(')[0].trim() || 'General';
      const cleanSub = sub.trim().toUpperCase();
      if (!foldersMap[cleanSub]) {
        foldersMap[cleanSub] = [];
      }
      foldersMap[cleanSub].push(m);
    });

    return Object.entries(foldersMap).map(([name, files]) => ({
      name,
      files
    }));
  }, [filteredMaterials, selectedBranch, selectedSemester]);

  const foldersToShow = useMemo(() => {
    let result = subjectFolders;
    if (selectedSubject !== 'All Subjects') {
      result = result.filter(f => f.name.toLowerCase() === selectedSubject.toLowerCase());
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(f => f.files.length > 0 || f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [subjectFolders, selectedSubject, searchQuery]);

  const activeSlides = useMemo(() => {
    const getImg = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);
    const commonSlides = [
      getImg('hero-nitsri-official'),
      { imageUrl: 'https://picsum.photos/seed/nitsri1/1200/600', title: 'Library Block', imageHint: 'academic building' },
      { imageUrl: 'https://picsum.photos/seed/nitsri2/1200/600', title: 'Green Campus', imageHint: 'campus trees' },
    ];

    const branchSlides: Record<string, any[]> = {
      'Information Technology': [
        getImg('it-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/it1/1200/600', title: 'Innovation Lab', imageHint: 'coding lab' },
      ],
      'Computer Science & Engineering': [
        getImg('cse-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/cse1/1200/600', title: 'Server Room', imageHint: 'technology center' },
      ],
      'Electrical Engineering': [
        getImg('ee-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/ee1/1200/600', title: 'Control Systems', imageHint: 'electrical circuits' },
      ],
      'Mechanical Engineering': [
        getImg('mech-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/me1/1200/600', title: 'Design Lab', imageHint: 'mechanical engine' },
      ],
      'Chemical Engineering': [
        getImg('chem-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/chem1/1200/600', title: 'Process Control', imageHint: 'chemistry lab' },
      ],
      'Civil Engineering': [
        getImg('civil-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/civil1/1200/600', title: 'Geotech Lab', imageHint: 'building site' },
      ],
      'Electronics & Communication Engineering': [
        getImg('ece-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/ece1/1200/600', title: 'Signals Lab', imageHint: 'circuit board' },
      ],
      'Metallurgical & Materials Engineering': [
        getImg('meta-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/met1/1200/600', title: 'Material Testing', imageHint: 'microscope testing' },
      ],
      'Common to All': [
        getImg('hero-nitsri-official'),
        { imageUrl: 'https://picsum.photos/seed/common/1200/600', title: 'Central Repository', imageHint: 'library books' },
      ]
    };

    return branchSlides[selectedBranch] || commonSlides;
  }, [selectedBranch]);

  const resetFilters = () => {
    setSelectedBranch('all');
    setSelectedSemester('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Immersive Department Carousel Header */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-[400px] -ml-0">
            {activeSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.imageUrl || 'https://picsum.photos/seed/fallback/1200/600'} 
                    alt={slide.title || 'Campus Slide'}
                    fill
                    className="object-cover opacity-100 brightness-[1.10]"
                    priority={index === 0}
                    data-ai-hint={slide.imageHint || 'university campus'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
                  
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-16 space-y-4">
                    <Badge className="bg-primary text-white w-fit rounded-full px-5 py-1.5 animate-in fade-in slide-in-from-left-4 duration-500 font-black tracking-widest text-[11px] shadow-2xl">
                      {selectedBranch === 'all' ? 'CENTRAL REPOSITORY' : 'BRANCH RESOURCES'}
                    </Badge>
                    <div className="space-y-1">
                      <h1 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter animate-in fade-in slide-in-from-left-6 duration-700 leading-tight drop-shadow-2xl">
                        {selectedBranch === 'all' ? 'Knowledge Hub.' : `${selectedBranch}.`}
                      </h1>
                      <p className="text-white/90 text-xl max-w-xl font-medium animate-in fade-in slide-in-from-left-8 duration-1000 leading-relaxed drop-shadow-xl">
                        Explore academic resources specifically curated for your branch and semester.
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 right-8 flex gap-3 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 bg-white/10 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/20 rounded-xl transition-all shadow-xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 bg-white/10 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/20 rounded-xl transition-all shadow-xl" />
          </div>
        </Carousel>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-primary/10 shadow-2xl sticky top-24 bg-card/60 backdrop-blur-2xl">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-primary"><Filter className="h-5 w-5" /> Filter Vault</h3>
                  {(selectedBranch !== 'all' || selectedSemester !== 'all' || searchQuery) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary hover:bg-primary/10 rounded-full px-4 h-7 text-[10px] font-black uppercase tracking-wider">
                      Reset
                    </Button>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Search Keywords</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Subject name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 bg-secondary/30 border-none rounded-2xl h-12 focus-visible:ring-1 focus-visible:ring-primary/40 font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Select Branch</label>
                    <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full bg-secondary/30 border-none rounded-2xl h-12 px-4 text-sm font-bold focus:ring-1 focus:ring-primary/40 outline-none appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="all">All Departments</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Semester Cycle</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={selectedSemester === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="rounded-xl h-10 font-bold transition-all shadow-sm"
                        onClick={() => setSelectedSemester('all')}
                      >
                        All
                      </Button>
                      {SEMESTERS.map(sem => (
                        <Button 
                          key={sem}
                          variant={selectedSemester === sem.toString() ? 'default' : 'ghost'} 
                          size="sm" 
                          className="rounded-xl h-10 font-bold transition-all shadow-sm"
                          onClick={() => setSelectedSemester(sem.toString())}
                        >
                          S{sem}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results Grid */}
          <div className="flex-1 space-y-8">


            {!activeFolder ? (
              foldersToShow.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                  {foldersToShow.map(folder => (
                    <Card 
                      key={folder.name}
                      className="group cursor-pointer border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-card/85 flex flex-col p-4 relative hover:-translate-y-1 border"
                      onClick={() => setActiveFolder(folder.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                          <Folder className="h-5 w-5" />
                        </div>
                        <Badge variant="secondary" className="rounded-full px-2 py-0.5 font-bold text-[10px] bg-primary/5 text-primary border-none">
                          {folder.files.length} {folder.files.length === 1 ? 'file' : 'files'}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-headline font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1 uppercase leading-tight">
                        {folder.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open Folder <ChevronRight className="h-2.5 w-2.5" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-40 flex flex-col items-center justify-center text-center gap-8 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-primary/10 animate-in fade-in duration-500 shadow-inner">
                  <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary/40 relative shadow-xl">
                    <Search className="h-12 w-12" />
                    <div className="absolute -top-1 -right-1 h-8 w-8 bg-background rounded-full border border-primary/20 flex items-center justify-center shadow-2xl">
                      <X className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-headline font-bold">No Resources Found</h3>
                    <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">We couldn't find any materials matching your search. Be the first to contribute!</p>
                  </div>
                  <Button onClick={resetFilters} className="rounded-2xl px-10 h-14 font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">Clear All Filters</Button>
                </div>
              )
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Folder Breadcrumb */}
                <div className="flex items-center justify-between bg-secondary/15 p-4 rounded-2xl border border-primary/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <button 
                      onClick={() => setActiveFolder(null)} 
                      className="hover:text-primary flex items-center gap-1 transition-colors text-xs font-black uppercase tracking-wider"
                    >
                      <FolderClosed className="h-4 w-4" /> All Folders
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 opacity-45" />
                    <span className="text-foreground font-black uppercase tracking-wider text-xs">{activeFolder}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveFolder(null)} className="rounded-xl h-8 font-bold">
                    Go Back
                  </Button>
                </div>

                {/* Files inside Folder Grid */}
                {(() => {
                  const folderFiles = materialsToShow.filter(m => {
                    const sub = m.subject || m.title.split('(')[0].trim() || 'General';
                    return sub.trim().toUpperCase() === activeFolder;
                  });

                  if (folderFiles.length > 0) {
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {folderFiles.map((material) => (
                          <Card key={material.id} className="group hover:shadow-xl transition-all duration-500 border-primary/5 rounded-2xl overflow-hidden bg-card/80 hover:-translate-y-1 border shadow-md flex flex-col">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                  {material.type === 'YouTube Playlist' ? <Video className="h-4 w-4" /> : material.branch === 'Common to All' ? <Globe className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                </div>
                                <Badge variant="outline" className="rounded-full px-2 py-0.5 border-primary/20 font-bold text-[9px]">Sem {material.semester}</Badge>
                              </div>
                              <CardTitle className="text-sm font-headline font-bold group-hover:text-primary transition-colors mt-3 leading-tight line-clamp-2">{material.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 flex-grow space-y-2">
                              <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{material.description}</p>
                              <div className="flex items-center justify-between pt-2 border-t border-primary/5">
                                <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[60%]">{material.author}</span>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Download className="h-3 w-3" /> <span className="text-[10px] font-black">{material.downloadCount || 0}</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="p-0 border-t border-primary/5">
                              <Button className="w-full h-10 rounded-none font-bold text-xs bg-primary hover:bg-primary/90 transition-all gap-1.5" asChild>
                                <Link href={`/material/${material.id}`}>
                                  View <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="py-24 flex flex-col items-center justify-center text-center gap-6 bg-secondary/5 rounded-[2rem] border border-primary/5 shadow-inner">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary/60 relative">
                          <FolderClosed className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-headline font-bold">This folder is empty</h4>
                          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">No study materials have been uploaded to this subject yet.</p>
                        </div>
                        <Button className="rounded-xl px-6 h-10 font-bold" asChild>
                          <Link href="/upload">Upload Material</Link>
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
