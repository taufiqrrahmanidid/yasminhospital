import React, { useState } from 'react';
import { 
  Award, Trees, Users, HeartHandshake, Sparkles, Building, History, 
  ChevronDown, CheckCircle2, ChevronRight, Phone, MapPin, Mail, 
  MessageSquare, ShieldCheck, Landmark, BadgeCheck, HelpCircle, PhoneCall,
  Compass, Target
} from 'lucide-react';
import TestimonialSection from './TestimonialSection';
import { useLanguage } from '../hooks/useLanguage';
import { ABOUT_TRANSLATIONS } from '../translations_about';
import WhatsAppIcon from './WhatsAppIcon';
import { SafeImage } from '../utils/imageUrl';

const rsyVisiMisiImg = '/assets/images/utama/rsysmivisimisi.jpg';
const logoBpjsKesehatan = '/assets/images/mitra/rsyasminbpjskesehatan.png';
const logoBpjsNaker = '/assets/images/mitra/rsyasminbpjsnaker.png';
const logoJasaRaharja = '/assets/images/mitra/rsyasminjasaraharja.png';
const logoAdmedika = '/assets/images/mitra/rsyasminadmedika.png';
const logoPrudential = '/assets/images/mitra/rsyasminprudential.png';
const logoAllianz = '/assets/images/mitra/rsyasminallianz.png';
const logoManulife = '/assets/images/mitra/rsyasminmanulife.png';
const logoFwd = '/assets/images/mitra/rsyasminfwd.png';
const logoBumiPutera = '/assets/images/mitra/rsyasminbumiputera.png';
const logoAa = '/assets/images/mitra/rsyasminaa.png';
const logoAp2 = '/assets/images/mitra/rsyasminangkasapura2.png';
const logoBri = '/assets/images/mitra/rsyasminbri.png';
const logoBankJatim = '/assets/images/mitra/rsyasminbankjatim.png';
const logoCar = '/assets/images/mitra/rsyasmincar.png';
const logoOwlexa = '/assets/images/mitra/rsyasminowlexa.png';
const logoNayaka = '/assets/images/mitra/rsyasminnayaka.png';
const logoSunLife = '/assets/images/mitra/rsyasminsunlife.png';

// Prestasi & Penghargaan Images
const pres01Img = '/assets/images/prestasi/PRES01-2008-PERSI AWARD-S.png';
const pres02Img = '/assets/images/prestasi/PRES02-2009-PERSI AWARD-S.png';
const pres03Img = '/assets/images/prestasi/PRES03-2010-ASIAN HOSPITAL-S.png';
const pres04Img = '/assets/images/prestasi/PRES04-2017-PARIPURNA-S.png';
const pres04SlideImg = '/assets/images/prestasi/PRES04-2017-PIAGAM PARIPURNA.png';

interface AboutSectionProps {
  hideTestimonials?: boolean;
}

