import React, { useState } from 'react';
import { ThemeColor, SupportedLanguage, GradeLevel } from '../types';
import {
  EBA_CURRICULUM_RESOURCES,
  EbaResourceGuide,
  GRADE_TOPICS,
  GRADE_NAMES,
  GradeCurriculumTopic
} from '../data/curriculumData';
import { THEME_CONFIGS } from '../utils/theme';
import { translations } from '../translations';
import { GradeSelectDropdown } from './GradeSelectDropdown';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookmarkCheck,
  TrendingUp
} from 'lucide-react';

interface EbaResourcesModalProps {
  theme: ThemeColor;
  language: SupportedLanguage;
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onSelectTopicForChat: (topicPrompt: string) => void;
}

export const EbaResourcesModal: React.FC<EbaResourcesModalProps> = ({
  theme,
  language,
  currentGrade,
  onSelectGrade,
  onSelectTopicForChat,
}) => {
  const t = translations[language] || translations.tr;
  const themeConfig = THEME_CONFIGS[theme];

  // Active view tab: 'recommended' (user's grade) vs 'explore_all' (10, 11, 12. grades) vs 'official_portals'
  const [activeTab, setActiveTab] = useState<'recommended' | 'explore_all' | 'official_portals'>('recommended');
  const [exploredGrade, setExploredGrade] = useState<GradeLevel>('12');
  const [searchQuery, setSearchQuery] = useState('');

  // Topics for current grade (Sizin İçin Önerilen)
  const recommendedTopics = GRADE_TOPICS.filter((t) => t.grade === currentGrade);

  // Topics for explore grade
  const otherGradeTopics = GRADE_TOPICS.filter((t) => t.grade === exploredGrade);

  const filteredTopics = GRADE_TOPICS.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unitTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyTopics.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="eba-resources-view" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border ${themeConfig.surface} ${themeConfig.borderStrong} shadow-lg relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-80 h-40 bg-gradient-to-l ${themeConfig.highlightGlow} pointer-events-none`} />
        
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className={`p-3.5 rounded-2xl border ${themeConfig.surfaceActive}`}>
              <GraduationCap className="w-7 h-7 text-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{t.ebaTitle}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${themeConfig.badge}`}>
                  MEB & EBA Entegre
                </span>
              </div>
              <p className={`text-xs mt-1 max-w-xl ${themeConfig.textSecondary}`}>
                Türkiye Talim Terbiye Kurulu Başkanlığı (TTKB) onaylı lise ders kazanımları ve ÖSYM sınav analizleri.
              </p>
            </div>
          </div>

          {/* Current Grade Dropdown Indicator */}
          <div className="flex items-center gap-1.5">
            <GradeSelectDropdown
              currentGrade={currentGrade}
              onSelectGrade={onSelectGrade}
              theme={theme}
              variant="compact"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-opacity-30 pb-3">
        <div className="flex items-center gap-2">
          {/* Tab 1: Sizin İçin Önerilen */}
          <button
            id="tab-recommended-topics"
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recommended'
                ? `${themeConfig.surfaceActive} ring-1 ring-current shadow-xs`
                : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            <span>Sizin İçin Önerilen ({currentGrade}. Sınıf)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold">
              ÖNCELİKLİ
            </span>
          </button>

          {/* Tab 2: İleri Kademeler & Diğer Sınıflar */}
          <button
            id="tab-explore-grades"
            onClick={() => setActiveTab('explore_all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'explore_all'
                ? `${themeConfig.surfaceActive} ring-1 ring-current shadow-xs`
                : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>İleri Kademeler (10, 11, 12. Sınıf / YKS)</span>
          </button>

          {/* Tab 3: Resmi EBA Portalları */}
          <button
            id="tab-official-portals"
            onClick={() => setActiveTab('official_portals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'official_portals'
                ? `${themeConfig.surfaceActive} ring-1 ring-current shadow-xs`
                : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Resmi EBA & MEB Portalları</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konu veya ünite ara..."
            className={`py-1.5 pl-8 pr-3 rounded-xl border text-xs focus:outline-none focus:ring-1 ${themeConfig.inputBg}`}
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* VIEW 1: SİZİN İÇİN ÖNERİLEN KONULAR ({currentGrade}. Sınıf)       */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400">★ Önerilen Müfredat:</span>
              <span className={themeConfig.textSecondary}>
                {GRADE_NAMES[currentGrade]} MEB & EBA Haftalık Ders Dağılımı
              </span>
            </div>
            <span className={`text-[11px] ${themeConfig.textMuted}`}>
              {recommendedTopics.length} Öncelikli Ünite
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(searchQuery ? filteredTopics.filter((t) => t.grade === currentGrade) : recommendedTopics).map((top: GradeCurriculumTopic) => (
              <div
                key={top.id}
                id={`recommended-topic-${top.id}`}
                className={`p-5 rounded-2xl border-2 transition-all border-emerald-500/30 ${themeConfig.surface} shadow-xs flex flex-col justify-between hover:border-emerald-500/60`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {top.subject} • {top.grade}. Sınıf
                    </span>
                    <span className="text-[10px] font-mono opacity-50">{top.ebaLinkCode}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-current">{top.unitTitle}</h3>
                    <p className="text-xs font-semibold text-emerald-400/90 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{top.examRelevance}</span>
                    </p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] uppercase font-bold opacity-60">Alt Konular:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {top.keyTopics.map((k, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-md border bg-black/5 dark:bg-white/5 ${themeConfig.border}`}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-opacity-20">
                  <button
                    id={`ask-recommended-${top.id}`}
                    onClick={() =>
                      onSelectTopicForChat(
                        `${top.grade}. Sınıf ${top.subject} dersi '${top.unitTitle}' konusunu EBA kazanımlarına ve sınavda çıkan soru tiplerine göre bana en sade ve akılda kalıcı şekilde anlatır mısın?`
                      )
                    }
                    className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${themeConfig.surfaceActive} hover:scale-[1.01]`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AtlasAI'a Bu Konuyu Sor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* VIEW 2: DİĞER KADEMELERİ KEŞFET (10, 11, 12. Sınıf / YKS)          */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'explore_all' && (
        <div className="space-y-4">
          {/* Sub-selector for Explore Grade */}
          <div className={`p-4 rounded-2xl border space-y-3 ${themeConfig.surface} ${themeConfig.border}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-current">İleri Sınıf Müfredatlarını İncele:</h4>
                <p className={`text-[11px] ${themeConfig.textMuted}`}>
                  9. sınıfta olsanız bile gelecekteki 10, 11 ve 12. sınıf AYT/YKS konularını serbestçe keşfedebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['10', '11', '12'] as GradeLevel[]).map((g) => {
                  const isSelected = exploredGrade === g;
                  return (
                    <button
                      key={g}
                      id={`explore-grade-btn-${g}`}
                      onClick={() => setExploredGrade(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? `${themeConfig.surfaceActive} ring-1 ring-current shadow-xs`
                          : 'opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {GRADE_NAMES[g]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(searchQuery ? filteredTopics.filter((t) => t.grade === exploredGrade) : otherGradeTopics).map((top: GradeCurriculumTopic) => (
              <div
                key={top.id}
                id={`explore-topic-${top.id}`}
                className={`p-5 rounded-2xl border transition-all ${themeConfig.surface} ${themeConfig.border} shadow-xs flex flex-col justify-between hover:border-current/40`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {top.subject} • {top.grade}. Sınıf
                    </span>
                    <span className="text-[10px] font-mono opacity-50">{top.ebaLinkCode}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-current">{top.unitTitle}</h3>
                    <p className="text-xs font-semibold text-purple-400 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{top.examRelevance}</span>
                    </p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] uppercase font-bold opacity-60">Kazanımlar:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {top.keyTopics.map((k, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-md border bg-black/5 dark:bg-white/5 ${themeConfig.border}`}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-opacity-20 flex gap-2">
                  <button
                    id={`ask-explore-${top.id}`}
                    onClick={() =>
                      onSelectTopicForChat(
                        `${top.grade}. Sınıf konusu olan '${top.unitTitle}' hakkında şimdiden temel fikir edinmek istiyorum. Temel mantığını bana lise seviyesinde anlatır mısın?`
                      )
                    }
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${themeConfig.surfaceActive}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Konuyu Sor</span>
                  </button>
                  <button
                    onClick={() => onSelectGrade(top.grade)}
                    title="Bu sınıfı aktif sınıfım yap"
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${themeConfig.surfaceHover}`}
                  >
                    Kademem Yap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* VIEW 3: RESMİ EBA & MEB PORTALLARI                                 */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'official_portals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EBA_CURRICULUM_RESOURCES.map((res: EbaResourceGuide) => (
            <div
              key={res.id}
              id={`resource-card-${res.id}`}
              className={`p-5 rounded-2xl border transition-all ${themeConfig.surface} ${themeConfig.border} hover:border-current/40 shadow-xs flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${themeConfig.badge}`}>
                    {res.category}
                  </span>
                  <span className="text-[11px] font-mono opacity-60">{res.linkHint}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-current">{res.title}</h3>
                  <p className="text-xs font-medium text-emerald-400 mt-0.5">Kaynak: {res.source}</p>
                </div>

                <p className={`text-xs leading-relaxed ${themeConfig.textMuted}`}>
                  {res.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold opacity-70">Öne Çıkan Başlıklar:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {res.keyTopics.map((top, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-md border bg-black/10 dark:bg-white/10 ${themeConfig.border}`}
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-opacity-30">
                <button
                  id={`ask-ai-resource-${res.id}`}
                  onClick={() =>
                    onSelectTopicForChat(
                      `${res.title} kapsamındaki en kritik EBA kazanımlarını ve ${currentGrade}. sınıf seviyesinde çıkabilecek soru tiplerini bana anlatır mısın?`
                    )
                  }
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${themeConfig.surfaceActive} hover:scale-[1.01]`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AtlasAI'a Bu Kaynağı Sor</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
