import React, { useState } from 'react';
import { SafeImage } from '../utils/imageUrl';
const clubKidsImg = '/assets/images/komunitas/rsyasminclub_kids.jpg';
import { 
  Sparkles, Calendar, Heart, Shield, HelpCircle, Star, Info, 
  MapPin, CheckCircle, ArrowRight, UserPlus, Gift, Trophy, Activity,
  Smartphone, BookOpen, GraduationCap, Users, Clock, Smile, Printer
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface PackItem {
  no: number;
  facility: string;
  desc: string;
}

const PLATINUM_ITEMS: PackItem[] = [
  { no: 1, facility: 'Souvenir berupa tas Kapten Yaskid', desc: 'Tas eksklusif bergambar maskot Kapten Yaskid sebagai kenang-kenangan' },
  { no: 2, facility: 'Voucher bermain di playground Garden Family Resto (5 pcs)', desc: '5 tiket bermain untuk anak di taman bermain mitra RS Yasmin' },
  { no: 3, facility: 'Cek kesehatan anak lengkap', desc: 'Pengukuran tinggi badan, berat badan, lingkar kepala, dan pemeriksaan THT oleh tenaga medis profesional' },
  { no: 4, facility: 'Parenting kesehatan oleh tim medis', desc: 'Edukasi bagi orang tua tentang tumbuh kembang anak dan pola asuh sehat' },
  { no: 5, facility: 'Hospital Tour menyenangkan', desc: 'Anak-anak diajak berkeliling rumah sakit untuk mengenal lingkungan medis tanpa rasa takut' },
  { no: 6, facility: 'MOU antar Lembaga resmi', desc: 'Kerja sama resmi antara RS Yasmin dengan lembaga pendidikan/sekolah mitra' },
  { no: 7, facility: 'Gathering Kepala Sekolah', desc: 'Pertemuan khusus dengan kepala sekolah untuk koordinasi kesehatan sekolah' },
  { no: 8, facility: 'Berhak mengikuti program Gebyar Kapten Yaskid', desc: 'Kesempatan mengikuti event besar Yasmin Kids yang diadakan secara berkala' },
  { no: 9, facility: 'Support event sekolah member', desc: 'Dukungan dari tim kesehatan RS Yasmin untuk acara sekolah peserta' },
  { no: 10, facility: 'Menu sehat saat makan bersama', desc: 'Makanan bergizi berimbang dinikmati bersama (biaya makan exclude/terpisah)' }
];

const GOLD_ITEMS: PackItem[] = [
  { no: 1, facility: 'Voucher bermain di playground Garden Family Resto (5 pcs)', desc: '5 tiket bermain untuk anak di taman bermain mitra RS Yasmin' },
  { no: 2, facility: 'Cek kesehatan anak lengkap', desc: 'Pengukuran tinggi badan, berat badan, lingkar kepala, dan pemeriksaan THT oleh tenaga medis profesional' },
  { no: 3, facility: 'Parenting kesehatan oleh tim medis', desc: 'Edukasi bagi orang tua tentang tumbuh kembang anak dan pola asuh sehat' },
  { no: 4, facility: 'Hospital Tour menyenangkan', desc: 'Anak-anak diajak berkeliling rumah sakit untuk mengenal lingkungan medis tanpa rasa takut' },
  { no: 5, facility: 'MOU antar Lembaga resmi', desc: 'Kerja sama resmi antara RS Yasmin dengan lembaga pendidikan/sekolah mitra' },
  { no: 6, facility: 'Gathering Kepala Sekolah', desc: 'Pertemuan khusus dengan kepala sekolah untuk koordinasi kesehatan sekolah' },
  { no: 7, facility: 'Berhak mengikuti program Gebyar Kapten Yaskid', desc: 'Kesempatan mengikuti event besar Yasmin Kids yang diadakan secara berkala' },
  { no: 8, facility: 'Menu sehat saat makan bersama', desc: 'Makanan bergizi berimbang dinikmati bersama (biaya makan exclude/terpisah)' }
];

const FAQS_KIDS = [
  {
    q: "Apa perbedaan antara paket GOLD dan PLATINUM?",
    a: "Perbedaan utamanya adalah paket PLATINUM mendapatkan souvenir eksklusif Tas Kapten Yaskid dan kami memberikan support event kesehatan sekolah. Sementara itu, untuk paket lainnya semua benefit inti tetap sama."
  },
  {
    q: "Apakah biaya makan sudah termasuk dalam tarif paket?",
    a: "Tidak. Biaya menu makan sehat saat sesi makan bersama dinikmati secara terpisah (exclude/tambahan opsional). Orang tua atau pihak sekolah dapat memilih menu sehat spesial yang disediakan mitra garden resto kami."
  },
  {
    q: "Apakah program ini hanya menerima pendaftaran perorangan?",
    a: "Tidak. Pendaftaran sangat terbuka untuk individu maupun kelompok, seperti satu rombongan kelas, komunitas PAUD/TK, atau Sekolah Dasar yang berkoordinasi secara kolektif."
  },
  {
    q: "Bagaimana jika kami ingin mendaftarkan satu sekolahan sekaligus?",
    a: "Sangat bisa dan direkomendasikan! Kami menyediakan penandatanganan MOU resmi antar Lembaga beserta gathering kepala sekolah untuk kemudahan koordinasi program. Silakan hubungi tim humas Yasmin Kids kami."
  },
  {
    q: "Apakah ada batas minimal jumlah pendaftar?",
    a: "Tidak ada minimal peserta. Baik pendaftaran satu perintis individu maupun rombongan puluhan anak tetap kami fasilitasi dengan layanan bimbingan prima."
  },
  {
    q: "Sesudah pendaftaran selesai dilakukan, kapan jadwal kegiatan berlangsung?",
    a: "Tim khusus Yasmin Kids akan segera menghubungi Anda sesudah formulir diverifikasi untuk mencocokkan jadwal sekolah atau kalender waktu yang ideal bagi anak."
  },
  {
    q: "Apakah program ini berlaku untuk seluruh tingkatan usia anak?",
    a: "Program rekreasi edukatif Yasmin Kids Club dirancang optimal bagi rentang usia pelajar mulai usia 3 tahun sampai dengan maksimum 12 tahun."
  }
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  ID: {
    heroBadge: '🧒 YASMIN KIDS CLUB',
    heroTitle: 'Layanan Premium Edukasi & Kesehatan Untuk Generasi Cerdas!',
    heroDesc: 'Program eksklusif RS Yasmin Banyuwangi dirancang khusus bagi anak usia 3 s/d 12 tahun. Menggabungkan imunisasi emosional, keceriaan playground, dan rekreasi hospital tour anti-takut!',
    affordable: '💰 HARGA TERJANGKAU',
    easyReg: '📝 MUDAH DAFTAR',
    greatBenefit: '🌟 MANFAAT BESAR',
    regNow: 'Daftar Sekarang',
    viewPack: 'Lihat Paket Edukasi',
    aboutBadge: 'VISI TUMBUH KEMBANG',
    aboutTitle: 'Mengenal Gerakan #AnakSehatBanyuwangi',
    aboutDesc: 'Yasmin Kids adalah sebuah program dedikasi orisinil yang dirancang spesial dari asuhan dokter RS Yasmin Banyuwangi demi mendukung tonggak tumbuh kembang optimal fisik maupun kecerdasan emosional anak.',
    val1Title: 'Terjangkau untuk Semua',
    val1Desc: 'Hanya mulai dari Rp30.000 saja, putra-putri tercinta sudah mendapatkan pemeriksaan komprehensif, tas merchandise, dan voucher bermain gratis.',
    val1Badge: 'Mulai Rp30K Per Peserta',
    val2Title: 'Pendaftaran Sangat Mudah',
    val2Desc: 'Proses pendaftaran super simpel. Baik perseorangan maupun kolektif sekolah sekolah, tanpa birokrasi berbelit dan tumpukan kertas formulir.',
    val2Badge: 'Cukup 3 Langkah Sederhana',
    val3Title: 'Bermanfaat Nyata',
    val3Desc: 'Anak Anda akan langsung diperiksa organ THT, diukur indeks tinggi/berat badan ideal, serta diedukasi profesi kedokteran lewat mini-tour asyik.',
    val3Badge: 'Direkomendasikan Dokter Spesialis',
    packBadge: 'PILIHAN INVESTASI KESEHATAN ANAK',
    packTitle: 'Paket Keanggotaan Terjangkau & Kaya Manfaat',
    packDesc: 'Silakan tentukan paket yang paling sesuai dengan kebutuhan buah hati Anda atau rombongan bimbingan lembaga pendidikan sekolah.',
    recommended: 'Paling Direkomendasikan 🔥',
    platDesc: 'Fasilitas rekreasi medis teramat lengkap & eksklusif',
    goldDesc: 'Benefit dasar komprehensif rekreasi sehat seimbang',
    investment: 'INVESTASI',
    perKid: '/ anak',
    platFeatTitle: 'Mendapatkan 10 Keunggulan Fasilitas:',
    goldFeatTitle: 'Mendapatkan 8 Fasilitas Utama:',
    matrixTitle: 'Matriks Perbandingan Paket Kids',
    matrixNote: 'FAIR PLAY BENEFIT (Klik baris untuk menyorot)',
    colBenefit: 'Fasilitas & Benefit',
    maskotBadge: 'MASKOT UTAMA',
    maskotDesc: '#AnakSehatBanyuwangi — Sahabat tawa ceria rekreasi belajar & cek tumbuh kembang anak.',
    formTitle: 'Formulir Pendaftaran Member Yasmin Kids',
    formSubtitle: '#GenerasiSehatBanyuwangi — Bergabunglah dengan puluhan lembaga sekolah dan ratusan anak-anak hebat lainnya.',
    inputChildName: 'Nama Lengkap Anak:',
    inputSchool: 'Nama Rombongan Sekolah / Lembaga:',
    inputBirthPlace: 'Tempat Lahir:',
    inputBirthDate: 'Tanggal Lahir:',
    inputWaNumber: 'No. WhatsApp Orang Tua:',
    inputGender: 'Jenis Kelamin:',
    inputPackage: 'Pilih Kategori Paket:',
    male: 'Laki-laki',
    female: 'Perempuan',
    regSuccess: 'Selamat, Registrasi Berhasil!',
    welcomePrefix: 'Selamat datang di keluarga besar',
    printCard: 'Cetak Kartu',
    resetForm: 'Daftar Anak Lain',
    scheduleBadge: 'ALUR AKTIVITAS REKREASI',
    scheduleTitle: 'Bagaimana Kemeriahan Berlangsung?',
    scheduleDesc: 'Saksikan jadwal tahapan agenda harian yang asyik bagi anak ketika menempuh sirkuit pelayanan kesehatan kids:',
    upcomingBadge: 'UPCOMING SESSION SCHEDULE',
    upcomingTitle: 'Rencana Jadwal Kegiatan Rombongan Terdekat',
    galleryBadge: '📸 DOKUMENTASI KEGIATAN KLAN KELUARGA',
    galleryTitle: 'Galeri Aktivitas Kapten Yaskid',
    testimonialBadge: 'KATA MEREKA YANG TELAH BERGABUNG',
    testimonialTitle: 'Kebahagiaan & Kepuasan Wali Murid',
    regSubtitle: 'Silakan isi formulir asuhan anak di bawah ini secara lengkap untuk menerbitkan Kartu Member Kapten Yaskid instan:',
    regSuccessSubtitle: 'Simpan atau cetak Kartu Member Sementara berikut ini:',
    cardMember: 'MEMBER CARD',
    cardMemberPrefix: 'YASMIN KIDS CLUB',
    cardMemberClass: 'MEMBER',
    cardNo: 'NOMOR ANGGOTA:',
    cardChildName: 'NAMA PESERTA ANAK:',
    cardSchool: 'ASAL SEKOLAH:',
    cardWa: 'NO WHATSAPP:',
    cardFooter: 'Bawa kartu ini saat kunjungan / hubungi humas RS Yasmin',
    registError: 'Mohon lengkapi Nama Anak, No WhatsApp, dan Asal Sekolah!',
    placeholderChildName: 'Contoh: Muhammad Rafii',
    placeholderSchool: 'Contoh: SDN 1 Lateng Banyuwangi',
    placeholderBirthPlace: 'Contoh: Banyuwangi',
    placeholderWa: 'Contoh: 0812345678',
    termsBadge: 'REGULATORY & COMPLIANCE',
    termsTitle: 'Syarat & Ketentuan Umum Kepesertaan',
    termsDesc: 'Sederhana, aman, tanpa beban kualifikasi rumit.',
    termsNo: 'NO',
    termsReq: 'PERSYARATAN UTAMA',
    termsDetail: 'KETERANGAN & DETAIL DOKUMEN',
    noteTitle: 'Catatan Penting Pelaksanaan:',
    noteItem1: 'Program ini eksklusif bagi kalangan pelajar berdomisili di Banyuwangi raya dan rombongan terdekat.',
    noteItem2: 'Pendaftaran dapat diserahkan secara mandiri perorangan anak atau rombongan satu sekolah penuh.',
    noteItem3: 'Selesai pendaftaran dan pembayaran terverifikasi, Anda akan dijadwalkan tanggal pelaksanaan hospital tour resmi.',
    ctaTitle: 'Ayo Bawa Generasi Anak Banyuwangi Lebih Sehat!',
    ctaDesc: 'Pendaftaran kolektif sekolah sekolah mendapatkan pendampingan khusus serta MOU resmi jaminan kesehatan anak didik. Hubungi tim humas RS Yasmin segera.',
    ctaButton: 'Hubungi Tim Yasmin Kids',
    faqBadge: 'ANY QUESTIONS? WE ANSWERED THEM',
    faqTitle: 'Tanya Jawab Seputar Yasmin Kids Club',
    actLabel1: 'Hospital Tour Ceria',
    actDesc1: 'Anak-anak diajak berkeliling menjelajahi RS Yasmin secara ramah, mengenal perawat ceria, serta membuang ketakutan psikologis terhadap jarum suntik.',
    actLabel2: 'Cek Pemeriksaan Kesehatan',
    actDesc2: 'Penimbangan berat badan seimbang, tinggi badan, lingkar kepala, dan pemantauan organ THT anak oleh jajaran dokter ahli penuh empati.',
    actLabel3: 'Parenting Kesehatan Sehat',
    actDesc3: 'Interaksi penyuluhan nutrisi, pencegahan stunting, dan mitigasi kecanduan gawai/gadget bagi para wali murid atau guru pendamping.',
    actLabel4: 'Bermain di Playground',
    actDesc4: 'Anak bebas menikmati petualangan interaktif ramah lingkungan di area playground asri Garden Family Resto mitra resmi RS Yasmin.',
    actLabel5: 'Gebyar Akbar Kapten Yaskid',
    actDesc5: 'Acara festival tahunan megah yang menyajikan beragam lomba ketangkasan, pembagian piala, kuis ceria, serta kumpul bareng semua klan member.',
    actLabel6: 'Makan Menu Sehat Organik',
    actDesc6: 'Penyajian menu gizi khusus ramah tumbuh kembang anak untuk bersantap bersama wali kelas maupun perintis kelompok (exclude).',
  },
  EN: {
    heroBadge: '🧒 YASMIN KIDS CLUB',
    heroTitle: 'Premium Educational & Health Services for the Smart Generation!',
    heroDesc: 'An exclusive program of RS Yasmin Banyuwangi specially designed for children aged 3 to 12 years. Combining emotional immunization, playground fun, and fearless hospital tours!',
    affordable: '💰 AFFORDABLE PRICE',
    easyReg: '📝 EASY REGISTRATION',
    greatBenefit: '🌟 GREAT BENEFITS',
    regNow: 'Register Now',
    viewPack: 'View Educational Packages',
    aboutBadge: 'DEVELOPMENT VISION',
    aboutTitle: 'Meet the #HealthyBanyuwangiKids Movement',
    aboutDesc: 'Yasmin Kids is an original dedicated program specially designed under the care of RS Yasmin Banyuwangi doctors to support the optimal milestones of children’s physical and emotional intelligence growth.',
    val1Title: 'Affordable for Everyone',
    val1Desc: 'Starting from only IDR 30,000, your beloved children will receive a comprehensive checkup, merchandise bag, and free playground vouchers.',
    val1Badge: 'From IDR 30K Per Participant',
    val2Title: 'Super Easy Registration',
    val2Desc: 'Simple registration process. Whether registering individually or collectively as a school group, free of complex bureaucracy and piles of forms.',
    val2Badge: 'Just 3 Simple Steps',
    val3Title: 'Real, Tangible Benefits',
    val3Desc: 'Your child will get their ENT checked, ideal height/weight index monitored, and be educated about the medical profession through a fun mini-tour.',
    val3Badge: 'Recommended by Specialists',
    packBadge: 'CHILDREN HEALTH INVESTMENT OPTIONS',
    packTitle: 'Affordable & Benefit-Rich Membership Packages',
    packDesc: 'Please decide which package best matches your child’s needs or your educational institution’s school group delegation.',
    recommended: 'Most Recommended 🔥',
    platDesc: 'Extremely complete & exclusive medical recreation facilities',
    goldDesc: 'Comprehensive basic healthy balanced recreation benefits',
    investment: 'INVESTMENT',
    perKid: '/ child',
    platFeatTitle: 'Get 10 Facility Advantages:',
    goldFeatTitle: 'Get 8 Primary Facilities:',
    matrixTitle: 'Kids Package Comparison Matrix',
    matrixNote: 'FAIR PLAY BENEFIT (Click rows to highlight)',
    colBenefit: 'Facilities & Benefits',
    maskotBadge: 'MAIN MASCOT',
    maskotDesc: '#HealthyBanyuwangiKids — Enthusiastic learning companion & child growth checkup partner.',
    formTitle: 'Yasmin Kids Club Registration',
    formSubtitle: '#HealthyBanyuwangiGeneration — Join dozens of partner schools and hundreds of other great kids.',
    inputChildName: 'Child’s Full Name:',
    inputSchool: 'School delegation / Institution name:',
    inputBirthPlace: 'Place of Birth:',
    inputBirthDate: 'Date of Birth:',
    inputWaNumber: 'WhatsApp Number:',
    inputGender: 'Gender:',
    inputPackage: 'Select Membership Package:',
    male: 'Male',
    female: 'Female',
    regSuccess: 'Registration Successfully Completed!',
    welcomePrefix: 'Welcome to the big family of',
    printCard: 'Print Card',
    resetForm: 'Register Another Child',
    scheduleBadge: 'AGENDA FLOW TABLE',
    scheduleTitle: 'D-Day Service Circuit Schedule',
    scheduleDesc: 'See the fun daily agenda stages for children when undergoing the kids health service circuit:',
    upcomingBadge: 'UPCOMING SESSION SCHEDULE',
    upcomingTitle: 'Upcoming Session Plan for Nearest Groups',
    galleryBadge: '📸 EVENTS DOCUMENTATION GALLERY',
    galleryTitle: 'Captain Yaskid Activity Gallery',
    testimonialBadge: 'WHAT THOSE WHO JOINED SAY',
    testimonialTitle: 'Happiness & Satisfaction of School Parents',
    regSubtitle: 'Please fill out the child support form below to issue an instant Captain Yaskid Member Card:',
    regSuccessSubtitle: 'Save or print the following Temporary Member Card:',
    cardMember: 'MEMBER CARD',
    cardMemberPrefix: 'YASMIN KIDS CLUB',
    cardMemberClass: 'MEMBER',
    cardNo: 'MEMBER ID:',
    cardChildName: 'CHILD NAME:',
    cardSchool: 'SCHOOL:',
    cardWa: 'WHATSAPP:',
    cardFooter: 'Bring this card during visit / contact RS Yasmin relations',
    registError: 'Please complete Child Name, WhatsApp Number, and School!',
    placeholderChildName: 'Example: Muhammad Rafii',
    placeholderSchool: 'Example: SDN 1 Lateng Banyuwangi',
    placeholderBirthPlace: 'Example: Banyuwangi',
    placeholderWa: 'Example: 0812345678',
    termsBadge: 'REGULATORY & COMPLIANCE',
    termsTitle: 'Terms & Conditions of Membership',
    termsDesc: 'Simple, safe, without complex qualification processes.',
    termsNo: 'NO',
    termsReq: 'MAIN REQUIREMENT',
    termsDetail: 'DESCRIPTION & DOCUMENT DETAILS',
    noteTitle: 'Important Execution Notes:',
    noteItem1: 'This program is exclusive for students residing in Banyuwangi and neighboring regions.',
    noteItem2: 'Registration can be submitted individually or collectively as a school.',
    noteItem3: 'After registration and payment are verified, you will be scheduled for the official hospital tour.',
    ctaTitle: 'Let’s Bring Banyuwangi’s Free Children Generation to be Healthier!',
    ctaDesc: 'Collective school registrations get special guidance and formal healthcare guarantees for students. Contact RS Yasmin public relations immediately.',
    ctaButton: 'Contact Yasmin Kids Team',
    faqBadge: 'ANY QUESTIONS? WE ANSWERED THEM',
    faqTitle: 'Frequently Asked Questions about Yasmin Kids Club',
    actLabel1: 'Happy Hospital Tour',
    actDesc1: 'Children are guided to inspect and explore RS Yasmin warmly, meeting smiling nurses, and eliminating any psychological fears of needles.',
    actLabel2: 'Comprehensive Health Screening',
    actDesc2: 'Well-balanced assessments of height, weight, head circumference, and ENT examinations by caring expert pediatric medical teams.',
    actLabel3: 'Healthy Parenting Workshop',
    actDesc3: 'Fun educational sessions addressing kids nutrition, stunting prevention, and gadget addiction mitigation for supervising parents/teachers.',
    actLabel4: 'Playground Recruits',
    actDesc4: 'Children are free to enjoy green interactive playground spaces located at our official partner Garden Family Resto.',
    actLabel5: 'Grand Captain Yaskid Festival',
    actDesc5: 'An elegant annual celebration offering sports and talent contests, trophy awards, interactive quiz events, and kids gathering.',
    actLabel6: 'Organic Healthy Lunch Feast',
    actDesc6: 'Providing nutritional menus curated for excellent child growth to be enjoyed together with teachers/delegates (catering excluded).',
  },
  KR: {
    heroBadge: '🧒 야스민 키즈 클럽',
    heroTitle: '똑똑한 세대를 위한 프리미엄 교육 및 건강 서비스!',
    heroDesc: '야스민 바뉴왕이 병원이 3~12세 어린이를 위해 특별히 고안한 독점 프로그램입니다. 정서적 안정, 활기찬 놀이터, 두려움 없는 탐방 프로그램을 제공합니다.',
    affordable: '💰 합리적인 가격',
    easyReg: '📝 쉬운 가입',
    greatBenefit: '🌟 뛰어난 혜택',
    regNow: '지금 등록하기',
    viewPack: '교육 패키지 보기',
    aboutBadge: '아동 성장 비전',
    aboutTitle: '#아동건강바뉴왕이 캠페인',
    aboutDesc: '야스민 키즈는 소아청소년과 전문의들이 정서 및 신체 성장을 지지하기 위해 고안한 야스민 병원의 명품 아동 보건 교육 캠페인입니다.',
    val1Title: '모두를 위한 착한 비용',
    val1Desc: '단돈 3만 루피아부터 종합 건강 검진, 이색 기념품백 및 놀이터 무료 이용권을 제공받을 수 있습니다.',
    val1Badge: '1인당 3만 루피아부터',
    val2Title: '매우 간편한 신청',
    val2Desc: '복잡한 서류 절차 없이 개인 또는 학교 단체 단위로도 쉽고 빠르게 온라인 예약이 가능합니다.',
    val2Badge: '단 3단계의 쉬운 신청 과정',
    val3Title: '직접 체감하는 유익함',
    val3Desc: '이비인후과 진찰, 성장 발육(키, 몸무게) 측정, 재미있는 병원 탐방을 통해 의료진과의 친밀감을 키웁니다.',
    val3Badge: '전문의 적극 추천 브랜드',
    packBadge: '어린이 건강 투자 패키지',
    packTitle: '혜택 가득 합리적인 멤버십 프로그램',
    packDesc: '사랑하는 자녀의 보건 발달 니즈 또는 소속 교육기관의 특성에 맞는 최적의 플랜을 선택하십시오.',
    recommended: '의료진 추천 패키지 🔥',
    platDesc: '가장 완벽하고 알찬 종합형 메디컬 레크리에이션 혜택',
    goldDesc: '알짜배기 기본형 성장에 필요한 필수 혜택',
    investment: '투자 비용',
    perKid: '/ 1인당',
    platFeatTitle: '10대 차별화된 우수 혜택:',
    goldFeatTitle: '8대 핵심 기본 혜택:',
    matrixTitle: '키즈 패키지 상세 비교 매트릭스',
    matrixNote: '비교 매트릭스 (행을 클릭해 상세 내용을 확인해 보세요)',
    colBenefit: '비교 항목 및 혜택',
    maskotBadge: '대표 마스코트',
    maskotDesc: '#아동건강바뉴왕이 — 항상 웃음 가득한 어린이의 건강하고 씩씩한 동반자입니다.',
    formTitle: '야스민 키즈 클럽 체험 신청서',
    formSubtitle: '#건강한소아성장 — 바뉴왕이 지역의 백여 개 교육 기관 및 수많은 친구들과 함께해보세요.',
    inputChildName: '자녀 성명 (풀네임):',
    inputSchool: '소속 학교 / 유치원명:',
    inputBirthPlace: '출생지:',
    inputBirthDate: '생년월일:',
    inputWaNumber: '부모님 연락처 (WhatsApp):',
    inputGender: '성별:',
    inputPackage: '참여할 패키지 플랜 선택:',
    male: '남아',
    female: '여아',
    regSuccess: '성공적으로 신청 접수되었습니다!',
    welcomePrefix: '야스민 키즈 클럽의 정식 패밀리가 되신 것을 환영합니다: ',
    printCard: '카드 출력',
    resetForm: '추가 자녀 신청',
    scheduleBadge: '일정 타임라인 안내',
    scheduleTitle: '행사 당일 진료 및 투어 순서',
    scheduleDesc: '아이들이 즐거움 가득한 야스민 키즈 의료 순회 코스를 밟는 유익한 시간표입니다:',
    upcomingBadge: 'UPCOMING SESSION SCHEDULE',
    upcomingTitle: '인근 단체 추천 행사 일정 목록',
    galleryBadge: '📸 야스민 키즈 보건 활동 스냅 사진',
    galleryTitle: '캡틴 야스킷 어린이 축제 일러스트 갤러리',
    testimonialBadge: '체험 학부모 리얼 보이스',
    testimonialTitle: '야스민 키즈 회원가족의 사랑과 평가',
    regSubtitle: '모바일 멤버십 카드 발행을 위해 아동 정보를 누락 없이 기입해 주시기 바랍니다:',
    regSuccessSubtitle: '생성된 하단의 임시 멤버십 카드를 소장하고 스크린샷으로 공유하세요:',
    cardMember: 'MEMBERSHIP',
    cardMemberPrefix: 'YASMIN KIDS CLUB',
    cardMemberClass: 'MEMBER',
    cardNo: '회원 번호:',
    cardChildName: '자녀 성명:',
    cardSchool: '소속 기관:',
    cardWa: '모바일 번호:',
    cardFooter: '방문 시 본 카드를 지시하시고, 상담은 야스민 홍보팀으로 해 주세요.',
    registError: '자녀 명, 연락처 및 소속 학교를 정확하게 적어주십시오!',
    placeholderChildName: '예: 홍길동',
    placeholderSchool: '예: 서울 파랑새 어린이집',
    placeholderBirthPlace: '예: 서울특별시',
    placeholderWa: '예: 01012345678',
    termsBadge: '규정 및 세부 사항',
    termsTitle: '야스민 키즈 스쿨 회원 약관',
    termsDesc: '불필요한 서찰 행정 없이 신속하고 조속하게 구성원 전원 가입이 가능합니다.',
    termsNo: '번호',
    termsReq: '핵심 약조 조건',
    termsDetail: '세부 소명 자료 및 자격 기준 정보',
    noteTitle: '활동 조율 참조 사항:',
    noteItem1: '본 프로그램은 바뉴왕이 학군 및 인센티브 제휴 지역 아동에 한해 참여 가능합니다.',
    noteItem2: '가정 개인별 등록 및 유치원 학예학급 단체 접수를 모두 고루 영양 있게 배려합니다.',
    noteItem3: '신청 및 소정의 보건기금 검증이 끝난 후 확정된 야스민 투어 시간 테이블이 통보됩니다.',
    ctaTitle: '바뉴왕이의 미래, 모든 아이들을 더 건강하고 단단하게!',
    ctaDesc: '학교 학급 전체 신청 시 원장단 간담회 및 전담 보건 위생 증명 MOU 협약 행사를 개최해 드립니다. 지금 바로 문의하세요.',
    ctaButton: '키즈 전담 응대팀과 상담하기',
    faqBadge: 'Q&A 자주 묻는 질문답변',
    faqTitle: '야스민 아동 건강 클럽에 대한 명쾌한 해설',
    actLabel1: '해피 해피 병원 탐색',
    actDesc1: '의사 가운 입어보기 등의 체험 놀이를 통해 하얀 가운 공포증을 해소하고 정서적 균형을 이룹니다.',
    actLabel2: '맞춤 종합 성장 육체 발육 검사',
    actDesc2: '소아 전담의가 아동 한 명 한 명 세심한 호흡으로 체중, 신장 발달 곡선 및 THT 정밀 검사를 진행합니다.',
    actLabel3: '학부모 대상 올바른 건강 양육 보건소',
    actDesc3: '미디어 중독, 소아 비만, 편식 예방 가이드 교육을 별도로 마련해 학부모 교사진께 상담해 드립니다.',
    actLabel4: '정원 놀이터 아동 스포츠 자유 시간',
    actDesc4: '검사가 끝난 뒤, 자연 친화 제휴 가든 야외 놀이터 교실에서 신나게 에너지를 발산합니다.',
    actLabel5: '캡틴 야스킷 정기 종합 예술 대축제',
    actDesc5: '야스민 키즈 가입 회원들이 한자리에 모여 장기 자랑을 펼치고 상장과 트로피를 수여받는 한마당 문화 행사입니다.',
    actLabel6: '알레르기 안심 건강 유기농 오찬 급식',
    actDesc6: '성장기 어린이의 지력 발달에 맞춘 유기농 소아 단체 웰빙 시식 교실입니다 (식사비 자체 별도).',
  },
  ZH: {
    heroBadge: '🧒 雅斯敏儿童健康俱乐部',
    heroTitle: '专为聪慧下一代量身定制的教育与健康高端服务！',
    heroDesc: '雅斯敏巴纽旺医院精心设计的3至12岁儿童专属健康科普体验项目。融合情感呵护、阳光乐园和快乐无惧医院探秘！',
    affordable: '💰 价格实惠亲民',
    easyReg: '📝 注册一分钟完成',
    greatBenefit: '🌟 卓越成长裨益',
    regNow: '立即在线报名',
    viewPack: '查看科普教育套餐',
    aboutBadge: '茁壮成长愿景',
    aboutTitle: '了解 #巴纽旺伊健康儿童 行动',
    aboutDesc: '雅斯敏儿童（Yasmin Kids）俱乐部是巴纽旺伊雅斯敏医院儿科医护团队倾情打造的专属健康教育科普项目，旨在全方位支持孩子在身体发育和情商、智力发育上的黄金成长期。',
    val1Title: '实惠亲民，惠及大众',
    val1Desc: '仅需3万印尼盾起，即可让您心爱的孩子享受全面的生长发育检测、精美定制纪念品包以及合作庄园餐厅的儿童游乐园免费门票。',
    val1Badge: '每位参与儿童仅需3万盾起',
    val2Title: '极其简便快捷的报名流程',
    val2Desc: '系统简单。无论是家长为个人报名，还是学校、幼儿园或机构团体集体报名，均可在线一键轻松预约，免去繁琐的书面审批和冗长的表格填写。',
    val2Badge: '仅需3个简单步骤',
    val3Title: '真实可见、触手全方位健康裨益',
    val3Desc: '由专业医护团队为孩子筛查耳鼻喉状况、监测生长发育核心指标（身高、体重、头围），并开展趣味“妙手小医生”医院微探秘，消除对医院的心理恐惧。',
    val3Badge: '儿科专家倾力推荐',
    packBadge: '儿童健康发展与成长投资选择',
    packTitle: '实惠且极具价值的会员体验套餐',
    packDesc: '请为您的宝贝或您代表的教育机构团体选择最匹配成长需求的会员方案。',
    recommended: '最值得推荐的医疗方案 🔥',
    platDesc: '极其完善、奢华的儿童专属医学游乐与全方位关怀设施',
    goldDesc: '全面而实用的基础成长与健康促进体验权益',
    investment: '成长投资价值',
    perKid: '/ 每位儿童',
    platFeatTitle: '尊享10大卓越专属设施与权益优势：',
    goldFeatTitle: '尊享8大核心基础健康权益与设施：',
    matrixTitle: '雅斯敏儿童套餐详细对比矩阵',
    matrixNote: '公开透明权益对比（点击各行可高亮显示）',
    colBenefit: '服务项目与健康权益',
    maskotBadge: '吉祥物与身份标志',
    maskotDesc: '#巴纽旺伊健康儿童 — 热情洋溢的小超人伙伴，陪伴孩子们快乐检查、茁壮成长。',
    formTitle: '雅斯敏儿童健康俱乐部在线报名表',
    formSubtitle: '#巴纽旺伊健康新一代 — 立即加入我们，与数十所合作名校和成百上千位聪明的小伙伴共同开启健康之旅。',
    inputChildName: '儿童完整姓名：',
    inputSchool: '所属学校/幼儿园/机构名称：',
    inputBirthPlace: '出生地点：',
    inputBirthDate: '出生日期：',
    inputWaNumber: '家长微信/联系电话（WhatsApp）：',
    inputGender: '儿童性别：',
    inputPackage: '请选择您的会员方案套餐：',
    male: '男童',
    female: '女童',
    regSuccess: '恭喜您，报名已成功提交！',
    welcomePrefix: '热烈欢迎加入雅斯敏儿童健康俱乐部大家庭：',
    printCard: '导出/打印会员卡',
    resetForm: '为其他孩子报名',
    scheduleBadge: '日程安排与活动流程表',
    scheduleTitle: '活动当日服务与探索流程',
    scheduleDesc: '在开展雅斯敏儿童健康服务时，孩子们将按以下充满乐趣的日程流依次体验各项健康筛查与解密活动：',
    upcomingBadge: 'UPCOMING SESSION SCHEDULE',
    upcomingTitle: '近期学校与机构团体体验活动行程表',
    galleryBadge: '📸 活动精彩瞬间照片墙',
    galleryTitle: '雅斯敏小超人专属艺术与科普活动画廊',
    testimonialBadge: '体验过的家长们怎么说',
    testimonialTitle: '来自数十所合作学校家长们最真实的感恩与好评反馈',
    regSubtitle: '请在下方填写儿童基本信息，以即时生成小超人电子会员卡：',
    regSuccessSubtitle: '请妥善保存或打印下方生成的临时电子会员卡：',
    cardMember: '会员卡',
    cardMemberPrefix: '雅斯敏儿童健康俱乐部',
    cardMemberClass: 'VIP 会员',
    cardNo: '会员 ID 编号：',
    cardChildName: '儿童姓名：',
    cardSchool: '所属机构：',
    cardWa: '联系电话：',
    cardFooter: '请在到访活动现场时出示此卡，如有疑问请随时联系雅斯敏公关团队。',
    registError: '请完整填写儿童姓名、联系方式以及所属学校/幼儿园！',
    placeholderChildName: '例如：张小明',
    placeholderSchool: '例如：巴纽旺伊第一公立小学',
    placeholderBirthPlace: '例如：巴纽旺伊',
    placeholderWa: '例如：0812345678',
    termsBadge: '服务条例及合规保障',
    termsTitle: '会员俱乐部服务条款与条件',
    termsDesc: '简便安全，无繁琐冗长的资格审核流程，让更多孩子轻松受益。',
    termsNo: '序号',
    termsReq: '核心参与要求',
    termsDetail: '详细规则与所需证明细节',
    noteTitle: '重要活动配合提示：',
    noteItem1: '本活动目前仅面向巴纽旺伊地区及周边合作学区的儿童与在读学生开放。',
    noteItem2: '我们热烈欢迎广大家长以个人名义报名，也非常鼓励幼儿园、班级、学校等以团体形式统一申请。',
    noteItem3: '完成在线报名和费用审核核实后，雅斯敏团队将与您沟通并排定正式的专属医院探索旅程表。',
    ctaTitle: '携手并进，让巴纽旺伊的每一位孩子更健康、更强壮！',
    ctaDesc: '凡以学校、班级或幼儿园集体形式统一报名，即可享受定制版到校健康指导、专属绿色通道，并签署医校共建学生健康保障合作协议（MOU）。现在就联系我们吧！',
    ctaButton: '立即咨询儿童健康专服团队',
    faqBadge: '如有疑问？在此解答',
    faqTitle: '关于雅斯敏儿童俱乐部体验活动的常见问题解答',
    actLabel1: '“快乐医院”奇妙探秘',
    actDesc1: '在和蔼的导览姐姐带领下，穿上定制小医生服探索医院，以游戏化交互消除对打针和穿白大褂的心理恐惧。',
    actLabel2: '一站式儿童生理发育核心筛查',
    actDesc2: '由温和亲切的儿科医生与护士，为孩子精密测量身高、体重、头围发育指数，并完成耳鼻喉健康普查。',
    actLabel3: '“科学育儿”家长交流研讨会',
    actDesc3: '专为带队老师及家长开设的健康微沙龙，提供儿童科学营养指导、行为成长分析、防止数码产品沉迷等专业指导。',
    actLabel4: '“绿色天地”合作乐园欢聚时',
    actDesc4: '检查结束后，孩子们可在雅斯敏医院官方合作的绿色家庭餐厅（Garden Family Resto）户外乐园中，尽情嬉戏游玩。',
    actLabel5: '“雅斯敏小超人”年度盛典',
    actDesc5: '定期举办的儿童才艺比拼，给孩子们提供展示自我的舞台，更有机会赢得精美奖品与奖牌。',
    actLabel6: '健康有机营养午餐会',
    actDesc6: '体验由儿童营养专家精心调配的健康中餐，在欢快合作的氛围下与同伴们愉快用餐（餐费需自理/不含在门票内）。',
  },
  AR: {
    heroBadge: '🧒 ناد ياسمين كيدز',
    heroTitle: 'خدمات تعليمية وصحية متميزة لجيل ذكي!',
    heroDesc: 'برنامج حصري من مستشفى ياسمين بانيوانجي مصمم خصيصاً للأطفال من سن ٣ إلى ١٢ سنة. يجمع بين المناعة العاطفية ومرح الملاعب وجولات استكشاف المستشفى الخالية من الخوف!',
    affordable: '💰 أسعار معقولة',
    easyReg: '📝 تسجيل سهل',
    greatBenefit: '🌟 فوائد عظيمة',
    regNow: 'سجل الآن',
    viewPack: 'عرض الباقات التعليمية',
    aboutBadge: 'رؤية النمو والتطوير',
    aboutTitle: 'تعرف على مبادرة #أطفال_بانيوانجي_الأصحاء',
    aboutDesc: 'ياسمين كيدز هو برنامج مخصص تم تصميمه بعناية فائقة تحت إشراف أطباء مستشفى ياسمين بانيوانجي لدعم نمو الأطفال البدني والذكاء العاطفي بشكل مثالي.',
    val1Title: 'متاح للجميع وبأسعار مناسبة',
    val1Desc: 'بدءاً من ٣٠,٠٠٠ روبية إندونيسية فقط، يحصل طفلك العزيز على فحص نمو شامل، وحقيبة هدايا مميزة، وتذاكر لعب مجانية.',
    val1Badge: 'تبدأ من ٣٠ ألف روبية للطفل',
    val2Title: 'عملية تسجيل غاية في السهولة',
    val2Desc: 'نظام بسيط للغاية. سواء كان التسجيل فردياً من قبل أولياء الأمور أو جماعياً للمدارس ورياض الأطفال، يمكن الحجز بلمسة واحدة دون تعقيدات ورقية.',
    val2Badge: '٣ خطوات بسيطة فقط',
    val3Title: 'فوائد صحية ملموسة وواضحة',
    val3Desc: 'يقوم فريق طبي متخصص بفحص الأنف والأذن والحنجرة، وقياس مؤشرات النمو الأساسية (الطول والوزن ومحيط الرأس)، مع جولة تفاعلية لكسر حاجز الخوف من الأطباء.',
    val3Badge: 'يوصي به أخصائيو الأطفال',
    packBadge: 'استثمار في صحة ونمو طفلك',
    packTitle: 'باقات عضوية مميزة وقيمة للغاية',
    packDesc: 'يرجى اختيار باقة العضوية التي تناسب احتياجات نمو طفلك أو مجموعتك المدرسية.',
    recommended: 'الباقة الموصى بها بشدة 🔥',
    platDesc: 'رعاية طبية راقية ومرافق ترفيهية متكاملة وحصرية للأطفال',
    goldDesc: 'مزايا أساسية وشاملة لتعزيز صحة ونمو الطفل',
    investment: 'قيمة الاستثمار في النمو',
    perKid: '/ لكل طفل',
    platFeatTitle: 'استمتع بـ ١٠ مزايا حصرية وراقية للأطفال:',
    goldFeatTitle: 'استمتع بـ ٨ مزايا صحية أساسية للأطفال:',
    matrixTitle: 'جدول المقارنة التفصيلي لباقات ياسمين كيدز',
    matrixNote: 'مقارنة واضحة للمزايا (اضغط على الصف لتظليله)',
    colBenefit: 'الخدمات والمزايا الصحية',
    maskotBadge: 'التميمة وشعار النادي',
    maskotDesc: 'كابتن يسكيد - البطل الصغير المرح الذي يرافق الأطفال طوال رحلتهم الصحية لمساعدتهم على النمو بسعادة.',
    formTitle: 'استمارة التسجيل الإلكتروني لنادي ياسمين كيدز',
    formSubtitle: '#جيل_بانيوانجي_الصحي - انضم إلينا اليوم مع مئات الأطفال المتميزين والمدارس الشريكة الرائدة.',
    inputChildName: 'الاسم الكامل للطفل:',
    inputSchool: 'اسم المدرسة / الروضة / المؤسسة:',
    inputBirthPlace: 'مكان الميلاد:',
    inputBirthDate: 'تاريخ الميلاد:',
    inputWaNumber: 'رقم هاتف ولي الأمر (واتساب):',
    inputGender: 'جنس الطفل:',
    inputPackage: 'اختر باقة العضوية المفضلة:',
    male: 'ذكر',
    female: 'أنثى',
    regSuccess: 'تهانينا، تم إرسال طلب التسجيل بنجاح!',
    welcomePrefix: 'مرحباً بك بحرارة في عائلة نادي ياسمين كيدز:',
    printCard: 'تصدير / طباعة بطاقة العضوية',
    resetForm: 'تسجيل طفل آخر',
    scheduleBadge: 'جدول الأنشطة اليومي',
    scheduleTitle: 'مسار الجولة الاستكشافية يوم الفعالية',
    scheduleDesc: 'يخوض الأطفال تجربة ممتعة ومنظمة تشمل الفحوصات والأنشطة الاستكشافية والترفيهية التالية بالتناوب:',
    upcomingBadge: 'جدول الزيارات القادمة',
    upcomingTitle: 'جدول رحلات المدارس والمجموعات القادمة',
    galleryBadge: '📸 معرض الصور واللحظات الرائعة',
    galleryTitle: 'معرض الفنون والأنشطة لأبطال ياسمين الصغار',
    testimonialBadge: 'آراء وتجارب أولياء الأمور',
    testimonialTitle: 'شهادات شكر وتقدير حقيقية من عائلات المدارس المشاركة',
    regSubtitle: 'يرجى ملء بيانات الطفل أدناه لإصدار بطاقة العضوية الإلكترونية فوراً:',
    regSuccessSubtitle: 'يرجى حفظ أو طباعة بطاقة العضوية الإلكترونية المؤقتة أدناه:',
    cardMember: 'بطاقة عضوية',
    cardMemberPrefix: 'نادي ياسمين كيدز الصحي',
    cardMemberClass: 'عضو VIP',
    cardNo: 'رقم العضوية:',
    cardChildName: 'اسم الطفل:',
    cardSchool: 'المؤسسة التابع لها:',
    cardWa: 'رقم الاتصال:',
    cardFooter: 'يرجى إبراز هذه البطاقة عند زيارة الفعالية. لأي استفسار يرجى التواصل مع فريق العلاقات العامة لـ ياسمين كيدز.',
    registError: 'يرجى ملء البيانات اللازمة كالاسم الكامل للمشترك ورقم الهاتف والمدرسة!',
    placeholderChildName: 'مثال: محمد السعيد',
    placeholderSchool: 'مثال: مدرسة بانيوانجي ثنائية اللغة',
    placeholderBirthPlace: 'مثال: بانيوانجي',
    placeholderWa: 'مثال: ٠٨١٢٣٤٥٦٧٨',
    termsBadge: 'الامتثال الطبي والأكاديمي',
    termsTitle: 'الشروط العامة لدخول ورش أعمال ياسمين التوعوية',
    termsDesc: 'بوابات عبور آمنة خالية من التعقيدات التنظيمية والورقية لراحة طفلك وعائلتك.',
    termsNo: 'م',
    termsReq: 'معايير القبول الأساسية',
    termsDetail: 'شروحات واثباتات التأهيل الملحقة بالطلب',
    noteTitle: 'إرشادات الأمان الهامة للأسر:',
    noteItem1: 'يغطي هذا المخطط أطفال منطقة بانيوانجي والمناطق الحضرية الملحقة بدعم المدارس الشريكة.',
    noteItem2: 'نقبل الطلبات الفردية المنسقة ونرحب بشدة بالطلبات الجماعية بتمثيل الوفود المدرسية.',
    noteItem3: 'بمجرد فحص تسديد رسوم الباقة التثقيفية، يرسل جدول مواعيد الجولات لبريد ولي الأمر في خلال ٢٤ ساعة.',
    ctaTitle: 'نحو جيل قوي وباسم لغد أطفال بانيوانجي المبدعين!',
    ctaDesc: 'التسجيل الجماعي للمدارس يوفر حماية إسعافية بموجب بروتوكول الرعاية المدرسية الدائم. اتصل Humas لمستشفى ياسمين.',
    ctaButton: 'اتصل بالمكلف بتوجيه ورعاية الأطفال كيدز',
    faqBadge: 'الأسئلة الشائعة وإجابات الاختصاصيين',
    faqTitle: 'الأسئلة الأكثر طرحاً وجدلاً حول "أبطال ياسمين الصغار"',
    actLabel1: 'جولة استكشاف المستشفى الباسمة',
    actDesc1: 'ارتداء ملابس الأطباء البيضاء ومداعبة سماعات الفحص الطبي تبدد لدى طفلك الرهاب المزمن من الحقن والأمراض.',
    actLabel2: 'الفحوصات الهيكلية المتخصصة للنمو السليم',
    actDesc2: 'مراجعة طول قامة الطفل وجدول وزنه ومحيط رأسه من قبل أطباء الأطفال برقة متكاملة للحفاظ على استقرارهم.',
    actLabel3: 'ندوات التربية والتغذية الطبية لأولياء الأمور',
    actDesc3: 'بينما يستمتع الصغار بالتعليم، نقيم استشارات علاجية للأمراض السلوكية للأهل كالسمنة وإدمان الأجهزة.',
    actLabel4: 'أوقات حرة في الملاعب الصديقة للبيئة',
    actDesc4: 'ينطلق المشتركون بعد انتهاء الفحص لتفريغ طاقاتهم التنافسية في الملاعب الخارجية لمطعم جاردن الشريك.',
    actLabel5: 'الكرنفال السنوي الفاخر لأبطال كيدز',
    actDesc5: 'حفل ضخم يجمع رفاق النادي لتكريم الفائزين بمسابقات المهارات الفنية، وتوزيع الكؤوس والدروع التذكارية.',
    actLabel6: 'الوجبة الصحية المنعشة والآمنة للنمو',
    actDesc6: 'قوائم أطعمة طازجة أعدت خصيصاً بنسب بروتين وكالسيوم محسوبة لتناوله مع رفاق الجولة (غير مشمولة برسوم الباقة).',
  }
};

export default function YasminKids() {
  const lang = useLanguage();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ID;

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredCard, setRegisteredCard] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    namaAnak: '',
    namaSekolah: '',
    tempatLahir: '',
    tglLahir: '',
    telepon: '',
    jk: 'Laki-laki',
    paket: 'PLATINUM'
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetForm = () => {
    setFormData({
      namaAnak: '',
      namaSekolah: '',
      tempatLahir: '',
      tglLahir: '',
      telepon: '',
      jk: 'Laki-laki',
      paket: 'PLATINUM'
    });
    setRegisteredCard(null);
    setErrorMsg(null);
  };

  const handleSubmitReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaAnak || !formData.namaSekolah || !formData.telepon) {
      setErrorMsg(t.registError || 'Mohon lengkapi Nama Anak, No WhatsApp, dan Asal Sekolah!');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegisteredCard({
        id: `Y-KIDS-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleDateString('id-ID'),
        ...formData
      });
      setTimeout(() => {
        document.getElementById('yaskid-success-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 950);
  };

  const getPlatinumItems = () => {
    switch (lang) {
      case 'EN':
        return [
          { no: 1, facility: 'Souvenir package - Captain Yaskid bag', desc: 'Exclusive backpack printed with our character mascot Captain Yaskid' },
          { no: 2, facility: 'Playground vouchers at Garden Family Resto (5 pcs)', desc: '5 play admission tickets for kids in partner Garden Playgrounds' },
          { no: 3, facility: 'Complete kids health checkup', desc: 'Measurement of height, weight, head circumference, and ENT screening by medical staff' },
          { no: 4, facility: 'Health parenting sessions by medical team', desc: 'Education courses for parents concerning growth and healthy patterns' },
          { no: 5, facility: 'Fearless Hospital Tour experience', desc: 'Friendly tours showing equipment and labs to children, easing hospital anxiety' },
          { no: 6, facility: 'Official inter-institution MOU agreements', desc: 'Formal healthcare partnership between RS Yasmin and schools/education institutions' },
          { no: 7, facility: 'Principals & School Directors Gathering', desc: 'Special coordinator sessions discussing sanitation improvements in schooling environments' },
          { no: 8, facility: 'Participate in Grand Carnival of Captain Yaskid', desc: 'Exclusive entries for major seasonal kids festivals and talent shows' },
          { no: 9, facility: 'Support for school member activities', desc: 'Medical standby and wellness supports provided at school member’s big days' },
          { no: 10, facility: 'Balanced nutritious group dining menu', desc: 'Feast of healthy food alongside peers (catering fees excluded/add-on)' }
        ];
      case 'KR':
        return [
          { no: 1, facility: '마스코트 캡틴 야스킷 배낭 세트', desc: '공식 캐릭터 야스킷 일러스트가 디자인된 한정판 귀여운 책가방' },
          { no: 2, facility: '가든 패밀리 레스토랑 놀이터 이용권 (5매)', desc: '제휴 놀이공원에서 사용 가능한 5개의 무료 놀이터 티켓' },
          { no: 3, facility: '종합 신체계측 & 이비인후과 검사', desc: '신장, 체중, 두위 계측 및 소아 전문진이 담당하는 이비인후과 검진' },
          { no: 4, facility: '의료진 친행 부모 대상 세미나', desc: '아동 성장과 올바른 양육 습관을 교정하기 위한 1대1 가이드라인' },
          { no: 5, facility: '두려움 없는 어린이 병원 체험투어', desc: '병원 기구와 환경을 친근하게 소개해 불안감을 극복하게 돕는 체험형 탐사' },
          { no: 6, facility: '공식 제휴 협약 체결 (MOU)', desc: '학교 및 유관 교육 단체와 야스민 병원 간의 상호 발전 협력' },
          { no: 7, facility: '교장단 및 교육 행정 정례 회의', desc: '학습 단체의 위생 상태 및 학교 환경 보건 위원회 논의 세션' },
          { no: 8, facility: '캡틴 야스킷 대규모 종합 축제', desc: '야스민 키즈 회원 전용 연례 장기자랑 및 웰빙 레크리에이션 축제' },
          { no: 9, facility: '학교 대형 행사 지원 서비스', desc: '회원 단체 정기 운동회 및 학예회 시 의료진 의료 파견 서비스' },
          { no: 10, facility: '친구들과 함께하는 영양 식단', desc: '친구들과 함께 나누는 건강하고 영양이 풍부한 유기농 식사 (식비 제외)' }
        ];
      case 'ZH':
        return [
          { no: 1, facility: '定制版雅斯敏小超人双肩背包', desc: '印有官方吉祥物 Kapten Yaskid 的独家背包，精美纪念礼品' },
          { no: 2, facility: '合作乐园免票券（5张）', desc: '可在合作的 Garden 乐园使用，包含五张儿童免入场券' },
          { no: 3, facility: '核心生理发育普查 (身高/体重/头围/耳鼻喉)', desc: '由专业儿科医护团队进行的精确生理测量与耳鼻喉常规健康普查' },
          { no: 4, facility: '首席育儿专家亲授科学膳食家教讲坛', desc: '面向家长的科学健康育儿、儿童发育成长指导和健康管理宣教' },
          { no: 5, facility: '“妙手小医生”医院实景解密之旅', desc: '带领儿童参观医院设施，近距离感受医护日常，消除就医恐惧' },
          { no: 6, facility: '携手学校签署医校合作战略协议', desc: '雅斯敏医院与学校/幼儿园签署正式医教融合战略协作意向备忘录' },
          { no: 7, facility: '合作机构园长/校长绿色成长研讨会', desc: '探讨改进校园环境健康方案，并开展专业的多方战略磋商' },
          { no: 8, facility: '“雅斯敏好青年”年度盛典选拔', desc: '享受专属通道报选年度大型儿童创意及艺术绘画汇演，多重丰厚奖品' },
          { no: 9, facility: '线下校园大型活动特遣医师守护服务', desc: '学校举办运动会等大型活动时，由专业急救医师进行现场医疗安全保障' },
          { no: 10, facility: '“小美食家”膳食品尝餐餐营养大宴', desc: '专为学童定做的低盐低致敏营养套餐，共同品味健康一餐（费用另计）' }
        ];
      case 'AR':
        return [
          { no: 1, facility: 'حقيبة ظهر كابتن يسكيد الحصرية', desc: 'حقيبة ظهر حصرية مطبوع عليها شخصية كابتن يسكيد كهدية تذكارية' },
          { no: 2, facility: 'تذاكر ألعاب مخصصة بمدينة الترفيه (٥ تذاكر)', desc: '٥ تذاكر لدخول منطقة ألعاب جاردن فاميلي للأطفال' },
          { no: 3, facility: 'فحص قياس الطول والوزن والسمع والأنف والأذن', desc: 'قياسات دقيقة للنمو البدني وفحص الأنف والأذن والحنجرة بإشراف طبي' },
          { no: 4, facility: 'جلسات استشارات التربية البدنية والصحية للأهل', desc: 'دورات توعوية لأولياء الأمور حول التغذية والنمو السليم للأطفال' },
          { no: 5, facility: 'جولة الطبيب الصغير الاستكشافية بالمستشفى', desc: 'جولات ترفيهية لتبديد رهاب الأطفال من الإبر والأجواء الطبية' },
          { no: 6, facility: 'مذكرة تفاهم رسمية للرعاية الصحية المدرسية', desc: 'شراكة رسمية بين مستشفى ياسمين والمؤسسات التعليمية لتعزيز الصحة' },
          { no: 7, facility: 'دعوة لحضور ملتقى مدراء ومسؤولي المدارس', desc: 'جلسات توصل سنوية مع مديري المدارس لتطوير برامج الصحة المدرسية' },
          { no: 8, facility: 'المشاركة في المهرجان السنوي لمواهب يسكيد', desc: 'دخول حصري للمهرجانات الكبرى والمسابقات الإبداعية السنوية للأطفال' },
          { no: 9, facility: 'خدمات الإسعاف الطبي لفعاليات المدارس المشتركة', desc: 'توفير فريق طبي للإسعافات الأولية خلال الفعاليات المدرسية الكبرى' },
          { no: 10, facility: 'قوائم الوجبات الصحية المتكاملة للأطفال', desc: 'وجبة صحية عضوية متوازنة يتناولها الأطفال مع زملائهم (تكلفة الوجبة مستبعدة)' }
        ];
      default:
        return PLATINUM_ITEMS;
    }
  };

  const getGoldItems = () => {
    switch (lang) {
      case 'EN':
        return [
          { no: 1, facility: 'Playground vouchers at Garden Family Resto (5 pcs)', desc: '5 play admission tickets for kids in partner Garden Playgrounds' },
          { no: 2, facility: 'Complete kids health checkup', desc: 'Measurement of height, weight, head circumference, and ENT screening by medical staff' },
          { no: 3, facility: 'Health parenting sessions by medical team', desc: 'Education courses for parents concerning growth and healthy patterns' },
          { no: 4, facility: 'Fearless Hospital Tour experience', desc: 'Friendly tours showing equipment and labs to children, easing hospital anxiety' },
          { no: 5, facility: 'Official inter-institution MOU agreements', desc: 'Formal healthcare partnership between RS Yasmin and schools/education institutions' },
          { no: 6, facility: 'Principals & School Directors Gathering', desc: 'Special coordinator sessions discussing sanitation improvements in schooling environments' },
          { no: 7, facility: 'Participate in Grand Carnival of Captain Yaskid', desc: 'Exclusive entries for major seasonal kids festivals and talent shows' },
          { no: 8, facility: 'Balanced nutritious group dining menu', desc: 'Feast of healthy food alongside peers (catering fees excluded/add-on)' }
        ];
      case 'KR':
        return [
          { no: 1, facility: '가든 패밀리 레스토랑 놀이터 이용권 (5매)', desc: '제휴 놀이공원에서 사용 가능한 5개의 무료 놀이터 티켓' },
          { no: 2, facility: '종합 신체계측 & 이비인후과 검사', desc: '신장, 체중, 두위 계측 및 소아 전문진이 담당하는 이비인후과 검진' },
          { no: 3, facility: '의료진 친행 부모 대상 세미나', desc: '아동 성장과 올바른 양육 습관을 교정하기 위한 1대1 가이드라인' },
          { no: 4, facility: '두려움 없는 어린이 병원 체험투어', desc: '병원 기구와 환경을 친근하게 소개해 불안감을 극복하게 돕는 체험형 탐사' },
          { no: 5, facility: '공식 제휴 협약 체결 (MOU)', desc: '학교 및 유관 교육 단체와 야스민 병원 간의 상호 발전 협력' },
          { no: 6, facility: '교장단 및 교육 행정 정례 회의', desc: '학습 단체의 위생 상태 및 학교 환경 보건 위원회 논의 세션' },
          { no: 7, facility: '캡틴 야스킷 대규모 종합 축제', desc: '야스민 키즈 회원 전용 연례 장기자랑 및 웰빙 레크리에이션 축제' },
          { no: 8, facility: '친구들과 함께하는 영양 식단', desc: '친구들과 함께 나누는 건강하고 영양이 풍부한 유기농 식사 (식비 제외)' }
        ];
      case 'ZH':
        return [
          { no: 1, facility: '合作乐园免票券（5张）', desc: '可在合作的 Garden 乐园使用，包含五张儿童免入场券' },
          { no: 2, facility: '核心生理发育普查 (身高/体重/头围/耳鼻喉)', desc: '由专业儿科医护团队进行的精确生理测量与耳鼻喉常规健康普查' },
          { no: 3, facility: '首席育儿专家亲授科学膳食家教讲坛', desc: '面向家长的科学健康育儿、儿童发育成长指导和健康管理宣教' },
          { no: 4, facility: '“妙手小医生”医院实景解密之旅', desc: '带领儿童参观医院设施，近距离感受医护日常，消除就医恐惧' },
          { no: 5, facility: '携手学校签署医校合作战略协议', desc: '雅斯敏医院与学校/幼儿园签署正式医教融合战略协作意向备忘录' },
          { no: 6, facility: '合作机构园长/校长绿色成长研讨会', desc: '探讨改进校园环境健康方案，并开展专业的多方战略磋商' },
          { no: 7, facility: '“雅斯敏好青年”年度盛典选拔', desc: '享受专属通道报选年度大型儿童创意及艺术绘画汇演，多重丰厚奖品' },
          { no: 8, facility: '“小美食家”膳食品尝餐餐营养大宴', desc: '专为学童定做的低盐低致敏营养套餐，共同品味健康一餐（费用另计）' }
        ];
      case 'AR':
        return [
          { no: 1, facility: 'تذاكر ألعاب مخصصة بمدينة الترفيه (٥ تذاكر)', desc: '٥ تذاكر لدخول منطقة ألعاب جاردن فاميلي للأطفال' },
          { no: 2, facility: 'فحص قياس الطول والوزن والسمع والأنف والأذن', desc: 'قياسات دقيقة للنمو البدني وفحص الأنف والأذن والحنجرة بإشراف طبي' },
          { no: 3, facility: 'جلسات استشارات التربية البدنية والصحية للأهل', desc: 'دورات توعوية لأولياء الأمور حول التغذية والنمو السليم للأطفال' },
          { no: 4, facility: 'جولة الطبيب الصغير الاستكشافية بالمستشفى', desc: 'جولات ترفيهية لتبديد رهاب الأطفال من الإبر والأجواء الطبية' },
          { no: 5, facility: 'مذكرة تفاهم رسمية للرعاية الصحية المدرسية', desc: 'شراكة رسمية بين مستشفى ياسمين والمؤسسات التعليمية لتعزيز الصحة' },
          { no: 6, facility: 'دعوة لحضور ملتقى مدراء ومسؤولي المدارس', desc: 'جلسات تنسيق سنوية مع مديري المدارس لتطوير برامج الصحة المدرسية' },
          { no: 7, facility: 'المشاركة في المهرجان السنوي لمواهب يسكيد', desc: 'دخول حصري للمهرجانات الكبرى والمسابقات الإبداعية السنوية للأطفال' },
          { no: 8, facility: 'قوائم الوجبات الصحية المتكاملة للأطفال', desc: 'وجبة صحية عضوية متوازنة يتناولها الأطفال مع زملائهم (تكلفة الوجبة مستبعدة)' }
        ];
      default:
        return GOLD_ITEMS;
    }
  };

  const getMatrixRows = () => {
    switch (lang) {
      case 'EN':
        return [
          { facility: "Souvenir Captain Yaskid Bag", gold: "❌", platinum: "✅" },
          { facility: "Playground Voucher (5 pcs)", gold: "✅", platinum: "✅" },
          { facility: "Health Checkup (TB, BB, LK, THT)", gold: "✅", platinum: "✅" },
          { facility: "Parenting Health Sessions", gold: "✅", platinum: "✅" },
          { facility: "Fearless Hospital Tour", gold: "✅", platinum: "✅" },
          { facility: "MOU between Educational Institutions", gold: "✅", platinum: "✅" },
          { facility: "Banyuwangi School Principal Gathering", gold: "✅", platinum: "✅" },
          { facility: "Captain Yaskid Grand Carnival", gold: "✅", platinum: "✅" },
          { facility: "School Member Event Support", gold: "❌", platinum: "✅" },
          { facility: "Healthy Eat Together Menu", gold: "EXCLUDE", platinum: "EXCLUDE", isExclude: true }
        ];
      case 'KR':
        return [
          { facility: "캡틴 야스킷 배낭 세트", gold: "❌", platinum: "✅" },
          { facility: "가든 패밀리 레스토랑 놀이터 이용권 (5매)", gold: "✅", platinum: "✅" },
          { facility: "종합 신체계측 & 이비인후과 검사", gold: "✅", platinum: "✅" },
          { facility: "학부모 대상 올바른 건강 양육 보건소", gold: "✅", platinum: "✅" },
          { facility: "두려움 없는 어린이 병원 체험투어", gold: "✅", platinum: "✅" },
          { facility: "공식 제휴 협약 체결 (MOU)", gold: "✅", platinum: "✅" },
          { facility: "교장단 및 교육 행정 정례 회의", gold: "✅", platinum: "✅" },
          { facility: "캡틴 야스킷 대규모 종합 축제", gold: "✅", platinum: "✅" },
          { facility: "학교 대형 행사 지원 서비스", gold: "❌", platinum: "✅" },
          { facility: "친구들과 함께하는 영양 식단", gold: "EXCLUDE", platinum: "EXCLUDE", isExclude: true }
        ];
      case 'ZH':
        return [
          { facility: "定制版雅斯敏小超人双肩背包", gold: "❌", platinum: "✅" },
          { facility: "合作乐园免票券（5张）", gold: "✅", platinum: "✅" },
          { facility: "核心生理发育普查 (身高/体重/头围/耳鼻喉)", gold: "✅", platinum: "✅" },
          { facility: "首席育儿专家亲授科学膳食家教讲坛", gold: "✅", platinum: "✅" },
          { facility: "“妙手小医生”医院实景解密之旅", gold: "✅", platinum: "✅" },
          { facility: "携手学校签署医校合作战略协议", gold: "✅", platinum: "✅" },
          { facility: "合作机构园长/校长绿色成长研讨会", gold: "✅", platinum: "✅" },
          { facility: "“雅斯敏好青年”年度创意/艺术绘画汇演", gold: "✅", platinum: "✅" },
          { facility: "线下校园大型活动特遣医师守护服务", gold: "❌", platinum: "✅" },
          { facility: "“小美食家”低盐膳食品尝营养大宴", gold: "不含", platinum: "不含", isExclude: true }
        ];
      case 'AR':
        return [
          { facility: "حقيبة ظهر كابتن يسكيد الحصرية", gold: "❌", platinum: "✅" },
          { facility: "تذاكر ألعاب مخصصة بمدينة الترفيه (٥ تذاكر)", gold: "✅", platinum: "✅" },
          { facility: "فحص قياس الطول والوزن والسمع والأنف والأذن", gold: "✅", platinum: "✅" },
          { facility: "جلسات استشارات التربية البدنية والصحية للأهل", gold: "✅", platinum: "✅" },
          { facility: "جولة الطبيب الصغير الاستكشافية بالمستشفى", gold: "✅", platinum: "✅" },
          { facility: "مذكرة تفاهم رسمية للرعاية الصحية المدرسية", gold: "✅", platinum: "✅" },
          { facility: "دعوة لحضور ملتقى مدراء ومسؤولي المدارس", gold: "✅", platinum: "✅" },
          { facility: "المشاركة في المهرجان السنوي لمواهب يسكيد", gold: "✅", platinum: "✅" },
          { facility: "خدمات الإسعاف الطبي لفعاليات المدارس المشتركة", gold: "❌", platinum: "✅" },
          { facility: "قوائم الوجبات الصحية المتكاملة للأطفال", gold: "غير مشمول", platinum: "غير مشمول", isExclude: true }
        ];
      default:
        return [
          { facility: "Souvenir Tas Kapten Yaskid", gold: "❌", platinum: "✅" },
          { facility: "Voucher Playground (5 pcs)", gold: "✅", platinum: "✅" },
          { facility: "Cek Kesehatan (TB, BB, LK, THT)", gold: "✅", platinum: "✅" },
          { facility: "Parenting Kesehatan Wali Murid", gold: "✅", platinum: "✅" },
          { facility: "Hospital Tour Anti-Takut", gold: "✅", platinum: "✅" },
          { facility: "MOU antar Lembaga Pendidikan", gold: "✅", platinum: "✅" },
          { facility: "Gathering Kepala Sekolah Banyuwangi", gold: "✅", platinum: "✅" },
          { facility: "Program Akbar Gebyar Kapten Yaskid", gold: "✅", platinum: "✅" },
          { facility: "Support Event Keaktifan Sekolah Member", gold: "❌", platinum: "✅" },
          { facility: "Menu Sehat Makan Bersama", gold: "EXCLUDE", platinum: "EXCLUDE", isExclude: true }
        ];
    }
  };

  const getTermsRows = () => {
    switch (lang) {
      case 'EN':
        return [
          { no: 1, title: 'Submit Participant Identity', desc: "Fill out the form (Child's Full Name, Home Address, Place & Date of Birth, Active Parent's WhatsApp Number, Gender, and School/Kindergarten name)." },
          { no: 2, title: 'Pay Registration Fee', desc: "According to the selected package (GOLD IDR 30,000 / PLATINUM IDR 50,000) per child, paid in cash or school transfer." },
          { no: 3, title: 'Age Limit Classification', desc: "Exclusively open for students aged 3 years up to a maximum of 12 years (pre-adolescent)." }
        ];
      case 'KR':
        return [
          { no: 1, title: '참가자 인적사항 제출', desc: "신청 양식(아동 성명, 주소, 출생지 및 생년월일, 학부모 연락처, 성별, 소속 학교/어린이집 명칭)을 입력합니다." },
          { no: 2, title: '등록비 결제', desc: "선택한 패키지(GOLD 30,000원 / PLATINUM 50,000원)에 따라 현금 결제 또는 계좌 이체로 납부합니다." },
          { no: 3, title: '연령 제한 분류', desc: "최소 만 3세부터 최대 12세 미만 학령기 아동에 한해 참여할 수 있습니다." }
        ];
      case 'ZH':
        return [
          { no: 1, title: '提交参与者身份信息', desc: "填写表单（孩子全名、家庭住址、出生地与日期、家长有效微信/联系方式、性别及学校/幼儿园名称）。" },
          { no: 2, title: '缴纳注册费用', desc: "根据所选套餐（GOLD 30,000印尼盾 / PLATINUM 50,000印尼盾）按人头通过现金或转账方式支付。" },
          { no: 3, title: '年龄分类限制', desc: "专为满3周岁至最大12周岁（青春期前）的在校学生及幼儿开放。" }
        ];
      case 'AR':
        return [
          { no: 1, title: 'تقديم بيانات المشترك', desc: "تعبئة استمارة التسجيل (اسم الطفل الكامل، العنوان، مكان وتاريخ الميلاد، هاتف ولي الأمر، الجنس، واسم المدرسة/الحضانة)." },
          { no: 2, title: 'تسديد رسوم الاشتراك', desc: "حسب الباقة المختارة (الباقة الذهبية ٣٠,٠٠٠ روبية / الباقة البلاتينية ٥٠,٠٠٠ روبية) لكل طفل تدفع نقداً أو تحويل." },
          { no: 3, title: 'تصنيف الفئات العمرية', desc: "البرنامج متاح حصرياً للطلاب من سن ٣ سنوات كحد أدنى وحتى ١٢ سنة كحد أقصى." }
        ];
      default:
        return [
          { no: 1, title: 'Menyerahkan Identitas Peserta', desc: "Mengisi formulir (Nama Lengkap Anak, Alamat Domisili, Tempat & Tanggal Lahir, Nomor WhatsApp Aktif Orang Tua, Jenis Kelamin, serta Nama Rombongan Sekolah/TK)." },
          { no: 2, title: 'Membayar Biaya Registrasi', desc: "Sesuai nominal paket yang dipilih (GOLD Rp30.000,- / PLATINUM Rp50.000,-) per satu anak yang disetor tunai atau transfer lembaga." },
          { no: 3, title: 'Batas Tingkatan Klasifikasi Usia', desc: "Terbuka eksklusif bagi sekumpulan pelajar berumur minimal 3 tahun sampai dengan usia pra-remaja maksimum 12 tahun." }
        ];
    }
  };

  const getSchedules = () => {
    switch (lang) {
      case 'EN':
        return [
          { month: 'JULY', day: '10', title: 'Hospital Tour + Complete Health Screening', subtitle: 'Group A (PAUD / TK Pertiwi Banyuwangi)', location: 'Location: RS Yasmin', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: 'JULY', day: '15', title: 'Great Parenting with Growth Specialists', subtitle: 'Interactive discussion for Parents & Teachers', location: 'Location: RS Yasmin', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: 'JULY', day: '20', title: 'Hospital Tour + ENT Health Detection', subtitle: 'Group B (Elementary School Class 1 - 3 Banyuwangi)', location: 'Location: RS Yasmin', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: 'JULY', day: '25', title: 'Hospital Tour + Child Body Nutrition Analysis', subtitle: 'Group C (Elementary School Class 4 - 6 Banyuwangi Raya)', location: 'Location: RS Yasmin', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: 'AUGUST', day: '05', title: 'Captain Yaskid Grand Festival Event', subtitle: 'Grand competition and trophy awarding for all districts', location: 'Location: RS Yasmin', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      case 'KR':
        return [
          { month: '7월', day: '10', title: '병원 투어 + 종합 아동 건강 스크리닝', subtitle: '그룹 A (PAUD / TK 페르티위 바뉴왕이)', location: '장소: 야스민 병원', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: '7월', day: '15', title: '소아 발달 전문의와 함께하는 명품 부모 세미나', subtitle: '학부모 및 교사를 위한 쌍방향 토론회', location: '장소: 야스민 병원', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: '7월', day: '20', title: '병원 투어 + 이비인후과 전문 아동 정밀 검사', subtitle: '그룹 B (초등학교 1-3학년 바뉴왕이)', location: '장소: 야스민 병원', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: '7월', day: '25', title: '병원 투어 + 아동 맞춤 영양 상태 정밀 분석', subtitle: '그룹 C (초등학교 4-6학년 바뉴왕이)', location: '장소: 야스민 병원', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: '8월', day: '05', title: '캡틴 야스킷 대규모 종합 축제 행사', subtitle: '전 학군 통합 아동 대회 및 우수 가구 상장 수여식', location: '장소: 야스민 병원', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      case 'ZH':
        return [
          { month: '7月', day: '10', title: '医院实景参观之旅 + 核心生理发育健康筛查', subtitle: 'A组（PAUD / 培提威幼儿园 班级代表）', location: '地点：雅斯敏医院', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: '7月', day: '15', title: '首席专家亲授科学健康育儿家教讲坛', subtitle: '面向合作校家长与教职工的面对面沟通座谈会', location: '地点：雅斯敏医院', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: '7月', day: '20', title: '医院实景参观之旅 + 耳鼻喉常规检测服务', subtitle: 'B组（小学一至三年级 Banyuwangi 团队）', location: '地点：雅斯敏医院', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: '7月', day: '25', title: '医院实景参观之旅 + 儿童身体素质与营养膳食分析', subtitle: 'C组（小学四至六年级 Banyuwangi 全区）', location: '地点：雅斯敏医院', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: '8月', day: '05', title: '“雅斯敏好青年”年度盛典选拔及颁奖大典', subtitle: '全县联合趣味体育竞技、才艺大汇演与荣誉奖杯颁发', location: '地点：雅斯敏医院', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      case 'AR':
        return [
          { month: 'يوليو', day: '10', title: 'جولة المستشفى الاستكشافية + فحص طبي شامل للأطفال', subtitle: 'المجموعة أ (روضة بيرتيوي بانيوانجي)', location: 'الموقع: مستشفى ياسمين', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: 'يوليو', day: '15', title: 'ندوات التربية والتغذية الطبية لأولياء الأمور والمعلمين', subtitle: 'حلقة نقاش تفاعلية للأهالي والمعلمين لتعزيز النمو', location: 'الموقع: مستشفى ياسمين', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: 'يوليو', day: '20', title: 'جولة المستشفى الاستكشافية + فحص الأنف والأذن والحنجرة', subtitle: 'المجموعة ب (المرحلة الابتدائية صف ١ - ٣ بانيوانجي)', location: 'الموقع: مستشفى ياسمين', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: 'يوليو', day: '25', title: 'جولة المستشفى الاستكشافية + تحليل التغذية وبنية الجسم', subtitle: 'المجموعة ج (المرحلة الابتدائية صف ٤ - ٦ بانيوانجي)', location: 'الموقع: مستشفى ياسمين', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: 'أغسطس', day: '05', title: 'مهرجان كابتن يسكيد السنوي الكبير وتوزيع الكؤوس', subtitle: 'فعاليات الكرنفال السنوي والمسابقات الترفيهية لجميع المناطق', location: 'الموقع: مستشفى ياسمين', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      default:
        return [
          { month: 'JULI', day: '10', title: 'Hospital Tour + Cek Kesehatan Lengkap', subtitle: 'Asuhan Kelompok A (PAUD / TK Pertiwi Banyuwangi)', location: 'Lokasi: RS Yasmin', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: 'JULI', day: '15', title: 'Parenting Hebat Bersama Dokter Tumbuh Kembang', subtitle: 'Sesi diskusi interaktif bagi perwakilan Orang Tua & Guru', location: 'Lokasi: RS Yasmin', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: 'JULI', day: '20', title: 'Hospital Tour + Deteksi Kesehatan THT', subtitle: 'Rombongan Kelompok B (SD Kelas 1 - 3 Banyuwangi)', location: 'Lokasi: RS Yasmin', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: 'JULI', day: '25', title: 'Hospital Tour + Analisa Nutrisi Tubuh Anak', subtitle: 'Kelompok C (SD Kelas 4 - 6 Banyuwangi Raya)', location: 'Lokasi: RS Yasmin', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: 'AGUSTUS', day: '05', title: 'Gebyar Akbar Festival Kapten Yaskid', subtitle: 'Event akbar perlombaan dan pembagian piala semua se-kabupaten', location: 'Lokasi: RS Yasmin', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
    }
  };

  const getTest = () => {
    return 'test';
  };

  const getFaqsKids = () => {
    switch (lang) {
      case 'EN':
        return [
          {
            q: "What is the difference between GOLD and PLATINUM packages?",
            a: "The main difference is that the PLATINUM package receives an exclusive Captain Yaskid Bag souvenir and our support for school health events. Meanwhile, for other packages, all core benefits remain identical."
          },
          {
            q: "Is the dining cost included in the package rate?",
            a: "No. The cost of the healthy organic group lunch is enjoyed separately (optional add-on). Parents or schools can choose specialized wellness menus provided by our partner garden restaurant."
          },
          {
            q: "Does this program only accept individual participants?",
            a: "No. Registration is very open for both individuals and groups, such as a class entourage, preschool/kindergarten community groups, or primary schools coordinating collectively."
          },
          {
            q: "What if we want to register an entire school at once?",
            a: "Very possible and highly recommended! We provide official inter-institution MOU agreements alongside principals' gatherings for seamless coordination. Please contact our Yasmin Kids Public Relations team."
          },
          {
            q: "Is there a minimum number of registrations?",
            a: "There is no minimum participant requirement. Whether registering a single child or dozens of kids collectively, we facilitate all with prime guidance service."
          },
          {
            q: "Once registration is complete, when does the activity take place?",
            a: "Our dedicated Yasmin Kids team will immediately contact you once the form is verified to match school schedules or any ideal date calendar for the kids."
          },
          {
            q: "Is this program open to all age levels of children?",
            a: "The Yasmin Kids Club recreational educational program is optimized for students spanning from 3 years old up to a maximum of 12 years old."
          }
        ];
      case 'KR':
        return [
          {
            q: "GOLD 패키지와 PLATINUM 패키지의 차이점은 무엇인가요?",
            a: "가장 주된 차이점은 PLATINUM 패키지에 가입할 시 마스코트인 캡틴 야스킷 한정판 귀여운 배낭 책가방을 증정하고 교내 학급 행사를 전담 보건 부스로 지원한다는 점입니다. 기본적인 건강 스크리닝 등의 본 핵심 혜택은 동일합니다."
          },
          {
            q: "식사 비용이 패키지 기본 요금에 포함되어 있나요?",
            a: "아니요, 놀이 교실 및 서킷 후 먹는 친환경 유기농 웰빙 오찬 오찬은 식비 자체 별도(선택 가능한 옵션)입니다. 학부모님이나 회원교에서 제휴 레스토랑이 제공하는 특별 영양 메뉴를 유료 선택해 드실 수 있습니다."
          },
          {
            q: "본 프로그램은 개인 자격으로만 신청할 수 있나요?",
            a: "아니요, 개인 참여 신청은 물론이며, 어린이집 단체 학년, 유치원 놀이방 소모임, 초등학교 단체 학급 단위의 일체 단체 예약도 적극 환영하고 열정적으로 준비하고 있습니다."
          },
          {
            q: "학교 전체를 통째로 신청할 수도 있나요?",
            a: "완전히 가능하며 적극 권장합니다! 저희는 원활하고 신속한 행정 서비스와 학교 보건 수호 의식을 다지기 위해 제휴 회원 단체 MOU 업무협약 및 원장단 간담회를 상시 지원하고 있습니다. 홍보 담당 부서로 부담 없이 문의하세요."
          },
          {
            q: "신청에 제한적인 최소 인원 수가 존재하나요?",
            a: "최소 요건은 존재하지 않습니다. 자녀 한 한 명의 개별 방문 신청부터 수십 명의 회원교 단체 접수까지 모두 공평하고 풍족하도록 정성 다한 전문 의료진 서킷 프로그램을 기획 보장합니다."
          },
          {
            q: "접수를 마친 후 행사 본 일정은 어떻게 조율하며 진행되나요?",
            a: "온라인 신청서 및 기금 검증이 완료된 즉시 소아 전담 행정 매니저가 유선 연락을 취해 학부모 및 위원 교사의 희망 날짜 타임라인에 맞추어 스케줄러를 확정 편성합니다."
          },
          {
            q: "이 가입 프로그램은 어떤 청소년 학생까지 참여 가능한가요?",
            a: "체험형 신체 수호 야스민 키즈 클럽은 취학 전 원생 및 초등학교 전 학년을 아우르는 학령 아동(최소 만 3세부터 최대 만 12세 미만 아동)에게 가장 극적인 영양가와 재미를 제공하도록 설계되어 있습니다."
          }
        ];
      case 'ZH':
        return [
          {
            q: "GOLD 和 PLATINUM 套餐有什么区别？",
            a: "主要区别在于，PLATINUM 套餐包含独家定制的 Kapten Yaskid 小超人双肩背包纪念品，并提供学校健康 activity 支持。其余核心医疗检测及基本福利两者完全一致。"
          },
          {
            q: "餐饮费用是否包含在套餐价格中？",
            a: "不包含。在合作庄园餐厅享用的健康有机团队午餐需单独付费（可选附加项）。家长或学校可自由选择由我们合作餐厅提供的专属膳食营养菜单。"
          },
          {
            q: "此项目仅接受个人报名吗？",
            a: "不是。我们非常欢迎个人以及团体报名，如班级团队、幼儿园/托儿所社区团体或小学集体协调报名。"
          },
          {
            q: "如果我们想一次性为整所学校报名可以吗？",
            a: "完全可以，并且非常推荐！我们提供官方机构间MOU合作协议签署，并提供校长研讨会支持。详情请联系我们的 Yasmin Kids 公共关系团队。"
          },
          {
            q: "是否有最低报名人数限制？",
            a: "没有最低人数限制。无论是单独为一名孩子注册，还是数十名儿童集体报名，我们都提供同等优质的专业医疗导览服务。"
          },
          {
            q: "完成报名后，活动在什么时候进行？",
            a: "在您的报名表和费用核实无误后，我们的 Yasmin Kids 专项团队将立即与您取得联系，以匹配学校日程或适合孩子们的理想日期。"
          },
          {
            q: "该项目对儿童的年龄有什么限制？",
            a: "Yasmin Kids Club 体验式健康教育项目专为3周岁至最大12周岁（青春期前）的儿童和学生设计，能最大程度保证其趣味性与教育意义。"
          }
        ];
      case 'AR':
        return [
          {
            q: "ما الفرق بين الباقتين الذهبية (GOLD) والبلاتينية (PLATINUM)؟",
            a: "الفرق الرئيسي هو أن الباقة البلاتينية تشمل هدية حقيبة ظهر كابتن يسكيد الحصرية ودعم فعاليات الصحة المدرسية. أما الفحوصات والفوائد الأساسية الأخرى فهي متطابقة تماماً في كلتا الباقتين."
          },
          {
            q: "هل تكلفة وجبة الطعام مشمولة في سعر الباقة؟",
            a: "لا. تكلفة وجبة الغداء العضوية الصحية في مطعم جاردن الشريك يتم احتسابها بشكل منفصل (إضافة اختيارية). يمكن لأولياء الأمور أو المدارس اختيار قوائم التغذية المخصصة للأطفال."
          },
          {
            q: "هل يقبل هذا البرنامج التسجيل الفردي فقط؟",
            a: "لا. التسجيل مفتوح ومرحب به للأفراد والمجموعات على حد سواء، مثل المجموعات الصفية، مدارس رياض الأطفال، أو المدارس الابتدائية بالتنسيق الجماعي."
          },
          {
            q: "ماذا لو أردنا تسجيل المدرسة بأكملها دفعة واحدة؟",
            a: "هذا ممكن تماماً وموصى به بشدة! نحن نوفر توقيع مذكرة تفاهم (MOU) رسمية بين المؤسسات وتجمعاً لمديري المدارس لتسهيل تنسيق البرنامج. يرجى الاتصال بفريق العلاقات العامة في ياسمين كيدز."
          },
          {
            q: "هل هناك حد أدنى لعدد المسجلين؟",
            a: "لا يوجد حد أدنى للمشاركين. سواء تم تسجيل طفل واحد أو مجموعة من عشرات الأطفال، فإننا نوفر الخدمة للجميع مع تقديم أفضل رعاية وتوجيه."
          },
          {
            q: "بعد اكتمال التسجيل، متى يتم جدولة الأنشطة؟",
            a: "سيتصل بك فريق ياسمين كيدز المخصص فور التحقق من الاستمارة لتنسيق وتحديد الموعد المناسب لجدول المدرسة أو التاريخ المثالي للأطفال."
          },
          {
            q: "هل هذا البرنامج صالح لجميع الفئات العمرية للأطفال؟",
            a: "تم تصميم برنامج ياسمين كيدز كلوب الترفيهي والتعليمي بشكل مثالي للأطفال من سن 3 سنوات وحتى سن 12 سنة كحد أقصى."
          }
        ];
      default:
        return FAQS_KIDS;
    }
  };

  return (
    <div id="yasmin-kids-page" className="bg-[#FAFDF9] text-left min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-emerald-100/30 to-white py-16 sm:py-24 border-b border-divider/30">
        <div className="absolute top-12 left-10 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-16 right-12 w-32 h-32 bg-yellow-200/10 rounded-full blur-2xl" />

        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="font-display text-xs text-emerald-900 font-extrabold uppercase tracking-widest bg-yellow-300 border-2 border-emerald-900 px-4 py-2 rounded-full inline-flex items-center gap-2 shadow-[2px_2px_0px_#064e3b] rotate-[-1deg]">
                {t.heroBadge || '🧒 YASMIN KIDS CLUB'}
              </span>
              <h1 className="font-display font-black text-3.5xl sm:text-5xl lg:text-5.5xl text-headings leading-tight tracking-tight">
                {t.heroTitle || 'Layanan Premium Edukasi & Kesehatan Untuk Generasi Cerdas!'}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-sans">
                {t.heroDesc || 'Program eksklusif RS Yasmin Banyuwangi dirancang khusus bagi anak usia 3 s/d 12 tahun. Menggabungkan imunisasi emosional, keceriaan playground, dan rekreasi hospital tour anti-takut!'}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#pendaftaran-kids"
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
                >
                  Daftar Sekarang
                </a>
                <a
                  href="https://wa.me/6285259353001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 border-2 border-divider text-gray-700 hover:bg-gray-50 transition-all font-display text-xs font-black uppercase tracking-wider rounded-xl inline-flex items-center gap-2"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-divider aspect-[1.4/1] group bg-emerald-50/60 w-full ml-auto mr-0">
                
                {/* Visual presentation - playful background and character */}
                <div className="absolute inset-0">
                  <SafeImage 
                    src={clubKidsImg} 
                    alt="Yasmin Kids Club" 
                    className="w-full h-full object-fill transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 1.1 ACTIVITIES RECREATION CIRCUIT */}
      <div className="py-20 bg-gradient-to-b from-white to-[#F4F9EC]/40 border-t border-divider/30">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="font-mono text-xs text-emerald-800 font-bold uppercase tracking-widest">{t.scheduleBadge || 'ALUR AKTIVITAS REKREASI'}</span>
            <h2 className="font-display font-black text-3xl sm:text-4.5xl text-headings">
              {t.scheduleTitle || 'Bagaimana Kemeriahan Berlangsung?'}
            </h2>
            <p className="text-gray-550 text-sm">
              {t.scheduleDesc || 'Saksikan jadwal tahapan agenda harian yang asyik bagi anak ketika menempuh sirkuit pelayanan kesehatan kids:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Act 1 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🏥</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">{t.actLabel1 || 'Hospital Tour Ceria'}</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {lang === 'ID' ? '± 60 Menit' : lang === 'KR' ? '± 60분' : lang === 'ZH' ? '± 60分钟' : lang === 'AR' ? '± ٦٠ دقيقة' : '± 60 Mins'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-550 leading-relaxed font-sans text-justify pt-1">
                {t.actDesc1 || 'Anak-anak diajak berkeliling menjelajahi RS Yasmin secara ramah, mengenal perawat ceria, serta membuang ketakutan psikologis terhadap jarum suntik.'}
              </p>
            </div>

            {/* Act 2 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🩺</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">{t.actLabel2 || 'Cek Pemeriksaan Kesehatan'}</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {lang === 'ID' ? '± 30 Menit' : lang === 'KR' ? '± 30분' : lang === 'ZH' ? '± 30分钟' : lang === 'AR' ? '± ٣٠ دقيقة' : '± 30 Mins'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-555 leading-relaxed font-sans text-justify pt-1">
                {t.actDesc2 || 'Penimbangan berat badan seimbang, tinggi badan, lingkar kepala, dan pemantauan organ THT anak oleh jajaran dokter ahli penuh empati.'}
              </p>
            </div>

            {/* Act 3 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">👨‍👩‍👧</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">{t.actLabel3 || 'Parenting Kesehatan Sehat'}</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {lang === 'ID' ? '± 45 Menit' : lang === 'KR' ? '± 45분' : lang === 'ZH' ? '± 45分钟' : lang === 'AR' ? '± ٤٥ دقيقة' : '± 45 Mins'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-555 leading-relaxed font-sans text-justify pt-1">
                {t.actDesc3 || 'Interaksi penyuluhan nutrisi, pencegahan stunting, dan mitigasi kecanduan gawai/gadget bagi para wali murid atau guru pendamping.'}
              </p>
            </div>

            {/* Act 4 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🎮</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">{t.actLabel4 || 'Bermain di Playground'}</h4>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {lang === 'ID' ? 'WAKTU BEBAS' : lang === 'KR' ? '자유 시간' : lang === 'ZH' ? '自由时间' : lang === 'AR' ? 'وقت حر' : 'FREE TIME'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-555 leading-relaxed font-sans text-justify pt-1">
                {t.actDesc4 || 'Anak bebas menikmati petualangan interaktif ramah lingkungan di area playground asri Garden Family Resto mitra resmi RS Yasmin.'}
              </p>
            </div>

            {/* Act 5 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🎉</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">{t.actLabel5 || 'Gebyar Akbar Kapten Yaskid'}</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {lang === 'ID' ? 'FULL DAY' : lang === 'KR' ? '종일 진행' : lang === 'ZH' ? '全天' : lang === 'AR' ? 'طوال اليوم' : 'FULL DAY'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-555 leading-relaxed font-sans text-justify pt-1">
                {t.actDesc5 || 'Acara festival tahunan megah yang menyajikan beragam lomba ketangkasan, pembagian piala, kuis ceria, serta kumpul bareng semua klan member.'}
              </p>
            </div>

            {/* Act 6 */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🍽️</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">{t.actLabel6 || 'Makan Menu Sehat Organik'}</h4>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {lang === 'ID' ? '± 30 Menit' : lang === 'KR' ? '± 30분' : lang === 'ZH' ? '± 30分钟' : lang === 'AR' ? '± ٣٠ دقيقة' : '± 30 Mins'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-555 leading-relaxed font-sans text-justify pt-1">
                {t.actDesc6 || 'Penyajian menu gizi khusus ramah tumbuh kembang anak untuk bersantap bersama wali kelas maupun perintis kelompok (exclude).'}
              </p>
            </div>

          </div>

          {/* Mascot Banner */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-emerald-950 rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-emerald-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-700/30 duration-300 transform translate-y-0 hover:translate-y-[-2px]">
                  <div className="bg-yellow-400 p-2.5 rounded-xl text-headings shrink-0 font-bold text-lg">
                    🦸‍♂️
                  </div>
                  <div className="text-left">
                    <span className="inline-block bg-yellow-400/95 text-headings px-3 py-0.5 font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-md mb-1.5">
                      {t.maskotBadge}
                    </span>
                    <p className="font-display font-black text-sm sm:text-base md:text-lg text-white leading-tight">
                      KAPTEN YASKID
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans mt-0.5 sm:mt-1">
                      {t.maskotDesc}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
{/* 2. TENTANG YASMIN KIDS SECTION */}
      <div className="py-20 bg-white border-b border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center w-full space-y-4 mb-16">
            <span className="font-mono text-xs text-warm-orange font-bold uppercase tracking-widest">{t.aboutBadge}</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-headings">
              {t.aboutTitle}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {t.aboutDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="bg-yellow-50/70 border-3 border-yellow-300 p-6 sm:p-7 rounded-2xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-yellow-300 border-2 border-headings flex items-center justify-center text-xl font-bold font-sans shadow-2xs shrink-0">
                    💰
                  </div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings leading-tight">{t.val1Title}</h4>
                </div>
                <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-sans">
                  {t.val1Desc}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-yellow-800">{t.val1Badge}</span>
            </div>

            {/* Value 2 */}
            <div className="bg-emerald-50/70 border-3 border-emerald-300 p-6 sm:p-7 rounded-2xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-400 border-2 border-headings flex items-center justify-center text-xl font-bold font-sans shadow-2xs text-white shrink-0">
                    📝
                  </div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings leading-tight">{t.val2Title}</h4>
                </div>
                <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-sans">
                  {t.val2Desc}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-900">{t.val2Badge}</span>
            </div>

            {/* Value 3 */}
            <div className="bg-blue-50/70 border-3 border-blue-300 p-6 sm:p-7 rounded-2xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-300 border-2 border-headings flex items-center justify-center text-xl font-bold font-sans shadow-2xs shrink-0">
                    🌟
                  </div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings leading-tight">{t.val3Title}</h4>
                </div>
                <p className="text-sm sm:text-base text-gray-650 leading-relaxed font-sans">
                  {t.val3Desc}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-800">{t.val3Badge}</span>
            </div>

          </div>

        </div>
      </div>

      {/* 2. PACKAGES SECTION */}
      <div id="paket-kids" className="py-16 sm:py-24 border-b-4 border-headings bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 w-full">
            <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-widest bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
              {t.packBadge}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4.5xl text-headings">
              {t.packTitle}
            </h2>
            <p className="text-gray-500 text-sm w-full">
              {t.packDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PLATINUM PACKAGE CARD */}
            <div className="lg:col-span-6 bg-white border-4 border-headings rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#eab308] relative">
              <div className="absolute -top-3.5 left-6 bg-yellow-400 text-headings font-display text-[10px] font-black px-4 py-1.5 rounded-full uppercase border-2 border-headings shadow-2xs">
                {t.recommended}
              </div>
              
              <div className="flex justify-between items-start border-b border-divider pb-4">
                <div>
                  <h3 className="font-display font-black text-2.5xl text-headings">Paket PLATINUM</h3>
                  <p className="text-sm text-gray-400 mt-1">{t.platDesc}</p>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.investment}</span>
                  <span className="block font-display font-black text-3.5xl text-yellow-500">Rp50.000</span>
                  <span className="text-xs text-gray-400">{t.perKid}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4.5">
                <p className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wider">{t.platFeatTitle}</p>
                <div className="grid grid-cols-1 gap-4.5">
                  {getPlatinumItems().map((item) => (
                    <div key={item.no} className="flex items-start space-x-3 text-sm sm:text-base">
                      <div className="w-6 h-6 rounded-full bg-yellow-101 text-yellow-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-yellow-200">
                        {item.no}
                      </div>
                      <div>
                        <strong className="block text-headings font-sans font-bold text-sm sm:text-base leading-tight">{item.facility}</strong>
                        <span className="text-gray-500 text-sm sm:text-base leading-relaxed block mt-1">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* GOLD PACKAGE CARD */}
            <div className="lg:col-span-6 bg-white border-4 border-[#1e1e1e]/40 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#c2dbdf] relative">
              
              <div className="flex justify-between items-start border-b border-divider/60 pb-4">
                <div>
                  <h3 className="font-display font-black text-2.5xl text-[#1e1e1e]/80">Paket GOLD</h3>
                  <p className="text-sm text-gray-450 mt-1">{t.goldDesc}</p>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.investment}</span>
                  <span className="block font-display font-black text-3.5xl text-emerald-600">Rp30.000</span>
                  <span className="text-xs text-gray-400">{t.perKid}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4.5">
                <p className="text-sm sm:text-base font-bold text-gray-400 uppercase tracking-wider">{t.goldFeatTitle}</p>
                <div className="grid grid-cols-1 gap-4.5">
                  {getGoldItems().map((item) => (
                    <div key={item.no} className="flex items-start space-x-3 text-sm sm:text-base">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-101">
                        {item.no}
                      </div>
                      <div>
                        <strong className="block text-gray-700 font-sans font-bold text-sm sm:text-base leading-tight">{item.facility}</strong>
                        <span className="text-gray-550 text-sm sm:text-base leading-relaxed block mt-1">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* 4. COMPARISON MATRIX TABLE */}
          <div className="bg-white border-4 border-headings rounded-3xl overflow-hidden shadow-xs pt-4">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <h4 className="font-display font-black text-lg sm:text-xl md:text-2xl text-headings">{t.matrixTitle}</h4>
              <span className="text-xs font-mono text-gray-400">{t.matrixNote}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 border-b border-divider text-gray-500 font-mono tracking-wider font-bold text-xs sm:text-sm">
                    <th className="p-4 pl-6">{t.colBenefit}</th>
                    <th className="p-4 text-center">GOLD (Rp30K)</th>
                    <th className="p-4 text-center">PLATINUM (Rp50K)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/50 font-sans font-medium text-gray-700 text-sm sm:text-base">
                  {getMatrixRows().map((row, idx) => {
                    const isSelected = selectedRowIndex === idx;
                    const isExclude = row.isExclude;
                    return (
                      <tr 
                        key={idx}
                        onClick={() => setSelectedRowIndex(idx)}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-amber-100/50 font-bold border-l-4 border-yellow-400 shadow-2xs' 
                            : isExclude ? 'bg-amber-50/20' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-4 pl-6 font-display font-bold text-sm sm:text-base text-headings">
                          {row.facility}
                        </td>
                        <td className={`p-4 text-center text-sm sm:text-base ${
                          isExclude 
                            ? 'text-amber-700 text-[11px] font-mono tracking-widest uppercase' 
                            : row.gold === '✅' ? 'text-emerald-600 text-lg' : 'text-red-500'
                        }`}>
                          {row.gold}
                        </td>
                        <td className={`p-4 text-center text-sm sm:text-base ${
                          isExclude 
                            ? 'text-amber-700 text-[11px] font-mono tracking-widest uppercase' 
                            : row.platinum === '✅' ? 'text-emerald-600 text-lg' : 'text-red-500'
                        }`}>
                          {row.platinum}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      
      {/* 5. SYARAT MENJADI PESERTA (TABLE BLOCK) */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="border-b border-divider pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">{t.termsBadge}</span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-headings mt-1">{t.termsTitle}</h3>
            </div>
            <p className="text-[11px] text-gray-500 max-w-sm">
              {t.termsDesc}
            </p>
          </div>

          <div className="border border-divider rounded-2xl overflow-hidden shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 bg-gray-50 text-[10px] font-mono text-gray-500 font-bold tracking-wider uppercase border-b border-divider">
              <div className="p-4 md:col-span-1 text-center">{t.termsNo}</div>
              <div className="p-4 md:col-span-4">{t.termsReq}</div>
              <div className="p-4 md:col-span-7">{t.termsDetail}</div>
            </div>
            <div className="divide-y divide-divider text-sm sm:text-base text-gray-700">
              {getTermsRows().map((row) => (
                <div key={row.no} className="grid grid-cols-1 md:grid-cols-12 items-center">
                  <div className="p-4 md:col-span-1 text-center font-mono font-bold text-sm sm:text-base">{row.no}</div>
                  <div className="p-4 md:col-span-4 font-display font-extrabold text-sm sm:text-base text-headings">{row.title}</div>
                  <div className="p-4 md:col-span-7 text-gray-500 text-sm sm:text-base leading-relaxed text-left">
                    {row.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
{/* 6. KEGIATAN & DETAILED DURATION (LIST) */}
      <div className="py-20 bg-gradient-to-b from-white to-[#F4F9EC]/40 border-t border-divider/30">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="font-mono text-xs text-emerald-800 font-bold uppercase tracking-widest">ALUR AKTIVITAS REKREASI</span>
            <h2 className="font-display font-black text-3xl sm:text-4.5xl text-headings">
              Bagaimana Kemeriahan Berlangsung?
            </h2>
            <p className="text-gray-500 text-sm">
              Saksikan jadwal tahapan agenda harian yang asyik bagi anak ketika menempuh sirkuit pelayanan kesehatan kids:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Act 1 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🏥</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">Hospital Tour Ceria</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">± 60 Menit</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans text-justify pt-1">
                Anak-anak diajak berkeliling menjelajahi RS Yasmin secara ramah, mengenal perawat ceria, serta membuang ketakutan psikologis terhadap jarum suntik.
              </p>
            </div>

            {/* Act 2 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🩺</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">Cek Pemeriksaan Kesehatan</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">± 30 Menit</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans text-justify pt-1">
                Penimbangan berat badan seimbang, tinggi badan, lingkar kepala, dan pemantauan organ THT anak oleh jajaran dokter ahli penuh empati.
              </p>
            </div>

            {/* Act 3 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">👨‍👩‍👧</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">Parenting Kesehatan Sehat</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">± 45 Menit</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans text-justify pt-1">
                Interaksi penyuluhan nutrisi, pencegahan stunting, dan mitigasi kecanduan gawai/gadget bagi para wali murid atau guru pendamping.
              </p>
            </div>

            {/* Act 4 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🎮</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">Bermain di Playground</h4>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">WAKTU BEBAS</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans text-justify pt-1">
                Anak bebas menikmati petualangan interaktif ramah lingkungan di area playground asri Garden Family Resto mitra resmi RS Yasmin.
              </p>
            </div>

            {/* Act 5 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🎉</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">Gebyar Akbar Kapten Yaskid</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">FULL DAY</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans text-justify pt-1">
                Acara festival tahunan megah yang menyajikan beragam lomba ketangkasan, pembagian piala, kuis ceria, serta kumpul bareng semua klan member.
              </p>
            </div>

            {/* Act 6 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-3xl space-y-4 shadow-3xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl shrink-0">🍽️</span>
                  <h4 className="font-display font-black text-sm sm:text-base text-headings mb-0">Makan Menu Sehat Organik</h4>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">± 30 Menit</span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans text-justify pt-1">
                Penyajian menu gizi khusus ramah tumbuh kembang anak untuk bersantap bersama wali kelas maupun perintis kelompok (exclude).
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 7. JADWAL KEGIATAN CALENDAR LIST */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-yellow-600 font-bold uppercase tracking-widest">{t.upcomingBadge || "UPCOMING SESSION SCHEDULE"}</span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">{t.upcomingTitle || "Rencana Jadwal Kegiatan Rombongan Terdekat"}</h3>
          </div>

          <div className="bg-[#FAF9F5] border border-divider rounded-2xl overflow-hidden divide-y divide-divider/65">
            {getSchedules().map((row, index) => (
              <div key={index} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-3.5">
                  <div className={`border-2 p-2 sm:p-2.5 rounded-2xl text-center text-white shrink-0 w-24 h-24 flex flex-col justify-center items-center leading-none shadow-xs ${row.bg} ${row.border}`}>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest block opacity-90 leading-none">{row.month}</span>
                    <span className="text-2xl sm:text-3xl font-display font-black block leading-none mt-1.5 mb-1">{row.day}</span>
                    <span className="text-[9px] font-mono block opacity-85 leading-none">2026</span>
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm sm:text-base text-headings">{row.title}</h4>
                    <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">{row.subtitle}</p>
                  </div>
                </div>
                <span className="bg-[#0B4F4A] text-white font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                  {row.location}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 8. PHOTO GALLERY CAPTURE */}
      <div className="py-20 bg-[#FAF9F5] border-t border-[#EAE6D1]">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-white border border-divider px-3 py-1 rounded-full">
              📸 DOKUMENTASI KEGIATAN KLAN KELUARGA
            </span>
            <h3 className="font-display font-black text-3xl text-headings">Galeri Aktivitas Kapten Yaskid</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            
            {/* Photo 1 */}
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=400" alt="Hospital Tour" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Hospital Tour</p>
            </div>

            {/* Photo 2 */}
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400" alt="Cek Kesehatan" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Cek Kesehatan</p>
            </div>

            {/* Photo 3 */}
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" alt="Playground Area" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Playground Resto</p>
            </div>

            {/* Photo 4 */}
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400" alt="Sesi Parenting" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Sesi Parenting</p>
            </div>

            {/* Photo 5 */}
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" alt="Gebyar Akbar" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Gebyar Yaskid</p>
            </div>

            {/* Photo 6 */}
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=400" alt="Makan Sehat" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Makan Sehat</p>
            </div>

          </div>

        </div>
      </div>

      {/* 9. TESTIMONI ORANG TUA YA KIDS */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-yellow-500 font-bold uppercase tracking-widest">KATA MEREKA YANG TELAH BERGABUNG</span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">Kebahagiaan & Kepuasan Wali Murid</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-yellow-50/40 p-8 rounded-3xl border border-yellow-200 relative">
              <span className="absolute top-4 left-4 text-4xl text-yellow-300 select-none font-bold">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 leading-relaxed italic z-10 relative">
                "Anak saya senang sekali mengikuti Yasmin Kids. Dia jadi tidak takut lagi ke rumah sakit dan lebih paham tentang kesehatan. Harganya juga terjangkau!"
              </p>
              <div className="mt-5 border-t border-yellow-101 pt-3 flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-yellow-300 border border-headings flex items-center justify-center font-bold text-xs">👩</div>
                <div>
                  <strong className="block text-headings font-display font-black text-sm">Ibu Siti</strong>
                  <span className="text-[11px] text-gray-400">Orang Tua Peserta Mandiri</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-200 relative">
              <span className="absolute top-4 left-4 text-4xl text-emerald-300 select-none font-bold">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 leading-relaxed italic z-10 relative">
                "Program ini sangat bermanfaat bagi siswa kami. Anak-anak mendapatkan pemeriksaan kesehatan gratis dan edukasi yang menyenangkan. Kami berharap kerja sama ini terus berlanjut."
              </p>
              <div className="mt-5 border-t border-emerald-101 pt-3 flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-400 border border-headings flex items-center justify-center text-white font-bold text-xs">👨</div>
                <div>
                  <strong className="block text-headings font-display font-black text-sm">Bapak Supriyono</strong>
                  <span className="text-[11px] text-gray-400">Kepala SDN 1 Banyuwangi</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* INTERACTIVE FORM: PENDAFTARAN ONLINE */}
      <div id="pendaftaran-kids" className="py-20 bg-gradient-to-b from-[#F4F9EC]/30 to-white border-t border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="font-mono text-xs text-[#0B4F4A] font-extrabold uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block">
              ONLINE REGISTRATION DESK
            </span>
            <h2 className="font-display font-black text-3xl text-headings">
              Formulir Pendaftaran Member Yasmin Kids
            </h2>
            <p className="text-gray-500 text-sm w-full">
              Silakan isi formulir asuhan anak di bawah ini secara lengkap untuk menerbitkan Kartu Member Kapten Yaskid instan:
            </p>
          </div>

          <div className="bg-white border-4 border-headings rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#10b981] relative overflow-hidden">
            
            {/* Success card output */}
            {registeredCard ? (
              <div id="yaskid-success-card" className="space-y-6 text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-headings">{t.regSuccess}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t.regSuccessSubtitle}</p>
                </div>

                <div className="max-w-md mx-auto bg-gradient-to-tr from-yellow-100 via-amber-50 to-orange-100 border-4 border-headings rounded-2xl p-6 text-left space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-15 select-none font-bold">🦸‍♂️</div>
                  
                  <div className="flex justify-between items-start border-b border-headings/30 pb-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold bg-[#0b4f4a] text-white px-2 py-0.5 rounded uppercase">{t.cardMember}</span>
                      <h4 className="font-display font-black text-sm text-headings mt-1">{t.cardMemberPrefix}</h4>
                    </div>
                    <span className="font-mono text-[9px] font-extrabold text-headings bg-yellow-400 border border-headings px-2 py-0.5 rounded">{registeredCard.paket} {t.cardMemberClass}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="block text-[8px] font-mono text-gray-400 uppercase">{t.cardNo}</span>
                      <strong className="font-mono text-sm tracking-wider text-headings">{registeredCard.id}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-gray-400 uppercase">{t.cardChildName}</span>
                      <span className="font-display font-bold text-gray-800">{registeredCard.namaAnak.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[8px] font-mono text-gray-400 uppercase">{t.cardSchool}</span>
                        <span className="font-sans font-bold text-gray-700 text-[11px] truncate block">{registeredCard.namaSekolah}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono text-gray-400 uppercase">{t.cardWa}</span>
                        <span className="font-mono text-gray-700 text-[11px]">{registeredCard.telepon}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-headings/20 text-center text-[9px] font-mono text-gray-500">
                    {t.cardFooter}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t.printCard}</span>
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold font-display cursor-pointer"
                  >
                    {t.resetForm}
                  </button>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmitReg} className="space-y-5">
                
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-left">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-left">
                  
                  <div className="space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputChildName}</label>
                    <input
                      type="text"
                      name="namaAnak"
                      value={formData.namaAnak}
                      onChange={handleFormChange}
                      placeholder={t.placeholderChildName}
                      required
                      className="w-full p-3 border-2 border-divider rounded-xl outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputSchool}</label>
                    <input
                      type="text"
                      name="namaSekolah"
                      value={formData.namaSekolah}
                      onChange={handleFormChange}
                      placeholder={t.placeholderSchool}
                      required
                      className="w-full p-3 border-2 border-divider rounded-xl outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputBirthPlace}</label>
                    <input
                      type="text"
                      name="tempatLahir"
                      value={formData.tempatLahir}
                      onChange={handleFormChange}
                      placeholder={t.placeholderBirthPlace}
                      className="w-full p-3 border-2 border-divider rounded-xl outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputBirthDate}</label>
                    <input
                      type="date"
                      name="tglLahir"
                      value={formData.tglLahir}
                      onChange={handleFormChange}
                      className="w-full p-3 border-2 border-divider rounded-xl outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputWaNumber}</label>
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleFormChange}
                      placeholder={t.placeholderWa}
                      required
                      className="w-full p-3 border-2 border-divider rounded-xl outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputGender}</label>
                    <select
                      name="jk"
                      value={formData.jk}
                      onChange={handleFormChange}
                      className="w-full p-3 border-2 border-divider rounded-xl bg-white outline-none focus:border-[#10b981]"
                    >
                      <option value="Laki-laki">{t.male}</option>
                      <option value="Perempuan">{t.female}</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 text-xs text-left items-end">
                  
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="block font-bold text-headings uppercase tracking-wider text-[10px]">{t.inputPackage}</label>
                    <select
                      name="paket"
                      value={formData.paket}
                      onChange={handleFormChange}
                      className="w-full p-3 border-2 border-divider rounded-xl bg-white outline-none focus:border-[#10b981]"
                    >
                      <option value="PLATINUM">{lang === 'ID' ? 'Paket PLATINUM (Rp50.000 / Anak)' : lang === 'KR' ? '플래티넘 패키지 (아동당 50,000 루피아)' : lang === 'ZH' ? '铂金套餐 (每位儿童 50,000 印尼盾)' : lang === 'AR' ? 'الباقة البلاتينية (٥٠,٠٠٠ روبية / طفل)' : 'PLATINUM Package (IDR 50,000 / Child)'}</option>
                      <option value="GOLD">{lang === 'ID' ? 'Paket GOLD (Rp30.000 / Anak)' : lang === 'KR' ? '골드 패키지 (아동당 30,000 루피아)' : lang === 'ZH' ? '黄金套餐 (每位儿童 30,000 印尼盾)' : lang === 'AR' ? 'الباقة الذهبية (٣٠,٠٠٠ روبية / طفل)' : 'GOLD Package (IDR 30,000 / Child)'}</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full p-3 bg-headings hover:bg-[#10b981] text-white font-display text-sm font-black rounded-xl border-2 border-headings shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      {loading ? (lang === 'ID' ? 'Memproses...' : lang === 'KR' ? '처리 중...' : lang === 'ZH' ? '正在处理...' : lang === 'AR' ? 'جاري المعالجة...' : 'Processing...') : (lang === 'ID' ? 'Kirim Pendaftaran 🚀' : lang === 'KR' ? '신청서 제출 🚀' : lang === 'ZH' ? '提交在线报名 🚀' : lang === 'AR' ? 'إرسال طلب التسجيل 🚀' : 'Submit Registration 🚀')}
                    </button>
                  </div>

                </div>

              </form>
            )}

          </div>

        </div>
      </div>

      {/* 10. FAQ SYSTEM */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-slate-500 font-bold uppercase tracking-widest">
              {lang === 'ID' ? 'ANY QUESTIONS? WE ANSWERED THEM' : lang === 'KR' ? '자주 묻는 질문에 답변해 드립니다' : lang === 'ZH' ? '常见疑问•专业官方解答' : lang === 'AR' ? 'أي أسئلة؟ نحن نجيب عليها' : 'ANY QUESTIONS? WE ANSWERED THEM'}
            </span>
            <h3 className="font-display font-black text-2.5xl sm:text-3xl text-headings">
              {lang === 'ID' ? 'Tanya Jawab Seputar Yasmin Kids Club' : lang === 'KR' ? '야스민 키즈 클럽 자주 묻는 질문' : lang === 'ZH' ? '雅斯敏儿童俱乐部常见疑问解答' : lang === 'AR' ? 'أسئلة وأجوبة حول نادي ياسمين للأطفال' : 'Yasmin Kids Club FAQs'}
            </h3>
          </div>

          <div className="space-y-4">
            {getFaqsKids().map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="border-2 border-divider/60 rounded-2xl overflow-hidden bg-[#FAF9F5]/40 transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 font-display font-bold text-[13px] text-headings hover:text-deep-teal transition-colors flex justify-between items-center bg-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs opacity-60">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-5 border-t border-divider/40 font-sans text-xs text-gray-500 leading-relaxed bg-[#FAF9F5]/20 animate-fade-in-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 11. DYNAMIC CTA CALL TO ACTIONS */}
      <div className="bg-[#0B4F4A] py-16 text-center relative overflow-hidden border-t-4 border-yellow-400">
        <div className="absolute top-[-10px] left-[-30px] text-9xl opacity-5 select-none font-bold text-white">🦸‍♂️</div>
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h3 className="font-display font-black text-3xl sm:text-4.5xl text-yellow-300">
            Ayo Bawa Generasi Anak Banyuwangi Lebih Sehat!
          </h3>
          <p className="text-white/80 font-sans text-sm sm:text-base w-full leading-relaxed">
            Pendaftaran kolektif sekolah sekolah mendapatkan pendampingan khusus serta MOU resmi jaminan kesehatan anak didik. Hubungi tim humas RS Yasmin segera.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-3">
            <a
              href="https://wa.me/6285259353001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-headings font-display text-xs font-black uppercase tracking-wider rounded-xl border-2 border-headings shadow-sm transition-all"
            >
              Hubungi Tim Yasmin Kids
            </a>
            <a
              href="#pendaftaran-kids"
              className="px-6 py-3.5 border-2 border-white text-white hover:bg-white hover:text-headings transition-all font-display text-xs font-black uppercase tracking-wider rounded-xl"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
