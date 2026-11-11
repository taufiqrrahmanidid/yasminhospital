import { APP_TRANSLATIONS, HERO_TRANSLATIONS, GREEN_HEALING_TRANSLATIONS, FOOTER_TRANSLATIONS } from '../translations';
import { ABOUT_TRANSLATIONS } from '../translations_about';
import { LOCALIZED_FACILITIES } from '../translations_facilities';
import { EXTRA_TRANSLATIONS } from '../translations_extra';
import { HEALTH_CENTERS, ARTICLES_DATA, COMMUNITY_CLUBS } from '../data';
import { HEALTH_CENTERS_TRANSLATIONS } from '../components/HealthCenters';
import { DOCTORS_TRANSLATIONS } from '../translations_doctors';
import { Doctor } from '../types';

export interface SearchResultItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  snippet: string;
  targetTab: string;
  targetAnchor?: string;
}

// Map key activeTab values to multi-language labels for sidebar
export const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  BERANDA: {
    ID: 'Beranda & Utama',
    EN: 'Home & Main',
    KR: '홈 & 메인',
    ZH: '首页与主页',
    AR: 'الرئيسية والعامة'
  },
  DOKTER: {
    ID: 'Temukan Dokter',
    EN: 'Find Doctors',
    KR: '의사 찾기',
    ZH: '寻找医生',
    AR: 'البحث عن طبيب'
  },
  'PUSAT KESEHATAN': {
    ID: 'Pusat Layanan Medis',
    EN: 'Medical Centers',
    KR: '의료 센터',
    ZH: '医疗中心',
    AR: 'المراكز الطبية'
  },
  FASILITAS: {
    ID: 'Fasilitas & Kamar Inap',
    EN: 'Facilities & Wards',
    KR: '시설 및 병동',
    ZH: '医院设施与病房',
    AR: 'المرافق والغرف'
  },
  KOMUNITAS: {
    ID: 'Klub Komunitas & Tips',
    EN: 'Community Clubs & Tips',
    KR: '커뮤니티 클럽 및 팁',
    ZH: '社区俱乐部与健康贴士',
    AR: 'الأندية الصحية والنصائح'
  },
  'TENTANG KAMI': {
    ID: 'Tentang Kami & Artikel',
    EN: 'About Us & Articles',
    KR: '회사 소개 및 기사',
    ZH: '关于我们与健康文章',
    AR: 'من نحن والمقالات'
  },
  GALLERY: {
    ID: 'Galeri Foto & Video',
    EN: 'Photo & Video Gallery',
    KR: '사진 및 비디오 갤러리',
    ZH: '照片与视频画廊',
    AR: 'معرض الصور والفيديو'
  },
  YASMIN_KIDS: {
    ID: 'Yasmin Kids Clinic',
    EN: 'Yasmin Kids Clinic',
    KR: '야스민 키즈 클리닉',
    ZH: '雅斯敏儿童诊所',
    AR: 'عيادة ياسمين للأطفال'
  },
  DONOR_DARAH: {
    ID: 'Donor Darah & Panduan',
    EN: 'Blood Donation Guide',
    KR: '헌혈 및 안내',
    ZH: '献血与指南',
    AR: 'التبرع بالدم والإرشاد'
  },
  YASMIN_SQUAD: {
    ID: 'Yasmin Squad Remaja',
    EN: 'Yasmin Squad Youth',
    KR: '야스민 스쿼드 청소년',
    ZH: '雅斯敏青少年健康',
    AR: 'فريق ياسمin للشباب'
  },
  YASMIN_WOMENS: {
    ID: 'Yasmin Women\'s Clinic',
    EN: 'Yasmin Women\'s Clinic',
    KR: '야스민 여성 클리닉',
    ZH: '雅斯敏女性妇产诊所',
    AR: 'عيادة ياسمين للمرأة'
  },
  PENDAFTARAN: {
    ID: 'Pendaftaran Online',
    EN: 'Online Registration',
    KR: '온라인 등록',
    ZH: '在线挂号登记',
    AR: 'التسجيل الإلكتروني'
  }
};

