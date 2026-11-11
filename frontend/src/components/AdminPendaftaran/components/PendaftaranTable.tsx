import React from 'react';
import type { Pendaftaran } from '../types';
import StatusBadge from './StatusBadge';
import { 
  Calendar, 
  User, 
  Camera, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  QrCode,
  Stethoscope,
  CreditCard,
  Banknote,
  Smartphone,
  Clock
} from 'lucide-react';

interface Props {
  items: Pendaftaran[];
  loading: boolean;
  onSelect: (item: Pendaftaran) => void;
  selectedId?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

const STATUS_EDGE: Record<string, string> = {
  baru: 'border-l-amber-500',
  diverifikasi: 'border-l-emerald-600',
  dijadwalkan: 'border-l-teal-600',
  selesai: 'border-l-blue-600',
  dibatalkan: 'border-l-rose-500',
};

export default function PendaftaranTable({ 
  items, 
  loading, 
  onSelect,
  selectedId,
  currentPage,
  pageSize,
  onPageChange
}: Props) {
  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#0B4F4A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Memuat Antrean Pasien...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-2">
        <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <User className="h-6 w-6" />
        </div>
        <h3 className="font-display font-bold text-gray-700 text-sm">Tidak Ada Data Pendaftaran</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Belum ada pasien yang sesuai dengan pencarian atau filter Anda saat ini.
        </p>
      </div>
    );
  }

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = items.slice(startIdx, endIdx);

  // Helper pembersih nomor HP (LID WhatsApp)
  const formatDisplayPhone = (phone?: string) => {
    if (!phone) return '-';
    const clean = phone.replace('@lid', '').replace('@c.us', '');
    if (clean.length >= 14 && clean.startsWith('2')) {
      return 'Akun WA (Privasi LID)';
    }
    return clean;
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAF9] border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono select-none">
              <th className="py-4 px-5">Info Tiket</th>
              <th className="py-4 px-5">Identitas Pasien</th>
              <th className="py-4 px-5">Klinis &amp; Jadwal</th>
              <th className="py-4 px-5">Pembayaran & Biaya</th>
              <th className="py-4 px-5 text-center">SIMRS (Booking)</th>
              <th className="py-4 px-5 text-center">Status</th>
              <th className="py-4 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-sans bg-white">
            {currentItems.map((item) => {
              const isCurrentActive = item.id === selectedId;
              
              // Helper variables
              const hasFoto = (item as any).buktiTransferDikirim || (item as any).buktiTransferImage;
              const isTransfer = (item as any).metodePembayaran === 'transfer';
              const initial = item.patientName ? item.patientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'PX';
              const doctorName = (item as any).selectedDoctorName || item.selectedDoctorId;
              const poliName = (item as any).selectedPoli || item.serviceType || 'Poli Umum';
              const antrianNum = (item as any).antrian;
              const kodeBooking = (item as any).kodeBooking;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`transition-all cursor-pointer group select-none ${
                    isCurrentActive
                      ? 'bg-[#E6F4F1] border-l-4 border-l-[#0B4F4A] shadow-xs'
                      : `hover:bg-gray-50/80 ${STATUS_EDGE[item.status] || 'border-l-gray-300'}`
                  }`}
                >
                  {/* 1. TIKET & WAKTU */}
                  <td className="py-4 px-5 whitespace-nowrap align-top">
                    <div className="space-y-1.5">
                      <span className="font-mono font-bold text-[#0B4F4A] bg-[#E6F4F1] px-2 py-1 rounded-md border border-[#A7D7CD] block w-max">
                        {item.id}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono block">
                        Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* 2. IDENTITAS PASIEN */}
                  <td className="py-4 px-5 align-top min-w-[200px]">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B4F4A] to-[#147970] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {initial}
                      </div>
                      <div className="space-y-1">
                        <div className="font-extrabold text-gray-900 text-[13px] group-hover:text-[#0B4F4A] transition-colors leading-tight">
                          {item.patientName}
                        </div>
                        <div className="flex items-center text-gray-500 font-mono text-[10.5px]">
                          <Smartphone className="h-3 w-3 mr-1" />
                          {formatDisplayPhone(item.phone)}
                        </div>
                        <div className="pt-0.5">
                          <span className="inline-block bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                            Pasien {(item as any).patientStatus || 'Baru'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 3. KLINIS & JADWAL */}
                  <td className="py-4 px-5 align-top min-w-[220px]">
                    <div className="space-y-1.5">
                      <div className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-[#0B4F4A] shrink-0" />
                        <span className="truncate">{doctorName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                          {poliName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          ({item.patientType})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-gray-600 font-medium pt-1 border-t border-gray-100">
                        <Calendar className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">{item.selectedDate} <span className="text-gray-400 mx-0.5">|</span> {item.selectedTimeSlot}</span>
                      </div>
                    </div>
                  </td>

                  {/* 4. PEMBAYARAN & BUKTI TF */}
                  <td className="py-4 px-5 align-top">
                    <div className="space-y-2 flex flex-col items-start">
                      {isTransfer ? (
                        <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                          <CreditCard className="h-3 w-3" />
                          <span>Transfer Bank</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                          <Banknote className="h-3 w-3" />
                          <span>Bayar Loket</span>
                        </div>
                      )}

                      {/* TAMBAHKAN NOMINAL BIAYA DI SINI */}
                      <div className="font-mono font-black text-emerald-700 text-sm">
                        Rp {((item as any).nominalBiaya || 135000).toLocaleString('id-ID')}
                      </div>
                      
                      {/* Lencana Bukti TF Sangat Menonjol */}
                      {isTransfer && hasFoto && (
                        <div className="inline-flex items-center space-x-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm animate-pulse">
                          <Camera className="h-3 w-3" />
                          <span>Cek Bukti TF</span>
                        </div>
                      )}
                      {isTransfer && !hasFoto && (
                        <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[9px] font-bold">
                          <Clock className="h-3 w-3" />
                          <span>Menunggu TF</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 5. SIMRS BOOKING & ANTREAN */}
                  <td className="py-4 px-5 text-center align-top whitespace-nowrap">
                    {kodeBooking ? (
                      <div className="inline-flex flex-col items-center bg-white border border-emerald-300 p-1.5 rounded-xl shadow-xs">
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono mb-0.5">
                          <QrCode className="h-3 w-3 text-[#0B4F4A]" />
                          <span>SIMRS</span>
                        </div>
                        <span className="text-sm font-black text-[#0B4F4A] font-display tracking-widest">{kodeBooking}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-full mt-1 border border-emerald-100">
                          {antrianNum || '-'}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block mt-2">
                        Belum Diterbitkan
                      </span>
                    )}
                  </td>

                  {/* 6. STATUS */}
                  <td className="py-4 px-5 text-center align-middle whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* 7. AKSI DETAIL */}
                  <td className="py-4 px-5 text-right align-middle whitespace-nowrap">
                    <button className="inline-flex items-center space-x-1 text-[11px] font-bold text-white bg-[#0B4F4A] hover:bg-[#0E625C] px-3 py-1.5 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer">
                      <span>Buka</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BAR NAVIGASI PAGINATION */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-gray-500 font-medium">
            Menampilkan <span className="font-bold text-gray-800">{startIdx + 1}</span> - <span className="font-bold text-gray-800">{Math.min(endIdx, totalItems)}</span> dari <span className="font-bold text-gray-800">{totalItems}</span> pendaftaran
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-30 cursor-pointer transition-colors"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#0B4F4A] text-white shadow-xs border border-[#0B4F4A]'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-30 cursor-pointer transition-colors"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
