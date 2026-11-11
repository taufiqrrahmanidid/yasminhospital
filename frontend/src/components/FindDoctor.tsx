import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Phone, 
  Calendar, 
  Clock, 
  Smile, 
  Grid, 
  LayoutGrid, 
  List, 
  GraduationCap, 
  Award,
  User,
  ChevronDown
} from 'lucide-react';
import { SafeImage } from '../utils/imageUrl';
import { DOCTORS_DATA } from '../data';
import { Doctor } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { DOCTORS_TRANSLATIONS } from '../translations_doctors';

export function cleanDoctorName(name: string): string {
  let clean = name.split(',')[0].trim();
  const prefixRegex = /^(prof\.\s+|prof\s+|dr\.\s+|drg\.\s+|dra\.\s+|dr\s+|drg\s+|dra\s+|drg\.\s*)/i;
  let prev = '';
  while (clean !== prev) {
    prev = clean;
    clean = clean.replace(prefixRegex, '');
  }
  return clean.trim();
}

interface FindDoctorProps {
  onOpenBookingWizard: (doctorId?: string) => void;
  selectedDoctorForWizard?: string;
  doctorsList?: Doctor[];
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export default function FindDoctor({ 
  onOpenBookingWizard, 
  selectedDoctorForWizard, 
  doctorsList,
  searchTerm: searchTermProp,
  onSearchChange: onSearchChangeProp
}: FindDoctorProps) {
  const currentLangCode = useLanguage();
  const isEn = currentLangCode === 'EN';
  const isKr = currentLangCode === 'KR';
  const isZh = currentLangCode === 'ZH';
  const isAr = currentLangCode === 'AR';

  const activeDoctors = doctorsList || DOCTORS_DATA;

  // Dynamically build DOCTOR_CATEGORIES from activeDoctors
  const DOCTOR_CATEGORIES = React.useMemo(() => {
    const mapping: Record<string, string[]> = {};
    activeDoctors.forEach(doc => {
      const spec = doc.specialty;
      if (!spec) return;
      if (!mapping[spec]) {
        mapping[spec] = [];
      }
      const sub = doc.subSpecialty;
      if (sub && !mapping[spec].includes(sub)) {
        mapping[spec].push(sub);
      }
    });
    // Sort keys and sub-specialties for neatness
    const sorted: Record<string, string[]> = {};
    Object.keys(mapping).sort().forEach(key => {
      sorted[key] = mapping[key].sort();
    });
    return sorted;
  }, [activeDoctors]);

  // Dynamically build all sub-specialties for "SEMUA" category
  const allSubSpecialties = React.useMemo(() => {
    const subs = new Set<string>();
    activeDoctors.forEach(doc => {
      if (doc.subSpecialty) {
        subs.add(doc.subSpecialty);
      }
    });
    return Array.from(subs).sort();
  }, [activeDoctors]);

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const searchTerm = searchTermProp !== undefined ? searchTermProp : localSearchTerm;
  const setSearchTerm = (val: string | ((prev: string) => string)) => {
    const nextVal = typeof val === 'function' ? val(searchTerm) : val;
    if (onSearchChangeProp) {
      onSearchChangeProp(nextVal);
    } else {
      setLocalSearchTerm(nextVal);
    }
  };

  const [searchInputValue, setSearchInputValue] = useState(searchTerm);

  React.useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('SEMUA');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'NAMA' | 'SPESIALIS'>('DEFAULT');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'LAKI-LAKI' | 'PEREMPUAN'>('ALL');
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  
  // Layout views: 'big' (3 cols), 'small' (5 cols), 'list' (full list rows)
  const [layoutView, setLayoutView] = useState<'big' | 'small' | 'list'>('big');
  
  // Selected doctor profile modal state
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<Doctor | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDoctorProfile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getTranslatedCategory = (cat: string) => {
    if (cat === 'SEMUA') {
      if (isEn) return 'All Categories';
      if (isKr) return '모든 카테고리';
      if (isZh) return '所有类别';
      if (isAr) return 'جميع الفئات';
      return 'Semua Layanan';
    }
    return getTranslatedSpecialty(cat);
  };

  const getTranslatedBio = (doc: Doctor) => {
    if (currentLangCode === 'ID') return doc.bio;
    return DOCTORS_TRANSLATIONS[doc.id]?.[currentLangCode]?.bio || doc.bio;
  };

  const getTranslatedEducation = (doc: Doctor) => {
    if (currentLangCode === 'ID') return doc.education;
    return DOCTORS_TRANSLATIONS[doc.id]?.[currentLangCode]?.education || doc.education;
  };

  const getTranslatedSpecialty = (specialty: string) => {
    if (isEn) {
      if (specialty === 'Kesehatan Keluarga') return 'Family Health';
      if (specialty === 'Spesialis Medis') return 'Medical Specialist';
      if (specialty === 'Bedah & Pemulihan') return 'Surgery & Recovery';
      if (specialty === 'Gigi & Mulut') return 'Dental & Oral';
      if (specialty === 'Kesehatan Mental') return 'Mental Health';
      if (specialty === 'Penunjang Diagnostik') return 'Diagnostic Support';
    } else if (isKr) {
      if (specialty === 'Kesehatan Keluarga') return '가족 건강';
      if (specialty === 'Spesialis Medis') return '의학 전문의';
      if (specialty === 'Bedah & Pemulihan') return '수술 및 회복';
      if (specialty === 'Gigi & Mulut') return '치과 및 구강';
      if (specialty === 'Kesehatan Mental') return '정신 건강';
      if (specialty === 'Penunjang Diagnostik') return '진단 지원';
    } else if (isZh) {
      if (specialty === 'Kesehatan Keluarga') return '家庭健康';
      if (specialty === 'Spesialis Medis') return '医学专科';
      if (specialty === 'Bedah & Pemulihan') return '手术与康复';
      if (specialty === 'Gigi & Mulut') return '牙科与口腔';
      if (specialty === 'Kesehatan Mental') return '心理健康';
      if (specialty === 'Penunjang Diagnostik') return '辅助诊断';
    } else if (isAr) {
      if (specialty === 'Kesehatan Keluarga') return 'صحة الأسرة';
      if (specialty === 'Spesialis Medis') return 'الأخصائيين الطبيين';
      if (specialty === 'Bedah & Pemulihan') return 'الجراحة والتعافي';
      if (specialty === 'Gigi & Mulut') return 'الأسنان والفم';
      if (specialty === 'Kesehatan Mental') return 'الصحة النفسية';
      if (specialty === 'Penunjang Diagnostik') return 'الدعم التشخيصي';
    }
    return specialty;
  };

  const getTranslatedSubSpecialty = (sub: string | undefined) => {
    if (!sub) return '';
    if (isEn) {
      if (sub === 'Kandungan') return 'Obstetrics & Gynecology';
      if (sub === 'Anak') return 'Pediatrics';
      if (sub === 'Penyakit Dalam') return 'Internal Medicine';
      if (sub === 'Bedah Umum') return 'General Surgery';
      if (sub === 'Jantung') return 'Cardiology';
      if (sub === 'Saraf') return 'Neurology';
      if (sub === 'Mata') return 'Ophthalmology';
      if (sub === 'Psikolog') return 'Psychologist';
      if (sub === 'Rehab Medik') return 'Medical Rehabilitation';
      if (sub === 'Umum') return 'General Practitioner';
      if (sub === 'Paru') return 'Pulmonology';
      if (sub === 'THT') return 'ENT';
      if (sub === 'Kulit & Kelamin') return 'Dermatology & Venereology';
      if (sub === 'Bedah Tulang') return 'Orthopedics';
      if (sub === 'Urologi') return 'Urology';
      if (sub === 'Anestesi') return 'Anesthesiology';
      if (sub === 'Gigi Umum') return 'General Dentistry';
      if (sub === 'Gigi Anak') return 'Pediatric Dentistry';
      if (sub === 'Bedah Mulut') return 'Oral Surgery';
      if (sub === 'Ortodontis') return 'Orthodontist';
      if (sub === 'Periodonsia') return 'Periodontist';
      if (sub === 'Prostodonsia') return 'Prosthodontist';
      if (sub === 'Penyakit Mulut') return 'Oral Medicine';
      if (sub === 'Konselor') return 'Counselor';
      if (sub === 'Gizi') return 'Nutritionist';
      if (sub === 'Radiologi') return 'Radiology';
      if (sub === 'Patologi Klinis') return 'Clinical Pathology';
    } else if (isKr) {
      if (sub === 'Kandungan') return '산부인과';
      if (sub === 'Anak') return '소아청소년과';
      if (sub === 'Penyakit Dalam') return '내과';
      if (sub === 'Bedah Umum') return '일반외과';
      if (sub === 'Jantung') return '심장내과';
      if (sub === 'Saraf') return '신경과';
      if (sub === 'Mata') return '안과';
      if (sub === 'Psikolog') return '임상심리학자';
      if (sub === 'Rehab Medik') return '재활의학과';
      if (sub === 'Umum') return '일반의';
      if (sub === 'Paru') return '호흡기내과';
      if (sub === 'THT') return '이비인후과';
      if (sub === 'Kulit & Kelamin') return '피부비뇨의학과';
      if (sub === 'Bedah Tulang') return '정형외과';
      if (sub === 'Urologi') return '비뇨의학과';
      if (sub === 'Anestesi') return '마취통증의학과';
      if (sub === 'Gigi Umum') return '일반 치과';
      if (sub === 'Gigi Anak') return '소아 치과';
      if (sub === 'Bedah Mulut') return '구강악안면외과';
      if (sub === 'Ortodontis') return '치과교정과';
      if (sub === 'Periodonsia') return '치주과';
      if (sub === 'Prostodonsia') return '치과보철과';
      if (sub === 'Penyakit Mulut') return '구강내과';
      if (sub === 'Konselor') return '심리상담가';
      if (sub === 'Gizi') return '영양사';
      if (sub === 'Radiologi') return '영상의학과';
      if (sub === 'Patologi Klinis') return '진단검사의학과';
    } else if (isZh) {
      if (sub === 'Kandungan') return '妇产科';
      if (sub === 'Anak') return '儿科';
      if (sub === 'Penyakit Dalam') return '内科';
      if (sub === 'Bedah Umum') return '普通外科';
      if (sub === 'Jantung') return '心脏内科';
      if (sub === 'Saraf') return '神经内科';
      if (sub === 'Mata') return '眼科';
      if (sub === 'Psikolog') return '心理咨询师';
      if (sub === 'Rehab Medik') return '康复医学科';
      if (sub === 'Umum') return '全科医生';
      if (sub === 'Paru') return '肺科';
      if (sub === 'THT') return '耳鼻喉科';
      if (sub === 'Kulit & Kelamin') return '皮肤性病科';
      if (sub === 'Bedah Tulang') return '骨科';
      if (sub === 'Urologi') return '泌尿外科';
      if (sub === 'Anestesi') return '麻醉科';
      if (sub === 'Gigi Umum') return '普通牙科';
      if (sub === 'Gigi Anak') return '儿童牙科';
      if (sub === 'Bedah Mulut') return '口腔颌面外科';
      if (sub === 'Ortodontis') return '牙科正畸科';
      if (sub === 'Periodonsia') return '牙周病科';
      if (sub === 'Prostodonsia') return '牙齿修复科';
      if (sub === 'Penyakit Mulut') return '口腔内科';
      if (sub === 'Konselor') return '心理辅导师';
      if (sub === 'Gizi') return '营养师';
      if (sub === 'Radiologi') return '放射影像科';
      if (sub === 'Patologi Klinis') return '临床病理科';
    } else if (isAr) {
      if (sub === 'Kandungan') return 'النساء والتوليد';
      if (sub === 'Anak') return 'الأطفال';
      if (sub === 'Penyakit Dalam') return 'الأمراض الباطنية';
      if (sub === 'Bedah Umum') return 'الجراحة العامة';
      if (sub === 'Jantung') return 'أمراض القلب';
      if (sub === 'Saraf') return 'أعصاب';
      if (sub === 'Mata') return 'العيون';
      if (sub === 'Psikolog') return 'أخصائي نفسي';
      if (sub === 'Rehab Medik') return 'التأهيل الطبي';
      if (sub === 'Umum') return 'طبيب عام';
      if (sub === 'Paru') return 'الرئة والصدر';
      if (sub === 'THT') return 'أذن وأنف وحنجرة';
      if (sub === 'Kulit & Kelamin') return 'الجلدية والتناسلية';
      if (sub === 'Bedah Tulang') return 'العظام والكسور';
      if (sub === 'Urologi') return 'المسالك البولية';
      if (sub === 'Anestesi') return 'التخدير';
      if (sub === 'Gigi Umum') return 'طب أسنان عام';
      if (sub === 'Gigi Anak') return 'طب أسنان الأطفال';
      if (sub === 'Bedah Mulut') return 'جراحة الفم والفكين';
      if (sub === 'Ortodontis') return 'تقويم الأسنان';
      if (sub === 'Periodonsia') return 'أمراض اللثة';
      if (sub === 'Prostodonsia') return 'تركيبات الأسنان';
      if (sub === 'Penyakit Mulut') return 'طب أمراض الفم';
      if (sub === 'Konselor') return 'مستشار نفسي';
      if (sub === 'Gizi') return 'أخصائي تغذية';
      if (sub === 'Radiologi') return 'الأشعة';
      if (sub === 'Patologi Klinis') return 'المختبر والباثولوجيا';
    }
    return sub;
  };

  const getTranslatedDay = (day: string) => {
    const d = day.trim().toLowerCase();
    if (isEn) {
      if (d === 'senin') return 'Monday';
      if (d === 'selasa') return 'Tuesday';
      if (d === 'rabu') return 'Wednesday';
      if (d === 'kamis') return 'Thursday';
      if (d === 'jumat') return 'Friday';
      if (d === 'sabtu') return 'Saturday';
      if (d === 'minggu') return 'Sunday';
    } else if (isKr) {
      if (d === 'senin') return '월요일';
      if (d === 'selasa') return '화요일';
      if (d === 'rabu') return '수요일';
      if (d === 'kamis') return '목요일';
      if (d === 'jumat') return '금요일';
      if (d === 'sabtu') return '토요일';
      if (d === 'minggu') return '일요일';
    } else if (isZh) {
      if (d === 'senin') return '周一';
      if (d === 'selasa') return '周二';
      if (d === 'rabu') return '周三';
      if (d === 'kamis') return '周四';
      if (d === 'jumat') return '周五';
      if (d === 'sabtu') return '周六';
      if (d === 'minggu') return '周日';
    } else if (isAr) {
      if (d === 'senin') return 'الإثنين';
      if (d === 'selasa') return 'الثلاثاء';
      if (d === 'rabu') return 'الأربعاء';
      if (d === 'kamis') return 'الخميس';
      if (d === 'jumat') return 'الجمعة';
      if (d === 'sabtu') return 'السبت';
      if (d === 'minggu') return 'الأحد';
    }
    return day;
  };

  // Filter logic
  const filteredDoctors = activeDoctors.filter((doc) => {
    // 1. Search Term logic
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.subSpecialty && doc.subSpecialty.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Category Level Filter
    const matchesCategory = selectedCategory === 'SEMUA' || doc.specialty === selectedCategory;

    // 3. SubCategory Level Filter
    const matchesSubCategory = selectedSubCategory === 'SEMUA' || doc.subSpecialty === selectedSubCategory;

    // 4. Gender Filter
    const matchesGender =
      genderFilter === 'ALL' ||
      (genderFilter === 'LAKI-LAKI' && (doc.gender === 'Laki-laki' || !doc.gender)) ||
      (genderFilter === 'PEREMPUAN' && doc.gender === 'Perempuan');

    return matchesSearch && matchesCategory && matchesSubCategory && matchesGender;
  });

  // Sort logic
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'NAMA') {
      const nameA = cleanDoctorName(a.name);
      const nameB = cleanDoctorName(b.name);
      return nameA.localeCompare(nameB, 'id');
    }
    
