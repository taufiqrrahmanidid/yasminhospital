import React, { useEffect, useState, useMemo } from 'react';
import { 
  LayoutGrid, Image, Youtube, ExternalLink, Clock, Sparkles, Filter, 
  PlayCircle, X, ThumbsUp, Calendar, Eye, Grid3X3, List, Layers, 
  Heart, MessageCircle, Share2, Facebook, Instagram, ChevronDown, RefreshCw
} from 'lucide-react';
import { SafeImage } from '../utils/imageUrl';

interface GalleryItem {
  id: string;
  type: 'Youtube' | 'Tiktok' | 'Instagram' | 'Facebook' | 'Gambar';
  title: string;
  desc: string;
  tag: string; // 'jantung' | 'ibu & anak' | 'kesehatan' | 'penyakit dalam' | 'fasilitas' | 'edukasi'
  image: string; // Thumbnail or background
  embedUrl?: string; // Video URL path
  likes: number;
  comments: number;
  date: string; // Latest 3 months (April - June 2026)
  viewsCount?: string;
  socialUrl: string; // Real social destination
}

const FILTER_FORMATS = [
  { id: 'Semua', name: 'Semua Media' },
  { id: 'Youtube', name: 'YouTube TV' },
  { id: 'Tiktok', name: 'TikTok Feed' },
  { id: 'Instagram', name: 'Instagram Posts' },
  { id: 'Facebook', name: 'Facebook Berita' }
];

const FILTER_TAGS = [
  { id: 'Semua', name: 'Semua Topik' },
  { id: 'jantung', name: 'Jantung Cor' },
  { id: 'kesehatan', name: 'Kesehatan Umum' },
  { id: 'penyakit dalam', name: 'Penyakit Dalam' },
  { id: 'ibu & anak', name: 'Anak & Ibu' },
  { id: 'fasilitas', name: 'Layanan Resort' },
  { id: 'edukasi', name: 'Kegiatan Edukasi' }
];

