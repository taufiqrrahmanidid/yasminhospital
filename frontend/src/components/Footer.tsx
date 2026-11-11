import React, { useState, useEffect } from 'react';
import { 
  Leaf, Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Youtube, Heart, ExternalLink, ShieldAlert, Layers,
  Baby, Home, Shield, Sparkles, Compass, Stethoscope, UserCheck, Calendar, Building, Target, BookOpen, Briefcase,
  Award, ShieldCheck, Handshake, Users, HelpCircle
} from 'lucide-react';
import { ActiveTabType } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { FOOTER_TRANSLATIONS } from '../translations';
import WhatsAppIcon from './WhatsAppIcon';
import { SafeImage } from '../utils/imageUrl';

const logoRsYasmin = '/assets/images/utama/logo_rsyasminbwi.png';

const ABOUT_HEADER_SUBMENUS = {
  ID: [
    { label: 'Sambutan Direktur', id: 'sambutan', icon: MessageSquare },
    { label: 'Visi & Misi', id: 'visi-misi', icon: Compass },
    { label: 'Prestasi RS Yasmin', id: 'prestasi', icon: Award },
    { label: '5 Pilar Keunikan', id: 'pillars', icon: ShieldCheck },
    { label: 'Kemitraan & Rekanan', id: 'mitra', icon: Handshake },
    { label: 'Testimoni Pasien', id: 'testimoni', icon: Users },
    { label: 'Tanya Jawab (FAQ)', id: 'faq', icon: HelpCircle },
  ],
  EN: [
    { label: 'Director’s Message', id: 'sambutan', icon: MessageSquare },
    { label: 'Vision & Mission', id: 'visi-misi', icon: Compass },
    { label: 'Yasmin Achievements', id: 'prestasi', icon: Award },
    { label: '5 Unique Pillars', id: 'pillars', icon: ShieldCheck },
    { label: 'Partnerships & Affiliates', id: 'mitra', icon: Handshake },
    { label: 'Patient Testimonials', id: 'testimoni', icon: Users },
    { label: 'FAQs & Support', id: 'faq', icon: HelpCircle },
  ],
  KR: [
    { label: '병원장 인사말', id: 'sambutan', icon: MessageSquare },
    { label: '비전 및 사명', id: 'visi-misi', icon: Compass },
    { label: '그린 병원 인증', id: 'prestasi', icon: Award },
    { label: '5대 고유 기둥', id: 'pillars', icon: ShieldCheck },
    { label: '보험 파트너십', id: 'mitra', icon: Handshake },
    { label: '환자 후기', id: 'testimoni', icon: Users },
    { label: '자주 묻는 질문 (FAQ)', id: 'faq', icon: HelpCircle },
  ],
  ZH: [
    { label: '院长欢迎致辞', id: 'sambutan', icon: MessageSquare },
    { label: '医院院景与使命', id: 'visi-misi', icon: Compass },
    { label: '医院学术与荣誉', id: 'prestasi', icon: Award },
    { label: '5大独特支柱', id: 'pillars', icon: ShieldCheck },
    { label: '医保与商保合作', id: 'mitra', icon: Handshake },
    { label: '康复患者口碑', id: 'testimoni', icon: Users },
    { label: '常见疑问解答', id: 'faq', icon: HelpCircle },
  ],
  AR: [
    { label: 'رسالة المدير', id: 'sambutan', icon: MessageSquare },
    { label: 'الرؤية والرسالة', id: 'visi-misi', icon: Compass },
    { label: 'إنجازات ياسمين', id: 'prestasi', icon: Award },
    { label: '٥ ركائز فريدة', id: 'pillars', icon: ShieldCheck },
    { label: 'الشركاء والجهات', id: 'mitra', icon: Handshake },
    { label: 'آراء المرضى', id: 'testimoni', icon: Users },
    { label: 'الأسئلة الشائعة', id: 'faq', icon: HelpCircle },
  ]
};

