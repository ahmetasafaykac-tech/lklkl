import React from 'react';
import { SubjectId, ThemeColor } from '../types';
import { SUBJECTS } from '../data/curriculumData';
import { THEME_CONFIGS } from '../utils/theme';
import {
  Compass,
  Calculator,
  Zap,
  FlaskConical,
  Dna,
  BookOpen,
  Clock,
  Globe,
  Brain,
  Languages,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface SubjectBarProps {
  selectedSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
  theme: ThemeColor;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-3.5 h-3.5" />,
  Calculator: <Calculator className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  FlaskConical: <FlaskConical className="w-3.5 h-3.5" />,
  Dna: <Dna className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Clock: <Clock className="w-3.5 h-3.5" />,
  Globe: <Globe className="w-3.5 h-3.5" />,
  Brain: <Brain className="w-3.5 h-3.5" />,
  Languages: <Languages className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
};

export const SubjectBar: React.FC<SubjectBarProps> = ({
  selectedSubject,
  onSelectSubject,
  theme,
}) => {
  const themeConfig = THEME_CONFIGS[theme];

  return (
    <div id="subject-bar-container" className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-70">
          <GraduationCap className="w-4 h-4" />
          <span>EBA & MEB Ders Müfredatı Seçimi:</span>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${themeConfig.badge}`}>
          Türkiye Müfredatı Aktif
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              id={`subject-pill-${sub.id}`}
              onClick={() => onSelectSubject(sub.id)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSelected
                  ? `${themeConfig.surfaceActive} font-semibold shadow-xs`
                  : `${themeConfig.surface} ${themeConfig.surfaceHover} ${themeConfig.textSecondary}`
              }`}
            >
              <span className="opacity-80">{ICON_MAP[sub.iconName]}</span>
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
