export type JDStatus = 'Draft' | 'Active' | 'Closed' | 'Archived';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Director' | 'Executive';

export interface listItem {
  id: string;
  value: string;
}

export interface JobDescriptionRecord {
  id: string; // e.g., JD-ENG-001
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange?: string;
  reportsTo?: string;
  status: JDStatus;
  dateCreated: string;
  dateLastModified: string;
  summary: string;
  responsibilities: listItem[];
  requirements: listItem[];
  skills: listItem[];
}

export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'list' }
  | { type: 'form', recordId?: string }
  | { type: 'detail', recordId: string };
