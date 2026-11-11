export interface PendaftaranPayload {
  patientName?: string;
  phone?: string;
  patientType?: string;
  nik?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  bpjsNumber?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  isRegisteredPatient?: boolean;
  kiupNumber?: string;
  selectedDoctorId?: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  complaint?: string;
  serviceType?: string;
  whatsappConsent: boolean;
}

export interface PendaftaranRecord {
  id: string;
  createdAt: number;
  status: string;
  [key: string]: any;
}

// KIRIM DATA KE BACKEND POSTGRESQL PORT 5000
export async function submitPendaftaran(payload: PendaftaranPayload): Promise<PendaftaranRecord> {
  const uniqueId = 'YSM-' + Math.floor(100000 + Math.random() * 900000);
  
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/pendaftaran', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, id: uniqueId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal mengirim pendaftaran ke server lokal.');
  }

  const result = await res.json();
  return {
    id: result.id || uniqueId,
    createdAt: result.createdAt || Date.now(),
    status: 'baru'
  };
}
