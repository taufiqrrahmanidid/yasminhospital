import React, { useState, useRef, useEffect } from 'react';
import { SafeImage } from '../utils/imageUrl';
import { 
  Building, 
  ClipboardList, 
  Award, 
  Users, 
  Calendar, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  Image as ImageIcon,
  Search,
  MapPin,
  Phone,
  Mail,
  Shield,
  FileText,
  Printer,
  Menu,
  Share2,
  Megaphone,
  Globe,
  Link,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Bed,
  BedDouble,
  Activity,
  HeartPulse,
  Siren,
  Stethoscope,
  Baby,
  Scissors,
  ShieldCheck,
  Droplet,
  ClipboardCheck,
  Accessibility,
  Home,
  Truck,
  LayoutGrid,
  Clock,
  Send,
  LineChart,
  Star,
  UserCheck,
  Thermometer,
  TrendingUp,
  RefreshCw,
  RotateCcw,
  Layers,
  ShieldAlert, Newspaper, MonitorSmartphone, KeyRound, Lock, UserPlus, CheckCircle2,
  CreditCard
} from 'lucide-react';
import { Doctor, HospitalRoom } from '../types';
import KpiDashboard from './KpiDashboards';
import DatabaseExportManager from './DatabaseExportManager';
import { fetchCollection, syncCollectionToCloud, saveDocument, db, deleteDocument } from '../lib/db';
import { confirmDialog } from '../lib/ui';
import { doc, getDoc } from '../lib/db';

interface AdminDashboardProps {
  onClose: () => void;
  doctors: Doctor[];
  onUpdateDoctors: (updated: Doctor[]) => void;
  onSyncSystemDoctors?: () => void;
  onResetSystemDoctors?: () => void;
  rsInfo?: HospitalInfo;
  onUpdateRsInfo?: (info: HospitalInfo) => void;
}

const logoRsYasmin = '/assets/images/utama/logo_rsyasminbwi.png';

interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  accreditation: string;
  logo?: string;
  youtubeChannelId?: string;
}

interface Polyclinic {
  code: string;
  name: string;
  status: 'Aktif' | 'Pasif';
  activeSinceDate?: string;
  inactiveSinceDate?: string;
}

interface Specialist {
  code: string;
  name: string;
  description: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color?: string;
}

export interface Announcement {
  id: string;
  image: string;
  title: string;
  isActive: boolean;
  activeDate?: string;
  closeDate?: string;
}

const INITIAL_RS_INFO: HospitalInfo = {
  name: 'RS Yasmin Banyuwangi',
  address: 'Jl. Letkol Istiqlah No. 80-84, Mojopanggung, Kec. Banyuwangi, Kab. Banyuwangi, Jawa Timur 68425',
  phone: '0333-424671',
  email: 'yasmin_hospital@yahoo.com',
  whatsapp: '+62 852 5935 3001',
  accreditation: 'Terakreditasi Paripurna Kemenkes RI'
};

const INITIAL_POLYCLINICS: Polyclinic[] = [
  { code: 'POL001', name: 'Anak', status: 'Aktif' },
  { code: 'POL002', name: 'Anestesi', status: 'Aktif' },
  { code: 'POL003', name: 'Bedah Tulang', status: 'Aktif' },
  { code: 'POL004', name: 'Bedah Umum', status: 'Aktif' },
  { code: 'POL005', name: 'Edukasi', status: 'Aktif' },
  { code: 'POL006', name: 'Gigi Anak', status: 'Aktif' },
  { code: 'POL007', name: 'Gigi Bedah Mulut', status: 'Aktif' },
  { code: 'POL008', name: 'Gigi Ortodontis', status: 'Aktif' },
  { code: 'POL009', name: 'Gigi Penyakit Mulut', status: 'Aktif' },
  { code: 'POL010', name: 'Gigi Periodonsia', status: 'Aktif' },
  { code: 'POL011', name: 'Gigi Prostodonsis', status: 'Aktif' },
  { code: 'POL012', name: 'Gigi Umum', status: 'Aktif' },
  { code: 'POL013', name: 'Jantung & Pembuluh Darah', status: 'Aktif' },
  { code: 'POL014', name: 'Kandungan & Kebidanan', status: 'Aktif' },
  { code: 'POL015', name: 'Konselor', status: 'Aktif' },
  { code: 'POL016', name: 'Kulit & Kelamin', status: 'Aktif' },
  { code: 'POL017', name: 'Mata', status: 'Aktif' },
  { code: 'POL018', name: 'Paru', status: 'Aktif' },
  { code: 'POL019', name: 'Patologi Klinis', status: 'Aktif' },
  { code: 'POL020', name: 'Penyakit Dalam', status: 'Aktif' },
  { code: 'POL021', name: 'Psikolog', status: 'Aktif' },
  { code: 'POL022', name: 'Radiologi', status: 'Aktif' },
  { code: 'POL023', name: 'Rehab Medik', status: 'Aktif' },
  { code: 'POL024', name: 'Saraf', status: 'Aktif' },
  { code: 'POL025', name: 'THT-KL', status: 'Aktif' },
  { code: 'POL026', name: 'Umum', status: 'Aktif' },
  { code: 'POL027', name: 'Urologi', status: 'Aktif' }
];

const INITIAL_SPECIALISTS: Specialist[] = [
  { code: 'SPS001', name: 'Spesialis Anak', description: 'Kesehatan bayi, anak, dan remaja' },
  { code: 'SPS002', name: 'Spesialis Anestesi', description: 'Pelayanan anestesi dan manajemen nyeri' },
  { code: 'SPS003', name: 'Spesialis Orthopedi dan Traumatologi', description: 'Menangani cedera dan kelainan tulang' },
  { code: 'SPS004', name: 'Spesialis Bedah Umum', description: 'Pelayanan konsultasi dan tindakan bedah umum' },
  { code: 'SPS005', name: 'Edukator Kesehatan', description: 'Edukasi kesehatan dan konsultasi' },
  { code: 'SPS006', name: 'Spesialis Kedokteran Gigi Anak', description: 'Pelayanan kesehatan gigi anak' },
  { code: 'SPS007', name: 'Spesialis Bedah Mulut', description: 'Pelayanan bedah mulut dan rahang' },
  { code: 'SPS008', name: 'Spesialis Ortodonti', description: 'Perawatan susunan gigi dan rahang' },
  { code: 'SPS009', name: 'Spesialis Penyakit Mulut', description: 'Diagnosis dan terapi penyakit rongga mulut' },
  { code: 'SPS010', name: 'Spesialis Periodonsia', description: 'Kesehatan gusi dan jaringan pendukung gigi' },
  { code: 'SPS011', name: 'Spesialis Prostodonsia', description: 'Pelayanan rehabilitasi dan gigi tiruan' },
  { code: 'SPS012', name: 'Dokter Gigi Umum', description: 'Pelayanan kesehatan gigi umum' },
  { code: 'SPS013', name: 'Spesialis Jantung dan Pembuluh Darah', description: 'Kesehatan jantung dan pembuluh darah' },
  { code: 'SPS014', name: 'Spesialis Obstetri dan Ginekologi', description: 'Pelayanan kehamilan dan kesehatan wanita' },
  { code: 'SPS015', name: 'Konselor', description: 'Konseling dan pendampingan psikologis' },
  { code: 'SPS016', name: 'Spesialis Kulit dan Kelamin', description: 'Kesehatan kulit dan kelamin' },
  { code: 'SPS017', name: 'Spesialis Mata', description: 'Pemeriksaan dan tindakan kesehatan mata' },
  { code: 'SPS018', name: 'Spesialis Paru', description: 'Penanganan penyakit paru and pernapasan' },
  { code: 'SPS019', name: 'Spesialis Patologi Klinis', description: 'Pelayanan laboratorium dan diagnostik klinis' },
  { code: 'SPS020', name: 'Spesialis Penyakit Dalam', description: 'Pelayanan penyakit dalam dewasa' },
  { code: 'SPS021', name: 'Psikolog Klinis', description: 'Pelayanan konsultasi psikologis' },
  { code: 'SPS022', name: 'Spesialis Radiologi', description: 'Pencitraan medis dan radiologi' },
  { code: 'SPS023', name: 'Spesialis Kedokteran Fisik dan Rehabilitasi', description: 'Pelayanan rehabilitasi medik' },
  { code: 'SPS024', name: 'Spesialis Saraf', description: 'Diagnosis dan terapi gangguan saraf' },
  { code: 'SPS025', name: 'Spesialis THT-KL', description: 'Kesehatan telinga, hidung, dan tenggorokan' },
  { code: 'SPS026', name: 'Dokter Umum', description: 'Pelayanan kesehatan primer' },
  { code: 'SPS027', name: 'Spesialis Urologi', description: 'Kesehatan saluran kemih' }
];

export const INITIAL_SOCIAL_MEDIA: SocialMedia[] = [
  { id: 'soc-1', platform: 'Instagram', url: 'https://www.instagram.com/yasminhospital_official', icon: 'Instagram' },
  { id: 'soc-2', platform: 'Facebook', url: 'https://www.facebook.com/yasmin.hospital/', icon: 'Facebook' },
  { id: 'soc-3', platform: 'Youtube', url: 'https://www.youtube.com/@YasminHospitalTV/', icon: 'Youtube' },
  { id: 'soc-4', platform: 'TikTok', url: 'https://www.tiktok.com/@yasminhospital', icon: 'Globe' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    title: 'Pelayanan Poliklinik Tetap Buka Selama Libur Nasional',
    isActive: true,
    activeDate: '2026-06-01',
    closeDate: '2026-12-31'
  }
];

export const INITIAL_ROOMS: HospitalRoom[] = [
  {
    id: 'room-1',
    type: 'Rawat Inap',
    name: 'Suite Resort Semeru',
    class: 'Suite',
    capacity: 5,
    occupied: 2,
    facilities: 'AC, Smart TV, Bath Tub, Sofa Bed, Private Garden Patio, Mini Kitchen'
  },
  {
    id: 'room-2',
    type: 'Rawat Inap',
    name: 'VIP Ijen View',
    class: 'VIP',
    capacity: 10,
    occupied: 6,
    facilities: 'AC, LED TV, Sofa, Garden View, Lemari Es'
  },
  {
    id: 'room-3',
    type: 'Rawat Inap',
    name: 'Cempaka Indah',
    class: 'Kelas 1',
    capacity: 15,
    occupied: 10,
    facilities: 'AC, LED TV, Kamar Mandi Dalam'
  },
  {
    id: 'room-4',
    type: 'Rawat Inap',
    name: 'Melati Asri',
    class: 'Kelas 2',
    capacity: 20,
    occupied: 14,
    facilities: 'AC, Kamar Mandi Dalam, Nakas'
  },
  {
    id: 'room-5',
    type: 'Rawat Inap',
    name: 'Flamboyan Raya',
    class: 'Kelas 3',
    capacity: 30,
    occupied: 21,
    facilities: 'Kipas Angin, Kamar Mandi Dalam'
  },
  {
    id: 'room-6',
    type: 'ICU',
    name: 'ICU Central Room',
    class: 'ICU',
    capacity: 8,
    occupied: 4,
    facilities: 'Ventilator Modern, Bedside Monitor, Syringe Pump, Central Oxygen'
  },
  {
    id: 'room-7',
    type: 'ICU',
    name: 'ICU Isolation Negative Pressure',
    class: 'ICU Isolasi',
    capacity: 4,
    occupied: 1,
    facilities: 'Negative Pressure HEPA, ICU Monitor, Ventilator'
  },
  {
    id: 'room-8',
    type: 'IGD',
    name: 'Triage Bed Utama',
    class: 'IGD Umum',
    capacity: 12,
    occupied: 5,
    facilities: 'Defibrillator, Bedside Monitor, Resuscitation Kit'
  },
  {
    id: 'room-9',
    type: 'IGD',
    name: 'Kamar Resusitasi Jantung',
    class: 'IGD Resusitasi',
    capacity: 3,
    occupied: 1,
    facilities: 'Crash Cart, Advanced Ventilator, Monitor Bedside'
  }
];

type ActiveMenu = 'NAMA_RS' | 'DATA_POLY' | 'DATA_SPESIALIS' | 'DATA_DOKTER' | 'DATA_PRAKTEK' | 'MITRA_PENJAMIN' | 'METODE_PEMBAYARAN' | 'SOSIAL_MEDIA' | 'BERITA' | 'ULASAN_GOOGLE'  | 'KAMAR_RAWAT_INAP' | 'KAMAR_ICU' | 'KAMAR_IGD'
  | 'KPI_RAWAT_JALAN' | 'KPI_RAWAT_INAP' | 'KPI_IGD' | 'KPI_ICU' | 'KPI_HCU' | 'KPI_NICU' | 'KPI_PICU' | 'KPI_PERINATOLOGI' | 'KPI_KAMAR_OPERASI' | 'KPI_CSSD' | 'KPI_HEMODIALISA'
  | 'KPI_MCU' | 'KPI_REHABILITASI_MEDIK' | 'KPI_HOME_CARE' | 'KPI_AMBULANCE' | 'KPI_BED_MANAGEMENT' | 'KPI_ANTRIAN' | 'KPI_RUJUKAN_PASIEN' | 'KPI_ANALISA_RUJUKAN' | 'KPI_KINERJA_PELAYANAN'
  | 'FEED_SOSMED' | 'ARTIKEL' | 'MANAJEMEN_USER' | 'LISENSI_PERANGKAT'| 'LAPORAN_PASIEN'| 'PENGATURAN_SISTEM' | 'AUDIT_LOG' | 'KATEGORI_SPESIALIS';

const getMenuTitle = (menu: ActiveMenu): string => {
  switch (menu) {
    case 'NAMA_RS': return 'Pengaturan Profil Instansi Rumah Sakit';
    case 'DATA_POLY': return 'Laporan Master Data Poliklinik';
    case 'DATA_SPESIALIS': return 'Laporan Master Data Spesialisasi';
    case 'DATA_DOKTER': return 'Laporan Master Data Dokter';
    case 'DATA_PRAKTEK': return 'Laporan Jadwal Praktek Dokter';
    case 'SOSIAL_MEDIA': return 'Laporan Master Link Sosial Media';
    case 'BERITA': return 'Laporan Master Berita & Pengumuman';
    case 'ULASAN_GOOGLE': return 'Master & Kurasi Ulasan Google Maps';
    case 'KAMAR_RAWAT_INAP': return 'Laporan Master Kamar Rawat Inap';
    case 'KAMAR_ICU': return 'Laporan Master Kamar ICU';
    case 'KAMAR_IGD': return 'Laporan Master Kamar IGD';
    case 'FEED_SOSMED': return 'Manajemen Konten Postingan Sosmed';
    case 'ARTIKEL': return 'Manajemen Artikel & Blog Kesehatan';
    case 'MANAJEMEN_USER': return 'Hak Akses & Manajemen User (RBAC)';
    case 'LISENSI_PERANGKAT': return 'Kontrol Keamanan Lisensi Perangkat';
    case 'LAPORAN_PASIEN': return 'Laporan Saran & Pengaduan Pasien';
    default:
      if (menu.startsWith('KPI_')) {
        const name = menu.replace('KPI_', '').replace(/_/g, ' ');
        return `Laporan KPI & Kinerja - ${name}`;
      }
      return 'Laporan Admin Portal';
  }
};

