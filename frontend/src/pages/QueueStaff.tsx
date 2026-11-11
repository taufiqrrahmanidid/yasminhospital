import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, Pause, CheckCircle, Volume2, Clock, Users } from 'lucide-react';

interface Queue {
  id: string;
  queueNumber: string;
  polyclinic: string;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
  calledAt?: string;
  completedAt?: string;
  calledBy?: string;
  loketNumber?: string;
  pendaftaran?: {
    patientName: string;
    phone: string;
    selectedDoctorName?: string;
  };
}

export default function QueueStaffPanel() {
  const [selectedPoli, setSelectedPoli] = useState('Poli Umum');
  const [loketNumber, setLoketNumber] = useState('Loket 1');
  const [currentServing, setCurrentServing] = useState<Queue | null>(null);
  const [waitingQueue, setWaitingQueue] = useState<Queue[]>([]);
  const [adminEmail] = useState(localStorage.getItem('adminEmail') || 'admin@rsyasmin.id');
  const [loading, setLoading] = useState(false);
  const [poliList, setPoliList] = useState<string[]>([]);
  const [authState, setAuthState] = useState<'checking' | 'authed' | 'unauth'>('checking');

  const API_BASE = import.meta.env.VITE_API_URL || '';

  // Cek sesi login + muat daftar poli dari database
  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
        if (!meRes.ok) { setAuthState('unauth'); return; }
        setAuthState('authed');

        const poliRes = await fetch(`${API_BASE}/api/polyclinics`);
        if (poliRes.ok) {
          const list: any[] = await poliRes.json();
          const names = list.map((p: any) => p.name).filter(Boolean).sort();
          if (names.length > 0) {
            setPoliList(names);
            setSelectedPoli(prev => names.includes(prev) ? prev : names[0]);
          }
        }
      } catch {
        setAuthState('unauth');
      }
    })();
  }, [API_BASE]);

  // Fetch active queues
  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/queue/active?poli=${selectedPoli}`, { credentials: 'include' });
        const data = await res.json();
        
        if (data.success) {
          const called = data.queues.find((q: Queue) => q.status === 'called' || q.status === 'serving');
          setCurrentServing(called || null);
          setWaitingQueue(data.queues.filter((q: Queue) => q.status === 'waiting'));
        }
      } catch (error) {
        console.error('[QUEUE] Error fetching:', error);
      }
    };

    fetchQueues();
    const interval = setInterval(fetchQueues, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [selectedPoli, API_BASE]);

  const callPatient = async (queue: Queue) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/queue/call`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queueId: queue.id,
          loketNumber,
          calledBy: adminEmail
        })
      });

      const data = await res.json();
      if (data.success) {
        setCurrentServing(data.queue);
        setWaitingQueue(prev => prev.filter(x => x.id !== queue.id));
        // Play sound notification
        playNotificationSound();
      }
    } catch (error) {
      console.error('[QUEUE] Error calling:', error);
    } finally {
      setLoading(false);
    }
  };

  const callNextPatient = () => {
    if (waitingQueue.length === 0) return;
    callPatient(waitingQueue[0]);
  };

  const completePatient = async () => {
    if (!currentServing) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/queue/complete/${currentServing.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (data.success) {
        setCurrentServing(null);
        // Auto-call next
        await new Promise(resolve => setTimeout(resolve, 1000));
        callNextPatient();
      }
    } catch (error) {
      console.error('[QUEUE] Error completing:', error);
    } finally {
      setLoading(false);
    }
  };

  const skipPatient = async () => {
    if (!currentServing) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/queue/skip/${currentServing.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (data.success) {
        setCurrentServing(null);
      }
    } catch (error) {
      console.error('[QUEUE] Error skipping:', error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.5);
  };

  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-semibold">Memeriksa sesi login...</p>
      </div>
    );
  }

  if (authState === 'unauth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Login Diperlukan</h1>
          <p className="text-sm text-gray-600 mb-6">Panel loket memerlukan login admin. Silakan masuk terlebih dahulu.</p>
          <a href="/admin" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg">Masuk ke Admin</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel Manajemen Antrian</h1>
          <p className="text-gray-600">RS Yasmin - Loket & Manajemen Pasien</p>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pilihan Poli</label>
            <select
              value={selectedPoli}
              onChange={(e) => setSelectedPoli(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {(poliList.length > 0 ? poliList : ['Poli Umum']).map(poli => (
                <option key={poli} value={poli}>{poli}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Loket</label>
            <select
              value={loketNumber}
              onChange={(e) => setLoketNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option>Loket 1</option>
              <option>Loket 2</option>
              <option>Loket 3</option>
              <option>Loket 4</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currently Serving */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-emerald-500">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-emerald-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Sedang Dilayani</h2>
              </div>

              {currentServing ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Nomor Antrian</p>
                    <p className="text-4xl font-bold text-emerald-600">{currentServing.queueNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Nama Pasien</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {currentServing.pendaftaran?.patientName || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Dokter</p>
                    <p className="text-sm text-gray-700">
                      {currentServing.pendaftaran?.selectedDoctorName || '-'}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={completePatient}
                      disabled={loading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Selesai
                    </button>
                    <button
                      onClick={skipPatient}
                      disabled={loading}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Pause className="w-5 h-5" />
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Tidak ada pasien yang dilayani</p>
                </div>
              )}
            </div>
          </div>

          {/* Queue List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4 justify-between">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Daftar Antrian</h2>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                  {waitingQueue.length} menunggu
                </span>
              </div>

              {waitingQueue.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {waitingQueue.map((q, idx) => (
                    <div key={q.id} className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="text-center mr-4 min-w-[60px]">
                        <p className="text-xs text-gray-600">Urutan</p>
                        <p className="text-2xl font-bold text-blue-600">#{idx + 1}</p>
                      </div>

                      <div className="flex-1">
                        <p className="font-bold text-lg text-gray-800">{q.queueNumber}</p>
                        <p className="text-sm text-gray-600">
                          {q.pendaftaran?.patientName || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {q.pendaftaran?.phone || '-'}
                        </p>
                      </div>

                      <button
                        onClick={() => callPatient(q)}
                        disabled={loading}
                        className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                      >
                        Panggil
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-300 mb-4" />
                  <p className="text-gray-500 text-lg">Semua pasien telah dilayani</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auto Call Button */}
        <div className="mt-6">
          <button
            onClick={callNextPatient}
            disabled={loading || !currentServing === null}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Volume2 className="w-6 h-6" />
            Panggil Pasien Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
