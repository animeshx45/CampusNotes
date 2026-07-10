"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BRANCHES, SEMESTERS, MATERIAL_TYPES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, CheckCircle2, Loader2, Zap, GraduationCap, FolderOpen, 
  ListPlus, FileSpreadsheet, PlayCircle, Trash2, AlertTriangle, 
  Check, Info, Link2, ExternalLink, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import { Branch, MaterialType, Semester, FolderFile } from '@/lib/types';
import { initializeFirebase } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';

interface BulkUploadItem {
  tempId: string;
  title: string;
  subject?: string;
  description: string;
  branch: Branch;
  semester: Semester;
  type: MaterialType;
  fileUrl: string;
  author: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMsg?: string;
}

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

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useAuth();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolderFiles, setSelectedFolderFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    branch: '' as Branch,
    semester: 1 as Semester,
    type: 'Note' as MaterialType,
    author: '',
    fileUrl: '',
  });

  // Bulk YouTube / Link States
  const [bulkLinksText, setBulkLinksText] = useState('');
  const [bulkLinksDefaults, setBulkLinksDefaults] = useState({
    branch: '' as Branch,
    semester: 1 as Semester,
    type: 'YouTube Playlist' as MaterialType,
    author: '',
    description: 'Reference video lectures and playlists.',
  });
  const [bulkLinkItems, setBulkLinkItems] = useState<BulkUploadItem[]>([]);
  const [isBulkLinksPrepared, setIsBulkLinksPrepared] = useState(false);

  // Bulk CSV/JSON States
  const [jsonPasteText, setJsonPasteText] = useState('');
  const [bulkFileItems, setBulkFileItems] = useState<BulkUploadItem[]>([]);
  const [isFilePrepared, setIsFilePrepared] = useState(false);

  // Shared Bulk Upload Progress
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [bulkUploadStatusText, setBulkUploadStatusText] = useState('');

  const availableSubjects = getSubjectsForFilter(formData.branch, formData.semester as number);

  useEffect(() => {
    const list = getSubjectsForFilter(formData.branch, formData.semester as number);
    if (list.length > 0) {
      setFormData(prev => ({ ...prev, subject: list[0] }));
    } else {
      setFormData(prev => ({ ...prev, subject: '' }));
    }
  }, [formData.semester, formData.branch]);

  // Auth guard - early returns AFTER all hooks
  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium text-sm">Verifying authentication status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-md text-center space-y-8 animate-in fade-in duration-500">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-headline font-bold text-primary">Login Required</h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Please log in or sign up to upload study materials to CampusNotes.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push('/login')} className="w-full h-12 rounded-full font-bold shadow-lg" size="lg">
            Log In
          </Button>
          <Button onClick={() => router.push('/signup')} variant="outline" className="w-full h-12 rounded-full font-bold" size="lg">
            Create an Account
          </Button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxLimit = 50 * 1024 * 1024; // 50MB limit
      if (file.size > maxLimit) {
        toast({
          title: "File too large!",
          description: "Maximum allowed file size is 50MB.",
          variant: "destructive"
        });
        e.target.value = ''; // Reset input
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const allowedFiles = filesArray.filter(file => {
        const name = file.name.toLowerCase();
        return name.endsWith('.pdf') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
      });

      if (allowedFiles.length === 0) {
        toast({
          title: "No valid files found!",
          description: "Folders must contain at least one PDF or Image.",
          variant: "destructive"
        });
        e.target.value = '';
        setSelectedFolderFiles([]);
        return;
      }

      const maxLimit = 50 * 1024 * 1024; // 50MB limit per file
      const oversized = allowedFiles.filter(f => f.size > maxLimit);
      if (oversized.length > 0) {
        toast({
          title: "Some files are too large!",
          description: "All files inside the folder must be under 50MB.",
          variant: "destructive"
        });
        e.target.value = '';
        setSelectedFolderFiles([]);
        return;
      }

      setSelectedFolderFiles(allowedFiles);
    }
  };

  const uploadFileHelper = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
    // ============================================================
    // UPLOAD STRATEGY: Direct-to-Firebase-Storage
    // ============================================================
    // Files are uploaded DIRECTLY from the browser to Firebase Storage.
    // The server never touches the file bytes — this completely eliminates:
    //   - 413 Payload Too Large errors (no server body size limit)
    //   - MongoDB 16MB BSON document limit
    //   - Progress bar resetting (single upload path, no fallback chains)
    //   - Serverless function timeouts
    // ============================================================

    const { firebaseApp } = initializeFirebase();
    const auth = getAuth(firebaseApp);

    // Sign in anonymously if not already authenticated (required by Storage security rules)
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (authErr: any) {
        console.warn('Firebase anonymous auth failed:', authErr);
        // Don't block upload — some Storage rules allow public writes
      }
    }

    // Try the default bucket first, then the explicit bucket URL as fallback
    const bucketConfigs = [
      undefined, // default bucket from firebaseConfig.storageBucket
      `gs://studio-864601925-cef48.appspot.com` // explicit bucket
    ];

    let lastError: Error | null = null;

    for (const bucketUrl of bucketConfigs) {
      try {
        const storage = bucketUrl ? getStorage(firebaseApp, bucketUrl) : getStorage(firebaseApp);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `materials/${Date.now()}-${safeName}`;
        const fileRef = ref(storage, storagePath);

        const url = await new Promise<string>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(fileRef, file, {
            contentType: file.type || 'application/octet-stream',
            customMetadata: { originalName: file.name }
          });

          // Timeout: 3 minutes for large files
          const timeoutId = setTimeout(() => {
            try { uploadTask.cancel(); } catch (_) {}
            reject(new Error('Upload timed out. Please check your connection and try again.'));
          }, 180_000);

          uploadTask.on('state_changed',
            (snapshot) => {
              // Report real progress — never resets because there's only one upload
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              onProgress(pct);
            },
            (error) => {
              clearTimeout(timeoutId);
              reject(error);
            },
            async () => {
              clearTimeout(timeoutId);
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              } catch (urlErr) {
                reject(urlErr);
              }
            }
          );
        });

        return url; // Success — return immediately
      } catch (err: any) {
        lastError = err;
        console.warn(`Firebase upload failed${bucketUrl ? ` (bucket: ${bucketUrl})` : ' (default bucket)'}:`, err?.message);
        // Continue to next bucket config
      }
    }

    // Both bucket attempts failed
    throw new Error(
      lastError?.message?.includes('timed out')
        ? 'Upload timed out. Please check your internet connection and try again.'
        : lastError?.message?.includes('unauthorized') || lastError?.message?.includes('permission')
          ? 'Storage permission denied. Please contact the administrator.'
          : `Failed to upload file: ${lastError?.message || 'Unknown error'}`
    );
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branch || !formData.title || !formData.description || !formData.author) {
      toast({ title: "Wait!", description: "Please fill in all the details including your name.", variant: "destructive" });
      return;
    }

    if (formData.type === 'Folder' && selectedFolderFiles.length === 0) {
      toast({ title: "No folder files!", description: "Please pick a folder containing PDFs or Images.", variant: "destructive" });
      return;
    }

    if (formData.type !== 'YouTube Playlist' && formData.type !== 'Folder' && !selectedFile) {
      toast({ title: "No file!", description: "Please pick a file to upload.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      let finalFileUrl = formData.fileUrl;
      let folderFiles: FolderFile[] = [];

      if (formData.type === 'Folder') {
        const totalFiles = selectedFolderFiles.length;
        for (let i = 0; i < totalFiles; i++) {
          const file = selectedFolderFiles[i];
          const fileUrl = await uploadFileHelper(file, (progress) => {
            const overall = Math.round((i / totalFiles) * 100 + (progress / totalFiles));
            setUploadProgress(overall);
          });
          
          folderFiles.push({
            name: file.name,
            fileUrl,
            type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
          });
        }
        finalFileUrl = folderFiles[0]?.fileUrl || 'folder';
      } else if (formData.type !== 'YouTube Playlist' && selectedFile) {
        try {
          finalFileUrl = await uploadFileHelper(selectedFile, (progress) => {
            setUploadProgress(progress);
          });
        } catch (uploadError: any) {
          toast({
            title: "Upload Failed",
            description: uploadError.message || "Failed to upload file.",
            variant: "destructive"
          });
          setIsUploading(false);
          setUploadProgress(null);
          return;
        }
      }

      await materialService.uploadMaterial({
        title: formData.title,
        subject: formData.subject || 'General',
        description: formData.description,
        branch: formData.branch,
        semester: formData.semester,
        type: formData.type,
        author: formData.author,
        uploaderId: user.id || user.uid || 'public-user',
        fileUrl: finalFileUrl,
        folderFiles: formData.type === 'Folder' ? folderFiles : undefined,
        status: 'approved',
        createdAt: new Date().toISOString()
      });
      
      setIsSuccess(true);
      setUploadProgress(null);
      toast({
        title: "Done!",
        description: "Your folder notes have been shared with everyone.",
      });
      
      setTimeout(() => router.push('/browse'), 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Helper: parse CSV
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const results: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^["']|["']$/g, ''));
      
      const obj: any = {};
      headers.forEach((header, idx) => {
        if (header) {
          obj[header] = values[idx] || '';
        }
      });
      results.push(obj);
    }
    return results;
  };

  // Helper: validate and transform bulk items
  const validateBulkItem = (item: any, index: number): BulkUploadItem => {
    const errors: string[] = [];
    
    let matchedBranch: Branch = 'Common to All';
    if (!item.branch) {
      errors.push("Branch missing.");
    } else {
      const found = BRANCHES.find(b => b.toLowerCase().trim() === String(item.branch).toLowerCase().trim());
      if (found) {
        matchedBranch = found;
      } else {
        errors.push(`Invalid branch: "${item.branch}".`);
      }
    }

    let matchedSemester: Semester = 1;
    const semNum = parseInt(item.semester);
    if (!item.semester) {
      errors.push("Semester missing.");
    } else if (isNaN(semNum) || semNum < 1 || semNum > 8) {
      errors.push(`Invalid semester: "${item.semester}". Must be 1-8.`);
    } else {
      matchedSemester = semNum as Semester;
    }

    let matchedType: MaterialType = 'Note';
    if (!item.type) {
      errors.push("Type missing.");
    } else {
      const found = MATERIAL_TYPES.find(t => t.toLowerCase().replace(/\s+/g, '') === String(item.type).toLowerCase().replace(/\s+/g, ''));
      if (found) {
        matchedType = found;
      } else {
        errors.push(`Invalid type: "${item.type}".`);
      }
    }

    if (!item.title || !String(item.title).trim()) {
      errors.push("Title missing.");
    }
    if (!item.author || !String(item.author).trim()) {
      errors.push("Contributor missing.");
    }
    if (!item.fileUrl || !String(item.fileUrl).trim()) {
      errors.push("URL missing.");
    } else if (!/^https?:\/\//i.test(String(item.fileUrl).trim())) {
      errors.push("URL must start with http/https.");
    }

    return {
      tempId: `bulk-item-${index}-${Date.now()}`,
      title: item.title || '',
      subject: item.subject || '',
      description: item.description || 'Uploaded in bulk.',
      branch: matchedBranch,
      semester: matchedSemester,
      type: matchedType,
      fileUrl: item.fileUrl || '',
      author: item.author || '',
      status: errors.length > 0 ? 'error' : 'pending',
      errorMsg: errors.length > 0 ? errors.join(' ') : undefined
    };
  };

  // Bulk YouTube / Links Handlers
  const handleProcessBulkLinks = () => {
    if (!bulkLinksDefaults.branch || !bulkLinksDefaults.author) {
      toast({
        title: "Missing details",
        description: "Please specify default branch and contributor name.",
        variant: "destructive"
      });
      return;
    }

    const lines = bulkLinksText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      toast({
        title: "No links pasted",
        description: "Please enter at least one link to process.",
        variant: "destructive"
      });
      return;
    }

    const parsedItems: BulkUploadItem[] = lines.map((line, idx) => {
      let title = '';
      let url = '';

      if (line.includes('|')) {
        const parts = line.split('|');
        title = parts[0].trim();
        url = parts.slice(1).join('|').trim();
      } else {
        url = line;
        title = `${bulkLinksDefaults.type} #${idx + 1} - Sem ${bulkLinksDefaults.semester}`;
      }

      const isValidLink = /^https?:\/\//i.test(url);
      
      return {
        tempId: `link-${idx}-${Date.now()}`,
        title,
        subject: '',
        description: bulkLinksDefaults.description,
        branch: bulkLinksDefaults.branch,
        semester: bulkLinksDefaults.semester,
        type: bulkLinksDefaults.type,
        fileUrl: url,
        author: bulkLinksDefaults.author,
        status: isValidLink ? 'pending' : 'error',
        errorMsg: isValidLink ? undefined : 'Link must start with http:// or https://'
      };
    });

    setBulkLinkItems(parsedItems);
    setIsBulkLinksPrepared(true);
    toast({
      title: "Processed!",
      description: `Prepared ${parsedItems.length} items for review.`
    });
  };

  const handleUpdateLinkItem = (tempId: string, field: keyof BulkUploadItem, value: any) => {
    setBulkLinkItems(prev => prev.map(item => {
      if (item.tempId === tempId) {
        const updated = { ...item, [field]: value };
        if (field === 'fileUrl') {
          const isValid = /^https?:\/\//i.test(value);
          updated.status = isValid ? 'pending' : 'error';
          updated.errorMsg = isValid ? undefined : 'Link must start with http:// or https://';
        }
        return updated;
      }
      return item;
    }));
  };

  const handleDeleteLinkItem = (tempId: string) => {
    setBulkLinkItems(prev => prev.filter(item => item.tempId !== tempId));
  };

  // Bulk File / JSON Handlers
  const handleProcessJSONPaste = () => {
    if (!jsonPasteText.trim()) {
      toast({
        title: "Empty paste area",
        description: "Please paste a JSON array first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(jsonPasteText);
      if (!Array.isArray(parsed)) {
        toast({
          title: "Format error",
          description: "JSON must be an array of objects.",
          variant: "destructive"
        });
        return;
      }

      const validated = parsed.map((item, idx) => validateBulkItem(item, idx));
      setBulkFileItems(validated);
      setIsFilePrepared(true);
      toast({
        title: "JSON Loaded",
        description: `Parsed ${validated.length} items. Check below for any validation errors.`
      });
    } catch (err: any) {
      toast({
        title: "Invalid JSON syntax",
        description: err.message || "Failed to parse JSON. Check your commas and brackets.",
        variant: "destructive"
      });
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;

        try {
          const parsed = parseCSV(text);
          if (parsed.length === 0) {
            toast({ title: "Empty CSV", description: "No data rows found in this file.", variant: "destructive" });
            return;
          }

          const validated = parsed.map((item, idx) => validateBulkItem(item, idx));
          setBulkFileItems(validated);
          setIsFilePrepared(true);
          toast({
            title: "CSV Processed",
            description: `Loaded ${validated.length} rows. Verify details below.`
          });
        } catch (err) {
          toast({ title: "Parse failed", description: "Could not read CSV file format.", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUpdateFileItem = (tempId: string, field: keyof BulkUploadItem, value: any) => {
    setBulkFileItems(prev => prev.map(item => {
      if (item.tempId === tempId) {
        const updated = { ...item, [field]: value };
        const validated = validateBulkItem(updated, 0);
        return {
          ...updated,
          status: validated.status,
          errorMsg: validated.errorMsg,
          branch: validated.branch,
          semester: validated.semester,
          type: validated.type
        };
      }
      return item;
    }));
  };

  const handleDeleteFileItem = (tempId: string) => {
    setBulkFileItems(prev => prev.filter(item => item.tempId !== tempId));
  };

  // Reusable Loop to run sequential uploads to Firebase Firestore
  const executeBulkUpload = async (items: BulkUploadItem[], setItems: React.Dispatch<React.SetStateAction<BulkUploadItem[]>>) => {
    const validItems = items.filter(item => item.status !== 'error');
    if (validItems.length === 0) {
      toast({
        title: "No valid items",
        description: "Please fix all validation errors before uploading.",
        variant: "destructive"
      });
      return;
    }

    setIsBulkUploading(true);
    setBulkUploadProgress(0);
    let successCount = 0;
    const total = items.length;

    for (let i = 0; i < total; i++) {
      const item = items[i];
      if (item.status === 'error') continue;

      setBulkUploadStatusText(`Uploading: ${item.title}`);
      setItems(prev => prev.map(p => p.tempId === item.tempId ? { ...p, status: 'uploading' } : p));

      try {
        await materialService.uploadMaterial({
          title: item.title,
          subject: item.subject || 'General',
          description: item.description,
          branch: item.branch,
          semester: item.semester,
          type: item.type,
          author: item.author,
          uploaderId: user.id || user.uid || 'public-user',
          fileUrl: item.fileUrl,
          status: 'approved',
          createdAt: new Date().toISOString()
        });

        successCount++;
        setItems(prev => prev.map(p => p.tempId === item.tempId ? { ...p, status: 'success' } : p));
      } catch (err) {
        setItems(prev => prev.map(p => p.tempId === item.tempId ? { ...p, status: 'error', errorMsg: 'Failed to save' } : p));
      }

      setBulkUploadProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsBulkUploading(false);
    setBulkUploadStatusText('');
    toast({
      title: "Finished Bulk Upload!",
      description: `Successfully shared ${successCount} materials with the library.`,
    });

    // If everything is uploaded successfully, route after short delay
    const hasRemainingErrors = items.some(item => item.status === 'error');
    if (!hasRemainingErrors && successCount > 0) {
      setIsSuccess(true);
      setTimeout(() => router.push('/browse'), 2000);
    }
  };

  const getTemplateCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,title,description,branch,semester,type,fileUrl,author\n" +
      '"Physics Midterm Study Guide","Handwritten notes for calculus-based physics","Common to All",1,"Note","https://drive.google.com/...","Animesh Kumar"\n' +
      '"Intro to Data Structures","Video series playlist explaining binary search trees","Computer Science & Engineering",3,"YouTube Playlist","https://www.youtube.com/playlist?list=...","Dr. Amit"';
    return encodeURI(csvContent);
  };

  const getTemplateJSON = () => {
    const data = [
      {
        title: "Calculus Part 1",
        description: "Differential equations crash course",
        branch: "Common to All",
        semester: 1,
        type: "YouTube Playlist",
        fileUrl: "https://www.youtube.com/playlist?list=...",
        author: "Prof. Sharma"
      }
    ];
    return JSON.stringify(data, null, 2);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center gap-8 animate-in fade-in zoom-in duration-500">
        <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Content Shared Successfully!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Thanks for helping out. Your uploads are now in the library for everyone to see.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/browse')} className="rounded-xl px-8 h-12 font-bold">Go to Library</Button>
          <Button variant="outline" onClick={() => {
            setIsSuccess(false);
            setBulkLinkItems([]);
            setBulkFileItems([]);
            setIsBulkLinksPrepared(false);
            setIsFilePrepared(false);
          }} className="rounded-xl px-8 h-12 border-primary/20">Upload More</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-primary">Share Your <span className="text-foreground">Materials</span></h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">
          Help your fellow students at NIT Srinagar. Paste playlist links or upload in bulk!
        </p>
      </div>

      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card border border-primary/5">
        <CardHeader className="bg-primary text-primary-foreground p-8 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 p-8 opacity-10">
              <GraduationCap className="h-48 w-48" />
           </div>
           <CardTitle className="text-2xl relative z-10 font-bold">Resource Uploader</CardTitle>
           <CardDescription className="text-primary-foreground/80 relative z-10 font-medium">Choose between single upload, bulk links paste, or file importing.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/20 rounded-xl p-1.5 mb-8">
              <TabsTrigger value="single" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5">
                Single Upload
              </TabsTrigger>
              <TabsTrigger value="bulk-links" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5">
                Bulk YouTube / Links
              </TabsTrigger>
              <TabsTrigger value="bulk-file" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5">
                Bulk CSV / JSON
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: SINGLE UPLOAD */}
            <TabsContent value="single" className="space-y-6 focus-visible:ring-0">
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Physics Mid-Sem Notes" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contributor Name</Label>
                    <Input 
                      id="author" 
                      placeholder="Your Name (e.g. Animesh Kumar)" 
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</Label>
                    <Select onValueChange={(v) => setFormData({...formData, branch: v as Branch})} value={formData.branch}>
                      <SelectTrigger id="branch" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                        <SelectValue placeholder="Which branch?" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Semester</Label>
                    <Select onValueChange={(v) => setFormData({...formData, semester: parseInt(v) as Semester})} value={formData.semester?.toString()}>
                      <SelectTrigger id="semester" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                        <SelectValue placeholder="Which semester?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject Name</Label>
                    <Select onValueChange={(v) => setFormData({...formData, subject: v})} value={formData.subject}>
                      <SelectTrigger id="subject" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Note Type</Label>
                    <Select onValueChange={(v) => setFormData({...formData, type: v as MaterialType})} value={formData.type}>
                      <SelectTrigger id="type" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                        <SelectValue placeholder="What is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        {MATERIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Brief Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="What is inside this file?"
                    className="min-h-[120px] rounded-xl p-4 bg-secondary/20 border-none shadow-inner"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {formData.type === 'YouTube Playlist' 
                      ? 'Link to Video' 
                      : formData.type === 'Folder' 
                        ? 'Select Study Folder' 
                        : 'Pick Your File'}
                  </Label>
                  {formData.type === 'YouTube Playlist' ? (
                    <Input 
                      placeholder="https://www.youtube.com/..." 
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                      className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner"
                      required
                    />
                  ) : formData.type === 'Folder' ? (
                    <div className="relative border-2 border-dashed rounded-2xl p-10 text-center hover:border-primary transition-colors group cursor-pointer bg-secondary/5">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFolderChange}
                        {...{
                          webkitdirectory: "true",
                          directory: "true",
                          multiple: true
                        } as any}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <FolderOpen className="h-10 w-10 text-primary mb-2 animate-bounce" />
                        <p className="font-bold">
                          {selectedFolderFiles.length > 0 
                            ? `Selected Folder containing ${selectedFolderFiles.length} files` 
                            : 'Click to Pick a Folder'}
                        </p>
                        <p className="text-xs text-muted-foreground">Select an entire directory of PDFs and Images</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed rounded-2xl p-10 text-center hover:border-primary transition-colors group cursor-pointer bg-secondary/5">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.png"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-primary mb-2" />
                        <p className="font-bold">{selectedFile ? selectedFile.name : 'Click to Pick a File'}</p>
                        <p className="text-xs text-muted-foreground">PDF, Images (Max 50MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-3 bg-secondary/15 p-6 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-300">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading Materials
                      </span>
                      <span className="font-mono text-primary font-black text-sm">{uploadProgress ?? 0}%</span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(234,179,8,0.5)]" 
                        style={{ width: `${uploadProgress ?? 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Please keep this window open while we upload and store your notes securely.
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full h-16 rounded-xl text-lg font-black bg-primary shadow-xl hover:scale-[1.02] transition-transform" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Syncing Knowledge... {uploadProgress !== null ? `(${uploadProgress}%)` : ''}
                    </>
                  ) : (
                    <>
                      Publish for Everyone <Zap className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* TAB 2: BULK YOUTUBE / LINKS */}
            <TabsContent value="bulk-links" className="space-y-6 focus-visible:ring-0">
              <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 mb-6">
                <h3 className="font-bold text-primary flex items-center gap-2 mb-2"><Info className="h-4 w-4" /> Bulk Link Import Instructions</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your YouTube links (playlists or individual videos) in the textbox below. Place each link on a new line.<br />
                  You can optionally provide a custom title for each link using the format: <strong>Title | Link</strong>. 
                  If no title is provided, a generic one will be created based on your defaults.
                </p>
              </div>

              {!isBulkLinksPrepared ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/5 p-6 rounded-2xl border border-secondary/10">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Department</Label>
                      <Select onValueChange={(v) => setBulkLinksDefaults({...bulkLinksDefaults, branch: v as Branch})} value={bulkLinksDefaults.branch}>
                        <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm">
                          <SelectValue placeholder="Which branch?" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Semester</Label>
                      <Select onValueChange={(v) => setBulkLinksDefaults({...bulkLinksDefaults, semester: parseInt(v) as Semester})} value={bulkLinksDefaults.semester.toString()}>
                        <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm">
                          <SelectValue placeholder="Which semester?" />
                        </SelectTrigger>
                        <SelectContent>
                          {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Contributor Name</Label>
                      <Input 
                        placeholder="Your Name"
                        value={bulkLinksDefaults.author}
                        onChange={(e) => setBulkLinksDefaults({...bulkLinksDefaults, author: e.target.value})}
                        className="rounded-xl h-12 bg-background border-none shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Material Type</Label>
                      <Select onValueChange={(v) => setBulkLinksDefaults({...bulkLinksDefaults, type: v as MaterialType})} value={bulkLinksDefaults.type}>
                        <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm">
                          <SelectValue placeholder="Material Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {MATERIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Description</Label>
                      <Input 
                        placeholder="A short description for these videos."
                        value={bulkLinksDefaults.description}
                        onChange={(e) => setBulkLinksDefaults({...bulkLinksDefaults, description: e.target.value})}
                        className="rounded-xl h-12 bg-background border-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">YouTube Links / Playlists (one per line)</Label>
                    <Textarea 
                      placeholder="e.g.&#10;https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYzA1SPg1USw2p8&#10;Physics Lectures Part 1 | https://www.youtube.com/watch?v=mUN8L2mS0-w"
                      className="min-h-[200px] rounded-xl p-4 bg-secondary/10 border-none shadow-inner font-mono text-xs"
                      value={bulkLinksText}
                      onChange={(e) => setBulkLinksText(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleProcessBulkLinks} className="w-full h-14 rounded-xl text-md font-bold bg-primary shadow-md">
                    Process & Preview Links <ListPlus className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                    <span className="text-sm font-medium text-muted-foreground">Prepared: <strong>{bulkLinkItems.length}</strong> items</span>
                    <Button variant="outline" size="sm" onClick={() => setIsBulkLinksPrepared(false)} disabled={isBulkUploading} className="rounded-xl">
                      Go Back & Add More
                    </Button>
                  </div>

                  {isBulkUploading && (
                    <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span>{bulkUploadStatusText}</span>
                        <span>{bulkUploadProgress}%</span>
                      </div>
                      <Progress value={bulkUploadProgress} className="h-2 bg-secondary" />
                    </div>
                  )}

                  <div className="border rounded-2xl overflow-hidden shadow-inner max-h-[400px] overflow-y-auto bg-card">
                    <Table>
                      <TableHeader className="bg-secondary/10">
                        <TableRow>
                          <TableHead className="w-1/3">Title</TableHead>
                          <TableHead className="w-1/2">URL</TableHead>
                          <TableHead className="w-24 text-center">Status</TableHead>
                          <TableHead className="w-16 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bulkLinkItems.map((item) => (
                          <TableRow key={item.tempId}>
                            <TableCell className="p-2">
                              <Input 
                                value={item.title} 
                                onChange={(e) => handleUpdateLinkItem(item.tempId, 'title', e.target.value)}
                                className="h-8 text-xs font-bold rounded-lg border-none bg-secondary/5 focus-visible:ring-1"
                                disabled={isBulkUploading}
                              />
                            </TableCell>
                            <TableCell className="p-2">
                              <Input 
                                value={item.fileUrl} 
                                onChange={(e) => handleUpdateLinkItem(item.tempId, 'fileUrl', e.target.value)}
                                className="h-8 text-xs rounded-lg border-none bg-secondary/5 focus-visible:ring-1"
                                disabled={isBulkUploading}
                              />
                              {item.errorMsg && <p className="text-[10px] text-destructive mt-1 font-bold">{item.errorMsg}</p>}
                            </TableCell>
                            <TableCell className="p-2 text-center text-xs">
                              {item.status === 'pending' && <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-none font-bold">Pending</Badge>}
                              {item.status === 'uploading' && <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold flex items-center justify-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Syncing</Badge>}
                              {item.status === 'success' && <Badge variant="outline" className="bg-green-500/10 text-green-600 border-none font-bold flex items-center justify-center gap-1"><Check className="h-3 w-3" /> Done</Badge>}
                              {item.status === 'error' && <Badge variant="outline" className="bg-destructive/10 text-destructive border-none font-bold">Error</Badge>}
                            </TableCell>
                            <TableCell className="p-2 text-center">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteLinkItem(item.tempId)}
                                disabled={isBulkUploading}
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {bulkLinkItems.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">
                              No items left.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <Button 
                    onClick={() => executeBulkUpload(bulkLinkItems, setBulkLinkItems)} 
                    disabled={isBulkUploading || bulkLinkItems.length === 0 || bulkLinkItems.some(i => i.status === 'error')}
                    className="w-full h-16 rounded-xl text-lg font-black bg-primary shadow-xl hover:scale-[1.02] transition-transform"
                  >
                    {isBulkUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading {bulkLinkItems.filter(i => i.status === 'success').length + 1} of {bulkLinkItems.length}...
                      </>
                    ) : (
                      <>
                        Upload {bulkLinkItems.length} Links to Library <PlayCircle className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: BULK FILE / CSV / JSON */}
            <TabsContent value="bulk-file" className="space-y-6 focus-visible:ring-0">
              <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 mb-6 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-primary flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /> File Bulk Upload Guidelines</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                    Import study resources using a structured CSV file or JSON array. 
                    Ensure headers match: <code>title</code>, <code>description</code>, <code>branch</code>, <code>semester</code>, <code>type</code>, <code>fileUrl</code>, <code>author</code>.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 self-center">
                  <Button variant="outline" size="sm" className="rounded-xl border-primary/20 text-xs font-bold" asChild>
                    <a href={getTemplateCSV()} download="nit_srinagar_bulk_template.csv">Get CSV Template</a>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl border-primary/20 text-xs font-bold" onClick={() => {
                    setJsonPasteText(getTemplateJSON());
                    toast({ title: "Template Copied", description: "Pasted sample JSON in the box below." });
                  }}>Get JSON Template</Button>
                </div>
              </div>

              {!isFilePrepared ? (
                <div className="space-y-8">
                  {/* File Pickers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative border-2 border-dashed rounded-2xl p-10 text-center hover:border-primary transition-colors group cursor-pointer bg-secondary/5">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleCSVUpload}
                        accept=".csv"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
                        <p className="font-bold">Import CSV File</p>
                        <p className="text-xs text-muted-foreground">Select your formatted .csv sheet</p>
                      </div>
                    </div>

                    <div className="relative border-2 border-dashed rounded-2xl p-10 text-center bg-secondary/5 border-none">
                      <div className="flex flex-col items-center gap-2 justify-center h-full p-10">
                        <Link2 className="h-10 w-10 text-primary mb-2" />
                        <p className="font-bold">Paste JSON Data</p>
                        <p className="text-xs text-muted-foreground">Paste array of objects in box below</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">JSON Paste Area</Label>
                    <Textarea 
                      placeholder="Paste your JSON array here..."
                      className="min-h-[180px] rounded-xl p-4 bg-secondary/10 border-none shadow-inner font-mono text-xs"
                      value={jsonPasteText}
                      onChange={(e) => setJsonPasteText(e.target.value)}
                    />
                    <Button onClick={handleProcessJSONPaste} variant="outline" className="w-full h-12 rounded-xl text-sm font-bold border-primary/20">
                      Process JSON Paste
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                    <span className="text-sm font-medium text-muted-foreground">Loaded: <strong>{bulkFileItems.length}</strong> items</span>
                    <Button variant="outline" size="sm" onClick={() => setIsFilePrepared(false)} disabled={isBulkUploading} className="rounded-xl">
                      Upload Different File / Data
                    </Button>
                  </div>

                  {isBulkUploading && (
                    <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span>{bulkUploadStatusText}</span>
                        <span>{bulkUploadProgress}%</span>
                      </div>
                      <Progress value={bulkUploadProgress} className="h-2 bg-secondary" />
                    </div>
                  )}

                  {bulkFileItems.some(i => i.status === 'error') && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3 text-destructive text-xs font-semibold">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <div>
                        Some rows contain validation errors (e.g. invalid department names or missing values). 
                        Please edit the fields directly in the table to fix them before submitting.
                      </div>
                    </div>
                  )}

                  <div className="border rounded-2xl overflow-hidden shadow-inner max-h-[400px] overflow-y-auto bg-card">
                    <Table>
                      <TableHeader className="bg-secondary/10">
                        <TableRow>
                          <TableHead className="w-1/4">Title / Contributor</TableHead>
                          <TableHead className="w-1/4">Branch / Semester</TableHead>
                          <TableHead className="w-1/4">Type / Link</TableHead>
                          <TableHead className="w-24 text-center">Status</TableHead>
                          <TableHead className="w-16 text-center">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bulkFileItems.map((item) => (
                          <TableRow key={item.tempId} className={item.status === 'error' ? "bg-destructive/5" : ""}>
                            <TableCell className="p-2 space-y-1">
                              <Input 
                                value={item.title} 
                                onChange={(e) => handleUpdateFileItem(item.tempId, 'title', e.target.value)}
                                className="h-8 text-xs font-bold rounded-lg border-none bg-secondary/5 focus-visible:ring-1"
                                placeholder="Title"
                                disabled={isBulkUploading}
                              />
                              <Input 
                                value={item.author} 
                                onChange={(e) => handleUpdateFileItem(item.tempId, 'author', e.target.value)}
                                className="h-7 text-[10px] rounded-lg border-none bg-secondary/5 focus-visible:ring-1"
                                placeholder="Contributor"
                                disabled={isBulkUploading}
                              />
                            </TableCell>
                            <TableCell className="p-2 space-y-1">
                              <Select 
                                onValueChange={(v) => handleUpdateFileItem(item.tempId, 'branch', v as Branch)} 
                                value={item.branch}
                                disabled={isBulkUploading}
                              >
                                <SelectTrigger className="h-8 text-xs rounded-lg border-none bg-secondary/5 focus-visible:ring-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select 
                                onValueChange={(v) => handleUpdateFileItem(item.tempId, 'semester', parseInt(v) as Semester)} 
                                value={item.semester?.toString()}
                                disabled={isBulkUploading}
                              >
                                <SelectTrigger className="h-7 text-[10px] rounded-lg border-none bg-secondary/5 focus-visible:ring-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="p-2 space-y-1">
                              <Select 
                                onValueChange={(v) => handleUpdateFileItem(item.tempId, 'type', v as MaterialType)} 
                                value={item.type}
                                disabled={isBulkUploading}
                              >
                                <SelectTrigger className="h-8 text-xs rounded-lg border-none bg-secondary/5 focus-visible:ring-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {MATERIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Input 
                                value={item.fileUrl} 
                                onChange={(e) => handleUpdateFileItem(item.tempId, 'fileUrl', e.target.value)}
                                className="h-7 text-[10px] rounded-lg border-none bg-secondary/5 focus-visible:ring-1"
                                placeholder="URL"
                                disabled={isBulkUploading}
                              />
                            </TableCell>
                            <TableCell className="p-2 text-center align-middle">
                              {item.status === 'pending' && <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-none font-bold">Valid</Badge>}
                              {item.status === 'uploading' && <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold flex items-center justify-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Syncing</Badge>}
                              {item.status === 'success' && <Badge variant="outline" className="bg-green-500/10 text-green-600 border-none font-bold flex items-center justify-center gap-1"><Check className="h-3 w-3" /> Done</Badge>}
                              {item.status === 'error' && (
                                <div className="space-y-1">
                                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-none font-bold text-xs">Invalid</Badge>
                                  <p className="text-[9px] text-destructive max-w-[120px] mx-auto leading-tight text-left font-medium">{item.errorMsg}</p>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="p-2 text-center align-middle">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteFileItem(item.tempId)}
                                disabled={isBulkUploading}
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {bulkFileItems.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                              No items in the list.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <Button 
                    onClick={() => executeBulkUpload(bulkFileItems, setBulkFileItems)} 
                    disabled={isBulkUploading || bulkFileItems.length === 0 || bulkFileItems.some(i => i.status === 'error')}
                    className="w-full h-16 rounded-xl text-lg font-black bg-primary shadow-xl hover:scale-[1.02] transition-transform"
                  >
                    {isBulkUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading {bulkFileItems.filter(i => i.status === 'success').length + 1} of {bulkFileItems.length}...
                      </>
                    ) : (
                      <>
                        Upload {bulkFileItems.length} Items to Library <CheckCircle2 className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
