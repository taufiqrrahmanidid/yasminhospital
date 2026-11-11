export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  dateStr: string;
  relativeTime: string;
  comment: string;
  isVisible: boolean;
  source: string;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL + '/api';

export async function syncGoogleReviewsFromMaps(): Promise<{ total: number, source: string }> {
  const res = await fetch(`${API_BASE}/sync-google-smart`, { 
    method: 'POST',
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal sinkronisasi Google Maps');
  return { total: data.total || 0, source: data.source };
}

export async function fetchAllGoogleReviewsForAdmin(): Promise<GoogleReviewItem[]> {
  try {
    // PERBAIKAN: Gunakan endpoint /admin/reviews agar ulasan tersembunyi tetap muncul di panel admin
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      credentials: 'include' // 👈 WAJIB
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchPublishedGoogleReviews(): Promise<GoogleReviewItem[]> {
  try {
    // Endpoint publik (tidak masalah jika membawa cookie)
    const res = await fetch(`${API_BASE}/reviews?publishedOnly=true`, {
      credentials: 'include'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function toggleReviewVisibility(id: string, currentVisible: boolean): Promise<boolean> {
  const res = await fetch(`${API_BASE}/reviews/${id}/toggle`, { 
    method: 'PATCH',
    credentials: 'include', // 👈 WAJIB
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  return data.isVisible;
}

export async function clearAllGoogleReviews(): Promise<void> {
  await fetch(`${API_BASE}/reviews`, { 
    method: 'DELETE',
    credentials: 'include' // 👈 WAJIB
  });
}