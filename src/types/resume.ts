export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  photo: string;
  basicInfo: BasicInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

export const defaultResumeData: ResumeData = {
  photo: '',
  basicInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
  },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: [],
};

export function createEducationItem(): EducationItem {
  return {
    id: crypto.randomUUID(),
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
  };
}

export function createExperienceItem(): ExperienceItem {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  };
}
