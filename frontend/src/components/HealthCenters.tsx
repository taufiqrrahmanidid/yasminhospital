import React, { useState, useEffect } from 'react';
import {
  Baby, Sparkles, HeartHandshake, Activity, Palmtree, Smile,
  Home, Accessibility, BedDouble, ShieldAlert, CheckCircle, CreditCard,
  Phone, Check, Calendar, ArrowRight, CornerDownRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { HEALTH_CENTERS } from '../data';
import { HealthCenter } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { SafeImage } from '../utils/imageUrl';

import { hc1_3 } from './HealthCenterTranslations/hc1_3';
import { hc4_6 } from './HealthCenterTranslations/hc4_6';
import { hc7_9 } from './HealthCenterTranslations/hc7_9';
import { hc10_14 } from './HealthCenterTranslations/hc10_14';

export const HEALTH_CENTERS_TRANSLATIONS: Record<string, Record<string, any>> = {
  ...hc1_3,
  ...hc4_6,
  ...hc7_9,
  ...hc10_14
};

const formatDescription = (text: string, id: string) => {
  if (!text) return null;

  const isJustified = true;

  // Split by single newlines to process line-by-line
  const lines = text.split(/\r?\n/);

  // Parse inline markdown *italics*
  const parseInlineItalics = (str: string): React.ReactNode => {
    const parts = str.split('*');
    if (parts.length > 1) {
      return parts.map((part, idx) => {
        if (idx % 2 !== 0) {
          return <em key={idx} className="italic font-medium">{part}</em>;
        }
        return part;
      });
    }
    return str;
  };

  // Parse inline markdown **bold** and *italics*
  const parseInlineMarkdown = (str: string): React.ReactNode => {
    const boldParts = str.split('**');
    if (boldParts.length > 1) {
      return boldParts.map((bPart, bIdx) => {
        if (bIdx % 2 !== 0) {
          // Inside a bold block: parse italics as well
          const parsedItalic = parseInlineItalics(bPart);
          return (
            <strong key={bIdx} className="font-bold text-headings">
              {parsedItalic}
            </strong>
          );
        }
        return <React.Fragment key={bIdx}>{parseInlineItalics(bPart)}</React.Fragment>;
      });
    }
    return parseInlineItalics(str);
  };

  return (
    <div className="flex flex-col">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '') {
          // Render a small spacing for blank lines
          return <div key={idx} className="h-3 sm:h-4" />;
        }

        // 1. Heading Check
        if (trimmed.startsWith('#')) {
          const depth = (trimmed.match(/^#+/) || ['#'])[0].length;
          const headingText = trimmed.replace(/^#+\s*/, '');
          const sizeClass = depth === 1 ? 'text-2xl sm:text-3xl' :
                            depth === 2 ? 'text-xl sm:text-2xl' :
                            depth === 3 ? 'text-lg sm:text-xl' :
                            depth === 4 ? 'text-md sm:text-base font-bold' : 'text-base sm:text-lg';
          return (
            <h4
              key={idx}
              className={`font-display font-extrabold text-yasmin-green ${sizeClass} pt-4 pb-1 block text-left`}
            >
              {parseInlineMarkdown(headingText)}
            </h4>
          );
        }

        // 2. List Item / Bullet Check
        // Checks if it starts with common bullets (•, -, *, 1., 2.) or medical/religious/lifestyle emojis
        const isListItem =
          trimmed.startsWith('•') ||
          trimmed.startsWith('-') ||
          (trimmed.startsWith('*') && !trimmed.startsWith('**')) ||
          /^\d+\.\s+/.test(trimmed) ||
          trimmed.startsWith('✅') ||
          trimmed.startsWith('👩') ||
          trimmed.startsWith('🍼') ||
          trimmed.startsWith('🤱') ||
          trimmed.startsWith('❤️') ||
          trimmed.startsWith('🏠') ||
          trimmed.startsWith('👨‍⚕️') ||
          trimmed.startsWith('👨⚕️') || // support emoji without joiner too
          trimmed.startsWith('⚓') ||
          trimmed.startsWith('🛡️') ||
          trimmed.startsWith('🫁') ||
          trimmed.startsWith('🧠') ||
          trimmed.startsWith('🦴') ||
          trimmed.startsWith('👥') ||
          trimmed.startsWith('🌱') ||
          trimmed.startsWith('💰') ||
          trimmed.startsWith('🩺') ||
          trimmed.startsWith('😊') ||
          trimmed.startsWith('🚭') ||
          trimmed.startsWith('✔') ||
          trimmed.startsWith('😔') ||
          trimmed.startsWith('😟') ||
          trimmed.startsWith('😰') ||
          trimmed.startsWith('📚') ||
          trimmed.startsWith('💔') ||
          trimmed.startsWith('🤝') ||
          trimmed.startsWith('💳') ||
          trimmed.startsWith('📄') ||
          trimmed.startsWith('👨💼') ||
          trimmed.startsWith('🌟') ||
          trimmed.startsWith('🌐') ||
          trimmed.startsWith('📱') ||
          trimmed.startsWith('😴') ||
          trimmed.startsWith('🎯') ||
          trimmed.startsWith('🔒') ||
          trimmed.startsWith('👶') ||
          trimmed.startsWith('💚') ||
          trimmed.startsWith('🕋') ||
          trimmed.startsWith('💑') ||
          trimmed.startsWith('🔬') ||
          trimmed.startsWith('👪') ||
          trimmed.startsWith('✈') ||
          trimmed.startsWith('🧪') ||
          trimmed.startsWith('🌿') ||
          trimmed.startsWith('⚡') ||
          trimmed.startsWith('💨') ||
          trimmed.startsWith('🔔') ||
          trimmed.startsWith('✨') ||
          trimmed.startsWith('🚗') ||
          trimmed.startsWith('🦠') ||
          trimmed.startsWith('⭐') ||
          trimmed.startsWith('%') ||
          trimmed.startsWith('🏥') ||
          trimmed.startsWith('🛏️') ||
          trimmed.startsWith('⚕️') ||
          trimmed.startsWith('🏃') ||
          trimmed.startsWith('🤰') ||
          trimmed.startsWith('🎓') ||
          trimmed.startsWith('🛡️') ||
          trimmed.startsWith('🍏') ||
          trimmed.startsWith('🥦') ||
          trimmed.startsWith('💉') ||
          trimmed.startsWith('🧘') ||
          trimmed.startsWith('📺') ||
          trimmed.startsWith('🎠') ||
          trimmed.startsWith('🧸') ||
          trimmed.startsWith('🚑') ||
          trimmed.startsWith('🕐') ||
          trimmed.startsWith('💊') ||
          trimmed.startsWith('🛌') ||
          trimmed.startsWith('💓') ||
          trimmed.startsWith('🚨') ||
          trimmed.startsWith('🩻');

        if (isListItem) {
          let bullet = '•';
          let cleanText = trimmed;

          if (trimmed.startsWith('•')) {
            bullet = '•';
            cleanText = trimmed.substring(1).trim();
          } else if (trimmed.startsWith('- ')) {
            bullet = '•';
            cleanText = trimmed.substring(2).trim();
          } else if (trimmed.startsWith('-')) {
            bullet = '•';
            cleanText = trimmed.substring(1).trim();
          } else if (trimmed.startsWith('* ')) {
            bullet = '•';
            cleanText = trimmed.substring(2).trim();
          } else if (trimmed.startsWith('*')) {
            bullet = '•';
            cleanText = trimmed.substring(1).trim();
          } else if (/^\d+\.\s+/.test(trimmed)) {
            const numMatch = trimmed.match(/^(\d+\.)\s+/);
            bullet = numMatch ? numMatch[1] : '•';
            cleanText = trimmed.replace(/^(\d+\.)\s+/, '');
          } else {
            const emojis = ['✅', '🍼', '🤱', '❤️', '🏠', '👨‍⚕️', '👨⚕️', '⚓', '🛡️', '🫁', '🧠', '🦴', '👥', '🌱', '💰', '🩺', '😊', '🚭', '✔', '😔', '😟', '😰', '📚', '💔', '🤝', '💳', '📄', '👨💼', '🌟', '🌐', '📱', '😴', '🎯', '🔒', '👶', '💚', '🕋', '💑', '🔬', '👪', '✈', '🧪', '🌿', '⚡', '💨', '🔔', '✨', '🚗', '🦠', '⭐', '🚑', '🕐', '💊', '🛌', '💓', '🚨', '🏥', '🛏️', '⚕️', '🏃', '🤰', '🎓', '🛡️', '🍏', '🥦', '💉', '🧘', '📺', '🎠', '🧸', '🩻'];
            let matchedEmoji = '';
            for (const e of emojis) {
              if (trimmed.startsWith(e)) {
                matchedEmoji = e;
                break;
              }
            }
            if (matchedEmoji) {
              bullet = matchedEmoji;
              cleanText = trimmed.substring(matchedEmoji.length).trim();
            }
          }

          return (
            <div key={idx} className="flex items-start gap-2.5 py-0.5 text-left w-full">
              <span className="text-yasmin-green font-bold shrink-0 select-none mt-1 text-xs sm:text-sm md:text-base">{bullet}</span>
              <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-sans flex-1 text-left">
                {parseInlineMarkdown(cleanText)}
              </p>
            </div>
          );
        }

        const textAlignment = isJustified ? 'text-justify' : 'text-left';

        return (
          <p
            key={idx}
            className={`text-sm sm:text-base text-gray-650 leading-relaxed font-sans block py-1 ${textAlignment}`}
            style={{ textAlign: 'justify', textJustify: 'inter-word' }}
          >
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

interface HealthCentersProps {
  onOpenBookingWizard: (doctorIdOrServiceType?: string) => void;
  selectedHealthCenterId?: string | null;
  onClearSelectedHealthCenter?: () => void;
}

export default function HealthCenters({
  onOpenBookingWizard,
  selectedHealthCenterId,
  onClearSelectedHealthCenter
}: HealthCentersProps) {
  const lang = useLanguage();
  const isEn = lang === 'EN';
  const isKr = lang === 'KR';
  const isZh = lang === 'ZH';
  const isAr = lang === 'AR';

  const [activeCenterId, setActiveCenterId] = useState<string>('hc-2');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Listen to outer selection (from home page quick access or footer links)
  useEffect(() => {
    if (selectedHealthCenterId) {
      setActiveCenterId(selectedHealthCenterId);
      // Scroll to component container
      const element = document.getElementById('health-centers-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (onClearSelectedHealthCenter) {
        onClearSelectedHealthCenter();
      }
    }
  }, [selectedHealthCenterId, onClearSelectedHealthCenter]);

  // Expand sidebar automatically if a selection is made from outside
  useEffect(() => {
    if (selectedHealthCenterId) {
      setIsSidebarCollapsed(false);
    }
  }, [selectedHealthCenterId]);

  const rawActiveCenter = HEALTH_CENTERS.find((hc) => hc.id === activeCenterId) || HEALTH_CENTERS[0];

  const getTranslatedCenter = (hc: HealthCenter): HealthCenter => {
    const translation = HEALTH_CENTERS_TRANSLATIONS[hc.id]?.[lang];
    if (translation) {
      return {
        ...hc,
        title: translation.title || hc.title,
        category: translation.category || hc.category,
        shortDesc: translation.shortDesc || hc.shortDesc,
        longDesc: translation.longDesc || hc.longDesc,
        benefits: translation.benefits || hc.benefits,
        features: translation.features || hc.features,
        targetAudience: translation.targetAudience || hc.targetAudience
      };
    }
    // Fallback translations if exact lookup missing or defaulting to IDN
    return {
      ...hc,
      category: hc.category === 'Unggulan' ? (isEn ? 'Featured' : isKr ? '시그니처' : isZh ? '特色专科' : isAr ? 'مميز' : hc.category) :
                hc.category === 'Spesialisasi' ? (isEn ? 'Specialist' : isKr ? '전문에학' : isZh ? '专家门诊' : isAr ? 'تخصصي' : hc.category) :
                hc.category === 'Wellness' ? (isEn ? 'Wellness' : isKr ? '웰빙케어' : isZh ? '乐享健康' : isAr ? 'عافية' : hc.category) :
                hc.category === 'Fasilitas' ? (isEn ? 'Facilities' : isKr ? '특화시설' : isZh ? '贴心设施' : isAr ? 'مرفق' : hc.category) : hc.category
    };
  };

  const activeCenter = getTranslatedCenter(rawActiveCenter);

  // Helper to map string to Lucide icon dynamically
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return <Baby className="h-5 w-5" />;
      case 'Sparkles': return <Sparkles className="h-5 w-5" />;
      case 'HeartHandshake': return <HeartHandshake className="h-5 w-5" />;
      case 'Activity': return <Activity className="h-5 w-5" />;
      case 'Palmtree': return <Palmtree className="h-5 w-5" />;
      case 'Smile': return <Smile className="h-5 w-5" />;
      case 'Home': return <Home className="h-5 w-5" />;
      case 'Accessibility': return <Accessibility className="h-5 w-5" />;
      case 'BedDouble': return <BedDouble className="h-5 w-5" />;
      case 'ShieldAlert': return <ShieldAlert className="h-5 w-5" />;
      case 'CheckCircle': return <CheckCircle className="h-5 w-5" />;
      case 'CreditCard': return <CreditCard className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  // Generate WhatsApp text for current medical center
  const getWhatsAppLink = (centerTitle: string) => {
    const text = encodeURIComponent(
      isEn 
        ? `Hello RS Yasmin Banyuwangi, I would like to inquire for details regarding the service: *${centerTitle}*. Thank you.` 
        : isKr 
        ? `안녕하세요 야스민 병원님, 다음 전문 센터 서비스에 대한 상세 정보를 문의하고 싶습니다: *${centerTitle}*. 감사합니다.`
        : isZh 
        ? `您好，我想向巴纽旺伊雅斯敏医院咨询以下项目的详细方案：*${centerTitle}*。谢谢。` 
        : isAr 
        ? `مرحباً مستشفى ياسمين بانيوانجي، أود الاستفسار عن تفاصيل الخدمة: *${centerTitle}*. شكراً لك.` 
        : `Halo RS Yasmin Banyuwangi, saya ingin menanyakan lebih banyak informasi detail mengenai layanan: *${centerTitle}*. Terima kasih.`
    );
    return `https://wa.me/6285259353001?text=${text}`;
  };

  return (
    <section id="health-centers-container" className="py-16 bg-soft-mint">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="w-full text-center mb-12">
          <span className="font-display text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-white border border-divider px-3.5 py-1.5 rounded-full">
            {isEn ? "SPECIALIST DEPARTMENTS & THERAPY" : isKr ? "전화된 특화 의료 서비스" : isZh ? "本院核心特色医学诊疗中心" : isAr ? "الأقسام التخصصية والعلاجية" : "LAYANAN SPESIALISASI & TERAPI"}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-headings mt-4">
            {isEn ? "Explore Our Wellness Centers" : isKr ? "원내 전문 보건 의학 센터 둘러보기" : isZh ? "探索我院多维医学专科" : isAr ? "استكشف مراكزنا الطبية المتكاملة" : "Eksplorasi Pusat Kesehatan Kami"}
          </h2>
          <p className="text-gray-500 font-sans text-sm mt-2">
            {isEn 
              ? "From Eracs childbirth methods, lactation advisory, and dental wellness, to elderly diagnostics and corporate partnership coverage." 
              : isKr 
              ? "ERACS 제왕절개 분만, 가임력 진단에서부터 시니어 예방 검진과 기업 연합 맞춤 의료 서비스 협약까지." 
              : isZh 
              ? "从对产妇友好的 ERACS 极速无痛剖宫产到母乳指导、商业寿险直付以及老年预防康养保障。" 
              : isAr 
              ? "من الولادة القيصرية بتقنية ERACS المريحة، واستشارات الرضاعة، والتأمينات، إلى الرعاية الصحية لكبار السن." 
              : "Dari pelayanan ibu melahirkan ramah ERACS hingga bimbingan laktasi, asuransi, dan pemeliharaan kesehatan lansia preventif."}
          </p>
        </div>

        {/* Dynamic Category Layout Split */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left: Interactive list of 12 Health Centers */}
          <div 
            className={`bg-white rounded-3xl border border-divider shadow-xs p-4 transition-all duration-300 self-stretch ${
              isSidebarCollapsed 
                ? 'w-full lg:w-20 flex flex-col items-center justify-between py-6 shrink-0' 
                : 'w-full lg:w-fit lg:min-w-[240px] shrink-0'
            }`}
          >
            <div className="w-full space-y-3">
              {/* Sidebar Header with Collapse Trigger */}
              <div className="flex items-center justify-between px-2 pb-3 border-b border-divider">
                {!isSidebarCollapsed && (
                  <p className="text-[12px] sm:text-[14px] font-black tracking-wide text-deep-teal flex items-center gap-2 uppercase">
                    <Activity className="h-4.5 w-4.5 text-[#0B4F4A] fill-current animate-pulse shrink-0" />
                    <span>{isEn ? "HEALTH CENTERS LIST" : isKr ? "전문 보건 센터 대표 목록" : isZh ? "专科医学中心名单" : isAr ? "قائمة المراكز الطبية" : "DAFTAR PUSAT KESEHATAN"}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 hover:bg-soft-mint rounded-lg text-deep-teal transition-all hidden lg:block cursor-pointer outline-none"
                  title={isSidebarCollapsed ? "Tampilkan Daftar Menu" : "Sembunyikan Daftar Menu (Auto-hide)"}
                >
                  {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="space-y-0.5 max-h-[750px] overflow-y-auto pr-1">
                {HEALTH_CENTERS.map((hc) => {
                  const isSelected = activeCenterId === hc.id;
                  const item = getTranslatedCenter(hc);
                  const isMedRehab = hc.id === 'hc-8';
                  return (
                    <React.Fragment key={hc.id}>
                      {isMedRehab && (
                        <div className="border-t border-divider/65 my-2.5 mx-3" />
                      )}
                      <button
                        onClick={() => setActiveCenterId(hc.id)}
                        className={`w-full flex items-center justify-between rounded-xl transition-all duration-200 text-left outline-none cursor-pointer group ${
                          isSidebarCollapsed ? 'px-1 py-1 justify-center' : 'px-3 py-1.5'
                        } ${
                          isSelected
                            ? 'bg-deep-teal text-white font-bold shadow-xs'
                            : 'text-gray-650 hover:text-deep-teal hover:bg-soft-mint/50 font-normal'
                        }`}
                        title={item.title}
                      >
                        <div className="flex items-center space-x-3 max-w-full">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-soft-mint text-deep-teal'}`}>
                            {renderIcon(hc.iconName)}
                          </div>
                          {!isSidebarCollapsed && (
                            <span className={`font-display text-sm sm:text-base tracking-wide leading-snug whitespace-nowrap pr-3 ${
                              isSelected ? 'font-bold' : 'font-normal group-hover:font-bold'
                            }`}>
                              {item.title}
                            </span>
                          )}
                        </div>
                        {!isSidebarCollapsed && isSelected && (
                          <Check className="h-3 w-3 text-warm-orange shrink-0 ml-1" />
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Hint shown when sidebar is autohidden */}
            {isSidebarCollapsed && (
              <p className="hidden lg:block text-[8px] text-gray-400 font-mono font-bold tracking-wider pt-4 text-center select-none uppercase">
                Menu
              </p>
            )}
          </div>

          {/* Right: Dynamic details output card panel */}
          <div className="flex-1 bg-white rounded-3xl border border-divider shadow-md overflow-hidden text-left" id="center-details-output">
            
            {/* Visual Aspect Banner */}
            <div className="relative aspect-video bg-soft-mint overflow-hidden flex items-center justify-center">
              <SafeImage
                src={activeCenter.image}
                alt={activeCenter.title}
                className="w-full h-full object-fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 bg-warm-orange text-headings text-[10px] font-bold tracking-widest uppercase rounded-full font-sans">
                    {isEn ? `Category: ${activeCenter.category}` : isKr ? `분류: ${activeCenter.category}` : isZh ? `主要大类: ${activeCenter.category}` : isAr ? `الفئة: ${activeCenter.category}` : `Kategori: ${activeCenter.category}`}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl mt-2 tracking-tight drop-shadow-sm">
                    {activeCenter.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Comprehensive Detail Copy */}
            <div className="p-8 space-y-6">
              
              <div className="space-y-2">
                <p className="font-sans font-semibold text-sm sm:text-base text-headings leading-normal text-justify">
                  {activeCenter.shortDesc}
                </p>
                <div className="text-sm sm:text-base text-gray-650 leading-relaxed font-sans">
                  {formatDescription(activeCenter.longDesc, activeCenter.id)}
                </div>
              </div>

              {/* Benefits Bullets Header */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-xs tracking-wider text-deep-teal uppercase border-b border-divider pb-2 flex items-center space-x-1.5 font-sans">
                  <CornerDownRight className="h-4 w-4 text-warm-orange" />
                  <span>
                    {isEn ? "Core Treatment Benefits & Amenities:" : isKr ? "제공 혜택 및 안심 편의 시설:" : isZh ? "专科服务优势与保障设施：" : isAr ? "مزايا ومرافق الخدمة التنافسية:" : "Keuntungan Pelayanan & Fasilitas Kami:"}
                  </span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-600 font-sans">
                  {activeCenter.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-2.5">
                      <div className="p-0.5 bg-yasmin-green/10 text-yasmin-green rounded mt-0.5 shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <p className="leading-tight">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Features list if existing */}
              {activeCenter.features && (
                <div className="bg-soft-mint/60 p-4 rounded-xl border border-divider text-xs text-gray-600 space-y-2 font-sans">
                  <p className="font-bold text-headings text-[11px] uppercase tracking-wide">
                    {isEn ? "Additional Amenities" : isKr ? "추가 원내 편의 인프라" : isZh ? "附加高定适足人文设施" : isAr ? "مرافق ووسائل راحة إضافية" : "Fasilitas Kenyamanan Tambahan"}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeCenter.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm-orange" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Targeted Audience if existing */}
              {activeCenter.targetAudience && (
                <div className="text-xs text-gray-500 font-sans">
                  <span className="font-semibold text-headings">
                    {isEn ? "Primary Target:" : isKr ? "주요 추천 대상:" : isZh ? "主要受众群体:" : isAr ? "الفئة المستهدفة:" : "Target Utama Pengguna:"}
                  </span> {activeCenter.targetAudience}
                </div>
              )}

              {/* Footer CTA Buttons specific to this medical service */}
              <div className="pt-6 border-t border-divider flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-400 font-sans italic">
                  {isEn 
                    ? `Need inpatient details or further consult for ${activeCenter.title}?` 
                    : isKr 
                    ? `${activeCenter.title} 센터에 관해 입원 상담이 필요하십니까?` 
                    : isZh 
                    ? `需要了解《${activeCenter.title}》的住院病房配置及看护细节？` 
                    : isAr 
                    ? `هل تحتاج إلى تفاصيل الإقامة أو حجز استشارة لـ ${activeCenter.title}؟` 
                    : `Butuh informasi rawat inap / konsultasi lanjut untuk layanan ${activeCenter.title}?`}
                </p>
                
                <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0 justify-end">
                  <a
                    href={getWhatsAppLink(activeCenter.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 bg-whatsapp hover:bg-emerald-600 font-semibold text-white text-xs rounded-xl transition-all shadow-xs cursor-pointer font-sans"
                  >
                    <Phone className="h-4 w-4" />
                    <span>
                      {isEn ? "WhatsApp Inquiry" : isKr ? "실시간 카카오톡/경로 문의" : isZh ? "WhatsApp 线上直连咨询" : isAr ? "استشارة واتساب فورية" : "Tanya Sapa WhatsApp"}
                    </span>
                  </a>

                  <button
                    onClick={() => onOpenBookingWizard(activeCenter.title)}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-deep-teal to-yasmin-green hover:from-yasmin-green hover:to-deep-teal text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer font-sans"
                  >
                    <Calendar className="h-4 w-4 text-warm-orange" />
                    <span>
                      {isEn ? "Online Registration" : isKr ? "온라인 신속 원외 접수" : isZh ? "门诊及住院挂号通道" : isAr ? "التسجيل الطبي الإلكتروني" : "Pendaftaran Online"}
                    </span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
