import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../translations';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { THEME_CONFIGS } from '../utils/theme';
import { ThemeColor } from '../types';

interface LanguageSelectorProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  theme: ThemeColor;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLang,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const themeConfig = THEME_CONFIGS[theme];

  const activeLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="language-selector-root" ref={containerRef} className="relative inline-block text-left">
      <button
        id="language-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${themeConfig.surface} ${themeConfig.surfaceHover} ${themeConfig.textPrimary}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 opacity-70" />
        <span className="text-base leading-none">{activeLangMeta.flag}</span>
        <span className="font-semibold">{activeLangMeta.nativeName}</span>
        <span className="text-[10px] opacity-60 uppercase tracking-wider">({activeLangMeta.code})</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="language-dropdown-menu"
          className={`absolute right-0 mt-1.5 w-56 rounded-xl border p-1.5 shadow-xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-100 ${themeConfig.surface} ${themeConfig.borderStrong}`}
        >
          <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground opacity-60 border-b border-opacity-30 mb-1">
            10 DİL DESTEĞİ
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`lang-opt-${lang.code}`}
                  onClick={() => {
                    onSelectLang(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                    isSelected
                      ? `${themeConfig.surfaceActive} font-semibold`
                      : `${themeConfig.textSecondary} hover:bg-black/10 dark:hover:bg-white/10`
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-[10px] opacity-60">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-current" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
