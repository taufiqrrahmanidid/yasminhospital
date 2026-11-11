import { Doctor, HealthCenter, CommunityClub, Article } from './types';
import { DOCTORS_DATA } from './doctors_data';

export { DOCTORS_DATA };


const imgPsikologiRemaja = '/assets/images/layan/rsyasminlayan_psikologiremaja_s.png';
const imgFertilitas = '/assets/images/layan/rsyasminlayan_fertilitas_s.png';
const imgStopRokok = '/assets/images/layan/rsyasminlayan_stoprokok_s.png';
const imgHajiUmroh = '/assets/images/layan/rsyasminlayan_hajiumroh_s.png';
const imgMcu = '/assets/images/layan/rsyasminlayan_mcu_s.png';
const imgEracs = '/assets/images/layan/rsyasminlayan_eracs_s.png';
const imgSundayClinic = '/assets/images/layan/rsyasminlayan_sundayclinic_s.png?v=2';
const imgHomeCare = '/assets/images/layan/rsyasminlayan_homecare_s.png';
const imgRehabilitas = '/assets/images/layan/rsyasminlayan_rehabilitas_s.png';
const imgIgdAmbulance = '/assets/images/layan/rsyasminlayan_igdambulance_s.png';
const imgKia = '/assets/images/layan/rsyasminlayan_kia_s.png';
const imgAsuransi = '/assets/images/layan/rsyasminlayan_asuransi_s.png';
const imgBpjs = '/assets/images/layan/rsyasminlayan_bpjs_s.png';
const imgRawat = '/assets/images/layan/rsyasminlayan_rawat_s.png';

const imgClubKids = '/assets/images/komunitas/rsyasminclub_kids.jpg';
const imgClubSquads = '/assets/images/komunitas/rsyasminclub_squads.jpg';
const imgClubWomen = '/assets/images/komunitas/rsyasminclub_women.jpg';
const imgClubDonor = '/assets/images/komunitas/rsyasminclub_donordarah.jpg';

