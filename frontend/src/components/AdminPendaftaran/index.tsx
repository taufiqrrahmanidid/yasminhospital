import React, { useState, useEffect } from 'react';
import AdminPendaftaranLogin from './AdminPendaftaranLogin';
import AdminPendaftaranDashboard from './AdminPendaftaranDashboard';
import { ShieldAlert } from 'lucide-react'; // Pastikan Anda menginstall lucide-react

interface Props {
  onExit: () => void;
}

export default function AdminPendaftaranModule({ onExit }: Props) {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // State untuk mengecek perangkat
  const [isDeviceAuthorized, setIsDeviceAuthorized] = useState<boolean | null>(null);
  const [deviceError, setDeviceError] = useState<string>('');

  useEffect(() => {
    const verifyDevice = async () => {
      // 1. Cek apakah di sesi tab ini device sudah pernah diverifikasi
      const isCached = sessionStorage.getItem('device_verified_session');
      if (isCached === 'true') {
        setIsDeviceAuthorized(true);
        return; // Langsung lolos tanpa nembak API
      }

      let hash = localStorage.getItem('admin_device_hash');
      if (!hash) {
        hash = 'dev-' + Math.random().toString(36).substring(2, 12) + '-' + Date.now();
        localStorage.setItem('admin_device_hash', hash);
      }

      // 2. Verifikasi perangkat (auth via cookie httpOnly)
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/admin/verify-device', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceHash: hash,
            deviceName: 'PC Admin Pendaftaran',
            adminEmail: currentUser?.email || 'belum-login@rsyasmin.id'
          })
        });
        const data = await res.json();

        if (res.ok && data.authorized) {
          localStorage.removeItem('admin_device_blocked');
          localStorage.removeItem('admin_device_error');
          sessionStorage.setItem('device_verified_session', 'true'); // <-- Simpan di sesi
          setIsDeviceAuthorized(true);
        } else {
          localStorage.setItem('admin_device_blocked', 'true');
          setIsDeviceAuthorized(false);
          setDeviceError(data.error || 'Perangkat ini belum memiliki lisensi resmi dari IT RS Yasmin.');
        }
      } catch (err) {
        setIsDeviceAuthorized(false);
        setDeviceError('Gagal terhubung ke server lisensi. Akses dibatasi.');
      }
    };

    verifyDevice();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    setCurrentUser(null);
  };

  // 1. Tampilan Loading saat mengecek perangkat
  if (isDeviceAuthorized === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-warm-ivory text-headings font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-yasmin-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold">Memeriksa Lisensi Perangkat...</p>
        </div>
      </div>
    );
  }

  // 2. Tampilan Blokir (Jika perangkat belum di-ACC)
  if (isDeviceAuthorized === false) {
    return (
      <div className="fixed inset-0 z-[99999] bg-warm-ivory flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 border border-rose-200 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-display font-black text-headings mb-2">Akses Perangkat Ditolak</h2>
          <p className="text-sm text-body-text mb-6">{deviceError}</p>
          <button onClick={onExit} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // 3. Jika device OK, tapi belum login
  if (!currentUser) {
    return <AdminPendaftaranLogin onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  // 4. Jika device OK dan sudah login
  return (
    <AdminPendaftaranDashboard 
      adminEmail={currentUser.email || 'admin@rsyasmin.id'} 
      onExit={() => {
        handleLogout();
        onExit();
      }} 
    />
  );
}