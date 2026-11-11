import React, { useState } from 'react';
import {
  Users, Droplet, Heart, ShieldAlert, Sparkles, Venus,
  CheckCircle, Clapperboard, Calendar, Clock, MapPin, Smile,
  ChevronRight, Award, Trophy, Sparkle, X, Ticket, HelpCircle, ArrowRight
} from 'lucide-react';
import { COMMUNITY_CLUBS } from '../data';
import { CommunityClub } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { EXTRA_TRANSLATIONS } from '../translations_extra';

const getClubTab = (clubId: string) => {
  if (clubId === 'cc-1') return 'DONOR_DARAH';
  if (clubId === 'cc-2') return 'YASMIN_KIDS';
  if (clubId === 'cc-3') return 'YASMIN_SQUAD';
  if (clubId === 'cc-4') return 'YASMIN_WOMENS';
  return 'KOMUNITAS';
};

const K_TEXTS = {
  ID: {
    moreThan3Months: 'Sudah > 3 Bulan / Belum Pernah',
    lessThan3Months: 'Baru-baru Ini (< 3 Bulan)',
    donorRecommendation: '🏆 REKOMENDASI DONOR',
    attention: '⚠️ PERHATIAN',
    nextSteps: 'Langkah Selanjutnya:',
    toastVisitBloodUnit: '📅 Mohon kunjungi loket UTD RS Yasmin hari ini di Lantai 1 untuk pengambilan darah.',
    registerNow: 'Daftar Donor di RS Yasmin Sekarang',
    personalHealthValued: 'Stamina dwi-mingguan Anda sangat utama. Anda tetap bisa berkontribusi membantu menyebarkan link donor ini atau bergabung dengan Yasmin Squad / Woman Club.',
    maximizeStamina: 'MAKSIMALKAN STAMINA DONOR ANDA',
    hydrationTitle: 'Hidrasi Optimal',
    hydrationDesc: 'Minum minimal 3-4 gelas air putih 2-3 jam sebelum berdonor untuk menstabilkan volume darah tubuh.',
    nutritionTitle: 'Sarapan Bergizi Seimbang',
    nutritionDesc: 'Makan berat yang mengandung zat besi tinggi (daging merah, bayam, telur) 3 jam sebelumnya. Jangan mendonor dalam keadaan perut kosong.',
    sleepTitle: 'Tidur Cukup & Berkualitas',
    sleepDesc: 'Pastikan tidur minimal 5-6 jam di malam sebelum berdonor. Istirahat yang kurang berisiko memicu pusing/lemas pasca-donor.',
    avoidSmokingTitle: 'Hindari Rokok & Alkohol',
    avoidSmokingDesc: 'Hindari merokok minimal 3 jam dan minuman beralkohol minimal 24 jam sebelum proses pengambilan darah dimulai.',
    supervisedBy: '* Layanan UTD RS Yasmin diawasi oleh Ikatan Dokter Indonesia (IDI) & PMI Banyuwangi.',
    communityMeetups: 'SAPA EVENT MASYARAKAT',
    upcomingEvents: 'Jadwal Agenda & Event Komunitas Terdekat',
    hoverDetails: 'Hover di baris kegiatan untuk melihat focus sorotan acara, klik "Detail Acara" untuk membuka tiket cetak digital, atau pilih "Klaim Tiket" untuk RSVP gratis langsung.',
    eventDetails: 'Detail Acara',
    ticketDetails: 'DETAIL TIKET ACARA',
    organizedBy: 'Diselenggarakan Oleh: ',
    socialMovementDesc: 'Ikuti gerakan sosial ini untuk memperkuat tumpuan emosional keluarga serta menjaga stamina fisik tetap prima demi kelangsungan masa depan Banyuwangi asri.',
    date: 'Tanggal',
    time: 'Jam Praktek',
    location: 'Tempat',
    ticketCategory: 'TIKET KATEGORI',
    freeEntryPartner: 'FREE ENTRY (PASIEN REKANAN)',
    entranceGate: 'GERBANG MASUK',
    receptionGate: 'UTD LANTAI 1 (RESEPSIONIS)',
    back: 'Kembali',
    cancelTicket: '✓ Batalkan Tiket',
    claimRsvp: 'Miliki Tiket RSVP',
    rsvped: '✓ Ter-RSVP',
    claimTicket: 'Klaim Tiket',
    quizEligibleMsg: 'Kabar Baik! Anda memenuhi syarat utama untuk mendonasikan darah. Mari bergabung menyelamatkan nyawa masyarakat Banyuwangi!',
    quizIneligibleMsg: 'Apresiasi tinggi atas ketulusan Anda! Saat ini kondisi kesehatan Anda belum memenuhi syarat mutlak donor (misal: berat badan < 47kg, tidur kurang dari 5 jam, berumur < 17 tahun, atau sakit). Mohon utamakan stamina Anda terlebih dahulu.'
  },
  EN: {
    moreThan3Months: 'More than 3 months / Never',
    lessThan3Months: 'Recently (< 3 months)',
    donorRecommendation: '🏆 DONOR RECOMMENDATION',
    attention: '⚠️ ATTENTION',
    nextSteps: 'Next Steps:',
    toastVisitBloodUnit: '📅 Please visit RS Yasmin Blood Unit on the 1st Floor today.',
    registerNow: 'Register to Donate at RS Yasmin Now',
    personalHealthValued: 'Your personal health and stamina are highly valued. You can still contribute by sharing this screening or joining our other family clubs.',
    maximizeStamina: 'MAXIMIZE YOUR DONATION STAMINA',
    hydrationTitle: 'Optimal Hydration',
    hydrationDesc: 'Drink at least 3-4 glasses of water 2-3 hours before donating to stabilize your blood volume.',
    nutritionTitle: 'Balanced Nutrition',
    nutritionDesc: 'Eat a solid meal high in iron (red meat, spinach, eggs) 3 hours before. Never donate on an empty stomach.',
    sleepTitle: 'Sufficient Quality Sleep',
    sleepDesc: 'Get at least 5-6 hours of sleep the night before. Insufficient rest may trigger dizziness or weakness post-donation.',
    avoidSmokingTitle: 'Avoid Smoking & Alcohol',
    avoidSmokingDesc: 'Avoid smoking for at least 3 hours and alcoholic beverages for 24 hours prior to blood extraction.',
    supervisedBy: '* RS Yasmin blood unit is supervised by the Indonesian Doctors Association (IDI) & PMI Banyuwangi.',
    communityMeetups: 'COMMUNITY MEETUPS & EVENTS',
    upcomingEvents: 'Upcoming Community Events & Schedules',
    hoverDetails: 'Hover over any activity row to reveal details, click "Event Details" to print your digital invitation, or click "Claim Ticket" for a free RSVP instantly.',
    eventDetails: 'Event Details',
    ticketDetails: 'EVENT TICKET DETAILS',
    organizedBy: 'Organized By: ',
    socialMovementDesc: 'Join this social movement to strengthen emotional bonds within families and keep physical stamina peak for the future of Banyuwangi.',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    ticketCategory: 'TICKET CATEGORY',
    freeEntryPartner: 'FREE ENTRY (PARTNER PATIENTS)',
    entranceGate: 'ENTRANCE GATE',
    receptionGate: 'BLOOD UNIT 1ST FLOOR (RECEPTION)',
    back: 'Back',
    cancelTicket: '✓ Cancel Ticket',
    claimRsvp: 'Claim RSVP Ticket',
    rsvped: '✓ RSVPed',
    claimTicket: 'Claim Ticket',
    quizEligibleMsg: 'Good News! You meet the core requirements to donate blood. Join us to save the lives of the Banyuwangi community!',
    quizIneligibleMsg: 'High appreciation for your sincerity! Currently, your health condition does not meet the absolute requirements for donation (e.g. weight < 47kg, sleep < 5 hours, age < 17 years, or feeling unwell). Please prioritize your stamina first.'
  },
  KR: {
    moreThan3Months: '3개월 이상 경과 / 헌혈 무경험',
    lessThan3Months: '최근 3개월 이내',
    donorRecommendation: '🏆 헌혈 권장',
    attention: '⚠️ 주의',
    nextSteps: '다음 단계:',
    toastVisitBloodUnit: '📅 오늘 야스민 병원 1층 수혈관리반(UTD) 창구에 방문하여 혈액 채취를 진행해 주세요.',
    registerNow: '야스민 병원 헌혈 회원 등록하기',
    personalHealthValued: '귀하의 건강과 체력이 최우선입니다. 비록 지금은 헌혈이 어렵지만, 이 링크를 공유하거나 야스민 스쿼드 및 여성 클럽에 가입하여 기여하실 수 있습니다.',
    maximizeStamina: '헌혈 체력 극대화하기',
    hydrationTitle: '최적의 수분 공급',
    hydrationDesc: '신체의 혈액량을 안정시키기 위해 헌혈 2~3시간 전에 최소 3~4잔의 물을 마시십시오.',
    nutritionTitle: '균형 잡힌 영양 섭취',
    nutritionDesc: '헌혈 3시간 전에 철분이 풍부한 음식(적색 육류, 시금치, 계란)을 섭취하십시오. 빈속에 헌혈하지 마십시오.',
    sleepTitle: '충분하고 질 좋은 수면',
    sleepDesc: '헌혈 전날 밤 최소 5~6시간의 수면을 취하십시오. 휴식이 부족하면 헌혈 후 어지러움이나 무기력증을 유발할 수 있습니다.',
    avoidSmokingTitle: '흡연 및 음주 삼가',
    avoidSmokingDesc: '채혈 시작 최소 3시간 전에는 흡연을 삼가고, 24시간 전에는 알코올을 섭취하지 마십시오.',
    supervisedBy: '* 야스민 병원 수혈관리반 서비스는 인도네시아 의사협회(IDI) 및 바뉴왕이 PMI의 감독을 받습니다.',
    communityMeetups: '지역 공동체 모임 및 행사',
    upcomingEvents: '가까운 커뮤니티 일정 및 행사 정보',
    hoverDetails: '행사 행에 마우스를 올려 세부 정보를 확인하거나 "상세 정보"를 클릭해 디지털 초대장을 인쇄하거나, 즉시 무료 RSVP 티켓을 신청하십시오.',
    eventDetails: '상세 정보',
    ticketDetails: '행사 티켓 상세 정보',
    organizedBy: '주최: ',
    socialMovementDesc: '지역 사회의 미래와 건강한 가정을 위해 이 인도주의 사회 운동에 참여해 주십시오.',
    date: '날짜',
    time: '시간',
    location: '장소',
    ticketCategory: '티켓 등급',
    freeEntryPartner: '무료 입장 (제휴 환자)',
    entranceGate: '입장 입구',
    receptionGate: '1층 수혈실 (안내데스크)',
    back: '이전',
    cancelTicket: '✓ 신청 취소',
    claimRsvp: 'RSVP 티켓 신청',
    rsvped: '✓ 신청 완료',
    claimTicket: '티켓 신청',
    quizEligibleMsg: '기쁜 소식! 귀하는 주요 헌혈 자격 기준을 충족하십니다. 바뉴왕이 지역 주민들의 고귀한 생명을 구하는 데 동참해 주세요!',
    quizIneligibleMsg: '귀하의 소중한 참여 의사에 감사드립니다! 현재 귀하의 신체 상태는 헌혈 필수 기준(예: 체중 47kg 미만, 수면 5시간 미만, 만 17세 미만 또는 컨디션 저하)을 충족하지 않습니다. 먼저 기력을 회복해 주세요.'
  },
  ZH: {
    moreThan3Months: '已过 3 个月以上 / 从未献血',
    lessThan3Months: '最近 3 个月内',
    donorRecommendation: '🏆 推荐献血',
    attention: '⚠️ 注意',
    nextSteps: '后续步骤：',
    toastVisitBloodUnit: '📅 请于今天前往雅斯敏综合医院一楼输血科(UTD)窗口进行采血。',
    registerNow: '立即注册成为雅斯敏献血者',
    personalHealthValued: '您的个人健康与体力是第一位的。虽然目前不适合献血，但您仍可通过分享此筛查链接或加入雅斯敏跑团/女性健康俱乐部来做出贡献。',
    maximizeStamina: '最大化您的献血体能',
    hydrationTitle: '充足的水分摄入',
    hydrationDesc: '献血前 2-3 小时内饮用至少 3-4 杯水，以稳定体内的总血量。',
    nutritionTitle: '均衡的膳食营养',
    nutritionDesc: '在献血前 3 小时内吃一顿富含铁质（红肉、菠菜、鸡蛋）的饱饭。切勿空腹献血。',
    sleepTitle: '充足的高质量睡眠',
    sleepDesc: '确保在献血前一晚获得至少 5-6 小时的睡眠。睡眠不足可能导致献血后头晕或虚弱。',
    avoidSmokingTitle: '避免吸烟与饮酒',
    avoidSmokingDesc: '在采血开始前至少 3 小时内避免吸烟，24 小时内避免饮用含酒精饮品。',
    supervisedBy: '* 雅斯敏医院输血科服务由印尼医生协会 (IDI) 和巴纽旺伊红十字会 (PMI) 监管。',
    communityMeetups: '社区公众活动与集会',
    upcomingEvents: '即将举办的社区活动与日程表',
    hoverDetails: '将鼠标悬停在活动行上可查看重点细节，点击“Detail Acara”可打开电子入场券，或直接选择“Claim Ticket”免费预约 RSVP。',
    eventDetails: '详细信息',
    ticketDetails: '活动门票详情',
    organizedBy: '主办方：',
    socialMovementDesc: '加入这项公益爱心运动，为强化家庭情感纽带、守护巴纽旺伊的美好未来贡献一份力量。',
    date: '日期',
    time: '时间',
    location: '地点',
    ticketCategory: '门票类别',
    freeEntryPartner: '免费入场 (合作单位患者)',
    entranceGate: '入场通道',
    receptionGate: '一楼输血科 (前台登记处)',
    back: '返回',
    cancelTicket: '✓ 取消预约',
    claimRsvp: '免费预约 RSVP',
    rsvped: '✓ 已预约',
    claimTicket: '预约门票',
    quizEligibleMsg: '好消息！您符合主要的献血资格标准。让我们携手拯救巴纽旺伊社区的宝贵生命！',
    quizIneligibleMsg: '非常感谢您的热心与诚意！目前您的健康状况尚未达到献血的绝对标准（例如：体重 < 47公斤、睡眠少于5小时、年龄不足17岁或身体不适）。请先保重身体，恢复体力。'
  },
  AR: {
    moreThan3Months: 'أكثر من ٣ أشهر / لم يسبق لي',
    lessThan3Months: 'مؤخراً (أقل من ٣ أشهر)',
    donorRecommendation: '🏆 توصية بالتبرع',
    attention: '⚠️ تنبيه',
    nextSteps: 'الخطوات التالية:',
    toastVisitBloodUnit: '📅 يرجى زيارة وحدة نقل الدم بمستشفى ياسمين اليوم في الطابق الأول لسحب الدم.',
    registerNow: 'سجل للتبرع في مستشفى ياسمين الآن',
    personalHealthValued: 'صحتك وعافيتك هي أولويتنا الكبرى. لا يزال بإمكانك المساهمة من خلال مشاركة هذا الرابط أو الانضمام لفرقة ياسمين أو النادي النسائي.',
    maximizeStamina: 'عزز طاقتك واستعدادك للتبرع',
    hydrationTitle: 'ترطيب مثالي',
    hydrationDesc: 'اشرب ما لا يقل عن ٣-٤ أكواب من الماء قبل ساعتين إلى ٣ ساعات من التبرع لتثبيت حجم الدم.',
    nutritionTitle: 'تغذية متوازنة',
    nutritionDesc: 'تناول وجبة صحية غنية بالحديد (اللحم الأحمر، السبانخ، البيض) قبل ٣ ساعات. لا تتبرع أبداً على معدة فارغة.',
    sleepTitle: 'نوم كافٍ وذو جودة',
    sleepDesc: 'احرص على النوم لمدة ٥-٦ ساعات على الأقل في الليلة السابقة. قلة النوم تزيد من خطر الدوار أو الوهن بعد التبرع.',
    avoidSmokingTitle: 'تجنب التدخين والكحول',
    avoidSmokingDesc: 'امتنع عن التدخين لمدة ٣ ساعات على الأقل وعن تناول الكحول لمدة ٢٤ ساعة قبل عملية سحب الدم.',
    supervisedBy: '* خدمات بنك الدم بمستشفى ياسمين تخضع لإشراف اتحاد الأطباء الإندونيسيين (IDI) والهلال الأحمر في بانيوانجي (PMI).',
    communityMeetups: 'لقاءات وفعاليات المجتمع',
    upcomingEvents: 'جدول مواعيد وفعاليات المجتمع القادمة',
    hoverDetails: 'مرر مؤشر الفأرة فوق أي فعالية لعرض التفاصيل، أو انقر فوق "تفاصيل الفعالية" لعرض التذكرة الرقمية، أو اختر "احجز تذكرة" لتسجيل RSVP مجاني ومباشر.',
    eventDetails: 'تفاصيل الفعالية',
    ticketDetails: 'تفاصيل تذكرة الفعالية',
    organizedBy: 'منظم من قبل: ',
    socialMovementDesc: 'شارك في هذه الحركة الاجتماعية لتعزيز الترابط الأسري والحفاظ على العافية البدنية من أجل مستقبل بانيوانجي الجميل.',
    date: 'التاريخ',
    time: 'الوقت',
    location: 'الموقع',
    ticketCategory: 'فئة التذكرة',
    freeEntryPartner: 'دخول مجاني (شركاء المستشفى)',
    entranceGate: 'بوابة الدخول',
    receptionGate: 'وحدة نقل الدم الطابق الأول (الاستقبال)',
    back: 'رجوع',
    cancelTicket: '✓ إلغاء الحجز',
    claimRsvp: 'احصل على تذكرة RSVP',
    rsvped: '✓ تم الحجز',
    claimTicket: 'احجز تذكرة',
    quizEligibleMsg: 'أخبار سارة! أنت تستوفي الشروط الأساسية للتبرع بالدم. انضم إلينا للمساهمة في إنقاذ حياة أفراد مجتمع بانيوانجي!',
    quizIneligibleMsg: 'كل التقدير لصدق رغبتكم! حالياً، لا تستوفي حالتكم الصحية الشروط الإلزامية للتبرع (مثل: الوزن أقل من ٤٧ كجم، النوم أقل من ٥ ساعات، السن أقل من ١٧ عاماً، أو الشعور بوعكة). يرجى إعطاء الأولوية لصحتكم أولاً.'
  }
};

