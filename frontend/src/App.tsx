import React, { useState, useEffect } from 'react';
import {
  Leaf, Calendar, X, MessageSquare, MapPin, Phone, Mail,
  ArrowRight, Clock, Heart, Smile, Star, Sparkles, ChevronRight, ChevronLeft,
  ArrowUp, ShieldAlert, BadgeCheck, CheckCircle2, Building, MessageSquareWarning, CalendarRange, Megaphone,
  Upload, Trash2, Paperclip, FileText, Image, UserPlus, UserCheck
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FindDoctor from './components/FindDoctor';
import HealthCenters from './components/HealthCenters';
import Komunitas from './components/Komunitas';
import GallerySection from './components/GallerySection';
import YasminKids from './components/YasminKids';
import YasminSquad from './components/YasminSquad';
import DonorDarah from './components/DonorDarah';
import YasminWomens from './components/YasminWomens';
import Fasilitas from './components/Fasilitas';
import GreenHealing from './components/GreenHealing';
import EdukasiKesehatan from './components/EdukasiKesehatan';
import CorporateHealthcare from './components/CorporateHealthcare';
import WhatsAppIcon from './components/WhatsAppIcon';
import ContactSection from './components/ContactSection';
import SearchResultsView from './components/SearchResultsView';

import { ActiveTabType, BookingState, Doctor } from './types';
import { DOCTORS_DATA } from './data';
import { getImgUrl } from './utils/imageUrl';
import TestimonialSection from './components/TestimonialSection';
import { useLanguage } from './hooks/useLanguage';
import { SafeImage } from './utils/imageUrl';
import { APP_TRANSLATIONS } from './translations';
import { EXTRA_TRANSLATIONS } from './translations_extra';
import AdminDashboard, { INITIAL_ANNOUNCEMENTS, INITIAL_ROOMS } from './components/AdminDashboard';
import { confirmDialog } from './lib/ui';
import AdminPendaftaranModule from './components/AdminPendaftaran';
import { doc, getDoc } from './lib/db';
import { fetchCollection, saveDocument, db } from './lib/db';
import { submitPendaftaran } from './lib/api';
import PatientRegistrationWizard from './components/PatientRegistrationWizard';
import PatientPortalDashboard from './components/PatientPortalDashboard';
import QueueStaffPanel from './pages/QueueStaff';
import QueueDisplay from './pages/QueueDisplay';

const SERVICE_TYPE_LABELS: Record<string, Record<'ID' | 'EN' | 'KR' | 'ZH' | 'AR', string>> = {
  "Poli Spesialis / Umum": {
    ID: "Poli Spesialis / Umum (Poli Utama)",
    EN: "Specialist / General Clinic (Main Clinic)",
    KR: "전문의 / 일반 클리닉 (메인 클리닉)",
    ZH: "专科 / 普通门诊 (主诊所)",
    AR: "عيادة أخصائي / عامة (العيادة الرئيسية)"
  },
  "Pelayanan Ibu & Anak": {
    ID: "Pelayanan Ibu & Anak (Maternity & Pediatrics)",
    EN: "Maternity & Pediatrics Services",
    KR: "모성 및 소아과 서비스",
    ZH: "妇产科及小儿科服务",
    AR: "خدمات الأمومة والأطفال"
  },
  "Persalinan Metode ERACS": {
    ID: "Persalinan Metode ERACS (Enhanced Recovery)",
    EN: "ERACS Delivery Method (Enhanced Recovery)",
    KR: "ERACS 분만법 (빠른 회복)",
    ZH: "ERACS 分娩法 (快速康复)",
    AR: "طريقة ولادة ERACS (التعافي السريع)"
  },
  "Klinik Fertilitas": {
    ID: "Klinik Fertilitas (IVF & IUI Support)",
    EN: "Fertility Clinic (IVF & IUI Support)",
    KR: "불임 클리닉 (IVF 및 IUI 지원)",
    ZH: "不孕不育诊所 (IVF 及 IUI 支持)",
    AR: "عيادة الخصوبة (دعم أطفال الأنابيب والتلقيح الصناعي)"
  },
  "Family Medical Check Up (MCU)": {
    ID: "Family Medical Check Up (MCU Keluarga)",
    EN: "Family Medical Check Up (Family MCU)",
    KR: "가족 종합 건강 검zin (가족 MCU)",
    ZH: "家庭体检 (家庭 MCU)",
    AR: "الفحص الطبي العائلي (MCU العائلي)"
  },
  "Klinik Berhenti Merokok": {
    ID: "Klinik Berhenti Merokok (Program Bebas Rokok)",
    EN: "Smoking Cessation Clinic (Smoke-Free Program)",
    KR: "금연 클리닉 (금연 프로그램)",
    ZH: "戒烟诊所 (无烟计划)",
    AR: "عيادة الإقلاع عن التدخين (برنامج خالي من التدخين)"
  },
  "Konsultasi Psikologis Remaja": {
    ID: "Konsultasi Psikologis Remaja",
    EN: "Teenager Psychological Counseling",
    KR: "청소년 심리 상담",
    ZH: "青少年心理咨询",
    AR: "الاستشارات النفسية للمراهقين"
  },
  "Yasmin Home Care": {
    ID: "Yasmin Home Care (Kunjungan Medis ke Rumah)",
    EN: "Yasmin Home Care (Medical Home Visits)",
    KR: "야스민 홈 케어 (가정 방문 의료)",
    ZH: "雅斯敏家庭护理 (医疗上门服务)",
    AR: "رعاية ياسمين المنزلية (زيارات طبية منزلية)"
  },
  "Rehabilitasi Medik": {
    ID: "Rehabilitasi Medik & Fisioterapi",
    EN: "Medical Rehabilitation & Physiotherapy",
    KR: "재활 의학 및 물리 치료",
    ZH: "康复医学与物理治疗",
    AR: "إعادة التأهيل الطبي والعلاج الطبيعي"
  },
  "Rawat Inap Bertema Resort": {
    ID: "Rawat Inap Bertema Resort (VIP / VVIP Suites)",
    EN: "Resort-Themed Inpatient (VIP / VVIP Suites)",
    KR: "리조트 테마 입원실 (VIP / VVIP 스위트)",
    ZH: "度假村主题住院 (VIP / VVIP 套房)",
    AR: "إقامة داخلية بطابع المنتجع (أجنحة VIP / VVIP)"
  },
  "IGD & Ambulans 24 Jam": {
    ID: "IGD & Ambulans 24 Jam (Emergency Call)",
    EN: "24-Hour ER & Ambulance (Emergency Call)",
    KR: "24시간 응급실 및 구급차 (긴급 호출)",
    ZH: "24小时急诊与救护车 (紧急呼叫)",
    AR: "الطوارئ والإسعاف ٢٤ ساعة (اتصال طارئ)"
  },
  "Jaminan BPJS Kesehatan": {
    ID: "Jaminan BPJS Kesehatan (Poli Terintegrasi)",
    EN: "BPJS Health Insurance (Integrated Clinic)",
    KR: "국가 BPJS 건강보험 (통합 클리닉)",
    ZH: "印尼 BPJS 国家医保 (一体化门诊)",
    AR: "ضمان BPJS الصحي (العيادة المتكاملة)"
  },
  "Asuransi & Kemitraan Swasta": {
    ID: "Asuransi & Kemitraan Swasta (Rekanan Korporat)",
    EN: "Insurance & Private Partnership (Corporate Partner)",
    KR: "보험 및 민간 파트너십 (기업 파特너)",
    ZH: "商业保险与私人合作 (企业伙伴)",
    AR: "التأمين والشراكات الخاصة (شركاء الشركات)"
  }
};

const translateDays = (days: string[], lang: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR') => {
  const map: Record<string, Record<string, string>> = {
    'Senin': { ID: 'Senin', EN: 'Monday', KR: '월요일', ZH: '周一', AR: 'الإثنين' },
    'Selasa': { ID: 'Selasa', EN: 'Tuesday', KR: '화요일', ZH: '周二', AR: 'الثلاثاء' },
    'Rabu': { ID: 'Rabu', EN: 'Wednesday', KR: '수요일', ZH: '周三', AR: 'الأربعاء' },
    'Kamis': { ID: 'Kamis', EN: 'Thursday', KR: '목요일', ZH: '周四', AR: 'الخميس' },
    'Jumat': { ID: 'Jumat', EN: 'Friday', KR: '금요일', ZH: '周五', AR: 'الجمعة' },
    'Sabtu': { ID: 'Sabtu', EN: 'Saturday', KR: '토요일', ZH: '周六', AR: 'السبت' },
    'Minggu': { ID: 'Minggu', EN: 'Sunday', KR: '일요일', ZH: '周日', AR: 'الأحد' }
  };
  return days.map(d => map[d]?.[lang] || d).join(', ');
};

const getDayNameIndonesian = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
};

const getDayNameInLang = (dateStr: string, lang: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR'): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const dayIndex = date.getDay();
  const dayNames: Record<'ID' | 'EN' | 'KR' | 'ZH' | 'AR', string[]> = {
    ID: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    EN: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    KR: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    ZH: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    AR: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  };
  const list = dayNames[lang] || dayNames['ID'];
  return list[dayIndex];
};

const getUpcomingDoctorDates = (docDays: string[], lang: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR', limit = 5): { dateStr: string; dayName: string; displayDate: string }[] => {
  const result: { dateStr: string; dayName: string; displayDate: string }[] = [];
  const indonesianDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  
  const now = new Date();
  for (let i = 0; i < 21; i++) {
    if (result.length >= limit) break;
    const tempDate = new Date();
    tempDate.setDate(now.getDate() + i);
    const dayOfWeekIndo = indonesianDays[tempDate.getDay()];
    
    if (docDays.includes(dayOfWeekIndo)) {
      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, '0');
      const day = String(tempDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayNameInLang = getDayNameInLang(dateStr, lang);
      const formattedDate = tempDate.toLocaleDateString(lang === 'ID' ? 'id-ID' : lang === 'KR' ? 'ko-KR' : lang === 'ZH' ? 'zh-CN' : lang === 'AR' ? 'ar-EG' : 'en-US', {
        day: 'numeric',
        month: 'short'
      });
      
      result.push({
        dateStr,
        dayName: dayNameInLang,
        displayDate: `${dayNameInLang}, ${formattedDate}`
      });
    }
  }
  return result;
};