export default function AdminDashboard({ onClose, doctors, onUpdateDoctors, onSyncSystemDoctors, onResetSystemDoctors, rsInfo: rsInfoProp, onUpdateRsInfo }: AdminDashboardProps) {
  
  // =========================================================================
  // SISTEM LOGIN & RBAC (ROLE-BASED ACCESS CONTROL)
  // =========================================================================
  const [adminSession, setAdminSession] = useState<any>(() => {
    try {
      const s = localStorage.getItem('master_admin_session');
      return s ? JSON.parse(s) : null; 
    } catch (e) { return null; }
  });

  // Auto-Redirect untuk Staf Loket (Admin Pendaftaran)
  useEffect(() => {
    if (adminSession && adminSession.role === 'User') {
      const perms = adminSession.permissions || [];
      // Jika dia punya akses pendaftaran, TAPI tidak punya akses master data/konten/laporan
      // Maka dia murni staf loket. Lempar ke /admin/pendaftaran!
      if (
        perms.includes('MENU_PENDAFTARAN') && 
        !perms.includes('MENU_MASTER_DATA') && 
        !perms.includes('MENU_CONTENT') && 
        !perms.includes('MENU_PATIENT_FEEDBACK')
      ) {
        window.location.href = '/admin/pendaftaran';
      }
    }
  }, [adminSession]);

  // Fungsi untuk mengecek hak akses
  const hasAccess = (permission: string) => {
    if (adminSession?.role === 'Master' || adminSession?.role === 'SuperUser') return true; // Master & Direktur bypass
    return adminSession?.permissions?.includes(permission);
  };
  

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
            
      setAdminSession(data.user);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch(e) {}
    localStorage.removeItem('admin_user');
    localStorage.removeItem('master_admin_session');
    setAdminSession(null);
  };
  
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('NAMA_RS');
  const isInitialLoadRef = useRef(true);

  // Sinkronisasi master data dari SIMRS (Sumber B)
  const [simrsSyncLoading, setSimrsSyncLoading] = useState(false);
  const [simrsSyncFeedback, setSimrsSyncFeedback] = useState<string | null>(null);

  const handleSimrsSync = async () => {
    if (simrsSyncLoading) return;
    setSimrsSyncLoading(true);
    setSimrsSyncFeedback(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/simrs/sync-master`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal sinkronisasi.');
      const total = (data.results || []).reduce((s: number, r: any) => s + (r?.count || 0), 0);
      if (data.errors && data.errors.length > 0) {
        const allNotConfigured = data.errors.every((e: any) => String(e.error || '').includes('belum dikonfigurasi'));
        if (allNotConfigured) {
          setSimrsSyncFeedback('SIMRS belum tersambung. Fitur aktif setelah API Trust Medis dikonfigurasi.');
        } else {
          setSimrsSyncFeedback(`Sebagian gagal: ${data.errors.map((e: any) => `${e.entity}: ${e.error}`).join('; ')}`);
        }
      } else if (total === 0) {
        setSimrsSyncFeedback('Tidak ada data master yang berubah.');
      } else {
        setSimrsSyncFeedback(`Berhasil sinkron ${total} data master dari SIMRS.`);
      }
    } catch (err: any) {
      setSimrsSyncFeedback(`Gagal: ${err.message || 'kesalahan server.'}`);
    } finally {
      setSimrsSyncLoading(false);
    }
  };

  // OS, Browser, Resolution Detection & Layout Optimization states
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [detectedOS, setDetectedOS] = useState('Mengidentifikasi...');
  const [detectedBrowser, setDetectedBrowser] = useState('Mengidentifikasi...');
  const [detectedResolution, setDetectedResolution] = useState('Mengidentifikasi...');
  const [systemFont, setSystemFont] = useState('"Inter", sans-serif');
  const [systemFontSize, setSystemFontSize] = useState('14px');
  const [systemPadding, setSystemPadding] = useState('1.5rem');
  
  const [detectionSteps, setDetectionSteps] = useState<{ label: string; status: 'waiting' | 'loading' | 'success'; value?: string }[]>([
    { label: 'Deteksi Operating System (OS)', status: 'waiting' },
    { label: 'Analisis Web Browser Engine', status: 'waiting' },
    { label: 'Pengecekan Resolusi Layar & Piksel', status: 'waiting' },
    { label: 'Standarisasi Font & Skala Komponen', status: 'waiting' }
  ]);

  useEffect(() => {
    let currentProgress = 0;
    
    // Step 1: Detect OS (Starts immediately)
    setDetectionSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'loading' } : s));
    
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress > 100) currentProgress = 100;
      setDetectionProgress(currentProgress);
      
      if (currentProgress === 25) {
        // Evaluate OS
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform || '';
        let os = 'Unknown OS';
        let fontStr = '"Inter", sans-serif';
        
        if (/Mac/i.test(platform) || /Macintosh/i.test(userAgent)) {
          os = 'macOS';
          fontStr = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif';
        } else if (/Win/i.test(platform) || /Windows/i.test(userAgent)) {
          os = 'Windows';
          fontStr = '"Inter", "Segoe UI", "Tahoma", "Arial", sans-serif';
        } else if (/Android/i.test(userAgent)) {
          os = 'Android';
          fontStr = '"Inter", "Roboto", "Helvetica Neue", sans-serif';
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
          os = 'iOS';
          fontStr = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        } else if (/Linux/i.test(platform) || /Linux/i.test(userAgent)) {
          os = 'Linux';
          fontStr = '"Inter", "Fira Sans", "Noto Sans", sans-serif';
        }
        
        setDetectedOS(os);
        setSystemFont(fontStr);
        setDetectionSteps(prev => prev.map((s, idx) => 
          idx === 0 ? { ...s, status: 'success', value: os } :
          idx === 1 ? { ...s, status: 'loading' } : s
        ));
      }
      
      if (currentProgress === 50) {
        // Evaluate Browser
        const userAgent = window.navigator.userAgent;
        let browser = 'Unknown Browser';
        
        if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Edge") === -1 && userAgent.indexOf("OPR") === -1) {
          browser = 'Google Chrome';
        } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
          browser = 'Apple Safari';
        } else if (userAgent.indexOf("Firefox") > -1) {
          browser = 'Mozilla Firefox';
        } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
          browser = 'Microsoft Edge';
        } else if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
          browser = 'Opera';
        } else {
          browser = 'Web Browser';
        }
        
        setDetectedBrowser(browser);
        setDetectionSteps(prev => prev.map((s, idx) => 
          idx === 1 ? { ...s, status: 'success', value: browser } :
          idx === 2 ? { ...s, status: 'loading' } : s
        ));
      }
      
      if (currentProgress === 75) {
        // Evaluate Resolution
        const w = window.screen.width;
        const h = window.screen.height;
        const resStr = `${w}x${h}px`;
        
        let fs = '14px';
        let pad = '1.5rem';
        let desc = 'Desktop Standar';
        
        if (w >= 1920) {
          fs = '15.5px';
          pad = '1.75rem';
          desc = 'High-Res / 4K';
        } else if (w >= 1024 && w < 1280) {
          fs = '13px';
          pad = '1.25rem';
          desc = 'Compact Screen';
        } else if (w < 1024) {
          fs = '12px';
          pad = '1rem';
          desc = 'Tablet / Mobile';
        }
        
        setDetectedResolution(resStr);
        setSystemFontSize(fs);
        setSystemPadding(pad);
        
        setDetectionSteps(prev => prev.map((s, idx) => 
          idx === 2 ? { ...s, status: 'success', value: `${resStr} (${desc})` } :
          idx === 3 ? { ...s, status: 'loading' } : s
        ));
      }
      
      if (currentProgress === 100) {
        clearInterval(interval);
        
        // Final Step
        setDetectionSteps(prev => prev.map((s, idx) => 
          idx === 3 ? { ...s, status: 'success', value: 'Terstandarisasi' } : s
        ));
        
        // Brief pause at 100% for smooth UX
        setTimeout(() => {
          setIsDetecting(false);
        }, 350);
      }
    }, 50); // Speed up detection interval slightly for snappy feel (50ms per step = ~1s total)
    
    return () => clearInterval(interval);
  }, []);
  
  // Sidebar auto-hide/collapse states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isKpiSidebarExpanded, setIsKpiSidebarExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sorting States
  const [polySort, setPolySort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'code', direction: 'asc' });
  const [specialistSort, setSpecialistSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'code', direction: 'asc' });
  const [doctorSort, setDoctorSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' });
  const [praktekSort, setPraktekSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Hospital Info State
  const [rsInfoState, setRsInfoState] = useState<HospitalInfo>(() => {
    try {
      const saved = localStorage.getItem('admin_rs_info');
      return saved ? JSON.parse(saved) : INITIAL_RS_INFO;
    } catch (e) {
      console.error('Failed to parse admin_rs_info from localStorage:', e);
      return INITIAL_RS_INFO;
    }
  });

  const rsInfo = rsInfoProp !== undefined ? rsInfoProp : rsInfoState;
  const setRsInfo = onUpdateRsInfo !== undefined ? onUpdateRsInfo : setRsInfoState;

  // Polyclinics State
  const [polyclinics, setPolyclinics] = useState<Polyclinic[]>(() => {
    try {
      const saved = localStorage.getItem('admin_polyclinics');
      return saved ? JSON.parse(saved) : INITIAL_POLYCLINICS;
    } catch (e) {
      console.error('Failed to parse admin_polyclinics from localStorage:', e);
      return INITIAL_POLYCLINICS;
    }
  });

  // Specialists State
  const [specialists, setSpecialists] = useState<Specialist[]>(() => {
    try {
      const saved = localStorage.getItem('admin_specialists');
      return saved ? JSON.parse(saved) : INITIAL_SPECIALISTS;
    } catch (e) {
      console.error('Failed to parse admin_specialists from localStorage:', e);
      return INITIAL_SPECIALISTS;
    }
  });

  // Social Media State
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>(() => {
    try {
      const saved = localStorage.getItem('admin_social_media');
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_MEDIA;
    } catch (e) {
      console.error('Failed to parse admin_social_media from localStorage:', e);
      return INITIAL_SOCIAL_MEDIA;
    }
  });

  // Berita & Pengumuman state
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('admin_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch (e) {
      console.error('Failed to parse admin_announcements from localStorage:', e);
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Google Reviews Kurasi State
  const [googleReviewsList, setGoogleReviewsList] = useState<any[]>([]);
  const [filterLimit, setFilterLimit] = useState<string>('10');
  const [filterRating, setFilterRating] = useState<string>('');
  const [filterDatePreset, setFilterDatePreset] = useState<string>('all');
  const [isSyncingGmaps, setIsSyncingGmaps] = useState(false);
  const [gmapsSyncMsg, setGmapsSyncMsg] = useState('');

  const loadGoogleReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (filterLimit) params.append('limit', filterLimit);
      if (filterRating) params.append('minRating', filterRating);
      
      if (filterDatePreset !== 'all') {
        const end = new Date();
        const start = new Date();
        // Set jam akhir ke 23:59:59 agar mencakup seluruh hari ini
        end.setHours(23, 59, 59, 999);
        
        if (filterDatePreset === '1_month') start.setMonth(end.getMonth() - 1);
        if (filterDatePreset === '3_months') start.setMonth(end.getMonth() - 3);
        
        params.append('startDate', start.toISOString());
        params.append('endDate', end.toISOString());
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setGoogleReviewsList(data);
      }
    } catch (e) {
      console.error('Error load reviews:', e);
    }
  };

  // Tambahkan useEffect agar filter langsung bekerja saat diubah
  useEffect(() => {
    if (activeMenu === 'ULASAN_GOOGLE') {
      loadGoogleReviews();
    }
  }, [activeMenu, filterLimit, filterRating, filterDatePreset]);

  // Handler Tombol "Sinkronkan Ulasan Google Maps"
    const handleSyncFromGoogle = async () => {
    setIsSyncingGmaps(true);
    setGmapsSyncMsg('Menghubungi Google API...');
    try {
      const { syncGoogleReviewsFromMaps } = await import('../lib/googleReviewsService');
      const res = await syncGoogleReviewsFromMaps();
      await loadGoogleReviews();
      
      const sourceName = res.source === 'gbp' ? 'Business Profile (Data Lengkap)' : 'Places (5 Data Terakhir)';
      setGmapsSyncMsg(`✅ Berhasil! Menarik ${res.total} ulasan via ${sourceName}.`);
    } catch (e: any) {
      setGmapsSyncMsg('⚠️ Gagal sinkronisasi: ' + e.message);
    } finally {
      setIsSyncingGmaps(false);
      setTimeout(() => setGmapsSyncMsg(''), 6000);
    }
  };

  // Handler Saklar ON / OFF Tampilkan di Web
  const handleToggleVisible = async (id: string, currentVal: boolean) => {
    try {
      const { toggleReviewVisibility } = await import('../lib/googleReviewsService');
      await toggleReviewVisibility(id, currentVal);
      setGoogleReviewsList(prev => prev.map(r => r.id === id ? { ...r, isVisible: !currentVal } : r));
    } catch (e) {
      alert('Gagal mengubah status tampil.');
    }
  };

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const loadFeedbacks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/feedback`, { credentials: 'include' });
      if (res.ok) setFeedbacks(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeMenu === 'LAPORAN_PASIEN') loadFeedbacks();
  }, [activeMenu]);

  const handleUpdateFeedbackStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/feedback/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
        if (selectedFeedback?.id === id) setSelectedFeedback((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (e) { alert('Gagal update status'); }
  };

  const [searchFeedback, setSearchFeedback] = useState('');
  const [filterFeedbackStatus, setFilterFeedbackStatus] = useState('all');

  // Persistent search & filter states
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'ADD' | 'EDIT'>('ADD');
  const [showPrintWarning, setShowPrintWarning] = useState(false);

  // Custom delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'DOCTOR' | 'POLY' | 'SPECIALIST' | 'SOCIAL' | 'ANNOUNCEMENT' | 'ROOM';
    id: string;
    name: string;
  } | null>(null);

    const executeDelete = async (type: 'DOCTOR' | 'POLY' | 'SPECIALIST' | 'SOCIAL' | 'ANNOUNCEMENT' | 'ROOM', id: string) => {
    try {
      if (type === 'DOCTOR') {
        await deleteDocument('doctors', id);
        onUpdateDoctors(doctors.filter(d => d.id !== id));
      } else if (type === 'POLY') {
        await deleteDocument('polyclinics', id);
        setPolyclinics(polyclinics.filter(p => p.code !== id));
      } else if (type === 'SPECIALIST') {
        await deleteDocument('specialists', id);
        setSpecialists(specialists.filter(s => s.code !== id));
      } else if (type === 'SOCIAL') {
        await deleteDocument('social_media', id);
        setSocialMediaLinks(socialMediaLinks.filter(s => s.id !== id));
      } else if (type === 'ANNOUNCEMENT') {
        await deleteDocument('announcements', id);
        setAnnouncements(announcements.filter(a => a.id !== id));
      } else if (type === 'ROOM') {
        await deleteDocument('rooms', id);
        setRooms(rooms.filter(r => r.id !== id));
      }
      alert('Data berhasil dihapus permanen dari database!');
    } catch (e: any) {
      alert(`Gagal menghapus data: ${e.message}`);
    }
  };

  // State untuk Manajemen Booking Pasien
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    if (!adminSession) return;
    const loadBookings = async () => {
      try {
        const cloudBookings = await fetchCollection('bookings');
        setBookings(cloudBookings);
      } catch (e) {
        console.error('Failed to fetch bookings:', e);
      }
    };
    loadBookings();
  }, [adminSession]);

  
  // State untuk Manajemen Feed Sosmed
  const [socialFeeds, setSocialFeeds] = useState<any[]>([]);
  const [newFeed, setNewFeed] = useState({ platform: 'Youtube', title: '', url: '', desc: '', tag: 'Edukasi' });
  const [isSavingFeed, setIsSavingFeed] = useState(false);
  // Ambil default dari database global rsInfo
  const [ytSyncConfig, setYtSyncConfig] = useState({ 
    channelId: rsInfo.youtubeChannelId || '', 
    limit: 5 
  });

  // Pastikan input selalu ter-update jika admin lain mengubah data (dari cloud)
  useEffect(() => {
    if (rsInfo.youtubeChannelId && !ytSyncConfig.channelId) {
      setYtSyncConfig(prev => ({ ...prev, channelId: rsInfo.youtubeChannelId! }));
    }
  }, [rsInfo.youtubeChannelId]);

  
  const [isSyncingYt, setIsSyncingYt] = useState(false);

  const handleSyncYoutube = async () => {
    setIsSyncingYt(true);
    try {
      // 1. Simpan Channel ID ke database global (rsInfo) agar admin lain bisa lihat
      if (rsInfo.youtubeChannelId !== ytSyncConfig.channelId) {
        setRsInfo(prev => ({ ...prev, youtubeChannelId: ytSyncConfig.channelId }));
      }

      // 2. Lanjutkan proses fetch ke backend seperti biasa
      const res = await fetch(`${API_BASE}/api/social-feed/sync-youtube`, {
        method: 'POST',
        credentials: 'include', 
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ytSyncConfig)
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`✅ Berhasil menarik ${data.count} video terbaru dari YouTube ke database!`);
        const refreshRes = await fetch(`${API_BASE}/api/social-feed`);
        const refreshData = await refreshRes.json();
        if (refreshData.success) setSocialFeeds(refreshData.feeds);
      } else {
        alert(`Gagal sinkronisasi: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      alert('Gagal menghubungi server untuk sinkronisasi YouTube.');
    } finally {
      setIsSyncingYt(false);
    }
  };

  // Deklarasi Base API Dinamis
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (activeMenu === 'FEED_SOSMED') {
      fetch(`${API_BASE}/api/social-feed`)
        .then(res => res.json())
        .then(data => { if (data.success) setSocialFeeds(data.feeds); })
        .catch(e => console.error(e));
    }
  }, [activeMenu, API_BASE]);

  const handleSaveFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFeed(true);
    try {

      const res = await fetch(`${API_BASE}/api/social-feed`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFeed)
      });
      const data = await res.json();
      if (data.success) {
        setSocialFeeds([data.feed, ...socialFeeds]);
        setNewFeed({ platform: 'Youtube', title: '', url: '', desc: '', tag: 'Edukasi' });
        alert('Berhasil! Postingan sudah tayang di halaman depan website.');
      } else {
        alert(data.error || 'Gagal menyimpan');
      }
    } catch (err) {
      alert('Gagal menghubungi server.');
    } finally {
      setIsSavingFeed(false);
    }
  };

  const handleDeleteFeed = async (id: string) => {
    if (await confirmDialog('Hapus postingan ini dari website?')) {
      
      await fetch(`${API_BASE}/api/social-feed/${id}`, { 
        method: 'DELETE',
        // headers: { 'Authorization': `Bearer ${token}` }, // Tunjukkan ke server!
        credentials: 'include'
      });
      setSocialFeeds(socialFeeds.filter(f => f.id !== id));
    }
  };

  // =========================================================================
  // STATE UNTUK ARTIKEL, RBAC, & LISENSI
  // =========================================================================
  const [articles, setArticles] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [deviceLicenses, setDeviceLicenses] = useState<any[]>([]);

  // Form Artikel
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: 'Kesehatan Edukasi', coverImage: '' });
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  
  // Form User Baru
  const [newUser, setNewUser] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    role: 'User',
    permissions: [] as string[] // 👈 TAMBAHKAN INI
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Tarik data saat menu diklik
  useEffect(() => {
    if (!adminSession) return;
    const API_BASE = import.meta.env.VITE_BACKEND_URL;

    if (activeMenu === 'ARTIKEL') {
      fetch(`${API_BASE}/api/articles`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setArticles(Array.isArray(data) ? data : []))
        .catch(e => console.error(e));
    } else if (activeMenu === 'MANAJEMEN_USER' && (adminSession?.role === 'Master' || adminSession?.role === 'SuperUser')) {
      fetch(`${API_BASE}/api/admin/users`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setAdminUsers(Array.isArray(data) ? data : []))
        .catch(e => console.error(e));
    } else if (activeMenu === 'LISENSI_PERANGKAT' && (adminSession?.role === 'Master' || adminSession?.role === 'SuperUser')) {
      fetch(`${API_BASE}/api/admin/devices`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setDeviceLicenses(Array.isArray(data) ? data : []))
        .catch(e => console.error(e));
    }
  }, [activeMenu, adminSession]);

  // Fungsi Simpan Artikel
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    try {
      const isEditing = !!editingArticleId;
      
      const res = await fetch(`${API_BASE}/api/articles${isEditing ? `/${editingArticleId}` : ''}`, {
        method: isEditing ? 'PATCH' : 'POST', 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...newArticle, author: adminSession?.name || 'Admin' })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      if (data.success) {
        if (isEditing) {
          setArticles(articles.map(a => a.id === editingArticleId ? data.article : a));
          alert('Artikel berhasil diperbarui!');
        } else {
          setArticles([data.article, ...articles]);
          alert('Artikel berhasil diterbitkan!');
        }
        setNewArticle({ title: '', content: '', category: 'Kesehatan Edukasi', coverImage: '' });
        setEditingArticleId(null); // Reset mode edit
      }
    } catch (err: any) { 
      alert(`Gagal menyimpan artikel: ${err.message}`); 
    }
  };

  // Tambahkan fungsi hapus artikel ini tepat di bawahnya
  const handleDeleteArticle = async (id: string) => {
    if (!(await confirmDialog('Yakin ingin menghapus artikel ini permanen?'))) return;
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
        alert('Artikel dihapus.');
      }
    } catch (err) { alert('Gagal menghapus artikel.'); }
  };

  // Fungsi ubah gambar lokal ke Base64 untuk Artikel
  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB!"); return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewArticle({ ...newArticle, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi Simpan User Baru (RBAC)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    try {
      const isEditing = !!editingUserId;
      const url = isEditing 
        ? `${API_BASE}/api/admin/users/${editingUserId}` 
        : `${API_BASE}/api/admin/users`;
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST', 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(newUser)
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(isEditing ? 'User berhasil diperbarui!' : 'User berhasil dibuat!');
        fetch(`${API_BASE}/api/admin/users`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => setAdminUsers(Array.isArray(data) ? data : []));
        
        // Reset Form & Mode Edit
        setNewUser({ email: '', password: '', name: '', role: 'User', permissions: [] });
        setEditingUserId(null);
      } else { alert(data.error); }
    } catch (err) { alert('Gagal menyimpan user.'); }
  };

  // Fungsi untuk membuka form Edit
  const handleOpenEditUser = (user: any) => {
    setNewUser({
      email: user.email,
      password: '', // Kosongkan, diisi hanya jika ingin ganti sandi
      name: user.name || '',
      role: user.role,
      permissions: user.permissions || []
    });
    setEditingUserId(user.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas agar form terlihat
  };

  // Fungsi untuk membatalkan Edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewUser({ email: '', password: '', name: '', role: 'User', permissions: [] });
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (email === adminSession.email) {
      return alert('Anda tidak bisa menghapus akun Anda sendiri.');
    }
    if (!(await confirmDialog(`Yakin ingin menghapus akun ${email}?`))) return;
    
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: 'DELETE',
        // headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await res.json();
      
      if (res.ok) {
        setAdminUsers(adminUsers.filter(u => u.id !== id));
        alert('User berhasil dihapus.');
      } else {
        alert(data.error);
      }
    } catch (err) { alert('Gagal menghapus user.'); }
  };

  // Fungsi Toggle Lisensi Perangkat
  const handleToggleLicense = async (id: string) => {
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${API_BASE}/api/admin/devices/${id}/toggle`, { method: 'PATCH', credentials: 'include' });
      if (res.ok) {
        setDeviceLicenses(prev => prev.map(d => d.id === id ? { ...d, isAllowed: !d.isAllowed } : d));
      }
    } catch (e) { alert('Gagal mengubah lisensi.'); }
  };

  // Fungsi Toggle Artikel Publish/Draft
  const handleToggleArticle = async (id: string) => {
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}/toggle`, { method: 'PATCH', credentials: 'include' });
      if (res.ok) {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, isPublished: !a.isPublished } : a));
      }
    } catch (e) { alert('Gagal mengubah status artikel.'); }
  };

  // State untuk Pengaturan Sistem (API Google Review)
  const [apiSettings, setApiSettings] = useState<any[]>([]);
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setApiSettings(data);
        // Inisialisasi form dengan value yang sudah ada (masked)
        const form: Record<string, string> = {};
        data.forEach((s: any) => form[s.key] = s.isSecret ? '' : s.value);
        setSettingsForm(form);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeMenu === 'PENGATURAN_SISTEM') loadSettings();
  }, [activeMenu]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsForm })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Berhasil menyimpan ${data.updated.length} pengaturan.`);
        loadSettings();
      } else {
        alert(data.error);
      }
    } catch (e) { alert('Gagal menyimpan setting.'); }
    finally { setIsSavingSettings(false); }
  };

    // State untuk Audit Log
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchAudit, setSearchAudit] = useState('');

  const loadAuditLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/audit-logs?limit=100&search=${searchAudit}`, { 
        credentials: 'include' 
      });
      if (res.ok) setAuditLogs(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeMenu === 'AUDIT_LOG') loadAuditLogs();
  }, [activeMenu, searchAudit]);
  
  // Forms states
  const [currentDoctor, setCurrentDoctor] = useState<Partial<Doctor>>({});
  const [currentPoly, setCurrentPoly] = useState<Partial<Polyclinic>>({});
  const [currentSpecialist, setCurrentSpecialist] = useState<Partial<Specialist>>({});
  const [partners, setPartners] = useState<any[]>([]);
  const [currentPartner, setCurrentPartner] = useState<any>({});
  const [currentSocial, setCurrentSocial] = useState<Partial<SocialMedia>>({});
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({});

  // Rooms State
  const [rooms, setRooms] = useState<HospitalRoom[]>(() => {
    try {
      const saved = localStorage.getItem('admin_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch (e) {
      console.error('Failed to parse admin_rooms from localStorage:', e);
      return INITIAL_ROOMS;
    }
  });

  const [isKamarSidebarExpanded, setIsKamarSidebarExpanded] = useState(false);
  const [isRawatInapGroupOpen, setIsRawatInapGroupOpen] = useState(true);
  const [isIcuGroupOpen, setIsIcuGroupOpen] = useState(true);
  const [isIgdGroupOpen, setIsIgdGroupOpen] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Partial<HospitalRoom>>({});

  // Selection states for master tables
  const [selectedPolyCode, setSelectedPolyCode] = useState<string | null>(null);
  const [selectedSpecialistCode, setSelectedSpecialistCode] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [selectedSocialId, setSelectedSocialId] = useState<string | null>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  // Lightbox preview for Berita & Pengumuman images
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const announcementInputRef = useRef<HTMLInputElement>(null);

  // Reset pagination when active tab, search term, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeMenu, searchTerm, pageSize]);

  // Reset kotak pencarian setiap ganti tab. Sebelumnya searchTerm dipakai
  // bareng oleh banyak tabel (dokter, spesialis, poliklinik, dll) tanpa
  // pernah di-reset — jadi teks pencarian dari satu tab bisa "nyangkut"
  // dan menyembunyikan data (termasuk data yang baru saja ditambahkan)
  // di tab lain yang tidak cocok dengan teks itu.
  useEffect(() => {
    setSearchTerm('');
  }, [activeMenu]);

  // Sync sidebar submenu collapse states based on activeMenu changes
  useEffect(() => {
    if (activeMenu.startsWith('KPI_')) {
      setIsKpiSidebarExpanded(true);
      setIsKamarSidebarExpanded(false);
    } else if (activeMenu.startsWith('KAMAR_')) {
      setIsKamarSidebarExpanded(true);
      setIsKpiSidebarExpanded(false);
    } else {
      setIsKamarSidebarExpanded(false);
      setIsKpiSidebarExpanded(false);
    }
  }, [activeMenu]);

  // Enforce first menu select on mount and completely bypass global selection/right-click protections
  useEffect(() => {
    setActiveMenu('NAMA_RS');
    
    // Explicitly enable text selection on the body
    document.body.style.userSelect = 'text';
    document.body.style.webkitUserSelect = 'text';
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRsInfo(prev => ({
            ...prev,
            logo: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePolySort = (field: string) => {
    setPolySort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSpecialistSort = (field: string) => {
    setSpecialistSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDoctorSort = (field: string) => {
    setDoctorSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePraktekSort = (field: string) => {
    setPraktekSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Sorted lists
  const sortedPolyclinics = [...polyclinics]
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let fieldA = (a[polySort.field as keyof Polyclinic] || '').toString().toLowerCase();
      let fieldB = (b[polySort.field as keyof Polyclinic] || '').toString().toLowerCase();
      if (fieldA < fieldB) return polySort.direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return polySort.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const sortedSpecialists = [...specialists]
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let fieldA = (a[specialistSort.field as keyof Specialist] || '').toString().toLowerCase();
      let fieldB = (b[specialistSort.field as keyof Specialist] || '').toString().toLowerCase();
      if (fieldA < fieldB) return specialistSort.direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return specialistSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const sortedDoctors = [...doctors]
    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.subSpecialty?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let valA: any;
      let valB: any;
      
      if (doctorSort.field === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else if (doctorSort.field === 'experience') {
        valA = a.experience;
        valB = b.experience;
      } else {
        valA = (a[doctorSort.field as keyof Doctor] || '').toString().toLowerCase();
        valB = (b[doctorSort.field as keyof Doctor] || '').toString().toLowerCase();
      }

      if (valA < valB) return doctorSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return doctorSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const sortedSchedules = [...doctors]
    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let valA: any;
      let valB: any;

      if (praktekSort.field === 'hours') {
        valA = a.schedule.hours.toLowerCase();
        valB = b.schedule.hours.toLowerCase();
      } else if (praktekSort.field === 'subSpecialty') {
        valA = (a.subSpecialty || a.specialty).toLowerCase();
        valB = (b.subSpecialty || b.specialty).toLowerCase();
      } else {
        valA = (a[praktekSort.field as keyof Doctor] || '').toString().toLowerCase();
        valB = (b[praktekSort.field as keyof Doctor] || '').toString().toLowerCase();
      }

      if (valA < valB) return praktekSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return praktekSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Helper to paginate any array
  const paginate = <T,>(items: T[]): { paginatedItems: T[]; totalPages: number; startIdx: number; endIdx: number; totalItems: number } => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const startIdx = (safePage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedItems = items.slice(startIdx, endIdx);
    return { paginatedItems, totalPages, startIdx, endIdx, totalItems };
  };

  const renderPagination = (totalPages: number, startIdx: number, endIdx: number, totalItems: number) => {
    if (totalItems === 0) return null;
    
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return (
      <div className="px-6 py-4 border-t border-divider bg-white flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs shrink-0 select-none">
        <div className="flex items-center space-x-2 text-body-text">
          <span>Tampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-divider rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yasmin-green bg-white font-bold text-body-text cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>data per halaman</span>
        </div>
        
        <div className="text-body-text font-semibold">
          Menampilkan <span className="text-headings">{startIdx + 1}</span> - <span className="text-headings">{Math.min(endIdx, totalItems)}</span> dari <span className="text-headings">{totalItems}</span> data
        </div>
        
        <div className="flex items-center space-x-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 border border-divider rounded-xl hover:bg-soft-mint text-body-text disabled:opacity-50 disabled:hover:bg-white font-bold transition-all cursor-pointer text-[11px]"
          >
            Sebelumnya
          </button>
          
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer text-xs ${
                currentPage === p
                  ? 'bg-yasmin-green text-white shadow-xs'
                  : 'border border-divider text-body-text hover:bg-soft-mint'
              }`}
            >
              {p}
            </button>
          ))}
          
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 border border-divider rounded-xl hover:bg-soft-mint text-body-text disabled:opacity-50 disabled:hover:bg-white font-bold transition-all cursor-pointer text-[11px]"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    );
  };

  // Load initial data
  useEffect(() => {
    if (!adminSession) return;

    const loadData = async () => {
      try {
        isInitialLoadRef.current = true;

        // 1. Hospital Info
        const infoDocRef = doc(db, 'rs_info', 'hospital_info');
        const infoSnap = await getDoc(infoDocRef);
        if (infoSnap.exists()) {
          setRsInfo(infoSnap.data() as HospitalInfo);
        } else {
          await saveDocument('rs_info', 'hospital_info', rsInfo);
        }

        // 2. Polyclinics
        const cloudPolyclinics = await fetchCollection('polyclinics');
        if (cloudPolyclinics.length > 0) {
          setPolyclinics(cloudPolyclinics);
        } else {
          await syncCollectionToCloud('polyclinics', polyclinics);
        }

        // 3. Specialists
        const cloudSpecialists = await fetchCollection('specialists');
        if (cloudSpecialists.length > 0) {
          setSpecialists(cloudSpecialists);
        } else {
          await syncCollectionToCloud('specialists', specialists);
        }

        // 4. Social Media
        const cloudSocial = await fetchCollection('social_media');
        if (cloudSocial.length > 0) {
          setSocialMediaLinks(cloudSocial);
        } else {
          await syncCollectionToCloud('social_media', socialMediaLinks);
        }

        // 5. Announcements
        const cloudAnnouncements = await fetchCollection('announcements');
        if (cloudAnnouncements.length > 0) {
          setAnnouncements(cloudAnnouncements);
        } else {
          await syncCollectionToCloud('announcements', announcements);
        }

        // 6. Rooms
        const cloudRooms = await fetchCollection('rooms');
        if (cloudRooms.length > 0) {
          setRooms(cloudRooms);
        } else {
          await syncCollectionToCloud('rooms', rooms);
        }

        // 7. Doctors
        const cloudDoctors = await fetchCollection('doctors');
        if (cloudDoctors.length === 0 && doctors.length > 0) {
          await syncCollectionToCloud('doctors', doctors);
        }
      } catch (error) {
        console.error("Error loading initial data from Firestore:", error);
      } finally {
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 1200);
      }
    };

    loadData();
  }, [adminSession]);

  // Social Media handlers
  const handleOpenAddSocial = () => {
    setCurrentSocial({ id: 'soc-' + Date.now(), platform: '', url: '', icon: 'Link' });
    setModalType('ADD');
    setIsModalOpen(true);
  };

  const handleOpenEditSocial = (soc: SocialMedia) => {
    setCurrentSocial(soc);
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleDeleteSocial = (id: string) => {
    const item = socialMediaLinks.find(s => s.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'SOCIAL',
      id,
      name: item ? `${item.platform} (${item.url})` : 'sosial media ini'
    });
  };

    const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSocial.platform || !currentSocial.url) return alert('Isi platform dan link URL!');
    try {
      const id = currentSocial.id as string;
      await saveDocument('social_media', id, currentSocial);
      let updated = modalType === 'ADD' ? [...socialMediaLinks, currentSocial as SocialMedia] : socialMediaLinks.map(s => s.id === id ? currentSocial as SocialMedia : s);
      setSocialMediaLinks(updated);
      setIsModalOpen(false);
      alert('Sosial media berhasil disimpan!');
    } catch (err: any) { alert(`Gagal: ${err.message}`); }
  };

  // Announcement handlers
  const handleOpenAddAnnouncement = () => {
    setCurrentAnnouncement({ id: 'ann-' + Date.now(), title: '', image: '', isActive: true, activeDate: '', closeDate: '' });
    setModalType('ADD');
    setIsModalOpen(true);
  };

  const handleOpenEditAnnouncement = (ann: Announcement) => {
    setCurrentAnnouncement({ ...ann });
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const item = announcements.find(a => a.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'ANNOUNCEMENT',
      id,
      name: item ? item.title : 'pengumuman ini'
    });
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnnouncement.image) return alert('Mohon upload gambar!');
    try {
      const id = currentAnnouncement.id as string;
      await saveDocument('announcements', id, currentAnnouncement);
      let updated = modalType === 'ADD' ? [...announcements, currentAnnouncement as Announcement] : announcements.map(a => a.id === id ? currentAnnouncement as Announcement : a);
      setAnnouncements(updated);
      setIsModalOpen(false);
      alert('Pengumuman berhasil disimpan!');
    } catch (err: any) { alert(`Gagal: ${err.message}`); }
  };

  // Room handlers
  const handleOpenAddRoom = (type: 'Rawat Inap' | 'ICU' | 'IGD') => {
    setCurrentRoom({ id: 'room-' + Date.now(), type, name: '', class: '', capacity: 5, occupied: 0, facilities: '' });
    setModalType('ADD');
    setIsModalOpen(true);
  };

  const handleOpenEditRoom = (room: HospitalRoom) => {
    setCurrentRoom({ ...room });
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleOpenEditFacilities = (room: HospitalRoom) => {
    setCurrentRoom({ ...room });
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleDeleteRoom = (id: string) => {
    const item = rooms.find(r => r.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'ROOM',
      id,
      name: item ? `${item.name} (${item.class})` : 'kamar ini'
    });
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom.name || !currentRoom.class) return alert('Isi nama dan kelas kamar!');
    try {
      const id = currentRoom.id as string;
      await saveDocument('rooms', id, currentRoom);
      let updated = modalType === 'ADD' ? [...rooms, currentRoom as HospitalRoom] : rooms.map(r => r.id === id ? currentRoom as HospitalRoom : r);
      setRooms(updated);
      setIsModalOpen(false);
      alert('Data Kamar berhasil disimpan!');
    } catch (err: any) { alert(`Gagal: ${err.message}`); }
  };

  const handleAnnouncementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentAnnouncement(prev => ({
            ...prev,
            image: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Hospital Info
  const handleSaveHospitalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDocument('rs_info', 'hospital_info', rsInfo);
      window.dispatchEvent(new CustomEvent('yasmin_hospital_info_update'));
      alert('Data Profil Rumah Sakit berhasil disimpan ke Database!');
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentDoctor(prev => ({
            ...prev,
            image: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Doctors crud
  const handleOpenAddDoctor = () => {
    setCurrentDoctor({
      id: `doc-${Date.now()}`,
      name: '',
      specialty: 'Kesehatan Keluarga',
      subSpecialty: 'Umum',
      experience: 5,
      rating: 4.8,
      gender: 'Laki-laki',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      bpjs: true,
      schedule: { days: ['Senin', 'Rabu', 'Jumat'], hours: '08:00 - 12:00', quota: 30 },
      bio: '',
      education: '',
      status: 'Aktif',
      gradGradDate: '',
      licenseNumber: '',
      specGradDate: '',
      specLicenseNumber: '',
      joinDate: new Date().toISOString().split('T')[0],
      leaveFromDate: '',
      leaveToDate: ''
    });
    setModalType('ADD');
    setIsModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setCurrentDoctor({ ...doc });
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = (id: string) => {
    const item = doctors.find(d => d.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'DOCTOR',
      id,
      name: item ? item.name : 'data dokter ini'
    });
  };

    const handleSaveDoctor = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentDoctor.name) {
        alert('Nama dokter harus diisi!');
        return;
      }

      try {
        const docId = currentDoctor.id || `doc-${Date.now()}`;
        const doctorToSave = { ...currentDoctor, id: docId };

        // 1. Simpan ke PostgreSQL
        await saveDocument('doctors', docId, doctorToSave);

        // 2. Update state lokal
        let updatedList: Doctor[] = [];
        if (modalType === 'ADD') {
          updatedList = [...doctors, doctorToSave as Doctor];
        } else {
          updatedList = doctors.map(d => d.id === docId ? { ...d, ...doctorToSave } as Doctor : d);
        }

        onUpdateDoctors(updatedList); // <--- GANTI setDoctors MENJADI onUpdateDoctors
                
        alert('Data dokter berhasil disimpan ke database!');
        setIsModalOpen(false);
      } catch (err: any) {
        console.error(err);
        alert(`Gagal menyimpan dokter: ${err.message}`);
      }
    };

  // Poly crud
  const handleOpenAddPoly = () => {
    setCurrentPoly({ code: `POL0${polyclinics.length + 1}`, name: '', status: 'Aktif', activeSinceDate: '', inactiveSinceDate: '' });
    setModalType('ADD');
    setIsModalOpen(true);
  };

  const handleOpenEditPoly = (poly: Polyclinic) => {
    setCurrentPoly({ ...poly });
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleDeletePoly = (code: string) => {
    const item = polyclinics.find(p => p.code === code);
    setDeleteConfirm({
      isOpen: true,
      type: 'POLY',
      id: code,
      name: item ? item.name : 'data polyklinik ini'
    });
  };

    const handleSavePoly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPoly.name) return alert('Nama polyklinik harus diisi!');
    try {
      const code = currentPoly.code as string;
      await saveDocument('polyclinics', code, currentPoly);
      let updatedList = modalType === 'ADD' ? [...polyclinics, currentPoly as Polyclinic] : polyclinics.map(p => p.code === code ? currentPoly as Polyclinic : p);
      setPolyclinics(updatedList);
      setIsModalOpen(false);
      alert('Poliklinik berhasil disimpan!');
    } catch (err: any) { alert(`Gagal: ${err.message}`); }
  };

  // Specialist crud
  const handleOpenAddSpecialist = () => {
    setCurrentSpecialist({ code: `SPS0${specialists.length + 1}`, name: '', description: '' });
    setModalType('ADD');
    setIsModalOpen(true);
  };

  const handleOpenEditSpecialist = (spec: Specialist) => {
    setCurrentSpecialist({ ...spec });
    setModalType('EDIT');
    setIsModalOpen(true);
  };

  const handleDeleteSpecialist = (code: string) => {
    const item = specialists.find(s => s.code === code);
    setDeleteConfirm({
      isOpen: true,
      type: 'SPECIALIST',
      id: code,
      name: item ? item.name : 'data spesialis ini'
    });
  };

  const handleSaveSpecialist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSpecialist.name) return alert('Nama spesialis harus diisi!');
    try {
      const code = currentSpecialist.code as string;
      await saveDocument('specialists', code, currentSpecialist);
      let updatedList = modalType === 'ADD' ? [...specialists, currentSpecialist as Specialist] : specialists.map(s => s.code === code ? currentSpecialist as Specialist : s);
      setSpecialists(updatedList);
      setIsModalOpen(false);
      alert('Spesialis berhasil disimpan!');
    } catch (err: any) { alert(`Gagal: ${err.message}`); }
  };

  const [specialistCategories, setSpecialistCategories] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const loadSpecialistCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/specialist_categories`, { credentials: 'include' });
      if (res.ok) setSpecialistCategories(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    // Load kategori saat awal buka admin atau saat menu Kategori diklik
    loadSpecialistCategories();
  }, [activeMenu]); 

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = currentCategory.id || crypto.randomUUID();
      await saveDocument('specialist_categories', id, currentCategory); // saveDocument otomatis mengirim logActivity ke backend
      alert('Kategori Spesialis berhasil disimpan!');
      setIsCategoryModalOpen(false);
      loadSpecialistCategories();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!(await confirmDialog('Hapus kategori ini? Pastikan tidak ada dokter yang menggunakannya.'))) return;
    try {
      await deleteDocument('specialist_categories', id); // deleteDocument otomatis mengirim logActivity
      loadSpecialistCategories();
    } catch (err: any) { alert(err.message); }
  };

  const loadPartners = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/insurance_partners');
      if (res.ok) setPartners(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeMenu === 'MITRA_PENJAMIN') loadPartners();
  }, [activeMenu]);

  const handleOpenAddPartner = () => {
    setCurrentPartner({ id: '', name: '', type: 'Asuransi' });
    setModalType('ADD'); setIsModalOpen(true);
  };

  const handleOpenEditPartner = (partner: any) => {
    setCurrentPartner({ ...partner });
    setModalType('EDIT'); setIsModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = currentPartner.id || crypto.randomUUID();
      await saveDocument('insurance_partners', id, { ...currentPartner, id });
      alert('Mitra berhasil disimpan!');
      setIsModalOpen(false);
      loadPartners();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeletePartner = async (id: string) => {
    if (!(await confirmDialog('Hapus mitra ini?'))) return;
    try {
      await deleteDocument('insurance_partners', id);
      loadPartners();
    } catch (err: any) { alert(err.message); }
  };

    const [banks, setBanks] = useState<any[]>([]);
  const [currentBank, setCurrentBank] = useState<any>({});
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const loadBanks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/banks`, { credentials: 'include' });
      if (res.ok) setBanks(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeMenu === 'METODE_PEMBAYARAN') loadBanks();
  }, [activeMenu]);

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!currentBank.id;
    try {
      const res = await fetch(`${API_BASE}/api/admin/banks${isEdit ? `/${currentBank.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBank)
      });
      if (res.ok) {
        alert('Data bank berhasil disimpan!');
        setIsBankModalOpen(false);
        loadBanks();
      }
    } catch (err) { alert('Gagal menyimpan bank.'); }
  };

  const handleDeleteBank = async (id: string) => {
    if (!(await confirmDialog('Hapus rekening bank ini?'))) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/banks/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) loadBanks();
    } catch (err) { alert('Gagal menghapus bank.'); }
  };

  const isSidebarExpanded = !isSidebarCollapsed || isSidebarHovered;

  const selectMenuAndScroll = (menuKey: ActiveMenu) => {
    setActiveMenu(menuKey);
    setSearchTerm('');
    
    // Disempurnakan: Otomatis menciutkan sidebar ke mode ikon untuk SEMUA menu
    // agar area kerja dashboard menjadi lebih luas dan leluasa.
    if (!isSidebarCollapsed && window.innerWidth >= 1024) {
      setIsSidebarCollapsed(true);
    }
    
    // Kelola ekspansi submenu jika memilih menu KPI atau Kamar
    if (menuKey.startsWith('KPI_')) {
      setIsKpiSidebarExpanded(true);
      setIsKamarSidebarExpanded(false);
      setTimeout(() => {
        const element = document.getElementById('sidebar-menu-KPI');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      setIsKpiSidebarExpanded(false);
      if (menuKey.startsWith('KAMAR_')) {
        setIsKamarSidebarExpanded(true);
      } else {
        setIsKamarSidebarExpanded(false);
      }
      setTimeout(() => {
        const element = document.getElementById(`sidebar-menu-${menuKey}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  // LAYAR LOGIN (JIKA BELUM MASUK)
  if (!adminSession) {
    return (
      <div className="fixed inset-0 z-[99999] bg-warm-ivory flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 border border-divider">
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#0B4F4A] to-[#147970] rounded-2xl flex items-center justify-center mx-auto shadow-inner text-white">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-display font-black text-headings">Admin Master Portal</h2>
            <p className="text-xs text-body-text">Sistem Manajemen RS Yasmin Terpadu</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-body-text block mb-1">Email Kredensial</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full p-3 bg-soft-mint border border-divider rounded-xl text-sm focus:ring-2 focus:ring-headings outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-body-text block mb-1">Kata Sandi</label>
              <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full p-3 bg-soft-mint border border-divider rounded-xl text-sm focus:ring-2 focus:ring-headings outline-none" />
            </div>
            {loginError && <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg text-center">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full py-3.5 bg-[#0B4F4A] hover:bg-[#0E625C] text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
              {isLoggingIn ? 'Memverifikasi...' : 'Masuk ke Portal'}
            </button>
          </form>
          <button onClick={onClose} className="w-full mt-4 text-xs text-gray-400 font-bold hover:text-body-text transition-colors">← Kembali ke Website</button>
        </div>
      </div>
    );
  }

  if (isDetecting) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-teal-950 text-white font-sans selection:bg-teal-800">
        <div className="max-w-md w-full px-6 py-8 bg-teal-900/40 rounded-2xl border border-teal-800/60 shadow-2xl backdrop-blur-md text-center animate-fade-in">
          
          {/* Logo with pulsating effect */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-deep-teal/20 rounded-full blur-xl animate-pulse" />
            <SafeImage 
              src={rsInfo.logo || logoRsYasmin} 
              fallbackSrc={logoRsYasmin}
              alt="Logo" 
              className="relative h-20 w-20 object-contain mx-auto bg-white rounded-full p-2 border-2 border-teal-400 shadow-md"
            />
          </div>

          <h2 className="text-xl font-display font-black uppercase tracking-wider text-warm-orange mb-1">
            {rsInfo.name || "RS YASMIN BANYUWANGI"}
          </h2>
          <p className="text-xs text-teal-300 font-semibold tracking-widest uppercase mb-8">
            Admin Portal Diagnostic &amp; Optimization
          </p>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-mono text-teal-300 mb-2">
              <span className="font-semibold">MENGANALISIS SISTEM...</span>
              <span className="font-bold text-warm-orange">{detectionProgress}%</span>
            </div>
            <div className="w-full bg-teal-950/60 h-3 rounded-full overflow-hidden border border-teal-800 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-warm-orange rounded-full transition-all duration-300 ease-out"
                style={{ width: `${detectionProgress}%` }}
              />
            </div>
          </div>

          {/* Diagnostic Steps */}
          <div className="text-left space-y-3 font-mono text-xs text-teal-100 bg-teal-950/40 p-4 rounded-xl border border-teal-900/60 max-h-60 overflow-y-auto">
            {detectionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {step.status === 'success' ? (
                    <span className="text-emerald-400 font-bold">[ OK ]</span>
                  ) : step.status === 'loading' ? (
                    <span className="text-warm-orange font-bold animate-pulse">[ .. ]</span>
                  ) : (
                    <span className="text-deep-teal font-bold">[ WAITING ]</span>
                  )}
                  <span className={`${step.status === 'success' ? 'text-teal-200' : step.status === 'loading' ? 'text-white font-medium' : 'text-deep-teal'}`}>
                    {step.label}
                  </span>
                </div>
                {step.value && (
                  <span className="text-warm-orange font-semibold text-right max-w-[150px] truncate">
                    {step.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-teal-400/80 mt-6 font-mono">
            Memuat standardisasi visual &amp; layout komponen...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="fixed inset-0 z-[99999] flex bg-soft-mint text-headings font-sans h-[100dvh] w-full overflow-hidden selection:bg-teal-200 selection:text-headings">
      <style>{`
        /* Standardized System Styles based on OS/Browser/Resolution Detection */
        #admin-dashboard-container {
          font-family: ${systemFont}, system-ui, -apple-system, sans-serif !important;
          font-size: ${systemFontSize} !important;
        }
        #admin-dashboard-container button,
        #admin-dashboard-container input,
        #admin-dashboard-container select,
        #admin-dashboard-container textarea {
          font-family: ${systemFont}, system-ui, -apple-system, sans-serif !important;
        }
        #admin-dashboard-container .p-6 {
          padding: ${systemPadding} !important;
        }

        /* Screen styling: hide print elements */
        .print-header {
          display: none !important;
        }

        @media print {
          @page {
            margin-top: 2.2cm;
            margin-bottom: 1.8cm;
            margin-left: 1.2cm;
            margin-right: 1.2cm;
          }
          .print-header {
            position: fixed !important;
            top: -1.7cm !important;
            left: 0 !important;
            right: 0 !important;
            height: 1.5cm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-bottom: 2px solid #0d9488 !important; /* border-deep-teal */
            padding-bottom: 6px !important;
            font-family: sans-serif !important;
            background-color: white !important;
            z-index: 9999 !important;
          }
          .print-page-num::after {
            content: counter(page) !important;
          }
          
          /* Hide non-printable elements */
          .print\\:hidden, aside, #admin-sidebar, header, .print-hidden, button, .btn, input, select, .no-print {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            opacity: 0 !important;
            visibility: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          /* Reset container for standard page flow */
          #admin-dashboard-container, body, html {
            position: static !important;
            height: auto !important;
            min-height: auto !important;
            width: 100% !important;
            overflow: visible !important;
            display: block !important;
            background: white !important;
          }
          main {
            position: static !important;
            height: auto !important;
            width: 100% !important;
            overflow: visible !important;
            display: block !important;
            padding: 0.4cm 0 0 0 !important; /* Space so it does not overlap with fixed top header */
            background: white !important;
          }
          /* Ensure all inner scroll areas are fully expanded in print */
          .overflow-y-auto, .overflow-x-auto, .overflow-hidden {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          /* Keep grid structure and flex layouts for WYSIWYG */
          .grid {
            display: grid !important;
          }
          .flex {
            display: flex !important;
          }
          /* Retain background colors, gradients, and text colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          /* Prevent page-breaks in important section blocks */
          .animate-fade-in {
            opacity: 1 !important;
            transform: none !important;
          }
          footer, .max-w-5xl, .card, .bg-white, section {
            page-break-inside: avoid !important;
          }
          /* Table print fixes */
          table {
            page-break-inside: auto;
            width: 100% !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
      
      {/* SIDEBAR & HOVER TRIGGER AREA */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsSidebarCollapsed(true)}
      />

      {/* Area pemicu hover di tepi kiri layar desktop */}
      <div 
        className="hidden lg:block fixed left-0 top-0 bottom-0 w-4 z-40"
        onMouseEnter={() => setIsSidebarHovered(true)}
      />

      <aside 
        id="admin-sidebar"
        className={`${
          isSidebarExpanded 
            ? 'translate-x-0 w-80' 
            : '-translate-x-full w-0 lg:w-80 lg:-translate-x-[calc(100%-12px)]'
        } absolute lg:fixed inset-y-0 left-0 z-50 bg-headings text-white flex flex-col shrink-0 border-r border-teal-800 shadow-2xl transition-all duration-300 h-full print:hidden overflow-hidden`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        
        {/* Brand header */}
        <div className="p-4 border-b border-teal-900 flex items-center justify-between bg-teal-950 h-20 overflow-hidden">
          <div className="flex items-center space-x-3">
            <SafeImage 
              src={rsInfo.logo || logoRsYasmin} 
              fallbackSrc={logoRsYasmin}
              alt="RS Yasmin Logo" 
              className="h-12 w-12 object-contain bg-white rounded-full p-1 border-2 border-teal-800 shrink-0"
            />
            {isSidebarExpanded && (
              <div className="animate-fade-in">
                <h1 className="font-display font-black text-sm tracking-wider text-warm-ivory uppercase leading-tight max-w-[170px] truncate">
                  {rsInfo.name || "RS YASMIN"}
                </h1>
                <p className="text-[9px] text-warm-mint/60 uppercase tracking-widest font-mono">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Menus */}
        <div id="admin-sidebar-nav-container" className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
          
          {/* Relocated Kembali ke Website button at top */}
          <div className="px-1.5 pb-2 border-b border-teal-900/40">
            <button
              onClick={onClose}
              title="Kembali ke Website"
              className={`w-full flex items-center justify-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'p-3'} bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold tracking-wider transition-all shadow-md active:scale-95 cursor-pointer`}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {isSidebarExpanded && <span className="truncate">Kembali ke Website</span>}
            </button>
          </div>

          <div>
            {isSidebarExpanded && (
              <div className="text-[10px] font-bold text-teal-300 tracking-widest uppercase px-3 mb-3 font-mono">
                Main Data Master
              </div>
            )}
            
                        <nav className="space-y-1.5">
              
              {/* 1. GRUP MASTER DATA (Poli, Dokter, Kamar) */}
              {hasAccess('MENU_MASTER_DATA') && (
                <>
                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('NAMA_RS')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'NAMA_RS' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Building className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Identitas</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('DATA_POLY')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'DATA_POLY' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <ClipboardList className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Data Poliklinik</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('DATA_SPESIALIS')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'DATA_SPESIALIS' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Award className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Data Spesialis</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('KATEGORI_SPESIALIS')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'KATEGORI_SPESIALIS' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50'
                    }`}
                  >
                    <Layers className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Kategori Spesialis</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('DATA_DOKTER')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'DATA_DOKTER' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Users className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Data Dokter</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('DATA_PRAKTEK')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'DATA_PRAKTEK' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Calendar className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Data Praktek Dokter</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('MITRA_PENJAMIN')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'MITRA_PENJAMIN' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Mitra Penjamin</span>}
                  </button>

                                    <button
                    type="button"
                    onClick={() => selectMenuAndScroll('METODE_PEMBAYARAN')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'METODE_PEMBAYARAN' ? 'bg-warm-orange text-headings shadow-md font-bold' : 'text-teal-100 hover:bg-teal-900/50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Metode Pembayaran</span>}
                  </button>

                  {/* Collapsible Kamar Rawat */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !isKamarSidebarExpanded;
                        setIsKamarSidebarExpanded(nextVal);
                        if (nextVal) setIsKpiSidebarExpanded(false);
                      }}
                      className={`w-full flex items-center justify-between ${isSidebarExpanded ? 'px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all ${
                        activeMenu.startsWith('KAMAR_') || isKamarSidebarExpanded ? 'text-white font-bold bg-teal-900/40' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Bed className="h-5 w-5 shrink-0" />
                        {isSidebarExpanded && <span className="truncate">Kamar Rawat</span>}
                      </div>
                      {isSidebarExpanded && (isKamarSidebarExpanded ? <ChevronDown className="h-4 w-4 text-teal-300" /> : <ChevronRight className="h-4 w-4 text-teal-300" />)}
                    </button>
                    
                    {isKamarSidebarExpanded && isSidebarExpanded && (
                      <div className="pl-4 space-y-1 border-l border-teal-800 ml-6 py-1">
                        <button onClick={() => selectMenuAndScroll('KAMAR_RAWAT_INAP')} className={`w-full text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-all flex items-center space-x-2.5 ${activeMenu === 'KAMAR_RAWAT_INAP' ? 'bg-warm-orange text-headings shadow-xs font-bold' : 'text-teal-100 hover:bg-teal-900/30 hover:text-white font-normal'}`}>
                          <BedDouble className={`h-4 w-4 shrink-0 ${activeMenu === 'KAMAR_RAWAT_INAP' ? 'text-headings' : 'text-teal-300'}`} />
                          <span>Rawat Inap</span>
                        </button>
                        <button onClick={() => selectMenuAndScroll('KAMAR_ICU')} className={`w-full text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-all flex items-center space-x-2.5 ${activeMenu === 'KAMAR_ICU' ? 'bg-warm-orange text-headings shadow-xs font-bold' : 'text-teal-100 hover:bg-teal-900/30 hover:text-white font-normal'}`}>
                          <HeartPulse className={`h-4 w-4 shrink-0 ${activeMenu === 'KAMAR_ICU' ? 'text-headings' : 'text-indigo-300'}`} />
                          <span>ICU</span>
                        </button>
                        <button onClick={() => selectMenuAndScroll('KAMAR_IGD')} className={`w-full text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-all flex items-center space-x-2.5 ${activeMenu === 'KAMAR_IGD' ? 'bg-warm-orange text-headings shadow-xs font-bold' : 'text-teal-100 hover:bg-teal-900/30 hover:text-white font-normal'}`}>
                          <Siren className={`h-4 w-4 shrink-0 ${activeMenu === 'KAMAR_IGD' ? 'text-headings' : 'text-rose-300'}`} />
                          <span>IGD</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 2. GRUP KONTEN WEB (Artikel, Sosmed, Berita) */}
              {hasAccess('MENU_CONTENT') && (
                <>
                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('SOSIAL_MEDIA')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'SOSIAL_MEDIA' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Share2 className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Sosial Media</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('FEED_SOSMED')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'FEED_SOSMED' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Layers className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Kelola Postingan Web</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('BERITA')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'BERITA' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Megaphone className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Berita & Pengumuman</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('ARTIKEL')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'ARTIKEL' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <Newspaper className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Kelola Artikel / Blog</span>}
                  </button>
                </>
              )}

              {/* 3. MENU ULASAN GOOGLE */}
              {hasAccess('MENU_REVIEWS') && (
                <button
                  type="button"
                  onClick={() => selectMenuAndScroll('ULASAN_GOOGLE')}
                  className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                    activeMenu === 'ULASAN_GOOGLE' ? 'bg-warm-orange text-headings shadow-md scale-[1.02] font-bold' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                  }`}
                >
                  <Star className="h-5 w-5 shrink-0 text-amber-300 fill-current" />
                  {isSidebarExpanded && <span className="truncate">Ulasan Google Maps</span>}
                </button>
              )}

              {/* 4. MENU LAPORAN PASIEN (MENGGUNAKAN HASACCESS) */}
              {hasAccess('MENU_PATIENT_FEEDBACK') && (
                <button
                  type="button"
                  onClick={() => selectMenuAndScroll('LAPORAN_PASIEN')}
                  className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                    activeMenu === 'LAPORAN_PASIEN' ? 'bg-warm-orange text-headings font-bold shadow-md' : 'text-teal-100 hover:bg-teal-900/50'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  {isSidebarExpanded && <span className="truncate">Laporan Pasien</span>}
                </button>
              )}

              {/* 5. MENU KPI (MENGGUNAKAN HASACCESS) */}
              {hasAccess('MENU_KPI') && (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !isKpiSidebarExpanded;
                      setIsKpiSidebarExpanded(nextVal);
                      if (nextVal) setIsKamarSidebarExpanded(false);
                    }}
                    className={`w-full flex items-center justify-between ${isSidebarExpanded ? 'px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all ${
                      activeMenu.startsWith('KPI_') || isKpiSidebarExpanded ? 'text-white font-bold bg-teal-900/40' : 'text-teal-100 hover:bg-teal-900/50 hover:text-white font-normal'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 shrink-0" />
                      {isSidebarExpanded && <span className="truncate">Menu KPI</span>}
                    </div>
                    {isSidebarExpanded && (isKpiSidebarExpanded ? <ChevronDown className="h-4 w-4 text-teal-300" /> : <ChevronRight className="h-4 w-4 text-teal-300" />)}
                  </button>
                  
                  {isKpiSidebarExpanded && isSidebarExpanded && (
                    <div className="pl-4 space-y-1 border-l border-teal-800 ml-6 py-1">
                    {[
                      { id: 'KPI_RAWAT_JALAN', name: 'Rawat Jalan', Icon: Stethoscope, iconColor: 'text-emerald-400' },
                      { id: 'KPI_RAWAT_INAP', name: 'Rawat Inap', Icon: BedDouble, iconColor: 'text-teal-400' },
                      { id: 'KPI_IGD', name: 'IGD', Icon: Siren, iconColor: 'text-rose-400' },
                      { id: 'KPI_ICU', name: 'ICU', Icon: HeartPulse, iconColor: 'text-indigo-400' },
                      { id: 'KPI_HCU', name: 'HCU', Icon: Thermometer, iconColor: 'text-sky-400' },
                      { id: 'KPI_NICU', name: 'NICU', Icon: Baby, iconColor: 'text-pink-400' },
                      { id: 'KPI_PICU', name: 'PICU', Icon: Baby, iconColor: 'text-purple-400' },
                      { id: 'KPI_PERINATOLOGI', name: 'Perinatologi', Icon: Baby, iconColor: 'text-yellow-400' },
                      { id: 'KPI_KAMAR_OPERASI', name: 'Kamar Operasi (OK)', Icon: Scissors, iconColor: 'text-red-400' },
                      { id: 'KPI_CSSD', name: 'CSSD', Icon: ShieldCheck, iconColor: 'text-cyan-400' },
                      { id: 'KPI_HEMODIALISA', name: 'Hemodialisa', Icon: Droplet, iconColor: 'text-amber-400' },
                      { id: 'KPI_MCU', name: 'MCU', Icon: ClipboardCheck, iconColor: 'text-emerald-400' },
                      { id: 'KPI_REHABILITASI_MEDIK', name: 'Rehabilitasi Medik', Icon: Accessibility, iconColor: 'text-indigo-400' },
                      { id: 'KPI_HOME_CARE', name: 'Home Care', Icon: Home, iconColor: 'text-blue-400' },
                      { id: 'KPI_AMBULANCE', name: 'Ambulance', Icon: Truck, iconColor: 'text-orange-400' },
                      { id: 'KPI_BED_MANAGEMENT', name: 'Bed Management', Icon: LayoutGrid, iconColor: 'text-teal-400' },
                      { id: 'KPI_ANTRIAN', name: 'Antrian', Icon: Clock, iconColor: 'text-sky-400' },
                      { id: 'KPI_RUJUKAN_PASIEN', name: 'Rujukan Pasien', Icon: Send, iconColor: 'text-purple-400' },
                      { id: 'KPI_ANALISA_RUJUKAN', name: 'Analisa Rujukan', Icon: LineChart, iconColor: 'text-violet-400' },
                      { id: 'KPI_KINERJA_PELAYANAN', name: 'Kinerja Pelayanan', Icon: Star, iconColor: 'text-rose-400' }
                    ].map((sub) => {
                      const SubIcon = sub.Icon;
                      const isActive = activeMenu === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => selectMenuAndScroll(sub.id as any)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-all flex items-center space-x-2.5 ${
                            isActive ? 'bg-warm-orange text-headings shadow-xs font-bold' : 'text-teal-100 hover:bg-teal-900/30 hover:text-white font-normal'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-headings' : sub.iconColor}`} />
                          <span className="truncate">{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              )}

              {/* 6. KHUSUS MASTER & SUPERUSER: RBAC & LISENSI */}
              {(adminSession.role === 'Master' || adminSession.role === 'SuperUser') && (
                <div className="pt-4 mt-2 border-t border-teal-800 space-y-1.5">
                  <div className="text-[9px] font-bold text-teal-400 uppercase tracking-widest px-3 font-mono mb-2">Keamanan Sistem</div>
                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('MANAJEMEN_USER')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'MANAJEMEN_USER' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-rose-200 hover:bg-rose-900/50'
                    }`}
                  >
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Hak Akses (RBAC)</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('LISENSI_PERANGKAT')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'LISENSI_PERANGKAT' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-rose-200 hover:bg-rose-900/50'
                    }`}
                  >
                    <MonitorSmartphone className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Lisensi Perangkat</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('PENGATURAN_SISTEM')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'PENGATURAN_SISTEM' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-rose-200 hover:bg-rose-900/50'
                    }`}
                  >
                    <KeyRound className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Pengaturan API</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectMenuAndScroll('AUDIT_LOG')}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer ${
                      activeMenu === 'AUDIT_LOG' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-rose-200 hover:bg-rose-900/50'
                    }`}
                  >
                    <Activity className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Audit Log</span>}
                  </button>
                </div>
              )}

              {/* 7. TOMBOL PINTAS LOKET (Khusus Admin Pendaftaran) */}
              {hasAccess('MENU_PENDAFTARAN') && (
                <div className="pt-4 mt-2 border-t border-teal-800">
                  <button
                    type="button"
                    onClick={() => window.location.href = '/admin/pendaftaran'}
                    className={`w-full flex items-center ${isSidebarExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-sm tracking-wide transition-all cursor-pointer bg-emerald-600 text-white font-bold shadow-md hover:bg-emerald-700`}
                  >
                    <Users className="h-5 w-5 shrink-0" />
                    {isSidebarExpanded && <span className="truncate">Buka Layar Loket</span>}
                  </button>
                </div>
              )}

            </nav>
          </div>

        </div>

        {/* Fixed Sidebar Footer */}
        <div className={`p-2.5 border-t border-teal-900 bg-teal-950 flex items-center text-teal-300 shrink-0 select-none overflow-x-auto [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full max-w-full lg:hidden ${isSidebarExpanded ? 'justify-around' : 'justify-start space-x-1.5 px-2'}`}>
          <button
            type="button"
            onClick={() => selectMenuAndScroll('NAMA_RS')}
            title="Identitas"
            className={`p-2 rounded-lg hover:bg-teal-900 hover:text-white transition-all cursor-pointer shrink-0 relative ${
              activeMenu === 'NAMA_RS' ? 'bg-teal-900 text-warm-orange' : ''
            }`}
          >
            <Building className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => selectMenuAndScroll('DATA_POLY')}
            title="Data Poliklinik"
            className={`p-2 rounded-lg hover:bg-teal-900 hover:text-white transition-all cursor-pointer shrink-0 relative ${
              activeMenu === 'DATA_POLY' ? 'bg-teal-900 text-warm-orange' : ''
            }`}
          >
            <ClipboardList className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => selectMenuAndScroll('DATA_DOKTER')}
            title="Data Dokter"
            className={`p-2 rounded-lg hover:bg-teal-900 hover:text-white transition-all cursor-pointer shrink-0 relative ${
              activeMenu === 'DATA_DOKTER' ? 'bg-teal-900 text-warm-orange' : ''
            }`}
          >
            <Users className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => selectMenuAndScroll('DATA_PRAKTEK')}
            title="Data Praktek Dokter"
            className={`p-2 rounded-lg hover:bg-teal-900 hover:text-white transition-all cursor-pointer shrink-0 relative ${
              activeMenu === 'DATA_PRAKTEK' ? 'bg-teal-900 text-warm-orange' : ''
            }`}
          >
            <Calendar className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => selectMenuAndScroll('KPI_RAWAT_JALAN')}
            title="KPI Rawat Jalan"
            className={`p-2 rounded-lg hover:bg-teal-900 hover:text-white transition-all cursor-pointer shrink-0 relative ${
              activeMenu.startsWith('KPI_') ? 'bg-teal-900 text-warm-orange' : ''
            }`}
          >
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>

      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-soft-mint overflow-hidden h-full">
        
        {/* PRINT HEADER FOR ALL PAGES */}
        <div className="print-header hidden">
          <div className="flex items-center space-x-3">
            <SafeImage 
              src={rsInfo.logo || logoRsYasmin} 
              fallbackSrc={logoRsYasmin}
              alt="Logo RS" 
              className="h-10 w-10 object-contain bg-white rounded-full p-1 border border-teal-900 shrink-0" 
            />
            <div>
              <h1 className="font-display font-black text-xs text-teal-950 uppercase tracking-wide leading-none">
                {rsInfo.name || "RS Yasmin Banyuwangi"}
              </h1>
              <p className="text-[8px] text-body-text font-semibold leading-tight max-w-sm mt-1">
                {rsInfo.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <h2 className="font-bold text-xs text-teal-800 uppercase tracking-wide leading-none">
                {adminSession.name} <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded ml-1">{adminSession.role}</span>
              </h2>
            </div>
            {/* TOMBOL KELUAR YANG JELAS DAN MENCOLOK */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer border-none"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
        
        {/* Header bar */}
        <header className="h-20 bg-white border-b border-divider px-4 md:px-8 flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-warm-ivory text-teal-800 hover:text-teal-950 rounded-xl transition-all cursor-pointer focus:outline-none"
              title={isSidebarCollapsed ? "Kunci Sidebar" : "Auto-Hide Sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-display font-bold text-xl text-headings tracking-tight">
                {activeMenu === 'NAMA_RS' && 'Pengaturan Master Identitas'}
                {activeMenu === 'DATA_POLY' && 'Master Data Poliklinik'}
                {activeMenu === 'DATA_SPESIALIS' && 'Master Data Spesialisasi'}
                {activeMenu === 'DATA_DOKTER' && 'Master Data Dokter'}
                {activeMenu === 'DATA_PRAKTEK' && 'Jadwal Praktek Dokter'}
                {activeMenu === 'SOSIAL_MEDIA' && 'Master Sosial Media'}
                {activeMenu === 'BERITA' && 'Master Berita & Pengumuman'}
                {activeMenu === 'KAMAR_RAWAT_INAP' && 'Master Kamar Rawat Inap'}
                {activeMenu === 'KAMAR_ICU' && 'Master Kamar ICU'}
                {activeMenu === 'KAMAR_IGD' && 'Master Kamar IGD'}
                {activeMenu === 'FEED_SOSMED' && 'Manajemen Konten Postingan Sosmed'}
                {activeMenu === 'ARTIKEL' && 'Manajemen Artikel & Blog Kesehatan'}
                {activeMenu === 'MANAJEMEN_USER' && 'Hak Akses & Manajemen User (RBAC)'}
                {activeMenu === 'LISENSI_PERANGKAT' && 'Kontrol Keamanan Lisensi Perangkat'}
                {activeMenu === 'KPI_RAWAT_JALAN' && 'Dashboard KPI Rawat Jalan'}
                {activeMenu === 'KPI_RAWAT_INAP' && 'Dashboard KPI Rawat Inap'}
                {activeMenu === 'KPI_IGD' && 'Dashboard KPI IGD'}
                {activeMenu === 'KPI_ICU' && 'Dashboard KPI ICU'}
                {activeMenu === 'KPI_HCU' && 'Dashboard KPI HCU'}
                {activeMenu === 'KPI_NICU' && 'Dashboard KPI NICU'}
                {activeMenu === 'KPI_PICU' && 'Dashboard KPI PICU'}
                {activeMenu === 'KPI_PERINATOLOGI' && 'Dashboard KPI Perinatologi'}
                {activeMenu === 'KPI_KAMAR_OPERASI' && 'Dashboard KPI Kamar Operasi (OK)'}
                {activeMenu === 'KPI_CSSD' && 'Dashboard KPI CSSD'}
                {activeMenu === 'KPI_HEMODIALISA' && 'Dashboard KPI Hemodialisa'}
                {activeMenu === 'KPI_MCU' && 'Dashboard KPI MCU'}
                {activeMenu === 'KPI_REHABILITASI_MEDIK' && 'Dashboard KPI Rehabilitasi Medik'}
                {activeMenu === 'KPI_HOME_CARE' && 'Dashboard KPI Home Care'}
                {activeMenu === 'KPI_AMBULANCE' && 'Dashboard KPI Ambulance'}
                {activeMenu === 'KPI_BED_MANAGEMENT' && 'Dashboard KPI Bed Management'}
                {activeMenu === 'KPI_ANTRIAN' && 'Dashboard KPI Antrian'}
                {activeMenu === 'KPI_RUJUKAN_PASIEN' && 'Dashboard KPI Rujukan Pasien'}
                {activeMenu === 'KPI_ANALISA_RUJUKAN' && 'Dashboard KPI Analisa Rujukan'}
                {activeMenu === 'KPI_KINERJA_PELAYANAN' && 'Dashboard KPI Kinerja Pelayanan'}
              </h2>
              <p className="text-xs text-body-text mt-0.5 hidden sm:block">Kelola informasi data master secara dinamis dan real-time.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 print:hidden">
            
            {/* SINKRON MASTER DARI SIMRS */}
            {(adminSession?.role === 'Master' || adminSession?.role === 'SuperUser') && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSimrsSync}
                  disabled={simrsSyncLoading}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60"
                  title="Tarik master data (poli, dokter, spesialis, kamar) dari SIMRS"
                >
                  {simrsSyncLoading ? 'Menyinkronkan...' : 'Sync Master SIMRS'}
                </button>
                {simrsSyncFeedback && (
                  <span className="text-[10px] text-gray-500 max-w-[240px] leading-tight">{simrsSyncFeedback}</span>
                )}
              </div>
            )}

            {/* INFO AKUN LOGIN (NAMA & ROLE) */}
            <div className="text-right hidden md:block mr-2 border-r border-divider pr-4">
              <h2 className="font-bold text-xs text-teal-900 uppercase tracking-wide leading-none">
                {adminSession?.name || 'Admin'}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold mt-1.5 inline-block uppercase tracking-wider ${
                adminSession?.role === 'Master' ? 'bg-purple-100 text-purple-700' :
                adminSession?.role === 'SuperUser' ? 'bg-rose-100 text-rose-700' :
                'bg-blue-100 text-yasmin-green'
              }`}>
                {adminSession?.role || 'User'}
              </span>
            </div>

            <span className="text-[10px] text-gray-400 max-w-[180px] leading-tight text-right hidden xl:inline-block">
              💡 Buka tab baru jika cetak tidak aktif di iframe preview
            </span>

            <button
              type="button"
              onClick={() => {
                const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
                if (isInIframe) {
                  setShowPrintWarning(true);
                } else {
                  try {
                    window.print();
                  } catch (e) {
                    alert("Gagal memicu cetak. Silakan gunakan tombol 'Open in new tab' di pojok kanan atas preview untuk mencetak.");
                  }
                }
              }}
              className="flex items-center space-x-2 bg-deep-teal hover:bg-deep-teal text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer border-none"
              title="Cetak halaman / Simpan PDF"
            >
              <Printer className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            
            <span className="text-xs bg-teal-100 text-teal-800 px-3 py-2 sm:py-2.5 rounded-xl font-bold uppercase tracking-wider font-mono hidden lg:inline-block border border-deep-teal">
              Connected
            </span>

            {/* TOMBOL LOGOUT MERAH */}
            <button 
              onClick={handleLogout} 
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer border-none"
              title="Keluar dari Akun"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">Keluar</span>
            </button>

          </div>
        </header>

        {/* Tab/Menu Content */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between min-h-0">
          <div className="p-8 flex-1 space-y-8">
          
          {/* 1. NAMA RS MENU */}
          {activeMenu === 'NAMA_RS' && (
            <div className="space-y-8 w-full animate-fade-in">
              <div className="w-full bg-white border border-divider rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
              <div className="flex items-center space-x-3 border-b border-divider pb-5 mb-6">
                <Building className="h-6 w-6 text-yasmin-green" />
                <h3 className="font-display font-bold text-lg text-gray-850">Informasi Profil Instansi Rumah Sakit</h3>
              </div>

              <form onSubmit={handleSaveHospitalInfo} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* LOGO RS FIELD */}
                  <div className="col-span-1 md:col-span-2 flex flex-col items-center p-6 bg-soft-mint rounded-2xl border-2 border-dashed border-divider space-y-4">
                    <span className="text-xs font-bold text-body-text uppercase tracking-wider font-mono">Logo Resmi Rumah Sakit</span>
                    
                    {/* Logo display preview */}
                    <div className="h-24 w-auto min-w-[120px] max-w-[240px] px-4 py-2 bg-white rounded-xl shadow-sm border border-divider flex items-center justify-center relative group">
                      {rsInfo.logo || logoRsYasmin ? (
                        <SafeImage 
                          src={rsInfo.logo || logoRsYasmin} 
                          fallbackSrc={logoRsYasmin}
                          alt="Logo Preview" 
                          className="h-16 w-auto object-contain" 
                        />
                      ) : (
                        <div className="h-16 w-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Logo Upload action button */}
                    <div className="flex space-x-2 font-sans">
                      <input 
                        type="file" 
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button 
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Pilih File Logo</span>
                      </button>
                      
                      {rsInfo.logo && (
                        <button 
                          type="button"
                          onClick={() => setRsInfo(prev => {
                            const updated = { ...prev };
                            delete updated.logo;
                            return updated;
                          })}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-200"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-body-text uppercase tracking-wider">Nama Rumah Sakit</label>
                    <input 
                      type="text" 
                      value={rsInfo.name}
                      onChange={(e) => setRsInfo({ ...rsInfo, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent text-sm"
                      placeholder="Masukkan nama Rumah Sakit"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-body-text uppercase tracking-wider">Alamat Lengkap</label>
                    <textarea 
                      rows={3}
                      value={rsInfo.address}
                      onChange={(e) => setRsInfo({ ...rsInfo, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent text-sm"
                      placeholder="Alamat instansi lengkap..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-body-text uppercase tracking-wider">Telepon Kantor</label>
                    <input 
                      type="text" 
                      value={rsInfo.phone}
                      onChange={(e) => setRsInfo({ ...rsInfo, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent text-sm font-mono"
                      placeholder="0333-xxxxxx"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-body-text uppercase tracking-wider">WhatsApp Service</label>
                    <input 
                      type="text" 
                      value={rsInfo.whatsapp}
                      onChange={(e) => setRsInfo({ ...rsInfo, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent text-sm font-mono"
                      placeholder="+62 8xx xxxx"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-body-text uppercase tracking-wider">Email Resmi</label>
                    <input 
                      type="email" 
                      value={rsInfo.email}
                      onChange={(e) => setRsInfo({ ...rsInfo, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent text-sm"
                      placeholder="email@rsyasmin.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-body-text uppercase tracking-wider">Status Akreditasi</label>
                    <input 
                      type="text" 
                      value={rsInfo.accreditation}
                      onChange={(e) => setRsInfo({ ...rsInfo, accreditation: e.target.value })}
                      className="w-full px-4 py-2.5 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent text-sm"
                      placeholder="Status Akreditasi Kemenkes"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-divider flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-sm transition-all flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Check className="h-4.5 w-4.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>

            <DatabaseExportManager 
              rsInfo={rsInfo}
              polyclinics={polyclinics}
              specialists={specialists}
              socialMediaLinks={socialMediaLinks}
              announcements={announcements}
              rooms={rooms}
              doctors={doctors}
            />
          </div>
          )}

          {/* 2. DATA POLYKLINIK */}
          {activeMenu === 'DATA_POLY' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari poliklinik..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleOpenAddPoly}
                  className="px-4 py-2 bg-yasmin-green hover:bg-deep-teal text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Poliklinik</span>
                </button>
              </div>

              {(() => {
                const { paginatedItems: polyPages, totalPages: polyTotalPages, startIdx: polyStart, endIdx: polyEnd, totalItems: polyTotal } = paginate(sortedPolyclinics);
                return (
                  <>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-2 text-center w-12 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th 
                              onClick={() => handlePolySort('code')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Kode Poli</span>
                                <span className="text-[10px] text-gray-400">{polySort.field === 'code' ? (polySort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th 
                              onClick={() => handlePolySort('name')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Nama Poliklinik</span>
                                <span className="text-[10px] text-gray-400">{polySort.field === 'name' ? (polySort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th 
                              onClick={() => handlePolySort('status')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Status Layanan</span>
                                <span className="text-[10px] text-gray-400">{polySort.field === 'status' ? (polySort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aktif Sejak</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Pasif Sejak</th>
                            <th className="px-4 py-2 text-right sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-sm">
                          {polyPages.map((poly, idx) => {
                            const isSelected = selectedPolyCode === poly.code;
                            return (
                              <tr 
                                key={poly.code} 
                                onClick={() => setSelectedPolyCode(isSelected ? null : poly.code)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-2 text-center font-mono text-xs text-gray-450 font-bold">{polyStart + idx + 1}</td>
                                <td className="px-4 py-2 font-mono font-bold text-yasmin-green">{poly.code}</td>
                                <td className="px-4 py-2 font-semibold text-headings">{poly.name}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    poly.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {poly.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-xs font-mono text-body-text">{poly.activeSinceDate || '-'}</td>
                                <td className="px-4 py-2 text-xs font-mono text-body-text">{poly.inactiveSinceDate || '-'}</td>
                                <td className="px-4 py-2 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleOpenEditPoly(poly)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePoly(poly.code)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(polyTotalPages, polyStart, polyEnd, polyTotal)}
                  </>
                );
              })()}
            </div>
          )}

          {/* 3. DATA SPESIALIS */}
          {activeMenu === 'DATA_SPESIALIS' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari spesialisasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleOpenAddSpecialist}
                  className="px-4 py-2 bg-yasmin-green hover:bg-deep-teal text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Spesialis</span>
                </button>
              </div>

              {(() => {
                const { paginatedItems: specPages, totalPages: specTotalPages, startIdx: specStart, endIdx: specEnd, totalItems: specTotal } = paginate(sortedSpecialists);
                return (
                  <>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-2 text-center w-12 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th 
                              onClick={() => handleSpecialistSort('code')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Kode Spesialis</span>
                                <span className="text-[10px] text-gray-400">{specialistSort.field === 'code' ? (specialistSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th 
                              onClick={() => handleSpecialistSort('name')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Nama Spesialisasi</span>
                                <span className="text-[10px] text-gray-400">{specialistSort.field === 'name' ? (specialistSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Keterangan / Fokus</th>
                            <th className="px-4 py-2 text-right sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-sm">
                          {specPages.map((spec, idx) => {
                            const isSelected = selectedSpecialistCode === spec.code;
                            return (
                              <tr 
                                key={spec.code} 
                                onClick={() => setSelectedSpecialistCode(isSelected ? null : spec.code)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-2 text-center font-mono text-xs text-gray-450 font-bold">{specStart + idx + 1}</td>
                                <td className="px-4 py-2 font-mono font-bold text-yasmin-green">{spec.code}</td>
                                <td className="px-4 py-2 font-semibold text-headings">{spec.name}</td>
                                <td className="px-4 py-2 text-body-text">{spec.description}</td>
                                <td className="px-4 py-2 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleOpenEditSpecialist(spec)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteSpecialist(spec.code)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(specTotalPages, specStart, specEnd, specTotal)}
                  </>
                );
              })()}
            </div>
          )}

          {activeMenu === 'KATEGORI_SPESIALIS' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-divider flex justify-between items-center bg-teal-50/20">
                <div>
                  <h3 className="font-display font-bold text-headings text-base">Master Kategori Spesialis</h3>
                  <p className="text-xs text-body-text">Kategori ini akan muncul di pilihan form Dokter dan filter website.</p>
                </div>
                <button 
                  onClick={() => { setCurrentCategory({ id: '', name: '' }); setIsCategoryModalOpen(true); }}
                  className="px-4 py-2 bg-yasmin-green text-white rounded-xl text-sm font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> <span>Tambah Kategori</span>
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-soft-mint border-b border-divider text-xs text-body-text uppercase">
                  <tr>
                    <th className="px-6 py-4">Nama Kategori Spesialis</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {specialistCategories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-headings">{cat.name}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => { setCurrentCategory(cat); setIsCategoryModalOpen(true); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. DATA DOKTER */}
          {activeMenu === 'DATA_DOKTER' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari dokter atau keahlian..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button 
                    onClick={handleOpenAddDoctor}
                    className="px-4 py-2 bg-yasmin-green hover:bg-deep-teal text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>Tambah Dokter Baru</span>
                  </button>
                  {onSyncSystemDoctors && (
                    <button 
                      onClick={onSyncSystemDoctors}
                      title="Sinkronisasi seluruh data foto & sistem terbaru tanpa menghapus dokter kustom"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 shadow-xs hover:shadow-sm"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Sinkronisasi Foto & Sistem</span>
                    </button>
                  )}
                  {onResetSystemDoctors && (
                    <button 
                      onClick={onResetSystemDoctors}
                      title="Mengatur ulang seluruh daftar dokter kembali ke database bawaan sistem"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 shadow-xs hover:shadow-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset Bawaan</span>
                    </button>
                  )}
                </div>
              </div>

              {(() => {
                const { paginatedItems: docPages, totalPages: docTotalPages, startIdx: docStart, endIdx: docEnd, totalItems: docTotal } = paginate(sortedDoctors);
                return (
                  <>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                      <table className="w-full text-left border-collapse min-w-[1600px]">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-2 text-center w-12 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Foto</th>
                            <th 
                              onClick={() => handleDoctorSort('name')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)] min-w-[350px]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Nama Lengkap</span>
                                <span className="text-[10px] text-gray-400">{doctorSort.field === 'name' ? (doctorSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th 
                              onClick={() => handleDoctorSort('specialty')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Kategori Spesialis</span>
                                <span className="text-[10px] text-gray-400">{doctorSort.field === 'specialty' ? (doctorSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th 
                              onClick={() => handleDoctorSort('subSpecialty')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Polyclinic</span>
                                <span className="text-[10px] text-gray-400">{doctorSort.field === 'subSpecialty' ? (doctorSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Jenis Kelamin</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Spesialis (Kustom)</th>
                            <th 
                              onClick={() => handleDoctorSort('rating')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Rating & Pengalaman</span>
                                <span className="text-[10px] text-gray-400">{doctorSort.field === 'rating' ? (doctorSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Melayani BPJS</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Hari Praktek</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Jam Praktek</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Info Kelulusan & Izin SIP</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Pendidikan Terakhir</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Bio Singkat</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Join Date</th>
                            <th 
                              onClick={() => handleDoctorSort('status')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Status</span>
                                <span className="text-[10px] text-gray-400">{doctorSort.field === 'status' ? (doctorSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 text-right sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-sm">
                          {docPages.map((doc, idx) => {
                            const isSelected = selectedDoctorId === doc.id;
                            return (
                              <tr 
                                key={doc.id} 
                                onClick={() => setSelectedDoctorId(isSelected ? null : doc.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-2 text-center font-mono text-xs text-gray-450 font-bold">{docStart + idx + 1}</td>
                                <td className="px-4 py-1.5" onClick={(e) => {
                                  e.stopPropagation();
                                  if (doc.image) setPreviewImage({ src: doc.image, title: doc.name });
                                }}>
                                  <div className="h-9 w-9 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 border-2 border-divider shadow-xs hover:scale-110 transition-all cursor-zoom-in">
                                    <SafeImage 
                                      src={doc.image} 
                                      alt={doc.name} 
                                      className="h-full w-full object-contain"
                                    />
                                  </div>
                                </td>
                                <td className="px-4 py-2 min-w-[350px]">
                                  <div className="font-semibold text-headings text-xs">{doc.name}</div>
                                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{doc.id.toUpperCase()}</div>
                                </td>
                                <td className="px-4 py-2 text-xs">
                                  <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                                    {doc.specialty}
                                  </span>
                                </td>
                                <td className="px-4 py-2 font-semibold text-body-text text-xs">{doc.subSpecialty || '-'}</td>
                                <td className="px-4 py-2 text-xs">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    doc.gender === 'Perempuan'
                                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                                      : 'bg-sky-50 text-sky-600 border-sky-200'
                                  }`}>
                                    {doc.gender || 'Laki-laki'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 font-medium text-body-text text-xs">{doc.speciali || '-'}</td>
                                <td className="px-4 py-2 text-xs">
                                  <div className="text-headings font-semibold">★ {doc.rating.toFixed(2)}</div>
                                  <div className="text-[10px] text-gray-400">{doc.experience} Tahun Pengalaman</div>
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    doc.bpjs 
                                      ? 'bg-soft-mint text-yasmin-green border-yasmin-green' 
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}>
                                    {doc.bpjs ? 'Melayani BPJS' : 'Non-BPJS'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-xs text-body-text">
                                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                                    {doc.schedule?.days?.map(day => (
                                      <span key={day} className="bg-warm-ivory text-headings text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                                        {day}
                                      </span>
                                    )) || '-'}
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-xs font-mono font-medium text-body-text">
                                  {doc.schedule?.hours || '-'}
                                </td>
                                <td className="px-4 py-2 text-xs text-body-text">
                                  <div className="space-y-1">
                                    <div>
                                      <span className="font-semibold text-[10px] text-body-text block">DOKTER UMUM</span>
                                      {doc.gradGradDate ? `Lulus: ${doc.gradGradDate}` : '-'}
                                      {doc.licenseNumber && <span className="block font-mono text-[9px] text-teal-800 bg-teal-50/70 px-1 py-0.5 rounded mt-0.5 w-max">SIP: {doc.licenseNumber}</span>}
                                    </div>
                                    {(doc.specGradDate || doc.specLicenseNumber) && (
                                      <div className="border-t border-divider pt-1 mt-1">
                                        <span className="font-semibold text-[10px] text-body-text block">SPESIALIS</span>
                                        {doc.specGradDate ? `Lulus: ${doc.specGradDate}` : '-'}
                                        {doc.specLicenseNumber && <span className="block font-mono text-[9px] text-indigo-800 bg-indigo-50/70 px-1 py-0.5 rounded mt-0.5 w-max">SIP: {doc.specLicenseNumber}</span>}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-xs">
                                  <span className="text-xs text-body-text font-semibold max-w-[150px] truncate block" title={doc.education}>
                                    {doc.education || '-'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-xs">
                                  <span className="text-xs text-body-text italic max-w-[150px] truncate block" title={doc.bio}>
                                    {doc.bio || '-'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-xs font-mono font-bold text-body-text">{doc.joinDate || '-'}</td>
                                <td className="px-4 py-2 text-xs">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    doc.status === 'Libur' 
                                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                      : doc.status === 'Cuti'
                                        ? 'bg-indigo-100 text-indigo-800 border-deep-teal'
                                        : doc.status === 'Ijin'
                                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                                          : doc.status === 'Berhenti' 
                                            ? 'bg-rose-100 text-rose-800 border-rose-200' 
                                            : 'bg-emerald-100 text-emerald-800 border-yasmin-green'
                                  }`}>
                                    {doc.status || 'Aktif'}
                                  </span>
                                  {(doc.status === 'Libur' || doc.status === 'Cuti' || doc.status === 'Ijin') && doc.leaveFromDate && (
                                    <span className="block text-[9px] font-semibold text-amber-800 mt-1 font-mono leading-tight bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                      {doc.leaveFromDate} s/d {doc.leaveToDate || '?'}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleOpenEditDoctor(doc)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteDoctor(doc.id)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(docTotalPages, docStart, docEnd, docTotal)}
                  </>
                );
              })()}
            </div>
          )}

          {/* 5. DATA PRAKTEK DOKTER */}
          {activeMenu === 'DATA_PRAKTEK' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari dokter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent"
                  />
                </div>
              </div>

              {(() => {
                const { paginatedItems: prakPages, totalPages: prakTotalPages, startIdx: prakStart, endIdx: prakEnd, totalItems: prakTotal } = paginate(sortedSchedules);
                return (
                  <>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                      <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-2 text-center w-12 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th 
                              onClick={() => handlePraktekSort('name')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)] min-w-[350px]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Dokter</span>
                                <span className="text-[10px] text-gray-400">{praktekSort.field === 'name' ? (praktekSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th 
                              onClick={() => handlePraktekSort('subSpecialty')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Poli / Spesialis</span>
                                <span className="text-[10px] text-gray-400">{praktekSort.field === 'subSpecialty' ? (praktekSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Hari Praktek</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Jam Pelayanan</th>
                            <th className="px-4 py-2 text-center font-bold text-xs sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Quota</th>
                            <th className="px-4 py-2 text-center font-bold text-xs sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Terpakai</th>
                            <th className="px-4 py-2 text-center font-bold text-xs sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Sisa</th>
                            <th 
                              onClick={() => handlePraktekSort('status')}
                              className="px-4 py-2 cursor-pointer hover:bg-warm-ivory transition-colors sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Status Praktek</span>
                                <span className="text-[10px] text-gray-400">{praktekSort.field === 'status' ? (praktekSort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
                              </div>
                            </th>
                            <th className="px-4 py-2 text-right font-bold text-xs sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-sm">
                          {prakPages.map((doc, idx) => {
                            const isSelected = selectedDoctorId === doc.id;
                            const quotaVal = doc.schedule && doc.schedule.quota !== undefined ? doc.schedule.quota : 30;
                            const terpakaiVal = bookings.filter((b: any) => b.selectedDoctorId === doc.id).length;
                            const sisaVal = quotaVal - terpakaiVal;
                            return (
                              <tr 
                                key={`praktek-${doc.id}`} 
                                onClick={() => setSelectedDoctorId(isSelected ? null : doc.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-2 text-center font-mono text-xs text-gray-450 font-bold">{prakStart + idx + 1}</td>
                                <td className="px-4 py-2 min-w-[350px]">
                                  <div className="font-semibold text-headings text-xs">{doc.name}</div>
                                </td>
                                <td className="px-4 py-2">
                                  <span className="text-xs bg-warm-ivory text-headings font-bold px-2 py-0.5 rounded-full">
                                    {doc.subSpecialty || doc.specialty}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-wrap gap-1">
                                    {doc.schedule.days.map((day, dIdx) => (
                                      <span key={dIdx} className="bg-teal-50 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {day}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-2 font-mono text-xs font-semibold text-body-text">
                                  {doc.schedule.hours}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span className="font-mono text-xs font-bold text-body-text bg-warm-ivory px-2.5 py-1 rounded-lg">
                                    {quotaVal}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span className="font-mono text-xs font-bold text-deep-teal bg-teal-50 px-2.5 py-1 rounded-lg">
                                    {terpakaiVal}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${sisaVal > 5 ? 'text-yasmin-green bg-soft-mint' : 'text-rose-700 bg-rose-50'}`}>
                                    {sisaVal}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    doc.status === 'Libur' 
                                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                      : doc.status === 'Cuti'
                                        ? 'bg-indigo-100 text-indigo-800 border-deep-teal'
                                        : doc.status === 'Ijin'
                                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                                          : doc.status === 'Berhenti' 
                                            ? 'bg-rose-100 text-rose-800 border-rose-200' 
                                            : 'bg-emerald-100 text-emerald-800 border-yasmin-green'
                                  }`}>
                                    {doc.status || 'Aktif'}
                                  </span>
                                  {(doc.status === 'Libur' || doc.status === 'Cuti' || doc.status === 'Ijin') && doc.leaveFromDate && (
                                    <span className="block text-[9px] font-semibold text-amber-800 mt-1 font-mono leading-tight bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                      {doc.leaveFromDate} s/d {doc.leaveToDate || '?'}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleOpenEditDoctor(doc)}
                                    className="px-2.5 py-1 bg-indigo-50 text-deep-teal hover:bg-indigo-100 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer"
                                  >
                                    Edit Jadwal
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(prakTotalPages, prakStart, prakEnd, prakTotal)}
                  </>
                );
              })()}
            </div>
          )}

          {/* 6. MITRA PENJAMIN */}
          {activeMenu === 'MITRA_PENJAMIN' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex justify-between items-center bg-teal-50/20">
                <div>
                  <h3 className="font-display font-bold text-headings text-base">Master Mitra Penjamin</h3>
                  <p className="text-xs text-body-text">Kelola daftar Asuransi Swasta dan Perusahaan Rekanan.</p>
                </div>
                <button onClick={handleOpenAddPartner} className="px-4 py-2 bg-yasmin-green text-white rounded-xl text-sm font-bold flex items-center space-x-2">
                  <Plus className="h-4.5 w-4.5" /> <span>Tambah Mitra</span>
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-soft-mint border-b border-divider text-xs text-body-text uppercase">
                  <tr>
                    <th className="px-4 py-3">Nama Mitra</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-sm">
                  {partners.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-soft-mint/50">
                      <td className="px-4 py-3 font-semibold">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.type === 'Asuransi' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => handleOpenEditPartner(p)} className="p-1 text-deep-teal hover:bg-warm-ivory rounded"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeletePartner(p.id)} className="p-1 text-rose-600 hover:bg-warm-ivory rounded"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'METODE_PEMBAYARAN' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-divider flex justify-between items-center bg-teal-50/20">
                <div>
                  <h3 className="font-display font-bold text-headings text-base">Rekening Bank Resmi</h3>
                  <p className="text-xs text-body-text">Daftar rekening yang akan tampil di halaman pembayaran pasien.</p>
                </div>
                <button 
                  onClick={() => { setCurrentBank({ bankName: '', accountNumber: '', accountHolder: '', isActive: true }); setIsBankModalOpen(true); }}
                  className="px-4 py-2 bg-yasmin-green text-white rounded-xl text-sm font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> <span>Tambah Bank</span>
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-soft-mint border-b border-divider text-xs text-body-text uppercase">
                  <tr>
                    <th className="px-6 py-4">Nama Bank</th>
                    <th className="px-6 py-4">Nomor Rekening</th>
                    <th className="px-6 py-4">Atas Nama</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-sm">
                  {banks.map(bank => (
                    <tr key={bank.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-headings">{bank.bankName}</td>
                      <td className="px-6 py-4 font-mono font-bold text-yasmin-green">{bank.accountNumber}</td>
                      <td className="px-6 py-4 text-gray-600">{bank.accountHolder}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${bank.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {bank.isActive ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => { setCurrentBank(bank); setIsBankModalOpen(true); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteBank(bank.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. MASTER SOSIAL MEDIA */}
          {activeMenu === 'SOSIAL_MEDIA' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari sosial media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleOpenAddSocial}
                  className="px-4 py-2 bg-yasmin-green hover:bg-deep-teal text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Sosial Media</span>
                </button>
              </div>

              {(() => {
                const filteredSoc = socialMediaLinks.filter(s => 
                  s.platform.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  s.url.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const { paginatedItems: socPages, totalPages: socTotalPages, startIdx: socStart, endIdx: socEnd, totalItems: socTotal } = paginate<SocialMedia>(filteredSoc);
                return (
                  <>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-2 text-center w-12 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Platform</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">URL Link</th>
                            <th className="px-4 py-2 text-right sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-sm">
                          {socPages.map((soc, idx) => {
                            const isSelected = selectedSocialId === soc.id;
                            return (
                              <tr 
                                key={soc.id} 
                                onClick={() => setSelectedSocialId(isSelected ? null : soc.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-2 text-center font-mono text-xs text-gray-450 font-bold">{socStart + idx + 1}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center space-x-2.5">
                                    <span className="p-1.5 bg-warm-ivory rounded-lg text-yasmin-green">
                                      <Globe className="h-4 w-4" />
                                    </span>
                                    <span className="font-semibold text-headings text-xs">{soc.platform}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2 font-mono text-xs text-deep-teal hover:underline" onClick={(e) => e.stopPropagation()}>
                                  <a href={soc.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                                    <span>{soc.url}</span>
                                    <Link className="h-3 w-3" />
                                  </a>
                                </td>
                                <td className="px-4 py-2 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleOpenEditSocial(soc)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteSocial(soc.id)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredSoc.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-xs">
                                Belum ada data sosial media. Klik "Tambah" untuk menambahkan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(socTotalPages, socStart, socEnd, socTotal)}
                  </>
                );
              })()}
            </div>
          )}

          {/* ========================================== */}
          {/* 8. FEED POSTINGAN KE WEBSITE */}
          {/* ========================================== */}
          {activeMenu === 'FEED_SOSMED' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* PANEL 1: YOUTUBE AUTO-POOLER (BARU) */}
              <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-5">
                <div className="flex items-center space-x-3 border-b border-divider pb-4">
                  <div className="p-2.5 bg-red-50 text-emergency rounded-xl">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-850">YouTube Auto-Pooler (Otomatis)</h3>
                    <p className="text-xs text-body-text">Tarik otomatis daftar video terbaru dari channel YouTube resmi tanpa perlu input satu per satu.</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end bg-soft-mint p-5 rounded-2xl border border-divider">
                  <div className="space-y-1 flex-1 w-full">
                    <label className="text-[11px] font-bold text-body-text uppercase">Channel Username / ID</label>
                    <input 
                      type="text" 
                      value={ytSyncConfig.channelId}
                      onChange={(e) => setYtSyncConfig({...ytSyncConfig, channelId: e.target.value})}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-red-500 font-mono"
                      placeholder="Contoh: @YasminHospitalTV"
                    />
                  </div>
                  <div className="space-y-1 w-full md:w-48">
                    <label className="text-[11px] font-bold text-body-text uppercase">Tarik Berapa Video?</label>
                    <select 
                      value={ytSyncConfig.limit}
                      onChange={(e) => setYtSyncConfig({...ytSyncConfig, limit: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-red-500 font-bold bg-white"
                    >
                      <option value={3}>3 Video Terakhir</option>
                      <option value={5}>5 Video Terakhir</option>
                      <option value={10}>10 Video Terakhir</option>
                      <option value={15}>15 Video Terakhir</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleSyncYoutube}
                    disabled={isSyncingYt}
                    className="w-full md:w-auto px-6 py-2 bg-emergency hover:bg-emergency disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
                  >
                    <RefreshCw className={`h-4.5 w-4.5 ${isSyncingYt ? 'animate-spin' : ''}`} />
                    <span>{isSyncingYt ? 'Menarik Data...' : 'Sinkronkan Sekarang'}</span>
                  </button>
                </div>
              </div>

              {/* PANEL 2: MANUAL INPUT & TABEL */}
              <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                
                <div className="flex items-center space-x-3 border-b border-divider pb-4">
                  <div className="p-2.5 bg-teal-50 text-deep-teal rounded-xl">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-850">Input Manual Platform Lain</h3>
                    <p className="text-xs text-body-text">Gunakan form ini untuk menambahkan postingan dari Instagram, TikTok, atau Facebook.</p>
                  </div>
                </div>

                {/* FORM INPUT MANUAL BAWAAN ANDA */}
                <form onSubmit={handleSaveFeed} className="space-y-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase">Platform Sosial Media</label>
                      <select required value={newFeed.platform} onChange={(e) => setNewFeed({...newFeed, platform: e.target.value})} className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green">
                        <option value="Instagram">Instagram</option>
                        <option value="Tiktok">TikTok</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Youtube">YouTube (Manual)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase">Topik / Kategori Postingan</label>
                      <select required value={newFeed.tag} onChange={(e) => setNewFeed({...newFeed, tag: e.target.value})} className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green">
                        <option value="Edukasi">Edukasi Kesehatan</option>
                        <option value="Fasilitas">Fasilitas / Layanan Baru</option>
                        <option value="Ibu & Anak">Ibu & Anak</option>
                        <option value="Jantung">Kesehatan Jantung</option>
                        <option value="Penyakit Dalam">Penyakit Dalam</option>
                        <option value="Komunitas">Kegiatan Komunitas (Baksos)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase">Link / URL Postingan Asli</label>
                    <input type="url" required placeholder="Contoh: https://www.instagram.com/p/xxxxx" value={newFeed.url} onChange={(e) => setNewFeed({...newFeed, url: e.target.value})} className="w-full px-4 py-2 border border-divider rounded-xl text-sm font-mono focus:ring-2 focus:ring-yasmin-green" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase">Judul Postingan (Opsional)</label>
                    <input 
                      type="text" 
                      // Hapus 'required' dan ubah placeholder
                      placeholder="Kosongkan untuk otomatis ambil dari TikTok/YouTube..." 
                      value={newFeed.title} 
                      onChange={(e) => setNewFeed({...newFeed, title: e.target.value})} 
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase">Deskripsi / Keterangan (Opsional)</label>
                    <textarea 
                      rows={2} 
                      // Hapus 'required'
                      placeholder="Kosongkan untuk keterangan default..." 
                      value={newFeed.desc} 
                      onChange={(e) => setNewFeed({...newFeed, desc: e.target.value})} 
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green" 
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={isSavingFeed} className="px-6 py-2.5 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm">
                      {isSavingFeed ? 'Menyimpan...' : 'Tambahkan Manual'}
                    </button>
                  </div>
                </form>

                {/* TABEL RIWAYAT POSTINGAN BAWAAN ANDA */}
                <div className="pt-6 border-t border-divider">
                  <h4 className="font-bold text-body-text text-sm mb-3">Daftar Postingan yang Sedang Tayang</h4>
                  <div className="overflow-x-auto border border-divider rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-soft-mint border-b border-divider text-body-text">
                        <tr>
                          <th className="px-4 py-3">Platform</th>
                          <th className="px-4 py-3">Judul & Topik</th>
                          <th className="px-4 py-3">Tanggal Tampil</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-divider">
                        {socialFeeds.map(f => (
                          <tr key={f.id} className="hover:bg-soft-mint">
                            <td className="px-4 py-3 font-bold text-deep-teal">{f.platform}</td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-headings">{f.title}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">#{f.tag}</div>
                            </td>
                            <td className="px-4 py-3 text-body-text">{f.dateStr}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => handleDeleteFeed(f.id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-bold transition-all cursor-pointer">
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 9. MASTER BERITA & PENGUMUMAN */}
          {activeMenu === 'BERITA' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/40">
                <div>
                  <h5 className="font-display font-bold text-headings text-sm flex items-center space-x-2">
                    <Megaphone className="h-4 w-4 text-amber-500" />
                    <span>Master Berita & Pengumuman</span>
                  </h5>
                  <p className="text-[11px] text-body-text mt-1 max-w-xl leading-relaxed">
                    Setiap file berita/pengumuman/gambar yang diupload di sini akan muncul otomatis sebagai popup selamat datang (welcoming slideshow modal) ketika pengunjung pertama kali membuka beranda rumah sakit.
                  </p>
                </div>
                <button 
                  onClick={handleOpenAddAnnouncement}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Pengumuman</span>
                </button>
              </div>

              {(() => {
                const { paginatedItems: annPages, totalPages: annTotalPages, startIdx: annStart, endIdx: annEnd, totalItems: annTotal } = paginate<Announcement>(announcements);
                return (
                  <>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-2 text-center w-12 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Banner / Gambar</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Judul Pengumuman</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Mulai Tampil</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Sampai Tampil</th>
                            <th className="px-4 py-2 sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Status Tampil</th>
                            <th className="px-4 py-2 text-right sticky top-0 z-10 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-sm">
                          {annPages.map((ann, idx) => {
                            const isSelected = selectedAnnouncementId === ann.id;
                            return (
                              <tr 
                                key={ann.id} 
                                onClick={() => setSelectedAnnouncementId(isSelected ? null : ann.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-2 text-center font-mono text-xs text-gray-450 font-bold">{annStart + idx + 1}</td>
                                <td className="px-4 py-1.5" onClick={(e) => {
                                  e.stopPropagation();
                                  if (ann.image) setPreviewImage({ src: ann.image, title: ann.title || "Pengumuman" });
                                }}>
                                  <div className="h-10 w-20 rounded-lg overflow-hidden border border-divider bg-warm-ivory flex items-center justify-center cursor-zoom-in hover:scale-105 transition-all" title="Klik untuk memperbesar gambar">
                                    {ann.image ? (
                                      <SafeImage 
                                        src={ann.image} 
                                        alt={ann.title || "Announcement"} 
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[9px] text-gray-400">No Image</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2 font-semibold text-headings text-xs">
                                  {ann.title || <span className="text-gray-400 italic font-normal">Tanpa Judul</span>}
                                </td>
                                <td className="px-4 py-2 font-mono text-xs text-body-text">
                                  {ann.activeDate || '-'}
                                </td>
                                <td className="px-4 py-2 font-mono text-xs text-body-text">
                                  {ann.closeDate || '-'}
                                </td>
                                <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      const updated = announcements.map(a => a.id === ann.id ? { ...a, isActive: !a.isActive } : a);
                                      setAnnouncements(updated);
                                    }}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                      ann.isActive 
                                        ? 'bg-emerald-100 text-emerald-800 border-yasmin-green hover:bg-emerald-200' 
                                        : 'bg-warm-ivory text-headings border-divider hover:bg-gray-200'
                                    }`}
                                  >
                                    {ann.isActive ? 'Aktif (Tampil)' : 'Nonaktif'}
                                  </button>
                                </td>
                                <td className="px-4 py-2 text-right text-xs space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleOpenEditAnnouncement(ann)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAnnouncement(ann.id)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {announcements.length === 0 && (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">
                                Belum ada pengumuman berita yang diupload. Klik "Tambah" untuk mengupload.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(annTotalPages, annStart, annEnd, annTotal)}
                  </>
                );
              })()}
            </div>
          )}

          {/* 10. MASTER & KURASI ULASAN GOOGLE MAPS */}
          {activeMenu === 'ULASAN_GOOGLE' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden animate-fade-in space-y-6 p-6">
              
              {/* Header Card & Tombol Sinkronisasi */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🌟</span>
                    <h3 className="font-display font-bold text-base text-white">Kurasi Ulasan Google Maps RS Yasmin</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Klik tombol sinkronisasi untuk menarik ulasan bintang & komentar riil terbaru dari Google Maps. Anda bisa memilih ulasan mana saja yang layak ditampilkan di website.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleSyncFromGoogle}
                    disabled={isSyncingGmaps}
                    className="px-4 py-2.5 bg-yasmin-green hover:bg-yasmin-green disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSyncingGmaps ? 'animate-spin' : ''}`} />
                    <span>{isSyncingGmaps ? 'Menyinkronkan...' : '🔄 Sinkronkan Ulasan Google Maps'}</span>
                  </button>
                  {/* Tombol Bersihkan Database */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (await confirmDialog('Hapus seluruh ulasan lama di database agar bersih dari duplikat?')) {
                        const { clearAllGoogleReviews } = await import('../lib/googleReviewsService');
                        await clearAllGoogleReviews();
                        await loadGoogleReviews();
                        alert('Database ulasan berhasil dibersihkan!');
                      }
                    }}
                    className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    🗑️ Reset &amp; Bersihkan
                  </button>
                </div>
              </div>

              {gmapsSyncMsg && (
                <div className="p-3 bg-soft-mint border border-yasmin-green rounded-xl text-xs text-emerald-800 font-bold animate-fade-in">
                  {gmapsSyncMsg}
                </div>
              )}

              {/* Tabel Kurasi Ulasan */}
              <div className="border border-divider rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                  {/* BARIS FILTER ULASAN */}
                  <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-divider shadow-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-gray-500">Tampilkan:</label>
                      <select 
                        value={filterLimit} 
                        onChange={(e) => setFilterLimit(e.target.value)}
                        className="p-2 border border-divider rounded-lg text-xs font-bold focus:ring-2 focus:ring-yasmin-green cursor-pointer"
                      >
                        <option value="5">5 Ulasan</option>
                        <option value="10">10 Ulasan</option>
                        <option value="15">15 Ulasan</option>
                        <option value="100">Semua Ulasan</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-gray-500">Waktu:</label>
                      <select 
                        value={filterDatePreset} 
                        onChange={(e) => setFilterDatePreset(e.target.value)}
                        className="p-2 border border-divider rounded-lg text-xs font-bold focus:ring-2 focus:ring-yasmin-green cursor-pointer"
                      >
                        <option value="all">Semua Waktu</option>
                        <option value="1_month">1 Bulan Terakhir</option>
                        <option value="3_months">3 Bulan Terakhir</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-gray-500">Bintang:</label>
                      <select 
                        value={filterRating} 
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="p-2 border border-divider rounded-lg text-xs font-bold focus:ring-2 focus:ring-yasmin-green cursor-pointer"
                      >
                        <option value="">Semua Bintang</option>
                        <option value="5">Hanya 5 Bintang</option>
                        <option value="4">Hanya 4 Bintang</option>
                        <option value="3">Hanya 3 Bintang</option>
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-soft-mint border-b border-divider text-body-text font-bold uppercase tracking-wider font-mono">
                        <th className="py-3 px-4 w-12 text-center">No.</th>
                        <th className="py-3 px-4">Pengulas (Google Account)</th>
                        <th className="py-3 px-4 text-center">Bintang</th>
                        <th className="py-3 px-4">Waktu Ulasan</th>
                        <th className="py-3 px-4 max-w-md">Komentar Asli Pasien</th>
                        <th className="py-3 px-4 text-center">Tampilkan di Web</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {googleReviewsList.map((rev, idx) => (
                        <tr key={rev.id || idx} className="hover:bg-soft-mint/70 transition-colors">
                          <td className="py-3 px-4 text-center font-mono font-bold text-gray-400">{idx + 1}</td>
                          
                          {/* Nama & Foto */}
                          <td className="py-3 px-4 font-semibold text-headings">
                            <div className="flex items-center space-x-2.5">
                              {rev.authorPhoto ? (
                                <img 
                                  src={rev.authorPhoto} 
                                  alt={rev.authorName} 
                                  referrerPolicy="no-referrer" // 👈 TAMBAHKAN INI
                                  className="w-8 h-8 rounded-full object-cover border" 
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-body-text">
                                  {rev.authorName.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="block font-bold">{rev.authorName}</span>
                                <span className="text-[10px] text-yasmin-green font-bold">✓ Google Maps User</span>
                              </div>
                            </div>
                          </td>

                          {/* Bintang */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex text-amber-500 font-bold">
                              {'★'.repeat(rev.rating)}
                            </div>
                          </td>

                          {/* Waktu */}
                          <td className="py-3 px-4 text-body-text font-mono text-[11px]">
                            {rev.relativeTime || rev.dateStr}
                          </td>

                          {/* Komentar */}
                          <td className="py-3 px-4 text-body-text leading-relaxed max-w-md">
                            "{rev.comment}"
                          </td>

                          {/* SAKLAR INTERAKTIF TOGGLE ON / OFF */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleVisible(rev.id, rev.isVisible)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                                rev.isVisible
                                  ? 'bg-yasmin-green hover:bg-yasmin-green text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-body-text'
                              }`}
                            >
                              {rev.isVisible ? '✓ AKTIF (TAMPIL)' : '✕ DISEMBUNYIKAN'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

                    {activeMenu === 'LAPORAN_PASIEN' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-teal-50/40">
                <div>
                  <h5 className="font-display font-bold text-headings text-base flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-yasmin-green" />
                    <span>Kotak Masuk Saran & Pengaduan</span>
                  </h5>
                  <p className="text-xs text-body-text mt-1">Pantau dan tindak lanjuti laporan dari pasien.</p>
                </div>
                
                {/* FITUR PENCARIAN & FILTER BARU */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Cari ID Pasien / Pesan..." 
                      value={searchFeedback}
                      onChange={(e) => setSearchFeedback(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-yasmin-green outline-none bg-white"
                    />
                  </div>
                  <select 
                    value={filterFeedbackStatus}
                    onChange={(e) => setFilterFeedbackStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold bg-white cursor-pointer outline-none focus:ring-2 focus:ring-yasmin-green"
                  >
                    <option value="all">Semua Status</option>
                    <option value="unread">Baru (Belum Dibaca)</option>
                    <option value="read">Sedang Ditinjau</option>
                    <option value="resolved">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider">
                      <th className="px-6 py-4">Waktu Masuk</th>
                      <th className="px-6 py-4">ID Pasien</th>
                      <th className="px-6 py-4">Kesan Umum</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider">
                    {(() => {
                      // Logika Filter Laporan
                      let filtered = feedbacks;
                      if (filterFeedbackStatus !== 'all') {
                        filtered = filtered.filter(f => f.status === filterFeedbackStatus);
                      }
                      if (searchFeedback.trim()) {
                        const q = searchFeedback.toLowerCase();
                        filtered = filtered.filter(f => 
                          f.patientId.toLowerCase().includes(q) || 
                          JSON.stringify(f.messages).toLowerCase().includes(q)
                        );
                      }

                      if (filtered.length === 0) {
                        return <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-xs">Tidak ada laporan yang cocok dengan filter.</td></tr>;
                      }

                      return filtered.map(fb => (
                        <tr key={fb.id} className={`transition-colors hover:bg-slate-50 ${fb.status === 'unread' ? 'bg-emerald-50/20' : ''}`}>
                          <td className="px-6 py-4 text-xs font-mono text-gray-500">
                            {new Date(fb.createdAt).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 font-bold text-headings">{fb.patientId}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-gray-700">{fb.kesan}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                              fb.status === 'unread' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                              fb.status === 'read' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {fb.status === 'unread' ? 'Baru (Belum Dibaca)' : fb.status === 'read' ? 'Sedang Ditinjau' : 'Selesai'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => {
                                setSelectedFeedback(fb);
                                if (fb.status === 'unread') handleUpdateFeedbackStatus(fb.id, 'read');
                              }} 
                              className="px-4 py-2 bg-[#0B4F4A] text-white rounded-xl text-xs font-bold hover:bg-[#0E625C] transition-colors"
                            >
                              Buka Laporan
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* 11. KELOLA ARTIKEL & BLOG KESEHATAN */}
          {/* ========================================== */}
          {activeMenu === 'ARTIKEL' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in text-left">
              <div className="flex items-center space-x-3 border-b border-divider pb-4">
                <Newspaper className="h-6 w-6 text-yasmin-green" />
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-850">Manajemen Artikel & Blog Medis</h3>
                  <p className="text-xs text-body-text">Tulis dan terbitkan berita, tips kesehatan, atau promo RS Yasmin ke halaman utama website.</p>
                </div>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4 bg-soft-mint p-5 rounded-2xl border border-divider">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase">Judul Artikel</label>
                    <input type="text" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green outline-none bg-white" placeholder="Contoh: Manfaat Berjalan Kaki di Pagi Hari..." />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase">Kategori / Topik</label>
                    <select value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green outline-none bg-white cursor-pointer">
                      <option value="Kesehatan Edukasi">Edukasi Kesehatan</option>
                      <option value="Berita RS">Berita Rumah Sakit</option>
                      <option value="Promo Layanan">Promo Layanan & Fasilitas</option>
                    </select>
                  </div>

                  {/* UPLOAD GAMBAR ARTIKEL */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-bold text-body-text uppercase">Gambar Sampul (Upload dari PC atau Paste URL)</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleArticleImageUpload} 
                        className="text-xs font-mono file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-yasmin-green file:text-white hover:file:bg-deep-teal cursor-pointer" 
                      />
                      <span className="text-xs font-bold text-gray-400">ATAU</span>
                      <input 
                        type="url" 
                        value={newArticle.coverImage} 
                        onChange={e => setNewArticle({...newArticle, coverImage: e.target.value})} 
                        className="flex-1 px-4 py-2 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green outline-none bg-white" 
                        placeholder="Paste URL gambar dari internet (https://...)" 
                      />
                    </div>
                    {newArticle.coverImage && (
                      <div className="mt-3 p-2 bg-white border border-divider rounded-xl inline-block shadow-sm">
                        <img src={newArticle.coverImage} alt="Preview Sampul" className="h-24 w-auto object-contain rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-bold text-body-text uppercase">Isi Artikel / Konten (Mendukung Multi-Paragraf)</label>
                    <textarea required rows={8} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full px-4 py-3 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green outline-none bg-white leading-relaxed" placeholder="Tuliskan isi lengkap artikel edukasi Anda di sini..." />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-divider mt-2">
                  <button type="submit" className="px-6 py-2.5 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 mt-3">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{editingArticleId ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
                  </button>
                </div>
              </form>

              {/* Tabel Riwayat Artikel */}
              <div className="overflow-x-auto border border-divider rounded-xl mt-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-soft-mint border-b border-divider text-body-text uppercase font-mono tracking-wider">
                    <tr>
                      <th className="px-4 py-3 w-16">Sampul</th>
                      <th className="px-4 py-3">Judul Artikel</th>
                      <th className="px-4 py-3">Kategori & Penulis</th>
                      <th className="px-4 py-3">Tanggal Terbit</th>
                      <th className="px-4 py-3 text-center">Status Tayang</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider">
                    {articles.map(a => (
                      <tr key={a.id} className="hover:bg-soft-mint transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-warm-ivory border border-divider">
                            {a.coverImage ? <img src={a.coverImage} alt="Cover" className="w-full h-full object-cover" /> : <Newspaper className="h-4 w-4 m-auto mt-3 text-gray-300" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-headings text-sm max-w-xs truncate">{a.title}</td>
                        <td className="px-4 py-3 text-body-text">
                          <span className="bg-soft-mint text-yasmin-green px-2 py-0.5 rounded font-bold">{a.category}</span>
                          <span className="block text-[10px] text-gray-400 mt-1">Oleh: {a.author}</span>
                        </td>
                        <td className="px-4 py-3 text-body-text font-mono">{new Date(a.createdAt).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleToggleArticle(a.id)} className={`px-3 py-1.5 rounded-full font-bold text-[10px] transition-all cursor-pointer shadow-xs ${a.isPublished ? 'bg-yasmin-green hover:bg-yasmin-green text-white' : 'bg-gray-200 hover:bg-gray-300 text-body-text'}`}>
                            {a.isPublished ? '✓ PUBLISH' : '✕ DRAFT'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => {
                            setNewArticle({ title: a.title, content: a.content, category: a.category, coverImage: a.coverImage });
                            setEditingArticleId(a.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteArticle(a.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Belum ada artikel yang diterbitkan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 12. MANAJEMEN USER (RBAC) - HANYA MASTER/SUPERUSER */}
          {/* ========================================================== */}
          {activeMenu === 'MANAJEMEN_USER' && (adminSession?.role === 'Master' || adminSession?.role === 'SuperUser') && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in text-left">
              <div className="flex items-center space-x-3 border-b border-divider pb-4">
                <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600"><ShieldAlert className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-850">Hak Akses & Manajemen Akun Pegawai (RBAC)</h3>
                  <p className="text-xs text-body-text">Buat dan atur tingkat keamanan akun untuk Staf Loket, Admin Sosmed, atau Dokter.</p>
                </div>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4 bg-gradient-to-br from-rose-50/50 to-white p-6 rounded-3xl border border-rose-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Nama Lengkap Pegawai</label>
                    <input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-4 py-2.5 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Misal: Siti Aminah" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Email Login</label>
                    <input type="email" required disabled={!!editingUserId} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-2.5 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="siti.loket@rsyasmin.id" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Kata Sandi {editingUserId && <span className="text-emerald-500">(Kosongkan jika tidak diubah)</span>}</label>
                    <input type="password" required={!editingUserId} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-4 py-2.5 border border-divider rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Minimal 12 karakter" />
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Peran (Role) Sistem & Keamanan</label>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-4 py-3 border border-divider rounded-xl text-sm font-bold text-body-text outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer bg-white">
                      <option value="User">User Biasa (Hanya dapat mengelola Pendaftaran & Artikel)</option>
                      {adminSession.role === 'Master' && (
                        <option value="SuperUser">Super User (Akses Penuh + Bisa kelola User lain)</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-3 md:col-span-3 border-t border-rose-100 pt-4 mt-2">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Hak Akses Spesifik (Permissions)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      
                      {/* Grup 1: Pendaftaran */}
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_PENDAFTARAN')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_PENDAFTARAN'] : newUser.permissions.filter(p => p !== 'MENU_PENDAFTARAN');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Loket Pendaftaran</span>
                      </label>

                      {/* Grup 2: Laporan & Ulasan */}
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_PATIENT_FEEDBACK')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_PATIENT_FEEDBACK'] : newUser.permissions.filter(p => p !== 'MENU_PATIENT_FEEDBACK');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Laporan Saran Pasien</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_REVIEWS')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_REVIEWS'] : newUser.permissions.filter(p => p !== 'MENU_REVIEWS');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Kurasi Ulasan Google</span>
                      </label>

                      {/* Grup 3: Konten & Web */}
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_CONTENT')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_CONTENT'] : newUser.permissions.filter(p => p !== 'MENU_CONTENT');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Kelola Web & Artikel</span>
                      </label>

                      {/* Grup 4: Master Data */}
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_MASTER_DATA')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_MASTER_DATA'] : newUser.permissions.filter(p => p !== 'MENU_MASTER_DATA');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Master Data (Dokter/Poli)</span>
                      </label>

                      {/* Grup 5: KPI */}
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_KPI')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_KPI'] : newUser.permissions.filter(p => p !== 'MENU_KPI');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Dashboard KPI</span>
                      </label>

                      {/* Grup 6: Keamanan Sistem */}
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_RBAC')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_RBAC'] : newUser.permissions.filter(p => p !== 'MENU_RBAC');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Hak Akses (RBAC)</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_DEVICE_LICENSE')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_DEVICE_LICENSE'] : newUser.permissions.filter(p => p !== 'MENU_DEVICE_LICENSE');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Lisensi Perangkat</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" checked={newUser.permissions.includes('MENU_API_SETTINGS')} onChange={(e) => {
                          const perms = e.target.checked ? [...newUser.permissions, 'MENU_API_SETTINGS'] : newUser.permissions.filter(p => p !== 'MENU_API_SETTINGS');
                          setNewUser({...newUser, permissions: perms});
                        }} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-rose-600">Pengaturan API</span>
                      </label>

                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-3 gap-2">
                  {editingUserId && (
                    <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer">
                      Batal Edit
                    </button>
                  )}
                  <button type="submit" className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5">
                    <UserPlus className="h-4 w-4" />
                    <span>{editingUserId ? 'Simpan Perubahan' : 'Buat Akun Pegawai'}</span>
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto border border-divider rounded-2xl shadow-sm mt-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-soft-mint border-b border-divider text-body-text uppercase tracking-wider font-mono">
                    <tr>
                      <th className="px-5 py-4">Nama Lengkap</th>
                      <th className="px-5 py-4">Email Login</th>
                      <th className="px-5 py-4 text-center">Peran (Role)</th>
                      <th className="px-5 py-4">Tanggal Dibuat</th>
                      <th className="px-5 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider">
                    {adminUsers.map(u => (
                      <tr key={u.id} className="hover:bg-soft-mint/80 transition-colors">
                        <td className="px-5 py-4 font-bold text-headings text-sm flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-body-text text-xs">{u.name?.slice(0, 2).toUpperCase() || 'AD'}</div>
                          <span>{u.name || '-'}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-body-text">{u.email}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase shadow-xs border ${
                            u.role === 'Master' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                            u.role === 'SuperUser' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            'bg-soft-mint text-yasmin-green border-yasmin-green'
                          }`}>
                            {u.role === 'Master' ? '👑 Master' : u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-body-text font-mono">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                        <td className="px-5 py-4 text-center space-x-2">
                          {/* Tombol Edit */}
                          <button onClick={() => handleOpenEditUser(u)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors inline-flex">
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Tombol Hapus */}
                          {u.email !== adminSession?.email && (
                            <button onClick={() => handleDeleteUser(u.id, u.email)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors inline-flex">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 13: LISENSI PERANGKAT (DEVICE LOCK) */}
          {/* ========================================================== */}
          {activeMenu === 'LISENSI_PERANGKAT' && (adminSession?.role === 'Master' || adminSession?.role === 'SuperUser') && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in text-left">
              <div className="flex items-center space-x-3 border-b border-divider pb-4">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-deep-teal"><MonitorSmartphone className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-850">Kontrol Lisensi Perangkat (Device Lock & Zero-Trust)</h3>
                  <p className="text-xs text-body-text">Setujui atau Blokir Komputer/Laptop yang mencoba mengakses sistem Admin Pendaftaran.</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-800 leading-relaxed font-medium">
                <strong>🛡️ Info Keamanan:</strong> Setiap perangkat (PC, HP, atau Browser Incognito) yang membuka panel pendaftaran akan dicatat sidik jarinya secara unik. Perangkat tersebut <strong>TIDAK AKAN BISA</strong> membuka data pasien sebelum Anda mengklik tombol <span className="bg-yasmin-green text-white px-1.5 py-0.5 rounded uppercase text-[9px]">Diizinkan</span> di bawah ini.
              </div>

              <div className="overflow-x-auto border border-divider rounded-2xl shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-soft-mint border-b border-divider text-body-text uppercase tracking-wider font-mono">
                    <tr>
                      <th className="px-5 py-4">Nama Perangkat</th>
                      <th className="px-5 py-4">Email Login Percobaan</th>
                      <th className="px-5 py-4">Device Hash (Sidik Jari PC)</th>
                      <th className="px-5 py-4">Aktivitas Terakhir</th>
                      <th className="px-5 py-4 text-center">Status Izin (Aksi)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider">
                    {deviceLicenses.map(d => (
                      <tr key={d.id} className="hover:bg-soft-mint transition-colors">
                        <td className="px-5 py-4 font-bold text-headings">{d.deviceName}</td>
                        <td className="px-5 py-4 text-body-text font-medium">{d.adminEmail}</td>
                        <td className="px-5 py-4 font-mono text-[9px] text-gray-400 bg-soft-mint rounded p-1.5 border border-divider max-w-[120px] truncate">{d.deviceHash}</td>
                        <td className="px-5 py-4 text-body-text font-mono text-[10px]">{new Date(d.lastActive).toLocaleString('id-ID')}</td>
                        <td className="px-5 py-4 text-center">
                          <button 
                            onClick={() => handleToggleLicense(d.id)}
                            className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase shadow-sm transition-all cursor-pointer active:scale-95 ${d.isAllowed ? 'bg-yasmin-green text-white hover:bg-yasmin-green' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                          >
                            {d.isAllowed ? '✅ Diizinkan' : '❌ Diblokir (Buka Izin)'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === 'PENGATURAN_SISTEM' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 border-b border-divider pb-4">
                <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600"><KeyRound className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-850">Konfigurasi API Google</h3>
                  <p className="text-xs text-body-text">Kelola API Key untuk sinkronisasi Google Maps. Nilai disimpan terenkripsi di database. Hanya Master & Direktur yang dapat mengakses halaman ini.</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span><strong>Info Keamanan:</strong> API Key asli tidak pernah ditampilkan di sini. Untuk mengganti, ketik nilai baru. Untuk membiarkan yang lama, kosongkan field.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {apiSettings.map(setting => (
                  <div key={setting.key} className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                      {setting.label}
                      {setting.isSet && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          setting.source === 'database' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {setting.source === 'database' ? '✓ Tersimpan di DB' : 'Dari .env'}
                        </span>
                      )}
                    </label>
                    <input
                      type={setting.isSecret ? 'password' : 'text'}
                      placeholder={setting.isSet ? `Nilai saat ini: ${setting.value}` : 'Belum di-set'}
                      value={settingsForm[setting.key] || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, [setting.key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-divider flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSavingSettings ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'AUDIT_LOG' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                <div>
                  <h3 className="font-display font-bold text-headings text-base flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-rose-600" />
                    Audit Log Sistem
                  </h3>
                  <p className="text-xs text-body-text mt-1">Rekam jejak seluruh aktivitas dan perubahan data di dalam sistem.</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari email, aksi, atau entitas..." 
                    value={searchAudit}
                    onChange={(e) => setSearchAudit(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-gray-200 text-gray-600 uppercase font-mono">
                    <tr>
                      <th className="px-6 py-3">Waktu</th>
                      <th className="px-6 py-3">Aktor (User)</th>
                      <th className="px-6 py-3">Aksi</th>
                      <th className="px-6 py-3">Target (Entity)</th>
                      <th className="px-6 py-3">Detail</th>
                      <th className="px-6 py-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditLogs.map(log => {
                      // Mencoba parse JSON details (jika ada)
                      let parsedDetails = '';
                      try {
                        const json = JSON.parse(log.details);
                        parsedDetails = Object.entries(json).map(([k, v]) => `${k}: ${v}`).join(' | ');
                      } catch (e) {
                        parsedDetails = log.details || '-';
                      }

                      // Pewarnaan berdasarkan aksi
                      const actionColor = log.action.includes('DELETE') ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                          log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                          log.action.includes('UPDATE') || log.action.includes('SAVE') ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                          'bg-emerald-100 text-emerald-700 border-emerald-200';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-mono text-gray-500 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString('id-ID', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', second: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-3 font-bold text-headings">{log.userEmail}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2.5 py-1 border rounded-md font-bold text-[10px] uppercase ${actionColor}`}>
                              {log.action.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-mono text-yasmin-green font-semibold">
                            {log.entity} {log.entityId ? `(${log.entityId.substring(0, 8)}...)` : ''}
                          </td>
                          <td className="px-6 py-3 text-gray-600 max-w-xs truncate" title={parsedDetails}>
                            {parsedDetails}
                          </td>
                          <td className="px-6 py-3 font-mono text-gray-400 text-[10px]">{log.ipAddress}</td>
                        </tr>
                      );
                    })}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                          Belum ada aktivitas yang tercatat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* 14. MASTER KAMAR RAWAT INAP */}
          {activeMenu === 'KAMAR_RAWAT_INAP' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 bg-teal-50/40">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-teal-100 text-deep-teal rounded-xl">
                    <Bed className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-headings text-base">Master Kamar Rawat Inap</h3>
                    <p className="text-xs text-body-text mt-0.5">Kelola data kamar dan kelasnya, jumlah bed, terpakai, dan sisa secara langsung.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddRoom('Rawat Inap')}
                  className="px-4 py-2 bg-deep-teal hover:bg-deep-teal text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm shrink-0 animate-fade-in"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Kamar Rawat Inap</span>
                </button>
              </div>

              {/* Frame Group */}
              <div className="p-6 border-b border-divider bg-soft-mint/40">
                <div 
                  onClick={() => setIsRawatInapGroupOpen(!isRawatInapGroupOpen)}
                  className="flex items-center justify-between border border-teal-100 bg-white p-4 rounded-xl shadow-xs cursor-pointer hover:bg-teal-50/20 transition-all select-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-teal-100 text-deep-teal rounded-lg">
                      <Bed className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-sm text-headings">Frame Group: Daftar Kamar Rawat Inap</span>
                      <span className="ml-3 text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono font-bold">
                        {rooms.filter(r => r.type === 'Rawat Inap').length} Kamar Terdaftar
                      </span>
                    </div>
                  </div>
                  <button type="button" className="text-gray-400 hover:text-body-text transition-colors">
                    {isRawatInapGroupOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                {isRawatInapGroupOpen && (
                  <div className="mt-4 border border-divider bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-3 text-center w-12 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Kelas Kamar</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Nama Kamar</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Jumlah Bed</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Terpakai</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Sisa Bed</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Fasilitas</th>
                            <th className="px-4 py-3 text-right bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-xs">
                          {rooms.filter(r => r.type === 'Rawat Inap').map((room, idx) => {
                            const isSelected = selectedRoomId === room.id;
                            const sisa = room.capacity - room.occupied;
                            return (
                              <tr
                                key={room.id}
                                onClick={() => setSelectedRoomId(isSelected ? null : room.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15 border-l-4 border-l-teal-600' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-3 text-center font-mono text-xs font-bold text-gray-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-semibold text-headings">{room.class}</td>
                                <td className="px-4 py-3 text-body-text font-medium">{room.name}</td>
                                <td className="px-4 py-3 text-center font-bold text-gray-750 font-mono">{room.capacity}</td>
                                <td className="px-4 py-3 text-center font-bold text-rose-600 font-mono">{room.occupied}</td>
                                <td className={`px-4 py-3 text-center font-extrabold font-mono ${sisa > 0 ? 'text-yasmin-green' : 'text-emergency animate-pulse'}`}>{sisa}</td>
                                <td className="px-4 py-3 text-body-text max-w-xs truncate" title={room.facilities}>{room.facilities || <span className="text-gray-300 italic">Tidak ada fasilitas</span>}</td>
                                <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditFacilities(room)}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-200 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                    title="Edit Fasilitas"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                    <span>Fasilitas</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditRoom(room)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {rooms.filter(r => r.type === 'Rawat Inap').length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-xs">
                                Belum ada data kamar Rawat Inap. Klik "Tambah Kamar" untuk menambahkan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 15. MASTER KAMAR ICU */}
          {activeMenu === 'KAMAR_ICU' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-50/40">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-100 text-deep-teal rounded-xl">
                    <Bed className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-headings text-base">Master Kamar ICU</h3>
                    <p className="text-xs text-body-text mt-0.5">Kelola data kamar ICU, kapasitas bed, terpakai, dan sisa secara langsung.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddRoom('ICU')}
                  className="px-4 py-2 bg-deep-teal hover:bg-deep-teal text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Kamar ICU</span>
                </button>
              </div>

              {/* Frame Group */}
              <div className="p-6 border-b border-divider bg-soft-mint/40">
                <div 
                  onClick={() => setIsIcuGroupOpen(!isIcuGroupOpen)}
                  className="flex items-center justify-between border border-indigo-100 bg-white p-4 rounded-xl shadow-xs cursor-pointer hover:bg-indigo-50/20 transition-all select-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-indigo-100 text-deep-teal rounded-lg">
                      <Bed className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-sm text-headings">Frame Group: Daftar Kamar ICU</span>
                      <span className="ml-3 text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono font-bold">
                        {rooms.filter(r => r.type === 'ICU').length} Kamar Terdaftar
                      </span>
                    </div>
                  </div>
                  <button type="button" className="text-gray-400 hover:text-body-text transition-colors">
                    {isIcuGroupOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                {isIcuGroupOpen && (
                  <div className="mt-4 border border-divider bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-3 text-center w-12 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Kelas / Unit ICU</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Nama Kamar</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Jumlah Bed</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Terpakai</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Sisa Bed</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Fasilitas</th>
                            <th className="px-4 py-3 text-right bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-xs">
                          {rooms.filter(r => r.type === 'ICU').map((room, idx) => {
                            const isSelected = selectedRoomId === room.id;
                            const sisa = room.capacity - room.occupied;
                            return (
                              <tr
                                key={room.id}
                                onClick={() => setSelectedRoomId(isSelected ? null : room.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15 border-l-4 border-l-indigo-600' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-3 text-center font-mono text-xs font-bold text-gray-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-semibold text-headings">{room.class}</td>
                                <td className="px-4 py-3 text-body-text font-medium">{room.name}</td>
                                <td className="px-4 py-3 text-center font-bold text-gray-750 font-mono">{room.capacity}</td>
                                <td className="px-4 py-3 text-center font-bold text-rose-600 font-mono">{room.occupied}</td>
                                <td className={`px-4 py-3 text-center font-extrabold font-mono ${sisa > 0 ? 'text-yasmin-green' : 'text-emergency animate-pulse'}`}>{sisa}</td>
                                <td className="px-4 py-3 text-body-text max-w-xs truncate" title={room.facilities}>{room.facilities || <span className="text-gray-300 italic">Tidak ada fasilitas</span>}</td>
                                <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditFacilities(room)}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-750 rounded-lg text-[10px] font-bold border border-amber-200 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                    title="Edit Fasilitas"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                    <span>Fasilitas</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditRoom(room)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {rooms.filter(r => r.type === 'ICU').length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-xs">
                                Belum ada data kamar ICU. Klik "Tambah Kamar ICU" untuk menambahkan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 16. MASTER KAMAR IGD */}
          {activeMenu === 'KAMAR_IGD' && (
            <div className="bg-white border border-divider rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rose-50/40">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl">
                    <Bed className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-headings text-base">Master Kamar IGD</h3>
                    <p className="text-xs text-body-text mt-0.5">Kelola data bed IGD, kapasitas, terpakai, dan sisa secara langsung.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddRoom('IGD')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Kamar IGD</span>
                </button>
              </div>

              {/* Frame Group */}
              <div className="p-6 border-b border-divider bg-soft-mint/40">
                <div 
                  onClick={() => setIsIgdGroupOpen(!isIgdGroupOpen)}
                  className="flex items-center justify-between border border-rose-100 bg-white p-4 rounded-xl shadow-xs cursor-pointer hover:bg-rose-50/20 transition-all select-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                      <Bed className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-sm text-headings">Frame Group: Daftar Kamar IGD</span>
                      <span className="ml-3 text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-mono font-bold">
                        {rooms.filter(r => r.type === 'IGD').length} Kamar Terdaftar
                      </span>
                    </div>
                  </div>
                  <button type="button" className="text-gray-400 hover:text-body-text transition-colors">
                    {isIgdGroupOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                {isIgdGroupOpen && (
                  <div className="mt-4 border border-divider bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-soft-mint border-b border-divider text-xs font-bold text-body-text uppercase tracking-wider select-none">
                            <th className="px-4 py-3 text-center w-12 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">No.</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Kelas / Area IGD</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Nama Kamar / Bed</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Jumlah Bed</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Terpakai</th>
                            <th className="px-4 py-3 text-center bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Sisa Bed</th>
                            <th className="px-4 py-3 bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Fasilitas</th>
                            <th className="px-4 py-3 text-right bg-soft-mint shadow-[0_1px_0_rgba(229,231,235,1)]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider text-xs">
                          {rooms.filter(r => r.type === 'IGD').map((room, idx) => {
                            const isSelected = selectedRoomId === room.id;
                            const sisa = room.capacity - room.occupied;
                            return (
                              <tr
                                key={room.id}
                                onClick={() => setSelectedRoomId(isSelected ? null : room.id)}
                                className={`transition-all border-b border-divider cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-yasmin-green/10 hover:bg-yasmin-green/15 border-l-4 border-l-rose-600' 
                                    : 'hover:bg-soft-mint/70'
                                }`}
                              >
                                <td className="px-4 py-3 text-center font-mono text-xs font-bold text-gray-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-semibold text-headings">{room.class}</td>
                                <td className="px-4 py-3 text-body-text font-medium">{room.name}</td>
                                <td className="px-4 py-3 text-center font-bold text-gray-750 font-mono">{room.capacity}</td>
                                <td className="px-4 py-3 text-center font-bold text-rose-600 font-mono">{room.occupied}</td>
                                <td className={`px-4 py-3 text-center font-extrabold font-mono ${sisa > 0 ? 'text-yasmin-green' : 'text-emergency animate-pulse'}`}>{sisa}</td>
                                <td className="px-4 py-3 text-body-text max-w-xs truncate" title={room.facilities}>{room.facilities || <span className="text-gray-300 italic">Tidak ada fasilitas</span>}</td>
                                <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditFacilities(room)}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-750 rounded-lg text-[10px] font-bold border border-amber-200 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                    title="Edit Fasilitas"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                    <span>Fasilitas</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditRoom(room)}
                                    className="p-1 hover:bg-warm-ivory text-deep-teal rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="p-1 hover:bg-warm-ivory text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {rooms.filter(r => r.type === 'IGD').length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-xs">
                                Belum ada data kamar IGD. Klik "Tambah Kamar IGD" untuk menambahkan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 17. KPI DASHBOARDS */}
          {activeMenu.startsWith('KPI_') && (
            <KpiDashboard menu={activeMenu} />
          )}

          </div>

          {/* ADMIN FOOTER */}
          <footer className="bg-headings text-warm-ivory border-t-4 border-yasmin-green p-6 md:p-8 mt-auto print:bg-headings print:text-warm-ivory print:border-t-4 print:border-yasmin-green w-full shrink-0">
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Brand, Logo & Motto */}
              <div className="flex items-center space-x-4">
                <SafeImage 
                  src={rsInfo.logo || logoRsYasmin} 
                  fallbackSrc={logoRsYasmin}
                  alt="RS Yasmin" 
                  className="h-12 w-12 object-contain bg-white rounded-full p-1 border border-teal-850 shrink-0" 
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-warm-orange tracking-wide uppercase">
                    {rsInfo.name || "RS YASMIN"}
                  </h4>
                  <p className="text-xs text-warm-mint/80 max-w-md mt-0.5 italic">
                    "Membangun Family Wellness Ecosystem terintegrasi yang nyaman, profesional, dan humanis."
                  </p>
                </div>
              </div>
              {/* Kontak */}
              <div className="text-xs text-warm-mint/70 space-y-1.5 md:text-right">
                <p className="font-semibold text-warm-ivory">{rsInfo.address || INITIAL_RS_INFO.address}</p>
                <p>
                  Telp: <span className="font-mono">{rsInfo.phone || INITIAL_RS_INFO.phone}</span> | WhatsApp: <span className="font-mono">{rsInfo.whatsapp || INITIAL_RS_INFO.whatsapp}</span>
                </p>
                <p>Email: <span>{rsInfo.email || INITIAL_RS_INFO.email}</span></p>
              </div>
            </div>
            {/* Copyright */}
            <div className="w-full mt-6 pt-4 border-t border-warm-mint/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-warm-mint/50 gap-4 text-center md:text-left">
              <p>© {new Date().getFullYear()} {rsInfo.name || "RS Yasmin"}. Hak Cipta Dilindungi.</p>
              <p className="bg-warm-ivory/5 px-2.5 py-1 rounded border border-warm-ivory/10 font-mono">
                {rsInfo.accreditation || INITIAL_RS_INFO.accreditation}
              </p>
            </div>
          </footer>

        </div>

      </main>

      {/* PRINT IFRAME WARNING MODAL */}
      {showPrintWarning && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg p-6 sm:p-8 space-y-6 text-left border border-divider">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-600 shrink-0">
                <Printer className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-headings leading-tight">
                  Fitur Cetak PDF Terblokir oleh Browser (Aturan Iframe)
                </h3>
                <p className="text-sm text-body-text leading-relaxed">
                  Browser Anda memblokir pemanggilan dialog cetak (<code className="font-mono bg-warm-ivory px-1 py-0.5 rounded text-rose-600">window.print()</code>) karena aplikasi ini sedang berjalan di dalam <strong>Bingkai Pratinjau (Iframe)</strong> pengembang AI Studio demi alasan keamanan.
                </p>
              </div>
            </div>

            <div className="bg-soft-mint border border-divider rounded-2xl p-4 sm:p-5 space-y-3">
              <h4 className="font-sans font-bold text-xs text-teal-800 uppercase tracking-wider">
                Cara Mencetak / Menyimpan PDF dengan Lancar:
              </h4>
              <ul className="text-xs text-body-text space-y-2.5 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] shrink-0 mr-2.5 mt-0.5">1</span>
                  <span>Klik tombol <strong>"Open in New Tab" / "Buka di Tab Baru"</strong> di pojok kanan atas layar panel kerja AI Studio Anda.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] shrink-0 mr-2.5 mt-0.5">2</span>
                  <span>Masuk kembali ke <strong>Dashboard Admin</strong> di tab baru tersebut.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] shrink-0 mr-2.5 mt-0.5">3</span>
                  <span>Klik tombol <strong>Cetak PDF</strong>. Dialog print bawaan browser Anda akan langsung terbuka secara normal dan rapi (WYSIWYG)!</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPrintWarning(false);
                  try {
                    window.print();
                  } catch (e) {
                    alert("Cetak gagal dipicu.");
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 border border-divider hover:border-gray-400 text-body-text hover:bg-soft-mint rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
              >
                Tetap Paksa Cetak (Force)
              </button>
              <button
                type="button"
                onClick={() => setShowPrintWarning(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-deep-teal hover:bg-deep-teal text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Tutup & Buka Tab Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD POPUP DIALOG / MODAL FOR MASTER DATA */}
      {isModalOpen && (
        <div id="admin-modal" className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            (activeMenu === 'DATA_DOKTER' || activeMenu === 'DATA_PRAKTEK')
              ? 'w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[65%] h-[92vh] max-h-[96vh] max-w-5xl'
              : 'w-full max-w-2xl max-h-[90vh]'
          }`}>
            
            <div className="px-6 py-5 border-b border-divider flex items-center justify-between bg-soft-mint">
              <h4 className="font-display font-black text-headings text-base">
                {modalType === 'ADD' ? 'Tambah Data Master Baru' : 'Ubah Data Master'}
              </h4>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-body-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              
              {/* DOCTOR DIALOG */}
              {(activeMenu === 'DATA_DOKTER' || activeMenu === 'DATA_PRAKTEK') && (
                <form onSubmit={handleSaveDoctor} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* PHOTO PREVIEW AND UPLOAD BUTTON */}
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center p-4 bg-soft-mint rounded-2xl border-2 border-dashed border-divider space-y-3">
                      <span className="text-xs font-bold text-body-text uppercase tracking-wider">Foto Profil Dokter</span>
                      
                      {/* Photo preview field */}
                      <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-md relative group bg-white flex items-center justify-center p-1">
                        {currentDoctor.image ? (
                          <SafeImage 
                            src={currentDoctor.image} 
                            alt="Doctor preview" 
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Upload file photo button */}
                      <div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={triggerFileInput}
                          className="px-4 py-2 bg-white border border-divider hover:border-yasmin-green hover:text-yasmin-green text-gray-750 font-semibold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-xs cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Pilih & Upload Foto Dokter</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Kode Dokter</label>
                      <input 
                        type="text" 
                        disabled={modalType === 'EDIT'}
                        value={currentDoctor.id}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, id: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green disabled:bg-warm-ivory font-mono"
                        placeholder="doc-xxx"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Nama Lengkap Dokter</label>
                      <input 
                        type="text" 
                        value={currentDoctor.name}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, name: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                        placeholder="dr. Contoh Dokter, SpA"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Kategori Spesialis</label>
                      <select 
                        value={currentDoctor.specialty}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, specialty: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-bold text-body-text bg-white"
                      >
                        <option value="">-- Pilih Kategori --</option>
                        {specialistCategories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Poliklinik (Poli)</label>
                      <select 
                        value={currentDoctor.subSpecialty || ''}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, subSpecialty: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-semibold text-gray-750 bg-white"
                      >
                        <option value="">-- Pilih Poliklinik --</option>
                        {polyclinics.map((poly) => (
                          <option key={poly.code} value={poly.name}>
                            {poly.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Jenis Kelamin</label>
                      <select 
                        value={currentDoctor.gender || 'Laki-laki'}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-semibold text-gray-750 bg-white"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Spesialis (Speciali)</label>
                      <select 
                        value={currentDoctor.speciali || ''}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, speciali: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-semibold text-gray-750 bg-white"
                      >
                        <option value="">-- Pilih Spesialis --</option>
                        {specialists.map((spec) => (
                          <option key={spec.code} value={spec.name}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Pengalaman (Tahun)</label>
                      <input 
                        type="number" 
                        value={currentDoctor.experience}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, experience: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Rating (1.0 - 5.0)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={currentDoctor.rating}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                      />
                    </div>

                    {/* MULTI DAY SELECTOR */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Jadwal Hari Praktek (Pilih Multi Hari)</label>
                      <div className="flex flex-wrap gap-1.5 p-3 bg-soft-mint border border-divider rounded-2xl">
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => {
                          const currentDays = currentDoctor.schedule?.days || [];
                          const isSelected = currentDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                const updatedDays = isSelected 
                                  ? currentDays.filter(d => d !== day) 
                                  : [...currentDays, day];
                                
                                const orderedDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
                                  .filter(d => updatedDays.includes(d));

                                setCurrentDoctor({
                                  ...currentDoctor,
                                  schedule: {
                                    days: orderedDays,
                                    hours: currentDoctor.schedule?.hours || '08:00 - 12:00'
                                  }
                                });
                              }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                isSelected 
                                  ? 'bg-yasmin-green text-white border-yasmin-green shadow-xs scale-[1.02]' 
                                  : 'bg-white text-body-text border-divider hover:border-gray-400'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* MULTI TIME SELECTOR */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Jadwal Jam Praktek (Pilih Multi Waktu)</label>
                      {(() => {
                        const currentHoursList = currentDoctor.schedule?.hours 
                          ? currentDoctor.schedule.hours.split(',').map(h => h.trim()).filter(Boolean)
                          : [];
                        return (
                          <div className="space-y-3">
                            {currentHoursList.length > 0 ? (
                              <div className="flex flex-wrap gap-2 p-3 bg-soft-mint border border-divider rounded-2xl">
                                {currentHoursList.map((hr, idx) => (
                                  <span key={idx} className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-xl font-mono">
                                    <span>{hr}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = currentHoursList.filter((_, i) => i !== idx);
                                        setCurrentDoctor({
                                          ...currentDoctor,
                                          schedule: {
                                            days: currentDoctor.schedule?.days || [],
                                            hours: updated.join(', ')
                                          }
                                        });
                                      }}
                                      className="text-indigo-400 hover:text-deep-teal focus:outline-none cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-450 italic p-3 bg-soft-mint border border-divider rounded-2xl text-center">
                                Belum ada jam praktek yang dipilih. Silakan tambah jam di bawah.
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Pilih Jam Cepat</span>
                                <select
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val && !currentHoursList.includes(val)) {
                                      const updated = [...currentHoursList, val];
                                      setCurrentDoctor({
                                        ...currentDoctor,
                                        schedule: {
                                          days: currentDoctor.schedule?.days || [],
                                          hours: updated.join(', ')
                                        }
                                      });
                                    }
                                    e.target.value = ''; // Reset select
                                  }}
                                  className="w-full px-3 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green cursor-pointer bg-white"
                                >
                                  <option value="">-- Pilih Jam Praktek --</option>
                                  <option value="08:00 - 12:00">Pagi (08:00 - 12:00)</option>
                                  <option value="13:00 - 15:00">Siang (13:00 - 15:00)</option>
                                  <option value="16:00 - 18:00">Sore (16:00 - 18:00)</option>
                                  <option value="19:00 - 21:00">Malam (19:00 - 21:00)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Tambah Jam Kustom</span>
                                <div className="flex space-x-1.5">
                                  <input
                                    type="text"
                                    id="custom-time-input"
                                    placeholder="e.g. 09:30 - 11:30"
                                    className="flex-1 px-3 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if (val && !currentHoursList.includes(val)) {
                                          const updated = [...currentHoursList, val];
                                          setCurrentDoctor({
                                            ...currentDoctor,
                                            schedule: {
                                              days: currentDoctor.schedule?.days || [],
                                              hours: updated.join(', ')
                                            }
                                          });
                                          e.currentTarget.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const el = document.getElementById('custom-time-input') as HTMLInputElement;
                                      const val = el?.value.trim();
                                      if (val && !currentHoursList.includes(val)) {
                                        const updated = [...currentHoursList, val];
                                        setCurrentDoctor({
                                          ...currentDoctor,
                                          schedule: {
                                            days: currentDoctor.schedule?.days || [],
                                            hours: updated.join(', ')
                                          }
                                        });
                                        if (el) el.value = '';
                                      }
                                    }}
                                    className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                                  >
                                    Tambah
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* QUOTA PRAKTEK */}
                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Kuota Praktek Pasien (Default: 30)</label>
                      <input 
                        type="number" 
                        min={1}
                        value={currentDoctor.schedule?.quota !== undefined ? currentDoctor.schedule.quota : 30}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCurrentDoctor({
                            ...currentDoctor,
                            schedule: {
                              days: currentDoctor.schedule?.days || [],
                              hours: currentDoctor.schedule?.hours || '',
                              quota: isNaN(val) ? 30 : val
                            }
                          });
                        }}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                        placeholder="30"
                      />
                    </div>

                    {/* STATUS PRAKTEK */}
                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Status Praktek Dokter</label>
                      <select
                        value={currentDoctor.status || 'Aktif'}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, status: e.target.value as any })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-bold text-body-text bg-white"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Libur">Libur (Sakit/Lainnya)</option>
                        <option value="Cuti">Cuti</option>
                        <option value="Ijin">Ijin</option>
                        <option value="Berhenti">Berhenti</option>
                      </select>
                    </div>

                    {(currentDoctor.status === 'Libur' || currentDoctor.status === 'Cuti' || currentDoctor.status === 'Ijin') && (
                      <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono block">Mulai Tanggal (From Date)</label>
                          <input 
                            type="date" 
                            value={currentDoctor.leaveFromDate || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, leaveFromDate: e.target.value })}
                            className="w-full px-4 py-2 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono block">Sampai Tanggal (To Date)</label>
                          <input 
                            type="date" 
                            value={currentDoctor.leaveToDate || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, leaveToDate: e.target.value })}
                            className="w-full px-4 py-2 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* NEW FIELDS FOR CERTIFICATIONS & DATES */}
                    <div className="col-span-1 md:col-span-2 border-t border-divider pt-4 mt-2">
                      <h5 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-3">Informasi Kelulusan & Izin Praktek</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Tanggal Lulus Kedokteran (Umum)</label>
                          <input 
                            type="date" 
                            value={currentDoctor.gradGradDate || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, gradGradDate: e.target.value })}
                            className="w-full px-4 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">No. Izin Dokter (SIP Umum)</label>
                          <input 
                            type="text" 
                            value={currentDoctor.licenseNumber || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, licenseNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                            placeholder="SIP/xxx/xxx"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Tanggal Lulus Spesialis</label>
                          <input 
                            type="date" 
                            value={currentDoctor.specGradDate || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, specGradDate: e.target.value })}
                            className="w-full px-4 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">No. Izin Spesialis (SIP Spesialis)</label>
                          <input 
                            type="text" 
                            value={currentDoctor.specLicenseNumber || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, specLicenseNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                            placeholder="SIPS/xxx/xxx"
                          />
                        </div>
                        <div className="space-y-1 col-span-1 md:col-span-2">
                          <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono block">Join Date (Tanggal Bergabung)</label>
                          <input 
                            type="date" 
                            value={currentDoctor.joinDate || ''}
                            onChange={(e) => setCurrentDoctor({ ...currentDoctor, joinDate: e.target.value })}
                            className="w-full px-4 py-2 border border-divider rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Pendidikan Terakhir</label>
                      <input 
                        type="text" 
                        value={currentDoctor.education}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, education: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                        placeholder="Alumni Universitas Contoh"
                      />
                    </div>

                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Bio Singkat</label>
                      <textarea 
                        rows={3}
                        value={currentDoctor.bio}
                        onChange={(e) => setCurrentDoctor({ ...currentDoctor, bio: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                        placeholder="Deskripsi singkat mengenai profil keahlian dokter..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center space-x-2 mt-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={currentDoctor.bpjs}
                          onChange={(e) => setCurrentDoctor({ ...currentDoctor, bpjs: e.target.checked })}
                          className="rounded text-yasmin-green focus:ring-yasmin-green"
                        />
                        <span className="text-xs font-bold text-body-text uppercase tracking-wider">Melayani Pasien BPJS</span>
                      </label>
                    </div>

                  </div>

                  <div className="pt-4 border-t border-divider flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Simpan Dokter</span>
                    </button>
                  </div>
                </form>
              )}

              {/* POLY DIALOG */}
              {activeMenu === 'DATA_POLY' && (
                <form onSubmit={handleSavePoly} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Kode Polyclinic</label>
                    <input 
                      type="text" 
                      disabled={modalType === 'EDIT'}
                      value={currentPoly.code}
                      onChange={(e) => setCurrentPoly({ ...currentPoly, code: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green disabled:bg-warm-ivory font-mono font-bold"
                      placeholder="POLxxx"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Nama Poliklinik</label>
                    <input 
                      type="text" 
                      value={currentPoly.name}
                      onChange={(e) => setCurrentPoly({ ...currentPoly, name: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                      placeholder="e.g. Bedah Jantung, Gigi"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Status Operasional</label>
                    <select 
                      value={currentPoly.status}
                      onChange={(e) => setCurrentPoly({ ...currentPoly, status: e.target.value as 'Aktif' | 'Pasif' })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Pasif">Pasif</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Biaya Pendaftaran (Rp)</label>
                    <input 
                      type="number" 
                      value={currentPoly.price !== undefined ? currentPoly.price : 135000}
                      onChange={(e) => setCurrentPoly({ ...currentPoly, price: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider block font-mono">Aktif Sejak Tanggal</label>
                      <input 
                        type="date" 
                        value={currentPoly.activeSinceDate || ''}
                        onChange={(e) => setCurrentPoly({ ...currentPoly, activeSinceDate: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider block font-mono">Pasif Sejak Tanggal</label>
                      <input 
                        type="date" 
                        value={currentPoly.inactiveSinceDate || ''}
                        onChange={(e) => setCurrentPoly({ ...currentPoly, inactiveSinceDate: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-divider flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Simpan Poliklinik</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SPECIALIST DIALOG */}
              {activeMenu === 'DATA_SPESIALIS' && (
                <form onSubmit={handleSaveSpecialist} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Kode Spesialisasi</label>
                    <input 
                      type="text" 
                      disabled={modalType === 'EDIT'}
                      value={currentSpecialist.code}
                      onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, code: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green disabled:bg-warm-ivory font-mono font-bold"
                      placeholder="SPSxxx"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Nama Spesialisasi</label>
                    <input 
                      type="text" 
                      value={currentSpecialist.name}
                      onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, name: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                      placeholder="Spesialis ..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider font-mono">Fokus / Deskripsi</label>
                    <textarea 
                      rows={3}
                      value={currentSpecialist.description}
                      onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, description: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                      placeholder="Fokus penanganan spesialisasi ini..."
                    />
                  </div>

                  <div className="pt-4 border-t border-divider flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Simpan Spesialis</span>
                    </button>
                  </div>
                </form>
              )}

              {activeMenu === 'MITRA_PENJAMIN' && (
                <form onSubmit={handleSavePartner} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase">Nama Mitra / Perusahaan</label>
                    <input type="text" required value={currentPartner.name || ''} onChange={e => setCurrentPartner({...currentPartner, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase">Kategori</label>
                    <select value={currentPartner.type || 'Asuransi'} onChange={e => setCurrentPartner({...currentPartner, type: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-white cursor-pointer">
                      <option value="Asuransi">Asuransi Swasta</option>
                      <option value="Perusahaan">Perusahaan / Korporasi</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">Batal</button>
                    <button type="submit" className="px-5 py-2 bg-yasmin-green text-white rounded-xl font-bold">Simpan</button>
                  </div>
                </form>
              )}

              {/* SOSIAL_MEDIA DIALOG */}
              {activeMenu === 'SOSIAL_MEDIA' && (
                <form onSubmit={handleSaveSocial} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Platform Sosial Media</label>
                    <select 
                      value={currentSocial.platform || ''}
                      onChange={(e) => setCurrentSocial({ ...currentSocial, platform: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-bold text-gray-755 bg-white"
                    >
                      <option value="">-- Pilih Platform --</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="Website">Website Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Link URL</label>
                    <input 
                      type="url" 
                      value={currentSocial.url || ''}
                      onChange={(e) => setCurrentSocial({ ...currentSocial, url: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                      placeholder="https://example.com/username"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-divider flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Simpan Sosial Media</span>
                    </button>
                  </div>
                </form>
              )}

              {/* BERITA & PENGUMUMAN DIALOG */}
              {activeMenu === 'BERITA' && (
                <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Judul Pengumuman</label>
                    <input 
                      type="text" 
                      value={currentAnnouncement.title || ''}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green"
                      placeholder="Contoh: Jadwal Libur Lebaran, Promo Cek Kesehatan"
                    />
                  </div>

                  {/* Image View field & upload */}
                  <div className="flex flex-col items-center p-6 bg-soft-mint rounded-2xl border-2 border-dashed border-divider space-y-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">File Gambar Pengumuman</span>
                    
                    <div className="h-40 w-full max-w-md rounded-xl overflow-hidden border-2 border-white shadow-sm bg-warm-ivory flex items-center justify-center relative">
                      {currentAnnouncement.image ? (
                        <SafeImage 
                          src={currentAnnouncement.image} 
                          alt="Announcement preview" 
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-gray-400 space-y-1">
                          <Upload className="h-8 w-8 mx-auto stroke-1" />
                          <span className="text-[10px] block">Belum ada gambar terpilih</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <input 
                        type="file" 
                        ref={announcementInputRef}
                        onChange={handleAnnouncementUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button 
                        type="button"
                        onClick={() => announcementInputRef.current?.click()}
                        className="px-4 py-2 bg-white border border-divider hover:border-amber-500 hover:text-amber-600 text-body-text font-bold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-xs cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Pilih & Upload File Pengumuman</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider block font-mono">Mulai Tanggal Tampil</label>
                      <input 
                        type="date" 
                        value={currentAnnouncement.activeDate || ''}
                        onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, activeDate: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider block font-mono">Sampai Tanggal Tampil</label>
                      <input 
                        type="date" 
                        value={currentAnnouncement.closeDate || ''}
                        onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, closeDate: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 py-1">
                    <input 
                      type="checkbox"
                      id="ann-isactive"
                      checked={currentAnnouncement.isActive ?? true}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-divider text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="ann-isactive" className="text-xs font-semibold text-gray-750 cursor-pointer select-none">
                      Aktifkan Pengumuman (Langsung tampil di slider selamat datang)
                    </label>
                  </div>

                  <div className="pt-4 border-t border-divider flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Simpan Pengumuman</span>
                    </button>
                  </div>
                </form>
              )}

              {/* KAMAR RAWAT INAP, ICU, IGD DIALOG */}
              {(activeMenu === 'KAMAR_RAWAT_INAP' || activeMenu === 'KAMAR_ICU' || activeMenu === 'KAMAR_IGD') && (
                <form onSubmit={handleSaveRoom} className="space-y-4 text-left animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Tipe Kamar</label>
                      <input 
                        type="text" 
                        value={currentRoom.type || ''} 
                        disabled
                        className="w-full px-4 py-2 border border-gray-250 bg-soft-mint rounded-xl text-sm font-bold text-gray-650 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Kelas / Area Kamar</label>
                      <input 
                        type="text" 
                        value={currentRoom.class || ''} 
                        onChange={(e) => setCurrentRoom({ ...currentRoom, class: e.target.value })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-semibold"
                        placeholder="Contoh: Kelas I, VIP, ICU Utama, Area Red Zone"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Nama Kamar / No. Bed</label>
                    <input 
                      type="text" 
                      value={currentRoom.name || ''} 
                      onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-semibold"
                      placeholder="Contoh: Ruang Melati Bed 1A, Bed ICU 04"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Kapasitas (Jumlah Bed)</label>
                      <input 
                        type="number" 
                        min={1}
                        value={currentRoom.capacity ?? 1} 
                        onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Terpakai (Jumlah Bed Terisi)</label>
                      <input 
                        type="number" 
                        min={0}
                        max={currentRoom.capacity || 1}
                        value={currentRoom.occupied ?? 0} 
                        onChange={(e) => setCurrentRoom({ ...currentRoom, occupied: Math.min(parseInt(e.target.value) || 0, currentRoom.capacity || 1) })}
                        className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-body-text uppercase tracking-wider">Fasilitas Kamar</label>
                    <textarea 
                      value={currentRoom.facilities || ''} 
                      onChange={(e) => setCurrentRoom({ ...currentRoom, facilities: e.target.value })}
                      className="w-full px-4 py-2 border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yasmin-green min-h-[80px]"
                      placeholder="Contoh: AC, TV, Kamar Mandi Dalam, Sofa Bed, Oksigen Central"
                    />
                  </div>

                  <div className="pt-4 border-t border-divider flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-warm-ivory hover:bg-gray-200 text-body-text font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-yasmin-green hover:bg-deep-teal text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Simpan Kamar</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        </div>
      )}

      {/* MODAL DETAIL LAPORAN PASIEN */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-divider bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-display font-black text-lg text-headings">Detail Laporan Pasien</h3>
                <p className="text-xs text-gray-500 mt-1">ID Pasien: <strong>{selectedFeedback.patientId}</strong></p>
              </div>
              <button onClick={() => setSelectedFeedback(null)} className="p-2 bg-white rounded-full hover:bg-gray-200 border border-gray-200">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Kesan Umum Pasien:</span>
                <span className="text-base font-black text-emerald-900">{selectedFeedback.kesan}</span>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Rincian Pesan:</span>
                {selectedFeedback.messages.map((msg: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-headings text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">{msg.jenisPesan}</span>
                        <span className="text-xs font-bold text-gray-700">Unit: {msg.unitLayanan}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(msg.rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">"{msg.isiPesan}"</p>
                  </div>
                ))}
              </div>

              {selectedFeedback.attachments?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Lampiran Bukti:</span>
                  <div className="flex flex-wrap gap-3">
                    {selectedFeedback.attachments.map((file: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-2 bg-slate-50">
                        {file.dataUrl ? (
                          <img src={file.dataUrl} alt={file.name} className="h-24 w-auto rounded-lg object-cover cursor-pointer hover:opacity-80" onClick={() => setPreviewImage({ src: file.dataUrl, title: file.name })} />
                        ) : (
                          <div className="h-24 w-32 flex items-center justify-center text-xs text-gray-400 font-bold bg-white rounded-lg"><FileText className="h-6 w-6"/></div>
                        )}
                        <span className="block text-[9px] text-center mt-1 text-gray-500 truncate max-w-[120px]">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-divider bg-slate-50 flex justify-end gap-2">
              <button 
                onClick={() => { handleUpdateFeedbackStatus(selectedFeedback.id, 'resolved'); setSelectedFeedback(null); }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Tandai Selesai (Resolved)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM BANK */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-slate-50">
              <h4 className="font-display font-bold text-headings">{currentBank.id ? 'Edit Data Bank' : 'Tambah Data Bank'}</h4>
              <button onClick={() => setIsBankModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full cursor-pointer">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveBank} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Nama Bank</label>
                <input type="text" required value={currentBank.bankName} onChange={e => setCurrentBank({...currentBank, bankName: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yasmin-green outline-none" placeholder="Contoh: Bank Mandiri" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Nomor Rekening</label>
                <input type="text" required value={currentBank.accountNumber} onChange={e => setCurrentBank({...currentBank, accountNumber: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-yasmin-green outline-none" placeholder="1430030047508" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Atas Nama (Pemilik Rekening)</label>
                <input type="text" required value={currentBank.accountHolder} onChange={e => setCurrentBank({...currentBank, accountHolder: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yasmin-green outline-none" placeholder="PT Kharisma Husada" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="bankActive" checked={currentBank.isActive} onChange={e => setCurrentBank({...currentBank, isActive: e.target.checked})} className="w-4 h-4 rounded text-yasmin-green focus:ring-yasmin-green cursor-pointer" />
                <label htmlFor="bankActive" className="text-xs font-bold text-gray-700 cursor-pointer select-none">Tampilkan di Halaman Pendaftaran Pasien</label>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsBankModalOpen(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-yasmin-green hover:bg-deep-teal text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer">Simpan Data Bank</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-slate-50">
              <h4 className="font-display font-bold text-headings">{currentCategory.id ? 'Edit Kategori' : 'Tambah Kategori'}</h4>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full cursor-pointer"><X className="h-5 w-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Nama Kategori Spesialis</label>
                <input type="text" required value={currentCategory.name} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yasmin-green outline-none" placeholder="Nama Kategori Spesialis" />
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xs">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-yasmin-green text-white rounded-xl font-bold text-xs shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-divider">
              <span className="text-xs font-bold text-gray-750">{previewImage.title}</span>
              <button 
                onClick={() => setPreviewImage(null)}
                className="p-1.5 hover:bg-warm-ivory rounded-full transition-colors cursor-pointer text-body-text"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-soft-mint overflow-auto max-h-[75vh]">
              <SafeImage 
                src={previewImage.src} 
                alt={previewImage.title} 
                className="max-h-[70vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteConfirm && deleteConfirm.isOpen && (
        <div id="delete-confirm-modal" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-divider text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 text-rose-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-headings mb-2 font-display">Konfirmasi Hapus</h3>
            <p className="text-sm text-body-text mb-6">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-divider rounded-xl text-sm font-semibold text-gray-750 hover:bg-soft-mint cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  executeDelete(deleteConfirm.type, deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
