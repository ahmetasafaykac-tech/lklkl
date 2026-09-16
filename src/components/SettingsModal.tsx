import React, { useState, useEffect } from 'react';
import {
  ThemeColor,
  SupportedLanguage,
  AccountTier,
  UserProfileState,
  BotVoice,
} from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import { translations } from '../translations';
import { soundEffects } from '../utils/soundEffects';
import { verifyAndActivateOwnerCode } from '../utils/authCodes';
import {
  BOT_VOICES,
  getStoredVoiceId,
  saveStoredVoiceId,
  speechManager,
} from '../utils/speech';
import {
  X,
  Settings,
  Crown,
  Palette,
  Globe,
  Volume2,
  VolumeX,
  Smartphone,
  Globe2,
  Check,
  Zap,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Download,
  Server,
  Play,
  Square,
  Lock,
  UserCheck,
  Laptop
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeColor;
  onSelectTheme: (theme: ThemeColor) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  userProfile: UserProfileState;
  onUpdateUserProfile: (profile: UserProfileState) => void;
  autoVoiceEnabled: boolean;
  onToggleAutoVoice: () => void;
}

type SettingsTab = 'auth' | 'appearance' | 'language' | 'voice' | 'mobile_web';

const LANGUAGES_LIST: { code: SupportedLanguage; name: string; nativeName: string; flag: string }[] = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  language,
  onSelectLanguage,
  userProfile,
  onUpdateUserProfile,
  autoVoiceEnabled,
  onToggleAutoVoice,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('auth');
  const [devCodeInput, setDevCodeInput] = useState('');
  const [devCodeStatus, setDevCodeStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => getStoredVoiceId());
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'kiz' | 'erkek' | 'free' | 'pro'>('all');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const themeConfig = THEME_CONFIGS[theme];
  const t = translations[language] || translations.tr;

  useEffect(() => {
    return () => {
      speechManager.stop();
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectVoice = (voice: BotVoice) => {
    if (voice.isPro && userProfile.tier === 'free') {
      soundEffects.playErrorSound();
      setVoiceNotice(`"${voice.name}" sesi Pro & Kurucu VIP üyeler içindir. 'Geliştirici & Üyelik' sekmesinden kodunu girebilir veya $4 Pro abonelik alabilirsin!`);
      return;
    }
    setSelectedVoiceId(voice.id);
    saveStoredVoiceId(voice.id);
    soundEffects.playSuccessHit();
    setVoiceNotice(null);
  };

  const handleTestVoice = (voice: BotVoice) => {
    if (playingVoiceId === voice.id) {
      speechManager.stop();
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voice.id);
      speechManager.speakSample(voice, language, () => {
        setPlayingVoiceId(null);
      });
    }
  };

  const handleActivateDevCode = (codeToTest?: string) => {
    const code = (codeToTest || devCodeInput).trim();
    if (!code) {
      setDevCodeStatus({ success: false, message: 'Lütfen özel geliştirici kodunuzu giriniz.' });
      return;
    }

    const res = verifyAndActivateOwnerCode(code);
    if (res.success) {
      soundEffects.playCompletionFanfare();
      setDevCodeStatus({ success: true, message: res.message });
      onUpdateUserProfile({
        tier: 'developer_owner',
        ownerCodeEntered: code.toUpperCase(),
        ownerName: 'Ahmet Asaf Aykaç (Kurucu & Baş Geliştirici)',
        activatedAt: Date.now(),
      });
    } else {
      soundEffects.playErrorSound();
      setDevCodeStatus({ success: false, message: res.message });
    }
  };

  const handleAutofillOwnerCode = () => {
    setDevCodeInput('KURUCU-ASAF-77');
    handleActivateDevCode('KURUCU-ASAF-77');
  };

  const isOwner = userProfile.tier === 'developer_owner';

  return (
    <div id="settings-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="settings-modal-dialog"
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${themeConfig.surface} ${themeConfig.borderStrong}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-opacity-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${themeConfig.surfaceActive}`}>
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Ayarlar & Yönetim</h2>
                {isOwner && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> KURUCU
                  </span>
                )}
              </div>
              <p className={`text-xs ${themeConfig.textMuted}`}>
                Geliştirici kodu, üyelik, temalar, diller ve mobil/web yayını
              </p>
            </div>
          </div>

          <button
            id="settings-close-btn"
            onClick={onClose}
            className={`p-2 rounded-xl border opacity-70 hover:opacity-100 transition-all ${themeConfig.surfaceHover}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-opacity-20 overflow-x-auto px-4 py-2 gap-1.5 shrink-0 bg-black/5 dark:bg-white/5">
          <button
            id="tab-settings-auth"
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'auth'
                ? `${themeConfig.activeTabBg} text-emerald-400 font-bold shadow-xs`
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Geliştirici & Üyelik</span>
          </button>

          <button
            id="tab-settings-appearance"
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'appearance'
                ? `${themeConfig.activeTabBg} text-emerald-400 font-bold shadow-xs`
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Arayüz Temaları</span>
          </button>

          <button
            id="tab-settings-language"
            onClick={() => setActiveTab('language')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'language'
                ? `${themeConfig.activeTabBg} text-emerald-400 font-bold shadow-xs`
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Dil (10 Dil)</span>
          </button>

          <button
            id="tab-settings-voice"
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'voice'
                ? `${themeConfig.activeTabBg} text-emerald-400 font-bold shadow-xs`
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Sesli Asistan</span>
          </button>

          <button
            id="tab-settings-mobile"
            onClick={() => setActiveTab('mobile_web')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mobile_web'
                ? `${themeConfig.activeTabBg} text-emerald-400 font-bold shadow-xs`
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-rose-400" />
            <span>Telefona Çıkarma & Web</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: AUTH & DEVELOPER OWNER CODE */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* SPECIAL OWNER CODE ACTIVATION CARD */}
              <div className="p-5 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                        Uygulama Sahibi & Geliştirici Lisansı
                      </h3>
                      <p className={`text-xs ${themeConfig.textMuted}`}>
                        Size özel gizli kodu girerek anında <strong>Geliştirici Pro (VIP)</strong> hesabına geçiş yapın.
                      </p>
                    </div>
                  </div>

                  {isOwner ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                      <ShieldCheck className="w-4 h-4" /> AKTİF
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold shrink-0">
                      ÖZEL ERİŞİM
                    </span>
                  )}
                </div>

                {isOwner ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Geliştirici & Kurucu Yetkisi Aktif</span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                      Sayın <strong>{userProfile.ownerName || 'Ahmet Asaf Aykaç'}</strong>; AtlasAI'nin tüm kurucu hakları, sınırsız yapay zeka işlemcisi, özel teşhis konsolu ve reklam/sınır muafiyeti hesabınıza tanımlandı.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-black/20 border border-emerald-500/30 text-emerald-400">
                        Kod: {userProfile.ownerCodeEntered || 'ASAF-DEV-2026'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/20 border border-emerald-500/30 text-emerald-400">
                        Yetki Seviyesi: Root / Owner
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-3.5 top-3 w-4 h-4 opacity-50" />
                        <input
                          id="dev-owner-code-input"
                          type="text"
                          value={devCodeInput}
                          onChange={(e) => setDevCodeInput(e.target.value)}
                          placeholder="Özel Kodunuzu Girin (örn: KURUCU-ASAF-77 veya ASAF-DEV-2026)"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 ${themeConfig.surface} ${themeConfig.border}`}
                        />
                      </div>
                      <button
                        id="activate-dev-code-btn"
                        onClick={() => handleActivateDevCode()}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-black" />
                        Kodu Aktif Et
                      </button>
                    </div>

                    {/* Quick Autofill button for the owner */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        id="quick-autofill-btn"
                        onClick={handleAutofillOwnerCode}
                        className="text-amber-400 underline font-semibold hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>👑 Kurucu Kodunu Otomatik Doldur (KURUCU-ASAF-77)</span>
                      </button>
                      <span className="text-[11px] opacity-50">Tek tıkla direkt aktifleşir</span>
                    </div>

                    {devCodeStatus && (
                      <div className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                        devCodeStatus.success 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      }`}>
                        {devCodeStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                        <span>{devCodeStatus.message}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STANDARD SUBSCRIPTION CARD ($4 / AY) */}
              <div className={`p-5 rounded-2xl border ${themeConfig.surface} ${themeConfig.border} space-y-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${themeConfig.surfaceActive}`}>
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Standart Öğrenci Pro Aboneliği</h4>
                      <p className={`text-xs ${themeConfig.textMuted}`}>Aylık $4 / Ay (Tüm EBA testleri, sınırsız soru çözümü)</p>
                    </div>
                  </div>

                  <span className="text-base font-extrabold text-emerald-400">
                    $4 <span className="text-xs font-normal opacity-70">/ Ay</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs opacity-80 pt-2 border-t border-opacity-20">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tüm MEB & EBA Çözümlü Sorular</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Doğal İnsansı Sesli Okuma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Çubuk Adam Dikkat Egzersizleri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1. Sınıftan 12. Sınıfa Tam Kapsam</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="toggle-pro-btn"
                    onClick={() => {
                      if (userProfile.tier === 'pro') {
                        onUpdateUserProfile({ tier: 'free' });
                      } else {
                        onUpdateUserProfile({ tier: 'pro' });
                        soundEffects.playCompletionFanfare();
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      userProfile.tier === 'pro'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                        : `${themeConfig.primaryButton}`
                    }`}
                  >
                    {userProfile.tier === 'pro' ? 'Aboneliği İptal Et / Ücretsiz Plana Geç' : 'Standart Pro Planı ($4) Başlat'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE & THEMES */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm">Arayüz Temasını Seçin</h3>
                <p className={`text-xs ${themeConfig.textMuted}`}>
                  Gözlerinizi yormayan ve odaklanmanızı kolaylaştıran 4 farklı renk paleti
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(['siyah', 'beyaz', 'mor', 'kirmizi'] as ThemeColor[]).map((thm) => {
                  const cfg = THEME_CONFIGS[thm];
                  const isSelected = theme === thm;

                  return (
                    <button
                      key={thm}
                      id={`theme-card-${thm}`}
                      onClick={() => {
                        onSelectTheme(thm);
                        soundEffects.playButtonTick();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/5'
                          : 'border-opacity-30 hover:border-opacity-80 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm shadow-xs ${cfg.swatch}`}>
                          {thm === 'siyah' ? '⬛' : thm === 'beyaz' ? '⬜' : thm === 'mor' ? '🟪' : '🟥'}
                        </span>
                        <div>
                          <div className="font-bold text-xs">{cfg.name}</div>
                          <div className="text-[11px] opacity-60">
                            {thm === 'siyah' ? 'AMOLED Koyu Mod' : thm === 'beyaz' ? 'Ferah Açık Mod' : thm === 'mor' ? 'Cyber Mor Gece' : 'Odak Kırmızı'}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LANGUAGE SELECTOR (10 DİL) */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm">Uygulama ve Asistan Dili</h3>
                <p className={`text-xs ${themeConfig.textMuted}`}>
                  Yapay zeka AtlasAI seçtiğiniz dilde akıcı ve yerel pedagojiyle konuşur
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {LANGUAGES_LIST.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      id={`lang-settings-${item.code}`}
                      onClick={() => {
                        onSelectLanguage(item.code);
                        soundEffects.playButtonTick();
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/10 font-bold'
                          : 'border-opacity-30 hover:border-opacity-80 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.flag}</span>
                        <div>
                          <div className="text-xs font-bold">{item.nativeName}</div>
                          <div className="text-[10px] opacity-60">{item.name}</div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VOICE SETTINGS - 10 BOT SESİ (5 BEDAVA, 5 PRO / 5 KIZ, 5 ERKEK) */}
          {activeTab === 'voice' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Bot Ses Karakterleri (10 Doğal İnsansı Ses)</span>
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    5 Kız • 5 Erkek | 5 Bedava • 5 Pro
                  </span>
                </div>
                <p className={`text-xs ${themeConfig.textMuted}`}>
                  AtlasAI her karakterde farklı ton, ritim ve pedagojik yaklaşım sergiler. İstediğin sesi dinleyip aktif edebilirsin.
                </p>
              </div>

              {/* Auto Speak Toggle */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 ${themeConfig.surfaceActive}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    {autoVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs">Yanıtları Otomatik Seslendir</div>
                    <div className="text-[11px] opacity-70">AtlasAI sohbet kutusunda cevap yazdığında seçtiğin sesle okusun</div>
                  </div>
                </div>

                <button
                  id="toggle-voice-auto-btn"
                  onClick={onToggleAutoVoice}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    autoVoiceEnabled ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      autoVoiceEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setVoiceFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    voiceFilter === 'all'
                      ? 'bg-emerald-500 text-black shadow-xs'
                      : 'border border-opacity-20 hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  Tümü (10)
                </button>
                <button
                  onClick={() => setVoiceFilter('kiz')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    voiceFilter === 'kiz'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'border border-opacity-20 hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  👧 Kız Sesleri (5)
                </button>
                <button
                  onClick={() => setVoiceFilter('erkek')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    voiceFilter === 'erkek'
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'border border-opacity-20 hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  👦 Erkek Sesleri (5)
                </button>
                <button
                  onClick={() => setVoiceFilter('free')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    voiceFilter === 'free'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-opacity-20 hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  🆓 Bedava Sesler (5)
                </button>
                <button
                  onClick={() => setVoiceFilter('pro')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    voiceFilter === 'pro'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'border border-opacity-20 hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  👑 Pro VIP (5)
                </button>
              </div>

              {/* Upgrade notice if free user tries Pro voice */}
              {voiceNotice && (
                <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs flex items-center justify-between gap-2 text-amber-300">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{voiceNotice}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('auth');
                      setVoiceNotice(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-[11px] shrink-0 hover:bg-amber-400"
                  >
                    Kodu Gir
                  </button>
                </div>
              )}

              {/* 10 Voices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {BOT_VOICES.filter((v) => {
                  if (voiceFilter === 'kiz') return v.gender === 'kiz';
                  if (voiceFilter === 'erkek') return v.gender === 'erkek';
                  if (voiceFilter === 'free') return !v.isPro;
                  if (voiceFilter === 'pro') return v.isPro;
                  return true;
                }).map((v) => {
                  const isSelected = selectedVoiceId === v.id;
                  const isPlaying = playingVoiceId === v.id;
                  const isLocked = v.isPro && !isOwner && userProfile.tier === 'free';

                  return (
                    <div
                      key={v.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/10 shadow-xs'
                          : `${themeConfig.surface} border-opacity-30 hover:border-opacity-60`
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                              v.gender === 'kiz' ? 'bg-pink-500/15 border border-pink-500/30' : 'bg-blue-500/15 border border-blue-500/30'
                            } ${isPlaying ? 'animate-bounce' : ''}`}>
                              {v.gender === 'kiz' ? '👧' : '👦'}
                            </div>
                            <div>
                              <div className="font-extrabold text-xs flex items-center gap-1.5">
                                <span>{v.name}</span>
                                {v.isPro ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                    👑 Pro
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                    🆓 Bedava
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] opacity-70 font-medium">{v.role}</div>
                            </div>
                          </div>

                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                            v.gender === 'kiz' ? 'text-pink-400 bg-pink-500/10' : 'text-blue-400 bg-blue-500/10'
                          }`}>
                            {v.gender === 'kiz' ? 'Kız' : 'Erkek'}
                          </span>
                        </div>

                        <p className="text-[11px] opacity-80 leading-relaxed">
                          {v.description}
                        </p>
                      </div>

                      {/* Action Buttons: Test Voice & Select */}
                      <div className="flex items-center gap-2 pt-1 border-t border-opacity-15">
                        <button
                          id={`test-voice-${v.id}`}
                          onClick={() => handleTestVoice(v)}
                          className={`flex-1 py-1.5 px-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-emerald-500 text-black border-emerald-500 animate-pulse'
                              : 'hover:bg-black/5 dark:hover:bg-white/5 border-opacity-30'
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>Durdur</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Dinle</span>
                            </>
                          )}
                        </button>

                        <button
                          id={`select-voice-${v.id}`}
                          onClick={() => handleSelectVoice(v)}
                          className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-black font-extrabold shadow-xs'
                              : isLocked
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
                              : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Aktif</span>
                            </>
                          ) : isLocked ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Pro Kilit</span>
                            </>
                          ) : (
                            <span>Seç</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: MOBILE APP & WEBSITE GUIDE (WINDOWS & STORE FOCUS) */}
          {activeTab === 'mobile_web' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  Telefona Çıkarma (Windows'tan Play Store & App Store)
                </h3>
                <p className={`text-xs ${themeConfig.textMuted}`}>
                  Windows bilgisayarınızı kullanarak AtlasAI uygulamasını sıfırdan Google Play Store ve Apple App Store'a yükleme rehberi.
                </p>
              </div>

              {/* ULTRA SIMPLE WINDOWS TO STORES GUIDE */}
              <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <Laptop className="w-4 h-4" />
                  <span>💻 Windows Bilgisayardan Google Play Store'a Yükleme (Adım Adım Basit Anlatım)</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-black/15 dark:bg-white/5 border border-opacity-20 space-y-1">
                    <strong className="text-emerald-300 font-bold">1. Adım: Bilgisayarına 2 Tane Ücretsiz Program Kur</strong>
                    <p className="text-[11px] opacity-85">
                      • <strong>Node.js</strong>: <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="underline text-emerald-400">nodejs.org</a> sitesine girip büyük yeşil butona basarak indir ve kur.<br />
                      • <strong>Android Studio</strong>: <a href="https://developer.android.com/studio" target="_blank" rel="noreferrer" className="underline text-emerald-400">developer.android.com/studio</a> sitesinden indir ve ileri ileri diyerek kur.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/15 dark:bg-white/5 border border-opacity-20 space-y-1">
                    <strong className="text-emerald-300 font-bold">2. Adım: Bu Projeyi Bilgisayarına İndir</strong>
                    <p className="text-[11px] opacity-85">
                      Google AI Studio ekranının sağ üst köşesindeki menüden (üç nokta) <strong>"Download ZIP"</strong> de. İnen zip dosyasını Masaüstüne sağ tıklayıp <strong>"Klasöre Ayıkla"</strong> de.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/15 dark:bg-white/5 border border-opacity-20 space-y-1">
                    <strong className="text-emerald-300 font-bold">3. Adım: Komut Satırını Açıp Bu Kodları Yapıştır</strong>
                    <p className="text-[11px] opacity-85">
                      Proje klasörünün içine gir, boş bir yere sağ tıklayıp <strong>"Terminalde Aç"</strong> (veya arama çubuğuna <code>cmd</code> yazıp Enter'a bas). Sırasıyla şu 3 komutu kopyalayıp yapıştır:
                    </p>
                    <div className="p-2.5 rounded-lg bg-black/50 font-mono text-[11px] text-emerald-400 space-y-1 mt-1.5">
                      <div>npm run build</div>
                      <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                      <div>npx cap init "AtlasAI" "com.atlasai.app"</div>
                      <div>npx cap add android</div>
                      <div>npx cap open android</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/15 dark:bg-white/5 border border-opacity-20 space-y-1">
                    <strong className="text-emerald-300 font-bold">4. Adım: Android Studio'dan Çıktıyı Al ve Play Store'a Yükle</strong>
                    <p className="text-[11px] opacity-85">
                      Android Studio kendiliğinden açılacak. Üst menüden <strong>Build {'>'} Generate Signed Bundle / APK</strong> seçeneğine tıkla. <strong>Android App Bundle (.aab)</strong> seçeneğini işaretle ve şifre oluşturup Bitir'e bas. Sana hazır bir <code>.aab</code> dosyası verecek. Bu dosyayı <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="underline text-emerald-400">Google Play Console</a> paneline yükleyerek yayınla!
                    </p>
                  </div>
                </div>
              </div>

              {/* WINDOWS TO APP STORE REALITY */}
              <div className="p-4 rounded-2xl border border-blue-500/40 bg-blue-500/5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-extrabold text-sm">
                  <span>🍎 Apple App Store'a Windows'tan Yükleme (Önemli Gerçek & Kolay Yolu)</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  Apple, güvenlik kuralları gereği Windows bilgisayarlardan doğrudan iPhone uygulaması derlenmesine izin vermez (Xcode programı sadece Mac'te çalışır). Ama Windows kullanırken bunu çözmenin <strong>2 çok kolay yolu</strong> vardır:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/15 dark:bg-white/5 border border-opacity-20 space-y-1">
                    <strong className="text-blue-300 font-bold">1. Yol (En Kolayı - Kodsuz): PWABuilder</strong>
                    <p className="text-[11px] opacity-80">
                      Microsoft'un resmi sitesi olan <a href="https://pwabuilder.com" target="_blank" rel="noreferrer" className="underline text-blue-400">pwabuilder.com</a> adresine gir. AtlasAI'nin canlı linkini kutuya yapıştır ve <strong>"Package for Stores"</strong> butonuna bas. Sana tek tıkla hem Play Store hem de App Store için hazır paket verir!
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/15 dark:bg-white/5 border border-opacity-20 space-y-1">
                    <strong className="text-blue-300 font-bold">2. Yol: Bir Arkadaşının Mac'ini Kullan</strong>
                    <p className="text-[11px] opacity-80">
                      Proje klasörünü bir flash bellekle Mac bilgisayarı olan bir arkadaşına ver, terminalde <code>npx cap open ios</code> yazsın, Xcode'da tek tıkla <strong>Archive {'>'} Distribute App</strong> diyerek Apple hesabına göndersin (sadece 5 dakika sürer).
                    </p>
                  </div>
                </div>
              </div>

              {/* METHOD 3: ZERO COST PWA */}
              <div className="p-3.5 rounded-2xl border border-opacity-20 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Download className="w-4 h-4" />
                  <span>Bonus: Mağazalara Gerek Kalmadan Telefona Yükleme (PWA - 0 TL)</span>
                </div>
                <p className="text-[11px] opacity-80">
                  Uygulamanın linkini telefonunda açıp Android'de <strong>"Ana Ekrana Ekle"</strong>, iPhone'da ise Paylaş butonundan <strong>"Ana Ekrana Ekle"</strong> dersen 1 saniye içinde telefonun menüsüne gerçek uygulama olarak yüklenir.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-opacity-20 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="text-xs opacity-60">
            {isOwner ? '👑 Kurucu Lisansı Aktif' : 'AtlasAI v2.5 Ayarlar'}
          </div>

          <button
            id="settings-done-btn"
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-bold ${themeConfig.primaryButton}`}
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
