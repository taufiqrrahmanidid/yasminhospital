import React from 'react';
import { MapPin, Mail, Phone, PhoneCall } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { ABOUT_TRANSLATIONS } from '../translations_about';
import WhatsAppIcon from './WhatsAppIcon';

export default function ContactSection() {
  const lang = useLanguage();
  const t = ABOUT_TRANSLATIONS[lang as keyof typeof ABOUT_TRANSLATIONS] || ABOUT_TRANSLATIONS.ID;

  return (
    <section id="contact-us-section" className="py-16 md:py-24 bg-[#FAF9F5] border-t border-divider/50">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center w-full max-w-[105rem] mx-auto mb-12 md:mb-16">
          <span className="font-display text-[11px] sm:text-xs text-deep-teal font-extrabold tracking-widest uppercase bg-soft-mint border border-divider px-4 py-2 rounded-full inline-block">
            {t.hubungiBadge}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-headings mt-4.5 tracking-tight leading-tight">
            {t.hubungiTitle}
          </h2>
          <p className="text-gray-500 font-sans text-sm sm:text-base mt-3 leading-relaxed w-full">
            {t.hubungiDesc}
          </p>
          <div className="w-16 h-1 bg-warm-orange mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Content Grid with two custom standalone hover frames */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
          
          {/* FRAME 1 (LEFT): CONSOLIDATED CONTACT CARDS IN ONE SINGLE FRAME */}
          <div className="lg:col-span-6 group/frame">
            <div className="h-full bg-white rounded-3xl border border-divider/90 p-8 sm:p-10 shadow-xs hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:border-green-500 hover:ring-2 hover:ring-green-500/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1">
              
              {/* Decorative subtle background gradient on hover */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-soft-mint/20 to-transparent -z-10 rounded-full blur-3xl opacity-0 group-hover/frame:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-8">
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-headings tracking-tight">
                    {lang === 'ID' ? 'Informasi Kontak Lengkap' : lang === 'KR' ? '전체 연락처 정보' : lang === 'ZH' ? '完整联系方式信息' : lang === 'AR' ? 'معلومات الاتصال الكاملة' : 'Complete Contact Information'}
                  </h3>
                  <p className="text-sm text-gray-500 font-sans tracking-wider mt-1.5 font-bold">
                    RSU Yasmin Banyuwangi
                  </p>
                </div>

                {/* The single unified list format */}
                <div className="space-y-6">
                  
                  {/* Address */}
                  <div className="flex flex-col space-y-1.5">
                    <span className="font-display font-bold text-xs text-deep-teal/80 uppercase tracking-wider block text-left">
                      {t.hubungiHead1 || 'Alamat Rumah Sakit:'}
                    </span>
                    <div className="flex items-start space-x-3.5">
                      <MapPin className="h-5 w-5 text-deep-teal mt-1 shrink-0" />
                      <p className="text-gray-700 font-sans text-sm sm:text-base leading-relaxed text-left font-normal">
                        Jl. Letkol Istiqlah No. 80-84,<br />
                        Mojopanggung, Kec. Banyuwangi,<br />
                        Kab. Banyuwangi, Jawa Timur 68425
                      </p>
                    </div>
                  </div>

                  {/* Operational Phone & WA */}
                  <div className="flex flex-col space-y-1.5">
                    <span className="font-display font-bold text-xs text-deep-teal/80 uppercase tracking-wider block text-left">
                      {t.hubungiHead3 || 'Hotline Telepon & WA:'}
                    </span>
                    <div className="flex items-center space-x-3.5">
                      <Phone className="h-5 w-5 text-deep-teal shrink-0" />
                      <a 
                        href="tel:0333424671" 
                        className="text-gray-700 hover:text-deep-teal font-sans text-sm sm:text-base block transition-colors text-left font-normal"
                      >
                        (0333) 424671
                      </a>
                    </div>
                    <div className="flex items-center space-x-3.5">
                      <WhatsAppIcon className="h-5 w-5 text-emerald-600 fill-current shrink-0" />
                      <a 
                        href="https://wa.me/6285259353001" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-500 font-sans text-sm sm:text-base block transition-colors hover:underline text-left font-bold"
                        title="Hubungi WhatsApp Sapa Yasmin"
                      >
                        +62 852 5935 3001 (Sapa Yasmin)
                      </a>
                    </div>
                  </div>

                  {/* IGD 24 Jam Ambulance */}
                  <div className="flex flex-col space-y-1.5">
                    <span className="font-display font-bold text-xs text-red-650 uppercase tracking-wider block text-left">
                      {t.hubungiHead4 || 'Gadar IGD (24 Jam SIAGA):'}
                    </span>
                    <div className="flex items-center space-x-3.5">
                      <PhoneCall className="h-5 w-5 text-red-600 shrink-0 animate-pulse" />
                      <a 
                        href="tel:0333423118" 
                        className="text-red-600 hover:text-red-700 font-sans text-sm sm:text-base block transition-colors hover:underline text-left font-bold"
                      >
                        (0333) 423118 (IGD 24 JAM)
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1.5">
                    <span className="font-display font-bold text-xs text-deep-teal/80 uppercase tracking-wider block text-left">
                      {t.hubungiHead2 || 'Email Korespondensi:'}
                    </span>
                    <div className="flex items-center space-x-3.5">
                      <Mail className="h-5 w-5 text-deep-teal shrink-0" />
                      <a 
                        href="mailto:yasmin_hospital@yahoo.com" 
                        className="text-deep-teal hover:text-yasmin-green font-sans text-sm sm:text-base block transition-colors hover:underline break-all text-left font-normal"
                      >
                        yasmin_hospital@yahoo.com
                      </a>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* FRAME 2 (RIGHT): STANDALONE HOVER GOOGLE MAP FRAME */}
          <div className="lg:col-span-6 group/map-frame">
            <div className="h-full bg-white rounded-3xl border border-divider/90 p-0 shadow-xs hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:border-green-500 hover:ring-2 hover:ring-green-500/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1 min-h-[460px]">
              
              {/* Standalone Map Element Container - Full frame to edge */}
              <div className="w-full h-full relative flex-grow overflow-hidden rounded-3xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.9571721711113!2d114.36066237659556!3d-8.207061691825052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd1453951abd4fb%3A0x511c625444b5c25c!2sRumah%20Sakit%20Yasmin%20Banyuwangi!5e0!3m2!1sen!2sid!4v1781864853270!5m2!1sen!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '460px', height: '100%', width: '100%', display: 'block' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi RS Yasmin Banyuwangi"
                  className="w-full h-full absolute inset-0 rounded-3xl"
                ></iframe>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
