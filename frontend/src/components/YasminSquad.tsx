import React, { useState } from 'react';
import { SafeImage } from '../utils/imageUrl';
const clubSquadsImg = '/assets/images/komunitas/rsyasminclub_squads.jpg';
import { 
  Sparkles, Calendar, Heart, Shield, HelpCircle, Star, Info, 
  MapPin, CheckCircle, ArrowRight, UserPlus, Gift, Trophy, Activity,
  Smartphone, BookOpen, GraduationCap, Users, Clock, Smile, Printer, X
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { EXTRA_TRANSLATIONS } from '../translations_extra';

export default function YasminSquad() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaSekolah: '',
    kelasAngkatan: '',
    telepon: '',
    alamat: '',
    minatBakat: '',
    alasan: ''
  });

  const [registeredCard, setRegisteredCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.namaSekolah || !formData.telepon) {
      alert('Mohon lengkapi Nama Lengkap, Asal Sekolah, dan No WhatsApp!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegisteredCard({
        id: `Y-SQUAD-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleDateString('id-ID'),
        ...formData
      });
      setTimeout(() => {
        document.getElementById('squad-success-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 950);
  };

  const resetForm = () => {
    setFormData({
      namaLengkap: '',
      namaSekolah: '',
      kelasAngkatan: '',
      telepon: '',
      alamat: '',
      minatBakat: '',
      alasan: ''
    });
    setRegisteredCard(null);
  };

  const lang = useLanguage();
  const t = EXTRA_TRANSLATIONS.SQUAD[lang] || EXTRA_TRANSLATIONS.SQUAD.ID;

  const getFaqs = () => {
    switch (lang) {
      case 'EN':
        return [
          {
            q: "Is there a fee to join Yasmin Squad?",
            a: "There are no registration or membership fees. All Yasmin Squad activities are completely free for high school students (SMA/SMK/MA) in Banyuwangi."
          },
          {
            q: "I have graduated from high school, can I still join?",
            a: "Of course! We welcome active students as well as recent fresh graduates to stay connected and network together."
          },
          {
            q: "What are the activities of Yasmin Squad?",
            a: "They are highly diverse! Ranging from mental health education talk shows, digital creativity competitions, healthy workouts, social volunteering, to fun team building games."
          },
          {
            q: "Do I need to have specific talents to join?",
            a: "Absolutely not! The most important thing is having the enthusiasm to learn, contribute, and collaborate with new friends."
          },
          {
            q: "How do I find out about the latest activity schedule?",
            a: "After registering and verifying your number, you will be officially invited to the Yasmin Squad Community WhatsApp group. All the latest schedules will be shared there."
          }
        ];
      case 'KR':
        return [
          {
            q: "야스민 스쿼드 가입 비용이 있나요?",
            a: "가입비나 회비는 전혀 없습니다. 바뉴왕이 내 고등학교(SMA/SMK/MA) 학생들을 위한 모든 야스민 스쿼드 활동은 완전히 무료입니다."
          },
          {
            q: "고등학교를 이미 졸업했는데 가입할 수 있나요?",
            a: "물론입니다! 우리는 재학생뿐만 아니라 최근 졸업생(fresh graduate)도 함께 소통하고 네트워크를 형성할 수 있도록 환영합니다."
          },
          {
            q: "야스민 스쿼드의 주요 활동은 무엇인가요?",
            a: "정말 다양합니다! 정신 건강 교육 토크쇼, 디지털 크리에이티브 공모전, 건강 피트니스, 사회 봉사 활동, 재미있는 팀 빌딩 게임 등이 준비되어 있습니다."
          },
          {
            q: "가입하려면 특별한 재능이 있어야 하느냐?",
            a: "전혀 필요 없습니다! 가장 중요한 것은 배우고, 기여하고, 새로운 친구들과 협력하고자 하는 열정입니다."
          },
          {
            q: "최신 활동 일정은 어떻게 알 수 있나요?",
            a: "등록 및 번호 확인 후, 야스민 스쿼드 커뮤니티 공식 WhatsApp 그룹에 공식 초대됩니다. 모든 최신 일정은 해당 그룹에서 공유됩니다."
          }
        ];
      case 'ZH':
        return [
          {
            q: "加入雅斯敏青年先锋队（Yasmin Squad）有费用吗？",
            a: "完全免费，没有任何注册费或会员费。所有针对巴纽旺伊高中阶段（SMA/SMK/MA）学生的活动全部免费开放。"
          },
          {
            q: "我已经高中毕业了，还可以加入吗？",
            a: "当然可以！我们欢迎在校高中生以及刚毕业的青年学子加入我们，共同保持社交拓展与互助发展。"
          },
          {
            q: "雅斯敏青年先锋队有哪些具体活动？",
            a: "非常丰富多元！包括青少年心理健康讲座、数字创意大赛、健康有氧操、公益志愿服务以及趣味团队凝聚力建设等活动。"
          },
          {
            q: "需要有特定的才华特长才能加入吗？",
            a: "完全不需要！最重要的是拥有乐于学习、奉献和与新朋友团结协作的热情与精力。"
          },
          {
            q: "如何获取最新的活动日程安排？",
            a: "注册信息提交并经核实后，您将被正式邀请加入雅斯敏青年先锋队（Yasmin Squad）官方微信/WhatsApp交流群，所有最新通知均在群内发布。"
          }
        ];
      case 'AR':
        return [
          {
            q: "هل هناك رسوم للانضمام إلى ياسمين سكواد؟",
            a: "لا توجد أي رسوم تسجيل أو عضوية. جميع أنشطة ياسمين سكواد مجانية تماماً لطلاب المدارس الثانوية في بانيوانجي."
          },
          {
            q: "لقد تخرجت من الثانوية، هل يمكنني الانضمام؟",
            a: "بالتأكيد! نرحب بالطلاب الحاليين وكذلك الخريجين الجدد للبقاء على اتصال وتوسيع شبكة علاقاتهم."
          },
          {
            q: "ما هي أنشطة ياسمين سكواد؟",
            a: "متنوعة للغاية! تشمل ندوات التوعية بالصحة النفسية، مسابقات الإبداع الرقمي، الأنشطة الرياضية الصحية، الخدمات التطوعية، وألعاب بناء الفريق الترفيهية."
          },
          {
            q: "هل يجب أن تكون لدي موهبة خاصة للانضمام؟",
            a: "لا يشترط ذلك على الإطلاق! الشيء الأكثر أهمية هو الشغف بالتعلم، والمساهمة، والتعاون مع أصدقاء جدد."
          },
          {
            q: "كيف يمكنني معرفة جدول الأنشطة الأخير??",
            a: "بعد التسجيل والتحقق من البيانات، سيتم دعوتك رسمياً إلى مجموعة WhatsApp الخاصة بمجتمع ياسمين سكواد، حيث يتم نشر جميع الجداول والأنشطة الجديدة هناك."
          }
        ];
      default:
        return [
          {
            q: "Apakah ada biaya untuk bergabung di Yasmin Squad?",
            a: "Tidak ada biaya pendaftaran maupun keanggotaan. Semua kegiatan Yasmin Squad gratis untuk pelajar SMA/SMK/MA di Banyuwangi."
          },
          {
            q: "Saya sudah lulus SMA, boleh bergabung?",
            a: "Boleh! Kami menerima pelajar aktif maupun yang baru saja lulus sekolah (fresh graduate) untuk tetap berjejaring bersama."
          },
          {
            q: "Apa saja kegiatan Yasmin Squad?",
            a: "Beragam! Mulai dari talk show edukasi kesehatan mental, lomba kreativitas digital, senam sehat, bakti sosial, hingga fun games team building."
          },
          {
            q: "Apakah harus memiliki bakat tertentu untuk bergabung?",
            a: "Sama sekali tidak perlu! Yang terpenting adalah ketersediaan semangat untuk belajar, berkontribusi, dan berkolaborasi dengan teman-teman baru."
          },
          {
            q: "Bagaimana cara mengetahui jadwal kegiatan terbaru?",
            a: "Setelah mendaftar dan memverifikasi nomor, kamu akan langsung diundang resmi ke grup WhatsApp Komunitas Yasmin Squad. Semua jadwal terbaru akan didistribusikan di grup tersebut."
          }
        ];
    }
  };

  const faqs = getFaqs();

  const getLocalizedActivities = () => {
    switch (lang) {
      case 'EN':
        return [
          { type: '🎤 Talk Show & Discussion', examples: '"Teen Mental Health", "Careers in Healthcare"', benefit: 'Comprehensive education, depression prevention counseling, & career inspiration from experts.' },
          { type: '🎨 Creativity Contest', examples: 'Digital health poster design, short video creation, photography, digital poetry reading', benefit: 'Sharpening self-talents, adding digital portfolios, trophy appreciation & cash prizes.' },
          { type: '🏃 Health Events', examples: 'Energetic zumba exercises, healthy youth walk, free health screenings on car-free days', benefit: 'Implementing healthy lifestyles, physical fitness, adding positive energy together with friends.' },
          { type: '🤝 Social Care', examples: 'Basic food donations, coastal green cleaning work, stunting health campaign', benefit: 'Building empathy, genuine social care for the surrounding Banyuwangi environment.' },
          { type: '🗣️ Sharing Session', examples: 'Heart-to-heart sharing, brainstorming ideas, discussing routine programs among club management', benefit: 'Training assertive communication, public speaking, & compact teamwork.' },
          { type: '🎮 Fun Games', examples: 'Outbound team building, laughter quiz, educational games', benefit: 'Anti-boring refreshing tool, brief rest from school assignments, tight togetherness.' }
        ];
      case 'KR':
        return [
          { type: '🎤 토크쇼 & 토론', examples: '"청소년 정신 건강", "보건 의료 분야 커리어"', benefit: '전문가의 종합 교육, 우울증 예방 상담 및 커리어 영감 제공.' },
          { type: '🎨 창의성 경진대회', examples: '디지털 건강 포스터 디자인, 숏폼 비디오 제작, 사진, 디지털 시 낭송', benefit: '개인 재능 발굴, 디지털 포트폴리오 추가, 상장 및 상금 수여.' },
          { type: '🏃 건강 행사', examples: '활기찬 줌바 댄스, 청소년 건강 걷기, 차 없는 날 무료 건강 검진', benefit: '건강한 라이프스타일 실천, 체력 증진, 친구들과 긍정 에너지 공유.' },
          { type: '🤝 사회 공헌', examples: '생필품 기부, 해안가 친환경 청소, 아동 발달 장애 예방 캠페인', benefit: '바뉴왕이 지역 사회에 대한 진정성 있는 공감과 인도주의 실천.' },
          { type: '🗣️ 나눔 세션', examples: '마음 나누기 고민 상담, 아이디어 제안, 운영진 간 정기 프로그램 토론', benefit: '주장력 있는 소통 훈련, 대중 연설 실습 및 끈끈한 팀워크 형성.' },
          { type: '🎮 레크리에이션', examples: '팀 빌딩 아웃바운드 게임, 웃음 퀴즈, 교육 게임', benefit: '학업 스트레스 해소, 신나는 휴식, 돈독한 동료애 형성.' }
        ];
      case 'ZH':
        return [
          { type: '🎤 讲座与探讨', examples: '“青少年心理健康”、“医疗健康领域职业规划”', benefit: '全面科普教育、抑郁干预辅导以及专家的职业启发。' },
          { type: '🎨 创意大赛', examples: '数字化健康海报设计、短视频制作、摄影、数码诗歌朗诵', benefit: '激发个人潜能、充实数字化作品集、颁发奖杯及现金奖励。' },
          { type: '🏃 健康运动', examples: '动感尊巴健身、青少年健康步履、无车日免费义诊筛查', benefit: '践行健康生活方式、增强体魄、与伙伴们共同传递积极能量。' },
          { type: '🤝 公益志愿', examples: '捐赠爱心物资、海岸低碳环保志愿行、防治少儿发育不良宣传', benefit: '培养同理心、用真诚行动关爱巴纽旺伊本土周遭环境。' },
          { type: '🗣️ 分享沙龙', examples: '倾听彼此心声、头脑风暴、骨干成员讨论常规社群项目', benefit: '锻炼表达技巧、公众演说能力以及亲密团队协作。' },
          { type: '🎮 趣味拓展', examples: '团队凝聚力户外拓展、爆笑智力竞赛、寓教于乐互动游戏', benefit: '告别枯燥生活、从繁重课业中短暂放松、拉近彼此距离。' }
        ];
      case 'AR':
        return [
          { type: '🎤 ندوات وحوارات', examples: '"الصحة النفسية للشباب"، "المهن في مجال الرعاية الصحية"', benefit: 'تعليم شامل، وإرشاد للوقاية من الاكتئاب، وإلهام مهني من الخبراء.' },
          { type: '🎨 مسابقات إبداعية', examples: 'تصميم بوسترات صحية رقمية، صناعة فيديوهات قصيرة، تصوير فوتوغرافي، إلقاء شعر رقمي', benefit: 'صقل المواهب الفردية، بناء ملف أعمال رقمي، وجوائز نقدية ودروع تقديرية.' },
          { type: '🏃 فعاليات صحية', examples: 'تمارين زومبا حيوية، مسيرة مشي صحية للشباب، فحوصات مجانية في أيام خلو الشوارع من السيارات', benefit: 'تطبيق أنماط الحياة الصحية، اللياقة البدنية، ونشر الطاقة الإيجابية مع الأصدقاء.' },
          { type: '🤝 العمل التطوعي والخيري', examples: 'تبرعات بالمواد الغذائية، حملات تنظيف الشواطئ، حملات توعية ضد سوء التغذية للأطفال', benefit: 'بناء التعاطف، والاهتمام الاجتماعي الصادق بالبيئة المحيطة في بانيوانجي.' },
          { type: '🗣️ جلسات مشاركة وتواصل', examples: 'جلسات فضفضة، تبادل أفكار، نقاش برامج الأنشطة الدورية بين المنسقين', benefit: 'تدريب على التواصل الفعال، الخطابة والإلقاء، والعمل الجماعي المتناغم.' },
          { type: '🎮 ألعاب ترفيهية', examples: 'أنشطة بناء الفريق في الهواء الطلق، مسابقة مسلية، ألعاب تعليمية', benefit: 'وسيلة تترفيه تكسر الروتين، قسط من الراحة من الواجبات المدرسية، وتوطيد أواصر الصداقة.' }
        ];
      default:
        return [
          { type: '🎤 Talk Show & Diskusi', examples: '"Sehat Mental untuk Remaja", "Karier di Bidang Kesehatan"', benefit: 'Edukasi komprehensif, penyuluhan pencegahan depresi, & inspirasi karier dari expert.' },
          { type: '🎨 Lomba Kreativitas', examples: 'Desain poster kesehatan digital, pembuatan video pendek, fotografi, baca puisi digital', benefit: 'Mengasah bakat diri, nambah portofolio digital, apresiasi piala & hadiah tunai.' },
          { type: '🏃 Event Kesehatan', examples: 'Senam zumba energik, jalan sehat remaja, screening kesehatan gratis di car free day', benefit: 'Menerapkan gaya hidup sehat, bugar fisik, nambah energi positif bareng teman-teman.' },
          { type: '🤝 Bakti Sosial', examples: 'Donasi sembako, kerja bakti hijau pesisir pantai, kampanye kesehatan stunting', benefit: 'Membangun empati, kepedulian sosial tulus terhadap lingkungan banyuwangi sekitar.' },
          { type: '🗣️ Sharing Session', examples: 'Saling curhat, curah ide, diskusi program rutin antar pengurus klan', benefit: 'Melatih komunikasi asertif, public speaking, & kerjasama team kompak.' },
          { type: '🎮 Fun Games', examples: 'Outbound team building, kuis tawa, permainan edukatif', benefit: 'Sarana refreshing anti boring, rehat sejenak dari tugas sekolah, erat kebersamaan.' }
        ];
    }
  };

  const getLocalizedSquadCalendar = () => {
    switch (lang) {
      case 'EN':
        return [
          { month: 'JUNE', day: '28', title: 'Launching Yasmin Squad & First Gathering', subtitle: 'Official launching session & first member klan introduction', location: 'RS Yasmin Hall', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: 'JULY', day: '05', title: 'Workshop "Public Speaking for Youth"', subtitle: 'Overcome nervousness, speak confidently in public with Doctors & PR', location: 'Mentoring Class', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: 'JULY', day: '12', title: 'Healthy Workout & Free Youth Health Screening', subtitle: 'Lively zumba full of door prizes & free cholesterol/uric acid test', location: 'RS Yasmin Garden', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: 'JULY', day: '19', title: 'Poster Design Contest Upload Deadline "Healthy Living"', subtitle: 'Judging of educational poster works with laptop & scholarship prizes', location: 'Online & Hall', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: 'JULY', day: '26', title: 'Social Service & Donation to Orphanages', subtitle: 'Distribution of basic food & trauma healing with orphanage children', location: 'Location TBA', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      case 'KR':
        return [
          { month: '6월', day: '28', title: '야스민 스쿼드 런칭 & 첫모임', subtitle: '공식 출범식 및 첫 번째 가입 멤버 상호 소개 세션', location: '야스민 병원 대강당', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: '7월', day: '05', title: '워크숍 "청소년을 위한 대중 연설 스킬"', subtitle: '발표 긴장 극복 및 의료진/홍보단과 함께하는 말하기 교육', location: '멘토링 교실', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: '7월', day: '12', title: '청소년 건강 운동 및 무료 정밀 검진의 날', subtitle: '줌바 댄스, 경품 증정 및 무료 콜레스테롤/요산 수치 정밀 측정', location: '야스민 병원 야외정원', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: '7월', day: '19', title: '“건강한 삶” 디지털 일러스트 공모전 접수 마감', subtitle: '우수 교육 포스터 출품작 심사 및 노트북/장학금 수여식', location: '온라인 및 대강당', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: '7월', day: '26', title: '아동 보육 시설 합동 봉사 및 생필품 기부', subtitle: '사랑의 쌀 나눔 및 아이들과 함께하는 정서 치유 레크리에이션', location: '장소 추후 공지', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      case 'ZH':
        return [
          { month: '6月', day: '28', title: '雅斯敏青年先锋正式启动暨首次见面会', subtitle: '官方常务委员会启动礼以及首批先锋队员相互交流研讨', location: '雅斯敏医院大礼堂', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: '7月', day: '05', title: '“如何进行高品质公众演说”青年训练营', subtitle: '克服登台紧张、与名医及公关团队面对面学习演说艺术', location: '名师工作坊', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: '7月', day: '12', title: '动感活力健身操及青少年免费体检义诊', subtitle: '爆笑尊巴舞、现场幸运抽奖以及免费胆固醇和尿酸指标筛查', location: '雅斯敏医院景观庭院', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: '7月', day: '19', title: '“健康新风尚”数字化海报设计大赛截止投递', subtitle: '专业评委对优秀海报进行打分评选，一等奖可获电脑及奖学金', location: '线上及大礼堂', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: '7月', day: '26', title: '走进福利院爱心慰问 with 绿色环保环保行', subtitle: '现场分发爱心物资、开展陪伴活动并向孩子们传递温暖', location: '目的地待定', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      case 'AR':
        return [
          { month: 'يونيو', day: '28', title: 'إطلاق ياسمين سكواد واللقاء التعريفي الأول', subtitle: 'مراسم الإطلاق الرسمي والتعارف بين الدفعة الأولى من الأعضاء', location: 'قاعة مستشفى ياسمين', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: 'يوليو', day: '05', title: 'ورشة عمل "الخطابة والإلقاء المؤثر للشباب"', subtitle: 'تغلب على الخوف وتحدث بثقة أمام الجمهور مع الأطباء والإعلاميين', location: 'فصل التوجيه والتدريب', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: 'يوليو', day: '12', title: 'الرياضة الجماعية والفحص الطبي المجاني للشباب', subtitle: 'تمارين زومبا حيوية، وتوزيع جوائز، وفحوصات مجانية للدم والسكري', location: 'حديقة مستشفى ياسمين', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: 'يوليو', day: '19', title: 'الموعد الأخير لرفع مشاركات مسابقة بوستر "الحياة الصحية"', subtitle: 'تقييم الأعمال الإبداعية مع توزيع جوائز تشمل لابتوب ومنح دراسية', location: 'أونلاين والقاعة الكبرى', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: 'يوليو', day: '26', title: 'العمل التطوعي الخيري والزيارة الإنسانية لدار الأيتام', subtitle: 'توزيع طرود غذائية وأنشطة الدعم النفسي والترفيه للأطفال', location: 'سيتم تحديد الموقع لاحقاً', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
      default:
        return [
          { month: 'JUNI', day: '28', title: 'Launching Yasmin Squad & Gathering Perdana', subtitle: 'Sesi peluncuran resmi & perkenalan klan member pertama', location: 'Aula RS Yasmin', bg: 'bg-[#DC2626]', border: 'border-red-700' },
          { month: 'JULI', day: '05', title: 'Workshop "Public Speaking untuk Remaja"', subtitle: 'Melahap gugup, berbicara mantap di depan umum bersama Dokter & Humas', location: 'Kelas Mentoring', bg: 'bg-[#EA580C]', border: 'border-orange-600' },
          { month: 'JULI', day: '12', title: 'Senam Sehat & Cek Kesehatan Gratis Remaja', subtitle: 'Zumba meriah bertabur doorprize & cek kolesterol/asam urat gratis', location: 'Taman RS Yasmin', bg: 'bg-[#D97706]', border: 'border-amber-600' },
          { month: 'JULI', day: '19', title: 'Batas Upload Lomba Desain Poster "Hidup Sehat"', subtitle: 'Penjurian karya poster edukasi berhadiah laptop & beasiswa', location: 'Online & Aula', bg: 'bg-[#059669]', border: 'border-emerald-600' },
          { month: 'JULI', day: '26', title: 'Bakti Sosial & Donasi untuk Panti Asuhan', subtitle: 'Pembagian sembako & trauma healing bareng adik-adik asuhan', location: 'Lokasi Ditentukan', bg: 'bg-[#2563EB]', border: 'border-blue-600' }
        ];
    }
  };

  return (
    <div id="yasmin-squad-page" className="bg-[#FAF9F5] text-left min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFFEEF] via-[#FDF7E2] to-[#FAF9F5] py-16 sm:py-24 border-b border-[#EAE6D1]">
        {/* Playful Floating elements for younger vibe */}
        <div className="absolute top-12 left-10 w-24 h-24 bg-orange-300/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-16 right-12 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
        <div className="absolute top-28 right-1/4 w-16 h-16 bg-red-300/20 rounded-full blur-md animate-bounce-slow" />

        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Texts */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-display text-xs text-white font-extrabold uppercase tracking-widest bg-orange-500 border-2 border-headings px-4 py-2 rounded-full inline-flex items-center gap-2 shadow-[2px_2px_0px_#1e1e1e] rotate-[-1.5deg]">
                <Sparkles className="h-4 w-4 text-white animate-spin-slow" />
                {t.badge}
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-headings mt-2 leading-[1.1] tracking-tight">
                {t.title}
              </h1>
              
              <p className="text-gray-600 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
                {t.desc}
              </p>

              <div className="flex flex-wrap gap-2.5 font-mono text-[10px] font-bold text-gray-600 uppercase">
                <span className="bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-2xs">{t.tag1}</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-2xs">{t.tag2}</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-2xs">{t.tag3}</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-2xs">{t.tag4}</span>
              </div>

              <p className="text-xs text-gray-500 font-bold italic">
                {t.slogan} <span className="text-orange-600">#BergerakBersamaYasminSquad</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <a
                  href="#pendaftaran-squad"
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-display text-sm font-black tracking-wider rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[2px_2px_0px_#1e1e1e] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center cursor-pointer animate-fade-in"
                >
                  {t.btnJoin}
                </a>
                <a
                  href="#kegiatan-squad"
                  className="px-8 py-3.5 bg-white hover:bg-slate-50 text-headings font-display text-sm font-black tracking-wider rounded-2xl border-3 border-divider shadow-[4px_4px_0px_#e5e7eb] text-center"
                >
                  {t.btnView}
                </a>
              </div>
            </div>

            {/* Right Card Graphic */}
            <div className="lg:col-span-6 relative flex justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-divider aspect-[1.4/1] group bg-orange-50/60 w-full ml-auto mr-0">
                
                {/* Visual presentation - playful background and character */}
                <div className="absolute inset-0">
                  <SafeImage 
                    src={clubSquadsImg} 
                    alt="Yasmin Squad" 
                    className="w-full h-full object-fill transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. TENTANG YASMIN SQUAD */}
      <div className="py-20 bg-white border-b border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="font-mono text-xs text-orange-500 font-bold uppercase tracking-widest block">{t.aboutBadge}</span>
              <h2 className="font-display font-black text-3xl text-headings leading-tight">{t.aboutTitle}</h2>
              <p className="text-gray-655 text-base leading-relaxed">
                {t.aboutDesc}
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-5 bg-orange-50 border border-orange-200 rounded-2xl shadow-2xs flex items-start space-x-3">
                <span className="text-2xl shrink-0">🎨</span>
                <div className="space-y-1 text-left">
                  <h4 className="font-display font-bold text-xs text-headings">{t.tag1}</h4>
                  <p className="text-[10px] text-gray-555 leading-normal">
                    {lang === 'ID' ? 'Bebas mengekspresikan diri melalui berbagai kreativitas positif.' : lang === 'KR' ? '다양한 창의적 활동을 통해 자유롭게 개성을 표출합니다.' : lang === 'ZH' ? '通过丰富的创新活动展示个人风采。' : lang === 'AR' ? 'حرية التعبير عن النفس من خلال الأنشطة الإبداعية المتنوعة.' : 'Express yourself freely through various creative activities.'}
                  </p>
                </div>
              </div>
              <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl shadow-2xs flex items-start space-x-3">
                <span className="text-2xl shrink-0">🧠</span>
                <div className="space-y-1 text-left">
                  <h4 className="font-display font-bold text-xs text-headings">{t.tag2}</h4>
                  <p className="text-[10px] text-gray-555 leading-normal">
                    {lang === 'ID' ? 'Mengembangkan potensi intelektual dan minat bakat remaja.' : lang === 'KR' ? '청소년의 지적 잠재력과 재능을 개발합니다.' : lang === 'ZH' ? '发掘和培养青少年的智力潜能与特长。' : lang === 'AR' ? 'تطوير القدرات الذهنية وصقل مواهب الشباب.' : 'Hone your intellectual potential and creative talents.'}
                  </p>
                </div>
              </div>
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-2xs flex items-start space-x-3">
                <span className="text-2xl shrink-0">🤝</span>
                <div className="space-y-1 text-left">
                  <h4 className="font-display font-bold text-xs text-headings">{t.tag3}</h4>
                  <p className="text-[10px] text-gray-555 leading-normal">
                    {lang === 'ID' ? 'Berjejaring harmonis dengan rekan sebaya se-Banyuwangi.' : lang === 'KR' ? '지역 또래 친구들과 깊고 따뜻하게 소통합니다.' : lang === 'ZH' ? '与全市同龄伙伴开展广泛的友好协作交流。' : lang === 'AR' ? 'بناء شبكة تواصل إيجابية مع الأقران في بانيوانجي.' : 'Network harmoniously with peers across Banyuwangi.'}
                  </p>
                </div>
              </div>
              <div className="p-5 bg-red-50 border border-red-200 rounded-2xl shadow-2xs flex items-start space-x-3">
                <span className="text-2xl shrink-0">🏃</span>
                <div className="space-y-1 text-left">
                  <h4 className="font-display font-bold text-xs text-headings">{t.tag4}</h4>
                  <p className="text-[10px] text-gray-555 leading-normal">
                    {lang === 'ID' ? 'Menjelajahi kebiasaan hidup sehat mental & fisik sejak muda.' : lang === 'KR' ? '어린 나이부터 심신 건강 생활 습관을 기릅니다.' : lang === 'ZH' ? '从小建立良好、科学的身心健康生活常态。' : lang === 'AR' ? 'تبني عادات حياة صحية بدنياً ونفسياً منذ الصغر.' : 'Explore healthy habits for mind and body from youth.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VISI & MISI */}
      <div className="py-20 bg-[#FAF9F5] border-b border-[#EAE6D1]">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-orange-500 font-bold uppercase tracking-widest bg-white border border-divider px-3 py-1 rounded-full">
              VISI & MISI KOMUNITAS
            </span>
            <h2 className="font-display font-black text-3xl text-headings">{t.visiTitle}</h2>
          </div>

          <div className="bg-white border-4 border-headings rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            <div className="space-y-3 pb-6 border-b border-divider text-center">
              <span className="text-xs font-mono font-bold text-orange-500 uppercase tracking-wider block">VISI UTAMA</span>
              <p className="font-display font-extrabold text-lg text-headings leading-relaxed">
                &quot;{t.visiText}&quot;
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#0B4F4A] uppercase tracking-wider block text-center">{t.misiTitle}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-655">
                <div className="flex items-center space-x-3.5">
                  <p className="leading-relaxed">{t.misi1}</p>
                </div>
                <div className="flex items-center space-x-3.5">
                  <p className="leading-relaxed">{t.misi2}</p>
                </div>
                <div className="flex items-center space-x-3.5">
                  <p className="leading-relaxed">{t.misi3}</p>
                </div>
                <div className="flex items-center space-x-3.5">
                  <p className="leading-relaxed">{t.misi4}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. SIAPA YANG BISA BERGABUNG */}
      <div className="py-20 bg-white border-b border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-orange-500 font-bold uppercase tracking-widest bg-orange-100 border border-orange-200 px-3 py-1 rounded-full">
              {t.eligBadge}
            </span>
            <h2 className="font-display font-black text-3xl text-headings">{t.eligTitle}</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {t.eligDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl shrink-0">🎒</span>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings">
                    {t.elig1Title}
                  </h4>
                </div>
                <p className="text-sm text-gray-655 leading-relaxed font-sans">
                  {t.elig1Desc}
                </p>
              </div>
              <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider">
                {lang === 'ID' ? 'Siswa & Alumni' : lang === 'KR' ? '재학생 및 졸업생' : lang === 'ZH' ? '学生与校友' : lang === 'AR' ? 'الطلاب والخريجين' : 'Students & Alumni'}
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl shrink-0">✨</span>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings">
                    {t.elig2Title}
                  </h4>
                </div>
                <p className="text-sm text-gray-655 leading-relaxed font-sans">
                  {t.elig2Desc}
                </p>
              </div>
              <span className="text-xs font-mono text-yellow-600 font-bold uppercase tracking-wider">
                {lang === 'ID' ? 'Mau Belajar & Tumbuh' : lang === 'KR' ? '학습 및 성장 의지' : lang === 'ZH' ? '积极学习与成长' : lang === 'AR' ? 'الرغبة في التعلم والنمو' : 'Willing to Learn & Grow'}
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl shrink-0">🔥</span>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings">
                    {t.elig3Title}
                  </h4>
                </div>
                <p className="text-sm text-gray-655 leading-relaxed font-sans">
                  {t.elig3Desc}
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider">
                {lang === 'ID' ? 'Semangat Berkontribusi' : lang === 'KR' ? '기여 의지' : lang === 'ZH' ? '志愿服务' : lang === 'AR' ? 'المساهمة الاجتماعية' : 'Contribution'}
              </span>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FAF9F5] border-2 border-divider p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl shrink-0">🛡️</span>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-headings">
                    {t.elig4Title}
                  </h4>
                </div>
                <p className="text-sm text-gray-655 leading-relaxed font-sans">
                  {t.elig4Desc}
                </p>
              </div>
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">
                {lang === 'ID' ? 'Bebas Narkoba & SARA' : lang === 'KR' ? '도덕성 및 법 준수' : lang === 'ZH' ? '身心健康端正' : lang === 'AR' ? 'بيئة آمنة' : 'Safe Environment'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* 5. KEGIATAN YASMIN SQUAD TABLE */}
      <div id="kegiatan-squad" className="py-20 bg-[#FAF9F5]">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 w-full animate-fade-in-up">
            <span className="font-mono text-xs text-[#0B4F4A] font-bold uppercase tracking-widest bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
              SQUAD ACTIVITIES MATRIX
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {lang === 'ID' ? 'Apa Saja Kegiatan Seru Kami?' : lang === 'KR' ? '우리의 주요 재미있는 활동은 무엇인가요?' : lang === 'ZH' ? '我们有哪些精彩活动？' : lang === 'AR' ? 'ما هي أنشطتنا الممتعة؟' : 'What Are Our Fun Activities?'}
            </h2>
            <p className="text-gray-500 text-sm">
              {lang === 'ID'
                ? 'Berikut adalah penggolongan sirkuit kegiatan reguler yang bakal nemenin keseharian kreatif kamu:'
                : lang === 'KR'
                ? '여러분의 창의적인 일상을 채워줄 정기 활동 유형은 다음과 같습니다:'
                : lang === 'ZH'
                ? '以下是我们将陪伴你度过创意日常的常态化活动分类：'
                : lang === 'AR'
                ? 'إليك تصنيف الأنشطة الدورية التي سترافق حياتك الإبداعية اليومية:'
                : 'Here is the classification of our regular activities that will accompany your creative daily life:'}
            </p>
          </div>

          <div className="bg-white border-4 border-headings rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-divider text-gray-500 font-mono tracking-wider font-bold">
                    <th className="p-4 pl-6 w-1/4">
                      {lang === 'ID' ? 'Jenis Kegiatan' : lang === 'KR' ? '활동 종류' : lang === 'ZH' ? '活动类别' : lang === 'AR' ? 'نوع النشاط' : 'Activity Type'}
                    </th>
                    <th className="p-4 w-1/3">
                      {lang === 'ID' ? 'Contoh Nyata' : lang === 'KR' ? '실제 사례' : lang === 'ZH' ? '具体实例' : lang === 'AR' ? 'أمثلة واقعية' : 'Real Examples'}
                    </th>
                    <th className="p-4">
                      {lang === 'ID' ? 'Manfaat Khusus' : lang === 'KR' ? '특별한 혜택' : lang === 'ZH' ? '专属收获' : lang === 'AR' ? 'فوائد خاصة' : 'Special Benefits'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider font-sans font-medium text-gray-700">
                  {getLocalizedActivities().map((act, idx) => (
                    <tr key={idx}>
                      <td className="p-4 pl-6 font-display font-extrabold text-headings text-sm flex items-center gap-1.5">
                        {act.type}
                      </td>
                      <td className="p-4 text-gray-600">{act.examples}</td>
                      <td className="p-4 text-gray-500 font-sans">{act.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* 6. KALENDER KEGIATAN */}
      <div className="py-20 bg-white border-b border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-orange-500 font-bold uppercase tracking-widest">SCHEDULE CALENDAR</span>
            <h3 className="font-display font-black text-2xl text-headings">
              {lang === 'ID' ? 'Kalender Rencana Kegiatan Squad 2026' : lang === 'KR' ? '2026년 스쿼드 활동 계획 캘린더' : lang === 'ZH' ? '2026年青年先锋队活动计划日历' : lang === 'AR' ? 'جدول أنشطة سكواد لعام ٢٠٢٦' : 'Squad 2026 Activity Schedule Calendar'}
            </h3>
          </div>

          <div className="border border-divider rounded-2xl overflow-hidden divide-y divide-divider/70 shadow-2xs">
            {getLocalizedSquadCalendar().map((item, idx) => (
              <div key={idx} className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${idx === 0 ? 'bg-[#FFFDF0]' : ''}`}>
                <div className="flex items-center space-x-3.5">
                  <div className={`${item.bg} border-2 ${item.border} p-2 sm:p-2.5 rounded-2xl text-center text-white shrink-0 w-24 h-24 flex flex-col justify-center items-center leading-none shadow-xs`}>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest block opacity-90 leading-none">{item.month}</span>
                    <span className="text-2xl sm:text-3xl font-display font-black block leading-none mt-1.5 mb-1">{item.day}</span>
                    <span className="text-[9px] font-mono block opacity-85 leading-none">2026</span>
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm sm:text-base text-headings">{item.title}</h4>
                    <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">{item.subtitle}</p>
                  </div>
                </div>
                <span className="bg-orange-100 text-orange-850 font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {item.location}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 9. GALERI KEGIATAN */}
      <div className="py-20 bg-[#FAF9F5] border-b border-[#EAE6D1]">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-orange-500 font-extrabold uppercase tracking-widest bg-white border border-divider px-3 py-1 rounded-full">
              📸 SQUAD ACTIVITY DOCUMENTATION
            </span>
            <h3 className="font-display font-black text-3xl text-headings">Galeri Kegiatan Yasmin Squad</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400" alt="Squad Launching" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Gathering Akbar</p>
            </div>
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400" alt="Mentoring" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Public Speaking Class</p>
            </div>
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1472691681358-fdf00a4bfcfe?auto=format&fit=crop&q=80&w=400" alt="Zumba" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Morning Walk & Fun</p>
            </div>
            <div className="bg-white border-2 border-divider p-3 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400" alt="Poster Lomba" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Karya Seni Digital</p>
            </div>
            <div className="bg-white border-2 border-divider p-3 rounded-xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400" alt="Bakti Sosial" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Bakti Sosial Hijau</p>
            </div>
            <div className="bg-white border-2 border-divider p-3 rounded-xl shadow-3xs overflow-hidden flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1489533119213-66a5cd877091?auto=format&fit=crop&q=80&w=400" alt="Outbound" className="w-full h-32 object-cover rounded-xl"  />
              <p className="text-[11px] font-display font-bold text-headings text-center mt-2.5 truncate">Youth Fun Games</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-orange-600 font-bold hover:underline cursor-pointer">Lihat Galeri Lengkap →</span>
          </div>

        </div>
      </div>

      {/* 8. TESTIMONIALS */}
      <div className="py-20 bg-white border-b border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-yellow-500 font-bold uppercase tracking-widest">KATA ANGGOTA SQUAD</span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">Apa Kata Anggota Yasmin Squad?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-orange-50/50 p-8 rounded-3xl border border-orange-200 relative">
              <span className="absolute top-4 left-4 text-5xl text-orange-300 select-none font-bold">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 leading-relaxed italic z-10 relative">
                "Senang banget ada wadah kayak Yasmin Squad. Aku jadi punya teman baru dan belajar banyak hal, mulai dari kesehatan sampai public speaking!"
              </p>
              <div className="mt-5 border-t border-orange-200 pt-3 flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-orange-300 border border-headings flex items-center justify-center font-bold text-xs">👩</div>
                <div>
                  <strong className="block text-headings font-display font-black text-sm">Andini</strong>
                  <span className="text-[11px] text-gray-400">Siswi SMAN 1 Banyuwangi</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50/50 p-8 rounded-3xl border border-yellow-200 relative">
              <span className="absolute top-4 left-4 text-5xl text-yellow-300 select-none font-bold">“</span>
              <p className="text-sm sm:text-base md:text-lg text-gray-750 leading-relaxed italic z-10 relative">
                "Komunitas ini seru banget! Kegiatannya variatif, nggak membosankan, dan bikin kita makin peduli sama kesehatan."
              </p>
              <div className="mt-5 border-t border-yellow-200 pt-3 flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-yellow-400 border border-headings flex items-center justify-center font-bold text-xs">👨</div>
                <div>
                  <strong className="block text-headings font-display font-black text-sm">Rizky</strong>
                  <span className="text-[11px] text-gray-400">Siswa SMK Negeri 1 Banyuwangi</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 7. INTERACTIVE REGISTRATION FORM */}
      <div id="pendaftaran-squad" className="py-20 bg-gradient-to-b from-[#FDF7E2]/25 to-[#FAF9F5] border-t border-divider/40">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3 w-full animate-fade-in-up">
            <span className="font-mono text-xs text-[#0B4F4A] font-extrabold uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block">
              SQUAD REGISTRATION DESK
            </span>
            <h2 className="font-display font-black text-3xl text-headings">Formulir Pendaftaran Yasmin Squad</h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">Isi formulir bimbingan di bawah ini dengan lengkap untuk mendapatkan Kartu Keanggotaan Squad digital secara langsung!</p>
          </div>

          <div className="bg-white border-4 border-headings rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#f97316] relative overflow-hidden">
            
            {registeredCard ? (
              <div id="squad-success-card" className="space-y-6 text-center py-6 animate-fade-in-up">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto text-orange-600 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <h3 className="font-display font-black text-xl text-headings">🎉 Pendaftaran Berhasil!</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">Selamat bergabung, laskar muda! Kamu telah sukses didata sebagai bagian resmi dari ekosistem Yasmin Squad Banyuwangi.</p>

                {/* Identity Card Mockup */}
                <div className="w-full max-w-md mx-auto bg-gradient-to-r from-headings via-slate-800 to-slate-900 text-left rounded-3xl p-6 text-white border-3 border-orange-500 relative shadow-2xl overflow-hidden">
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <span className="font-mono text-[8px] font-bold text-orange-400 uppercase tracking-widest block">MEMBER CARD</span>
                      <span className="font-display font-black text-sm text-white tracking-widest">YASMIN SQUAD</span>
                    </div>
                    <span className="font-mono text-[8px] text-white/50 bg-white/10 px-2.5 py-1 rounded border border-white/10">BANYUWANGI</span>
                  </div>

                  {/* Card Body */}
                  <div className="mt-5 space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-white/40 font-mono text-[9px] uppercase">ID SQUAD</span>
                      <strong className="text-orange-400 font-mono col-span-2">{registeredCard.id}</strong>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-white/40 font-mono text-[9px] uppercase">NAMA LENGKAP</span>
                      <span className="font-display font-bold text-white col-span-2 uppercase">{registeredCard.namaLengkap}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-white/40 font-mono text-[9px] uppercase">ASAL SEKOLAH</span>
                      <span className="col-span-2 text-white/90 font-medium">{registeredCard.namaSekolah}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-white/40 font-mono text-[9px] uppercase">KELAS ANGKATAN</span>
                      <span className="col-span-2 text-white/90">{registeredCard.kelasAngkatan || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-white/40 font-mono text-[9px] uppercase">WHATSAPP</span>
                      <span className="col-span-2 font-mono text-emerald-400">{registeredCard.telepon}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 border-t border-white/10 pt-3 flex justify-between items-center text-[8px] font-mono text-white/40 uppercase">
                    <span>#BergerakBersamaYasminSquad</span>
                    <span>Tgl Daftar: {registeredCard.timestamp}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      alert('Mencetak kartu... Pastikan printer terhubung.');
                      window.print();
                    }}
                    className="px-5 py-2.5 bg-headings hover:bg-slate-800 text-white font-display text-xs font-bold rounded-xl border border-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5 justify-center"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Cetak Kartu Member
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Daftar Baru
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs text-left" id="squad-form-fields">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Nama Lengkap *</label>
                    <input
                      required
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleFormChange}
                      placeholder="Masukkan nama lengkap kamu"
                      className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl font-medium placeholder-gray-400 uppercase tracking-wide focus:border-orange-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Nama Sekolah / Asal Sekolah *</label>
                    <input
                      required
                      type="text"
                      name="namaSekolah"
                      value={formData.namaSekolah}
                      onChange={handleFormChange}
                      placeholder="Contoh: SMAN 1 Banyuwangi"
                      className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl font-medium focus:border-orange-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Kelas / Angkatan</label>
                    <input
                      type="text"
                      name="kelasAngkatan"
                      value={formData.kelasAngkatan}
                      onChange={handleFormChange}
                      placeholder="Contoh: XI MIPA 3 / Angkatan 2026"
                      className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl font-medium focus:border-orange-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Nomor WhatsApp Aktif *</label>
                    <input
                      required
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleFormChange}
                      placeholder="Contoh: 08123456XXXX"
                      className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl font-mono focus:border-orange-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Alamat Domisili</label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleFormChange}
                    placeholder="Masukkan alamat RT/RW, Dusun, Desa, Kecamatan dan Kabupaten"
                    className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl focus:border-orange-500 focus:bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Minat / Bakat (opsional)</label>
                    <input
                      type="text"
                      name="minatBakat"
                      value={formData.minatBakat}
                      onChange={handleFormChange}
                      placeholder="Contoh: Desain Grafis, Musik, Olahraga, Menulis"
                      className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl focus:border-orange-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-extrabold uppercase text-[10px] tracking-wider">Alasan Bergabung (opsional)</label>
                    <textarea
                      rows={1}
                      name="alasan"
                      value={formData.alasan}
                      onChange={handleFormChange}
                      placeholder="Ceritakan singkat motivasi kamu bergabung"
                      className="w-full bg-slate-50 border-2 border-divider p-3.5 rounded-xl focus:border-orange-500 focus:bg-white outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="bg-[#FFFDF0] border-2 border-yellow-200 rounded-2xl p-4.5 space-y-2 text-[11px] leading-relaxed text-gray-500">
                  <h5 className="font-display font-black text-headings tracking-wide uppercase text-[9.5px]">📋 SYARAT PENDAFTARAN:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Pelajar aktif/baru lulus SMA/SMK/MA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Berdomisili di wilayah Banyuwangi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Mengisi data diri asli & valid</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Bergabung di grup WhatsApp komunitas</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    disabled={loading}
                    type="submit"
                    className="px-10 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-headings font-display text-sm font-black tracking-wider text-white rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[1px_1px_0px_#1e1e1e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
                  >
                    {loading ? 'Memvalidasi...' : 'Kirim Formulir & Klaim Member'}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* 10. FAQ SECTION */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-orange-500 font-bold uppercase tracking-widest">
              {lang === 'ID' ? 'PERTANYAAN UMUM' : lang === 'KR' ? '자주 묻는 질문' : lang === 'ZH' ? '常见疑问解答' : lang === 'AR' ? 'أسئلة شائعة' : 'COMMON QUESTIONS'}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {lang === 'ID' ? 'Pertanyaan yang Sering Diajukan' : lang === 'KR' ? '자주 묻는 질문 (FAQ)' : lang === 'ZH' ? '常见问题解答' : lang === 'AR' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="divide-y divide-divider/60 border border-divider rounded-2xl overflow-hidden bg-[#FAF9F5]/50">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-display text-[13px] font-extrabold text-headings hover:bg-orange-50/20 transition-all cursor-pointer outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs text-orange-500/85">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-gray-500 leading-relaxed font-sans border-t border-divider/10 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 11. CALL TO ACTION PLACEMENT */}
      <div className="py-16 bg-gradient-to-tr from-headings to-[#0B4F4A] text-white border-t-4 border-orange-500 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
        
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 relative z-10">
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Ayo Bergerak dan Berkarya Bersama Yasmin Squad!
          </h2>
          <p className="text-sm sm:text-base text-white/80 w-full mx-auto font-sans leading-relaxed">
            Mulailah petualangan produktif, bangun koneksi teman sebaya se-kabupaten, dan dapatkan akses bimbingan kesehatan gratis seumur hidup.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="#pendaftaran-squad"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-display text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
            >
              Gabung Sekarang
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://wa.me/628123456789?text=Halo%20Admin%20Yasmin%20Squad,%20saya%20ingin%20tanya%20seputar%20komunitas..."
              className="px-6 py-3 bg-white hover:bg-slate-100 text-headings font-display text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
            >
              Hubungi Admin WA
            </a>
            <a
              href="#kegiatan-squad"
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-display text-xs font-black tracking-widest rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              Lihat Kegiatan
            </a>
            <a
              href="#yasmin-squad-page"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('main-footer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-display text-xs font-black tracking-widest rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              Lokasi RS Yasmin
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
