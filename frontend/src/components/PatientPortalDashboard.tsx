import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Stethoscope, 
  LogOut, 
  ExternalLink, 
  AlertCircle,
  XCircle,
  RefreshCw,
  Plus,
  Barcode,
  ShieldCheck,
  CreditCard,
  Phone,
  FileText,
  X,
  Fingerprint,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import BarcodeCard from './BarcodeCard';
import { io } from 'socket.io-client';

interface Props {
  onExit: () => void;
}

export default function PatientPortalDashboard({ onExit }: Props) {
  const [patientSession, setPatientSession] = useState<any>(() => {
    try {
      const s = sessionStorage.getItem('yasmin_patient_account');
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  });

  const [nikInput, setNikInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedBarcodeBooking, setSelectedBarcodeBooking] = useState<any>(null);
  const [isNewTokenModalOpen, setIsNewTokenModalOpen] = useState(false);
  const [newTokenInput, setNewTokenInput] = useState('');

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // [KUNCI PERBAIKAN 1]: Gunakan noIdentitas untuk memfilter data
  const loadPatientBookings = useCallback(async () => {
    const token = sessionStorage.getItem('yasmin_patient_token');
    if (!token) return; // Belum login
    setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/api/patient/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Cek apakah server membalas dengan sukses (200 OK)
      if (res.ok) {
        const myBookings = await res.json();
        setBookings(myBookings);
      } else {
        console.warn('Gagal memuat dari API, tetap gunakan data dari sesi login.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (patientSession?.nik) {
      loadPatientBookings();
    }
  }, [patientSession, loadPatientBookings]);

    // Real-Time Socket.io
  useEffect(() => {
    let socket: any;
    let isMounted = true;

    if (patientSession?.nik) {
      // Panggil io secara langsung, bukan lewat dynamic import
      socket = io(import.meta.env.VITE_BACKEND_URL, {
        transports: ['websocket', 'polling'],
        forceNew: true // Mencegah bentrok koneksi saat React Strict Mode
      });

      socket.on('DASHBOARD_UPDATED', () => {
        if (isMounted) {
          loadPatientBookings();
        }
      });
    }

    return () => { 
      isMounted = false;
      if (socket) {
        socket.disconnect(); 
      }
    };
  }, [patientSession?.nik, loadPatientBookings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nikInput.length < 5) {
      setError('Nomor Identitas terlalu pendek.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/patient/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik: nikInput.trim(), passcode: passcode.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login gagal.');

      sessionStorage.setItem('yasmin_patient_account', JSON.stringify(data.patient));
      if (data.token) sessionStorage.setItem('yasmin_patient_token', data.token);
      setPatientSession(data.patient);
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('yasmin_patient_account');
    sessionStorage.removeItem('yasmin_patient_token');
    setPatientSession(null);
    setBookings([]);
  };

  // [KUNCI PERBAIKAN 2]: Logika Pemisah RM dan NIK yang Cerdas
  const latestData = bookings[0] || {};
  const patientJaminan = latestData.patientType || 'Umum';
  const patientIdentifier = latestData.noIdentitas || patientSession?.nik || '';
  
  // Jika 16 digit angka murni = NIK. Selain itu = RM.
  const isNIK = /^\d{16}$/.test(patientIdentifier);
  const displayNIK = isNIK ? patientIdentifier : '-';
  const displayRM = !isNIK ? patientIdentifier : 'Proses SIMRS';

  const activeBookings = bookings.filter(b => b.status === 'baru' || b.status === 'diverifikasi' || b.status === 'dijadwalkan');
  const pastBookings = bookings.filter(b => b.status === 'selesai' || b.status === 'dibatalkan');

  // =========================================================
  // 1. LAYAR LOGIN
  // =========================================================
  if (!patientSession) {
    return (
      <div className="min-h-screen bg-warm-ivory text-body-text font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-divider shadow-xl p-6 sm:p-8 space-y-5 text-left">
          <div className="text-center space-y-1.5 mb-2">
            <div className="text-[10px] font-bold text-yasmin-green bg-soft-mint border border-yasmin-green px-3 py-1 rounded-full uppercase tracking-wider inline-block font-mono">
              Portal Pasien &amp; SIMRS RS Yasmin
            </div>
            <h2 className="text-xl font-display font-black text-headings">Masuk ke Rekam Medis</h2>
            <p className="text-xs text-body-text leading-relaxed">Privasi data Anda terjaga. Masuk menggunakan Nomor NIK e-KTP / No. RM Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-body-text uppercase font-mono flex items-center gap-1.5 mb-1.5">
                <Fingerprint className="h-3.5 w-3.5 text-headings" /> NIK e-KTP / No. RM:
              </label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: 3501... atau 20.19..." 
                value={nikInput} 
                onChange={(e) => setNikInput(e.target.value)} 
                className="w-full p-3.5 bg-soft-mint border border-divider rounded-2xl font-bold font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-headings" 
              />
            </div>

            <div>
              <label className="font-bold text-body-text uppercase font-mono flex items-center gap-1.5 mb-1.5">
                <KeyRound className="h-3.5 w-3.5 text-headings" /> Kata Sandi Akun:
              </label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                className="w-full p-3.5 bg-soft-mint border border-divider rounded-2xl font-mono font-bold tracking-widest text-headings text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-headings" 
              />
            </div>

            {error && (
              <p className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-[#0B4F4A] to-[#0E625C] text-white font-bold rounded-2xl uppercase text-xs tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5">
              <span>{loading ? 'Memverifikasi...' : 'Akses Rekam Medis'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button onClick={onExit} className="text-[11px] text-gray-400 hover:text-headings font-bold transition-colors cursor-pointer">
              ← Kembali ke Beranda RS Yasmin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 2. DASHBOARD PORTAL PASIEN (KARTU E-MEMBER & REKAM MEDIS)
  // =========================================================
  return (
    <div className="min-h-screen bg-warm-ivory text-body-text font-sans pb-16">
      
      {/* Top Navbar */}
      <header className="bg-gradient-to-r from-[#0B4F4A] via-[#0E625C] to-[#0B4F4A] text-white py-4 px-4 sm:px-8 shadow-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0">
              <img src="/assets/images/utama/logo_rsyasminbwi.png" alt="Logo" className="h-full w-full object-contain" onError={(e) => (e.target as HTMLElement).style.display = 'none'} />
            </div>
            <div>
              <h1 className="font-display font-black text-sm sm:text-base text-white leading-tight">Portal Pasien RS Yasmin</h1>
              <span className="text-[10px] text-emerald-300 font-mono">SIMRS Integrated Service</span>
            </div>
          </div>
          <button onClick={handleLogout} className="px-3.5 py-2 bg-white/10 hover:bg-rose-500 hover:border-rose-500 text-rose-100 hover:text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95">
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6 text-left">
        
        {/* KARTU IDENTITAS DIGITAL (E-MEMBER CARD) */}
        <div className="bg-gradient-to-br from-[#0B4F4A] to-[#147970] text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center justify-between border border-emerald-700/50">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 opacity-10 pointer-events-none select-none">
            <Barcode className="h-32 w-48" />
          </div>
          
          <div className="relative z-10 flex items-start space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-100 to-white flex items-center justify-center text-headings text-2xl font-black font-display shrink-0 shadow-inner border-2 border-white/20">
              {patientSession.name ? patientSession.name.slice(0, 2).toUpperCase() : 'PX'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-display font-black text-white leading-none tracking-tight drop-shadow-sm">
                  {patientSession.name}
                </h2>
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-xs text-emerald-50">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-300/80 font-bold uppercase tracking-wider text-[9px] w-14">NO. RM</span>
                  <span className={`px-2 py-0.5 rounded font-black tracking-widest text-sm border ${!isNIK ? 'bg-black/20 text-warm-orange border-black/10' : 'bg-transparent text-emerald-100 border-transparent text-xs'}`}>
                    {displayRM}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-300/80 font-bold uppercase tracking-wider text-[9px] w-14">NIK KTP</span>
                  <span className="font-semibold tracking-wider">{displayNIK}</span>
                </div>
                <div className="flex items-center gap-2 font-mono mt-1">
                  <span className="text-emerald-300/80 font-bold uppercase tracking-wider text-[9px] w-14">PENJAMIN</span>
                  <span className="font-semibold bg-emerald-800/50 px-2 py-0.5 rounded border border-yasmin-green/50">{patientJaminan}</span>
                </div>
                <div className="flex items-center gap-2 font-mono mt-1">
                  <span className="text-emerald-300/80 font-bold uppercase tracking-wider text-[9px] w-14">KONTAK</span>
                  <span className="font-semibold flex items-center gap-1"><Phone className="h-3 w-3" /> {patientSession.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl shrink-0 text-center shadow-lg">
            <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold font-mono block mb-1">Total Kunjungan</span>
            <span className="text-3xl font-black text-white font-display leading-none">{bookings.length}</span>
            <span className="text-xs font-medium text-emerald-100 block mt-0.5">Rekam Medis</span>
          </div>
        </div>

        {/* BANNER PENDAFTARAN KONTROL SELANJUTNYA */}
        <div className="bg-white border border-yasmin-green rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="space-y-0.5">
            <h3 className="font-display font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-yasmin-green" />
              Pendaftaran Kontrol Medis Baru
            </h3>
            <p className="text-[11px] text-body-text">
              Punya token/link pendaftaran baru dari Admin WhatsApp? Masukkan di sini untuk jadwal berikutnya.
            </p>
          </div>
          <button
            onClick={() => setIsNewTokenModalOpen(true)}
            className="px-4 py-2.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Minta Link &amp; Daftar Baru</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: ANTREAN AKTIF & CHECK-IN */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-divider pb-2">
            <h2 className="font-display font-black text-sm sm:text-base text-headings flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-headings" />
              <span>Antrean &amp; Kunjungan Berjalan ({activeBookings.length})</span>
            </h2>
            <button onClick={() => loadPatientBookings(patientSession.nik)} className="text-xs font-bold text-body-text hover:text-headings flex items-center gap-1 cursor-pointer transition-colors bg-soft-mint px-3 py-1.5 rounded-lg border border-divider">
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Segarkan Status</span>
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-divider p-10 text-center text-gray-400 flex flex-col items-center gap-2">
              <Calendar className="h-8 w-8 text-gray-300 mb-1" />
              <span className="text-xs font-bold text-body-text">Tidak ada jadwal antrean aktif saat ini.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl border border-divider p-5 sm:p-6 shadow-sm space-y-4 hover:border-yasmin-green transition-all text-left flex flex-col justify-between">
                  
                  <div className="flex items-center justify-between border-b border-divider pb-3">
                    <span className="font-mono font-bold text-xs bg-[#E6F4F1] text-headings px-2.5 py-1 rounded-lg border border-[#A7D7CD]">
                      {b.id}
                    </span>
                    {b.status === 'baru' ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 animate-pulse" /> Menunggu Verifikasi
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Siap Check-in
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="font-bold text-headings text-sm">{b.selectedDoctorName || b.selectedDoctorId}</div>
                      <div className="text-body-text text-xs mt-0.5">{b.selectedPoli}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-soft-mint p-2 rounded-xl border border-divider">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Jadwal Periksa</span>
                        <strong className="text-headings flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.selectedDate}</strong>
                        <span className="text-body-text mt-0.5 block">{b.selectedTimeSlot}</span>
                      </div>
                      <div className="bg-soft-mint p-2 rounded-xl border border-divider">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Pembayaran</span>
                        <strong className="text-body-text flex items-center gap-1"><CreditCard className="h-3 w-3" /> {b.patientType}</strong>
                        <span className="text-body-text mt-0.5 block">{b.metodePembayaran === 'transfer' ? 'Transfer Bank' : 'Bayar di Loket'}</span>
                      </div>
                    </div>
                  </div>

                  {b.kodeBooking ? (
                    <div className="pt-2 border-t border-divider">
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-white border border-yasmin-green rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-left">
                          <div>
                            <span className="text-[9px] font-bold text-body-text uppercase font-mono block">Kode Booking SIMRS:</span>
                            <span className="text-2xl font-black text-headings tracking-widest font-display">{b.kodeBooking}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-body-text uppercase font-mono block">Nomor Antrean:</span>
                            <span className="text-lg font-black text-yasmin-green font-mono bg-emerald-100 px-2 py-0.5 rounded-lg border border-yasmin-green">{b.antrian || '-'}</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedBarcodeBooking(b)} className="w-full py-2.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95">
                          <Barcode className="h-4 w-4" /> <span>Tampilkan Barcode Check-In</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-divider">
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[10.5px] text-amber-800 text-center space-y-1">
                        <span className="font-bold block flex items-center justify-center gap-1"><Clock className="h-3.5 w-3.5" /> Pembayaran Sedang Diverifikasi</span>
                        <p className="text-[10px] text-body-text">Kode booking &amp; Barcode check-in akan otomatis terbit di sini begitu disetujui.</p>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: RIWAYAT KUNJUNGAN */}
        {pastBookings.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="font-display font-black text-sm sm:text-base text-body-text flex items-center gap-2 border-b border-divider pb-2">
              <FileText className="h-4.5 w-4.5 text-body-text" />
              <span>Arsip Rekam Medis &amp; Kunjungan Selesai ({pastBookings.length})</span>
            </h2>

            <div className="bg-white rounded-3xl border border-divider overflow-hidden divide-y divide-divider shadow-xs">
              {pastBookings.map((pb) => (
                <div key={pb.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-soft-mint/60 transition-colors gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[10px] bg-warm-ivory text-body-text px-2 py-0.5 rounded-md border border-divider">{pb.id}</span>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${pb.status === 'selesai' ? 'bg-blue-100 text-blue-800 border border-yasmin-green' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                        {pb.status === 'selesai' ? '✓ Selesai Berobat' : '✕ Dibatalkan'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold flex items-center gap-1"><Calendar className="h-3 w-3" /> {pb.selectedDate}</span>
                    </div>
                    <div>
                      <p className="font-bold text-headings text-sm flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-headings" /> {pb.selectedDoctorName || pb.selectedDoctorId}</p>
                      <p className="text-body-text text-[11px] mt-0.5">{pb.selectedPoli} · Antrean: <strong className="font-mono">{pb.antrian || '-'}</strong></p>
                    </div>
                  </div>
                  {pb.kodeBooking && (
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <button onClick={() => setSelectedBarcodeBooking(pb)} className="px-3.5 py-2 bg-white border border-divider hover:border-headings hover:text-headings text-body-text text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs">
                        <Barcode className="h-4 w-4" /> <span className="hidden sm:inline">Arsip Struk</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL BARCODE & TOKEN SEPERTI SEBELUMNYA */}
      {selectedBarcodeBooking && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full p-6 space-y-4 text-center relative animate-scale-up">
            <button onClick={() => setSelectedBarcodeBooking(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-headings bg-warm-ivory hover:bg-gray-200 rounded-full cursor-pointer transition-colors"><X className="h-5 w-5" /></button>
            <div className="text-center space-y-1 pt-2">
              <h4 className="font-display font-black text-lg text-headings uppercase tracking-tight">Struk Antrean</h4>
              <p className="text-xs text-body-text leading-tight">Tunjukkan barcode ini ke petugas atau scan di mesin antrean mandiri.</p>
            </div>
            <div className="py-2">
              <BarcodeCard kodeBooking={selectedBarcodeBooking.kodeBooking} nomorAntrean={selectedBarcodeBooking.antrian} namaPasien={selectedBarcodeBooking.patientName} noRM={selectedBarcodeBooking.noIdentitas || patientRM} dokter={selectedBarcodeBooking.selectedDoctorName || selectedBarcodeBooking.selectedDoctorId} poli={selectedBarcodeBooking.selectedPoli} jadwal={selectedBarcodeBooking.selectedTimeSlot} tanggal={selectedBarcodeBooking.selectedDate} idTiket={selectedBarcodeBooking.id} />
            </div>
            <button onClick={() => setSelectedBarcodeBooking(null)} className="w-full py-3 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border border-divider">Tutup Struk</button>
          </div>
        </div>
      )}

      {isNewTokenModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-5 text-left relative animate-scale-up border border-emerald-100">
            <button onClick={() => setIsNewTokenModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-body-text bg-soft-mint hover:bg-warm-ivory rounded-full cursor-pointer"><X className="h-5 w-5" /></button>
            <div className="space-y-1">
              <h4 className="font-display font-black text-lg text-headings">Daftar Kontrol Baru</h4>
              <p className="text-xs text-body-text leading-relaxed">Hubungi Admin di WhatsApp untuk mendapatkan tautan pendaftaran terbaru, lalu tempel (*paste*) tokennya di bawah ini.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-yasmin-green uppercase font-mono block">Kode Token / Tautan Pendaftaran:</label>
              <input type="text" placeholder="Contoh: ysm-reg-1726..." value={newTokenInput} onChange={(e) => setNewTokenInput(e.target.value)} className="w-full p-3.5 bg-soft-mint border border-yasmin-green rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-headings focus:bg-white outline-none" />
            </div>
            <button onClick={() => { if (!newTokenInput.trim()) { alert('Silakan masukkan token pendaftaran!'); return; } const tokenOnly = newTokenInput.includes('/pendaftaran/') ? newTokenInput.split('/pendaftaran/')[1].split('?')[0] : newTokenInput.trim(); window.location.href = `/pendaftaran/${tokenOnly}`; }} className="w-full py-3.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95">Lanjut Isi Formulir →</button>
          </div>
        </div>
      )}
    </div>
  );
}
