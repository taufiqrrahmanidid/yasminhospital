import React, { useState, useEffect } from 'react';
import { Search, Calendar, ShieldAlert, BedDouble, MapPin, ClipboardList, MessageSquare, ArrowRight, UserCheck, ChevronLeft, ChevronRight, Smile } from 'lucide-react';
import { ActiveTabType } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import WhatsAppIcon from './WhatsAppIcon';
import { HEALTH_CENTERS } from '../data';
import { HEALTH_CENTERS_TRANSLATIONS } from './HealthCenters';
import { SafeImage } from '../utils/imageUrl';

const layanRawat = '/assets/images/layan/rsyasminlayan_rawat_s.png';
const layanIgd = '/assets/images/layan/rsyasminlayan_igdambulance_s.png';
const layanEracs = '/assets/images/layan/rsyasminlayan_eracs_s.png';
const layanBpjs = '/assets/images/layan/rsyasminlayan_bpjs_s.png';

const TRANSLATIONS = {
  ID: {
    badge: '🍃 HEALING GARDEN HOSPITAL',
    headlinePrefix: 'Kesehatan Keluarga',
    headlineHighlight: 'Rasa Nyaman',
    headlineSuffix: 'Dimulai dari',
    desc: 'Sejak 1986, RS Yasmin Banyuwangi hadir memberikan pelayanan kesehatan yang profesional dalam lingkungan yang nyaman, hangat, dan ramah keluarga. Kami percaya proses pulih sejati berjalan beriringan dengan kedamaian batin.',
    btnBook: 'Daftar Online',
    btnDoc: 'Cari Dokter',
    btnWa: 'Chat WhatsApp',
    quickAccessTitle: 'Akses Cepat Layanan',
    cardDocTitle: 'Cari Dokter',
    cardDocSub: 'Jadwal Spesialis',
    cardRegTitle: 'Daftar Online',
    cardRegSub: 'Tanpa Antre',
    cardBpjsTitle: 'Informasi BPJS',
    cardBpjsSub: 'Pelayanan JKN',
    cardInpatientTitle: 'Rawat Inap',
    cardInpatientSub: 'Kamar Nyaman',
    cardIgdTitle: 'IGD 24 Jam',
    cardIgdSub: 'Siaga Darurat',
    cardLocTitle: 'Lokasi RS',
    cardLocSub: 'Petunjuk Arah',
    accred: 'PARIPURNA',
    accredSub: 'Akreditasi KARS',
    bpjs: 'BPJS & SWASTA',
    bpjsSub: 'Layanan Terbuka',
    history: '40+ TAHUN',
    historySub: 'Mengabdi Banyuwangi',
    slides: [
      {
        title: "Gedung RS Yasmin Baru",
        tagline: "Fasilitas modern terpadu bernuansa Healing Garden asri di Banyuwangi.",
        badge: "Kenyamanan Utama"
      },
      {
        title: "Pelayanan Medis Empati",
        tagline: "Dokter dan perawat siaga 24 jam mendampingi pemulihan kesehatan keluarga.",
        badge: "Profesional & Tulus"
      },
      {
        title: "Pusat Spesialis Ibu & Anak",
        tagline: "Layanan Persalinan ERACS dan pemantauan tumbuh kembang buah hati tercinta.",
        badge: "Keluarga Paripurna"
      },
      {
        title: "Poli Spesialis Terbuka & BPJS",
        tagline: "Melayani seluruh lapisan masyarakat Banyuwangi secara tulus dan transparan.",
        badge: "Mitra Sehat Terpercaya"
      }
    ]
  },
  EN: {
    badge: '🍃 HEALING GARDEN HOSPITAL',
    headlinePrefix: 'Family Wellness',
    headlineHighlight: 'Complete Comfort',
    headlineSuffix: 'Begins with',
    desc: 'Since 1986, RS Yasmin Banyuwangi has provided professional healthcare in a warm, welcoming, family-friendly environment. We believe that true recovery goes hand-in-hand with inner peace.',
    btnBook: 'Online Appointment',
    btnDoc: 'Find Doctor',
    btnWa: 'WhatsApp Chat',
    quickAccessTitle: 'Quick Access Services',
    cardDocTitle: 'Find Doctor',
    cardDocSub: 'Specialist Schedules',
    cardRegTitle: 'Online Booking',
    cardRegSub: 'No Queues',
    cardBpjsTitle: 'BPJS Info',
    cardBpjsSub: 'National Insurance',
    cardInpatientTitle: 'Inpatient Rooms',
    cardInpatientSub: 'Cozy Rooms',
    cardIgdTitle: '24h Emergency',
    cardIgdSub: 'Emergency Response',
    cardLocTitle: 'Location',
    cardLocSub: 'Get Directions',
    accred: 'FULLY ACCREDITED',
    accredSub: 'KARS Accreditation',
    bpjs: 'BPJS & INSURANCE',
    bpjsSub: 'Open Access Services',
    history: '40+ YEARS',
    historySub: 'Serving Banyuwangi',
    slides: [
      {
        title: "New RS Yasmin Building",
        tagline: "Integrated modern facilities set within a lush Healing Garden in Banyuwangi.",
        badge: "Ultimate Comfort"
      },
      {
        title: "Empathetic Medical Care",
        tagline: "Doctors and nurses on call 24 hours to support your family’s recovery.",
        badge: "Professional & Sincere"
      },
      {
        title: "Mother & Child Specialist Center",
        tagline: "ERACS maternity services and comprehensive milestone monitoring for your child.",
        badge: "Complete Family Care"
      },
      {
        title: "Open Specialists & National Health (BPJS)",
        tagline: "Sincerity and transparency for all social segments in Banyuwangi.",
        badge: "Trusted Health Partners"
      }
    ]
  },
  KR: {
    badge: '🍃 힐링 가든 병원',
    headlinePrefix: '가족의 건강은',
    headlineHighlight: '안락함',
    headlineSuffix: '에서 꽃핍니다',
    desc: '1986년 이래 RS 야스민 바뉴왕이는 친절하고 따뜻하며 유대감 깊은 가족 주치의 환경을 구축해 왔습니다. 진정한 신체 재생은 정신적 안식과 평화가 공존할 때 실현된다고 우리는 굳게 믿습니다.',
    btnBook: '온라인 진료 슬롯 예약',
    btnDoc: '전문의 검색',
    btnWa: '왓츠앱 긴급 상담',
    quickAccessTitle: '신속 서비스 안내',
    cardDocTitle: '의료진 찾기',
    cardDocSub: '전문의 진료 일정',
    cardRegTitle: '온라인 예약',
    cardRegSub: '대기 없는 접수',
    cardBpjsTitle: 'BPJS 보험 정보',
    cardBpjsSub: '의료보험 혜택 안내',
    cardInpatientTitle: '입원실 안내',
    cardInpatientSub: '쾌적한 치유 병실',
    cardIgdTitle: '24시 응급실',
    cardIgdSub: '응급 상시 대기',
    cardLocTitle: '병원 위치',
    cardLocSub: '오시는 길 안내',
    accred: '국가 정식 최우수 등급',
    accredSub: 'KARS 인증 획득',
    bpjs: '정부 보험 및 사립 보장',
    bpjsSub: '차별 없는 공평 진료',
    history: '40년 이상의 역사',
    historySub: '바뉴왕이 지역 헌신',
    slides: [
      {
        title: "야스민 종합의료 스마트 빌딩",
        tagline: "최신의 정밀 인프라를 수려한 정원 휴양 공간에 완벽히 설계하였습니다.",
        badge: "안락한 입원"
      },
      {
        title: "공감형 환자 중심 케어",
        tagline: "담당 의료진이 24시간 철저히 밀착 모니터링하여 평화로운 쾌유를 지지합니다.",
        badge: "진정성 있는 동행"
      },
      {
         title: "최상급 산부인과 소아과 센터",
         tagline: "ERACS 무통 회복 제왕절개 분만 및 아동 생애 발달 조기 치료.",
         badge: "가족 전체의 평안"
      },
      {
         title: "BPJS 국가 의료보험 수용",
         tagline: "재정적 부담 없이 모든 시민에게 정밀 주치의 혜택을 제공합니다.",
         badge: "가장 신뢰받는 동반자"
      }
    ]
  },
  ZH: {
    badge: '🍃 森林治愈系绿色地标医院',
    headlinePrefix: '全家人的健康',
    headlineHighlight: '最舒心的环境',
    headlineSuffix: '始于',
    desc: '自 1986 年落成以来，巴纽旺伊雅斯敏综合医院始终秉承“让医学融入绿色自然”的发展宗旨，全面兼顾患者的身体康复与心灵舒压，致力于建设温馨的家庭友好医疗模式。',
    btnBook: '网络预约挂号',
    btnDoc: '寻找专科大夫',
    btnWa: '商保专线微信/WhatsApp',
    quickAccessTitle: '快捷医疗服务',
    cardDocTitle: '寻找医生',
    cardDocSub: '专家门诊时间表',
    cardRegTitle: '在线挂号',
    cardRegSub: '免排队绿色通道',
    cardBpjsTitle: '医保信息',
    cardBpjsSub: '印尼国家医保服务',
    cardInpatientTitle: '温馨住院',
    cardInpatientSub: '高标准静养客房',
    cardIgdTitle: '24小时急诊',
    cardIgdSub: '全天候紧急救援',
    cardLocTitle: '医院地址',
    cardLocSub: '导航路线指引',
    accred: '最高荣誉特等评级',
    accredSub: 'KARS 三甲评审大奖',
    bpjs: '国家医保与商业保险定点',
    bpjsSub: '无差别就医体验',
    history: '40 多载初心未改',
    historySub: '深耕并回馈东爪哇社会',
    slides: [
      {
        title: "全新智能绿色医疗大楼",
        tagline: "完美融入热带花木氧吧中打造的全新生态临床病区。",
        badge: "无尚舒适体验"
      },
      {
        title: "富有人文温度的博爱治疗",
        tagline: "资深医生与护理团队 24 小时贴心值守。",
        badge: "坦诚与高度温情"
      },
      {
        title: "妇产儿科特色示范门诊",
        tagline: "引进先进 ERACS 分娩技术与儿童康养生长评估体系。",
        badge: "极致妇幼呵护"
      },
      {
        title: "国家统筹医保 BPJS 全对接",
        tagline: "让平民百姓无忧享受同等高规格的多专科医生问诊。",
        badge: "金牌合作单位"
      }
    ]
  },
  AR: {
    badge: '🍃 مستشفى الشفا الأخضر الطبي',
    headlinePrefix: 'صحة عائلتكم تبدأ',
    headlineHighlight: 'بالراحة النفسية',
    headlineSuffix: 'من الشعور',
    desc: 'منذ عام ١٩٨٦، يبسط مستشفى ياسمين بانيوانجي خدماته الطبية المحترفة في بيئة عائلية مفعمة بالدفء والألفة. نؤمن بشدة بأن سلامة العقل وطمأنينة الروح عنصران أساسيان يمهدان طريق الشفاء.',
    btnBook: 'حجز المواعيد عبر الإنترنت',
    btnDoc: 'ابحث عن طبيب متخصص',
    btnWa: 'مراسلتنا فوراً عبر الواتساب',
    quickAccessTitle: 'الخدمات السريعة',
    cardDocTitle: 'البحث عن طبيب',
    cardDocSub: 'مواعيد الأطباء',
    cardRegTitle: 'الحجز الإلكتروني',
    cardRegSub: 'دون انتظار',
    cardBpjsTitle: 'معلومات BPJS',
    cardBpjsSub: 'تغطية الضمان الصحي',
    cardInpatientTitle: 'الإقامة الطبية',
    cardInpatientSub: 'غرف مريحة وهادئة',
    cardIgdTitle: 'طوارئ ٢٤ ساعة',
    cardIgdSub: 'جاهزية تامة',
    cardLocTitle: 'موقع المستشفى',
    cardLocSub: 'تعليمات الوصول',
    accred: 'الاعتماد من الدرجة الأولى',
    accredSub: 'KARS اعتماد جودة الخدمات',
    bpjs: 'تأمين BPJS والشركات والخاص',
    bpjsSub: 'رعاية مفتوحة للجميع',
    history: 'أكثر من ٤٠ عاماً',
    historySub: 'من الرعاية المخلصة لبانيوانجي',
    slides: [
      {
        title: "مبنى مستشفى ياسمين الجديد",
        tagline: "تكامل للمرفق الطبي الحديث المحاط بحديقة طبيعية استشفائية رائعة.",
        badge: "أقصى درجات الراحة"
      },
      {
         title: "رعاية مبنية على التعاطف والرحمة",
         tagline: "الأطباء وطواقم الممرضين في جاهزية تامة على مدار الساعة لرعايتكم.",
         badge: "احتراف وإنسانية"
      },
      {
         title: "المركز المتخصص للأمومة والطفل",
         tagline: "خدمة الولادة ERACS وتتبع نمو وسلامة طفلك الغالي بالكامل.",
         badge: "سلامة شاملة للأسرة"
      },
      {
         title: "العيادات التخصصية الشاملة وتأمين BPJS",
         tagline: "نقدم الرعاية والمحبة لكافة المواطنين بشفافية كاملة دون استثناءات.",
         badge: "شركاء الصحة المعتمدين"
      }
    ]
  }
};

