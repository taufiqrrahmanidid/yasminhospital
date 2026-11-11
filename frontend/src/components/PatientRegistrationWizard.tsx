import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Stethoscope, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  CreditCard, 
  Building2, 
  HeartPulse, 
  Sparkles, 
  Copy, 
  Check, 
  Upload, 
  UserCheck, 
  UserPlus, 
  Lock, 
  ShieldCheck,
  Phone,
  KeyRound,
  X,
  XCircle,
  ChevronDown,
  Printer
} from 'lucide-react';
import BarcodeCard from './BarcodeCard';

interface Props {
  token: string;
  onComplete: () => void;
}

export default function PatientRegistrationWizard({ token, onComplete }: Props) {
  // --- SISTEM DRAFT OTOMATIS (ANTI DATA HILANG SAAT REFRESH) ---
  const DRAFT_KEY = `patient_draft_${token}`;
  const getDraft = () => {
    try {
      const d = sessionStorage.getItem(DRAFT_KEY);
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  };
  const draft = getDraft();

  // State dengan nilai awal dari Draft (jika ada)
  const [step, setStep] = useState(draft?.step || 0);
  const [poliList, setPoliList] = useState<string[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [poliData, setPoliData] = useState<any[]>([]); 

  // Modern Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' | 'success' } | null>(null);

  // Kredensial Login (Tidak perlu di-draft)
  const [authPhoneOrName, setAuthPhoneOrName] = useState('');
  const [authPasscode, setAuthPasscode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form Data Pasien (Mengambil dari Draft)
  const [patientName, setPatientName] = useState(draft?.patientName || '');
  const [phone, setPhone] = useState(draft?.phone || '');
  const [patientType, setPatientType] = useState(draft?.patientType || 'Umum'); 
  const [patientStatus, setPatientStatus] = useState<'Baru' | 'Lama'>(draft?.patientStatus || 'Baru');
  
  const [nik, setNik] = useState(draft?.nik || '');
  const [noRM, setNoRM] = useState(draft?.noRM || '');
  const [bpjsNumber, setBpjsNumber] = useState(draft?.bpjsNumber || '');
  const [insuranceProvider, setInsuranceProvider] = useState(draft?.insuranceProvider || '');
  const [insuranceNumber, setInsuranceNumber] = useState(draft?.insuranceNumber || '');
  const [companyPartner, setCompanyPartner] = useState(draft?.companyPartner || '');
  const [companyCardNumber, setCompanyCardNumber] = useState(draft?.companyCardNumber || '');
  
  // Poli & Dokter
  const [searchPoliQuery, setSearchPoliQuery] = useState('');
  const [selectedPoli, setSelectedPoli] = useState(draft?.selectedPoli || 'Poli Anak');
  const [selectedDoctorId, setSelectedDoctorId] = useState(draft?.selectedDoctorId || '');
  const [selectedDoctorName, setSelectedDoctorName] = useState(draft?.selectedDoctorName || '');
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(draft?.selectedDate || new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(draft?.selectedTimeSlot || '');

  const [quotaInfo, setQuotaInfo] = useState<{ totalQuota: number; used: number; remaining: number; isFull: boolean } | null>(null);
  const [loadingQuota, setLoadingQuota] = useState(false);

  // Validasi Step 5
  const [checkingRM, setCheckingRM] = useState(false);
  const [rmSuccessMessage, setRmSuccessMessage] = useState('');
  const [validatingStep5, setValidatingStep5] = useState(false);

  // Pembayaran
  const [metodePembayaran, setMetodePembayaran] = useState<'transfer' | 'bayar_di_loket'>(draft?.metodePembayaran || 'transfer');
  const [bankTujuan, setBankTujuan] = useState<'Mandiri' | 'BCA'>(draft?.bankTujuan || 'Mandiri');
  const [buktiTransferImage, setBuktiTransferImage] = useState<string | null>(draft?.buktiTransferImage || null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/banks')
      .then(res => res.json())
      .then(data => setBankAccounts(data))
      .catch(err => console.error('Gagal memuat rekening bank', err));
  }, []);

  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Helper untuk memanggil Modern Toast Notification
  const showToast = (message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000); 
  };

  useEffect(() => {
    const savedTicket = sessionStorage.getItem(`patient_submitted_ticket_${token}`);
    if (savedTicket) {
      try {
        setCurrentBooking(JSON.parse(savedTicket));
        setStep(7);
        return;
      } catch (e) {}
    }

    const savedAuth = sessionStorage.getItem(`patient_auth_${token}`);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setPatientName(parsed.patientName);
        setPhone(parsed.phone);
        
        // Hanya paksa ke step 1 jika belum ada draft atau draftnya masih di step 0
        if (!draft || !draft.step) {
          setStep(1);
        }
      } catch (e) {
        console.error('Gagal memuat auth session', e);
      }
    }
  }, [token]); 
  
  // --- SIMPAN DRAFT OTOMATIS SETIAP KALI ADA PERUBAHAN ---
  useEffect(() => {
    if (step === 7) return; // Jangan simpan jika sudah selesai pendaftaran

    const draftData = {
      step, patientName, phone, patientType, patientStatus, nik, noRM,
      bpjsNumber, insuranceProvider, insuranceNumber, companyPartner, companyCardNumber,
      selectedPoli, selectedDoctorId, selectedDoctorName, selectedDate, selectedTimeSlot,
      metodePembayaran, bankTujuan, buktiTransferImage
    };

    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    } catch (e) {
      console.warn("Gagal menyimpan draft, mungkin ukuran gambar terlalu besar.");
    }
  }, [
    step, patientName, phone, patientType, patientStatus, nik, noRM,
    bpjsNumber, insuranceProvider, insuranceNumber, companyPartner, companyCardNumber,
    selectedPoli, selectedDoctorId, selectedDoctorName, selectedDate, selectedTimeSlot,
    metodePembayaran, bankTujuan, buktiTransferImage, DRAFT_KEY
  ]);

  const refreshTicketStatus = useCallback(async (ticketId: string) => {
    if (!ticketId) return;
    try {
      // Panggil endpoint publik dengan ID tiket yang benar
      const pt = sessionStorage.getItem('patient_access_token');
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/patient/ticket/${ticketId}`, {
        headers: pt ? { 'Authorization': `Bearer ${pt}` } : {}
      });
      
      if (res.ok) {
        // Backend mengembalikan SATU objek, jadi langsung simpan
        const found = await res.json(); 
        
        setCurrentBooking(found);
        sessionStorage.setItem(`patient_submitted_ticket_${token}`, JSON.stringify(found));
      }
    } catch (e) {
      console.error('Gagal cek status tiket:', e);
    }
  }, [token]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.on('DASHBOARD_UPDATED', () => {
      const activeTicketId = currentBooking?.id || (sessionStorage.getItem(`patient_submitted_ticket_${token}`) ? JSON.parse(sessionStorage.getItem(`patient_submitted_ticket_${token}`)!).id : null);
      if (activeTicketId) refreshTicketStatus(activeTicketId);
    });
    return () => { socket.disconnect(); };
  }, [currentBooking?.id, token, refreshTicketStatus]);

    // Ambil daftar poliklinik dari database
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/polyclinics')
      .then(res => res.json())
      .then(data => {
        setPoliData(data); // <--- Simpan seluruh data (termasuk harga)
        
        // Ambil nama polinya saja untuk ditampilkan di pilihan
        const names = data.map((p: any) => p.name).sort();
        setPoliList(names);
      })
      .catch(err => console.error('Gagal memuat daftar poli', err));
  }, []);

    // Ambil daftar dokter dari database saat komponen dimuat
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/doctors')
      .then(res => res.json())
      .then(data => setAllDoctors(data))
      .catch(err => console.error('Gagal memuat daftar dokter', err));
  }, []);
  
  useEffect(() => {
    if (selectedDate && selectedTimeSlot && selectedDoctorId) {
      setLoadingQuota(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctors/quota-check?doctorId=${encodeURIComponent(selectedDoctorId)}&doctorName=${encodeURIComponent(selectedDoctorName)}&date=${selectedDate}&timeSlot=${encodeURIComponent(selectedTimeSlot)}`)
        .then(res => res.json())
        .then(data => setQuotaInfo(data))
        .catch(() => setQuotaInfo(null))
        .finally(() => setLoadingQuota(false));
    }
  }, [selectedDate, selectedTimeSlot, selectedDoctorId, selectedDoctorName]);

  useEffect(() => {
    // Ambil data mitra
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/insurance_partners')
      .then(res => res.json())
      .then(data => setPartners(data))
      .catch(err => console.error(err));

    // Ambil data poli (untuk harga)
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/polyclinics')
      .then(res => res.json())
      .then(data => setPoliData(data))
      .catch(err => console.error(err));
  }, []);

  const checkIsSessionExpired = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (selectedDate === todayStr) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const match = selectedTimeSlot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      if (match && currentMinutes >= (parseInt(match[3], 10) * 60 + parseInt(match[4], 10))) return true;
    }
    return false;
  };
  const isSessionExpired = checkIsSessionExpired();

  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/invite-link/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phoneOrName: authPhoneOrName.trim(), passcode: authPasscode.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kredensial tidak valid');

      sessionStorage.setItem(`patient_auth_${token}`, JSON.stringify({ patientName: data.patientName, phone: data.phone }));
      setPatientName(data.patientName);
      setPhone(data.phone);
      setStep(1);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCheckNoRM = async () => {
    if (!noRM.trim()) {
      showToast('Silakan ketik No. Rekam Medis (RM) Anda terlebih dahulu!', 'warning');
      return;
    }
    setCheckingRM(true);
    setRmSuccessMessage('');
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/simrs/check-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, noRM: noRM.trim() })
      });
      const result = await res.json();
      if (res.ok && result.data) {
        // AUTO-FILL IDENTITAS DASAR
        setPatientName(result.data.nama);
        
        // Simpan NIK ke state NIK
        if (result.data.nik) setNik(result.data.nik);
        
        // [FITUR AUTO-CORRECT]: Timpa kotak input dengan No RM asli dari SIMRS
        if (result.data.noRM) setNoRM(result.data.noRM);

        // AUTO-FILL KARTU PENJAMIN
        if (result.data.noBPJS) setBpjsNumber(result.data.noBPJS);
        if (result.data.asuransiProvider) setInsuranceProvider(result.data.asuransiProvider);
        if (result.data.noAsuransi) setInsuranceNumber(result.data.noAsuransi);
        if (result.data.perusahaanPartner) setCompanyPartner(result.data.perusahaanPartner);
        if (result.data.noPegawai) setCompanyCardNumber(result.data.noPegawai);

        setRmSuccessMessage(`✓ Data Ditemukan di SIMRS: a.n. ${result.data.nama}`);
      } else {
        showToast(result.message || 'No. Rekam Medis tidak ditemukan di database SIMRS RS Yasmin.', 'error');
      }
    } catch (e: any) {
      showToast('Gagal memeriksa data ke server SIMRS. Periksa koneksi Anda.', 'error');
    } finally {
      setCheckingRM(false);
    }
  };

  // =========================================================================
  // PRE-VALIDASI SEBELUM MASUK KE PEMBAYARAN (CEK GANDA NIK & KARTU JAMINAN)
  // =========================================================================
  const handleLanjutPembayaran = async () => {
    // 1. Validasi Input Kosong di Frontend
    if (patientStatus === 'Lama' && !noRM.trim()) { 
      showToast('Nomor Rekam Medis (No. RM) wajib diisi untuk pasien lama!', 'warning'); return; 
    }
    if (!nik.trim() || nik.length !== 16) { 
      showToast('Nomor NIK e-KTP harus lengkap 16 digit!', 'warning'); return; 
    }
    if (patientStatus === 'Baru' && patientType === 'BPJS' && !bpjsNumber.trim()) { 
      showToast('Nomor Kartu BPJS Kesehatan wajib diisi!', 'warning'); return; 
    }
    if (patientStatus === 'Baru' && patientType === 'Asuransi' && (!insuranceProvider || !insuranceNumber.trim())) { 
      showToast('Provider asuransi dan nomor polis wajib diisi!', 'warning'); return; 
    }
    if (patientStatus === 'Baru' && patientType === 'Perusahaan' && (!companyPartner || !companyCardNumber.trim())) { 
      showToast('Perusahaan rekanan dan ID karyawan wajib diisi!', 'warning'); return; 
    }
    if (!patientName.trim() || !phone.trim()) {
      showToast('Nama Lengkap dan Nomor WhatsApp wajib diisi!', 'warning'); return;
    }

    // 2. Tembak Backend untuk Pre-Validasi NIK dan SIMRS
    setValidatingStep5(true);
    try {
      const payload = {
        patientName, phone, patientType, patientStatus, nik: nik.trim(),
        noIdentitas: patientStatus === 'Lama' ? noRM.trim() : nik.trim(),
        bpjsNumber: bpjsNumber.trim(), insuranceNumber: insuranceNumber.trim(), companyCardNumber: companyCardNumber.trim()
      };

      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/pendaftaran/validate-step5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.warning) {
        showToast(`⚠️ ${data.warning}`, 'warning');
      }

      setStep(6); // Lolos! Masuk ke halaman pembayaran
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setValidatingStep5(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBuktiTransferImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyAccount = (norek: string) => {
    navigator.clipboard.writeText(norek);
    setCopiedAccount(norek);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  // Submit Final
  const handleSubmitPendaftaran = async () => {
    if (isSessionExpired) {
      showToast("Sesi kunjungan untuk hari ini sudah berakhir. Silakan pilih sesi atau tanggal lain!", 'warning');
      return;
    }

    if (metodePembayaran === 'transfer' && !buktiTransferImage) {
      showToast("Foto bukti transfer pembayaran WAJIB diunggah sebelum mengirim pendaftaran!", 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const noIdentitasFinal = patientStatus === 'Lama' ? noRM.trim() : nik.trim();
      const payload = {
        patientName,
        phone,
        patientType,
        patientStatus,
        nik: nik.trim(),
        noIdentitas: noIdentitasFinal,
        bpjsNumber: patientType === 'BPJS' ? bpjsNumber.trim() : null,
        insuranceProvider: patientType === 'Asuransi' ? insuranceProvider : null,
        insuranceNumber: patientType === 'Asuransi' ? insuranceNumber.trim() : null,
        companyPartner: patientType === 'Perusahaan' ? companyPartner : null,
        companyCardNumber: patientType === 'Perusahaan' ? companyCardNumber.trim() : null,
        selectedPoli,
        selectedDoctorId,
        selectedDoctorName,
        selectedDate,
        selectedTimeSlot,
        metodePembayaran,
        bankTujuan: metodePembayaran === 'transfer' ? `Bank ${bankTujuan}` : null,
        nominalBiaya: 135000,
        buktiTransferImage: metodePembayaran === 'transfer' ? buktiTransferImage : null
      };

      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/pendaftaran/submit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, payload })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pendaftaran gagal');

      if (data.patientToken) sessionStorage.setItem('patient_access_token', data.patientToken);
      setCurrentBooking(data.data);
      sessionStorage.setItem(`patient_submitted_ticket_${token}`, JSON.stringify(data.data));
      setCurrentBooking(data.data);
      sessionStorage.setItem(`patient_submitted_ticket_${token}`, JSON.stringify(data.data));
      sessionStorage.removeItem(DRAFT_KEY); // <--- TAMBAHKAN BARIS INI
      setStep(7);
      setStep(7);
    } catch (err: any) {
      showToast('Gagal mengirim pendaftaran: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPoliList = useMemo(() => {
    if (!searchPoliQuery.trim()) return poliList; // <--- Gunakan poliList
    return poliList.filter(p => p.toLowerCase().includes(searchPoliQuery.toLowerCase()));
  }, [searchPoliQuery, poliList]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/60 via-white to-gray-50 flex flex-col justify-between py-8 sm:py-12 px-4 relative overflow-hidden font-sans">
      
      {/* CSS Custom untuk Scrollbar Modern (Poli) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* Ornamen Background Modern */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* MODERN TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] animate-fade-in-down w-[95%] max-w-md">
          <div className={`flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            toast.type === 'error' ? 'bg-rose-50/90 border-rose-200 text-rose-800' :
            toast.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-800' :
            'bg-emerald-50/90 border-emerald-200 text-emerald-800'
          }`}>
            {toast.type === 'error' ? <XCircle className="h-6 w-6 text-rose-600 shrink-0" /> :
             toast.type === 'warning' ? <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" /> :
             <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />}
            <span className="text-sm font-bold flex-1 leading-snug">{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer shrink-0">
              <X className="h-4 w-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        </div>
      )}

      {/* BRANDING HEADER */}
      <div className="max-w-2xl mx-auto w-full text-center space-y-4 mb-8 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-emerald-100 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-[#0B4F4A] uppercase tracking-widest font-mono">
            Portal Pendaftaran Rawat Jalan
          </span>
        </div>
        <div className="flex items-center justify-center space-x-4 pt-2">
          <div className="h-12 w-12 bg-white rounded-2xl p-2 shadow-lg shadow-emerald-900/10 border border-gray-100 flex items-center justify-center">
            <img src="/assets/images/utama/logo_rsyasminbwi.png" alt="Logo" className="h-full w-full object-contain" onError={(e) => (e.target as HTMLElement).style.display = 'none'} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#0B4F4A] tracking-tight">
            RS Yasmin Banyuwangi
          </h1>
        </div>
      </div>

      {/* MAIN CARD CONTAINER (GLASSMORPHISM) */}
      <div className="max-w-2xl mx-auto w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_-12px_rgba(11,79,74,0.15)] overflow-hidden p-6 sm:p-10 relative z-10 transition-all duration-500">
        
        {/* PROGRESS STEPPER MODERN */}
        {step >= 1 && step <= 6 && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#0B4F4A] uppercase tracking-wider flex items-center gap-2 font-mono">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Langkah {step} dari 6
              </span>
              <span className="text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">{Math.round((step / 6) * 100)}% Selesai</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-[#0B4F4A] to-teal-500 transition-all duration-700 ease-out rounded-full relative"
                style={{ width: `${(step / 6) * 100}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* CARD 0: LOGIN */}
        {step === 0 && (
          <form onSubmit={handleVerifyLogin} className="space-y-6 animate-fade-in text-left">
            <div className="text-center space-y-3 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 text-[#0B4F4A] flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-emerald-900/10">
                <Lock className="h-9 w-9" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black text-gray-900 tracking-tight">Buka Formulir Pendaftaran</h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">Masukkan Nomor WhatsApp &amp; 4-digit sandi resmi yang dikirimkan oleh Admin RS Yasmin.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#0B4F4A]" /> Nomor WhatsApp
                </label>
                <input
                  type="tel" required placeholder="Contoh: 08xxxxxxxxxx" value={authPhoneOrName}
                  onChange={(e) => setAuthPhoneOrName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest font-mono flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-[#0B4F4A]" /> Kata Sandi
                </label>
                <input
                  type="password" required placeholder="••••" value={authPasscode}
                  onChange={(e) => setAuthPasscode(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono font-bold tracking-widest text-[#0B4F4A] focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {authError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm font-bold text-rose-700 flex items-center gap-3 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit" disabled={authLoading}
              className="w-full py-4 bg-gradient-to-r from-[#0B4F4A] to-[#0E625C] hover:from-[#0E625C] hover:to-[#0B4F4A] text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              <span>{authLoading ? 'Memverifikasi...' : 'Lanjut Isi Formulir'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        {/* CARD 1: JAMINAN */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black text-gray-900">Pilih Jenis Penjamin Pasien</h2>
              <p className="text-sm text-gray-500">Tentukan kategori pembiayaan untuk kunjungan ini.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'Umum', title: 'Umum / Mandiri', desc: 'Pembayaran biaya medis pribadi', icon: CreditCard, badge: 'Pribadi' },
                { id: 'BPJS', title: 'BPJS Kesehatan', desc: 'Poli terintegrasi rujukan faskes', icon: HeartPulse, badge: 'Nasional' },
                { id: 'Asuransi', title: 'Asuransi Swasta', desc: 'Prudential, Allianz, Inhealth, dll', icon: ShieldCheck, badge: 'Kemitraan' },
                { id: 'Perusahaan', title: 'Jaminan Perusahaan', desc: 'Kerjasama institusi & korporasi', icon: Building2, badge: 'Corporate' }
              ].map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = patientType === opt.id;
                return (
                  <button
                    key={opt.id} onClick={() => { setPatientType(opt.id); setStep(2); }}
                    className={`p-5 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1 hover:shadow-xl ${
                      isSelected 
                        ? 'bg-[#0B4F4A] text-white border-[#0B4F4A] shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-500 ring-offset-2' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500/50 hover:bg-emerald-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4 w-full">
                      <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white/10 text-white' : 'bg-emerald-50 text-[#0B4F4A]'}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base leading-tight">{opt.title}</h4>
                      <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CARD 2: STATUS PASIEN */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black text-gray-900">Status Kunjungan Medis</h2>
              <p className="text-sm text-gray-500">Apakah pasien sudah pernah memiliki rekam medis di RS Yasmin?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => { setPatientStatus('Baru'); setStep(3); }}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 flex items-center space-x-5 hover:-translate-y-1 hover:shadow-xl ${
                  patientStatus === 'Baru' ? 'border-[#0B4F4A] bg-emerald-50/40 shadow-md ring-1 ring-[#0B4F4A]' : 'border-gray-200 bg-white hover:border-emerald-500/40'
                }`}
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B4F4A] to-[#147970] text-white shrink-0 shadow-lg shadow-emerald-900/20">
                  <UserPlus className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base text-gray-900">Pasien Baru</h3>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">Wajib NIK</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">Belum pernah terdaftar. Wajib menyertakan 16 digit NIK e-KTP untuk pembuatan rekam medis.</p>
                </div>
              </button>

              <button
                onClick={() => { setPatientStatus('Lama'); setStep(3); }}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 flex items-center space-x-5 hover:-translate-y-1 hover:shadow-xl ${
                  patientStatus === 'Lama' ? 'border-[#0B4F4A] bg-emerald-50/40 shadow-md ring-1 ring-[#0B4F4A]' : 'border-gray-200 bg-white hover:border-emerald-500/40'
                }`}
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shrink-0 shadow-lg shadow-teal-900/20">
                  <UserCheck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base text-gray-900">Pasien Lama</h3>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">Punya RM</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">Sudah pernah berobat. Cantumkan Nomor Rekam Medis (RM) atau NIK untuk penarikan riwayat.</p>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button onClick={() => setStep(1)} className="text-sm text-gray-400 font-bold hover:text-gray-800 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Pilihan Jaminan
              </button>
            </div>
          </div>
        )}

        {/* CARD 3: PILIH POLI */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black text-gray-900">Pilih Poliklinik Spesialis</h2>
              <p className="text-sm text-gray-500">Pilih unit layanan medis yang ingin Anda tuju.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text" value={searchPoliQuery} onChange={(e) => setSearchPoliQuery(e.target.value)}
                placeholder="Ketik nama poli (misal: Anak, Gigi, Kandungan)..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPoliList.map((poli, idx) => {
                const isSelected = selectedPoli === poli;
                return (
                  <button
                    key={idx} onClick={() => { setSelectedPoli(poli); setStep(4); }}
                    className={`p-4 rounded-2xl border text-center text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#0B4F4A] to-[#147970] text-white border-[#0B4F4A] shadow-md ring-2 ring-emerald-500 ring-offset-1' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500/50 hover:bg-emerald-50/30'
                    }`}
                  >
                    <Stethoscope className={`h-5 w-5 ${isSelected ? 'text-emerald-200' : 'text-emerald-500'}`} />
                    <span className="truncate w-full">{poli.replace('Poli ', '')}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button onClick={() => setStep(2)} className="text-sm text-gray-400 font-bold hover:text-gray-800 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
            </div>
          </div>
        )}

                {/* CARD 4: PILIH DOKTER & JADWAL */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black text-gray-900">Pilih Dokter &amp; Waktu</h2>
              <p className="text-sm text-gray-500">Jadwal terintegrasi langsung dengan sistem SIMRS.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest font-mono">Pilih Dokter ({selectedPoli}):</label>
              {(() => {
                const cleanPoliName = selectedPoli.replace('Poli ', '').toLowerCase();
                const availableDoctors = allDoctors.filter(doc => 
                  (doc.subSpecialty && doc.subSpecialty.toLowerCase().includes(cleanPoliName)) || 
                  (doc.specialty && doc.specialty.toLowerCase().includes(cleanPoliName)) ||
                  (doc.name && doc.name.toLowerCase().includes(cleanPoliName))
                );

                if (availableDoctors.length === 0) {
                  return <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold flex items-center gap-2"><AlertCircle className="h-4 w-4"/> Belum ada jadwal dokter untuk poli ini.</div>;
                }

                return (
                  <div className="relative">
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => {
                        const docId = e.target.value;
                        setSelectedDoctorId(docId);
                        const doc = availableDoctors.find((d: any) => d.id === docId);
                        if (doc) setSelectedDoctorName(doc.name);
                        setSelectedTimeSlot(''); 
                      }}
                      className="appearance-none w-full p-4 pr-12 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all duration-300 shadow-sm outline-none"
                    >
                      <option value="">-- Pilih Dokter --</option>
                      {availableDoctors.map((doc: any) => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest font-mono block">Tanggal:</label>
                <input 
                  type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest font-mono block">Sesi:</label>
                <div className="relative">
                  <select 
                    value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} 
                    className="appearance-none w-full p-4 pr-12 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all duration-300 shadow-sm outline-none"
                  >
                    <option value="">-- Pilih Jam --</option>
                    {(() => {
                      const selectedDoc = allDoctors.find((d: any) => d.id === selectedDoctorId);
                      const hoursStr = selectedDoc?.schedule?.hours || '';
                      const hoursArray = hoursStr.split(',').map((h: string) => h.trim()).filter(Boolean);
                      return hoursArray.map((hour: string, idx: number) => <option key={idx} value={hour}>{hour}</option>);
                    })()}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 border border-emerald-200 rounded-3xl flex items-center justify-between text-sm shadow-sm mt-4">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest font-mono block mb-1">Ketersediaan Kuota:</span>
                {loadingQuota ? (
                  <span className="text-gray-500 font-bold animate-pulse">Memeriksa...</span>
                ) : quotaInfo ? (
                  <div className="flex items-baseline space-x-2">
                    <span className={`font-mono font-black text-2xl ${quotaInfo.isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {quotaInfo.remaining}
                    </span>
                    <span className="text-xs font-bold text-gray-500">/ {quotaInfo.totalQuota} Kursi</span>
                  </div>
                ) : (
                  <span className="text-gray-500 font-bold text-xs">Standar SIMRS</span>
                )}
              </div>
              {quotaInfo?.isFull && <span className="px-3 py-1 bg-rose-100 text-rose-800 font-black text-[10px] rounded-lg uppercase tracking-wider">Penuh</span>}
            </div>

            {isSessionExpired && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm font-bold text-amber-800 flex items-start gap-3 shadow-sm animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <span>Sesi jam <strong>{selectedTimeSlot}</strong> untuk hari ini sudah berakhir. Silakan pilih tanggal lain atau ganti sesi waktu.</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 text-sm">
              <button onClick={() => setStep(3)} className="text-gray-400 font-bold hover:text-gray-800 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
              <button 
                disabled={isSessionExpired || quotaInfo?.isFull || !selectedDoctorId || !selectedTimeSlot} 
                onClick={() => setStep(5)} 
                className={`px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 transition-all duration-300 shadow-lg ${
                  isSessionExpired || quotaInfo?.isFull || !selectedDoctorId || !selectedTimeSlot
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#0B4F4A] hover:bg-[#0E625C] text-white hover:-translate-y-0.5 hover:shadow-emerald-900/30'
                }`}
              >
                <span>Lanjut Isi Identitas</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* CARD 5: IDENTITAS PASIEN */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black text-gray-900">Identitas Pasien ({patientStatus})</h2>
              <p className="text-sm text-gray-500">Penjamin: <strong className="text-[#0B4F4A] bg-emerald-50 px-2 py-0.5 rounded-md">{patientType}</strong></p>
            </div>

            <div className="space-y-4 text-sm">
              {patientStatus === 'Lama' && (
                <div className="space-y-2 p-5 bg-emerald-50/50 border border-emerald-200 rounded-3xl shadow-sm">
                  <label className="font-black text-gray-700 uppercase tracking-widest font-mono text-[11px] block">
                    No. Rekam Medis / NIK <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" required value={noRM} onChange={(e) => { setNoRM(e.target.value); setRmSuccessMessage(''); }} 
                      placeholder="Contoh: 20.19... atau 3501..." 
                      className="flex-1 p-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-900 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" 
                    />
                    <button
                      type="button" onClick={handleCheckNoRM} disabled={checkingRM}
                      className="px-5 py-3.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white text-xs font-bold rounded-2xl shrink-0 disabled:opacity-50 transition-all shadow-md active:scale-95"
                    >
                      {checkingRM ? 'Memeriksa...' : 'Cek Sistem'}
                    </button>
                  </div>
                  {rmSuccessMessage && <p className="text-xs text-emerald-700 font-bold mt-2 flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="h-4 w-4" /> {rmSuccessMessage}</p>}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-gray-700 uppercase tracking-widest font-mono text-[11px] block">NIK e-KTP (16 Digit) <span className="text-rose-500">*</span></label>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${nik.length === 16 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>{nik.length}/16</span>
                </div>
                <input 
                  type="text" maxLength={16} required value={nik} onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))} 
                  placeholder="3501xxxxxxxxxxxx" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" 
                />
              </div>

              {patientType === 'BPJS' && (
                <div className="p-5 bg-emerald-50/40 border border-emerald-200 rounded-3xl space-y-3 animate-fade-in shadow-sm">
                  <div className="flex items-center space-x-2 text-[#0B4F4A] font-black text-xs uppercase tracking-widest"><HeartPulse className="h-4 w-4 text-emerald-600" /> Data Kartu BPJS</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase font-mono block">Nomor Kartu (13 Digit) <span className="text-rose-500">*</span></label>
                    <input type="text" maxLength={13} required value={bpjsNumber} onChange={(e) => setBpjsNumber(e.target.value.replace(/\D/g, ''))} placeholder="0001xxxxxxxx" className="w-full p-3.5 bg-white border border-emerald-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
                  </div>
                </div>
              )}

              {patientType === 'Asuransi' && (
                <div className="p-5 bg-teal-50/40 border border-teal-200 rounded-3xl space-y-4 animate-fade-in shadow-sm">
                  <div className="flex items-center space-x-2 text-[#0B4F4A] font-black text-xs uppercase tracking-widest"><ShieldCheck className="h-4 w-4 text-teal-600" /> Data Asuransi Swasta</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase font-mono block">Provider <span className="text-rose-500">*</span></label>
                    <select required value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} className="w-full p-3.5 bg-white border border-teal-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-sm">
                      <option value="">-- Pilih Provider --</option>
                      {partners.filter(p => p.type === 'Asuransi').map((mitra) => <option key={mitra.id} value={mitra.name}>{mitra.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase font-mono block">Nomor Polis <span className="text-rose-500">*</span></label>
                    <input type="text" required value={insuranceNumber} onChange={(e) => setInsuranceNumber(e.target.value)} placeholder="POLIS-89765432" className="w-full p-3.5 bg-white border border-teal-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
                  </div>
                </div>
              )}

              {patientType === 'Perusahaan' && (
                <div className="p-5 bg-blue-50/40 border border-blue-200 rounded-3xl space-y-4 animate-fade-in shadow-sm">
                  <div className="flex items-center space-x-2 text-blue-900 font-black text-xs uppercase tracking-widest"><Building2 className="h-4 w-4 text-blue-600" /> Kemitraan Perusahaan</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase font-mono block">Perusahaan <span className="text-rose-500">*</span></label>
                    <select required value={companyPartner} onChange={(e) => setCompanyPartner(e.target.value)} className="w-full p-3.5 bg-white border border-blue-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm">
                      <option value="">-- Pilih Perusahaan --</option>
                      {partners.filter(p => p.type === 'Perusahaan').map((mitra) => <option key={mitra.id} value={mitra.name}>{mitra.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase font-mono block">ID Karyawan <span className="text-rose-500">*</span></label>
                    <input type="text" required value={companyCardNumber} onChange={(e) => setCompanyCardNumber(e.target.value)} placeholder="NIP-1987456321" className="w-full p-3.5 bg-white border border-blue-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="font-black text-gray-700 uppercase tracking-widest font-mono text-[11px] block">Nama Lengkap Pasien <span className="text-rose-500">*</span></label>
                <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className="font-black text-gray-700 uppercase tracking-widest font-mono text-[11px] block">Nomor WhatsApp <span className="text-rose-500">*</span></label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm">
              <button onClick={() => setStep(4)} className="text-gray-400 font-bold hover:text-gray-800 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
              <button 
                disabled={validatingStep5} onClick={handleLanjutPembayaran} 
                className="px-8 py-3.5 bg-[#0B4F4A] hover:bg-[#0E625C] disabled:opacity-60 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg hover:-translate-y-0.5 hover:shadow-emerald-900/30 transition-all duration-300"
              >
                <span>{validatingStep5 ? 'Memvalidasi...' : 'Lanjut Pembayaran'}</span>
                {!validatingStep5 && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* CARD 6: PEMBAYARAN */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black text-gray-900">Penyelesaian Pembayaran</h2>
              <p className="text-sm text-gray-500">Pilih metode pembayaran biaya poliklinik resmi RS Yasmin.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <button 
                type="button" onClick={() => setMetodePembayaran('transfer')} 
                className={`p-4 rounded-2xl border text-center font-black transition-all duration-300 ${
                  metodePembayaran === 'transfer' ? 'bg-[#0B4F4A] text-white border-[#0B4F4A] shadow-lg shadow-emerald-900/20 ring-1 ring-[#0B4F4A]' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500/40'
                }`}
              >
                1. Transfer Bank
              </button>
              <button 
                type="button" onClick={() => setMetodePembayaran('bayar_di_loket')} 
                className={`p-4 rounded-2xl border text-center font-black transition-all duration-300 ${
                  metodePembayaran === 'bayar_di_loket' ? 'bg-[#0B4F4A] text-white border-[#0B4F4A] shadow-lg shadow-emerald-900/20 ring-1 ring-[#0B4F4A]' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500/40'
                }`}
              >
                2. Bayar di Loket
              </button>
            </div>

            {metodePembayaran === 'transfer' && (
              <div className="space-y-5 animate-fade-in">
                                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 sm:p-7 rounded-[2rem] shadow-xl border border-slate-700/50 space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-black">REKENING RESMI</span>
                    <span className="text-sm font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20 shadow-inner">
                      Biaya: Rp {(() => {
                        const selected = poliData.find(p => p.name === selectedPoli);
                        const harga = (selected && selected.price) ? selected.price : 135000;
                        return Number(harga).toLocaleString('id-ID');
                      })()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {bankAccounts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Belum ada rekening bank yang ditambahkan.</p>
                    ) : (
                      bankAccounts.map((bank) => (
                        <div key={bank.id} className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 hover:border-slate-500 transition-colors">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">{bank.bankName}</span>
                            <strong className="text-base tracking-wider font-mono text-white">{bank.accountNumber}</strong>
                          </div>
                          <button type="button" onClick={() => copyAccount(bank.accountNumber)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                            {copiedAccount === bank.accountNumber ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            <span>{copiedAccount === bank.accountNumber ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono font-semibold">a/n {bankAccounts[0]?.accountHolder || 'RS Yasmin Banyuwangi'}</p>
                </div>

                <div className="p-5 bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-[2rem] space-y-3 text-sm transition-all hover:bg-emerald-50 hover:border-emerald-400 group">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-[#0B4F4A] uppercase text-[11px] tracking-widest">Upload Bukti Transfer <span className="text-rose-500">*</span></label>
                    {buktiTransferImage && <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 animate-fade-in"><CheckCircle2 className="h-3.5 w-3.5" /> Foto Siap</span>}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#0B4F4A] file:text-white hover:file:bg-[#0E625C] file:transition-all file:cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm group-hover:shadow-md transition-all" />
                  {!buktiTransferImage && <p className="text-[11px] text-rose-500 font-bold pt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> Pilih foto struk transfer sebelum melanjutkan.</p>}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm">
              <button onClick={() => setStep(5)} className="text-gray-400 font-bold hover:text-gray-800 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
              <button 
                onClick={handleSubmitPendaftaran} disabled={submitting}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0B4F4A] font-black rounded-2xl shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-xs disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {submitting ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
              </button>
            </div>
          </div>
        )}

                {/* CARD 7: STATUS TIKET */}
        {step === 7 && currentBooking && (
          <div className="space-y-8 animate-scale-up text-center">
            
            {/* Ikon Animasi Status */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full w-24 h-24 mx-auto animate-pulse" />
              {currentBooking.status === 'baru' ? (
                <div className="relative w-24 h-24 bg-white text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 border-4 border-amber-100">
                  <Clock className="h-10 w-10 animate-pulse" />
                </div>
              ) : currentBooking.status === 'dibatalkan' ? (
                <div className="relative w-24 h-24 bg-white text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-rose-500/20 border-4 border-rose-100">
                  <AlertCircle className="h-10 w-10" />
                </div>
              ) : (
                <div className="relative w-24 h-24 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 border-4 border-emerald-100">
                  <CheckCircle2 className="h-10 w-10 animate-bounce-slow" />
                </div>
              )}
            </div>

            {/* Teks Status */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-900 tracking-tight">
                {currentBooking.status === 'baru' ? 'Pendaftaran Terkirim!' : currentBooking.status === 'dibatalkan' ? 'Pendaftaran Dibatalkan' : 'Pendaftaran Dikonfirmasi! 🎉'}
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                {currentBooking.status === 'baru' 
                  ? (currentBooking.metodePembayaran === 'bayar_di_loket' ? 'Pendaftaran diterima. Petugas menyiapkan tiket antrean Anda. Silakan selesaikan administrasi di Loket RS saat Check-in.' : 'Petugas pendaftaran RS Yasmin sedang memeriksa bukti transfer Anda di sistem.') 
                  : currentBooking.status === 'dibatalkan' ? 'Mohon maaf, pendaftaran Anda dibatalkan oleh petugas.' : 'Pendaftaran Anda telah resmi disetujui & tercatat di SIMRS.'}
              </p>
            </div>

            {/* KOTAK STRUK / BARCODE MODERN */}
            <div className="w-full max-w-sm mx-auto">
              {currentBooking.kodeBooking ? (
                <div className="relative animate-fade-in bg-white rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-200 p-2 overflow-hidden">
                  <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between -translate-y-1/2 px-2 pointer-events-none z-10">
                    <div className="w-4 h-8 bg-[#F8FAF9] rounded-r-full border-y border-r border-gray-200 -ml-2"></div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2"></div>
                    <div className="w-4 h-8 bg-[#F8FAF9] rounded-l-full border-y border-l border-gray-200 -mr-2"></div>
                  </div>
                  
                  <div className="pb-8">
                    <BarcodeCard 
                      kodeBooking={currentBooking.kodeBooking} 
                      nomorAntrean={currentBooking.antrian} 
                      namaPasien={currentBooking.patientName} 
                      noRM={currentBooking.noIdentitas || currentBooking.nik} 
                      dokter={currentBooking.selectedDoctorName} 
                      poli={currentBooking.selectedPoli} 
                      jadwal={currentBooking.selectedTimeSlot} 
                      tanggal={currentBooking.selectedDate} 
                      idTiket={currentBooking.id} 
                    />
                  </div>
                </div>
              ) : currentBooking.status === 'dibatalkan' ? (
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-sm text-rose-800 shadow-sm animate-fade-in">
                  <strong className="flex items-center justify-center gap-2 mb-2"><AlertCircle className="h-5 w-5"/> Pendaftaran Dibatalkan</strong>
                  <p className="mt-1 font-sans italic opacity-80">"{currentBooking.adminNotes || 'Data tidak sesuai.'}"</p>
                </div>
              ) : (
                <div className="bg-amber-50/80 p-8 rounded-[2rem] border border-amber-200 text-center space-y-3 shadow-sm animate-fade-in">
                  <span className="text-sm text-amber-800 font-black block font-mono tracking-widest">⏳ MENUNGGU VERIFIKASI</span>
                  <p className="text-xs text-amber-700/80 leading-relaxed font-medium">Struk barcode check-in dan nomor antrean akan otomatis terbit di sini seketika Admin menyetujui pendaftaran Anda.</p>
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="pt-6 flex flex-col gap-3 max-w-sm mx-auto border-t border-gray-100 mt-8">
              {!currentBooking.kodeBooking && currentBooking.status === 'baru' && (
                <button 
                  onClick={() => refreshTicketStatus(currentBooking.id)} 
                  className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 active:scale-95 border border-gray-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Cek Ulang Status Manual</span>
                </button>
              )}
              
              <a href="/pasien" className="w-full py-4 bg-[#0B4F4A] hover:bg-[#0E625C] text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-emerald-900/30 flex items-center justify-center gap-2">
                <span>Buka Dashboard Pasien</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}