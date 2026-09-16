export type ThemeColor = 'siyah' | 'beyaz' | 'mor' | 'kirmizi';

export type SupportedLanguage = 
  | 'tr' // Türkçe
  | 'en' // English
  | 'de' // Deutsch
  | 'fr' // Français
  | 'es' // Español
  | 'ar' // العربية
  | 'ru' // Русский
  | 'ja' // 日本語
  | 'ko' // 한국어
  | 'it'; // Italiano

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export type SubjectId = 
  | 'genel'
  | 'matematik'
  | 'fizik'
  | 'kimya'
  | 'biyoloji'
  | 'turkce'
  | 'tarih'
  | 'cografya'
  | 'felsefe'
  | 'ingilizce'
  | 'dinkulturu'
  | 'fenbilimleri'
  | 'sosyalbilgiler'
  | 'hayatbilgisi';

export interface SubjectItem {
  id: SubjectId;
  name: string;
  category: string;
  iconName: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  subject?: SubjectId;
  detectedEmotion?: string;
  isVoicePlaying?: boolean;
  sources?: string[];
}

export interface UserEmotionContext {
  mood: 'normal' | 'yorucu' | 'stresli' | 'merakli' | 'heyecanli' | 'kaygili';
  label: string;
  hint: string;
}

export interface AttentionTestResult {
  completed: boolean;
  score: number; // 0 - 100
  passedThreshold: boolean; // >= 85
  averageReactionTimeMs: number;
  correctHits: number;
  totalTrials: number;
  evaluatedAt: number;
}

export interface FocusExerciseResult {
  hits: number;
  misses: number;
  falseAlarms: number;
  averageReactionMs: number;
  fastestReactionMs: number;
  accuracy: number;
  streak: number;
}

export type GradeLevel = 
  | '1' 
  | '2' 
  | '3' 
  | '4' 
  | '5' 
  | '6' 
  | '7' 
  | '8' 
  | '9' 
  | '10' 
  | '11' 
  | '12' 
  | 'mezun';

export interface StickmanCharacter {
  id: string;
  isTarget: boolean;
  hatColor: string;
  hatColorName: string;
  bodyColor: string;
  bodyColorName: string;
  hasHat: boolean;
  description: string;
}

export type FocusDurationSeconds = 30 | 90 | 300 | 600 | 900 | 1200;

export interface FocusDurationConfig {
  seconds: FocusDurationSeconds;
  label: string;
  shortLabel: string;
  description: string;
  speedMode: 'super_fast' | 'fast' | 'standard' | 'deep' | 'endurance' | 'marathon';
  stimulusExposureMs: number;
  intervalMinMs: number;
  intervalMaxMs: number;
}

export type AccountTier = 'free' | 'pro' | 'developer_owner';

export type VoiceGender = 'kiz' | 'erkek';

export interface BotVoice {
  id: string;
  name: string;
  gender: VoiceGender;
  isPro: boolean;
  role: string;
  pitch: number;
  rate: number;
  description: string;
  samplePhrase: string;
}

export interface UserProfileState {
  tier: AccountTier;
  ownerCodeEntered?: string;
  ownerName?: string;
  activatedAt?: number;
}