const LOCAL_FOOTER_TRANSLATIONS = {
  ID: {
    navTitle: "Navigasi Link",
    beranda: "Beranda",
    cariDokter: "Cari Dokter & Jadwal",
    pusatSpesialis: "Pusat Kesehatan Spesialis",
    komunitas: "Komunitas & Event",
    tentangKamiMenu: "Tentang Kami",
    layananEdukatif: "Layanan Edukatif",
    eracs: "Metode Persalinan ERACS",
    fertilitas: "Klinik Fertilitas Yasmin",
    psikologi: "Psikologis Remaja & Konseling",
    menerimaBpjs: "Menerima Pasien BPJS Kesehatan",
    bookingOnline: "Pendaftaran Booking Online",
    kontakTitle: "Kontak RS Yasmin",
    dibuatDengan: "Dibuat dengan",
    untukBwi: "untuk Keluarga Sehat Banyuwangi",
    akreditasi: "Terakreditasi Paripurna Kemenkes RI",
    layananMedis: "LAYANAN MEDIS",
    tentangKamiTitle: "TENTANG KAMI",
    profilRs: "Profil Rumah Sakit",
    visiMisi: "Visi, Misi & Budaya Kerja",
    sejarah: "Sejarah & Perkembangan",
    karir: "Karir & Lowongan Kerja",
    fasilitasLayanan: "Fasilitas & Layanan Kami"
  },
  EN: {
    navTitle: "Navigation Links",
    beranda: "Home",
    cariDokter: "Find Doctor & Schedule",
    pusatSpesialis: "Specialist Centers",
    komunitas: "Community & Events",
    tentangKamiMenu: "About Us",
    layananEdukatif: "Educational Services",
    eracs: "ERACS Childbirth Method",
    fertilitas: "Yasmin Fertility Clinic",
    psikologi: "Teen Psychology & Counseling",
    menerimaBpjs: "Accepts BPJS Health Insurance",
    bookingOnline: "Online Booking Registration",
    kontakTitle: "Contact RS Yasmin",
    dibuatDengan: "Made with",
    untukBwi: "for Banyuwangi Healthy Families",
    akreditasi: "Fully Accredited by Indonesian Ministry of Health",
    layananMedis: "MEDICAL SERVICES",
    tentangKamiTitle: "ABOUT US",
    profilRs: "Hospital Profile",
    visiMisi: "Vision, Mission & Culture",
    sejarah: "Milestones & History",
    karir: "Careers & Vacancy",
    fasilitasLayanan: "Facilities & Operations"
  },
  KR: {
    navTitle: "탐색 메뉴",
    beranda: "홈페이지",
    cariDokter: "전문의 찾기 및 예약",
    pusatSpesialis: "종합 특수 센터",
    komunitas: "커뮤니티 및 공지",
    tentangKamiMenu: "병원 소개",
    layananEdukatif: "환자 교육 정보",
    eracs: "ERACS 무통 회복 제왕절개",
    fertilitas: "야스민 불임 난임 클리닉",
    psikologi: "청소년 심리 가족 심리 상담",
    menerimaBpjs: "국가 의료보험 수용 (BPJS)",
    bookingOnline: "원스톱 실시간 진료 예약",
    kontakTitle: "야스민 종합의료원 연락망",
    dibuatDengan: "함께 제작됨",
    untukBwi: "바뉴왕이 거주 민간 가족들의 영구 건강 수호",
    akreditasi: "인도네시아 보건부 최우수 정식 공인 의료기관",
    layananMedis: "진료 과목 & 의료 서비스",
    tentangKamiTitle: "병원 소개",
    profilRs: "야스민 병원 소개 프로필",
    visiMisi: "원훈, 미션 및 조직 문화",
    sejarah: "주요 연혁 및 발전사",
    karir: "인재 채용 및 구인 공고",
    fasilitasLayanan: "원내 시설 및 진료실 안내"
  },
  ZH: {
    navTitle: "快速网址导航",
    beranda: "官方主页",
    cariDokter: "名医日程与挂号",
    pusatSpesialis: "特色多专科研究中心",
    komunitas: "健康讲坛及社会公益",
    tentangKamiMenu: "关于本院简介",
    layananEdukatif: "医学科普资讯",
    eracs: "ERACS 快恢复剖宫产术",
    fertilitas: "雅斯敏辅助生殖与不孕不育科",
    psikologi: "青少年成长与创伤心理干预",
    menerimaBpjs: "全面对口国家医保 (BPJS)",
    bookingOnline: "24h 智能自助专家预约挂号",
    kontakTitle: "雅斯敏综合医院应急总机",
    dibuatDengan: "倾情设计",
    untukBwi: "保障东爪哇全境居民享有安全尊贵的大健康医疗",
    akreditasi: "荣获印尼国家卫生部最高级别五星三甲综合资质认证",
    layananMedis: "本院医疗服务",
    tentangKamiTitle: "关于雅斯敏",
    profilRs: "医院基本概况与介绍",
    visiMisi: "医院愿景、使命与价值观",
    sejarah: "建院历史与里程碑大事记",
    karir: "人才招聘与职业发展机会",
    fasilitasLayanan: "科室设置与医疗设施导览"
  },
  AR: {
    navTitle: "روابط التنقل السريع",
    beranda: "الصفحة الرئيسية",
    cariDokter: "ابحث عن الأطباء والجدول",
    pusatSpesialis: "المراكز التخصصية والعيادات",
    komunitas: "الأنشطة والفعاليات المجتمعية",
    tentangKamiMenu: "من نحن وقيمنا",
    layananEdukatif: "خدمات تخصصية إرشادية",
    eracs: "ميزة التوليد القيصري بدون ألم ERACS",
    fertilitas: "عيادة ياسمين للصحة الإنجابية والخصوبة",
    psikologi: "الرعاية النفسية للمراهقين والأسرة",
    menerimaBpjs: "تغطية تأمينية كاملة لبطاقات BPJS",
    bookingOnline: "البوابة الفورية للتسجيل وحجز المواعيد",
    kontakTitle: "قنوات الاتصال المباشر",
    dibuatDengan: "صُنع بكل",
    untukBwi: "لخدمة صحة ورخاء العوائل في بانيوانجي",
    akreditasi: "مرخص من الدرجة Paripurna من وزارة الصحة",
    layananMedis: "الخدمات الطبية",
    tentangKamiTitle: "عن المستشفى",
    profilRs: "الملف التعريفي للمستشفى",
    visiMisi: "الرؤية، الرسالة وثقافة العمل",
    sejarah: "تاريخنا وأهم المحطات",
    karir: "الوظائف وفرص العمل",
    fasilitasLayanan: "مرافقنا وخدماتنا المتنوعة"
  }
};

