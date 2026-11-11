import React, { useState } from 'react';
import { Trees, Compass, Sparkle, Wind, Flower } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SafeImage } from '../utils/imageUrl';

const TRANSLATIONS = {
  ID: {
    experience: 'GREEN HOSPITAL EXPERIENCE',
    mainTitle: 'Lingkungan yang Membantu Proses Pemulihan',
    mainDesc: 'Kami mendesain ulang arsitektur fisik rumah sakit dengan menggabungkan botanical terapi alam demi kenyamanan psikologis pasien dan ketenangan keluarga.',
    exploreTitle: 'JELAJAHI SUDUT PEMULIHAN',
    whyTitle: 'Mengapa Hijau Menyehatkan?',
    whyDesc: 'Riset menyatakan bahwa melihat lanskap alami mengalihkan fokus otak dari visual rasa nyeri ke ketenangan emosional.',
    benefitsTitle: 'Mengapa Spot Ini Istimewa:',
    special: 'SPOT 0',
    compliance: 'ECO-WELLNESS COMPLIANCE',
    spaces: [
      {
        title: 'Healing Garden (Kebun Obat Alam)',
        subtitle: 'Taman Asri Penyembuh Luka',
        desc: 'Taman tanaman obat organik yang terletak di pusat sirkulasi udara RS Yasmin. Gemericik air terjun buatan memproduksi frekuensi suara pink noise yang menenangkan detak jantung pasien hingga pulih lebih rileks.',
        benefits: ['Menurunkan hormon stres kortisol sebesar 22%', 'Memperbaiki sirkulasi udara alami kaya oksigen', 'Dikelilingi tanaman lavender penidur alami']
      },
      {
        title: 'Family Lounge',
        subtitle: 'Executive Space Keluarga Tercinta',
        desc: 'Area santai dengan sofa butik butiran kayu alam, jauh dari getaran cemas. Keluarga dapat membaca buku kesehatan, menyeduh infused water organik secara cuma-cuma, atau berbincang intim sembari menunggu proses pemeriksaan.',
        benefits: ['Dilengkapi sajian teh herbal gratis', 'Colokan laptop premium & akses Wi-Fi kencang', 'Konselor laktasi siaga di sudut ruang']
      },
      {
        title: 'Kids Corner',
        subtitle: 'Oasis Keceriaan Si Buah Hati',
        desc: 'Kami menyadari rumah sakit sering dinilai menyeramkan bagi balita. Kids Corner kami menyediakan mainan edukatif kayu non-toxic, papan lukis kapur pasir, serta koleksi bacaan dongeng Banyuwangi yang ramah.',
        benefits: ['Keamanan penuh dengan karpet karet antibakteri', 'Aneka mainan kayu tanpa sudut tajam', 'Bimbingan terapis ramah anak']
      },
      {
        title: 'Area Tunggu Nyaman',
        subtitle: 'Selasar Bernuansa Resort Santai',
        desc: 'Mengurangi beban jenuh mengantre dengan penataan baris kursi berjarak lapang, sirkulasi angin sejuk sepoi-sepoi, serta aroma terapi kayu cendana alami yang melepaskan penat.',
        benefits: ['Aroma terapi menenangkan pikiran cemas', 'Baris kursi berjarak lapang bebas berdesakan', 'Layar monitor edukatif bebas visual bising']
      },
      {
        title: 'Rawat Inap Modern',
        subtitle: 'Kamar suite pemulihan sejuk alam',
        desc: 'Kamar rawat modern bertabur matahari pagi natural, sekat kayu jati elegan, ranjang medis senyap, serta jendela geser luas yang memperlihatkan lanskap rimbun vegetasi kebun Banyuwangi.',
        benefits: ['Penjagaan privasi tinggi dengan dinding absorbsi bising', 'Sofa tidur besar bagi pendamping keluarga', 'Layanan bel panggilan taktis 24 jam senyap']
      }
    ]
  },
  EN: {
    experience: 'GREEN HOSPITAL EXPERIENCE',
    mainTitle: 'Ambiance that Accelerates Recovery',
    mainDesc: 'We redesigned the physical landscape of the hospital, integrating natural botanical therapy for therapeutic psychological and emotional relief.',
    exploreTitle: 'EXPLORE RECOVERY CORNERS',
    whyTitle: 'Why is Green Healing Effective?',
    whyDesc: 'Studies show that looking at natural vistas diverts raw neural pain pathways into comforting emotional states.',
    benefitsTitle: 'Why This Spot is Special:',
    special: 'SPOT 0',
    compliance: 'ECO-WELLNESS COMPLIANCE',
    spaces: [
      {
        title: 'Healing Garden (Medicinal Herb Walk)',
        subtitle: 'Aesthetic Healing Haven',
        desc: 'Organic medicinal gardens located in the core air paths of RS Yasmin. Soundscapes from water cascades produce pink noise, soothing heart rates and boosting patient serenity.',
        benefits: ['Reduces cortisol stress levels by 22%', 'Boosts clean natural oxygen streams', 'Laid with tranquilizing organic lavender beds']
      },
      {
        title: 'Family Lounge',
        subtitle: 'Executive Space for Loved Ones',
        desc: 'A premium lounge curated with solid teakwood elements. Families can read journals, brew detox infused waters for free, or chat privately during medical waits.',
        benefits: ['Free herbal tea and healthy drinks', 'Premium workstations and high-speed Wi-Fi', 'Lactation consultant on-call in dedicated cozy corners']
      },
      {
        title: 'Kids Corner',
        subtitle: 'Creative Oasis for Little Ones',
        desc: 'A playful sanctuary to replace medical anxiety with childhood joy. Equipped with non-toxic wooden tactile toys, sand chalk drawings and delightful storytelling books.',
        benefits: ['Total hygiene with antibacterial rubber mats', 'Sanded kid-safe toys with no sharp edges', 'Guided child-friendly therapists available']
      },
      {
        title: 'Cozy Waiting Lounge',
        subtitle: 'Relaxing Resort-themed Corridors',
        desc: 'Minimizes waiting exhaustion with spaced ergonomic seating, cooling cross breezes across the gardens, and subtle comforting sandalwood aromatherapy.',
        benefits: ['Calms anxious minds with organic aromatherapy', 'Widely spaced rows to prevent crowding', 'Educative silent information screens, no noisy visual alerts']
      },
      {
        title: 'Modern Inpatient Suites',
        subtitle: 'Recovery rooms kissed by nature',
        desc: 'Chic hospital suites boasting natural morning sun, elegant teak separators, silent adjustable beds, and sliding glass walls with rich green scenery.',
        benefits: ['Premium acoustical noise absorbing walls', 'Spacious sofa bed for family guardians', 'Noiseless click-to-ring call support 24/7']
      }
    ]
  },
  KR: {
    experience: '친환경 가든 병원 컨셉',
    mainTitle: '쾌유와 안정을 촉진하는 치유 환경',
    mainDesc: '인공적 소독 내음에서 벗어나 햇볕, 바람, 풀숲이 가득해 환자 가족 모두의 깊은 휴식을 추구하도록 원내 물리 공간을 전면적으로 다시 지었습니다.',
    exploreTitle: '치유 안뜰 인프라 둘러보기',
    whyTitle: '초록빛 자연 치료의 신빙성',
    whyDesc: '임상 결과, 녹색 가든 정경을 관찰할 때 뇌의 통증 인지 뉴런이 비활성화되며 심박 정리가 평화롭게 유도됩니다.',
    benefitsTitle: '이 스폿이 특별한 이유:',
    special: '스폿 0',
    compliance: '친환경 웰니스 규정 준수',
    spaces: [
      {
        title: '식물 약초원 (Healing Garden)',
        subtitle: '향기 나는 회복의 천국',
        desc: '풍부한 약리 작용이 입증된 허브와 화초가 공기 통로에 가득 심겨 있습니다. 물소리의 핑크 노이즈 전파가 혈압과 심박을 평화롭게 안정시킵니다.',
        benefits: ['코르티솔 스트레스 물질 비율 22% 하락', '산소가 풍부한 대자연 신풍 유도', '심신 안정용 라벤더 식물군 상시 조성']
      },
      {
        title: '패밀리 전용 라운지',
        subtitle: '보호자 가족을 위한 명품 아지트',
        desc: '고급 티크 원목 인테리어와 수제 소파가 구비된 휴식 전용 라운지. 대기 시간 동안 전용 한방 차를 우려 마시거나 건강 도서를 읽으며 안심할 수 있습니다.',
        benefits: ['고급 천연 허브차 무상 무제한 제공', '노트북 충전 포트 및 초고속 기가 Wi-Fi 수신', '수유 촉진 실내 공간 및 모유 카운셀러 상주']
      },
      {
        title: '키즈 레크리에이션 안뜰',
        subtitle: '아이들의 호기심과 동심을 지키는 숲',
        desc: '어린 안심 치료를 위해 주사나 약에 대한 걱정을 없애주는 천연 우드 블록, 부드러운 화이트 보드, 바뉴왕이 아동 도서가 풍부합니다.',
        benefits: ['구석구석 무독성 항균 매팅 및 청소 소독 실행', '날카로운 각도가 배제된 샌딩 유아 완구', '어린이 적응 심리 상담 전문가 항시 대응']
      },
      {
        title: '리조트풍 편안한 대기실',
        subtitle: '답답함 없는 야외 오픈 복도',
        desc: '소파 간 간격을 대폭 넓게 벌리고, 정원을 타고 도는 미풍을 여과 없이 흐르게 해 두통과 초조함을 근본적으로 소멸되도록 돕습니다.',
        benefits: ['백단향 아로마 오일 테라피로 자율신경 조율', '사회적 안전 거리 확보 및 쾌적한 줄 서기', '소음 공해 없는 교육 위주 스마트 디스플레이']
      },
      {
        title: '자연 채광 최고급 입원실',
        subtitle: '창 너머 이젠 삼림 뷰의 병동',
        desc: '가공되지 않은 햇살이 부드럽게 방으로 들이치며 최고급 가구와 무소음 자동 모터 베드, 슬라이딩 도어를 밀면 나오는 푸른 정원이 숲속 리조트에 온 느낌을 선사합니다.',
        benefits: ['데시벨 극소화 맞춤형 차음 방음 패널 빌트인', '보호자가 침대로 쓸 수 있는 고탄력 소파', '반사 반응이 빠른 24시 일대일 터치 콜']
      }
    ]
  },
  ZH: {
    experience: '绿色三甲生态诊疗新环境',
    mainTitle: '有助加速身体自愈的环境美学',
    mainDesc: '我们从空间心理学与康复学出发，重新架构了医院的建筑形态，将千株热带植物融入诊疗走廊，舒缓就诊紧张情绪。',
    exploreTitle: '点击探索生态温德米尔空间',
    whyTitle: '为什么生态绿色可以疗愈人？',
    whyDesc: '医学验证，接触自然美景能在大脑皮层显著降低患者对疼痛与疾病进展的敏感度，促进良性神经内分泌循环。',
    benefitsTitle: '为什么这个区域如此特别：',
    special: '空间 0',
    compliance: '绿色生态健康认证',
    spaces: [
      {
        title: '百草疗愈庭院 (Healing Garden)',
        subtitle: '富氧瀑布森林庭院',
        desc: '纯手工打造的多级水系与草药园扫落于中庭要道。舒缓的流水声生成 2/f 舒张粉红噪音，直接镇定脑电活动，安抚发热及焦虑性颤抖.',
        benefits: ['皮质醇（压力荷尔蒙）直降 22%', '促使原生微风气流加速循环，清新润燥', '环绕播种具有深度安神功效的进口薰衣草']
      },
      {
        title: '家属行政贵宾休息室 (Family Lounge)',
        subtitle: '尊贵陪护奢享沙发区',
        desc: '全面采用高档印尼柚木作为基调的减压大厅。患者家属在等候诊疗或手术期间可无限制畅饮本院专供的天然有机柠檬排毒水、翻阅期刊.',
        benefits: ['天然中草药理疗茶及健康烘焙免费无限享用', '提供便携式长办公桌和全频 Wi-Fi', '核心独立私密哺乳角，专业持证育婴顾问值班']
      },
      {
        title: '儿童乐享天地 (Kids Corner)',
        subtitle: '充满嬉笑乐趣的森林小木屋',
        desc: '让孩子告别传统诊断室的眼泪和打针恐惧。这里有无毒可再生热带木质积木，环保无粉尘画板，和妙趣横生的巴纽旺伊神话读物.',
        benefits: ['全方位敷设高效医用级抗病毒防跌撞软地板', '圆滑物理工艺无棱角放心玩具', '经验丰富的心理游戏理疗师陪同指导']
      },
      {
        title: '度假风无压大厅',
        subtitle: '微风轻叩的通透长廊',
        desc: '取消了传统医院紧凑的塑料排椅，通过宽敞舒适的环形定制皮质沙发，配合天然檀香芳香疗法，在负氧离子香气中享受等待.',
        benefits: ['天然木本精油疗法稳定心肺状态', '超宽座椅设计，给每位患者绝对的安全距离', '全馆视音频防噪系统，无生硬高音喇叭呼喊']
      },
      {
        title: '现代绿色极富氧病房',
        subtitle: '推窗即入热带林川的尊贵套间',
        desc: '充足斜射和煦晨光，手工实木格栅屏风，静音降噪医疗电机，轻推落地隔音钢窗，绿油油的巴纽旺伊植被花园宛在身边.',
        benefits: ['高级微孔吸音天花板和双层隔音复合墙板', '可宽大平摊折叠的尊享家属陪护双人沙发床', '极速抗噪静音 24 小时护士站一线呼救器']
      }
    ]
  },
  AR: {
    experience: 'أبعاد معمارية وهندسة صحية صديقة للبيئة',
    mainTitle: 'البيئة الطبيعية المساعدة للتعافي والنهوض',
    mainDesc: 'أعدنا هندسة التصاميم الفراغية للمستشفى مع مزج كامل للنباتات والأحواض الحية لتطمين المرضى وتحسين مناعتهم وتقليل قلق الأهل.',
    exploreTitle: 'اكتشف زوايا الشفاء الطبيعي',
    whyTitle: 'لماذا تعد الحدائق مفيدة طبياً؟',
    whyDesc: 'تقول الدراسات الإكلينيكية أن النظر إلى المناظر الخضراء يقلل من نشاط مراكز التوتر في الدماغ ويحفز إفراز هرمونات الاسترخاء.',
    benefitsTitle: 'ما يجعل هذا المكان مميزاً:',
    special: 'المكان 0',
    compliance: 'مطابقة المعايير البيئية والصحية',
    spaces: [
      {
        title: 'حديقة الشفاء النباتية (Healing Garden)',
        subtitle: 'حديقة الأحواض المائية وبحيرات الكوي',
        desc: 'تقع في قلب ممرات الهواء بالمستشفى، يصدر خرير مياه الشلالات الاصطناعية ترددات هادئة (Pink Noise) تنظم نبضات القلب السريعة.',
        benefits: ['تخفيض هرمون الكورتيزول المسبب للتوتر بنسبة ٢٢٪', 'توليد هواء نقي غني بالأكسجين النظيف والبارد', 'محاطة بفرش متكامل من الخزامى المنوم طبعياً']
      },
      {
        title: 'صالة العائلات (Family Lounge)',
        subtitle: 'مساحة مريحة ونوعية للأهالي',
        desc: 'صالة مجهزة بقطع من خشب التيك الفاخر حيث يمكن للعائلات شرب المياه الطازجة والقراءة والاسترخاء دورياً.',
        benefits: ['شاي عشبي ومشروبات صحية مجانية', 'محطات عمل متميزة وإنترنت مجاني فائق السرعة', 'أخصائي رضاعة طبيعية متوفر عند الطلب']
      },
      {
        title: 'ركن الأطفال (Kids Corner)',
        subtitle: 'واحة مرح خضراء للأطفال الصغار',
        desc: 'ملاذ ترفيهي للتخفيف من توتر الأطفال مجهز بألعاب تعليمية خشبية ملونة غير سامة.',
        benefits: ['أرضيات مطاطية مضادة للبكتيريا لسلامة تامة', 'ألعاب آمنة خالية من الحواف الحادة والمخاطر', 'إشراف كامل من أخصائيين ودودين للأطفال']
      },
      {
        title: 'صالة الانتظار المريحة (Cozy Waiting Lounge)',
        subtitle: 'رواق هادئ مصمم بأناقة منتجع طبيعي',
        desc: 'يخفف من قلق الانتظار بمقاعد مريحة متباعدة ونسمات منعشة وعطور طبيعية مهدئة للنفس.',
        benefits: ['عطور طبيعية مهدئة للأعصاب والعضلات بذكاء', 'مقاعد متباعدة لتجنب الازدحام والتكدس العشوائي', 'شاشات عرض ذكية هادئة وبدون إعلانات صاخبة']
      },
      {
        title: 'أجنحة التنويم الحديثة (Modern Inpatient Suites)',
        subtitle: 'غرف شفاء مطلة على الطبيعة الخضراء',
        desc: 'تتميز بدخول ضوء الشمس الطبيعي الفاتن وأسرة قابلة للتعديل صامتة وإطلالات خضراء ساحرة على غابات بانيوانجي.',
        benefits: ['جدران صامتة ماصة للضوضاء والأصوات بنسبة عالية', 'أريكة نوم كبيرة مريحة لمرافقي المرضى والمبيت', 'نظام تنبيه للممرضات مباشر وسريع على مدار الساعة']
      }
    ]
  }
};

