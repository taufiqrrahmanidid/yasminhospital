import React, { useState, useMemo, useEffect } from 'react';
import { Star, Search, Filter, ArrowUpDown, ExternalLink, X, Check, CheckCircle2, MessageSquareWarning, Plus, Trash2, Paperclip, UploadCloud, FileText } from 'lucide-react';
import { SafeImage } from '../utils/imageUrl';
import { fetchPublishedGoogleReviews } from '../lib/googleReviewsService';

interface Review {
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
  dateStr: string;
  verified: boolean;
  criteria?: {
    [key: string]: number;
  };
}

export default function TestimonialSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleStats, setGoogleStats] = useState<{ averageRating: string; totalReviews: number }>({
    averageRating: '0.0',
    totalReviews: 0
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // State untuk Form Saran
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [kesan, setKesan] = useState<'Sangat Puas' | 'Puas' | 'Cukup' | 'Kurang Puas' | 'Kecewa'>('Puas');
  const [messagesList, setMessagesList] = useState<Array<{ id: number; jenisPesan: 'Saran' | 'Masukan' | 'Keluhan' | 'Perbaikan'; unitLayanan: string; rating: number; isiPesan: string }>>([
    { id: Date.now(), jenisPesan: 'Saran', unitLayanan: 'General', rating: 5, isiPesan: '' }
  ]);
  const [attachments, setAttachments] = useState<Array<{ name: string; size: number; type: string; dataUrl?: string }>>([]);
  const [fileError, setFileError] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<any>(null);
  const [selectedOldReview, setSelectedOldReview] = useState<Review | null>(null);
  const [successToast, setSuccessToast] = useState('');

  // =========================================================================
  // FETCH STATISTIK GOOGLE & ULASAN
  // =========================================================================
  useEffect(() => {
    const loadGoogleStats = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/google-stats');
        if (res.ok) {
          const data = await res.json();
          setGoogleStats({
            // Gunakan Number() untuk memastikan tidak error saat toFixed dipanggil
            averageRating: Number(data.averageRating || 0).toFixed(1),
            totalReviews: data.totalReviews || 0
          });
        }
      } catch (err) {
        console.error('Gagal memuat statistik Google:', err);
      }
    };
    loadGoogleStats();
  }, []);

  useEffect(() => {
    const loadLiveReviews = async () => {
      try {
        const liveReviews = await fetchPublishedGoogleReviews();
        if (liveReviews && liveReviews.length > 0) {
          const mapped: Review[] = liveReviews.map(r => ({
            name: r.authorName,
            role: 'Ulasan Resmi di Google Maps',
            comment: r.comment,
            rating: r.rating,
            avatar: r.authorPhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(r.authorName),
            dateStr: r.dateStr,
            verified: true
          }));
          setReviews(mapped);
        }
      } catch (err) {
        console.error('Gagal memuat ulasan publik:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLiveReviews();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsWriteModalOpen(false);
        setSelectedOldReview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // =========================================================================
  // LOGIKA FILTER & SORTING
  // =========================================================================
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r => r.name.toLowerCase().includes(query) || r.comment.toLowerCase().includes(query)
      );
    }

    if (selectedRating !== 'all') {
      result = result.filter(r => r.rating >= Number(selectedRating));
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, searchQuery, selectedRating, sortBy]);

  const gridReviews = useMemo(() => processedReviews.slice(0, 9), [processedReviews]);
  const listReviews = useMemo(() => processedReviews.slice(9), [processedReviews]);

  // =========================================================================
  // HANDLERS FORM SARAN
  // =========================================================================
    const handleSaranSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) return;

    const invalidMessage = messagesList.find(m => !m.isiPesan.trim());
    if (invalidMessage) {
      alert("Silakan isi semua isi pesan yang Anda tambahkan.");
      return;
    }

    const uniqueId = `SPD-${Math.floor(10000 + Math.random() * 90000)}`;
    const formattedTime = new Date().toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const payload = {
      patientId: patientId.trim(),
      kesan,
      messages: messagesList.map(m => ({ 
        jenisPesan: m.jenisPesan, 
        unitLayanan: m.unitLayanan, 
        rating: m.rating, 
        isiPesan: m.isiPesan.trim() 
      })),
      attachments: attachments.map(a => ({ 
        name: a.name, 
        size: a.size, 
        type: a.type, 
        dataUrl: a.dataUrl 
      }))
    };

    try {
      // 👇 Tembak API Backend
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Gagal mengirim laporan ke server.');

      // Jika berhasil, tampilkan struk
      const receiptData = {
        id: uniqueId, // Hanya untuk tampilan struk
        ...payload,
        timestamp: formattedTime
      };

      setSubmittedReceipt(receiptData);
      setIsWriteModalOpen(false);
      
      // Reset Form
      setPatientId(''); 
      setKesan('Puas'); 
      setMessagesList([{ id: Date.now(), jenisPesan: 'Saran', unitLayanan: 'General', rating: 5, isiPesan: '' }]); 
      setAttachments([]); 
      setFileError('');
      
      setSuccessToast(`Laporan ${uniqueId} berhasil terkirim ke pihak manajemen RS!`);
      setTimeout(() => setSuccessToast(''), 8000);
      
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim laporan. Periksa koneksi internet Anda.');
    }
  };

  const processFiles = (files: FileList) => {
    setFileError('');
    const newAttachments: Array<{ name: string; size: number; type: string; dataUrl?: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 2 * 1024 * 1024) { setFileError(`Berkas "${file.name}" melebihi 2MB.`); continue; }
      const fileObj: any = { name: file.name, size: file.size, type: file.type };
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => { fileObj.dataUrl = reader.result as string; setAttachments(prev => [...prev, fileObj]); };
        reader.readAsDataURL(file);
      } else { newAttachments.push(fileObj); }
    }
    if (newAttachments.length > 0) setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) processFiles(e.target.files); };
  const handleRemoveAttachment = (idx: number) => setAttachments(prev => prev.filter((_, i) => i !== idx));
  const handleAddMessageRow = () => setMessagesList(prev => [...prev, { id: Date.now(), jenisPesan: 'Saran', unitLayanan: 'General', rating: 5, isiPesan: '' }]);
  const handleRemoveMessageRow = (id: number) => { if (messagesList.length > 1) setMessagesList(prev => prev.filter(m => m.id !== id)); };
  const handleMessageChange = (id: number, field: string, value: any) => setMessagesList(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  return (
    <div className="space-y-8 text-left" id="testimonial-interactive-module">
      
      {/* 1. Header Google Maps Statistics Dashboard Card */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white border border-slate-700/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">GOOGLE MAPS PLATFORM INTEGRATION</p>
          </div>
          <h4 className="font-display font-black text-2xl tracking-tight text-white leading-tight">
            Transparansi Ulasan Pasien & Google Sync RS Yasmin
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-sans">
            Sistem evaluasi kepuasan pasien secara otentik. Ulasan di bawah ini ditarik langsung dari Google Maps Business API dan telah diverifikasi oleh tim medis kami.
          </p>
        </div>

        {/* Visual score display */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center space-x-5 shrink-0 w-full md:w-auto justify-between sm:justify-start">
          <div className="text-left">
            <span className="text-4xl font-display font-black block text-warm-orange">
              {googleStats.averageRating}
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 mt-1 block">
              Rata-rata Rating
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex text-warm-orange">
              {[1, 2, 3, 4, 5].map(idx => (
                <Star key={idx} className={`h-4 w-4 ${idx <= Math.round(Number(googleStats.averageRating)) ? 'fill-current' : 'text-gray-600'}`} />
              ))}
            </div>
            <p className="text-xs text-slate-300 font-sans font-bold">
              Berdasar {googleStats.totalReviews.toLocaleString('id-ID')} Google Reviews
            </p>
            <a href="https://maps.app.goo.gl/iaPiCgibdPYahRnr9" target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center space-x-1 outline-none mt-1">
              <span>Buka Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Interactive Toolbars */}
      <div className="bg-white border border-divider p-4.5 sm:p-5 rounded-2xl shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ulasan berdasarkan kata kunci..."
            className="w-full text-xs font-sans pl-10 pr-4 py-3 border border-divider rounded-xl focus:outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal bg-slate-50/50 text-slate-705"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-divider px-3 py-2 rounded-xl text-xs font-sans">
            <Filter className="h-3.5 w-3.5 text-gray-500" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="bg-transparent focus:outline-none text-gray-700 font-bold cursor-pointer"
            >
              <option value="all">Semua Bintang</option>
              <option value="5">Bintang 5</option>
              <option value="4">Bintang 4 ke atas</option>
              <option value="3">Bintang 3 ke atas</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-divider px-3 py-2 rounded-xl text-xs font-sans">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none text-gray-700 font-bold cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="highest">Rating Tertinggi</option>
              <option value="lowest">Rating Terendah</option>
            </select>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="cursor-pointer px-4 py-3 bg-gradient-to-r from-deep-teal to-yasmin-green text-white rounded-xl font-display text-xs font-black tracking-wider shadow-xs hover:shadow-md transition-all flex items-center space-x-1.5"
          >
            <MessageSquareWarning className="h-3.5 w-3.5 shrink-0" />
            <span>Saran & Pengaduan</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-600 text-white rounded-xl p-4 text-xs font-sans font-bold flex items-center justify-between shadow-md animate-fade-in-up">
          <div className="flex items-center space-x-2.5">
            <Check className="h-4.5 w-4.5 bg-white/20 p-0.5 rounded-full" />
            <span className="flex-1 text-left">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')}><X className="h-4 w-4 hover:opacity-80" /></button>
        </div>
      )}

      {/* ========================================================
          GRID VIEW: 9 NEWEST REVIEWS
         ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-divider pb-2.5">
          <h5 className="font-display font-bold text-xs sm:text-sm text-headings tracking-wide uppercase flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yasmin-green block animate-pulse" />
            <span>Ulasan Google Maps Terbaru</span>
          </h5>
          <span className="text-[10px] font-mono font-bold bg-soft-mint px-2.5 py-1 rounded-full text-deep-teal">
            Menampilkan {gridReviews.length} Ulasan
          </span>
        </div>

        {loading ? (
           <div className="text-center py-10">
             <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
             <p className="text-gray-500 font-bold text-sm">Memuat data dari Google Maps...</p>
           </div>
        ) : gridReviews.length === 0 ? (
          <div className="bg-slate-50 border border-divider rounded-3xl p-8 text-center text-gray-400">
            <p className="text-xs">Belum ada ulasan yang ditampilkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridReviews.map((review, idx) => (
              <div key={idx} className="bg-white border border-divider hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.55)] transition-all duration-300 rounded-xl p-5 sm:p-6 flex flex-col justify-between group text-left relative">
                <span className="absolute top-3 right-5 text-4xl text-gray-100 font-serif leading-none italic select-none">“</span>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-warm-orange">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-750 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-full uppercase shrink-0">
                      Gmaps Verified 
                    </span>
                  </div>

                  <p className="text-[13.5px] text-gray-650 leading-relaxed font-sans text-justify line-clamp-4">
                    "{review.comment}"
                  </p>

                  <button onClick={() => setSelectedOldReview(review)} className="cursor-pointer text-deep-teal hover:text-emerald-700 text-[10px] font-bold tracking-wider uppercase block mt-1 transition-all">
                    Selengkapnya &rarr;
                  </button>
                </div>

                <div className="pt-4 border-t border-divider/40 mt-5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 text-left min-w-0">
                    <SafeImage src={review.avatar} alt={review.name} className="w-9 h-9 rounded-full border border-divider object-cover shrink-0" />
                    <div className="min-w-0">
                      <h5 className="font-display font-bold text-xs text-headings leading-none truncate">{review.name}</h5>
                      <span className="text-[8.5px] text-gray-400 font-medium block mt-1 truncate max-w-[130px]">{review.role}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="text-[9px] text-gray-400 font-mono">
                      {new Date(review.dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          LIST / TABLE VIEW: EXTRA REVIEWS
         ======================================================== */}
      {listReviews.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-divider" id="patient-comprehensive-table">
          <div className="flex items-center justify-between">
            <h5 className="font-sans font-bold text-sm sm:text-base text-headings uppercase flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-deep-teal" />
              <span>Daftar Ulasan Pasien Lainnya ({listReviews.length} Ulasan)</span>
            </h5>
          </div>

          <div className="bg-white border border-divider rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-divider text-[10px] font-mono uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-4 sm:px-5">Pasien / Tanggal</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Layanan</th>
                    <th className="py-3 px-4">Kutipan Ulasan</th>
                    <th className="py-3 px-4 text-center">Penilaian</th>
                    <th className="py-3 px-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {listReviews.map((review, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors text-xs">
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        <div className="font-display font-bold text-headings">{review.name}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5 font-mono">
                          {new Date(review.dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="text-gray-700 font-medium font-sans truncate max-w-[130px]">Google Maps</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs md:max-w-md truncate">
                        <p className="text-gray-600 line-clamp-1 italic text-[13px]">"{review.comment}"</p>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex text-warm-orange">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button onClick={() => setSelectedOldReview(review)} className="cursor-pointer text-xs bg-soft-mint text-deep-teal hover:bg-[#0B4F4A] hover:text-white px-2.5 py-1 rounded-lg font-bold transition-all border border-divider hover:border-transparent">
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Form Saran */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-headings/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-divider shadow-2xl max-w-2xl w-full overflow-hidden text-left animate-fade-in-down flex flex-col justify-between max-h-[92vh]">
            <div className="p-5 border-b border-divider flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <MessageSquareWarning className="h-5 w-5 text-deep-teal animate-bounce" />
                <h4 className="font-display font-black text-sm text-headings uppercase tracking-wider">Review & Saran</h4>
              </div>
              <button onClick={() => setIsWriteModalOpen(false)} className="cursor-pointer p-1.5 rounded-full transition-all bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaranSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono">
                    Nomor Rekam Medis / ID <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input type="text" required placeholder="Contoh: RM-98754" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full text-xs p-3 border border-divider rounded-xl bg-white focus:border-deep-teal text-headings font-sans font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono">
                    Kesan Umum <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select value={kesan} onChange={(e) => setKesan(e.target.value as any)} className="w-full text-xs p-3 border border-divider rounded-xl bg-white focus:border-deep-teal text-headings font-sans font-medium cursor-pointer">
                    <option value="Sangat Puas">😊 Sangat Puas</option>
                    <option value="Puas">🙂 Puas</option>
                    <option value="Cukup">😐 Cukup</option>
                    <option value="Kurang Puas">🙁 Kurang Puas</option>
                    <option value="Kecewa">😡 Kecewa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-divider pb-1.5">
                  <label className="text-[10px] font-black text-deep-teal uppercase tracking-widest block font-mono">Daftar Pesan ({messagesList.length})</label>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {messagesList.map((msg, index) => (
                    <div key={msg.id} className="bg-slate-50/80 p-4 rounded-2xl border border-divider shadow-3xs space-y-3 relative group">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider/50 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#0B4F4A] text-white font-mono text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold">{index + 1}</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pesan Ke-{index + 1}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <select value={msg.jenisPesan} onChange={(e) => handleMessageChange(msg.id, 'jenisPesan', e.target.value)} className="text-[11px] py-1 px-2 border border-divider rounded-lg bg-white cursor-pointer">
                            <option value="Saran">💡 Saran</option>
                            <option value="Masukan">📝 Masukan</option>
                            <option value="Keluhan">⚠️ Keluhan</option>
                          </select>
                          <select value={msg.unitLayanan} onChange={(e) => handleMessageChange(msg.id, 'unitLayanan', e.target.value)} className="text-[11px] py-1 px-2 border border-divider rounded-lg bg-white cursor-pointer">
                            {['General', 'Farmasi', 'Gizi', 'IGD', 'Kamar', 'Rawat Inap', 'Rawat Jalan'].map((opt) => (
                              <option key={opt} value={opt}>🏥 {opt}</option>
                            ))}
                          </select>
                          <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-divider">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => handleMessageChange(msg.id, 'rating', star)} className="cursor-pointer hover:scale-110">
                                <Star className={`h-3 w-3 ${star <= msg.rating ? 'fill-current text-warm-orange' : 'text-gray-200'}`} />
                              </button>
                            ))}
                          </div>
                          {messagesList.length > 1 && (
                            <button type="button" onClick={() => handleRemoveMessageRow(msg.id)} className="cursor-pointer p-1 rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 className="h-4.5 w-4.5" /></button>
                          )}
                        </div>
                      </div>
                      <textarea required rows={2} value={msg.isiPesan} onChange={(e) => handleMessageChange(msg.id, 'isiPesan', e.target.value)} placeholder={`Tulis isi ${msg.jenisPesan.toLowerCase()}...`} className="w-full text-xs p-3 border border-divider rounded-xl bg-white" />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddMessageRow} className="cursor-pointer w-full py-2.5 bg-slate-50 hover:bg-teal-50 text-slate-600 text-xs font-bold tracking-wider rounded-xl border border-dashed border-gray-300 flex items-center justify-center space-x-1.5">
                  <Plus className="h-4 w-4" /> <span>+ Tambah Pesan Lain</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Upload Lampiran (Opsional)</label>
                <div className="border-2 border-dashed border-gray-200 hover:border-deep-teal bg-slate-50/50 rounded-2xl p-5 text-center cursor-pointer relative group">
                  <input type="file" multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="space-y-2 pointer-events-none">
                    <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-deep-teal mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Klik untuk memilih berkas</p>
                  </div>
                </div>
                {fileError && <p className="text-[11px] font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">⚠️ {fileError}</p>}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 border border-divider rounded-xl p-2.5 text-xs">
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="h-4.5 w-4.5 text-deep-teal" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveAttachment(idx)} className="cursor-pointer text-rose-500"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="cursor-pointer w-full py-3.5 bg-gradient-to-r from-deep-teal to-yasmin-green text-white text-xs font-bold tracking-wider rounded-xl uppercase flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4" /> <span>Kirim Laporan</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Detail Viewer of a Review */}
      {selectedOldReview && (
        <div className="fixed inset-0 bg-headings/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-divider shadow-2xl max-w-lg w-full overflow-hidden text-left animate-fade-in-down">
            <div className="p-5 border-b border-divider flex items-center justify-between bg-slate-50">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-100 px-3 py-1 rounded-full text-emerald-805">Google Verified Review Card</span>
              <button onClick={() => setSelectedOldReview(null)} className="cursor-pointer p-1.5 rounded-full text-rose-500 hover:bg-rose-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-5 text-left">
              <div className="flex items-center space-x-3.5">
                <SafeImage src={selectedOldReview.avatar} alt={selectedOldReview.name} className="w-11 h-11 rounded-full border border-divider object-cover shrink-0" />
                <div>
                  <h4 className="font-display font-black text-sm text-headings leading-none">{selectedOldReview.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium font-sans">{selectedOldReview.role}</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-divider rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex text-warm-orange">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < selectedOldReview.rating ? 'fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {new Date(selectedOldReview.dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Teks Ulasan Pasien:</p>
                <p className="text-[13.5px] text-gray-700 leading-relaxed font-sans border-l-4 border-yasmin-green pl-4 py-1 text-justify">
                  "{selectedOldReview.comment}"
                </p>
              </div>
              <button onClick={() => setSelectedOldReview(null)} className="cursor-pointer w-full py-3 bg-[#0B4F4A] hover:bg-[#073633] text-white rounded-xl text-xs font-bold uppercase transition-colors text-center font-display">
                Tutup Arsip Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}