export default function Komunitas({ onNavClick }: { onNavClick?: (tab: any) => void }) {
  const lang = useLanguage();
  const t = EXTRA_TRANSLATIONS.KOMUNITAS[lang] || EXTRA_TRANSLATIONS.KOMUNITAS.ID;
  const kt = K_TEXTS[lang as keyof typeof K_TEXTS] || K_TEXTS.ID;

  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  const [donorQuizStep, setDonorQuizStep] = useState<number>(0);
  
  // Custom states
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [hoveredRowIdx, setHoveredRowIdx] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Donor quiz parameters
  const [quizAge, setQuizAge] = useState<string>('');
  const [quizWeight, setQuizWeight] = useState<number | ''>('');
  const [quizSleep, setQuizSleep] = useState<string>('');
  const [quizLastDonor, setQuizLastDonor] = useState<string>('');
  const [quizHealthy, setQuizHealthy] = useState<boolean | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to join clubs
  const toggleJoinClub = (clubId: string, clubName: string) => {
    if (joinedClubs.includes(clubId)) {
      setJoinedClubs(joinedClubs.filter(id => id !== clubId));
      triggerToast(`${t.toastLeave || 'Anda telah keluar dari keanggotaan'} ${clubName}`);
    } else {
      setJoinedClubs([...joinedClubs, clubId]);
      triggerToast(`${t.toastJoin || '✓ Berhasil terdaftar sebagai anggota resmi'} "${clubName}"!`);
    }
  };

  // Helper to RSVP to event
  const toggleRsvp = (eventTitle: string) => {
    if (rsvpEvents.includes(eventTitle)) {
      setRsvpEvents(rsvpEvents.filter(title => title !== eventTitle));
      triggerToast(`${t.toastCancel || 'Batal reservasi tiket gratis untuk'} "${eventTitle}".`);
    } else {
      setRsvpEvents([...rsvpEvents, eventTitle]);
      triggerToast(`${t.toastClaim || '🎟️ Sukses mengklaim tiket gratis Anda untuk'} "${eventTitle}".`);
    }
  };

  // Process Quiz Results
  const evaluateDonorEligibility = () => {
    const minAge = quizAge === '17-60';
    const minWeight = Number(quizWeight) >= 47;
    const minSleep = quizSleep === 'more-than-5';
    const minTimeGap = quizLastDonor === 'never' || quizLastDonor === '3-months-ago';
    
    if (minAge && minWeight && minSleep && minTimeGap && quizHealthy) {
      return {
        eligible: true,
        message: kt.quizEligibleMsg
      };
    } else {
      return {
        eligible: false,
        message: kt.quizIneligibleMsg
      };
    }
  };

  const quizResult = evaluateDonorEligibility();

  const resetQuiz = () => {
    setDonorQuizStep(0);
    setQuizAge('');
    setQuizWeight('');
    setQuizSleep('');
    setQuizLastDonor('');
    setQuizHealthy(null);
  };

  // Icon mapper for Clubs
  const renderClubIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="h-6 w-6 text-red-500 fill-current animate-pulse" />;
      case 'Clapperboard': return <Clapperboard className="h-6 w-6 text-amber-500" />;
      case 'Sparkles': return <Sparkles className="h-6 w-6 text-indigo-500" />;
      case 'Venus': return <Venus className="h-6 w-6 text-pink-500" />;
      default: return <Users className="h-6 w-6 text-deep-teal" />;
    }
  };

  // Gather all events from all clubs into a single sorted flat list representation
  const allEvents = COMMUNITY_CLUBS.flatMap(club => 
    club.upcomingEvents.map(evt => ({
      ...evt,
      clubId: club.id,
      clubName: club.name,
      clubIcon: club.iconName
    }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section id="komunitas-section" className="py-16 bg-[#FAF9F5] text-left">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-28 left-1/2 -translate-x-1/2 bg-headings text-warm-ivory border-2 border-yasmin-green px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center space-x-3 text-xs font-bold font-sans animate-fade-in-up">
            <Ticket className="h-4.5 w-4.5 text-warm-orange animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Title */}
        <div className="w-full text-center mb-16">
          <span className="font-display text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-soft-mint px-3.5 py-1.5 rounded-full border border-divider">
            {t.badge}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-headings mt-4">
            {t.title}
          </h2>
          <p className="text-gray-550 font-sans text-sm mt-2 w-full text-center leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 1. Clubs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {COMMUNITY_CLUBS.map((club) => {
            const hasJoined = joinedClubs.includes(club.id);
            // Dynamic translation helper for clubs
            const getClubTranslation = (id: string, lCode: string, origName: string, origDesc: string, origBenefits: string[]) => {
              if (lCode === 'ID') return { name: origName, desc: origDesc, benefits: origBenefits };
              const dict: Record<string, Record<string, { name: string, desc: string, benefits: string[] }>> = {
                'cc-1': {
                  EN: {
                    name: 'Yasmin Blood Donors Club',
                    desc: 'A humanitarian community dedicated to mutual assistance in blood donor supply across Banyuwangi.',
                    benefits: [
                      'Free Hemoglobin (HB) and blood pressure screenings every 2 months',
                      'Exclusive Yasmin Donor merchandise and membership card',
                      'Personalized SMS/WhatsApp donor reminder notifications',
                      'Priority blood supply assistance for close family members in case of emergency needs'
                    ]
                  },
                  KR: {
                    name: '야스민 헌혈자 클럽',
                    desc: '바뉴왕이 전역에서 헌혈 공급을 서로 돕는 인도주의 공동체입니다.',
                    benefits: [
                      '2개월마다 제공되는 무료 헤모글로빈(HB) 및 혈압 측정 검사',
                      '야스민 헌혈자 전용 기념품 및 독점 회원 카드 증정',
                      '개인 맞춤형 SMS/WhatsApp 헌혈 주기 안내 및 알림 서비스',
                      '비상 상황 시 직계 가족을 위한 긴급 혈액 공급 우선 지원'
                    ]
                  },
                  ZH: {
                    name: '雅斯敏献血者俱乐部',
                    desc: '一个致力于在整个巴纽旺伊地区互助献血的非营利人道主义社群。',
                    benefits: [
                      '每2个月可享受免费血红蛋白(HB)和血压筛查检查',
                      '获赠雅斯敏献血者专享定制纪念品和尊贵会员卡',
                      '个性化短信/WhatsApp献血温馨提醒服务',
                      '紧急情况下，直系亲属可获得优先供血和血液援助'
                    ]
                  },
                  AR: {
                    name: 'نادي ياسمين للمتبرعين بالدم',
                    desc: 'مجتمع إنساني مخصص للتعاون في توفير إمدادات الدم في بانيوانجي.',
                    benefits: [
                      'فحص مجاني للهيموجلوبين (HB) وضغط الدم كل شهرين',
                      'هدايا تذكارية وبطاقة عضوية حصرية لمتبرعي ياسمين',
                      'إشعارات تذكير مخصصة عبر رسائل SMS أو واتساب للتبرع بالدم',
                      'أولوية المساعدة بالدم لأفراد العائلة المقربين في حالات الطوارئ'
                    ]
                  }
                },
                'cc-2': {
                  EN: {
                    name: 'Yasmin Kids Club',
                    desc: 'Support group for pediatric growth and development monitoring alongside certified pediatricians.',
                    benefits: [
                      'Special 10% discount for child nutrition and intelligence screening',
                      'Regular invitations to sand painting and herbal gardening workshops',
                      'Intensive WhatsApp education group guided directly by pediatricians',
                      'Free cute souvenir at every scheduled immunization'
                    ]
                  },
                  KR: {
                    name: '야스민 키즈 클럽',
                    desc: '전문의들과 함께하는 소아 성장 및 발달 모니터링 지원 그룹입니다.',
                    benefits: [
                      '아동 영양 상태 및 지능 발달 스크리닝 검사 10% 특별 할인',
                      '자유 모래 그림 그리기 및 허브 정원 가꾸기 정기 워크숍 초대',
                      '소아청소년과 전문의가 직접 운영하는 집중형 카카오톡/WhatsApp 교육방',
                      '일정에 따른 백신 예방접종 시 무료 캐릭터 사은품 증정'
                    ]
                  },
                  ZH: {
                    name: '雅斯敏儿童健康俱乐部',
                    desc: '由专业儿科医生指导的儿童成长与发育监测关怀小组。',
                    benefits: [
                      '儿童营养状态与智力发育测评筛查享受10%专属折扣',
                      '定期受邀参加沙画创作及中草药园艺互动工作坊',
                      '儿科专家亲自坐镇并指导的微信/WhatsApp亲子育儿群',
                      '每次按计划进行疫苗接种均可获赠免费可爱精美伴手礼'
                    ]
                  },
                  AR: {
                    name: 'نادي ياسمين للأطفال',
                    desc: 'مجموعة دعم لمراقبة نمو وتطور الأطفال مع أطباء أطفال معتمدين.',
                    benefits: [
                      'خصم خاص ١٠٪ على فحص التغذية والذكاء للأطفال',
                      'دعوات منتظمة لورش عمل الرسم بالرمل الحر وزراعة الأعشاب',
                      'مجموعة تعليمية مكثفة على واتساب بإشراف أخصائي أطفال مباشرة',
                      'هدايا تذكارية لطيفة مجانية عند كل عملية تطعيم مجدولة'
                    ]
                  }
                },
                'cc-3': {
                  EN: {
                    name: 'Yasmin Squad (Fitness & Gym)',
                    desc: 'A dynamic running and aerobic fitness circle organizing weekly energetic workouts.',
                    benefits: [
                      'Free access to monthly interactive youth mental health discussions',
                      '15% off vouchers for adolescent personality and talent counseling',
                      'Active membership in the organizing committee of "Healthy Without Stress" campaigns',
                      'Free e-books on overcoming sleep disorders, anxiety, and insecurities'
                    ]
                  },
                  KR: {
                    name: '야스민 스쿼드 (피트니스 & 러닝)',
                    desc: '매주 활기찬 유산소 및 근력 운동을 조직하는 러닝 및 피트니스 써클입니다.',
                    benefits: [
                      '월 1회 정기 청소년 정신 건강 무료 참여 대화 세션',
                      '청소년 성격 유형 및 적성·진로 상담 15% 할인 우대 쿠폰',
                      '"스트레스 없는 건강한 삶" 사회 공헌 캠페인 기획단 공식 참여',
                      '수면 장애, 불안증 및 자존감(insecure) 극복을 위한 무료 전자책'
                    ]
                  },
                  ZH: {
                    name: '雅斯敏跑团与健身社群',
                    desc: '每周组织活力跑步与有氧健身训练的动感健康圈子。',
                    benefits: [
                      '每月免费参加一次青少年心理健康互动沙龙和探讨',
                      '青少年性格特征与兴趣天赋规划咨询享受15%折扣券',
                      '深度参与“无压健康生活”大型公益活动的核心筹备委员会',
                      '免费获赠克服睡眠障碍、焦虑心理及消除自卑感的电子书'
                    ]
                  },
                  AR: {
                    name: 'فرقة ياسمين الرياضية',
                    desc: 'مجموعة رياضية للجري واللياقة البدنية لتنظيم تمارين أسبوعية نشيطة.',
                    benefits: [
                      'وصول مجاني لجلسات مناقشة الصحة النفسية للشباب مرة شهرياً',
                      'قسيمة خصم ١٥٪ على استشارات الشخصية واكتشاف مواهب الشباب',
                      'عضوية نشطة في لجان تنظيم الحملات الاجتماعية "صحة بلا توتر"',
                      'كتب إلكترونية مجانية حول التغلب على اضطرابات النوم، القلق، والشك الذاتي'
                    ]
                  }
                },
                'cc-4': {
                  EN: {
                    name: 'Yasmin Women’s Club',
                    desc: 'A warm sanctuary discussing family harmony, mental wellness, and feminine health concerns.',
                    benefits: [
                      'Subsidized weekly Prenatal Yoga or Kegel exercise sessions',
                      'Early detection education for breast and cervical cancer (SADARI & Pap Smear)',
                      'Monthly offline meetups at the Family Lounge with balanced nutrition cooking',
                      'Healthy community runs and shopping vouchers from nutrition food partners'
                    ]
                  },
                  KR: {
                    name: '야스민 여성 웰니스 클럽',
                    desc: '가족 화목, 정신적 웰빙, 여성 건강 우려를 나누는 따뜻한 안식처입니다.',
                    benefits: [
                      '매주 진행되는 보조금 지원 임산부 요가 및 케겔 운동',
                      '유방암 및 자궁경부암 조기 발견 선별 교육 (자가 검진 및 자궁경부 세포 검사)',
                      '패밀리 라운지에서 열리는 영양 가득 요리 교실 정기 오프라인 모임',
                      '커뮤니티 건강 달리기 대회 참가 및 제휴 웰빙 푸드 쇼핑 바우처'
                    ]
                  },
                  ZH: {
                    name: '雅斯敏女性健康俱乐部',
                    desc: '关注家庭和谐、女性心理健康以及妇科生理健康的温馨乐园。',
                    benefits: [
                      '每周享受补贴支持的孕妇瑜伽及凯格尔运动康复课程',
                      '乳腺癌与宫颈癌早期筛查及科普防治教育 (自检与宫颈抹片检查)',
                      '每月在家庭休息室举办的局衡营养烹饪线下体验沙龙',
                      '参与社区健康跑及获取合作绿色有机食品超市的购物代金券'
                    ]
                  },
                  AR: {
                    name: 'نادي ياسمين النسائي',
                    desc: 'ملجأ دافئ لمناقشة التناغم الأسري، الصحة النفسية، والاهتمامات النسائية.',
                    benefits: [
                      'جلسات يوجا الحوامل وتدريبات كيجل الأسبوعية المدعومة',
                      'توعية حول الكشف المبكر عن سرطان الثدي وعنق الرحم (الفحص الذاتي ومسحة عنق الرحم)',
                      'تجمعات شهرية في صالة العائلات تشتمل على طهي وجبات صحية متوازنة',
                      'أنشطة لياقة بدنية مجتمعية وقسائم تسوق للغذاء الصحي من شركائنا'
                    ]
                  }
                }
              };
              return dict[id]?.[lCode] || { name: origName, desc: origDesc, benefits: origBenefits };
            };

            const localizedClub = getClubTranslation(club.id, lang, club.name, club.description, club.benefits);

            // Intentional Pastel theme mapping based on club ID and icon color
            const getPastelTheme = (id: string) => {
              switch (id) {
                case 'cc-1': // Donor Darah (Red)
                  return {
                    card: 'bg-gradient-to-br from-white via-red-50/25 to-red-50/70 border-2 border-red-500/40 hover:border-red-500 hover:shadow-red-100/50',
                    iconBg: 'p-2.5 bg-red-50 rounded-xl border border-red-200/60 shadow-2xs',
                    badge: 'text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200/80 px-3 py-1 rounded-full uppercase',
                    btn: 'bg-white hover:bg-red-600 text-red-600 hover:text-white border-red-200 hover:border-red-600'
                  };
                case 'cc-2': // Kids Club (Amber/Yellow)
                  return {
                    card: 'bg-gradient-to-br from-white via-amber-50/20 to-amber-50/65 border-2 border-amber-500/40 hover:border-amber-500 hover:shadow-amber-100/50',
                    iconBg: 'p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 shadow-2xs',
                    badge: 'text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full uppercase',
                    btn: 'bg-white hover:bg-amber-600 text-amber-600 hover:text-white border-amber-200 hover:border-amber-600'
                  };
                case 'cc-3': // Squad (Indigo/Purple)
                  return {
                    card: 'bg-gradient-to-br from-white via-indigo-50/20 to-indigo-50/65 border-2 border-indigo-500/40 hover:border-indigo-500 hover:shadow-indigo-100/50',
                    iconBg: 'p-2.5 bg-indigo-50 rounded-xl border border-indigo-200/60 shadow-2xs',
                    badge: 'text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full uppercase',
                    btn: 'bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border-indigo-200 hover:border-indigo-600'
                  };
                case 'cc-4': // Woman's Club (Pink)
                  return {
                    card: 'bg-gradient-to-br from-white via-pink-50/20 to-pink-50/65 border-2 border-pink-500/40 hover:border-pink-500 hover:shadow-pink-100/50',
                    iconBg: 'p-2.5 bg-pink-50 rounded-xl border border-pink-200/60 shadow-2xs',
                    badge: 'text-xs font-mono font-bold text-pink-700 bg-pink-50 border border-pink-200/80 px-3 py-1 rounded-full uppercase',
                    btn: 'bg-white hover:bg-pink-600 text-pink-600 hover:text-white border-pink-200 hover:border-pink-600'
                  };
                default:
                  return {
                    card: 'bg-gradient-to-br from-white to-soft-mint/30 border-2 border-divider hover:border-yasmin-green hover:shadow-md',
                    iconBg: 'p-2.5 bg-white rounded-xl border border-divider shadow-2xs',
                    badge: 'text-xs font-mono font-bold text-deep-teal/70 bg-white border border-divider px-3 py-1 rounded-full uppercase',
                    btn: 'bg-white hover:bg-deep-teal text-deep-teal hover:text-white border-deep-teal hover:border-deep-teal'
                  };
              }
            };

            const theme = getPastelTheme(club.id);

            return (
              <div
                key={club.id}
                className={`${theme.card} rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-md h-full relative`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={theme.iconBg}>
                      {renderClubIcon(club.iconName)}
                    </div>
                    <span className={theme.badge}>
                      {club.memberCount} {t.members}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-sans font-bold text-base sm:text-lg text-headings">{localizedClub.name}</h3>
                    <p className="text-sm sm:text-base text-gray-555 leading-relaxed font-sans text-justify">{localizedClub.desc}</p>
                  </div>

                  {/* Club Benefits */}
                  <div className="space-y-2 pt-1 text-left">
                    <p className="text-xs text-headings font-bold uppercase tracking-wider">{t.benefitTitle}</p>
                    {localizedClub.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle className="h-4 w-4 text-yasmin-green shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-650 leading-tight">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-divider/40">
                  <button
                    onClick={() => {
                      const tab = getClubTab(club.id);
                      if (onNavClick) {
                        onNavClick(tab);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl font-sans text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer shadow-2xs flex items-center justify-center space-x-1.5 ${theme.btn}`}
                  >
                    <span>{t.viewDetail}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Interactive Interactive Quiz & Tips Companion (Donor Eligibility & Prep) - Moved ABOVE Event Schedule */}
        <div className="border-t border-divider pt-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* L: Interactive Quiz (Donor Eligibility Checker) */}
            <div className="bg-gradient-to-br from-headings to-deep-teal text-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/25">
                    <Droplet className="h-5 w-5 fill-current animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-warm-ivory uppercase">{t.quizBadge}</h3>
                    <p className="text-[10px] text-warm-ivory/60 font-mono tracking-widest uppercase mt-0.5">{t.quizSub}</p>
                  </div>
                </div>

                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-300"
                    style={{ width: `${((donorQuizStep + 1) / 5) * 100}%` }}
                  />
                </div>

                {donorQuizStep < 4 ? (
                  <div className="space-y-5 text-left">
                    {donorQuizStep === 0 && (
                      <div className="space-y-4">
                        <p className="text-xs font-semibold leading-relaxed text-warm-ivory">{t.quizQ1}</p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => { setQuizAge('17-60'); setDonorQuizStep(1); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {t.btnYes1}
                          </button>
                          <button
                            onClick={() => { setQuizAge('others'); setDonorQuizStep(1); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {t.btnNo1}
                          </button>
                        </div>
                      </div>
                    )}

                    {donorQuizStep === 1 && (
                      <div className="space-y-4">
                        <p className="text-xs font-semibold leading-relaxed text-warm-ivory font-sans">{t.quizQ2}</p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => { setQuizWeight(50); setDonorQuizStep(2); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {t.btnYes2}
                          </button>
                          <button
                            onClick={() => { setQuizWeight(40); setDonorQuizStep(2); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {t.btnNo2}
                          </button>
                        </div>
                      </div>
                    )}

                    {donorQuizStep === 2 && (
                      <div className="space-y-4">
                        <p className="text-xs font-semibold leading-relaxed text-warm-ivory">{t.quizQ3}</p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => { setQuizSleep('more-than-5'); setDonorQuizStep(3); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {t.btnYes3}
                          </button>
                          <button
                            onClick={() => { setQuizSleep('less'); setDonorQuizStep(3); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {t.btnNo3}
                          </button>
                        </div>
                      </div>
                    )}

                    {donorQuizStep === 3 && (
                      <div className="space-y-4">
                        <p className="text-xs font-semibold leading-relaxed text-warm-ivory">{t.quizQ4}</p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => { setQuizLastDonor('never'); setQuizHealthy(true); setDonorQuizStep(4); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {kt.moreThan3Months}
                          </button>
                          <button
                            onClick={() => { setQuizLastDonor('recent'); setQuizHealthy(false); setDonorQuizStep(4); }}
                            className="bg-white/10 hover:bg-white text-white hover:text-headings p-3 rounded-xl font-bold font-display text-xs transition-colors cursor-pointer text-center"
                          >
                            {kt.lessThan3Months}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5 text-left animate-fade-in-up">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                      <h4 className="font-display font-bold text-sm text-warm-orange flex items-center mb-2">
                        {quizResult.eligible ? kt.donorRecommendation : kt.attention}
                      </h4>
                      <p className="text-xs leading-relaxed text-warm-ivory/90 font-sans">
                        {quizResult.message}
                      </p>
                    </div>

                    {quizResult.eligible ? (
                      <div className="space-y-2.5">
                        <p className="text-[10px] text-warm-ivory/60 font-medium">{kt.nextSteps}</p>
                        <button
                          onClick={() => triggerToast(kt.toastVisitBloodUnit)}
                          className="w-full py-3 bg-gradient-to-r from-red-500 to-warm-orange text-headings font-bold rounded-xl text-xs tracking-wider hover:scale-101 transition-transform cursor-pointer"
                        >
                          {kt.registerNow}
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-350 rounded-xl font-medium leading-relaxed">
                        {kt.personalHealthValued}
                      </div>
                    )}

                    <button
                      onClick={resetQuiz}
                      className="w-full py-2 bg-transparent hover:bg-white/5 text-center text-[10px] text-warm-ivory/60 hover:text-white uppercase font-bold tracking-widest border border-white/10 rounded-lg cursor-pointer"
                    >
                      {t.btnRetry}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* R: New Companion Frame: Tips & Persiapan Sebelum Donor Darah */}
            <div className="bg-white border-2 border-divider p-8 rounded-3xl shadow-xs space-y-6 text-left flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                    <Sparkles className="h-5 w-5 animate-spin-slow text-warm-orange" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-headings uppercase">{t.tipsTitle}</h3>
                    <p className="text-[10px] text-[#0B4F4A] font-mono tracking-widest uppercase mt-0.5">
                      {kt.maximizeStamina}
                    </p>
                  </div>
                </div>
                
                <div className="h-1 bg-gray-100 rounded-full" />

                <div className="space-y-3 pt-1">
                  {[
                    {
                      icon: '💧',
                      title: kt.hydrationTitle,
                      desc: kt.hydrationDesc
                    },
                    {
                      icon: '🍳',
                      title: kt.nutritionTitle,
                      desc: kt.nutritionDesc
                    },
                    {
                      icon: '🛌',
                      title: kt.sleepTitle,
                      desc: kt.sleepDesc
                    },
                    {
                      icon: '🚭',
                      title: kt.avoidSmokingTitle,
                      desc: kt.avoidSmokingDesc
                    }
                  ].map((tip, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs sm:text-xs">
                      <span className="text-emerald-500 font-bold shrink-0">{tip.icon}</span>
                      <div>
                        <strong className="text-headings block">{tip.title}</strong>
                        <span className="text-gray-500 leading-relaxed font-sans text-justify block">{tip.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-divider/60">
                <p className="text-[10px] text-gray-400 font-normal leading-relaxed text-center italic">
                  {kt.supervisedBy}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Event Schedule - Bottom list spanning full-width */}
        <div className="border-t border-divider pt-12">
          <div className="space-y-6">
            <div className="text-left space-y-1.5 animate-fade-in-up">
              <span className="font-sans text-[10px] text-warm-orange font-bold uppercase tracking-widest bg-orange-50 border border-orange-200/50 px-2.5 py-1 rounded-full">
                {kt.communityMeetups}
              </span>
              <h3 className="font-display font-bold text-lg text-headings flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-deep-teal" />
                <span>{kt.upcomingEvents}</span>
              </h3>
            </div>
            
            <p className="text-xs text-gray-400 font-sans -mt-3 text-left">
              {kt.hoverDetails}
            </p>

            {/* List Row Format container */}
            <div className="divide-y divide-divider border border-divider rounded-2xl overflow-hidden bg-white shadow-xs">
              {allEvents.map((evt, idx) => {
                const isBooked = rsvpEvents.includes(evt.title);
                const isSelected = hoveredRowIdx === idx;
                
                // Beautiful date formatting helper
                const dateObj = new Date(evt.date);
                const day = dateObj.getDate();
                const monthStr = dateObj.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { month: 'short' });

                // Map the club tag theme to match the card pastel colors with borders
                const getEventClubTagTheme = (clubId: string) => {
                  switch (clubId) {
                    case 'cc-1': // Donor Darah (Red)
                      return 'text-red-700 bg-red-50 border-red-200';
                    case 'cc-2': // Kids Club (Amber/Yellow)
                      return 'text-amber-700 bg-amber-50 border-amber-200';
                    case 'cc-3': // Squad (Indigo/Purple)
                      return 'text-indigo-700 bg-indigo-50 border-indigo-200';
                    case 'cc-4': // Woman's Club (Pink)
                      return 'text-pink-700 bg-pink-50 border-pink-200';
                    default:
                      return 'text-deep-teal bg-white border-divider';
                  }
                };
                const tagTheme = getEventClubTagTheme(evt.clubId);

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredRowIdx(idx)}
                    onClick={() => setSelectedEvent(evt)}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-4 px-5 gap-4 transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'bg-soft-mint/40 border-l-4 border-yasmin-green' 
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Date & Title content stacked on Row 1 and Row 2 */}
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Circular Date Badge */}
                      <div className="w-11 h-11 rounded-lg bg-deep-teal/95 text-white flex flex-col items-center justify-center shrink-0 font-display shadow-xs border border-divider/10">
                        <span className="text-[8px] font-black uppercase tracking-wide block leading-none">{monthStr}</span>
                        <span className="text-sm font-black block leading-none mt-1">{day}</span>
                      </div>
                      
                      <div className="text-left space-y-1">
                        {/* Baris 1: Judul agenda plus club tag */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8px] font-bold tracking-wider border px-2 py-0.5 rounded-full uppercase ${tagTheme}`}>
                            {evt.clubName}
                          </span>
                          <h4 className="font-sans font-bold text-xs sm:text-xs text-headings leading-tight group-hover:text-deep-teal transition-colors">
                            {evt.title}
                          </h4>
                        </div>
                        {/* Baris 2: Waktu dan tempat */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-xs text-gray-500 font-normal font-sans">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 text-yasmin-green mr-1" />
                            {evt.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 text-yasmin-green mr-1" />
                            {evt.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                      {/* Button View Detail */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                        }}
                        className="px-3 py-1 bg-white border border-divider hover:border-deep-teal text-deep-teal rounded-md font-sans text-xs font-normal transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        {kt.eventDetails}
                      </button>

                      {/* Button Klaim Tiket */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRsvp(evt.title);
                        }}
                        className={`px-3 py-1 rounded-md font-sans text-xs font-normal transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-yasmin-green text-white shadow-2xs'
                            : 'bg-warm-orange hover:bg-orange-600 text-white shadow-xs'
                        }`}
                      >
                        {isBooked
                          ? kt.rsvped
                          : kt.claimTicket}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ==================== EVENT DETAILS & TICKET PREVIEW DIALOG MODAL ==================== */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-headings/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl overflow-hidden border border-divider shadow-2xl w-full max-w-xl animate-fade-in-down">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-deep-teal to-yasmin-green text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ticket className="h-5 w-5 text-warm-orange animate-bounce" />
                <span className="font-display font-black text-sm tracking-widest uppercase">
                  {kt.ticketDetails}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-full text-white transition-all cursor-pointer outline-none animate-red-blink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="text-left space-y-2">
                <span className="text-[10px] font-black uppercase text-warm-orange bg-amber-50 border border-orange-100 px-3 py-1 rounded-full">
                  {kt.organizedBy}{selectedEvent.clubName}
                </span>
                <h3 className="font-display font-black text-xl text-headings leading-snug">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {kt.socialMovementDesc}
                </p>
              </div>

              {/* Event Meta Grid */}
              <div className="grid grid-cols-3 gap-3 bg-soft-mint p-4 rounded-2xl text-left border border-divider/40">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-gray-400">
                    {kt.date}
                  </span>
                  <p className="font-display font-black text-xs text-deep-teal mt-0.5">{selectedEvent.date}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-gray-400">
                    {kt.time}
                  </span>
                  <p className="font-display font-black text-xs text-deep-teal mt-0.5">{selectedEvent.time}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-gray-400">
                    {kt.location}
                  </span>
                  <p className="font-display font-black text-xs text-deep-teal mt-0.5 truncate">{selectedEvent.location}</p>
                </div>
              </div>

              {/* TICKET STUB VIEW WITH MOCK BARCODE */}
              <div className="border border-dashed border-gray-300 rounded-3xl p-5 bg-gradient-to-br from-headings to-deep-teal text-white shadow-md relative overflow-hidden text-left">
                {/* Visual circle notches for ticket style */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full -ml-2" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full -mr-2" />
                
                <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] tracking-widest text-warm-orange uppercase font-black">YASMIN PASS TICKET</p>
                    <h5 className="font-display font-black text-xs text-warm-ivory truncate max-w-[250px]">
                      {selectedEvent.title}
                    </h5>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-gray-400 font-mono">STATUS</p>
                    <span className="text-[9px] font-black text-emerald-450 uppercase">
                      {rsvpEvents.includes(selectedEvent.title) ? '✓ ACTIVE RSVP' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[8px] text-gray-400 block font-mono">
                      {kt.ticketCategory}
                    </span>
                    <span className="font-display font-bold text-warm-ivory">
                      {kt.freeEntryPartner}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 block font-mono">
                      {kt.entranceGate}
                    </span>
                    <span className="font-display font-bold text-warm-ivory">
                      {kt.receptionGate}
                    </span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-5 bg-white p-3.5 rounded-xl flex flex-col items-center justify-center">
                  <div className="flex space-x-[2.5px] h-11 w-full items-stretch justify-center opacity-90">
                    {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1].map((width, idx) => (
                      <div 
                        key={idx} 
                        className="bg-black shrink-0" 
                        style={{ width: `${width * 1.5}px` }} 
                      />
                    ))}
                  </div>
                  <span className="text-[7.5px] font-mono tracking-[4px] text-black mt-2 font-black uppercase">
                    YASMIN-{selectedEvent.clubId.toUpperCase()}-2026
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-5 border-t border-divider/40 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 bg-white border border-divider hover:bg-slate-50 text-gray-650 rounded-xl font-display text-xs font-bold cursor-pointer"
              >
                {kt.back}
              </button>
              <button
                onClick={() => {
                  toggleRsvp(selectedEvent.title);
                }}
                className={`px-6 py-2.5 rounded-xl font-display text-xs font-black tracking-widest transition-all cursor-pointer ${
                  rsvpEvents.includes(selectedEvent.title)
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    : 'bg-warm-orange hover:bg-orange-600 text-white shadow-sm'
                }`}
              >
                {rsvpEvents.includes(selectedEvent.title)
                  ? kt.cancelTicket
                  : kt.claimRsvp}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