export default function GreenHealing() {
  const [activeSpaceIdx, setActiveSpaceIdx] = useState(0);
  const lang = useLanguage();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ID;

  const currentSpace = t.spaces[activeSpaceIdx];
  const images = [
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1538108176447-280586497d96?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <section id="green-healing-section" className="py-16 md:py-20 bg-soft-mint relative">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="w-full text-center max-w-[105rem] mx-auto mb-12 space-y-4">
          <span className="font-display text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-white border border-divider px-3.5 py-1.5 rounded-full inline-block">
            {t.experience}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-headings tracking-tight">
            {t.mainTitle}
          </h2>
          <p className="text-gray-500 font-sans text-sm sm:text-base w-full leading-relaxed">
            {t.mainDesc}
          </p>
          
          <div className="flex justify-center mt-2">
            <div className="flex bg-white p-1 rounded-xl border border-divider">
              <span className="text-[11px] font-bold text-deep-teal bg-soft-mint px-3.5 py-1.5 rounded-lg flex items-center">
                <Trees className="h-4 w-4 text-yasmin-green mr-1.5" />
                Resort & Wellness Design
              </span>
            </div>
          </div>
        </div>

        {/* Slideshow Display Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* L: 5 Navigation Buttons with indicators - shrunk side column from col-span-4 to col-span-3 */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-2 bg-white/60 p-4 rounded-3xl border border-divider/60">
            <div className="space-y-1.5 text-left">
              <p className="text-[10px] font-extrabold tracking-widest text-deep-teal/60 uppercase px-3 py-1 border-b border-divider mb-3">
                {t.exploreTitle}
              </p>
              {t.spaces.map((space, idx) => {
                const isActive = activeSpaceIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSpaceIdx(idx)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-2xl text-left transition-all duration-200 outline-none cursor-pointer ${
                      isActive
                        ? 'bg-deep-teal text-white font-bold shadow-md transform scale-102'
                        : 'text-gray-600 hover:text-deep-teal hover:bg-white font-medium'
                    }`}
                  >
                    <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-soft-mint text-deep-teal'}`}>
                      <Compass className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      {/* Enriched text size for titles and subtitles */}
                      <p className="text-sm sm:text-base font-bold font-display leading-tight truncate">{space.title.split(' (')[0]}</p>
                      <p className={`text-xs mt-1 leading-normal truncate ${isActive ? 'text-white/85' : 'text-gray-500'}`}>{space.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-headings text-white rounded-xl text-left border border-white/5 space-y-1 text-[11px] mt-4">
              <p className="font-bold text-warm-orange flex items-center"><Wind className="h-3.5 w-3.5 mr-1" /> {t.whyTitle}</p>
              <p className="opacity-80 leading-relaxed text-[10px]">{t.whyDesc}</p>
            </div>
          </div>

          {/* R: Output showcase panel - enlarged main card from col-span-8 to col-span-9 */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-divider shadow-lg overflow-hidden flex flex-col justify-between text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-stretch">
              
              {/* Image pane */}
              <div className="relative h-64 md:h-auto overflow-hidden">
                <SafeImage
                  src={images[activeSpaceIdx]}
                  alt={currentSpace.title}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-103"
                />
                <div className="absolute top-4 left-4 bg-deep-teal text-white p-2.5 rounded-full shadow-md">
                  <Flower className="h-4 w-4 text-warm-orange" />
                </div>
              </div>

              {/* Text pane */}
              <div className="p-8 flex flex-col justify-between bg-white text-left">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-warm-orange uppercase tracking-widest">{t.special}{activeSpaceIdx + 1} EXPERT-GUIDED</span>
                    <h3 className="font-display font-bold text-xl text-headings mt-1 leading-tight">{currentSpace.title}</h3>
                    <p className="text-sm text-deep-teal font-medium italic mt-0.5">{currentSpace.subtitle}</p>
                  </div>

                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">{currentSpace.desc}</p>

                  <div className="space-y-1.5 pt-4 border-t border-divider">
                    <p className="text-[10px] font-extrabold text-headings uppercase tracking-widest font-sans">{t.benefitsTitle}</p>
                    {currentSpace.benefits.map((bullet, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm sm:text-base text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-yasmin-green shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-divider mt-6 text-[10px] text-gray-400 font-mono flex justify-between">
                  <span>RS YASMIN BANYUWANGI</span>
                  <span>{t.compliance}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
