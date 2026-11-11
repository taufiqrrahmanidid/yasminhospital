import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { Pendaftaran, PendaftaranStatus, PendaftaranSource } from './types';
import { fetchPendaftaranList } from './adminApi';
import { logoutAdminPendaftaran } from '../../lib/db';
import PendaftaranTable from './components/PendaftaranTable';
import PendaftaranDetailDrawer from './components/PendaftaranDetailDrawer';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Search, 
  RefreshCw, 
  LogOut, 
  Globe, 
  AlertCircle,
  Link,
  Plus,
  Copy,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Send
} from 'lucide-react';

interface Props {
  adminEmail: string;
  onExit: () => void;
}

export default function AdminPendaftaranDashboard({ adminEmail, onExit }: Props) {
  const [allItems, setAllItems] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<PendaftaranStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<PendaftaranSource | ''>('');
  const [filterTfOnly, setFilterTfOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Pendaftaran | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // LISENSI PERANGKAT PC ADMIN (DEVICE LOCK)
  // [PENGAMAN LAPIS 1]: Membaca memori blokir agar 0 milidetik langsung terkunci saat F5
  const [isDeviceAuthorized, setIsDeviceAuthorized] = useState<boolean | null>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_device_blocked') === 'true') {
      return false; // Langsung kunci di milidetik ke-0, anti-terintip!
    }
    return null;
  });

  const [deviceName, setDeviceName] = useState('');
  const [licenseError, setLicenseError] = useState(() => {
  if (typeof window !== 'undefined' && localStorage.getItem('admin_device_blocked') === 'true') {
    // Ambil teks dari backend yang sudah disimpan, jika tidak ada gunakan fallback
    return localStorage.getItem('admin_device_error') || 'AKSES DITOLAK: Perangkat ini terdeteksi tidak berlisensi resmi dari IT RS Yasmin.';
  }
  return '';
});

  // 1. Verifikasi Lisensi Perangkat PC Admin Ketat
    useEffect(() => {
    const verifyDevice = async () => {
      let hash = localStorage.getItem('admin_device_hash');
      if (!hash) {
        hash = 'dev-' + Math.random().toString(36).substring(2, 12) + '-' + Date.now();
        localStorage.setItem('admin_device_hash', hash);
      }

      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/admin/verify-device', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceHash: hash,
            deviceName: 'PC Admin Pendaftaran',
            adminEmail: adminEmail || 'belum-login@rsyasmin.id'
          })
        });
        const data = await res.json();
        
        if (res.ok && data.authorized) {
          localStorage.removeItem('admin_device_blocked');
          localStorage.removeItem('admin_device_error');
          setIsDeviceAuthorized(true);
          setDeviceName(data.deviceName);
        } else {
          localStorage.setItem('admin_device_blocked', 'true');
          if (data.error) localStorage.setItem('admin_device_error', data.error);
          setIsDeviceAuthorized(false);
          setLicenseError(data.error || 'Perangkat ini belum memiliki lisensi resmi dari IT RS Yasmin.');
        }
      } catch (err) {
        setIsDeviceAuthorized(false);
        setLicenseError('Gagal terhubung ke server lisensi. Akses dibatasi.');
      }
    };

    verifyDevice();
  }, [adminEmail]);
  

  // MODAL LINK GENERATOR
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [genPatientName, setGenPatientName] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genPasscode, setGenPasscode] = useState('');
  const [genDuration, setGenDuration] = useState('3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    url: string;
    waText: string;
    token: string;
    expiresAt: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Load Pendaftaran dari PostgreSQL
  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await fetchPendaftaranList({});
      setAllItems(data);
    } catch (err: any) {
      // 👇 TAMBAHKAN BLOK INI UNTUK DETEKSI SESI EXPIRED 👇
      if (err.message.includes('401') || err.message.includes('Autentikasi') || err.message.includes('Gagal mengambil data')) {
        alert('Sesi login Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('admin_user');
        window.location.reload(); // Memaksa kembali ke halaman login
        return;
      }
      // 👆 ========================================== 👆

      if (opts?.silent) {
        console.warn('Polling pendaftaran:', err);
      } else {
        setError(err.message || 'Gagal memuat data pendaftaran.');
      }
    } finally {
      if (!opts?.silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Real-Time Socket.io Listener
  useEffect(() => {
    let socket: any;
    import('socket.io-client').then(({ io }) => {
      socket = io(import.meta.env.VITE_BACKEND_URL);
      socket.on('DASHBOARD_UPDATED', () => {
        load({ silent: true });
      });
    });
    return () => { if (socket) socket.disconnect(); };
  }, [load]);

  // Auto-generate random 4-digit passcode saat modal dibuka
  const handleOpenLinkModal = () => {
    setGenPatientName('');
    setGenPhone('');
    setGenPasscode(String(Math.floor(1000 + Math.random() * 9000)));
    setGenDuration('3');
    setGeneratedResult(null);
    setIsCopied(false);
    setIsLinkModalOpen(true);
  };

  // Submit Link Generator
  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/invite-link', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: genPatientName.trim(),
          phone: genPhone.trim(),
          passcode: genPasscode.trim(),
          durationHours: Number(genDuration),
          adminEmail
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat link');

      setGeneratedResult({
        url: data.registrationUrl,
        waText: data.waTemplate,
        token: data.token,
        expiresAt: new Date(data.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Statistik Real-Time
  const stats = useMemo(() => {
    const baru = allItems.filter(i => i.status === 'baru').length;
    const tfNeedCheck = allItems.filter(i => (i as any).buktiTransferDikirim && i.status === 'baru').length;
    const diverifikasi = allItems.filter(i => i.status === 'diverifikasi' || i.status === 'dijadwalkan').length;
    const total = allItems.length;
    return { baru, tfNeedCheck, diverifikasi, total };
  }, [allItems]);

  // Filter Data
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (sourceFilter && item.source !== sourceFilter) return false;
      if (filterTfOnly && !(item as any).buktiTransferDikirim) return false;

      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        const matchText = 
          item.patientName?.toLowerCase().includes(search) ||
          item.id?.toLowerCase().includes(search) ||
          item.phone?.toLowerCase().includes(search) ||
          item.selectedDoctorId?.toLowerCase().includes(search) ||
          ((item as any).kodeBooking && (item as any).kodeBooking.toLowerCase().includes(search)) ||
          ((item as any).antrian && (item as any).antrian.toLowerCase().includes(search));
        if (!matchText) return false;
      }
      return true;
    });
  }, [allItems, statusFilter, sourceFilter, filterTfOnly, searchTerm]);

  if (isDeviceAuthorized === null) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-mono select-none">
        <div className="w-10 h-10 border-3 border-yasmin-green border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
          Memverifikasi Lisensi Perangkat...
        </div>
        <p className="text-[10px] text-body-text mt-1">
          RS Yasmin Hardware Security Shield
        </p>
      </div>
    );
  }

  // B. JIKA PERANGKAT DITOLAK: KUNCI TOTAL DAN PERMANEN
  if (isDeviceAuthorized === false) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-950 text-white flex items-center justify-center p-4 select-none">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl animate-scale-up">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/30 animate-pulse">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-display font-black text-rose-400">PERANGKAT TIDAK BERLISENSI</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {licenseError}
          </p>
          <div className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-400 text-left border border-slate-800">
            ID Perangkat: <span className="text-warm-orange">{localStorage.getItem('admin_device_hash')}</span>
          </div>
          <p className="text-[10px] text-body-text">
            Hubungi Tim IT RS Yasmin untuk mendaftarkan ID perangkat PC ini ke sistem whitelist.
          </p>
          <button
            onClick={onExit}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Cek Device Authorized: Jika true, render dashboard
  return (
    <div className="min-h-screen bg-warm-ivory text-body-text font-sans">
      
      {/* 1. HEADER DENGAN STATUS LISENSI PERANGKAT */}
      <header className="bg-gradient-to-r from-[#0B4F4A] via-[#0E625C] to-[#0B4F4A] text-white border-b border-[#147970] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 bg-white rounded-2xl p-1.5 border border-white/20 flex items-center justify-center shadow-sm shrink-0">
              <img
                src="/assets/images/utama/logo_rsyasminbwi.png"
                alt="Logo RS Yasmin"
                className="h-full w-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white leading-none">
                  RS Yasmin Banyuwangi
                </h1>
                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {deviceName || 'Device Terlisensi'}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1 font-medium">
                Pusat Kontrol Pendaftaran &amp; Generator Link Pasien
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* TOMBOL GENERATOR LINK PENDAFTARAN */}
            <button
              onClick={handleOpenLinkModal}
              className="px-4 py-2.5 bg-warm-orange hover:bg-amber-500 text-headings font-black rounded-xl text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95 border-none"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Link Pendaftaran</span>
            </button>

            <button
              onClick={onExit}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-white/15 cursor-pointer shadow-sm active:scale-95"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Website</span>
            </button>

            <button
              onClick={async () => { await logoutAdminPendaftaran(); onExit(); }}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border border-rose-400/30 cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. DASHBOARD BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">Perlu Dicek</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
            </div>
            <div className="text-3xl font-black text-headings font-display">{stats.baru}</div>
            <p className="text-[11px] text-body-text mt-1">Pendaftaran baru belum diverifikasi</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-yasmin-green shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-yasmin-green font-mono">Bukti TF Masuk</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-yasmin-green flex items-center justify-center"><Camera className="h-5 w-5" /></div>
            </div>
            <div className="text-3xl font-black text-emerald-800 font-display">{stats.tfNeedCheck}</div>
            <p className="text-[11px] text-yasmin-green/80 mt-1">Menunggu pencocokan rekening</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-headings font-mono">Telah Disetujui</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-headings flex items-center justify-center"><CheckCircle2 className="h-5 w-5" /></div>
            </div>
            <div className="text-3xl font-black text-headings font-display">{stats.diverifikasi}</div>
            <p className="text-[11px] text-body-text mt-1">Siap Check-in / Antrean aktif</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-body-text font-mono">Total Masuk</span>
              <div className="w-9 h-9 rounded-xl bg-warm-ivory text-body-text flex items-center justify-center"><Users className="h-5 w-5" /></div>
            </div>
            <div className="text-3xl font-black text-headings font-display">{stats.total}</div>
            <p className="text-[11px] text-body-text mt-1">Total seluruh data tersimpan</p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, DATE FILTER, STATUS & REFRESH */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pasien, no. tiket, kode booking (e.g. 47XUGE), dokter, antrean..."
              className="w-full pl-10 pr-4 py-2.5 bg-soft-mint border border-[#CBD5E1] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-headings transition-all text-headings"
            />
          </div>

          {/* Filter Group */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setFilterTfOnly(false);
              }}
              className="px-3 py-2.5 bg-soft-mint border border-[#CBD5E1] rounded-2xl text-xs font-bold text-body-text focus:outline-none focus:ring-2 focus:ring-headings cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="baru">Status: Baru</option>
              <option value="diverifikasi">Status: Diverifikasi</option>
              <option value="dijadwalkan">Status: Dijadwalkan</option>
              <option value="selesai">Status: Selesai</option>
              <option value="dibatalkan">Status: Dibatalkan</option>
            </select>

            {/* Sumber Dropdown */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-soft-mint border border-[#CBD5E1] rounded-2xl text-xs font-bold text-body-text focus:outline-none focus:ring-2 focus:ring-headings cursor-pointer"
            >
              <option value="">Semua Sumber</option>
              <option value="link_webapp">Sumber: Link Undangan</option>
              <option value="whatsapp_bot">Sumber: Chat WA</option>
              <option value="website">Sumber: Web Pasien</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => load()}
              disabled={isRefreshing}
              className="px-4 py-2.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
            </button>

          </div>

        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <PendaftaranTable 
            items={filteredItems} 
            loading={loading} 
            onSelect={setSelected}
            selectedId={selected?.id}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>

      </main>

      {/* DETAIL DRAWER */}
      {selected && (
        <PendaftaranDetailDrawer
          item={selected}
          onClose={() => setSelected(null)}
          onChanged={() => { load({ silent: true }); setSelected(null); }}
        />
      )}

      {/* ========================================================= */}
      {/* 3. MODAL GENERATOR LINK PENDAFTARAN BARU */}
      {/* ========================================================= */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-left animate-scale-up border border-divider">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0B4F4A] to-[#147970] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Link className="h-5 w-5 text-warm-orange" />
                <h3 className="font-display font-black text-base uppercase tracking-wider">
                  Generator Link Pendaftaran Pasien
                </h3>
              </div>
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            {!generatedResult ? (
              <form onSubmit={handleGenerateLink} className="p-6 space-y-4 text-xs font-sans">
                <p className="text-body-text leading-relaxed">
                  Admin dapat membuat link unik untuk pasien yang sedang chat di WhatsApp. Link ini memiliki identitas Unix khusus (anti-banned WhatsApp), sandi masuk, dan batas kedaluwarsa.
                </p>

                <div className="space-y-1">
                  <label className="font-bold text-body-text uppercase tracking-wider">Nama Pasien (Sesuai Chat WA):</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nur Rahma"
                    value={genPatientName}
                    onChange={(e) => setGenPatientName(e.target.value)}
                    className="w-full p-3 border border-divider rounded-xl text-xs focus:ring-2 focus:ring-headings font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-body-text uppercase tracking-wider">Nomor WhatsApp Pasien:</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 085xxxxxxxx"
                    value={genPhone}
                    onChange={(e) => setGenPhone(e.target.value)}
                    className="w-full p-3 border border-divider rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-body-text uppercase tracking-wider">Sandi Masuk Pasien:</label>
                    <input
                      type="text"
                      required
                      value={genPasscode}
                      onChange={(e) => setGenPasscode(e.target.value)}
                      className="w-full p-3 border border-divider rounded-xl text-xs font-mono font-bold tracking-widest text-headings"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-body-text uppercase tracking-wider">Masa Berlaku Link:</label>
                    <select
                      value={genDuration}
                      onChange={(e) => setGenDuration(e.target.value)}
                      className="w-full p-3 border border-divider rounded-xl text-xs font-bold cursor-pointer bg-white"
                    >
                      <option value="1">1 Jam</option>
                      <option value="3">3 Jam (Standar)</option>
                      <option value="6">6 Jam</option>
                      <option value="12">12 Jam</option>
                      <option value="24">24 Jam (1 Hari)</option>
                      <option value="72">72 Jam (3 Hari)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-divider flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(false)}
                    className="px-4 py-2.5 border border-divider text-body-text rounded-xl font-bold hover:bg-soft-mint cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-6 py-2.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? 'Membuat Link...' : 'Generate & Buat Template WA'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4 text-xs font-sans animate-fade-in">
                <div className="p-3.5 bg-soft-mint border border-yasmin-green rounded-2xl space-y-1">
                  <span className="font-bold text-emerald-800 text-[11px] block">✅ Link Pendaftaran Berhasil Dibuat!</span>
                  <p className="text-body-text text-[10px]">
                    Token Unik: <code className="font-mono font-bold text-headings">{generatedResult.token}</code> (Aktif s/d {generatedResult.expiresAt} WIB)
                  </p>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="font-bold text-body-text uppercase tracking-wider font-mono text-[10px]">
                    Template Teks Siap Kirim ke WhatsApp Pasien:
                  </span>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] whitespace-pre-wrap font-sans leading-relaxed border border-slate-800 select-all">
                    {generatedResult.waText}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedResult.waText)}
                    className="py-3 bg-white border border-divider hover:border-headings text-headings font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-yasmin-green" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopied ? 'Tersalin!' : 'Salin Teks WA'}</span>
                  </button>

                  <a
                    href={`https://wa.me/${genPhone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(generatedResult.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 bg-whatsapp hover:bg-yasmin-green text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md text-center"
                  >
                    <Send className="h-4 w-4" />
                    <span>Buka Chat WA Pasien</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
