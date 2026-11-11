import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Printer } from 'lucide-react';

interface Props {
  kodeBooking: string;
  nomorAntrean?: string;
  namaPasien: string;
  noRM?: string;
  dokter: string;
  poli: string;
  jadwal: string;
  tanggal: string;
  idTiket: string;
}

export default function BarcodeCard({
  kodeBooking,
  nomorAntrean,
  namaPasien,
  noRM,
  dokter,
  poli,
  jadwal,
  tanggal,
  idTiket
}: Props) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && kodeBooking) {
      try {
        JsBarcode(barcodeRef.current, kodeBooking, {
          format: 'CODE128',
          width: 2.2,
          height: 55,
          displayValue: false, // Nilai teks dicetak besar terpisah di bawahnya
          background: 'transparent',
          lineColor: '#000000',
          margin: 0
        });
      } catch (e) {
        console.error('Error generating barcode:', e);
      }
    }
  }, [kodeBooking]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-5 sm:p-6 max-w-sm mx-auto shadow-sm text-left font-mono relative overflow-hidden print:border-none print:shadow-none print:p-0">
      
      {/* Header Struk SIMRS */}
      <div className="text-center border-b-2 border-dashed border-gray-200 pb-3 mb-3">
        <h3 className="font-bold text-sm text-[#0B4F4A] uppercase tracking-wider">
          Antrian POLI RS Yasmin
        </h3>
        <p className="text-[10px] text-gray-500 font-sans">
          Sistem Registrasi Online Terintegrasi SIMRS
        </p>
      </div>

      {/* Rincian Identitas & Dokter */}
      <div className="space-y-1 text-xs text-gray-800 pb-3 border-b border-gray-100">
        <div className="font-bold text-sm uppercase">{namaPasien}</div>
        <div className="text-[11px] text-gray-600 font-bold">
          No. RM : <span className="text-[#0B4F4A]">{noRM || '20.19.016788'}</span>
        </div>
        <div className="text-[11px] text-gray-700 font-sans pt-1">
          {dokter}
        </div>
        <div className="text-[10px] text-gray-500 font-sans">
          {poli}
        </div>
        <div className="text-[10px] text-gray-600 font-mono pt-1">
          Tgl. Daftar : {tanggal}
        </div>
        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 py-0.5">
          <span>Nomor Antri :</span>
          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded font-mono text-sm font-black">
            ( {nomorAntrean ? (nomorAntrean.includes('-') ? nomorAntrean.split('-')[1] : nomorAntrean) : '001'} )
          </span>
        </div>
        <div className="text-[10px] text-gray-500">
          Jam Praktek : {jadwal}
        </div>
      </div>

      {/* AREA BARCODE RESMI CODE 128 */}
      <div className="py-4 text-center space-y-1.5 bg-[#F8FAF9] rounded-2xl border border-gray-200 my-3">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">
          KODE BOOKING CHECK-IN:
        </span>

        {/* Barcode SVG Element */}
        <div className="flex justify-center py-1 overflow-x-auto">
          <svg ref={barcodeRef} className="max-w-full h-auto" />
        </div>

        {/* Teks Kode Booking Tebal (e.g. 47XUGE) */}
        <span className="text-3xl font-display font-black tracking-widest text-[#0B4F4A] block">
          {kodeBooking}
        </span>
        <span className="text-[9px] text-gray-400 block font-mono">
          Ref: {idTiket}
        </span>
      </div>

      {/* Instruksi Kiosk Mandiri */}
      <p className="text-[9.5px] text-gray-500 text-center leading-relaxed italic border-t border-dashed border-gray-200 pt-3">
        *Scan barcode ini di mesin antrian mandiri, ruang periksa, kasir, dan loket farmasi untuk konfirmasi check-in di setiap pos pelayanan.*
      </p>

      {/* Tombol Cetak Struk */}
      <div className="pt-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Cetak Bukti Antrean (Print)</span>
        </button>
      </div>

    </div>
  );
}
