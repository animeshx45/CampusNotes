"use client";

import { useState, use, useEffect, useMemo } from 'react';
import { StudyMaterial, User, Branch, MaterialType, Semester } from '@/lib/types';
import { MOCK_MATERIALS, BRANCHES, SEMESTERS, MATERIAL_TYPES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BrainCircuit, Download, FileText, Share2, MessageSquare, 
  Info, Sparkles, AlertCircle, Loader2, Zap, ArrowLeft, 
  ExternalLink, Youtube, Monitor, Eye, ShieldCheck, Trash2, Edit,
  Terminal, Lightbulb, CheckCircle2, Rocket, FolderOpen
} from 'lucide-react';
import { generateStudyMaterialSummary } from '@/ai/flows/generate-study-material-summary';
import { generateExamQuestions } from '@/ai/flows/generate-exam-questions-flow';
import { simplifyConcept } from '@/ai/flows/simplify-concept-flow';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import PDFViewer from '@/components/pdf-viewer';
import ErrorBoundary from '@/components/ErrorBoundary';

const ModernLoader = ({ message }: { message: string }) => (
  <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin" />
      <div className="absolute inset-2 rounded-full border-r-2 border-accent animate-spin [animation-duration:1.5s]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="h-8 w-8 text-primary animate-pulse" />
      </div>
    </div>
    <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest text-xs animate-pulse">
      {message}
    </p>
  </div>
);

const getSubjectsForFilter = (branch: Branch, semester: number): string[] => {
  if (semester === 1) {
    return [
      'Elements of Mechanical Engineering',
      'Engineering Physics',
      'Basic English and Communication Skills',
      'Engineering Mechanics',
      'Mathematics I',
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
      'Advanced English Communication Skills',
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

// Helper component to parse and render simple markdown elements for AI Summary
function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let inList = false;

  const formatInline = (str: string) => {
    const parts: React.ReactNode[] = [];
    let i = 0;
    while (i < str.length) {
      if (str.startsWith('**', i)) {
        const endBold = str.indexOf('**', i + 2);
        if (endBold !== -1) {
          parts.push(<strong key={`b-${i}`} className="font-bold text-white">{str.slice(i + 2, endBold)}</strong>);
          i = endBold + 2;
          continue;
        }
      }
      if (str.startsWith('`', i)) {
        const endCode = str.indexOf('`', i + 1);
        if (endCode !== -1) {
          parts.push(<code key={`c-${i}`} className="bg-primary/20 text-accent font-mono px-1 rounded text-[11px] font-semibold">{str.slice(i + 1, endCode)}</code>);
          i = endCode + 1;
          continue;
        }
      }
      parts.push(str[i]);
      i++;
    }
    return parts;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('###')) {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h4 key={idx} className="text-xs font-black uppercase tracking-wider text-accent mt-4 mb-2">{formatInline(trimmed.slice(3).trim())}</h4>);
    } else if (trimmed.startsWith('##')) {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h3 key={idx} className="text-sm font-black text-primary mt-5 mb-2.5">{formatInline(trimmed.slice(2).trim())}</h3>);
    } else if (trimmed.startsWith('#')) {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h2 key={idx} className="text-base font-black text-white mt-6 mb-3">{formatInline(trimmed.slice(1).trim())}</h2>);
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      inList = true;
      listItems.push(<li key={idx} className="text-xs font-medium leading-relaxed my-1 text-zinc-300">{formatInline(trimmed.slice(1).trim())}</li>);
    } else {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      if (trimmed) {
        elements.push(<p key={idx} className="text-xs leading-relaxed my-1.5 text-zinc-300">{formatInline(trimmed)}</p>);
      }
    }
  });

  if (inList) {
    elements.push(<ul key="ul-end" className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{[...listItems]}</ul>);
  }

  return <div className="space-y-0.5">{elements}</div>;
}

