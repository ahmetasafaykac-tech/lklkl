import React from 'react';
import { ThemeColor } from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeColor;
  onSelectTheme: (theme: ThemeColor) => void;
  title: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  title,
}) => {
  const themes: { id: ThemeColor; label: string; color: string; ringColor: string }[] = [
    { id: 'siyah', label: 'Siyah', color: 'bg-zinc-950 border border-zinc-700', ringColor: 'ring-emerald-500' },
    { id: 'beyaz', label: 'Beyaz', color: 'bg-slate-100 border border-slate-300', ringColor: 'ring-blue-600' },
    { id: 'mor', label: 'Mor', color: 'bg-purple-900 border border-purple-500', ringColor: 'ring-purple-400' },
    { id: 'kirmizi', label: 'Kırmızı', color: 'bg-rose-900 border border-rose-500', ringColor: 'ring-rose-500' },
  ];

  const currentConfig = THEME_CONFIGS[currentTheme];

  return (
    <div id="theme-selector-container" className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md opacity-80">
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{title}:</span>
      </div>
      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-opacity-40 bg-black/10 backdrop-blur-xs">
        {themes.map((t) => {
          const isActive = currentTheme === t.id;
          return (
            <button
              key={t.id}
              id={`theme-btn-${t.id}`}
              onClick={() => onSelectTheme(t.id)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                isActive
                  ? `${currentConfig.surfaceActive} shadow-xs font-semibold ring-1 ring-current`
                  : `${currentConfig.textMuted} hover:text-current`
              }`}
              title={`${t.label} Teması`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${t.color} inline-block shadow-xs`} />
              <span>{t.label}</span>
              {isActive && <Check className="w-3 h-3 ml-0.5 opacity-90" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
