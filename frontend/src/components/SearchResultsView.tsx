import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, ArrowRight, BookOpen, Heart, Activity, FileText, Layout, 
  CheckCircle, Video, Phone, Shield, Layers, Settings, Compass, 
  HelpCircle, UserCheck, Calendar, MapPin, Sparkles, Inbox, X
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { performGlobalSearch, CATEGORY_LABELS, SearchResultItem } from '../utils/searchIndexer';
import { Doctor } from '../types';

interface SearchResultsViewProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  doctorsList: Doctor[];
  setActiveTab: (tab: any) => void;
  activeTab: string;
}

export default function SearchResultsView({
  searchTerm,
  onSearchChange,
  doctorsList,
  setActiveTab,
  activeTab
}: SearchResultsViewProps) {
  const currentLangCode = useLanguage();
  const isEn = currentLangCode === 'EN';
  const isKr = currentLangCode === 'KR';
  const isZh = currentLangCode === 'ZH';
  const isAr = currentLangCode === 'AR';

  // State to filter by selected category from left sidebar. "ALL" means all categories.
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Perform search
  const allResults = useMemo(() => {
    return performGlobalSearch(searchTerm, currentLangCode, doctorsList);
  }, [searchTerm, currentLangCode, doctorsList]);

  // Count matches per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize all known search categories with 0
    Object.keys(CATEGORY_LABELS).forEach((catKey) => {
      counts[catKey] = 0;
    });

    allResults.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return counts;
  }, [allResults]);

  // Filtered results based on sidebar selection
  const filteredResults = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') {
      return allResults;
    }
    return allResults.filter(item => item.category === selectedCategoryFilter);
  }, [allResults, selectedCategoryFilter]);

  // Translate static labels
  const t = {
    title: isEn ? 'Global Search Results' : isKr ? '글로벌 검색 결과' : isZh ? '全局搜索结果' : isAr ? 'نتائج البحث الشامل' : 'Hasil Pencarian Global',
    subtitle: isEn ? 'Searching across all pages, services, clinicians and articles' : isKr ? '모든 페이지, 서비스, 임상의 및 기사 검색' : isZh ? '正在检索所有页面、临床服务和文章数据' : isAr ? 'البحث في جميع الصفحات والخدمات والأطباء والمقالات' : 'Mencari di seluruh halaman, layanan medis, tim dokter, dan artikel kesehatan RSU Yasmin',
    emptyTitle: isEn ? 'No results found' : isKr ? '검색 결과가 없습니다' : isZh ? '未找到相关结果' : isAr ? 'لم يتم العثور على نتائج' : 'Tidak Ada Hasil Ditemukan',
    emptyDesc: isEn ? 'We couldn\'t find any matching words. Try typing another keyword.' : isKr ? '일치하는 단어를 찾을 수 없습니다. 다른 키워드를 입력해 보세요.' : isZh ? '未能找到包含该关键词的内容。请尝试输入其他词汇。' : isAr ? 'لم نتمكن من العثور على أي كلمات مطابقة. يرجى تجربة كلمات مفتاحية أخرى.' : 'Kami tidak menemukan kata yang cocok untuk pencarian Anda. Silakan coba kata kunci lain.',
    allPages: isEn ? 'All Pages' : isKr ? '모든 페이지' : isZh ? '所有页面' : isAr ? 'جميع الصفحات' : 'Semua Halaman',
    showing: isEn ? 'Showing' : isKr ? '표시 중' : isZh ? '正在显示' : isAr ? 'عرض' : 'Menampilkan',
    resultsFor: isEn ? 'results for' : isKr ? '개의 결과, 검색어:' : isZh ? '个结果，关键词:' : isAr ? 'نتائج لـ' : 'hasil untuk',
    visitBtn: isEn ? 'Visit Section' : isKr ? '페이지 방문' : isZh ? '访问此版块' : isAr ? 'زيارة القسم' : 'Kunjungi Halaman',
    clearSearch: isEn ? 'Clear Search' : isKr ? '검색 지우기' : isZh ? '清除搜索' : isAr ? 'مسح البحث' : 'Hapus Pencarian',
    tipsTitle: isEn ? 'Search Tips' : isKr ? '검색 팁' : isZh ? '搜索小建议' : isAr ? 'نصائح البحث' : 'Tips Pencarian',
    tip1: isEn ? 'Make sure all words are spelled correctly.' : isKr ? '철자가 정확한지 확인해 보세요.' : isZh ? '请确保所有词汇拼写正确。' : 'Pastikan ejaan kata yang Anda cari sudah benar.',
    tip2: isEn ? 'Try more general keywords (e.g. "IGD", "ERACS", "Dokter").' : isKr ? '더 광범위한 키워드를 입력해 보세요 (예: "응급실", "의사").' : isZh ? '尝试输入更通用的词（例如：“急诊”、“医生”）。' : 'Coba gunakan kata kunci yang lebih umum (misalnya: "IGD", "ERACS", "Dokter").',
    tip3: isEn ? 'Switch languages if you are looking for specific regional terms.' : isKr ? '특정 언어 용어를 찾으려면 언어를 변경해 보세요.' : isZh ? '如果您在寻找特定的多语言内容，可以尝试切换界面语言。' : 'Ubah pilihan bahasa di kanan atas jika mencari istilah khusus dalam bahasa tertentu.'
  };

  // Helper to get category icons for left sidebar
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BERANDA': return <Compass className="h-4 w-4" />;
      case 'DOKTER': return <UserCheck className="h-4 w-4" />;
      case 'PUSAT KESEHATAN': return <Activity className="h-4 w-4" />;
      case 'FASILITAS': return <Layers className="h-4 w-4" />;
      case 'KOMUNITAS': return <Heart className="h-4 w-4" />;
      case 'TENTANG KAMI': return <BookOpen className="h-4 w-4" />;
      case 'GALLERY': return <Video className="h-4 w-4" />;
      case 'YASMIN_KIDS': return <Sparkles className="h-4 w-4 text-pink-500" />;
      case 'DONOR_DARAH': return <Inbox className="h-4 w-4 text-red-500" />;
      case 'YASMIN_SQUAD': return <Phone className="h-4 w-4 text-indigo-500" />;
      case 'YASMIN_WOMENS': return <Shield className="h-4 w-4 text-teal-500" />;
      case 'PENDAFTARAN': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Handle navigating to the target section
  const handleNavigateToResult = (targetTab: string, targetAnchor?: string) => {
    // 1. Clear search first to close SearchResultsView
    onSearchChange('');
    
    // 2. Set the target tab
    setActiveTab(targetTab);

    // 3. Scroll to the anchor if specified
    if (targetAnchor) {
      setTimeout(() => {
        const el = document.getElementById(targetAnchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Apply a gentle highlight flash effect
          el.classList.add('ring-4', 'ring-yasmin-green/40', 'transition-all', 'duration-500', 'rounded-2xl');
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-yasmin-green/40');
          }, 3000);
        }
      }, 350);
    } else {
      // Scroll to top of the page if no specific anchor
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Highlight matching keyword in the snippet
  const renderHighlightedText = (text: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-amber-900 font-bold px-0.5 rounded-xs border-b-2 border-amber-400">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-deep-teal to-yasmin-green rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12">
          <Search className="h-80 w-80" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4 border border-white/10 font-black">
            <Search className="h-3 w-3" />
            <span>Search Results Indexer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-white/80 font-sans text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
            {t.subtitle}
          </p>

          {/* Quick Query Info & Clear */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs sm:text-sm bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-2">
              <span>{t.showing} <strong>{allResults.length}</strong> {t.resultsFor}:</span>
              <span className="text-yellow-300 font-mono">"{searchTerm}"</span>
            </span>
            <button
              onClick={() => onSearchChange('')}
              className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-xl border border-red-500 shadow-md transition-all flex items-center space-x-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t.clearSearch}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Navigation & Submenu Recap */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-4 sticky top-24">
            <h3 className="font-display font-black text-sm uppercase text-headings tracking-wider mb-4 pb-2 border-b-2 border-slate-50 flex items-center justify-between">
              <span>REKAP NAVIGASI</span>
              <span className="bg-soft-mint text-deep-teal font-mono text-xs px-2 py-0.5 rounded-full font-bold">
                {allResults.length}
              </span>
            </h3>

            {/* Sidebar Buttons */}
            <div className="space-y-1 font-sans">
              
              {/* All Pages Button */}
              <button
                onClick={() => setSelectedCategoryFilter('ALL')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategoryFilter === 'ALL'
                    ? 'bg-deep-teal text-white shadow-md'
                    : 'text-gray-600 hover:bg-slate-50 hover:text-headings'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layout className="h-4.5 w-4.5" />
                  <span>{t.allPages}</span>
                </div>
                <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  selectedCategoryFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-500'
                }`}>
                  {allResults.length}
                </span>
              </button>

              <div className="h-2" />
              
              {/* Individual Category Buttons */}
              {Object.entries(CATEGORY_LABELS).map(([catKey, labels]) => {
                const label = labels[currentLangCode] || labels.ID;
                const count = categoryCounts[catKey] || 0;
                const isActive = selectedCategoryFilter === catKey;

                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategoryFilter(catKey)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-soft-mint text-deep-teal border border-yasmin-green/20 font-extrabold shadow-2xs'
                        : count === 0
                        ? 'opacity-45 text-gray-400 pointer-events-none'
                        : 'text-gray-600 hover:bg-slate-50 hover:text-headings'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate max-w-[80%]">
                      <span className={isActive ? 'text-yasmin-green' : 'text-gray-400'}>
                        {getCategoryIcon(catKey)}
                      </span>
                      <span className="truncate">{label}</span>
                    </div>
                    <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-deep-teal text-white' : 'bg-slate-50 text-gray-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Badge */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-divider">
              <h4 className="text-xs font-bold text-headings flex items-center space-x-1.5 mb-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-deep-teal" />
                <span>Navigasi Instan</span>
              </h4>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed font-sans">
                Klik salah satu menu di atas untuk menyaring hasil pencarian di sebelah kanan berdasarkan modul/halaman website.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Results List */}
        <div className="lg:col-span-3">
          
          {filteredResults.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="bg-slate-50 p-6 rounded-full text-gray-400 mb-6 border-2 border-slate-100">
                <Inbox className="h-12 w-12" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-headings mb-2">
                {t.emptyTitle}
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed font-sans mb-8">
                {t.emptyDesc}
              </p>

              {/* Tips block */}
              <div className="bg-soft-mint/40 rounded-2xl border border-yasmin-green/10 p-6 max-w-lg text-left w-full">
                <h4 className="font-display font-bold text-xs sm:text-sm text-deep-teal uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                  <span>{t.tipsTitle}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                  <li className="flex items-start space-x-2">
                    <span className="text-yasmin-green font-bold shrink-0">✓</span>
                    <span>{t.tip1}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yasmin-green font-bold shrink-0">✓</span>
                    <span>{t.tip2}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yasmin-green font-bold shrink-0">✓</span>
                    <span>{t.tip3}</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* RESULTS LIST */
            <div className="space-y-4">
              {filteredResults.map((item, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                    key={item.id}
                    className="bg-white rounded-2xl border-2 border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex-1 min-w-0 text-left">
                      {/* Breadcrumbs Path */}
                      <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-deep-teal/80 mb-2">
                        <span>RS Yasmin</span>
                        <span>&gt;</span>
                        <span className="bg-soft-mint px-2 py-0.5 rounded-full text-deep-teal font-extrabold">
                          {item.categoryLabel}
                        </span>
                      </div>

                      {/* Result Title */}
                      <h3 className="font-display font-black text-sm sm:text-base md:text-lg text-headings leading-tight group-hover:text-deep-teal transition-colors">
                        {renderHighlightedText(item.title)}
                      </h3>

                      {/* Result Snippet with context */}
                      <p className="text-xs sm:text-sm text-gray-500 font-sans mt-2 leading-relaxed italic border-l-3 border-yasmin-green/20 pl-3">
                        {renderHighlightedText(item.snippet)}
                      </p>
                    </div>

                    {/* Visit Page Button */}
                    <button
                      onClick={() => handleNavigateToResult(item.targetTab, item.targetAnchor)}
                      className="shrink-0 inline-flex items-center justify-center space-x-1.5 bg-deep-teal hover:bg-slate-900 text-white font-display text-xs font-black tracking-wide uppercase px-4 py-2.5 rounded-xl shadow-md transition-all self-start md:self-center cursor-pointer"
                    >
                      <span>{t.visitBtn}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
