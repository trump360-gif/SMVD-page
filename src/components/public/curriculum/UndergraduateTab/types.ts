export interface Course {
  name: string;
  color: string;
  classification?: 'required' | 'elective';
}

export interface Semester {
  year: number;
  term: number;
  courses: Course[];
}

export interface GraduateModule {
  name: string;
  track: string;
  courses: string;
  requirements: string;
  credits: string;
}

export interface ModuleDetail {
  module: string;
  title: string;
  description: string;
  courses: string;
}

export interface FilterOption {
  label: string;
  value: string;
  color?: string;
}