export function performGlobalSearch(
  query: string,
  lang: 'ID' | 'EN' | 'KR' | 'ZH' | 'AR',
  doctorsList: Doctor[]
): SearchResultItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery || normalizedQuery.length < 1) return [];

  const results: SearchResultItem[] = [];

  // Helper to check and generate a snippet with match highlighting
  const addIfMatches = (
    text: string,
    title: string,
    category: string,
    targetTab: string,
    targetAnchor?: string,
    idPrefix?: string
  ) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    const idx = lowerText.indexOf(normalizedQuery);
    if (idx !== -1) {
      // Create a nice context snippet
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + normalizedQuery.length + 60);
      let snippet = text.substring(start, end).replace(/\n/g, ' ');
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';

      // Generate a unique ID to avoid key issues in mapping
      const id = `${category}-${idPrefix || title.replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`;

      const categoryLabel = CATEGORY_LABELS[category]?.[lang] || category;

      results.push({
        id,
        category,
        categoryLabel,
        title,
        snippet,
        targetTab,
        targetAnchor
      });
    }
  };

  // 1. BERANDA (Home)
  // Search HERO_TRANSLATIONS and GREEN_HEALING_TRANSLATIONS
  const heroT = HERO_TRANSLATIONS[lang] || HERO_TRANSLATIONS.ID;
  if (heroT) {
    Object.entries(heroT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Beranda > ${key}`, 'BERANDA', 'BERANDA');
      }
    });
  }

  const greenT = GREEN_HEALING_TRANSLATIONS[lang] || GREEN_HEALING_TRANSLATIONS.ID;
  if (greenT) {
    Object.entries(greenT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Beranda > Green Healing > ${key}`, 'BERANDA', 'BERANDA', 'green-healing');
      }
    });
  }

  // 2. DOKTER (Find Doctor)
  doctorsList.forEach((doc) => {
    // Check doctor name
    addIfMatches(doc.name, `Dokter > ${doc.name}`, 'DOKTER', 'DOKTER', `doctor-card-${doc.id}`, `doc-name-${doc.id}`);
    
    // Check specialty and subspecialty
    addIfMatches(doc.specialty, `Dokter > ${doc.name}`, 'DOKTER', 'DOKTER', `doctor-card-${doc.id}`, `doc-spec-${doc.id}`);
    if (doc.subSpecialty) {
      addIfMatches(doc.subSpecialty, `Dokter > ${doc.name}`, 'DOKTER', 'DOKTER', `doctor-card-${doc.id}`, `doc-subspec-${doc.id}`);
    }

    // Check Bio
    const bioText = doc.bio;
    addIfMatches(bioText, `Dokter > ${doc.name} (Bio)`, 'DOKTER', 'DOKTER', `doctor-card-${doc.id}`, `doc-bio-${doc.id}`);

    const transBio = DOCTORS_TRANSLATIONS[doc.id]?.[lang]?.bio;
    if (transBio) {
      addIfMatches(transBio, `Dokter > ${doc.name} (Bio)`, 'DOKTER', 'DOKTER', `doctor-card-${doc.id}`, `doc-trans-bio-${doc.id}`);
    }

    // Check Schedule summary
    if (doc.schedule) {
      const daysStr = Array.isArray(doc.schedule.days) ? doc.schedule.days.join(', ') : '';
      const hoursStr = doc.schedule.hours || '';
      addIfMatches(`${daysStr} ${hoursStr}`, `Dokter > Jadwal ${doc.name}`, 'DOKTER', 'DOKTER', `doctor-card-${doc.id}`, `doc-sch-${doc.id}`);
    }
  });

  // 3. PUSAT KESEHATAN (Health Centers)
  HEALTH_CENTERS.forEach((hc) => {
    // Base English/ID properties
    addIfMatches(hc.title, `Pusat Kesehatan > ${hc.title}`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-title-${hc.id}`);
    addIfMatches(hc.shortDesc, `Pusat Kesehatan > ${hc.title}`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-short-${hc.id}`);
    addIfMatches(hc.longDesc, `Pusat Kesehatan > ${hc.title}`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-long-${hc.id}`);
    
    // Check health center translations
    const translated = HEALTH_CENTERS_TRANSLATIONS[hc.id]?.[lang];
    if (translated) {
      if (translated.title) addIfMatches(translated.title, `Pusat Kesehatan > ${translated.title}`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-trans-title-${hc.id}`);
      if (translated.shortDesc) addIfMatches(translated.shortDesc, `Pusat Kesehatan > ${translated.title || hc.title}`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-trans-short-${hc.id}`);
      if (translated.longDesc) addIfMatches(translated.longDesc, `Pusat Kesehatan > ${translated.title || hc.title}`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-trans-long-${hc.id}`);
      
      if (Array.isArray(translated.benefits)) {
        translated.benefits.forEach((benefit: string, bIdx: number) => {
          addIfMatches(benefit, `Pusat Kesehatan > ${translated.title || hc.title} > Benefits`, 'PUSAT KESEHATAN', 'PUSAT KESEHATAN', `center-card-${hc.id}`, `hc-trans-benefit-${hc.id}-${bIdx}`);
        });
      }
    }
  });

  // 4. FASILITAS (Facilities)
  // Search facilities from LOCALIZED_FACILITIES
  const facilitiesForLang = LOCALIZED_FACILITIES[lang] || LOCALIZED_FACILITIES.ID;
  if (facilitiesForLang) {
    Object.entries(facilitiesForLang).forEach(([key, f]) => {
      addIfMatches(f.name, `Fasilitas > ${f.name}`, 'FASILITAS', 'FASILITAS', `facility-${key}`, `fac-name-${key}`);
      addIfMatches(f.desc, `Fasilitas > ${f.name}`, 'FASILITAS', 'FASILITAS', `facility-${key}`, `fac-desc-${key}`);
      if (Array.isArray(f.highlights)) {
        f.highlights.forEach((hl, idx) => {
          addIfMatches(hl, `Fasilitas > ${f.name} > Sorotan`, 'FASILITAS', 'FASILITAS', `facility-${key}`, `fac-hl-${key}-${idx}`);
        });
      }
      if (Array.isArray(f.features)) {
        f.features.forEach((feat, idx) => {
          addIfMatches(feat, `Fasilitas > ${f.name} > Layanan`, 'FASILITAS', 'FASILITAS', `facility-${key}`, `fac-feat-${key}-${idx}`);
        });
      }
    });
  }

  // 5. KOMUNITAS (Community)
  const komunitasT = EXTRA_TRANSLATIONS.KOMUNITAS[lang] || EXTRA_TRANSLATIONS.KOMUNITAS.ID;
  if (komunitasT) {
    Object.entries(komunitasT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Komunitas > ${key}`, 'KOMUNITAS', 'KOMUNITAS', undefined, `kom-trans-${key}`);
      }
    });
  }

  COMMUNITY_CLUBS.forEach((club) => {
    addIfMatches(club.name, `Komunitas > ${club.name}`, 'KOMUNITAS', 'KOMUNITAS', `club-card-${club.id}`, `club-name-${club.id}`);
    addIfMatches(club.description, `Komunitas > ${club.name}`, 'KOMUNITAS', 'KOMUNITAS', `club-card-${club.id}`, `club-desc-${club.id}`);
    club.benefits.forEach((benefit, idx) => {
      addIfMatches(benefit, `Komunitas > ${club.name} > Manfaat`, 'KOMUNITAS', 'KOMUNITAS', `club-card-${club.id}`, `club-benefit-${club.id}-${idx}`);
    });
  });

  // 6. TENTANG KAMI (About Us)
  const aboutT = ABOUT_TRANSLATIONS[lang] || ABOUT_TRANSLATIONS.ID;
  if (aboutT) {
    Object.entries(aboutT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Tentang Kami > ${key}`, 'TENTANG KAMI', 'TENTANG KAMI', undefined, `about-trans-${key}`);
      }
    });
  }

  // Health Articles (Edukasi Kesehatan)
  ARTICLES_DATA.forEach((article) => {
    addIfMatches(article.title, `Tentang Kami > Artikel > ${article.title}`, 'TENTANG KAMI', 'TENTANG KAMI', `article-card-${article.id}`, `art-title-${article.id}`);
    addIfMatches(article.content, `Tentang Kami > Artikel > ${article.title}`, 'TENTANG KAMI', 'TENTANG KAMI', `article-card-${article.id}`, `art-body-${article.id}`);
    addIfMatches(article.author, `Tentang Kami > Artikel > ${article.title}`, 'TENTANG KAMI', 'TENTANG KAMI', `article-card-${article.id}`, `art-author-${article.id}`);
  });

  // 7. GALLERY (Gallery)
  GALLERY_DATA.forEach((item) => {
    addIfMatches(item.title, `Galeri > ${item.title}`, 'GALLERY', 'GALLERY', `gallery-item-${item.id}`, `gal-title-${item.id}`);
    addIfMatches(item.desc, `Galeri > ${item.title}`, 'GALLERY', 'GALLERY', `gallery-item-${item.id}`, `gal-desc-${item.id}`);
    addIfMatches(item.tag, `Galeri > ${item.title}`, 'GALLERY', 'GALLERY', `gallery-item-${item.id}`, `gal-tag-${item.id}`);
  });

  // 8. YASMIN KIDS
  const kidT = EXTRA_TRANSLATIONS.SQUAD?.[lang] || EXTRA_TRANSLATIONS.SQUAD?.ID; // Using extra translations if any
  // Yasmin Kids specific keys
  if (EXTRA_TRANSLATIONS.PENDAFTARAN?.[lang]) {
    // Kids and minor sub-sections often have items. We can search EXTRA_TRANSLATIONS keys to gather general content.
  }

  // 9. DONOR DARAH (Donor Darah)
  const donorT = EXTRA_TRANSLATIONS.DONOR?.[lang] || EXTRA_TRANSLATIONS.DONOR?.ID;
  if (donorT) {
    Object.entries(donorT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Donor Darah > ${key}`, 'DONOR_DARAH', 'DONOR_DARAH', undefined, `donor-${key}`);
      }
    });
  }

  // 10. YASMIN SQUAD (Yasmin Squad Remaja)
  const squadT = EXTRA_TRANSLATIONS.SQUAD?.[lang] || EXTRA_TRANSLATIONS.SQUAD?.ID;
  if (squadT) {
    Object.entries(squadT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Yasmin Squad > ${key}`, 'YASMIN_SQUAD', 'YASMIN_SQUAD', undefined, `squad-${key}`);
      }
    });
  }

  // 11. YASMIN WOMENS (Yasmin Women's Clinic)
  const womensT = EXTRA_TRANSLATIONS.WOMENS?.[lang] || EXTRA_TRANSLATIONS.WOMENS?.ID;
  if (womensT) {
    Object.entries(womensT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Yasmin Womens > ${key}`, 'YASMIN_WOMENS', 'YASMIN_WOMENS', undefined, `womens-${key}`);
      }
    });
  }

  // 12. PENDAFTARAN (Online Registration)
  const regT = EXTRA_TRANSLATIONS.PENDAFTARAN?.[lang] || EXTRA_TRANSLATIONS.PENDAFTARAN?.ID;
  if (regT) {
    Object.entries(regT).forEach(([key, val]) => {
      if (typeof val === 'string') {
        addIfMatches(val, `Pendaftaran > ${key}`, 'PENDAFTARAN', 'PENDAFTARAN', undefined, `reg-${key}`);
      }
    });
  }

  // Sort results: matches in titles come first
  return results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    const bTitleMatch = b.title.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    return bTitleMatch - aTitleMatch;
  });
}
