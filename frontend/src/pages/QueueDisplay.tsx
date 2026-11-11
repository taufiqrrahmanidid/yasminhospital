import React, { useState, useEffect } from 'react';
import { Tv, AlertCircle } from 'lucide-react';

interface Queue {
  id: string;
  queueNumber: string;
  polyclinic: string;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
  pendaftaran?: {
    patientName: string;
    selectedDoctorName?: string;
  };
}

export default function QueueDisplay() {
  const [selectedPoli, setSelectedPoli] = useState('Poli Umum');
  const [currentlyServing, setCurrentlyServing] = useState<Queue | null>(null);
  const [nextInQueue, setNextInQueue] = useState<Queue | null>(null);
  const [allQueues, setAllQueues] = useState<Queue[]>([]);
  const [hospitalInfo, setHospitalInfo] = useState<any>(null);

  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [poliList, setPoliList] = useState<string[]>([]);

  // Muat daftar poli dari database
  useEffect(() => {
    fetch(`${API_BASE}/api/polyclinics`)
      .then(res => res.ok ? res.json() : [])
      .then((list: any[]) => {
        const names = list.map((p: any) => p.name).filter(Boolean).sort();
        if (names.length > 0) {
          setPoliList(names);
          setSelectedPoli(prev => names.includes(prev) ? prev : names[0]);
        }
      })
      .catch(() => {});
  }, [API_BASE]);

  // Connect to SSE for real-time updates
  useEffect(() => {
    const connectSSE = () => {
      const eventSource = new EventSource(
        `${API_BASE}/api/queue/display?poli=${selectedPoli}`
      );

      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.queues) {
            setAllQueues(data.queues);
            
            // Find currently serving
            const serving = data.queues.find((q: Queue) => q.status === 'called' || q.status === 'serving');
            setCurrentlyServing(serving || null);

            // Find next
            const next = data.queues.find((q: Queue) => q.status === 'waiting');
            setNextInQueue(next || null);
          }
        } catch (error) {
          console.error('[DISPLAY] SSE parse error:', error);
        }
      });

      eventSource.onerror = () => {
        console.error('[DISPLAY] SSE connection error, retrying...');
        eventSource.close();
        setTimeout(connectSSE, 5000);
      };

      return () => eventSource.close();
    };

    const cleanup = connectSSE();
    return cleanup;
  }, [selectedPoli, API_BASE]);

  // Fetch hospital info
  useEffect(() => {
    const fetchHospitalInfo = async () => {
      try {
        // Attempt to fetch hospital info if endpoint exists
        const res = await fetch(`${API_BASE}/api/rs_info`);
        if (res.ok) {
          const data = await res.json();
          setHospitalInfo(data || {});
        }
      } catch (error) {
        console.error('[DISPLAY] Error fetching hospital info:', error);
      }
    };

    fetchHospitalInfo();
  }, [API_BASE]);

  const totalWaiting = allQueues.filter(q => q.status === 'waiting').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-indigo-900 p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Tv className="w-12 h-12 text-white" />
          <h1 className="text-5xl font-bold text-white">
            {hospitalInfo?.name || 'RS Yasmin'}
          </h1>
        </div>
        <p className="text-2xl text-emerald-300">Sistem Manajemen Antrian Pasien</p>
      </div>

      {/* Poli Selection */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {(poliList.length > 0 ? poliList : ['Poli Umum']).map(poli => (
          <button
            key={poli}
            onClick={() => setSelectedPoli(poli)}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
              selectedPoli === poli
                ? 'bg-emerald-500 text-white shadow-lg scale-110'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {poli}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Currently Serving - Large Display */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-2xl p-12 h-full flex flex-col justify-center">
            <p className="text-emerald-100 text-2xl mb-4 text-center">Sedang Dilayani</p>
            
            {currentlyServing ? (
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
                  <p className="text-emerald-100 text-3xl mb-4">Nomor Antrian</p>
                  <p className="text-white text-9xl font-bold tracking-wider">
                    {currentlyServing.queueNumber}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-emerald-100 text-2xl mb-2">Nama Pasien</p>
                    <p className="text-white text-4xl font-bold">
                      {currentlyServing.pendaftaran?.patientName || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <p className="text-emerald-100 text-2xl mb-2">Dokter</p>
                    <p className="text-white text-3xl font-semibold">
                      {currentlyServing.pendaftaran?.selectedDoctorName || '-'}
                    </p>
                  </div>
                </div>

                <div className="mt-12 bg-white bg-opacity-20 rounded-xl p-6">
                  <p className="text-emerald-100 text-xl">
                    ⏰ Silakan menunggu pemangilan di loket masing-masing
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="w-32 h-32 text-white mx-auto mb-8 opacity-50" />
                <p className="text-white text-4xl font-bold">Tidak Ada Pasien</p>
                <p className="text-emerald-100 text-2xl mt-4">
                  Silakan menunggu panggilan berikutnya
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next in Queue & Stats */}
        <div className="space-y-6 flex flex-col">
          {/* Next */}
          <div className="bg-blue-500 rounded-2xl shadow-xl p-8 text-white">
            <p className="text-blue-100 text-lg mb-4 font-semibold">PANGGILAN BERIKUTNYA</p>
            
            {nextInQueue ? (
              <div>
                <p className="text-5xl font-bold mb-4 text-blue-100">
                  {nextInQueue.queueNumber}
                </p>
                <p className="text-lg font-semibold">
                  {nextInQueue.pendaftaran?.patientName || 'Unknown'}
                </p>
              </div>
            ) : (
              <p className="text-xl text-blue-100">Semua selesai</p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-indigo-500 rounded-2xl shadow-xl p-8 text-white">
            <p className="text-indigo-100 text-lg mb-4 font-semibold">STATISTIK ANTRIAN</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Menunggu:</span>
                <span className="text-4xl font-bold">{totalWaiting}</span>
              </div>
              <div className="h-1 bg-indigo-300 rounded-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Selesai:</span>
                <span className="text-3xl font-bold">
                  {allQueues.filter(q => q.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white bg-opacity-10 rounded-2xl shadow-xl p-6 text-white text-center flex-1 flex flex-col justify-center">
            <p className="text-lg font-semibold mb-4">Informasi</p>
            <div className="space-y-3 text-sm">
              <p>📍 {hospitalInfo?.address || 'Jl. RS Yasmin'}</p>
              <p>📞 {hospitalInfo?.phone || '(0274) 555-555'}</p>
              <p className="text-xs text-gray-300 mt-4">
                Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List Bottom */}
      <div className="mt-8 bg-white bg-opacity-10 rounded-2xl shadow-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Daftar Antrian Lengkap</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {allQueues.map(q => (
            <div
              key={q.id}
              className={`p-3 rounded-lg font-bold text-center transition-all ${
                q.status === 'serving' || q.status === 'called'
                  ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                  : q.status === 'completed'
                  ? 'bg-green-600 text-white opacity-50'
                  : q.status === 'skipped'
                  ? 'bg-gray-600 text-white line-through'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm">{q.queueNumber}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