const HEALTH_CENTERS_UNSORTED: HealthCenter[] = [
  {
    id: 'hc-1',
    title: 'Klinik Ibu & Anak',
    category: 'Unggulan',
    iconName: 'Baby',
    shortDesc: 'Melindungi Tumbuh Kembang Si Kecil, Menemani Setiap Fase Kehidupan Ibu',
    longDesc: `Kehadiran buah hati merupakan perjalanan berharga yang dimulai sejak masa kehamilan hingga tumbuh kembang anak. Untuk itu, **Klinik Ibu & Anak RS Yasmin** hadir sebagai pusat layanan kesehatan terpadu yang memberikan pendampingan menyeluruh bagi ibu dan anak dalam suasana yang nyaman, aman, dan menyenangkan.

Dirancang dengan konsep **Family Resort Healthcare**, Klinik Ibu & Anak RS Yasmin memadukan pelayanan medis berkualitas dengan lingkungan yang ramah keluarga. Area pelayanan didukung oleh **Kids Corner**, taman penyembuhan semi terbuka, serta ruang tunggu yang nyaman sehingga kunjungan ke rumah sakit menjadi pengalaman yang lebih menyenangkan bagi anak maupun orang tua.

Dengan dukungan dokter spesialis anak, dokter spesialis obstetri dan ginekologi, bidan profesional, serta tenaga kesehatan berpengalaman, kami siap mendampingi setiap tahap perjalanan keluarga Anda, mulai dari program kehamilan, pemeriksaan kehamilan, persalinan, perawatan pasca melahirkan, imunisasi, hingga pemantauan tumbuh kembang anak.

🤱 **Layanan Ibu**
🩺 **Pemeriksaan Kehamilan Komprehensif**
Pemantauan kesehatan ibu dan janin secara berkala untuk memastikan kehamilan berjalan sehat dan optimal.

📺 **USG 4D Live HD**
Nikmati pengalaman melihat perkembangan janin dengan teknologi **USG 4D Live HD** yang menghasilkan gambar lebih jelas, detail, dan realistis sehingga membantu dokter melakukan evaluasi kondisi janin secara lebih optimal.

🤰 **Persiapan Persalinan**
Konsultasi dan edukasi mengenai proses persalinan, pilihan metode persalinan, hingga perawatan pasca melahirkan.

🎓 **Kelas Ibu Hamil Gratis**
Program edukasi yang membantu calon ibu memahami kehamilan, persalinan, perawatan bayi baru lahir, serta persiapan menyusui.

🏃 **Senam Hamil Gratis**
Latihan khusus yang dirancang untuk membantu menjaga kebugaran ibu hamil, mengurangi keluhan selama kehamilan, dan mempersiapkan tubuh menghadapi proses persalinan.

🍼 **Pendampingan Laktasi**
Didukung oleh **Bidan Konselor Laktasi Bersertifikat** yang siap membantu ibu dalam proses menyusui, mengatasi kendala laktasi, serta mendukung keberhasilan pemberian ASI eksklusif.

👶 **Layanan Anak**
🩺 **Pemeriksaan Kesehatan Anak**
Layanan konsultasi dan pemeriksaan kesehatan anak mulai dari bayi, balita, hingga remaja.

🛡️ **Klinik Vaksinasi Anak**
Program imunisasi lengkap dalam suasana yang ceria dan ramah anak untuk membantu melindungi buah hati dari berbagai penyakit yang dapat dicegah dengan vaksinasi.

🌱 **Pemantauan Tumbuh Kembang**
Evaluasi rutin pertumbuhan fisik, perkembangan motorik, bahasa, sosial, dan kognitif anak untuk memastikan setiap tahap tumbuh kembang berjalan optimal.

🍎 **Konsultasi Nutrisi Anak**
Pendampingan bagi orang tua dalam memenuhi kebutuhan gizi anak sesuai usia dan tahap perkembangannya.

**🌿 Fasilitas Kenyamanan Tambahan**
🍼 Ruang Menyusui Nyaman
Area khusus yang dirancang untuk memberikan privasi dan kenyamanan bagi ibu menyusui selama berada di rumah sakit.

**🎠 Kids Indoor & Outdoor Oasis**
Area bermain yang aman dan menyenangkan untuk membantu anak tetap aktif, nyaman, dan tidak merasa takut selama berada di lingkungan rumah sakit.

**🌱 Taman Edukasi Interaktif**
Ruang terbuka yang mendukung aktivitas belajar dan bermain anak melalui berbagai elemen edukatif yang menarik.

**🧸 Kids Corner Ramah Anak**
Ruang tunggu khusus anak dengan suasana yang menyenangkan untuk mengurangi kecemasan saat menunggu pemeriksaan.

**⭐ Mengapa Memilih Klinik Ibu & Anak RS Yasmin?**
✅ Konsep pelayanan keluarga dengan nuansa resort yang nyaman
✅ Dokter spesialis anak dan kandungan berpengalaman
✅ USG 4D Live HD dengan kualitas gambar yang lebih detail
✅ Bidan dan konselor laktasi bersertifikat
✅ Kelas ibu hamil dan senam hamil gratis
✅ Klinik vaksinasi anak yang ramah dan menyenangkan
✅ Pemantauan tumbuh kembang yang komprehensif
✅ Lingkungan yang mendukung kenyamanan ibu dan anak

**💚 Komitmen Kami**
Di Klinik Ibu & Anak RS Yasmin, kami percaya bahwa kesehatan ibu dan anak merupakan fondasi utama terbentuknya keluarga yang sehat dan bahagia. Karena itu, kami menghadirkan pelayanan yang tidak hanya berfokus pada aspek medis, tetapi juga pada kenyamanan, edukasi, dan pengalaman terbaik bagi setiap keluarga.

"Menemani Setiap Langkah Ibu, Menjaga Setiap Tumbuh Kembang Buah Hati." 👩‍🍼👶🌿🏥`,
    image: imgKia,
    benefits: [
      'Pemeriksaan USG 4D Live HD',
      'Klinik Vaksinasi Anak bersuasana ceria',
      'Tim Pendamping Bidan Laktasi bersertifikat',
      'Kelas Ibu Hamil dan Senam Hamil gratis'
    ],
    features: ['Ruang Menyusui Nyaman', 'Kids Indoor and Outdoor Oasis', 'Taman Edukasi Interaktif'],
    targetAudience: 'Ibu Hamil, Bayi, Anak-anak, dan Orang Tua Baru'
  },
  {
    id: 'hc-2',
    title: 'Persalinan Metode ERACS',
    category: 'Unggulan',
    iconName: 'Sparkles',
    shortDesc: 'Persalinan Caesar dengan Pemulihan Lebih Cepat dan Nyaman',
    longDesc: `**ERACS (Enhanced Recovery After Caesarean Surgery)** adalah metode modern dalam tindakan operasi caesar yang dirancang untuk membantu ibu pulih lebih cepat setelah persalinan. Program ini menggabungkan berbagai pendekatan medis berbasis bukti untuk mengurangi nyeri, mual, dan ketidaknyamanan pasca operasi sehingga proses pemulihan menjadi lebih optimal.

**Bagaimana ERACS Dilakukan?** Program ERACS melibatkan persiapan sebelum operasi, teknik anestesi yang lebih nyaman, pengendalian nyeri yang efektif, serta mobilisasi dini setelah operasi. Seluruh proses dilakukan oleh tim multidisiplin yang terdiri dari dokter spesialis obstetri dan ginekologi, dokter anestesi, perawat, serta tenaga kesehatan lainnya untuk memastikan keselamatan dan kenyamanan ibu.

**Siapa yang Dapat Menjalani ERACS?** Metode ERACS dapat dipertimbangkan bagi ibu hamil yang akan menjalani persalinan melalui operasi caesar sesuai dengan kondisi medis dan hasil evaluasi dokter. Tim medis akan melakukan penilaian terlebih dahulu untuk menentukan apakah pasien memenuhi kriteria program ERACS.

**Fokus Utama ERACS** Bukan hanya keberhasilan operasi, tetapi juga memastikan ibu dapat:
👩 Pulih lebih cepat
🍼 Menyusui lebih dini
🤱 Membangun ikatan dengan bayi sejak awal
🏠 Kembali beraktivitas dengan nyaman dalam waktu yang lebih singkat

**RS Yasmin menghadirkan layanan Persalinan Caesar dengan metode ERACS sebagai bentuk komitmen dalam memberikan pengalaman persalinan yang lebih nyaman, aman, dan berorientasi pada pemulihan optimal bagi ibu dan bayi.**`,
    image: imgEracs,
    benefits: [
      'Nyeri pasca operasi lebih terkontrol',
      'Mengurangi mual dan muntah setelah operasi',
      'Membantu ibu lebih cepat bergerak dan berjalan',
      'Mempercepat proses pemulihan pasca persalinan',
      'Mempercepat pemberian ASI dan bonding ibu dengan bayi',
      'Mengurangi lama rawat inap di rumah sakit',
      'Meningkatkan kenyamanan dan kepuasan pasien'
    ],
    features: ['Kamar VIP Pasca Persalinan', 'Paket Rooming-In Premium', 'Makanan Bernutrisi Seimbang Sesuai Selera']
  },
  {
    id: 'hc-3',
    title: 'Klinik Fertilitas',
    category: 'Spesialisasi',
    iconName: 'HeartHandshake',
    shortDesc: 'Mendampingi Perjalanan Moms & Dad Menuju Kehadiran Buah Hati',
    longDesc: `Klinik Fertilitas Indonesia RS Yasmin hadir sebagai layanan kesehatan reproduksi yang membantu pasangan suami istri mewujudkan impian memiliki buah hati. Melalui kerja sama dengan Klinik Fertilitas Indonesia Morula, salah satu jaringan layanan fertilitas terkemuka di Indonesia, kami menghadirkan layanan yang komprehensif, modern, dan didukung oleh tim medis berpengalaman di bidang reproduksi.

Setiap pasangan memiliki perjalanan yang unik dalam merencanakan kehamilan. Oleh karena itu, Klinik Fertilitas Indonesia RS Yasmin menyediakan pendekatan yang personal melalui pemeriksaan menyeluruh, konsultasi medis, serta program penanganan yang disesuaikan dengan kondisi masing-masing pasangan.

### Layanan yang Tersedia

👩‍⚕️ **Konsultasi Kesuburan Pasangan**
• Evaluasi kondisi kesehatan reproduksi suami dan istri.
• Identifikasi faktor-faktor yang dapat memengaruhi kesuburan.
• Penyusunan rencana program kehamilan yang sesuai.

🩺 **Pemeriksaan Fertilitas**
• Pemeriksaan hormon reproduksi.
• Analisis sperma.
• USG reproduksi.
• Pemeriksaan penunjang lainnya sesuai indikasi medis.

💑 **Program Kehamilan**
• Konsultasi dan pendampingan program hamil alami.
• Pemantauan masa subur.
• Terapi fertilitas sesuai kebutuhan pasien.

🔬 **Layanan Fertilitas Lanjutan**
• Inseminasi Intrauterin (IUI).
• Program Bayi Tabung (IVF) melalui jaringan Morula.
• Teknologi reproduksi berbantu lainnya sesuai indikasi medis.

### Keunggulan Klinik Fertilitas Indonesia RS Yasmin
✅ Didukung oleh jaringan dan standar layanan Morula Indonesia.
✅ Tim dokter yang berpengalaman di bidang fertilitas dan kesehatan reproduksi.
✅ Pemeriksaan dan penanganan yang komprehensif dalam satu layanan terpadu.
✅ Pendampingan yang personal and berorientasi pada kebutuhan pasangan.
✅ Teknologi dan metode penanganan fertilitas yang modern dan berbasis bukti ilmiah.

### Komitmen Kami
Kami memahami bahwa perjalanan menuju kehamilan dapat menjadi proses yang penuh harapan sekaligus tantangan bagi setiap pasangan. Oleh karena itu, Klinik Fertilitas Indonesia RS Yasmin berkomitmen untuk memberikan pelayanan yang profesional, nyaman, dan penuh empati agar Moms & Dad mendapatkan pendampingan terbaik dalam setiap langkah menuju hadirnya buah hati yang dinantikan.

"Bersama Klinik Fertilitas Indonesia RS Yasmin dan Morula, wujudkan harapan untuk melengkapi kebahagiaan keluarga Anda." 👶💚`,
    image: imgFertilitas,
    benefits: [
      'Konsultasi privat eksklusif bersama Spesialis Kebidanan & Fertilitas',
      'Analisis sperma terkomputerisasi termodern (CASA)',
      'Terapi hormon, pemicu ovulasi, dan program inseminasi buatan (IUI)',
      'Dukungan psikologis konselor kesuburan demi kesehatan mental pasangan'
    ]
  },
  {
    id: 'hc-4',
    title: 'Klinik Medical Check Up (MCU)',
    category: 'Wellness',
    iconName: 'Activity',
    shortDesc: 'Menyediakan layanan pemeriksaan kesehatan menyeluruh secara dini, akurat, dan komprehensif.',
    longDesc: `**Investasi Terbaik untuk Menjaga Kesehatan Anda**

Klinik Medical Check Up (MCU) RS Yasmin Banyuwangi menyediakan layanan pemeriksaan kesehatan menyeluruh yang bertujuan untuk mengetahui kondisi kesehatan seseorang secara dini, akurat, dan komprehensif. Pemeriksaan kesehatan berkala sangat penting untuk mendeteksi faktor risiko maupun penyakit sejak tahap awal, bahkan sebelum muncul gejala yang dirasakan.

Melalui serangkaian pemeriksaan medis, laboratorium, dan penunjang diagnostik, Medical Check Up membantu individu maupun perusahaan dalam memantau kondisi kesehatan, menjaga produktivitas, serta mengambil langkah pencegahan yang tepat untuk menjaga kualitas hidup.

### Mengapa Medical Check Up Penting?

Banyak penyakit seperti hipertensi, diabetes, penyakit jantung, gangguan ginjal, hingga gangguan fungsi hati berkembang tanpa gejala pada tahap awal. Dengan melakukan MCU secara berkala, berbagai kondisi tersebut dapat dideteksi lebih dini sehingga penanganan dapat dilakukan lebih cepat dan efektif.

### Manfaat Medical Check Up

✅ Mengetahui kondisi kesehatan secara menyeluruh
✅ Deteksi dini berbagai penyakit dan faktor risiko
✅ Memantau kesehatan secara berkala
✅ Mendukung persyaratan pendidikan, pekerjaan, dan profesi tertentu
✅ Membantu menjaga produktivitas dan kualitas hidup
✅ Menentukan langkah pencegahan dan pengobatan yang tepat

### Layanan Medical Check Up RS Yasmin

RS Yasmin Banyuwangi menyediakan berbagai jenis pemeriksaan kesehatan yang disesuaikan dengan kebutuhan individu, instansi, maupun profesi tertentu.

⚓ **MCU Kelautan**
Medical Check Up Kelautan merupakan pemeriksaan kesehatan khusus yang diperuntukkan bagi pelaut, awak kapal, nelayan, dan tenaga kerja sektor maritim. Unsur kelautan membutuhkan kondisi tubuh prima agar seseorang dinilai layak bekerja di lingkungan laut.

Meliputi:
• Pemeriksaan fisik menyeluruh
• Pemeriksaan laboratorium
• Pemeriksaan mata dan buta warna
• Pemeriksaan pendengaran
• Pemeriksaan jantung
• Pemeriksaan paru
• Pemeriksaan kesehatan lainnya sesuai ketentuan yang berlaku

🛡️ **MCU TNI & POLRI**
MCU TNI & POLRI merupakan layanan pemeriksaan kesehatan yang dirancang untuk memenuhi persyaratan kesehatan calon anggota maupun personel aktif TNI dan POLRI sesuai kebutuhan institusi.

Pemeriksaan dilakukan secara komprehensif untuk menilai kesiapan fisik dan kesehatan seseorang dalam menjalankan tugas yang membutuhkan kondisi tubuh prima.

Meliputi:
• Pemeriksaan fisik
• Pemeriksaan laboratorium
• Pemeriksaan jantung
• Pemeriksaan radiologi
• Pemeriksaan kesehatan umum
• Pemeriksaan penunjang lainnya sesuai ketentuan instansi terkait

🕋 **Vaksin Haji & Umroh**
Selain layanan Medical Check Up, RS Yasmin juga menyediakan layanan vaksinasi bagi calon jamaah Haji dan Umroh sebagai bagian dari persiapan perjalanan ibadah ke Tanah Suci.

Vaksinasi bertujuan untuk meningkatkan perlindungan terhadap berbagai penyakit menular selama perjalanan dan pelaksanaan ibadah.

Layanan meliputi:
• Konsultasi kesehatan sebelum keberangkatan
• Vaksinasi sesuai ketentuan yang berlaku
• Edukasi kesehatan perjalanan
• Pendampingan persiapan kesehatan jamaah

### Didukung Fasilitas dan Tenaga Profesional

Seluruh pemeriksaan dilakukan oleh tenaga medis profesional dengan dukungan fasilitas laboratorium, radiologi, dan pemeriksaan penunjang yang lengkap untuk memastikan hasil yang akurat dan dapat dipercaya.

### Komitmen RS Yasmin

RS Yasmin Banyuwangi berkomitmen memberikan layanan Medical Check Up yang cepat, nyaman, dan terpercaya sebagai bagian dari upaya promotif dan preventif untuk menjaga kesehatan masyarakat.

**"Deteksi Lebih Awal, Hidup Lebih Sehat"**

Dengan Medical Check Up yang tepat dan teratur, berbagai risiko kesehatan dapat diketahui lebih dini sehingga Anda dapat menjalani aktivitas sehari-hari dengan lebih aman, sehat, dan produktif.`,
    image: imgMcu,
    benefits: [
      'Mengetahui kondisi kesehatan secara menyeluruh',
      'Deteksi dini berbagai penyakit dan faktor risiko',
      'Mendukung persyaratan pendidikan, pekerjaan, dan maritim/kelautan',
      'Layanan profesional cepat dengan fasilitas penunjang terintegrasi'
    ],
    features: ['MCU Kelautan', 'MCU TNI & POLRI', 'Vaksin Haji & Umroh']
  },
  {
    id: 'hc-13',
    title: 'Klinik Kesehatan Haji & Umroh',
    category: 'Wellness',
    iconName: 'Palmtree',
    shortDesc: 'Persiapan Ibadah Suci Anda dengan Kondisi Kesehatan yang Prima',
    longDesc: `Ibadah Haji dan Umroh merupakan perjalanan spiritual yang membutuhkan kesiapan fisik, mental, dan kesehatan yang optimal. Aktivitas ibadah yang padat, perubahan cuaca, perbedaan lingkungan, serta perjalanan yang panjang menuntut setiap jamaah memiliki kondisi kesehatan yang baik agar dapat menjalankan seluruh rangkaian ibadah dengan aman dan nyaman.

Untuk mendukung persiapan tersebut, RS Yasmin Banyuwangi menghadirkan layanan Medical Check Up (MCU) Haji & Umroh yang dirancang khusus untuk mengevaluasi kondisi kesehatan calon jamaah secara menyeluruh sebelum keberangkatan.

Didukung oleh laboratorium yang telah memperoleh Sertifikasi Internasional ISO 9001 dan Akreditasi KAN (Komite Akreditasi Nasional), pemeriksaan dilakukan dengan standar mutu yang terpercaya sehingga hasil pemeriksaan dapat menjadi dasar yang akurat dalam mempersiapkan perjalanan ibadah.

### Mengapa MCU Haji & Umroh Penting?

Pemeriksaan kesehatan sebelum keberangkatan bertujuan untuk:

🩺 Mengetahui kondisi kesehatan secara menyeluruh.
❤️ Mendeteksi dini faktor risiko penyakit yang dapat mengganggu pelaksanaan ibadah.
🫁 Memastikan kesiapan fisik menghadapi aktivitas ibadah yang cukup berat.
💊 Memberikan rekomendasi medis dan pengobatan apabila ditemukan kondisi tertentu.
✈️ Membantu jamaah berangkat dengan lebih tenang, aman, dan nyaman.

### Pemeriksaan yang Dilakukan

Paket MCU Haji & Umroh RS Yasmin meliputi pemeriksaan:

**Pemeriksaan Darah**
• Darah Lengkap
• Gula Darah Puasa
• Gula Darah 2 Jam PP
• Kolesterol Total
• Trigliserida
• HDL
• LDL
• Asam Urat (Uric Acid)

**Pemeriksaan Fungsi Ginjal**
• BUN/Urea
• Kreatinin

**Pemeriksaan Fungsi Hati**
• SGOT
• SGPT

**Pemeriksaan Penunjang**
• Urine Rutin
• Golongan Darah
• Elektrokardiografi (ECG/EKG)
• Foto Thorax (Rontgen Dada AP/PA)

**Imunisasi**
• Vaksin Influenza (sesuai paket yang dipilih)

### Pilihan Paket MCU

**Paket Madinah**

Pemeriksaan kesehatan lengkap untuk persiapan Haji dan Umroh.
✔ Pemeriksaan laboratorium
✔ Pemeriksaan jantung (ECG)
✔ Pemeriksaan radiologi thorax
✔ Tidak termasuk vaksin

**Paket Mekkah**

Paket pemeriksaan yang lebih komprehensif dengan tambahan vaksinasi.

✔ Seluruh pemeriksaan Paket Madinah
✔ Vaksin Influenza
✔ Persiapan kesehatan yang lebih optimal sebelum keberangkatan

### Keunggulan Layanan MCU Haji & Umroh RS Yasmin
✅ Pemeriksaan lengkap dalam satu layanan terpadu
✅ Laboratorium bersertifikat internasional
✅ Ditangani oleh tenaga medis profesional dan berpengalaman
✅ Hasil pemeriksaan cepat dan terpercaya
✅ Membantu mendeteksi faktor risiko kesehatan sebelum keberangkatan
✅ Mendukung persiapan ibadah yang lebih aman dan nyaman

### Komitmen Kami

RS Yasmin Banyuwangi berkomitmen membantu calon jamaah Haji dan Umroh mempersiapkan perjalanan ibadah dengan kondisi kesehatan terbaik. Melalui pemeriksaan yang menyeluruh dan standar pelayanan yang berkualitas, kami ingin memastikan setiap jamaah dapat menjalankan ibadah dengan lebih tenang, sehat, dan khusyuk.

🕋 **"Persiapkan kesehatan Anda hari ini, agar dapat beribadah dengan nyaman dan penuh ketenangan di Tanah Suci."**

**Medical Check Up Haji & Umroh RS Yasmin Banyuwangi**
Sehat Berangkat, Nyaman Beribadah, Selamat Kembali.`,
    image: imgHajiUmroh,
    benefits: [
      'Pemeriksaan lengkap dalam satu layanan terpadu',
      'Laboratorium bersertifikat internasional',
      'Ditangani oleh tenaga medis profesional dan berpengalaman',
      'Hasil pemeriksaan cepat dan terpercaya',
      'Membantu mendeteksi faktor risiko kesehatan sebelum keberangkatan',
      'Mendukung persiapan ibadah yang lebih aman dan nyaman'
    ],
    features: ['Paket Madinah', 'Paket Mekkah', 'Vaksinasi Influenza']
  },
  {
    id: 'hc-5',
    title: 'Klinik Berhenti Merokok',
    category: 'Wellness',
    iconName: 'Smoking',
    shortDesc: 'Solusi Komprehensif untuk Hidup Lebih Sehat Tanpa Rokok',
    longDesc: `Klinik Berhenti Merokok RS Yasmin adalah layanan kesehatan terpadu yang membantu perokok aktif menghentikan kebiasaan merokok secara aman, terarah, dan berkelanjutan. Program ini dirancang tidak hanya untuk menghentikan kebiasaan merokok, tetapi juga untuk mengatasi ketergantungan nikotin baik dari sisi fisik, psikologis, maupun perilaku.

Merokok bukan sekadar kebiasaan, melainkan bentuk ketergantungan yang melibatkan berbagai faktor biologis, psikologis, sosial, dan lingkungan. Oleh karena itu, proses berhenti merokok sering kali memerlukan pendampingan profesional agar peluang keberhasilannya lebih tinggi.

### Pendekatan Multidisiplin
Program ini ditangani oleh tim tenaga kesehatan dari berbagai disiplin ilmu yang bekerja secara terintegrasi, antara lain:

**👨‍⚕️ Dokter Umum Terlatih**
Melakukan skrining awal, penilaian tingkat ketergantungan nikotin, pemantauan perkembangan pasien, serta edukasi mengenai risiko kesehatan akibat merokok.

**🫁 Dokter Spesialis Paru**
Mengevaluasi kondisi kesehatan paru dan saluran pernapasan, mendeteksi dampak merokok terhadap fungsi paru, serta memberikan penanganan apabila telah terjadi gangguan pernapasan.

**🧠 Psikiater**
Membantu mengatasi aspek psikologis ketergantungan rokok, seperti kecemasan, stres, depresi, gangguan suasana hati, dan dorongan kuat untuk kembali merokok.

**🦴 Dokter Spesialis Rehabilitasi Medik**
Membantu meningkatkan kualitas hidup pasien melalui program latihan fisik, peningkatan kapasitas paru, serta pemulihan kondisi kesehatan secara menyeluruh.

**👥 Tim Pendukung Lainnya**
Melibatkan tenaga kesehatan lain sesuai kebutuhan pasien untuk memberikan pendampingan yang lebih optimal selama proses berhenti merokok.

**Durasi Program**
Program berhenti merokok dilaksanakan selama 3 bulan (12 minggu) dengan pemantauan dan evaluasi berkala.

Periode tiga bulan dipilih karena merupakan fase kritis dalam proses pemulihan dari ketergantungan nikotin and pembentukan kebiasaan hidup baru tanpa rokok.

**Tahapan Program**
**1. Assessment Awal**
Pada tahap ini dilakukan:
• Wawancara riwayat merokok
• Penilaian tingkat ketergantungan nikotin
• Pemeriksaan kesehatan umum
• Pemeriksaan fungsi paru (bila diperlukan)
• Evaluasi kondisi psikologis
• Penentuan target tanggal berhenti merokok

**2. Konseling Berhenti Merokok**
Konseling dilakukan secara individual untuk membantu pasien:
• Mengenali pemicu keinginan merokok
• Mengembangkan strategi menghadapi godaan merokok
• Mengubah pola pikir dan perilaku terkait rokok
• Meningkatkan motivasi berhenti merokok
• Membangun komitmen jangka panjang

**3. Terapi Farmakologis**
Apabila diperlukan, dokter dapat memberikan terapi obat untuk membantu mengurangi gejala putus nikotin (nicotine withdrawal syndrome), seperti:
• Gelisah
• Mudah marah
• Sulit konsentrasi
• Gangguan tidur
• Nafsu merokok yang kuat (craving)

Pemberian terapi dilakukan berdasarkan evaluasi medis dan kondisi masing-masing pasien.

**4. Hipnoterapi**
Hipnoterapi digunakan sebagai terapi pendukung untuk membantu:
• Mengurangi dorongan merokok
• Meningkatkan motivasi berhenti merokok
• Mengubah pola pikir bawah sadar terhadap rokok
• Memperkuat komitmen pasien terhadap gaya hidup sehat

Terapi ini dilakukan oleh tenaga profesional yang kompeten sesuai indikasi.

**5. Monitoring dan Evaluasi Berkala**
Selama program berlangsung, pasien akan mendapatkan:
• Pemantauan perkembangan secara berkala
• Evaluasi keberhasilan terapi
• Penyesuaian strategi apabila diperlukan
• Dukungan motivasi berkelanjutan
• Pencegahan kekambuhan (relapse prevention)

**Mengatasi Gejala Putus Nikotin**
Ketika seseorang berhenti merokok, tubuh akan mengalami proses adaptasi akibat tidak lagi menerima nikotin. Kondisi ini dikenal sebagai withdrawal syndrome atau gejala putus nikotin.

**Gejala yang sering muncul antara lain:**
• Keinginan kuat untuk merokok
• Mudah marah
• Gelisah dan cemas
• Sulit tidur
• Sulit berkonsentrasi
• Nafsu makan meningkat
• Perubahan suasana hati

Melalui kombinasi konseling, terapi medis, hipnoterapi, dan pendampingan profesional, gejala-gejala tersebut dapat dikelola dengan lebih baik sehingga peluang keberhasilan berhenti merokok menjadi lebih tinggi.

**Manfaat Mengikuti Program**
Setelah berhenti merokok, berbagai manfaat kesehatan dapat dirasakan, antara lain:
❤️ Menurunkan risiko penyakit jantung dan stroke
🫁 Memperbaiki fungsi paru dan pernapasan
🩺 Mengurangi risiko kanker akibat rokok
👨‍👩‍👧‍👦 Melindungi keluarga dari paparan asap rokok
💰 Menghemat pengeluaran untuk membeli rokok
😊 Meningkatkan kualitas hidup dan kebugaran tubuh
🌱 Mendukung gaya hidup sehat jangka panjang

**Komitmen RS Yasmin**
Klinik Berhenti Merokok RS Yasmin hadir untuk membantu masyarakat terbebas dari ketergantungan rokok melalui pendekatan ilmiah, profesional, dan berpusat pada pasien. Dengan dukungan tim multidisiplin and metode terapi yang komprehensif, kami berupaya meningkatkan keberhasilan berhenti merokok sekaligus menciptakan kualitas hidup yang lebih sehat bagi pasien dan keluarganya.

**"Berhenti Merokok Hari Ini, Investasi Kesehatan untuk Masa Depan." 🚭**`,
    image: imgStopRokok,
    benefits: [
      'Menurunkan risiko penyakit jantung dan stroke',
      'Memperbaiki fungsi paru dan pernapasan',
      'Mengurangi risiko kanker akibat rokok',
      'Melindungi keluarga dari paparan asap rokok',
      'Menghemat pengeluaran untuk membeli rokok',
      'Meningkatkan kualitas hidup dan kebugaran tubuh',
      'Mendukung gaya hidup sehat jangka panjang'
    ]
  },
  {
    id: 'hc-6',
    title: 'Konsultasi Psikologis Remaja',
    category: 'Wellness',
    iconName: 'Smile',
    shortDesc: 'Tempat Aman untuk Bercerita, Berkonsultasi, dan Menemukan Solusi',
    longDesc: `Masa remaja merupakan periode penting dalam kehidupan yang penuh dengan perubahan fisik, emosional, sosial, dan akademik. Tidak jarang remaja menghadapi berbagai tantangan yang dapat menimbulkan perasaan bingung, cemas, minder, stres, hingga kehilangan kepercayaan diri.

Melalui layanan Konsultasi Psikologis Remaja, RS Yasmin hadir untuk membantu para remaja memahami dan mengelola berbagai permasalahan yang sedang dihadapi melalui pendampingan profesional bersama psikolog.

### Mengapa Perlu Berkonsultasi?

Banyak remaja menganggap perasaan galau, sedih, atau stres adalah hal yang harus dipendam sendiri. Padahal, berbicara dengan tenaga profesional dapat membantu menemukan solusi yang lebih sehat dan tepat.

Layanan ini dapat membantu remaja yang mengalami:
😔 Sering merasa galau atau sedih berkepanjangan
😟 Kurang percaya diri dan merasa minder
😰 Kecemasan berlebihan
📚 Tekanan belajar dan masalah akademik
👥 Kesulitan bergaul atau berkomunikasi dengan teman
🏠 Konflik dengan orang tua atau keluarga
💔 Masalah pertemanan maupun percintaan
📱 Dampak media sosial dan cyberbullying
😴 Gangguan tidur akibat stres atau overthinking
🎯 Kesulitan mengenali potensi dan tujuan diri

### Apa yang Akan Didapatkan?

Melalui sesi konsultasi, remaja dapat:
✅ Menceritakan masalah dengan nyaman dan tanpa dihakimi
✅ Mendapatkan pendampingan dari tenaga profesional
✅ Belajar mengelola emosi dan stres
✅ Meningkatkan rasa percaya diri
✅ Mengembangkan keterampilan komunikasi dan hubungan sosial
✅ Menemukan solusi yang sehat terhadap masalah yang dihadapi

### Privasi Terjamin

Seluruh konsultasi dilakukan dengan menjunjung tinggi kerahasiaan dan etika profesi psikologi.

🔒 Privasi peserta terjamin 100%
🔒 Informasi yang disampaikan tidak akan disebarluaskan tanpa persetujuan
🔒 Remaja dapat berkonsultasi dengan lebih nyaman dan terbuka

### Layanan Konsultasi Gratis

RS Yasmin memberikan kesempatan bagi remaja untuk mendapatkan layanan konsultasi psikologis secara gratis melalui WhatsApp.

📱 WhatsApp Konsultasi: 0877-5411-2020
Psikolog Pendamping: Dra. Nining Naimah, M.Psi.

### Pesan untuk Remaja

"Ketika merasa galau, bingung, atau memiliki masalah, jangan dipendam sendirian. Bercerita dan mencari bantuan bukan tanda kelemahan, melainkan langkah berani untuk menjaga kesehatan mental dan masa depan yang lebih baik."

Karena setiap remaja berhak didengar, dipahami, dan mendapatkan dukungan yang tepat untuk tumbuh menjadi pribadi yang sehat, percaya diri, dan bahagia. 🌱💚`,
    image: imgPsikologiRemaja,
    benefits: [
      'Menceritakan masalah dengan nyaman dan tanpa dihakimi',
      'Mendapatkan pendampingan gratis dari Dra. Nining Naimah, M.Psi.',
      'Privasi dan kerahasiaan sesi konsultasi terjamin 100%',
      'Belajar mengelola emosi, kecemasan, stres, as well as overthinking'
    ]
  },
  {
    id: 'hc-7',
    title: 'Yasmin Home Care',
    category: 'Layanan',
    iconName: 'Home',
    shortDesc: 'Perawatan Profesional di Kenyamanan Rumah Anda',
    longDesc: `RS Yasmin Home Care adalah layanan kesehatan yang menghadirkan tenaga medis profesional langsung ke rumah pasien. Layanan ini dirancang untuk memberikan kemudahan, kenyamanan, dan keamanan bagi pasien yang membutuhkan pemeriksaan, konsultasi, maupun tindakan medis tanpa harus datang ke rumah sakit.

Dengan dukungan dokter dan tenaga kesehatan berpengalaman, pasien tetap dapat memperoleh pelayanan kesehatan berkualitas di lingkungan rumah yang lebih nyaman dan mendukung proses pemulihan.

**👨‍⚕️ Layanan Dokter**

RS Yasmin Home Care menyediakan layanan kunjungan dokter ke rumah untuk berbagai kebutuhan kesehatan, antara lain:

**• Dokter Spesialis:**
- Konsultasi dan pemeriksaan oleh dokter spesialis sesuai kebutuhan pasien.
- Monitoring kondisi pasien pasca rawat inap.
- Evaluasi dan tindak lanjut pengobatan.
- Pendampingan pasien dengan penyakit kronis.

**• Dokter Umum:**
- Pemeriksaan kesehatan umum.
- Penanganan keluhan medis ringan hingga sedang.
- Kontrol kesehatan rutin.
- Edukasi kesehatan bagi pasien dan keluarga.

**🧪 Layanan Laboratorium**

Untuk memberikan kemudahan yang lebih optimal, RS Yasmin Home Care juga menyediakan layanan laboratorium di rumah.

**• Pengambilan Sampel Darah:**
- Pemeriksaan laboratorium tanpa harus datang ke rumah sakit.
- Petugas laboratorium datang langsung ke lokasi pasien.
- Hasil pemeriksaan diproses sesuai standar laboratorium rumah sakit.
- Cocok untuk lansia, pasien pasca operasi, ibu hamil, dan pasien dengan keterbatasan mobilitas.

**🎯 Keunggulan Layanan:**
- Pelayanan langsung di rumah pasien.
- Mengurangi risiko paparan penyakit di fasilitas kesehatan.
- Lebih nyaman bagi lansia dan pasien dengan keterbatasan mobilitas.
- Ditangani oleh tenaga kesehatan profesional RS Yasmin.
- Mendukung pemantauan kesehatan secara berkelanjutan.
- Mempermudah pasien dan keluarga dalam memperoleh layanan medis.

**📞 Informasi Layanan**
**RS Yasmin Home Care**
📱 0852-5935-3001

**🕒 Jam Operasional**
Senin – Sabtu
07.00 – 15.30 WIB

Motto Layanan
**"Membawa Pelayanan Kesehatan Berkualitas dari RS Yasmin Langsung ke Rumah Anda."**`,
    image: imgHomeCare,
    benefits: [
      'Pelayanan langsung di rumah pasien secara nyaman',
      'Mengurangi risiko paparan penyakit di fasilitas kesehatan',
      'Sangat mendukung pemulihan lansia & keterbatasan mobilitas',
      'Ditangani bersertifikat oleh tim medis ahli RS Yasmin',
      'Mendukung pemantauan kesehatan berkala berkelanjutan',
      'Mempermudah pasien & keluarga memperolah layanan medis'
    ]
  },
  {
    id: 'hc-8',
    title: 'Rehabilitasi Medik',
    category: 'Spesialisasi',
    iconName: 'Accessibility',
    shortDesc: 'Mengembalikan Kemandirian, Memulihkan Kualitas Hidup',
    longDesc: `**Rehabilitasi Medik RS Yasmin** merupakan layanan pemulihan terpadu yang membantu pasien mengembalikan fungsi gerak, kemampuan aktivitas sehari-hari, dan kualitas hidup setelah mengalami gangguan akibat penyakit, cedera, operasi, maupun kondisi neurologis tertentu.

Dengan menggabungkan teknologi rehabilitasi modern, terapi fisik berbasis bukti ilmiah, serta lingkungan pemulihan yang nyaman dan asri, kami menghadirkan proses rehabilitasi yang lebih efektif, menyenangkan, dan berpusat pada kebutuhan pasien.

Berbeda dengan ruang terapi konvensional yang tertutup, area rehabilitasi RS Yasmin dirancang dengan konsep **Healing Rehabilitation Environment**, memadukan fasilitas terapi modern dengan suasana taman hijau terbuka yang mendukung proses pemulihan fisik maupun psikologis pasien.

**🌿 Terapi di Lingkungan Healing Garden**
Berbagai penelitian menunjukkan bahwa paparan lingkungan hijau dan udara segar dapat membantu mengurangi stres, meningkatkan motivasi pasien, serta merangsang produksi hormon endorfin yang berperan dalam meningkatkan rasa nyaman selama proses rehabilitasi.

Oleh karena itu, RS Yasmin menghadirkan area terapi yang terintegrasi dengan **Healing Garden**, memungkinkan pasien menjalani latihan gerak dalam suasana yang lebih alami, rileks, dan menyenangkan.

**🏃‍♂️ Layanan Rehabilitasi yang Kami Tangani**

**🧠 Rehabilitasi Pasca Stroke**
Program rehabilitasi komprehensif untuk membantu pasien pasca stroke mendapatkan kembali kemampuan gerak, keseimbangan, koordinasi, serta aktivitas sehari-hari secara bertahap.

Program meliputi:
* Latihan berjalan
* Latihan keseimbangan
* Latihan koordinasi tubuh
* Latihan kekuatan otot
* Terapi aktivitas fungsional
* Edukasi keluarga dan pendamping

Pendekatan dilakukan secara humanis dan disesuaikan dengan kondisi masing-masing pasien.

**🦴 Rehabilitasi Cedera Tulang dan Sendi**
Membantu pemulihan pasien setelah:
* Patah tulang
* Operasi ortopedi
* Cedera olahraga
* Nyeri lutut
* Nyeri bahu
* Gangguan sendi dan otot

Tujuan terapi adalah mengembalikan mobilitas, kekuatan otot, dan fungsi tubuh secara optimal.

**💪 Rehabilitasi Gangguan Otot dan Saraf**
Untuk pasien yang mengalami:
* Saraf terjepit
* Bell's Palsy
* Cedera saraf perifer
* Nyeri punggung kronis
* Gangguan keseimbangan
* Kelumpuhan sebagian

Program terapi disusun secara individual sesuai kebutuhan pasien.

**👶 Terapi Okupasi dan Tumbuh Kembang Anak**
RS Yasmin juga menyediakan layanan terapi okupasi bagi anak dengan berbagai gangguan perkembangan, termasuk:
* Keterlambatan bicara (*speech delay*)
* Gangguan motorik halus dan kasar
* Kesulitan konsentrasi
* Gangguan sensorik
* Keterlambatan perkembangan

Terapi dilakukan melalui pendekatan yang menyenangkan dan sesuai usia anak untuk mendukung perkembangan kemampuan sehari-hari secara optimal.

**🌱 Teknologi dan Fasilitas Modern**
Terapi Ultrasound
Menggunakan gelombang suara frekuensi tinggi untuk membantu:
* Mengurangi nyeri
* Mengurangi peradangan
* Mempercepat penyembuhan jaringan
* Meningkatkan fleksibilitas otot dan sendi

Terapi Electrical Stimulation
Teknologi stimulasi listrik terapeutik yang digunakan untuk:
* Merangsang kontraksi otot
* Mengurangi nyeri
* Meningkatkan fungsi saraf
* Membantu pemulihan pasca stroke
* Mempercepat rehabilitasi otot yang melemah

**Area Latihan Gerak Terapeutik Terbuka**
Fasilitas latihan gerak yang terintegrasi dengan area hijau terbuka sehingga pasien dapat menjalani proses pemulihan dengan lebih nyaman dan termotivasi.

**🌟 Keunggulan Rehabilitasi Medik RS Yasmin**

✅ Dokter Spesialis Kedokteran Fisik dan Rehabilitasi yang berpengalaman
✅ Fisioterapis profesional dan terlatih
✅ Alat terapi ultrasound dan electrical stimulation modern
✅ Healing Garden untuk terapi gerak alami
✅ Program rehabilitasi pasca stroke yang komprehensif
✅ Terapi okupasi dan speech delay untuk anak
✅ Program terapi yang disesuaikan dengan kondisi masing-masing pasien
✅ Pendekatan humanis yang berfokus pada kualitas hidup pasien

**🎯 Tujuan Kami**
Rehabilitasi bukan hanya tentang menyembuhkan penyakit, tetapi membantu pasien kembali menjalani hidup secara mandiri, aktif, dan produktif.

Melalui kombinasi teknologi modern, tenaga profesional, dan lingkungan penyembuhan yang nyaman, RS Yasmin berkomitmen mendampingi setiap pasien dalam perjalanan menuju pemulihan yang optimal.

**🌿 "Setiap Gerakan yang Kembali Pulih Adalah Langkah Menuju Kualitas Hidup yang Lebih Baik." 💚🏥🏃‍♂️**

**Rehabilitasi Medik RS Yasmin Banyuwangi**
**Mengembalikan Fungsi, Meningkatkan Kemandirian, dan Menghadirkan Harapan Baru.**`,
    image: imgRehabilitas,
    benefits: [
      'Alat terapi ultrasound & elektrikal stimulasi termutakhir',
      'Latihan gerak terapeutik di taman terbuka hijau',
      'Terapi okupasi untuk anak terlambat bicara (speech delay)',
      'Program rehabilitasi pasca stroke intensif yang humanis'
    ]
  },
  {
    id: 'hc-9',
    title: 'Rawat Inap Bertema Resort',
    category: 'Fasilitas',
    iconName: 'BedDouble',
    shortDesc: 'Menghadirkan Kenyamanan Layaknya Beristirahat di Resort untuk Mendukung Kesembuhan Pasien',
    longDesc: `Rawat Inap Bertema Resort RS Yasmin dirancang untuk memberikan pengalaman perawatan yang nyaman, tenang, dan menyenangkan bagi pasien maupun keluarga. Dengan konsep lingkungan yang asri, pelayanan yang ramah, serta fasilitas yang lengkap, kami berupaya menciptakan suasana yang mendukung proses penyembuhan secara optimal.

Kami percaya bahwa kesembuhan tidak hanya ditentukan oleh tindakan medis, tetapi juga oleh kenyamanan, ketenangan pikiran, kualitas istirahat, dan dukungan lingkungan selama masa perawatan.

### Keunggulan Layanan Rawat Inap RS Yasmin

**🌿 Konsep Resort yang Nyaman dan Menenangkan**
Lingkungan rumah sakit dirancang dengan nuansa yang nyaman dan asri sehingga pasien dapat menjalani masa perawatan dengan lebih rileks dan minim stres.

**⚡ Garansi Kecepatan Pelayanan**
RS Yasmin berkomitmen memberikan pelayanan yang cepat, tepat, dan responsif untuk memenuhi kebutuhan pasien selama menjalani perawatan.

**🩺 Pelayanan Profesional 24 Jam**
Didukung oleh dokter, perawat, dan tenaga kesehatan yang siap memberikan pelayanan secara profesional selama 24 jam.

**💨 Oksigen Sentral**
Seluruh ruang perawatan telah dilengkapi sistem oksigen sentral untuk menunjang kebutuhan medis pasien secara cepat dan aman.

**🔔 Bel Panggil Perawat**
Setiap kamar dilengkapi bel panggil yang memudahkan pasien menghubungi petugas kapan pun diperlukan.

**✨ Program Seka dan Keramas Pasien**
Layanan pendamping untuk membantu menjaga kebersihan dan kenyamanan pasien selama menjalani perawatan.

**🚗 Voucher Parkir**
Sebagai bentuk kenyamanan bagi keluarga pasien, tersedia fasilitas voucher parkir sesuai ketentuan yang berlaku.

**🦠 Sterilisasi dan Kebersihan Ruangan**
Area perawatan didukung dengan sistem kebersihan dan penggunaan teknologi ultraviolet pada area tertentu untuk membantu menjaga kualitas lingkungan rumah sakit.

### Program "3 Jam Bermakna"
#### Istirahat Berkualitas untuk Mempercepat Penyembuhan

Sebagai bagian dari komitmen meningkatkan kualitas perawatan, RS Yasmin menerapkan program "3 Jam Bermakna".

**🕐 Pukul 13.00 – 16.00 WIB**

Pada waktu tersebut pasien tidak diperkenankan menerima kunjungan dari keluarga maupun kerabat.

Tujuan program ini adalah:
✅ Memberikan waktu istirahat yang cukup bagi pasien
✅ Mengurangi kelelahan akibat banyaknya pengunjung
✅ Mendukung proses pemulihan dan penyembuhan
✅ Memberikan kesempatan tenaga medis melakukan observasi dan tindakan dengan lebih optimal

### Pilihan Kelas Perawatan

RS Yasmin menyediakan berbagai pilihan kamar rawat inap yang dapat disesuaikan dengan kebutuhan dan kenyamanan pasien.

⭐ **VVIP A**
Kelas perawatan dengan fasilitas paling lengkap dan nyaman.
**Fasilitas:**
• 1 Tempat Tidur Pasien
• TV
• AC
• Kulkas
• Fan
• Overhead Table
• Fall Bed
• Lemari Pakaian
• Kursi dan Meja Tamu
• Kamar Mandi Dalam

Cocok untuk pasien yang menginginkan privasi dan kenyamanan maksimal selama masa perawatan.

⭐ **VVIP B**
**Fasilitas:**
• 1 Tempat Tidur Pasien
• TV
• AC
• Fan
• Fall Bed
• Lemari Pakaian
• Kursi dan Meja Tamu
• Kamar Mandi Dalam

Memberikan kenyamanan premium dengan suasana yang lebih eksklusif.

⭐ **VIP A Dewasa**
**Fasilitas:**
• 1 Tempat Tidur Pasien
• TV
• AC
• Fan
• Lemari Pakaian
• Kursi Tamu
• Kamar Mandi Dalam

Dirancang untuk pasien dewasa yang menginginkan kenyamanan dan privasi lebih selama perawatan.

⭐ **VIP A Anak**
**Fasilitas:**
• 1 Tempat Tidur Pasien
• TV
• AC
• Fan
• Lemari Pakaian
• Kursi Tamu
• Kamar Mandi Dalam

Memberikan kenyamanan bagi pasien anak beserta pendamping selama menjalani perawatan.

⭐ **VIP B**
**Fasilitas:**
• 1 Tempat Tidur Pasien
• TV
• AC
• Fan
• Lemari Pakaian
• Kursi Tamu
• Kamar Mandi Dalam

Pilihan ruang perawatan yang nyaman dengan fasilitas lengkap.

⭐ **Kelas I**
**Fasilitas:**
• 2 Tempat Tidur Pasien
• TV
• AC
• Fan
• Lemari Pakaian
• Kursi Penunggu
• Kamar Mandi Dalam

Memberikan keseimbangan antara kenyamanan dan efisiensi biaya perawatan.

⭐ **Kelas II**
**Fasilitas:**
• 3 Tempat Tidur Pasien
• TV
• Fan
• Lemari Pakaian
• Kursi Penunggu
• Kamar Mandi Dalam

Pilihan ruang perawatan bersama dengan fasilitas yang tetap nyaman.

⭐ **Kelas III**
**Fasilitas:**
• 4 Tempat Tidur Pasien
• Fan
• Lemari Pakaian
• Kursi Penunggu
• Kamar Mandi Dalam

Pilihan perawatan yang terjangkau dengan tetap mengutamakan kenyamanan dan pelayanan medis berkualitas.

🚑 **Kamar Intensive Care Unit (ICU)**
Ruang perawatan intensif yang diperuntukkan bagi pasien dengan kondisi kritis yang memerlukan pemantauan ketat selama 24 jam.

**Fasilitas:**
• 4 Tempat Tidur Pasien
• ECG Monitor
• ECG
• Syringe Pump
• Suction
• AC
• Meja Makan
• Lemari Pasien
• Kamar Mandi Dalam

Seluruh pasien ICU dipantau secara intensif oleh tim dokter dan perawat yang berpengalaman dalam perawatan kritis.

### Komitmen RS Yasmin

Dengan konsep Rawat Inap Bertema Resort, RS Yasmin menghadirkan perpaduan antara pelayanan medis profesional, fasilitas modern, dan lingkungan yang nyaman untuk mendukung proses penyembuhan pasien secara optimal.

**"Lebih dari Sekadar Perawatan, Kami Menghadirkan Kenyamanan untuk Mempercepat Kesembuhan." 🌿🏥💚**`,
    image: imgRawat,
    benefits: [
      'Konsep Resort yang Nyaman dan Menenangkan',
      'Garansi Kecepatan Pelayanan Terjamin',
      'Program Khusus "3 Jam Bermakna" untuk Pasien',
      'Pilihan Kamar Lengkap (VVIP, VIP, Kelas I-III, ICU)'
    ]
  },
  {
    id: 'hc-10',
    title: 'IGD & Ambulans 24 Jam',
    category: 'Darurat',
    iconName: 'ShieldAlert',
    shortDesc: 'Siaga 24 Jam untuk Menangani Kondisi Darurat dengan Cepat, Tepat, dan Profesional',
    longDesc: `Instalasi Gawat Darurat (IGD) RS Yasmin Banyuwangi merupakan layanan kegawatdaruratan yang beroperasi selama 24 jam penuh untuk memberikan penanganan medis segera kepada pasien dengan kondisi darurat maupun mengancam jiwa.

Didukung oleh dokter dan perawat yang telah mendapatkan pelatihan khusus serta memiliki sertifikasi kegawatdaruratan sesuai standar Kementerian Kesehatan Republik Indonesia, IGD RS Yasmin siap memberikan pelayanan cepat dan tepat dalam setiap kondisi darurat.

### Tim Medis Bersertifikasi dan Berpengalaman

Tenaga medis IGD RS Yasmin telah mengikuti berbagai pelatihan kegawatdaruratan yang diakui secara nasional maupun internasional, antara lain:

🚑 **PPGD (Penanggulangan Penderita Gawat Darurat)**
Pelatihan dasar penanganan pasien gawat darurat yang membekali tenaga kesehatan dengan kemampuan melakukan tindakan penyelamatan secara cepat dan tepat.

🩺 **ATLS (Advanced Trauma Life Support)**
Standar internasional dalam penanganan pasien trauma akibat kecelakaan lalu lintas, cedera berat, jatuh, benturan keras, dan berbagai kasus trauma lainnya.

❤️ **ACLS (Advanced Cardiac Life Support)**
Pelatihan lanjutan untuk penanganan kegawatdaruratan jantung dan gangguan sirkulasi, termasuk henti jantung, serangan jantung, gangguan irama jantung, dan kondisi kritis lainnya.

💓 **BCLS (Basic Cardiac Life Support)**
Pelatihan bantuan hidup dasar yang mencakup teknik resusitasi jantung paru (RJP/CPR), penggunaan AED, dan tindakan penyelamatan awal pada pasien yang mengalami henti napas atau henti jantung.

📚 **Pelatihan Kegawatdaruratan Lainnya**
Tim medis juga secara berkala mengikuti berbagai pelatihan dan pembaruan kompetensi untuk memastikan pelayanan yang diberikan selalu sesuai dengan perkembangan ilmu kedokteran dan standar keselamatan pasien.

### Layanan Kegawatdaruratan yang Ditangani
IGD RS Yasmin melayani berbagai kondisi darurat, antara lain:

🚨 Kecelakaan lalu lintas
🚨 Cedera dan trauma
🚨 Serangan jantung
🚨 Stroke
🚨 Sesak napas akut
🚨 Kejang
🚨 Keracunan
🚨 Perdarahan
🚨 Demam tinggi pada anak
🚨 Kegawatdaruratan kebidanan dan kandungan
🚨 Kegawatdaruratan bedah
🚨 Kondisi medis darurat lainnya

### Fasilitas IGD RS Yasmin

Untuk mendukung pelayanan yang cepat dan optimal, IGD RS Yasmin dilengkapi dengan berbagai fasilitas modern dan lengkap.

🚑 **Ambulans 24 Jam**
Layanan ambulans siaga selama 24 jam untuk evakuasi, penjemputan pasien, maupun rujukan antar fasilitas kesehatan.

🏥 **Ruang IGD yang Luas dan Nyaman**
Area pelayanan dirancang untuk memberikan kenyamanan bagi pasien dan keluarga, dilengkapi dengan ruang tunggu yang memadai.

🛏️ **9 Tempat Tidur Observasi dan Tindakan**
Tersedia sembilan tempat tidur untuk observasi, stabilisasi, dan penanganan pasien sebelum dirawat lebih lanjut atau dipulangkan.

⚕️ **Pelayanan Bedah dan Non-Bedah**
IGD mampu menangani berbagai kasus kegawatdaruratan baik medis maupun bedah dengan dukungan dokter dari berbagai disiplin ilmu.

### Fasilitas Penunjang Medik 24 Jam
Untuk mempercepat proses diagnosis dan penanganan pasien, IGD didukung oleh layanan penunjang yang beroperasi selama 24 jam.

🔬 **Laboratorium 24 Jam**
Pemeriksaan laboratorium darurat untuk membantu dokter menentukan diagnosis dan tindakan medis secara cepat.

🩻 **Radiologi 24 Jam**
Pemeriksaan penunjang seperti foto rontgen dan layanan radiodiagnostik lainnya untuk mendukung penanganan pasien.

💊 **Unit Farmasi 24 Jam**
Ketersediaan obat-obatan dan perbekalan medis yang dibutuhkan dalam kondisi darurat kapan saja.

### Komitmen Kami
Dalam kondisi darurat, setiap detik sangat berharga. Oleh karena itu, IGD RS Yasmin Banyuwangi berkomitmen memberikan pelayanan yang Cepat, Tepat, Aman, dan Profesional dengan dukungan tenaga medis kompeten, fasilitas lengkap, dan sistem pelayanan yang terintegrasi.

🚨 **"Siaga 24 Jam untuk Memberikan Pertolongan Terbaik Saat Anda Membutuhkannya."** 🚑🏥💚

**IGD RS Yasmin Banyuwangi**
Pelayanan Gawat Darurat Profesional dengan Respon Cepat dan Fasilitas Lengkap 24 Jam.`,
    image: imgIgdAmbulance,
    benefits: [
      'Siaga 24 Jam penuh dengan respon darurat yang taktis',
      'Tim Medis Bersertifikasi Unggul (ATLS, ACLS, PPGD)',
      '9 Tempat Tidur Observasi dan ruang tindakan siap pakai',
      'Ambulans 24 Jam siaga jemput dan evakuasi',
      'Fasilitas penunjang Laboratorium & Radiologi siaga 24 Jam',
      'Apotek / Farmasi darurat siaga 24 Jam penuh'
    ]
  },
  {
    id: 'hc-11',
    title: 'Jaminan BPJS Kesehatan',
    category: 'Kemitraan',
    iconName: 'CheckCircle',
    shortDesc: 'Pelayanan Berkualitas, Mudah Diakses, dan Setara untuk Seluruh Peserta BPJS Kesehatan',
    longDesc: `Sebagai mitra resmi **BPJS Kesehatan**, RS Yasmin Banyuwangi berkomitmen memberikan pelayanan kesehatan yang berkualitas, profesional, dan berorientasi pada keselamatan pasien bagi seluruh peserta **Jaminan Kesehatan Nasional (JKN)**.

Kami percaya bahwa setiap pasien berhak mendapatkan pelayanan terbaik tanpa membedakan jenis pembiayaan. Oleh karena itu, seluruh peserta BPJS Kesehatan akan memperoleh pelayanan yang setara, terhormat, dan sesuai dengan standar mutu rumah sakit, mulai dari proses pendaftaran hingga pelayanan medis lanjutan.

Dengan dukungan sistem digital, tenaga administrasi yang berpengalaman, serta layanan pendampingan khusus BPJS, RS Yasmin berupaya menghadirkan pengalaman berobat yang lebih mudah, cepat, dan nyaman.

**🏥 Pelayanan BPJS yang Terintegrasi**
RS Yasmin melayani peserta BPJS Kesehatan untuk berbagai layanan kesehatan sesuai ketentuan yang berlaku, meliputi:

**👨Pelayanan Rawat Jalan**
Pelayanan konsultasi dokter spesialis dan subspesialis berdasarkan rujukan yang sesuai dengan sistem BPJS Kesehatan.

**🛏️ Pelayanan Rawat Inap**
Perawatan pasien sesuai indikasi medis dan hak kelas perawatan yang ditentukan dalam kepesertaan BPJS Kesehatan.

**🚑 Pelayanan Gawat Darurat**
Pasien dalam kondisi kegawatdaruratan dapat langsung mendapatkan penanganan medis tanpa harus menunggu proses administrasi terlebih dahulu sesuai ketentuan BPJS Kesehatan.

**🔬 Pemeriksaan Penunjang Medis**
Meliputi laboratorium, radiologi, farmasi, dan berbagai layanan penunjang lainnya yang dibutuhkan dalam proses diagnosis dan pengobatan.

**⚡ Loket Pendaftaran BPJS Khusus**
Untuk meningkatkan kenyamanan dan mempercepat proses administrasi, RS Yasmin menyediakan **loket pendaftaran BPJS yang terpisah** dari jalur pelayanan umum.

Keuntungan yang diperoleh:
✅ Proses registrasi lebih cepat
✅ Verifikasi data lebih mudah
✅ Mengurangi antrean pelayanan
✅ Pendampingan administrasi yang lebih optimal

🌐 Sistem Rujukan Elektronik Terintegrasi
RS Yasmin telah mendukung sistem **Rujukan Elektronik BPJS Kesehatan** yang terhubung dengan berbagai fasilitas kesehatan tingkat pertama (FKTP) di Banyuwangi.

Layanan ini memudahkan proses:
* Rujukan dari puskesmas
* Rujukan dari klinik mitra
* Verifikasi data pasien
* Monitoring status rujukan
* Koordinasi pelayanan antar fasilitas kesehatan

Dengan sistem digital yang terintegrasi, proses administrasi menjadi lebih transparan, efisien, dan minim kendala.

💊 Ketersediaan Obat FORNAS yang Lengkap
RS Yasmin berkomitmen menyediakan obat-obatan yang termasuk dalam **Formularium Nasional (FORNAS)** sesuai ketentuan BPJS Kesehatan.

Keunggulan layanan farmasi BPJS di RS Yasmin:
✅ Ketersediaan obat sesuai standar nasional
✅ Pengelolaan stok yang terintegrasi
✅ Pelayanan farmasi profesional
✅ Edukasi penggunaan obat kepada pasien

Hal ini membantu memastikan pasien memperoleh terapi yang tepat dan berkesinambungan selama menjalani pengobatan.

**🤝 BPJS Center dan Pendampingan Administrasi**
Memahami bahwa proses administrasi dan klaim terkadang dapat menimbulkan pertanyaan bagi pasien maupun keluarga, RS Yasmin menyediakan **BPJS Center** yang siap memberikan bantuan dan informasi.

Tim pendamping kami dapat membantu:
* Informasi hak dan kewajiban peserta Jaminan BPJS Kesehatan
* Verifikasi kepesertaan
* Konsultasi administrasi rujukan
* Pendampingan kendala pelayanan
* Informasi prosedur rawat inap
* Penjelasan alur pelayanan BPJS

Dengan adanya pendampingan ini, pasien dapat lebih fokus pada proses penyembuhan tanpa harus khawatir terhadap proses administrasi.

**🌟 Mengapa Memilih BPJS di RS Yasmin?**
✅ Mitra resmi BPJS Kesehatan
✅ Pelayanan setara tanpa diskriminasi
✅ Loket BPJS khusus yang lebih cepat
✅ Sistem rujukan elektronik terintegrasi
✅ Ketersediaan obat FORNAS yang lengkap
✅ BPJS Center siap membantu
✅ Dokter spesialis dan fasilitas penunjang lengkap
✅ Pelayanan yang profesional, transparan, dan ramah pasien


**💚 Komitmen RS Yasmin**
RS Yasmin Banyuwangi berkomitmen menjadi rumah sakit yang mudah diakses oleh seluruh lapisan masyarakat. Melalui kerja sama dengan BPJS Kesehatan, kami terus menghadirkan pelayanan yang berkualitas, transparan, dan berorientasi pada kebutuhan pasien.

**"Kesehatan Berkualitas untuk Semua, dengan Pelayanan yang Mudah, Cepat, dan Bermartabat."**

**BPJS Kesehatan di RS Yasmin Banyuwangi**
**Melayani dengan Hati, Mendampingi dengan Kepedulian, dan Mengutamakan Kesembuhan Pasien.** 🏥💚🤝`,
    image: imgBpjs,
    benefits: [
      'Loket pendaftaran BPJS terpisah guna mempercepat kepengurusan',
      'Layanan rujukan elektronik lintas puskesmas dan klinik mitra se-Banyuwangi',
      'Ketersediaan obat formularium nasional (FORNAS) yang lengkap',
      'Staf pendamping BPJS Center siap membantu kendala klaim di lapangan'
    ]
  },
  {
    id: 'hc-12',
    title: 'Asuransi & Kemitraan Swasta',
    category: 'Kemitraan',
    iconName: 'CreditCard',
    shortDesc: 'Kemudahan Berobat dengan Jaringan Asuransi Terpercaya, Tanpa Proses yang Rumit',
    longDesc: `RS Yasmin Banyuwangi menjalin kerja sama dengan berbagai perusahaan asuransi kesehatan swasta, administrator klaim (Third Party Administrator/TPA), perusahaan korporasi, lembaga pemerintah, BUMN, dan institusi penjamin kesehatan untuk memberikan kemudahan akses pelayanan kesehatan bagi peserta asuransi dan penjamin.

Melalui sistem pelayanan yang terintegrasi, pasien dapat menikmati proses administrasi yang lebih cepat, praktis, dan nyaman sehingga dapat lebih fokus pada proses pengobatan dan pemulihan tanpa terbebani urusan administratif yang kompleks.

Kami memahami bahwa ketika seseorang membutuhkan layanan kesehatan, hal terpenting adalah mendapatkan penanganan medis yang cepat dan berkualitas. Oleh karena itu, RS Yasmin terus mengembangkan kerja sama dengan berbagai mitra asuransi, penjamin, dan korporasi untuk menghadirkan pengalaman berobat yang lebih mudah dan efisien.

**💳 Layanan Cashless yang Praktis dan Nyaman**
Bagi peserta asuransi yang telah bekerja sama dengan RS Yasmin, tersedia fasilitas *Cashless (Non Tunai)* yang memungkinkan pasien memperoleh pelayanan tanpa harus melakukan pembayaran tunai di awal sesuai dengan manfaat dan ketentuan polis yang dimiliki.

Sistem ini memberikan berbagai kemudahan, antara lain:
✅ Proses registrasi lebih cepat
✅ Tidak perlu menyiapkan dana deposit dalam jumlah besar*
✅ Verifikasi kepesertaan dilakukan secara langsung
✅ Administrasi lebih sederhana
✅ Fokus pada proses penyembuhan tanpa khawatir urusan pembayaran

Sesuai ketentuan masing-masing perusahaan asuransi dan jenis layanan yang digunakan.

**🤝 Jaringan Mitra Asuransi yang Luas**
RS Yasmin bekerja sama dengan berbagai perusahaan asuransi kesehatan, administrator klaim, institusi pemerintah, BUMN, dan perusahaan terpercaya, antara lain:

**Penjamin Pemerintah & BUMN**
* BPJS Kesehatan
* BPJS Ketenagakerjaan
* Jasa Raharja
* PT Angkasa Pura II (AP II)

**Asuransi Kesehatan & Jiwa**
* Prudential
* Allianz
* FWD Insurance
* Sun Life
* Manulife
* CAR Life Insurance
* Bumi Putera
* Astra Aviva (AA)

**Administrator Klaim (TPA)**
* AdMedika
* Owlexa Healthcare
* Nayaka Era Husada

**Mitra Korporasi & Perbankan**
* Bank Rakyat Indonesia (BRI)
* Bank Jatim

dan berbagai mitra perusahaan, instansi pemerintah, BUMN, serta korporasi lainnya yang terus berkembang dari waktu ke waktu.
Kerja sama ini terus berkembang untuk memberikan akses layanan kesehatan yang lebih luas bagi masyarakat, dunia usaha, dan institusi pemerintah.

**⚡ Verifikasi dan Persetujuan Medis yang Cepat**

Tim administrasi dan penjaminan RS Yasmin berupaya mempercepat proses verifikasi manfaat asuransi sehingga pasien tidak perlu menunggu terlalu lama untuk mendapatkan pelayanan.

Keuntungan yang diperoleh:
✅ Koordinasi langsung dengan perusahaan asuransi dan penjamin
✅ Proses verifikasi manfaat yang efisien
✅ Monitoring status persetujuan secara cepat
✅ Dukungan administrasi yang responsif

Dengan sistem yang terintegrasi, proses persetujuan medis dapat dilakukan lebih cepat sehingga pelayanan kesehatan dapat segera diberikan.

**📄 Rekam Medis Digital Terintegrasi**
RS Yasmin telah menerapkan sistem rekam medis digital yang membantu mempercepat proses pelayanan dan administrasi asuransi.

Manfaatnya meliputi:
* Akses data medis yang lebih cepat
* Pengiriman dokumen pendukung yang lebih efisien
* Mengurangi proses administrasi manual
* Mendukung percepatan proses klaim

Dalam kondisi tertentu, dokumen pendukung medis dapat diproses dan disiapkan dalam waktu yang lebih singkat dibandingkan sistem konvensional.

**👨💼 Pendampingan Klaim oleh Tim Khusus**
Bagi pasien yang memerlukan bantuan dalam proses administrasi asuransi, RS Yasmin menyediakan staf pendamping yang siap membantu.

Layanan pendampingan meliputi:
* Verifikasi kepesertaan asuransi
* Informasi manfaat polis
* Bantuan administrasi klaim
* Pendampingan pengurusan surat medis
* Koordinasi dengan pihak penjamin
* Informasi persyaratan dokumen klaim

Tujuannya adalah membantu pasien dan keluarga memahami proses administrasi dengan lebih mudah dan nyaman.

**🌟 Keunggulan Layanan Asuransi di RS Yasmin**
✅ Didukung sistem Cashless dan Swipe Card
✅ Mitra berbagai perusahaan asuransi, penjamin, dan korporasi terpercaya
✅ Verifikasi administrasi yang cepat dan efisien
✅ Rekam medis digital terintegrasi
✅ Pendampingan klaim oleh staf khusus
✅ Ruang tunggu administrasi yang nyaman
✅ Pelayanan medis profesional dan berkualitas
✅ Fokus pada kenyamanan dan kemudahan pasien


**💚 Komitmen RS Yasmin**
RS Yasmin Banyuwangi berkomitmen menghadirkan pelayanan kesehatan yang mudah diakses oleh seluruh lapisan masyarakat, termasuk peserta asuransi kesehatan swasta, korporasi, BUMN, dan lembaga pemerintah.
Melalui jaringan kemitraan yang luas, sistem pelayanan yang terintegrasi, serta dukungan tim profesional, kami berupaya memastikan setiap pasien memperoleh pengalaman berobat yang nyaman, cepat, dan bebas dari kerumitan administrasi yang tidak perlu.

**"Lebih Mudah Berobat, Lebih Tenang Menjalani Perawatan."**

*Asuransi & Kemitraan Swasta RS Yasmin Banyuwangi*
*Mitra Kesehatan Terpercaya dengan Pelayanan Cepat, Transparan, dan Berorientasi pada Kenyamanan Pasien.* 🏥💚🤝💳`,
    image: imgAsuransi,
    benefits: [
      'Dukungan sistem asuransi Cashless / Swipe Card tanpa deposit berat',
      'Bekerjasama dengan AdMedika, Prudential, Allianz, AIA, Sinarmas, dll',
      'Layanan rekam medis digital cepat terintegrasi kurang dari 30 menit',
      'Pendampingan klaim asuransi penanggung jiwa oleh staf berdedikasi'
    ]
  },
  {
    id: 'hc-14',
    title: 'Sunday Clinic',
    category: 'Layanan',
    iconName: 'Calendar',
    shortDesc: 'Layanan klinik di hari Minggu untuk kenyamanan pemeriksaan & konsultasi keluarga.',
    longDesc: `**Sunday Clinic RS Yasmin** hadir sebagai solusi bagi Anda yang memiliki kesibukan padat di hari kerja (Senin - Sabtu) namun tetap mengutamakan kesehatan diri dan keluarga. Kami memahami bahwa waktu libur di hari Minggu adalah waktu berharga, dan kini Anda dapat merencanakan kunjungan ke dokter tanpa harus mengorbankan waktu kerja atau sekolah.

Layanan ini dirancang khusus untuk memberikan kenyamanan ekstra dengan atmosfer rumah sakit yang lebih tenang, pelayanan yang efisien, serta didampingi oleh tim dokter spesialis dan umum pilihan yang siap melayani dengan ramah dan profesional.

### Layanan yang Tersedia

🩺 **Konsultasi Dokter Umum & Spesialis**
• Jadwal dokter spesialis pilihan (Anak, Kandungan, Penyakit Dalam, dll.) yang siaga di hari Minggu.
• Hubungi CS kami untuk konfirmasi jadwal spesialis mingguan.

🏠 **Pelayanan Ramah Keluarga**
• Atmosfer klinik yang lebih tenang dan bebas antrean panjang.
• Fasilitas kids corner dan area taman penyembuhan semi terbuka yang nyaman untuk anak-anak.

🧪 **Layanan Penunjang Medis Aktif**
• Laboratorium & Radiologi tetap operasional untuk pemeriksaan darah, rontgen, dan skrining lainnya.
• Farmasi/Apotek siaga 24 jam untuk penebusan resep langsung.

### Keunggulan Sunday Clinic RS Yasmin

✅ **Fleksibel & Nyaman:** Mengunjungi dokter tanpa perlu izin kerja atau sekolah.
✅ **Pelayanan Cepat:** Waktu antrean relatif lebih pendek pada hari Minggu.
✅ **Atmosfer Lebih Santai:** Sangat ramah keluarga dan mengurangi tingkat stres pasien (terutama anak-anak).
✅ **Kesiapan Penunjang Lengkap:** Laboratorium, Radiologi, dan Farmasi tetap aktif mendampingi Anda.

### Komitmen Kami

Kesehatan Anda tidak mengenal hari libur. RS Yasmin Banyuwangi berkomitmen untuk selalu ada bagi Anda dan keluarga kapan pun dibutuhkan, termasuk di hari Minggu. Melalui Sunday Clinic, kami memberikan fleksibilitas pelayanan berkualitas tinggi agar Moms, Dad, dan buah hati tetap mendapatkan perawatan medis terbaik dengan nyaman dan penuh ketenangan.`,
    image: imgSundayClinic,
    benefits: [
      'Konsultasi dokter spesialis dan umum di hari Minggu',
      'Atmosfer klinik yang lebih tenang, santai, dan nyaman',
      'Pelayanan laboratorium, radiologi, dan penunjang medis tetap aktif',
      'Penanganan cepat, fleksibel, tanpa perlu mengganggu waktu sekolah atau kerja'
    ],
    features: ['Spesialis Anak & Kandungan', 'Laboratorium & Radiologi Aktif', 'Farmasi Siaga 24 Jam']
  }
];