    // Sort by subSpecialty (the subcategory tag filter) first, then by specialty (main category), then by name without titles
    const specA = a.subSpecialty || a.specialty || '';
    const specB = b.subSpecialty || b.specialty || '';
    const specCompare = specA.localeCompare(specB, 'id');
    
    if (specCompare !== 0) {
      return specCompare;
    }
    
    const mainA = a.specialty || '';
    const mainB = b.specialty || '';
    const mainCompare = mainA.localeCompare(mainB, 'id');
    if (mainCompare !== 0) {
      return mainCompare;
    }
    
    const nameA = cleanDoctorName(a.name);
    const nameB = cleanDoctorName(b.name);
    return nameA.localeCompare(nameB, 'id');
  });

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('SEMUA'); // Reset subcategory on main category change
  };

  return (
    <section id="doctor-search" className="py-20 bg-white">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="w-full text-left mb-12">
          <span className="font-display text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-soft-mint px-4 py-2 rounded-full border border-divider inline-block">
            {isEn ? "Specialist Doctor Directories" : "Direktori Dokter Spesialis"}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-headings mt-4">
            {isEn ? "Find Your Healing Specialist" : "Temukan Spesialis Pemulihan Keluarga Anda"}
          </h2>
          <p className="text-gray-500 font-sans text-sm mt-2 max-w-4xl">
            {isEn 
              ? "RS Yasmin lists elite medical practitioners and clinical psychologists ready to guard your healing journey." 
              : "Direktori lengkap tim dokter spesialis, profesi gigi & mulut, penunjang diagnostik, dan psikolog klinis yang siap membimbing kesembuhan Anda dengan standar medis resort."}
          </p>
        </div>

        {/* Toggle Collapse Filter Interface - request 44: "tambahkan button collapse/uncollapse" */}
        <div className="max-w-[105rem] mx-auto mb-4 flex justify-between items-center bg-soft-mint/30 border border-divider px-5 py-3 rounded-2xl">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
            <span className="font-display text-[10px] sm:text-xs font-bold text-headings tracking-widest uppercase">
              {isEn ? "FILTER SELECTIONS" : "PANEL FILTER PENCARIAN DOKTER"}
            </span>
          </div>
          <button
            id="btn-collapse-doctor-filters"
            onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
            className="px-3.5 py-2 bg-white hover:bg-[#0B4F4A] hover:text-white text-deep-teal border border-divider rounded-xl font-display text-xs font-bold transition-all duration-300 cursor-pointer flex items-center shadow-sm hover:scale-110"
            title={isFilterCollapsed ? "Buka Panel Filter" : "Lipat Panel Filter"}
          >
            <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${isFilterCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Dynamic & Advanced Filtering Interface */}
        <div className={`${isFilterCollapsed ? 'hidden' : 'block'} bg-soft-mint p-5 sm:p-8 rounded-3xl border border-divider shadow-sm mb-10 max-w-[105rem] mx-auto space-y-6 transition-all duration-300`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            
            {/* Search Input Box */}
            <div className="md:col-span-4 text-left">
              <label className="block text-[10px] font-bold text-deep-teal/80 tracking-widest uppercase mb-2 font-sans">
                {isEn ? "Search Clinician Name" : "Cari Nama Dokter / Keahlian"}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchTerm(searchInputValue);
                    }
                  }}
                  placeholder={isEn ? "Search name... (Press Enter)" : "Cari dr. Solakhuddin... (Tekan Enter)"}
                  className="w-full bg-white pl-10 pr-22 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-xs shadow-2xs font-sans text-gray-750"
                />
                <div className="absolute right-1.5 flex items-center space-x-1">
                  {searchInputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInputValue('');
                        setSearchTerm('');
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors text-[10px] font-semibold px-1.5 py-1 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchTerm(searchInputValue)}
                    className="bg-yasmin-green hover:bg-deep-teal text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    {isEn ? "Search" : "Cari"}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Category Filter Dropdown */}
            <div className="md:col-span-3 text-left">
              <label className="block text-[10px] font-bold text-deep-teal/80 tracking-widest uppercase mb-2 font-sans">
                {isEn ? "Main Department" : "Kategori Layanan Medis"}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-white px-3.5 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-xs font-semibold text-gray-700 shadow-2xs cursor-pointer"
              >
                <option value="SEMUA">{isEn ? "All Departments" : "Semua Kategori (Pilih Kategori)"}</option>
                {Object.keys(DOCTOR_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{getTranslatedSpecialty(cat)}</option>
                ))}
              </select>
            </div>

            {/* Urutkan Dokter Filter */}
            <div className="md:col-span-3 text-left">
              <label className="block text-[10px] font-bold text-deep-teal/80 tracking-widest uppercase mb-2 font-sans">
                {isEn ? "Sort Doctors" : "Urutkan Dokter"}
              </label>
              <div className="bg-white p-1 rounded-xl border border-divider flex text-center">
                <button
                  type="button"
                  onClick={() => setSortBy('DEFAULT')}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all cursor-pointer ${
                    sortBy === 'DEFAULT'
                      ? 'bg-deep-teal text-white shadow-2xs'
                      : 'text-gray-500 hover:text-headings'
                  }`}
                >
                  Bawaan
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('NAMA')}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all cursor-pointer ${
                    sortBy === 'NAMA'
                      ? 'bg-yasmin-green text-white shadow-2xs'
                      : 'text-gray-500 hover:text-headings'
                  }`}
                >
                  Nama
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('SPESIALIS')}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all cursor-pointer ${
                    sortBy === 'SPESIALIS'
                      ? 'bg-warm-orange text-headings shadow-2xs'
                      : 'text-gray-500 hover:text-headings'
                  }`}
                >
                  Spesialis
                </button>
              </div>
            </div>

            {/* Jenis Kelamin Filter */}
            <div className="md:col-span-2 text-left">
              <label className="block text-[10px] font-bold text-deep-teal/80 tracking-widest uppercase mb-2 font-sans">
                {isEn ? "Gender" : "Jenis Kelamin"}
              </label>
              <div className="bg-white p-1 rounded-xl border border-divider flex text-center">
                <button
                  type="button"
                  onClick={() => setGenderFilter('ALL')}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all cursor-pointer ${
                    genderFilter === 'ALL'
                      ? 'bg-deep-teal text-white shadow-2xs'
                      : 'text-gray-500 hover:text-headings'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('LAKI-LAKI')}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all cursor-pointer ${
                    genderFilter === 'LAKI-LAKI'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-gray-500 hover:text-headings'
                  }`}
                >
                  Pria
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('PEREMPUAN')}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all cursor-pointer ${
                    genderFilter === 'PEREMPUAN'
                      ? 'bg-pink-600 text-white shadow-2xs'
                      : 'text-gray-500 hover:text-headings'
                  }`}
                >
                  Wanita
                </button>
              </div>
            </div>

          </div>

          {/* Nesting Tree Subcategory Badges (Visible when chosen category != SEMUA) */}
          <div className="pt-4 border-t border-divider/60">
            <div className="flex flex-col space-y-2 text-left">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                {isEn ? "Sub-Specialty Filter:" : "Filter Spesialisasi Spasifik:"}
              </span>
              
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubCategory('SEMUA')}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors font-semibold cursor-pointer ${
                    selectedSubCategory === 'SEMUA'
                      ? 'bg-deep-teal text-white shadow-2xs'
                      : 'bg-white hover:bg-gray-100 text-gray-600 border border-divider/80'
                  }`}
                >
                  {isEn ? "All Sub-Specialties" : isKr ? "모든 세부 전문의" : isZh ? "所有子专业" : isAr ? "جميع التخصصات الفرعية" : "Semua Sub-Spesialis"}
                </button>

                {selectedCategory !== 'SEMUA' ? (
                  DOCTOR_CATEGORIES[selectedCategory].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors font-semibold cursor-pointer ${
                        selectedSubCategory === sub
                          ? 'bg-yasmin-green text-white shadow-2xs'
                          : 'bg-white hover:bg-gray-100 text-gray-600 border border-divider/80'
                      }`}
                    >
                      {getTranslatedSubSpecialty(sub)}
                    </button>
                  ))
                ) : (
                  // If category is "SEMUA", show all sub-specialties across the system dynamically
                  allSubSpecialties.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        // Find category that hosts this sub
                        const parentCat = Object.keys(DOCTOR_CATEGORIES).find(cat => 
                          DOCTOR_CATEGORIES[cat].includes(sub)
                        );
                        if (parentCat) {
                          setSelectedCategory(parentCat);
                          setSelectedSubCategory(sub);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-100 text-gray-600 border border-divider/80 bg-white cursor-pointer transition-colors"
                    >
                      {getTranslatedSubSpecialty(sub)}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Clear All Filters Status Bar */}
          {(selectedCategory !== 'SEMUA' || selectedSubCategory !== 'SEMUA' || searchTerm !== '' || sortBy !== 'DEFAULT' || genderFilter !== 'ALL') && (
            <div className="flex flex-wrap items-center justify-between pt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Filter aktif: </span>
                {selectedCategory !== 'SEMUA' && (
                  <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-700 uppercase">{selectedCategory}</span>
                )}
                {selectedSubCategory !== 'SEMUA' && (
                  <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-700 uppercase">{selectedSubCategory}</span>
                )}
                {searchTerm !== '' && (
                  <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-700">"{searchTerm}"</span>
                )}
                {sortBy !== 'DEFAULT' && (
                  <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-700 uppercase">Urutan: {sortBy === 'NAMA' ? 'Nama' : 'Spesialis'}</span>
                )}
                {genderFilter !== 'ALL' && (
                  <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-700 uppercase">{genderFilter}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('SEMUA');
                  setSelectedSubCategory('SEMUA');
                  setSortBy('DEFAULT');
                  setGenderFilter('ALL');
                }}
                className="text-deep-teal font-bold hover:underline cursor-pointer"
              >
                Reset Semua Filter ×
              </button>
            </div>
          )}
        </div>

        {/* View Grid Layout Switche/Toggle and Matching Result info */}
        <div className="max-w-[105rem] mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-divider/50 pb-5">
          <div className="text-left font-sans text-xs text-gray-500">
            Ditemukan <span className="font-bold text-headings text-sm">{filteredDoctors.length}</span> tenaga medis / spesialis handal bersertifikat.
          </div>
          
          {/* Toggles for Grid / List mode */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl border border-divider">
            <button
              onClick={() => setLayoutView('big')}
              className={`p-2 rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                layoutView === 'big' 
                  ? 'bg-white text-deep-teal shadow-xs font-bold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Big Grid (3 Columns)"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] hidden md:inline">Big Grid</span>
            </button>
            <button
              onClick={() => setLayoutView('small')}
              className={`p-2 rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                layoutView === 'small' 
                  ? 'bg-white text-deep-teal shadow-xs font-bold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Small Grid (5 Columns)"
            >
              <Grid className="h-4 w-4" />
              <span className="text-[10px] hidden md:inline">Small Grid (5)</span>
            </button>
            <button
              onClick={() => setLayoutView('list')}
              className={`p-2 rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                layoutView === 'list' 
                  ? 'bg-white text-deep-teal shadow-xs font-bold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
              <span className="text-[10px] hidden md:inline">List View</span>
            </button>
          </div>
        </div>

        {/* Main Render Section based on layout mode */}
        {sortedDoctors.length > 0 ? (
          <div className={
            layoutView === 'small'
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : layoutView === 'big'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-4 w-full"
          }>
            {sortedDoctors.map((doc) => {
              const categoryName = getTranslatedSpecialty(doc.specialty);
              const subCategoryName = getTranslatedSubSpecialty(doc.subSpecialty);

              if (layoutView === 'list') {
                // Return row/list view
                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-divider/95 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs hover:shadow-md transition-all text-left"
                  >
                    {/* Image and basic info */}
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0 border border-divider flex items-center justify-center">
                        <SafeImage
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span 
                            style={{ background: 'rgba(11, 79, 74, 0.03)' }}
                            className="text-deep-teal text-xs font-normal px-2.5 py-0.5 rounded border border-deep-teal/15 shadow-2xs"
                          >
                            {categoryName}
                          </span>
                          {subCategoryName && (
                            <span 
                              style={{ background: 'rgba(11, 79, 74, 0.03)' }}
                              className="text-deep-teal text-xs font-normal px-2.5 py-0.5 rounded border border-deep-teal/15 shadow-2xs"
                            >
                              {subCategoryName}
                            </span>
                          )}
                          {doc.bpjs && (
                            <span 
                              style={{ background: 'rgba(11, 79, 74, 0.03)' }}
                              className="text-deep-teal text-xs font-normal px-2.5 py-0.5 rounded border border-deep-teal/15 shadow-2xs"
                            >
                              BPJS
                            </span>
                          )}
                          {doc.status && doc.status !== 'Aktif' && (
                            <span className={`text-xs font-normal px-2.5 py-0.5 rounded uppercase ${
                              doc.status === 'Libur'
                                ? 'bg-amber-100/60 text-amber-900 border border-amber-200'
                                : 'bg-rose-100/60 text-rose-900 border border-rose-200'
                            }`}>
                              {doc.status}
                            </span>
                          )}
                        </div>
                        <h3 className="font-sans font-bold text-base sm:text-lg text-headings leading-normal">{doc.name}</h3>
                        <div className="relative group/bio cursor-help">
                          <p className="text-xs text-gray-500 font-sans font-normal max-w-xl line-clamp-1 hover:text-deep-teal transition-colors">
                            {getTranslatedBio(doc)}
                          </p>
                          {/* Floating Balun Tooltip */}
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/bio:block z-50 w-72 sm:w-96 p-3 rounded-2xl bg-amber-100/35 backdrop-blur-md border border-amber-300/60 shadow-xl text-gray-800 text-xs font-normal leading-relaxed pointer-events-none transition-all duration-200 animate-fade-in">
                            <div className="font-semibold text-deep-teal text-[11px] mb-1 flex items-center space-x-1">
                              <Sparkles className="h-3 w-3 text-amber-600" />
                              <span>Penjelasan Lengkap Dokter:</span>
                            </div>
                            <p className="text-gray-800 text-xs font-normal whitespace-normal leading-relaxed">
                              {getTranslatedBio(doc)}
                            </p>
                            <div className="absolute left-6 top-full w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-amber-200/50"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata columns */}
                    <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-gray-550 font-sans w-full md:w-auto shrink-0 md:justify-end">
                      <div className="flex flex-col text-left md:text-right font-sans">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">{isEn ? "Practice Days" : "Hari Praktek"}</span>
                        <span className="font-medium text-headings text-sm sm:text-base">{doc.schedule.days.map(d => getTranslatedDay(d)).join(', ')}</span>
                      </div>
                      <div className="flex flex-col text-left md:text-right shrink-0 font-sans">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">{isEn ? "Hours" : "Jam Kerja"}</span>
                        <span className="font-mono font-bold text-deep-teal bg-soft-mint px-2 py-0.5 rounded text-xs sm:text-sm mt-0.5">{doc.schedule.hours}</span>
                      </div>
                      <div className="flex flex-col items-start md:items-end shrink-0 font-sans">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-warm-orange text-xs" />
                          <span className="font-bold text-headings text-sm sm:text-base">{doc.rating}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-450">
                          {doc.experience} {isEn ? 'Yrs Experience' : isKr ? '년 경력' : isZh ? '年经验' : isAr ? 'سنوات خبرة' : 'Th Pengalaman'}
                        </span>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center space-x-1.5 w-full md:w-auto">
                        <button
                          onClick={() => setSelectedDoctorProfile(doc)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-headings font-sans font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
                        >
                          {isEn ? "View Profile" : isKr ? "프로필 보기" : isZh ? "查看个人资料" : isAr ? "عرض الملف الشخصي" : "Lihat Profil"}
                        </button>
                        <button
                          onClick={() => onOpenBookingWizard(doc.id)}
                          className="px-3.5 py-2 bg-gradient-to-r from-deep-teal to-yasmin-green text-white font-bold font-sans text-xs sm:text-sm rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <span>{isEn ? "Register" : isKr ? "등록하기" : isZh ? "注册登记" : isAr ? "تسجيل" : "Daftar"}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Return Custom Grid Layout (big or small)
              const isSmall = layoutView === 'small';
              return (
                <div
                  key={doc.id}
                  className={`bg-white border border-divider rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between text-left`}
                >
                  <div>
                    {/* Card Graphic Header */}
                    <div className={`relative ${isSmall ? 'aspect-[4/5]' : 'aspect-[4/5]'} bg-soft-mint/30 overflow-hidden group border-b border-divider/40`}>
                      <SafeImage
                        src={doc.image}
                        alt={doc.name}
                        className="w-full h-full object-cover transform duration-555 group-hover:scale-105"
                      />
                      
                      {/* Right Tag Badges */}
                      <div className="absolute top-3 right-3 flex flex-col items-end space-y-1 z-10 text-right max-w-[85%] sm:max-w-[80%] pointer-events-none">
                        <span 
                          style={{ background: 'rgba(255, 255, 255, 0.88)' }}
                          className="bg-deep-teal/[0.03] text-deep-teal text-[10px] sm:text-xs font-normal tracking-wide px-2 py-0.5 rounded-md border border-deep-teal/20 shadow-2xs backdrop-blur-xs text-right max-w-full truncate"
                        >
                          {categoryName}
                        </span>
                        {subCategoryName && (
                          <span 
                            style={{ background: 'rgba(255, 255, 255, 0.88)' }}
                            className="bg-deep-teal/[0.03] text-deep-teal text-[9px] sm:text-[10px] font-normal px-1.5 py-0.5 rounded-md border border-deep-teal/20 shadow-2xs backdrop-blur-xs text-right max-w-full truncate"
                          >
                            {subCategoryName}
                          </span>
                        )}
                        {doc.bpjs && (
                          <span 
                            style={{ background: 'rgba(255, 255, 255, 0.88)' }}
                            className="bg-deep-teal/[0.03] text-deep-teal text-[9px] sm:text-[10px] font-normal px-1.5 py-0.5 rounded-md border border-deep-teal/20 shadow-2xs backdrop-blur-xs text-right max-w-full truncate"
                          >
                            BPJS Ok
                          </span>
                        )}
                        {doc.status && doc.status !== 'Aktif' && (
                          <span className={`text-[9px] sm:text-[10px] font-normal px-1.5 py-0.5 rounded-md shadow-2xs text-right max-w-full truncate uppercase ${
                            doc.status === 'Libur'
                              ? 'bg-amber-100/90 text-amber-900 border border-amber-300/40'
                              : 'bg-rose-100/90 text-rose-900 border border-rose-300/40'
                          }`}>
                            {doc.status}
                          </span>
                        )}
                      </div>

                      {/* Right Rating badge */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-lg border border-divider shadow-2xs flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current text-warm-orange" />
                        <span className="font-display font-extrabold text-xs text-headings">{doc.rating}</span>
                        {!isSmall && (
                          <span className="text-[10px] text-gray-550">
                            ({doc.experience} {isEn ? 'Yrs' : isKr ? '년' : isZh ? '年' : isAr ? 'سنة' : 'Th'})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body details */}
                    <div className="p-4.5 space-y-2.5 font-sans">
                      <div>
                        <h3 className="font-sans font-bold text-sm sm:text-base text-headings leading-snug line-clamp-1" title={doc.name}>
                          {doc.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-deep-teal font-semibold mt-0.5 line-clamp-1">
                          {getTranslatedEducation(doc)}
                        </p>
                      </div>

                      <div className="relative group/bio cursor-help">
                        <p className="text-xs sm:text-sm text-gray-555 leading-normal line-clamp-3 h-[4.5rem] hover:text-deep-teal transition-colors">
                          {getTranslatedBio(doc)}
                        </p>
                        {/* Floating Balun Tooltip */}
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover/bio:block z-50 w-72 sm:w-80 p-3 rounded-2xl bg-amber-100/35 backdrop-blur-md border border-amber-300/60 shadow-xl text-gray-800 text-xs font-normal leading-relaxed pointer-events-none transition-all duration-200 animate-fade-in">
                          <div className="font-semibold text-deep-teal text-[11px] mb-1 flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 text-amber-600" />
                            <span>Penjelasan Lengkap Dokter:</span>
                          </div>
                          <p className="text-gray-800 text-xs font-normal whitespace-normal leading-relaxed">
                            {getTranslatedBio(doc)}
                          </p>
                          <div className="absolute left-6 top-full w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-amber-200/50"></div>
                        </div>
                      </div>

                      {/* Micro list attributes */}
                      <div className="pt-2.5 border-t border-divider space-y-1.5 text-xs sm:text-sm text-gray-550">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-yasmin-green shrink-0 mr-2" />
                          <span className="truncate">{doc.schedule.days.map(d => getTranslatedDay(d)).join(', ')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-yasmin-green shrink-0 mr-2" />
                          <span className="font-mono text-xs bg-soft-mint text-deep-teal px-1.5 py-0.5 rounded">{doc.schedule.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA trigger and View Profile buttons */}
                  <div className="p-4.5 pt-1 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorProfile(doc)}
                      className="w-full flex items-center justify-center py-2 bg-gray-50 hover:bg-gray-100 text-headings font-bold font-sans text-xs sm:text-sm rounded-lg border border-divider transition-all cursor-pointer"
                    >
                      {isEn ? "Profile" : isKr ? "프로필" : isZh ? "查看资料" : isAr ? "الملف" : "Lihat Profil"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenBookingWizard(doc.id)}
                      className="w-full flex items-center justify-center space-x-0.5 py-2 bg-gradient-to-r from-deep-teal to-yasmin-green text-white font-bold font-sans text-xs sm:text-sm rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>{isEn ? "Register" : isKr ? "등록" : isZh ? "登记" : isAr ? "تسجيل" : "Daftar"}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Fallback */
          <div className="max-w-md mx-auto text-center py-12 bg-soft-mint rounded-3xl border border-divider">
            <Smile className="h-10 w-10 text-gray-400 mx-auto animate-pulse" />
            <h4 className="font-display font-bold text-headings mt-4">
              Dokter Tidak Ditemukan
            </h4>
            <p className="text-xs text-gray-500 mt-2 px-6 leading-relaxed">
              Maaf, kriteria filter penulisan nama atau jaminan asuransi Anda saat ini belum cocok dengan tim dokter kami. Silakan tekan tombol reset di bawah ini atau hubungi chat WhatsApp untuk bantuan langsung.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('SEMUA');
                setSelectedSubCategory('SEMUA');
                setSortBy('DEFAULT');
              }}
              className="mt-4 px-4 py-2 bg-deep-teal text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-yasmin-green transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

      </div>

      {/* Renders Doctor Profile Detail Modal Overlay ("View Lengkap") */}
      {selectedDoctorProfile && (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden relative border border-divider">
            
            {/* Header block with close button */}
            <div className="bg-gradient-to-r from-headings to-deep-teal p-6 text-white text-left relative">
              <button
                onClick={() => setSelectedDoctorProfile(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-white transition-all cursor-pointer animate-red-blink"
                title="Tutup dialog"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-white/20 flex items-center justify-center p-1">
                  <SafeImage
                    src={selectedDoctorProfile.image}
                    alt={selectedDoctorProfile.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="bg-warm-orange text-headings text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wider">
                      {getTranslatedSpecialty(selectedDoctorProfile.specialty)}
                    </span>
                    {selectedDoctorProfile.subSpecialty && (
                      <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {getTranslatedSubSpecialty(selectedDoctorProfile.subSpecialty)}
                      </span>
                    )}
                    {selectedDoctorProfile.bpjs && (
                      <span className="bg-yasmin-green text-white text-[9px] font-semibold px-2 py-0.5 rounded">
                        {isEn ? "BPJS Available" : isKr ? "BPJS 가능" : isZh ? "可用 BPJS" : isAr ? "متاح BPJS" : "Melayani BPJS"}
                      </span>
                    )}
                    {selectedDoctorProfile.status && selectedDoctorProfile.status !== 'Aktif' && (
                      <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded ${
                        selectedDoctorProfile.status === 'Libur' 
                          ? 'bg-amber-500 text-white shadow-sm' 
                          : 'bg-rose-500 text-white shadow-sm'
                      }`}>
                        {selectedDoctorProfile.status}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-warm-ivory">{selectedDoctorProfile.name}</h3>
                  <p className="text-white/85 text-[11px] font-sans flex items-center">
                    <Award className="h-3 w-3 mr-1 text-warm-orange" />
                    <span>
                      {isEn ? "Active Recovery Partner RS Yasmin" : isKr ? "RS Yasmin 활성 회복 파트너" : isZh ? "RS Yasmin 活跃康复合作伙伴" : isAr ? "شريك التعافي النشط في مستشفى ياسمين" : "Mitra Pemulihan Aktif RS Yasmin"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Grid content */}
            <div className="p-6 sm:p-8 text-left space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Highlight statistics */}
              <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl text-center">
                <div className="border-r border-divider/60">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                    {isEn ? "Experience" : isKr ? "경력" : isZh ? "经验" : isAr ? "الخبرة" : "Pengalaman"}
                  </span>
                  <span className="font-display font-black text-deep-teal text-[15px]">
                    {selectedDoctorProfile.experience} {isEn ? "Years" : isKr ? "년" : isZh ? "年" : isAr ? "سنوات" : "Tahun"}
                  </span>
                </div>
                <div className="border-r border-divider/60">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Rating</span>
                  <span className="font-display font-black text-headings text-[15px] flex items-center justify-center">
                    <Star className="h-3.5 w-3.5 text-warm-orange fill-current mr-0.5" />
                    {selectedDoctorProfile.rating}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                    {isEn ? "BPJS Status" : isKr ? "BPJS 상태" : isZh ? "BPJS 状态" : isAr ? "حالة BPJS" : "Status BPJS"}
                  </span>
                  <span className="font-display font-black text-xs text-gray-700 block mt-0.5">
                    {selectedDoctorProfile.bpjs 
                      ? (isEn ? "✓ Integrated" : isKr ? "✓ 연동됨" : isZh ? "✓ 已整合" : isAr ? "✓ متكامل" : "✓ Terintegrasi")
                      : (isEn ? "General / Private Insurance" : isKr ? "일반 / 개인 보험" : isZh ? "自费 / 商业保险" : isAr ? "عام / تأمين خاص" : "Umum / Asuransi Swasta")
                    }
                  </span>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-headings text-sm uppercase tracking-wide border-b border-divider pb-1">
                  {isEn ? "Clinical Biography & Philosophy of Care" : isKr ? "임상 약력 및 치료 철학" : isZh ? "临床简传与护理理念" : isAr ? "السيرة الطبية وفلسفة الرعاية" : "Biografi Klinis & Filosofi Asuhan"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
                  {getTranslatedBio(selectedDoctorProfile)}
                </p>
              </div>

              {/* Education Background */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-headings text-sm uppercase tracking-wide border-b border-divider pb-1 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1.5 text-deep-teal" />
                  <span>
                    {isEn ? "Educational Background & Alma Mater" : isKr ? "교육 배경 및 출신 대학" : isZh ? "教育背景与毕业院校" : isAr ? "الخلفية التعليمية والجامعة" : "Riwayat Pendidikan Dan Almamater"}
                  </span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed font-sans bg-soft-mint/30 p-3 rounded-xl border border-divider border-dashed">
                  {getTranslatedEducation(selectedDoctorProfile)}
                </p>
              </div>

              {/* Detail Schedule Table */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-headings text-sm uppercase tracking-wide border-b border-divider pb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-deep-teal" />
                  <span>
                    {isEn ? "Main Commitment Practice Schedule" : isKr ? "주요 진료 일정" : isZh ? "主要开诊时间表" : isAr ? "جدول التزام العيادة الرئيسي" : "Jadwal Komitmen Praktek Utama"}
                  </span>
                </h4>
                <div className="bg-gray-55 p-3 rounded-xl border border-divider/60 flex items-center justify-between text-xs font-sans">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-semibold block">
                      {isEn ? "Active Days" : isKr ? "진료일" : isZh ? "开诊日" : isAr ? "الأيام النشطة" : "Hari Aktif"}
                    </span>
                    <span className="font-bold text-headings">{selectedDoctorProfile.schedule.days.map(d => getTranslatedDay(d)).join(', ')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-semibold block">
                      {isEn ? "Consultation Hours" : isKr ? "진료 시간" : isZh ? "咨询时间" : isAr ? "ساعات الاستشارة" : "Jam Konsultasi"}
                    </span>
                    <span className="font-mono font-bold bg-deep-teal text-white px-2 py-0.5 rounded text-[10px]">{selectedDoctorProfile.schedule.hours}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Action CTA bar */}
            <div className="bg-gray-50 px-6 py-4 border-t border-divider flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-sans">
                RS Yasmin Sapa Banyuwangi
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorProfile(null)}
                  className="px-4 py-2 border border-divider text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 cursor-pointer"
                >
                  {isEn ? "Close" : isKr ? "닫기" : isZh ? "关闭" : isAr ? "إغلاق" : "Tutup"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctorProfile(null);
                    onOpenBookingWizard(selectedDoctorProfile.id);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-deep-teal to-yasmin-green hover:from-yasmin-green hover:to-deep-teal text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>
                    {isEn ? "Book Online Consultation" : isKr ? "온라인 상담 예약" : isZh ? "预约在线咨询" : isAr ? "حجز استشارة عبر الإنترنت" : "Daftar Konsultasi Online"}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
