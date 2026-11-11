export type PendaftaranSource = 'website' | 'whatsapp_bot' | 'admin_manual';
export type PendaftaranStatus = 'baru' | 'diverifikasi' | 'dijadwalkan' | 'selesai' | 'dibatalkan';

export interface Pendaftaran {
  id: string;
  source: PendaftaranSource;
  status: PendaftaranStatus;
  createdAt: number;
  updatedAt: number;

  patientName: string;
  phone: string;
  patientType: 'BPJS' | 'Umum' | 'Asuransi';
  nik?: string;
  address?: string;

  selectedDoctorId: string;
  selectedDate: string;
  selectedTimeSlot: string;
  complaint?: string;

  whatsappConsent: boolean;
  waConfirmationSent?: boolean;
  notes?: string;
}

export const STATUS_LABEL: Record<PendaftaranStatus, string> = {
  baru: 'Baru',
  diverifikasi: 'Diverifikasi',
  dijadwalkan: 'Dijadwalkan',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export const SOURCE_LABEL: Record<PendaftaranSource, string> = {
  website: 'Website',
  whatsapp_bot: 'Bot WhatsApp',
  admin_manual: 'Input Admin',
};
