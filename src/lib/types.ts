
export type Branch = 'Electrical' | 'IT' | 'CS' | 'Mechanical' | 'Chemical' | 'Civil';

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type MaterialType = 'Note' | 'Assignment' | 'Previous Year Paper' | 'Textbook' | 'Lab Manual';

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  branch: Branch;
  semester: Semester;
  type: MaterialType;
  author: string;
  fileUrl: string;
  createdAt: string;
  downloadCount: number;
}
