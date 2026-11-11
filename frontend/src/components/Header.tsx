import React, { useState, useEffect } from 'react';
import { 
  Leaf, Calendar, Menu, X, MessageSquare, Phone, Ambulance, PhoneCall, Search, Globe, ChevronDown, Check, ChevronRight,
  Compass, Award, ShieldCheck, Handshake, Users, HelpCircle, BookOpen, Smile, Heart, Droplet
} from 'lucide-react';
import { ActiveTabType } from '../types';
import WhatsAppIcon from './WhatsAppIcon';
import { HEALTH_CENTERS_TRANSLATIONS } from './HealthCenters';
import { SafeImage, getImgUrl } from '../utils/imageUrl';

const logoRsYasmin = '/assets/images/utama/logo_rsyasminbwi.png';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenBookingWizard: () => void;
  onSelectSubmenu?: (id: string) => void;
  onSelectHealthCenter?: (id: string) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  currentLangCode?: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR';
  onChangeLang?: (code: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR') => void;
  onOpenInfoberita?: () => void;
  onOpenInfoKamar?: () => void;
  onOpenInfoAmbulance?: () => void;
  rsInfo?: any;
}

// Full multi-language menu translation dictionaries
const TRANSLATIONS = {
  ID: {
    BERANDA: 'BERANDA',
    DOKTER: 'DOKTER',
    LAYANAN: 'LAYANAN',
    FASILITAS: 'FASILITAS',
    KOMUNITAS: 'KOMUNITAS',
    'TENTANG KAMI': 'TENTANG KAMI',
    searchPlaceholder: 'Cari dokter atau layanan...',
    daftarOnline: 'DAFTAR ONLINE',
    sambutan: 'Sambutan Direktur',
    visiMisi: 'Visi & Misi',
    prestasi: 'Prestasi RS Yasmin',
    pillars: '5 Pilar Keunikan',
    gallery: 'GALERI',
    kemitraan: 'Kemitraan & Rekanan',
    faq: 'Tanya Jawab (FAQ)',
    testimoni: 'Testimoni Pasien',
    hubungiKami: 'Hubungi Kami',
    ambulance: 'Ambulans',
    igdHotline: 'IGD 24 Jam',
    chatWa: 'WhatsApp'
  },
  EN: {
    BERANDA: 'HOME',
    DOKTER: 'DOCTORS',
    LAYANAN: 'SERVICES',
    FASILITAS: 'FACILITIES',
    KOMUNITAS: 'COMMUNITY',
    'TENTANG KAMI': 'ABOUT US',
    searchPlaceholder: 'Search doctors or services...',
    daftarOnline: 'BOOK ONLINE',
    sambutan: 'Director’s Message',
    visiMisi: 'Vision & Mission',
    prestasi: 'Yasmin Achievements',
    pillars: '5 Unique Pillars',
    gallery: 'GALLERY',
    kemitraan: 'Kemitraan & Partners',
    faq: 'FAQs Support',
    testimoni: 'Patient Testimonials',
    hubungiKami: 'Contact Us',
    ambulance: 'Ambulance',
    igdHotline: 'IGD 24 Hours',
    chatWa: 'WhatsApp'
  },
  KR: {
    BERANDA: '홈',
    DOKTER: '의료진 소개',
    LAYANAN: '의료 서비스',
    FASILITAS: '진료 시설',
    KOMUNITAS: '커뮤니티',
    'TENTANG KAMI': '병원 소개',
    searchPlaceholder: '의사 또는 의료 서비스 검색...',
    daftarOnline: '온라인 진료 예약',
    sambutan: '병원장 인사말',
    visiMisi: '비전 및 사명',
    prestasi: '그린 병원 인증',
    pillars: '5대 고유 기둥',
    gallery: '갤러리',
    kemitraan: '보험 파트너십',
    faq: '자주 묻는 질문 (FAQ)',
    testimoni: '환자 후기',
    hubungiKami: '오시는 길',
    ambulance: '구급차 대기',
    igdHotline: '응급실 24h',
    chatWa: '왓츠앱'
  },
  ZH: {
    BERANDA: '主页',
    DOKTER: '寻找医生',
    LAYANAN: '医疗服务',
    FASILITAS: '医疗设施',
    KOMUNITAS: '健康俱乐部',
    'TENTANG KAMI': '关于我们',
    searchPlaceholder: '搜索医生名字或科室...',
    daftarOnline: '在线专家挂号',
    sambutan: '院长欢迎致辞',
    visiMisi: '医院院景与使命',
    prestasi: '医院学术与荣誉',
    pillars: '5大独特支柱',
    gallery: '医院画廊',
    kemitraan: '医保与商保合作',
    faq: '常见疑问解答',
    testimoni: '康复患者口碑',
    hubungiKami: '联系咨询我们',
    ambulance: '急救救护车',
    igdHotline: '急诊 24 小时',
    chatWa: '微信/WhatsApp'
  },
  AR: {
    BERANDA: 'الرئيسية',
    DOKTER: 'الأطباء',
    LAYANAN: 'الخدمات الطبية',
    FASILITAS: 'المرافق والخدمات',
    KOMUNITAS: 'المجتمع',
    'TENTANG KAMI': 'من نحن',
    searchPlaceholder: 'البحث عن طبيب أو قسم...',
    daftarOnline: 'احجز موعداً',
    sambutan: 'رسالة المدير',
    visiMisi: 'الرؤية والرسالة',
    prestasi: 'إنجازات ياسمين',
    pillars: '٥ ركائز فريدة',
    gallery: 'معرض الصور',
    kemitraan: 'الشركاء والجهات',
    faq: 'الأسئلة الشائعة',
    testimoni: 'آراء المرضى',
    hubungiKami: 'اتصل بنا',
    ambulance: 'الإسعاف الطائر',
    igdHotline: 'الطوارئ 24 ساعة',
    chatWa: 'واتساب'
  }
};