export default function AboutSection({ hideTestimonials = false }: AboutSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const lang = useLanguage();
  const t = ABOUT_TRANSLATIONS[lang] || ABOUT_TRANSLATIONS.ID;

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    sambutan: false,
    visimisi: false,
    sejarah: false,
    prestasi: false,
    mitra: false,
    pillars: false,
    testimoni: false,
    faq: false,
  });

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const whyYasminPillars = [
    {
      icon: Trees,
      title: t.p1Title,
      color: 'bg-emerald-50 text-emerald-600',
      desc: t.p1Desc
    },
    {
      icon: Sparkles,
      title: t.p2Title,
      color: 'bg-teal-50 text-teal-600',
      desc: t.p2Desc
    },
    {
      icon: HeartHandshake,
      title: t.p3Title,
      color: 'bg-amber-50 text-amber-600',
      desc: t.p3Desc
    },
    {
      icon: Users,
      title: t.p4Title,
      color: 'bg-blue-50 text-blue-600',
      desc: t.p4Desc
    },
    {
      icon: Award,
      title: t.p5Title,
      color: 'bg-purple-50 text-purple-600',
      desc: t.p5Desc
    }
  ];

  const prestasiList = [
    {
      title: t.prestasiItem1Title || 'PIAGAM AKREDITASI PARIPURNA TAHUN 2022',
      desc: t.prestasiItem1Desc,
      year: '2022',
      meta: t.prestasiMeta1 || 'PIAGAM UTAMA',
      image: pres04SlideImg
    },
    {
      title: t.prestasiItem2Title || 'Akreditasi PARIPURNA 2022',
      desc: t.prestasiItem2Desc,
      year: '2022',
      meta: t.prestasiMeta2 || 'AKREDITASI KARS',
      image: pres04Img
    },
    {
      title: t.prestasiItem3Title || 'Asian Hospital Management Awards 2010',
      desc: t.prestasiItem3Desc,
      year: '2010',
      meta: t.prestasiMeta3 || 'AHMA ASIA',
      image: pres03Img
    },
    {
      title: t.prestasiItem4Title || 'PERSI AWARD 2009',
      desc: t.prestasiItem4Desc,
      year: '2009',
      meta: t.prestasiMeta4 || 'PERSI AWARD',
      image: pres02Img
    },
    {
      title: t.prestasiItem5Title || 'PERSI AWARD 2008',
      desc: t.prestasiItem5Desc,
      year: '2008',
      meta: t.prestasiMeta5 || 'PERSI AWARD',
      image: pres01Img
    }
  ];

  const partnerList = [
    { name: 'BPJS Kesehatan', type: lang === 'ID' ? 'Nasional' : 'National' },
    { name: 'BPJS Ketenagakerjaan (BPJS Naker)', type: lang === 'ID' ? 'Nasional' : 'National' },
    { name: 'Jasa Raharja', type: lang === 'ID' ? 'Nasional' : 'National' },
    { name: 'AdMedika', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Prudential', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Allianz', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Manulife', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'FWD Insurance', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Bumi Putera', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Asuransi Astra (AA)', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Angkasa Pura II (AP2)', type: lang === 'ID' ? 'Korporat' : 'Corporate' },
    { name: 'BRI', type: lang === 'ID' ? 'Korporat' : 'Corporate' },
    { name: 'Bank Jatim', type: lang === 'ID' ? 'Korporat' : 'Corporate' },
    { name: 'Asuransi CAR', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Owlexa Healthcare', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Nayaka Era Husada', type: lang === 'ID' ? 'Asuransi' : 'Insurance' },
    { name: 'Sun Life', type: lang === 'ID' ? 'Asuransi' : 'Insurance' }
  ];

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A },
    { q: t.faq6Q, a: t.faq6A },
    { q: t.faq7Q, a: t.faq7A }
  ];

  return (
    <section id="about-section" className="bg-soft-mint py-10 relative">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-br from-yasmin-green/5 to-transparent rounded-full -z-10" />

      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. SAMBUTAN DIREKTUR UTAMA */}
        <div id="sambutan-direktur" className="bg-white rounded-3xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left transition-all duration-300">
          <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <Building className="w-5 h-5 text-yasmin-green shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{t.sambutanBadge}</h3>
            </div>
            <button
              onClick={() => toggleSection('sambutan')}
              className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.sambutan ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.sambutan ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.sambutan && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center animate-fade-in-up">
              {/* Foto Direktur */}
              <div className="lg:col-span-5 max-w-[720px] mx-auto lg:mx-0 relative group w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-yasmin-green to-deep-teal rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[675px] shadow-md bg-soft-mint">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=700"
                    alt={`${t.direkturName} - ${t.direkturRole}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-display font-bold text-sm leading-tight">{t.direkturName}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-warm-orange/90 font-bold mt-1">{t.direkturRole}</p>
                  </div>
                </div>
              </div>

              {/* Konten Sambutan */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-soft-mint border border-divider rounded-full text-deep-teal font-display text-[9px] font-bold tracking-widest uppercase">
                  <span>{t.sambutanBadge}</span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-headings leading-tight">
                  {t.sambutanTitle}
                </h2>
                <div className="space-y-3.5 text-gray-700 font-sans text-sm sm:text-base leading-relaxed text-justify font-normal">
                  <p className="whitespace-pre-line">{t.sambutanP1}</p>
                  <p className="whitespace-pre-line">{t.sambutanP2}</p>
                  <p className="whitespace-pre-line">{t.sambutanP3}</p>
                  <p className="font-display font-black text-deep-teal tracking-wide text-xs">
                    #SehatBersamaYasmin
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. VISI & MISI RS YASMIN */}
        <div id="vision-mission-section" className="bg-white rounded-3xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -z-10" />
          
          <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <Target className="w-5 h-5 text-deep-teal shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{t.visiMisiTitle}</h3>
            </div>
            <button
              onClick={() => toggleSection('visimisi')}
              className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.visimisi ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.visimisi ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.visimisi && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch animate-fade-in-up">
              
              <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
                <div>
                  <span className="font-display text-[9px] text-deep-teal font-bold tracking-widest uppercase bg-soft-mint border border-divider px-3 py-1 rounded-full">
                    {t.haluanArah}
                  </span>
                  <h3 className="font-display font-black text-xl text-headings mt-2.5">{t.visiMisiTitle}</h3>
                </div>
                
                {/* VISI CARD GROUP WITH BACKGROUND, TITLE, AND COMPASS ICON */}
                <div className="bg-gradient-to-br from-soft-mint/95 via-white to-soft-mint/30 p-5 rounded-2xl border border-divider shadow-2xs relative overflow-hidden transition-all duration-300 hover:shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-transparent to-yasmin-green/5 rounded-full pointer-events-none" />
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="p-2 bg-deep-teal text-white rounded-xl shadow-xs shrink-0">
                      <Compass className="h-4.5 w-4.5" />
                    </div>
                    <h4 className="font-display font-black text-base tracking-wider text-headings uppercase">{t.visiLabel}</h4>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base italic font-normal leading-relaxed text-left font-sans">
                    {t.visiText}
                  </p>
                </div>

                {/* MISI CARD GROUP WITH BACKGROUND, TITLE, AND TARGET ICON */}
                <div className="bg-gradient-to-br from-[#FFFBEB]/80 via-white to-[#FEF3C7]/20 p-5 rounded-2xl border border-[#FEF3C7] shadow-2xs relative overflow-hidden transition-all duration-300 hover:shadow-sm">
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-warm-orange/5 rounded-full pointer-events-none" />
                  <div className="flex items-center space-x-3 mb-3.5">
                    <div className="p-2 bg-warm-orange text-white rounded-xl shadow-xs shrink-0">
                      <Target className="h-4.5 w-4.5" />
                    </div>
                    <h4 className="font-display font-black text-base tracking-wider text-warm-orange uppercase">{t.misiLabel}</h4>
                  </div>
                  <div className="space-y-3.5 font-sans text-sm sm:text-base text-gray-700">
                    <div className="flex items-start space-x-3 transition-colors hover:text-gray-900">
                      <span className="w-5.5 h-5.5 rounded-full bg-yasmin-green/20 text-yasmin-green flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="font-bold text-headings">{t.misi1Title}</p>
                        <p className="text-gray-600 font-sans font-normal mt-0.5 leading-relaxed">{t.misi1Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 transition-colors hover:text-gray-900">
                      <span className="w-5.5 h-5.5 rounded-full bg-yasmin-green/20 text-yasmin-green flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="font-bold text-headings">{t.misi2Title}</p>
                        <p className="text-gray-600 font-sans font-normal mt-0.5 leading-relaxed">{t.misi2Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 transition-colors hover:text-gray-900">
                      <span className="w-5.5 h-5.5 rounded-full bg-yasmin-green/20 text-yasmin-green flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="font-bold text-headings">{t.misi3Title}</p>
                        <p className="text-gray-600 font-sans font-normal mt-0.5 leading-relaxed">{t.misi3Desc}</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-sm bg-soft-mint min-h-[350px] lg:min-h-full">
              <SafeImage
                src={rsyVisiMisiImg}
                alt="Visi Misi Green Healing RS Yasmin"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

          </div>
          )}
        </div>

        {/* ABOUT HISTORICAL BACKDROP & STATS */}
        <div className="bg-white rounded-3xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left transition-all duration-300">
          <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <History className="w-5 h-5 text-orange-500 shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{lang === 'ID' ? 'Sejarah & Milestones RS Yasmin' : lang === 'KR' ? '야스민 병원의 역사와 주요 이정표' : lang === 'ZH' ? '雅斯敏医院发展历史与里程碑' : lang === 'AR' ? 'تاريخ ومحطات مستشفى ياسمين' : 'History & Milestones of RS Yasmin'}</h3>
            </div>
            <button
              onClick={() => toggleSection('sejarah')}
              className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.sejarah ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.sejarah ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.sejarah && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-in-up">
              <div className="space-y-4 text-left">
                <div className="inline-flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-divider text-deep-teal font-display text-[10px] font-semibold tracking-wider">
                  <History className="h-3.5 w-3.5 text-warm-orange" />
                  <span>{t.melayaniBadge}</span>
                </div>
                
                <h2 className="font-display font-bold text-xl sm:text-2xl text-headings leading-tight tracking-tight">
                  {t.melayaniTitle}
                </h2>

                <p className="text-gray-700 font-sans text-sm sm:text-base leading-relaxed text-justify font-normal">
                  {t.melayaniDesc1}
                </p>

                <p className="text-gray-700 font-sans text-sm sm:text-base leading-relaxed border-l-4 border-yasmin-green/60 pl-4 py-1 italic font-normal">
                  {t.melayaniDesc2}
                </p>

                {/* Statistics Row - redesigned to be perfectly balanced, beautiful and responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
                  <div className="bg-gradient-to-b from-soft-mint/30 to-white p-3.5 rounded-xl border border-divider shadow-2xs flex flex-col items-center justify-center min-h-[95px] transition-all duration-300 hover:scale-[1.03] hover:shadow-sm">
                    <span className="text-sm mb-0.5">🗓️</span>
                    <p className="font-display font-black text-lg md:text-xl text-deep-teal leading-none">{new Date().getFullYear() - 1986}+</p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider mt-1 leading-tight">{t.statYrs}</p>
                  </div>
                  <div className="bg-gradient-to-b from-[#FFF7ED]/45 to-white p-3.5 rounded-xl border border-divider shadow-2xs flex flex-col items-center justify-center min-h-[95px] transition-all duration-300 hover:scale-[1.03] hover:shadow-sm">
                    <span className="text-sm mb-0.5">🩺</span>
                    <p className="font-display font-black text-lg md:text-xl text-[#EA580C] leading-none">100+</p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider mt-1 leading-tight">{t.statDrs}</p>
                  </div>
                  <div className="bg-gradient-to-b from-[#EEF2F6]/60 to-white p-3.5 rounded-xl border border-divider shadow-2xs flex flex-col items-center justify-center min-h-[95px] transition-all duration-300 hover:scale-[1.03] hover:shadow-sm">
                    <span className="text-sm mb-0.5">🚨</span>
                    <p className="font-display font-black text-lg md:text-xl text-headings leading-none">24 Jam</p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider mt-1 leading-tight">{t.statIgd}</p>
                  </div>
                  <div className="bg-gradient-to-b from-[#ECFDF5]/60 to-white p-3.5 rounded-xl border border-divider shadow-2xs flex flex-col items-center justify-center min-h-[95px] transition-all duration-300 hover:scale-[1.03] hover:shadow-sm">
                    <span className="text-sm mb-0.5">👑</span>
                    <p className="font-display font-black text-sm md:text-base text-emerald-700 leading-none">{lang === 'ID' ? 'Paripurna' : 'Premium'}</p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider mt-1 leading-tight">{t.statAccred}</p>
                  </div>
                </div>
              </div>

              {/* Graphical timeline panel - Responsive Height optimized for Portrait/Tablet Vertical */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg bg-headings p-6 flex flex-col justify-between text-white border border-white/10 bg-gradient-to-br from-headings to-deep-teal min-h-[380px]" id="timeline-card">
                  <div className="space-y-3">
                    <span className="bg-warm-orange/20 border border-warm-orange/30 text-warm-orange font-bold text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full">
                      {t.historyBadge}
                    </span>
                    <h3 className="font-display font-bold text-base text-warm-ivory">{t.historyTitle}</h3>
                    
                    {/* Visual Timeline Steps - larger fonts formatted like Misi */}
                    <div className="space-y-6 pt-3 text-left font-sans leading-relaxed">
                      <div className="flex items-start space-x-3.5 group">
                        <div className="w-6.5 h-6.5 rounded-full bg-warm-orange text-headings flex items-center justify-center font-bold font-display text-[13px] shrink-0 mt-1">1</div>
                        <div>
                          <p className="font-display font-black text-[18px] text-warm-orange tracking-wide">{t.history1Title}</p>
                          <p className="text-[14.5px] text-warm-ivory/90 font-sans font-normal mt-0.5 leading-relaxed">{t.history1Desc}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3.5 group">
                        <div className="w-6.5 h-6.5 rounded-full bg-yasmin-green text-headings flex items-center justify-center font-bold font-display text-[13px] shrink-0 mt-1">2</div>
                        <div>
                          <p className="font-display font-black text-[18px] text-yasmin-green tracking-wide">{t.history2Title}</p>
                          <p className="text-[14.5px] text-warm-ivory/90 font-sans font-normal mt-0.5 leading-relaxed">{t.history2Desc}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 group">
                        <div className="w-6.5 h-6.5 rounded-full bg-teal-300 text-headings flex items-center justify-center font-bold font-display text-[13px] shrink-0 mt-1">3</div>
                        <div>
                          <p className="font-display font-black text-[18px] text-teal-300 tracking-wide">{t.history3Title}</p>
                          <p className="text-[14.5px] text-warm-ivory/90 font-sans font-normal mt-0.5 leading-relaxed">{t.history3Desc}</p>
                        </div>
                      </div>

                      {t.history4Title && (
                        <div className="flex items-start space-x-3.5 group">
                          <div className="w-6.5 h-6.5 rounded-full bg-amber-400 text-headings flex items-center justify-center font-bold font-display text-[13px] shrink-0 mt-1">4</div>
                          <div>
                            <p className="font-display font-black text-[18px] text-amber-400 tracking-wide">{t.history4Title}</p>
                            <p className="text-[14.5px] text-warm-ivory/90 font-sans font-normal mt-0.5 leading-relaxed">{t.history4Desc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right pt-3 border-t border-white/10 text-[9px] text-warm-ivory/60 font-mono flex justify-between items-center mt-4">
                    <span>{t.historyFooterLeft}</span>
                    <span>SINCE 1986</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. PRESTASI RS YASMIN SECTION */}
        <div id="prestasi-section" className="bg-white rounded-3xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left transition-all duration-300">
          <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <Award className="w-5 h-5 text-purple-500 shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{lang === 'ID' ? 'Penghargaan & Akreditasi' : lang === 'KR' ? '수상 및 공식 인증' : lang === 'ZH' ? '荣誉奖项与学术认证' : lang === 'AR' ? 'الجوائز والاعتمادات' : 'Awards & Accreditation'}</h3>
            </div>
            <button
              onClick={() => toggleSection('prestasi')}
              className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.prestasi ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.prestasi ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.prestasi && (
            <div className="animate-fade-in-up space-y-6">
              <div className="w-full text-center max-w-[105rem] mx-auto">
                <span className="font-display text-[9px] text-deep-teal font-extrabold uppercase tracking-widest bg-soft-mint border border-divider px-2.5 py-1 rounded-full inline-block">
                  {t.prestasiBadge}
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-headings mt-2.5">
                  {t.prestasiTitle}
                </h2>
                <p className="text-gray-500 font-sans text-sm sm:text-base mt-2.5 w-full leading-relaxed">
                  {t.prestasiDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlight Card: Piagam KARS (idx === 0) with side-by-side layout on desktop */}
                {(() => {
                  const prestasi = prestasiList[0];
                  if (!prestasi) return null;
                  return (
                    <div className="bg-gradient-to-br from-white to-soft-mint/30 hover:to-soft-mint/50 border border-divider hover:border-yasmin-green transition-all duration-300 rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch shadow-2xs hover:shadow-md group md:col-span-2">
                      {/* Image Frame - Left Side */}
                      <div className="relative h-64 sm:h-[380px] md:h-auto md:w-[35%] overflow-hidden bg-slate-50/80 p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-divider/40 shrink-0">
                        <SafeImage 
                          src={prestasi.image} 
                          alt={prestasi.title}
                          className="max-w-[85%] max-h-[180px] sm:max-h-[280px] md:max-h-[300px] object-contain rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-102"
                        />
                        <span className="absolute top-3 left-3 text-[8px] font-mono font-black tracking-wider text-deep-teal bg-white/95 border border-divider/40 px-2 py-1 rounded-md shadow-xs uppercase">
                          {prestasi.meta}
                        </span>
                        <span className="absolute bottom-3 right-3 text-xs font-display font-black text-white bg-deep-teal px-3 py-1 rounded-full shadow-xs">
                          {prestasi.year}
                        </span>
                      </div>
                      
                      {/* Text Section - Right Side */}
                      <div className="p-6 sm:p-10 md:w-[65%] flex flex-col justify-center space-y-4 text-left">
                        <h4 className="font-display font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-headings leading-snug whitespace-pre-line text-justify">
                          {(() => {
                            const idxOfPar = prestasi.title.indexOf(' (');
                            if (idxOfPar !== -1) {
                              const boldPart = prestasi.title.substring(0, idxOfPar);
                              const normalPart = prestasi.title.substring(idxOfPar + 1);
                              return (
                                <>
                                  <span>{boldPart}</span>
                                  <span className="font-sans font-normal text-xs sm:text-sm md:text-base text-gray-500 block mt-2.5 leading-relaxed text-justify">
                                    {normalPart}
                                  </span>
                                </>
                              );
                            }
                            return <span>{prestasi.title}</span>;
                          })()}
                        </h4>
                        <p className="text-gray-700 font-sans text-sm sm:text-base leading-relaxed text-justify font-normal whitespace-pre-line">
                          {prestasi.desc}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Other Cards (idx > 0) */}
                {prestasiList.slice(1).map((prestasi, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gradient-to-br from-white to-soft-mint/30 hover:to-soft-mint/50 border border-divider hover:border-yasmin-green transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md group"
                  >
                    <div>
                      <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-50/80 p-4 sm:p-6 flex items-center justify-center border-b border-divider/40">
                        <SafeImage 
                          src={prestasi.image} 
                          alt={prestasi.title}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-102"
                        />
                        <span className="absolute top-3 left-3 text-[8px] font-mono font-black tracking-wider text-deep-teal bg-white/95 border border-divider/40 px-2 py-1 rounded-md shadow-xs uppercase">
                          {prestasi.meta}
                        </span>
                        <span className="absolute bottom-3 right-3 text-xs font-display font-black text-white bg-deep-teal px-3 py-1 rounded-full shadow-xs">
                          {prestasi.year}
                        </span>
                      </div>
                      
                      <div className="p-6 space-y-3 text-left">
                        <h4 className="font-display font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-headings leading-snug whitespace-pre-line text-justify">
                          {(() => {
                            const idxOfPar = prestasi.title.indexOf(' (');
                            if (idxOfPar !== -1) {
                              const boldPart = prestasi.title.substring(0, idxOfPar);
                              const normalPart = prestasi.title.substring(idxOfPar + 1);
                              return (
                                <>
                                  <span>{boldPart}</span>
                                  <span className="font-sans font-normal text-xs sm:text-sm md:text-base text-gray-500 block mt-2.5 leading-relaxed text-justify">
                                    {normalPart}
                                  </span>
                                </>
                              );
                            }
                            return <span>{prestasi.title}</span>;
                          })()}
                        </h4>
                        <p className="text-gray-700 font-sans text-sm sm:text-base leading-relaxed text-justify font-normal whitespace-pre-line">
                          {prestasi.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. KEMITRAAN & MITRA SECTION */}
        {/* WHY YASMIN / CORE PILLARS BLOCK - Section 5 */}
        <div id="pillars-section" className="bg-emerald-50/50 rounded-3xl border border-emerald-100/80 p-6 sm:p-8 mb-12 text-left transition-all duration-300">
          <div className="flex items-center justify-between border-b border-emerald-200/50 pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-deep-teal uppercase">{lang === 'ID' ? 'Pilihan Terbaik: Mengapa Kami?' : lang === 'KR' ? '최상의 선택: 왜 우리를 선택해야 할까요?' : lang === 'ZH' ? '最佳选择：为什么选择我们？' : lang === 'AR' ? 'الخيار الأفضل: لماذا نحن؟' : 'Best Choice: Why Us?'}</h3>
            </div>
            <button
              onClick={() => toggleSection('pillars')}
              className="px-2.5 py-1.5 bg-white hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.pillars ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.pillars ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.pillars && (
            <div className="animate-fade-in-up space-y-6">
              <div className="w-full text-center">
                <span className="font-display text-[9px] text-deep-teal font-extrabold uppercase tracking-widest bg-white border border-divider px-3 py-1 rounded-full">
                  {t.pillarsBadge}
                </span>
                <h2 className="font-display font-bold text-xl text-headings mt-2.5">
                  {t.pillarsTitle}
                </h2>
                <p className="text-gray-500 font-sans text-[15.5px] mt-1">
                  {t.pillarsDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {whyYasminPillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-divider hover:border-yasmin-green transition-all duration-300 shadow-sm flex flex-col justify-between text-left lg:col-span-1"
                  >
                    <div className="space-y-2.5 font-sans">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pillar.color}`}>
                          <pillar.icon className="h-4.5 w-4.5" />
                        </div>
                        <h4 className="font-display font-bold text-sm text-headings leading-tight">{pillar.title}</h4>
                      </div>
                      <p className="text-gray-700 font-sans text-xs sm:text-sm leading-relaxed text-left font-normal">{pillar.desc}</p>
                    </div>
                    <div className="pt-3 border-t border-divider/40 mt-3 text-[11px] text-deep-teal uppercase tracking-wider font-display font-black">
                      PILLAR 0{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* JEJARING KEMITRAAN & JAMINAN - Section 6 */}
        <div id="mitra-kerjasama-section" className="bg-white rounded-2xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-300">
          <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <HeartHandshake className="w-5 h-5 text-blue-500 shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{lang === 'ID' ? 'Jejaring Kemitraan & Jaminan' : lang === 'KR' ? '공인 제휴 및 보증 네트워크' : lang === 'ZH' ? '定点合作网络与保障' : lang === 'AR' ? 'شبكة الشراكات والضمانات' : 'Partnership & Coverage Network'}</h3>
            </div>
            <button
              onClick={() => toggleSection('mitra')}
              className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.mitra ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.mitra ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.mitra && (
            <div className="animate-fade-in-up space-y-6">
              <div className="w-full text-center max-w-[105rem] mx-auto">
                <span className="font-display text-[9px] text-deep-teal font-bold tracking-widest uppercase bg-soft-mint border border-divider px-3 py-1 rounded-full inline-block">
                  {t.mitraBadge}
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-headings mt-2.5">
                  {t.mitraTitle}
                </h2>
                <p className="text-gray-700 font-sans text-base sm:text-lg font-normal mt-2.5 w-full leading-relaxed">
                  {t.mitraDesc}
                </p>
              </div>

              {/* Render Beautiful Partner Logo Cards - 1.5x Enlarged Partner Logos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
                {partnerList.map((partner, index) => {
                  const partnerLogosDict: Record<string, React.ReactNode> = {
                    'BPJS Kesehatan': (
                      <SafeImage src={logoBpjsKesehatan} className="h-16 w-36 object-contain filter hover:brightness-105 transition-all duration-300 transform scale-120" style={{ transform: 'scale(1.2)' }} alt="BPJS Kesehatan" />
                    ),
                    'BPJS Ketenagakerjaan (BPJS Naker)': (
                      <SafeImage src={logoBpjsNaker} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="BPJS Ketenagakerjaan (BPJS Naker)" />
                    ),
                    'Jasa Raharja': (
                      <SafeImage src={logoJasaRaharja} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Jasa Raharja" />
                    ),
                    'AdMedika': (
                      <SafeImage src={logoAdmedika} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300 transform scale-[1.4]" style={{ transform: 'scale(1.4)' }} alt="AdMedika" />
                    ),
                    'Prudential': (
                      <SafeImage src={logoPrudential} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Prudential" />
                    ),
                    'Allianz': (
                      <SafeImage src={logoAllianz} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Allianz" />
                    ),
                    'Manulife': (
                      <SafeImage src={logoManulife} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Manulife" />
                    ),
                    'FWD Insurance': (
                      <SafeImage src={logoFwd} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300 transform scale-140" style={{ transform: 'scale(1.4)' }} alt="FWD Insurance" />
                    ),
                    'Bumi Putera': (
                      <SafeImage src={logoBumiPutera} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Bumi Putera" />
                    ),
                    'Asuransi Astra (AA)': (
                      <SafeImage src={logoAa} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300 transform scale-120" style={{ transform: 'scale(1.2)' }} alt="Asuransi Astra (AA)" />
                    ),
                    'Angkasa Pura II (AP2)': (
                      <SafeImage src={logoAp2} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Angkasa Pura II (AP2)" />
                    ),
                    'BRI': (
                      <SafeImage src={logoBri} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="BRI" />
                    ),
                    'Bank Jatim': (
                      <SafeImage src={logoBankJatim} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Bank Jatim" />
                    ),
                    'Asuransi CAR': (
                      <SafeImage src={logoCar} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300 transform scale-125" style={{ transform: 'scale(1.25)' }} alt="Asuransi CAR" />
                    ),
                    'Owlexa Healthcare': (
                      <SafeImage src={logoOwlexa} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300 transform scale-120" style={{ transform: 'scale(1.2)' }} alt="Owlexa Healthcare" />
                    ),
                    'Nayaka Era Husada': (
                      <SafeImage src={logoNayaka} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Nayaka Era Husada" />
                    ),
                    'Sun Life': (
                      <SafeImage src={logoSunLife} className="h-14 w-36 object-contain filter hover:brightness-105 transition-all duration-300" alt="Sun Life" />
                    )
                  };

                  return (
                    <div
                      key={index}
                      className="bg-white border border-divider/90 rounded-xl p-6 flex flex-col justify-center items-center transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.55)] group h-36 text-center shadow-2xs"
                    >
                      <div className="flex-grow flex items-center justify-center">
                        {partnerLogosDict[partner.name] || (
                          <div className="flex flex-col items-center justify-center p-2">
                            <span className="font-display font-black text-sm text-headings tracking-tight leading-tight group-hover:text-yasmin-green transition-colors duration-300">
                              {partner.name}
                            </span>
                            <span className="mt-2 text-[9px] font-mono font-bold text-deep-teal/70 bg-soft-mint px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {partner.type}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. TESTIMONI PASIEN SECTION */}
        {!hideTestimonials && (
          <div id="testimoni-section" className="bg-white rounded-3xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left transition-all duration-300">
            <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-5 h-5 text-cyan-500 shrink-0" />
                <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{lang === 'ID' ? 'Testimoni Pasien' : lang === 'KR' ? '환자 후기' : lang === 'ZH' ? '患者真实反馈' : lang === 'AR' ? 'شهادات المرضى' : 'Patient Testimonials'}</h3>
              </div>
              <button
                onClick={() => toggleSection('testimoni')}
                className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
                title={collapsedSections.testimoni ? "Buka" : "Lipat"}
              >
                <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.testimoni ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {!collapsedSections.testimoni && (
              <div className="animate-fade-in-up">
                <div className="w-full text-center mb-4">
                  <span className="font-display text-[9px] text-deep-teal font-bold tracking-widest uppercase bg-soft-mint border border-divider px-3 py-1 rounded-full">
                    {t.testimoniBadge}
                  </span>
                </div>
                <TestimonialSection />
              </div>
            )}
          </div>
        )}

        {/* 6. TANYA JAWAB (FAQ) SECTION */}
        <div id="faq-section" className="bg-white rounded-3xl border border-divider shadow-xs p-6 sm:p-8 mb-12 text-left transition-all duration-300">
          <div className="flex items-center justify-between border-b border-divider pb-4 mb-4">
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-5 h-5 text-teal-600 shrink-0" />
              <h3 className="font-display font-black text-sm sm:text-base tracking-wider text-headings uppercase">{lang === 'ID' ? 'Tanya Jawab & Layanan Pengaduan' : lang === 'KR' ? '자주 묻는 질문 및 고객 지원' : lang === 'ZH' ? '常见问题与反馈渠道' : lang === 'AR' ? 'الأسئلة الشائعة والدعم الفني' : 'FAQs & Customer Support'}</h3>
            </div>
            <button
              onClick={() => toggleSection('faq')}
              className="px-2.5 py-1.5 bg-soft-mint hover:bg-headings hover:text-white transition-colors duration-200 text-deep-teal rounded-lg cursor-pointer flex items-center border border-divider/40 shadow-2xs hover:scale-110"
              title={collapsedSections.faq ? "Buka" : "Lipat"}
            >
              <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${collapsedSections.faq ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {!collapsedSections.faq && (
            <div className="animate-fade-in-up space-y-6">
              <div className="w-full text-center max-w-[105rem] mx-auto">
                <span className="font-display text-[9px] text-deep-teal font-bold tracking-widest uppercase bg-soft-mint border border-divider px-3 py-1 rounded-full inline-block">
                  {t.faqBadge}
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-headings mt-2.5">
                  {t.faqTitle}
                </h2>
                <p className="text-gray-500 font-sans text-sm sm:text-base mt-2.5 w-full leading-relaxed">
                  {t.faqDesc}
                </p>
              </div>

              <div className="space-y-3.5">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="border border-divider rounded-2xl overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-4.5 bg-soft-mint/30 hover:bg-soft-mint text-left font-display text-xs sm:text-sm font-bold text-headings transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5 pr-4">
                          <HelpCircle className="h-4 w-4 text-deep-teal shrink-0" />
                          <span>{faq.q}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="p-4.5 bg-white border-t border-divider font-sans text-[15.5px] leading-relaxed text-gray-650 animate-fade-in-down text-justify">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