interface HeroSectionProps {
  onNavClick: (tab: ActiveTabType) => void;
  onOpenBookingWizard: () => void;
  onScrollToSection: (sectionId: string) => void;
  onSelectHealthCenter: (id: string) => void;
}

export default function HeroSection({
  onNavClick,
  onOpenBookingWizard,
  onScrollToSection,
  onSelectHealthCenter
}: HeroSectionProps) {

  const lang = useLanguage();
  const t = TRANSLATIONS[lang];

  const heroSlides = HEALTH_CENTERS.map((hc) => {
    const translation = HEALTH_CENTERS_TRANSLATIONS[hc.id]?.[lang];
    return {
      id: hc.id,
      image: hc.image,
      title: translation?.title || hc.title,
      tagline: translation?.shortDesc || hc.shortDesc,
      badge: translation?.category || hc.category
    };
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Handle Quick Access click routes
  const handleQuickAccess = (type: string) => {
    if (type === 'cari-dokter') {
      onNavClick('DOKTER');
    } else if (type === 'daftar-online') {
      onOpenBookingWizard();
    } else if (type === 'bpjs') {
      onSelectHealthCenter('hc-11'); // BPJS card ID
    } else if (type === 'rawat-inap') {
      onSelectHealthCenter('hc-9'); // Rawat Inap card ID
    } else if (type === 'igd') {
      onSelectHealthCenter('hc-10'); // IGD card ID
    } else if (type === 'lokasi') {
      onScrollToSection('main-footer');
    } else if (type === 'yasmin-kids') {
      onNavClick('YASMIN_KIDS');
    }
  };

  return (
    <section id="hero-section" className="relative pt-16 lg:pt-20 pb-16 overflow-hidden">
      {/* Decorative leafy visual shapes in background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-soft-mint rounded-full filter blur-3xl opacity-60 -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-warm-orange/10 rounded-full filter blur-3xl opacity-40 -z-10 pointer-events-none" />

      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left" id="hero-text-block">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-soft-mint px-4 py-2 rounded-full border border-divider text-deep-teal font-display text-xs font-semibold uppercase tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-yasmin-green animate-ping" />
                <span>{t.badge}</span>
              </div>

              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.35rem] xl:text-[2.75rem] text-[#0B4F4A] leading-[1.15] tracking-tight">
                  {t.headlinePrefix} <br />
                  {t.headlineSuffix} <span className="text-warm-orange">{t.headlineHighlight}</span>
                </h1>

                <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed w-full max-w-2xl text-justify mt-2.5">
                  {t.desc}
                </p>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8 pt-6 lg:pt-4">
              {/* CTAs */}
              <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 pt-2 w-full max-w-full justify-start">
                <button
                  onClick={onOpenBookingWizard}
                  className="bg-warm-orange text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-full font-bold shadow-lg shadow-warm-orange/30 hover:scale-105 transition-transform font-display text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                >
                  {t.btnBook}
                </button>
                
                <button
                  onClick={() => onNavClick('DOKTER')}
                  className="border-2 border-yasmin-green text-yasmin-green px-5 sm:px-8 py-2 sm:py-3.5 rounded-full font-bold hover:bg-yasmin-green hover:text-white transition-all font-display text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{t.btnDoc}</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Micro accreditation trust tags */}
              <div className="pt-6 border-t border-divider grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div>
                  <p className="font-display font-bold text-headings text-lg sm:text-xl leading-none">{t.accred}</p>
                  <p className="text-[11.5px] sm:text-[13px] font-normal text-gray-500 uppercase tracking-wide mt-1.5">{t.accredSub}</p>
                </div>
                <div>
                  <p className="font-display font-bold text-headings text-lg sm:text-xl leading-none">{t.bpjs}</p>
                  <p className="text-[11.5px] sm:text-[13px] font-normal text-gray-500 uppercase tracking-wide mt-1.5">{t.bpjsSub}</p>
                </div>
                <div>
                  <p className="font-display font-bold text-headings text-lg sm:text-xl leading-none">
                    {new Date().getFullYear() - 1986}+ {lang === 'ID' ? 'TAHUN' : 'YEARS'}
                  </p>
                  <p className="text-[11.5px] sm:text-[13px] font-normal text-gray-500 uppercase tracking-wide mt-1.5">{t.historySub}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Lifestyle Sliding Carousel Image */}
          <div className="lg:col-span-7 relative flex justify-end" id="hero-image-block">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-divider aspect-[1.4/1] group bg-slate-100 w-full lg:w-full ml-auto mr-0">
              
               {/* Slides */}
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  onClick={() => onSelectHealthCenter(slide.id)}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer hover:brightness-105 ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  title={lang === 'ID' ? `Klik untuk detail ${slide.title}` : `Click for ${slide.title} details`}
                >
                  <SafeImage
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transform scale-101 animate-scale-up"
                  />
                  {/* Left-side color filter (brand teal gradient) to ensure text on the left remains perfectly readable */}
                  <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0B4F4A]/55 via-[#0B4F4A]/20 to-transparent z-1" />
                  {/* System color tint filter and dark layers to keep overlays/text heavily readable */}
                  <div className="absolute inset-0 bg-[#0B4F4A]/20 mix-blend-multiply z-1" />
                  <div className="absolute inset-0 bg-black/10 z-1" />
                  {/* Dark gradient overlay for typography safety */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-24 pb-8 px-6 text-white text-left z-2" />
                </div>
              ))}

              {/* Slider Manual Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-headings shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-headings shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
                title="Slide Selanjutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Active Slide Indicators / Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full max-w-[85%]">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentSlide ? 'bg-warm-orange w-3.5' : 'bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>

              {/* Overlaid Cozy Context Banner (Updates information dynamically matching slide) */}
              <div 
                onClick={() => onSelectHealthCenter(heroSlides[currentSlide].id)}
                className="absolute bottom-5 sm:bottom-8 left-4 right-4 z-20 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 hover:to-transparent backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-lg flex items-center space-x-3.5 transition-all duration-300 transform translate-y-0 hover:translate-y-[-2px] cursor-pointer"
                style={{ 
                  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                  WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)'
                }}
                title={lang === 'ID' ? `Klik untuk detail ${heroSlides[currentSlide].title}` : `Click for ${heroSlides[currentSlide].title} details`}
              >
                <div className="bg-warm-orange p-2.5 rounded-xl text-white shrink-0">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="inline-block bg-soft-mint px-3 py-0.5 text-deep-teal font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-md mb-1.5">
                    {heroSlides[currentSlide].badge}
                  </span>
                  <p className="font-display font-black text-sm sm:text-base md:text-lg text-white leading-tight">
                    {heroSlides[currentSlide].title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans mt-0.5 sm:mt-1">
                    {heroSlides[currentSlide].tagline}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* QUICK ACCESS: 6 Large Interactive Cards */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <h3 className="font-display font-black text-base sm:text-lg tracking-widest text-[#0B4F4A] uppercase">{t.quickAccessTitle}</h3>
            <div className="w-16 h-1 bg-warm-orange mx-auto mt-2 rounded" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Cari Dokter */}
            <div
              onClick={() => handleQuickAccess('cari-dokter')}
              className="bg-[#F2F7F5] p-5 rounded-xl border border-divider/65 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-soft-mint text-yasmin-green rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-headings text-sm sm:text-base">{t.cardDocTitle}</h4>
              <p className="text-[11px] sm:text-[12.5px] font-normal mt-1.5 text-emerald-850 leading-normal">{t.cardDocSub}</p>
            </div>

            {/* 2. Daftar Online */}
            <div
              onClick={() => handleQuickAccess('daftar-online')}
              className="bg-[#F2F7F5] p-5 rounded-xl border border-divider/65 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-warm-ivory text-warm-orange rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-headings text-sm sm:text-base">{t.cardRegTitle}</h4>
              <p className="text-[11px] sm:text-[12.5px] font-normal mt-1.5 text-amber-800 leading-normal">{t.cardRegSub}</p>
            </div>

            {/* 3. Informasi BPJS */}
            <div
              onClick={() => handleQuickAccess('bpjs')}
              className="bg-[#F2F7F5] p-5 rounded-xl border border-divider/65 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-soft-mint text-yasmin-green rounded-xl flex items-center justify-center mb-4 mx-auto">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-headings text-sm sm:text-base">{t.cardBpjsTitle}</h4>
              <p className="text-[11px] sm:text-[12.5px] font-normal mt-1.5 text-emerald-850 leading-normal">{t.cardBpjsSub}</p>
            </div>

            {/* 4. Rawat Inap */}
            <div
              onClick={() => handleQuickAccess('rawat-inap')}
              className="bg-[#F2F7F5] p-5 rounded-xl border border-divider/65 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-soft-mint text-yasmin-green rounded-xl flex items-center justify-center mb-4 mx-auto">
                <BedDouble className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-headings text-sm sm:text-base">{t.cardInpatientTitle}</h4>
              <p className="text-[11px] sm:text-[12.5px] font-normal mt-1.5 text-emerald-850 leading-normal">{t.cardInpatientSub}</p>
            </div>

            {/* 5. IGD 24 Jam */}
            <div
              onClick={() => handleQuickAccess('igd')}
              className="bg-[#F2F7F5] p-5 rounded-xl border border-divider/65 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-red-50 text-emergency rounded-xl flex items-center justify-center mb-4 mx-auto">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-headings text-sm sm:text-base">{t.cardIgdTitle}</h4>
              <p className="text-[11px] sm:text-[12.5px] font-normal mt-1.5 text-red-800 leading-normal">{t.cardIgdSub}</p>
            </div>

            {/* 6. Lokasi RS */}
            <div
              onClick={() => handleQuickAccess('lokasi')}
              className="bg-[#F2F7F5] p-5 rounded-xl border border-divider/65 hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.40)] hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-soft-mint text-yasmin-green rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-headings text-sm sm:text-base">{t.cardLocTitle}</h4>
              <p className="text-[11px] sm:text-[12.5px] font-normal mt-1.5 text-emerald-850 leading-normal">{t.cardLocSub}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