const LANGUAGES_LIST = [
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'KR', name: 'Korea', flag: '🇰🇷' },
  { code: 'ZH', name: 'China', flag: '🇨🇳' },
  { code: 'AR', name: 'Arab', flag: '🇸🇦' }
];

const getFlagImg = (code: string) => {
  const map: Record<string, string> = {
    ID: 'id',
    EN: 'gb',
    KR: 'kr',
    ZH: 'cn',
    AR: 'sa'
  };
  return (
    <img
      src={`https://flagcdn.com/w40/${map[code] || 'id'}.png`}
      alt={code}
      className="w-5 h-3.5 object-cover rounded-xs border border-gray-200 shrink-0 inline-block mb-0.5"
      
    />
  );
};

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenBookingWizard, 
  onSelectSubmenu,
  onSelectHealthCenter,
  searchTerm = '',
  onSearchChange,
  currentLangCode: propCurrentLangCode,
  onChangeLang,
  onOpenInfoberita,
  onOpenInfoKamar,
  onOpenInfoAmbulance,
  rsInfo
}: HeaderProps) {
  const headerLogo = rsInfo?.logo || logoRsYasmin;
  const headerName = rsInfo?.name || "RS YASMIN";
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [headerLogo]);

  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAboutMobileOpen, setIsAboutMobileOpen] = useState(false);
  const [isLayananMobileOpen, setIsLayananMobileOpen] = useState(false);
  const [isKomunitasMobileOpen, setIsKomunitasMobileOpen] = useState(false);
  const [isAboutSubmenuOpen, setIsAboutSubmenuOpen] = useState(false);
  const [isLayananSubmenuOpen, setIsLayananSubmenuOpen] = useState(false);
  const [isKomunitasSubmenuOpen, setIsKomunitasSubmenuOpen] = useState(false);
  const [localLangCode, setLocalLangCode] = useState<'ID' | 'EN' | 'KR' | 'ZH' | 'AR'>('ID');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);

  useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

  const currentLangCode = propCurrentLangCode || localLangCode;

  useEffect(() => {
    // Restore preferred language if any
    const saved = localStorage.getItem('yasmin_pref_lang');
    if (saved && ['ID', 'EN', 'KR', 'ZH', 'AR'].includes(saved)) {
      if (onChangeLang) {
        onChangeLang(saved as any);
      } else {
        setLocalLangCode(saved as any);
      }
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsAboutSubmenuOpen(false);
      setIsLayananSubmenuOpen(false);
      setIsKomunitasSubmenuOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (code: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR') => {
    if (onChangeLang) {
      onChangeLang(code);
    } else {
      setLocalLangCode(code);
    }
    localStorage.setItem('yasmin_pref_lang', code);
    window.dispatchEvent(new CustomEvent('yasmin_language_change', { detail: code }));
    setLangDropdownOpen(false);
  };

  const t = TRANSLATIONS[currentLangCode];

  const ABOUT_SUBMENUS = [
    { label: t.sambutan, id: 'sambutan', icon: MessageSquare },
    { label: t.visiMisi, id: 'visi-misi', icon: Compass },
    { label: t.prestasi, id: 'prestasi', icon: Award },
    { label: t.pillars, id: 'pillars', icon: ShieldCheck },
    { label: t.kemitraan, id: 'mitra', icon: Handshake },
    { label: t.testimoni, id: 'testimoni', icon: Users },
    { label: t.faq, id: 'faq', icon: HelpCircle },
    { label: t.hubungiKami, id: 'hubungi-kami', icon: Phone },
  ];

  const KOMUNITAS_SUBMENUS = [
    { 
      label: currentLangCode === 'ID' ? 'Sapa Komunitas (Overview)' : 
             currentLangCode === 'KR' ? '커뮤니티 개요' : 
             currentLangCode === 'ZH' ? '健康俱乐部概览' : 
             currentLangCode === 'AR' ? 'نظرة عامة على المجتمع' : 
             'Community Overview', 
      value: 'KOMUNITAS' as ActiveTabType,
      icon: Compass
    },
    { 
      label: currentLangCode === 'ID' ? 'Yasmin Kids Club 🧒' : 
             currentLangCode === 'KR' ? '야스민 키즈 클럽 🧒' : 
             currentLangCode === 'ZH' ? '雅斯敏儿童俱乐部 🧒' : 
             currentLangCode === 'AR' ? 'نادي ياسمين للأطفال 🧒' : 
             'Yasmin Kids Club 🧒', 
      value: 'YASMIN_KIDS' as ActiveTabType,
      icon: Smile
    },
    { 
      label: currentLangCode === 'ID' ? 'Yasmin Squad 🚀' : 
             currentLangCode === 'KR' ? '야스민 청소년 스쿼드 🚀' : 
             currentLangCode === 'ZH' ? '雅斯敏青年先锋队 🚀' : 
             currentLangCode === 'AR' ? 'نادي ياسمين للشباب 🚀' : 
             'Yasmin Youth Squad 🚀', 
      value: 'YASMIN_SQUAD' as ActiveTabType,
      icon: Users
    },
    { 
      label: currentLangCode === 'ID' ? 'Yasmin Womens 🌸' : 
             currentLangCode === 'KR' ? '야스민 여성 클럽 🌸' : 
             currentLangCode === 'ZH' ? '雅斯敏女性魅力俱乐部 🌸' : 
             currentLangCode === 'AR' ? 'نادي ياسمين للمرأة 🌸' : 
             'Yasmin Womens Club 🌸', 
      value: 'YASMIN_WOMENS' as ActiveTabType,
      icon: Heart
    },
    { 
      label: currentLangCode === 'ID' ? 'Club Donor Darah 🩸' : 
             currentLangCode === 'KR' ? '헌혈 클럽 🩸' : 
             currentLangCode === 'ZH' ? '爱心献血俱乐部 🩸' : 
             currentLangCode === 'AR' ? 'نادي التبرع بالدم 🩸' : 
             'Blood Donor Club 🩸', 
      value: 'DONOR_DARAH' as ActiveTabType,
      icon: Droplet
    },
  ];

  const LAYANAN_LIST_RAW = [
    { id: 'hc-2', label: 'ERACS (Persalinan Cepat)' },
    { id: 'hc-1', label: 'Klinik Ibu dan Anak' },
    { id: 'hc-7', label: 'Home Care' },
    { id: 'hc-5', label: 'Klinik Berhenti Merokok' },
    { id: 'hc-3', label: 'Klinik Fertilitas (Kesuburan)' },
    { id: 'hc-13', label: 'Klinik Kesehatan Haji & Umroh' },
    { id: 'hc-4', label: 'Klinik Medical Checkup (MCU)' },
    { id: 'hc-6', label: 'Konsultasi Psikologis Remaja' },
    { id: 'hc-14', label: 'Sunday Clinic' },
    { id: 'hc-8', label: 'Rehabilitasi Medik' },
    { id: 'hc-9', label: 'Rawat Inap Bertema Resort' },
    { id: 'hc-10', label: 'IGD & Ambulans 24 Jam' },
    { id: 'hc-11', label: 'Pelayanan JKN / BPJS' },
    { id: 'hc-12', label: 'Kemitraan Swasta & Asuransi' },
  ];

  const LAYANAN_LIST = LAYANAN_LIST_RAW.map(item => {
    const lang = currentLangCode || 'ID';
    if (lang === 'ID') {
      return item;
    }
    const translationGroup = HEALTH_CENTERS_TRANSLATIONS[item.id];
    let label = item.label;
    if (translationGroup) {
      const trans = translationGroup[lang] || translationGroup['EN'];
      if (trans && trans.title) {
        label = trans.title;
      }
    }
    return { ...item, label };
  });

  const navItems: { label: string; value: ActiveTabType }[] = [
    { label: t.BERANDA, value: 'BERANDA' },
    { label: t.DOKTER, value: 'DOKTER' },
    { label: t.LAYANAN, value: 'PUSAT KESEHATAN' },
    { label: t.FASILITAS, value: 'FASILITAS' },
    { label: t.gallery, value: 'GALLERY' },
    { label: t.KOMUNITAS, value: 'KOMUNITAS' },
    { label: t['TENTANG KAMI'], value: 'TENTANG KAMI' },
  ];

  const handleNavClick = (tabValue: ActiveTabType) => {
    if (tabValue === 'TENTANG KAMI') {
      setActiveTab('TENTANG KAMI');
      setMobileMenuOpen(false);
      return;
    }
    setActiveTab(tabValue);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLangObj = LANGUAGES_LIST.find(l => l.code === currentLangCode) || LANGUAGES_LIST[0];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md border-b border-divider'
          : 'bg-white border-b border-divider'
      }`}
    >
      {/* ==================== ROW 1: BRANDING & CALL/ACTION BUTTONS ==================== */}
      <div className="bg-gradient-to-r from-soft-mint/40 via-white to-soft-mint/20 border-b border-divider/50 py-2">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <div
            id="logo-container"
            className="relative flex items-center cursor-pointer group shrink-0"
            onClick={() => handleNavClick('BERANDA')}
          >
            {/* White back drop circle behind crescent moon in physical logo */}
            <div className="absolute left-[2px] top-[14%] w-[42px] h-[42px] md:w-[46px] md:h-[46px] bg-white rounded-full border border-divider/10 shadow-inner -z-10" />
            
            {!logoError ? (
              <SafeImage 
                src={headerLogo}
                fallbackSrc={logoRsYasmin}
                alt="RS Yasmin Logo"
                className="h-[52px] md:h-[58px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div id="logo-fallback-header" className="flex items-center space-x-1.5 ml-2">
                <div className="bg-gradient-to-tr from-deep-teal to-yasmin-green p-1.5 rounded-xl text-warm-ivory">
                  <Leaf className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="font-display font-black text-xs tracking-wide text-headings block uppercase">{headerName}</span>
                  <span className="text-[7px] text-gray-400 font-mono tracking-widest block -mt-1 font-bold">BANYUWANGI</span>
                </div>
              </div>
            )}
          </div>

          {/* EMERGENCY CALL BUTTONS, WHATSAPP, & DAFTAR ONLINE */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            
            {/* FLOATING/DROPDOWN BUTTON "INFO" */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                className="h-10 px-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 border border-orange-500 rounded-xl text-xs font-extrabold font-display shadow-xs transition-all duration-300 hover:shadow-md transform hover:scale-103 cursor-pointer flex items-center space-x-1.5 shrink-0"
                title="Informasi Rumah Sakit"
              >
                <HelpCircle className="h-4 w-4 text-orange-600 animate-pulse" />
                <span>INFO</span>
                <ChevronDown className="h-3 w-3 text-slate-700" />
              </button>

              {isInfoDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsInfoDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-xl border border-divider py-1.5 z-50 w-52 overflow-hidden animate-fade-in-down text-left">
                    <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest px-3 py-1 border-b border-divider mb-1">
                      LAYANAN INFORMASI
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInfoDropdownOpen(false);
                        if (onOpenInfoberita) onOpenInfoberita();
                      }}
                      className="w-full text-left px-4 py-2 font-display text-xs font-normal hover:font-bold tracking-wider text-gray-750 hover:bg-amber-50 hover:text-amber-750 transition-colors flex items-center space-x-2.5 cursor-pointer"
                    >
                      <span className="text-sm">🔔</span>
                      <span>Info Berita</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInfoDropdownOpen(false);
                        if (onOpenInfoKamar) onOpenInfoKamar();
                      }}
                      className="w-full text-left px-4 py-2 font-display text-xs font-normal hover:font-bold tracking-wider text-gray-750 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center space-x-2.5 cursor-pointer"
                    >
                      <span className="text-sm">🛏️</span>
                      <span>Info Kamar Rawat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInfoDropdownOpen(false);
                        if (onOpenInfoAmbulance) onOpenInfoAmbulance();
                      }}
                      className="w-full text-left px-4 py-2 font-display text-xs font-normal hover:font-bold tracking-wider text-gray-750 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center space-x-2.5 cursor-pointer"
                    >
                      <span className="text-sm">🚑</span>
                      <span>Info Ambulance</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 1. BUTTON TELEPON IGD 24 JAM: 0333-423118 */}
            <a
              href="tel:0333-423118"
              className="h-10 px-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold font-display shadow-xs transition-all duration-300 hover:shadow-md transform hover:scale-103 cursor-pointer border border-red-500 animate-pulse flex items-center space-x-1.5 shrink-0"
              title="Telepon Emergency IGD (24 Jam) RS Yasmin Banyuwangi"
            >
              <PhoneCall className="h-3.5 w-3.5 text-white animate-bounce" />
              <span>IGD 24 JAM: 0333-423118</span>
            </a>

            {/* 2. BUTTON AMBULANCE */}
            <a
              href="tel:0333-123456"
              className="h-10 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold font-display shadow-xs transition-all duration-300 hover:shadow-md transform hover:scale-103 cursor-pointer border border-orange-400 flex items-center space-x-1.5 shrink-0"
              title="Panggil Ambulance Darurat"
            >
              <Ambulance className="h-4 w-4 text-white animate-pulse" />
              <span>AMBULANCE 0333-123456</span>
            </a>

            {/* 3. WHATSAPP BUTTON (SAPA YASMIN) */}
            <a
              href="https://wa.me/6285259353001"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-3.5 bg-whatsapp hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold font-display shadow-xs transition-all duration-300 hover:shadow-md transform hover:scale-102 cursor-pointer border border-emerald-400 flex items-center space-x-1.5 shrink-0"
              title="Hubungi WhatsApp Pelayanan Humas Yasmin"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-white fill-current shrink-0 animate-whatsapp-shake" />
              <span>SAPA YASMIN</span>
            </a>

            {/* 4. ONLINE APPOINTMENT BUTTON */}
            <button
              onClick={onOpenBookingWizard}
              className="h-10 px-4 bg-gradient-to-r from-[#0B4F4A] to-yasmin-green hover:from-yasmin-green hover:to-[#0B4F4A] text-white rounded-xl text-xs font-extrabold font-display shadow-xs hover:shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer border border-[#0B4F4A]/30 flex items-center space-x-1.5 shrink-0"
            >
              <Calendar className="h-4 w-4 text-warm-orange animate-pulse" />
              <span>{t.daftarOnline}</span>
            </button>
          </div>

          {/* Hamburger (Mobile Menu toggle) */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href="tel:0333-423118"
              className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs"
              title="Panggil IGD Darurat"
            >
              <PhoneCall className="h-4.5 w-4.5" />
            </a>
            <button
              onClick={onOpenBookingWizard}
              className="p-2.5 bg-[#0B4F4A] text-white rounded-xl shadow-xs"
              title="Pendaftaran Online"
            >
              <Calendar className="h-4.5 w-4.5 text-warm-orange animate-pulse" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-headings hover:bg-soft-mint rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ==================== ROW 2: MENU & SEARCH + LANGUAGE DROPDOWN ==================== */}
      <div className="bg-white/95 backdrop-blur-md shadow-xs relative">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-6">
          
          {/* Menu items (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 text-left" id="desktop-nav-row2">
            {navItems.map((item) => {
              const isActive = activeTab === item.value;

              if (item.value === 'KOMUNITAS') {
                const isKomunitasActive = activeTab === 'KOMUNITAS' || activeTab === 'YASMIN_KIDS' || activeTab === 'DONOR_DARAH' || activeTab === 'YASMIN_SQUAD' || activeTab === 'YASMIN_WOMENS';
                return (
                  <div 
                    key={item.value} 
                    className="relative flex items-center h-full"
                    onMouseEnter={() => setIsKomunitasSubmenuOpen(true)}
                    onMouseLeave={() => setIsKomunitasSubmenuOpen(false)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsKomunitasSubmenuOpen(!isKomunitasSubmenuOpen);
                        handleNavClick('KOMUNITAS');
                      }}
                      className={`relative px-3.5 py-2 font-display text-xs tracking-wider transition-all duration-200 outline-none rounded-xl flex items-center space-x-1 ${
                        isKomunitasActive || isKomunitasSubmenuOpen
                          ? 'text-deep-teal bg-soft-mint shadow-2xs font-bold'
                          : 'text-headings/90 hover:bg-soft-mint hover:text-deep-teal font-normal hover:font-bold'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[9px] opacity-70 transition-transform duration-250 ${isKomunitasSubmenuOpen ? 'rotate-180' : ''}`}>▼</span>
                      {isKomunitasActive && (
                        <span className="absolute bottom-1 left-3.5 right-6 h-0.5 bg-warm-orange rounded-full" />
                      )}
                    </button>
                    
                    {/* Komunitas Submenu popover dropdown */}
                    {isKomunitasSubmenuOpen && (
                      <div className="absolute top-[38px] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-divider py-2 z-50 w-max min-w-max whitespace-nowrap overflow-hidden animate-fade-in-up before:content-[''] before:absolute before:w-full before:h-4 before:-top-4 before:left-0 before:bg-transparent">
                        {KOMUNITAS_SUBMENUS.map((sub) => (
                          <button
                            key={sub.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavClick(sub.value);
                              setIsKomunitasSubmenuOpen(false);
                            }}
                            className="group w-full text-left px-5 py-2 font-display text-xs font-normal hover:font-bold tracking-wider text-gray-700 hover:bg-soft-mint hover:text-deep-teal transition-all flex items-center space-x-2.5 cursor-pointer"
                          >
                            <sub.icon className="h-3.5 w-3.5 text-yasmin-green shrink-0 group-hover:scale-110 transition-transform" />
                            <span>{sub.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.value === 'TENTANG KAMI') {
                const isAboutActive = isActive;
                return (
                  <div 
                    key={item.value} 
                    className="relative flex items-center h-full"
                    onMouseEnter={() => setIsAboutSubmenuOpen(true)}
                    onMouseLeave={() => setIsAboutSubmenuOpen(false)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAboutSubmenuOpen(!isAboutSubmenuOpen);
                        handleNavClick(item.value);
                      }}
                      className={`relative px-3.5 py-2 font-display text-xs tracking-wider transition-all duration-200 outline-none rounded-xl flex items-center space-x-1 ${
                        isAboutActive || isAboutSubmenuOpen
                          ? 'text-deep-teal bg-soft-mint shadow-2xs font-bold'
                          : 'text-headings/90 hover:bg-soft-mint hover:text-deep-teal font-normal hover:font-bold'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[9px] opacity-70 transition-transform duration-250 ${isAboutSubmenuOpen ? 'rotate-180' : ''}`}>▼</span>
                      {isAboutActive && (
                        <span className="absolute bottom-1 left-3.5 right-6 h-0.5 bg-warm-orange rounded-full" />
                      )}
                    </button>
                    
                    {/* Submenu popover dropdown */}
                    {isAboutSubmenuOpen && (
                      <div className="absolute top-[38px] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-divider py-2 z-50 w-max min-w-max whitespace-nowrap overflow-hidden animate-fade-in-up before:content-[''] before:absolute before:w-full before:h-4 before:-top-4 before:left-0 before:bg-transparent">
                        {ABOUT_SUBMENUS.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavClick('TENTANG KAMI');
                              if (onSelectSubmenu) onSelectSubmenu(sub.id);
                              setIsAboutSubmenuOpen(false);
                            }}
                            className="group w-full text-left px-5 py-2 font-display text-xs font-normal hover:font-bold tracking-wider text-gray-700 hover:bg-soft-mint hover:text-deep-teal transition-all flex items-center space-x-2.5 cursor-pointer"
                          >
                            <sub.icon className="h-4 w-4 text-yasmin-green shrink-0 group-hover:scale-110 transition-transform" />
                            <span>{sub.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  className={`relative px-3.5 py-2 font-display text-xs tracking-wider transition-all duration-200 outline-none rounded-xl ${
                    isActive
                      ? 'text-deep-teal bg-soft-mint shadow-2xs font-bold'
                      : 'text-headings/90 hover:bg-soft-mint hover:text-deep-teal font-normal hover:font-bold'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-warm-orange rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile indicator for navigation or search if on mobile */}
          <div className="lg:hidden flex-1 max-w-sm mr-auto">
          </div>

          {/* RIGHT: SEARCH FIELD & MULTI-LANGUAGE FLAGS */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* SEARCH FIELD */}
            <div className="relative w-44 sm:w-56 md:w-64 flex items-center">
              <span className="absolute left-2.5 text-gray-400 pointer-events-none">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = searchInputValue;
                    if (onSearchChange) {
                      onSearchChange(val);
                    }
                    if (activeTab !== 'DOKTER' && val.trim() !== '') {
                      setActiveTab('DOKTER');
                    }
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="w-full bg-soft-mint/50 pl-8 pr-16 py-1.5 rounded-lg border border-divider focus:outline-none focus:border-yasmin-green text-xs font-sans text-gray-700"
              />
              <div className="absolute right-1.5 flex items-center space-x-1">
                {searchInputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInputValue('');
                      if (onSearchChange) {
                        onSearchChange('');
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-[10px] font-bold px-1 hover:bg-gray-200/50 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const val = searchInputValue;
                    if (onSearchChange) {
                      onSearchChange(val);
                    }
                    if (activeTab !== 'DOKTER' && val.trim() !== '') {
                      setActiveTab('DOKTER');
                    }
                  }}
                  className="bg-yasmin-green hover:bg-deep-teal text-white font-bold text-[9px] px-2 py-0.5 rounded transition-all cursor-pointer"
                >
                  {currentLangCode === 'ID' ? 'Cari' : 'Go'}
                </button>
              </div>
            </div>

            {/* MULTI-LANGUAGE SELECTOR (Dropdown selection) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-soft-mint border border-divider hover:border-yasmin-green rounded-lg text-xs font-bold text-headings transition-all cursor-pointer outline-none"
                title="Pilih Bahasa / Select Language"
              >
                <span className="text-sm leading-none shrink-0 flex items-center">{getFlagImg(activeLangObj.code)}</span>
                <span className="font-mono text-[10px] uppercase shrink-0">{activeLangObj.code}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setLangDropdownOpen(false)} />
                  
                  {/* Select Options */}
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-divider py-1.5 z-50 w-44 overflow-hidden animate-fade-in-down text-left">
                    <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest px-3 py-1 border-b border-divider mb-1">
                      SELECT LANGUAGE:
                    </p>
                    {LANGUAGES_LIST.map((lang) => {
                      const isSelected = lang.code === currentLangCode;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => changeLanguage(lang.code as any)}
                          className={`w-full text-left px-3 py-2 text-xs font-sans font-bold transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-soft-mint text-deep-teal'
                              : 'text-gray-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {getFlagImg(lang.code)}
                            <span>{lang.name}</span>
                          </div>
                          {isSelected && <Check className="h-3 w-3 text-yasmin-green stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* MOBILE DRAWER (RESPONSIVE DROPDOWN DRAWERS) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-headings/40 backdrop-blur-xs top-[102px]" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-0 right-0 w-80 max-w-full bg-warm-ivory h-screen shadow-2xl p-6 border-l border-divider flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="pb-3 border-b border-divider flex items-center justify-between">
                <p className="font-display font-black text-[15px] text-headings">Menu</p>
              </div>
              
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {

                  if (item.value === 'KOMUNITAS') {
                    return (
                      <div key={item.value} className="space-y-1">
                        <button
                          onClick={() => setIsKomunitasMobileOpen(!isKomunitasMobileOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-display text-sm transition-all text-body-text hover:bg-soft-mint hover:text-deep-teal font-normal cursor-pointer"
                        >
                          <span>{item.label}</span>
                          <span className={`text-[10px] transform transition-transform ${isKomunitasMobileOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        
                        {isKomunitasMobileOpen && (
                          <div className="pl-4 flex flex-col space-y-1 border-l-2 border-yasmin-green/20 ml-2 py-1">
                            {KOMUNITAS_SUBMENUS.map((sub) => (
                              <button
                                key={sub.value}
                                onClick={() => {
                                  handleNavClick(sub.value);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full text-left py-2.5 px-4 text-sm font-display font-normal text-gray-700 hover:text-deep-teal hover:bg-soft-mint/50 rounded-xl transition-all cursor-pointer flex items-center space-x-2"
                              >
                                <sub.icon className="h-4 w-4 text-yasmin-green shrink-0" />
                                <span>{sub.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.value === 'TENTANG KAMI') {
                    return (
                      <div key={item.value} className="space-y-1">
                        <button
                          onClick={() => setIsAboutMobileOpen(!isAboutMobileOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-display text-sm transition-all text-body-text hover:bg-soft-mint hover:text-deep-teal font-normal cursor-pointer"
                        >
                          <span>{item.label}</span>
                          <span className={`text-[10px] transform transition-transform ${isAboutMobileOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        
                        {isAboutMobileOpen && (
                          <div className="pl-4 flex flex-col space-y-1 border-l-2 border-yasmin-green/20 ml-2 py-1">
                            {ABOUT_SUBMENUS.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  handleNavClick('TENTANG KAMI');
                                  setMobileMenuOpen(false);
                                  if (onSelectSubmenu) onSelectSubmenu(sub.id);
                                }}
                                className="w-full text-left py-2.5 px-4 text-sm font-display font-normal text-gray-700 hover:text-deep-teal hover:bg-soft-mint/50 rounded-xl transition-all cursor-pointer flex items-center space-x-2"
                              >
                                <sub.icon className="h-4 w-4 text-yasmin-green shrink-0" />
                                <span>{sub.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleNavClick(item.value)}
                      className="w-full text-left px-4 py-3 rounded-xl font-display text-sm transition-all text-body-text hover:bg-soft-mint hover:text-deep-teal font-normal cursor-pointer"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Language mobile selector */}
              <div className="pt-4 border-t border-divider space-y-2 text-left">
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">PILIH BAHASA DEVISE:</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES_LIST.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-bold transition-all ${
                        lang.code === currentLangCode
                          ? 'bg-soft-mint text-deep-teal border-yasmin-green'
                          : 'bg-white text-gray-600 border-divider'
                      }`}
                    >
                      {getFlagImg(lang.code)}
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-5 pb-24 border-t border-divider">
              <a
                href="tel:0333-423118"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-[#DC2626] text-white font-extrabold rounded-xl text-xs tracking-wider"
              >
                <PhoneCall className="h-4 w-4 animate-bounce" />
                <span>IGD: (0333) 423118</span>
              </a>

              <a
                href="tel:0333-123456"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-[#EA580C] text-white font-extrabold rounded-xl text-xs tracking-wider"
              >
                <Ambulance className="h-5 w-5" />
                <span>AMBULANCE: (0333) 123456</span>
              </a>

              <div className="flex items-center gap-2 w-full">
                <a
                  href="https://wa.me/6285259353001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-whatsapp text-white rounded-xl transition-all font-bold p-3.5 shrink-0"
                  title="Hubungi WhatsApp"
                >
                  <WhatsAppIcon className="h-5 w-5 fill-current animate-whatsapp-shake" />
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBookingWizard();
                  }}
                  className="flex-grow flex items-center justify-center space-x-2 py-3 bg-[#0B4F4A] text-white font-bold rounded-xl text-xs tracking-wider cursor-pointer"
                >
                  <Calendar className="h-4.5 w-4.5 text-warm-orange animate-pulse" />
                  <span>DAFTAR ONLINE BEROBAT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
