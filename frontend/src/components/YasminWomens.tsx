import React, { useState } from 'react';
import { SafeImage } from '../utils/imageUrl';
const clubWomenImg = '/assets/images/komunitas/rsyasminclub_women.jpg';
import { 
  Venus, Calendar, Heart, GraduationCap, BookOpen, Users, 
  HelpCircle, CheckCircle, ArrowRight, UserPlus, Sparkles, 
  MapPin, MessageCircle, Star, Phone, Check, ClipboardList, Info
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { EXTRA_TRANSLATIONS } from '../translations_extra';

export default function YasminWomens() {
  const lang = useLanguage();
  const t = EXTRA_TRANSLATIONS.WOMENS[lang] || EXTRA_TRANSLATIONS.WOMENS.ID;

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [joinedWomens, setJoinedWomens] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLocation, setShowLocation] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    namaLengkap: '',
    usia: '',
    pekerjaanStatus: '',
    telepon: '',
    tipeGabung: 'Individu', // Individu or Kelompok
    namaKelompok: '',
    jumlahAnggota: '',
    topikDiminati: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.telepon) {
      setErrorMsg(t.alertRequired || 'Mohon isi Nama Lengkap dan No WhatsApp/Telepon!');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setJoinedWomens({
        id: `YW-CLUB-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleDateString('id-ID'),
        ...formData
      });

      // Prepare WhatsApp Redirection message
      const groupText = formData.tipeGabung === 'Kelompok' 
        ? `\n- Nama Kelompok: ${formData.namaKelompok}\n- Jumlah Anggota: ${formData.jumlahAnggota}` 
        : '';
      const text = `Halo Admin RS Yasmin, saya ingin bergabung dengan Yasmin Women's Club!\n\n` +
        `- Nama: ${formData.namaLengkap}\n` +
        `- Usia: ${formData.usia} tahun\n` +
        `- Pekerjaan/Status: ${formData.pekerjaanStatus}\n` +
        `- No. WA: ${formData.telepon}\n` +
        `- Pendaftaran: ${formData.tipeGabung}${groupText}\n` +
        `- Topik Pembahasan yang Diminati: ${formData.topikDiminati || 'Kesehatan Umum Wanita'}\n\n` +
        `Terima kasih!`;
      
      const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
      
      setTimeout(() => {
        document.getElementById('womens-success-card')?.scrollIntoView({ behavior: 'smooth' });
        // Auto trigger whatsapp in a safe way
        window.open(whatsappUrl, '_blank');
      }, 100);
    }, 1000);
  };

  const getFaqs = () => {
    switch (lang) {
      case 'EN':
        return [
          {
            q: "Is there a fee to join?",
            a: "There are no registration fees. All Yasmin Women Club activities are completely free for the women of Banyuwangi."
          },
          {
            q: "Do I need to be in a group to join?",
            a: "No, you can join individually. However, if you already have a group (such as a PKK team, neighborhood social gather/arisan, or a community club), you can register collectively and suggest customized health topics that best suit your group's interests."
          },
          {
            q: "Where are the activities held?",
            a: "Most activities are hosted within the premises of RS Yasmin (specifically in our Family Lounge, Exhibition Hall, or Zen Healing Garden). However, our team is also fully prepared to visit your group at external venues (such as schools, campuses, or community centers)."
          },
          {
            q: "What health topics can be proposed?",
            a: "Anything related to women's comprehensive healthcare: reproductive health, pregnancy, breastfeeding, menopause, family nutrition, mental wellness, early-stage cancer detection (such as self-breast examinations/SADARI and Pap smears), and much more."
          }
        ];
      case 'KR':
        return [
          {
            q: "참가에 드는 비용이 있나요?",
            a: "등록이나 가입 비용은 일체 없습니다. 야스민 여성 클럽의 모든 활동은 바뉴왕이 지역 여성을 위해 무료로 전면 운영됩니다."
          },
          {
            q: "반드시 그룹/단체로 가입해야 하나요?",
            a: "아닙니다. 개인 자격으로도 얼마든지 가입할 수 있습니다. 단, 단체(PKK 여성회, 친목회, 동호회 등)가 있으신 경우 공동 등록 후 해당 모임의 필요와 관심사에 맞춤화된 전문 건강 토크 주제를 신청하실 수도 있습니다."
          },
          {
            q: "클럽 활동은 주로 어디서 진행되나요?",
            a: "대부분의 정규 세션은 야스민 병원 내부(특히 패밀리 웰니스 라운지, 세미나 대강당, 힐링 야외 정원)에서 호젓하게 개최됩니다. 단, 필요한 경우 저희 교양 지원팀이 귀 단체의 외부 장소(예: 학교, 관공서, 복지관)로 직접 찾아가는 방문 강의도 적극 지원합니다."
          },
          {
            q: "어떤 건강 교육 주제들을 제안할 수 있나요?",
            a: "여성 평생 보건과 관련된 모든 핵심 의제를 포함합니다: 자궁 생식 건강, 임신 및 안전 분만, 모유 수유 및 젖몸살 관리, 갱년기 대처법, 가족 영양 식단, 마음 치유 정신 건강, 그리고 자가 유방 검진(SADARI) 및 자궁경부암 스크리닝(Pap Smear) 등 다채로운 주제 제안이 열려 있습니다."
          }
        ];
      case 'ZH':
        return [
          {
            q: "加入女性魅力健康俱乐部（Yasmin Women Club）需要收费吗？",
            a: "没有任何注册或报名费用。雅斯敏女性俱乐部所有活动均面向巴纽旺伊全区女性同胞完全无偿免费开展。"
          },
          {
            q: "必须以团体/组织的名义才能报名加入吗？",
            a: "不是的。您完全可以以个人身份加入。不过，如果您拥有既有的女性团队（例如妇女会、社区互助组或闺蜜兴趣俱乐部），非常推荐您集体注册并根据群体的健康痛点，向我院申请指定特定的女性医学科普课题。"
          },
          {
            q: "活动通常在什么地方举行？",
            a: "绝大多数活动均在雅斯敏综合医院院内举办（特别是我院专设的家庭尊享沙龙、学术中心大礼堂以及充满负氧离子的绿色康养花园）。当然，如果您的团队有特殊需求，我们也可以安排专属科普专家上门服务（如学校、企事业单位或居委会）。"
          },
          {
            q: "可以提出或定制哪些女性健康科普方向？",
            a: "涵盖女性全生命周期的全方位健康管理：生殖系统保养、科学备孕期及孕期指导、产后母乳喂养技巧、更年期调理、家庭营养膳食搭配、女性焦虑与情绪管理、妇科恶性肿瘤筛查教育（如 SADARI 乳腺自检科普及宫颈抹片筛查/Pap Smear 等）。"
          }
        ];
      case 'AR':
        return [
          {
            q: "هل هناك أي رسوم للانضمام إلى النادي؟",
            a: "لا توجد رسوم تسجيل أو اشتراك على الإطلاق. جميع الأنشطة والندوات في نادي ياسمين للمرأة مجانية تماماً لكافة السيدات في بانيوانجي."
          },
          {
            q: "هل يجب أن أنضم مع مجموعة أم يمكنني التسجيل بمفردي؟",
            a: "لا يشترط وجود مجموعة؛ يمكنك الانضمام بمفردك كفرد. ولكن، إذا كان لديك مجموعة قائمة بالفعل (مثل لجان الأحياء، جمعيات نسائية، أو مجموعات الصداقة)، فإنه يوصى بالتسجيل معاً واقتراح موضوع صحي مخصص يلبي رغبات المجموعة."
          },
          {
            q: "أين تقام الأنشطة والدورات؟",
            a: "تُقام معظم الفعاليات في مرافق مستشفى ياسمين بانيوانجي (خاصة في صالون العائلة الفاخر، قاعة الندوات الكبرى، أو الحديقة الشفائية المفتوحة)، كما يمكننا ترتيب زيارات للمجموعات في مواقع خارجية محددة (مثل المدارس أو المراكز المجتمعية)."
          },
          {
            q: "ما هي المواضيع الصحية التي يمكن اقتراحها؟",
            a: "كل ما يتعلق بالصحة المتكاملة للمرأة: الصحة الإنجابية، رعاية الأمومة والحوامل، الرضاعة الطبيعية، سن الأمل، التغذية السليمة للأسرة، الصحة النفسية للمرأة، والكشف المبكر عن الأورام (مثل الفحص الذاتي للثدي SADARI ومسحة عنق الرحم Pap Smear) وغيرها الكثير."
          }
        ];
      default:
        return [
          {
            q: "Apakah ada biaya untuk bergabung?",
            a: "Tidak ada biaya pendaftaran. Semua kegiatan Yasmin Women Club gratis untuk masyarakat Banyuwangi."
          },
          {
            q: "Apakah harus punya kelompok untuk bergabung?",
            a: "Tidak. Anda bisa bergabung secara individu. Namun, jika memiliki kelompok (seperti PKK, arisan, atau komunitas), Anda bisa mendaftar bersama dan menentukan topik sesuai kebutuhan kelompok."
          },
          {
            q: "Kegiatan diadakan di mana?",
            a: "Sebagian besar kegiatan diadakan di lingkungan RS Yasmin (khususnya Family Lounge, Aula, atau Healing Garden), namun kami juga bisa mendatangi kelompok di lokasi tertentu (misal: sekolah, kampus, atau balai desa)."
          },
          {
            q: "Apa saja materi yang bisa diusulkan?",
            a: "Segala hal terkait kesehatan wanita: reproduksi, kehamilan, menyusui, menopause, gizi keluarga, kesehatan mental, deteksi dini kanker (SADARI / Pap Smear), dan lain-lain."
          }
        ];
    }
  };

  const faqs = getFaqs();

  return (
    <div id="yasmin-womens-page" className="bg-[#FAF9F5] text-left min-h-screen font-sans">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFEBF2] to-[#FAF9F5] py-20 border-b border-pink-100">
        <div className="absolute top-10 right-10 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-300/10 rounded-full blur-3xl" />

        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="font-display text-xs text-white font-black uppercase tracking-wider bg-pink-600 px-4 py-2 rounded-full inline-flex items-center gap-2 border-2 border-headings shadow-[3px_3px_0px_#1e1e1e]">
                <Venus className="h-4.5 w-4.5 text-white animate-pulse" />
                {lang === 'ID' ? 'PROGRAM TERBARU RS YASMIN' : lang === 'EN' ? 'NEW RS YASMIN PROGRAM' : lang === 'KR' ? '야스민 병원 신규 여성 웰니스 프로그램' : lang === 'ZH' ? '雅斯敏综合医院最新特别公益项目' : 'برنامج مستشفى ياسمين الجديد'}
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-headings leading-[1.15] tracking-tight">
                {t.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 pt-1">
                <span className="bg-pink-100 text-pink-700 font-display text-xs font-black px-4 py-1.5 rounded-full border border-pink-200">
                  {lang === 'ID' ? 'Untuk Pelajar' : lang === 'EN' ? 'For Students' : lang === 'KR' ? '학생 대상' : lang === 'ZH' ? '学生群体' : 'للطالبات'}
                </span>
                <span className="bg-pink-100 text-pink-700 font-display text-xs font-black px-4 py-1.5 rounded-full border border-pink-200">
                  {lang === 'ID' ? 'Untuk Mahasiswi' : lang === 'EN' ? 'For Undergraduates' : lang === 'KR' ? '대학생 대상' : lang === 'ZH' ? '大学生群体' : 'للطالبات الجامعيات'}
                </span>
                <span className="bg-pink-100 text-pink-700 font-display text-xs font-black px-4 py-1.5 rounded-full border border-pink-200">
                  {lang === 'ID' ? 'Untuk Ibu-Ibu' : lang === 'EN' ? 'For Mothers' : lang === 'KR' ? '어머니 대상' : lang === 'ZH' ? '妈妈 and Family' : 'للأمهات'}
                </span>
              </div>

              <p className="text-gray-650 text-[16px] sm:text-[18px] max-w-2xl leading-relaxed font-sans">
                {t.desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <a
                  href="#pendaftaran-womens-form"
                  className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-display text-sm font-black tracking-wider rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] transition-all text-center cursor-pointer"
                >
                  {t.btnJoin}
                </a>
                <a
                  href="#kalender-womens"
                  className="px-8 py-3.5 bg-white hover:bg-slate-50 text-headings font-display text-sm font-black tracking-wider rounded-2xl border-3 border-divider shadow-[4px_4px_0px_#e5e7eb] text-center cursor-pointer"
                >
                  {t.btnView}
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-divider aspect-[1.4/1] group bg-pink-50/60 w-full ml-auto mr-0">
                
                {/* Visual presentation - playful background and character */}
                <div className="absolute inset-0">
                  <SafeImage 
                    src={clubWomenImg} 
                    alt="Yasmin Woman's Club" 
                    className="w-full h-full object-fill transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TENTANG PROGRAM */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs text-pink-600 font-bold uppercase tracking-widest bg-pink-50 border border-pink-200 px-3 py-1 rounded-full inline-block">
                {t.aboutBadge}
              </span>
              <h2 className="font-display font-black text-3xl text-headings leading-[1.2]">
                {t.aboutTitle}
              </h2>
            </div>
            <div className="lg:col-span-7 bg-pink-50/20 border-2 border-pink-100 rounded-3xl p-8 space-y-4">
              <p className="text-gray-750 text-sm sm:text-base leading-relaxed">
                {t.aboutDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SIAPA YANG BISA BERGABUNG */}
      <div className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-pink-600 font-bold uppercase tracking-widest bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
              {t.eligBadge}
            </span>
            <h2 className="font-display font-black text-3xl text-headings">{t.eligTitle}</h2>
            <p className="text-gray-550 text-sm max-w-2xl mx-auto">
              {t.eligDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Stage 1 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-2xl hover:border-pink-300 transition-all shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 text-2xl shrink-0">
                    🎒
                  </div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-headings">{t.elig1}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {t.elig1Desc}
                </p>
              </div>
              <div className="bg-pink-50/50 p-3 py-2.5 rounded-xl border border-pink-100 text-[10px] sm:text-xs text-pink-800 font-bold font-mono">
                {lang === 'ID' ? '📌 Remaja & Dismenore' : lang === 'EN' ? '📌 Teens & Dysmenorrhea' : lang === 'KR' ? '📌 청소년기 및 생리 건강' : lang === 'ZH' ? '📌 青少年及生理保健' : '📌 المراهقة وآلام الدورة'}
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-2xl hover:border-pink-300 transition-all shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-500 text-2xl shrink-0">
                    🤰
                  </div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-headings">{t.elig2}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {t.elig2Desc}
                </p>
              </div>
              <div className="bg-indigo-50/50 p-3 py-2.5 rounded-xl border border-indigo-100 text-[10px] sm:text-xs text-indigo-800 font-bold font-mono">
                {lang === 'ID' ? '📌 Persalinan Nyaman & Gizi Janin' : lang === 'EN' ? '📌 Childbirth & Fetal Nutrition' : lang === 'KR' ? '📌 무통 분만 및 태아 안심 영양' : lang === 'ZH' ? '📌 安全舒适分娩及胎儿营养' : '📌 الولادة المريحة وتغذية الجنين'}
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-2xl hover:border-pink-300 transition-all shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 text-2xl shrink-0">
                    🤱
                  </div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-headings">{t.elig3}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {t.elig3Desc}
                </p>
              </div>
              <div className="bg-pink-50/50 p-3 py-2.5 rounded-xl border border-pink-100 text-[10px] sm:text-xs text-pink-800 font-bold font-mono">
                {lang === 'ID' ? '📌 ASI Eksklusif & Anti-Stres' : lang === 'EN' ? '📌 Breastfeeding & Stress Management' : lang === 'KR' ? '📌 모유 수유 및 가사 스트레스 조절' : lang === 'ZH' ? '📌 母乳喂养与减压支持' : '📌 الرضاعة الطبيعية وإدارة الضغوط'}
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-white border-2 border-divider p-6 sm:p-7 rounded-2xl hover:border-pink-300 transition-all shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl shrink-0">
                    🧘
                  </div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-headings">{t.elig4}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {t.elig4Desc}
                </p>
              </div>
              <div className="bg-emerald-50/50 p-3 py-2.5 rounded-xl border border-emerald-100 text-[10px] sm:text-xs text-emerald-800 font-bold font-mono">
                {lang === 'ID' ? '📌 Hormon & Kepadatan Tulang' : lang === 'EN' ? '📌 Hormones & Bone Density' : lang === 'KR' ? '📌 호르몬 변화 및 골다공증 대비' : lang === 'ZH' ? '📌 雌激素 management 与骨骼健康' : '📌 الهرمونات وكثافة العظام'}
              </div>
            </div>

          </div>

          <div className="text-center pt-4">
            <a
              href="#pendaftaran-womens-form"
              className="inline-flex items-center space-x-2 px-10 py-4 bg-pink-600 hover:bg-pink-700 text-white font-display text-xs font-black tracking-widest rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[1px_1px_0px_#1e1e1e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
            >
              <span>{t.btnJoin.toUpperCase()}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* CARA BERGABUNG */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 w-full">
            <span className="font-mono text-xs text-pink-600 font-bold uppercase tracking-widest bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
              JOIN MECHANISM
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-headings">
              Bagaimana Cara Bergabung?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FAF9F5]/40 border-2 border-divider rounded-2xl flex items-start space-x-3.5">
              <span className="text-3xl shrink-0">📌</span>
              <div className="text-left">
                <h4 className="font-display font-extrabold text-sm text-headings">Bergabung Secara Individu</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">Daftar secara gratis sebagai anggota mandiri dan peroleh alokasi undangan prioritas eksklusif ke setiap webinar mingguan kami.</p>
              </div>
            </div>
            <div className="p-6 bg-[#FAF9F5]/40 border-2 border-divider rounded-2xl flex items-start space-x-3.5">
              <span className="text-3xl shrink-0">👥</span>
              <div className="text-left">
                <h4 className="font-display font-extrabold text-sm text-headings">Membentuk Kelompok</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">Bentuk kelompok arisan Anda, paguyuban PKK desa, kelompok kajian, atau geng kampus, lalu ajukan pembahasan bersama tim medis RS Yasmin.</p>
              </div>
            </div>
            <div className="p-6 bg-[#FAF9F5]/40 border-2 border-divider rounded-2xl flex items-start space-x-3.5">
              <span className="text-3xl shrink-0">💬</span>
              <div className="text-left">
                <h4 className="font-display font-extrabold text-sm text-headings">Menentukan Materi Pertemuan</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">Kebebasan total menentukan asupan edukasi! Berikan masukan seputar topik yang mendesak dibahas di forum konsultasi.</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <a
              href="#pendaftaran-womens-form"
              className="inline-flex items-center space-x-2 px-10 py-4 bg-pink-600 hover:bg-pink-700 text-white font-display text-xs font-black tracking-widest rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[1px_1px_0px_#1e1e1e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
            >
              <span>DAFTAR SEKARANG</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* KALENDER KEGIATAN */}
      <div id="kalender-womens" className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-pink-600 font-bold uppercase tracking-widest">
              {lang === 'ID' ? 'KALENDER KEGIATAN' : lang === 'EN' ? 'ACTIVITY CALENDAR' : lang === 'KR' ? '주요 일정 캘린더' : lang === 'ZH' ? '近期健康沙龙日程表' : 'جدول الأنشطة والفعاليات'}
            </span>
            <h3 className="font-display font-black text-2xl text-headings">
              {t.agendaTitle}
            </h3>
            <p className="text-gray-400 text-xs">
              {t.agendaDesc}
            </p>
          </div>

          <div className="border border-divider rounded-3xl overflow-hidden bg-white divide-y divide-divider/75">
            {/* Event 1 */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-4">
                <div className="bg-[#DC2626] border-2 border-red-700 p-2 sm:p-2.5 rounded-2xl text-center text-white shrink-0 w-24 h-24 flex flex-col justify-center items-center leading-none shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest block opacity-90 leading-none">{lang === 'ID' ? 'JUNI' : lang === 'EN' ? 'JUNE' : lang === 'KR' ? '6월' : lang === 'ZH' ? '六月' : 'يونيو'}</span>
                  <span className="text-2xl sm:text-3xl font-display font-black block leading-none mt-1.5 mb-1">25</span>
                  <span className="text-[9px] font-mono block opacity-85 leading-none">2026</span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-headings">
                    {lang === 'ID' ? '“Sehat Reproduksi untuk Remaja”' : lang === 'EN' ? '“Reproductive Health for Teenagers”' : lang === 'KR' ? '“청소년기 올바른 성 건강과 자기 관리”' : lang === 'ZH' ? '“青少年生殖健康与自我防护”' : '«الصحة الإنجابية للمراهقات»'}
                  </h4>
                  <p className="text-gray-400 mt-1 font-sans">
                    {lang === 'ID' ? 'Sesi seru pengenalan organ dalam, higienitas mandiri, dan gizi tangkal anemia remaja.' : lang === 'EN' ? 'Fun session introducing inner organs, personal hygiene, and nutrition to prevent teen anemia.' : lang === 'KR' ? '신체 변화와 생리 위생 관리법, 청소년 결핍성 빈혈 대처 영양 요령 교육.' : lang === 'ZH' ? '科普认识人体构造、日常生理卫生护理，以及预防青春期贫血 of 营养指导。' : 'جلسة شيقة للتعريف بالأعضاء الداخلية، النظافة الشخصية، والتغذية لمكافحة فقر الدم.'}
                  </p>
                  <span className="inline-flex mt-1 bg-amber-50 text-amber-700 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border border-amber-100">
                    {lang === 'ID' ? 'Target: Pelajar SMA / Sederajat' : lang === 'EN' ? 'Target: High School Students / Equiv.' : lang === 'KR' ? '대상: 고등학생 및 청소년층' : lang === 'ZH' ? '对象：在校高中生及同龄女性' : 'المستهدف: طالبات الثانوية وما يعادلها'}
                  </span>
                </div>
              </div>
              <span className="bg-[#0B4F4A] text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase shrink-0">
                {lang === 'ID' ? 'AULA RS YASMIN' : lang === 'EN' ? 'RS YASMIN HALL' : lang === 'KR' ? '야스민 강당' : lang === 'ZH' ? '雅斯敏医院大礼堂' : 'قاعة مستشفى ياسمين'}
              </span>
            </div>

            {/* Event 2 */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-4">
                <div className="bg-[#EA580C] border-2 border-orange-600 p-2 sm:p-2.5 rounded-2xl text-center text-white shrink-0 w-24 h-24 flex flex-col justify-center items-center leading-none shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest block opacity-90 leading-none">{lang === 'ID' ? 'JULI' : lang === 'EN' ? 'JULY' : lang === 'KR' ? '7월' : lang === 'ZH' ? '七月' : 'يوليو'}</span>
                  <span className="text-2xl sm:text-3xl font-display font-black block leading-none mt-1.5 mb-1">03</span>
                  <span className="text-[9px] font-mono block opacity-85 leading-none">2026</span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-headings">
                    {lang === 'ID' ? '“Persiapan Kehamilan Sehat”' : lang === 'EN' ? '“Preparing for a Healthy Pregnancy”' : lang === 'KR' ? '“행복하고 안전한 계획 임신 준비법”' : lang === 'ZH' ? '“如何科学备孕与健康妊娠”' : '«التحضير السليم لحمل صحي سعيد»'}
                  </h4>
                  <p className="text-gray-400 mt-1 font-sans">
                    {lang === 'ID' ? 'Edukasi gizi masa konsepsi, screening genetik sederhana, dan kebugaran tubuh sebelum melahirkan.' : lang === 'EN' ? 'Education on preconception nutrition, simple genetic screening, and prenatal fitness.' : lang === 'KR' ? '임신 전 필수 영양 상담, 유전체 간이 스크리닝 및 임산부 힐링 스트레칭 전파.' : lang === 'ZH' ? '孕前合理营养补充、基础染色体及基因常识科普，以及科学的孕妇舒缓运动。' : 'التثقيف الغذائي لمرحلة ما قبل الحمل، الفحص الجيني البسيط، واللياقة البدنية للحامل.'}
                  </p>
                  <span className="inline-flex mt-1 bg-pink-50 text-pink-700 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border border-pink-100">
                    {lang === 'ID' ? 'Target: Ibu Hamil & Calon Pengantin' : lang === 'EN' ? 'Target: Pregnant Women & Brides-to-be' : lang === 'KR' ? '대상: 임산부 및 결혼을 앞둔 예비 신부' : lang === 'ZH' ? '对象：孕产妇及准备结婚的新人' : 'المستهدف: الحوامل والمقبلات على الزواج'}
                  </span>
                </div>
              </div>
              <span className="bg-[#0B4F4A] text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase shrink-0">
                {lang === 'ID' ? 'KLINIK RS YASMIN' : lang === 'EN' ? 'RS YASMIN CLINIC' : lang === 'KR' ? '야스민 산부인과 클리닉' : lang === 'ZH' ? '雅斯敏特设门诊中心' : 'عيادة مستشفى ياسمين'}
              </span>
            </div>

            {/* Event 3 */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-4">
                <div className="bg-[#D97706] border-2 border-amber-600 p-2 sm:p-2.5 rounded-2xl text-center text-white shrink-0 w-24 h-24 flex flex-col justify-center items-center leading-none shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest block opacity-90 leading-none">{lang === 'ID' ? 'JULI' : lang === 'EN' ? 'JULY' : lang === 'KR' ? '7월' : lang === 'ZH' ? '七月' : 'يوليو'}</span>
                  <span className="text-2xl sm:text-3xl font-display font-black block leading-none mt-1.5 mb-1">12</span>
                  <span className="text-[9px] font-mono block opacity-85 leading-none">2026</span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-headings">
                    {lang === 'ID' ? '“Yasmin Women Club Gathering”' : lang === 'EN' ? '“Yasmin Women Club Gathering”' : lang === 'KR' ? '“야스민 여성 클럽 대규모 연합 축제”' : lang === 'ZH' ? '“雅斯敏女性俱乐部年度大聚会”' : '«الملتقى السنوي لنادي ياسمين للمرأة»'}
                  </h4>
                  <p className="text-gray-400 mt-1 font-sans">
                    {lang === 'ID' ? 'Sesi silaturahmi akbar lintas generasi, sharing session bersama dokter spesialis obgyn, ramah tamah.' : lang === 'EN' ? 'Grand multi-generational networking session, Q&A with OBGYN specialists, and warm socializing.' : lang === 'KR' ? '모든 연령대를 불문한 통합 교류의 장, 산부인과 주치의단과 함께하는 열린 소통과 다과 시간.' : lang === 'ZH' ? '跨越年龄圈层的女性大联欢、特邀本院明星妇产专家开展面对面圆桌茶话会。' : 'لقاء تعارفي كبير بين الأجيال، جلسة حوارية مع طبيب استشاري نساء وولادة، وحفل غداء.'}
                  </p>
                  <span className="inline-flex mt-1 bg-indigo-50 text-indigo-700 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border border-indigo-100">
                    {lang === 'ID' ? 'Target: Semua Anggota Klub' : lang === 'EN' ? 'Target: All Club Members' : lang === 'KR' ? '대상: 클럽 회원 전원' : lang === 'ZH' ? '对象：全体注册俱乐部会员' : 'المستهدف: جميع عضوات النادي'}
                  </span>
                </div>
              </div>
              <span className="bg-[#0B4F4A] text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase shrink-0">
                {lang === 'ID' ? 'TAMAN RS YASMIN' : lang === 'EN' ? 'RS YASMIN GARDEN' : lang === 'KR' ? '야스민 치유 정원' : lang === 'ZH' ? '雅斯敏生态疗愈花园' : 'حديقة مستشفى ياسمين'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULIR PENDAFTARAN */}
      <div id="pendaftaran-womens-form" className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-pink-600 font-bold uppercase tracking-widest bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
              REGISTRATION FORM
            </span>
            <h2 className="font-display font-black text-3xl text-headings">Pendaftaran Yasmin Women Club</h2>
            <p className="text-gray-550 text-sm w-full">Kami mengundang Anda mendaftar secara online di bawah ini. Gabung secara individu maupun mewakili instansi kelompok.</p>
          </div>

          <div className="bg-[#FAF9F5] border-4 border-headings rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {joinedWomens ? (
              <div id="womens-success-card" className="space-y-6 text-center py-6 animate-fade-in-up">
                <span className="text-5xl animate-bounce inline-block">🌸🎊</span>
                <h3 className="font-display font-black text-xl text-headings">Selamat Bergabung Sebagai Keluarga Club!</h3>
                <p className="text-xs text-gray-550 max-w-md mx-auto">Kami juga telah menyiapkan format pendaftaran untuk dikirimkan langsung ke WhatsApp Admin demi pendataan instan.</p>

                {/* Identity Card Mockup */}
                <div className="w-full max-w-md mx-auto bg-gradient-to-br from-pink-600 to-[#9D174D] text-left rounded-3xl p-6 text-white border-3 border-headings shadow-xl relative overflow-hidden">
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                  <div className="flex justify-between items-start border-b border-white/20 pb-4">
                    <div>
                      <span className="font-mono text-[8px] font-black tracking-widest text-pink-200 block">KARTU ANGGOTA RESMI</span>
                      <span className="font-display font-black text-sm text-white tracking-widest">YASMIN WOMEN CLUB</span>
                    </div>
                    <span className="text-[8.5px] font-mono bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 uppercase">
                      MEMBER ACTIVE
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 pb-2 text-xs">
                    <div className="grid grid-cols-3">
                      <span className="text-white/50 text-[9.5px] font-mono">MEMBER ID</span>
                      <strong className="col-span-2 text-yellow-300 font-mono tracking-wider">{joinedWomens.id}</strong>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-white/50 text-[9.5px] font-mono">NAMA LENGKAP</span>
                      <span className="col-span-2 font-display font-black uppercase text-white tracking-wide">{joinedWomens.namaLengkap}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-white/50 text-[9.5px] font-mono">PEKERJAAN</span>
                      <span className="col-span-2 text-white/90">{joinedWomens.pekerjaanStatus} ({joinedWomens.usia} Tahun)</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-white/50 text-[9.5px] font-mono">TIPE DAFTAR</span>
                      <span className="col-span-2 text-yellow-250 font-bold">
                        {joinedWomens.tipeGabung === 'Kelompok' ? `Kelompok (${joinedWomens.namaKelompok} - ${joinedWomens.jumlahAnggota} org)` : 'Individu'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/20 pt-3 text-[8px] font-mono text-pink-200 flex justify-between uppercase">
                    <span>#TumbuhSehatBersamaWanitaBanyuwangi</span>
                    <span>Tgl Daftar: {joinedWomens.timestamp}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-3 text-xs">
                  <button
                    onClick={() => {
                      alert('Mengunduh kartu pendaftaran... Hubungkan ke printer.');
                      window.print();
                    }}
                    className="px-6 py-2.5 bg-headings text-white font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Cetak Kartu Member
                  </button>
                  <button
                    onClick={() => setJoinedWomens(null)}
                    className="px-6 py-2.5 bg-white border text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Daftar Kembali
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5 text-xs text-left" id="womens-club-fields">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-black uppercase text-[10px]">Nama Lengkap Anda *</label>
                    <input
                      required
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleFormChange}
                      placeholder="Contoh: Sarah Fatimah"
                      className="w-full bg-white border-2 border-divider p-3.5 rounded-xl uppercase font-semibold focus:border-pink-500 focus:bg-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[10px]">Usia *</label>
                      <input
                        required
                        type="number"
                        name="usia"
                        value={formData.usia}
                        onChange={handleFormChange}
                        placeholder="Thn"
                        className="w-full bg-white border-2 border-divider p-3.5 rounded-xl focus:border-pink-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-headings font-display font-black uppercase text-[10px]">Pekerjaan / Status</label>
                      <input
                        type="text"
                        name="pekerjaanStatus"
                        value={formData.pekerjaanStatus}
                        onChange={handleFormChange}
                        placeholder="Contoh: Pelajar / Ibu Rumah Tangga"
                        className="w-full bg-white border-2 border-divider p-3.5 rounded-xl focus:border-pink-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-black uppercase text-[10px]">No WA / Telepon untuk Notifikasi *</label>
                    <input
                      required
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleFormChange}
                      placeholder="Contoh: 0812XXXXXXXX"
                      className="w-full bg-white border-2 border-divider p-3.5 rounded-xl font-mono focus:border-pink-500 focus:bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-headings font-display font-black uppercase text-[10px]">Mekanisme Bergabung</label>
                    <select
                      name="tipeGabung"
                      value={formData.tipeGabung}
                      onChange={handleFormChange}
                      className="w-full bg-white border-2 border-divider p-3.5 rounded-xl font-bold focus:border-pink-500 focus:bg-white outline-none"
                    >
                      <option value="Individu">Bergabung Secara Individu</option>
                      <option value="Kelompok">Bergabung Mewakili Kelompok</option>
                    </select>
                  </div>
                </div>

                {formData.tipeGabung === 'Kelompok' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50/30 p-4 rounded-2xl border border-pink-100 animate-fade-in-up">
                    <div className="space-y-1.5">
                      <label className="block text-[#BD1E24] font-display font-black uppercase text-[10px]">Nama Kelompok Anda *</label>
                      <input
                        required={formData.tipeGabung === 'Kelompok'}
                        type="text"
                        name="namaKelompok"
                        value={formData.namaKelompok}
                        onChange={handleFormChange}
                        placeholder="Contoh: PKK Gg Kakap / Geng Arisan Cantik"
                        className="w-full bg-white border-2 border-divider p-3.5 rounded-xl focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[#BD1E24] font-display font-black uppercase text-[10px]">Jumlah Anggota Kelompok *</label>
                      <input
                        required={formData.tipeGabung === 'Kelompok'}
                        type="number"
                        name="jumlahAnggota"
                        value={formData.jumlahAnggota}
                        onChange={handleFormChange}
                        placeholder="Contoh: 15"
                        className="w-full bg-white border-2 border-divider p-3.5 rounded-xl focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="block text-headings font-display font-black uppercase text-[10px]">Topik/Materi yang Paling Anda Minati Dibahas / Diusulkan *</label>
                    <span className="text-[9px] text-[#BD1E24] font-bold font-mono">⭐ PRIORITAS USULAN</span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    name="topikDiminati"
                    value={formData.topikDiminati}
                    onChange={handleFormChange}
                    placeholder="Contoh: Deteksi dini kanker payudara, cara menyapih anak yang benar, cara relaksasi prenatal yoga"
                    className="w-full bg-white border-2 border-divider p-4 rounded-xl focus:border-pink-500 focus:bg-white outline-none resize-none"
                  />
                </div>

                <div className="pt-2 text-center">
                  <button
                    disabled={loading}
                    type="submit"
                    className="px-10 py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-350 text-white font-display text-xs font-black tracking-widest rounded-2xl border-3 border-headings shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[1px_1px_0px_#1e1e1e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
                  >
                    {loading ? 'Mengirim Formulir...' : 'KIRIM DAN HUBUNGKAN KE WHATSAPP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* TESTIMONI */}
      <div className="py-20 bg-[#FAF9F5] border-t border-b border-divider">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white border-3 border-headings p-8 sm:p-10 rounded-3xl shadow-[5px_5px_0px_#1e1e1e] text-center relative overflow-hidden">
            <div className="absolute top-0 right-4 text-8xl text-pink-100 font-serif leading-none select-none">“</div>
            <div className="space-y-4 relative z-10">
              <span className="font-mono text-pink-500 font-bold uppercase tracking-wider text-[10px]">⭐ TESTIMONIAL ANGGOTA</span>
              <p className="text-headings font-display text-sm sm:text-base md:text-lg font-extrabold italic leading-relaxed">
                &ldquo;Senang sekali ada program seperti ini di Banyuwangi. Saya jadi lebih paham tentang kesehatan reproduksi dan bisa berbagi dengan teman-teman.&rdquo;
              </p>
              <div className="pt-2">
                <p className="font-display font-black text-xs text-headings uppercase tracking-widest">— Ibu Rina</p>
                <p className="font-mono text-[9px] text-gray-400">Anggota Aktif Yasmin Women Club</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="py-20 bg-white">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-pink-600 font-bold uppercase tracking-widest">
              {lang === 'ID' ? 'KOTAK BANTUAN' : lang === 'KR' ? '고객 지원' : lang === 'ZH' ? '女性健康支持' : lang === 'AR' ? 'قسم الدعم' : 'HELP DESK'}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-headings">
              {lang === 'ID' ? 'Pertanyaan yang Sering Diajukan' : lang === 'KR' ? '자주 묻는 질문 (FAQ)' : lang === 'ZH' ? '常见问题解答' : lang === 'AR' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="divide-y divide-divider border border-divider rounded-2xl overflow-hidden bg-white w-full">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-display text-[13px] font-extrabold text-headings hover:bg-pink-50/10 transition-all cursor-pointer outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs text-pink-600">{isOpen ? '▲' : '▼'}</span>
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

      {/* CALL TO ACTION (CTA) UTAMA */}
      <div className="bg-headings py-16 text-white border-t-4 border-pink-500">
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight w-full max-w-full mx-auto">
            {t.ctaTitle}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base w-full max-w-full mx-auto leading-relaxed font-sans">
            {t.ctaDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <a
              href="#pendaftaran-womens-form"
              className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-display text-xs font-black tracking-widest rounded-2xl border-2 border-white shadow-[3px_3px_0px_#fff] transition-all cursor-pointer w-full sm:w-auto text-center"
            >
              {t.btnJoin}
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#0B4F4A] hover:bg-[#073834] text-white font-display text-xs font-black tracking-widest rounded-2xl border-2 border-white shadow-[3px_3px_0px_#fff] transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>
                {lang === 'ID' ? 'Konsultasi via WhatsApp' : lang === 'EN' ? 'Consult via WhatsApp' : lang === 'KR' ? '카카오톡/WA 1:1 상담' : lang === 'ZH' ? '通过 WhatsApp 咨询' : 'الاستشارة عبر الواتساب'}
              </span>
            </a>
            <button
              onClick={() => setShowLocation(!showLocation)}
              className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-50 font-display text-xs font-black tracking-widest rounded-2xl border-2 border-headings shadow-[3px_3px_0px_#1e1e1e] transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MapPin className="h-4 w-4 text-pink-600 animate-bounce" />
              <span>
                {lang === 'ID' ? 'Lokasi RS Yasmin' : lang === 'EN' ? 'RS Yasmin Location' : lang === 'KR' ? '야스민 병원 오시는 길' : lang === 'ZH' ? '到访雅斯敏综合医院' : 'موقع مستشفى ياسمين'}
              </span>
            </button>
          </div>

          {showLocation && (
            <div className="mt-6 max-w-lg mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-left animate-fade-in-up">
              <p className="font-display font-black text-sm text-yellow-300">
                📍 {lang === 'ID' ? 'Alamat RS Yasmin:' : lang === 'EN' ? 'RS Yasmin Address:' : lang === 'KR' ? '야스민 병원 주소:' : lang === 'ZH' ? '医院详细院址：' : 'عنوان مستشفى ياسمين:'}
              </p>
              <p className="text-xs text-white leading-relaxed mt-1 font-sans">
                Jl. Letkol Istiqlah No. 21, Singonegaran, Banyuwangi, Jawa Timur, Indonesia
              </p>
              <a 
                href="https://maps.google.com/?q=RS+Yasmin+Banyuwangi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block mt-3 text-xs text-pink-300 underline font-semibold hover:text-pink-200 font-mono"
              >
                {lang === 'ID' ? 'Buka di Google Maps ↗' : lang === 'EN' ? 'Open in Google Maps ↗' : lang === 'KR' ? '구글 지도로 보기 ↗' : lang === 'ZH' ? '在谷歌地图中打开 ↗' : 'فتح في خرائط جوجل ↗'}
              </a>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