export const COMMUNITY_CLUBS: CommunityClub[] = [
  {
    id: 'cc-2',
    name: 'Yasmin Kids Club',
    description: 'Ekosistem edukatif yang menyenangkan berisi kelas melukis, screening tumbuh kembang ceria, serta seminar pola didik santun (gentle parenting) bagi orang tua.',
    iconName: 'Clapperboard',
    image: imgClubKids,
    memberCount: 310,
    benefits: [
      'Diskon spesial 10% untuk screening gizi dan kecerdasan anak',
      'Undangan rutin lokakarya melukis bebas pasir dan berkebun herbal',
      'Grup edukasi intensif WhatsApp dipandu dokter spesialis anak langsung',
      'Free souvenir lucu disetiap imunisasi berjadwal'
    ],
    upcomingEvents: [
      {
        title: 'Lomba Gambar Mewarnai Taman Herbal Yasmin',
        date: '2026-07-19',
        time: '09:00 - 11:30',
        location: 'Kids Playground Area, RS Yasmin'
      },
      {
        title: 'Kelas Dokter Cilik Bersama Dokter Anak',
        date: '2026-08-02',
        time: '15:00 - 17:00',
        location: 'Healing Garden & Greenhouse Yasmin'
      }
    ]
  },
  {
    id: 'cc-3',
    name: 'Yasmin Squad (Remaja)',
    description: 'Komunitas pemuda-pemudi produktif Banyuwangi yang berfokus pada edukasi kesehatan mental remaja, anti-bullying, kebugaran fisik, dan penemuan bakat diri.',
    iconName: 'Sparkles',
    image: imgClubSquads,
    memberCount: 185,
    benefits: [
      'Akses gratis diskusi interaktif kesehatan mental remaja sebulan sekali',
      'Voucher konseling kepribadian dan minat bakat remaja potongan 15%',
      'Keanggotaan aktif dalam kepanitiaan kampanye sosial "Sehat Tanpa Stres"',
      'Materi e-book gratis seputar mengatasi gangguan tidur, kecemasan, dan insecure'
    ],
    upcomingEvents: [
      {
        title: 'Sunset Talk: Melepaskan Beban Insecurities',
        date: '2026-07-25',
        time: '16:00 - 18:00',
        location: 'Taman Healing Rooftop Yasmin'
      },
      {
        title: 'Youth Run & Fun Morning Walk',
        date: '2026-08-09',
        time: '06:00 - 08:30',
        location: 'Area Taman Kota Blambangan (Titik Kumpul Yasmin)'
      }
    ]
  },
  {
    id: 'cc-4',
    name: "Yasmin Woman's Club",
    description: 'Wadah berkumpulnya para wanita hebat untuk saling berbagi wawasan tentang nutrisi keluarga, kesehatan reproduksi wanita, yoga prenatal, serta wirausaha sehat.',
    iconName: 'Venus',
    image: imgClubWomen,
    memberCount: 520,
    benefits: [
      'Sesi Yoga Prenatal / Senam Kegel mingguan bersubsidi',
      'Edukasi deteksi dini kanker payudara & serviks (SADARI & Pap Smear)',
      'Pertemuan offline bulanan di Family Lounge dengan memasak gizi seimbang',
      'Kalari sehat komunitas dan voucher belanja gizi sehat mitra pangan'
    ],
    upcomingEvents: [
      {
        title: 'Prenatal Mindfulness Yoga & Teh Sore Ramah Ibu Hamil',
        date: '2026-07-05',
        time: '08:00 - 10:00',
        location: 'Gazebo Utama, Healing Garden Yasmin'
      },
      {
        title: 'Workshop: Memasak Menu Mpasi Tinggi Kalori Minim Alergi',
        date: '2026-08-01',
        time: '10:00 - 12:30',
        location: 'Family Lounge RS Yasmin'
      }
    ]
  },
  {
    id: 'cc-1',
    name: 'Club Donor Darah Yasmin',
    description: 'Menyelamatkan sesama laskar kemanuasiaan dengan aksi nyata mendonasikan stok darah secara berkala bekerjasama dengan PMI Banyuwangi.',
    iconName: 'Droplet',
    image: imgClubDonor,
    memberCount: 420,
    benefits: [
      'Pemeriksaan Hemoglobin (HB) dan tekanan darah gratis setiap 2 bulan',
      'Merchandise dan kartu keanggotaan eksklusif Donor Yasmin',
      'Notifikasi SMS/WhatsApp pengingat donor yang dipersonalisasi',
      'Prioritas bantuan darah bagi keluarga dekat apabila membutuhkan emergency supply'
    ],
    upcomingEvents: [
      {
        title: 'Festival Donor Darah Merayakan Hidup',
        date: '2026-07-12',
        time: '07:30 - 12:00',
        location: 'Healing Garden RS Yasmin'
      },
      {
        title: 'Donor Darah Rutin Bulan Kemerdekaan',
        date: '2026-08-16',
        time: '08:00 - 13:00',
        location: 'Lantai 1 Serbaguna RS Yasmin'
      }
    ]
  }
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-1',
    title: 'Keajaiban "Healing Garden" Rumah Sakit dalam Mempercepat Pemulihan Tubuh',
    category: 'Green Healing',
    content: 'Apakah udara segar dan rona hijau tanaman benar-benar berimbas pada kecepatan penyembuhan penyakit? Penelitian medis modern membuktikan bahwa paparan alam mengurangi kadar hormon kortisol (penyebab stres) sebesar 22%, menstabilkan ritme denyut jantung, serta memicu pelepasan sel pembunuh alami tubuh (natural killer cells) yang bertugas melawan patogen penyakit. Di RS Yasmin Banyuwangi, kami secara sadar mengintegrasikan area rimbun tanaman herbal dan gemericik air tepat di tengah-tengah ruang perawatan agar pasien dapat menyaksikan denyut kehidupan alam sebagai inspirasi mental untuk segera bangkit dan sembuh.',
    readingTime: '4 menit baca',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    date: '15 Juni 2026',
    author: 'Tim Wellness Yasmin'
  },
  {
    id: 'art-2',
    title: 'Melahirkan Nyaman Tanpa Trauma: Mengenal Lebih Jauh Manfaat Metode ERACS',
    category: 'Wanita',
    content: 'Ketakutan akan nyeri pasca-operasi caesar seringkali membayangi kebahagiaan menyambut kelahiran bayi. Metode ERACS (Enhanced Recovery After Cesarean Surgery) datang untuk merombak paradigma tersebut. Protokol ini menggunakan pendekatan kolaboratif mutakhir mulai dari puasa cairan karbohidrat tinggi sebelum tindakan, penyuntikan obat bius lokal jarum mikro, hingga perangsangan dini saraf gerak segera setelah jahitan selesai. Hasilnya? Ibu tidak perlu berbaring terbelenggu selama 24 jam penuh melainkan dapat segera tegak duduk, berjalan mantap ke kamar mandi, dan langsung memeluk serta memberikan ASI eksklusif bagi sang permata hati tanpa rasa mual.',
    readingTime: '5 menit baca',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    date: '10 Juni 2026',
    author: 'dr. Rania Suminar, Sp.OG'
  },
  {
    id: 'art-3',
    title: 'Panduan Mengatasi "Insecure" Pada Remaja Masa Kini: Sudut Pandang Psikologi',
    category: 'Mental Health',
    content: 'Paparan badai media sosial yang tiada henti membandingkan kecantikan fisik, pencapaian akademis, maupun kemewahan finansial orang lain seringkali membuat remaja mengalami krisis identitas yang mendalam (insecurity). Sebagai orangtua, menyuruh mereka "berhenti bermain ponsel" terkadang bukanlah solusi taktis. Kuncinya berada pada melatih kemampuan berpikir kritis, membangun welas asih diri (self-compassion), dan menciptakan kancah offline yang penuh kasih sayang serta bebas tuntutan perfek. Di RS Yasmin Banyuwangi, Klinik Psikologis Remaja hadir untuk menyusun ruang aman bagi putra-putri Anda mengungkap letih batin secara terselubung dan terarah.',
    readingTime: '6 menit baca',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
    date: '02 Juni 2026',
    author: 'dr. Aris Setyawan, M.Psi'
  },
  {
    id: 'art-4',
    title: 'Nutrisi Emas untuk Otak Balita: 5 Superfood Lokal yang Mudah Didapat di Banyuwangi',
    category: 'Anak',
    content: 'Tidak perlu merogoh kocek dalam untuk membelikan buah impor bernutrisi tinggi demi merangsang kecerdasan anak. Tanah subur Banyuwangi menyediakan beragam pangan lokal bernilai gizi tinggi bagi neuron balita. Beberapa di antaranya meliputi telur ayam kampung organik kaya kolin, labu kuning tinggi beta-karoten, kelor (moringa) yang dinobatkan sebagai wonder tree penuh asam amino esensial, ikan laut segar (seperti lele dan kembung lokal) yang kaya omega-3 setara salmon, hingga pisang kepok kaya kalium untuk stamina kognitif harian mereka.',
    readingTime: '3 menit baca',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800',
    date: '28 Mei 2026',
    author: 'dr. Satyanegara, Sp.A'
  },
  {
    id: 'art-5',
    title: 'Tetap Bugar Di Usia Senja: Tips Aktivitas Fisik Menyenangkan Bersama Cucu',
    category: 'Lansia',
    content: 'Menua bukanlah alasan untuk berhenti bergerak aktif. Justru olahraga berintensitas ringan secara berulang melindungi persendian dari pengapuran dini dan memelihara keseimbangan otak besar. Menghabiskan waktu dengan berjalan kaki mengitari tanaman bunga, menyiram kebun herbal bersama cucu tercinta, atau melakukan peregangan otot ringan sembari duduk merupakan metode menyenangkan yang menumbuhkan kebersamaan sekaligus merangsang hormon bahagia oksitosin yang merangsang imunitas alami lansia.',
    readingTime: '4 menit baca',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
    date: '20 Mei 2026',
    author: 'dr. Maya Kartika, Sp.PD'
  },
  {
    id: 'art-6',
    title: 'Pentingnya Berjalan Kaki di Taman Rumah Sakit terhadap Imunitas Tubuh',
    category: 'Green Healing',
    content: 'Aktivitas fisik ringan seperti jalan kaki perlahan di kebun medis (healing garden) selama 15 menit merangsang produksi imuno-globulin alami dan limfosit pembasmi kuman. Dengan menghirup uap sekresi pinus atau aroma alami tanah bugar di pagi hari, paru-paru bekerja dengan kapasitas elastisitas optimal, menunda stres organ dalam, dan mempercepat regenerasi sel usai terapi berkepanjangan.',
    readingTime: '5 menit baca',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
    date: '18 Juni 2026',
    author: 'Tim Wellness Yasmin'
  },
  {
    id: 'art-7',
    title: 'Latihan Otot Dasar Panggul bagi Ibu Pasca Melahirkan: Kunci Pemulihan Maksimal',
    category: 'Wanita',
    content: 'Setiap proses persalinan menuntut adaptasi elastisitas otot dasar panggul yang luar biasa. Melakukan senam Kegel dini secara bertahap berguna mengembalikan tonus otot, mencegah risiko inkontinensia urin, serta mempercepat peredaran darah ke area pelvis untuk pemulihan jaringan sikatrik luka episiotomi maupun luka operasi agar pulih sempurna tanpa trauma.',
    readingTime: '5 menit baca',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    date: '14 April 2026',
    author: 'dr. Rania Suminar, Sp.OG'
  },
  {
    id: 'art-8',
    title: 'Mengenali Gejala Burnout pada Kelompok Pekerja Kreatif dan Profesional Muda',
    category: 'Mental Health',
    content: 'Perasaan jenuh akut, sinisme berlebihan terhadap fungsi kerja, serta penurunan keyakinan performansi profesional merupakan pertanda nyata sindrom burnout. Mengabaikan alarm tubuh berisiko meningkatkan kecemasan klinis dan depresi meluas. Istirahat sejenak, batasi koneksi internet (digital detox) di akhir pekan, dan lakukan konsultasi kognitif terarah di RS Yasmin Banyuwangi.',
    readingTime: '6 menit baca',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    date: '08 Maret 2026',
    author: 'dr. Aris Setyawan, M.Psi'
  },
  {
    id: 'art-9',
    title: 'Imunisasi Dasar Lengkap Balita: Melindungi Pertumbuhan Emas Buah Hati Anda',
    category: 'Anak',
    content: 'Imunisasi bukanlah sekadar kewajiban administratif puskesmas, melainkan hak asasi kekebalan aktif balita. Melalui asupan antibodi terarah terhadap penyakit polio, campak, difteri, pertusis, tetanus, dan hepatitis B, tumbuh kembang otot dan kognitif anak terlindungi dari ancaman kecacatan permanen, menjamin masa depan mereka gembira bergairah bertenaga.',
    readingTime: '4 menit baca',
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
    date: '22 Februari 2026',
    author: 'dr. Satyanegara, Sp.A'
  },
  {
    id: 'art-10',
    title: 'Nutrisi Pendukung Kesehatan Tulang dan Sendi Aktif Lansia agar Mandiri Bergerak',
    category: 'Lansia',
    content: 'Masalah osteoporosis dwi-faktor dan nyeri sendi rematik kerap menghambat kebahagiaan masa tua. Mengonsumsi kalsium organik, asupan vitamin D3 berkualitas tinggi dari sinar matahari pagi Banyuwangi, serta konsumsi glukosamin murni dari kaldu tulang alami secara berkelanjutan dapat memelihara kekokohan matriks kolagen kartilago sendi agar Anda tetap lincah.',
    readingTime: '5 menit baca',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    date: '11 Januari 2025',
    author: 'dr. Maya Kartika, Sp.PD'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Ibu Rahayu Ningrum',
    role: 'Pasien Ibu ERACS (Genteng, Banyuwangi)',
    comment: 'Luar biasa sekali melahirkan dengan metode ERACS di RS Yasmin. Anggapan seram persalinan caesar langsung hilang. Sore melahirkan, malamnya saya sudah bisa duduk nyaman menggendong bayi sendiri di kamar rawat yang pemandangannya kebun sejuk seperti villa resor. Luar biasa!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544126592-807d173004a1?auto=format&fit=crop&q=80&w=100'
  },
  {
    name: 'Bapak Achmad Fauzi',
    role: 'Pengguna BPJS Kesehatan (Rogojampi)',
    comment: 'Saya mengantarkan ayah terapi rehabilitasi medik seminggu dua kali. Staf admisi BPJS-nya tanggap, tidak dibeda-bedakan, dan loket antrean mengalir cepat. Tempat rehabilitasinya terbuka, banyak tanaman hijau, bapak jadi tidak jenuh malah seperti sedang piknik sore.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100'
  },
  {
    name: 'Andini Fitria',
    role: 'Anggota Yasmin Squad (Singotrunan)',
    comment: 'Event Sunset Talk di Yasmin rooftop membantu saya banget berdamai dengan rasa cemas kuliah. Konselor psikologisnya asik, nggak kaku kayak guru konseling di sekolah. Berasa punya support system yang asik di Banyuwangi.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=100'
  }
];

