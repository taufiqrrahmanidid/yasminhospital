import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Activity, 
  Users, 
  ShieldAlert, 
  Award, 
  FileText, 
  CheckCircle2, 
  Bed, 
  Home, 
  Heart, 
  HeartPulse, 
  Sparkles, 
  Filter, 
  Download, 
  RefreshCw, 
  Star, 
  Info, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Stethoscope,
  Scissors,
  Layers,
  ShoppingBag,
  Shuffle,
  Eye,
  ActivitySquare,
  Calendar,
  X
} from 'lucide-react';

interface KpiConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    sub: string;
    color: string;
  }>;
  chartType: 'line' | 'bar' | 'area' | 'radial';
  chartData: Array<{ label: string; value: number; target: number }>;
  chartYLabel: string;
  tableHeaders: string[];
  tableRows: Array<Array<string | number>>;
  recommendations?: string[]; 
}

export default function KpiDashboard({ menu }: { menu: string }) {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [selectedDailyOption, setSelectedDailyOption] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedWeeklyOption, setSelectedWeeklyOption] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // Set ke hari Senin minggu ini
    return d.toISOString().split('T')[0];
  });
  const [selectedMonthlyOption, setSelectedMonthlyOption] = useState<string>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; // Tgl 1 bulan ini
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State untuk Data Dinamis
  const [dynamicKpi, setDynamicKpi] = useState<KpiConfig | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualData, setManualData] = useState<any[]>([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch Data dari Backend
  useEffect(() => {
    const fetchKpiData = async () => {
      const supportedMenus = [
        'KPI_RAWAT_JALAN', 'KPI_BED_MANAGEMENT', 'KPI_ANTRIAN',
        'KPI_IGD', 'KPI_ICU', 'KPI_HCU', 'KPI_NICU', 'KPI_PICU',
        'KPI_RAWAT_INAP', 'KPI_PERINATOLOGI', 'KPI_KAMAR_OPERASI', 'KPI_CSSD',
        'KPI_HEMODIALISA', 'KPI_MCU', 'KPI_REHABILITASI_MEDIK', 'KPI_HOME_CARE',
        'KPI_AMBULANCE', 'KPI_RUJUKAN_PASIEN', 'KPI_ANALISA_RUJUKAN', 'KPI_KINERJA_PELAYANAN'
      ];
      if (!supportedMenus.includes(menu)) {
        setDynamicKpi(null); 
        return;
      }

      setIsLoadingData(true);
      try {
        const activeDate = timeframe === 'Daily' ? selectedDailyOption : timeframe === 'Weekly' ? selectedWeeklyOption : selectedMonthlyOption;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/kpi/${menu}?timeframe=${timeframe}&dateStr=${activeDate}`, {
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        const data = await res.json();

        const baseConfig = kpis[menu];
        setDynamicKpi({
          ...baseConfig,
          metrics: data.metrics,
          chartData: data.chartData,
          tableRows: data.tableRows,
          recommendations: data.recommendations || baseConfig.recommendations 
        });
      } catch (err) {
        console.error('[KPI API ERROR] Gagal memuat data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchKpiData();
  }, [menu, timeframe, selectedDailyOption, selectedWeeklyOption, selectedMonthlyOption, refreshTrigger]);

  const handleOpenManualInput = () => {
    let fields = [
      { key: 'total_pasien', label: 'Total Pasien / Kunjungan', value: '' },
      { key: 'keterangan_1', label: 'Metrik Tambahan (Opsional)', value: '' },
    ];

    // Kustomisasi form berdasarkan menu yang sedang dibuka
    if (menu === 'KPI_IGD') {
      fields = [
        { key: 'total_pasien', label: 'Total Pasien IGD', value: '' },
        { key: 'response_time', label: 'Rata-rata Response Time (Menit)', value: '' },
        { key: 'death_on_arrival', label: 'Jumlah Pasien DOA', value: '' },
      ];
    } else if (menu === 'KPI_MCU') {
      fields = [
        { key: 'total_peserta', label: 'Total Peserta MCU', value: '' },
        { key: 'kecepatan_hasil', label: 'Rata-rata Kecepatan Hasil (Jam)', value: '' },
        { key: 'omset', label: 'Omset MCU (Rp)', value: '' },
      ];
    } else if (menu === 'KPI_KAMAR_OPERASI') {
      fields = [
        { key: 'total_operasi', label: 'Total Tindakan Bedah', value: '' },
        { key: 'penundaan', label: 'Jumlah Penundaan Operasi', value: '' },
        { key: 'infeksi', label: 'Infeksi Luka Operasi (%)', value: '' },
      ];
    } else if (menu === 'KPI_KINERJA_PELAYANAN') {
      fields = [
        { key: 'kepatuhan_sasaran', label: 'Kepatuhan Sasaran Keselamatan (%)', value: '' },
        { key: 'kepuasan_pasien', label: 'Indeks Kepuasan Pasien (1-5)', value: '' },
      ];
    }

    setManualData(fields);
    setIsManualModalOpen(true);
  };

  const handleSaveManual = async () => {
    try {
      const activeDate = timeframe === 'Daily' ? selectedDailyOption : timeframe === 'Monthly' ? selectedMonthlyOption : selectedWeeklyOption;
      
      // 👇 Saring hanya field yang ada isinya 👇
      const filledMetrics = manualData.filter(m => m.value && m.value.trim() !== '');

      if (filledMetrics.length === 0) {
        alert('Silakan isi minimal satu data.');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/kpi/manual`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiCode: menu,
          dateStr: activeDate,
          metrics: filledMetrics // Kirim yang terisi saja
        })
      });

      if (res.ok) {
        alert('Data manual berhasil disimpan!');
        setIsManualModalOpen(false);
        setRefreshTrigger(prev => prev + 1); // 👈 Trigger fetch data dari API!
      }
    } catch (err) {
      alert('Gagal menyimpan data manual.');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Icon mapping helper
  const getIcon = (id: string) => {
    switch(id) {
      case 'KPI_RAWAT_JALAN': return <Stethoscope className="h-5 w-5" />;
      case 'KPI_RAWAT_INAP': return <Bed className="h-5 w-5" />;
      case 'KPI_IGD': return <ShieldAlert className="h-5 w-5" />;
      case 'KPI_ICU': return <HeartPulse className="h-5 w-5" />;
      case 'KPI_HCU': return <Activity className="h-5 w-5" />;
      case 'KPI_NICU': return <Heart className="h-5 w-5" />;
      case 'KPI_PICU': return <Sparkles className="h-5 w-5" />;
      case 'KPI_PERINATOLOGI': return <Award className="h-5 w-5" />;
      case 'KPI_KAMAR_OPERASI': return <Scissors className="h-5 w-5" />;
      case 'KPI_CSSD': return <Layers className="h-5 w-5" />;
      case 'KPI_HEMODIALISA': return <ActivitySquare className="h-5 w-5" />;
      case 'KPI_MCU': return <CheckCircle2 className="h-5 w-5" />;
      case 'KPI_REHABILITASI_MEDIK': return <Award className="h-5 w-5" />;
      case 'KPI_HOME_CARE': return <Home className="h-5 w-5" />;
      case 'KPI_AMBULANCE': return <Zap className="h-5 w-5" />;
      case 'KPI_BED_MANAGEMENT': return <Bed className="h-5 w-5" />;
      case 'KPI_ANTRIAN': return <Clock className="h-5 w-5" />;
      case 'KPI_RUJUKAN_PASIEN': return <Shuffle className="h-5 w-5" />;
      case 'KPI_ANALISA_RUJUKAN': return <Eye className="h-5 w-5" />;
      case 'KPI_KINERJA_PELAYANAN': return <TrendingUp className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  // Masters of 20 KPI submenus configurations
  const kpis: Record<string, KpiConfig> = {
    KPI_RAWAT_JALAN: {
      id: 'KPI_RAWAT_JALAN',
      title: 'Rawat Jalan',
      category: 'Pelayanan Medis',
      description: 'Pemantauan kunjungan poliklinik, efisiensi waktu pelayanan (mulai pendaftaran hingga kasir), dan kepuasan pasien rawat jalan.',
      metrics: [
        { label: 'Total Pasien', value: '14,250', change: '+8.4%', trend: 'up', sub: 'vs bulan lalu', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Avg. Waktu Tunggu', value: '12.4 Menit', change: '-15.2%', trend: 'up', sub: 'Target < 15 menit', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Kepuasan Pasien', value: '4.82 / 5.0', change: '+2.1%', trend: 'up', sub: 'Target 4.5', color: 'bg-amber-50 text-amber-700 border-amber-100' },
        { label: 'Pasien Batal', value: '1.2%', change: '-0.3%', trend: 'up', sub: 'Target < 2.0%', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'line',
      chartYLabel: 'Jumlah Kunjungan',
      chartData: [
        { label: 'Jul 25', value: 11200, target: 10000 },
        { label: 'Ags 25', value: 11500, target: 10000 },
        { label: 'Sep 25', value: 12100, target: 10500 },
        { label: 'Okt 25', value: 11800, target: 10500 },
        { label: 'Nov 25', value: 12400, target: 11000 },
        { label: 'Des 25', value: 13000, target: 11000 },
        { label: 'Jan 26', value: 12800, target: 12000 },
        { label: 'Feb 26', value: 13200, target: 12000 },
        { label: 'Mar 26', value: 13900, target: 12500 },
        { label: 'Apr 26', value: 13500, target: 12500 },
        { label: 'Mei 26', value: 14100, target: 13000 },
        { label: 'Jun 26', value: 14250, target: 13000 }
      ],
      tableHeaders: ['Poliklinik', 'Total Pasien', 'Waktu Layanan (Avg)', 'Dokter Standby', 'Status Indikator'],
      tableRows: [
        ['Penyakit Dalam', '3,450', '11.8 m', '4 Dokter', 'Sangat Baik'],
        ['Anak (Pediatri)', '2,890', '14.2 m', '3 Dokter', 'Baik'],
        ['Kandungan & Kebidanan', '2,410', '13.5 m', '3 Dokter', 'Baik'],
        ['Gigi & Mulut', '1,920', '18.4 m', '2 Dokter', 'Perhatian'],
        ['Jantung', '1,580', '10.2 m', '2 Dokter', 'Sangat Baik']
      ],
      recommendations: [
        'Lakukan penambahan dokter cadangan pada jam puncak (peak hour) pukul 09:00 - 11:00.',
        'Integrasikan notifikasi Whatsapp antrean otomatis untuk mengurangi kepadatan ruang tunggu poliklinik gigi.'
      ]
    },
    KPI_BED_MANAGEMENT: {
      id: 'KPI_BED_MANAGEMENT',
      title: 'Bed Management (BOR)',
      category: 'Efisiensi Operasional',
      description: 'Pemantauan alokasi tempat tidur rumah sakit secara terpusat, koordinasi ketersediaan bed, dan efisiensi waktu pembersihan bed.',
      metrics: [], // Akan diisi oleh API
      chartType: 'bar',
      chartYLabel: 'Jumlah Bed',
      chartData: [], // Akan diisi oleh API
      tableHeaders: ['Bangsal Rawat', 'Kelas', 'Kapasitas', 'Terisi', 'Kosong', 'BOR (%)'],
      tableRows: [], // Akan diisi oleh API
      recommendations: []
    },
    KPI_ANTRIAN: {
      id: 'KPI_ANTRIAN',
      title: 'Manajemen Antrian',
      category: 'Efisiensi Operasional',
      description: 'Pemantauan alur pendaftaran antrean mandiri, waktu tunggu peresepan apotek, dan tingkat kepuasan loket pendaftaran.',
      metrics: [], // Akan diisi oleh API
      chartType: 'line',
      chartYLabel: 'Jumlah Antrean',
      chartData: [], // Akan diisi oleh API
      tableHeaders: ['Poliklinik', 'Total Antrean', 'Menunggu', 'Selesai', 'Status Indikator'],
      tableRows: [], // Akan diisi oleh API
      recommendations: []
    },
    KPI_RAWAT_INAP: {
      id: 'KPI_RAWAT_INAP',
      title: 'Rawat Inap',
      category: 'Pelayanan Medis',
      description: 'Analisis efisiensi pemanfaatan tempat tidur, rata-rata lama hari rawat, dan rasio kematian pasien di ruang perawatan.',
      metrics: [
        { label: 'BOR (Bed Occupancy)', value: '78.4%', change: '+3.5%', trend: 'up', sub: 'Target 60% - 85%', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'ALOS (Avg Stay)', value: '4.2 Hari', change: '-0.3 Hari', trend: 'up', sub: 'Standard nasional: 3-9 Hari', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'TOI (Turnover Interval)', value: '1.2 Hari', change: '-0.1 Hari', trend: 'up', sub: 'Standard nasional: 1-3 Hari', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'NDR (Net Death Rate)', value: '1.1 ‰', change: '-0.2 ‰', trend: 'up', sub: 'Target Kemenkes < 25 ‰', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Persentase BOR (%)',
      chartData: [
        { label: 'Jul 25', value: 70, target: 75 },
        { label: 'Ags 25', value: 72, target: 75 },
        { label: 'Sep 25', value: 74, target: 75 },
        { label: 'Okt 25', value: 73, target: 75 },
        { label: 'Nov 25', value: 75, target: 75 },
        { label: 'Des 25', value: 78, target: 75 },
        { label: 'Jan 26', value: 76, target: 80 },
        { label: 'Feb 26', value: 77, target: 80 },
        { label: 'Mar 26', value: 79, target: 80 },
        { label: 'Apr 26', value: 78, target: 80 },
        { label: 'Mei 26', value: 80, target: 80 },
        { label: 'Jun 26', value: 82, target: 80 }
      ],
      tableHeaders: ['Ruang Perawatan', 'Kapasitas Bed', 'Terisi (Avg)', 'BOR Aktif', 'ALOS Per Ruangan'],
      tableRows: [
        ['Gedung Semeru (VIP)', '20 Bed', '17 Bed', '85.0%', '3.8 Hari'],
        ['Gedung Ijen (Kelas 1)', '30 Bed', '24 Bed', '80.0%', '4.1 Hari'],
        ['Gedung Raung (Kelas 2)', '40 Bed', '31 Bed', '77.5%', '4.5 Hari'],
        ['Gedung Baluran (Kelas 3)', '60 Bed', '52 Bed', '86.6%', '4.8 Hari']
      ],
      recommendations: [
        'Pertahankan tingkat BOR Kelas 3 di bawah 85% untuk menjaga keselamatan pasien dan efisiensi pencegahan infeksi nosokomial.',
        'Lakukan audit berkala untuk pasien dengan ALOS > 10 hari guna mengoptimalkan rotasi bed.'
      ]
    },
    KPI_IGD: {
      id: 'KPI_IGD',
      title: 'IGD (Instalasi Gawat Darurat)',
      category: 'Pelayanan Kritis',
      description: 'Pemantauan respon triase gawat darurat, ketepatan penanganan kritis, dan alur evakuasi rujukan ke ruangan/OK.',
      metrics: [
        { label: 'Response Time (Triage)', value: '3.8 Menit', change: '-0.9 Menit', trend: 'up', sub: 'Target Kemenkes < 5.0m', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        { label: 'Total Pasien IGD', value: '1,890', change: '+12.4%', trend: 'up', sub: 'Kunjungan bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Death on Arrival (DOA)', value: '0.05%', change: '-0.02%', trend: 'up', sub: 'Target < 0.1%', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Kepuasan IGD', value: '4.78 / 5.0', change: '+1.5%', trend: 'up', sub: 'Target 4.5', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'area',
      chartYLabel: 'Jumlah Pasien',
      chartData: [
        { label: 'Jul 25', value: 1450, target: 1400 },
        { label: 'Ags 25', value: 1510, target: 1400 },
        { label: 'Sep 25', value: 1580, target: 1450 },
        { label: 'Okt 25', value: 1520, target: 1450 },
        { label: 'Nov 25', value: 1600, target: 1500 },
        { label: 'Des 25', value: 1720, target: 1500 },
        { label: 'Jan 26', value: 1680, target: 1600 },
        { label: 'Feb 26', value: 1710, target: 1600 },
        { label: 'Mar 26', value: 1820, target: 1650 },
        { label: 'Apr 26', value: 1780, target: 1650 },
        { label: 'Mei 26', value: 1850, target: 1700 },
        { label: 'Jun 26', value: 1890, target: 1700 }
      ],
      tableHeaders: ['Kategori Triase', 'Total Kasus', 'Waktu Respon (Avg)', 'Tindak Lanjut Utama', 'Tingkat Kelangsungan Hidup'],
      tableRows: [
        ['Merah (Resusitasi)', '184', '1.2 m', 'Kamar Operasi / ICU', '98.9%'],
        ['Kuning (Emergency)', '512', '3.1 m', 'Ruang Rawat Inap', '99.7%'],
        ['Hijau (Urgent)', '1,024', '5.4 m', 'Rawat Jalan / Pulang', '100%'],
        ['Biru (Non-Urgent)', '170', '8.9 m', 'Apotek / Pulang', '100%']
      ],
      recommendations: [
        'Jam sibuk IGD terdeteksi di shift siang (14:00 - 21:00). Tambahkan 1 perawat triase cadangan pada jam tersebut.',
        'Pastikan obat-obatan emergency (crash cart) diresertifikasi setiap pergantian shift.'
      ]
    },
    KPI_ICU: {
      id: 'KPI_ICU',
      title: 'ICU (Intensive Care Unit)',
      category: 'Pelayanan Intensif',
      description: 'Indikator mutu ruang perawatan intensif dewasa, kepatuhan penggunaan alat bantu napas, dan tingkat mortalitas.',
      metrics: [
        { label: 'BOR ICU', value: '82.5%', change: '+4.1%', trend: 'neutral', sub: 'Target 60% - 85%', color: 'bg-amber-50 text-amber-700 border-amber-100' },
        { label: 'Ventilator Days', value: '142 Hari', change: '-8.0%', trend: 'up', sub: 'Utilisasi ventilator', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Survival Rate', value: '94.8%', change: '+1.2%', trend: 'up', sub: 'Target mutu > 90%', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'VAP Rate', value: '1.2 ‰', change: '-0.3 ‰', trend: 'up', sub: 'Infeksi Ventilator (Target <2‰)', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'line',
      chartYLabel: 'BOR ICU (%)',
      chartData: [
        { label: 'Jul 25', value: 72, target: 78 },
        { label: 'Ags 25', value: 74, target: 78 },
        { label: 'Sep 25', value: 75, target: 78 },
        { label: 'Okt 25', value: 73, target: 78 },
        { label: 'Nov 25', value: 76, target: 78 },
        { label: 'Des 25', value: 80, target: 78 },
        { label: 'Jan 26', value: 78, target: 80 },
        { label: 'Feb 26', value: 79, target: 80 },
        { label: 'Mar 26', value: 81, target: 80 },
        { label: 'Apr 26', value: 80, target: 80 },
        { label: 'Mei 26', value: 83, target: 80 },
        { label: 'Jun 26', value: 85, target: 80 }
      ],
      tableHeaders: ['Indikator Mutu', 'Realisasi', 'Standar Target', 'Status Pencapaian', 'Rekomendasi'],
      tableRows: [
        ['Mortalitas ICU', '5.2%', '< 10.0%', 'Tercapai', 'Pertahankan penanganan'],
        ['Rata-rata ALOS ICU', '4.8 Hari', '3.0 - 5.0 Hari', 'Tercapai', 'Evaluasi kriteria keluar'],
        ['Kejadian Dekubitus', '0.0%', '< 1.5%', 'Sangat Baik', 'Zero incident dipertahankan'],
        ['Kepatuhan Hand Hygiene', '98.5%', '> 95.0%', 'Tercapai', 'Berikan reward berkala']
      ],
      recommendations: [
        'Lakukan audit klinis mingguan untuk pencegahan Ventilator-Associated Pneumonia (VAP).',
        'Pertahankan kepatuhan cuci tangan (hand hygiene) di angka minimal 95% bagi semua dokter spesialis tamu.'
      ]
    },
    KPI_HCU: {
      id: 'KPI_HCU',
      title: 'HCU (High Care Unit)',
      category: 'Pelayanan Intensif',
      description: 'Pemantauan pasien dengan kondisi stabil namun memerlukan observasi ketat, pemantauan tanda vital kontinu.',
      metrics: [
        { label: 'BOR HCU', value: '74.2%', change: '-2.1%', trend: 'neutral', sub: 'Target 60% - 80%', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Rujuk Balik Inap', value: '88.4%', change: '+3.2%', trend: 'up', sub: 'Selesai observasi ketat', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Transfer ke ICU', value: '4.5%', change: '-1.1%', trend: 'up', sub: 'Pemburukan kondisi (Target <5%)', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        { label: 'Survival Rate HCU', value: '98.9%', change: '+0.4%', trend: 'up', sub: 'Target mutu > 95%', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Jumlah Kasus',
      chartData: [
        { label: 'Jul 25', value: 38, target: 45 },
        { label: 'Ags 25', value: 41, target: 45 },
        { label: 'Sep 25', value: 43, target: 45 },
        { label: 'Okt 25', value: 40, target: 45 },
        { label: 'Nov 25', value: 44, target: 45 },
        { label: 'Des 25', value: 48, target: 45 },
        { label: 'Jan 26', value: 45, target: 48 },
        { label: 'Feb 26', value: 46, target: 48 },
        { label: 'Mar 26', value: 50, target: 48 },
        { label: 'Apr 26', value: 47, target: 48 },
        { label: 'Mei 26', value: 51, target: 48 },
        { label: 'Jun 26', value: 52, target: 48 }
      ],
      tableHeaders: ['Jenis Kasus Utama', 'Total Pasien', 'Lama Rawat (Avg)', 'Tingkat Keberhasilan', 'Status Klinis'],
      tableRows: [
        ['Pasca Operasi Besar', '64', '2.1 Hari', '98.4%', 'Sangat Baik'],
        ['Krisis Hipertensi Stabil', '48', '1.8 Hari', '100%', 'Sangat Baik'],
        ['Gangguan Metabolik', '32', '3.2 Hari', '96.8%', 'Baik'],
        ['Observasi Kardiologi', '28', '2.0 Hari', '97.2%', 'Baik']
      ],
      recommendations: [
        'Optimalkan kriteria transfer keluar HCU ke ruang rawat inap dalam waktu maksimal 4 jam setelah dinyatakan stabil.',
        'Sediakan pelatihan ACLS (Advanced Cardiac Life Support) terbaru bagi 100% perawat pelaksana HCU.'
      ]
    },
    KPI_NICU: {
      id: 'KPI_NICU',
      title: 'NICU (Neonatal Intensive Care Unit)',
      category: 'Pelayanan Intensif',
      description: 'Pemantauan pelayanan intensif untuk bayi baru lahir usia 0-28 hari dengan komplikasi medis tinggi.',
      metrics: [
        { label: 'BOR NICU', value: '88.5%', change: '+6.2%', trend: 'neutral', sub: 'Kapasitas maksimal termanfaatkan', color: 'bg-amber-50 text-amber-700 border-amber-100' },
        { label: 'Survival Rate Bayi', value: '97.4%', change: '+0.8%', trend: 'up', sub: 'Target RS > 95%', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Rerata ALOS Bayi', value: '11.4 Hari', change: '-1.2 Hari', trend: 'up', sub: 'Kondisi prematuritas tinggi', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Infeksi Nosokomial', value: '0.1 ‰', change: '-0.05 ‰', trend: 'up', sub: 'Target < 1.0 ‰', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'line',
      chartYLabel: 'Jumlah Bayi Rawat',
      chartData: [
        { label: 'Jul 25', value: 15, target: 15 },
        { label: 'Ags 25', value: 17, target: 15 },
        { label: 'Sep 25', value: 18, target: 15 },
        { label: 'Okt 25', value: 16, target: 15 },
        { label: 'Nov 25', value: 19, target: 15 },
        { label: 'Des 25', value: 22, target: 15 },
        { label: 'Jan 26', value: 20, target: 18 },
        { label: 'Feb 26', value: 21, target: 18 },
        { label: 'Mar 26', value: 24, target: 18 },
        { label: 'Apr 26', value: 23, target: 18 },
        { label: 'Mei 26', value: 25, target: 18 },
        { label: 'Jun 26', value: 26, target: 18 }
      ],
      tableHeaders: ['Klasifikasi Berat Badan', 'Total Pasien', 'Rerata Kenaikan BB', 'Lama Inkubator', 'Tingkat Kelangsungan Hidup'],
      tableRows: [
        ['BBLSR (< 1000g)', '8 Pasien', '12g / hari', '24 Hari', '92.5%'],
        ['BBLR (1000 - 1500g)', '18 Pasien', '16g / hari', '14 Hari', '97.2%'],
        ['BB Cukup (> 2500g)', '14 Pasien', '25g / hari', '4 Hari', '100%'],
        ['Asfiksia Neonatorum', '12 Pasien', '18g / hari', '6 Hari', '98.1%']
      ],
      recommendations: [
        'Mengingat BOR NICU mendekati 90%, pertimbangkan penambahan 2 unit inkubator portable baru tahun ini.',
        'Sertifikasi metode perawatan Kangguru (Kangaroo Mother Care) bagi ibu menyusui secara agresif.'
      ]
    },
    KPI_PICU: {
      id: 'KPI_PICU',
      title: 'PICU (Pediatric Intensive Care Unit)',
      category: 'Pelayanan Intensif',
      description: 'Pemantauan indikator pelayanan medis intensif untuk pasien anak di atas usia 28 hari hingga 18 tahun.',
      metrics: [
        { label: 'BOR PICU', value: '64.8%', change: '-3.5%', trend: 'neutral', sub: 'Kapasitas stabil tercukupi', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Survival Rate Anak', value: '98.2%', change: '+0.3%', trend: 'up', sub: 'Target mutu > 95%', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Insiden Ventilator', value: '0 Kasus', change: '0', trend: 'neutral', sub: 'Zero incident', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Kepuasan Orang Tua', value: '4.88 / 5.0', change: '+2.4%', trend: 'up', sub: 'Target 4.5', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Jumlah Kunjungan PICU',
      chartData: [
        { label: 'Jul 25', value: 8, target: 10 },
        { label: 'Ags 25', value: 9, target: 10 },
        { label: 'Sep 25', value: 10, target: 10 },
        { label: 'Okt 25', value: 8, target: 10 },
        { label: 'Nov 25', value: 11, target: 10 },
        { label: 'Des 25', value: 12, target: 10 },
        { label: 'Jan 26', value: 10, target: 11 },
        { label: 'Feb 26', value: 11, target: 11 },
        { label: 'Mar 26', value: 13, target: 11 },
        { label: 'Apr 26', value: 11, target: 11 },
        { label: 'Mei 26', value: 14, target: 11 },
        { label: 'Jun 26', value: 12, target: 11 }
      ],
      tableHeaders: ['Diagnosis Klinis Utama', 'Total Pasien', 'Lama Rawat (Avg)', 'Rerata Terapi Cairan', 'Tingkat Keberhasilan'],
      tableRows: [
        ['Dengue Shock Syndrome', '14', '3.5 Hari', 'Ketat & Teratur', '100%'],
        ['Status Epileptikus', '8', '2.8 Hari', 'Sesuai Protokol', '98.5%'],
        ['Pneumonia Berat', '12', '4.2 Hari', 'Bantuan Oksigen', '97.2%'],
        ['Gastroenteritis Dehidrasi Berat', '10', '2.1 Hari', 'Rehidrasi Agresif', '100%']
      ],
      recommendations: [
        'Lakukan evaluasi kepatuhan clinical pathway penanganan Dengue Shock Syndrome (DSS) anak.',
        'Sediakan ruang tunggu khusus yang nyaman dan edukatif bagi orang tua pasien kritis anak.'
      ]
    },
    KPI_PERINATOLOGI: {
      id: 'KPI_PERINATOLOGI',
      title: 'Perinatologi',
      category: 'Pelayanan Kebidanan & Anak',
      description: 'Pemantauan bayi baru lahir dengan risiko rendah hingga sedang, penyembuhan ikterus neonatorum, dan inisiasi menyusui dini.',
      metrics: [
        { label: 'Bayi Lahir Sehat', value: '242 Bayi', change: '+12.4%', trend: 'up', sub: 'Bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Keberhasilan IMD', value: '96.8%', change: '+2.1%', trend: 'up', sub: 'Target rumah sakit > 90%', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Fototerapi Sukses', value: '100%', change: 'Stabil', trend: 'neutral', sub: 'Kasus ikterus neonatal', color: 'bg-amber-50 text-amber-700 border-amber-100' },
        { label: 'Infeksi Tali Pusat', value: '0.0%', change: '0', trend: 'neutral', sub: 'Zero incident', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'area',
      chartYLabel: 'Jumlah Kelahiran',
      chartData: [
        { label: 'Normal (Vagina)', value: 148, target: 130 },
        { label: 'Seksio Sesarea (SC)', value: 94, target: 100 }
      ],
      tableHeaders: ['Indikator Pelayanan', 'Kelahiran Bulan Ini', 'Target Mutu', 'Pencapaian', 'Catatan Klinis'],
      tableRows: [
        ['Rawat Gabung (Rooming-in)', '214 Kasus', '> 85.0%', 'Tercapai (88.4%)', 'Mendorong ASI eksklusif'],
        ['Ikterus Sembuh Fototerapi', '18 Kasus', '100%', 'Sangat Baik', 'Rata-rata 2.1 hari terapi'],
        ['Bayi Berat Lahir Rendah', '22 Kasus', '95.0%', 'Tercapai (96.2%)', 'Diberikan perhatian nutrisi'],
        ['Kematian Perinatal', '0 Kasus', '0%', 'Tercapai', 'Zero mortality dipertahankan']
      ],
      recommendations: [
        'Tingkatkan persentase inisiasi menyusui dini (IMD) pada kelahiran sesar dengan anestesi regional.',
        'Lakukan edukasi perawatan pasca pulang dan laktasi terstruktur kepada ibu sebelum pulang dari rumah sakit.'
      ]
    },
    KPI_KAMAR_OPERASI: {
      id: 'KPI_KAMAR_OPERASI',
      title: 'Kamar Operasi (OK)',
      category: 'Pelayanan Khusus',
      description: 'Pemantauan ketepatan jadwal operasi elektif, rasio pembatalan, utilitas meja operasi, serta keselamatan bedah.',
      metrics: [
        { label: 'Total Tindakan Bedah', value: '384 Operasi', change: '+15.2%', trend: 'up', sub: 'Elektif & Emergency', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Kepatuhan Surgical Checklist', value: '100%', change: 'Stabil', trend: 'neutral', sub: 'Standar akreditasi WHO', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Penundaan Operasi', value: '1.4%', change: '-0.8%', trend: 'up', sub: 'Target nasional < 5.0%', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Infeksi Luka Operasi', value: '0.08%', change: '-0.02%', trend: 'up', sub: 'Target Kemenkes < 1.5%', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Jumlah Bedah',
      chartData: [
        { label: 'Bedah Umum', value: 124, target: 100 },
        { label: 'Kebidanan / Obgyn', value: 98, target: 90 },
        { label: 'Orthopedi / Tulang', value: 76, target: 80 },
        { label: 'Urologi & Lainnya', value: 86, target: 70 }
      ],
      tableHeaders: ['Kamar Bedah (OK)', 'Kapasitas Harian', 'Utilitas Harian', 'Operasi Elektif', 'Operasi Cito (Emergency)'],
      tableRows: [
        ['OK 1 (Major)', '8 Pasien', '85.2%', '142 Tindakan', '18 Tindakan'],
        ['OK 2 (Orthopedi)', '6 Pasien', '78.4%', '112 Tindakan', '12 Tindakan'],
        ['OK 3 (Emergency)', 'Standby 24h', '64.5%', '20 Tindakan', '68 Tindakan'],
        ['OK 4 (Minor/Mata)', '10 Pasien', '90.2%', '12 Tindakan', '0 Tindakan']
      ],
      recommendations: [
        'Pertahankan kepatuhan Surgical Safety Checklist (Sign In, Time Out, Sign Out) 100% demi keselamatan pasien.',
        'Optimalkan alur serah terima pasien dari ruang rawat ke OK untuk mempercepat penyiapan meja bedah.'
      ]
    },
    KPI_CSSD: {
      id: 'KPI_CSSD',
      title: 'CSSD (Central Sterile Supply Department)',
      category: 'Pelayanan Penunjang',
      description: 'Menjamin ketersediaan alat medis steril, pemantauan mesin autoclave, indikator kimia/biologi penanda sterilisasi.',
      metrics: [
        { label: 'Alat Medis Disterilkan', value: '18,450 Pack', change: '+9.8%', trend: 'up', sub: 'Bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Indikator Biologi Lulus', value: '100%', change: 'Stabil', trend: 'neutral', sub: 'Bebas kuman (Target 100%)', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Mesin Sterilisasi Load', value: '312 Siklus', change: '+4.2%', trend: 'neutral', sub: 'Autoclave efisiensi', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Kerusakan Alat / Komplain', value: '0 Kasus', change: '0', trend: 'neutral', sub: 'Zero complain', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'line',
      chartYLabel: 'Jumlah Alat Steril',
      chartData: [
        { label: 'Minggu 1', value: 4120, target: 4000 },
        { label: 'Minggu 2', value: 4560, target: 4000 },
        { label: 'Minggu 3', value: 4890, target: 4000 },
        { label: 'Minggu 4', value: 4880, target: 4000 }
      ],
      tableHeaders: ['Unit Pemesan Alat', 'Jumlah Permintaan', 'Tepat Waktu (%)', 'Indikator Fisik Steril', 'Status Distribusi'],
      tableRows: [
        ['Kamar Operasi (OK)', '12,450 Set', '99.2%', 'Lolos Uji Kimia', 'Sangat Baik'],
        ['Instalasi Gawat Darurat', '2,410 Set', '100%', 'Lolos Uji Kimia', 'Sangat Baik'],
        ['Poliklinik Rawat Jalan', '1,920 Set', '98.5%', 'Lolos Uji Kimia', 'Baik'],
        ['Ruang Rawat Inap', '1,670 Set', '97.4%', 'Lolos Uji Kimia', 'Baik']
      ],
      recommendations: [
        'Lakukan kalibrasi tahunan berkala untuk semua mesin autoclave uap dan autoclave suhu rendah (plasma).',
        'Pertahankan pencatatan traceability alat menggunakan barcode untuk mempermudah audit investigasi HAIs.'
      ]
    },
    KPI_HEMODIALISA: {
      id: 'KPI_HEMODIALISA',
      title: 'Hemodialisa (HD)',
      category: 'Pelayanan Khusus',
      description: 'Pemantauan sesi pencucian darah pasien gagal ginjal kronis, efisiensi utilisasi mesin hemodialisa, dan mutu klinis.',
      metrics: [
        { label: 'Total Sesi HD', value: '1,240 Sesi', change: '+6.8%', trend: 'up', sub: 'Tindakan bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Pasien HD Aktif', value: '142 Pasien', change: '+3.5%', trend: 'up', sub: 'Rutinitas mingguan', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Uptime Mesin HD', value: '99.8%', change: '+0.1%', trend: 'up', sub: 'Target kehandalan > 98%', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Komplain Pelayanan', value: '0.0%', change: '0', trend: 'neutral', sub: 'Zero complaint', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Jumlah Tindakan HD',
      chartData: [
        { label: 'Jan', value: 1050, target: 1100 },
        { label: 'Feb', value: 1120, target: 1100 },
        { label: 'Mar', value: 1190, target: 1100 },
        { label: 'Apr', value: 1240, target: 1100 }
      ],
      tableHeaders: ['Shift Pelayanan', 'Mesin Terpakai', 'Kapasitas Sesi', 'Utilisasi Rerata', 'Insiden Reaksi Alergi'],
      tableRows: [
        ['Shift Pagi (07:00-12:00)', '24 Mesin', '24 Sesi', '100%', '0 Kasus'],
        ['Shift Siang (13:00-18:00)', '24 Mesin', '24 Sesi', '95.8%', '0 Kasus'],
        ['Shift Malam (19:00-24:00)', '24 Mesin', '12 Sesi', '45.2%', '0 Kasus']
      ],
      recommendations: [
        'Pertahankan kepatuhan sterilisasi sirkuit air RO (Reverse Osmosis) setiap bulan demi menjamin kadar endotoksin nihil.',
        'Sediakan program bimbingan nutrisi dan kontrol cairan tubuh untuk meningkatkan kualitas hidup pasien HD.'
      ]
    },
    KPI_MCU: {
      id: 'KPI_MCU',
      title: 'Medical Check Up (MCU)',
      category: 'Pelayanan Khusus',
      description: 'Analisis kunjungan pemeriksaan kesehatan preventif, kecepatan pelaporan hasil pemeriksaan, dan paket terpopuler.',
      metrics: [
        { label: 'Kunjungan Peserta', value: '984 Orang', change: '+18.2%', trend: 'up', sub: 'Bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Kecepatan Hasil (Avg)', value: '18.4 Jam', change: '-4.2 Jam', trend: 'up', sub: 'Target < 24.0 Jam', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Omset MCU', value: '94.5%', change: '+5.4%', trend: 'up', sub: 'Persentase target bulanan', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Rating Kepuasan', value: '4.85 / 5.0', change: '+1.8%', trend: 'up', sub: 'Target kepuasan 4.5', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'radial',
      chartYLabel: 'Distribusi Paket',
      chartData: [
        { label: 'Paket Karyawan', value: 540, target: 500 },
        { label: 'Paket Eksekutif', value: 180, target: 150 },
        { label: 'Paket Dasar', value: 154, target: 200 },
        { label: 'Paket Pre-Marital', value: 110, target: 100 }
      ],
      tableHeaders: ['Nama Paket MCU', 'Volume Terjual', 'Rerata Kecepatan Hasil', 'Omset Kotor', 'Tingkat Kepuasan'],
      tableRows: [
        ['Paket Screening Industri / PT', '540 Paket', '12.4 Jam', 'Sesuai Kontrak', '4.82 / 5.0'],
        ['Paket Executive Gold', '180 Paket', '22.1 Jam', 'Premi Tinggi', '4.91 / 5.0'],
        ['Paket Basic Plus', '154 Paket', '16.5 Jam', 'Sangat Baik', '4.78 / 5.0'],
        ['Paket Pranikah (Pre-Marital)', '110 Paket', '20.2 Jam', 'Tercapai', '4.88 / 5.0']
      ],
      recommendations: [
        'Rancang kampanye digital khusus bagi "Paket MCU Pranikah" bekerja sama dengan Dinas Kependudukan/KUA lokal.',
        'Percepat alur pengesahan resume dokter spesialis dalam satu platform digital untuk mereduksi waktu rilis MCU di bawah 12 jam.'
      ]
    },
    KPI_REHABILITASI_MEDIK: {
      id: 'KPI_REHABILITASI_MEDIK',
      title: 'Rehabilitasi Medik / Fisioterapi',
      category: 'Pelayanan Penunjang',
      description: 'Pemantauan layanan terapi fisik, okupasi, wicara, kepuasan pasien stroke/cedera, dan kepatuhan jadwal kedatangan.',
      metrics: [
        { label: 'Total Sesi Terapi', value: '1,894 Sesi', change: '+14.2%', trend: 'up', sub: 'Bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Pasien Stroke Pulih (Avg)', value: '88.4%', change: '+3.1%', trend: 'up', sub: 'Skala pemulihan mandiri', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Rasio Kehadiran Pasien', value: '96.2%', change: '+0.8%', trend: 'up', sub: 'Tepat waktu janji temu', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Uptime Alat Terapi', value: '100%', change: 'Stabil', trend: 'neutral', sub: 'SWD, MWD, Ultrasound', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'line',
      chartYLabel: 'Jumlah Terapi',
      chartData: [
        { label: 'Fisioterapi', value: 1240, target: 1100 },
        { label: 'Terapi Okupasi', value: 384, target: 350 },
        { label: 'Terapi Wicara', value: 270, target: 200 }
      ],
      tableHeaders: ['Jenis Layanan Rehab', 'Jumlah Sesi', 'Utilitas Ruangan', 'Rerata Sesi Per Pasien', 'Tingkat Keberhasilan'],
      tableRows: [
        ['Fisioterapi (Neurologi/Stroke)', '942 Sesi', '88.2%', '8 Sesi', '92.4%'],
        ['Fisioterapi (Muskuloskeletal)', '682 Sesi', '74.2%', '6 Sesi', '94.8%'],
        ['Terapi Wicara (Anak/Pediatri)', '142 Sesi', '68.5%', '12 Sesi', '85.2%'],
        ['Terapi Okupasi (Anak/Autisme)', '128 Sesi', '65.4%', '10 Sesi', '88.1%']
      ],
      recommendations: [
        'Siapkan unit penjadwalan mandiri lewat portal web atau aplikasi untuk menekan angka penumpukan di pagi hari.',
        'Sediakan bahan edukasi video latihan fisik mandiri di rumah (home exercise program) bagi pasien stroke.'
      ]
    },
    KPI_HOME_CARE: {
      id: 'KPI_HOME_CARE',
      title: 'Home Care',
      category: 'Pelayanan Luar RS',
      description: 'Layanan kunjungan kesehatan ke rumah pasien (perawatan luka diabetik, pasca stroke, pemantauan paliatif).',
      metrics: [
        { label: 'Total Kunjungan Rumah', value: '312 Kunjungan', change: '+24.8%', trend: 'up', sub: 'Bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Pasien Aktif Terdaftar', value: '54 Pasien', change: '+8.0%', trend: 'up', sub: 'Program kontinuitas', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Jarak Tempuh Rerata', value: '8.4 KM', change: '+1.2 KM', trend: 'neutral', sub: 'Cakupan radius layanan', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Kepuasan Keluarga', value: '4.91 / 5.0', change: '+1.1%', trend: 'up', sub: 'Target indeks 4.60', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Jumlah Kunjungan',
      chartData: [
        { label: 'Minggu 1', value: 68, target: 60 },
        { label: 'Minggu 2', value: 82, target: 60 },
        { label: 'Minggu 3', value: 78, target: 60 },
        { label: 'Minggu 4', value: 84, target: 60 }
      ],
      tableHeaders: ['Jenis Perawatan Home Care', 'Jumlah Kasus', 'Petugas Terlibat', 'Rerata Rating Layanan', 'Tepat Jadwal (%)'],
      tableRows: [
        ['Perawatan Luka Diabetik', '142 Kunjungan', 'Tim Perawat Luka', '4.94 / 5.0', '98.5%'],
        ['Rehabilitasi Pasca Stroke', '94 Kunjungan', 'Fisioterapis Senior', '4.88 / 5.0', '97.2%'],
        ['Perawatan Bayi Baru Lahir', '48 Kunjungan', 'Bidan Komunitas', '4.92 / 5.0', '100%'],
        ['Asuhan Paliatif Kanker', '28 Kunjungan', 'Dokter Umum & Perawat', '4.95 / 5.0', '98.0%']
      ],
      recommendations: [
        'Maksimalkan koordinasi rute perjalanan tim Home Care menggunakan peta digital guna menekan biaya bahan bakar operasional.',
        'Sertakan foto dokumentasi perkembangan luka sebelum dan sesudah tindakan dalam rekam medis elektronik pasien.'
      ]
    },
    KPI_AMBULANCE: {
      id: 'KPI_AMBULANCE',
      title: 'Ambulance (Instalasi Mobil Jenazah & Emergency)',
      category: 'Pelayanan Darurat',
      description: 'Pemantauan mobilisasi evakuasi gawat darurat, ketepatan respon panggilan, dan perawatan teknis armada.',
      metrics: [
        { label: 'Panggilan Darurat', value: '112 Evakuasi', change: '+14.2%', trend: 'up', sub: 'Mobilisasi darurat', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Response Time Driver', value: '8.4 Menit', change: '-1.8 Menit', trend: 'up', sub: 'Target < 10.0 Menit', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Armada Siap Pakai', value: '5 / 5 Unit', change: '100%', trend: 'neutral', sub: 'Kesiapan teknis total', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Insiden Transportasi', value: '0 Kasus', change: 'Nihil', trend: 'neutral', sub: 'Aman (Target Zero Accident)', color: 'bg-rose-50 text-rose-700 border-rose-100' }
      ],
      chartType: 'area',
      chartYLabel: 'Kejadian Evakuasi',
      chartData: [
        { label: 'Banyuwangi Kota', value: 68, target: 50 },
        { label: 'Rogojampi', value: 24, target: 20 },
        { label: 'Giri & Kalipuro', value: 12, target: 15 },
        { label: 'Luar Kabupaten', value: 8, target: 5 }
      ],
      tableHeaders: ['No Armada', 'Jenis Unit', 'Total Evakuasi', 'Waktu Respon (Avg)', 'Sertifikasi Alat', 'Kondisi Mesin'],
      tableRows: [
        ['P-9901-RS', 'Ambulance Advance Trauma', '48 Kali', '7.4 Menit', 'Aktif Kemenkes', 'Sangat Baik (Servis Teratur)'],
        ['P-9902-RS', 'Ambulance Cardiac Medis', '32 Kali', '8.1 Menit', 'Aktif Kemenkes', 'Sangat Baik (Servis Teratur)'],
        ['P-9903-RS', 'Ambulance Transport', '20 Kali', '9.5 Menit', 'Aktif', 'Baik (Servis Teratur)'],
        ['P-9904-RS', 'Ambulance Transport', '12 Kali', '10.2 Menit', 'Aktif', 'Baik'],
        ['P-9905-RS', 'Mobil Jenazah', '24 Kali', 'N/A', 'N/A', 'Sangat Baik']
      ],
      recommendations: [
        'Pastikan pengecekan oksigen tabung dan baterai defribilator ambulans Advance dilakukan setiap shift pagi hari.',
        'Sertakan pelatihan Defensive Driving bagi semua pengemudi ambulans RS Yasmin secara berkala.'
      ]
    },
    KPI_RUJUKAN_PASIEN: {
      id: 'KPI_RUJUKAN_PASIEN',
      title: 'Rujukan Pasien',
      category: 'Pelayanan Jejaring',
      description: 'Pemantauan rujukan masuk dari puskesmas/klinik pratama sekitar, rujukan keluar ke RS tipe di atasnya, serta pemanfaatan aplikasi SISRUTE.',
      metrics: [
        { label: 'Rujukan Masuk', value: '842 Kasus', change: '+12.4%', trend: 'up', sub: 'Bulan ini', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Rujukan Keluar', value: '38 Kasus', change: '-10.5%', trend: 'up', sub: 'Karena fasilitas terbatas', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Respon Sisrute', value: '4.2 Menit', change: '-1.1 Menit', trend: 'up', sub: 'Sistem Rujukan Terintegrasi', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Rujukan Sesuai Prosedur', value: '98.8%', change: '+1.2%', trend: 'up', sub: 'Target kepatuhan 100%', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'line',
      chartYLabel: 'Jumlah Kasus Rujukan',
      chartData: [
        { label: 'Minggu 1', value: 195, target: 180 },
        { label: 'Minggu 2', value: 210, target: 180 },
        { label: 'Minggu 3', value: 225, target: 180 },
        { label: 'Minggu 4', value: 212, target: 180 }
      ],
      tableHeaders: ['Fasilitas Asal Rujukan', 'Jumlah Rujukan Masuk', 'Tindak Lanjut Utama', 'Diagnosis Terbanyak', 'Status Penanganan'],
      tableRows: [
        ['Puskesmas Giri', '154 Rujukan', 'Rawat Inap / IGD', 'Demam Berdarah (DHF)', 'Sangat Baik'],
        ['Klinik Pratama Yasmin', '128 Rujukan', 'Poliklinik Spesialis', 'Kontrol Post Operasi', 'Sangat Baik'],
        ['Puskesmas Rogojampi', '92 Rujukan', 'IGD Emergency', 'Cedera Kepala Ringan', 'Baik'],
        ['Puskesmas Banyuwangi Kota', '88 Rujukan', 'Poliklinik Anak', 'Diare Dehidrasi', 'Baik'],
        ['RS Swasta Lain (Tipe D)', '42 Rujukan', 'Transfer ICU / OK', 'Sindrom Koroner Akut', 'Sangat Baik']
      ],
      recommendations: [
        'Pertahankan respon cepat penolakan/penerimaan di aplikasi Sisrute di bawah 5 menit demi keselamatan pasien rujukan kritis.',
        'Lakukan evaluasi klinis berkala terkait 38 kasus rujukan keluar untuk memetakan penambahan dokter subspesialis baru.'
      ]
    },
    KPI_ANALISA_RUJUKAN: {
      id: 'KPI_ANALISA_RUJUKAN',
      title: 'Analisa Rujukan',
      category: 'Pelayanan Jejaring',
      description: 'Analisis mendalam pola tren rujukan pasien masuk, sebaran wilayah asal pasien, serta kepuasan klinik perujuk.',
      metrics: [
        { label: 'Puskesmas Perujuk', value: '34 Faskes', change: '+2 Faskes', trend: 'up', sub: 'Jejaring aktif', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Ketepatan Diagnosis', value: '96.2%', change: '+1.5%', trend: 'up', sub: 'Kecocokan faskes asal vs RS', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Loyalitas Jejaring', value: '92.4%', change: '+3.1%', trend: 'up', sub: 'Kepercayaan faskes perujuk', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Pasien Rujukan Balik', value: '520 Pasien', change: '+15.2%', trend: 'up', sub: 'PRB BPJS dikembalikan', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'bar',
      chartYLabel: 'Jumlah Kasus Sebaran',
      chartData: [
        { label: 'Banyuwangi Utara', value: 342, target: 300 },
        { label: 'Banyuwangi Tengah', value: 298, target: 250 },
        { label: 'Banyuwangi Selatan', value: 142, target: 150 },
        { label: 'Luar Banyuwangi', value: 60, target: 50 }
      ],
      tableHeaders: ['Klinik/Puskesmas Perujuk', 'Rujukan Masuk', 'Spesialis Dituju', 'Keluhan Diagnostik Utama', 'Evaluasi Feed-back'],
      tableRows: [
        ['Puskesmas Rogojampi', '182 Kasus', 'Penyakit Dalam / Anak', 'Diabetes & DHF', 'Sangat Baik (Feed-back 24h)'],
        ['Puskesmas Sobo', '142 Kasus', 'Spesialis Kandungan', 'Pre-eklampsia Ringan', 'Sangat Baik (Feed-back 24h)'],
        ['Klinik Pratama Sehat', '98 Kasus', 'Bedah Umum', 'Apendisitis Akut', 'Baik (Feed-back 48h)'],
        ['Puskesmas Singojuruh', '64 Kasus', 'Spesialis Saraf', 'Stroke Infark Stabil', 'Baik (Feed-back 48h)']
      ],
      recommendations: [
        'Kirimkan feed-back resume medis rujukan secara elektronik otomatis ke dokter perujuk maksimal 1x24 jam setelah pasien pulang.',
        'Selenggarakan simposium berkala bersama faskes jejaring untuk menyamakan standar penanganan kedaruratan kardiovaskular.'
      ]
    },
    KPI_KINERJA_PELAYANAN: {
      id: 'KPI_KINERJA_PELAYANAN',
      title: 'Kinerja Pelayanan RS Yasmin',
      category: 'Kinerja Mutu Komprehensif',
      description: 'Konsolidasi evaluasi standar pelayanan minimum rumah sakit, kepatuhan sasaran keselamatan pasien, dan indeks kinerja pegawai.',
      metrics: [
        { label: 'Sasaran Keselamatan Pasien', value: '99.8%', change: '+0.2%', trend: 'up', sub: 'Target akreditasi 100%', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        { label: 'Kepuasan Umum RS', value: '4.84 / 5.0', change: '+1.5%', trend: 'up', sub: 'Indeks kepuasan total', color: 'bg-teal-50 text-teal-700 border-teal-100' },
        { label: 'Kepatuhan Alur Klinis', value: '96.4%', change: '+2.1%', trend: 'up', sub: 'Clinical Pathway compliance', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { label: 'Produktivitas Staf', value: '92.5%', change: '+1.8%', trend: 'up', sub: 'Evaluasi kinerja triwulan', color: 'bg-amber-50 text-amber-700 border-amber-100' }
      ],
      chartType: 'line',
      chartYLabel: 'Indeks Kinerja (%)',
      chartData: [
        { label: 'Triwulan I', value: 91.2, target: 95.0 },
        { label: 'Triwulan II', value: 93.8, target: 95.0 },
        { label: 'Triwulan III', value: 95.2, target: 95.0 },
        { label: 'Triwulan IV', value: 96.4, target: 95.0 }
      ],
      tableHeaders: ['Indikator Mutu Nasional (IMN)', 'Target Mutu', 'Pencapaian', 'Status Penilaian', 'Rekomendasi Strategis'],
      tableRows: [
        ['Kepatuhan Identifikasi Pasien', '100%', '100%', 'Sangat Baik', 'Pertahankan zero error'],
        ['Kepatuhan Kebersihan Tangan', '> 85.0%', '98.4%', 'Sangat Baik', 'Pertahankan kepatuhan 5 moment'],
        ['Waktu Tanggu Rawat Jalan', '< 60 m', '12.4 Menit', 'Sangat Baik', 'Rotasi antrean online efektif'],
        ['Kepatuhan Penggunaan APD', '100%', '100%', 'Tercapai', 'Pertahankan budaya safety'],
        ['Suhu Ruang Obat Farmasi', '15-25 °C', '20.5 °C', 'Stabil', 'Sensor otomatis dipelihara']
      ],
      recommendations: [
        'Berikan sertifikat dan penghargaan bulanan kepada unit kerja dengan pencapaian Kinerja Mutu Pelayanan terbaik.',
        'Lakukan audit acak berkala untuk kepatuhan double-check identifikasi gelang pasien sebelum pemberian transfusi darah.'
      ]
    }
  };

  const getKpiData = (
    id: string, 
    tf: 'Daily' | 'Weekly' | 'Monthly', 
    dailyOpt: string, 
    weeklyOpt: string, 
    monthlyOpt: string
  ): KpiConfig => {
    const base = kpis[id] || kpis.KPI_RAWAT_JALAN;
    const kpi = JSON.parse(JSON.stringify(base)) as KpiConfig;

    // Deterministic seeded random to make the data consistent and realistic when filtering historical data
    const getSeededRandom = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
      }
      return () => {
        h = (h + 0x9e3779b9) | 0;
        let z = h;
        z ^= z >>> 16;
        z = Math.imul(z, 0x21f0aa7);
        z ^= z >>> 15;
        z = Math.imul(z, 0x735a2d97);
        z ^= z >>> 15;
        return (z >>> 0) / 4294967296;
      };
    };

    const activeOption = tf === 'Daily' ? dailyOpt : tf === 'Weekly' ? weeklyOpt : monthlyOpt;
    const rng = getSeededRandom(id + "_" + tf + "_" + activeOption);

    let optionMultiplier = 1.0;
    if (tf === 'Daily') {
      if (activeOption === 'kemarin') optionMultiplier = 0.94;
      else if (activeOption === '2-hari-lalu') optionMultiplier = 1.05;
      else if (activeOption === '3-hari-lalu') optionMultiplier = 0.88;
      else if (activeOption === '4-hari-lalu') optionMultiplier = 1.01;
      else if (activeOption === '5-hari-lalu') optionMultiplier = 0.96;
      else if (activeOption === '6-hari-lalu') optionMultiplier = 0.72; // Sunday/weekend
    } else if (tf === 'Weekly') {
      if (activeOption === 'minggu-lalu') optionMultiplier = 1.02;
      else if (activeOption === '2-pekan-lalu') optionMultiplier = 0.96;
      else if (activeOption === '3-pekan-lalu') optionMultiplier = 1.04;
      else if (activeOption === '4-pekan-lalu') optionMultiplier = 0.98;
    } else if (tf === 'Monthly') {
      if (activeOption === 'juni-2026') optionMultiplier = 0.97;
      else if (activeOption === 'mei-2026') optionMultiplier = 1.03;
      else if (activeOption === 'april-2026') optionMultiplier = 0.95;
      else if (activeOption === 'maret-2026') optionMultiplier = 1.01;
      else if (activeOption === 'februari-2026') optionMultiplier = 0.92;
    }

    if (tf === 'Daily') {
      kpi.metrics = kpi.metrics.map(m => {
        let val = m.value;
        let change = m.change;
        if (
          m.label.toLowerCase().includes('total') || 
          m.label.toLowerCase().includes('kunjungan') || 
          m.label.toLowerCase().includes('panggilan') || 
          m.label.toLowerCase().includes('tindakan') || 
          m.label.toLowerCase().includes('disterilkan') || 
          m.label.toLowerCase().includes('peserta') || 
          m.label.toLowerCase().includes('pasien') || 
          m.label.toLowerCase().includes('sesi') || 
          m.label.toLowerCase().includes('bayi') ||
          m.label.toLowerCase().includes('kasus')
        ) {
          const parsed = parseInt(m.value.replace(/[^0-9]/g, ''));
          if (!isNaN(parsed)) {
            const dailyVal = Math.max(1, Math.round((parsed / 30) * optionMultiplier * (0.95 + rng() * 0.1)));
            val = dailyVal.toLocaleString('id-ID');
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 5 + 1).toFixed(1) + '%';
        } else if (
          m.label.toLowerCase().includes('waktu') || 
          m.label.toLowerCase().includes('response') || 
          m.label.toLowerCase().includes('kecepatan') ||
          m.label.toLowerCase().includes('stay') ||
          m.label.toLowerCase().includes('interval')
        ) {
          const parsed = parseFloat(m.value);
          if (!isNaN(parsed)) {
            const dailyVal = (parsed * optionMultiplier * (0.9 + rng() * 0.2)).toFixed(1);
            val = dailyVal + ' ' + (m.value.split(' ')[1] || 'Menit');
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 8 + 2).toFixed(1) + '%';
        } else if (m.label.toLowerCase().includes('kepuasan') || m.label.toLowerCase().includes('rating')) {
          val = (4.7 + rng() * 0.25).toFixed(2) + ' / 5.0';
          change = '+' + (rng() * 1.5 + 0.5).toFixed(1) + '%';
        } else if (
          m.label.toLowerCase().includes('bor') || 
          m.label.toLowerCase().includes('rate') || 
          m.label.toLowerCase().includes('%') || 
          m.label.toLowerCase().includes('kepatuhan') || 
          m.label.toLowerCase().includes('sukses') ||
          m.label.toLowerCase().includes('uptime')
        ) {
          const parsed = parseFloat(m.value);
          if (!isNaN(parsed)) {
            const dailyVal = Math.min(100, parsed * optionMultiplier * (0.95 + rng() * 0.1)).toFixed(1);
            val = dailyVal + '%';
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 3).toFixed(1) + '%';
        }
        return { ...m, value: val, change };
      });

      const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
      const baseTarget = base.chartData[base.chartData.length - 1]?.target || 100;
      const isPercentage = kpi.chartYLabel.toLowerCase().includes('%') || kpi.chartYLabel.toLowerCase().includes('bor') || kpi.chartYLabel.toLowerCase().includes('indeks');
      
      kpi.chartData = hours.map((h, i) => {
        const multiplier = i === 0 || i === 1 ? 1.2 : i === 2 ? 0.9 : i === 3 || i === 4 ? 0.75 : i === 5 ? 1.1 : i === 6 ? 0.85 : 0.5;
        const target = isPercentage ? Math.round(baseTarget) : Math.max(5, Math.round((baseTarget / 30) * multiplier));
        const value = isPercentage 
          ? Math.min(100, Math.round(target * optionMultiplier * (0.9 + rng() * 0.18)))
          : Math.max(1, Math.round(target * optionMultiplier * (0.85 + rng() * 0.3)));
        return { label: h, value, target };
      });

    } else if (tf === 'Weekly') {
      kpi.metrics = kpi.metrics.map(m => {
        let val = m.value;
        let change = m.change;
        if (
          m.label.toLowerCase().includes('total') || 
          m.label.toLowerCase().includes('kunjungan') || 
          m.label.toLowerCase().includes('panggilan') || 
          m.label.toLowerCase().includes('tindakan') || 
          m.label.toLowerCase().includes('disterilkan') || 
          m.label.toLowerCase().includes('peserta') || 
          m.label.toLowerCase().includes('pasien') || 
          m.label.toLowerCase().includes('sesi') || 
          m.label.toLowerCase().includes('bayi') ||
          m.label.toLowerCase().includes('kasus')
        ) {
          const parsed = parseInt(m.value.replace(/[^0-9]/g, ''));
          if (!isNaN(parsed)) {
            const weeklyVal = Math.max(2, Math.round((parsed / 4) * optionMultiplier * (0.96 + rng() * 0.08)));
            val = weeklyVal.toLocaleString('id-ID');
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 4 + 0.5).toFixed(1) + '%';
        } else if (
          m.label.toLowerCase().includes('waktu') || 
          m.label.toLowerCase().includes('response') || 
          m.label.toLowerCase().includes('kecepatan') ||
          m.label.toLowerCase().includes('stay') ||
          m.label.toLowerCase().includes('interval')
        ) {
          const parsed = parseFloat(m.value);
          if (!isNaN(parsed)) {
            const weeklyVal = (parsed * optionMultiplier * (0.95 + rng() * 0.1)).toFixed(1);
            val = weeklyVal + ' ' + (m.value.split(' ')[1] || 'Menit');
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 5 + 1).toFixed(1) + '%';
        } else if (m.label.toLowerCase().includes('kepuasan') || m.label.toLowerCase().includes('rating')) {
          val = (4.72 + rng() * 0.22).toFixed(2) + ' / 5.0';
          change = '+' + (rng() * 1.2 + 0.2).toFixed(1) + '%';
        } else if (
          m.label.toLowerCase().includes('bor') || 
          m.label.toLowerCase().includes('rate') || 
          m.label.toLowerCase().includes('%') || 
          m.label.toLowerCase().includes('kepatuhan') || 
          m.label.toLowerCase().includes('sukses') ||
          m.label.toLowerCase().includes('uptime')
        ) {
          const parsed = parseFloat(m.value);
          if (!isNaN(parsed)) {
            const weeklyVal = Math.min(100, parsed * optionMultiplier * (0.97 + rng() * 0.06)).toFixed(1);
            val = weeklyVal + '%';
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 2).toFixed(1) + '%';
        }
        return { ...m, value: val, change };
      });

      const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      const baseTarget = base.chartData[base.chartData.length - 1]?.target || 100;
      const isPercentage = kpi.chartYLabel.toLowerCase().includes('%') || kpi.chartYLabel.toLowerCase().includes('bor') || kpi.chartYLabel.toLowerCase().includes('indeks');

      kpi.chartData = days.map((day, i) => {
        const multiplier = i === 0 || i === 1 ? 1.25 : i >= 2 && i <= 4 ? 1.0 : i === 5 ? 0.8 : 0.45;
        const target = isPercentage ? Math.round(baseTarget) : Math.max(5, Math.round((baseTarget / 4) * multiplier));
        const value = isPercentage 
          ? Math.min(100, Math.round(target * optionMultiplier * (0.92 + rng() * 0.14)))
          : Math.max(2, Math.round(target * optionMultiplier * (0.88 + rng() * 0.22)));
        return { label: day, value, target };
      });
    } else if (tf === 'Monthly') {
      kpi.metrics = kpi.metrics.map(m => {
        let val = m.value;
        let change = m.change;
        if (
          m.label.toLowerCase().includes('total') || 
          m.label.toLowerCase().includes('kunjungan') || 
          m.label.toLowerCase().includes('panggilan') || 
          m.label.toLowerCase().includes('tindakan') || 
          m.label.toLowerCase().includes('disterilkan') || 
          m.label.toLowerCase().includes('peserta') || 
          m.label.toLowerCase().includes('pasien') || 
          m.label.toLowerCase().includes('sesi') || 
          m.label.toLowerCase().includes('bayi') ||
          m.label.toLowerCase().includes('kasus')
        ) {
          const parsed = parseInt(m.value.replace(/[^0-9]/g, ''));
          if (!isNaN(parsed)) {
            const monthlyVal = Math.max(5, Math.round(parsed * optionMultiplier * (0.97 + rng() * 0.06)));
            val = monthlyVal.toLocaleString('id-ID');
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 3 + 0.2).toFixed(1) + '%';
        } else if (
          m.label.toLowerCase().includes('waktu') || 
          m.label.toLowerCase().includes('response') || 
          m.label.toLowerCase().includes('kecepatan') ||
          m.label.toLowerCase().includes('stay') ||
          m.label.toLowerCase().includes('interval')
        ) {
          const parsed = parseFloat(m.value);
          if (!isNaN(parsed)) {
            const monthlyVal = (parsed * optionMultiplier * (0.97 + rng() * 0.06)).toFixed(1);
            val = monthlyVal + ' ' + (m.value.split(' ')[1] || 'Menit');
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 4 + 0.5).toFixed(1) + '%';
        } else if (m.label.toLowerCase().includes('kepuasan') || m.label.toLowerCase().includes('rating')) {
          val = (4.75 + rng() * 0.2).toFixed(2) + ' / 5.0';
          change = '+' + (rng() * 1.0 + 0.1).toFixed(1) + '%';
        } else if (
          m.label.toLowerCase().includes('bor') || 
          m.label.toLowerCase().includes('rate') || 
          m.label.toLowerCase().includes('%') || 
          m.label.toLowerCase().includes('kepatuhan') || 
          m.label.toLowerCase().includes('sukses') ||
          m.label.toLowerCase().includes('uptime')
        ) {
          const parsed = parseFloat(m.value);
          if (!isNaN(parsed)) {
            const monthlyVal = Math.min(100, parsed * optionMultiplier * (0.98 + rng() * 0.04)).toFixed(1);
            val = monthlyVal + '%';
          }
          change = (rng() > 0.5 ? '+' : '-') + (rng() * 1.5).toFixed(1) + '%';
        }
        return { ...m, value: val, change };
      });

      // Show last 4 months trend on monthly charts
      const months = ["Apr", "Mei", "Jun", "Jul"];
      const baseTarget = base.chartData[base.chartData.length - 1]?.target || 100;
      const isPercentage = kpi.chartYLabel.toLowerCase().includes('%') || kpi.chartYLabel.toLowerCase().includes('bor') || kpi.chartYLabel.toLowerCase().includes('indeks');

      kpi.chartData = months.map((month, i) => {
        // Organic trend multipliers
        const baseMult = i === 0 ? 0.92 : i === 1 ? 1.02 : i === 2 ? 0.96 : 1.0;
        const target = isPercentage ? Math.round(baseTarget) : Math.max(10, Math.round(baseTarget * baseMult));
        const value = isPercentage 
          ? Math.min(100, Math.round(target * (0.94 + rng() * 0.12)))
          : Math.max(5, Math.round(target * optionMultiplier * (0.9 + rng() * 0.2)));
        return { label: month, value, target };
      });
    }

    return kpi;
  };

  const activeKpi = dynamicKpi || getKpiData(
    menu, 
    timeframe, 
    selectedDailyOption, 
    selectedWeeklyOption, 
    selectedMonthlyOption
  );

  // Chart rendering helpers (Hand-crafted beautiful SVGs for React 19 safety)
  const renderChart = () => {
    const data = activeKpi.chartData;
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 sm:h-56 text-gray-400">
          <ActivitySquare className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm font-bold">Belum ada data tren untuk periode ini.</p>
          <p className="text-xs mt-1">Data grafik akan muncul jika ada input harian yang tercatat.</p>
        </div>
      );
    }
    const maxVal = Math.max(...data.map(d => Math.max(d.value, d.target))) * 1.15;
    const height = 180;
    const width = 500;
    const padding = 40;

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const getX = (index: number) => padding + (index / (data.length - 1 || 1)) * chartWidth;
    const getY = (val: number) => height - padding - (val / maxVal) * chartHeight;

    if (activeKpi.chartType === 'line' || activeKpi.chartType === 'area') {
      const linePoints = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
      const targetPoints = data.map((d, i) => `${getX(i)},${getY(d.target)}`).join(' ');
      const areaPoints = `${getX(0)},${height - padding} ` + linePoints + ` ${getX(data.length - 1)},${height - padding}`;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56 font-sans">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const val = Math.round(maxVal * ratio);
            const y = height - padding - ratio * chartHeight;
            return (
              <g key={idx} className="opacity-40">
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                <text x={padding - 8} y={y + 4} className="text-[10px] fill-gray-400 font-bold font-mono text-right" textAnchor="end">{val}</text>
              </g>
            );
          })}

          {/* Area fill under the line */}
          {activeKpi.chartType === 'area' && (
            <polygon points={areaPoints} className="fill-emerald-500/10" />
          )}

          {/* Target Reference Line */}
          <polyline points={targetPoints} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" className="opacity-80" />
          
          {/* Actual Performance Line */}
          <polyline points={linePoints} fill="none" stroke="#0B4F4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Nodes */}
          {data.map((d, i) => (
            <g key={i} className="group cursor-pointer">
              <circle 
                cx={getX(i)} 
                cy={getY(d.value)} 
                r="5" 
                className="fill-[#0B4F4A] stroke-white stroke-2 transition-all duration-200" 
                style={{ transformOrigin: 'center', transformBox: 'fill-box' }} // 👈 TAMBAHKAN INI
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <text x={getX(i)} y={getY(d.value) - 10} className="text-[10px] font-black fill-[#0B4F4A] font-mono text-center" textAnchor="middle">{d.value}</text>
              <text x={getX(i)} y={height - padding + 16} className="text-[9px] font-bold fill-gray-500" textAnchor="middle">{d.label}</text>
            </g>
          ))}

          {/* Legend */}
          <g transform={`translate(${width - 150}, 15)`} className="text-[9px] font-bold">
            <line x1="0" y1="5" x2="15" y2="5" stroke="#0B4F4A" strokeWidth="3" />
            <text x="20" y="8" className="fill-slate-700">Realisasi</text>
            <line x1="75" y1="5" x2="90" y2="5" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3" />
            <text x="95" y="8" className="fill-slate-500">Target Mutu</text>
          </g>
        </svg>
      );
    } else if (activeKpi.chartType === 'bar') {
      const barWidth = Math.min(32, chartWidth / (data.length * 1.8));
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56 font-sans">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const val = Math.round(maxVal * ratio);
            const y = height - padding - ratio * chartHeight;
            return (
              <g key={idx} className="opacity-40">
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                <text x={padding - 8} y={y + 4} className="text-[10px] fill-gray-400 font-bold font-mono text-right" textAnchor="end">{val}</text>
              </g>
            );
          })}

          {/* Render Bars */}
          {data.map((d, i) => {
            const groupX = padding + (i / data.length) * chartWidth + (chartWidth / data.length - barWidth * 2) / 2;
            const barH = (d.value / maxVal) * chartHeight;
            const barY = height - padding - barH;

            const targetY = height - padding - (d.target / maxVal) * chartHeight;

            return (
              <g key={i}>
                {/* Background Shadow Bar */}
                <rect x={groupX} y={padding} width={barWidth} height={chartHeight} fill="#f1f5f9" rx="4" />
                
                {/* Actual value bar */}
                <rect x={groupX} y={barY} width={barWidth} height={barH} fill="url(#barGradient)" rx="4" />

                {/* Target line indicator across bar */}
                <line x1={groupX - 4} y1={targetY} x2={groupX + barWidth + 4} y2={targetY} stroke="#f97316" strokeWidth="2" strokeDasharray="2" />

                <text x={groupX + barWidth / 2} y={barY - 8} className="text-[10px] font-black fill-[#0B4F4A] font-mono text-center" textAnchor="middle">{d.value}%</text>
                <text x={groupX + barWidth / 2} y={height - padding + 16} className="text-[9px] font-bold fill-gray-500" textAnchor="middle">{d.label}</text>
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B4F4A" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>

          {/* Legend */}
          <g transform={`translate(${width - 150}, 15)`} className="text-[9px] font-bold">
            <rect x="0" y="0" width="12" height="8" fill="#0B4F4A" rx="1" />
            <text x="18" y="8" className="fill-slate-700">Pencapaian</text>
            <line x1="80" y1="4" x2="95" y2="4" stroke="#f97316" strokeWidth="2" />
            <text x="100" y="8" className="fill-slate-500">Target</text>
          </g>
        </svg>
      );
    } else {
      // Radial or Ring charts for specific KPIs (MCU, CSSD, dynamic distributions)
      return (
        <div className="flex flex-col sm:flex-row items-center justify-around h-48 py-4 px-6">
          <div className="relative h-32 w-32 flex items-center justify-center">
            {/* Simple Dynamic Circular Progress */}
            <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
              <path className="text-gray-100 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-deep-teal stroke-current" strokeDasharray="88, 100" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-headings font-mono">88%</span>
              <span className="text-[8px] uppercase tracking-widest font-black text-slate-400 leading-none">Rata-rata</span>
            </div>
          </div>
          <div className="space-y-2 font-sans w-full max-w-[200px]">
            {data.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center space-x-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-deep-teal' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                  <span className="text-gray-600 truncate max-w-[120px]">{d.label}</span>
                </div>
                <span className="font-bold text-gray-900 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Fungsi untuk generate tanggal dinamis
  const getDateOptions = (type: 'Daily' | 'Weekly' | 'Monthly') => {
    const options = [];
    const today = new Date();
    
    if (type === 'Daily') {
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const isoDate = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
        options.push({ value: isoDate, label: i === 0 ? `${label} (Hari Ini)` : i === 1 ? `${label} (Kemarin)` : label });
      }
    } else if (type === 'Weekly') {
      for (let i = 0; i < 4; i++) {
        const start = new Date(today);
        start.setDate(today.getDate() - (i * 7) - today.getDay() + 1); // Senin
        const isoDate = start.toISOString().split('T')[0];
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const label = `${start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
        options.push({ value: isoDate, label: i === 0 ? `Pekan Ini (${label})` : i === 1 ? `Pekan Lalu (${label})` : label });
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const isoDate = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        options.push({ value: isoDate, label });
      }
    }
    return options;
  };

  return (
    <div className="space-y-6 animate-fade-in-down font-sans pb-12">
      
      {/* Top Banner and Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-[#0B4F4A]/10 text-[#0B4F4A] rounded-xl border border-[#0B4F4A]/20">
            {getIcon(activeKpi.id)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono tracking-widest">{activeKpi.category}</span>
              <span className="text-[9px] font-black uppercase bg-[#f97316]/10 text-[#f97316] px-2 py-0.5 rounded-full border border-[#f97316]/20 font-mono tracking-wider">KPI LIVE</span>
            </div>
            <h3 className="text-lg font-bold text-headings tracking-tight mt-1">Dashboard Kinerja {activeKpi.title}</h3>
            <p className="text-xs text-gray-500 max-w-xl mt-1 leading-relaxed">{activeKpi.description}</p>
          </div>
        </div>

        {/* Dashboard controls */}
        <div className="flex items-center flex-wrap gap-2 self-stretch md:self-auto justify-end font-sans">
          {/* Timeframe switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-gray-200 text-xs">
            {['Daily', 'Weekly', 'Monthly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeframe === tf 
                    ? 'bg-white text-deep-teal shadow-2xs font-extrabold' 
                    : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                {tf === 'Daily' ? 'Harian' : tf === 'Weekly' ? 'Mingguan' : 'Bulanan'}
              </button>
            ))}
          </div>

          {/* Historical Period Selector with elegant Calendar icon wrapper */}
          <div className="flex items-center space-x-1.5 bg-white border border-gray-200 hover:border-[#0B4F4A]/30 rounded-xl px-3 py-1.5 transition-all text-xs shadow-3xs">
            <Calendar className="h-3.5 w-3.5 text-deep-teal shrink-0" />
            
            {timeframe === 'Daily' && (
              <select
                value={selectedDailyOption}
                onChange={(e) => { setSelectedDailyOption(e.target.value); handleRefresh(); }}
                className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
              >
                {getDateOptions('Daily').map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            {timeframe === 'Weekly' && (
              <select
                value={selectedWeeklyOption}
                onChange={(e) => { setSelectedWeeklyOption(e.target.value); handleRefresh(); }}
                className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
              >
                {getDateOptions('Weekly').map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            {timeframe === 'Monthly' && (
              <select
                value={selectedMonthlyOption}
                onChange={(e) => { setSelectedMonthlyOption(e.target.value); handleRefresh(); }}
                className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
              >
                {getDateOptions('Monthly').map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 border border-gray-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 cursor-pointer shadow-3xs"
            title="Refresh Data"
            id="kpi-refresh-btn"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#0B4F4A]' : ''}`} />
          </button>

          <button
            onClick={() => alert(`Laporan KPI ${activeKpi.title} berhasil diexport ke format PDF/Excel.`)}
            className="px-3.5 py-1.5 bg-[#0B4F4A] hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            id="kpi-export-btn"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor</span>
          </button>

          {menu !== 'KPI_RAWAT_JALAN' && menu !== 'KPI_BED_MANAGEMENT' && menu !== 'KPI_ANTRIAN' && (
            <button
              onClick={handleOpenManualInput}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer mr-2"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Input Manual</span>
            </button>
          )}
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${isRefreshing ? 'opacity-50 scale-[0.99]' : ''}`}>
        {activeKpi.metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-3xs p-5 space-y-2 hover:border-deep-teal/40 transition-all hover:shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider font-mono block truncate">{m.label}</span>
              <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border flex items-center space-x-0.5 ${m.color}`}>
                {m.trend === 'up' && <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
                {m.trend === 'down' && <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                <span>{m.change}</span>
              </span>
            </div>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-headings font-mono">{m.value}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-none">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRAPH & STRATEGIC RECOMMENDATIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Custom SVG Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-3xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-headings tracking-tight">Tren Kinerja Capaian</h4>
              <p className="text-[10px] text-gray-400 font-semibold">{activeKpi.chartYLabel} vs Target Mutu Standar</p>
            </div>
            <span className="text-[10px] font-black uppercase bg-slate-50 border border-divider px-2.5 py-1 rounded-xl text-slate-500 font-mono tracking-wider">
              {timeframe === 'Daily' ? '24 Jam Terakhir' : timeframe === 'Weekly' ? '4 Minggu Terakhir' : 'Rerata Triwulan'}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 min-h-[180px]">
            {renderChart()}
          </div>
        </div>

        {/* Right 1 col: AI Insights / Recommendations */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          {/* Decorative subtle background ring */}
          <div className="absolute -right-16 -top-16 h-36 w-36 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all duration-500" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="h-4 w-4 text-warm-orange animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-widest font-mono text-warm-orange">Analisa & Rekomendasi Mutu</h4>
            </div>

            <div className="space-y-4">
              {activeKpi.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <div className="h-5 w-5 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold border border-slate-700">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-400 relative z-10">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Ditinjau oleh Tim Komite Mutu</span>
            </span>
            <span className="font-mono">Verifikasi OK</span>
          </div>
        </div>
      </div>

      {/* DETAIL TABLE SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-3xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-headings tracking-tight">Rincian Operasional Departemen</h4>
            <p className="text-[10px] text-gray-400 font-semibold">Tabel rincian realisasi indikator kinerja sektoral terbaru.</p>
          </div>
          <div className="flex items-center space-x-1 text-[10px] font-black text-[#0B4F4A] uppercase tracking-wider font-mono">
            <Info className="h-3.5 w-3.5" />
            <span>Update Real-time</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] font-mono">
                {activeKpi.tableHeaders.map((th, i) => (
                  <th key={i} className="px-6 py-3.5 font-bold">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans font-medium text-slate-700">
              {activeKpi.tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  {row.map((val, i) => (
                    <td key={i} className="px-6 py-3.5">
                      {val === 'Sangat Baik' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full">Sangat Baik</span>
                      ) : val === 'Baik' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-teal-50 border border-teal-100 text-teal-700 rounded-full">Baik</span>
                      ) : val === 'Tercapai' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full">Tercapai</span>
                      ) : val === 'Sangat Baik' || val === 'Zero incident dipertahankan' || val === 'Stabil' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full">{val}</span>
                      ) : val === 'Perhatian' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700 rounded-full">Perhatian</span>
                      ) : (
                        <span className="font-semibold">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT MANUAL KPI */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in text-left">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-display font-bold text-headings">Input Data Manual: {activeKpi.title}</h4>
              <button onClick={() => setIsManualModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500 mb-4">Fitur ini digunakan jika data KPI belum tersedia di database lokal atau API SIMRS.</p>
              
              {manualData.map((field, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">{field.label}</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      const newData = [...manualData];
                      newData[idx].value = e.target.value;
                      setManualData(newData);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yasmin-green outline-none"
                    placeholder={`Masukkan nilai ${field.label}`}
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button onClick={() => setIsManualModalOpen(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xs">Batal</button>
                <button onClick={handleSaveManual} className="px-5 py-2.5 bg-yasmin-green text-white rounded-xl font-bold text-xs shadow-md">Simpan Data</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
