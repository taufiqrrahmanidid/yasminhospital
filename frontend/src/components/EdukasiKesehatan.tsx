import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, ArrowRight, X, Clock, User } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  category: string;
  author: string;
  publishedAt: string;
}

export default function EdukasiKesehatan() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const API_BASE = import.meta.env.VITE_BACKEND_URL;
        // Tarik HANYA artikel yang berstatus isPublished: true
        const res = await fetch(`${API_BASE}/api/public/articles`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setArticles(data);
        }
      } catch (err) {
        console.error("Gagal menarik artikel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return null; // Sembunyikan jika masih loading
  if (articles.length === 0) return null; // Sembunyikan bagian ini jika Admin belum membuat artikel satupun

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden" id="edukasi-kesehatan">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-soft-mint rounded-full filter blur-3xl opacity-20 -z-10" />
      
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="inline-flex items-center space-x-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              RS Yasmin Blog
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-headings tracking-tight">
              Artikel &amp; Edukasi Medis
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              Kumpulan berita, tips kesehatan, dan artikel medis yang ditulis dan dikurasi langsung oleh tim profesional RS Yasmin Banyuwangi.
            </p>
          </div>
        </div>

        {/* Daftar Artikel (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map((article) => (
            <div 
              key={article.id} 
              className="bg-white rounded-3xl border border-divider overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group flex flex-col cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {article.coverImage ? (
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BookOpen className="h-10 w-10 opacity-30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-deep-teal text-[10px] font-bold px-3 py-1.5 rounded-full uppercase shadow-sm border border-white/50">
                  {article.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-mono font-medium mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-headings leading-snug group-hover:text-deep-teal transition-colors mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 font-sans">
                  {article.content}
                </p>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-display shadow-inner">
                      {article.author.slice(0, 1).toUpperCase()}
                    </div>
                    <span>{article.author}</span>
                  </div>
                  <span className="text-deep-teal text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Baca <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL BACA ARTIKEL FULLSCREEN */}
      {/* ========================================================= */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in" onClick={() => setSelectedArticle(null)}>
          <div 
            className="bg-white w-full sm:max-w-3xl sm:rounded-3xl h-[90vh] sm:h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-divider flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <span className="font-display font-black text-xs uppercase tracking-widest text-deep-teal bg-soft-mint px-3 py-1 rounded-full">
                {selectedArticle.category}
              </span>
              <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {selectedArticle.coverImage && (
                <div className="w-full h-48 sm:h-72 bg-slate-100 relative">
                  <img src={selectedArticle.coverImage} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              
              <div className="p-6 sm:p-10 max-w-2xl mx-auto -mt-10 relative z-10 bg-white rounded-t-3xl sm:rounded-none">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-headings leading-tight mb-4">
                  {selectedArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-mono border-b border-divider pb-6 mb-6">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {selectedArticle.author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 3 Min Read</span>
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 font-sans leading-loose">
                  {/* Gunakan pre-wrap agar enter/paragraf dari textarea Admin tetap terjaga bentuknya */}
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
