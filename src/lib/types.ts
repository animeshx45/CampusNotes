
export type Branch = 
  | 'Information Technology' 
  | 'Computer Science & Engineering' 
  | 'Electrical Engineering' 
  | 'Mechanical Engineering' 
  | 'Chemical Engineering' 
  | 'Civil Engineering'
  | 'Electronics & Communication Engineering'
  | 'Metallurgical & Materials Engineering';

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type MaterialType = 'Note' | 'Assignment' | 'Previous Year Paper' | 'Textbook' | 'Lab Manual' | 'YouTube Playlist';

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  branch: Branch;
  semester: Semester;
  type: MaterialType;
  author: string;
  fileUrl: string;
  createdAt: any;
  updatedAt?: any;
  downloadCount: number;
  views?: number;
  uploaderId?: string;
}

export interface DepartmentRepresentative {
  branch: Branch;
  name: string;
  year: string;
  email: string;
  linkedin: string;
  imageUrl: string;
  message: string;
}