export default function App() {
  const [currentLangCode, setCurrentLangCode] = useState<'ID' | 'EN' | 'KR' | 'ZH' | 'AR'>('ID');
  const [activeTab, setActiveTab] = useState<ActiveTabType>('BERANDA');
  const [searchTerm, setSearchTerm] = useState('');

  // [SINKRONISASI URL MANDIRI /admin dan /admin/pendaftaran]
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  // Pantau tombol Back/Forward browser
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Jika activeTab berganti via klik kanan footer logo, otomatis ubah URL di browser bar
  useEffect(() => {
    if (activeTab === 'ADMIN_DASHBOARD') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
        setCurrentPath('/admin');
      }
    } else if (activeTab === 'ADMIN_PENDAFTARAN') {
      if (window.location.pathname !== '/admin/pendaftaran') {
        window.history.pushState({}, '', '/admin/pendaftaran');
        setCurrentPath('/admin/pendaftaran');
      }
    }
  }, [activeTab]);

  const [rsInfo, setRsInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_rs_info');
      return saved ? JSON.parse(saved) : {
        name: 'RS Yasmin Banyuwangi',
        address: 'Jl. Letkol Istiqlah No. 80-84, Mojopanggung, Kec. Banyuwangi, Kab. Banyuwangi, Jawa Timur 68425',
        phone: '0333-424671',
        email: 'yasmin_hospital@yahoo.com',
        whatsapp: '+62 852 5935 3001',
        accreditation: 'Terakreditasi Paripurna Kemenkes RI'
      };
    } catch (e) {
      return {
        name: 'RS Yasmin Banyuwangi',
        address: 'Jl. Letkol Istiqlah No. 80-84, Mojopanggung, Kec. Banyuwangi, Kab. Banyuwangi, Jawa Timur 68425',
        phone: '0333-424671',
        email: 'yasmin_hospital@yahoo.com',
        whatsapp: '+62 852 5935 3001',
        accreditation: 'Terakreditasi Paripurna Kemenkes RI'
      };
    }
  });

  const [doctorsList, setDoctorsList] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('admin_doctors_list');
    if (saved) {
      try {
        const parsed: Doctor[] = JSON.parse(saved);
        let updated = false;
        
        // Map and sync existing doctors
        const syncedMapped = parsed.map(doc => {
          const matched = DOCTORS_DATA.find(d => d.id === doc.id || d.name.toLowerCase().trim() === doc.name.toLowerCase().trim());
          if (matched) {
            let needsUpdate = false;
            const temp = { ...doc };
            if (matched.bio !== doc.bio) {
              temp.bio = matched.bio;
              needsUpdate = true;
            }
            if (matched.image !== doc.image) {
              temp.image = matched.image;
              needsUpdate = true;
            }
            if (matched.specialty !== doc.specialty) {
              temp.specialty = matched.specialty;
              needsUpdate = true;
            }
            if (matched.subSpecialty !== doc.subSpecialty) {
              temp.subSpecialty = matched.subSpecialty;
              needsUpdate = true;
            }
            if (matched.speciali !== doc.speciali) {
              temp.speciali = matched.speciali;
              needsUpdate = true;
            }
            if (matched.experience !== doc.experience) {
              temp.experience = matched.experience;
              needsUpdate = true;
            }
            if (matched.rating !== doc.rating) {
              temp.rating = matched.rating;
              needsUpdate = true;
            }
            if (matched.education !== doc.education) {
              temp.education = matched.education;
              needsUpdate = true;
            }
            if (JSON.stringify(matched.schedule) !== JSON.stringify(doc.schedule)) {
              temp.schedule = matched.schedule;
              needsUpdate = true;
            }
            if (needsUpdate) {
              updated = true;
              return temp;
            }
          }
          return doc;
        });

        // Deduplicate syncedMapped by name
        const synced: Doctor[] = [];
        const seenNames = new Set<string>();
        syncedMapped.forEach(doc => {
          const normName = doc.name.toLowerCase().trim();
          if (!seenNames.has(normName)) {
            seenNames.add(normName);
            synced.push(doc);
          } else {
            updated = true;
          }
        });

        // Track deleted IDs
        const deletedIdsStr = localStorage.getItem('admin_deleted_doctors');
        const deletedIds: string[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];

        // Append any doctor from DOCTORS_DATA that is not in the saved list (matched by id or name) and not deleted
        const missingDoctors = DOCTORS_DATA.filter(d => 
          !deletedIds.includes(d.id) &&
          !synced.some(s => s.id === d.id || s.name.toLowerCase().trim() === d.name.toLowerCase().trim())
        );

        if (missingDoctors.length > 0) {
          synced.push(...missingDoctors);
          updated = true;
        }

        // Final deduplication pass
        const finalSynced: Doctor[] = [];
        const finalSeen = new Set<string>();
        synced.forEach(doc => {
          const normName = doc.name.toLowerCase().trim();
          if (!finalSeen.has(normName)) {
            finalSeen.add(normName);
            finalSynced.push(doc);
          } else {
            updated = true;
          }
        });

        if (updated) {
          return finalSynced;
        }
        return finalSynced;
      } catch (e) {
        console.error(e);
        // Fallback with deduplicated DOCTORS_DATA
        const uniqueData: Doctor[] = [];
        const seenNames = new Set<string>();
        DOCTORS_DATA.forEach(d => {
          const normName = d.name.toLowerCase().trim();
          if (!seenNames.has(normName)) {
            seenNames.add(normName);
            uniqueData.push(d);
          }
        });
        return uniqueData;
      }
    }
    
    // Fallback with deduplicated DOCTORS_DATA
    const uniqueData: Doctor[] = [];
    const seenNames = new Set<string>();
    DOCTORS_DATA.forEach(d => {
      const normName = d.name.toLowerCase().trim();
      if (!seenNames.has(normName)) {
        seenNames.add(normName);
        uniqueData.push(d);
      }
    });
    return uniqueData;
  });

  const handleUpdateDoctors = (newDoctors: Doctor[]) => {
    setDoctorsList(newDoctors);
    
    // Keep track of deleted doctor IDs
    const deleted = DOCTORS_DATA.filter(d => 
      !newDoctors.some(n => n.id === d.id || n.name.toLowerCase().trim() === d.name.toLowerCase().trim())
    ).map(d => d.id);
        
  };

  const handleSyncSystemDoctors = () => {
    const saved = localStorage.getItem('admin_doctors_list') || '[]';
    let parsed: Doctor[] = [];
    try {
      parsed = JSON.parse(saved);
    } catch (e) {
      parsed = [];
    }
    
    // Sync existing/matched doctors, adding missing ones, keeping newly custom added ones
    const synced = parsed.map(doc => {
      const matched = DOCTORS_DATA.find(d => d.id === doc.id || d.name.toLowerCase().trim() === doc.name.toLowerCase().trim());
      if (matched) {
        // Force update image and sync other essential details
        return {
          ...doc,
          image: matched.image,
          bio: matched.bio,
          specialty: matched.specialty,
          subSpecialty: matched.subSpecialty,
          speciali: matched.speciali,
          experience: matched.experience,
          rating: matched.rating,
          education: matched.education,
          schedule: matched.schedule
        };
      }
      return doc;
    });

    // Append any doctor from DOCTORS_DATA that is not in the list
    const missing = DOCTORS_DATA.filter(d => 
      !synced.some(s => s.id === d.id || s.name.toLowerCase().trim() === d.name.toLowerCase().trim())
    );

    const merged = [...synced, ...missing];
    
    // Deduplicate merged by name
    const uniqueMerged: Doctor[] = [];
    const seenNames = new Set<string>();
    merged.forEach(doc => {
      const normName = doc.name.toLowerCase().trim();
      if (!seenNames.has(normName)) {
        seenNames.add(normName);
        uniqueMerged.push(doc);
      }
    });

    setDoctorsList(uniqueMerged);
    
    localStorage.removeItem('admin_deleted_doctors'); // Clear deleted log to allow full restore
    
    alert('✅ Sinkronisasi Berhasil: Seluruh foto dan data sistem dokter telah diperbarui ke versi terbaru!');
  };

  const handleResetSystemDoctors = async () => {
    if (await confirmDialog('Apakah Anda yakin ingin mengatur ulang semua data dokter kembali ke bawaan sistem? Perubahan kustom Anda akan hilang.')) {
      // Deduplicate DOCTORS_DATA by name
      const uniqueData: Doctor[] = [];
      const seenNames = new Set<string>();
      DOCTORS_DATA.forEach(d => {
        const normName = d.name.toLowerCase().trim();
        if (!seenNames.has(normName)) {
          seenNames.add(normName);
          uniqueData.push(d);
        }
      });
      setDoctorsList(uniqueData);
      
      localStorage.removeItem('admin_deleted_doctors');
      
      alert('♻️ Reset Berhasil: Data dokter telah dikembalikan ke bawaan sistem!');
    }
  };

  const t = APP_TRANSLATIONS[currentLangCode];
  const tReg = EXTRA_TRANSLATIONS.PENDAFTARAN[currentLangCode];

  useEffect(() => {
    const saved = localStorage.getItem('yasmin_pref_lang');
    if (saved && ['ID', 'EN', 'KR', 'ZH', 'AR'].includes(saved)) {
      setCurrentLangCode(saved as any);
    }
  }, []);

  // Global protection for text block/copy and context menu (except inside ADMIN_DASHBOARD)
  useEffect(() => {
    const isEditingAdmin = activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN';

    if (isEditingAdmin) {
      document.body.style.userSelect = 'text';
      document.body.style.webkitUserSelect = 'text';
      // Do not return early; instead, we bind capturing listeners that will actively bypass any block
    } else {
      // Block text selection and dragging on all content pages
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }

    const handleCopy = (e: ClipboardEvent) => {
      if (activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN') return; // Completely bypass in admin portal
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return; // Allow copy in form fields
      }
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      if (activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN') return; // Completely bypass in admin portal
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return; // Allow cut in form fields
      }
      e.preventDefault();
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN') return; // Completely bypass in admin portal
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Let the footer logo trigger its onContextMenu event but keep standard context menu copy disabled
      const isFooterLogo = target.closest('[title*="Klik kanan logo"]') || target.closest('#logo-fallback-footer');
      if (isFooterLogo) {
        return;
      }
      
      // Allow right-click in form fields for accessibility (paste, search, etc.)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN') return; // Completely bypass in admin portal
      const isControl = e.ctrlKey || e.metaKey;
      if (isControl && ['c', 'x', 'a', 'C', 'X', 'A'].includes(e.key)) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return; // Allow keyboard shortcuts in form fields
        }
        e.preventDefault();
      }
    };

    const handleSelectStart = (e: Event) => {
      if (activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN') return; // Completely bypass in admin portal
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      e.preventDefault();
    };

    const handleDragStart = (e: Event) => {
      if (activeTab === 'ADMIN_DASHBOARD' || activeTab === 'ADMIN_PENDAFTARAN') return; // Completely bypass in admin portal
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('copy', handleCopy, { capture: true });
    window.addEventListener('cut', handleCut, { capture: true });
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('selectstart', handleSelectStart, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });

    return () => {
      document.body.style.userSelect = 'text';
      document.body.style.webkitUserSelect = 'text';
      window.removeEventListener('copy', handleCopy, { capture: true });
      window.removeEventListener('cut', handleCut, { capture: true });
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('selectstart', handleSelectStart, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
    };
  }, [activeTab]);

  // berita Active Announcement Popup States
  const [activeAnnouncements, setActiveAnnouncements] = useState<any[]>([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [currentAnnIndex, setCurrentAnnIndex] = useState(0);
  const [autoplayTrigger, setAutoplayTrigger] = useState(0);

  // Info Modals States
  const [showKamarInfoModal, setShowKamarInfoModal] = useState(false);
  const [showAmbulanceInfoModal, setShowAmbulanceInfoModal] = useState(false);
  const [roomsList, setRoomsList] = useState<any[]>([]);
  const [selectedKamarTab, setSelectedKamarTab] = useState<'Rawat Inap' | 'ICU' | 'IGD'>('Rawat Inap');

  // Load rooms data
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const cloudRooms = await fetchCollection('rooms');
        if (cloudRooms.length > 0) {
          setRoomsList(cloudRooms);
          
          return;
        }
      } catch (e) {
        console.error('Error fetching rooms from Firestore:', e);
      }

      let saved = localStorage.getItem('admin_rooms');
      if (!saved) {
        
        saved = JSON.stringify(INITIAL_ROOMS);
      }
      try {
        setRoomsList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    
    loadRooms();
    window.addEventListener('yasmin_rooms_update', loadRooms);
    return () => window.removeEventListener('yasmin_rooms_update', loadRooms);
  }, []);

  // Load and validate announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      let list = [];
      try {
        const cloudAnnouncements = await fetchCollection('announcements');
        if (cloudAnnouncements.length > 0) {
          // Bersihkan path gambar yang rusak (jika ada)
          const healedAnns = cloudAnnouncements.map((ann: any) => {
            if (ann.image && (ann.image.includes('http') || ann.image.includes('run.app') || ann.image.includes('import.meta.url') || ann.image.startsWith('http'))) {
              const assetsIndex = ann.image.indexOf('/assets/images/');
              if (assetsIndex !== -1) {
                return { ...ann, image: ann.image.substring(assetsIndex) };
              }
            }
            return ann;
          });
          list = healedAnns;
        } else {
          throw new Error('No announcements in Firestore');
        }
      } catch (e) {
        // Jika API gagal, gunakan data awal (fallback) langsung dari memori
        list = INITIAL_ANNOUNCEMENTS;
      }
      
      try {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const activeList = list.filter((a: any) => {
          if (!a.isActive) return false;
          if (a.activeDate && todayStr < a.activeDate) return false;
          if (a.closeDate && todayStr > a.closeDate) return false;
          return true;
        });
        
        setActiveAnnouncements(activeList);
        
        if (activeList.length > 0) {
          setShowWelcomePopup(true);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadAnnouncements();
    window.addEventListener('yasmin_announcements_update', loadAnnouncements);
    return () => window.removeEventListener('yasmin_announcements_update', loadAnnouncements);
  }, []);

  // Load hospital info (rs_info) from Firestore on mount
  useEffect(() => {
    const loadHospitalInfo = async () => {
      try {
        const infoDocRef = doc(db, 'rs_info', 'hospital_info');
        const infoSnap = await getDoc(infoDocRef);
        if (infoSnap.exists()) {
          const data = infoSnap.data();
          setRsInfo(data);
        }
      } catch (e) {
        console.error('Failed to load hospital info from Firestore:', e);
      }
    };
    loadHospitalInfo();

    // Listen to local storage changes to keep it in sync in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_rs_info' && e.newValue) {
        try {
          setRsInfo(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load doctors dari backend. Jika DB kosong, pakai data lokal tanpa seeding otomatis.
  useEffect(() => {
      const loadDoctors = async () => {
          try {
              const cloudDocs = await fetchCollection('doctors');
              if (cloudDocs.length > 0) {
                  setDoctorsList(cloudDocs);
              } else {
                  // DB kosong — fallback ke data lokal. Tidak ada sync ke server.
                  const localSaved = localStorage.getItem('admin_doctors_list');
                  let listToUse = DOCTORS_DATA;
                  if (localSaved) {
                      try { listToUse = JSON.parse(localSaved); } catch (e) {}
                  }
                  setDoctorsList(listToUse);
              }
          } catch (e) {
              console.error('Error loading doctors:', e);
          }
      };
      loadDoctors();
  }, []);

  // Auto-sliding effect for Welcome Popup Slider (4 seconds cycle), resets whenever autoplayTrigger changes
  useEffect(() => {
    if (!showWelcomePopup || activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAnnIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [showWelcomePopup, activeAnnouncements.length, autoplayTrigger]);

  // Info Header Trigger Handlers
  const handleOpenInfoberita = () => {
    let saved = localStorage.getItem('admin_announcements');
    if (!saved) {
      saved = JSON.stringify(INITIAL_ANNOUNCEMENTS);
    }
    
    try {
      const list = JSON.parse(saved);
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`; // Precise local timezone date

      const activeList = list.filter((a: any) => {
        if (!a.isActive) return false;
        if (a.activeDate && todayStr < a.activeDate) return false;
        if (a.closeDate && todayStr > a.closeDate) return false;
        return true;
      });
      
      if (activeList.length === 0) {
        alert("Belum ada info berita");
      } else {
        setActiveAnnouncements(activeList);
        setCurrentAnnIndex(0);
        setShowWelcomePopup(true);
      }
    } catch (e) {
      alert("Belum ada info berita");
    }
  };

  const handleOpenInfoKamar = () => {
    setSelectedKamarTab('Rawat Inap');
    setShowKamarInfoModal(true);
  };

  const handleOpenInfoAmbulance = () => {
    setShowAmbulanceInfoModal(true);
  };

  // Escape key listener to close chat widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setChatWidgetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string>('');
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  
  // Back to Top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Floating chat state
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);

  // Booking Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [bookingTab, setBookingTab] = useState<'TERDAFTAR' | 'BARU'>('BARU');
  const [bookingForm, setBookingForm] = useState<BookingState>({
    patientName: '',
    phone: '',
    patientType: 'Umum',
    bpjsNumber: '',
    selectedDoctorId: '',
    selectedDate: '',
    selectedTimeSlot: 'Pagi (08:00 - 11:30)',
    complaint: '',
    whatsappConsent: true,
    isRegisteredPatient: false,
    kiupNumber: '',
    serviceType: 'Poli Spesialis / Umum',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki',
    address: '',
    insuranceProvider: '',
    insuranceNumber: '',
    ktpFile: '',
    insuranceFile: '',
    photoFile: ''
  });

  const [bookingReceipt, setBookingReceipt] = useState<{ id: string; timestamp: string } | null>(null);
  const [bookingSpecialtyFilter, setBookingSpecialtyFilter] = useState<string>('Semua');

  // Captcha & email delivery simulation states
  const [captchaCode, setCaptchaCode] = useState<string>('YSM88');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null);
  const [csvFileName, setCsvFileName] = useState<string>('');

  const regenerateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError(null);
  };

  useEffect(() => {
    if (activeTab === 'PENDAFTARAN') {
      regenerateCaptcha();
    }
  }, [activeTab]);

  // Synchronize selectedTimeSlot whenever selectedDoctorId changes to ensure it's always one of the doctor's actual slots
  useEffect(() => {
    if (bookingForm.selectedDoctorId) {
      const targetDoc = doctorsList.find(d => d.id === bookingForm.selectedDoctorId);
      if (targetDoc && targetDoc.schedule?.hours) {
        const slots = targetDoc.schedule.hours.split(',').map(h => h.trim()).filter(Boolean);
        if (slots.length > 0) {
          if (!slots.includes(bookingForm.selectedTimeSlot)) {
            setBookingForm(prev => ({ ...prev, selectedTimeSlot: slots[0] }));
          }
        }
      }
    }
  }, [bookingForm.selectedDoctorId, doctorsList]);

  // Scroll and responsive trackers
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scrolling to specific sections on home page
  const handleScrollToSection = (sectionId: string) => {
    setActiveTab('BERANDA');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Open the online registration Booking Wizard / Dedicated Page
  const handleOpenBookingWizard = () => {
    const adminWhatsApp = "6285259353001"; // Ganti dengan nomor WA Customer Service RS Yasmin
    const pesanAwal = "Halo Admin Pendaftaran RS Yasmin, saya ingin melakukan pendaftaran rawat jalan online.";
    const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(pesanAwal)}`;
    window.open(waUrl, '_blank');
  };

  // Select health category & focus center block
  const handleSelectHealthCenter = (centerId: string) => {
    setSelectedCenterId(centerId);
    setActiveTab('PUSAT KESEHATAN');
  };

  const handleSelectSubmenu = (submenuId: string) => {
    if (submenuId === 'gallery') {
      setActiveTab('GALLERY');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }
    
    if (submenuId === 'hubungi-kami') {
      setTimeout(() => {
        const el = document.getElementById('contact-us-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return;
    }

    setActiveTab('TENTANG KAMI');
    
    setTimeout(() => {
      let targetId = '';
      if (submenuId === 'sambutan') targetId = 'sambutan-direktur';
      else if (submenuId === 'visi-misi') targetId = 'vision-mission-section';
      else if (submenuId === 'prestasi') targetId = 'prestasi-section';
      else if (submenuId === 'pillars') targetId = 'pillars-section';
      else if (submenuId === 'mitra') targetId = 'mitra-kerjasama-section';
      else if (submenuId === 'faq') targetId = 'faq-section';
      else if (submenuId === 'testimoni') targetId = 'testimoni-section';
      
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Tabular Form verification & reservation simulation
  const handleFormPendaftaran = async (e: React.FormEvent) => {
    e.preventDefault();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const targetDoctor = doctorsList.find(d => d.id === bookingForm.selectedDoctorId);

    // =========================================================================
    // [PALANG PINTU 1]: CEK JAM SESI LANGSUNG DI AWAL (HARD STOP)
    // =========================================================================
    const now = new Date();
    const todayStrCheck = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (bookingForm.selectedDate === todayStrCheck) {
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const match = bookingForm.selectedTimeSlot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      
      if (match) {
        const endMins = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
        
        // JIKA JAM SEKARANG SUDAH MELEWATI BATAS JAM SESI:
        if (currentMins >= endMins) {
          alert(`⚠️ Sesi Kunjungan Telah Berakhir!\n\nSesi jam ${bookingForm.selectedTimeSlot} untuk hari ini sudah berakhir (sekarang pukul ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}).\n\nSilakan pilih sesi jam berikutnya atau pilih tanggal lain.`);
          return; // <-- STOP LANGSUNG DI SINI! Tidak akan pernah bisa lanjut mendaftar.
        }
      }
    }
    // =========================================================================

    const tReg = EXTRA_TRANSLATIONS.PENDAFTARAN[currentLangCode];
    // ... (sisa kode captcha dan validasi ke bawahnya) ...

    // Captcha verification first!
    if (!captchaInput || captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError(tReg.errCaptcha || "Captcha verification failed. Case-insensitive code must match exactly.");
      return;
    }

    setCaptchaError(null);

    // Field-by-field verification (Pengecekan field)
    const errors: string[] = [];
    if (!bookingForm.patientName?.trim()) {
      errors.push(tReg.lblPatientName + (currentLangCode === 'ID' ? " harus diisi." : " is required."));
    }

    if (bookingTab === 'TERDAFTAR') {
      if (!bookingForm.kiupNumber?.trim()) {
        errors.push(tReg.lblKiupNo + (currentLangCode === 'ID' ? " harus diisi." : " is required."));
      }
    } else {
      if (!bookingForm.phone?.trim()) {
        errors.push(tReg.lblPhone + (currentLangCode === 'ID' ? " harus diisi." : " is required."));
      }
      
      // NIK/KTP validation
      if (!bookingForm.nik?.trim() || bookingForm.nik.trim().length !== 16) {
        errors.push(tReg.errNIKLen || "Nomor NIK harus terdiri dari 16 digit angka.");
      }
      
      // Birth Place & Date validation
      if (!bookingForm.birthPlace?.trim()) {
        errors.push(currentLangCode === 'ID' ? "Tempat Lahir harus diisi." : "Birth Place is required.");
      }
      if (!bookingForm.birthDate) {
        errors.push(currentLangCode === 'ID' ? "Tanggal Lahir harus diisi." : "Birth Date is required.");
      }
      
      // Address validation
      if (!bookingForm.address?.trim()) {
        errors.push(tReg.errAddress || "Alamat lengkap pasien harus diisi.");
      }

      // Coverage/Insurance specific checks
      if (bookingForm.patientType === 'BPJS' && !bookingForm.bpjsNumber?.trim()) {
        errors.push(tReg.lblBpjsNo + (currentLangCode === 'ID' ? " harus diisi." : " is required."));
      }
      if (bookingForm.patientType === 'Asuransi') {
        if (!bookingForm.insuranceProvider?.trim() || !bookingForm.insuranceNumber?.trim()) {
          errors.push(tReg.errInsurance || "Nama asuransi dan nomor kartu kepesertaan harus diisi.");
        }
      }

      // Upload files evidence validation
      if (!bookingForm.ktpFile) {
        errors.push(currentLangCode === 'ID' ? "Foto KTP / Kartu Identitas harus diunggah." : "KTP / ID Card photo must be uploaded.");
      }
      if (!bookingForm.photoFile) {
        errors.push(currentLangCode === 'ID' ? "Pas Foto Terbaru pasien harus diunggah." : "Recent portrait photo of the patient must be uploaded.");
      }
      if ((bookingForm.patientType === 'BPJS' || bookingForm.patientType === 'Asuransi') && !bookingForm.insuranceFile) {
        errors.push(currentLangCode === 'ID' ? "Foto Kartu Jaminan (BPJS / Asuransi) harus diunggah." : "Coverage card (BPJS / Insurance) must be uploaded.");
      }

      if (!bookingForm.complaint?.trim()) {
        errors.push(tReg.lblComplaint + (currentLangCode === 'ID' ? " harus diisi." : " is required."));
      }
    }

    if (!bookingForm.selectedDoctorId) {
      errors.push(tReg.lblDoctorSelect + (currentLangCode === 'ID' ? " harus dipilih." : " must be selected."));
    }
    if (!bookingForm.selectedDate) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      if (bookingForm.selectedDate === todayStr) {
        const currentMinutes = today.getHours() * 60 + today.getMinutes(); // Konversi jam sekarang ke menit

        // Ekstrak jam selesai dari slot waktu (misal "08:00 - 12:00" -> jam 12:00)
        const timeMatch = bookingForm.selectedTimeSlot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        
        if (timeMatch) {
          const endHour = parseInt(timeMatch[3], 10);
          const endMinute = parseInt(timeMatch[4], 10);
          const slotEndMinutes = endHour * 60 + endMinute;

          // Jika jam sekarang sudah melewati batas jam selesai sesi
          if (currentMinutes >= slotEndMinutes) {
            errors.push(`Sesi kunjungan (${timeMatch[0]}) untuk hari ini sudah berakhir (sekarang pukul ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}). Silakan pilih sesi berikutnya atau pilih tanggal lain.`);
          }
        }
      }
      errors.push(tReg.lblDateSelect + (currentLangCode === 'ID' ? " harus diisi." : " is required."));
    } else {
      const targetDoctor = doctorsList.find(d => d.id === bookingForm.selectedDoctorId);
      if (targetDoctor) {
        const selectedDayNameIndo = getDayNameIndonesian(bookingForm.selectedDate);
        if (!targetDoctor.schedule.days.includes(selectedDayNameIndo)) {
          const scheduleDaysStr = translateDays(targetDoctor.schedule.days, currentLangCode);
          const errStr = currentLangCode === 'ID' 
            ? `Dokter ${targetDoctor.name} tidak memiliki jadwal praktek pada hari ${selectedDayNameIndo}. Silakan pilih tanggal yang jatuh pada hari: ${scheduleDaysStr}.` 
            : currentLangCode === 'EN'
              ? `Dr. ${targetDoctor.name} does not practice on ${selectedDayNameIndo}. Please select a date on: ${scheduleDaysStr}.`
              : currentLangCode === 'KR'
                ? `${targetDoctor.name} 의사는 ${selectedDayNameIndo}에 진료 일정이 없습니다. 진료 요일: ${scheduleDaysStr} 중에서 선택하세요.`
                : currentLangCode === 'ZH'
                  ? `${targetDoctor.name} 医生在 ${selectedDayNameIndo} 无排班。请选择以下排班日：${scheduleDaysStr}。`
                  : `الطبيب ${targetDoctor.name} لا يمارس العمل في يوم ${selectedDayNameIndo}. يرجى اختيار تاريخ في أيام: ${scheduleDaysStr}.`;
          errors.push(errStr);
        }
      }
    }

    if (errors.length > 0) {
      alert("⚠️ " + (currentLangCode === 'ID' ? "Pendaftaran Belum Lengkap" : "Registration Incomplete") + ":\n\n" + errors.map(err => `• ${err}`).join("\n"));
      return;
    }

    // ID tiket sekarang dibuat oleh backend (bukan di browser), supaya
    // satu-satunya sumber kebenaran untuk nomor tiket ada di server —
    // sinkron dengan tiket yang dibuat lewat bot WhatsApp juga.
    let record: { id: string; createdAt: number };
    try {
      record = await submitPendaftaran({
        patientName: bookingForm.patientName,
        phone: bookingForm.phone,
        patientType: bookingForm.patientType,
        nik: bookingForm.nik,
        birthPlace: bookingForm.birthPlace,
        birthDate: bookingForm.birthDate,
        gender: bookingForm.gender,
        address: bookingForm.address,
        bpjsNumber: bookingForm.bpjsNumber,
        insuranceProvider: bookingForm.insuranceProvider,
        insuranceNumber: bookingForm.insuranceNumber,
        isRegisteredPatient: bookingTab === 'TERDAFTAR',
        kiupNumber: bookingForm.kiupNumber,
        selectedDoctorId: targetDoctor ? targetDoctor.name : bookingForm.selectedDoctorId,
        selectedDate: bookingForm.selectedDate,
        selectedTimeSlot: bookingForm.selectedTimeSlot,
        complaint: bookingForm.complaint,
        serviceType: bookingForm.serviceType,
        whatsappConsent: !!bookingForm.whatsappConsent,
      });
    } catch (submitError) {
      console.error('Gagal mengirim pendaftaran ke backend:', submitError);
      alert(
        "⚠️ " + (currentLangCode === 'ID'
          ? "Pendaftaran gagal dikirim. Periksa koneksi internet Anda dan coba lagi. Jika masalah berlanjut, hubungi hotline RS Yasmin."
          : "Registration failed to send. Please check your internet connection and try again. If the problem persists, contact RS Yasmin hotline.")
      );
      return; // Jangan lanjut ke step 5 kalau gagal — pasien tidak boleh mengira sudah terdaftar.
    }

    const uniqueId = record.id;
    const dateObj = new Date(record.createdAt || Date.now());
    const formattedTime = dateObj.toLocaleDateString(currentLangCode === 'ID' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ' ' + dateObj.toLocaleTimeString(currentLangCode === 'ID' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });

    setBookingReceipt({
      id: uniqueId,
      timestamp: formattedTime
    });

    // Generate real CSV database attachment
    const csvHeader = 'ID Pendaftaran,Waktu Pendaftaran,Nama Pasien,Status Pasien,No HP Pasien,NIK Pasien,Tempat Lahir,Tanggal Lahir,Jenis Kelamin,Alamat Pasien,Jenis Jaminan,Provider Jaminan,Nomor Kartu Jaminan,Berkas KTP,Berkas Kartu Jaminan,Berkas Pas Foto,Dokter Id,Tanggal Kunjungan,Sesi Kunjungan,Keluhan Pasien,Jenis Layanan Medis\n';
    const csvContent = `"${uniqueId}","${formattedTime}","${bookingForm.patientName?.replace(/"/g, '""')}","${bookingTab}","${bookingForm.phone || '-'}","${bookingForm.nik || '-'}","${(bookingForm.birthPlace || '').replace(/"/g, '""')}","${bookingForm.birthDate || '-'}","${bookingForm.gender || '-'}","${(bookingForm.address || '').replace(/"/g, '""')}","${bookingForm.patientType}","${(bookingForm.insuranceProvider || '').replace(/"/g, '""')}","${bookingForm.patientType === 'BPJS' ? bookingForm.bpjsNumber : (bookingForm.insuranceNumber || '-')}","${bookingForm.ktpFile || '-'}","${bookingForm.insuranceFile || '-'}","${bookingForm.photoFile || '-'}","${bookingForm.selectedDoctorId}","${bookingForm.selectedDate}","${bookingForm.selectedTimeSlot}","${(bookingForm.complaint || '').replace(/"/g, '""')}","${bookingForm.serviceType || 'Poli Spesialis / Umum'}"\r\n`;
    
    try {
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvHeader + csvContent], { type: 'text/csv;charset=utf-8' });
      const dlUrl = URL.createObjectURL(blob);
      setCsvDownloadUrl(dlUrl);
      setCsvFileName(`pendaftaran_booking_${uniqueId}.csv`);
    } catch (csvError) {
      console.error('Error generating CSV local link:', csvError);
    }

    // Catatan: penyimpanan ke localStorage & saveDocument('bookings', ...)
    // langsung dari browser SUDAH DIHAPUS di sini. Data sekarang tersimpan
    // di koleksi Firestore `pendaftaran` lewat backend (submitPendaftaran
    // di atas), yang juga otomatis memicu WA konfirmasi ke pasien. Rules
    // Firestore terbaru memang mengunci tulis langsung dari client untuk
    // koleksi ini — kalau baris saveDocument dikembalikan, ia akan gagal
    // diam-diam dan pasien akan melihat "berhasil" padahal data tidak
    // tersimpan.

    setWizardStep(5); // Show ticket panel on step 5

    // [TAMBAHKAN KODE INI] Otomatis tarik layar ke paling atas agar langsung melihat tiket:
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Send Whatsapp Redirect link
  const triggerWhatsAppRedirect = () => {
    if (!bookingReceipt) return;
    const targetDoctor = doctorsList.find(d => d.id === bookingForm.selectedDoctorId);
    
    // Format tanggal ke format titik DD.MM.YYYY sesuai PDF
    const formatDateToDots = (dateStr?: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
      return dateStr;
    };

    // Ekstrak nama inisial dokter resmi tanpa gelar
    const getDoctorInitials = (docName?: string) => {
      if (!docName) return 'UMU';

      // 1. Jika nama dokter sudah mengandung inisial di dalam kurung, ambil langsung: (LDP)
      const match = docName.match(/\((.*?)\)/);
      if (match) return match[1];

      // 2. Pemetaan nama dokter resmi RS Yasmin
      const cleaned = docName.replace(/dr\.|drg\.|Sp\.[A-Za-z]+|M\.Kes|MARS|,/gi, '').trim();
      const words = cleaned.split(/\s+/).filter(Boolean);
      
      // Ambil huruf depan nama asli dokter (Luty Diah Prahmani -> LDP)
      return words.map(w => w[0]).join('').slice(0, 3).toUpperCase();
    };

    const poliName = bookingForm.serviceType || 'Poli Umum';
    const noMedrec = bookingTab === 'BARU' ? (bookingForm.nik || '-') : (bookingForm.kiupNumber || '-');
    const tglLahir = formatDateToDots(bookingForm.birthDate);
    const tglKunjungan = formatDateToDots(bookingForm.selectedDate);
    const waktu = bookingForm.selectedTimeSlot?.includes('Pagi') ? 'Pagi' : bookingForm.selectedTimeSlot?.includes('Sore') ? 'Sore' : 'Pagi';
    const inisialDokter = getDoctorInitials(targetDoctor?.name);

    // FORMAT BAKU SESUAI HALAMAN 3 & 8 PDF DINAMIX
    // Ditambahkan Tiket:YSM-xxxx# agar Bot otomatis menautkan ke dokumen Firestore
    const message = `*Pasien ${poliName}*#
*No.Medrec*:${noMedrec}#
*Nama Pasien*:${bookingForm.patientName}#
*Tgl.Lahir*:${tglLahir}#
*Tgl.Kunjungan*:${tglKunjungan}#
*Waktu*:${waktu}#
*Nama Inisial Dokter*:${inisialDokter}#
*Tiket*:${bookingReceipt.id}#`;

    // Ganti nomor tujuan WA di bawah jika menggunakan nomor bot Anda
    const targetPhone = "628567789302";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${targetPhone}?text=${encodedMessage}`, '_blank');
  };

  // --- AWAL KODE ROUTING URL ---
  // const currentPath = window.location.pathname;

  // =========================================================================
  // RUTE LINK PENDAFTARAN PASIEN BERBASIS KARTU (/pendaftaran/:token)
  // =========================================================================
  if (currentPath.startsWith('/pendaftaran/')) {
    const token = currentPath.replace('/pendaftaran/', '').split('/')[0];
    return (
      <PatientRegistrationWizard 
        token={token} 
        onComplete={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
          setActiveTab('BERANDA');
        }} 
      />
    );
  }
  // RUTE PORTAL PASIEN PERMANEN (/pasien)
  if (currentPath === '/pasien') {
    return <PatientPortalDashboard onExit={() => { window.location.href = '/'; }} />;
  }

  // 2. RUTE LINK PENDAFTARAN BERTINGKAT (/pendaftaran/:token)
  if (currentPath.startsWith('/pendaftaran/')) {
    const token = currentPath.replace('/pendaftaran/', '').split('/')[0];
    return (
      <PatientRegistrationWizard 
        token={token} 
        onComplete={() => { window.location.href = '/'; }} 
      />
    );
  }
  
  // =========================================================================
  // QUEUE MANAGEMENT SYSTEM ROUTES
  // =========================================================================
  if (currentPath === '/queue/staff') {
    return <QueueStaffPanel />;
  }
  if (currentPath === '/queue/display') {
    return <QueueDisplay />;
  }
  
  // =========================================================================
  // 1. RUTE MANDIRI: ADMIN PENDAFTARAN & WA BOT (/admin/pendaftaran)
  // =========================================================================
  if (currentPath === '/admin/pendaftaran' || activeTab === 'ADMIN_PENDAFTARAN') {
    return (
      <AdminPendaftaranModule 
        onExit={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
          setActiveTab('BERANDA');
        }} 
      />
    );
  }

  // =========================================================================
  // 2. RUTE MANDIRI: ADMIN DASHBOARD WEBSITE (/admin)
  // =========================================================================
  if (currentPath === '/admin' || activeTab === 'ADMIN_DASHBOARD') {
    return (
      <AdminDashboard 
        onClose={() => {
          // Saat klik "Kembali ke Website", kembalikan URL ke /
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
          setActiveTab('BERANDA');
        }}
        doctors={doctorsList}
        onUpdateDoctors={handleUpdateDoctors}
        onSyncSystemDoctors={handleSyncSystemDoctors}
        onResetSystemDoctors={handleResetSystemDoctors}
        rsInfo={rsInfo}
        onUpdateRsInfo={setRsInfo}
      />
    );
  }

  // =========================================================================
  // 3. SITUS UTAMA PASIEN (BERANDA)
  // =========================================================================
  return (
    <div className="min-h-screen bg-warm-ivory text-body-text flex flex-col font-sans selection:bg-yasmin-green selection:text-white overflow-x-hidden w-full max-w-full">
      {/* HEADER component */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBookingWizard={() => handleOpenBookingWizard()}
        onSelectSubmenu={handleSelectSubmenu}
        onSelectHealthCenter={handleSelectHealthCenter}
        currentLangCode={currentLangCode}
        onChangeLang={setCurrentLangCode}
        onOpenInfoberita={handleOpenInfoberita}
        onOpenInfoKamar={handleOpenInfoKamar}
        onOpenInfoAmbulance={handleOpenInfoAmbulance}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        rsInfo={rsInfo}
      />

      {/* RENDER ACTIVE TAB / PAGE DRAWER PANEL */}
      <main className="flex-grow pt-16">
        
        {searchTerm.trim() !== '' ? (
          <div className="animate-fade-in-up">
            <SearchResultsView
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              doctorsList={doctorsList}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
          </div>
        ) : (
          <>
            {activeTab === 'BERANDA' && (
          <div className="animate-fade-in-up">
            {/* HERO SECTION */}
            <HeroSection
              onNavClick={setActiveTab}
              onOpenBookingWizard={() => handleOpenBookingWizard()}
              onScrollToSection={handleScrollToSection}
              onSelectHealthCenter={handleSelectHealthCenter}
            />

             {/* LOKASI STRATEGIS BANNER */}
            <section className="bg-white py-12 border-b border-divider/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-soft-mint/10 to-transparent pointer-events-none" />
              <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
                <div className="bg-gradient-to-r from-soft-mint via-white to-soft-mint border border-divider/80 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col items-center justify-center text-center gap-8 animate-fade-in-up">
                  {/* Title and Explanation (Full Width) */}
                  <div className="space-y-3 w-full">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center space-x-1.5 bg-white border border-divider px-3 py-1 rounded-full text-xs font-semibold text-deep-teal font-display">
                        <span className="w-2 h-2 rounded-full bg-yasmin-green animate-pulse" />
                        <span>{t.strategisTitle}</span>
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-headings tracking-tight w-full text-center">
                      {t.strategisHeadline}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base font-sans w-full leading-relaxed text-center">
                      {t.strategisDesc}
                    </p>
                  </div>

                  {/* Travel Times Cards (Centered below, maintaining original spacing and details) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-5xl mx-auto justify-center">
                    <div className="bg-white border border-divider p-5 rounded-2xl flex items-center space-x-3.5 shadow-2xs hover:border-yasmin-green hover:shadow-xs transition-all justify-start text-left">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-display font-bold text-sm text-headings">{t.alunAlun}</p>
                        <p className="font-sans text-base font-extrabold text-deep-teal">{t.alunAlunTime}</p>
                        <p className="text-xs text-gray-500 font-medium">{t.alunAlunDist}</p>
                      </div>
                    </div>

                    <div className="bg-white border border-divider p-5 rounded-2xl flex items-center space-x-3.5 shadow-2xs hover:border-yasmin-green hover:shadow-xs transition-all justify-start text-left">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v-2h2c1.02 0 1.85-.39 2.62-.93.38-.27.81-.59 1.38-.59s1 .32 1.38.59c1.54 1.08 3.5 1.08 5.04 0 .38-.27.8-.59 1.38-.59s1 .32 1.38.59c.77.54 1.6 1.33 2.62 1.33h2v2h-2zM4 16h11V6h5l-4-4-4 4h3v8H4c-.55 0-1 .45-1 1v1h1z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-display font-bold text-sm text-headings">{t.ketapang}</p>
                        <p className="font-sans text-base font-extrabold text-deep-teal">{t.ketapangTime}</p>
                        <p className="text-xs text-gray-500 font-medium">{t.ketapangDist}</p>
                      </div>
                    </div>

                    <div className="bg-white border border-divider p-5 rounded-2xl flex items-center space-x-3.5 shadow-2xs hover:border-yasmin-green hover:shadow-xs transition-all justify-start text-left">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-display font-bold text-sm text-headings">{t.bandara}</p>
                        <p className="font-sans text-base font-extrabold text-deep-teal">{t.bandaraTime}</p>
                        <p className="text-xs text-gray-500 font-medium">{t.bandaraDist}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK HISTORY & STATISTICS PILASTER */}
            <AboutSection hideTestimonials={true} />

            {/* BOTANICAL HEALING GARDEN VIRTUAL WALK */}
            <GreenHealing />

            {/* GORGEOUS FAMILY MOTIFS ACCREDITED TAGLINE BANNER */}
            <section className="py-16 bg-white overflow-hidden relative">
              <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-headings text-warm-ivory rounded-3xl p-8 md:p-12 border-2 border-divider/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
                  {/* Background overlay lights */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-yasmin-green/15 rounded-full filter blur-3xl opacity-50" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-orange/15 rounded-full filter blur-2xl opacity-50" />

                  <div className="text-left space-y-4 lg:w-3/4 lg:max-w-[75%] w-full relative z-10">
                    <span className="bg-warm-orange text-headings text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-widest font-sans inline-block">
                      {t.bpjsBadge}
                    </span>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight text-warm-ivory">
                      {t.bpjsTitle}
                    </h3>
                    <p className="text-warm-mint/80 text-sm sm:text-base leading-relaxed font-normal text-justify">
                      {t.bpjsDesc}
                    </p>
                  </div>

                  <div className="shrink-0 relative z-10 w-full lg:w-auto text-right">
                    <button
                      onClick={() => handleSelectHealthCenter('hc-11')}
                      className="w-full lg:w-auto px-6 py-3.5 bg-warm-orange hover:bg-amber-400 text-headings font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer"
                    >
                      {t.bpjsBtn}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* CORPORATE PARTNER HIGHLIGHT */}
            <CorporateHealthcare />

            {/* QUICK EDUCATIONAL BLOG SNAP */}
            <EdukasiKesehatan />

            {/* TESTIMONIAL PASIEN (SECURE HIGHLY PLACED) */}
            <section className="py-16 bg-gradient-to-b from-soft-mint/30 to-white overflow-hidden relative" id="testimoni-section">
              <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <span className="font-display text-[10px] text-deep-teal font-black tracking-widest uppercase bg-soft-mint border border-divider px-3.5 py-1.5 rounded-full inline-block">
                    {currentLangCode === 'ID' ? 'TESTIMONI PASIEN' : 'PATIENT TESTIMONIALS'}
                  </span>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-headings mt-4">
                    {currentLangCode === 'ID' ? 'Kisah Nyata Kesembuhan & Empati' : 'Real Stories of Healing & Empathy'}
                  </h2>
                  <div className="w-16 h-1 bg-warm-orange mx-auto mt-4 rounded" />
                </div>
                <div className="bg-white rounded-3xl border border-divider shadow-sm p-6 sm:p-8">
                  <TestimonialSection />
                </div>
              </div>
            </section>

            {/* FINAL RESORT HOLISTIC INVITATION (FINAL CTA) */}
            <section className="py-20 bg-gradient-to-tr from-headings to-deep-teal text-white relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,150,136,0.15),transparent_60%)]" />
              <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="w-full text-center space-y-8">
                  <Leaf className="h-10 w-10 text-yasmin-green mx-auto animate-bounce" />
                  
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-warm-ivory leading-tight tracking-tight w-full mx-auto">
                    {t.ctaHeadline}
                  </h2>
                  
                  <p className="text-warm-mint/80 text-sm sm:text-base w-full mx-auto font-sans leading-relaxed">
                    {t.ctaDesc}
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button
                      onClick={() => handleOpenBookingWizard()}
                      className="px-8 py-4 bg-warm-orange hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.85)] hover:ring-2 hover:ring-amber-500/20 text-headings font-bold font-display text-xs rounded-xl tracking-wider shadow-md transform hover:scale-101 transition-all cursor-pointer"
                    >
                      {t.ctaBookBtn}
                    </button>

                    <a
                      href="https://wa.me/6285259353001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-whatsapp hover:bg-emerald-600 hover:shadow-[0_0_25px_rgba(34,197,94,0.9)] hover:ring-2 hover:ring-emerald-500/20 text-white font-bold font-display text-xs rounded-xl tracking-wider shadow-md flex items-center space-x-2 cursor-pointer transition-all"
                    >
                      <WhatsAppIcon className="h-4.5 w-4.5 fill-current animate-whatsapp-shake" />
                      <span>{t.ctaWaBtn}</span>
                    </a>

                    <a
                      href="tel:0333424671"
                      className="group px-8 py-4 bg-white/10 hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.75)] hover:ring-2 hover:ring-white/25 text-white font-bold font-display text-xs rounded-xl tracking-wider border border-white/20 hover:border-white/40 transition-all flex items-center space-x-2"
                    >
                      <Phone className="h-4.5 w-4.5 text-warm-orange group-hover:animate-whatsapp-shake transition-transform" />
                      <span>HOTLINE: (0333) 424671</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'DOKTER' && (
          <div className="animate-fade-in-up">
            <FindDoctor
              onOpenBookingWizard={handleOpenBookingWizard}
              selectedDoctorForWizard={preselectedDoctorId}
              doctorsList={doctorsList}
            />
          </div>
        )}

        {activeTab === 'PUSAT KESEHATAN' && (
          <div className="animate-fade-in-up">
            <HealthCenters
              onOpenBookingWizard={handleOpenBookingWizard}
              selectedHealthCenterId={selectedCenterId}
              onClearSelectedHealthCenter={() => setSelectedCenterId(null)}
            />
          </div>
        )}

        {activeTab === 'FASILITAS' && (
          <div className="animate-fade-in-up">
            <Fasilitas />
          </div>
        )}

        {activeTab === 'KOMUNITAS' && (
          <div className="animate-fade-in-up">
            <Komunitas onNavClick={setActiveTab} />
          </div>
        )}

        {activeTab === 'TENTANG KAMI' && (
          <div className="animate-fade-in-up">
            <AboutSection />
          </div>
        )}

        {activeTab === 'GALLERY' && (
          <div className="animate-fade-in-up">
            <GallerySection />
          </div>
        )}

        {activeTab === 'YASMIN_KIDS' && (
          <div className="animate-fade-in-up">
            <YasminKids />
          </div>
        )}

        {activeTab === 'DONOR_DARAH' && (
          <div className="animate-fade-in-up">
            <DonorDarah />
          </div>
        )}

        {activeTab === 'YASMIN_SQUAD' && (
          <div className="animate-fade-in-up">
            <YasminSquad />
          </div>
        )}

        {activeTab === 'YASMIN_WOMENS' && (
          <div className="animate-fade-in-up">
            <YasminWomens />
          </div>
        )}

        {activeTab === 'PENDAFTARAN' && (
          <div className="animate-fade-in-up max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            {/* Header / Intro section - Sticky top/stationary, lowered slightly to keep full border lines visible */}
            <div className="sticky top-[120px] lg:top-[134px] z-30 bg-warm-ivory/95 backdrop-blur-md pt-2.5 pb-3 my-1">
              <div className="bg-white border border-divider/90 rounded-2xl p-3.5 sm:py-2.5 sm:px-4 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                  <CalendarRange className="h-5 w-5 text-deep-teal shrink-0 mt-0.5 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <h1 className="font-display font-black text-base sm:text-lg text-headings tracking-tight leading-tight">
                      {tReg.title}
                    </h1>
                    <p className="text-gray-500 font-sans mt-0.5 max-w-5xl text-[10px] sm:text-xs leading-relaxed truncate-3-lines">
                      {tReg.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('PUSAT KESEHATAN');
                    window.scrollTo({ top: 0 });
                  }}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-headings text-[11px] font-bold font-display rounded-lg tracking-wide transition-colors flex items-center space-x-1.5 cursor-pointer border border-divider/45 shrink-0"
                >
                  <span>{tReg.btnBack}</span>
                </button>
              </div>
            </div>

            {/* Main Form container - expanded width to avoid scrolling as requested */}
            <div className="max-w-[105rem] mx-auto">
              <div className="bg-white border border-divider/90 rounded-3xl shadow-lg hover:shadow-xl hover:border-emerald-500 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden">
                
                {/* Switcher Tab - Proportional to form width */}
                {wizardStep !== 5 && (
                  <div className="bg-gray-50/75 border-b border-divider p-4 sm:p-6">
                    <div className="w-full max-w-full mx-auto">
                      <div className="text-center mb-4">
                        <span className="inline-block px-3 py-1 bg-deep-teal/10 text-deep-teal rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                          {currentLangCode === 'ID' ? 'Kategori Pasien' : 'Patient Category'}
                        </span>
                        <h2 className="text-sm sm:text-base font-display font-black text-headings mt-1">
                          {currentLangCode === 'ID' ? 'Silakan Pilih Status Pendaftaran Pasien' : 'Please Choose Patient Registration Status'}
                        </h2>
                        <p className="text-gray-400 font-sans mt-0.5 text-[10px] sm:text-xs font-medium">
                          {currentLangCode === 'ID' 
                            ? 'Pilih opsi di bawah sesuai dengan riwayat kunjungan medis Anda di RSU Yasmin' 
                            : 'Choose the option below matching your medical visit history at RSU Yasmin'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* New Patient Tab Card */}
                        <button
                          type="button"
                          onClick={() => {
                            setBookingTab('BARU');
                            setBookingForm(prev => ({ ...prev, isRegisteredPatient: false }));
                          }}
                          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left cursor-pointer group ${
                            bookingTab === 'BARU'
                              ? 'bg-headings border-headings text-white shadow-lg shadow-headings/20 scale-[1.01]'
                              : 'bg-white border-divider text-gray-700 hover:border-headings/40 hover:bg-gray-50/50 shadow-xs'
                          }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                            bookingTab === 'BARU'
                              ? 'bg-white/10 text-white'
                              : 'bg-soft-mint text-deep-teal group-hover:bg-deep-teal/10'
                          }`}>
                            <UserPlus className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display font-black text-xs sm:text-sm tracking-wide uppercase">
                                {tReg.tabNew}
                              </h3>
                              {bookingTab === 'BARU' && (
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                              )}
                            </div>
                            <p className={`mt-1 font-sans text-[11px] leading-relaxed ${
                              bookingTab === 'BARU' ? 'text-white/80' : 'text-gray-400 font-medium'
                            }`}>
                              {currentLangCode === 'ID'
                                ? 'Belum memiliki nomor Rekam Medis (RM). Wajib mengisi form identitas lengkap & unggah berkas KTP.'
                                : 'No medical record number yet. Complete registration forms and ID upload are required.'}
                            </p>
                          </div>
                        </button>

                        {/* Registered Patient Tab Card */}
                        <button
                          type="button"
                          onClick={() => {
                            setBookingTab('TERDAFTAR');
                            setBookingForm(prev => ({ ...prev, isRegisteredPatient: true }));
                          }}
                          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left cursor-pointer group ${
                            bookingTab === 'TERDAFTAR'
                              ? 'bg-headings border-headings text-white shadow-lg shadow-headings/20 scale-[1.01]'
                              : 'bg-white border-divider text-gray-700 hover:border-headings/40 hover:bg-gray-50/50 shadow-xs'
                          }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                            bookingTab === 'TERDAFTAR'
                              ? 'bg-white/10 text-white'
                              : 'bg-soft-mint text-deep-teal group-hover:bg-deep-teal/10'
                          }`}>
                            <UserCheck className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display font-black text-xs sm:text-sm tracking-wide uppercase">
                                {tReg.tabRegistered}
                              </h3>
                              {bookingTab === 'TERDAFTAR' && (
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                              )}
                            </div>
                            <p className={`mt-1 font-sans text-[11px] leading-relaxed ${
                              bookingTab === 'TERDAFTAR' ? 'text-white/80' : 'text-gray-400 font-medium'
                            }`}>
                              {currentLangCode === 'ID'
                                ? 'Sudah pernah berobat. Cukup masukkan Nama Pasien dan Nomor Rekam Medis / Kartu KIUP Anda.'
                                : 'Registered patient. Simply input Patient Name and your Medical Record Number (KIUP).'}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) || ""}

                {/* Form Elements */}
                {wizardStep !== 5 ? (
                  <form onSubmit={handleFormPendaftaran} className="p-6 sm:p-10 space-y-5 text-xs font-semibold text-gray-700 text-left">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                      
                      {/* Left Column: Patient Profile */}
                      <div className="space-y-5 flex flex-col justify-between h-full">
                        {/* Jenis Layanan Medis Dropdown */}
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-bold uppercase tracking-wide">
                            {tReg.lblServiceType}:
                          </label>
                          <select
                            value={bookingForm.serviceType || 'Poli Spesialis / Umum'}
                            onChange={(e) => {
                              const selectedTitle = e.target.value;
                              setBookingForm(prev => ({ ...prev, serviceType: selectedTitle }));
                              
                              // Automatically map serviceType to specialty filter
                              let specFilter = 'Semua';
                              if (selectedTitle === 'Pelayanan Ibu & Anak') {
                                specFilter = 'Anak';
                              } else if (selectedTitle === 'Persalinan Metode ERACS') {
                                specFilter = 'Kandungan';
                              } else if (selectedTitle === 'Klinik Fertilitas') {
                                specFilter = 'Kandungan';
                              } else if (selectedTitle === 'Family Medical Check Up (MCU)') {
                                specFilter = 'Penyakit Dalam';
                              } else if (selectedTitle === 'Klinik Berhenti Merokok') {
                                specFilter = 'Semua';
                              } else if (selectedTitle === 'Konsultasi Psikologis Remaja') {
                                specFilter = 'Psikolog';
                              } else if (selectedTitle === 'Yasmin Home Care') {
                                specFilter = 'Semua';
                              } else if (selectedTitle === 'Rehabilitasi Medik') {
                                specFilter = 'Rehab Medik';
                              } else if (selectedTitle === 'Rawat Inap Bertema Resort') {
                                specFilter = 'Semua';
                              } else if (selectedTitle === 'IGD & Ambulans 24 Jam') {
                                specFilter = 'Semua';
                              } else if (selectedTitle === 'Jaminan BPJS Kesehatan') {
                                specFilter = 'Semua';
                              } else if (selectedTitle === 'Asuransi & Kemitraan Swasta') {
                                specFilter = 'Semua';
                              }
                              setBookingSpecialtyFilter(specFilter);

                              // Auto-select first matching doctor if any
                              const matchedDocs = doctorsList.filter(d => specFilter === 'Semua' || d.subSpecialty === specFilter || d.specialty === specFilter);
                              if (matchedDocs.length > 0) {
                                setBookingForm(prev => ({ ...prev, selectedDoctorId: matchedDocs[0].id }));
                              }
                            }}
                            className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings font-bold cursor-pointer"
                          >
                            <optgroup label={currentLangCode === 'ID' ? "Pilihan Utama / Umum" : "Main / General Options"}>
                              <option value="Poli Spesialis / Umum">{SERVICE_TYPE_LABELS["Poli Spesialis / Umum"]?.[currentLangCode]}</option>
                            </optgroup>
                            <optgroup label={currentLangCode === 'ID' ? "Layanan Unggulan & Khusus" : "Specialty & Featured Services"}>
                              <option value="Pelayanan Ibu & Anak">{SERVICE_TYPE_LABELS["Pelayanan Ibu & Anak"]?.[currentLangCode]}</option>
                              <option value="Persalinan Metode ERACS">{SERVICE_TYPE_LABELS["Persalinan Metode ERACS"]?.[currentLangCode]}</option>
                              <option value="Klinik Fertilitas">{SERVICE_TYPE_LABELS["Klinik Fertilitas"]?.[currentLangCode]}</option>
                              <option value="Family Medical Check Up (MCU)">{SERVICE_TYPE_LABELS["Family Medical Check Up (MCU)"]?.[currentLangCode]}</option>
                              <option value="Klinik Berhenti Merokok">{SERVICE_TYPE_LABELS["Klinik Berhenti Merokok"]?.[currentLangCode]}</option>
                              <option value="Konsultasi Psikologis Remaja">{SERVICE_TYPE_LABELS["Konsultasi Psikologis Remaja"]?.[currentLangCode]}</option>
                              <option value="Yasmin Home Care">{SERVICE_TYPE_LABELS["Yasmin Home Care"]?.[currentLangCode]}</option>
                              <option value="Rehabilitasi Medik">{SERVICE_TYPE_LABELS["Rehabilitasi Medik"]?.[currentLangCode]}</option>
                              <option value="Rawat Inap Bertema Resort">{SERVICE_TYPE_LABELS["Rawat Inap Bertema Resort"]?.[currentLangCode]}</option>
                              <option value="IGD & Ambulans 24 Jam">{SERVICE_TYPE_LABELS["IGD & Ambulans 24 Jam"]?.[currentLangCode]}</option>
                              <option value="Jaminan BPJS Kesehatan">{SERVICE_TYPE_LABELS["Jaminan BPJS Kesehatan"]?.[currentLangCode]}</option>
                              <option value="Asuransi & Kemitraan Swasta">{SERVICE_TYPE_LABELS["Asuransi & Kemitraan Swasta"]?.[currentLangCode]}</option>
                            </optgroup>
                          </select>
                          <div className="mt-2.5 flex items-center space-x-1.5 text-xs select-none">
                            <span className="text-gray-400">
                              {currentLangCode === 'ID' ? 'Butuh informasi detail?' : currentLangCode === 'EN' ? 'Need detailed info?' : currentLangCode === 'KR' ? '상세 정보가 필요하십니까?' : currentLangCode === 'ZH' ? '需要详细信息吗？' : 'هل تحتاج لمعلومات تفصيلية؟'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('PUSAT KESEHATAN');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-deep-teal hover:text-yasmin-green font-bold underline cursor-pointer"
                            >
                              {currentLangCode === 'ID' ? 'Buka Direktori Layanan →' : currentLangCode === 'EN' ? 'Open Services Directory →' : currentLangCode === 'KR' ? '진료 서비스 안내 →' : currentLangCode === 'ZH' ? '查看服务目录 →' : 'افتح دليل الخدمات ←'}
                            </button>
                          </div>
                        </div>

                        {/* Global Patient Name */}
                        <div>
                          <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblPatientName}:</label>
                          <input
                            type="text"
                            required
                            value={bookingForm.patientName}
                            onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                            placeholder={currentLangCode === 'ID' ? "Contoh: Rahmad Wahyudi" : "e.g. Rahmad Wahyudi"}
                            className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings"
                          />
                        </div>

                        {/* Tab Specific Content */}
                        {bookingTab === 'TERDAFTAR' ? (
                          <div className="animate-fade-in-up">
                            <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblKiupNo}:</label>
                            <input
                              type="text"
                              required
                              value={bookingForm.kiupNumber}
                              onChange={(e) => setBookingForm({ ...bookingForm, kiupNumber: e.target.value })}
                              placeholder={currentLangCode === 'ID' ? "Contoh: KIUP-12345/03" : "e.g. KIUP-12345/03"}
                              className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm font-mono uppercase text-headings"
                            />
                          </div>
                        ) : (
                          <div className="space-y-5 animate-fade-in-up">
                            {/* NIK / KTP */}
                            <div>
                              <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblNIK}:</label>
                              <input
                                type="text"
                                maxLength={16}
                                required
                                value={bookingForm.nik}
                                onChange={(e) => {
                                  // Clean non-digits
                                  const val = e.target.value.replace(/\D/g, '');
                                  setBookingForm({ ...bookingForm, nik: val });
                                }}
                                placeholder="e.g. 3501xxxxxxxxxxxx"
                                className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm font-mono text-headings"
                              />
                            </div>

                            {/* Birth Place and Date Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblBirthPlace}:</label>
                                <input
                                  type="text"
                                  required
                                  value={bookingForm.birthPlace}
                                  onChange={(e) => setBookingForm({ ...bookingForm, birthPlace: e.target.value })}
                                  placeholder={currentLangCode === 'ID' ? "Contoh: Banyuwangi" : "e.g. Banyuwangi"}
                                  className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblBirthDate}:</label>
                                <input
                                  type="date"
                                  required
                                  value={bookingForm.birthDate}
                                  onChange={(e) => setBookingForm({ ...bookingForm, birthDate: e.target.value })}
                                  className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings"
                                />
                              </div>
                            </div>

                            {/* Gender selection */}
                            <div>
                              <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblGender}:</label>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { val: 'Laki-laki', lbl: tReg.lblGenderMale },
                                  { val: 'Perempuan', lbl: tReg.lblGenderFemale }
                                ].map((g) => (
                                  <button
                                    key={g.val}
                                    type="button"
                                    onClick={() => setBookingForm({ ...bookingForm, gender: g.val as 'Laki-laki' | 'Perempuan' })}
                                    className={`py-3 rounded-xl text-center font-bold tracking-wide transition-all cursor-pointer border text-xs ${
                                      bookingForm.gender === g.val
                                        ? 'bg-[#0B4F4A] border-[#0B4F4A] text-white shadow-2xs'
                                        : 'bg-white border-divider text-gray-600 hover:bg-soft-mint/30'
                                    }`}
                                  >
                                    {g.lbl}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Full Address */}
                            <div>
                              <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblAddress}:</label>
                              <textarea
                                rows={2}
                                required
                                value={bookingForm.address}
                                onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                                placeholder={currentLangCode === 'ID' ? "Masukkan alamat domisili lengkap sesuai KTP" : "Enter complete address as shown on ID card"}
                                className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings"
                              />
                            </div>

                            {/* Phone Number */}
                            <div>
                              <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">{tReg.lblPhone}:</label>
                              <input
                                type="tel"
                                required
                                value={bookingForm.phone}
                                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                placeholder={currentLangCode === 'ID' ? "Contoh: 0852xxxxxxxx" : "e.g. 0852xxxxxxxx"}
                                className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm font-mono text-headings"
                              />
                            </div>

                            {/* Payment/Coverage Category */}
                            <div>
                              <label className="block text-gray-500 mb-1.5 uppercase tracking-wide">
                                {currentLangCode === 'ID' ? 'Kategori Jaminan Pembiayaan Pasien:' : currentLangCode === 'EN' ? 'Patient Coverage Category:' : currentLangCode === 'KR' ? '지불 보증 범주:' : currentLangCode === 'ZH' ? '担保支付类别:' : 'فئة تغطية الدفع:'}
                              </label>
                              <div className="grid grid-cols-3 gap-3">
                                {['Umum', 'BPJS', 'Asuransi'].map((typeOpt) => {
                                  const labelMap: Record<string, Record<string, string>> = {
                                    Umum: { ID: 'Umum / Mandiri', EN: 'Out of Pocket', KR: '일반 (비급여)', ZH: '自费', AR: 'عام / نقدي' },
                                    BPJS: { ID: 'BPJS Kesehatan', EN: 'BPJS Health', KR: 'BPJS 의료보험', ZH: 'BPJS 医保', AR: 'BPJS الوطني' },
                                    Asuransi: { ID: 'Asuransi Swasta', EN: 'Private Insurance', KR: '사보험', ZH: '商业保险', AR: 'التأمين الخاص' }
                                  };
                                  const displayLabel = labelMap[typeOpt]?.[currentLangCode] || typeOpt;
                                  return (
                                    <button
                                      key={typeOpt}
                                      type="button"
                                      onClick={() => setBookingForm({ ...bookingForm, patientType: typeOpt as 'Umum' | 'BPJS' | 'Asuransi' })}
                                      className={`py-3 rounded-xl text-center font-bold tracking-wide transition-all cursor-pointer border text-[10px] sm:text-xs ${
                                        bookingForm.patientType === typeOpt
                                          ? 'bg-[#0B4F4A] border-[#0B4F4A] text-white shadow-2xs'
                                          : 'bg-white border-divider text-gray-600 hover:bg-soft-mint/30'
                                      }`}
                                    >
                                      {displayLabel}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* BPJS Specific Block */}
                            {bookingForm.patientType === 'BPJS' && (
                              <div className="animate-fade-in-up">
                                <label className="block text-emerald-700 mb-1.5 uppercase tracking-wide font-bold">{tReg.lblBpjsNo}:</label>
                                <input
                                  type="text"
                                  required
                                  maxLength={13}
                                  value={bookingForm.bpjsNumber}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setBookingForm({ ...bookingForm, bpjsNumber: val });
                                  }}
                                  placeholder={currentLangCode === 'ID' ? "Sertakan 13 digit nomor kartu BPJS Anda" : "Enter your 13-digit BPJS card number"}
                                  className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-500 text-sm font-mono text-headings"
                                />
                              </div>
                            )}

                            {/* Private Insurance Specific Block */}
                            {bookingForm.patientType === 'Asuransi' && (
                              <div className="space-y-4 animate-fade-in-up border-l-2 border-deep-teal pl-3">
                                <div>
                                  <label className="block text-emerald-700 mb-1.5 uppercase tracking-wide font-bold">{tReg.lblInsuranceProvider}:</label>
                                  <select
                                    required
                                    value={bookingForm.insuranceProvider}
                                    onChange={(e) => setBookingForm({ ...bookingForm, insuranceProvider: e.target.value })}
                                    className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-500 text-sm font-bold text-headings cursor-pointer"
                                  >
                                    <option value="">{currentLangCode === 'ID' ? '-- Pilih Mitra Asuransi Swasta / TPA --' : '-- Select Private Insurance Partner / TPA --'}</option>
                                    <option value="AdMedika (TPA)">AdMedika (Third Party Administrator)</option>
                                    <option value="Prudential">Prudential Life Assurance</option>
                                    <option value="Allianz">Allianz Indonesia</option>
                                    <option value="Manulife">Manulife Indonesia</option>
                                    <option value="FWD Insurance">FWD Insurance</option>
                                    <option value="Mandiri Inhealth">Mandiri Inhealth (PT Asuransi Jiwa Inhealth)</option>
                                    <option value="Asuransi Astra (Garda Medika)">Asuransi Astra (Garda Medika)</option>
                                    <option value="Central Asia Financial (CAR)">Central Asia Financial (CAR Life)</option>
                                    <option value="Owlexa Healthcare">Owlexa Healthcare</option>
                                    <option value="Nayaka Era Husada">Nayaka Era Husada</option>
                                    <option value="Sun Life">Sun Life Financial</option>
                                    <option value="AXA Mandiri">AXA Mandiri Financial Services</option>
                                    <option value="Generali Indonesia">Generali Indonesia</option>
                                    <option value="Great Eastern Life">Great Eastern Life</option>
                                    <option value="Sinarmas MSIG">Sinarmas MSIG Life</option>
                                    <option value="Asuransi Reliance">Asuransi Reliance Indonesia</option>
                                    <option value="Equity Life">Equity Life Indonesia</option>
                                    <option value="AIA Financial">AIA Financial</option>
                                    <option value="Mitra Asuransi / Korporasi Lainnya">Mitra Asuransi / Korporasi Lainnya</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-emerald-700 mb-1.5 uppercase tracking-wide font-bold">{tReg.lblInsuranceNo}:</label>
                                  <input
                                    type="text"
                                    required
                                    value={bookingForm.insuranceNumber}
                                    onChange={(e) => setBookingForm({ ...bookingForm, insuranceNumber: e.target.value })}
                                    placeholder={currentLangCode === 'ID' ? "Contoh: POLIS-987654321" : "e.g. POLICY-987654321"}
                                    className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-500 text-sm font-mono text-headings"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Document evidence Upload Area */}
                            <div className="border-t border-divider pt-4 space-y-4">
                              <h4 className="text-headings text-xs font-bold uppercase tracking-wider text-gray-500">
                                {currentLangCode === 'ID' ? 'Unggah Berkas Identitas & Penunjang Pasien Baru:' : currentLangCode === 'EN' ? 'Upload ID & Supporting Documents for New Patient:' : currentLangCode === 'KR' ? '신규 환자 신분증 및 증빙 서류 업로드:' : currentLangCode === 'ZH' ? '上传新就诊人身份证件及医疗卡:' : 'تحميل وثائق الهوية والضمان للمريض الجديد:'}
                              </h4>

                              {/* 1. KTP File Upload */}
                              <div className="bg-white p-3 rounded-xl border border-divider animate-fade-in-up">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-gray-700 uppercase">{tReg.lblUploadKTP} <span className="text-red-500">*</span></span>
                                  {bookingForm.ktpFile && (
                                    <span className="text-emerald-600 flex items-center text-xs font-semibold">
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                      {currentLangCode === 'ID' ? 'Berkas Siap' : 'Ready'}
                                    </span>
                                  )}
                                </div>

                                {bookingForm.ktpFile ? (
                                  <div className="flex items-center justify-between bg-soft-mint/30 p-2.5 rounded-lg border border-yasmin-green/20">
                                    <div className="flex items-center space-x-2.5 overflow-hidden">
                                      <FileText className="w-5 h-5 text-deep-teal shrink-0" />
                                      <div className="truncate text-left">
                                        <p className="text-xs font-medium text-headings truncate">{bookingForm.ktpFile}</p>
                                        <p className="text-[10px] text-gray-400">1.2 MB • JPG Image</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setBookingForm({ ...bookingForm, ktpFile: '' })}
                                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                      title={currentLangCode === 'ID' ? "Hapus" : "Delete"}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const files = e.dataTransfer.files;
                                      if (files && files.length > 0) {
                                        setBookingForm({ ...bookingForm, ktpFile: files[0].name });
                                      }
                                    }}
                                    onClick={() => {
                                      const input = document.getElementById('ktp-input');
                                      if (input) input.click();
                                    }}
                                    className="border-2 border-dashed border-divider hover:border-yasmin-green rounded-lg p-4 text-center cursor-pointer hover:bg-soft-mint/10 transition-all select-none"
                                  >
                                    <input
                                      type="file"
                                      id="ktp-input"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                          setBookingForm({ ...bookingForm, ktpFile: files[0].name });
                                        }
                                      }}
                                    />
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                                    <p className="text-xs text-headings font-medium mb-1">{currentLangCode === 'ID' ? 'Pilih Berkas atau Tarik Kemari' : 'Choose file or drag here'}</p>
                                    <p className="text-[10px] text-gray-400">{tReg.lblUploadHint}</p>
                                  </div>
                                )}
                              </div>

                              {/* 2. BPJS / Private Insurance File (Only shown if patientType is not 'Umum') */}
                              {(bookingForm.patientType === 'BPJS' || bookingForm.patientType === 'Asuransi') && (
                                <div className="bg-white p-3 rounded-xl border border-divider animate-fade-in-up">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-700 uppercase">{tReg.lblUploadInsurance} <span className="text-red-500">*</span></span>
                                    {bookingForm.insuranceFile && (
                                      <span className="text-emerald-600 flex items-center text-xs font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                        {currentLangCode === 'ID' ? 'Berkas Siap' : 'Ready'}
                                      </span>
                                    )}
                                  </div>

                                  {bookingForm.insuranceFile ? (
                                    <div className="flex items-center justify-between bg-soft-mint/30 p-2.5 rounded-lg border border-yasmin-green/20">
                                      <div className="flex items-center space-x-2.5 overflow-hidden">
                                        <FileText className="w-5 h-5 text-deep-teal shrink-0" />
                                        <div className="truncate text-left">
                                          <p className="text-xs font-medium text-headings truncate">{bookingForm.insuranceFile}</p>
                                          <p className="text-[10px] text-gray-400">840 KB • PDF Document</p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setBookingForm({ ...bookingForm, insuranceFile: '' })}
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        title={currentLangCode === 'ID' ? "Hapus" : "Delete"}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        const files = e.dataTransfer.files;
                                        if (files && files.length > 0) {
                                          setBookingForm({ ...bookingForm, insuranceFile: files[0].name });
                                        }
                                      }}
                                      onClick={() => {
                                        const input = document.getElementById('insurance-input');
                                        if (input) input.click();
                                      }}
                                      className="border-2 border-dashed border-divider hover:border-yasmin-green rounded-lg p-4 text-center cursor-pointer hover:bg-soft-mint/10 transition-all select-none"
                                    >
                                      <input
                                        type="file"
                                        id="insurance-input"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files && files.length > 0) {
                                            setBookingForm({ ...bookingForm, insuranceFile: files[0].name });
                                          }
                                        }}
                                      />
                                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                                      <p className="text-xs text-headings font-medium mb-1">{currentLangCode === 'ID' ? 'Pilih Berkas atau Tarik Kemari' : 'Choose file or drag here'}</p>
                                      <p className="text-[10px] text-gray-400">{tReg.lblUploadHint}</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* 3. Portrait Photo Upload */}
                              <div className="bg-white p-3 rounded-xl border border-divider animate-fade-in-up">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-gray-700 uppercase">{tReg.lblUploadPhoto} <span className="text-red-500">*</span></span>
                                  {bookingForm.photoFile && (
                                    <span className="text-emerald-600 flex items-center text-xs font-semibold">
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                      {currentLangCode === 'ID' ? 'Berkas Siap' : 'Ready'}
                                    </span>
                                  )}
                                </div>

                                {bookingForm.photoFile ? (
                                  <div className="flex items-center justify-between bg-soft-mint/30 p-2.5 rounded-lg border border-yasmin-green/20">
                                    <div className="flex items-center space-x-2.5 overflow-hidden">
                                      <Image className="w-5 h-5 text-deep-teal shrink-0" />
                                      <div className="truncate text-left">
                                        <p className="text-xs font-medium text-headings truncate">{bookingForm.photoFile}</p>
                                        <p className="text-[10px] text-gray-400">2.1 MB • PNG Image</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setBookingForm({ ...bookingForm, photoFile: '' })}
                                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                      title={currentLangCode === 'ID' ? "Hapus" : "Delete"}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const files = e.dataTransfer.files;
                                      if (files && files.length > 0) {
                                        setBookingForm({ ...bookingForm, photoFile: files[0].name });
                                      }
                                    }}
                                    onClick={() => {
                                      const input = document.getElementById('photo-input');
                                      if (input) input.click();
                                    }}
                                    className="border-2 border-dashed border-divider hover:border-yasmin-green rounded-lg p-4 text-center cursor-pointer hover:bg-soft-mint/10 transition-all select-none"
                                  >
                                    <input
                                      type="file"
                                      id="photo-input"
                                      accept=".jpg,.jpeg,.png"
                                      className="hidden"
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                          setBookingForm({ ...bookingForm, photoFile: files[0].name });
                                        }
                                      }}
                                    />
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                                    <p className="text-xs text-headings font-medium mb-1">{currentLangCode === 'ID' ? 'Pilih Berkas atau Tarik Kemari' : 'Choose file or drag here'}</p>
                                    <p className="text-[10px] text-gray-400">{tReg.lblUploadHint}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Appointment Details & Complaint */}
                      <div className="space-y-5 flex flex-col justify-between h-full">
                        {/* Doctor and Schedule Select Grid Row */}
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 text-left">
                            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider">
                              {currentLangCode === 'ID' ? 'Pilih Dokter Spesialis & Jadwal RS Yasmin:' : currentLangCode === 'EN' ? 'Select Specialist & Yasmin Hospital Schedule:' : currentLangCode === 'KR' ? '전문의 및 야스민 병원 일정 선택:' : currentLangCode === 'ZH' ? '选择专科医生及雅斯敏医院排班:' : 'اختر الطبيب الأخصائي وجدول مستشفى ياسمين:'}
                            </label>
                            <select
                              value={bookingSpecialtyFilter}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBookingSpecialtyFilter(val);
                                const list = doctorsList.filter(d => val === 'Semua' || d.subSpecialty === val || d.specialty === val);
                                if (list.length > 0 && !list.some(d => d.id === bookingForm.selectedDoctorId)) {
                                  setBookingForm(prev => ({ ...prev, selectedDoctorId: list[0].id }));
                                }
                              }}
                              className="bg-white border border-divider rounded-lg px-2.5 py-1 text-xs font-sans font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-yasmin-green cursor-pointer"
                            >
                              <option value="Semua">{currentLangCode === 'ID' ? 'Semua Spesialisasi' : currentLangCode === 'EN' ? 'All Specialties' : currentLangCode === 'KR' ? '모든 전공 분야' : currentLangCode === 'ZH' ? '所有专科' : 'جميع التخصصات'}</option>
                              {Array.from(new Set(doctorsList.map(d => d.subSpecialty || d.specialty))).map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 border border-divider/40 p-2.5 rounded-xl bg-gray-50/50">
                            {doctorsList.filter(doc => bookingSpecialtyFilter === 'Semua' || doc.subSpecialty === bookingSpecialtyFilter || doc.specialty === bookingSpecialtyFilter).map((doc) => {
                              const isSelected = bookingForm.selectedDoctorId === doc.id;
                              return (
                                <div
                                  key={doc.id}
                                  onClick={() => setBookingForm({ ...bookingForm, selectedDoctorId: doc.id })}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer text-left ${
                                    isSelected
                                      ? 'bg-soft-mint border-yasmin-green shadow-xs'
                                      : 'bg-white border-divider/50 hover:border-yasmin-green'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-divider/60 flex items-center justify-center bg-gray-100">
                                      <SafeImage
                                        src={doc.image}
                                        alt={doc.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-display font-bold text-xs sm:text-sm text-headings truncate leading-tight">{doc.name}</p>
                                      <p className="text-[11px] sm:text-xs text-deep-teal font-semibold mt-0.5">{doc.subSpecialty || doc.specialty}</p>
                                      <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                                        <span className="font-semibold text-gray-400 font-mono uppercase tracking-wider text-[9px] block sm:inline mr-1">
                                          {currentLangCode === 'ID' ? 'Jadwal:' : currentLangCode === 'EN' ? 'Schedule:' : currentLangCode === 'KR' ? '진료 일정:' : currentLangCode === 'ZH' ? '排班:' : 'الجدول:'}
                                        </span>
                                        <span className="font-bold text-headings">{translateDays(doc.schedule.days, currentLangCode)}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Date and Time Slot Selector Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-500 mb-1.5 uppercase tracking-wide font-bold text-xs">{tReg.lblDateSelect}:</label>
                            <input
                              type="date"
                              required
                              value={bookingForm.selectedDate}
                              onChange={(e) => setBookingForm({ ...bookingForm, selectedDate: e.target.value })}
                              className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm font-mono text-headings"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-500 mb-1.5 uppercase tracking-wide font-bold text-xs">
                              {currentLangCode === 'ID' ? 'Sesi Kunjungan (Slot Waktu):' : currentLangCode === 'EN' ? 'Visit Session (Time Slot):' : currentLangCode === 'KR' ? '진료 세션 (시간대):' : currentLangCode === 'ZH' ? '就诊时段:' : 'فترة الزيارة (فترة زمنية):'}
                            </label>
                            {(() => {
                              const targetDoc = doctorsList.find(d => d.id === bookingForm.selectedDoctorId);
                              const slots = targetDoc?.schedule?.hours
                                ? targetDoc.schedule.hours.split(',').map(h => h.trim()).filter(Boolean)
                                : [];
                              
                              return (
                                <select
                                  value={bookingForm.selectedTimeSlot}
                                  onChange={(e) => setBookingForm({ ...bookingForm, selectedTimeSlot: e.target.value })}
                                  className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings font-sans font-semibold cursor-pointer"
                                >
                                  {slots.length > 0 ? (
                                    slots.map((slot, idx) => {
                                      let sessionLabel = '';
                                      // Extract hour to determine session prefix
                                      const hourVal = parseInt(slot.split(':')[0], 10);
                                      if (!isNaN(hourVal)) {
                                        if (hourVal < 11) {
                                          sessionLabel = currentLangCode === 'ID' ? 'Pagi' : currentLangCode === 'EN' ? 'Morning' : currentLangCode === 'KR' ? '오전' : currentLangCode === 'ZH' ? '上午' : 'صباحاً';
                                        } else if (hourVal < 15) {
                                          sessionLabel = currentLangCode === 'ID' ? 'Siang' : currentLangCode === 'EN' ? 'Afternoon' : currentLangCode === 'KR' ? '오후' : currentLangCode === 'ZH' ? '下午' : 'ظهراً';
                                        } else {
                                          sessionLabel = currentLangCode === 'ID' ? 'Sore-Malam' : currentLangCode === 'EN' ? 'Evening-Night' : currentLangCode === 'KR' ? '저녁-야간' : currentLangCode === 'ZH' ? '晚上' : 'مساءً';
                                        }
                                      }
                                      
                                      const displayLabel = sessionLabel ? `${sessionLabel} (${slot})` : slot;
                                      return (
                                        <option key={idx} value={slot}>
                                          {displayLabel}
                                        </option>
                                      );
                                    })
                                  ) : (
                                    <>
                                      <option value="Pagi (08:00 - 11:30)">
                                        {currentLangCode === 'ID' ? 'Pagi (08:00 - 11:30)' : currentLangCode === 'EN' ? 'Morning (08:00 - 11:30)' : currentLangCode === 'KR' ? '오전 (08:00 - 11:30)' : currentLangCode === 'ZH' ? '上午 (08:00 - 11:30)' : 'صباحاً (08:00 - 11:30)'}
                                      </option>
                                      <option value="Siang (12:00 - 14:30)">
                                        {currentLangCode === 'ID' ? 'Siang (12:00 - 14:30)' : currentLangCode === 'EN' ? 'Afternoon (12:00 - 14:30)' : currentLangCode === 'KR' ? '오후 (12:00 - 14:30)' : currentLangCode === 'ZH' ? '下午 (12:00 - 14:30)' : 'ظهراً (12:00 - 14:30)'}
                                      </option>
                                      <option value="Sore-Malam (15:00 - 18:30)">
                                        {currentLangCode === 'ID' ? 'Sore-Malam (15:00 - 18:30)' : currentLangCode === 'EN' ? 'Evening (15:00 - 18:30)' : currentLangCode === 'KR' ? '저녁 (15:00 - 18:30)' : currentLangCode === 'ZH' ? '晚上 (15:00 - 18:30)' : 'مساءً (15:00 - 18:30)'}
                                      </option>
                                    </>
                                  )}
                                </select>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Interactive Practice Schedule Helpers and Validation Alerts */}
                        {(() => {
                          const targetDoc = doctorsList.find(d => d.id === bookingForm.selectedDoctorId);
                          if (!targetDoc) return null;

                          const chosenDateDayName = bookingForm.selectedDate ? getDayNameIndonesian(bookingForm.selectedDate) : '';
                          const isDayValid = chosenDateDayName ? targetDoc.schedule.days.includes(chosenDateDayName) : false;
                          const upcomingDates = getUpcomingDoctorDates(targetDoc.schedule.days, currentLangCode, 4);

                          return (
                            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-divider/60 space-y-2.5 text-left">
                              <div className="text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">
                                  {currentLangCode === 'ID' ? 'Hari Praktek Dokter:' : currentLangCode === 'EN' ? 'Doctor Practice Days:' : currentLangCode === 'KR' ? '진료 요일:' : currentLangCode === 'ZH' ? '排班日:' : 'أيام العمل:'}
                                </span>
                                <span className="font-sans font-bold text-deep-teal text-sm inline-block mt-0.5">
                                  {translateDays(targetDoc.schedule.days, currentLangCode)}
                                </span>
                              </div>

                              {/* Chosen Date & Time Validation Badge */}
                              {bookingForm.selectedDate && (() => {
                                const now = new Date();
                                const todayStrCheck = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                const isDateToday = bookingForm.selectedDate === todayStrCheck;
                                
                                let isTimeExpired = false;
                                if (isDateToday) {
                                  const currentMins = now.getHours() * 60 + now.getMinutes();
                                  const match = bookingForm.selectedTimeSlot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
                                  if (match) {
                                    const endMins = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
                                    if (currentMins >= endMins) isTimeExpired = true;
                                  }
                                }

                                const isValidOverall = isDayValid && !isTimeExpired;

                                return (
                                  <div className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 ${
                                    isValidOverall 
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    <span className="text-base leading-none">{isValidOverall ? '✓' : '⚠️'}</span>
                                    <div className="flex-1">
                                      <p className="font-semibold">
                                        {!isDayValid ? (
                                          `Tidak Cocok: ${targetDoc.name} tidak praktek pada hari ${chosenDateDayName}`
                                        ) : isTimeExpired ? (
                                          `Sesi Terlewat: Sesi jam ${bookingForm.selectedTimeSlot} untuk hari ini sudah berakhir. Silakan pilih sesi berikutnya atau tanggal lain.`
                                        ) : (
                                          `Sesuai Jadwal: ${targetDoc.name} praktek pada hari ${chosenDateDayName}`
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Quick Select Buttons */}
                              {upcomingDates.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    {currentLangCode === 'ID' ? 'Rekomendasi Tanggal Praktek Terdekat (Klik):' : currentLangCode === 'EN' ? 'Quick-Select Recommended Dates:' : currentLangCode === 'KR' ? '추천 진료 날짜 (클릭):' : currentLangCode === 'ZH' ? '推荐就诊日期 (点击选择):' : 'اختر من التواريخ الموصى بها:'}
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {upcomingDates.map(({ dateStr, displayDate }) => {
                                      const isCurrent = bookingForm.selectedDate === dateStr;
                                      return (
                                        <button
                                          key={dateStr}
                                          type="button"
                                          onClick={() => setBookingForm(prev => ({ ...prev, selectedDate: dateStr }))}
                                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                            isCurrent 
                                              ? 'bg-yasmin-green text-white border-yasmin-green shadow-xs font-bold' 
                                              : 'bg-white text-gray-700 border-divider hover:border-yasmin-green hover:bg-soft-mint/20'
                                          }`}
                                        >
                                          {displayDate}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Complaint (Only for Pasien Baru) - aligned flush at the bottom with increased height */}
                        {bookingTab === 'BARU' && (
                          <div className="animate-fade-in-up mt-auto pt-2 flex-1 flex flex-col justify-end">
                            <label className="block text-gray-500 mb-1.5 uppercase tracking-wide font-bold text-xs">{tReg.lblComplaint}:</label>
                            <textarea
                              required
                              rows={6}
                              value={bookingForm.complaint || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, complaint: e.target.value })}
                              placeholder={currentLangCode === 'ID' ? "Sebutkan keluhan medis / ketidaknyamanan yang dirasakan secara lengkap..." : "Briefly describe your medical symptoms / discomfort in detail..."}
                              className="w-full bg-soft-mint px-4 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm text-headings font-sans font-normal leading-relaxed min-h-[160px] h-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Link Text - helpful resource links as per requested: "tambahkan teks link pd form" */}
                    <div className="bg-soft-mint/40 p-4 sm:p-5 rounded-2xl border border-divider/60 space-y-2 text-[11px] text-gray-500 text-left leading-relaxed">
                      <p className="font-bold text-headings text-xs">💬 {currentLangCode === 'ID' ? 'Tautan Informasi & Bantuan Penting:' : currentLangCode === 'EN' ? 'Information & Key Resources:' : currentLangCode === 'KR' ? '중요 안내 및 고객 지원:' : currentLangCode === 'ZH' ? '重要信息与帮助链接:' : 'روابط معلومات ومساعدة هامة:'}</p>
                      <ul className="list-disc pl-4 space-y-1.5">
                        <li>
                          {currentLangCode === 'ID' ? (
                            <>Butuh panduan pendaftaran manual? Silakan konsultasi langsung via WhatsApp <a href="https://wa.me/6285259353001" target="_blank" rel="noopener noreferrer" className="font-bold text-deep-teal underline hover:text-emerald-500">Sapa Yasmin 24 Jam ↗</a>.</>
                          ) : (
                            <>Need manual registration guidance? Consult directly via WhatsApp <a href="https://wa.me/6285259353001" target="_blank" rel="noopener noreferrer" className="font-bold text-deep-teal underline hover:text-emerald-500">Sapa Yasmin 24 Hours ↗</a>.</>
                          )}
                        </li>
                        <li>
                          {currentLangCode === 'ID' ? (
                            <>Cari nama dokter spesialis tertentu? Lihat jadwal aktif harian di <button type="button" onClick={() => { setActiveTab('DOKTER'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-bold text-deep-teal underline hover:text-emerald-500 cursor-pointer">Cari Dokter Spesialis RS Yasmin ↗</button>.</>
                          ) : (
                            <>Looking for a specific specialist? View the daily schedule at <button type="button" onClick={() => { setActiveTab('DOKTER'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-bold text-deep-teal underline hover:text-emerald-500 cursor-pointer">Find Yasmin Hospital Specialists ↗</button>.</>
                          )}
                        </li>
                        <li>
                          {currentLangCode === 'ID' ? (
                            <>Mencari petunjuk arah atau rute rumah sakit? Dapatkan rute Google Maps lengkap di <a href="#peta-lokasi" onClick={(e) => { e.preventDefault(); const el = document.getElementById('hubungi-kami'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="font-bold text-deep-teal underline hover:text-emerald-500">Peta & Lokasi Kami ↗</a>.</>
                          ) : (
                            <>Looking for directions? View our hospital Google Maps location at <a href="#peta-lokasi" onClick={(e) => { e.preventDefault(); const el = document.getElementById('hubungi-kami'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="font-bold text-deep-teal underline hover:text-emerald-500">Our Map & Location ↗</a>.</>
                          )}
                        </li>
                      </ul>
                    </div>

                    {/* Security Vector Captcha */}
                    <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-divider space-y-2.5 text-left w-full lg:max-w-[calc(50%-1rem)]">
                      <span className="block text-gray-500 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {currentLangCode === 'ID' ? 'Verifikasi Anti-Bot (Security Captcha)' : 'Anti-Bot Verification (Security Captcha)'}
                      </span>
                      <div className="flex flex-col md:flex-row md:items-end gap-3 w-full">
                        {/* Simulated Skewed Captcha Box */}
                        <div className="h-11 px-4 bg-gradient-to-r from-headings to-deep-teal rounded-xl select-none font-mono text-base font-black tracking-widest text-white shadow-inner flex items-center justify-center gap-1.5 shrink-0">
                          {captchaCode.split('').map((char, i) => (
                            <span 
                              key={i} 
                              style={{ 
                                transform: `rotate(${i % 2 === 0 ? '7deg' : '-7deg'}) translateY(${i % 3 === 0 ? '-2px' : '2px'})` 
                              }}
                              className="inline-block text-warm-orange drop-shadow-sm font-sans"
                            >
                              {char}
                            </span>
                          ))}
                        </div>

                        {/* Acak Baru Button */}
                        <button
                          type="button"
                          onClick={regenerateCaptcha}
                          className="h-11 px-4 bg-white hover:bg-gray-100 border border-divider text-gray-700 text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center justify-center space-x-1 shrink-0 shadow-2xs transition-colors"
                        >
                          <span>{currentLangCode === 'ID' ? 'Acak Baru 🔄' : 'Refresh 🔄'}</span>
                        </button>

                        {/* Text label and Input field directly to the right, spanning full remaining width */}
                        <div className="flex-1 min-w-0 space-y-1 w-full">
                          <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {currentLangCode === 'ID' ? 'Ketik 5 karakter kode anti-bot di samping:' : 'Type the 5-character anti-bot code:'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={currentLangCode === 'ID' ? "Masukkan kode anti-bot" : "Enter anti-bot code"}
                            value={captchaInput}
                            onChange={(e) => {
                              setCaptchaInput(e.target.value);
                              setCaptchaError(null);
                            }}
                            className="h-11 w-full bg-white px-4 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-xs sm:text-sm font-mono font-bold tracking-wider text-headings uppercase focus:ring-1 focus:ring-yasmin-green shadow-2xs"
                          />
                          {captchaError && (
                            <p className="text-red-500 text-[10px] font-semibold">⚠️ {captchaError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Consent checkbox */}
                    <div className="flex items-start space-x-2 pt-1 text-left">
                      <input
                        type="checkbox"
                        id="consent-check"
                        checked={bookingForm.whatsappConsent}
                        onChange={(e) => setBookingForm({ ...bookingForm, whatsappConsent: e.target.checked })}
                        className="rounded accent-yasmin-green mt-0.5 border-divider shrink-0 cursor-pointer text-xs"
                      />
                      <label htmlFor="consent-check" className="text-[10px] text-gray-400 font-normal leading-normal cursor-pointer">
                        {currentLangCode === 'ID' 
                          ? 'Saya menyetujui seluruh data di atas diproses oleh server admin RS Yasmin secara rahasia dan bersedia menerima rujukan nomor antrean langsung ke WhatsApp.' 
                          : 'I agree that all the data above will be processed confidentially by the RS Yasmin administration server and am willing to receive queue details directly on WhatsApp.'}
                      </label>
                    </div>

                    {/* Action buttons footer */}
                    <div className="pt-4 border-t border-divider flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          const backTab = 'BERANDA';
                          setActiveTab(backTab);
                          window.scrollTo({ top: 0 });
                        }}
                        className="w-full sm:w-auto px-6 py-3.5 bg-white text-gray-500 border border-divider font-bold rounded-xl text-xs hover:bg-gray-50 transition-colors cursor-pointer text-center shrink-0"
                      >
                        {currentLangCode === 'ID' ? 'Batal' : 'Cancel'}
                      </button>
                      {(() => {
                        const now = new Date();
                        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                        let isExpired = false;
                        if (bookingForm.selectedDate === todayStr) {
                          const curM = now.getHours() * 60 + now.getMinutes();
                          const m = bookingForm.selectedTimeSlot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
                          if (m && curM >= (parseInt(m[3], 10) * 60 + parseInt(m[4], 10))) {
                            isExpired = true;
                          }
                        }

                        return (
                          <button
                            type="submit"
                            disabled={isExpired}
                            className={`w-full sm:w-auto px-8 py-3.5 text-white font-black rounded-xl shadow-md border-none text-xs sm:text-sm tracking-wide transition-all text-center whitespace-nowrap shrink-0 ${
                              isExpired 
                                ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                                : 'bg-[#0B4F4A] hover:bg-yasmin-green cursor-pointer'
                            }`}
                          >
                            {isExpired 
                              ? (currentLangCode === 'ID' ? 'Sesi Terlewat (Pilih Jadwal Lain)' : 'Session Expired') 
                              : (currentLangCode === 'ID' ? 'Kirim & Daftarkan Booking' : 'Submit & Book Appointment')
                            }
                          </button>
                        );
                      })()}
                    </div>

                  </form>
                ) : (
                  /* SUCCESS TICKET RECEIPT DISPLAY WITH REAL CSV FOR EXCEL AND INSTANT MAIL TRANSMISSION SIMULATOR */
                  <div className="p-4 sm:p-10 text-center space-y-6 w-full max-w-full overflow-hidden">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 animate-bounce" />
                    </div>

                    <div>
                      <h4 className="font-display font-extrabold text-[#0B4F4A] text-lg">
                        {currentLangCode === 'ID' ? 'Pendaftaran Booking Online Berhasil!' : currentLangCode === 'EN' ? 'Online Booking Registration Successful!' : currentLangCode === 'KR' ? '온라인 예약 등록 성공!' : currentLangCode === 'ZH' ? '在线挂号成功！' : 'تم تسجيل الحجز بنجاح!'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto p-1 bg-emerald-500/5 rounded-md">
                        {currentLangCode === 'ID' ? `Tiket reservasi pasien (${bookingTab === 'TERDAFTAR' ? 'Pasien Terdaftar' : 'Pasien Baru'}) telah diverifikasi dan dicatat di database RS Yasmin.` : currentLangCode === 'EN' ? `Patient reservation ticket (${bookingTab === 'TERDAFTAR' ? 'Registered Patient' : 'New Patient'}) has been verified and recorded in the Yasmin Hospital database.` : currentLangCode === 'KR' ? `환자 예약 티켓(${bookingTab === 'TERDAFTAR' ? '등록 환자' : '신규 환자'})이 확인되어 야스민 병원 데이터베이스에 기록되었습니다.` : currentLangCode === 'ZH' ? `患者预约凭证（${bookingTab === 'TERDAFTAR' ? '已登记患者' : '新患者'}）已验证并记录在雅斯敏医院数据库中。` : `تم التحقق من تذكرة حجز المريض (${bookingTab === 'TERDAFTAR' ? 'مريض مسجل' : 'مريض جديد'}) وتسجيلها في قاعدة بيانات مستشفى ياسمين.`}
                      </p>
                    </div>

                    {/* Dynamic Real-time Email Data Delivery Dashboard Block */}
                    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 text-left font-mono text-[10px] leading-relaxed max-w-md mx-auto space-y-2.5">
                      <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-2">
                        <span className="font-bold flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-emerald-400" /> {currentLangCode === 'ID' ? 'STATUS EMAIL PENGIRIMAN' : 'EMAIL TRANSMISSION STATUS'}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded uppercase">{currentLangCode === 'ID' ? 'TERKIRIM 100%' : 'DELIVERED 100%'}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-slate-400">
                        <span className="font-semibold">{currentLangCode === 'ID' ? 'KE:' : 'TO:'}</span>
                        <span className="col-span-3 text-slate-200">yasmin_hospital@yahoo.com</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-slate-400">
                        <span className="font-semibold">{currentLangCode === 'ID' ? 'LAMPIRAN:' : 'ATTACHMENT:'}</span>
                        <span className="col-span-3 text-emerald-400 font-bold underline select-all break-all text-[9.5px]">
                          {csvFileName} ({currentLangCode === 'ID' ? 'Format File CSV' : 'CSV File Format'})
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 text-[9px] text-slate-400">
                        {currentLangCode === 'ID' ? '✓ Struktur data CSV telah diformat kompatibel dengan Microsoft Excel / database.' : '✓ CSV data structure is formatted to be fully compatible with Microsoft Excel & databases.'}
                      </div>
                    </div>

                    {/* Real Download Trigger for Client-Side CSV Persistence */}
                    {csvDownloadUrl && (
                      <div className="max-w-md mx-auto">
                        <a 
                          href={csvDownloadUrl}
                          download={csvFileName}
                          className="w-full inline-flex items-center justify-center space-x-2.5 px-5 py-3.5 bg-[#0B4F4A] hover:bg-yasmin-green text-white rounded-xl shadow-lg font-bold text-xs tracking-wider transition-colors cursor-pointer"
                        >
                          <span>💾 {currentLangCode === 'ID' ? 'UNDUH LAMPIRAN PENDAFTARAN (.CSV)' : 'DOWNLOAD REGISTRATION ATTACHMENT (.CSV)'}</span>
                        </a>
                      </div>
                    )}

                    {/* Booking Receipt Design */}
                    <div className="bg-soft-mint p-4 sm:p-5 rounded-2xl border-2 border-dashed border-divider w-full max-w-full sm:max-w-md mx-auto text-left space-y-3 font-mono text-[11px] overflow-hidden">
                      <div className="flex justify-between border-b border-divider pb-2 font-display">
                        <span className="font-bold text-headings">{currentLangCode === 'ID' ? 'NOMOR INSTAN TIKET:' : 'INSTANT TICKET NUMBER:'}</span>
                        <strong className="text-emerald-600 font-extrabold tracking-wider">{bookingReceipt?.id}</strong>
                      </div>

                      <div>
                        <p className="text-gray-400">{currentLangCode === 'ID' ? 'NAMA PASIEN:' : 'PATIENT NAME:'}</p>
                        <p className="font-bold text-headings text-xs">{bookingForm.patientName}</p>
                      </div>

                      {bookingTab === 'TERDAFTAR' && (
                        <div>
                          <p className="text-gray-400">{currentLangCode === 'ID' ? 'NOMOR KARTU KIUP:' : 'KIUP RECORD NUMBER:'}</p>
                          <p className="font-bold text-headings text-xs">{bookingForm.kiupNumber}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 border-t border-divider/40 pt-2 font-semibold">
                        <div>
                          <p className="text-gray-400">{currentLangCode === 'ID' ? 'DOKTER TUJUAN:' : 'TARGET DOCTOR:'}</p>
                          <p className="font-bold text-headings truncate">
                            {doctorsList.find(d => d.id === bookingForm.selectedDoctorId)?.name || 'Dokter Spesialis'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">{currentLangCode === 'ID' ? 'KATEGORI JAMINAN:' : 'GUARANTEE CATEGORY:'}</p>
                          <p className="font-bold text-headings text-xs">
                            {bookingTab === 'TERDAFTAR' 
                              ? (currentLangCode === 'ID' ? 'Pasien Terdaftar' : 'Registered Patient') 
                              : `${bookingForm.patientType}`}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-divider/40 pt-2 font-semibold font-mono text-[10px]">
                        <div>
                          <p className="text-gray-400 font-semibold">{currentLangCode === 'ID' ? 'UNIT LAYANAN:' : 'MEDICAL UNIT:'}</p>
                          <p className="font-bold text-emerald-700 truncate text-[10.5px]">
                            {SERVICE_TYPE_LABELS[bookingForm.serviceType || 'Poli Spesialis / Umum']?.[currentLangCode] || bookingForm.serviceType}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">{currentLangCode === 'ID' ? 'SESI KUNJUNGAN:' : 'VISIT SESSION:'}</p>
                          <p className="font-bold text-headings truncate">
                            {bookingForm.selectedTimeSlot}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-divider/40 pt-2">
                        <p className="text-gray-400">{currentLangCode === 'ID' ? 'HARI / TANGGAL RESERVASI:' : 'RESERVATION DATE:'}</p>
                        <p className="font-bold text-headings bg-white px-2 py-1 rounded border border-divider inline-block">
                          {bookingForm.selectedDate}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto pt-2">
                      <p className="text-[11px] text-gray-400 leading-normal">
                        {currentLangCode === 'ID' 
                          ? 'Kirim salinan data ini ke WhatsApp Hotline Resmi Sapa Yasmin (+62 852 5935 3001) guna mempermudah konfirmasi antrean fisik Anda pagi hari.' 
                          : 'Send a copy of this data to the Official Sapa Yasmin WhatsApp Hotline (+62 852 5935 3001) to facilitate quick confirmation of your physical queue in the morning.'}
                      </p>

                      <button
                        onClick={triggerWhatsAppRedirect}
                        className="w-full py-4 bg-whatsapp hover:bg-emerald-600 font-display font-bold text-xs tracking-wider rounded-xl text-white shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer border-none"
                      >
                        <WhatsAppIcon className="h-5 w-5 fill-current text-white animate-whatsapp-shake" />
                        <span>{currentLangCode === 'ID' ? 'KIRIM DATA KE WHATSAPP RS YASMIN' : 'SEND DATA TO YASMIN WHATSAPP'}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setActiveTab('BERANDA');
                          setWizardStep(1);
                        }}
                        className="w-full py-2.5 bg-transparent text-gray-400 hover:text-gray-600 text-[10px] uppercase font-bold tracking-widest border border-divider rounded-lg cursor-pointer animate-fade-in-up"
                      >
                        {currentLangCode === 'ID' ? 'Tutup & Kembali Ke Beranda' : 'Close & Return to Home'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
          </>
        )}

      </main>

      {/* RENDER CONTACT US SECTION GLOBALLY BEFORE FOOTER */}
      <ContactSection />

      {/* FOOTER component */}
      <Footer
        activeTab={activeTab}
        onNavClick={setActiveTab}
        onOpenBookingWizard={() => handleOpenBookingWizard()}
        onSelectSubmenu={handleSelectSubmenu}
        onSelectHealthCenter={handleSelectHealthCenter}
        rsInfo={rsInfo}
      />

      {/* 24-HOUR EMERGENCY OR INQUIRY FLOATING CHAT BALLOON WIDGET (BOTTOM RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
        {/* Expanded micro assistance box */}
        {chatWidgetOpen && (
          <div className="bg-white border border-divider shadow-2xl rounded-3xl p-5 w-80 max-w-full text-left animate-fade-in-up space-y-4">
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-whatsapp animate-ping" />
                <span className="font-display font-bold text-xs text-headings">Layanan Sapa RS Yasmin</span>
              </div>
              <button
                onClick={() => setChatWidgetOpen(false)}
                className="p-1 rounded-full text-white transition-all cursor-pointer animate-red-blink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-gray-500 leading-normal">
                Halo! Kami siap mendampingi kebutuhan medis dan administrasi Anda. Pilih topik sapaan cepat untuk terhubung ke WhatsApp hotline kami:
              </p>

              <div className="flex flex-col space-y-1.5 text-xs">
                <a
                  href={`https://wa.me/6285259353001?text=${encodeURIComponent('Halo RS Yasmin, saya ingin mendaftar berobat rawat jalan umum.')}`}
                  target="_blank"
                  rel="noopener"
                  className="px-3.5 py-2.5 bg-soft-mint hover:bg-deep-teal hover:text-white rounded-xl border border-divider/60 font-semibold text-deep-teal transition-colors flex items-center justify-between"
                >
                  <span>Pendaftaran Rawat Jalan</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>

                <a
                  href={`https://wa.me/6285259353001?text=${encodeURIComponent('Halo RS Yasmin, saya ingin menanyakan rujukan administrasi BPJS Kesehatan.')}`}
                  target="_blank"
                  rel="noopener"
                  className="px-3.5 py-2.5 bg-soft-mint hover:bg-deep-teal hover:text-white rounded-xl border border-divider/60 font-semibold text-deep-teal transition-colors flex items-center justify-between"
                >
                  <span>Informasi Rujukan BPJS</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>

                <a
                  href={`https://wa.me/6285259353001?text=${encodeURIComponent('Halo RS Yasmin, saya ingin reservasi kamar Rawat Inap Resort.')}`}
                  target="_blank"
                  rel="noopener"
                  className="px-3.5 py-2.5 bg-soft-mint hover:bg-deep-teal hover:text-white rounded-xl border border-divider/60 font-semibold text-deep-teal transition-colors flex items-center justify-between"
                >
                  <span>Booking Kamar Rawat Inap</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-soft-mint p-3 rounded-xl border border-divider text-[10px] text-gray-400">
              Hotline IGD Siaga 24 Jam: <a href="tel:0333-424671" className="font-mono font-bold text-emergency">0333-424671</a>
            </div>
          </div>
        )}

        {/* Trigger Bubble Button */}
        <button
          onClick={() => setChatWidgetOpen(!chatWidgetOpen)}
          className="w-12 h-12 flex items-center justify-center bg-whatsapp hover:bg-emerald-600 text-white rounded-full shadow-2xl transform active:scale-95 transition-all cursor-pointer animate-whatsapp-shake"
          id="floating-wa-bubble"
          title="Sapa WhatsApp RS Yasmin"
        >
          <WhatsAppIcon className="h-6 w-6 text-white fill-current animate-whatsapp-shake" />
        </button>
 
         {/* Back to top bullet */}
         {showScrollTop && (
           <button
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="w-12 h-12 flex items-center justify-center bg-headings hover:bg-deep-teal text-white rounded-full shadow-lg transition-all transform active:scale-90 cursor-pointer border-2 border-warm-orange"
             title="Kembali ke atas"
           >
             <ArrowUp className="h-5 w-5 text-warm-orange" />
           </button>
         )}
      </div>

      {/* berita ACTIVE ANNOUNCEMENTS POPUP SLIDER */}
      {showWelcomePopup && activeAnnouncements.length > 0 && (
        <div id="welcome-popup" className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full flex flex-col relative animate-scale-up border border-white/10">
            
            {/* Header banner indicating berita */}
            <div className="bg-amber-500 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-600/20">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔔</span>
                <span className="font-display font-black text-xs uppercase tracking-wider">Pengumuman Berita Hari Ini</span>
              </div>
              <button 
                onClick={() => setShowWelcomePopup(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer"
                title="Tutup"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Slider Content Wrapper (Sliding image frame) */}
            <div className="relative h-[360px] w-full bg-slate-900 overflow-hidden">
              <div 
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentAnnIndex * 100}%)` }}
              >
                {activeAnnouncements.map((ann, idx) => (
                  <div key={ann.id || idx} className="w-full h-full shrink-0 relative flex items-center justify-center">
                    {ann.image ? (
                      <SafeImage 
                        src={ann.image} 
                        alt={ann.title || "Pengumuman"} 
                        className="h-full w-full object-cover select-none"
                      />
                    ) : (
                      <div className="text-center text-slate-400 space-y-3 p-6">
                        <Megaphone className="h-16 w-16 mx-auto stroke-1 text-amber-500 animate-bounce" />
                        <p className="text-sm font-semibold">Pengumuman RS Yasmin</p>
                      </div>
                    )}
                    
                    {/* Visual bottom dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
                    
                    {/* Floating Title / Text directly on top of image slide */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white pointer-events-none">
                      <span className="inline-flex items-center space-x-1.5 bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>BERITA LIVE</span>
                      </span>
                      <h4 className="font-display font-black text-white text-base md:text-lg leading-snug drop-shadow-lg">
                        {ann.title || "Pengumuman RS Yasmin Banyuwangi"}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Arrows (only if multi-item) */}
              {activeAnnouncements.length > 1 && (
                <>
                  <button 
                    onClick={() => {
                      setCurrentAnnIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
                      setAutoplayTrigger(prev => prev + 1);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95 z-10 flex items-center justify-center"
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4 font-black" />
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentAnnIndex((prev) => (prev + 1) % activeAnnouncements.length);
                      setAutoplayTrigger(prev => prev + 1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95 z-10 flex items-center justify-center"
                    title="Berikutnya"
                  >
                    <ChevronRight className="h-4 w-4 font-black" />
                  </button>
                </>
              )}

              {/* Slide indicators / Dots (only if multi-item) inside the image */}
              {activeAnnouncements.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {activeAnnouncements.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => {
                        setCurrentAnnIndex(dotIdx);
                        setAutoplayTrigger(prev => prev + 1);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentAnnIndex === dotIdx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/50 hover:bg-white'
                      }`}
                      title={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom action bar */}
            <div className="px-5 py-4 bg-slate-50 border-t border-divider flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider bg-slate-200/50 px-2.5 py-1 rounded-full">
                Slide {currentAnnIndex + 1} dari {activeAnnouncements.length}
              </span>
              <button
                onClick={() => setShowWelcomePopup(false)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Tutup Pengumuman
              </button>
            </div>

          </div>
        </div>
      )}

      {/* KAMAR RAWAT INFO POPUP MODAL */}
      {showKamarInfoModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col max-h-[90vh] animate-scale-up border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-deep-teal to-yasmin-green text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🛏️</span>
                <div>
                  <h3 className="font-display font-black text-lg leading-tight uppercase tracking-wide">Informasi Ketersediaan Kamar</h3>
                  <p className="text-xs text-warm-ivory/80">Update Real-time Kamar Rawat Inap, ICU, dan IGD RS Yasmin</p>
                </div>
              </div>
              <button 
                onClick={() => setShowKamarInfoModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/30 font-sans relative">
              
              {/* Cards row as interactive buttons sticky at top */}
              <div className="sticky -top-6 bg-slate-50/95 backdrop-blur-md pt-1 pb-4 border-b border-divider -mx-6 px-6 z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['Rawat Inap', 'ICU', 'IGD'] as const).map((type) => {
                    // Group rooms by type and calculate totals
                    const filtered = roomsList.filter(r => r.type === type);
                    const total = filtered.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
                    const occupied = filtered.reduce((acc, r) => acc + (Number(r.occupied) || 0), 0);
                    const sisa = Math.max(0, total - occupied);

                    const iconMap = {
                      'Rawat Inap': '🏡',
                      'ICU': '🚨',
                      'IGD': '🏥'
                    };

                    const isSelected = selectedKamarTab === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedKamarTab(type)}
                        className={`text-left rounded-2xl border p-4.5 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01] cursor-pointer focus:outline-none focus:ring-2 focus:ring-yasmin-green/20 ${
                          isSelected
                            ? 'border-emerald-300 bg-emerald-50/80 shadow-md ring-1 ring-emerald-300/40'
                            : 'bg-white border-divider shadow-xs hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className={`text-[9px] font-bold uppercase tracking-wider font-mono ${
                              isSelected ? 'text-emerald-700' : 'text-gray-400'
                            }`}>
                              {type === 'Rawat Inap' ? 'KAMAR RAWAT INAP' : type === 'ICU' ? 'KAMAR ICU' : 'KAMAR IGD'}
                            </p>
                            <h4 className={`font-display font-black text-lg mt-0.5 ${
                              isSelected ? 'text-emerald-950' : 'text-headings'
                            }`}>{type}</h4>
                          </div>
                          <span className={`text-xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'opacity-80'}`}>{iconMap[type]}</span>
                        </div>
                        
                        {/* STATS: format jumlah, terisi, sisa */}
                        <div className={`grid grid-cols-3 gap-1 border-t pt-2.5 text-center text-xs ${
                          isSelected ? 'border-emerald-200/50' : 'border-slate-100'
                        }`}>
                          <div>
                            <span className={`block text-[9px] font-bold uppercase tracking-wide ${isSelected ? 'text-emerald-700/60' : 'text-gray-400'}`}>Jumlah</span>
                            <span className={`font-mono text-sm font-black ${isSelected ? 'text-emerald-900' : 'text-headings'}`}>{total}</span>
                          </div>
                          <div>
                            <span className={`block text-[9px] font-bold uppercase tracking-wide ${isSelected ? 'text-emerald-700/60' : 'text-gray-400'}`}>Terisi</span>
                            <span className="font-mono text-sm font-black text-amber-600">{occupied}</span>
                          </div>
                          <div>
                            <span className={`block text-[9px] font-bold uppercase tracking-wide ${isSelected ? 'text-emerald-700/60' : 'text-gray-400'}`}>Sisa</span>
                            <span className="font-mono text-sm font-black text-emerald-600">{sisa}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isSelected ? 'bg-emerald-100/60' : 'bg-slate-100'}`}>
                            <div 
                              className={`h-full transition-all duration-500 ${isSelected ? 'bg-emerald-600' : 'bg-gradient-to-r from-yasmin-green to-deep-teal'}`} 
                              style={{ width: `${total > 0 ? (occupied / total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Lists with Collapsible Group Frame */}
              <div className="space-y-4 text-left">
                <h4 className="font-display font-extrabold text-xs text-slate-400 tracking-wider uppercase border-b pb-2">
                  Detail Kamar: <span className="text-emerald-700 font-black font-sans">{selectedKamarTab}</span>
                </h4>
                
                {(() => {
                  const type = selectedKamarTab;
                  const filtered = roomsList.filter(r => r.type === type);
                  const total = filtered.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
                  const occupied = filtered.reduce((acc, r) => acc + (Number(r.occupied) || 0), 0);
                  const sisa = Math.max(0, total - occupied);

                  return (
                    <div className="bg-white rounded-2xl border border-divider shadow-sm overflow-hidden animate-fade-in">
                      <div className="bg-emerald-50/30 px-5 py-3.5 border-b border-divider flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-yasmin-green animate-pulse" />
                          <span className="font-display font-bold text-sm text-headings">{type} ({filtered.length} Ruangan)</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-soft-mint px-2.5 py-1 rounded-full text-deep-teal">
                          Sisa: {sisa} Bed
                        </span>
                      </div>
                      
                      {filtered.length === 0 ? (
                        <p className="p-4 text-xs text-gray-400 font-medium text-center">Belum ada rincian data ruangan untuk kategori ini.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs font-sans">
                            <thead>
                              <tr className="bg-slate-50/50 border-b border-divider text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-5 py-3">Nama Kamar / Ruang</th>
                                <th className="px-5 py-3">Kelas</th>
                                <th className="px-5 py-3 text-center">Kapasitas</th>
                                <th className="px-5 py-3 text-center">Terisi</th>
                                <th className="px-5 py-3 text-center">Sisa</th>
                                <th className="px-5 py-3">Fasilitas Utama</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-divider">
                              {filtered.map((r, rIdx) => {
                                const roomSisa = Math.max(0, (Number(r.capacity) || 0) - (Number(r.occupied) || 0));
                                return (
                                  <tr key={r.id || rIdx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-3 font-bold text-gray-800">{r.name}</td>
                                    <td className="px-5 py-3">
                                      <span className="px-2.5 py-0.5 bg-slate-100 rounded-full font-bold text-[10px] text-gray-600">
                                        {r.class}
                                      </span>
                                    </td>
                                    <td className="px-5 py-3 text-center font-mono font-bold text-gray-500">{r.capacity}</td>
                                    <td className="px-5 py-3 text-center font-mono font-bold text-amber-600">{r.occupied}</td>
                                    <td className="px-5 py-3 text-center font-mono font-bold text-emerald-600">{roomSisa}</td>
                                    <td className="px-5 py-3 text-gray-500 max-w-xs truncate" title={r.facilities}>{r.facilities || '-'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-divider flex items-center justify-between text-xs">
              <span className="text-gray-400">Tekan tombol tutup atau klik tombol di sebelah kanan untuk kembali.</span>
              <button 
                onClick={() => setShowKamarInfoModal(false)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-950 text-white rounded-xl font-bold transition-all cursor-pointer shadow-xs"
              >
                Tutup Info Kamar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AMBULANCE INFO POPUP MODAL */}
      {showAmbulanceInfoModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-xl w-full flex flex-col relative animate-scale-up border border-slate-200">
            {/* Header background with red/amber stripes for alert emergency vibe */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl animate-pulse">🚑</span>
                <div>
                  <h3 className="font-display font-black text-lg leading-tight uppercase tracking-wide">Ambulance Darurat 24 Jam</h3>
                  <p className="text-xs text-white/80">Layanan Jemput Pasien & Tanggap Darurat RS Yasmin</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAmbulanceInfoModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-left text-sm font-sans max-h-[80vh] overflow-y-auto">
              
              {/* Fleet Status Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center shadow-xs">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">TOTAL ARMADA</span>
                  <span className="font-mono text-xl font-black text-slate-800">5 Unit</span>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 text-center shadow-xs">
                  <span className="block text-[9px] font-bold text-emerald-600 uppercase tracking-wider">STANDBY</span>
                  <span className="font-mono text-xl font-black text-emerald-700">3 Unit</span>
                </div>
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3 text-center shadow-xs">
                  <span className="block text-[9px] font-bold text-amber-600 uppercase tracking-wider">KELUAR</span>
                  <span className="font-mono text-xl font-black text-amber-700 animate-pulse">2 Unit</span>
                </div>
              </div>

              {/* Status Detail Armada */}
              <div className="space-y-2.5">
                <h4 className="font-display font-extrabold text-xs text-slate-700 uppercase tracking-wider border-b pb-1.5 flex justify-between items-center">
                  <span>Status Detail Armada Ambulance</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">Live Status</span>
                </h4>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  
                  {/* Ambulance 1 */}
                  <div className="bg-white border border-divider rounded-xl p-3 flex justify-between items-center hover:border-slate-300 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🚑</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-slate-800">Amb-01</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-slate-100 px-1.5 py-0.5 rounded">DK 1124 YM</span>
                        </div>
                        <p className="text-[10px] text-gray-550 mt-0.5">Tipe: Gawat Darurat Utama</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>STANDBY</span>
                      </span>
                    </div>
                  </div>

                  {/* Ambulance 2 */}
                  <div className="bg-amber-50/20 border border-amber-100 rounded-xl p-3 flex justify-between items-start hover:border-amber-200 transition-all">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl mt-0.5">🚑</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-slate-800">Amb-02</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-slate-100 px-1.5 py-0.5 rounded">DK 1125 YM</span>
                        </div>
                        <p className="text-[10px] text-gray-550 mt-0.5">Tipe: ICU Transport Gawat Darurat</p>
                        {/* Keterangan Wilayah Keluar */}
                        <div className="mt-1.5 bg-amber-50/70 border border-amber-100/50 rounded-lg p-2 text-[10.5px] leading-relaxed text-amber-800 font-semibold">
                          <span className="block text-[8px] font-bold uppercase tracking-wider text-amber-600 font-mono mb-0.5">DIKERAHKAN / KELUAR</span>
                          📍 Area: <span className="underline font-black text-amber-900">Banyuwangi Kota (RSU Blambangan)</span>
                          <span className="block text-[9.5px] text-gray-500 font-medium font-sans mt-0.5">Rujukan Pasien ICU Kritis</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-xs">
                      KELUAR
                    </span>
                  </div>

                  {/* Ambulance 3 */}
                  <div className="bg-white border border-divider rounded-xl p-3 flex justify-between items-center hover:border-slate-300 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🚑</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-slate-800">Amb-03</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-slate-100 px-1.5 py-0.5 rounded">DK 1126 YM</span>
                        </div>
                        <p className="text-[10px] text-gray-550 mt-0.5">Tipe: Gawat Darurat Standar</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>STANDBY</span>
                      </span>
                    </div>
                  </div>

                  {/* Ambulance 4 */}
                  <div className="bg-amber-50/20 border border-amber-100 rounded-xl p-3 flex justify-between items-start hover:border-amber-200 transition-all">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl mt-0.5">🚑</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-slate-800">Amb-04</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-slate-100 px-1.5 py-0.5 rounded">DK 1127 YM</span>
                        </div>
                        <p className="text-[10px] text-gray-550 mt-0.5">Tipe: Mobil Jenazah Utama</p>
                        {/* Keterangan Wilayah Keluar */}
                        <div className="mt-1.5 bg-amber-50/70 border border-amber-100/50 rounded-lg p-2 text-[10.5px] leading-relaxed text-amber-800 font-semibold">
                          <span className="block text-[8px] font-bold uppercase tracking-wider text-amber-600 font-mono mb-0.5">DIKERAHKAN / KELUAR</span>
                          📍 Area: <span className="underline font-black text-amber-900">Kecamatan Rogojampi (Dusun Krajan)</span>
                          <span className="block text-[9.5px] text-gray-500 font-medium font-sans mt-0.5">Pelayanan Pengantaran Jenazah</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-xs">
                      KELUAR
                    </span>
                  </div>

                  {/* Ambulance 5 */}
                  <div className="bg-white border border-divider rounded-xl p-3 flex justify-between items-center hover:border-slate-300 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🚑</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-slate-800">Amb-05</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-slate-100 px-1.5 py-0.5 rounded">DK 1128 YM</span>
                        </div>
                        <p className="text-[10px] text-gray-550 mt-0.5">Tipe: Transport Medis Non-Emergency</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>STANDBY</span>
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Hotline Alert Call section */}
              <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-4.5 space-y-2">
                <span className="inline-flex items-center space-x-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>CALL CENTER EMERGENCY</span>
                </span>
                <p className="font-mono text-xl font-black text-red-600 tracking-wider">
                  (0333) 123456
                </p>
                <p className="text-[10.5px] text-gray-550 font-medium">
                  Merespon panggilan emergency darurat kecelakaan, rujukan, atau penjemputan medis secara instan 24 jam sehari.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-1 flex flex-col sm:flex-row gap-3">
                <a 
                  href="tel:0333-123456"
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  <span>📞 PANGGIL AMBULANCE</span>
                </a>
                <a 
                  href="https://wa.me/6285259353001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-whatsapp hover:bg-emerald-600 text-white font-black rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  <span>Hubungi WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="px-6 py-4 bg-slate-50 border-t border-divider flex items-center justify-end">
              <button 
                onClick={() => setShowAmbulanceInfoModal(false)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Tutup Info
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
