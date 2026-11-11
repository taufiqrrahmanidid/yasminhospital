import React, { useState } from 'react';
import { Building2, Calculator, Check, ShieldCheck } from 'lucide-react';
import { COMPANY_PACKAGES } from '../data';
import { useLanguage } from '../hooks/useLanguage';
import { EXTRA_TRANSLATIONS } from '../translations_extra';
import WhatsAppIcon from './WhatsAppIcon';

const PACKAGES_TRANSLATIONS: Record<string, Record<string, { name: string; priceEstimate: string; features: string[] }>> = {
  ID: {
    'p-1': {
      name: 'Onsite Medical Screening & Seminar',
      priceEstimate: 'Mulai dari Rp 75.000 / karyawan',
      features: [
        'Pengecekan Gula Darah, Kolesterol, & Asam Urat terarah',
        'Seminar interaktif Manajemen Stres Kerja atau Pencegahan Ergonomik',
        'Tim medis & perawat berpengalaman dikirim ke lokasi perusahaan',
        'Laporan evaluasi komprehensif profil kesehatan karyawan'
      ]
    },
    'p-2': {
      name: 'Training K3 & First-Aid Sertifikasi RS Yasmin',
      priceEstimate: 'Hubungi untuk Quota Korporasi',
      features: [
        'Pelatihan Bantuan Hidup Dasar (BHD / CPR) bersertifikat resmi',
        'Simulasi keselamatan penanganan luka bakar, patah tulang, & tersedak',
        'Pemberian modul materi tanggap darurat bencana khusus industri Anda',
        'Paket kelayakan kotak P3K standar departemen keselamatan kerja'
      ]
    },
    'p-3': {
      name: 'Executive Corporate Wellness Checkup (At-Hospital)',
      priceEstimate: 'Mulai dari Rp 450.000 / eksekutif',
      features: [
        'Pemeriksaan Rekam Jantung (EKG), Rontgen Paru, & Tes Darah lengkap',
        'Akses masuk Executive Lounge & sajian gizi sehat premium',
        'Konsultasi eksklusif hasil laborat bareng Dokter Spesialis Penyakit Dalam',
        'Prioritas pemesanan slot dan penjemputan mobil VIP (tambahan)'
      ]
    }
  },
  EN: {
    'p-1': {
      name: 'Onsite Medical Screening & Seminar',
      priceEstimate: 'Starting from IDR 75,000 / employee',
      features: [
        'Targeted Blood Sugar, Cholesterol, & Uric Acid checks',
        'Interactive seminars on Work Stress Management or Ergonomic Prevention',
        'Experienced medical team & nurses dispatched to your corporate site',
        'Comprehensive evaluation report of employee health profiles'
      ]
    },
    'p-2': {
      name: 'HSE Training & First-Aid Certification by RS Yasmin',
      priceEstimate: 'Contact Us for Corporate Quota',
      features: [
        'Officially certified Basic Life Support (BLS / CPR) training',
        'Safety simulations for treating burns, fractures, & choking',
        'Emergency response modules tailored to your specific industry',
        'Standard occupational health department compliant First Aid Kit packages'
      ]
    },
    'p-3': {
      name: 'Executive Corporate Wellness Checkup (At-Hospital)',
      priceEstimate: 'Starting from IDR 450,000 / executive',
      features: [
        'Complete Electrocardiogram (ECG), Chest X-Ray, & Blood Tests',
        'Access to Executive Lounge with premium healthy nutrition choices',
        'Exclusive consultation of lab results with an Internal Medicine Specialist',
        'Priority slot booking and optional VIP car pickup service'
      ]
    }
  },
  KR: {
    'p-1': {
      name: '사내 출장 건강 검진 및 세미나',
      priceEstimate: '임직원 1인당 75,000 IDR부터',
      features: [
        '정밀 혈당, 콜레스테롤 및 요산 검사',
        '직무 스트레스 관리 또는 인체공학적 질환 예방 세미나',
        '풍부한 경험의 의료진 및 간호사 사내 파견',
        '임직원 개별 건강 등급 종합 평가 보고서 제공'
      ]
    },
    'p-2': {
      name: '산업안전보건법(K3) 교육 및 응급처치 자격증 과정',
      priceEstimate: '기업 단체 쿼터 문의',
      features: [
        '공인 심폐소생술(CPR) 및 기본 인명 구조술 실습 교육',
        '화상, 골절, 기도 폐쇄 대비 안전 모의 시뮬레이션',
        '해당 산업군 맞춤 재난 비상 대피 교육 모듈',
        '정부 산업안전 기준 규격 구급상자 패키지'
      ]
    },
    'p-3': {
      name: '병원 내원 경영자 임원 전용 종합 건강 검진',
      priceEstimate: '임원 1인당 450,000 IDR부터',
      features: [
        '심전도(ECG), 흉부 엑스레이, 혈액 정밀 종합 검사',
        'VIP 라운지 이용권 및 전용 고품격 웰빙 영양 식단 제공',
        '소화기 및 내과 전문의 1:1 심층 상담',
        '검진 일정 우선 예약 및 프리미엄 VIP 의전 차량 픽업 옵션'
      ]
    }
  },
  ZH: {
    'p-1': {
      name: '上门员工福利体检与健康讲座',
      priceEstimate: '每位员工 75,000 印尼盾起',
      features: [
        '针对性的血糖、胆固醇、尿酸三项精细化筛查',
        '举办职业压力疏导、人体工学等专题讲座',
        '派遣经验丰富的医生和护士团队至贵单位现场服务',
        '出具详尽的员工健康分析报告及整体评估'
      ]
    },
    'p-2': {
      name: '职业健康安全 (HSE/K3) 与急救持证培训',
      priceEstimate: '联系获取团体优惠报价',
      features: [
        '官方权威认证的心肺复苏术 (CPR) 与急救技能实操培训',
        '烧烫伤、骨折、气道异物梗阻等突发工伤应急模拟演练',
        '根据贵单位行业特点定制专属应急防灾安全教材',
        '配备符合国家职业安全监察标准的高规格医用急救箱'
      ]
    },
    'p-3': {
      name: '尊享高管专属深度健康体检（在院检查）',
      priceEstimate: '每位高管 450,000 印尼盾起',
      features: [
        '包含心电图 (ECG)、肺部胸透及全套生化血液检查',
        '尊享贵宾专属休息室及定制高端营养膳食',
        '知名内科专家面对面提供详尽报告解读与健康调理建议',
        '享有优先预约排期服务，可附加 VIP 豪华专车接送'
      ]
    }
  },
  AR: {
    'p-1': {
      name: 'الفحص الطبي الموقعي والندوة التثقيفية',
      priceEstimate: 'تبدأ من ٧٥,٠٠٠ روبية إندونيسية / موظف',
      features: [
        'فحوصات دقيقة لنسبة السكر، الكولسترول، وحمض اليوريك',
        'ندوات تفاعلية لإدارة ضغوط العمل والوقاية المهنية',
        'إرسال طاقم طبي وممرضين ذوي خبرة إلى موقع الشركة',
        'تقرير تقييم شامل للملف الصحي للموظفين'
      ]
    },
    'p-2': {
      name: 'تدريب الصحة والسلامة المهنية (K3) والشهادة المعتمدة',
      priceEstimate: 'اتصل بنا لمعرفة عروض المجموعات',
      features: [
        'تدريب معتمد رسمياً للإسعافات الأولية والإنعاش القلبي الرئوي (CPR)',
        'محاكاة عملية للتعامل مع الحروق، الكسور، والاختناق',
        'تقديم دليل مواد الاستجابة للطوارئ المخصص لقطاع شركتك',
        'حقيبة إسعافات أولية مطابقة لمعايير إدارة السلامة المهنية'
      ]
    },
    'p-3': {
      name: 'الفحص الطبي الوقائي للمدراء التنفيذيين (داخل المستشفى)',
      priceEstimate: 'تبدأ من ٤٥٠,٠٠٠ روبية إندونيسية / شخص',
      features: [
        'تخطيط القلب الكهربائي (ECG)، أشعة الصدر، وفحص الدم الكامل',
        'دخول صالة كبار الشخصيات مع وجبات غذائية صحية فاخرة',
        'استشارة خاصة للنتائج المخبرية مع استشاري أمراض باطنية',
        'أولوية حجز المواعيد مع خيار التوصيل بسيارات VIP'
      ]
    }
  }
};

