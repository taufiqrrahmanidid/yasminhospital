import React, { useState } from 'react';
import type { Pendaftaran, PendaftaranStatus } from '../types';
import { STATUS_LABEL, SOURCE_LABEL } from '../types';
import StatusBadge from './StatusBadge';
import { updateStatus, sendManualMessage } from '../adminApi';
import { 
  X, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  Camera, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  QrCode,
  CreditCard
} from 'lucide-react';
import BarcodeCard from '../../BarcodeCard';

interface Props {
  item: Pendaftaran;
  onClose: () => void;
  onChanged: () => void;
}

export default function PendaftaranDetailDrawer({ item, onClose, onChanged }: Props) {
  const [savingStatus, setSavingStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  // [KUNCI]: Kunci scroll halaman belakang saat drawer terbuka (Anti-Geser)
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleStatusChange = async (status: PendaftaranStatus) => {
    setSavingStatus(true);
    setFeedback(null);
    try {
      const cancellationReason = status === 'dibatalkan' ? (message.trim() || undefined) : undefined;
      await updateStatus(item.id, status, cancellationReason);
      
      if (status === 'dibatalkan') {
        setFeedback('⚠️ Status diubah ke DIBATALKAN. Notifikasi alasan pembatalan otomatis dikirim ke WhatsApp pasien.');
      } else if (status === 'diverifikasi') {
        setFeedback('✅ Status diubah ke DIVERIFIKASI. Notifikasi konfirmasi jadwal resmi otomatis dikirim ke WhatsApp pasien.');
      } else if (status === 'selesai') {
        setFeedback('🩺 Status diubah ke SELESAI. Pesan ucapan lekas sembuh otomatis dikirim.');
      } else {
        setFeedback(`Status berhasil diubah ke ${STATUS_LABEL[status]}.`);
      }
      
      onChanged();
    } catch (err: any) {
      setFeedback(err.message || 'Gagal mengubah status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      await sendManualMessage(item.id, message.trim());
      setFeedback('✅ Pesan khusus berhasil dikirimkan ke WhatsApp pasien via Bot!');
      setMessage('');
    } catch (err: any) {
      setFeedback(err.message || 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  // Fungsi Pengirim Struk & Kode Booking Resmi ke WA Pasien
  const handleSendOfficialBookingWA = async () => {
    const cleanPhone = String(item.phone).replace(/[^0-9]/g, '').replace(/^0/, '62');
    const kodeBooking = (item as any).kodeBooking || '-';
    const noAntrian = (item as any).antrian || '-';
    const dokter = (item as any).selectedDoctorName || item.selectedDoctorId;
    const poli = (item as any).selectedPoli || 'Poli Spesialis';
    const noRM = (item as any).noIdentitas || item.nik || '-';

    // Format Teks Resmi SIMRS untuk WhatsApp Pasien
    const waText = `Halo Bapak/Ibu *${item.patientName}*, terima kasih telah melakukan pembayaran. Pendaftaran Anda di RS Yasmin Banyuwangi telah *DIVERIFIKASI*.

*BUKTI ANTREAN & KODE BOOKING SIMRS:*
No. RM      : *${noRM}*
Poli        : *${poli}*
Dokter      : *${dokter}*
Tanggal     : *${item.selectedDate}*
Sesi Jam    : *${item.selectedTimeSlot}*
Nomor Antri : *( ${noAntrian} )*

*KODE BOOKING CHECK-IN:*
👉 *${kodeBooking}*

Silakan buka Barcode Check-In Anda melalui Portal Pasien:
🔗 ${window.location.origin}/pasien

_Mohon hadir 30 menit sebelum jam praktek untuk konfirmasi check-in di loket / mesin antrean mandiri RS Yasmin._`;

    // 1. Update status waConfirmationSent di database menjadi true
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pendaftaran/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waConfirmationSent: true })
      });
      onChanged();
    } catch (e) {}

    // 2. Buka WhatsApp Web / Aplikasi WA ke pasien
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  // Escape HTML untuk mencegah XSS saat menulis ke tab baru
  const escapeHtml = (s: unknown) =>
    String(s ?? '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
    );

  // Fungsi Pembuka Gambar Skala Besar (Bebas Blokir Chrome)
  const bukaGambarUkuranPenuh = (dataUri: string) => {
    const newTab = window.open('', '_blank');
    if (!newTab) return;

    const safeName = escapeHtml(item.patientName || 'Pasien');
    const safeId = escapeHtml(item.id);
    // Hanya izinkan data URI gambar; escape kutip agar tidak keluar dari atribut src.
    const safeImg = /^data:image\//i.test(String(dataUri))
      ? String(dataUri).replace(/"/g, '&quot;')
      : '';

    newTab.document.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Bukti Transfer - ${safeName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              background: #090d16;
              color: #f8fafc;
              font-family: -apple-system, sans-serif;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 24px;
            }
            .header { margin-bottom: 16px; text-align: center; }
            .header h2 { font-size: 18px; font-weight: 700; color: #f1f5f9; }
            .header p { font-size: 12px; color: #94a3b8; margin-top: 4px; font-family: monospace; }
            .card {
              background: #1e293b;
              border: 1px solid #334155;
              border-radius: 20px;
              padding: 16px;
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
              display: flex;
              align-items: center;
              justify-content: center;
              max-width: 90vw;
              max-height: 80vh;
            }
            img {
              width: auto;
              min-width: 520px;
              max-width: 85vw;
              max-height: 75vh;
              object-fit: contain;
              border-radius: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Bukti Transfer: ${safeName}</h2>
            <p>ID Tiket: ${safeId} · RS Yasmin Banyuwangi</p>
          </div>
          <div class="card">
            <img src="${safeImg}" alt="Bukti Transfer Pasien" />
          </div>
        </body>
        </html>
      `);
    newTab.document.close();
  };

  const buktiFoto = (item as any).buktiTransferImage;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Full-page modal */}
      <div className="relative max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-divider">
        
        {/* Header (sticky) */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-divider px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-xs bg-[#E6F4F1] text-[#0B4F4A] px-2.5 py-1 rounded-md border border-[#A7D7CD]">
                {item.id}
              </span>
              <StatusBadge status={item.status} />
              <span className="text-xs text-gray-400 font-medium">via {SOURCE_LABEL[item.source]}</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-headings mt-2">
              {item.patientName}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer shrink-0"
            title="Tutup"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body: 2 kolom */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KOLOM KIRI */}
          <div className="space-y-5">

        {/* ========================================================= */}
        {/* METODE PEMBAYARAN & BUKTI TRANSFER CARD */}
        {/* ========================================================= */}
        {(item as any).metodePembayaran === 'bayar_di_loket' ? (
          // TAMPILAN KHUSUS JIKA PASIEN MEMILIH "BAYAR DI LOKET"
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Metode Pembayaran
              </span>
              <span className="text-[10px] text-blue-800 font-extrabold bg-blue-200/50 border border-blue-300 px-2.5 py-0.5 rounded-full uppercase">
                Bayar di Loket
              </span>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed pt-1">
              Pasien ini akan melakukan pembayaran administrasi secara langsung (Tunai/Debit/QRIS) di Kasir / Loket Pendaftaran RS Yasmin saat kedatangan.
            </p>
          </div>
        ) : (
          // TAMPILAN JIKA PASIEN MEMILIH "TRANSFER BANK"
          <div className="p-4 bg-gradient-to-b from-[#F8FAF9] to-white border border-[#CBD5E1] rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B4F4A] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-emerald-600" />
                Bukti Transfer Pasien
              </span>
              {buktiFoto ? (
                <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  Foto Tersedia
                </span>
              ) : (
                <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                  Belum Kirim Struk
                </span>
              )}
            </div>

            {buktiFoto ? (
              <div className="space-y-2">
                <div 
                  onClick={() => bukaGambarUkuranPenuh(buktiFoto)}
                  className="rounded-xl overflow-hidden border border-divider bg-slate-900 max-h-64 flex items-center justify-center cursor-zoom-in group relative shadow-inner"
                  title="Klik untuk membuka ukuran penuh di tab baru"
                >
                  <img src={buktiFoto} alt="Bukti Transfer" className="w-full h-auto max-h-64 object-contain group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <ExternalLink className="h-4 w-4" /><span>Buka Ukuran Penuh</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-400 italic bg-white rounded-xl border border-dashed border-gray-300">
                Pasien belum mengirimkan foto bukti transfer ke WhatsApp.
              </div>
            )}
          </div>
        )}

        {/* DATA DETAIL PASIEN */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-2.5 text-xs">
          <Row label="Nomor WhatsApp" value={item.phone} mono />
          <Row label="Kategori Jaminan" value={item.patientType} />
          {item.nik && <Row label="NIK e-KTP" value={item.nik} mono />}
          
          <Row label="Metode Bayar" value={(item as any).metodePembayaran === 'bayar_di_loket' ? 'Loket RS' : 'Transfer Bank'} />
          
          {/* TAMBAHKAN BLOK INI */}
          <div className="flex justify-between gap-4 border-b border-gray-50 pb-1.5 last:border-b-0 last:pb-0 items-center">
            <span className="text-gray-400 font-medium">Nominal Tagihan</span>
            <span className="text-right font-black text-emerald-700 text-sm font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Rp {((item as any).nominalBiaya || 135000).toLocaleString('id-ID')}
            </span>
          </div>
          {(item as any).metodePembayaran === 'transfer' && (
            <Row label="Bank Tujuan" value={(item as any).bankTujuan || 'Bank Transfer'} />
          )}
          {/* ============================== */}

          <Row label="Dokter Tujuan" value={item.selectedDoctorId} />
          <Row label="Jadwal Kunjungan" value={`${item.selectedDate} (${item.selectedTimeSlot})`} />
          {item.complaint && <Row label="Keluhan Medis" value={item.complaint} />}
          <Row label="Notifikasi WA" value={item.waConfirmationSent ? '✅ Sukses Terkirim' : '⏳ Belum / Menunggu'} />
        </div>

          </div>{/* END KOLOM KIRI */}

          {/* KOLOM KANAN */}
          <div className="space-y-5">

        {/* ========================================================= */}
        {/* TAMPILAN STRUK & BARCODE SCANNER RESMI SIMRS */}
        {/* ========================================================= */}
        {(item as any).kodeBooking && (
          <div className="mb-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B4F4A] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-emerald-600" />
                Struk Antrean &amp; Barcode Check-In
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                Siap Cetak / Scan
              </span>
            </div>

            <BarcodeCard
              kodeBooking={(item as any).kodeBooking}
              nomorAntrean={(item as any).antrian}
              namaPasien={item.patientName}
              noRM={(item as any).noIdentitas || item.nik}
              dokter={(item as any).selectedDoctorName || item.selectedDoctorId}
              poli={(item as any).selectedPoli || 'Poli Spesialis'}
              jadwal={item.selectedTimeSlot}
              tanggal={item.selectedDate}
              idTiket={item.id}
            />

            {/* [TOMBOL PINTAS BARU]: KIRIM KODE BOOKING & STRUK KE WA PASIEN */}
            <button
              type="button"
              onClick={handleSendOfficialBookingWA}
              className="w-full py-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Send className="h-4 w-4" />
              <span>Kirim Struk &amp; Kode Booking ke WA Pasien</span>
            </button>
          </div>
        )}
        
        {/* STATUS ACTION BUTTONS (DISEDERHANAKAN & SEMANTIK) */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
            Tindakan Status Pasien
          </label>
          <div className="grid grid-cols-2 gap-2">
            
            {/* 1. Tombol Verifikasi (Hijau Emerald) */}
            <button
              disabled={savingStatus || item.status === 'diverifikasi'}
              onClick={() => handleStatusChange('diverifikasi')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
                item.status === 'diverifikasi'
                  ? 'bg-emerald-500 text-white border-emerald-600 opacity-60 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 active:scale-95'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Verifikasi &amp; Jadwal</span>
            </button>

            {/* 2. Tombol Selesai (Biru Medis) */}
            <button
              disabled={savingStatus || item.status === 'selesai'}
              onClick={() => handleStatusChange('selesai')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
                item.status === 'selesai'
                  ? 'bg-blue-500 text-white border-blue-600 opacity-60 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 active:scale-95'
              }`}
            >
              <Check className="h-4 w-4" />
              <span>Selesai Berobat</span>
            </button>

            {/* 3. Tombol Batalkan (Merah Tegas) */}
            <button
              disabled={savingStatus || item.status === 'dibatalkan'}
              onClick={() => handleStatusChange('dibatalkan')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
                item.status === 'dibatalkan'
                  ? 'bg-rose-500 text-white border-rose-600 opacity-60 cursor-not-allowed'
                  : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-300 active:scale-95'
              }`}
            >
              <XCircle className="h-4 w-4" />
              <span>Batalkan</span>
            </button>

            {/* 4. Tombol Reset ke Baru (Abu-abu Netral) */}
            <button
              disabled={savingStatus || item.status === 'baru'}
              onClick={() => handleStatusChange('baru')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
                item.status === 'baru'
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 active:scale-95'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Status: Baru</span>
            </button>

          </div>
        </div>

        {/* FORM PESAN KUSTOM KE WHATSAPP DENGAN TEMPLATE INSTAN */}
        <div className="space-y-2.5 pt-2 border-t border-divider">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
            Kirim Pesan WhatsApp / Alasan Batal
          </label>
          
          {/* Tombol Template Pesan Instan */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => setMessage('Mohon kirimkan foto bukti transfer yang lebih jelas dan terbaca.')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer"
            >
              + Struk Buram
            </button>
            <button
              type="button"
              onClick={() => setMessage('Mohon maaf, kuota antrean dokter untuk hari ini sudah penuh. Silakan pilih tanggal besok.')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer"
            >
              + Kuota Penuh
            </button>
            <button
              type="button"
              onClick={() => setMessage('Mohon membawa Kartu BPJS & Rujukan faskes 1 asli saat check in di loket RS Yasmin.')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer"
            >
              + Syarat BPJS
            </button>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Tulis pesan khusus atau alasan pembatalan pendaftaran di sini..."
            className="w-full rounded-2xl border border-gray-300 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B4F4A] focus:border-transparent transition-all"
          />

          <button
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            className="w-full py-3 bg-[#0B4F4A] hover:bg-[#0E625C] text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm disabled:opacity-40 active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{sending ? 'Mengirim via Bot...' : 'Kirim Pesan ke WhatsApp Pasien'}</span>
          </button>
        </div>

        {/* FEEDBACK ALERT */}
        {feedback && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 animate-fade-in flex items-start space-x-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}

          </div>{/* END KOLOM KANAN */}
        </div>{/* END grid */}

        </div>{/* END modal card */}
      </div>{/* END modal wrapper */}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-50 pb-1.5 last:border-b-0 last:pb-0">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className={`text-right font-bold text-gray-800 ${mono ? 'font-mono text-[11px]' : ''}`}>
        {value}
      </span>
    </div>
  );
}
