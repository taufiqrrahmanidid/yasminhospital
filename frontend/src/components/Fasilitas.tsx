import React, { useState } from 'react';
import { 
  Building, Search, MapPin, Bus, Car, Moon, Coffee, Heart, 
  Sparkles, CheckCircle, Clock, ShieldCheck, Activity, Award, Check,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { EXTRA_TRANSLATIONS } from '../translations_extra';
import { LOCALIZED_FACILITIES } from '../translations_facilities';
import { SafeImage } from '../utils/imageUrl';

interface FacilityItem {
  id: string;
  name: string;
  category: 'inpatient' | 'emergency' | 'diagnostic' | 'all';
  desc: string;
  highlights: string[];
  features: string[];
  badge?: string;
  icon: any;
  image: string;
}

export default function Fasilitas() {
  const lang = useLanguage();
  const t = EXTRA_TRANSLATIONS.FASILITAS[lang] || EXTRA_TRANSLATIONS.FASILITAS.ID;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'inpatient' | 'emergency' | 'diagnostic'>('all');
  const [selectedFacilityRoom, setSelectedFacilityRoom] = useState<FacilityItem | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedFacilityRoom(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'big-grid' | 'small-grid' | 'list'>('big-grid');

  const publicFacilities = {
    ID: {
      badge: "KEMUDAHAN & AKSESIBILITAS",
      title: "Fasilitas Umum, Aksesibilitas & Kenyamanan Eksternal",
      desc: "Kami berkomitmen penuh tidak hanya menyediakan fasilitas medis canggih, namun juga memastikan seluruh kenyamanan logistik transportasi, ibadah, parkir dan pendamping keluarga pasien terjamin aman.",
      transportTitle: "Kemudahan Akses Transportasi Umum",
      transportDesc: "Terletak strategis di pusat kota (Jl. Letkol Istiqlah No. 21) yang dilewati langsung koridor utama angkutan kota (Lin/Angkot Banyuwangi), taksi, dan ojek online selama 24 jam.",
      transportTag: "📍 LOKASI STRATEGIS KOTA",
      parkingTitle: "Area Parkir Mobil & Motor Luas",
      parkingDesc: "Lahan parkir aspal luas di area depan dan samping yang didesain khusus guna menampung ratusan kendaraan roda dua maupun roda empat dengan CCTV dan sekuriti 24 jam.",
      parkingTag: "🛡️ CCTV & PETUGAS SIGAP",
      prayerTitle: "Tempat Ibadah Bersih (Musholla)",
      prayerDesc: "Musholla Al-Ikhlas yang bersih, sejuk (Full AC), dan senantiasa terawat rapi terletak strategis persis berdekatan dengan instalasi rawat inap dan selasar poliklinik spesialis.",
      prayerTag: "🕌 MUSHOLA AL-IKHLAS RS",
      canteenTitle: "Kantin Sehat RS Yasmin",
      canteenDesc: "Kantin higienis yang menyediakan aneka kuliner lokal Banyuwangi, jus buah segar, suplemen multivitamin, serta snack gizi seimbang yang terjangkau murah.",
      canteenTag: "✓ REKOMENDASI DIET GIZI"
    },
    EN: {
      badge: "CONVENIENCE & ACCESSIBILITY",
      title: "Public Facilities, Accessibility & External Comfort",
      desc: "We are fully committed to not only providing advanced medical facilities, but also ensuring complete comfort in transportation logistics, prayer room, parking, and family accompaniment.",
      transportTitle: "Easy Access to Public Transportation",
      transportDesc: "Strategically located in the city center (Jl. Letkol Istiqlah No. 21) on the main corridor of city transport (Lin/Angkot), taxi, and 24-hour online rides (Gojek/Grab).",
      transportTag: "📍 STRATEGIC CITY LOCATION",
      parkingTitle: "Spacious & Secure Parking Area",
      parkingDesc: "Wide asphalt parking in front and side areas designed to accommodate hundreds of motorcycles and cars, equipped with 24-hour CCTV monitoring and certified security guards.",
      parkingTag: "🛡️ CCTV & SECURE GUARDS",
      prayerTitle: "Clean Prayer Room (Musholla)",
      prayerDesc: "Musholla Al-Ikhlas is a clean, air-conditioned, and meticulously maintained prayer space located near the inpatient wings and outpatient clinics for serene worship.",
      prayerTag: "🕌 AL-IKHLAS MOSQUE",
      canteenTitle: "RS Yasmin Healthy Canteen",
      canteenDesc: "A hygienic canteen serving various Banyuwangi culinary options, fresh juices, multivitamins, and affordable balanced nutrition snacks for patient companions.",
      canteenTag: "✓ NUTRITIONAL RECOMMENDATIONS"
    },
    KR: {
      badge: "편의성 및 접근성",
      title: "대중 편의 시설, 접근성 및 외부 안락함",
      desc: "우리는 고급 의료 시설을 제공할 뿐만 아니라 교통 물류, 예배, 주차 및 환자 동반자 편의를 완벽히 지원하기 위해 최선을 다하고 있습니다.",
      transportTitle: "대중교통 이용의 용이성",
      transportDesc: "시내 중심가(Jl. Letkol Istiqlah No. 21)에 위치하여 시내버스, 택시, 24시간 온라인 대행 서비스를 편리하게 이용할 수 있습니다.",
      transportTag: "📍 시내 중심 전략적 위치",
      parkingTitle: "넓고 안전한 주차장",
      parkingDesc: "오토바이와 차량 수백 대를 수용할 수 있는 넓은 아스팔트 주차장으로, 24시간 CCTV 모니터링과 보안 요원이 항시 대기합니다.",
      parkingTag: "🛡️ CCTV 및 철저한 보안",
      prayerTitle: "청결한 기도실 (무솔라)",
      prayerDesc: "깨끗하고 에어컨이 구비되어 쾌적하게 유지되는 알-이클라스 무솔라가 외래 클리닉과 입원실 부근에 위치하고 있어 언제든 기도할 수 있습니다.",
      prayerTag: "🕌 알-이클라스 기도실",
      canteenTitle: "야스민 병원 건강 식당",
      canteenDesc: "바뉴왕이 지역 요리, 신선한 과일 주스, 영양 간식 등을 위생적이고 합리적인 가격에 제공하는 보호자 전용 식당입니다.",
      canteenTag: "✓ 권장 영양 식단"
    },
    ZH: {
      badge: "便利性与无障碍",
      title: "公共设施、无障碍与外部舒适度",
      desc: "我们不仅致力于提供先进的医疗设施，还确保交通、礼拜、停车和患者家属陪伴的全面便利与安全。",
      transportTitle: "便捷的大众交通",
      transportDesc: "位于市中心黄金地段（Letkol Istiqlah街21号），紧邻城市公共交通主干道，出租车和24小时网约车（Gojek/Grab）极易到达。",
      transportTag: "📍 城市战略位置",
      parkingTitle: "宽敞安全的停车场",
      parkingDesc: "宽阔的前院及侧院柏油路停车场，可容纳数百辆摩托车和汽车。配备24小时CCTV监控与专业保安巡逻。",
      parkingTag: "🛡️ 24小时监控与保安",
      prayerTitle: "洁净的礼拜室 (Musholla)",
      prayerDesc: "干净、凉爽（配备空调）且维护良好的Al-Ikhlas礼拜室，紧邻住院部和专科门诊通道，方便家属随时进行虔诚的祷告。",
      prayerTag: "🕌 医院礼拜室",
      canteenTitle: "雅斯敏健康餐厅",
      canteenDesc: "卫生整洁的健康食堂，提供巴纽旺伊特色美食、新鲜果汁及营养均衡的零食，价格实惠，是家属休息的理想场所。",
      canteenTag: "✓ 科学膳食推荐"
    },
    AR: {
      badge: "الراحة وسهولة الوصول",
      title: "المرافق العامة، سهولة الوصول والراحة الخارجية",
      desc: "نحن ملتزمون تماماً ليس فقط بتقديم مرافق طبية متقدمة، ولكن أيضاً بضمان الراحة الكاملة في وسائل النقل، العبادة، المواقف، ومرافقة العائلات.",
      transportTitle: "سهولة الوصول لوسائل النقل العامة",
      transportDesc: "موقع استراتيجي في وسط المدينة (شارع ليتكول إستقلال رقم 21) يمر به مباشرة خط الحافلات المحلي، وسيارات الأجرة، وخدمات التوصيل الذكية على مدار 24 ساعة.",
      transportTag: "📍 موقع استراتيجي في المدينة",
      parkingTitle: "مواقف سيارات ودراجات واسعة وآمنة",
      parkingDesc: "مساحة إسفلتية واسعة في الأمام والجانب مصممة خصيصاً لاستيعاب مئات المركبات، مزودة بكاميرات مراقبة وحراسة أمنية على مدار 24 ساعة.",
      parkingTag: "🛡️ مراقبة وحراسة مستمرة",
      prayerTitle: "مصلى نظيف ومريح",
      prayerDesc: "مصلى الإخلاص النظيف والمكيف والمهيأ بعناية يقع بالقرب من أجنحة التنويم والعيادات التخصصية لتسهيل العبادة بخشوع.",
      prayerTag: "🕌 مصلى المستشفى",
      canteenTitle: "مقصف ياسمين الصحي",
      canteenDesc: "مقصف صحي يقدم وجبات محلية، وعصائر طازجة، ووجبات خفيفة متوازنة بأسعار مناسبة لمرافقي المرضى.",
      canteenTag: "✓ توصيات غذائية صحية"
    }
  };

  const activePublicFac = publicFacilities[lang] || publicFacilities.ID;

  const categories = [
    { id: 'all', label: t.all },
    { id: 'inpatient', label: t.inpatient },
    { id: 'emergency', label: t.emergency },
    { id: 'diagnostic', label: t.diagnostic }
  ];

  const localizedData = LOCALIZED_FACILITIES[lang] || LOCALIZED_FACILITIES.ID;

  const heroSlides = [
    {
      id: 'slide-rawatjalan',
      name: localizedData['rawat-jalan']?.name || 'Poliklinik Rawat Jalan Spesialis',
      desc: localizedData['rawat-jalan']?.desc || '',
      badge: localizedData['rawat-jalan']?.badge || 'RAWAT JALAN',
      image: '/assets/images/fasilitas/rsyasminfasilitas_rawatjalan.png'
    },
    {
      id: 'slide-rehab',
      name: localizedData['rehabilitasi-medik']?.name || 'Rehabilitasi Medik & Fisioterapi',
      desc: localizedData['rehabilitasi-medik']?.desc || '',
      badge: localizedData['rehabilitasi-medik']?.badge || 'REHABILITASI MEDIK',
      image: '/assets/images/fasilitas/rsyasminfasilitas_rehab.png'
    },
    {
      id: 'slide-rskincare',
      name: localizedData['skincare']?.name || 'Yasmin Skincare & Aesthetic Center',
      desc: localizedData['skincare']?.desc || '',
      badge: localizedData['skincare']?.badge || 'ESTETIKA MEDIS',
      image: '/assets/images/fasilitas/rsyasminfasilitas_rskincare.png'
    },
    {
      id: 'slide-laborat',
      name: localizedData['laboratorium']?.name || 'Laboratorium Klinik Modern 24 Jam',
      desc: localizedData['laboratorium']?.desc || '',
      badge: localizedData['laboratorium']?.badge || 'LABORATORIUM',
      image: '/assets/images/fasilitas/rsyasminfasilitas_laborat.png'
    },
    {
      id: 'slide-farmasi',
      name: localizedData['instalasi-farmasi-24-jam']?.name || 'Instalasi Farmasi Lengkap 24 Jam',
      desc: localizedData['instalasi-farmasi-24-jam']?.desc || '',
      badge: localizedData['instalasi-farmasi-24-jam']?.badge || 'FARMASI 24 JAM',
      image: '/assets/images/fasilitas/rsyasminfasilitas_farmasi.png'
    },
    {
      id: 'slide-igd',
      name: localizedData['instalasi-gawat-darurat-igd-24-jam']?.name || 'Instalasi Gawat Darurat & Ambulans 24 Jam',
      desc: localizedData['instalasi-gawat-darurat-igd-24-jam']?.desc || '',
      badge: localizedData['instalasi-gawat-darurat-igd-24-jam']?.badge || 'GAWAT DARURAT',
      image: '/assets/images/fasilitas/rsyasminfasilitas_igd.png'
    },
    {
      id: 'slide-rawatinap',
      name: localizedData['rawat-inap']?.name || 'Fasilitas Rawat Inap & Suite VIP/VVIP',
      desc: localizedData['rawat-inap']?.desc || '',
      badge: localizedData['rawat-inap']?.badge || 'RAWAT INAP NYAMAN',
      image: '/assets/images/fasilitas/rsyasminfasilitas_rawatinap.png'
    },
    {
      id: 'slide-icu',
      name: localizedData['icu']?.name || 'Intensive Care Unit (ICU) & HCU',
      desc: localizedData['icu']?.desc || '',
      badge: localizedData['icu']?.badge || 'PERAWATAN KRITIS',
      image: '/assets/images/fasilitas/rsyasminfasilitas_icu.png'
    },
    {
      id: 'slide-radiologi',
      name: localizedData['radiologi']?.name || 'Instalasi Radiologi & CT-Scan',
      desc: localizedData['radiologi']?.desc || '',
      badge: localizedData['radiologi']?.badge || 'RADIOLOGI & CT-SCAN',
      image: '/assets/images/fasilitas/rsyasminfasilitas_radiologi.png'
    },
    {
      id: 'slide-kamaroperasi',
      name: localizedData['kamar-operasi']?.name || 'Kamar Operasi Aliran Udara Steril HEPA',
      desc: localizedData['kamar-operasi']?.desc || '',
      badge: localizedData['kamar-operasi']?.badge || 'KAMAR OPERASI',
      image: '/assets/images/fasilitas/rsyasminfasilitas_kamaroprasi.png'
    },
    {
      id: 'slide-kamarbersalin',
      name: localizedData['perinatologi-kamar-bersalin']?.name || 'Perinatologi & Kamar Bersalin (VK Maternity)',
      desc: localizedData['perinatologi-kamar-bersalin']?.desc || '',
      badge: localizedData['perinatologi-kamar-bersalin']?.badge || 'KAMAR BERSALIN',
      image: '/assets/images/fasilitas/rsyasminfasilitas_kamarbersalin.png'
    }
  ];

  const facilitiesList: FacilityItem[] = [
    {
      id: 'rawat-jalan',
      name: localizedData['rawat-jalan']?.name || 'Poliklinik Rawat Jalan Spesialis',
      category: 'diagnostic',
      desc: localizedData['rawat-jalan']?.desc || '',
      highlights: localizedData['rawat-jalan']?.highlights || [],
      features: localizedData['rawat-jalan']?.features || [],
      badge: localizedData['rawat-jalan']?.badge || '',
      icon: Sparkles,
      image: '/assets/images/fasilitas/rsyasminfasilitas_rawatjalan.png'
    },
    {
      id: 'rehabilitasi-medik',
      name: localizedData['rehabilitasi-medik']?.name || 'Rehabilitasi Medik & Fisioterapi',
      category: 'diagnostic',
      desc: localizedData['rehabilitasi-medik']?.desc || '',
      highlights: localizedData['rehabilitasi-medik']?.highlights || [],
      features: localizedData['rehabilitasi-medik']?.features || [],
      badge: localizedData['rehabilitasi-medik']?.badge || '',
      icon: Clock,
      image: '/assets/images/fasilitas/rsyasminfasilitas_rehab.png'
    },
    {
      id: 'skincare',
      name: localizedData['skincare']?.name || 'Yasmin Skincare & Aesthetic Center',
      category: 'diagnostic',
      desc: localizedData['skincare']?.desc || '',
      highlights: localizedData['skincare']?.highlights || [],
      features: localizedData['skincare']?.features || [],
      badge: localizedData['skincare']?.badge || '',
      icon: Sparkles,
      image: '/assets/images/fasilitas/rsyasminfasilitas_rskincare.png'
    },
    {
      id: 'laboratorium',
      name: localizedData['laboratorium']?.name || 'Laboratorium Klinik 24 Jam',
      category: 'diagnostic',
      desc: localizedData['laboratorium']?.desc || '',
      highlights: localizedData['laboratorium']?.highlights || [],
      features: localizedData['laboratorium']?.features || [],
      badge: localizedData['laboratorium']?.badge || '',
      icon: Building,
      image: '/assets/images/fasilitas/rsyasminfasilitas_laborat.png'
    },
    {
      id: 'instalasi-farmasi-24-jam',
      name: localizedData['instalasi-farmasi-24-jam']?.name || 'Instalasi Farmasi 24 Jam',
      category: 'diagnostic',
      desc: localizedData['instalasi-farmasi-24-jam']?.desc || '',
      highlights: localizedData['instalasi-farmasi-24-jam']?.highlights || [],
      features: localizedData['instalasi-farmasi-24-jam']?.features || [],
      badge: localizedData['instalasi-farmasi-24-jam']?.badge || '',
      icon: ShieldCheck,
      image: '/assets/images/fasilitas/rsyasminfasilitas_farmasi.png'
    },
    {
      id: 'instalasi-gawat-darurat-igd-24-jam',
      name: localizedData['instalasi-gawat-darurat-igd-24-jam']?.name || 'Instalasi Gawat Darurat (IGD) 24 Jam',
      category: 'emergency',
      desc: localizedData['instalasi-gawat-darurat-igd-24-jam']?.desc || '',
      highlights: localizedData['instalasi-gawat-darurat-igd-24-jam']?.highlights || [],
      features: localizedData['instalasi-gawat-darurat-igd-24-jam']?.features || [],
      badge: localizedData['instalasi-gawat-darurat-igd-24-jam']?.badge || '',
      icon: Activity,
      image: '/assets/images/fasilitas/rsyasminfasilitas_igd.png'
    },
    {
      id: 'rawat-inap',
      name: localizedData['rawat-inap']?.name || 'Kamar Rawat Inap & Suite VIP/VVIP',
      category: 'inpatient',
      desc: localizedData['rawat-inap']?.desc || '',
      highlights: localizedData['rawat-inap']?.highlights || [],
      features: localizedData['rawat-inap']?.features || [],
      badge: localizedData['rawat-inap']?.badge || '',
      icon: Sparkles,
      image: '/assets/images/fasilitas/rsyasminfasilitas_rawatinap.png'
    },
    {
      id: 'icu',
      name: localizedData['icu']?.name || 'Intensive Care Unit (ICU) & HCU',
      category: 'emergency',
      desc: localizedData['icu']?.desc || '',
      highlights: localizedData['icu']?.highlights || [],
      features: localizedData['icu']?.features || [],
      badge: localizedData['icu']?.badge || '',
      icon: ShieldCheck,
      image: '/assets/images/fasilitas/rsyasminfasilitas_icu.png'
    },
    {
      id: 'radiologi',
      name: localizedData['radiologi']?.name || 'Instalasi Radiologi & CT-Scan',
      category: 'diagnostic',
      desc: localizedData['radiologi']?.desc || '',
      highlights: localizedData['radiologi']?.highlights || [],
      features: localizedData['radiologi']?.features || [],
      badge: localizedData['radiologi']?.badge || '',
      icon: Building,
      image: '/assets/images/fasilitas/rsyasminfasilitas_radiologi.png'
    },
    {
      id: 'kamar-operasi',
      name: localizedData['kamar-operasi']?.name || 'Kamar Operasi (Operating Theater)',
      category: 'emergency',
      desc: localizedData['kamar-operasi']?.desc || '',
      highlights: localizedData['kamar-operasi']?.highlights || [],
      features: localizedData['kamar-operasi']?.features || [],
      badge: localizedData['kamar-operasi']?.badge || '',
      icon: ShieldCheck,
      image: '/assets/images/fasilitas/rsyasminfasilitas_kamaroprasi.png'
    },
    {
      id: 'perinatologi-kamar-bersalin',
      name: localizedData['perinatologi-kamar-bersalin']?.name || 'Perinatologi & Kamar Bersalin (VK Maternity)',
      category: 'inpatient',
      desc: localizedData['perinatologi-kamar-bersalin']?.desc || '',
      highlights: localizedData['perinatologi-kamar-bersalin']?.highlights || [],
      features: localizedData['perinatologi-kamar-bersalin']?.features || [],
      badge: localizedData['perinatologi-kamar-bersalin']?.badge || '',
      icon: Heart,
      image: '/assets/images/fasilitas/rsyasminfasilitas_kamarbersalin.png'
    }
  ];

  // Filtering Logic
  const filteredFacilities = facilitiesList.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          f.features.some(ft => ft.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="facilities-page" className="bg-[#FAF9F5] text-left min-h-screen font-sans pt-12 lg:pt-16">
      
      {/* ==================== HERO SECTION ==================== */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0B4F4A]/10 via-soft-mint/5 to-[#FAF9F5] border-b border-divider w-full">
        {/* Full Width Interactive Slideshow Carousel (Full Seksi Hero) */}
        <div className="relative w-full animate-fade-in-up">
          {(() => {
            const heroFeatured = heroSlides;
            const activeHero = heroFeatured[currentHeroIndex];
            return (
              <div className="relative rounded-none overflow-hidden shadow-md h-[340px] sm:h-[400px] md:h-[450px] lg:h-[480px] bg-slate-100 w-full group/hero">
                <SafeImage
                  src={activeHero?.image}
                  alt={activeHero?.name}
                  className="w-full h-full object-cover transform scale-101 transition-transform duration-700 group-hover/hero:scale-105"
                />
                {/* Left-side color filter (brand teal gradient) to ensure text on the left remains perfectly readable */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 md:w-1/2 bg-gradient-to-r from-[#0B4F4A]/90 via-[#0B4F4A]/50 to-transparent z-10" />
                {/* System color tint filter and dark layers to keep overlays/text heavily readable */}
                <div className="absolute inset-0 bg-[#0B4F4A]/25 mix-blend-multiply z-10" />
                <div className="absolute inset-0 bg-black/20 z-10" />
                {/* Dark gradient overlay at the bottom for typography safety */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pt-24 pb-8 px-6 text-white text-left z-10" />

                {/* Absolute overlay container spanning full dimensions of the slide */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {/* Inner content container constrained EXACTLY like the header */}
                  <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
                    {/* Top-aligned Headline Overlay in Front of Slide */}
                    <div className="absolute top-8 left-4 sm:left-6 lg:left-8 space-y-3 sm:space-y-4 max-w-full md:max-w-none text-left select-none pointer-events-auto">
                      <div>
                        <span className="font-display text-[10px] sm:text-xs text-white font-black uppercase tracking-wider bg-[#0B4F4A]/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/20 shadow-md">
                          <Sparkles className="h-3.5 w-3.5 text-warm-orange animate-pulse" />
                          {t.badge}
                        </span>
                      </div>
                      <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-[2.75rem] text-white leading-tight tracking-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-normal sm:whitespace-nowrap">
                        {t.title}
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + heroFeatured.length) % heroFeatured.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/70 hover:bg-white text-slate-950 font-bold flex items-center justify-center rounded-full shadow-md transition-all z-20 cursor-pointer text-xs"
                >
                  ◀
                </button>
                <button
                  onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroFeatured.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/70 hover:bg-white text-slate-950 font-bold flex items-center justify-center rounded-full shadow-md transition-all z-20 cursor-pointer text-xs"
                >
                  ▶
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 right-6 flex space-x-1.5 z-20">
                  {heroFeatured.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`w-2 h-2 rounded-full border border-white transition-all cursor-pointer ${
                        currentHeroIndex === idx ? 'bg-amber-400 w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ==================== INTERACTIVE DIRECTORY WITH ZERO-CLICK DETAIL VIEWS ==================== */}
      <div className="pt-2 pb-12">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Toggle Collapse Filter Interface */}
          <div className="flex justify-between items-center bg-soft-mint/40 border-2 border-divider px-5 py-3 rounded-2xl w-full">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
              <span className="font-display text-[10px] sm:text-xs font-bold text-headings tracking-widest uppercase">
                {lang === 'ID' ? 'PANEL FILTER & DIREKTORI FASILITAS' : 'FILTER PANEL & FACILITIES DIRECTORY'}
              </span>
            </div>
            <button
              id="btn-collapse-facilities-filters"
              onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
              className="px-3.5 py-2 bg-white hover:bg-[#0B4F4A] hover:text-white text-deep-teal border border-divider rounded-xl font-display text-xs font-bold transition-all duration-300 cursor-pointer flex items-center shadow-sm hover:scale-110"
              title={isFilterCollapsed ? (lang === 'ID' ? "Buka Panel Filter" : "Open Filter Panel") : (lang === 'ID' ? "Lipat Panel Filter" : "Collapse Filter Panel")}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${isFilterCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* SEARCH & FILTERS ROW */}
          <div className={`${isFilterCollapsed ? 'hidden' : 'flex'} flex-col lg:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border-2 border-divider shadow-2xs transition-all duration-300`}>
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96 select-none">
              <span className="absolute inset-y-0 left-3.5 flex items-center pr-3 text-gray-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#FAF9F5]/80 text-xs border-2 border-divider pl-10 pr-4 py-3.5 rounded-xl font-bold focus:border-deep-teal focus:bg-white outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Pill Filters */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-display text-xs font-bold transition-all border-2 cursor-pointer ${
                    selectedCategory === c.id 
                      ? 'bg-[#0B4F4A] text-white border-headings shadow-[2px_2px_0px_#1e1e1e]' 
                      : 'bg-[#FAF9F5] text-gray-600 border-divider hover:bg-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* View Mode Choice - Requested: "buat pilihan big/small grid dan list di daftar fasilitas" */}
            <div className="flex items-center gap-1 bg-[#FAF9F5] border-2 border-divider p-1 rounded-xl shrink-0 select-none w-full lg:w-auto justify-center">
              <button
                type="button"
                onClick={() => setViewMode('big-grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                  viewMode === 'big-grid'
                    ? 'bg-deep-teal text-white shadow-3xs'
                    : 'text-gray-500 hover:text-deep-teal'
                }`}
                title={lang === 'ID' ? "Bentuk Grid Besar" : "Big Grid Mode"}
              >
                🖥️ {t.viewModeBig}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('small-grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                  viewMode === 'small-grid'
                    ? 'bg-deep-teal text-white shadow-3xs'
                    : 'text-gray-500 hover:text-deep-teal'
                }`}
                title={lang === 'ID' ? "Bentuk Grid Kecil" : "Small Grid Mode"}
              >
                📱 {t.viewModeSmall}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-deep-teal text-white shadow-3xs'
                    : 'text-gray-500 hover:text-deep-teal'
                }`}
                title={lang === 'ID' ? "Bentuk List Sederhana" : "List Mode"}
              >
                📋 {t.viewModeList}
              </button>
            </div>

          </div>

          {/* ZERO CLICK INTEGRATED GRID */}
          {filteredFacilities.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-divider rounded-3xl space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="font-display font-black text-sm text-headings">
                {lang === 'ID' ? 'Fasilitas Tidak Ditemukan' : 'No Facilities Found'}
              </h3>
              <p className="text-xs text-gray-450">
                {lang === 'ID' ? 'Mohon perbaiki kata kunci pencarian atau ubah filter kategori Anda.' : 'Please refine your search keywords or change your category filter.'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'list'
                ? 'space-y-6'
                : viewMode === 'small-grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8'
            }>
              {filteredFacilities.map((f) => {
                const IconComp = f.icon;

                // Handle 'list' Mode Render Block
                if (viewMode === 'list') {
                  return (
                    <div 
                      key={f.id}
                      className="bg-[#F2F7F5] border-2 border-divider hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] transition-all duration-300 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between text-left relative group shadow-2xs"
                    >
                      <div className="flex flex-col md:flex-row gap-5 items-start md:items-center flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-soft-mint border border-divider flex items-center justify-center text-deep-teal shrink-0 relative overflow-hidden">
                          <SafeImage src={f.image} alt={f.name} className="absolute inset-0 w-full h-full object-fill opacity-20 group-hover:scale-105 transition-transform" />
                          <IconComp className="w-6 h-6 relative z-10" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-sans font-black text-base md:text-lg text-headings leading-tight">{f.name}</h3>
                            <span className="bg-[#FAF9F5] text-deep-teal font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-divider uppercase">
                              {f.category === 'inpatient' ? 'Rawat Inap' : f.category === 'emergency' ? 'Gawat Darurat' : 'Penunjang Medis'}
                            </span>
                            {f.badge && (
                              <span className="bg-red-50 text-red-700 font-sans text-[10px] font-bold tracking-wider border border-red-200 px-2 py-0.5 rounded-full uppercase">
                                {f.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-555 leading-relaxed font-sans mt-1">{f.desc}</p>
                        </div>
                      </div>
                      
                      {/* Highlights summary in list mode */}
                      <div className="hidden xl:flex flex-col space-y-1 text-xs text-gray-600 border-l border-divider pl-5 max-w-[280px] shrink-0">
                        <span className="font-sans font-bold text-[10px] text-headings uppercase tracking-wider block text-deep-teal mb-0.5">Highlights:</span>
                        <ul className="space-y-0.5 text-xs">
                          {f.highlights.slice(0, 2).map((h, i) => (
                            <li key={i} className="flex items-center gap-1.5 truncate">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-end shrink-0 gap-4 mt-2 md:mt-0">
                        <button
                          onClick={() => setSelectedFacilityRoom(f)}
                          className="px-4 py-2.5 bg-headings hover:bg-deep-teal font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white border border-headings hover:border-deep-teal rounded-lg transition-all cursor-pointer select-none"
                        >
                          👁️ {lang === 'ID' ? 'Lihat Ruangan' : lang === 'KR' ? '방 보기' : lang === 'ZH' ? '查看房间' : lang === 'AR' ? 'عرض الغرفة' : 'View Room'}
                        </button>
                      </div>
                    </div>
                  );
                }

                // Handle Big/Small Grid Mode Render Block
                const isSmallGrid = viewMode === 'small-grid';
                return (
                  <div 
                    key={f.id} 
                    className={`bg-[#F2F7F5] border-3 border-divider hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.01] transition-all duration-300 rounded-3xl flex flex-col justify-between shadow-2xs group relative ${
                      isSmallGrid ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
                    }`}
                  >
                    
                    {/* Upper content */}
                    <div className="space-y-5 text-left">
                      
                      {/* header row of card */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 bg-soft-mint rounded-xl border border-divider flex items-center justify-center text-deep-teal transition-transform group-hover:scale-105 shrink-0">
                            <IconComp className="w-5.5 h-5.5" />
                          </div>
                          <div>
                            <h3 className="font-sans font-black text-base sm:text-lg lg:text-xl text-headings leading-tight">{f.name}</h3>
                            <span className="bg-[#FAF9F5] text-deep-teal font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-divider uppercase">
                              {f.category === 'inpatient' ? 'Rawat Inap' : f.category === 'emergency' ? 'Gawat Darurat' : 'Penunjang Medis'}
                            </span>
                          </div>
                        </div>
                        {f.badge && (
                          <span className="bg-red-50 text-red-700 font-sans text-[9px] font-bold tracking-wider border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
                            {f.badge}
                          </span>
                        )}
                      </div>

                      {/* Decription */}
                      <p className="text-xs sm:text-sm text-gray-555 leading-relaxed font-sans mt-2">{f.desc}</p>

                      {/* Grid for features and highlights to prevent clicks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-divider/60">
                        
                        {/* Highlights (Left Column) */}
                        <div className="space-y-1.5">
                          <h4 className="font-sans font-bold text-xs text-headings uppercase tracking-wider flex items-center gap-1 text-deep-teal">
                            <span className="w-1.5 h-1.5 rounded-full bg-deep-teal" />
                            Highlight Sarana:
                          </h4>
                          <ul className="space-y-1 text-xs sm:text-sm text-gray-650 font-sans">
                            {f.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Detail Spesifik (Right Column) */}
                        <div className="space-y-1.5">
                          <h4 className="font-sans font-bold text-xs text-headings uppercase tracking-wider flex items-center gap-1 text-red-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            Detail Ketersediaan:
                          </h4>
                          <ul className="space-y-1 text-xs sm:text-sm text-gray-600 font-sans">
                            {f.features.map((ft, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-red-500 font-bold">+</span>
                                <span>{ft}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                       </div>

                     </div>

                     {/* Bottom row */}
                     <div className="pt-4 mt-4 border-t border-divider/60 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                       <div className="text-[10px] font-mono select-none text-left">
                         <span className="text-gray-400 block pb-0.5">
                           {lang === 'ID' ? 'STATUS OPERASIONAL' : 'OPERATIONAL STATUS'}
                         </span>
                         <span className="text-emerald-650 font-bold uppercase text-xs">Ready & Active</span>
                       </div>
                       <button
                         onClick={() => setSelectedFacilityRoom(f)}
                         className="px-4 py-2.5 bg-headings hover:bg-deep-teal font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white border border-headings hover:border-deep-teal rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none"
                       >
                         👁️ {lang === 'ID' ? 'Lihat Ruangan' : lang === 'KR' ? '방 보기' : lang === 'ZH' ? '查看房间' : lang === 'AR' ? 'عرض الغرفة' : 'View Room'}
                       </button>
                     </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ==================== GENERAL SUPPORT & ACCESS DETAILS (INTEGRATING CRITICAL REQUEST DETAILS) ==================== */}
      <div className="py-20 bg-white border-t border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2.5 w-full max-w-full mx-auto">
            <div>
              <span className="inline-block font-mono text-xs text-red-650 font-black tracking-widest uppercase bg-rose-50 border border-red-150 px-3 py-1 rounded-full">
                {activePublicFac.badge}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-headings leading-[1.2]">
              {activePublicFac.title}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed w-full max-w-full mx-auto">
              {activePublicFac.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Kemudahan Transportasi Umum */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs hover:border-deep-teal transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-soft-mint border border-divider flex items-center justify-center text-deep-teal shrink-0">
                    <Bus className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-base text-headings leading-snug">{activePublicFac.transportTitle}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {activePublicFac.transportDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-divider/60 font-mono text-[9.5px] text-deep-teal font-extrabold flex items-center gap-1">
                <span>{activePublicFac.transportTag}</span>
              </div>
            </div>

            {/* 2. Parkiran Luas & Aman */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs hover:border-deep-teal transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-soft-mint border border-divider flex items-center justify-center text-deep-teal shrink-0">
                    <Car className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-base text-headings leading-snug">{activePublicFac.parkingTitle}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {activePublicFac.parkingDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-divider/60 font-mono text-[9.5px] text-deep-teal font-extrabold flex items-center gap-1">
                <span>{activePublicFac.parkingTag}</span>
              </div>
            </div>

            {/* 3. Dekat dengan Tempat Ibadah */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs hover:border-deep-teal transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-soft-mint border border-divider flex items-center justify-center text-deep-teal shrink-0">
                    <Moon className="w-6 h-6 text-yellow-600 fill-current" />
                  </div>
                  <h3 className="font-display font-black text-base text-headings leading-snug">{activePublicFac.prayerTitle}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {activePublicFac.prayerDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-divider/60 font-mono text-[9.5px] text-deep-teal font-extrabold flex items-center gap-1">
                <span>{activePublicFac.prayerTag}</span>
              </div>
            </div>

            {/* 4. Kantin Sehat RS */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs hover:border-deep-teal transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-soft-mint border border-divider flex items-center justify-center text-deep-teal shrink-0">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-base text-headings leading-snug">{activePublicFac.canteenTitle}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {activePublicFac.canteenDesc}
                </p>
              </div>
              <div className="pt-4 border-t border-divider/60 font-mono text-[9.5px] text-deep-teal font-extrabold flex items-center gap-1">
                <span>{activePublicFac.canteenTag}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ==================== STUNNING MODAL POPUP FOR LIHAT RUANGAN ==================== */}
      {selectedFacilityRoom && (
        <div id="facility-room-modal" className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 text-left animate-fade-in">
          <div className="bg-white border-4 border-headings rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-up">
            
            {/* Close Button */}
            <button
              id="close-modal-btn"
              onClick={() => setSelectedFacilityRoom(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center font-black transition-all cursor-pointer shadow-sm animate-red-blink"
            >
              ✕
            </button>

            {/* Room Image */}
            <div className="aspect-[16/10] w-full relative bg-gray-100">
              <SafeImage
                src={selectedFacilityRoom.image}
                alt={selectedFacilityRoom.name}
                className="w-full h-full object-fill"
              />
              <div className="absolute top-4 left-4 bg-[#0B4F4A] text-white font-mono text-[9px] font-black tracking-widest px-3 py-1.5 rounded-xl uppercase border-2 border-white shadow-xs">
                {selectedFacilityRoom.category === 'inpatient' ? 'Rawat Inap' : selectedFacilityRoom.category === 'emergency' ? 'Gawat Darurat' : 'Penunjang Medis'}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6">
              <div className="space-y-2 text-left">
                <h3 className="font-display font-black text-xl sm:text-2xl text-headings leading-tight">
                  {selectedFacilityRoom.name}
                </h3>
                <p className="text-gray-550 text-xs leading-relaxed">
                  {selectedFacilityRoom.desc}
                </p>
              </div>

              {/* Highlights and features inside modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-divider/65">
                <div className="space-y-2">
                  <h4 className="font-display font-black text-[10.5px] text-headings uppercase tracking-wider flex items-center gap-1.5 text-deep-teal">
                    <span className="w-1.5 h-1.5 rounded-full bg-deep-teal" />
                    Kelebihan Sarana:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-600 font-semibold">
                    {selectedFacilityRoom.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-black">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-black text-[10.5px] text-headings uppercase tracking-wider flex items-center gap-1.5 text-red-650">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-650" />
                    Detail Pelayanan:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-550">
                    {selectedFacilityRoom.features.map((ft, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-black">+</span>
                        <span>{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reservation CTA row */}
              <div className="pt-5 border-t border-divider/65 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[11px] text-gray-450 text-center sm:text-left">
                  <span>
                    {lang === 'ID' ? 'Ingin konsultasi seputar ketersediaan / tarif?' : 'Want to consult about availability or rates?'}
                  </span>
                  <span className="block font-bold text-headings">
                    {lang === 'ID' ? 'Humas RS Yasmin siap membantu.' : 'RS Yasmin Public Relations is ready to help.'}
                  </span>
                </div>
                <a
                  href="https://wa.me/6285259353001?text=Halo%20Humas%20RS%20Yasmin,%20saya%20ingin%20bertanya%20mengenai%20sarana%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-headings font-display text-xs font-black uppercase tracking-wider rounded-xl border-2 border-headings shadow-[2px_2px_0px_#1e1e1e] hover:shadow-none transition-all text-center select-none"
                >
                  {lang === 'ID' ? 'Hubungi Humas RS Yasmin 📞' : 'Contact RS Yasmin PR 📞'}
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