const SIMULATOR_TRANSLATIONS: Record<string, {
  simTitle: string;
  simSub: string;
  placeholderName: string;
  placeholderCount: string;
  lblBtnSubmit: string;
  discl: string;
  discAlert1: string;
  discAlert2: string;
}> = {
  ID: {
    simTitle: 'Estimator Anggaran Kemitraan',
    simSub: 'B2B BUDGET SIMULATOR',
    placeholderName: 'Contoh: PT Semen Banyuwangi Raya',
    placeholderCount: 'Input kuota karyawan',
    lblBtnSubmit: 'Ajukan Proposal via WhatsApp',
    discl: 'Seluruh draf kerahasiaan medis terlindungi komparasi undang-undang Kemenkes RI.',
    discAlert1: 'Diskon volume perusahaan besar',
    discAlert2: 'Off) telah diperhitungkan otomatis!'
  },
  EN: {
    simTitle: 'Partnership Budget Estimator',
    simSub: 'B2B BUDGET SIMULATOR',
    placeholderName: 'e.g., Semen Banyuwangi Ltd.',
    placeholderCount: 'Enter employee count',
    lblBtnSubmit: 'Submit Proposal via WhatsApp',
    discl: 'All medical confidentiality drafts are strictly protected under Republic of Indonesia health regulations.',
    discAlert1: 'Large enterprise volume discount',
    discAlert2: 'Off) calculated automatically!'
  },
  KR: {
    simTitle: '임직원 단체 예산 계산기',
    simSub: 'B2B BUDGET SIMULATOR',
    placeholderName: '예: PT 세멘 바뉴왕이',
    placeholderCount: '임직원 수 입력',
    lblBtnSubmit: '왓츠앱으로 제안서 신청하기',
    discl: '모든 임직원 의료 개인정보는 인도네시아 보건부 법률에 따라 철저히 비밀이 보장됩니다.',
    discAlert1: '대기업 단체 할인율',
    discAlert2: 'Off)이 자동으로 반영되었습니다!'
  },
  ZH: {
    simTitle: '年度合作预算模拟器',
    simSub: 'B2B BUDGET SIMULATOR',
    placeholderName: '例如：巴纽旺伊水泥公司',
    placeholderCount: '输入预估参检员工数',
    lblBtnSubmit: '立即提交定制方案申请',
    discl: '所有企事业员工的医疗隐私均受到印尼卫生部相关保密法规的严密保护。',
    discAlert1: '大型企事业单位专享折扣',
    discAlert2: '免减）已自动扣减并展示！'
  },
  AR: {
    simTitle: 'تقدير ميزانية الشراكة',
    simSub: 'B2B BUDGET SIMULATOR',
    placeholderName: 'مثال: شركة إسمنت بانيوانجي',
    placeholderCount: 'أدخل عدد الموظفين',
    lblBtnSubmit: 'تقديم طلب الشراكة عبر واتساب',
    discl: 'جميع بيانات السرية الطبية محمية بالكامل بموجب قوانين وزارة الصحة الإندونيسية.',
    discAlert1: 'تم احتساب خصم حجم المؤسسات الكبيرة',
    discAlert2: 'تلقائياً!'
  }
};

