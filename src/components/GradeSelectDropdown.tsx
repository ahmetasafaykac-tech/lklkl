import React, { useState, useRef, useEffect } from 'react';
import { GradeLevel, ThemeColor } from '../types';
import { GRADE_NAMES } from '../data/curriculumData';
import { THEME_CONFIGS } from '../utils/theme';
import { GraduationCap, ChevronDown, Check, Sparkles, BookOpen } from 'lucide-react';

interface GradeSelectDropdownProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  theme: ThemeColor;
  variant?: 'header' | 'chat' | 'compact';
}

const ALL_GRADES: { id: GradeLevel; group: string; badge?: string }[] = [
  // Lise & Üniversite Hazırlık (En üstte sınav kademeleri)
  { id: '12', group: 'Lise & YKS', badge: 'YKS / AYT' },
  { id: '11', group: 'Lise & YKS', badge: 'Alan Temel' },
  { id: '10', group: 'Lise & YKS' },
  { id: '9', group: 'Lise & YKS', badge: 'Lise Başlangıç' },
  { id: 'mezun', group: 'Lise & YKS', badge: 'Mezun Derece' },

  // Ortaokul
  { id: '8', group: 'Ortaokul', badge: 'LGS Hazırlık' },
  { id: '7', group: 'Ortaokul' },
  { id: '6', group: 'Ortaokul' },
  { id: '5', group: 'Ortaokul' },

  // İlkokul
  { id: '4', group: 'İlkokul' },
  { id: '3', group: 'İlkokul' },
  { id: '2', group: 'İlkokul' },
  { id: '1', group: 'İlkokul', badge: 'Temel Okuma-Yazma' },
];

export const GradeSelectDropdown: React.FC<GradeSelectDropdownProps> = ({
  currentGrade,
  onSelectGrade,
  theme,
  variant = 'header',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeConfig = THEME_CONFIGS[theme];
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (grade: GradeLevel) => {
    onSelectGrade(grade);
    setIsOpen(false);
  };

  const currentLabel = GRADE_NAMES[currentGrade] || `${currentGrade}. Sınıf`;

  return (
    <div id="grade-dropdown-container" ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        id="grade-dropdown-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs cursor-pointer ${
          variant === 'chat'
            ? 'bg-black/5 dark:bg-white/5 border-emerald-500/40 text-emerald-400 hover:border-emerald-500'
            : `${themeConfig.surface} ${themeConfig.border} hover:border-opacity-100`
        }`}
        aria-expanded={isOpen}
        title="Sınıf Seviyenizi Değiştirin"
      >
        <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="font-bold whitespace-nowrap">
          {currentGrade === 'mezun' ? 'Mezun (YKS)' : `${currentGrade}. Sınıf`}
        </span>
        <span className="text-[10px] opacity-60 hidden sm:inline">
          {currentGrade === '12' ? '(YKS)' : currentGrade === '8' ? '(LGS)' : ''}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="grade-dropdown-menu"
          className={`absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl border shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl ${themeConfig.surface} ${themeConfig.borderStrong}`}
        >
          <div className="px-3 py-2 border-b border-opacity-20 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Sınıfınızı Seçin (1-12)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">12 Kademeli</span>
          </div>

          <div className="space-y-1">
            {ALL_GRADES.map((item) => {
              const isSelected = currentGrade === item.id;
              const label = GRADE_NAMES[item.id];

              return (
                <button
                  key={item.id}
                  id={`grade-option-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? `${themeConfig.surfaceActive} font-bold text-emerald-400 ring-1 ring-emerald-500/50`
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold border ${
                      isSelected ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-opacity-30 opacity-70'
                    }`}>
                      {item.id === 'mezun' ? 'M' : item.id}
                    </span>
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-[10px] opacity-50">{item.group}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