const getSimulatedFileSize = (filename?: string): string => {
  if (!filename || typeof filename !== 'string') return '2.4 MB';
  const name = filename.toLowerCase();
  if (name.includes('adobe scan 16-mar-2023')) return '125 KB';
  if (name.includes('bee .pdf') || name.includes('bee_.pdf')) return '185 KB';
  if (name.includes('bee assisgnment') || name.includes('bee_assisgnment')) return '102 KB';
  if (name.includes('bee pratical') || name.includes('bee_pratical')) return '4.5 MB';
  if (name.includes('charles_k_alexander') || name.includes('alexander_fundamentals')) return '44.7 MB';
  if (name.includes('docscanner dec 1')) return '1.4 MB';
  if (name.includes('fundementals of electric') || name.includes('fundamentals_of_electric')) return '15.2 MB';
  if (name.includes('kaagaz_20221211')) return '14.8 MB';
  if (name.includes('kvl.pdf')) return '3.1 MB';
  if (name.includes('network_theorems') || name.includes('network_theorems.pdf')) return '265 KB';
  if (name.includes('tb-1') || name.includes('tb-1.pdf')) return '19.6 MB';
  if (name.includes('tb-2') || name.includes('tb-2.pdf')) return '50.9 MB';
  
  // Default fallback size
  return '2.4 MB';
};

function MaterialDetailPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const isAdmin = user?.role === 'admin';

  const mockMaterial = useMemo(() => MOCK_MATERIALS.find(m => m.id === id), [id]);

  const [dbMaterial, setDbMaterial] = useState<StudyMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const material = mockMaterial || dbMaterial;

  const isOwner = !!(user && (
    (dbMaterial && (user.id === dbMaterial.uploaderId || user.uid === dbMaterial.uploaderId || user.fullName === dbMaterial.author)) ||
    (mockMaterial && user.fullName === mockMaterial.author)
  ));
  const canEditOrDelete = isAdmin || isOwner;

  // Local state to dynamically hold the parsed/verified file type (handles query params & dynamic /api/upload urls)
  const [detectedType, setDetectedType] = useState<'pdf' | 'image' | 'youtube' | 'other' | null>(null);
  const [selectedFolderFileIndex, setSelectedFolderFileIndex] = useState<number>(0);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState<boolean>(false);

  const isYoutube = !!(material && material.type === 'YouTube Playlist');
  const isFolder = !!(material && (material.type === 'Folder' || (material.folderFiles && material.folderFiles.length > 0)));
  const activeFolderFile = isFolder && material.folderFiles ? material.folderFiles[selectedFolderFileIndex] : null;

  const currentFileUrl = isFolder && activeFolderFile ? activeFolderFile.fileUrl : material?.fileUrl;
  const currentFileName = isFolder && activeFolderFile ? activeFolderFile.name : material?.title;

  useEffect(() => {
    if (isYoutube) {
      setDetectedType('youtube');
      return;
    }
    if (!currentFileUrl) {
      setDetectedType(null);
      return;
    }
    
    const lowerUrl = currentFileUrl.toLowerCase();
    // 1. Static pattern check (handles standard file extensions, picsum placeholder, and Firebase storage with query tokens)
    if (lowerUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) || lowerUrl.includes('picsum.photos') || lowerUrl.includes('placehold.co')) {
      setDetectedType('image');
      return;
    }
    if (lowerUrl.match(/\.pdf(\?|$)/i)) {
      setDetectedType('pdf');
      return;
    }

    // 2. Network-based HEAD metadata check fallback for dynamic routes (like /api/upload?id=...)
    let isMounted = true;
    const checkType = async () => {
      try {
        const isRelative = !currentFileUrl.startsWith('http://') && !currentFileUrl.startsWith('https://');
        const checkUrl = isRelative ? currentFileUrl : `/api/pdf-proxy?url=${encodeURIComponent(currentFileUrl)}`;
        
        // We use HEAD method to only fetch headers (extremely light and fast)
        const res = await fetch(checkUrl, { method: 'HEAD' });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (isMounted) {
            if (contentType.toLowerCase().includes('image/')) {
              setDetectedType('image');
            } else if (contentType.toLowerCase().includes('pdf')) {
              setDetectedType('pdf');
            } else {
              setDetectedType('pdf'); // default
            }
          }
        }
      } catch (e) {
        if (isMounted) {
          setDetectedType('pdf');
        }
      }
    };
    checkType();
    return () => { isMounted = false; };
  }, [currentFileUrl, isYoutube]);

  useEffect(() => {
    if (id.startsWith('it-') || id.startsWith('cse-') || id.startsWith('chem-') || id.includes('s3-') || id.includes('s4-') || id.includes('s5-') || id.includes('s6-') || id.includes('s7-') || id.includes('s8-') || id.startsWith('common-')) {
      setIsLoading(false);
      return;
    }

    const fetchMaterial = async () => {
      try {
        setIsLoading(true);
        const data = await materialService.getMaterial(id);
        setDbMaterial(data);
      } catch (e) {
        console.error("Failed to load material details", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    subject: '',
    description: '',
    branch: '' as Branch,
    semester: 1 as Semester,
    type: 'Note' as MaterialType,
    author: '',
    fileUrl: '',
  });

  const editAvailableSubjects = getSubjectsForFilter(editFormData.branch, editFormData.semester as number);

  useEffect(() => {
    const list = getSubjectsForFilter(editFormData.branch, editFormData.semester as number);
    if (list.length > 0 && !list.includes(editFormData.subject)) {
      setEditFormData(prev => ({ ...prev, subject: list[0] }));
    }
  }, [editFormData.semester, editFormData.branch]);

  const handleOpenEdit = () => {
    if (!material) return;
    setEditFormData({
      title: material.title,
      subject: material.subject || '',
      description: material.description,
      branch: material.branch,
      semester: material.semester,
      type: material.type,
      author: material.author,
      fileUrl: material.fileUrl || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const updated = await materialService.updateMaterial(id, editFormData);
      setDbMaterial(updated);
      toast({ title: "Changes Saved", description: "The study material has been updated successfully." });
      setIsEditDialogOpen(false);
    } catch (err) {
      toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const [summary, setSummary] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [simplified, setSimplified] = useState<any | null>(null);
  
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingSimplified, setIsLoadingSimplified] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (material) {
      materialService.incrementViewCount(id);
    }
  }, [material, id]);

  if (isLoading && !mockMaterial) return <ModernLoader message="Opening your study materials..." />;

  if (!material) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary">Notes Not Found</h1>
          <p className="text-muted-foreground">The notes you are looking for are not here. Please check the library again.</p>
        </div>
        <Button asChild className="rounded-full px-8 h-12">
          <Link href="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Library</Link>
        </Button>
      </div>
    );
  }

  const downloadFileUrl = async (fileUrl: string, fileName: string) => {
    try {
      if (!fileUrl || typeof fileUrl !== 'string') {
        throw new Error('This file does not have a valid download URL.');
      }

      const isLegacyLocalDiskFile = fileUrl.startsWith('/uploads/') || fileUrl.includes('/uploads/');

      // Automatically map any legacy dev-mode direct disk uploads to dynamic API path
      let cleanUrl = fileUrl;
      if (fileUrl.startsWith('/uploads/')) {
        cleanUrl = `/api/upload?id=${fileUrl.substring('/uploads/'.length)}`;
      }

      const isRelative = !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://');
      const fetchUrl = isRelative ? cleanUrl : `/api/pdf-proxy?url=${encodeURIComponent(cleanUrl)}`;
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        if (isLegacyLocalDiskFile) {
          throw new Error('This file was uploaded locally and is not available on production. Please re-upload it.');
        }
        throw new Error('File download failed.');
      }
      
      // Determine file extension dynamically from Content-Type header
      const contentType = response.headers.get('content-type') || '';
      let extension = 'pdf';
      if (contentType.toLowerCase().includes('image/png')) {
        extension = 'png';
      } else if (contentType.toLowerCase().includes('image/jpeg')) {
        extension = 'jpg';
      } else if (contentType.toLowerCase().includes('image/webp')) {
        extension = 'webp';
      } else if (contentType.toLowerCase().includes('image/gif')) {
        extension = 'gif';
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanFileName = fileName || 'study_material';
      const hasExtension = cleanFileName.match(/\.[a-zA-Z0-9]+$/);
      link.download = hasExtension ? cleanFileName : `${cleanFileName.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast({
        title: "Download complete!",
        description: "File successfully saved to your device.",
      });
    } catch (err: any) {
      console.error('Download failed', err);
      
      const isLocalErr = !fileUrl || typeof fileUrl !== 'string' || fileUrl.startsWith('/uploads/') || fileUrl.startsWith('/api/upload') || err.message?.includes('locally');
      if (isLocalErr) {
        toast({
          title: "File Not Found on Server",
          description: "This document was uploaded locally or does not have a valid file URL. Please re-upload it.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Direct download failed",
        description: "Opening in a new tab.",
        variant: "destructive",
      });
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      }
    }
  };

  const handleDownload = async () => {
    if (!currentFileUrl) {
      toast({ title: "No Link", description: "This resource doesn't have a download link yet." });
      return;
    }
    
    materialService.incrementDownloadCount(id);

    if (isYoutube) {
      window.open(currentFileUrl, '_blank');
      return;
    }

    try {
      setIsDownloading(true);
      toast({ title: "Downloading", description: "Fetching document content..." });
      await downloadFileUrl(currentFileUrl, currentFileName || 'study_material');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAdminDelete = async () => {
    if (confirm("Management Decision: Delete this resource permanently?")) {
      try {
        await materialService.deleteMaterial(id);
        toast({ title: "Material Removed", description: "This resource has been deleted successfully." });
        router.push('/browse');
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete this resource.", variant: "destructive" });
      }
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const result = await generateStudyMaterialSummary({ 
        studyMaterialContent: `${material.title}. ${material.description}`,
        fileUrl: material.fileUrl
      });
      setSummary(result.summary);
    } catch (error) {
      toast({ title: "Error making summary", description: "Try again in a bit.", variant: "destructive" });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const result = await generateExamQuestions({ 
        studyMaterialText: `${material.title}. ${material.description}`,
        fileUrl: material.fileUrl
      });
      setQuestions(result.examQuestions);
    } catch (error) {
      toast({ title: "Error making questions", description: "Try again in a bit.", variant: "destructive" });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSimplifyConcept = async () => {
    setIsLoadingSimplified(true);
    try {
      const result = await simplifyConcept({ 
        concept: material.title,
        branch: material.branch 
      });
      setSimplified(result);
    } catch (error) {
      toast({ title: "Error simplifying", description: "Try again in a bit.", variant: "destructive" });
    } finally {
      setIsLoadingSimplified(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Recently';
    if (typeof date?.toDate === 'function') return date.toDate().toLocaleDateString();
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    if (date?.seconds) return new Date(date.seconds * 1000).toLocaleDateString();
    return new Date().toLocaleDateString();
  };

  const hasFile = !!(material && material.fileUrl);
  
  // isImage flag resolves dynamically once detectedType resolves
  const isImage = detectedType === 'image' || (hasFile && !detectedType && (
    material.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) || 
    material.fileUrl?.includes('picsum.photos') || 
    material.fileUrl?.includes('placehold.co')
  ));
  
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com') && url.includes('/view')) {
      return url.replace('/view', '/preview');
    }
    if (url.includes('drive.google.com') && url.includes('/preview')) {
      return url;
    }
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  };
  
  const previewUrl = hasFile ? getEmbedUrl(material.fileUrl) : null;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {canEditOrDelete && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-primary font-bold text-sm">
            <ShieldCheck className="h-5 w-5" /> Manager / Author Actions Enabled
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-primary/20 h-9" onClick={handleOpenEdit}>
              <Edit className="h-4 w-4 mr-2" /> Modify
            </Button>
            <Button variant="destructive" size="sm" className="rounded-xl h-9" onClick={handleAdminDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-primary/10 pb-8">
        <div className="space-y-4 flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-white border-none">{material.branch}</Badge>
            <Badge variant="outline" className="border-primary/20">Sem {material.semester}</Badge>
            <Badge variant="secondary" className={cn(
              "font-bold",
              isYoutube ? "bg-red-500/10 text-red-500" : "bg-secondary text-primary"
            )}>
              {isYoutube && <Youtube className="h-3 w-3 mr-1 inline" />}
              {material.type}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary leading-tight">{material.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> Shared by <span className="font-bold text-foreground">{material.author}</span></div>
            <div className="flex items-center gap-1.5"><Info className="h-4 w-4" /> {formatDate(material.createdAt)}</div>
            <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {material.views || 0} views</div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/5 h-12 w-12" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link Copied!", description: "Share it with your friends." });
          }}><Share2 className="h-5 w-5" /></Button>
          <Button 
            size="lg" 
            className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 flex-1 md:flex-none font-bold text-base" 
            onClick={handleDownload} 
            disabled={!hasFile || isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isYoutube ? (
              <ExternalLink className="mr-2 h-5 w-5" />
            ) : (
              <Download className="mr-2 h-5 w-5" />
            )}
            {isDownloading ? 'Downloading...' : isYoutube ? 'Open Link' : 'Download Now'}
          </Button>
        </div>
      </div>

      {/* 1. Full-width Study Materials / PDF Viewer Section at the Top */}
      {isFolder && material.folderFiles ? (
        <div className="w-full bg-zinc-950/20 rounded-[2rem] border border-white/5 overflow-hidden">
          {/* Google Drive Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <FolderOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-black text-sm uppercase tracking-wider text-primary">
                  Folder Contents
                </h3>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {material.folderFiles.length} files
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none bg-zinc-950/40">
            <div className="col-span-6 sm:col-span-5 flex items-center gap-1">
              Name <span className="text-primary text-[10px]">↑</span>
            </div>
            <div className="col-span-3 sm:col-span-3 hidden sm:flex items-center">
              Owner
            </div>
            <div className="col-span-3 sm:col-span-2 hidden sm:flex items-center">
              Date modified
            </div>
            <div className="col-span-3 sm:col-span-1 flex items-center justify-end sm:justify-start">
              File size
            </div>
            <div className="col-span-3 sm:col-span-1 flex items-center justify-end">
              Action
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {material.folderFiles && Array.isArray(material.folderFiles) ? (
              material.folderFiles.filter(Boolean).map((file, idx) => {
                const isPdfFile = file?.type === 'pdf';
                const fileSize = getSimulatedFileSize(file?.name || '');
                const ownerName = material.author || 'Contributor';
                const ownerInitial = ownerName.trim().charAt(0).toUpperCase();
                const dateModified = new Date(material.createdAt || Date.now()).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });

                return (
                  <div 
                    key={idx}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group text-sm"
                  >
                    {/* Name Column */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0 pr-4">
                      {/* PDF/Image Icon */}
                      {isPdfFile ? (
                        <div className="h-8 w-8 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 border border-red-500/20 text-red-500 font-bold text-[9px] uppercase tracking-wider">
                          PDF
                        </div>
                      ) : (
                        <div className="h-8 w-8 bg-teal-500/10 rounded-lg flex items-center justify-center shrink-0 border border-teal-500/20 text-teal-400 font-bold text-[9px] uppercase tracking-wider">
                          IMG
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5 min-w-0">
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (file?.fileUrl) {
                              downloadFileUrl(file.fileUrl, file.name || 'file');
                            }
                          }}
                          className="font-medium text-zinc-200 hover:text-primary transition-colors hover:underline truncate"
                          title={file?.name || 'file'}
                        >
                          {file?.name || 'Unnamed File'}
                        </a>
                        <span className="text-zinc-500 shrink-0" title="Shared with group">
                          👥
                        </span>
                      </div>
                    </div>

                    {/* Owner Column */}
                    <div className="col-span-3 sm:col-span-3 hidden sm:flex items-center gap-2 min-w-0 pr-4">
                      <div className="h-6 w-6 rounded-full bg-violet-600/90 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {ownerInitial}
                      </div>
                      <span className="text-zinc-300 truncate" title={ownerName}>
                        {ownerName}
                      </span>
                    </div>

                    {/* Date Modified Column */}
                    <div className="col-span-3 sm:col-span-2 hidden sm:flex items-center text-zinc-400">
                      {dateModified}
                    </div>

                    {/* File Size Column */}
                    <div className="col-span-3 sm:col-span-1 flex items-center justify-end sm:justify-start text-zinc-400 font-mono text-xs">
                      {fileSize}
                    </div>

                    {/* Action Column */}
                    <div className="col-span-3 sm:col-span-1 flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 shrink-0"
                        onClick={() => {
                          if (file?.fileUrl) {
                            downloadFileUrl(file.fileUrl, file.name || 'file');
                          }
                        }}
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No files in this folder.
              </div>
            )}
          </div>
        </div>
      ) : !hasFile ? (
        <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden w-full border border-white/5">
          <CardContent className="p-8">
            <div className="aspect-video bg-secondary/20 rounded-[1.5rem] flex flex-col items-center justify-center border-2 border-dashed border-primary/20 p-10 text-center gap-4">
              <Monitor className="h-12 w-12 text-primary/40" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No Preview Available</h3>
                <p className="text-sm text-muted-foreground max-w-xs">We haven't added a link for this subject yet. Check back soon!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isYoutube ? (
        <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden w-full border border-white/5">
          <CardContent className="p-8">
            <div className="aspect-video bg-black rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-primary/20 shadow-2xl relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50" />
               <div className="text-center space-y-4 z-10">
                  <div className="h-20 w-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    <Youtube className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-white font-headline font-bold text-xl">YouTube Study Hub</p>
                  <Button variant="secondary" className="rounded-full font-bold" asChild>
                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">Open Course Material <ExternalLink className="ml-2 h-4 w-4" /></a>
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden w-full border border-white/5 bg-zinc-900/30 backdrop-blur-md">
          <CardContent className="p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 text-primary">
              <FileText className="h-10 w-10" />
            </div>
            
            <div className="space-y-2 max-w-lg">
              <h2 className="text-2xl font-bold font-headline text-zinc-100">Document Ready for Download</h2>
              <p className="text-sm text-zinc-400">
                You can download the full PDF document directly to your device. No account sign-in or verification limits.
              </p>
            </div>

            {/* Document stats */}
            <div className="flex items-center gap-6 text-xs text-zinc-400 bg-white/5 px-6 py-3 rounded-full border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-zinc-300">Format:</span> PDF Document
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-zinc-300">Size:</span> {getSimulatedFileSize(material.title || 'notes.pdf')}
              </div>
            </div>

            {/* Huge primary download button */}
            <Button 
              size="lg" 
              className="rounded-full px-12 h-14 shadow-xl shadow-primary/20 font-headline font-black uppercase tracking-wider text-sm transition-all hover:scale-[1.03] active:scale-[0.98] w-full max-w-sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2.5 h-5 w-5" />
                  Get Study Material
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 2. Bottom Split Layout: About Notes and AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-headline font-bold text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" /> About These Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                {material.description}
              </p>
              <div className="bg-secondary/50 p-6 rounded-2xl flex items-center gap-4 text-sm border border-primary/10 mt-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                   <AlertCircle className="text-primary h-6 w-6" />
                </div>
                <p className="font-medium">Please verify these materials with the official syllabus at nitsri.ac.in before exams.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden relative rounded-[2rem] group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <BrainCircuit className="h-32 w-32" />
            </div>
            <CardHeader className="relative z-10 border-b border-white/10 pb-6">
              <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                AI Redefined Assistant
              </CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium">
                Advanced tools for deep academic insight.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              <Tabs defaultValue="simplify" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-primary-foreground/10 mb-0 border-none p-1 rounded-none h-14">
                  <TabsTrigger value="simplify" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">Explain</TabsTrigger>
                  <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">Summary</TabsTrigger>
                  <TabsTrigger value="practice" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">Practice</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simplify" className="p-6 min-h-[300px] focus-visible:ring-0">
                  {simplified ? (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                       <div className="bg-white/10 p-5 rounded-2xl border border-white/5 shadow-inner">
                          <div className="flex items-center gap-2 text-accent mb-3">
                             <Lightbulb className="h-5 w-5" />
                             <span className="font-black uppercase tracking-widest text-[10px]">Simple Analogy</span>
                          </div>
                          <p className="text-sm leading-relaxed italic">{simplified.explanation}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Key Intuitions</p>
                          {simplified.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-xs font-bold bg-white/5 p-3 rounded-xl">
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                              {pt}
                            </div>
                          ))}
                       </div>
                       <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase" onClick={() => setSimplified(null)}>Reset Assistant</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 gap-6 text-center">
                      <div className="bg-white/10 p-5 rounded-full">
                        <Zap className="h-10 w-10 text-accent animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold">Concept Simplifier</p>
                        <p className="text-xs text-primary-foreground/60 max-w-[200px]">Get a student-friendly explanation of "{material.title}".</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-10 font-bold h-12 shadow-xl"
                        onClick={handleSimplifyConcept}
                        disabled={isLoadingSimplified}
                      >
                        {isLoadingSimplified ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Explain Simply
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="summary" className="p-6 min-h-[300px] focus-visible:ring-0">
                  {summary ? (
                    <div className="text-sm bg-white/10 p-5 rounded-2xl leading-relaxed animate-in fade-in zoom-in duration-500 border border-white/5 shadow-inner">
                      <div className="flex items-center gap-2 text-accent mb-4">
                         <FileText className="h-5 w-5" />
                         <span className="font-black uppercase tracking-widest text-[10px]">Structured Summary</span>
                      </div>
                      <MarkdownRenderer text={summary} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 gap-6 text-center">
                      <div className="bg-white/10 p-5 rounded-full">
                        <BrainCircuit className="h-10 w-10 opacity-40" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold">Smart Digest</p>
                        <p className="text-xs text-primary-foreground/60 max-w-[200px]">Extract key points and a structured summary from these notes.</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-10 font-bold h-12 shadow-xl"
                        onClick={handleGenerateSummary}
                        disabled={isLoadingSummary}
                      >
                        {isLoadingSummary ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Generate Digest
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="practice" className="p-6 min-h-[300px] focus-visible:ring-0">
                  {questions ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                      <div className="flex items-center gap-2 text-accent mb-4">
                         <Terminal className="h-5 w-5" />
                         <span className="font-black uppercase tracking-widest text-[10px]">Practice Lab</span>
                      </div>
                      {questions.map((q, i) => (
                        <div key={i} className="text-sm bg-white/10 p-4 rounded-2xl flex gap-3 border border-white/5 group/q hover:bg-white/15 transition-colors">
                          <span className="font-black text-accent group-hover/q:scale-110 transition-transform">Q{i+1}</span> 
                          <span className="leading-relaxed font-medium">{q}</span>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase" onClick={() => setQuestions(null)}>New Practice Set</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 gap-6 text-center">
                      <div className="bg-white/10 p-5 rounded-full">
                        <MessageSquare className="h-10 w-10 opacity-40" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold">Exam Simulator</p>
                        <p className="text-xs text-primary-foreground/60 max-w-[200px]">Turn this material into a set of challenging practice questions.</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-10 font-bold h-12 shadow-xl"
                        onClick={handleGenerateQuestions}
                        disabled={isLoadingQuestions}
                      >
                        {isLoadingQuestions ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                        Create Test
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Study Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-950 text-white border-white/10 rounded-[2rem] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-white/5">
            <DialogTitle className="font-headline font-bold text-2xl text-primary flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> Modify Resource Details
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update the metadata and file link for "{material.title}".
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Document Title</Label>
              <Input 
                id="title"
                value={editFormData.title}
                onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-zinc-900 border-white/10 text-white rounded-xl h-12 focus-visible:ring-primary focus-visible:ring-1"
                placeholder="Enter notes title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Subject Name</Label>
              <Select 
                value={editFormData.subject} 
                onValueChange={(val) => setEditFormData(prev => ({ ...prev, subject: val }))}
              >
                <SelectTrigger id="subject" className="bg-zinc-900 border-white/10 text-white rounded-xl h-12">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                  {editAvailableSubjects.map(sub => (
                    <SelectItem key={sub} value={sub} className="hover:bg-white/10 focus:bg-white/10 focus:text-white text-zinc-200">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Academic Branch</Label>
                <Select 
                  value={editFormData.branch} 
                  onValueChange={(val: Branch) => setEditFormData(prev => ({ ...prev, branch: val }))}
                >
                  <SelectTrigger className="bg-zinc-900 border-white/10 text-white rounded-xl h-12">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                    {BRANCHES.map(br => (
                      <SelectItem key={br} value={br} className="hover:bg-white/10 focus:bg-white/10 focus:text-white text-zinc-200">
                        {br}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Semester</Label>
                <Select 
                  value={String(editFormData.semester)} 
                  onValueChange={(val) => setEditFormData(prev => ({ ...prev, semester: Number(val) as Semester }))}
                >
                  <SelectTrigger className="bg-zinc-900 border-white/10 text-white rounded-xl h-12">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                    {SEMESTERS.map(sem => (
                      <SelectItem key={sem} value={String(sem)} className="hover:bg-white/10 focus:bg-white/10 focus:text-white text-zinc-200">
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resource Type</Label>
                <Select 
                  value={editFormData.type} 
                  onValueChange={(val: MaterialType) => setEditFormData(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger className="bg-zinc-900 border-white/10 text-white rounded-xl h-12">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                    {MATERIAL_TYPES.map(t => (
                      <SelectItem key={t} value={t} className="hover:bg-white/10 focus:bg-white/10 focus:text-white text-zinc-200">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Shared By (Author)</Label>
                <Input 
                  id="author"
                  value={editFormData.author}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="bg-zinc-900 border-white/10 text-white rounded-xl h-12 focus-visible:ring-primary focus-visible:ring-1"
                  placeholder="Author name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resource File URL / Link</Label>
              <Input 
                id="fileUrl"
                value={editFormData.fileUrl}
                onChange={(e) => setEditFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                className="bg-zinc-900 border-white/10 text-white rounded-xl h-12 focus-visible:ring-primary focus-visible:ring-1"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</Label>
              <Textarea 
                id="description"
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-zinc-900 border-white/10 text-white rounded-xl min-h-[100px] focus-visible:ring-primary focus-visible:ring-1"
                placeholder="Explain what this material is..."
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsEditDialogOpen(false)} 
                className="rounded-full px-6 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSavingEdit} 
                className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MaterialDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <ErrorBoundary>
      <MaterialDetailPageContent {...props} />
    </ErrorBoundary>
  );
}