export const COMPANY_PACKAGES = [
  {
    id: 'p-1',
    name: 'Onsite Medical Screening & Seminar',
    priceEstimate: 'Mulai dari Rp 75.000 / karyawan',
    features: [
      'Pengecekan Gula Darah, Kolesterol, & Asam Urat terarah',
      'Seminar interaktif Manajemen Stres Kerja atau Pencegahan Ergonomik',
      'Tim medis & perawat berpengalaman dikirim ke lokasi perusahaan',
      'Laporan evaluasi komprehensif profil kesehatan karyawan'
    ]
  },
  {
    id: 'p-2',
    name: 'Training K3 & First-Aid Sertifikasi RS Yasmin',
    priceEstimate: 'Hubungi untuk Quota Korporasi',
    features: [
      'Pelatihan Bantuan Hidup Dasar (BHD / CPR) bersertifikat resmi',
      'Simulasi keselamatan penanganan luka bakar, patah tulang, & tersedak',
      'Pemberian modul materi tanggap darurat bencana khusus industri Anda',
      'Paket kelayakan kotak P3K standar departemen keselamatan kerja'
    ]
  },
  {
    id: 'p-3',
    name: 'Executive Corporate Wellness Checkup (At-Hospital)',
    priceEstimate: 'Mulai dari Rp 450.000 / eksekutif',
    features: [
      'Pemeriksaan Rekam Jantung (EKG), Rontgen Paru, & Tes Darah lengkap',
      'Akses masuk Executive Lounge & sajian gizi sehat premium',
      'Konsultasi eksklusif hasil laborat bareng Dokter Spesialis Penyakit Dalam',
      'Prioritas pemesanan slot dan penjemputan mobil VIP (tambahan)'
    ]
  }
];

const ORDERED_IDS = [
  'hc-2', // Eracs
  'hc-1', // Klinik ibu dan Anak
  'hc-7', // home care
  'hc-5', // klinik berhenti merokok
  'hc-3', // klinik fertilitas
  'hc-13', // klinik kesehatan haji & umroh
  'hc-4', // klinik medical checkup
  'hc-6', // konsultasi remaja
  'hc-14', // sunday clinic
  'hc-8',
  'hc-9',
  'hc-10',
  'hc-11',
  'hc-12'
];

export const HEALTH_CENTERS: HealthCenter[] = [...HEALTH_CENTERS_UNSORTED].sort((a, b) => {
  const indexA = ORDERED_IDS.indexOf(a.id);
  const indexB = ORDERED_IDS.indexOf(b.id);
  return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
});
