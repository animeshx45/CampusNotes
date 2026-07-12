export type Branch = 
  | 'Information Technology' 
  | 'Computer Science & Engineering' 
  | 'Electrical Engineering' 
  | 'Mechanical Engineering' 
  | 'Chemical Engineering' 
  | 'Civil Engineering' 
  | 'Electronics & Communication Engineering' 
  | 'Metallurgical & Materials Engineering'
  | 'Common to All'
  | 'Placement Materials';

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type MaterialType = 'Note' | 'Assignment' | 'Previous Year Paper' | 'Textbook' | 'Lab Manual' | 'YouTube Playlist' | 'Folder';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: UserRole;
  branch?: Branch;
  semester?: Semester;
  createdAt: any;
  updatedAt: any;
}

export interface FolderFile {
  name: string;
  fileUrl: string;
  type: 'pdf' | 'image';
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject?: string;
  description: string;
  branch: Branch;
  semester: Semester;
  type: MaterialType;
  fileUrl: string;
  author: string;
  uploaderId: string;
  downloadCount: number;
  views: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  folderFiles?: FolderFile[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  branch: Branch;
  createdAt: any;
  likes?: string[];
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  likes?: string[];
}

export interface Notification {
  id: string;
  message: string;
  targetRole?: UserRole | 'all';
  createdAt: any;
}

export interface DepartmentRepresentative {
  branch: Branch;
  name: string;
  year: string;
  email: string;
  linkedin?: string;
  imageUrl?: string;
  message?: string;
}
