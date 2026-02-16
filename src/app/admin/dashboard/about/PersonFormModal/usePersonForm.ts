'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AboutPerson } from '@/hooks/useAboutEditor';
import type { PersonFormData } from './types';
import { EMPTY_PROFESSOR_FORM, EMPTY_INSTRUCTOR_FORM } from './types';

export function usePersonForm(
  isOpen: boolean,
  person: AboutPerson | null,
  role: 'professor' | 'instructor',
  onClose: () => void,
  onSubmit: (data: PersonFormData) => Promise<void>
) {
  const emptyForm =
    role === 'professor' ? EMPTY_PROFESSOR_FORM : EMPTY_INSTRUCTOR_FORM;
  const [form, setForm] = useState(emptyForm);
  const [emailText, setEmailText] = useState('');
  const [undergraduateText, setUndergraduateText] = useState('');
  const [graduateText, setGraduateText] = useState('');
  const [educationText, setEducationText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // File upload state
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!person;

  // Init form when modal opens
  useEffect(() => {
    if (isOpen && person) {
      setForm({
        name: person.name,
        title: person.title,
        role: person.role || role,
        office: person.office || '',
        email: person.email || [],
        phone: person.phone || '',
        major: person.major || '',
        specialty: person.specialty || '',
        badge: person.badge || '',
        profileImage: person.profileImage || '',
        courses: person.courses || { undergraduate: [], graduate: [] },
        biography: person.biography || {
          cvText: '',
          position: '',
          education: [],
          experience: [],
        },
      });
      setEmailText((person.email || []).join(', '));
      setUndergraduateText(
        (person.courses?.undergraduate || []).join(', ')
      );
      setGraduateText((person.courses?.graduate || []).join(', '));
      setEducationText((person.biography?.education || []).join('\n'));
      setExperienceText((person.biography?.experience || []).join('\n'));
      if (person.profileImage) {
        setProfileImagePreview(person.profileImage);
      }
    } else if (isOpen && !person) {
      setForm(emptyForm);
      setEmailText('');
      setUndergraduateText('');
      setGraduateText('');
      setEducationText('');
      setExperienceText('');
      setProfileImageFile(null);
      setProfileImagePreview('');
      setCvFile(null);
    }
  }, [isOpen, person, role, emptyForm]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Profile image file selection
  const handleProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('이미지 파일만 업로드 가능합니다');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('파일 크기는 5MB 이하여야 합니다');
        return;
      }
      setProfileImageFile(file);
      setUploadError(null);

      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile image upload
  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImageFile) return null;
    setIsUploadingImage(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', profileImageFile);
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '이미지 업로드 실패');
      }
      setProfileImageFile(null);
      return data.data.path;
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : '이미지 업로드 실패'
      );
      throw err;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // CV file selection
  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('PDF 또는 Word 문서만 업로드 가능합니다');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('파일 크기는 10MB 이하여야 합니다');
        return;
      }
      setCvFile(file);
      setUploadError(null);
    }
  };

  // CV file upload
  const uploadCvFile = async (): Promise<string | null> => {
    if (!cvFile) return null;
    setIsUploadingCv(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', cvFile);
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'CV 파일 업로드 실패');
      }
      setCvFile(null);
      return data.data.path;
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'CV 파일 업로드 실패'
      );
      throw err;
    } finally {
      setIsUploadingCv(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (role === 'instructor') {
      if (!form.name.trim()) {
        alert('이름은 필수 입력입니다.');
        return;
      }
    } else {
      if (!form.name.trim() || !form.title.trim()) {
        alert('이름과 직함은 필수 입력입니다.');
        return;
      }
    }

    try {
      setIsSaving(true);
      setUploadError(null);

      let profileImagePath = form.profileImage || '';
      if (profileImageFile) {
        const uploadedPath = await uploadProfileImage();
        if (uploadedPath) profileImagePath = uploadedPath;
      }

      let cvFilePath = form.biography?.cvText || '';
      if (cvFile) {
        const uploadedPath = await uploadCvFile();
        if (uploadedPath) cvFilePath = uploadedPath;
      }

      const data: PersonFormData =
        role === 'instructor'
          ? {
              name: form.name,
              title: form.title,
              role: 'instructor',
              email: [],
              office: '',
              phone: '',
              major: '',
              specialty: form.specialty || '',
              badge: '',
              profileImage: '',
              courses: { undergraduate: [], graduate: [] },
              biography: {
                cvText: '',
                position: '',
                education: [],
                experience: [],
              },
            }
          : {
              ...form,
              role: 'professor',
              email: emailText
                .split(',')
                .map((e) => e.trim())
                .filter(Boolean),
              profileImage: profileImagePath,
              courses: {
                undergraduate: undergraduateText
                  .split(',')
                  .map((c) => c.trim())
                  .filter(Boolean),
                graduate: graduateText
                  .split(',')
                  .map((c) => c.trim())
                  .filter(Boolean),
              },
              biography: {
                cvText: cvFilePath,
                position: form.biography?.position || '',
                education: educationText
                  .split('\n')
                  .map((e) => e.trim())
                  .filter(Boolean),
                experience: experienceText
                  .split('\n')
                  .map((e) => e.trim())
                  .filter(Boolean),
              },
            };
      await onSubmit(data);
    } catch {
      // Error handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    setForm,
    emailText,
    setEmailText,
    undergraduateText,
    setUndergraduateText,
    graduateText,
    setGraduateText,
    educationText,
    setEducationText,
    experienceText,
    setExperienceText,
    isSaving,
    isEditing,
    profileImageFile,
    profileImagePreview,
    profileImageInputRef,
    cvFile,
    cvInputRef,
    isUploadingImage,
    isUploadingCv,
    uploadError,
    handleProfileImageChange,
    uploadProfileImage,
    handleCvFileChange,
    uploadCvFile,
    handleSubmit,
  };
}
