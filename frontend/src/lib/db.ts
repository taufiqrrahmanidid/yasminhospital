const API_BASE = import.meta.env.VITE_BACKEND_URL + '/api';

// ============================================================
// FETCH — data dari backend
// ============================================================
export async function fetchCollection(colName: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/${colName}`, {
      credentials: 'include', // 👈 WAJIB: Agar browser mengirim Cookie httpOnly
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn(`[FETCH] Gagal memuat [${colName}]:`, error);
    return [];
  }
}

// ============================================================
// SYNC — BULK (dipakai untuk bulk seed lama)
// ============================================================
export async function syncCollectionToCloud(colName: string, localItems: any[]) {
  try {
    const res = await fetch(`${API_BASE}/sync/${colName}`, {
      method: 'POST',
      credentials: 'include', // 👈 WAJIB
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: localItems }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.warn(`[SYNC] Gagal sync [${colName}]: HTTP ${res.status} ${text}`);
      return;
    }
    
  } catch (error) {
    console.warn(`[SYNC] Error sync [${colName}]:`, error);
  }
}

// ============================================================
// SAVE — upsert per dokumen
// ============================================================
export async function saveDocument(colName: string, docId: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/save/${colName}/${docId}`, {
      method: 'POST',
      credentials: 'include', // 👈 WAJIB
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${text.substring(0, 200)}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Gagal menyimpan [${colName}/${docId}]:`, error);
    throw error;
  }
}

// ============================================================
// DELETE
// ============================================================
export async function deleteDocument(colName: string, docId: string) {
  try {
    const res = await fetch(`${API_BASE}/delete/${colName}/${docId}`, {
      method: 'DELETE',
      credentials: 'include', // 👈 WAJIB
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${text.substring(0, 200)}`);
    }
    
  } catch (error) {
    console.error(`Gagal menghapus [${colName}/${docId}]:`, error);
    throw error;
  }
}

// ============================================================
// KOMPATIBILITAS SHIM
// ============================================================
export const db = { type: 'postgresql' } as any;
export const auth = {} as any;
export function doc(dbInstance: any, col: string, id: string) {
  return { col, id };
}

export async function getDoc(docRef: any) {
  try {
    const res = await fetch(`${API_BASE}/${docRef.col}`, {
      credentials: 'include',
    });
    const data = await res.json();
    return {
      exists: () => !!data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0),
      data: () => data
    };
  } catch (e) {
    return { exists: () => false, data: () => ({}) };
  }
}

// ============================================================
// AUTH HANDLERS
// ============================================================
export async function logoutAdminPendaftaran(): Promise<void> {
  try {
    // Panggil backend untuk menghapus cookie
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch (e) { }
  // Hapus data user di localStorage (cookie akan dihapus oleh browser/backend)
  localStorage.removeItem('admin_user');
}

export function watchAdminAuthState(callback: (user: any) => void) {
  // Tidak lagi mengecek token, cukup cek apakah ada data user
  const user = localStorage.getItem('admin_user');
  if (user) {
    callback(JSON.parse(user));
  } else {
    callback(null);
  }
  return () => {};
}