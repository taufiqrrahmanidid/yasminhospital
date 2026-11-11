export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  experience: number; // in years
  rating: number;
  image: string;
  bpjs: boolean;
  schedule: {
    days: string[];
    hours: string;
    quota?: number;
  };
  bio: string;
  education: string;
  speciali?: string;
  status?: 'Aktif' | 'Libur' | 'Berhenti' | 'Cuti' | 'Ijin';
  gradGradDate?: string;
  licenseNumber?: string;
  specGradDate?: string;
  specLicenseNumber?: string;
  joinDate?: string;
  leaveFromDate?: string;
  leaveToDate?: string;
  color?: string;
  gender?: 'Laki-laki' | 'Perempuan';
}

export interface HealthCenter {
  id: string;
  title: string;
  category: string;
  iconName: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  benefits: string[];
  features?: string[];
  targetAudience?: string;
}

export interface CommunityClub {
  id: string;
  name: string;
  description: string;
  iconName: string;
  image: string;
  memberCount: number;
  benefits: string[];
  upcomingEvents: {
    title: string;
    date: string;
    time: string;
    location: string;
  }[];
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  readingTime: string;
  image: string;
  date: string;
  author: string;
}

export interface BookingState {
  patientName: string;
  phone: string;
  patientType: 'BPJS' | 'Umum' | 'Asuransi';
  bpjsNumber?: string;
  selectedDoctorId: string;
  selectedDate: string;
  selectedTimeSlot: string;
  complaint: string;
  whatsappConsent: boolean;
  isRegisteredPatient?: boolean;
  kiupNumber?: string;
  serviceType?: string;
  // New fields
  nik?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  ktpFile?: string;
  insuranceFile?: string;
  photoFile?: string;
}

export interface HospitalRoom {
  id: string;
  type: 'Rawat Inap' | 'ICU' | 'IGD';
  name: string;
  class: string;
  capacity: number;
  occupied: number;
  facilities: string;
}

export type ActiveTabType = 'BERANDA' | 'DOKTER' | 'PUSAT KESEHATAN' | 'FASILITAS' | 'KOMUNITAS' | 'TENTANG KAMI' | 'GALLERY' | 'YASMIN_KIDS' | 'DONOR_DARAH' | 'YASMIN_SQUAD' | 'YASMIN_WOMENS' | 'PENDAFTARAN' | 'ADMIN_DASHBOARD';
