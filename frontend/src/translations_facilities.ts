// Multi-language translations for Facilities and Slides in RSU Yasmin Banyuwangi
// Supports: ID, EN, KR, ZH, AR

export const LOCALIZED_FACILITIES: Record<string, Record<string, {
  name: string;
  desc: string;
  badge: string;
  highlights: string[];
  features: string[];
}>> = {
  ID: {
    'rawat-jalan': {
      name: 'Poliklinik Rawat Jalan Spesialis',
      desc: 'Pelayanan konsultasi dan pemeriksaan rawat jalan dengan pilihan dokter spesialis yang lengkap serta suasana poliklinik yang asri, nyaman, dan sejuk.',
      highlights: ['30+ Bidang Spesialis & Subspesialis', 'Sistem Rekam Medis Elektronik Terintegrasi', 'Ruang Tunggu Hijau Semi-terbuka'],
      features: ['Akses Pendaftaran Online Praktis Via WhatsApp', 'Farmasi Satelit Rawat Jalan Khusus', 'Pemeriksaan Diagnostik Langsung di Poliklinik', 'Bebas Antrean Berdesakan Sesuai Jam Janji Temu'],
      badge: 'Layanan Terpadu'
    },
    'rehabilitasi-medik': {
      name: 'Rehabilitasi Medik & Fisioterapi',
      desc: 'Pelayanan pemulihan dan terapi fisik untuk mengoptimalkan kemampuan fungsi motorik serta aktivitas pergerakan harian yang terkendala akibat stroke, cedera olahraga, cedera otot, maupun gangguan saraf.',
      highlights: ['Tim Fisioterapis Bersertifikasi Ahli KFR', 'Gym Medis & Latihan Motorik Lengkap', 'Stasis Terapi Elektro & Gelombang Ultrasonik'],
      features: ['Terapi Infrared & Akupunktur Medik Terprogram', 'Fisioterapi Kasus Pediatrik (Anak) & Dewasa', 'Fasilitas Evaluasi Sendi & Otot Komprehensif', 'Latihan Stimulasi Saraf Pasca Stroke Terkontrol'],
      badge: 'Pemulihan Gerak'
    },
    'skincare': {
      name: 'Yasmin Skincare & Aesthetic Center',
      desc: 'Pusat perawatan kulit wajah estetika dan terapi kecantikan medis terpercaya di Banyuwangi, di bawah pengawasan langsung tim dokter spesialis kulit dengan produk formulasi klinis aman.',
      highlights: ['Konsultasi Spesialis Kulit & Kelamin', 'Terapi Laser Nd:YAG Premium', 'Skin Booster & Facial Treatment Custom'],
      features: ['Perawatan Peremajaan Kulit (Anti-Aging Therapy)', 'Tindakan Eksisi Sederhana Kasus Kulit', 'Peeling Kimiawi & Mikrodermabrasi Medis', 'Formula Skincare Resep Dokter Sangat Aman & Teruji'],
      badge: 'Estetika Profesional'
    },
    'laboratorium': {
      name: 'Laboratorium Klinik Modern 24 Jam',
      desc: 'Unit pengujian diagnostik cairan tubuh dengan keandalan akurasi tinggi, melayani pengujian darah, urine, imunologi, hingga penanda tumor secara berkesinambungan 24 jam penuh.',
      highlights: ['Alat Analyzer Otomatis Presisi Tinggi', 'Hasil Tes Cepat Kurang dari 45 Menit', 'Melayani Pemeriksaan Skrining Rujukan BPJS'],
      features: ['Pemeriksaan Profil Lipid & Fungsi Hati Pasien', 'Pengukuran Gula Darah & HbA1c Akurat', 'Tersedia Layanan Swab PCR & Rapid Test 24 Jam', 'Pemeriksaan Urinalisis & Elektrolit Darah Lengkap'],
      badge: 'Akurasi Tinggi'
    },
    'instalasi-farmasi-24-jam': {
      name: 'Instalasi Farmasi Lengkap 24 Jam',
      desc: 'Pelayanan penyiapan, penyediaan obat-obatan, dan layanan resep dokter berkualitas tinggi berlisensi resmi BPOM yang standby non-stop 24 jam untuk melayani seluruh pasien rawat inap, rawat jalan, serta obat bebas.',
      highlights: ['Obat Lengkap & Terjamin Mutu', 'Konseling Edukasi Obat Oleh Apoteker', 'Standby 24 Jam Non-stop'],
      features: ['Penyerahan Resep Cepat Sesuai SOP Pelayanan', 'Sistem Paging Resep Elektronik', 'Layanan Drive-Thru Pengambilan Obat', 'Sediaan Obat Generik & Paten Sangat Lengkap'],
      badge: 'Siaga 24 Jam'
    },
    'instalasi-gawat-darurat-igd-24-jam': {
      name: 'Instalasi Gawat Darurat & Ambulans 24 Jam',
      desc: 'Pusat penanganan keadaan gawat darurat medis darurat, trauma, kecelakaan lalu lintas, cedera akut, patologi jantung, hingga kegawatan pediatrik secara responsif 24 jam.',
      highlights: ['Triage Mandiri Responsif 3 Menit', 'Dokter Jaga Standby 24 Jam', 'Akses Langsung ke Farmasi & Radiologi'],
      features: ['Alat Penunjang Resusitasi Lengkap', 'Stok Tabung Oksigen & Ventilator Portabel', 'Armada Ambulans Siaga Persis Depan IGD', 'Dokter Jaga Berlisensi ACLS/ATLS'],
      badge: 'Gawat Darurat'
    },
    'rawat-inap': {
      name: 'Fasilitas Rawat Inap & Suite VIP/VVIP',
      desc: 'Kamar perawatan tenang bergaya resort demi memulihkan kenyamanan serta ketenangan keluarga pasien dengan asuhan gizi seimbang serta perawat yang responsif.',
      highlights: ['Full AC & Air Purifier', 'Sofa Bed Keluarga Luas', 'Smart TV LED & Wi-Fi'],
      features: ['Keamanan & Privasi Maksimal', 'Layanan Perawat Siaga 24 Jam Dedikatif', 'Smart TV 55 Inch dengan Layanan Premium', 'Parkir Khusus Bebas Biaya'],
      badge: 'Rawat Inap Nyaman'
    },
    'icu': {
      name: 'Intensive Care Unit (ICU) & HCU',
      desc: 'Layanan terapi intensif untuk pemantauan tanda-tanda vital pasien kritis yang membutuhkan intervensi medis terus-menerus oleh dokter spesialis anestesi.',
      highlights: ['Bedside Monitor Real-time', 'Sistem Filter Udara Steril HEPA', 'Akses Dokter Spesialis Terpadu'],
      features: ['Ventilator Mekanis Mutakhir', 'Pompa Infus & Syringe Pump Otomatis', 'Rasio Perawat terhadap Pasien 1:1 / 1:2', 'Sistem Alarm Darurat Tersinkronisasi'],
      badge: 'Perawatan Kritis'
    },
    'radiologi': {
      name: 'Instalasi Radiologi & CT-Scan',
      desc: 'Pusat diagnosis pencitraan struktur organ dalam menggunakan teknologi sinar-X dosis rendah, ultrasonografi 4 dimensi, serta pemindaian resolusi tinggi.',
      highlights: ['Alat Rontgen Digital Rendah Radiasi', 'USG 4D Live Kebidanan & Organ Dalam', 'CT-Scan Multi-Slice Terkini'],
      features: ['Pencitraan Resolusi Tinggi Sangat Tajam', 'Hasil Film Dikirim Langsung ke Smartphone', 'Layanan Radiologi Siaga Kasus IGD Darurat', 'Interpretasi Dokter Spesialis Radiologi'],
      badge: 'Radiologi & CT-Scan'
    },
    'kamar-operasi': {
      name: 'Kamar Operasi Aliran Udara Steril HEPA',
      desc: 'Fasilitas ruang bedah steril yang memenuhi standar sirkulasi udara bersih dewan kesehatan dunia, dilengkapi filter aliran udara laminair serta mesin anestesi bersertifikat kalibrasi tinggi.',
      highlights: ['Teknologi Aliran Udara Steril HEPA Filter', 'Lampu Operasi LED Intensitas Tinggi Presisi', 'Tim Bedah Spesialis Siaga 24 Jam'],
      features: ['Pencitraan Monitor Live Kamera Bedah', 'Peralatan Bedah Mikro & Laparoskopi Mutakhir', 'Sistem Kontrol Suhu & Kebisingan Optimal', 'Ruang Pemulihan (Recovery Room) Pasca-Anestesi'],
      badge: 'Kamar Operasi'
    },
    'perinatologi-kamar-bersalin': {
      name: 'Perinatologi & Kamar Bersalin (VK Maternity)',
      desc: 'Akomodasi persalinan aman berpusat pada kegembiraan Ibu & Bayi, didampingi konselor laktasi, persalinan normal maupun tatalaksana komplikasi kebidanan.',
      highlights: ['Ranjang Melahirkan Ergonomis Nyaman', 'Ruang Inisiasi Menyusu Dini (IMD) Privat', 'Perawat & Bidan Ahli Siaga Standby'],
      features: ['Sistem Pemantauan Detak Jantung Janin Kontinu', 'Peralatan Resusitasi Bayi Baru Lahir Terintegrasi', 'Pelayanan IMD Lancar Didampingi Konselor Laktasi', 'Suasana Ruangan Sejuk & Mengurangi Kecemasan Ibu'],
      badge: 'Kamar Bersalin'
    }
  },
  EN: {
    'rawat-jalan': {
      name: 'Specialist Outpatient Clinic',
      desc: 'Comprehensive outpatient consultation and examination services with a complete roster of specialist doctors in a serene, comfortable, and cool clinic ambiance.',
      highlights: ['30+ Specialty & Subspecialty Fields', 'Integrated Electronic Medical Record System', 'Semi-open Green Waiting Area'],
      features: ['Easy Online Registration via WhatsApp', 'Special Outpatient Satellite Pharmacy', 'Direct Diagnostic Examinations in Clinic', 'Zero Crowding Queue Match by Appointment Time'],
      badge: 'Integrated Services'
    },
    'rehabilitasi-medik': {
      name: 'Medical Rehabilitation & Physiotherapy',
      desc: 'Physical recovery and therapy services to optimize motor functions and daily movement restricted by stroke, sports injuries, muscle injuries, or neurological disorders.',
      highlights: ['KFR Certified Specialist Physiotherapists', 'Fully-equipped Medical Gym & Motor Skills Training', 'Electrotherapy & Ultrasonic Wave Therapy'],
      features: ['Programmed Infrared & Medical Acupuncture', 'Pediatric (Children) & Adult Physiotherapy', 'Comprehensive Joint & Muscle Evaluation', 'Controlled Post-Stroke Nerve Stimulation Exercises'],
      badge: 'Movement Recovery'
    },
    'skincare': {
      name: 'Yasmin Skincare & Aesthetic Center',
      desc: 'The premier facial aesthetic care and professional medical beauty center in Banyuwangi, under the direct supervision of specialist dermatologists with certified safe clinical products.',
      highlights: ['Dermatologist & Venereologist Consultation', 'Premium Nd:YAG Laser Therapy', 'Custom Skin Booster & Facial Treatment'],
      features: ['Rejuvenation Care (Anti-Aging Therapy)', 'Simple Excision for Skin Cases', 'Chemical Peeling & Medical Microdermabrasion', 'Doctor Prescribed Safe Skincare Formulas'],
      badge: 'Professional Aesthetics'
    },
    'laboratorium': {
      name: 'Modern Clinical Laboratory 24 Hours',
      desc: 'Diagnostic testing unit for bodily fluids with high accuracy, processing blood, urine, immunology, and tumor markers around the clock.',
      highlights: ['High-Precision Automated Analyzers', 'Fast Test Results in Under 45 Minutes', 'BPJS Referral Screening Examinations'],
      features: ['Lipid Profile & Liver Function Tests', 'Accurate Blood Glucose & HbA1c Measurements', '24-Hour PCR Swab & Rapid Testing Available', 'Complete Urinalysis & Blood Electrolyte Tests'],
      badge: 'High Accuracy'
    },
    'instalasi-farmasi-24-jam': {
      name: 'Complete Pharmacy Department 24 Hours',
      desc: '24-hour non-stop preparation and distribution of high-quality, BPOM certified medicines serving all inpatients, outpatients, and over-the-counter purchases.',
      highlights: ['Complete & Quality Guaranteed Medicine', 'Pharmacist Consultation & Counseling', '24-Hour Non-stop Availability'],
      features: ['Rapid Prescription Delivery SOP', 'Electronic Prescription Paging System', 'Drive-Thru Prescription Pickup Counter', 'Extensive Range of Generic & Branded Medicines'],
      badge: '24-Hour Alert'
    },
    'instalasi-gawat-darurat-igd-24-jam': {
      name: '24-Hour Emergency Department & Ambulance',
      desc: 'Responsive 24-hour center handling medical emergencies, trauma, accidents, acute injuries, cardiac pathology, and pediatric emergencies.',
      highlights: ['3-Minute Responsive Self-Triage', '24/7 On-duty Doctors', 'Direct Access to Pharmacy & Radiology'],
      features: ['Fully-equipped Resuscitation Equipment', 'Oxygen Tanks & Portable Ventilator Units', 'Ambulance Fleet Parked Right at ER Entrance', 'ACLS/ATLS Licensed Emergency Physicians'],
      badge: 'Emergency'
    },
    'rawat-inap': {
      name: 'Inpatient Facilities & VIP/VVIP Suites',
      desc: 'Resort-style peaceful recovery rooms with responsive nursing and balanced nutrition plans, ranging from Suites, VVIP, and VIP to standard wards.',
      highlights: ['Full AC & Air Purifiers', 'Spacious Family Sofa Beds', 'Smart LED TV & High-Speed Wi-Fi'],
      features: ['Maximum Security & Privacy', 'Dedicated 24-Hour On-call Nursing', '55" Smart TV with Premium Services', 'Complimentary VIP Parking Slot'],
      badge: 'Comfortable Recovery'
    },
    'icu': {
      name: 'Intensive Care Unit (ICU) & HCU',
      desc: 'Intensive therapy services for continuous monitoring of critical patient vital signs under the command of specialist anesthesiologists.',
      highlights: ['Real-time Bedside Monitors', 'Laminar HEPA Filter Sterile Air System', 'Integrated Specialist Doctor Care'],
      features: ['Advanced Mechanical Ventilators', 'Automated Infusion & Syringe Pumps', 'Nurse-to-Patient Ratio 1:1 or 1:2', 'Synchronized Emergency Alarm System'],
      badge: 'Critical Care'
    },
    'radiologi': {
      name: 'Radiology & CT-Scan Department',
      desc: 'Diagnostic imaging center for internal organ structures utilizing low-dose X-rays, 4D ultrasound, and high-resolution multi-slice CT scanning.',
      highlights: ['Low Radiation Digital X-Ray Machine', 'Live 4D Ultrasound for Obgyn & Organs', 'Latest Multi-Slice CT-Scan technology'],
      features: ['Ultra-sharp High-Resolution Imaging', 'Results Sent Directly to Smartphone', 'Emergency Radiology Support for ER Cases', 'Radiology Specialist Doctor Interpretations'],
      badge: 'Radiology & CT-Scan'
    },
    'kamar-operasi': {
      name: 'Laminar Sterile HEPA Air Operating Room',
      desc: 'Sterile surgical rooms complying with WHO air sirculation standards, equipped with HEPA laminar airflow and highly calibrated anesthesia machines.',
      highlights: ['HEPA Filter Laminar Flow Sterility', 'High-Intensity Precision LED Operating Lights', '24-Hour Specialist Surgical Team on Call'],
      features: ['Live Surgery Camera Feed Display', 'Advanced Microsurgery & Laparoscopy Tools', 'Optimal Noise & Temperature Control', 'Post-Anesthesia Dedicated Recovery Room'],
      badge: 'Operating Room'
    },
    'perinatologi-kamar-bersalin': {
      name: 'Perinatology & Maternity VK Delivery Room',
      desc: 'Safe delivery rooms centered on mother & infant joy, supported by lactation counselors, normal deliveries, and obgyn complications.',
      highlights: ['Ergonomic & Comfortable Delivery Beds', 'Private Early Breastfeeding Initiation Room', 'Expert Nurses & Midwives 24h On-duty'],
      features: ['Continuous Fetal Heart Rate Monitoring', 'Integrated Newborn Resuscitation Equipment', 'Breastfeeding Support by Lactation Specialists', 'Cool Room Ambiance Reducing Maternity Anxiety'],
      badge: 'Delivery Room'
    }
  },
  KR: {
    'rawat-jalan': {
      name: '외래 전문진료 센터',
      desc: '쾌적하고 조용하며 아늑한 검사실에서 풍부한 임상경험을 축적한 최고의 전문의들로부터 외래 진료 및 상담을 원스톱으로 받으실 수 있습니다.',
      highlights: ['30개 이상의 전문 및 세부 전공 과목', '정보기술(IT) 기반 통합 전자의무기록(EMR)', '중정 형태의 녹색 반개방 대기 정원'],
      features: ['왓츠앱 기반 간편 모바일 예약 서비스', '외래 환자 전용 고속 원스톱 조제 약국', '진료실 연계 즉각적인 검사 검진', '예약 시간 매칭으로 불필요한 현장 대기 제로'],
      badge: '통합 의료 서비스'
    },
    'rehabilitasi-medik': {
      name: '재활 의학 및 물리 치료',
      desc: '뇌졸중, 운동 부상, 근육 및 관절 통증, 신경계 계통 마비 환자를 위해 고안된 원스톱 전문 도수 재활 및 기기 치유 지원.',
      highlights: ['보건부 공인 재활 전문 물리치료팀', '메디컬 피트니스 및 복합 전신 재활 장비', '전기 자극 및 고주파 초음파 기기 완비'],
      features: ['주기적 적외선 및 의료 침구 치유 코스', '소아 재활 및 성인 전담 재활 클리닉', '자세 분석 및 관절 가동 정밀 진단', '뇌혈관 질환 특화 신경 반응 강화 유도'],
      badge: '관절 및 신경 재활'
    },
    'skincare': {
      name: '야스민 메디컬 스킨케어 에스테틱 센터',
      desc: '바뉴왕이 지역 최고 공신력의 피부 에스테틱 센터로, 피부과 전문의 처방과 저자극 천연 포뮬러 처방으로 투명하고 건강한 피부를 선사합니다.',
      highlights: ['피부과 전문의의 과학적 1:1 맞춤 진단', '최신 고성능 Nd:YAG 레이저 클리닉', '스킨 부스터 및 항산화 페이셜 테라피'],
      features: ['주름 개선 및 노화 방지 탄력 솔루션', '피부 병변 및 트러블 무통 제거 요법', '의료용 필링 및 미세 각질 다이아몬드 스케일링', '부작용 걱정 없는 철저한 안심 피부 처방'],
      badge: '전문 피부 에스테틱'
    },
    'laboratorium': {
      name: '24시간 임상 검사 진단 연구소',
      desc: '초정밀 분석 장비를 사용해 혈액, 소변, 면역계 검사 및 암 표지자 등 정밀 분석을 실시하여 신속히 결과를 전송합니다.',
      highlights: ['전산 자동 판독 임상 초정밀 검사장비', '접수 후 45분 이내 신속 결과 출력', '국가 건강보험 지정 종합 검진'],
      features: ['지질 분석 및 만성 질환 필수 기능 검사', '당뇨병 정밀 분석 및 당화혈색소 추적', '24시간 상시 신속 코로나 검사 및 독감 항원 판독', '종합 요분석 및 전해질 분석 정밀 검사'],
      badge: '최고 정밀도'
    },
    'instalasi-farmasi-24-jam': {
      name: '24시간 안심 처방 종합 약국',
      desc: '정부 식약처(BPOM) 공인을 통과한 오리지널 정품 약품만을 입고 및 엄수하여 처방하며, 전문 약사의 처방 상담을 받으실 수 있습니다.',
      highlights: ['안심 정품 약품 상시 100% 확보', '전문 면허 약사의 투약 처방 대화 상담', '365일 24시간 연중무휴 상시 운영'],
      features: ['신속 대기 처방전 전달 시스템 준수', '처방 조제 알림 전자 페이징 기술', '차량 탑승 처방 수령 안심 드라이브스루', '다양한 제네릭 및 특화 오리지널 처방약 보유'],
      badge: '24시간 상시 조제'
    },
    'instalasi-gawat-darurat-igd-24-jam': {
      name: '24시간 응급상황실 및 긴급 구조 구급대',
      desc: '급성 뇌혈관 질환, 심장 마비, 교통사고 중증 다발성 손상 등 중증 환자의 안전 확보를 위해 골든타임 이내 긴급 전문 응급 처치.',
      highlights: ['3분 이내 응급 신속 중증도 분류(Triage)', '응급의학과 전담의 24시간 현장 대기', '응급실 내 전용 초음파 및 혈액분석기 구비'],
      features: ['최첨단 소생 장비 완비', '고압 산소 공급기 및 포터블 인공호흡기', 'IGD 입구 전면 구급 전용 특수 차량 배치', '심폐소생 등 ACLS/ATLS 자격 보유진 구성'],
      badge: '24시간 응급 구호'
    },
    'rawat-inap': {
      name: '호텔급 최고급 VIP/VVIP 입원 병실',
      desc: '창밖으로 시원한 정원이 내다보이는 친자연 조경 입원 병동으로, 전담 간호사의 따뜻한 케어와 일류 영양식 식단을 제공합니다.',
      highlights: ['친환경 환기 시스템 및 HEPA 헤파 필터 공기 청정', '보호자용 최고급 럭셔리 라운지형 소파베드', '스마트 LED TV 및 기가 무료 무선인터넷'],
      features: ['보안 및 최고급 전용 프라이버시 출입 관리', '24시간 간병 전담 상주 간호 요원 배치', '55인치 최고급 벽걸이 스마트 TV 미디어 서비스', 'VIP 고객 전용 야외 프리 파킹 예약 공간'],
      badge: '안락한 휴양 치유'
    },
    'icu': {
      name: 'ICU 집중치료실 및 중환자실',
      desc: '의식 불명 및 다발성 장기 부전 등 활력 징후 수치가 매우 불안정한 환자를 집중적으로 안전 보장하기 위해 전담 감시.',
      highlights: ['실시간 종합 컴퓨터 침상 원격 모니터링', '외래 오염 100% 차단 무균 HEPA 환기 시스템', '전담 마취과 전문의 협진 조율 체계'],
      features: ['최신 기계식 인공호흡기 배치', '정밀 자동 약물 주ip 펌프 다수 정착', '간호사 대 환자 비율 1:1 또는 1:2의 안전 케어', '이상 수치 발생 시 원격 알림 경보 스마트 제어'],
      badge: '집중 환자 케어'
    },
    'radiologi': {
      name: '영상의학과 및 초고해상도 CT 센터',
      desc: '체내 골절 상태 및 종양 유무 등을 선명하게 관찰할 수 있도록 최첨단 방사선 장비로 진단 및 검사합니다.',
      highlights: ['초저선량 방사선 노출 방지 디지털 X-Ray', '복부 및 자궁 태아 정밀 Live 4D 입체 초음파', '최신 multi-slice 다중 채널 고해상도 CT 장비'],
      features: ['판독 정밀도를 배가한 고화질 렌더링 디지털 이미지', '촬영 결과를 스마트폰으로 실시간 즉시 전송', '응급실 환자를 위한 24시간 연동 대기 가동', '대학병원 경력 영상의학과 전문의 정밀 판독'],
      badge: '정확한 영상 진단'
    },
    'kamar-operasi': {
      name: '3중 무균 청정 음압 수술센터 (HEPA 필터)',
      desc: '공기 감염을 원천 차단하는 초정밀 헤파 필터 수술실로, 수술 시 부작용 및 감염 위험을 줄였습니다.',
      highlights: ['HEPA 헤파 필터 층류 무균 환기 시스템', '수술 부위 그늘을 없앤 최신 고휘도 LED 무영등', '수술실 전담 전문의 및 마취과 전문팀 24시간 대기'],
      features: ['실시간 수술 카메라 비디오 원격 모니터링', '정밀 미세 수술을 돕는 첨단 복강경 장비 구비', '항온항습 제어 컴퓨터 자동 제어', '수술 후 마취 회복 전용 모니터룸 별도 배치'],
      badge: '청정 안심 수술실'
    },
    'perinatologi-kamar-bersalin': {
      name: '분만 센터 및 산부인과 (VK Maternity)',
      desc: '태아의 첫 울음소리가 안전하고 행복하게 울려 퍼질 수 있도록 숙련된 분만 전문 간호사팀과 모아 동실 지원.',
      highlights: ['인체공학적 조절이 가능한 가족 분만용 전용 침상', '모아 조기 애착 형성을 위한 IMD 모아 일체형 모유 수유', '산부인과 전문의 및 조산사 전용 당직 근무 상주'],
      features: ['실시간 아기 심박동 디지털 연속 측정 모니터링', '신생아 긴급 호흡 곤란 대처 일체형 산소 소생 기기', '전문 모유 수유 교육 이수 전문 수유사의 마사지 지원', '태아 및 산모의 정서 안정을 돕는 포근한 핑크빛 조명'],
      badge: '모아 행복 분만'
    }
  },
  ZH: {
    'rawat-jalan': {
      name: '专家门诊诊疗中心',
      desc: '在宁静、舒适且凉爽的门诊大厅，由极具临床经验的资深专科和亚专科专家，提供高水平、细致的一站式医疗咨询和健康诊断。',
      highlights: ['30+个资深专家及副高级主治科目', '全流程无纸化电子病历 (EMR) 追踪', '绿意盎然的半开放式生态候诊中庭'],
      features: ['支持 WhatsApp 在线挂号，无需线下拥挤', '设立外来患者一站式专配卫星药房', '门诊内部设有多项即时化验与超声筛查', '根据预订时段精准就诊，保障就医尊严'],
      badge: '专家联合诊疗'
    },
    'rehabilitasi-medik': {
      name: '物理康复理疗与康复中心',
      desc: '针对脑卒中、运动损伤、骨折恢复期以及关节和周围神经功能受限的患者，提供由资深理疗师定制的精准运动功能与关节物理疗法。',
      highlights: ['国家卫健委注册资深专科康复治疗师团队', '顶级专业运动康复健身器材和负重训练器', '全面引入红外偏振光与立体电疗刺激系统'],
      features: ['定制化物理治疗仪深层红外透热课程', '针对小儿神经发育迟缓与成人的精细复健', '全面的骨骼肌肌力和日常生活动作评测', '卒中后特异性周围神经调控和偏瘫步态纠正'],
      badge: '重塑运动机能'
    },
    'skincare': {
      name: '雅斯敏皮肤医学美容中心',
      desc: '巴纽旺伊首个兼具皮肤疾病诊疗与高端科技美肤的标杆机构。在三甲级皮肤科专家的直属监管下，甄选临床医学护肤产品，确保治疗安全、透明。',
      highlights: ['皮肤科权威医生一对一精细化面诊', '国际金标准 Q开关 Nd:YAG 祛斑抗衰激光', '美白补水美肤及个性化水光针导入'],
      features: ['面部年轻化综合抗衰方案（非手术面部拉皮）', '多发性皮赘、良性肿物高频无痛电刀祛除', '医用果酸焕肤与微晶磨皮控油收缩毛孔', '医生开具的温和、高活性安全护肤品配方'],
      badge: '皮肤医学美肤'
    },
    'laboratorium': {
      name: '24小时现代化临床生化检验科',
      desc: '装备先进的高通量全自动化学发光及血常规分析仪，为临床生化、体液分析、肿瘤标志物筛查提供精确、及时的报告。',
      highlights: ['原装进口全自动生化分析仪和质控系统', '大部分常规化验可在 45 分钟内快速出单', '定点配合印尼国家医保 BPJS 筛查化验服务'],
      features: ['高血脂和肝肾功能全套精密筛查', '全天候糖尿病风险评估和 HbA1c（糖化血红蛋白）检测', '提供 24 小时 PCR 核酸快速检测及甲乙流筛查', '完整的尿液常规分析和电解质、酸碱平衡分析'],
      badge: '检验精度极高'
    },
    'instalasi-farmasi-24-jam': {
      name: '24小时药剂科与全配药房',
      desc: '经国家药监局 (BPOM) 严苛准入的原装正品中西药配方中心，常备数千种专科西药、靶向药及急救药品。专职临床药师提供一对一用药交代。',
      highlights: ['原装高品质药品常备率达到 100%', '临床执业药师提供耐心的处方安全交代', '365天、全天候24小时不间断服务'],
      features: ['严格执行国际三查七对极速发药安全流程', '采用电子叫号及用药处方通知系统', '专设便捷汽车/摩托车不用下车“即取”通道', '提供全面的基础仿制药与高端原研特效西药'],
      badge: '24小时全候药房'
    },
    'instalasi-gawat-darurat-igd-24-jam': {
      name: '24小时急诊医学部与院前急救车',
      desc: '针对重症脑卒中、急性心肌梗死、严重多发性车祸外伤、急性中毒等危重症，开通绿色黄金救治通道，实行多学科联合极速救援。',
      highlights: ['3分钟内启动自适应病情严重度分诊（Triage）', '资深急诊科医生及生命支持护士全天守候', '急诊内部专设重症复苏床和即时生化床旁化验'],
      features: ['配备全套多功能高级心脏除颤起搏仪', '配备车载移动式气动呼吸机和连续无损监测仪', '急救车队常备于急诊门口，接到指令立刻出车', '全体医护均持有 ACLS/ATLS 顶级高级生命支持认证'],
      badge: '急危重症救治'
    },
    'rawat-inap': {
      name: '别墅级高奢 VIP/VVIP 住院病房',
      desc: '独具热带森林绿色康养风的病房设计，每间病房皆可俯瞰中庭花园。全天候持证护士精心护理，并由营养师搭配专属的五星级治愈膳食。',
      highlights: ['全室恒温空调并配备大风量HEPA级空气净化器', '配备高奢大尺寸家属陪护多功能皮质沙发床', '独立百兆光纤网络与超高清液晶电视系统'],
      features: ['双层隔音门窗与尊贵、私密的无障碍数字门禁系统', '二十四小时一对一尊贵临床监护贴身应答', '55英寸高奢智能点播电视提供全球主流媒体', '为每位高奢病房家属预留独立贵宾免费专属车位'],
      badge: '绿色森林养生'
    },
    'icu': {
      name: 'ICU重症监护病房与高依赖病房 (HCU)',
      desc: '针对多器官功能衰竭、休克、重度心肺功能不全等极端危重症，利用先进的临床监测网络进行多维生化指标的全候安全保障。',
      highlights: ['实时多参数床旁重症监护仪和多维警报', '万级无菌层流正压通风系统排除交叉感染', '知名麻醉学及重症医学主任联合多学科专家值守'],
      features: ['世界顶级微电脑控制式无创/有创呼吸机', '多通道程控式微量输液泵与精确注射泵组', '执行 1:1 或 1:2 的国际极高医护配比和特级护理', '全数字智能突发危象全院声光联动警报控制系统'],
      badge: '危重症生命支持'
    },
    'radiologi': {
      name: '放射科与多排螺旋 CT 诊断中心',
      desc: '利用先进的低剂量数字成像和高清重建算法，对骨折、头颅外伤、急腹症及全身肿瘤，提供极其清晰、准确的高分辨率扫描。',
      highlights: ['超低剂量高清晰数字乳腺及常规摄影(DR)仪', '实时 4D 三维立体产科超声与多普勒血流诊断仪', '进口先进多排螺旋高分辨率多排探测 CT 系统'],
      features: ['超高清大矩阵重建图，全面展示微小病灶', '全部胶片影像支持扫描二维码直达手机端查看', '急诊绿色通道24小时常备大功率备用扫描电源', '三甲公立医院从业背景的资深放射学专家阅片主笔'],
      badge: '精准无误阅片'
    },
    'kamar-operasi': {
      name: '万级大净化HEPA层流无菌手术室',
      desc: '无菌手术室采用顶部空气洁净过滤层，消除空气中的致病微生物。配备高精度麻醉机和先进手术台，全面防范伤口感染。',
      highlights: ['采用高效 HEPA 过滤的恒温恒湿单向层流系统', '配备高显色性多灯头冷光源手术无影灯', '多学科骨干外科大专家和特级麻醉医生常驻'],
      features: ['全数字化高清微创手术实时摄像示教广播系统', '进口全配高清腹腔镜、关节镜等超微创镜下手术设备', '微电脑集中控制手术室温湿度、噪声和静压平衡', '专设无缝连接的麻醉后复苏病房（Pacu Room）'],
      badge: '国际洁净级'
    },
    'perinatologi-kamar-bersalin': {
      name: '高标准分娩中心与产房 (VK Maternity)',
      desc: '以母婴安全 and 温情生产为最高宗旨。支持导乐无痛分娩，提供家属全程陪产及一对一国际执证乳腺疏通催乳师指导。',
      highlights: ['可多角度任意调节的顶级人体工学分娩产床', '设有多重隔音设施的绝对私密产后早期接触(IMD)室', '妇产科主治医师及资深助产士全天候轮流守候'],
      features: ['多点无线胎儿心率/宫缩实时电子连续监测系统', '产房内直接预设高配新生儿窒息复苏专用辐射保暖台', '产后2小时内即刻提供专业催乳、哺乳及开奶辅导', '全室运用暖色调防静电环保材质，彻底消除分娩焦虑'],
      badge: '高雅母婴呵护'
    }
  },
  AR: {
    'rawat-jalan': {
      name: 'العيادات الخارجية التخصصية',
      desc: 'خدمات استشارية وفحوصات طبية شاملة يقدمها نخبة من الأطباء الاستشاريين في عيادات مريحة ومجهزة بالكامل لراحتكم.',
      highlights: ['أكثر من ٣٠ تخصصاً فرعياً ودقيقاً', 'نظام سجلات طبية إلكتروني متكامل للسرية والسرعة', 'صالة انتظار خضراء شبه مفتوحة للراحة النفسية'],
      features: ['سهولة الحجز المسبق عبر تطبيق الواتساب لتفادي الانتظار', 'صيدلية داخلية مخصصة للعيادات الخارجية لصرف الدواء الفوري', 'توفر الفحوصات التشخيصية المباشرة داخل العيادة', 'تنسيق مواعيد دقيق لمنع التكدس وضمان كفاءة الخدمة'],
      badge: 'خدمات متكاملة'
    },
    'rehabilitasi-medik': {
      name: 'الطب الطبيعي وإعادة التأهيل',
      desc: 'برامج علاج طبيعي متكاملة تهدف لإستعادة الحركة والوظائف الحركية المتأثرة بالجلطات الدماغية، إصابات الملاعب، أو أمراض الأعصاب.',
      highlights: ['أخصائيون مرخصون ذوو كفاءة طبية عالية', 'صالة ألعاب رياضية طبية مجهزة بأحدث أدوات التمرين', 'علاج متقدم بالكهرباء والموجات فوق الصوتية لتقليل الألم'],
      features: ['جلسات حرارية بالأشعة تحت الحمراء مع إبر طبية مخصصة', 'علاج طبيعي مخصص للأطفال والبالغين بكفاءة عالية', 'تقييم شامل ومستمر لحركة المفاصل وقوة العضلات', 'تحفيز عصبي مكثف ومراقب لحالات ما بعد السكتات الدماغية'],
      badge: 'إعادة التأهيل الحركي'
    },
    'skincare': {
      name: 'مركز ياسمين الطبي للعناية بالبشرة',
      desc: 'الوجهة الأولى للعناية بجمال وصحة البشرة في بانيوانجي بإشراف مباشر من أطباء جلدية متخصصين وبتركيبات طبية آمنة.',
      highlights: ['استشارات طبية متخصصة لكل نوع بشرة بدقة', 'تقنيات ليزر Nd:YAG الفاخرة لتصفية البشرة', 'علاجات تفتيح ونضارة الوجه المخصصة'],
      features: ['علاجات مكافحة الشيخوخة وتجديد خلايا البشرة', 'إزالة الثآليل والزوائد الجلدية بدون ألم وبسرعة', 'تقشير كيميائي طبي وتنظيف عميق للبشرة لغلق المسام', 'مستحضرات وتركيبات طبية آمنة معتمدة من الأطباء'],
      badge: 'جمال طبي متكامل'
    },
    'laboratorium': {
      name: 'المختبر السريري الحديث ٢٤ ساعة',
      desc: 'وحدة متكاملة لإجراء الفحوصات الطبية والبيوكيميائية للدم والسوائل وهرمونات الأورام بأعلى دقة وأجهزة آلية بالكامل.',
      highlights: ['أجهزة تحليل آلية حديثة بنظام تحكم عالي الدقة', 'ظهور النتائج بسرعة فائقة في أقل من ٤٥ دقيقة للتحاليل الأساسية', 'فحوصات معتمدة ومباشرة لمستفيدي التأمين الوطني BPJS'],
      features: ['تحاليل وظائف الكبد والكلى والدهون الشاملة', 'قياس السكر التراكمي ومراقبة مخاطر السكري بدقة', 'توفر فحوصات كورونا والانفلونزا السريعة على مدار الساعة', 'تحليل بول وبراز كامل ومعادن الدم بدقة سريرية'],
      badge: 'دقة تشخيصية ممتازة'
    },
    'instalasi-farmasi-24-jam': {
      name: 'الصيدلية المتكاملة ٢٤ ساعة',
      desc: 'توفير وصرف الأدوية والمستلزمات الطبية المعتمدة من هيئة الدواء والغذاء BPOM على مدار الساعة وبإشراف صيادلة متخصصين.',
      highlights: ['مخزون دوائي شامل ومضمون الجودة بنسبة ١٠٠٪', 'إرشادات دوائية تفصيلية يقدمها صيادلة ذوو خبرة', 'خدمة مستمرة على مدار الساعة طوال أيام الأسبوع'],
      features: ['تطبيق معايير أمان صارمة لمنع تداخل الأدوية', 'نظام استدعاء إلكتروني وصرف ذكي للأدوية', 'خدمة ممر صيدلي مخصص للسيارات والدراجات للتسلم الفوري', 'خيارات واسعة من البدائل المعتمدة والأدوية المتخصصة المستوردة'],
      badge: 'جاهزية دوائية تامة'
    },
    'instalasi-gawat-darurat-igd-24-jam': {
      name: 'قسم الطوارئ والإسعاف ٢٤ ساعة',
      desc: 'رعاية عاجلة ومباشرة لحالات الأزمات القلبية، السكتات الدماغية، كسور الحوادث، والتسمم الحاد بأعلى مستويات السرعة والجاهزية.',
      highlights: ['تقييم وتصنيف سريع لحالة المريض في أقل من ٣ دقائق', 'أطباء طوارئ وتمريض رعاية حرجة متواجدون باستمرار', 'تكامل مباشر مع الأشعة والمختبر لتوفير الوقت'],
      features: ['أحدث أجهزة إنعاش القلب الرئوي والصدمات الكهربائية', 'مخزون أكسجين متكامل وأجهزة تنفس متنقلة', 'أسطول إسعاف مجهز يقف أمام الطوارئ جاهز للانطلاق فورا', 'طاقم حاصل على شهادات ACLS/ATLS العالمية للإنقاذ'],
      badge: 'رعاية طارئة فورية'
    },
    'rawat-inap': {
      name: 'أجنحة التنويم الفاخرة VIP/VVIP',
      desc: 'غرف تنويم مريحة مصممة على الطراز الاستشفائي الأخضر مع إطلالات خلابة ومريحة للعين، مصحوبة برعاية تمريضية وغذائية ممتازة.',
      highlights: ['تكييف مركزي مع فلاتر لتنقية الهواء HEPA من الجراثيم', 'أريكة سرير واسعة ومريحة لمرافقي المرضى في التنويم', 'إنترنت لاسلكي فائق السرعة وشاشة ذكية لعرض المحتوى'],
      features: ['أقصى درجات الأمان والخصوصية مع نظام دخول رقمي مشفر', 'رعاية تمريضية مستمرة على مدار الساعة مخصصة للاستجابة', 'شاشة ذكية ٣٥ بوصة توفر قنوات بث وترفيه متميزة', 'مواقف سيارات مجانية ومخصصة لعائلات مرضى الأجنحة الفاخرة'],
      badge: 'استشفاء هادئ ومريح'
    },
    'icu': {
      name: 'قسم العناية المركزة وفائقة الدقة ICU/HCU',
      desc: 'رعاية طبية فائقة ومستمرة للمرضى ذوي الحالات الحرجة وغير المستقرة بإشراف نخبة من أطباء التخدير والرعاية المركزة.',
      highlights: ['شاشات مراقبة العلامات الحيوية بجوار السرير متصلة بالنظام', 'نظام هواء معقم بالكامل لمنع العدوى المتبادلة', 'إشراف طبي متكامل من استشاريين متعددين للحالات الحرجة'],
      features: ['أحدث أجهزة التنفس الصناعي الميكانيكية بدعم متقدم', 'مضخات محاليل وأدوية آلية دقيقة ومتعددة لضبط الجرعات', 'نسبة ممرض إلى مريض تضمن المراقبة اللصيقة (١:١ أو ١:٢)', 'نظام إنذار طوارئ رقمي متصل بجميع الأقسام للسرعة'],
      badge: 'دعم الحياة المكثف'
    },
    'radiologi': {
      name: 'قسم الأشعة والتصوير المقطعي CT-Scan',
      desc: 'تصوير دقيق وعالي الوضوح لأعضاء الجسم الداخلية والعظام بالاعتماد على أجهزة رقمية بجرعات إشعاع منخفضة وآمنة.',
      highlights: ['أجهزة رنين رقمية وأشعة سينية فائقة الدقة بجرعات منخفضة', 'تصوير تلفزيوني سونار رباعي الأبعاد 4D للجنين وأمراض النساء', 'أحدث جهاز تصوير مقطعي محوري CT-Scan متعدد المقاطع'],
      features: ['جودة صور متميزة تمكن من رصد أدق التغيرات المرضية', 'إمكانية تسلم صور الأشعة والتقارير عبر الهاتف مباشرة بالـ QR', 'جاهزية تامة للأشعة لخدمة حالات الطوارئ ٢٤ ساعة دون توقف', 'تقارير مفصلة يكتبها استشاريون ذوو خبرة وكفاءة علمية'],
      badge: 'تشخيص شعاعي موثوق'
    },
    'kamar-operasi': {
      name: 'غرفة العمليات المعقمة بنظام ضغط الهواء الرأسي',
      desc: 'بيئة جراحية معقمة ومحمية بالكامل تمنع التلوث وتضمن سلامة العمليات الجراحية المعقدة بأحدث أجهزة التخدير والإضاءة الدقيقة.',
      highlights: ['تدفق هواء معقم بنظام هيبا HEPA لمنع التهابات الجروح', 'إضاءة جراحية LED متطورة ومصممة لمنع الظلال أثناء الجراحة', 'طاقم جراحي واستشاريو تخدير متواجدون باستمرار للمساندة'],
      features: ['نظام بث مرئي مباشر للجراحات لتسهيل التعليم الطبي', 'أدوات جراحة مناظير متطورة للجراحات الدقيقة وغير النافذة', 'تحكم آلي بالكمبيوتر في درجات الحرارة والرطوبة والضغط داخل الغرفة', 'جناح إفاقة Pacu Room مجهز بالكامل للمتابعة بعد التخدير'],
      badge: 'معايير أمان معقمة'
    },
    'perinatologi-kamar-bersalin': {
      name: 'قسم الولادة ورعاية الأطفال حديثي الولادة',
      desc: 'ولادة آمنة تضمن سعادة وسلامة الأم والطفل، مع غرف اتصال مباشر privat (IMD) ودعم متواصل من مرشدات الرضاعة الطبيعية.',
      highlights: ['أسرة ولادة حديثة وقابلة للتعديل لراحة الأم', 'غرفة خاصة ومجهزة لضمان الخصوصية أثناء الاتصال المبكر مع الرضيع', 'طاقم طبي وقابلات ذوات خبرة واسعة في الولادات الحرجة'],
      features: ['مراقبة مستمرة لنبضات قلب الجنين وانقباضات الرحم إلكترونياً', 'وحدة إنعاش أطفال حديثي الولادة مجهزة داخل غرفة الولادة فوراً', 'جلسات استشارية ومساج كولسترم ودعم الرضاعة بعد الولادة مباشرة', 'غرفة ولادة بألوان وتصميم يبعث على الهدوء لتقليل خوف الأم'],
      badge: 'ولادة سعيدة وآمنة'
    }
  }
};