interface FooterProps {
  activeTab?: ActiveTabType;
  onNavClick: (tab: ActiveTabType) => void;
  onOpenBookingWizard: () => void;
  onSelectSubmenu?: (id: string) => void;
  onSelectHealthCenter?: (id: string) => void;
  rsInfo?: any;
}

export default function Footer({ activeTab, onNavClick, onOpenBookingWizard, onSelectSubmenu, onSelectHealthCenter, rsInfo }: FooterProps) {
  const footerLogo = rsInfo?.logo || logoRsYasmin;
  const footerName = rsInfo?.name || "RS YASMIN";
  const footerAddress = rsInfo?.address || "Jl. Letkol Istiqlah No. 80-84, Mojopanggung, Kec. Banyuwangi, Kab. Banyuwangi, Jawa Timur 68425";
  const footerPhone = rsInfo?.phone || "0333-424671";
  const footerWhatsapp = rsInfo?.whatsapp || "+62 852 5935 3001";
  const footerEmail = rsInfo?.email || "yasmin_hospital@yahoo.com";

  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [footerLogo]);

  const [visitorCount, setVisitorCount] = useState<number>(342890);

  useEffect(() => {
    const savedCount = localStorage.getItem('yasmin_visitor_counter');
    let count = 342890;
    if (savedCount) {
      count = parseInt(savedCount) || 342890;
    }
    
    // Increment on new session load
    const hasCounted = sessionStorage.getItem('yasmin_visitor_counted');
    if (!hasCounted) {
      count += 1;
      localStorage.setItem('yasmin_visitor_counter', count.toString());
      sessionStorage.setItem('yasmin_visitor_counted', 'true');
    }
    setVisitorCount(count);
  }, []);

  // Format visitor count with thousands separator (Indonesian style) without leading zeroes
  const visitorCountFormatted = visitorCount.toLocaleString('id-ID');

  const currentYear = new Date().getFullYear();
  const lang = useLanguage();
  const gt = FOOTER_TRANSLATIONS[lang] || FOOTER_TRANSLATIONS.ID;
  const lt = LOCAL_FOOTER_TRANSLATIONS[lang] || LOCAL_FOOTER_TRANSLATIONS.ID;
  const aboutSubmenusList = ABOUT_HEADER_SUBMENUS[lang] || ABOUT_HEADER_SUBMENUS.ID;

  const navTranslations: Record<string, Record<string, string>> = {
    BERANDA: { ID: 'BERANDA', EN: 'HOME', KR: '홈', ZH: '主页', AR: 'الرئيسية' },
    DOKTER: { ID: 'DOKTER', EN: 'DOCTORS', KR: '의료진 소개', ZH: '寻找医生', AR: 'الأطباء' },
    LAYANAN: { ID: 'LAYANAN', EN: 'SERVICES', KR: '진료 센터', ZH: '医疗中心', AR: 'المراكز الطبية' },
    FASILITAS: { ID: 'FASILITAS', EN: 'FACILITIES', KR: 'FASILITAS', ZH: '本院设施', AR: 'المرافق' },
    KOMUNITAS: { ID: 'KOMUNITAS', EN: 'COMMUNITY', KR: '커뮤니티', ZH: '健康俱乐部', AR: 'المجتمع' },
    TENTANG_KAMI: { ID: 'TENTANG KAMI', EN: 'ABOUT US', KR: '병원 소개', ZH: '关于我们', AR: 'من نحن' },
  };

  const getNavLabel = (key: string) => {
    const safeLang = (navTranslations[key] && navTranslations[key][lang]) ? lang : 'ID';
    return navTranslations[key]?.[safeLang] || key;
  };

  const footerNavs = [
    { label: getNavLabel('BERANDA'), value: 'BERANDA' as ActiveTabType },
    { label: getNavLabel('DOKTER'), value: 'DOKTER' as ActiveTabType },
    { label: getNavLabel('LAYANAN'), value: 'PUSAT KESEHATAN' as ActiveTabType },
    { label: getNavLabel('FASILITAS'), value: 'FASILITAS' as ActiveTabType },
    { label: getNavLabel('KOMUNITAS'), value: 'KOMUNITAS' as ActiveTabType },
    { label: getNavLabel('TENTANG_KAMI'), value: 'TENTANG KAMI' as ActiveTabType },
  ];

  const handleAboutSubmenuClick = (subId: string) => {
    if (onSelectSubmenu) {
      onSelectSubmenu(subId);
    } else {
      onNavClick('TENTANG KAMI');
      setTimeout(() => {
        const el = document.getElementById(subId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const getLocalizedServiceLabel = (id: string, origLabel: string) => {
    const servicesDict: Record<string, Record<string, string>> = {
      'hc-2': {
        ID: 'Persalinan Metode ERACS',
        EN: 'ERACS Childbirth Method',
        KR: 'ERACS 무통 분만 제왕절개',
        ZH: 'ERACS 无痛剖宫产术',
        AR: 'ولادة قيصرية بدون ألم ERACS'
      },
      'hc-1': {
        ID: 'Klinik Ibu dan Anak',
        EN: 'Pediatric & Maternity Pavilion',
        KR: '소아과 및 산부인과 클리닉',
        ZH: '妇产科与儿科健康门诊',
        AR: 'عيادة الأطفال والأمومة'
      },
      'hc-7': {
        ID: 'Yasmin Home Care',
        EN: 'Yasmin Home Care Services',
        KR: '야스민 가정 간호 방문 의료',
        ZH: '雅斯敏居家医疗护理服务',
        AR: 'خدمات الرعاية الصحية المنزلية'
      },
      'hc-5': {
        ID: 'Klinik Berhenti Merokok',
        EN: 'Smoking Cessation Clinic',
        KR: '금연 치료 지원 클리닉',
        ZH: '科学戒烟指导门诊',
        AR: 'عيادة الإقلاع عن التدخين'
      },
      'hc-3': {
        ID: 'Klinik Fertilitas Yasmin',
        EN: 'Yasmin Fertility Center',
        KR: '야스민 불임 난임 치료 센터',
        ZH: '雅斯敏辅助生殖与不孕不育中心',
        AR: 'مركز ياسمين للصحة الإنجابية والخصوبة'
      },
      'hc-13': {
        ID: 'Klinik Kesehatan Haji & Umroh',
        EN: 'Hajj & Umrah Health Clinic',
        KR: '하지 및 우므라 출국 건강검진',
        ZH: '朝觐朝圣出境健康体检科',
        AR: 'عيادة صحة الحجاج والمعتمرين'
      },
      'hc-4': {
        ID: 'Klinik Medical Checkup (MCU)',
        EN: 'Medical Checkup Clinic (MCU)',
        KR: '종합 건강 검진 센터 (MCU)',
        ZH: '全套智能健康体检中心',
        AR: 'قسم الفحص الطبي الشامل (MCU)'
      },
      'hc-6': {
        ID: 'Konsultasi Psikologis Remaja',
        EN: 'Adolescent Psychology Consultation',
        KR: '청소년 심리 성장 발달 상담',
        ZH: '青少年成长心理健康咨询',
        AR: 'الاستشارات النفسية للمراهقين'
      },
      'hc-14': {
        ID: 'Sunday Clinic (Klinik Minggu)',
        EN: 'Sunday Clinic (Weekend Service)',
        KR: '선데이 주말 진료 클리닉',
        ZH: '周日/节假日特需门诊',
        AR: 'عيادة الأحد (الخدمات العاجلة)'
      }
    };
    return servicesDict[id]?.[lang] || servicesDict[id]?.['ID'] || origLabel;
  };

  const footerServices = [
    { id: 'hc-2', label: getLocalizedServiceLabel('hc-2', 'Eracs'), icon: Baby },
    { id: 'hc-1', label: getLocalizedServiceLabel('hc-1', 'Klinik Ibu dan Anak'), icon: Heart },
    { id: 'hc-7', label: getLocalizedServiceLabel('hc-7', 'home care'), icon: Home },
    { id: 'hc-5', label: getLocalizedServiceLabel('hc-5', 'klinik berhenti merokok'), icon: Shield },
    { id: 'hc-3', label: getLocalizedServiceLabel('hc-3', 'klinik fertilitas'), icon: Sparkles },
    { id: 'hc-13', label: getLocalizedServiceLabel('hc-13', 'klinik kesehatan haji & umroh'), icon: Compass },
    { id: 'hc-4', label: getLocalizedServiceLabel('hc-4', 'klinik medical checkup'), icon: Stethoscope },
    { id: 'hc-6', label: getLocalizedServiceLabel('hc-6', 'konsultasi psikologis remaja'), icon: UserCheck },
    { id: 'hc-14', label: getLocalizedServiceLabel('hc-14', 'sunday clinic'), icon: Calendar },
  ];

  return (
    <footer id="main-footer" className="bg-headings text-warm-ivory border-t-4 border-yasmin-green">
      {/* Upper footer */}
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Hospital Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <SafeImage 
                src={footerLogo}
                fallbackSrc={logoRsYasmin}
                alt="RS Yasmin"
                title="Klik kanan logo untuk masuk ke form backend admin, klik dua kali untuk admin pendaftaran"
                className="h-[54px] w-auto object-contain cursor-pointer"
                onContextMenu={(e) => {
                  e.preventDefault();
                  onNavClick('ADMIN_DASHBOARD');
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  onNavClick('ADMIN_PENDAFTARAN');
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  const el = document.getElementById('logo-fallback-footer');
                  if (el) el.classList.remove('hidden');
                }}
              />
              <div 
                id="logo-fallback-footer" 
                className="hidden flex items-center space-x-2 cursor-pointer"
                title="Klik kanan logo untuk masuk ke form backend admin, klik dua kali untuk admin pendaftaran"
                onContextMenu={(e) => {
                  e.preventDefault();
                  onNavClick('ADMIN_DASHBOARD');
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  onNavClick('ADMIN_PENDAFTARAN');
                }}
              >
                <div className="bg-yasmin-green/20 p-2 rounded-xl border border-yasmin-green/20">
                  <Leaf className="h-6 w-6 text-yasmin-green" />
                </div>
                <span className="font-display font-bold text-lg tracking-wide uppercase">{footerName}</span>
              </div>
            </div>
            <p className="text-xs text-warm-mint/80 leading-relaxed max-w-sm">
              {gt.desc}
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.instagram.com/yasminhospital_official"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @yasminhospital_official"
                className="w-8 h-8 rounded-lg bg-warm-ivory/10 hover:bg-warm-orange text-warm-ivory hover:text-headings flex items-center justify-center transition-colors shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/yasmin.hospital/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook @yasmin.hospital"
                className="w-8 h-8 rounded-lg bg-warm-ivory/10 hover:bg-yasmin-green text-warm-ivory hover:text-headings flex items-center justify-center transition-colors shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@YasminHospitalTV/"
                target="_blank"
                title="Yasmin Hospital TV"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-warm-ivory/10 hover:bg-red-500 text-warm-ivory flex items-center justify-center transition-colors shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@yasminhospital"
                target="_blank"
                title="TikTok @yasminhospital"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-warm-ivory/10 hover:bg-black text-warm-ivory flex items-center justify-center transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 fill-current text-warm-ivory" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.74-.22-.23-.41-.47-.58-.73v7.2c.11 5.26-4.14 9.61-9.43 9.27-4.1-.25-7.58-3.66-7.82-7.76-.35-5.91 4.79-10.42 10.47-9.3v4.02c-3.15-.47-6.04 1.83-6.19 5.01-.17 3.52 3.01 6.39 6.47 5.76 2.37-.44 4.01-2.61 3.92-5.01.01-4.22-.01-8.44.01-12.65z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-warm-orange mb-4">{lt.navTitle}</h4>
            <ul className="space-y-2.5 text-xs">
              {footerNavs.map((nav, nIdx) => {
                const isActive = activeTab === nav.value;
                return (
                  <li key={nIdx}>
                    <button
                      onClick={() => { onNavClick(nav.value); window.scrollTo(0,0); }}
                      className={`transition-all flex items-center space-x-1.5 cursor-pointer bg-transparent border-none text-left p-0 tracking-wider ${
                        isActive
                          ? 'text-yasmin-green font-bold'
                          : 'text-warm-ivory/90 hover:text-yasmin-green font-normal hover:font-bold'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-yasmin-green' : 'bg-warm-orange'}`} />
                      <span>{nav.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Layanan Spesifik & BPJS */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-warm-orange mb-4">
              {lt.layananMedis}
            </h4>
            <ul className="space-y-2.5 text-xs text-warm-ivory/85 border-none p-0">
              {footerServices.map((service) => {
                const ServiceIcon = service.icon;
                return (
                  <li key={service.id}>
                    <button
                      onClick={() => {
                        if (onSelectHealthCenter) {
                          onSelectHealthCenter(service.id);
                        } else {
                          onNavClick('PUSAT KESEHATAN');
                          window.scrollTo(0,0);
                        }
                      }}
                      className="text-warm-ivory/90 hover:text-yasmin-green font-normal hover:font-bold transition-all flex items-center space-x-2 text-left cursor-pointer bg-transparent border-none p-0 group"
                    >
                      <ServiceIcon className="h-3.5 w-3.5 text-yasmin-green shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{service.label}</span>
                    </button>
                  </li>
                );
              })}
              <li className="pt-1.5">
                <button
                  onClick={onOpenBookingWizard}
                  className="px-3 py-1 bg-warm-orange/10 border border-warm-orange/30 text-warm-orange rounded-md text-[11px] hover:bg-warm-orange/20 transition-all font-normal hover:font-bold cursor-pointer"
                >
                  {lt.bookingOnline}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Tentang Kami (Updated with Header's Tentang Kami Submenus) */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-warm-orange mb-4">
              {lt.tentangKamiTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-warm-ivory/85 border-none p-0">
              {aboutSubmenusList.map((sub, sIdx) => {
                const SubIcon = sub.icon;
                return (
                  <li key={sIdx}>
                    <button
                      onClick={() => handleAboutSubmenuClick(sub.id)}
                      className="text-warm-ivory/90 hover:text-yasmin-green font-normal hover:font-bold transition-all flex items-center space-x-2 text-left cursor-pointer bg-transparent border-none p-0 group"
                    >
                      <SubIcon className="h-3.5 w-3.5 text-yasmin-green shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{sub.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 5: Kontak & Alamat */}
          <div className="space-y-3.5 text-xs font-sans">
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-warm-orange mb-2">{gt.hubungiKami}</h4>
            <div className="flex items-start space-x-2.5">
              <MapPin className="h-4.5 w-4.5 text-yasmin-green shrink-0 mt-0.5" />
              <p className="leading-relaxed text-left text-warm-ivory/85">
                Jl. Letkol Istiqlah No. 80-84,<br />
                Mojopanggung, Kec. Banyuwangi,<br />
                Kab. Banyuwangi, Jawa Timur 68425
              </p>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="h-4 w-4 text-yasmin-green shrink-0" />
              <a href="tel:0333-424671" className="hover:text-yasmin-green transition-colors font-mono">{footerPhone}</a>
            </div>
            <div className="flex items-center space-x-2.5">
              <WhatsAppIcon className="h-4 w-4 text-whatsapp shrink-0 animate-whatsapp-shake" />
              <a href="https://wa.me/6285259353001" target="_blank" rel="noopener noreferrer" className="hover:text-whatsapp font-bold transition-colors font-mono">
                {footerWhatsapp}
              </a>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="h-4 w-4 text-yasmin-green shrink-0" />
              <a href={`mailto:${footerEmail}`} className="hover:text-yasmin-green transition-colors">{footerEmail}</a>
            </div>
          </div>
        </div>

        {/* Lower footer with reduced vertical spacing */}
        <div className="mt-6 pt-4 border-t border-warm-ivory/10 flex flex-col md:flex-row items-center justify-between text-xs text-warm-ivory/60 space-y-3 md:space-y-0">
          {/* Copyright & Accreditation inline without box */}
          <p className="text-center md:text-left">
            © {currentYear} RS Yasmin. <span className="text-warm-ivory/80 font-medium">{lt.akreditasi}</span>
          </p>

          {/* Dibuat dengan hati... */}
          <div className="flex items-center space-x-1 text-xs text-warm-ivory/60">
            <span>{lt.dibuatDengan}</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>{lt.untukBwi}</span>
          </div>

          {/* Visitor Counter in place of old accreditation box with same text-xs font size */}
          <div className="flex items-center space-x-1.5 text-xs text-warm-ivory/70">
            <span>{lang === 'ID' ? 'Anda Pengunjung Web Ke :' : 'Visitor Count :'}</span>
            <span className="font-mono font-bold text-warm-orange">{visitorCountFormatted}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

