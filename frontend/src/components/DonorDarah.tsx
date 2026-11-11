import React, { useState } from 'react';
import { SafeImage } from '../utils/imageUrl';
const clubDonorImg = '/assets/images/komunitas/rsyasminclub_donordarah.jpg';
import { 
  Droplet, Calendar, Heart, Shield, HelpCircle, Star, Info, 
  MapPin, CheckCircle, ArrowRight, UserPlus, Gift, Trophy, Activity,
  Smartphone, BookOpen, GraduationCap, Users, Clock, Smile, Printer, 
  ShieldAlert, Eye, EyeOff, MessageCircle, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { EXTRA_TRANSLATIONS } from '../translations_extra';

export default function DonorDarah() {
  const lang = useLanguage();
  const t = EXTRA_TRANSLATIONS.DONOR[lang] || EXTRA_TRANSLATIONS.DONOR.ID;

  const dt: Record<string, Record<string, string>> = {
    ID: {
      tag1: 'Donor Darah',
      tag2: 'Sehat Berenergi',
      tag3: 'Peduli Sesama',
      tag4: 'Gaya Hidup Modern',
      female: 'Perempuan',
      male: 'Laki-laki',
      unknown: 'Tidak Tahu',
      gender: 'Jenis Kelamin',
      workPlaceHolder: 'Contoh: Karyawan Swasta / PNS',
      never: 'Belum Pernah',
      yesHave: 'Ya, Sudah Pernah',
      lastDonorPlaceHolder: 'Misal: Januari 2026 / 3 Bulan Lalu',
      alamatPlaceHolder: 'Masukkan alamat RT/RW, Dusun, Kelurahan, Kecamatan, Kabupaten',
      sendingData: 'Mengirim Data...',
      memberPrivileges: 'KEISTIMEWAAN ANGGOTA',
      memberPrivilegesTitle: '7 Keistimewaan Khusus Anggota Club Donor Darah',
      routineDonation: 'JADWAL DONOR RUTIN',
      routineDonationTitle: 'Jadwal Donor Darah Rutin RS Yasmin',
      routineDonationDesc: 'Anda dapat langsung berkunjung ke Unit Kerja Donor Darah RS Yasmin pada waktu operasional berikut.',
      opDays: 'Hari Operasional',
      svcHours: 'Jam Pelayanan',
      location: 'Lokasi Tindakan',
      desc: 'Keterangan',
      monSat: 'Senin - Sabtu',
      routineDesc: 'Pelayanan donor rutin mandiri harian kerja.',
      sunday: 'Minggu',
      sundayDesc: 'Donor khusus bagi peserta event/tanggap krisis darurat.',
      specialEvent: 'Event Khusus',
      announcedPeriodically: 'Diumumkan Berkala',
      mobileUnitLoc: 'Mobile Unit / Lokasi Sekolah / Kantor / Pabrik',
      mobileUnitDesc: 'Unit Transfusi Keliling sesuai koordinasi lapangan eksternal.',
      majorActivities: 'PROGRAM & EVENT UTAMA',
      majorActivitiesTitle: 'Event & Program Rutin Tahunan Club',
      threeMonthProg: 'PROGRAM TIGA BULANAN',
      massDonation: 'Donor Darah Massal',
      massDonationDesc: 'Aksi sosial massal menggandeng berbagai instansi, ormas, dan masyarakat Banyuwangi secara serentak.',
      every3Months: 'Setiap 3 Bulan',
      academicProg: 'PROGRAM AKADEMIK',
      schoolCampus: 'Donor Darah Goes to School / Campus',
      schoolCampusDesc: 'Penyuluhan, screening HB, dan bakti sosial donor darah terpadu di lingkungan SMA & kampus di Banyuwangi.',
      everySemester: 'Setiap Semester',
      corpSocialProg: 'PROGRAM CORPORATE SOCIAL',
      corpPartner: 'Donor Darah Mitra Perusahaan',
      corpPartnerDesc: 'Kunjungan Mobile Unit RS Yasmin memfasilitasi karyawan pabrik, perbankan, dan swasta berdonor di lokasi.',
      fellowshipProg: 'PROGRAM SILATURAHMI',
      gatheringSymposium: 'Gathering & Sarasehan Pendonor',
      gatheringSymposiumDesc: 'Ajang ramah tamah hangat bertukar testimoni cerita inspirasi antar sesama anggota klub kemanusiaan.',
      every6Months: 'Setiap 6 Bulan',
      appreciationProg: 'APRESIASI ANGGOTA',
      dedicatedDonor: 'Apresiasi Akbar Donor Berdedikasi',
      dedicatedDonorDesc: 'Pemberian piagam penghargaan resmi, medali tanda jasa hero, dan paket kesehatan eksklusif tahunan.',
      everyWorldDonorDay: 'Setiap Hari Donor Sedunia',
      proudDoc: 'DOKUMENTASI AKSI',
      actionGalleryTitle: 'Galeri Aksi Nyata Club Donor Darah',
      grandMass: 'Donor Massal Akbar',
      integratedHall: 'Aula Terpadu RS Yasmin',
      integratedHb: 'Skrining HB Terpadu',
      bloodTransfusionUnit: 'Unit Transfusi Darah',
      fellowshipSymposium: 'Sarasehan Silaturahmi',
      amphitheaterGarden: 'Amfiteater Garden RS Yasmin',
      socialSma: 'Bakti Sosial SMA / Kampus',
      travelingMobileUnit: 'Mobile Unit Keliling',
      heroAwarding: 'Malam Penghargaan Hero',
      awardingCeremony: 'Awarding Ceremony RS Yasmin',
      reliableTeam: 'Tim Skrining Handal',
      proPharmacists: 'Apoteker & Perawat Profesional',
      realTestimonials: 'TESTIMONI REAL',
      whatDoRegularDonorsSay: 'Apa Kata Mereka yang Rutin Berdonor?',
      testiSuparman: '“Donor darah sudah benar-benar menjadi gaya hidup sehat saya pribadi sejak bergabung resmi menjadi salah satu anggota Club Donor RS Yasmin. Selain membantu kesehatan raga sendiri, batin saya dipenuhi kedamaian karena tahu setetes darah ini akan memberi kehidupan baru.”',
      mrSuparman: 'Bapak Suparman',
      testiSuparmanSub: 'Anggota Terdaftar (34 Kali Berdonor)',
      testiDina: '“Jujur awal kalinya saya mencobanya diliputi sejuta rasa ketakutan terhadap jarum. Tetapi setelah bergabung dan dibimbing oleh perawat handal RS Yasmin, rasanya tidak sakit sama sekali! Justru sekarang saya jauh lebih memahami tensi bulanan dan detak organ jantung sendiri.”',
      mrsDina: 'Ibu Dina',
      testiDinaSub: 'Anggota Baru (Rhesus O Positif)',
      testiAndi: '“Tim Unit Transfusi RS Yasmin sungguh mempermudah jalannya pelayanan donor kami sekeluarga. Jadwal sosialisasi sangat transparan, letak ranjangnya nyaman bernuansa bersih, dan perawatnya begitu ramah dlm melakukan penusukan jarum. Saya terhitung sudah menembus donor ke-5 di sini.”',
      mrAndi: 'Bapak Andi',
      testiAndiSub: 'Anggota Setia (Donor Rhesus AB Langka)',
      mythsFacts: 'MITOS VS FAKTA',
      mitigationTitle: 'Meluruskan Keraguan Umum Donor Darah',
      mitigationDesc: 'Seringkali masyarakat diliputi trauma atau keraguan tidak mendasar. Berikut klarifikasi medis murni tim dokter RS Yasmin.',
      queryDoubt: 'Tanya/Ragu: ',
      actualMedicalFacts: 'Fakta Medis Sebenarnya:',
      faqSupport: 'FAQ DUKUNGAN',
      lookingForAnswers: 'Mencari Jawaban Terlengkap?',
      ctaTitle: 'Saatnya Jadi Pahlawan Penyelamat Jiwa Banyuwangi!',
      ctaDesc: 'Pintu pendaftaran hero terbuka ramah selamanya. Bersatunya Anda menyelamatkan masa depan keluarga Banyuwangi yang sedang berjuang.',
      ctaBtnRegister: 'Daftar Jadi Donor',
      ctaBtnSchedule: 'Jadwal Donor Hari Ini',
      ctaBtnWa: 'Konsultasi via WhatsApp',
      ctaBtnLocation: 'Lokasi RS Yasmin',
      locationAlert: 'RS Yasmin berlokasi strategis di Jl. Letkol Istiqlah No. 21, Singonegaran, Kabupaten Banyuwangi.'
    },
    EN: {
      tag1: 'Blood Donation',
      tag2: 'Healthy Energy',
      tag3: 'Social Care',
      tag4: 'Modern Lifestyle',
      female: 'Female',
      male: 'Male',
      unknown: 'Unknown',
      gender: 'Gender',
      workPlaceHolder: 'e.g. Private Employee / Civil Servant',
      never: 'Never',
      yesHave: 'Yes, I Have',
      lastDonorPlaceHolder: 'e.g. January 2026 / 3 Months Ago',
      alamatPlaceHolder: 'Enter RT/RW, Sub-district, District, Regency address details',
      sendingData: 'Sending Data...',
      memberPrivileges: 'MEMBER PRIVILEGES',
      memberPrivilegesTitle: '7 Exclusive Privileges for Blood Donor Club Members',
      routineDonation: 'ROUTINE DONATION SCHEDULING',
      routineDonationTitle: 'RS Yasmin Routine Blood Donation Schedule',
      routineDonationDesc: 'You can directly visit the RS Yasmin Blood Donation Unit during the following operational hours.',
      opDays: 'Operational Days',
      svcHours: 'Service Hours',
      location: 'Location',
      desc: 'Description',
      monSat: 'Monday - Saturday',
      routineDesc: 'Daily routine independent donor service on workdays.',
      sunday: 'Sunday',
      sundayDesc: 'Special donations for event participants/emergency crisis response.',
      specialEvent: 'Special Event',
      announcedPeriodically: 'Announced Periodically',
      mobileUnitLoc: 'Mobile Unit / School, Office, or Factory Locations',
      mobileUnitDesc: 'Mobile Transfusion Unit as coordinated in the field.',
      majorActivities: 'MAJOR ACTIVITIES',
      majorActivitiesTitle: 'Club Events & Routine Annual Programs',
      threeMonthProg: 'THREE-MONTH PROGRAM',
      massDonation: 'Mass Blood Donation',
      massDonationDesc: 'Mass social action simultaneously engaging various institutions, organizations, and the Banyuwangi public.',
      every3Months: 'Every 3 Months',
      academicProg: 'ACADEMIC PROGRAM',
      schoolCampus: 'Blood Donor Goes to School / Campus',
      schoolCampusDesc: 'Counseling, HB screening, and integrated blood donation social services in high schools and campuses in Banyuwangi.',
      everySemester: 'Every Semester',
      corpSocialProg: 'CORPORATE SOCIAL PROGRAM',
      corpPartner: 'Corporate Partner Blood Donation',
      corpPartnerDesc: 'RS Yasmin Mobile Unit visits to facilitate factory, banking, and private sector employees donating on-site.',
      fellowshipProg: 'FELLOWSHIP PROGRAM',
      gatheringSymposium: 'Donor Gathering & Symposium',
      gatheringSymposiumDesc: 'A warm gathering to share testimonies and inspiring stories among fellow members of the humanitarian club.',
      every6Months: 'Every 6 Months',
      appreciationProg: 'MEMBERS APPRECIATION',
      dedicatedDonor: 'Dedicated Donor Grand Appreciation',
      dedicatedDonorDesc: 'Awarding of official certificates of appreciation, hero medals of service, and annual exclusive health packages.',
      everyWorldDonorDay: 'Every World Donor Day',
      proudDoc: 'PROUD DOCUMENTATION',
      actionGalleryTitle: 'Blood Donor Club Action Gallery',
      grandMass: 'Grand Mass Donation',
      integratedHall: 'RS Yasmin Integrated Hall',
      integratedHb: 'Integrated HB Screening',
      bloodTransfusionUnit: 'Blood Transfusion Unit',
      fellowshipSymposium: 'Fellowship Symposium',
      amphitheaterGarden: 'RS Yasmin Amphitheater Garden',
      socialSma: 'Social Service SMA / Campus',
      travelingMobileUnit: 'Traveling Mobile Unit',
      heroAwarding: 'Hero Awarding Night',
      awardingCeremony: 'RS Yasmin Awarding Ceremony',
      reliableTeam: 'Reliable Screening Team',
      proPharmacists: 'Professional Pharmacists & Nurses',
      realTestimonials: 'REAL TESTIMONIALS',
      whatDoRegularDonorsSay: 'What Do Regular Donors Say?',
      testiSuparman: '“Blood donation has truly become my personal healthy lifestyle since officially joining the RS Yasmin Donor Club. Besides helping my own health, my soul is filled with peace knowing this drop of blood will give a new life.”',
      mrSuparman: 'Mr. Suparman',
      testiSuparmanSub: 'Registered Member (34 Donations)',
      testiDina: '“To be honest, the first time I tried it, I was filled with a million fears of needles. But after joining and being guided by RS Yasmin\'s expert nurses, it didn\'t hurt at all! Now, I understand my monthly blood pressure and heart health much better.”',
      mrsDina: 'Mrs. Dina',
      testiDinaSub: 'New Member (O Positive Rhesus)',
      testiAndi: '“The RS Yasmin Transfusion Unit team really eases the donation process for my family. The schedule is transparent, the beds are comfortable and clean, and the nurses are very friendly when inserting the needle. I have reached my 5th donation here.”',
      mrAndi: 'Mr. Andi',
      testiAndiSub: 'Loyal Member (Rare AB Rhesus Donor)',
      mythsFacts: 'MYTHS VS FACTS',
      mitigationTitle: 'Clarifying Common Doubts About Blood Donation',
      mitigationDesc: 'Often, people are filled with trauma or unfounded doubts. Here is pure medical clarification from the RS Yasmin medical team.',
      queryDoubt: 'Query/Doubt: ',
      actualMedicalFacts: 'Actual Medical Facts:',
      faqSupport: 'FAQ SUPPORT',
      lookingForAnswers: 'Looking for the Most Complete Answers?',
      ctaTitle: 'Time to Become Banyuwangi\'s Life-saving Hero!',
      ctaDesc: 'The doors of hero registration are warmly open forever. Your unity saves the future of Banyuwangi families who are struggling.',
      ctaBtnRegister: 'Register as Donor',
      ctaBtnSchedule: 'Today\'s Donor Schedule',
      ctaBtnWa: 'Consult via WhatsApp',
      ctaBtnLocation: 'RS Yasmin Location',
      locationAlert: 'RS Yasmin is strategically located at Jl. Letkol Istiqlah No. 21, Singonegaran, Banyuwangi Regency.'
    },
    KR: {
      tag1: '사랑의 헌혈',
      tag2: '안심 건강 에너지',
      tag3: '이웃 사랑 실천',
      tag4: '현대적인 라이프스타일',
      female: '여성',
      male: '남성',
      unknown: '알 수 없음',
      gender: '성별',
      workPlaceHolder: '예시: 회사원 / 공무원 / 자영업',
      never: '경험 없음',
      yesHave: '경험 있음',
      lastDonorPlaceHolder: '예시: 2026년 1월 / 3개월 전',
      alamatPlaceHolder: '주민등록상 상세 주소, 반/조(RT/RW), 동/읍, 군 주소 입력',
      sendingData: '데이터 전송 중...',
      memberPrivileges: '회원 전용 특전',
      memberPrivilegesTitle: '야스민 사랑의 헌혈 클럽 회원을 위한 7가지 특전',
      routineDonation: '정기 헌혈 일정 안내',
      routineDonationTitle: '야스민 병원 정기 무료 헌혈 서비스 일정',
      routineDonationDesc: '아래 운영 시간 내에 야스민 병원 헌혈 지원 센터를 방문하여 안전하고 따뜻한 참여가 가능합니다.',
      opDays: '운영 요일',
      svcHours: '서비스 시간',
      location: '상세 위치',
      desc: '참고 사항',
      monSat: '월요일 - 토요일',
      routineDesc: '평일 일상 근무 시간 중 자체 개별 정기 헌혈 서비스 제공.',
      sunday: '일요일',
      sundayDesc: '단체 참여 및 긴급 비상 혈액 수급 시 예약제 특별 운영.',
      specialEvent: '특별 이벤트',
      announcedPeriodically: '주기적 사전 공지',
      mobileUnitLoc: '이동 채혈 차량 / 학교 / 기업체 / 관공서 정기 방문',
      mobileUnitDesc: '외부 현장 및 커뮤니티와 연계된 야스민 모바일 채혈 유닛 현장 운영.',
      majorActivities: '주요 연간 활동 및 프로젝트',
      majorActivitiesTitle: '클럽 주최 공식 연례 행사 및 공익 프로그램',
      threeMonthProg: '3개월 주기 분기 프로그램',
      massDonation: '대규모 단체 헌혈',
      massDonationDesc: '바뉴왕이 시의 주요 공공기관, 시민 단체, 시민이 대규모로 동참하는 연대 프로젝트.',
      every3Months: '3개월마다 진행',
      academicProg: '학술 교육 지원 프로그램',
      schoolCampus: '학교 및 캠퍼스로 찾아가는 헌혈 교실',
      schoolCampusDesc: '바뉴왕이 고등학교 및 파트너 대학에서 진행하는 위생 건강 교육 및 현장 채혈 활동.',
      everySemester: '매 학기 진행',
      corpSocialProg: '기업 사회공헌(CSR) 프로그램',
      corpPartner: '제휴 파트너 기업 단체 헌혈',
      corpPartnerDesc: '야스민 이동식 채혈 센터가 금융권, 제조 공장 및 민간 기업을 방문하여 현장 편의 제공.',
      fellowshipProg: '정서 교류 및 네트워킹 프로그램',
      gatheringSymposium: '헌혈자 친목 교류회 및 패널 심포지엄',
      gatheringSymposiumDesc: '인도주의적 생명 나눔을 함께하는 회원들이 모여 감동적인 사연과 경험을 공유하는 따뜻한 네트워킹 자리.',
      every6Months: '6개월마다 진행',
      appreciationProg: '우수 기증자 시상 및 감사 수여',
      dedicatedDonor: '정기 헌혈 유공자 연례 대포상식',
      dedicatedDonorDesc: '매년 유공자들을 모시고 공식 공로 훈장, 영웅 명예 메달 및 전용 VIP 정밀 건강 검진 패키지 수여.',
      everyWorldDonorDay: '세계 헌혈자의 날(매년 6월 14일)',
      proudDoc: '행사 활동 기록 사진첩',
      actionGalleryTitle: '사랑의 헌혈 클럽 생생한 실제 활동 갤러리',
      grandMass: '대규모 사랑의 단체 헌혈',
      integratedHall: '야스민 대강당 통합 홀',
      integratedHb: '현장 빈혈 및 HB 무료 간이 선별 검사',
      bloodTransfusionUnit: '의료 수혈 진료실',
      fellowshipSymposium: '친목 교류 심포지엄 소모임',
      amphitheaterGarden: '야스민 앰피시어터 가든 야외 라운지',
      socialSma: '고등학교 및 지역 대학 연계 봉사 활동',
      travelingMobileUnit: '모바일 채혈 차량 지역 순회 서비스',
      heroAwarding: '생명 나눔 영웅들의 밤 시상식',
      awardingCeremony: '야스민 병원 공식 어워딩 세레모니',
      reliableTeam: '전문 헌혈 간호 의료진',
      proPharmacists: '공인 혈액 전담 간호사 및 임상 약사 군단',
      realTestimonials: '생생한 실제 참여 후기',
      whatDoRegularDonorsSay: '정기 참여 회원들이 직접 들려주는 감동적인 한마디',
      testiSuparman: '“야스민 병원 헌혈 클럽의 공식 정회원이 된 이후, 정기 헌혈은 제 일상의 가장 중요하고 건강한 루틴이 되었습니다. 타인의 소중한 생명을 구하는 것은 물론이고, 제 신체도 더 가볍고 맑아지는 놀라운 보람을 느끼고 있습니다.”',
      mrSuparman: '수파르만 님',
      testiSuparmanSub: '클럽 정회원 (34회 기증 완료)',
      testiDina: '“처음에는 날카로운 주삿바늘에 대한 엄청난 공포감으로 걱정이 가든했습니다. 하지만 따뜻하고 숙련된 전담 간호사님의 배려 덕분에 전혀 아프지 않고 가벼운 기분으로 완료했습니다! 정기 검진 혜택도 받아 매우 유용합니다.”',
      mrsDina: '디나 님',
      testiDinaSub: '신규 가입 회원 (O형 Rhesus+ 양성)',
      testiAndi: '“야스민 병원 의료진의 전문성은 정말 최고입니다. 모든 과정이 무균 환경에서 체계적으로 관리되고 설명도 투명하게 이루어져 가족 모두 정기적으로 방문하고 있습니다. 벌써 5번째 영광스러운 헌혈을 무사히 마쳤습니다.”',
      mrAndi: '안디 님',
      testiAndiSub: '클럽 정회원 (희귀 AB형 Rhesus+ 기증자)',
      mythsFacts: '헌혈 관련 오해와 진실 (Q&A)',
      mitigationTitle: '잘못 알려진 헌혈 상식 바로잡기',
      mitigationDesc: '막연한 공포나 잘못된 정보로 인해 망설이시는 분들을 위해 야스민 병원 전문 의료진이 친절하고 정확하게 답변해 드립니다.',
      queryDoubt: '질문 및 오해: ',
      actualMedicalFacts: '의학적 실제 팩트:',
      faqSupport: '고객 지원 FAQ',
      lookingForAnswers: '무엇이든 친절하게 답변해 드립니다',
      ctaTitle: '바뉴왕이의 위대한 생명 구호 영웅이 될 시간입니다!',
      ctaDesc: '생명을 구하는 위대한 여정의 문은 언제나 열려 있습니다. 당신의 고귀한 결심이 고통받는 환자들의 희망찬 내일을 선물합니다.',
      ctaBtnRegister: '헌혈 회원 신청하기',
      ctaBtnSchedule: '오늘의 헌혈 일정 보기',
      ctaBtnWa: '카카오톡/왓츠앱 무료 상담',
      ctaBtnLocation: '야스민 병원 오시는 길',
      locationAlert: '야스민 병원은 바뉴왕이 중심지인 Jl. Letkol Istiqlah No. 21, Singonegaran에 최적의 접근성으로 위치하고 있습니다.'
    },
    ZH: {
      tag1: '无偿献血',
      tag2: '健康活力',
      tag3: '关爱社会',
      tag4: '现代生活方式',
      female: '女性',
      male: '男性',
      unknown: '暂不明确',
      gender: '性别',
      workPlaceHolder: '例：私企职员 / 公务员 / 自由职业',
      never: '从未献血（初次）',
      yesHave: '曾参与过无偿献血',
      lastDonorPlaceHolder: '例：2026年1月 / 3个月前',
      alamatPlaceHolder: '请填写您身份证上的现居住详细住址、门牌号及街道',
      sendingData: '正在提交信息...',
      memberPrivileges: '专属会员权益',
      memberPrivilegesTitle: '无偿献血爱心俱乐部会员享有的 7 大专属特权',
      routineDonation: '常规采血日程排班',
      routineDonationTitle: '雅斯敏综合医院临床献血中心排班表',
      routineDonationDesc: '您可以直接在下方公布的常规工作时间内，前往雅斯敏医院采血室进行安全、卫生的爱心捐献。',
      opDays: '服务日期',
      svcHours: '服务时间',
      location: '服务地点',
      desc: '服务备注',
      monSat: '周一至周六',
      routineDesc: '提供日常常规无偿献血门诊及筛查服务。',
      sunday: '周日',
      sundayDesc: '针对大型应急保障活动或突发公共血库告急情况的特约排班。',
      specialEvent: '特约大事件',
      announcedPeriodically: '定期提前公示',
      mobileUnitLoc: '流动采血车进校园 / 协议单位 / 园区停靠',
      mobileUnitDesc: '雅斯敏医院流动采血应急分队根据外部社区协作安排停靠进行现场采血。',
      majorActivities: '年度重点爱心活动',
      majorActivitiesTitle: '俱乐部年度常态化公益宣教与主题献血计划',
      threeMonthProg: '季度主题公益项目',
      massDonation: '全城大型联合无偿献血',
      massDonationDesc: '联动全市主要机关、企事业单位及爱心社团共同举办的全城联合献血。',
      every3Months: '每 3 个月举办一次',
      academicProg: '校园医学科普与宣教',
      schoolCampus: '无偿献血科普宣教“进校园”行动',
      schoolCampusDesc: '组织专家团深入全市各大高中及高校，开展生理健康宣教及流动爱心采血。',
      everySemester: '每学期定期举办',
      corpSocialProg: '企业社会责任 (CSR) 共建',
      corpPartner: '协议合作单位专场无偿献血',
      corpPartnerDesc: '采血车开进园区，为爱心金融机构、工厂等协议单位提供零距离采血服务。',
      fellowshipProg: '会员关爱与人道主义沙龙',
      gatheringSymposium: '献血者联谊茶话会与励志分享沙龙',
      gatheringSymposiumDesc: '为俱乐部爱心会员打造的高端交流沙龙，分享拯救生命的感人故事。',
      every6Months: '每 6 个月举办一次',
      appreciationProg: '杰出奉献者表彰大典',
      dedicatedDonor: '年度优秀无偿献血英模表彰大会',
      dedicatedDonorDesc: '向规律高频献血的会员颁发国家荣誉奖章、英模纪念章并赠送高规格深度体检。',
      everyWorldDonorDay: '世界献血者日 (每年6月14日)',
      proudDoc: '爱心光影瞬间',
      actionGalleryTitle: '无偿献血爱心俱乐部行动风采画廊',
      grandMass: '全城爱心联合献血专场',
      integratedHall: '雅斯敏综合医院主楼多功能报告厅',
      integratedHb: '免费指尖血红蛋白 (HB) 快速检测筛查',
      bloodTransfusionUnit: '输血科专属采血室',
      fellowshipSymposium: '爱心会员联谊交流沙龙',
      amphitheaterGarden: '雅斯敏医院生态花园露天剧场',
      socialSma: '爱心高校及青年志愿者实践基地',
      travelingMobileUnit: '应急流动采血专车',
      heroAwarding: '“热血英雄”荣誉表彰之夜',
      awardingCeremony: '雅斯敏医院行政楼荣誉礼堂',
      reliableTeam: '高素质爱心采血团队',
      proPharmacists: '具备国家执业资质的专业护理师与质控药师团队',
      realTestimonials: '爱心会员真实心声',
      whatDoRegularDonorsSay: '听听那些常年坚持无偿献血的规律献血者怎么说',
      testiSuparman: '“自从正式加入雅斯敏医院无偿献血俱乐部，规律献血已经彻底融入了我崇尚健康的生活方式。不仅加速了体内红细胞再生，知道自己的热血能挽救一条鲜活的生命更让我感到由衷自豪。”',
      mrSuparman: '苏帕曼 先生',
      testiSuparmanSub: '俱乐部正式会员 (已累计献血 34 次)',
      testiDina: '“老实说，在加入之前我对于打针有着天生的重度恐惧。但这里的护士操作极其温柔，会一边聊天一边完成了采血，体验完全不痛！每年还能享受到免费的基础血常规复查，非常有意义。”',
      mrsDina: '蒂娜 女士',
      testiDinaSub: '俱乐部新晋会员 (O型 Rh阳性血)',
      testiAndi: '“雅斯敏医院的采血卫生条件、设备水准和医护人员服务态度都无懈可击。每一次都非常放心地带着家人一起来参与。我已经在这成功奉献了 5 次爱心血。”',
      mrAndi: '安迪 先生',
      testiAndiSub: '俱乐部忠实会员 (稀有 AB型熊猫血献血者)',
      mythsFacts: '关于献血的传言与事实真相',
      mitigationTitle: '粉碎关于无偿献血的医学谬误',
      mitigationDesc: '很多时候，大众对献血存在着一些不必要的心理顾虑或误区。为此，雅斯敏医院医学顾问团队为您解答疑惑：',
      queryDoubt: '社会顾虑/传言：',
      actualMedicalFacts: '现代临床医学真相：',
      faqSupport: '无偿献血客服支持 FAQ',
      lookingForAnswers: '寻找关于健康和安全的权威解答？',
      ctaTitle: '现在就行动，成为巴纽旺伊无私奉献的生命英雄！',
      ctaDesc: '拯救生命的热血大门常年敞开。您的每一次伸出臂膀，都为生命垂危的病患者点燃重获新生的烛光。',
      ctaBtnRegister: '立即报名加入俱乐部',
      ctaBtnSchedule: '查看今日采血安排',
      ctaBtnWa: 'WhatsApp 官方直通客服',
      ctaBtnLocation: '雅斯敏医院详细院址',
      locationAlert: '印尼雅斯敏综合医院位于巴纽旺伊核心地段 (Jl. Letkol Istiqlah No. 21, Singonegaran)，交通四通八达，极易寻找。'
    },
    AR: {
      tag1: 'التبرع بالدم',
      tag2: 'صحة وحيوية',
      tag3: 'رعاية اجتماعية',
      tag4: 'نمط حياة حديث',
      female: 'أنثى',
      male: 'ذكر',
      unknown: 'لا أعرف بعد',
      gender: 'الجنس',
      workPlaceHolder: 'مثال: موظف قطاع خاص / موظف حكومي',
      never: 'لم أتبرع من قبل',
      yesHave: 'نعم، تبرعت سابقاً',
      lastDonorPlaceHolder: 'مثال: يناير ٢٠٢٦ / قبل ٣ أشهر',
      alamatPlaceHolder: 'يرجى إدخال عنوان السكن بالتفصيل: الحي، الشارع، والبلدية',
      sendingData: 'جاري إرسال البيانات...',
      memberPrivileges: 'مزايا ومكافآت الأعضاء',
      memberPrivilegesTitle: '٧ مزايا استثنائية لأعضاء نادي التبرع بالدم بمستشفى ياسمين',
      routineDonation: 'جدول مواعيد التبرع الدوري',
      routineDonationTitle: 'مواعيد العمل الدورية لوحدة التبرع بالدم بمستشفى ياسمين',
      routineDonationDesc: 'يمكنك زيارة وحدة التبرع بالدم في مستشفى ياسمين مباشرة خلال أوقات العمل الرسمية التالية.',
      opDays: 'أيام العمل',
      svcHours: 'ساعات الخدمة',
      location: 'موقع الإجراء',
      desc: 'ملاحظات وتفاصيل',
      monSat: 'الأثنين - السبت',
      routineDesc: 'خدمات التبرع الدوري الفردي في أيام العمل الرسمية.',
      sunday: 'الأحد',
      sundayDesc: 'تبرع مخصص للمشاركين في الفعاليات أو حالات الطوارئ القصوى.',
      specialEvent: 'حدث خاص',
      announcedPeriodically: 'يُعلن عنه دورياً',
      mobileUnitLoc: 'الوحدة المتنقلة / المدارس / المكاتب / المصانع',
      mobileUnitDesc: 'وحدة التبرع المتنقلة تخدم الميدان وفق التنسيق المشترك.',
      majorActivities: 'البرامج والفعاليات الرئيسية',
      majorActivitiesTitle: 'الفعاليات والبرامج السنوية المعتادة للنادي',
      threeMonthProg: 'برنامج كل ٣ أشهر',
      massDonation: 'حملة التبرع الجماعي الكبرى',
      massDonationDesc: 'حملة اجتماعية واسعة تضم عدة هيئات ومؤسسات ومواطنين في بانيوانجي في وقت واحد.',
      every3Months: 'كل ٣ أشهر',
      academicProg: 'البرنامج الأكاديمي والتعليمي',
      schoolCampus: 'حملة التبرع بالدم بالمدارس والجامعات',
      schoolCampusDesc: 'ندوات توعوية، فحص الهيموجلوبين، وحملات تبرع بالدم بالمدارس الثانوية والجامعات ببانيوانجي.',
      everySemester: 'كل فصل دراسي',
      corpSocialProg: 'برنامج المسؤولية الاجتماعية للشركات',
      corpPartner: 'حملات التبرع بالشركات والمصانع',
      corpPartnerDesc: 'زيارات الوحدة المتنقلة لمستشفى ياسمين لتسهيل التبرع بالدم للموظفين والعمال في مواقعهم.',
      fellowshipProg: 'برنامج التواصل واللقاءات',
      gatheringSymposium: 'اللقاء السنوي العام للمتبرعين',
      gatheringSymposiumDesc: 'ملتقى سنوي ودي لتبادل الآراء وقصص النجاح والتجارب الملهمة بين الأعضاء.',
      every6Months: 'كل ٦ أشهر',
      appreciationProg: 'برنامج تكريم الأعضاء المميزين',
      dedicatedDonor: 'حفل التكريم السنوي للمتبرعين الأكثر عطاءً',
      dedicatedDonorDesc: 'تقديم شهادات شكر وتقدير رسمية، ميداليات الشرف الإنسانية، وحزم فحوصات طبية سنوية حصرية.',
      everyWorldDonorDay: 'اليوم العالمي للمتبرعين بالدم (١٤ يونيو سنوياً)',
      proudDoc: 'معرض الصور والتوثيق',
      actionGalleryTitle: 'معرض الأنشطة واللحظات الواقعية لنادي التبرع',
      grandMass: 'حملة التبرع بالدم الكبرى',
      integratedHall: 'القاعة المتكاملة بمستشفى ياسمين',
      integratedHb: 'فحوصات الهيموجلوبين السريعة المجانية',
      bloodTransfusionUnit: 'وحدة نقل التبرعات بالدم',
      fellowshipSymposium: 'ندوة التواصل والتعارف للمتبرعين',
      amphitheaterGarden: 'الحديقة المفتوحة بمستشفى ياسمين',
      socialSma: 'حملات الخدمة التطوعية بالمدارس والجامعات',
      travelingMobileUnit: 'الوحدة الطبية المتنقلة للميدان',
      heroAwarding: 'حفل تكريم أبطال الحياة السنوي',
      awardingCeremony: 'قاعة الشرف الإدارية بمستشفى ياسمين',
      reliableTeam: 'طاقم فحص وتبرع موثوق ومؤهل',
      proPharmacists: 'أخصائيو تمريض وفحص مدربون ذوو خبرة وكفاءة عالية',
      realTestimonials: 'شهادات المتبرعين الحقيقية',
      whatDoRegularDonorsSay: 'ماذا يقول المتبرعون بانتظام عن تجربتهم الإنسانية؟',
      testiSuparman: '“لقد أصبح التبرع بالدم جزءاً أصيلاً ومستداماً من نمط حياتي الصحي منذ انضمامي رسمياً لنادي التبرع بمستشفى ياسمين. فبالإضافة للصحة البدنية، تغمرني راحة نفسية لمعرفتي أن قطرة دم تنقذ نفساً بشرية.”',
      mrSuparman: 'السيد سوبارمان',
      testiSuparmanSub: 'عضو مسجل (تبرع ٣٤ مرة)',
      testiDina: '“بصراحة في البداية كان لدي خوف شديد من الإبر الطبية. ولكن بعد انضمامي ومعاملة الطاقم المتميز بمستشفى ياسمين، لم أشعر بأي ألم على الإطلاق! والآن أفهم مستويات ضغطي ودقات قلبي بشكل أفضل بكثير.”',
      mrsDina: 'السيدة دينا',
      testiDinaSub: 'عضوة جديدة (فصيلة دم O ريزوس موجب)',
      testiAndi: '“يسهل طاقم وحدة نقل الدم بمستشفى ياسمين عملية التبرع لعائلتي بالكامل. المواعيد واضحة، الأسرة مريحة ومعقمة بالكامل، والممرضون بغاية الرفق واللطف عند سحب الدم. لقد تبرعت للمرة الخامسة بنجاح هنا.”',
      mrAndi: 'السيد أندي',
      testiAndiSub: 'عضو دائم (متبرع فصيلة نادرة AB ريزوس سالب)',
      mythsFacts: 'حقائق وأوهام شائعة',
      mitigationTitle: 'تصحيح المفاهيم الخاطئة حول التبرع بالدم',
      mitigationDesc: 'في كثير من الأحيان، تحيط بالناس مخاوف أو شكوك لا أساس لها من الصحة. إليكم التوضيح الطبي النقي من الفريق الطبي بمستشفى ياسمين.',
      queryDoubt: 'السؤال/الشك: ',
      actualMedicalFacts: 'الحقيقة الطبية الفعلية:',
      faqSupport: 'الدعم والأسئلة الشائعة',
      lookingForAnswers: 'هل تبحث عن الإجابة الأكثر اكتمالاً؟',
      ctaTitle: 'حان الوقت لتكون بطلاً ينقذ الحياة في بانيوانجي!',
      ctaDesc: 'أبواب التسجيل للأبطال مفتوحة دائمًا بحفاوة. مشاركتك تنقذ مستقبل عائلات بانيوانجي التي تكافح.',
      ctaBtnRegister: 'سجل كمتبرع',
      ctaBtnSchedule: 'جدول المتبرعين اليوم',
      ctaBtnWa: 'استشر عبر واتساب',
      ctaBtnLocation: 'موقع مستشفى ياسمين',
      locationAlert: 'يقع مستشفى ياسمين بموقع استراتيجي في شارع ليتكول إستقلال رقم ٢١، سينغونيغاران، بانيوانجي.'
    }
  };

  const c = dt[lang] || dt.ID;

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nikKtp: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    golonganDarah: 'A',
    pekerjaan: '',
    noWa: '',
    pernahDonor: 'Belum',
    terakhirDonor: '',
    alamatDomisili: ''
  });

  const [loading, setLoading] = useState(false);
  const [joinedDonor, setJoinedDonor] = useState<any>(null);
  const [activeMitigasi, setActiveMitigasi] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setJoinedDonor({
        namaLengkap: formData.namaLengkap,
        nikKtp: formData.nikKtp,
        jenisKelamin: formData.jenisKelamin,
        golonganDarah: formData.golonganDarah,
        id: "YDC-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    }, 1500);
  };

  const getLocalizedSyarat = (currentLang: string) => {
    switch (currentLang) {
      case 'ID':
        return [
          { no: 1, syarat: "Usia 17 - 60 Tahun", ket: "Batas usia aman bagi pendonor pemula. Bagi pendonor rutin, diperbolehkan berdonor hingga usia 65 tahun setelah mendapat rekomendasi tertulis tim dokter spesialis RS Yasmin." },
          { no: 2, syarat: "Berat Badan Minimal 45 Kg", ket: "Kriteria wajib untuk memastikan volume darah di dalam tubuh pendonor tetap aman pasca-pengambilan sebesar 350ml atau 450ml." },
          { no: 3, syarat: "Kadar Hemoglobin (HB) 12.5 - 17.0 g/dL", ket: "Kadar zat besi sel darah merah wajib berada pada rentang ini untuk menghindari risiko anemia berat pasca-donor baik bagi pendonor pria maupun wanita." },
          { no: 4, syarat: "Tekanan Darah Stabil", ket: "Sistole: 90-160, Diastole: 60-100 mmHg. Tekanan darah harus stabil dalam rentang normal agar sirkulasi jantung tetap aman selama proses penyedotan darah berlangsung." },
          { no: 5, syarat: "Sehat & Bebas Obat-obatan", ket: "Tidak sedang sakit demam, batuk, atau pilek. Bebas dari konsumsi obat antibiotik keras dalam kurun waktu minimal 3 hari sebelum waktu pendonoran." },
          { no: 6, syarat: "Interval Jarak Donor Minimal 3 Bulan", ket: "Rentang waktu biologis sel darah untuk melakukan regenerasi penuh secara sempurna sebelum sel darah merah baru siap disumbangkan kembali." },
          { no: 7, syarat: "Tidak Memiliki Riwayat Infeksi Kronis", ket: "Bebas dari riwayat penyakit hepatitis B, hepatitis C, HIV/AIDS, sifilis, penyakit jantung kronis, serta ketergantungan narkotika." }
        ];
      case 'KR':
        return [
          { no: 1, syarat: "17 - 60세", ket: "최초 기증자의 안전한 연령 범위입니다. 정기 기증자의 경우 야스민 병원 의료진의 승인 하에 최대 65세까지 참여할 수 있습니다." },
          { no: 2, syarat: "최소 체중 45 kg 이상", ket: "350ml 또는 450ml 채혈 후에도 기증자의 신체 내 혈액량이 완전히 안전하게 유지되기 위한 필수 기준입니다." },
          { no: 3, syarat: "Hb 수치 12.5 - 17.0 g/dL", ket: "적혈구 내 철분 수치가 이 최적의 범위에 도달해 있어야 헌혈 후 빈혈이나 어지러움증을 유발하지 않습니다." },
          { no: 4, syarat: "안정적인 혈압", ket: "수축기: 90-160, 이완기: 60-100 mmHg. 채혈 중 심장 순환을 안전하게 보장하기 위해 혈압이 안정적이고 정상 범위에 속해 있어야 합니다." },
          { no: 5, syarat: "건강 상태 양호 및 약물 복용 금지", ket: "발열, 기침, 감기 증상이 없어야 하며, 헌혈 전 최소 3일간 항생제나 고용량 약물을 복용하지 않은 상태여야 합니다." },
          { no: 6, syarat: "최소 3개월(12주) 경과", ket: "이전 헌혈 후 적혈구가 완벽하게 재생되어 안전하게 다시 헌혈할 수 있는 생물학적 회복 기간입니다." },
          { no: 7, syarat: "만성 감염병 이력 없음", ket: "B형 간염, C형 간염, HIV/AIDS, 매독, 만성 심장 질환 및 약물 중독 등의 이력이 전혀 없어야 합니다." }
        ];
      case 'ZH':
        return [
          { no: 1, syarat: "17 - 60 周岁", ket: "初次献血者的安全年龄上限。对于规律献血的会员，在获得雅斯敏医院医生专项评估同意后，可放宽至65周岁。" },
          { no: 2, syarat: "最低 45 公斤", ket: "强制性标准，以确保在抽取 350 毫升或 450 毫升血液后，献血者体内的血液循环量依然保持在绝对安全水平。" },
          { no: 3, syarat: "Hb 水平 12.5 - 17.0 g/dL", ket: "红细胞中的血红蛋白含量必须处于该区间，以有效避免献血后出现严重贫血或虚脱。" },
          { no: 4, syarat: "血压平稳", ket: "收缩压 90-160, 舒张压 60-100 mmHg。血压必须平稳且在正常范围内，以确保采血过程中献血者的心脏及全身血液循环安全畅通。" },
          { no: 5, syarat: "身体健康且停药", ket: "无发热、咳嗽或流感等症状。在献血前至少 3 天内未服用任何强效抗生素或其他受限药物。" },
          { no: 6, syarat: "至少间隔 3 个月（12周）", ket: "红细胞在体内实现完全再生和恢复所需的生理周期，确保下一次献血的安全。" },
          { no: 7, syarat: "无慢性传染病史", ket: "必须无乙肝、丙肝、艾滋病、梅毒、慢性心脏病及药物滥用等相关病史。" }
        ];
      case 'AR':
        return [
          { no: 1, syarat: "١٧ - ٦٠ سنة", ket: "الحد العمري الآمن للمتبرعين لأول مرة. يمكن للمتبرعين المنتظمين التبرع حتى سن ٦٥ عاماً بعد موافقة أطباء مستشفى ياسمين." },
          { no: 2, syarat: "٤٥ كجم كحد أدنى", ket: "شرط إلزامي لضمان بقاء حجم الدم في جسم المتبرع آمناً تماماً بعد سحب ٣٥٠ مل أو ٤٥٠ مل." },
          { no: 3, syarat: "مستوى الهيموجلوبين ١٢.٥ - ١٧.٠ جم/ديسيلتر", ket: "يجب أن يكون مستوى الهيموجلوبين في الدم ضمن هذا النطاق لتجنب حدوث فقر دم أو إرهاق بعد التبرع." },
          { no: 4, syarat: "ضغط دم مستقر", ket: "الانقباضي: ٩٠-١٦٠، الانبساطي: ٦٠-١٠٠ ملم زئبق. يجب أن يكون ضغط الدم مستقراً وضمن المعدلات الطبيعية لضمان سلامة الدورة الدموية للقلب أثناء العملية." },
          { no: 5, syarat: "صحة جيدة وخالٍ من الأدوية", ket: "يجب أن يكون المتبرع خالياً من الحمى أو السعال أو نزلات البرد، مع عدم تناول أي مضادات حيوية قبل التبرع بـ ٣ أيام على الأقل." },
          { no: 6, syarat: "١٢ أسبوعاً كحد أدنى (٣ أشهر)", ket: "الفترة الزمنية البيولوجية اللازمة لخلايا الدم الحمراء لتتجدد بشكل كامل وصحي قبل التمكن من التبرع مجدداً." },
          { no: 7, syarat: "خالٍ من الأمراض المزمنة", ket: "يجب ألا يكون لدى المتبرع تاريخ مرضي للإصابة بالتهاب الكبد الوبائي (ب) أو (ج)، أو نقص المناعة المكتسب (الإيدز)، أو الزهري، أو أمراض القلب المزمنة، أو الإدمان." }
        ];
      default:
        return [
          { no: 1, syarat: "Age 17 - 60 Years Old", ket: "The safe age limit for first-time donors. Regular donors are allowed to donate up to 65 years old with special clearance from RS Yasmin doctors." },
          { no: 2, syarat: "Minimum Weight 45 Kg", ket: "Mandatory requirement to ensure that blood volume in the donor's body remains completely safe after 350ml or 450ml blood extraction." },
          { no: 3, syarat: "Hemoglobin (HB) Level 12.5 - 17.0 g/dL", ket: "Iron level in red blood cells must fall within this optimal range to prevent post-donation fatigue or anemia." },
          { no: 4, syarat: "Stable Blood Pressure", ket: "Systole: 90-160, Diastole: 60-100 mmHg. Blood pressure must be stable and within normal ranges to ensure smooth and safe cardiac circulation during the procedure." },
          { no: 5, syarat: "General Health & Drug-Free", ket: "Free from fever, cough, or cold. Absolutely no consumption of antibiotics or high-dose medicines for at least 3 days prior to donation." },
          { no: 6, syarat: "Minimum 3 Months (12 Weeks) Interval", ket: "The biological timeframe required for red blood cells to regenerate perfectly before the donor can safely donate again." },
          { no: 7, syarat: "No Chronic Infection History", ket: "Must not have a history of hepatitis B, hepatitis C, HIV/AIDS, syphilis, chronic heart disease, or substance addiction." }
        ];
    }
  };

  const getLocalizedKeistimewaan = (currentLang: string) => {
    switch (currentLang) {
      case 'ID':
        return [
          { no: 1, title: "🆔 Kartu Anggota Digital & Fisik", desc: "Identitas resmi eksklusif sebagai bagian dari keluarga besar Club Donor Darah RS Yasmin." },
          { no: 2, title: "✅ Prioritas Layanan Darah", desc: "Mendapatkan prioritas penuh apabila Anda atau keluarga inti membutuhkan darah dalam kondisi darurat." },
          { no: 3, title: "🩺 Pemeriksaan Kesehatan Rutin", desc: "Pemeriksaan berkala untuk gula darah acak, kolesterol total, tekanan darah, dan HB secara gratis." },
          { no: 4, title: "🎁 Souvenir & Bingkisan Menarik", desc: "Berbagai bingkisan apresiasi kesehatan seperti susu fermentasi, biskuit, multivitamin, dan kaos premium di acara khusus." },
          { no: 5, title: "📋 Log Riwayat Kesehatan Medis", desc: "Rekam jejak komprehensif mengenai riwayat kesehatan darah Anda yang tercatat rapi di database RS Yasmin." },
          { no: 6, title: "🏆 Penghargaan Lencana Kemanusiaan", desc: "Apresiasi resmi bagi anggota berdedikasi yang mencapai kelipatan donor tertentu (10x, 25x, 50x, hingga 100x)." },
          { no: 7, title: "🎉 Undangan Gathering Eksklusif", desc: "Undangan menghadiri pertemuan tahunan akbar pendonor, webinar kesehatan gratis, dan forum berbagi sosial." }
        ];
      case 'KR':
        return [
          { no: 1, title: "🆔 디지털 및 실물 회원 카드", desc: "야스민 병원 헌혈 클럽 가족으로서의 공식적이고 독점적인 신원 증명." },
          { no: 2, title: "✅ 혈액 서비스 우선권", desc: "본인 또는 직계 가족이 응급 혈액을 필요로 할 때 최우선 지원 혜택 제공." },
          { no: 3, title: "🩺 정기 건강 검진", desc: "무작위 혈당, 총콜레스테롤, 혈압 및 헤모글로빈(HB) 수치의 정기적인 점검 제공." },
          { no: 4, title: "🎁 매력적인 기념품 및 사은품", desc: "특별 행사 시 발효유, 비스킷, 종합비타민, 프리미엄 기념 티셔츠 제공." },
          { no: 5, title: "📋 디지털 의료 이력 로그", desc: "야스민 병원 데이터베이스에 철저하게 기록 관리되는 정밀 혈액 건강 역사 이력 관리." },
          { no: 6, title: "🏆 인류애 공로 훈장", desc: "정기 헌혈 횟수 달성 시(10회, 25회, 50회, 최대 100회) 공식 감사패 및 공로 휘장 수여." },
          { no: 7, title: "🎉 연례 전용 소셜 모임 초청", desc: "연간 대규모 헌혈자 친목 모임 초청, 무료 건강 세미나 및 네트워킹 세션 제공." }
        ];
      case 'ZH':
        return [
          { no: 1, title: "🆔 数字化与实体会员卡", desc: "印尼雅斯敏医院无偿献血爱心俱乐部的官方专属会员身份凭证。" },
          { no: 2, title: "✅ 临床用血优先保障", desc: "在紧急用血情况下，会员及其直系亲属享有全面的血液供应优先调配权。" },
          { no: 3, title: "🩺 常规免费健康体检", desc: "定期提供免费的随机血糖、总胆固醇、血压和血红蛋白 (HB) 循环复查。" },
          { no: 4, title: "🎁 精美纪念品与健康礼包", desc: "提供酸奶、高能饼干、多种维生素以及在特定活动中派发的定制高档纪念 T 恤。" },
          { no: 5, title: "📋 专属电子健康档案", desc: "由雅斯敏医院病历管理系统妥善记录和维护的个人采血健康历史详细清单。" },
          { no: 6, title: "🏆 人道主义功勋奖章", desc: "向高频次献血的杰出会员颁发官方荣誉证书与功勋勋章（累计达 10、25、50 及 100 次）。" },
          { no: 7, title: "🎉 专属会员沙龙与答谢会", desc: "受邀参加年度献血者联谊大会、免费医学科普讲座及人道主义爱心沙龙。" }
        ];
      case 'AR':
        return [
          { no: 1, title: "🆔 بطاقة عضوية رقمية وورقية", desc: "هوية رسمية حصرية كجزء من عائلة نادي المتبرعين بالدم في مستشفى ياسمين." },
          { no: 2, title: "✅ أولوية خدمات نقل الدم", desc: "الحصول على أولوية كاملة في حال احتجت أنت شخصياً أو أحد أفراد عائلتك المقربين إلى دم في حالة طوارئ." },
          { no: 3, title: "🩺 فحوصات صحية دورية", desc: "فحص عشوائي لنسبة السكر في الدم، والكوليسترول العام، وضغط الدم، ومستوى الهيموجلوبين بشكل دوري." },
          { no: 4, title: "🎁 هدايا تذكارية ومكافآت قيمة", desc: "هدايا تقديرية صحية متنوعة مثل الحليب المخمر، البسكويت، الفيتامينات المتعددة، والقمصان الفاخرة في المناسبات الخاصة." },
          { no: 5, title: "📋 سجل التاريخ الصحي والطبي", desc: "سجل شامل لتاريخ صحة دمك ومستويات المؤشرات مسجل بشكل منظم في قاعدة بيانات مستشفى ياسمين." },
          { no: 6, title: "🏆 وسام العطاء الإنساني", desc: "تكريم رسمي للأعضاء المتفانين (عند الوصول إلى ١٠، ٢٥، ٥٠، وحتى ١٠٠ تبرع بالدم)." },
          { no: 7, title: "🎉 دعوات حصرية للقاءات السنوية", desc: "دعوة لحضور اللقاء السنوي الكبير للمتبرعين، وندوات صحية مجانية، وحلقات نقاش اجتماعية." }
        ];
      default:
        return [
          { no: 1, title: "🆔 Digital & Physical Member Card", desc: "Exclusive official identity as part of the RS Yasmin Blood Donor Club family." },
          { no: 2, title: "✅ Blood Service Priority", desc: "Receive full priority if you or your immediate family require emergency blood." },
          { no: 3, title: "🩺 Routine Health Screenings", desc: "Periodic checks for random blood sugar, general cholesterol, blood pressure, and HB." },
          { no: 4, title: "🎁 Attractive Souvenirs & Gifts", desc: "Various health appreciation gifts like fermented milk, biscuits, multivitamins, and premium shirts at special events." },
          { no: 5, title: "📋 Medical Health History Log", desc: "A comprehensive track record of your blood health history recorded neatly in the RS Yasmin database." },
          { no: 6, title: "🏆 Humanitarian Badge Award", desc: "Official recognition for dedicated members (reaching 10x, 25x, 50x, up to 100x donations)." },
          { no: 7, title: "🎉 Exclusive Gathering Invitation", desc: "Invitation to the grand annual donor gathering, free health webinars, and social sharing forums." }
        ];
    }
  };

  const getLocalizedManfaat = (currentLang: string) => {
    switch (currentLang) {
      case 'ID':
        return [
          { no: 1, title: "❤️ Menjaga Kesehatan Jantung", desc: "Donor darah secara teratur membantu mengurangi kekentalan darah, meminimalkan sumbatan pembuluh, dan secara signifikan menurunkan risiko serangan jantung serta stroke." },
          { no: 2, title: "🩸 Mencegah Kelebihan Zat Besi", desc: "Membantu tubuh menjaga keseimbangan kadar zat besi dalam darah, mencegah kerusakan organ penting seperti hati, pankreas, dan limpa akibat akumulasi zat besi berlebih." },
          { no: 3, title: "🔄 Merangsang Produksi Darah Baru", desc: "Setelah berdonor, sumsum tulang belakang dirangsang untuk segera memproduksi sel darah merah baru yang segar, optimal mengikat oksigen ke seluruh tubuh." },
          { no: 4, title: "🧠 Meningkatkan Kesejahteraan Mental", desc: "Perasaan tulus dalam membantu dan menyelamatkan nyawa orang lain memicu pelepasan hormon endorfin, memberikan kepuasan batin mendalam, serta meredakan stres." },
          { no: 5, title: "🩺 Skrining Kesehatan Gratis", desc: "Sebelum pengambilan darah, Anda mendapat pengetesan medis gratis seperti kadar hemoglobin, tekanan darah, suhu tubuh, hingga deteksi penyakit menular utama." },
          { no: 6, title: "🔥 Membakar Kalori Tubuh", desc: "Setiap mendonorkan darah sekitar 450 ml, tubuh akan membakar sekitar 650 kalori, mendukung manajemen berat badan dan metabolisme yang sehat." },
          { no: 7, title: "🤝 Kepedulian Sosial Tinggi", desc: "Bergabung bersama ribuan pahlawan kemanusiaan untuk menyokong ketersediaan darah darurat bagi pasien kritis di wilayah Banyuwangi secara berkesinambungan." }
        ];
      case 'KR':
        return [
          { no: 1, title: "❤️ 심장 건강 유지", desc: "정기적인 헌혈은 혈액 점도를 낮추고 혈관 막힘을 줄여 심근경색이나 뇌졸중 같은 심혈관 질환 예방에 훌륭한 도움을 줍니다." },
          { no: 2, title: "🩸 철분 과부하 방지", desc: "체내 철분 수치의 균형을 맞추어 간, 췌장, 비장 등 주요 장기에 철분이 과다 축적되어 발생할 수 있는 세포 손상을 막아줍니다." },
          { no: 3, title: "🔄 새로운 혈액 생산 촉진", desc: "헌혈 직후 골수 세포가 자극을 받아 산소 운반 능력이 탁월하고 건강한 신선한 적혈구를 능동적으로 새로이 만들어 냅니다." },
          { no: 4, title: "🧠 정신적 만족과 행복감", desc: "타인의 고귀한 생명을 구했다는 순수한 인도주의적 보람은 스트레스를 완화하고 내면의 깊은 긍정적 평온함을 가져다줍니다." },
          { no: 5, title: "🩺 무료 기초 종합 검진", desc: "혈압, 체온, 헤모글로빈(Hb) 수치 검사 및 주요 전염성 질환 유무에 대한 무료 혈액 선별 스크리닝을 즉석에서 제공받을 수 있습니다." },
          { no: 6, title: "🔥 자연스러운 칼로리 소모", desc: "1회 헌혈(약 450ml) 시 신체는 약 650칼로리를 에너지를 소비하여 신진대사 활성화 및 체중 조율을 지원합니다." },
          { no: 7, title: "🤝 고귀한 사회적 연대 실천", desc: "바뉴왕이 지역의 긴급 수혈 환자들의 생명을 수호하기 위해 정기적이고 자발적인 사랑의 나눔 네트워크에 안전하게 동참합니다." }
        ];
      case 'ZH':
        return [
          { no: 1, title: "❤️ 维护心血管健康", desc: "定期无偿献血可以降低血液黏稠度，减少血管内壁阻力，从而显著降低心肌梗死和脑卒中（中风）的发病几率。" },
          { no: 2, title: "🩸 防止体内铁质过载", desc: "有助于身体代谢并平衡血液中的铁蛋白水平，保护肝脏、胰腺和脾脏等核心器官免受过量铁质沉积造成的损害。" },
          { no: 3, title: "🔄 刺激生成新鲜血液", desc: "采血后，人体的造血干细胞及骨髓会被迅速激活，源源不断地生成携带氧气能力更强的年轻、红细胞。" },
          { no: 4, title: "🧠 提升心理幸福感", desc: "拯救他人生命的崇高成就感和利他行为会促使大脑分泌内啡肽，缓解日常生活压力，获得持久深层的心理愉悦。" },
          { no: 5, title: "🩺 尊享免费医学筛查", desc: "每次献血前均可免费享受包括血压、心率、血红蛋白浓度（HB）以及多项重大临床传染性指标的严密体格检查。" },
          { no: 6, title: "🔥 促进机体卡路里消耗", desc: "科学测定，每献出一次约 450 毫升的全血，身体将代谢并消耗大约 650 卡路里，辅助维持健康的新陈代谢。" },
          { no: 7, title: "🤝 践行至高无私的社会关怀", desc: "与数万名巴纽旺伊无偿献血志愿者并肩同行，共同筑起保障危重症患者生命安全的坚实爱心红色防线。" }
        ];
      case 'AR':
        return [
          { no: 1, title: "❤️ الحفاظ على صحة القلب", desc: "يساعد التبرع بالدم بانتظام على تقليل لزوجة الدم، مما يقلل من انسداد الأوعية الدموية ويخفض بشكل كبير من مخاطر النوبات القلبية والسكتات الدماغية." },
          { no: 2, title: "🩸 منع تراكم الحديد الزائد", desc: "يساعد الجسم على الحفاظ على توازن مستويات الحديد في الدم، مما يحمي الأعضاء الحيوية مثل الكبد والبنكرياس والطحال من التلف الناتج عن تراكم الحديد." },
          { no: 3, title: "🔄 تحفيز إنتاج دم جديد", desc: "بعد التبرع، يتم تحفيز نخاع العظم لإنتاج خلايا دم حمراء جديدة وطازجة على الفور، والتي تنقل الأكسجين بكفاءة عالية لجميع أنحاء الجسم." },
          { no: 4, title: "🧠 تعزيز الصحة النفسية والذهنية", desc: "الشعر الصادق بمساعدة الآخرين وإنقاذ حياتهم يحفز إفراز هرمون الإندورفين، مما يمنح رضاً داخلياً عميقاً ويخفف من مستويات التوتر." },
          { no: 5, title: "🩺 فحص طبي مجاني شامل", desc: "قبل عملية سحب الدم، تخضع لفحص طبي مجاني يشمل قياس ضغط الدم، ونسبة الهيموجلوبين، ودرجة حرارة الجسم، والكشف عن أبرز الأمراض المعدية." },
          { no: 6, title: "🔥 حرق السعرات الحرارية", desc: "عند التبرع بحوالي ٤٥٠ مل من الدم، يحرق الجسم ما يقارب ٦٥٠ سعرة حرارية، مما يدعم الإدارة الصحية للوزن والتمثيل الغذائي." },
          { no: 7, title: "🤝 تجسيد التكافل الاجتماعي", desc: "الانضمام إلى آلاف المتبرعين لدعم الاحتياطي الطارئ من الدم وإنقاذ حياة المرضى ذوي الحالات الحرجة في بانيوانجي بشكل مستدام." }
        ];
      default:
        return [
          { no: 1, title: "❤️ Maintain Heart Health", desc: "Blood donation can lower blood viscosity, thereby significantly reducing the risk of heart attacks and strokes." },
          { no: 2, title: "🩸 Prevent Iron Overload", desc: "Helps balance iron levels in the blood to prevent tissue damage in the liver, pancreas, and spleen." },
          { no: 3, title: "🔄 Stimulate New Blood Production", desc: "Shortly after donation, the bone marrow is stimulated to produce brand new, fresh, and oxygenated red blood cells." },
          { no: 4, title: "🧠 Enhance Mental Well-being", desc: "The sincere feeling of helping and saving others provides deep inner psychological satisfaction and lowers stress levels." },
          { no: 5, title: "🩺 Free Health Screening", desc: "Before the donation process begins, you will undergo a comprehensive health screening such as blood pressure, hemoglobin (HB) levels, body temperature, and blood type checks for free." },
          { no: 6, title: "🔥 Burn Calories", desc: "Donating 450ml of blood can burn about 650 of your body calories." },
          { no: 7, title: "🤝 High Social Care", desc: "Contribute to saving the lives of citizens in coordination with the RS Yasmin Blood Transfusion Unit." }
        ];
    }
  };

  const getLocalizedMitigasi = (currentLang: string) => {
    switch (currentLang) {
      case 'ID':
        return [
          { ragu: '"Donor darah itu sakit dan berbahaya"', fakta: "Prosedur donor dijamin sangat aman. Jarum yang digunakan adalah alat medis steril, sekali pakai, dan dikerjakan oleh perawat bersertifikasi. Sensasi yang dirasakan hanya sebatas gigitan semut ringan." },
          { ragu: '"Donor darah membuat tubuh menjadi lemas"', fakta: "Volume darah yang didonorkan akan tergantikan dalam beberapa puluh jam kemudian melalui konsumsi cairan yang cukup. Sumsum tulang akan langsung aktif memproduksi sel segar, sehingga tubuh justru terasa lebih bugar." },
          { ragu: '"Donor darah berisiko menularkan penyakit"', fakta: "Sangat tidak mungkin terjadi. Semua peralatan mulai dari jarum, kantong darah, hingga selang medis mutlak steril, baru, dan langsung dimusnahkan tepat setelah satu kali pemakaian." },
          { ragu: '"Saya terlalu kurus untuk bisa donor"', fakta: "Batas berat badan minimal hanyalah 45 kg. Apabila berat badan Anda melebihi angka tersebut dan tekanan darah/HB Anda bagus, Anda sudah sepenuhnya layak mendonorkan darah." },
          { ragu: '"Donor darah menghabiskan waktu sangat lama"', fakta: "Pengambilan darah sesungguhnya hanya memakan waktu sekitar 10 sampai 15 menit saja! Total durasi pendaftaran, skrining HB, hingga istirahat pasca-donor rata-rata hanya 45-60 menit." },
          { ragu: '"Saya takut sekali dengan jarum suntik"', fakta: "Tenaga medis di RS Yasmin terlatih menangani pasien fobia jarum medis dengan teknik distraksi rileks, tempat tidur ergonomis, dan pengalihan fokus yang menenangkan." }
        ];
      case 'KR':
        return [
          { ragu: '"헌혈은 아프고 위험하다"', fakta: "헌혈 절차는 철저한 안전이 보장됩니다. 사용되는 주삿바늘은 멸균된 일회용 의료기기이며, 전문 간호사가 직접 시행합니다. 느껴지는 통증은 살짝 개미에게 물린 정도의 가벼운 느낌입니다." },
          { ragu: '"헌혈을 하면 몸이 무기력해진다"', fakta: "기증된 혈액량은 충분한 수분 섭취를 통해 수십 시간 이내에 보충됩니다. 골수에서 즉시 새로운 신선한 세포를 만들기 시작하므로 오히려 몸이 더 가볍고 활력 있게 느껴집니다." },
          { ragu: '"헌혈은 질병 감염 위험이 있다"', fakta: "절대 불가능합니다. 주삿바늘, 혈액백, 의료용 튜브 등 모든 장비는 완벽한 무균 상태의 새 제품이며, 단 1회 사용 직후 현장에서 즉시 영구 폐기됩니다." },
          { ragu: '"나는 너무 마른 편이라 헌혈할 수 없다"', fakta: "최소 체중 기준은 45kg에 불과합니다. 체중이 기준을 초과하고 혈압 및 헤모글로빈 수치가 정상이면 안전하게 헌혈에 참여하실 수 있습니다." },
          { ragu: '"헌혈은 시간이 너무 오래 걸린다"', fakta: "실제 채혈에 소요되는 시간은 약 10~15분 정도입니다! 등록, 헤모글로빈 사전 검사, 헌혈 후 휴식을 모두 포함한 평균 소요 시간은 총 45~60분에 불과합니다." },
          { ragu: '"주삿바늘이 너무 무섭다"', fakta: "야스민 병원의 숙련된 의료진은 주삿바늘 공포증이 있는 기증자를 위해 편안한 전환 요령, 인체공학적 침대, 심신 안정 기술로 편안한 진행을 도와드립니다." }
        ];
      case 'ZH':
        return [
          { ragu: '"无偿献血既疼又危险"', fakta: "献血流程保证绝对安全。所用的针头均为无菌、一次性医用针具，并由具备专业资质的护士操作。感觉仅像被轻微蚊虫叮咬一样。" },
          { ragu: '"献血会导致身体虚弱"', fakta: "献好的血液在摄入充足水分后，会在数十小时内得到补充。骨髓会立即被刺激生成新鲜、富氧的红细胞，使身体反而感到更有活力。" },
          { ragu: '"献血有感染疾病的风险"', fakta: "这绝对不可能发生。从针头、血袋到医用软管的所有设备均绝对无菌、全新，并在单次使用后立即就地销毁。" },
          { ragu: '"我太瘦了，不能献血"', fakta: "最低体重标准仅为45公斤。只要您的体重超过该标准，且血压和血红蛋白（HB）水平合格，您就完全具备献血资格。" },
          { ragu: '"献血需要花费极长的时间"', fakta: "实际采血过程仅需10至15分钟！包含登记、血红蛋白筛查及献血后休息在内的完整流程，平均仅需45-60分钟。" },
          { ragu: '"我非常害怕注射针头"', fakta: "雅斯敏医院的医护人员经过专业培训，能通过放松分散法、人体工学床和舒缓注意力等方式帮助有针头恐惧症的献血者顺利完成献血。" }
        ];
      case 'AR':
        return [
          { ragu: '"التبرع بالدم مؤلم وخطير"', fakta: "عملية التبرع بالدم آمنة تماماً ومضمونة. الإبر المستخدمة معقمة وطبية وتُستخدم لمرة واحدة فقط، ويقوم بالعمل ممرضون مؤهلون. الشعور المصاحب لا يتعدى لسعة بسيطة كقرصة نملة." },
          { ragu: '"التبرع بالدم يضعف الجسم ويسبب الخمول"', fakta: "يتم تعويض حجم الدم المتبرع به في غضون بضع عشرات من الساعات من خلال شرب السوائل الكافية. يبدأ نخاع العظم فوراً بإنتاج خلايا دم جديدة، مما يمنح الجسم نشاطاً وحيوية أكبر." },
          { ragu: '"التبرع بالدم قد ينقل الأمراض"', fakta: "هذا مستحيل تماماً. جميع الأدوات من الإبر وحقائب الدم والأنابيب الطبية معقمة مئة بالمئة، جديدة، ويتم إتلافها فوراً بعد استخدامها لمرة واحدة." },
          { ragu: '"وزني خفيف جداً للتبرع بالدم"', fakta: "الحد الأدنى للوزن المطلق هو ٤٥ كجم فقط. إذا كان وزنك يتجاوز ذلك وضغط الدم ونسبة الهيموجلوبين لديك جيدة، فأنت مؤهل تماماً للتبرع." },
          { ragu: '"التبرع بالدم يستغرق وقتاً طويلاً"', fakta: "عملية سحب الدم الفعلية تستغرق من ١٠ إلى ١٥ دقيقة فقط! بينما يستغرق إجمالي وقت التسجيل، وفحص الهيموجلوبين، والاستراحة بعد التبرع حوالي ٤٥ إلى ٦٠ دقيقة في المتوسط." },
          { ragu: '"أخاف بشدة من الإبر وحقن الدم"', fakta: "الطاقم الطبي في مستشفى ياسمين مدرب على التعامل مع حالات رهاب الإبر بتقنيات تشتيت الانتباه المهدئة، وأسرّة مريحة، وأساليب استرخاء تجعل التجربة مريحة تماماً." }
        ];
      default:
        return [
          { ragu: '"Blood donation is painful and dangerous"', fakta: "The donation procedure is guaranteed to be highly safe. The needle used is a sterile, single-use medical tool, handled by certified nurses. The sensation felt is only like a mild ant bite." },
          { ragu: '"Blood donation makes the body weak"', fakta: "The volume of donated blood will be replenished within a few dozen hours through adequate fluid intake. The bone marrow immediately starts producing fresh cells, making the body feel even fitter." },
          { ragu: '"Blood donation risks transmitting diseases"', fakta: "Absolutely impossible. All equipment, from needles to blood bags and medical tubing, is strictly sterile, brand new, and immediately destroyed after a single use." },
          { ragu: '"I am too skinny to donate"', fakta: "The minimum weight limit is only 45 kg. If your weight is above that and your blood pressure/HB levels are good, you are fully eligible to donate blood." },
          { ragu: '"Blood donation takes a very long time"', fakta: "The actual blood extraction only takes about 10 to 15 minutes! The total duration for registration, HB screening, and post-donation rest averages only 45-60 minutes." },
          { ragu: '"I am extremely afraid of needles"', fakta: "Medical personnel at RS Yasmin are trained to handle patients with needle phobias using relaxing distraction techniques, ergonomic beds, and calming focus diversion." }
        ];
    }
  };

  const getLocalizedFaqs = (currentLang: string) => {
    switch (currentLang) {
      case 'ID':
        return [
          { q: "Apa itu Club Donor Darah RS Yasmin?", a: "Club Donor Darah RS Yasmin adalah wadah resmi bagi masyarakat Banyuwangi untuk rutin mendonorkan darah secara aman, nyaman, sekaligus mengadopsi donor darah sebagai bagian dari gaya hidup sehat terintegrasi." },
          { q: "Apakah ada biaya pendaftaran untuk bergabung?", a: "Tidak ada biaya sama sekali. Keanggotaan program kemanusiaan ini 100% gratis untuk seluruh lapisan masyarakat." },
          { q: "Berapa kali dalam setahun seseorang diperbolehkan donor darah?", a: "Berjarak aman minimal 12 minggu (3 bulan), sehingga pria maupun wanita dapat berdonor sebanyak 3-4 kali dalam satu tahun kalender." },
          { q: "Bagaimana jika saya memiliki golongan darah yang sangat langka?", a: "Pendonor bergolongan darah langka (seperti AB- atau rhesus negatif) sangat kami cari! Kami akan mendata golongan darah langka dalam database khusus (On-Call Prioritas) untuk menjamin ketersediaan darah di saat kritis." },
          { q: "Apakah diperbolehkan donor darah ketika sedang menstruasi?", a: "Sangat boleh, asalkan kondisi fisik Anda fit, tidak merasakan nyeri kram perut yang hebat, dan hasil pengetesan kadar hemoglobin (HB) berada di atas batas normal minimum (12,5 g/dL)." },
          { q: "Apakah donor darah aman dilakukan bagi lansia?", a: "Bagi pendonor pemula, batas usia maksimal adalah 60 tahun. Namun bagi anggota yang sudah rutin mendonor sejak kepemudaan, donor darah dapat dilanjutkan hingga usia 65 tahun atas persetujuan ketat dokter spesialis." },
          { q: "Bagaimana mekanisme bantuan jika keluarga saya membutuhkan darah?", a: "Sebagai pemegang kartu anggota aktif Club Donor Darah RS Yasmin, Anda dan keluarga inti memperoleh hak prioritas pencarian stok darah di PMI maupun unit bank darah RS Yasmin di kala darurat." },
          { q: "Bagaimana saya mengetahui jadwal agenda donor yang akan datang?", a: "Setiap anggota terdaftar akan dikoordinasikan dalam broadcast SMS/WhatsApp secara terjadwal untuk mendapatkan pemberitahuan jadwal donor keliling (Mobile Unit) dan donor massal di daerah terdekat." }
        ];
      case 'KR':
        return [
          { q: "야스민 병원 사랑의 헌혈 클럽이란 무엇인가요?", a: "야스민 병원 헌혈 클럽은 바뉴왕이 시민들이 일상에서 정기적으로 안전하고 편안하게 헌혈할 수 있도록 지원하며, 헌혈을 하나의 통합 건강 라이프스타일로 구축해 가는 공식 기구입니다." },
          { q: "클럽 가입에 별도의 회비나 비용이 있나요?", a: "전혀 없습니다. 이 고귀한 인도주의 프로그램의 회원 가입 및 모든 혜택은 일반 대중 모두에게 100% 무료로 개방되어 있습니다." },
          { q: "1년에 몇 번까지 헌혈을 할 수 있나요?", a: "신체의 안전한 회복을 위해 최소 12주(3개월)의 기간을 두고, 남녀 모두 1년에 평균 3~4회 정도 안심하고 헌혈에 동참하실 수 있습니다." },
          { q: "골격적으로 아주 희귀한 혈액형인데 가입이 가능한가요?", a: "희귀 혈액형(AB형 또는 Rh- 마이너스 등) 기증자를 적극적으로 찾고 있습니다! 당사는 위급한 순간 신속한 수혈을 보장할 수 있도록 이분들을 온콜(On-Call) 우선권 전용 데이터베이스에 기록 관리합니다." },
          { q: "여성의 생리 기간 중에도 헌혈이 가능한가요?", a: "네, 완전히 가능합니다. 당일 신체 컨디션이 우수하고 극심한 생리통이나 빈혈 증상이 없으며, 당일 간이 검사에서 헤모글로빈(HB) 수치가 기준치(12.5 g/dL) 이상으로 검출되면 헌혈에 참여하실 수 있습니다." },
          { q: "고령의 노인도 헌혈 안전성에 문제가 없나요?", a: "신규 헌혈자의 경우 최대 신청 연령은 60세입니다. 단, 청년기부터 정기적으로 헌혈을 지속해 오신 클럽 회원의 경우에는 전문의의 세밀한 신체 상태 판정을 통해 만 65세까지 지속적으로 채혈을 받으실 수 있습니다." },
          { q: "가족이 급하게 혈액 지원을 필요로 할 때 혜택은 어떤가요?", a: "야스민 헌혈 클럽의 정회원 카드를 소지하시면, 비상 재난 시 본인 및 직계 가족을 위한 혈액 수급 시 대한적십자사(PMI) 및 야스민 병원 혈액은행에서 전면 우선 지원 특권을 받게 됩니다." },
          { q: "향후 헌혈 행사 및 모바일 이동식 채혈 차량 일정은 어디서 보나요?", a: "등록된 정회원 연락처를 통해 주기적인 SMS 및 왓츠앱(WhatsApp) 알림이 자동으로 전송되며, 가장 가까운 지역의 이동식 헌혈(Mobile Unit)과 단체 헌혈 캠페인 일정을 안내해 드립니다." }
        ];
      case 'ZH':
        return [
          { q: "什么是雅斯敏综合医院无偿献血爱心俱乐部？", a: "该俱乐部是面向印尼巴纽旺伊全体市民成立的官方无偿献血互助平台，旨在让无偿献血行为更加安全、规范、舒适，并引导市民将定期献血视作现代健康生活的核心组成部分。" },
          { q: "注册加入俱乐部需要缴纳费用吗？", a: "不需要任何费用。这是一项旨在挽救生命的人道主义公益项目，面向社会所有群体百分之百免费开放，不收取任何形式的会员或年费。" },
          { q: "一个人一年内最多可以参与几次献血？", a: "基于医学上的安全保护，两次献血之间应至少间隔 12 周（即 3 个月）。在符合身体条件的前提下，男性及女性每年可献血 3 至 4 次。" },
          { q: "如果我是极为稀有的特殊血型（熊猫血），可以加入吗？", a: "我们非常渴求和寻找稀有血型（如 Rh 阴性血、AB- 等）的爱心人士！我们将把稀有血型档案录入专用的“紧急召唤优先库”，以确保在最危急的临床救治时刻能快速调度血液。" },
          { q: "女性在生理期（月经期）期间可以献血吗？", a: "完全可以。只要您当天精神状态良好、无剧烈腹痛或明显不适，且现场指尖血红蛋白 (HB) 浓度测定不低于最低正常值（12.5 g/dL）即可安全献血。" },
          { q: "老年人进行献血是否安全？", a: "对于首次献血的市民，最高年龄上限为 60 周岁；但若您自年轻起便保持长期规律献血，经门诊临床医生对身体状况进行严格医学评估同意后，献血年龄最长可放宽延至 65 周岁。" },
          { q: "如果我的家庭成员紧急需要输血，俱乐部能提供什么帮助？", a: "作为雅斯敏医院无偿献血俱乐部持卡的正式活跃会员，在发生紧急医疗危机时，您和您的直系亲属将享有通过 PMI 及雅斯敏医院储血库优先寻找并配型调拨急救血液的特别权利。" },
          { q: "我该如何获知俱乐部未来的采血行程和流动采血车 jadwal？", a: "每位成功登记的会员都将通过其预留的手机及 WhatsApp 接收到定向的日程推播，及时获取流动采血车（Mobile Unit）在您社区及附近学校、商圈的最新停靠计划。" }
        ];
      case 'AR':
        return [
          { q: "ما هو نادي التبرع بالدم في مستشفى ياسمين؟", a: "نادي التبرع بالدم في مستشفى ياسمين هو منصة رسمية لأهالي بانيوانجي للتبرع بالدم بانتظام وأمان وراحة، مع تبني التبرع بالدم كجزء من نمط حياة صحي متكامل." },
          { q: "هل هناك رسوم للتسجيل والانضمام للنادي؟", a: "لا توجد أي رسوم على الإطلاق. العضوية في هذا البرنامج الإنساني مجانية بنسبة ١٠٠٪ لجميع فئات المجتمع." },
          { q: "كم مرة يُسمح للشخص بالتبرع بالدم خلال العام؟", a: "بفاصل زمني آمن لا يقل عن ١٢ أسبوعاً (٣ أشهر)، يمكن للرجال والنساء التبرع بالدم بمعدل ٣ إلى ٤ مرات في السنة الميلادية الواحدة." },
          { q: "ماذا لو كانت فصيلة دمي نادرة جداً؟", a: "نحن نبحث بشدة عن المتبرعين بفصائل الدم النادرة (مثل فصيلة AB أو ريزوس سالب)! نقوم بجدولة هذه الفصائل في قاعدة بيانات خاصة (الاتصال الطارئ ذو الأولوية) لضمان توفر الدم في اللحظات الحرجة." },
          { q: "هل يُسمح بالتبرع بالدم أثناء فترة الدورة الشهرية؟", a: "نعم وبكل تأكيد، بشرط أن تكون حالتك البدنية ممتازة، وألا تشعري بآلام وتقلصات شديدة، وأن تكون نتيجة فحص مستوى الهيموجلوبين (HB) أعلى من الحد الأدنى المقبول (١٢.٥ جم/ديسيلتر)." },
          { q: "هل التبرع بالدم آمن لكبار السن؟", a: "بالنسبة للمتبرعين لأول مرة، الحد الأقصى للسن هو ٦٠ عاماً. ولكن للأعضاء الذين يتبرعون بانتظام منذ شبابهم، يمكن مواصلة التبرع حتى سن ٦٥ عاماً بعد موافقة طبية دقيقة ومشددة من الطبيب المختص." },
          { q: "ما هي آلية المساعدة إذا كانت عائلتي بحاجة طارئة للدم؟", a: "بصفتك حاملاً لبطاقة العضوية النشطة في نادي التبرع بالدم في مستشفى ياسمين، تحصل أنت وعائلتك المباشرة على الأولوية القصوى لتوفير فصائل الدم المطلوبة من جمعية الهلال الأحمر (PMI) وبنك الدم بمستشفى ياسمين في حالات الطوارئ." },
          { q: "كيف يمكنني معرفة مواعيد حملات التبرع بالدم القادمة؟", a: "سيتم إرسال إشعارات دورية ومجدولة لجميع الأعضاء عبر رسائل WhatsApp النصية القصيرة لإبلاغهم بمواعيد وأماكن حملات التبرع بالدم المتنقلة (Mobile Unit) والحملات الجماعية في المناطق المجاورة." }
        ];
      default:
        return [
          { q: "What is the RS Yasmin Blood Donor Club?", a: "The RS Yasmin Blood Donor Club is an official platform for the people of Banyuwangi to regularly donate blood safely and comfortably, while adopting blood donation as part of an integrated healthy lifestyle." },
          { q: "Is there any registration fee to join?", a: "There is no fee at all. Membership in this humanitarian program is 100% free for all layers of society." },
          { q: "How many times a year can a person donate blood?", a: "With a safe interval of at least 12 weeks (3 months), men and women can donate 3-4 times in a calendar year." },
          { q: "What if I have a very rare blood type?", a: "Donors with rare blood types (such as AB- or Rhesus negative) are highly sought after! We register rare blood types in a dedicated database (On-Call Priority) to ensure blood availability in times of crisis." },
          { q: "Is blood donation allowed during menstruation?", a: "Yes, absolutely, as long as you are physically fit, not experiencing severe menstrual cramps, and your hemoglobin (HB) levels are above the minimum normal limit (12.5 g/dL)." },
          { q: "Is blood donation safe for the elderly?", a: "For first-time donors, the maximum age limit is 60. However, for members who have donated regularly since youth, donation can continue until age 65 with strict approval from a specialist." },
          { q: "What is the assistance mechanism if my family needs blood?", a: "As an active cardholder of the RS Yasmin Blood Donor Club, you and your immediate family receive priority status when searching for blood stocks at PMI and the RS Yasmin blood bank during emergencies." },
          { q: "How do I find out about upcoming donation schedules?", a: "Every registered member is coordinated via scheduled SMS/WhatsApp broadcasts to receive notifications about mobile unit schedules and mass donation drives in the nearest areas." }
        ];
    }
  };

  const manfaatDonor = getLocalizedManfaat(lang);
  const syaratDonor = getLocalizedSyarat(lang);
  const keistimewaanAnggota = getLocalizedKeistimewaan(lang);
  const mitigasiKeraguan = getLocalizedMitigasi(lang);
  const faqs = getLocalizedFaqs(lang);


  return (
    <div id="club-donor-darah-page" className="bg-[#FAF9F5] text-left min-h-screen font-sans">
      
      {/* ==================== 1. HERO SECTION ==================== */}
      <div className="relative overflow-hidden bg-gradient-to-b from-red-50 via-rose-50 to-[#FAF9F5] py-20 border-b border-rose-100">
        <div className="absolute top-10 right-10 w-28 h-28 bg-red-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-36 h-36 bg-red-300/10 rounded-full blur-3xl" />

        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="font-display text-xs text-white font-black uppercase tracking-wider bg-red-600 px-4 py-2 rounded-full inline-flex items-center gap-2 border-2 border-headings shadow-[3px_3px_0px_#1e1e1e]">
                <Droplet className="h-4.25 w-4.25 fill-current text-white animate-bounce" />
                {t.badge || '#DONOR_DARAH_GAYA_HIDUP'}
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-headings leading-[1.1] tracking-tight">
                {t.title}
              </h1>
              
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="bg-red-50 text-red-750 font-display text-xs font-black px-4 py-1.5 rounded-full border border-red-100">
                  {lang === 'ID' ? 'Donor Darah' : 'Blood Donation'}
                </span>
                <span className="bg-red-50 text-red-750 font-display text-xs font-black px-4 py-1.5 rounded-full border border-red-100">
                  {lang === 'ID' ? 'Sehat Berenergi' : 'Healthy Energy'}
                </span>
                <span className="bg-red-50 text-red-750 font-display text-xs font-black px-4 py-1.5 rounded-full border border-red-100">
                  {lang === 'ID' ? 'Peduli Sesama' : 'Social Care'}
                </span>
                <span className="bg-red-50 text-red-750 font-display text-xs font-black px-4 py-1.5 rounded-full border border-red-100">
                  {lang === 'ID' ? 'Gaya Hidup Modern' : 'Modern Lifestyle'}
                </span>
              </div>

              <p className="text-gray-650 text-base sm:text-lg max-w-2xl leading-relaxed">
                {t.desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <a
                  href="#pendaftaran-donor-form"
                  className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-display text-sm font-black tracking-wider rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] transition-all text-center cursor-pointer"
                >
                  {t.regBtn || 'Daftar Jadi Donor'}
                </a>
                <a
                  href="#jadwal-donor-section"
                  className="px-8 py-3.5 bg-white hover:bg-slate-50 text-headings font-display text-sm font-black tracking-wider rounded-2xl border-3 border-divider shadow-[4px_4px_0px_#e5e7eb] text-center cursor-pointer"
                >
                  {lang === 'ID' ? 'Jadwal Donor' : 'Donation Schedule'}
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-divider aspect-[1.4/1] group bg-red-50/60 w-full ml-auto mr-0">
                
                {/* Visual presentation - playful background and character */}
                <div className="absolute inset-0">
                  <SafeImage 
                    src={clubDonorImg} 
                    alt="Club Donor Darah Yasmin" 
                    className="w-full h-full object-fill transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================== 2. TENTANG CLUB DONOR DARAH ==================== */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs text-red-600 font-bold uppercase tracking-widest bg-red-50 border border-red-150 px-3 py-1 rounded-full">
                {lang === 'ID' ? 'TENTANG CLUB' : 'ABOUT THE CLUB'}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-headings leading-[1.2]">
                {lang === 'ID' ? 'Berbagi Setetes Harapan, Meregenerasi Stamina Diri' : 'Share a Drop of Hope, Regenerate Your Stamina'}
              </h2>
              <p className="text-gray-655 text-xs sm:text-sm leading-relaxed">
                {lang === 'ID' 
                  ? 'Club Donor Darah RS Yasmin hadir sebagai wadah dinamis masyarakat Banyuwangi untuk saling bersolidaritas kemanusiaan. Kami yakin bahwa donor darah bukan semata-mata kewajiban sosial, melainkan sudah berevolusi menjadi salah satu gaya hidup penunjang kebugaran metabolisme modern.'
                  : 'RS Yasmin Blood Donor Club is a dynamic platform for the Banyuwangi community to express humanitarian solidarity. We believe that blood donation is not just a social obligation, but has evolved into a modern lifestyle that supports metabolic fitness.'}
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#FAF9F5] border-2 border-divider rounded-3xl p-8 space-y-4">
              <h3 className="font-display font-black text-sm text-headings">
                {lang === 'ID' ? 'Apa Saja Manfaat Organik Rutin Mendonor?' : 'What Are the Organic Benefits of Regular Donation?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold">❤️</span>
                  <div>
                    <strong className="text-headings block">{lang === 'ID' ? 'Kesehatan Jantung Terjaga' : 'Protected Heart Health'}</strong>
                    <span className="text-gray-500 text-[11px] leading-tight">
                      {lang === 'ID' 
                        ? 'Kurangi beban viskositas kekentalan darah pemicu penyumbatan pembuluh.'
                        : 'Reduce blood viscosity, which triggers vessel blockage.'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold">🩸</span>
                  <div>
                    <strong className="text-headings block">{lang === 'ID' ? 'Regulasi Zat Besi Seimbang' : 'Balanced Iron Levels'}</strong>
                    <span className="text-gray-500 text-[11px] leading-tight">
                      {lang === 'ID'
                        ? 'Mengeluarkan penimbunan zat besi berlebih demi kesehatan sel hati.'
                        : 'Eliminate excess iron accumulation for liver cell health.'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold">🔄</span>
                  <div>
                    <strong className="text-headings block">{lang === 'ID' ? 'Produksi Darah Baru Fresh' : 'Fresh Blood Production'}</strong>
                    <span className="text-gray-500 text-[11px] leading-tight">
                      {lang === 'ID'
                        ? 'Memicu pembuatan eritrosit muda baru yang segar mengangkut oksigen.'
                        : 'Trigger the production of young, fresh red blood cells to transport oxygen.'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold">🧠</span>
                  <div>
                    <strong className="text-headings block">{lang === 'ID' ? 'Kesejahteraan & Kebahagiaan' : 'Well-being & Happiness'}</strong>
                    <span className="text-gray-500 text-[11px] leading-tight">
                      {lang === 'ID'
                        ? 'Hormon endorfin melimpah karena kepuasan murni menolong nyawa.'
                        : 'Abundant endorphins due to pure satisfaction from saving lives.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================== 3. MANFAAT DONOR DARAH ==================== */}
      <div className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2.5 w-full max-w-full mx-auto">
            <div>
              <span className="inline-block font-mono text-xs text-red-650 font-black tracking-wider uppercase bg-red-50 border border-red-150 px-3 py-1 rounded-full">
                {lang === 'ID' ? 'MANFAAT KESEHATAN ORGANIK' : 'ORGANIC HEALTH BENEFITS'}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-headings w-full max-w-full mx-auto">
              {t.benefitsTitle || '7 Manfaat Nyata Donor Darah Secara Teratur'}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed w-full max-w-full mx-auto">
              {t.benefitsDesc || 'Secara ilmiah medis, mendonorkan darah secara teratur terbukti memberikan manfaat kesehatan luar biasa bagi tubuh pendonor sekaligus menyelamatkan jiwa pasien kritis.'}
            </p>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {manfaatDonor.map((x) => (
               <div key={x.no} className="bg-white border-2 border-divider p-6 sm:p-7 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all shadow-2xs">
                 <div className="space-y-3.5">
                   <span className="font-mono text-xs text-red-500 font-bold uppercase bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                     {t.manfaatNo || 'Benefit'} 0{x.no}
                   </span>
                   <h3 className="font-sans font-bold text-sm sm:text-base text-headings mt-1">{x.title}</h3>
                   <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">{x.desc}</p>
                 </div>
                 <div className="text-[10px] sm:text-xs font-mono text-[#0B4F4A] font-bold mt-4">
                   ✓ {lang === 'ID' ? 'VERIFIKASI MEDIS RS YASMIN' : 'RS YASMIN MEDICAL VERIFICATION'}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* ==================== 4. SYARAT MENJADI DONOR DARAH ==================== */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-red-600 font-bold uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {lang === 'ID' ? 'KRITERIA KELAYAKAN' : 'ELIGIBILITY CRITERIA'}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {lang === 'ID' ? 'Syarat Utama Menjadi Pendonor Darah' : 'Main Requirements to Become a Blood Donor'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 border border-divider rounded-3xl bg-white overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F5] border-b border-divider text-headings font-display font-black uppercase text-[10px]">
                    <th className="p-4 w-12 text-center">No</th>
                    <th className="p-4 w-1/3">{lang === 'ID' ? 'Syarat Mutlak' : 'Requirement'}</th>
                    <th className="p-4 text-gray-600">{lang === 'ID' ? 'Penjelasan & Keterangan Tambahan' : 'Explanation & Additional Details'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/60">
                  {syaratDonor.map((s) => (
                    <tr key={s.no} className="hover:bg-rose-50/10">
                      <td className="p-4 text-center font-mono text-gray-400 font-bold">{s.no}</td>
                      <td className="p-4 font-display font-bold text-headings">{s.syarat}</td>
                      <td className="p-4 text-gray-500 leading-relaxed">{s.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 bg-red-50/20 border-3 border-red-100 rounded-3xl p-6 space-y-5">
              <div className="flex gap-2 text-red-650 shrink-0">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-red-750">
                  {lang === 'ID' ? 'Catatan Penting Tim Medis' : 'Important Medical Notes'}
                </h4>
              </div>
              <ul className="space-y-3.5 text-xs text-gray-655">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span>
                    {lang === 'ID' ? (
                      <><strong>Ibu hamil</strong>, sedang haid deras, dan ibu menyusui (usia bayi &lt; 6 bulan) secara tegas <b>tidak diperbolehkan</b> donor terlebih dahulu.</>
                    ) : (
                      <><strong>Pregnant women</strong>, those with heavy periods, and breastfeeding mothers (infant age &lt; 6 months) are strictly <b>not allowed</b> to donate first.</>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span>
                    {lang === 'ID' ? (
                      <>Penderita riwayat medis kronis tertentu (pembawa Hepatitis B/C, HIV, Sifilis, epilepsi, dsb) <b>tidak diperbolehkan</b> berdonor demi keamanan resipien.</>
                    ) : (
                      <>Patients with certain chronic medical histories (carriers of Hepatitis B/C, HIV, Syphilis, epilepsy, etc.) are <b>not allowed</b> to donate for recipient safety.</>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span>
                    {lang === 'ID' ? (
                      <>Sangat wajib <strong>sarapan makan berat & minum air putih yang cukup</strong> 3 jam sebelum memulai pengambilan darah. Jangan berdonor dengan perut kosong!</>
                    ) : (
                      <>It is highly mandatory to <strong>eat a heavy breakfast & drink enough water</strong> 3 hours before blood collection. Do not donate on an empty stomach!</>
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== 5. CARA BERGABUNG & FORMULIR ==================== */}
      <div id="pendaftaran-donor-form" className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2.5 w-full max-w-full mx-auto">
            <div>
              <span className="inline-block font-mono text-xs text-red-655 font-bold uppercase tracking-widest bg-rose-50 border border-red-150 px-3 py-1 rounded-full">
                {t.guidelinesBadge || 'MEMBER ENROLLMENT'}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-headings w-full max-w-full mx-auto">
              {t.guidelinesTitle || 'Cara Gabung & Formulir Pendaftaran'}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed w-full max-w-full mx-auto">
              {t.guidelinesDesc || 'Silakan isi data diri Anda dengan lengkap di bawah ini. Staff administrasi kami akan melakukan verifikasi medis saat kedatangan pertama Anda di Unit Transfusi Darah RS Yasmin.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 4 Langkah */}
            <div className="lg:col-span-4 space-y-5">
              <h3 className="font-display font-black text-base text-headings">
                📝 {lang === 'ID' ? '4 Langkah Mudah Bergabung' : '4 Easy Steps to Join'}
              </h3>
              <div className="space-y-4">
                {(t.steps || [
                  { title: '1. Pendaftaran', desc: 'Isilah formulir pendaftaran digital di samping dengan data yang valid dan benar.' },
                  { title: '2. Verifikasi Kesehatan', desc: 'Hadir di RS Yasmin untuk skrining awal (HB, Tensi, serta konsultasi dokter gratis).' },
                  { title: '3. Dapatkan ID Card', desc: 'Terima kartu tanda keanggotaan fisik maupun digital resmi berlogo RS Yasmin.' },
                  { title: '4. Mendonor Terjadwal', desc: 'Lakukan donor rutin setiap 3 bulan dan dapatkan poin serta bingkisan eksklusif.' }
                ]).map((step: any, sIdx: number) => (
                  <div key={sIdx} className="flex gap-3 bg-white p-4.5 rounded-2xl border-2 border-divider shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-headings shadow-[2px_2px_0px_#1e1e1e]">
                      {sIdx + 1}
                    </div>
                    <div className="text-xs">
                      <h4 className="font-display font-black text-headings">{step.title}</h4>
                      <p className="text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-8 bg-white border-4 border-headings rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
              {joinedDonor ? (
                <div id="donor-success-box" className="space-y-6 text-center py-6 animate-fade-in-up">
                  <span className="text-5xl animate-bounce inline-block">🩸🎉</span>
                  <h3 className="font-display font-black text-xl text-headings">
                    {t.successTitle || 'Pendaftaran Berhasil Terkirim ke Database!'}
                  </h3>
                  <p className="text-xs text-gray-550 max-w-md mx-auto">
                    {t.successText || 'Kami mengundang Anda menyimpan atau mencetak kartu tanda pengenal digital resmi sementara ini.'}
                  </p>

                  {/* Donor ID Card Mockup */}
                  <div className="w-full max-w-md mx-auto bg-gradient-to-br from-red-600 to-[#80070B] text-left rounded-3xl p-6 text-white border-3 border-headings shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                    <div className="flex justify-between items-start border-b border-white/25 pb-4">
                      <div>
                        <span className="font-mono text-[8px] font-bold tracking-widest text-red-200 block uppercase">
                          {c.heroMemberCard}
                        </span>
                        <span className="font-display font-black text-sm text-white tracking-widest uppercase">
                          {c.bloodDonorClub}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono bg-white/15 px-2.5 py-1 rounded-md border border-white/10 tracking-widest font-black uppercase">
                        YASMIN HERO
                      </span>
                    </div>

                    <div className="mt-5 space-y-2.5 pb-2 text-[11.5px]">
                      <div className="grid grid-cols-3">
                        <span className="text-red-200 text-[9.5px] font-mono uppercase">
                          {t.cardNo || 'ID PENDONOR:'}
                        </span>
                        <strong className="col-span-2 text-yellow-300 font-mono tracking-wider">{joinedDonor.id}</strong>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-red-200 text-[9.5px] font-mono uppercase">
                          {t.cardName || 'NAMA LENGKAP:'}
                        </span>
                        <span className="col-span-2 font-display font-black uppercase text-white tracking-wide">{joinedDonor.namaLengkap}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-red-200 text-[9.5px] font-mono uppercase">NIK KTP:</span>
                        <span className="col-span-2 font-mono tracking-wide text-white/90">{joinedDonor.nikKtp}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-red-200 text-[9.5px] font-mono uppercase">
                          {t.cardGoldar || 'GOLONGAN DARAH:'}
                        </span>
                        <span className="col-span-2 text-yellow-300 font-extrabold text-xs font-mono">
                          {joinedDonor.golonganDarah} ({joinedDonor.jenisKelamin === 'Laki-laki' ? c.male : joinedDonor.jenisKelamin === 'Perempuan' ? c.female : joinedDonor.jenisKelamin})
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/20 pt-3 text-[8px] font-mono text-red-200 flex justify-between uppercase">
                      <span>#BerbagiKehidupanMenjagaKesehatan</span>
                      <span>
                        {t.cardRegDate || 'REGDATE:'} {joinedDonor.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-3 text-xs">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-6 py-2.5 bg-headings text-white font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{t.btnPrint || 'Cetak Kartu Member'}</span>
                    </button>
                    <button
                      onClick={() => setJoinedDonor(null)}
                      className="px-6 py-2.5 bg-white border text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {t.btnReset || 'Daftar Kembali'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblNama || 'Nama Lengkap Sesuai KTP'} *
                      </label>
                      <input
                        required
                        type="text"
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleFormChange}
                        placeholder={c.namePlaceHolder}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl uppercase font-semibold focus:border-red-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblNiky || 'NIK / Nomor KTP'} *
                      </label>
                      <input
                        required
                        type="text"
                        name="nikKtp"
                        value={formData.nikKtp}
                        maxLength={16}
                        onChange={handleFormChange}
                        placeholder={lang === 'ID' ? 'Masukkan 16 digit NIK' : 'Enter 16-digit ID number'}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl font-mono focus:border-red-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblTempat || 'Tempat Lahir'} *
                      </label>
                      <input
                        required
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleFormChange}
                        placeholder={lang === 'ID' ? 'Contoh: Banyuwangi' : 'e.g. Banyuwangi'}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl focus:border-red-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblTanggal || 'Tanggal Lahir'} *
                      </label>
                      <input
                        required
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleFormChange}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl focus:border-red-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblGender || 'Jenis Kelamin'}
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleFormChange}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl font-bold focus:border-red-500 outline-none"
                      >
                        <option value="Laki-laki">{c.male}</option>
                        <option value="Perempuan">{c.female}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblGoldar || 'Golongan Darah'}
                      </label>
                      <select
                        name="golonganDarah"
                        value={formData.golonganDarah}
                        onChange={handleFormChange}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl font-black font-mono focus:border-red-500 outline-none"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        <option value="Belum Tahu">{c.unknown}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblKerja || 'Pekerjaan Utama'}
                      </label>
                      <input
                        type="text"
                        name="pekerjaan"
                        value={formData.pekerjaan}
                        onChange={handleFormChange}
                        placeholder={c.workPlaceHolder}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl focus:border-red-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblWa || 'No WhatsApp Aktif'} *
                      </label>
                      <input
                        required
                        type="tel"
                        name="noWa"
                        value={formData.noWa}
                        onChange={handleFormChange}
                        placeholder="08XXXXXXXXXX"
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl font-mono focus:border-red-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                        {t.lblPernah || 'Sudah Pernah Donor Sebelumnya?'}
                      </label>
                      <select
                        name="pernahDonor"
                        value={formData.pernahDonor}
                        onChange={handleFormChange}
                        className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl font-bold focus:border-red-500 outline-none"
                      >
                        <option value="Belum">{c.never}</option>
                        <option value="Ya">{c.yesHave}</option>
                      </select>
                    </div>
                    {formData.pernahDonor === 'Ya' && (
                      <div className="space-y-1.5 animate-fade-in-up">
                        <label className="block text-[#BD1E24] font-display font-black uppercase text-[9.5px]">
                          {t.lblTerakhir || 'Kapan Terakhir Kali Donor?'} *
                        </label>
                        <input
                           required={formData.pernahDonor === 'Ya'}
                           type="text"
                           name="terakhirDonor"
                           value={formData.terakhirDonor}
                           onChange={handleFormChange}
                           placeholder={c.lastDonorPlaceHolder}
                           className="w-full bg-white border-2 border-[#BD1E24] p-3.5 rounded-xl focus:border-red-500 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-black uppercase text-[9.5px]">
                      {t.lblDomisili || 'Alamat Domisili Lengkap Saat Ini'} *
                    </label>
                    <textarea
                      required
                      name="alamatDomisili"
                      value={formData.alamatDomisili}
                      onChange={handleFormChange}
                      rows={2}
                      placeholder={c.alamatPlaceHolder}
                      className="w-full bg-[#FAF9F5]/40 border-2 border-divider p-3.5 rounded-xl focus:border-red-500 focus:bg-white outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      disabled={loading}
                      type="submit"
                      className="px-10 py-4 bg-red-600 hover:bg-red-700 disabled:bg-rose-350 text-white font-display text-xs font-black tracking-widest rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[1px_1px_0px_#1e1e1e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
                    >
                      {loading ? c.sendingData : (t.btnSubmit || 'KIRIM DATA & GABUNG SEBAGAI DONOR')}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ==================== 6. KEISTIMEWAAN ANGGOTA ==================== */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2.5 w-full max-w-full mx-auto">
            <div>
              <span className="inline-block font-mono text-xs text-red-655 font-bold uppercase tracking-widest leading-none bg-rose-50 border border-red-150 px-3 py-1 rounded-full">
                {c.memberPrivileges}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-headings w-full max-w-full mx-auto">
              {c.memberPrivilegesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keistimewaanAnggota.map((k) => (
              <div key={k.no} className="border-2 border-divider rounded-2xl p-6 sm:p-7 hover:border-rose-250 hover:border-red-200 transition-all bg-[#FAF9F5]/25 flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center font-mono text-xs sm:text-sm font-black text-red-600 shrink-0">
                  {k.no}
                </div>
                <div className="text-left space-y-1">
                  <h3 className="font-sans font-bold text-sm sm:text-base text-headings leading-tight">{k.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-450 leading-relaxed font-sans">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 7. JADWAL DONOR DARAH RUTIN ==================== */}
      <div id="jadwal-donor-section" className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-red-600 font-bold uppercase tracking-widest bg-red-50 border border-red-150 px-3 py-1 rounded-full">
              {c.routineDonation}
            </span>
            <h3 className="font-display font-black text-2xl text-headings">
              {c.routineDonationTitle}
            </h3>
            <p className="text-gray-400 text-xs">
              {c.routineDonationDesc}
            </p>
          </div>

          <div className="border border-divider rounded-3xl overflow-hidden bg-white w-full shadow-xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-red-50/15 border-b border-divider text-headings font-display font-black uppercase text-[10px]">
                  <th className="p-4">{c.opDays}</th>
                  <th className="p-4">{c.svcHours}</th>
                  <th className="p-4">{c.location}</th>
                  <th className="p-4">{c.desc}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider/70">
                <tr>
                  <td className="p-4 font-bold text-headings font-display">
                    {c.monSat}
                  </td>
                  <td className="p-4 font-mono font-bold text-red-650">08.00 - 14.00 WIB</td>
                  <td className="p-4 font-semibold text-gray-600">RS Yasmin - Unit Donor Darah</td>
                  <td className="p-4 text-gray-500">
                    {c.routineDesc}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-headings font-display">
                    {c.sunday}
                  </td>
                  <td className="p-4 font-mono font-bold text-red-650">08.00 - 12.00 WIB</td>
                  <td className="p-4 font-semibold text-gray-600">RS Yasmin - Unit Donor Darah</td>
                  <td className="p-4 text-gray-500">
                    {c.sundayDesc}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-headings font-display">
                    {c.specialEvent}
                  </td>
                  <td className="p-4 font-mono text-gray-400 font-medium">
                    {c.announcedPeriodically}
                  </td>
                  <td className="p-4 font-semibold text-gray-600">
                    {c.mobileUnitLoc}
                  </td>
                  <td className="p-4 text-gray-500">
                    {c.mobileUnitDesc}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== 8. EVENT DAN KEGIATAN CLUB ==================== */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-red-655 font-bold uppercase tracking-widest">
              {c.majorActivities}
            </span>
            <h3 className="font-display font-black text-2xl text-headings">
              {c.majorActivitiesTitle}
            </h3>
          </div>

          <div className="border border-divider rounded-3xl overflow-hidden bg-white w-full shadow-2xs divide-y divide-divider">
            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1 text-left">
                <span className="bg-red-50 text-red-750 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-red-100 uppercase">
                  {c.threeMonthProg}
                </span>
                <h4 className="font-display font-black text-sm text-headings">
                  🩸 {c.massDonation}
                </h4>
                <p className="text-gray-450 text-[11px] leading-relaxed">
                  {c.massDonationDesc}
                </p>
              </div>
              <span className="font-mono font-black text-red-600 italic uppercase bg-red-50 border border-red-100 px-3 py-1 rounded">
                {c.every3Months}
              </span>
            </div>

            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1 text-left">
                <span className="bg-amber-50 text-amber-700 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-amber-100 uppercase">
                  {c.academicProg}
                </span>
                <h4 className="font-display font-black text-sm text-headings">
                  🏫 {c.schoolCampus}
                </h4>
                <p className="text-gray-450 text-[11px] leading-relaxed">
                  {c.schoolCampusDesc}
                </p>
              </div>
              <span className="font-mono font-black text-amber-700 italic uppercase bg-amber-50 border border-amber-100 px-3 py-1 rounded">
                {c.everySemester}
              </span>
            </div>

            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1 text-left">
                <span className="bg-blue-50 text-blue-700 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-blue-100 uppercase">
                  {c.corpSocialProg}
                </span>
                <h4 className="font-display font-black text-sm text-headings">
                  🏢 {c.corpPartner}
                </h4>
                <p className="text-gray-450 text-[11px] leading-relaxed">
                  {c.corpPartnerDesc}
                </p>
              </div>
              <span className="font-mono font-black text-blue-700 italic uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded">
                By Request
              </span>
            </div>

            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1 text-left">
                <span className="bg-purple-50 text-purple-700 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-purple-100 uppercase">
                  {c.fellowshipProg}
                </span>
                <h4 className="font-display font-black text-sm text-headings">
                  🎉 {c.gatheringSymposium}
                </h4>
                <p className="text-gray-450 text-[11px] leading-relaxed">
                  {c.gatheringSymposiumDesc}
                </p>
              </div>
              <span className="font-mono font-black text-purple-700 italic uppercase bg-purple-50 border border-purple-100 px-3 py-1 rounded">
                {c.every6Months}
              </span>
            </div>

            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1 text-left">
                <span className="bg-emerald-50 text-emerald-700 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-emerald-100 uppercase">
                  {c.appreciationProg}
                </span>
                <h4 className="font-display font-black text-sm text-headings">
                  🏆 {c.dedicatedDonor}
                </h4>
                <p className="text-gray-450 text-[11px] leading-relaxed">
                  {c.dedicatedDonorDesc}
                </p>
              </div>
              <span className="font-mono font-black text-emerald-700 italic uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded">
                {c.everyWorldDonorDay}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 9. GALERI KEGIATAN ==================== */}
      <div className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-red-655 font-bold uppercase tracking-widest leading-none">
              {c.proudDoc}
            </span>
            <h3 className="font-display font-black text-2xl text-headings">
              {c.proudDocTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-xs">
            
            <div className="bg-white border-2 border-divider p-4.5 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all duration-300 shadow-2xs">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 border border-divider/60 flex items-center justify-center text-4xl select-none">
                📸
              </div>
              <div className="mt-3.5 space-y-1 text-left">
                <h4 className="font-display font-black text-headings">
                  {c.grandMassDonation}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {c.yasminIntegratedHall}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-divider p-4.5 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all duration-300 shadow-2xs">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-red-100 to-rose-100 border border-divider/60 flex items-center justify-center text-4xl select-none">
                🩺
              </div>
              <div className="mt-3.5 space-y-1 text-left">
                <h4 className="font-display font-black text-headings">
                  {c.integratedHbScreening}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {c.bloodTransfusionUnit}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-divider p-4.5 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all duration-300 shadow-2xs">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 border border-divider/60 flex items-center justify-center text-4xl select-none">
                🎉
              </div>
              <div className="mt-3.5 space-y-1 text-left">
                <h4 className="font-display font-black text-headings">
                  {c.fellowshipSymposium}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {c.yasminAmphitheater}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-divider p-4.5 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all duration-300 shadow-2xs">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-indigo-100 to-rose-100 border border-divider/60 flex items-center justify-center text-4xl select-none">
                🏫
              </div>
              <div className="mt-3.5 space-y-1 text-left">
                <h4 className="font-display font-black text-headings">
                  {c.socialServiceCampus}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {c.travelingMobileUnit}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-divider p-4.5 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all duration-300 shadow-2xs">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 border border-divider/60 flex items-center justify-center text-4xl select-none">
                🏆
              </div>
              <div className="mt-3.5 space-y-1 text-left">
                <h4 className="font-display font-black text-headings">
                  {c.heroAwardingNight}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {c.yasminAwardingCeremony}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-divider p-4.5 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-all duration-300 shadow-2xs">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-[#0B4F4A]/10 to-[#0B4F4A]/25 border border-divider/60 flex items-center justify-center text-4xl select-none">
                👨‍⚕️
              </div>
              <div className="mt-3.5 space-y-1 text-left">
                <h4 className="font-display font-black text-headings">
                  {c.reliableScreeningTeam}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {c.professionalStaff}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================== 10. TESTIMONI ANGGOTA ==================== */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-red-655 font-bold uppercase tracking-widest bg-rose-50 border border-red-200 px-3 py-1 rounded-full">
              {c.realTestimonials}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {c.realTestimonialsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF9F5]/40 border-2 border-divider p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full relative">
              <span className="absolute top-4 right-6 text-6xl text-red-100 font-serif leading-none select-none">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 italic leading-relaxed relative z-10 text-left">
                {c.testiSuparman}
              </p>
              <div className="pt-4 border-t border-divider mt-6 text-sm text-left">
                <strong className="block text-sm font-display font-black text-headings">
                  {c.mrSuparman}
                </strong>
                <span className="text-[11px] text-gray-405 font-mono">
                  {c.testiSuparmanSub}
                </span>
              </div>
            </div>

            <div className="bg-[#FAF9F5]/40 border-2 border-divider p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full relative">
              <span className="absolute top-4 right-6 text-6xl text-red-100 font-serif leading-none select-none">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 italic leading-relaxed relative z-10 text-left">
                {c.testiDina}
              </p>
              <div className="pt-4 border-t border-divider mt-6 text-sm text-left">
                <strong className="block text-sm font-display font-black text-headings">
                  {c.mrsDina}
                </strong>
                <span className="text-[11px] text-gray-405 font-mono">
                  {c.testiDinaSub}
                </span>
              </div>
            </div>

            <div className="bg-[#FAF9F5]/40 border-2 border-divider p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full relative">
              <span className="absolute top-4 right-6 text-6xl text-red-100 font-serif leading-none select-none">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 italic leading-relaxed relative z-10 text-left">
                {c.testiAndi}
              </p>
              <div className="pt-4 border-t border-divider mt-6 text-sm text-left">
                <strong className="block text-sm font-display font-black text-headings">
                  {c.mrAndi}
                </strong>
                <span className="text-[11px] text-gray-405 font-mono">
                  {c.testiAndiSub}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== 11. MITIGASI KERAGUAN UNTUK DONOR ==================== */}
      <div className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 w-full mx-auto">
            <span className="font-mono text-xs text-red-655 font-bold uppercase tracking-widest bg-rose-50 border border-red-200 px-3 py-1 rounded-full">
              {c.mythsFacts}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {c.mitigationTitle}
            </h3>
            <p className="text-gray-400 text-xs">
              {c.mitigationDesc}
            </p>
          </div>

          <div className="w-full divide-y divide-divider border border-divider rounded-2xl overflow-hidden bg-white">
            {mitigasiKeraguan.map((m, idx) => {
              const isActive = activeMitigasi === idx;
              return (
                <div key={idx} className="bg-white transition-all">
                  <button
                    onClick={() => setActiveMitigasi(isActive ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-display text-xs sm:text-[13px] font-extrabold text-headings hover:bg-rose-50/5 transition-all outline-none"
                  >
                    <span className="flex items-center gap-2.5 text-gray-500">
                      <span className="text-red-500 font-serif font-black text-base select-none">💬</span>
                      <span>{c.queryDoubt}{m.ragu}</span>
                    </span>
                    <span className="text-xl text-red-600 font-mono shrink-0">{isActive ? '−' : '+'}</span>
                  </button>
                  {isActive && (
                    <div className="p-6 pt-0 text-xs text-gray-650 leading-relaxed font-sans border-t border-divider/10 bg-rose-50/10">
                      <div className="flex gap-2.5 pt-3">
                        <span className="text-emerald-500 font-black shrink-0 text-sm select-none">✓</span>
                        <div>
                          <strong className="text-[#0B4F4A] block font-display uppercase tracking-widest text-[9.5px]">
                            {c.actualMedicalFacts}
                          </strong>
                          <p className="mt-1 text-gray-600 font-medium leading-relaxed">{m.fakta}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== 12. FAQ SECTION ==================== */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-red-655 font-bold uppercase tracking-widest">
              {c.faqSupport}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {c.lookingForAnswers}
            </h3>
          </div>

          <div className="divide-y divide-divider border border-divider rounded-2xl overflow-hidden bg-white w-full">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-display text-xs sm:text-[13px] font-extrabold text-headings hover:bg-rose-50/10 transition-all cursor-pointer outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs text-red-600 shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-gray-550 leading-relaxed font-sans border-t border-divider/10 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== 13. CALL TO ACTION (CTA) UTAMA ==================== */}
      <div className="bg-headings py-16 text-white border-t-4 border-red-600">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in-up">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight w-full max-w-full mx-auto">
            {c.ctaTitle}
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm w-full max-w-full mx-auto leading-relaxed">
            {c.ctaDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <a
              href="#pendaftaran-donor-form"
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-display text-xs font-black tracking-widest rounded-2xl border-2 border-white shadow-[3px_3px_0px_#fff] transition-all cursor-pointer w-full sm:w-auto"
            >
              {c.ctaBtnRegister}
            </a>
            <a
              href="#jadwal-donor-section"
              className="px-8 py-3.5 bg-[#0B4F4A] hover:bg-[#073834] text-white font-display text-xs font-black tracking-widest rounded-2xl border-2 border-white shadow-[3px_3px_0px_#fff] transition-all cursor-pointer w-full sm:w-auto"
            >
              {c.ctaBtnSchedule}
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-display text-xs font-black tracking-widest rounded-2xl border-2 border-headings shadow-[3px_3px_0px_#1e1e1e] transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500 fill-current" />
              <span>{c.ctaBtnWa}</span>
            </a>
            <button
              onClick={() => alert(c.locationAlert)}
              className="px-8 py-3.5 bg-slate-800 w-full sm:w-auto hover:bg-slate-700 text-white font-display text-xs font-black tracking-widest rounded-2xl border-2 border-slate-600 shadow-[3px_3px_0px_#2d3748] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MapPin className="h-4 w-4 text-red-500 animate-bounce" />
              <span>{c.ctaBtnLocation}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
