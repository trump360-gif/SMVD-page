import type { AboutPerson } from '@/hooks/useAboutEditor';

export type PersonFormData = Omit<AboutPerson, 'id' | 'order'>;

export interface PersonFormModalProps {
  isOpen: boolean;
  person: AboutPerson | null;
  role: 'professor' | 'instructor';
  onClose: () => void;
  onSubmit: (data: PersonFormData) => void;
}

export const EMPTY_PROFESSOR_FORM: PersonFormData = {
  name: '',
  title: '',
  role: 'professor',
  office: '',
  email: [],
  phone: '',
  major: '',
  specialty: '',
  badge: '',
  profileImage: '',
  courses: {
    undergraduate: [],
    graduate: [],
  },
  biography: {
    cvText: '',
    position: '',
    education: [],
    experience: [],
  },
};

export const EMPTY_INSTRUCTOR_FORM: PersonFormData = {
  name: '',
  title: '',
  role: 'instructor',
  office: '',
  email: [],
  phone: '',
  major: '',
  specialty: '',
  badge: '',
  profileImage: '',
  courses: {
    undergraduate: [],
    graduate: [],
  },
  biography: {
    cvText: '',
    position: '',
    education: [],
    experience: [],
  },
};