export default function GallerySection() {
  // [KUNCI PERBAIKAN]: State untuk menyimpan data live dari Backend
  const [liveFeeds, setLiveFeeds] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/social-feed`);
        const result = await res.json();
        
        if (result.success && result.feeds) {
          // [KUNCI PERBAIKAN]: Terjemahkan nama kolom Database agar dimengerti oleh UI Frontend
          const mappedFeeds = result.feeds.map((feed: any) => ({
            id: feed.id,
            type: feed.platform ? feed.platform.charAt(0).toUpperCase() + feed.platform.slice(1).toLowerCase() : 'Gambar', 
            title: feed.title,
            desc: feed.desc,
            tag: feed.tag ? feed.tag.toLowerCase() : 'semua',
            image: feed.thumbnail,
            embedUrl: feed.embedUrl,
            likes: Math.floor(Math.random() * 500) + 100,
            comments: Math.floor(Math.random() * 50) + 10,
            date: feed.dateStr,
            viewsCount: '1.2K',
            socialUrl: feed.url
          }));
          
          setLiveFeeds(mappedFeeds);
        }
      } catch (err) {
        console.error("Gagal menarik data social feed:", err);
      } finally {
        setIsLoadingFeeds(false);
      }
    };
    fetchFeeds();
  }, []);

  const [activeTabFormat, setActiveTabFormat] = useState<string>('Semua');
  const [activeTag, setActiveTag] = useState<string>('Semua');
  const [activeDateFilter, setActiveDateFilter] = useState<string>('Semua');
  const [layoutView, setLayoutView] = useState<'besar' | 'kecil' | 'list'>('besar');
  const [playingVideo, setPlayingVideo] = useState<GalleryItem | null>(null);

  // --- STATE PAGINATION BARU ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Batasi 9 item per halaman

  // Hook untuk memanggil script embed TikTok saat ada video TikTok yang diputar
  React.useEffect(() => {
    if (playingVideo?.type === 'Tiktok') {
      const existingScript = document.getElementById('tiktok-embed-script');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [playingVideo]);

  // YouTube-specific states
  const [activeYoutubeTitleTag, setActiveYoutubeTitleTag] = useState<string>('Semua');
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string | null>(null);

  // Dynamic state for social media links from admin dashboard settings (localStorage)
  const [socialMediaUrls, setSocialMediaUrls] = useState<{ [key: string]: string }>({});

  const loadSocialMediaUrls = () => {
    try {
      const saved = localStorage.getItem('admin_social_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        const map: { [key: string]: string } = {};
        parsed.forEach((item: any) => {
          if (item.platform && item.url) {
            map[item.platform.toLowerCase()] = item.url;
          }
        });
        setSocialMediaUrls(map);
      }
    } catch (e) {
      console.error('Error loading admin_social_media in gallery', e);
    }
  };

  React.useEffect(() => {
    loadSocialMediaUrls();
    window.addEventListener('yasmin_hospital_info_update', loadSocialMediaUrls);
    return () => window.removeEventListener('yasmin_hospital_info_update', loadSocialMediaUrls);
  }, []);

  const galleryItems = useMemo(() => {
    return liveFeeds.map(item => {
      const typeKey = item.type.toLowerCase();
      const fallbackUrl = socialMediaUrls[typeKey];
      
      return {
        ...item,
        socialUrl: item.socialUrl ? item.socialUrl : fallbackUrl 
      };
    });
  }, [liveFeeds, socialMediaUrls]);

  const youtubeChannelUrl = useMemo(() => {
    return socialMediaUrls['youtube'] || 'https://www.youtube.com/@YasminHospitalTV';
  }, [socialMediaUrls]);

  const youtubeHandle = useMemo(() => {
    const url = youtubeChannelUrl;
    try {
      const match = url.match(/@([a-zA-Z0-9_\-.]+)/);
      if (match && match[1]) {
        return `@${match[1]}`;
      }
      const cleanUrl = url.replace(/\/$/, "");
      const segments = cleanUrl.split('/');
      const last = segments[segments.length - 1];
      if (last && last.length > 3 && !last.includes('.')) {
        return last.startsWith('@') ? last : `@${last}`;
      }
    } catch (e) {}
    return '@YasminHospitalTV';
  }, [youtubeChannelUrl]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlayingVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const parseIndoDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const months: { [key: string]: number } = {
      'januari': 0, 'jan': 0, 'februari': 1, 'feb': 1, 'maret': 2, 'mar': 2, 'april': 3, 'apr': 3, 'mei': 4, 'juni': 5, 'jun': 5,
      'juli': 6, 'jul': 6, 'agustus': 7, 'agu': 7, 'ags': 7, 'september': 8, 'sep': 8, 'oktober': 9, 'okt': 9, 'november': 10, 'nov': 10, 'desember': 11, 'des': 11
    };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0]) || 1;
      const monthName = parts[1] || '';
      const year = parseInt(parts[2]) || new Date().getFullYear();
      const monthIndex = months[monthName] !== undefined ? months[monthName] : new Date().getMonth();
      return new Date(year, monthIndex, day);
    }
    return new Date(dateStr);
  };

  const currentDate = new Date(); 

  const matchesDateFilter = (itemDateStr: string, filter: string): boolean => {
    if (filter === 'Semua') return true;
    const date = parseIndoDate(itemDateStr);
    const diffTime = currentDate.getTime() - date.getTime();
    const diffDays = Math.abs(diffTime / (1000 * 60 * 60 * 24));

    if (filter === 'Pekan Ini') return diffDays <= 7;
    if (filter === 'Bulan Ini') return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    if (filter === 'Bulan Lalu') {
      let prevMonth = currentDate.getMonth() - 1;
      let year = currentDate.getFullYear();
      if (prevMonth < 0) { prevMonth = 11; year--; }
      return date.getMonth() === prevMonth && date.getFullYear() === year;
    }
    if (filter === '3 Bulan Lalu') return diffDays <= 92;
    return true;
  };

  const dynamicYoutubeTags = useMemo(() => {
    const ytItems = galleryItems.filter(item => item.type === 'Youtube');
    const candidates = [
      'ERACS', 'Jantung', 'Diabetes', 'Laparoskopi', 'Anak', 
      'Stroke', 'Saraf', 'Fasilitas', 'Nyeri', 'Gigi', 
      'Donor Darah', 'Hipertensi', 'Gizi'
    ];
    const found = new Set<string>();
    ytItems.forEach(item => {
      candidates.forEach(cand => {
        if (item.title.toLowerCase().includes(cand.toLowerCase())) {
          found.add(cand);
        }
      });
    });
    return ['Semua', ...Array.from(found)];
  }, [galleryItems]);

  const filteredYoutubeItems = useMemo(() => {
    const ytItems = galleryItems.filter(item => item.type === 'Youtube');
    if (activeYoutubeTitleTag === 'Semua') return ytItems;
    return ytItems.filter(item => 
      item.title.toLowerCase().includes(activeYoutubeTitleTag.toLowerCase())
    );
  }, [activeYoutubeTitleTag, galleryItems]);

  // General Filtered Items
  const processedItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchFormat = activeTabFormat === 'Semua' || item.type === activeTabFormat;
      const matchTag = activeTag === 'Semua' || item.tag === activeTag;
      const matchDate = matchesDateFilter(item.date, activeDateFilter);
      return matchFormat && matchTag && matchDate;
    });
  }, [activeTabFormat, activeTag, activeDateFilter, galleryItems]);

  // --- LOGIKA PAGINATION DINAMIS ---
  const totalPages = Math.ceil(processedItems.length / itemsPerPage) || 1;
  
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedItems.slice(indexOfFirstItem, indexOfLastItem);
  // ---------------------------------

  return (
    <section id="gallery-v2" className="py-20 bg-warm-ivory text-left min-h-screen">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <span className="font-display text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-white border border-divider px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-3xs">
            <Sparkles className="h-3 w-3 text-warm-orange animate-spin-slow" />
            ARSIP DIGITAL RS YASMIN (TIGA BULAN TERAKHIR)
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-headings leading-tight tracking-tight">
            Galeri Media & Edukasi Visual Teranyar
          </h2>
          <p className="text-gray-600 font-sans text-base sm:text-lg w-full text-center leading-relaxed">
            Edukasi klinis terpopuler dari tim spesialis RS Yasmin Banyuwangi. Temukan video kesehatan TikTok, webinar Youtube, liputan baksos Facebook, hingga update pelayanan Instagram premium terbaru.
          </p>
        </div>

        {/* Toggle Collapse Filter Interface */}
        <div className="flex justify-between items-center bg-soft-mint/40 border border-divider px-5 py-3 rounded-2xl w-full mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
            <span className="font-display text-[10px] sm:text-xs font-bold text-headings tracking-widest uppercase">
              PANEL FILTER GALERI & SOSIAL MEDIA
            </span>
          </div>
          <button
            id="btn-collapse-gallery-filters"
            onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
            className="px-3.5 py-2 bg-white hover:bg-[#0B4F4A] hover:text-white text-deep-teal border border-divider rounded-xl font-display text-xs font-bold transition-all duration-300 cursor-pointer flex items-center shadow-sm hover:scale-110"
            title={isFilterCollapsed ? "Buka Panel Filter" : "Lipat Panel Filter"}
          >
            <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${isFilterCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Unified Interactive Control Center */}
        <div className={`${isFilterCollapsed ? 'hidden' : 'block'} bg-white p-5 rounded-3xl border border-divider shadow-xs space-y-3.5 transition-all duration-300`}>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            
            {/* Format Channels Filter */}
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Format Platform Sosial:</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_FORMATS.map((fOpt) => {
                  const isActive = activeTabFormat === fOpt.id;
                  return (
                    <button
                      key={fOpt.id}
                      onClick={() => { setActiveTabFormat(fOpt.id); setCurrentPage(1); }}
                      className={`px-4 py-2 rounded-xl font-display text-xs font-bold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-headings border-headings text-white shadow-xs'
                          : 'bg-gray-50/70 text-gray-500 border-transparent hover:bg-soft-mint hover:text-headings'
                      }`}
                    >
                      {fOpt.id === 'Youtube' && <Youtube className="h-3.5 w-3.5 inline mr-1.5" />}
                      {fOpt.id === 'Tiktok' && (
                        <svg className="h-3.5 w-3.5 inline mr-1.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.74-.22-.23-.41-.47-.58-.73v7.2c.11 5.26-4.14 9.61-9.43 9.27-4.1-.25-7.58-3.66-7.82-7.76-.35-5.91 4.79-10.42 10.47-9.3v4.02c-3.15-.47-6.04 1.83-6.19 5.01-.17 3.52 3.01 6.39 6.47 5.76 2.37-.44 4.01-2.61 3.92-5.01.01-4.22-.01-8.44.01-12.65z"/>
                        </svg>
                      )}
                      {fOpt.id === 'Instagram' && <Instagram className="h-3.5 w-3.5 inline mr-1.5" />}
                      {fOpt.id === 'Facebook' && <Facebook className="h-3.5 w-3.5 inline mr-1.5" />}
                      <span>{fOpt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Style Swapper */}
            <div className="space-y-1 lg:text-right shrink-0">
              <p className="text-[10px] font-mono font-bold text-gray-400 lg:text-right uppercase tracking-widest block">Tampilan Layout:</p>
              <div className="bg-gray-100/70 p-1 rounded-xl inline-flex items-center gap-1 border border-divider">
                <button
                  onClick={() => setLayoutView('besar')}
                  aria-label="Grid Besar"
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    layoutView === 'besar' ? 'bg-white text-deep-teal shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayoutView('kecil')}
                  aria-label="Grid Kecil"
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    layoutView === 'kecil' ? 'bg-white text-deep-teal shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayoutView('list')}
                  aria-label="Listview"
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    layoutView === 'list' ? 'bg-white text-deep-teal shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-divider/50 pt-3 flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest shrink-0">Filter Topik:</p>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto select-none py-1">
              {FILTER_TAGS.map((tagOpt) => {
                const isSelected = activeTag === tagOpt.id;
                return (
                  <button
                    key={tagOpt.id}
                    onClick={() => { setActiveTag(tagOpt.id); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-full text-[10px] font-display font-black tracking-wider transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-deep-teal border-deep-teal text-white shadow-3xs'
                        : 'bg-gray-50 hover:bg-soft-mint border-divider/50 text-gray-500 hover:text-headings'
                    }`}
                  >
                    #{tagOpt.name.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-divider/50 pt-3 flex items-center space-x-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest shrink-0">Periode Waktu:</p>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto select-none py-1">
              {[
                { id: 'Semua', name: 'Semua' },
                { id: 'Pekan Ini', name: 'Pekan Ini 📅' },
                { id: 'Bulan Ini', name: 'Bulan Ini 🌙' },
                { id: 'Bulan Lalu', name: 'Bulan Lalu 🍂' },
                { id: '3 Bulan Lalu', name: '3 Bulan Terakhir 🪵' }
              ].map((dateOpt) => {
                const isSelected = activeDateFilter === dateOpt.id;
                return (
                  <button
                    key={dateOpt.id}
                    onClick={() => { setActiveDateFilter(dateOpt.id); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-full text-[10px] font-display font-black tracking-wider transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B4F4A] border-headings text-white shadow-3xs'
                        : 'bg-gray-50 hover:bg-soft-mint border-divider/50 text-gray-500 hover:text-headings'
                    }`}
                  >
                    {dateOpt.name.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {activeTabFormat === 'Youtube' ? (
          /* Specialized YouTube Section */
          <div className="space-y-10 animate-fade-in">
            {/* YouTube Brand Banner & Channel Profile */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-5 z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-red-500 overflow-hidden bg-white shrink-0 shadow-lg">
                  <SafeImage 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=200" 
                    alt="Yasmin Hospital TV" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-white">Yasmin Hospital TV</h3>
                    <span className="bg-red-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">Official</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400">{youtubeHandle} • Channel Edukasi Medis RS Yasmin</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>{filteredYoutubeItems.length} Video Terdaftar</span>
                    <span>•</span>
                    <span>Banyuwangi, Indonesia</span>
                  </p>
                </div>
              </div>
              <a 
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="z-10 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-display text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
              >
                <Youtube className="h-4 w-4" />
                <span>Kunjungi Channel</span>
              </a>
            </div>

            {/* Dynamic Title Filter Tags */}
            <div className="space-y-3 bg-white p-6 rounded-3xl border border-divider">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-red-500" />
                <p className="text-xs font-display font-extrabold text-headings tracking-wider uppercase">Filter Berdasarkan Judul Video (Tag Dinamis):</p>
              </div>
              <div className="flex flex-wrap gap-2 select-none">
                {dynamicYoutubeTags.map((tag) => {
                  const isSelected = activeYoutubeTitleTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveYoutubeTitleTag(tag);
                        setSelectedYoutubeId(null);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-2xl text-xs font-display font-black tracking-wide border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 border-red-600 text-white shadow-md scale-103 animate-scale-up'
                          : 'bg-gray-50 hover:bg-red-50 border-divider text-gray-600 hover:text-red-600'
                      }`}
                    >
                      {tag === 'Semua' ? '🔴 SEMUA TOPIK' : `#${tag.toUpperCase()}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION YOUTUBE DENGAN PAGINATION DINAMIS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-divider/60 pb-3">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-red-600" />
                  <h4 className="font-display font-bold text-lg text-headings">
                    Daftar Video YouTube ({filteredYoutubeItems.length} Total)
                  </h4>
                </div>
                <span className="text-xs font-mono text-gray-500 bg-white border border-divider px-2.5 py-1 rounded-full">
                  Halaman {currentPage} dari {totalPages}
                </span>
              </div>

              {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentItems.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white border border-divider/90 rounded-3xl overflow-hidden hover:shadow-[0_0_24px_rgba(239,68,68,0.20)] hover:border-red-500 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative overflow-hidden bg-slate-100 border-divider/50 h-52 shrink-0">
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[8.5px] font-mono font-bold px-2.5 py-1.5 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/10 select-none">
                          <Youtube className="h-3.5 w-3.5 text-white" />
                          <span>YOUTUBE TV</span>
                        </span>

                        <div 
                          onClick={() => setPlayingVideo(item)}
                          className="absolute inset-0 bg-black/35 backdrop-blur-3xs flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <PlayCircle className="h-12 w-12 text-white drop-shadow-lg transform hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-display font-extrabold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full uppercase">
                              #{item.tag}
                            </span>
                            <div className="h-1 w-1 bg-gray-300 rounded-full" />
                            <span className="text-[10px] font-mono text-gray-400">{item.date}</span>
                          </div>
                          <h4 className="font-display font-bold text-sm text-headings leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-500 font-sans text-xs leading-relaxed line-clamp-3">
                            {item.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-divider/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPlayingVideo(item)}
                              className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3.5 py-1.5 rounded-xl font-display text-[10px] font-black tracking-wide transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <PlayCircle className="h-3 w-3" />
                              <span>Putar</span>
                            </button>
                            <a
                              href={item.socialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-100 hover:bg-gray-200 text-headings px-3 py-1.5 rounded-xl font-display text-[10px] font-bold tracking-wide transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>Asli</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center py-12 bg-white rounded-3xl border border-divider shadow-3xs space-y-3">
                  <Youtube className="h-8 w-8 text-gray-300 mx-auto" />
                  <h4 className="font-display font-bold text-sm text-headings">Tidak ada video ditemukan</h4>
                  <p className="text-xs text-gray-400">Silakan ganti filter judul/topik di atas.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* General Non-Youtube View dengan Pagination */
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-divider/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-warm-orange" />
                  <h3 className="font-display font-medium text-lg text-headings">
                    Menampilkan {processedItems.length} Saluran / Konten Tersedia
                  </h3>
                </div>
                <span className="text-xs font-mono text-gray-500 bg-white border border-divider px-2.5 py-1 rounded-full">
                  Halaman {currentPage} dari {totalPages}
                </span>
              </div>

              {currentItems.length > 0 ? (
                <div className={
                  layoutView === 'besar'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : layoutView === 'kecil'
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-4"
                }>
                  {currentItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`bg-white border border-divider/90 rounded-3xl overflow-hidden hover:shadow-[0_0_24px_rgba(16,185,129,0.30)] hover:border-emerald-500 hover:scale-[1.01] transition-all duration-300 flex ${
                        layoutView === 'list' ? 'flex-col md:flex-row' : 'flex-col justify-between'
                      }`}
                    >
                      <div className={`relative overflow-hidden bg-slate-100 border-divider/50 shrink-0 ${
                        layoutView === 'list' 
                          ? 'w-full md:w-72 h-44 border-r border-b md:border-b-0' 
                          : layoutView === 'kecil' 
                          ? 'h-40' 
                          : 'h-52'
                      }`}>
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />

                        <span className="absolute top-3 left-3 bg-headings/95 text-warm-ivory text-[8.5px] font-mono font-bold px-2.5 py-1.5 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/10 select-none">
                          {item.type === 'Youtube' && <Youtube className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                          {item.type === 'Instagram' && <Instagram className="h-3.5 w-3.5 text-pink-400 shrink-0" />}
                          {item.type === 'Facebook' && <Facebook className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                          {item.type === 'Tiktok' && (
                            <svg className="h-3.5 w-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.74-.22-.23-.41-.47-.58-.73v7.2c.11 5.26-4.14 9.61-9.43 9.27-4.1-.25-7.58-3.66-7.82-7.76-.35-5.91 4.79-10.42 10.47-9.3v4.02c-3.15-.47-6.04 1.83-6.19 5.01-.17 3.52 3.01 6.39 6.47 5.76 2.37-.44 4.01-2.61 3.92-5.01.01-4.22-.01-8.44.01-12.65z"/>
                            </svg>
                          )}
                          <span>{item.type.toUpperCase()}</span>
                        </span>

                        {(item.type === 'Youtube' || item.type === 'Tiktok') ? (
                          <div 
                            onClick={() => setPlayingVideo(item)}
                            className="absolute inset-0 bg-black/35 backdrop-blur-3xs flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <PlayCircle className="h-10 w-10 text-warm-orange drop-shadow-md transform hover:scale-110 transition-transform" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-display font-extrabold text-deep-teal bg-soft-mint px-2 py-0.5 rounded-full uppercase">
                              #{item.tag}
                            </span>
                            <div className="h-1 w-1 bg-gray-300 rounded-full" />
                            <span className="text-[10px] font-mono text-gray-400">{item.date}</span>
                          </div>
                          <h4 className="font-display font-bold text-sm text-headings leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-500 font-sans text-xs leading-relaxed line-clamp-3">
                            {item.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-divider/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {(item.type === 'Youtube' || item.type === 'Tiktok') && (
                              <button
                                onClick={() => setPlayingVideo(item)}
                                className="bg-soft-mint hover:bg-deep-teal hover:text-white text-deep-teal px-3 py-1.5 rounded-xl font-display text-[10px] font-black tracking-wide transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <PlayCircle className="h-3 w-3" />
                                <span>Putar</span>
                              </button>
                            )}
                            <a
                              href={item.socialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-warm-orange/15 hover:bg-warm-orange text-headings px-3 py-1.5 rounded-xl font-display text-[10px] font-bold tracking-wide transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>Lihat Asli</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-divider shadow-3xs space-y-3">
                  <Eye className="h-8 w-8 text-gray-300 mx-auto" />
                  <h4 className="font-display font-bold text-sm text-headings">Item tidak ditemukan</h4>
                  <p className="text-xs text-gray-400">Silakan ganti filter platform / topik Anda.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- KOMPONEN TOMBOL NAVIGASI PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-8 pb-4 border-t border-gray-200 mt-8">
            <button
              onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              Sebelumnya
            </button>

            <div className="flex items-center space-x-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => { setCurrentPage(pageNumber); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNumber
                      ? 'bg-deep-teal text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE INTERACTIVE MEDIA MODAL */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-headings/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-divider shadow-2xl w-full max-w-2xl overflow-hidden relative text-left">
            
            <div className="p-5 bg-soft-mint border-b border-divider flex items-center justify-between">
              <div>
                <span className="bg-deep-teal text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  KOMUNITAS {playingVideo.type.toUpperCase()} PREVIEW
                </span>
                <h4 className="font-display font-bold text-sm text-headings mt-1 truncate max-w-md">
                  {playingVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-full text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-600 hover:text-red-600" />
              </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center relative overflow-y-auto overflow-x-hidden">
              {playingVideo.embedUrl ? (
                playingVideo.type === 'Tiktok' ? (
                  <div className="w-full h-full flex justify-center items-center bg-white">
                    <blockquote 
                      className="tiktok-embed" 
                      cite={playingVideo.socialUrl} 
                      data-video-id={playingVideo.embedUrl.split('/').pop()} 
                      style={{ maxWidth: '605px', minWidth: '325px' }} 
                    >
                      <section>
                        <a target="_blank" title="@yasminhospital" href={playingVideo.socialUrl}>
                          Memuat video TikTok...
                        </a>
                      </section>
                    </blockquote>
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src={playingVideo.embedUrl}
                    title={playingVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                )
              ) : (
                <div className="relative w-full h-full bg-[#161616] flex flex-col items-center justify-center text-center p-6 text-white font-sans">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                    {playingVideo.type === 'Tiktok' && (
                      <svg className="h-6 w-6 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.74-.22-.23-.41-.47-.58-.73v7.2c.11 5.26-4.14 9.61-9.43 9.27-4.1-.25-7.58-3.66-7.82-7.76-.35-5.91 4.79-10.42 10.47-9.3v4.02c-3.15-.47-6.04 1.83-6.19 5.01-.17 3.52 3.01 6.39 6.47 5.76 2.37-.44 4.01-2.61 3.92-5.01.01-4.22-.01-8.44.01-12.65z"/>
                      </svg>
                    )}
                    {playingVideo.type === 'Instagram' && <Instagram className="h-6 w-6 text-white" />}
                    {playingVideo.type === 'Facebook' && <Facebook className="h-6 w-6 text-white" />}
                  </div>

                  <p className="font-bold text-sm tracking-wider">Simulasi Feed {playingVideo.type}</p>
                  <p className="text-gray-400 mt-1 max-w-sm text-xs leading-relaxed">
                    Konten ini diposting di {playingVideo.type} resmi RS Yasmin Banyuwangi pada {playingVideo.date}.
                  </p>

                  <a
                    href={playingVideo.socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 px-5 py-2.5 bg-warm-orange text-headings rounded-xl font-bold text-xs tracking-wider transition-transform hover:scale-103"
                  >
                    Buka Saluran Utama Resmi
                  </a>
                </div>
              )}
            </div>

            <div className="p-5 bg-gray-50 border-t border-divider space-y-2">
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{playingVideo.desc}</p>
              <div className="flex items-center text-[10px] text-gray-400 space-x-3 pt-1">
                <span>Tanggal: {playingVideo.date}</span>
                <span>•</span>
                <span>Kategori: #{playingVideo.tag}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
