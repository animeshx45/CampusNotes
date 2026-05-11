
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

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  createdAt: any;
  updatedAt: any;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  branch: Branch;
  semester: Semester;
  type: MaterialType;
  fileUrl: string;
  author: string;
  uploaderId: string;
  downloadCount: number;
  views: number;
  createdAt: any;
  branchId?: string;
  semesterId?: string;
  materialTypeId?: string;
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