export default function CorporateHealthcare() {
  const lang = useLanguage();
  const t = EXTRA_TRANSLATIONS.CORPORATE[lang] || EXTRA_TRANSLATIONS.CORPORATE.ID;
  const sim = SIMULATOR_TRANSLATIONS[lang] || SIMULATOR_TRANSLATIONS.ID;

  const [selectedPackId, setSelectedPackId] = useState('p-1');
  const [employeeCount, setEmployeeCount] = useState<number | ''>('');
  const [corporateName, setCorporateName] = useState('');
  const [corporateContact, setCorporateContact] = useState('');

  // Map packages dynamically based on active language
  const localizedPackages = COMPANY_PACKAGES.map(pack => {
    const translation = PACKAGES_TRANSLATIONS[lang]?.[pack.id] || PACKAGES_TRANSLATIONS.ID[pack.id];
    return {
      ...pack,
      name: translation?.name || pack.name,
      priceEstimate: translation?.priceEstimate || pack.priceEstimate,
      features: translation?.features || pack.features
    };
  });

  const activePackage = localizedPackages.find(p => p.id === selectedPackId) || localizedPackages[0];

  // Estimate calculations
  const calculateTotalEstimate = () => {
    if (!employeeCount) return 0;
    
    let pricePerHead = 0;
    if (selectedPackId === 'p-1') {
      pricePerHead = 75000;
    } else if (selectedPackId === 'p-2') {
      pricePerHead = 120000; // Safe custom value
    } else {
      pricePerHead = 450000;
    }

    // Give volume discount for large enterprises
    let discount = 1.0;
    if (Number(employeeCount) > 100) discount = 0.85; // 15% off
    else if (Number(employeeCount) > 50) discount = 0.90; // 10% off

    return Math.round(Number(employeeCount) * pricePerHead * discount);
  };

  const finalEstimate = calculateTotalEstimate();

  const handleCorporateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corporateName || !employeeCount || !corporateContact) {
      alert(t.toastRequired || 'Mohon lengkapi formulir informasi pengajuan korporasi.');
      return;
    }

    const textPayload = lang === 'ID'
      ? `Halo RS Yasmin Banyuwangi, kami dari *${corporateName}* ingin mengajukan program kemitraan korporasi:\n- Program: *${activePackage.name}*\n- Estimasi Jumlah Karyawan: *${employeeCount} orang*\n- Kontak Admin Kami: *${corporateContact}*\n- Perkiraan Anggaran: *Rp ${finalEstimate.toLocaleString('id-ID')}*\n\nMohon ketersediaan jadwal proposal dikirimkan ke tim kami. Terima kasih.`
      : lang === 'KR'
      ? `안녕하세요 야스민 종합병원 귀중, 저희는 *${corporateName}* 이며 다음과 같이 단체 의료 제휴 제안서 발급을 요청합니다:\n- 요청 프로그램: *${activePackage.name}*\n- 예상 임직원 인원: *${employeeCount}명*\n- 대표 연락처: *${corporateContact}*\n- 가상 견적 예산: *Rp ${finalEstimate.toLocaleString('id-ID')}*\n\n저희 측 검토를 위해 공식 제안서 일정을 메일이나 왓츠앱으로 발송 부탁드립니다. 감사합니다.`
      : lang === 'ZH'
      ? `您好，雅斯敏综合医院！我们是 *${corporateName}*，特向贵院申请企事业单位健康合作方案：\n- 申请项目：*${activePackage.name}*\n- 预计参检人数：*${employeeCount} 人*\n- 代表联系方式：*${corporateContact}*\n- 预估总费用：*Rp ${finalEstimate.toLocaleString('id-ID')}*\n\n请将贵院官方定制提案及排期发送给我们。谢谢！`
      : lang === 'AR'
      ? `مرحباً مستشفى ياسمين بانيوانجي، نحن من شركة *${corporateName}* ونود التقدم لطلب برنامج شراكة الشركات:\n- البرنامج المختار: *${activePackage.name}*\n- العدد المقدر للموظفين: *${employeeCount} موظف*\n- مسؤول الاتصال: *${corporateContact}*\n- الميزانية التقريبية: *Rp ${finalEstimate.toLocaleString('id-ID')}*\n\nيرجى إرسال عرض الأسعار والمقترح الرسمي لفريقنا. شكراً لكم.`
      : `Hello RS Yasmin Banyuwangi, we are from *${corporateName}* and we would like to apply for the corporate partnership program:\n- Program: *${activePackage.name}*\n- Estimated Employees: *${employeeCount} people*\n- Our Admin Contact: *${corporateContact}*\n- Estimated Budget: *Rp ${finalEstimate.toLocaleString('id-ID')}*\n\nPlease send us the official partnership proposal draft. Thank you.`;

    const waLink = `https://wa.me/6285259353001?text=${encodeURIComponent(textPayload)}`;
    window.open(waLink, '_blank');
  };

  return (
    <section id="corporate-section" className="py-16 bg-soft-mint text-left">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="w-full text-center mb-12">
          <span className="font-display text-xs text-deep-teal font-extrabold uppercase tracking-widest bg-white border border-divider px-3.5 py-1.5 rounded-full">
            {t.badge}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-headings mt-4">
            {t.title}
          </h2>
          <p className="text-gray-600 font-sans text-base sm:text-lg mt-4 leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Form Estimator & Packages Row Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* L: 3 Packages detail */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-display font-bold text-sm tracking-wider text-deep-teal uppercase px-2 mb-4">
              {t.selectProg}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {localizedPackages.map((pack) => {
                const isActive = selectedPackId === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-headings text-white border-yasmin-green shadow-md transform scale-101'
                        : 'bg-white text-gray-700 border-divider/80 hover:border-yasmin-green'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-sm tracking-wide flex items-center space-x-2">
                        <Building2 className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-warm-orange' : 'text-deep-teal'}`} />
                        <span>{pack.name}</span>
                      </h4>
                      <span className={`text-[11px] font-bold font-mono px-2.5 py-1 rounded ${isActive ? 'bg-white/10 text-warm-orange' : 'bg-soft-mint text-deep-teal'}`}>
                        {pack.priceEstimate}
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base opacity-90 border-t border-white/10 pt-3">
                      {pack.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start space-x-1.5">
                          <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${isActive ? 'text-yasmin-green' : 'text-deep-teal'}`} />
                          <span className="leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* R: Dynamic calculator & contact requester box */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-divider shadow-lg p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-warm-orange/10 text-headings rounded-xl">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-headings">{sim.simTitle}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">{sim.simSub}</p>
                </div>
              </div>

              <form onSubmit={handleCorporateSubmit} className="space-y-4 text-xs font-medium text-gray-700 font-sans text-left">
                <div>
                  <label className="block text-gray-500 mb-1.5 uppercase font-bold text-[10px]">{t.lblCorporateName}:</label>
                  <input
                    type="text"
                    required
                    value={corporateName}
                    onChange={(e) => setCorporateName(e.target.value)}
                    placeholder={sim.placeholderName}
                    className="w-full bg-soft-mint px-3 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1.5 uppercase font-bold text-[10px]">{t.lblEmployeeCount}:</label>
                    <input
                      type="number"
                      required
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={sim.placeholderCount}
                      className="w-full bg-soft-mint px-3 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1.5 uppercase font-bold text-[10px]">{t.lblContact}:</label>
                    <input
                      type="tel"
                      required
                      value={corporateContact}
                      onChange={(e) => setCorporateContact(e.target.value)}
                      placeholder="Contoh: 081234567xxx"
                      className="w-full bg-soft-mint px-3 py-3 rounded-xl border border-divider focus:outline-none focus:border-yasmin-green text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Simulated Final Sum */}
                {employeeCount !== '' && Number(employeeCount) > 0 && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-warm-orange/20 space-y-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.calcTotal}</p>
                    <p className="font-mono font-extrabold text-[#0B4F4A] text-lg">
                      Rp {finalEstimate.toLocaleString('id-ID')} <span className="text-xs text-gray-500 font-normal">/ {t.perYear}</span>
                    </p>
                    {Number(employeeCount) > 50 && (
                      <p className="text-[9px] text-emerald-600 font-bold font-sans">
                        ✓ {sim.discAlert1} ({Number(employeeCount) > 100 ? '15%' : '10%'} {sim.discAlert2}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-divider">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-headings hover:bg-yasmin-green text-white font-bold rounded-xl text-xs tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5 fill-current text-white animate-whatsapp-shake" />
                    <span>{t.btnSubmit || sim.lblBtnSubmit}</span>
                  </button>
                </div>
              </form>

              <div className="text-[10px] text-gray-400 font-normal leading-normal text-center flex items-center justify-center space-x-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>{sim.discl}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
