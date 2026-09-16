import React, { useState, useEffect } from 'react';
import {
  ThemeColor,
  SupportedLanguage,
  SubjectId,
  GradeLevel,
  UserProfileState
} from './types';
import { translations } from './translations';
import { THEME_CONFIGS } from './utils/theme';
import { ThemeSelector } from './components/ThemeSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { GradeSelector } from './components/GradeSelector';
import { SubjectBar } from './components/SubjectBar';
import { ChatSection } from './components/ChatSection';
import { AttentionFocusModule } from './components/AttentionFocusModule';
import { EbaResourcesModal } from './components/EbaResourcesModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SettingsModal } from './components/SettingsModal';
import { getStoredUserProfile } from './utils/authCodes';
import {
  Brain,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Zap,
  ShieldCheck,
  Target,
  Settings,
  Crown
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<ThemeColor>('siyah');
  const [language, setLanguage] = useState<SupportedLanguage>('tr');
  const [activeTab, setActiveTab] = useState<'chat' | 'focus' | 'eba'>('chat');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('9');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('genel');
  const [userProfile, setUserProfile] = useState<UserProfileState>(() => getStoredUserProfile());
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    const profile = getStoredUserProfile();
    return profile.tier === 'developer_owner';
  });
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState<boolean>(true);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  const t = translations[language] || translations.tr;
  const themeConfig = THEME_CONFIGS[theme];
  const isOwner = userProfile.tier === 'developer_owner';

  useEffect(() => {
    const handleProfileUpdate = () => {
      const p = getStoredUserProfile();
      setUserProfile(p);
      if (p.tier === 'developer_owner') {
        setIsSubscribed(true);
      }
    };
    window.addEventListener('atlas_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('atlas_profile_updated', handleProfileUpdate);
  }, []);

  const handleSelectTopicFromEba = (prompt: string) => {
    setExternalPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div 
      id="atlas-ai-root" 
      className={`min-h-screen transition-colors duration-300 ${themeConfig.bgMain} flex flex-col font-sans selection:bg-emerald-500/30`}
    >
      {/* Top Main Navigation Header - Simplified, Clean and Modern */}
      <header className={`border-b transition-colors duration-200 sticky top-0 z-40 backdrop-blur-md ${themeConfig.surface} ${themeConfig.borderStrong}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border flex items-center justify-center ${themeConfig.surfaceActive} ${isOwner ? 'ring-1 ring-amber-500/50' : ''}`}>
              <Brain className="w-5 h-5 text-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">
                  {t.appName}
                </span>
                {isOwner ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3" /> KURUCU
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${themeConfig.badge}`}>
                    v2.5 AI
                  </span>
                )}
              </div>
              <p className={`text-[11px] hidden sm:block ${themeConfig.textMuted}`}>
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Controls: Streamlined & Clean */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Theme Color Picker */}
            <ThemeSelector
              currentTheme={theme}
              onSelectTheme={setTheme}
              title={t.themeTitle}
            />

            {/* Subscription / VIP Status Button */}
            {isOwner ? (
              <button
                id="header-owner-badge-btn"
                onClick={() => setSettingsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 transition-all shadow-xs"
                title="Kurucu & Geliştirici Ayarları"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Kurucu Pro</span>
                <span className="sm:hidden">VIP</span>
              </button>
            ) : (
              <button
                id="header-subscription-btn"
                onClick={() => setSubscriptionModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                  isSubscribed
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500'
                    : `${themeConfig.primaryButton}`
                }`}
              >
                {isSubscribed ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pro Aktif</span>
                    <span className="sm:hidden">Pro</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>$4 / Ay</span>
                  </>
                )}
              </button>
            )}

            {/* Dedicated Settings Button */}
            <button
              id="header-settings-btn"
              onClick={() => setSettingsModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${themeConfig.surfaceActive} hover:opacity-90`}
              title="Sistem ve Arayüz Ayarları"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Ayarlar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation & Subject Quick Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-opacity-30 flex items-center justify-between gap-4 overflow-x-auto">
          <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
            <button
              id="tab-btn-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'chat'
                  ? `${themeConfig.activeTabBg}`
                  : `${themeConfig.textMuted} hover:text-current`
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.chatTab}</span>
            </button>

            <button
              id="tab-btn-focus"
              onClick={() => setActiveTab('focus')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'focus'
                  ? `${themeConfig.activeTabBg}`
                  : `${themeConfig.textMuted} hover:text-current`
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{t.focusTab}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>

            <button
              id="tab-btn-eba"
              onClick={() => setActiveTab('eba')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'eba'
                  ? `${themeConfig.activeTabBg}`
                  : `${themeConfig.textMuted} hover:text-current`
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t.ebaTab} ({currentGrade}. Sınıf)</span>
            </button>

            {/* Ayarlar Sekmesi (Tabs içine eklendi) */}
            <button
              id="tab-btn-settings"
              onClick={() => setSettingsModalOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${themeConfig.textMuted} hover:text-current hover:bg-black/5 dark:hover:bg-white/5`}
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ayarlar & VIP</span>
              {isOwner && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  👑 Kurucu
                </span>
              )}
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-xs font-medium opacity-80">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aktif: {currentGrade}. Sınıf</span>
            </span>
            <span className="opacity-40">|</span>
            <span>Doğal İnsansı Ses Aktif</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-4">
        {/* Subject Selection Pill Bar (shown on chat tab) */}
        {activeTab === 'chat' && (
          <SubjectBar
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            theme={theme}
          />
        )}

        {/* Tab Views */}
        {activeTab === 'chat' && (
          <ChatSection
            theme={theme}
            language={language}
            selectedSubject={selectedSubject}
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
            autoVoiceEnabled={autoVoiceEnabled}
            onToggleAutoVoice={() => setAutoVoiceEnabled(!autoVoiceEnabled)}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={() => setExternalPrompt(null)}
          />
        )}

        {activeTab === 'focus' && (
          <AttentionFocusModule
            theme={theme}
            language={language}
            onBackToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'eba' && (
          <EbaResourcesModal
            theme={theme}
            language={language}
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
            onSelectTopicForChat={handleSelectTopicFromEba}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 text-xs ${themeConfig.surface} ${themeConfig.border} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold">AtlasAI</span>
            <span className="opacity-40">•</span>
            <span className={themeConfig.textMuted}>
              MEB Talim ve Terbiye Kurulu & EBA Kazanımları ile Bütünleşik
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] opacity-75">
            <span>Tema: <strong>{THEME_CONFIGS[theme].name}</strong></span>
            <span>{currentGrade}. Sınıf Müfredatı</span>
            <span>10 Dil</span>
            <button 
              onClick={() => setSubscriptionModalOpen(true)}
              className="underline hover:opacity-100"
            >
              {isSubscribed ? 'Abonelik: Pro ($4/Ay)' : '$4 Abonelik Detayları'}
            </button>
          </div>
        </div>
      </footer>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        isSubscribed={isSubscribed}
        onToggleSubscription={setIsSubscribed}
        theme={theme}
        language={language}
      />

      {/* Settings & Admin VIP Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        theme={theme}
        onSelectTheme={setTheme}
        language={language}
        onSelectLanguage={setLanguage}
        userProfile={userProfile}
        onUpdateUserProfile={(newProfile) => {
          setUserProfile(newProfile);
          if (newProfile.tier === 'developer_owner') {
            setIsSubscribed(true);
          }
        }}
        autoVoiceEnabled={autoVoiceEnabled}
        onToggleAutoVoice={() => setAutoVoiceEnabled(!autoVoiceEnabled)}
      />
    </div>
  );
}
