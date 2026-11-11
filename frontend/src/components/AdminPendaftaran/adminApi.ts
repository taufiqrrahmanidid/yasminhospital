import type { Pendaftaran, PendaftaranStatus } from './types';

const API_BASE = import.meta.env.VITE_BACKEND_URL + '/api';

// Auth via httpOnly cookie (credentials: 'include') — TIDAK ada token di localStorage.

// Ambil daftar antrean dari PostgreSQL
export async function fetchPendaftaranList(filter?: {
  status?: PendaftaranStatus | '';
  source?: string;
}): Promise<Pendaftaran[]> {
  const res = await fetch(`${API_BASE}/pendaftaran`, {
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Sesi berakhir (401). Silakan login kembali.');
    }
    throw new Error('Gagal mengambil data dari server lokal.');
  }
  const data: Pendaftaran[] = await res.json();

  return data.filter(item => {
    let match = true;
    if (filter?.status && item.status !== filter.status) match = false;
    if (filter?.source && item.source !== filter.source) match = false;
    return match;
  });
}

// Update status pendaftaran via REST API
export async function updateStatus(id: string, status: PendaftaranStatus, notes?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/pendaftaran/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error('Gagal memperbarui status di server.');
}

// Kirim pesan manual ke WhatsApp pasien via Bot
export async function sendManualMessage(id: string, message: string): Promise<void> {
  const res = await fetch(`${API_BASE}/pendaftaran/${id}/notify`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Gagal mengirim pesan via WhatsApp Bot.');
}
