import { useState, useEffect } from 'react';

export function useLanguage() {
  const [lang, setLang] = useState<'ID' | 'EN' | 'KR' | 'ZH' | 'AR'>('ID');

  useEffect(() => {
    // Initial load
    const saved = localStorage.getItem('yasmin_pref_lang');
    if (saved && ['ID', 'EN', 'KR', 'ZH', 'AR'].includes(saved)) {
      setLang(saved as any);
    }

    const handleLangChange = (e: CustomEvent<'ID' | 'EN' | 'KR' | 'ZH' | 'AR'>) => {
      setLang(e.detail);
    };

    window.addEventListener('yasmin_language_change', handleLangChange as EventListener);
    return () => {
      window.removeEventListener('yasmin_language_change', handleLangChange as EventListener);
    };
  }, []);

  return lang;
}
