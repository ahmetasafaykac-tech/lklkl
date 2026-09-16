import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ThemeColor,
  SupportedLanguage,
  StickmanCharacter,
  FocusDurationSeconds,
  FocusDurationConfig,
} from '../types';
import { translations } from '../translations';
import { THEME_CONFIGS } from '../utils/theme';
import { soundEffects } from '../utils/soundEffects';
import { TARGET_STICKMAN, DISTRACTOR_STICKMEN } from '../data/stickmanData';
import { StickmanFigure } from './StickmanFigure';
import {
  Brain,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Pause,
  StopCircle,
  Flame,
  Check,
  ChevronRight
} from 'lucide-react';

interface AttentionFocusModuleProps {
  theme: ThemeColor;
  language: SupportedLanguage;
  onBackToChat: () => void;
}

type Phase = 
  | 'pre_intro'
  | 'pre_testing'
  | 'pre_result'
  | 'drill_intro'
  | 'drill_active'
  | 'drill_completed';

export const FOCUS_DURATIONS: FocusDurationConfig[] = [
  {
    seconds: 30,
    label: '30 Saniye',
    shortLabel: '30 sn',
    description: 'Süper Hızlı / Yıldırım Refleks',
    speedMode: 'super_fast',
    stimulusExposureMs: 700,
    intervalMinMs: 400,
    intervalMaxMs: 750,
  },
  {
    seconds: 90,
    label: '1.5 Dakika',
    shortLabel: '1.5 dk',
    description: 'Hızlı Odak & Anlık Kalibrasyon',
    speedMode: 'fast',
    stimulusExposureMs: 820,
    intervalMinMs: 500,
    intervalMaxMs: 900,
  },
  {
    seconds: 300,
    label: '5 Dakika',
    shortLabel: '5 dk',
    description: 'Standart Dikkat & Ders Öncesi Odak',
    speedMode: 'standard',
    stimulusExposureMs: 920,
    intervalMinMs: 600,
    intervalMaxMs: 1100,
  },
  {
    seconds: 600,
    label: '10 Dakika',
    shortLabel: '10 dk',
    description: 'Derin Konsantrasyon & Zihin Arınması',
    speedMode: 'deep',
    stimulusExposureMs: 900,
    intervalMinMs: 650,
    intervalMaxMs: 1150,
  },
  {
    seconds: 900,
    label: '15 Dakika',
    shortLabel: '15 dk',
    description: 'Gelişmiş Zihinsel Dayanıklılık (Sınav Kondisyonu)',
    speedMode: 'endurance',
    stimulusExposureMs: 880,
    intervalMinMs: 600,
    intervalMaxMs: 1100,
  },
  {
    seconds: 1200,
    label: '20 Dakika',
    shortLabel: '20 dk',
    description: 'Maraton Bilişsel Performans',
    speedMode: 'marathon',
    stimulusExposureMs: 850,
    intervalMinMs: 600,
    intervalMaxMs: 1100,
  },
];

export const AttentionFocusModule: React.FC<AttentionFocusModuleProps> = ({
  theme,
  language,
  onBackToChat,
}) => {
  const t = translations[language] || translations.tr;
  const themeConfig = THEME_CONFIGS[theme];

  const [phase, setPhase] = useState<Phase>('pre_intro');

  // Selected duration configuration
  const [selectedDuration, setSelectedDuration] = useState<FocusDurationConfig>(FOCUS_DURATIONS[1]); // Default 1.5 dk

  // Pre-test states
  const [preTestRound, setPreTestRound] = useState(0);
  const [preTestCharacter, setPreTestCharacter] = useState<StickmanCharacter | null>(null);
  const [preTestVisible, setPreTestVisible] = useState(false);
  const [preTestScore, setPreTestScore] = useState<number | null>(null);
  const [preTestHits, setPreTestHits] = useState(0);
  const [preTestReactionTimes, setPreTestReactionTimes] = useState<number[]>([]);
  const [preTestFeedback, setPreTestFeedback] = useState<string | null>(null);

  // Drill states
  const [drillRound, setDrillRound] = useState(0);
  const [drillCharacter, setDrillCharacter] = useState<StickmanCharacter | null>(null);
  const [drillVisible, setDrillVisible] = useState(false);
  const [drillHits, setDrillHits] = useState(0);
  const [drillMisses, setDrillMisses] = useState(0);
  const [drillFalseAlarms, setDrillFalseAlarms] = useState(0);
  const [drillReactionTimes, setDrillReactionTimes] = useState<number[]>([]);
  const [drillStreak, setDrillStreak] = useState(0);
  const [drillFeedback, setDrillFeedback] = useState<{ type: 'hit' | 'miss' | 'early'; text: string; ms?: number } | null>(null);

  // Timer states
  const [remainingSeconds, setRemainingSeconds] = useState<number>(90);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Timing references
  const appearanceTimeRef = useRef<number>(0);
  const hasRespondedRef = useRef<boolean>(false);
  const roundTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stimulusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupTimers = () => {
    if (roundTimeoutRef.current) clearTimeout(roundTimeoutRef.current);
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  useEffect(() => {
    return () => cleanupTimers();
  }, []);

  // Pick either target or distractor
  const pickRandomStickman = (targetProbability: number = 0.5): StickmanCharacter => {
    if (Math.random() < targetProbability) {
      return TARGET_STICKMAN;
    }
    const randomIndex = Math.floor(Math.random() * DISTRACTOR_STICKMEN.length);
    return DISTRACTOR_STICKMEN[randomIndex];
  };

  // ------------------------------------------------------------------------
  // STAGE 1: PRE-TEST (Giriş Değerlendirme Testi)
  // ------------------------------------------------------------------------
  const TOTAL_PRETEST_TRIALS = 8;

  const startPreTest = () => {
    cleanupTimers();
    setPreTestRound(0);
    setPreTestHits(0);
    setPreTestReactionTimes([]);
    setPreTestFeedback(null);
    setPreTestScore(null);
    setPhase('pre_testing');
    scheduleNextPreTestTrial(1);
  };

  const scheduleNextPreTestTrial = (roundNum: number) => {
    if (roundNum > TOTAL_PRETEST_TRIALS) {
      finishPreTest();
      return;
    }

    setPreTestRound(roundNum);
    setPreTestVisible(false);
    hasRespondedRef.current = false;

    // Random inter-stimulus interval (700ms - 1300ms)
    const interval = Math.floor(Math.random() * 600) + 700;

    roundTimeoutRef.current = setTimeout(() => {
      // 55% chance of target
      const char = pickRandomStickman(0.55);
      setPreTestCharacter(char);
      setPreTestVisible(true);
      appearanceTimeRef.current = Date.now();

      // Exposure window 950ms
      stimulusTimeoutRef.current = setTimeout(() => {
        setPreTestVisible(false);
        if (char.isTarget && !hasRespondedRef.current) {
          setPreTestFeedback('Hedef Kaçırıldı!');
        }
        setTimeout(() => scheduleNextPreTestTrial(roundNum + 1), 400);
      }, 950);
    }, interval);
  };

  const handlePreTestResponse = useCallback(() => {
    if (phase !== 'pre_testing' || !preTestVisible || hasRespondedRef.current) return;
    hasRespondedRef.current = true;
    const reactionTime = Date.now() - appearanceTimeRef.current;

    if (preTestCharacter && preTestCharacter.isTarget) {
      soundEffects.playSuccessHit();
      setPreTestHits((prev) => prev + 1);
      setPreTestReactionTimes((prev) => [...prev, reactionTime]);
      setPreTestFeedback(`Doğru Refleks! ${reactionTime} ms`);
    } else {
      soundEffects.playErrorSound();
      setPreTestFeedback(`Hatalı Basış! Yanıltıcı Çubuk Adam`);
    }
  }, [phase, preTestVisible, preTestCharacter]);

  const finishPreTest = () => {
    cleanupTimers();
    setPreTestVisible(false);

    setPreTestReactionTimes((times) => {
      setPreTestHits((hits) => {
        const avgReaction = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 800;
        const accuracyPct = (hits / (TOTAL_PRETEST_TRIALS * 0.65)) * 100;
        const speedBonus = Math.max(0, Math.min(40, (700 - avgReaction) / 10));
        let calculatedScore = Math.round(Math.min(100, Math.max(35, accuracyPct * 0.6 + 20 + speedBonus)));
        if (hits >= 5 && avgReaction < 450) {
          calculatedScore = Math.max(86, calculatedScore);
        }
        setPreTestScore(calculatedScore);
        if (calculatedScore >= 85) {
          soundEffects.playCompletionFanfare();
        }
        return hits;
      });
      return times;
    });

    setPhase('pre_result');
  };

  // ------------------------------------------------------------------------
  // STAGE 2: FOCUS DRILL LOGIC (With User Duration & Speed Choices)
  // ------------------------------------------------------------------------
  const startDrill = (durationCfg: FocusDurationConfig = selectedDuration) => {
    cleanupTimers();
    setSelectedDuration(durationCfg);
    setRemainingSeconds(durationCfg.seconds);
    setIsPaused(false);
    setDrillRound(0);
    setDrillHits(0);
    setDrillMisses(0);
    setDrillFalseAlarms(0);
    setDrillReactionTimes([]);
    setDrillStreak(0);
    setDrillFeedback(null);
    setPhase('drill_active');

    // Start 1-second countdown clock
    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          finishDrill();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Schedule the first trial
    scheduleNextDrillTrial(1, durationCfg);
  };

  const scheduleNextDrillTrial = (roundNum: number, config: FocusDurationConfig = selectedDuration) => {
    setDrillRound(roundNum);
    setDrillVisible(false);
    hasRespondedRef.current = false;

    // Inter-stimulus interval based on speed mode
    const intervalRange = config.intervalMaxMs - config.intervalMinMs;
    const interval = Math.floor(Math.random() * intervalRange) + config.intervalMinMs;

    roundTimeoutRef.current = setTimeout(() => {
      // 50% chance target, 50% tricky distractors (purple body + blue hat etc.)
      const char = pickRandomStickman(0.5);
      setDrillCharacter(char);
      setDrillVisible(true);
      appearanceTimeRef.current = Date.now();

      // Exposure window based on duration mode (e.g. 700ms in super fast, 920ms in standard)
      stimulusTimeoutRef.current = setTimeout(() => {
        setDrillVisible(false);
        if (char.isTarget && !hasRespondedRef.current) {
          // Missed target
          soundEffects.playErrorSound();
          setDrillMisses((m) => m + 1);
          setDrillStreak(0);
          setDrillFeedback({ type: 'miss', text: t.missed });
        }
        // Next trial after brief pause
        setTimeout(() => scheduleNextDrillTrial(roundNum + 1, config), 300);
      }, config.stimulusExposureMs);
    }, interval);
  };

  const handleDrillResponse = useCallback(() => {
    if (phase !== 'drill_active' || isPaused) return;

    if (!drillVisible) {
      // Pressed before stimulus appears: false alarm
      soundEffects.playErrorSound();
      setDrillFalseAlarms((fa) => fa + 1);
      setDrillStreak(0);
      setDrillFeedback({ type: 'early', text: 'Çok erken! Karakter ekranda yoktu.' });
      return;
    }

    if (hasRespondedRef.current) return;
    hasRespondedRef.current = true;

    const reactionTime = Date.now() - appearanceTimeRef.current;

    if (drillCharacter && drillCharacter.isTarget) {
      // Correct target hit!
      soundEffects.playSuccessHit();
      setDrillHits((h) => h + 1);
      setDrillStreak((s) => s + 1);
      setDrillReactionTimes((times) => [...times, reactionTime]);
      setDrillFeedback({ type: 'hit', text: 'Doğru Hedef!', ms: reactionTime });
    } else {
      // False alarm on distractor!
      soundEffects.playErrorSound();
      setDrillFalseAlarms((fa) => fa + 1);
      setDrillStreak(0);
      setDrillFeedback({ 
        type: 'early', 
        text: `Tuzak! ${drillCharacter?.description || 'Hedef değildi'}` 
      });
    }
  }, [phase, isPaused, drillVisible, drillCharacter]);

  const finishDrill = () => {
    cleanupTimers();
    setDrillVisible(false);
    soundEffects.playCompletionFanfare();
    setPhase('drill_completed');
  };

  // Keyboard Space listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (phase === 'pre_testing') {
          handlePreTestResponse();
        } else if (phase === 'drill_active') {
          handleDrillResponse();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handlePreTestResponse, handleDrillResponse]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const avgDrillReaction = drillReactionTimes.length > 0 
    ? Math.round(drillReactionTimes.reduce((a, b) => a + b, 0) / drillReactionTimes.length)
    : 0;

  const fastestDrillReaction = drillReactionTimes.length > 0
    ? Math.min(...drillReactionTimes)
    : 0;

  const totalTrialsCount = Math.max(1, drillHits + drillMisses + drillFalseAlarms);
  const drillAccuracy = Math.round((drillHits / totalTrialsCount) * 100);

  // Time progress percentage
  const totalDurationSecs = selectedDuration.seconds;
  const timeProgressPct = Math.min(100, Math.max(0, ((totalDurationSecs - remainingSeconds) / totalDurationSecs) * 100));

  return (
    <div id="attention-focus-module" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border ${themeConfig.surface} ${themeConfig.borderStrong} shadow-lg relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-64 h-32 bg-gradient-to-l ${themeConfig.highlightGlow} pointer-events-none`} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-xl border ${themeConfig.surfaceActive}`}>
              <Brain className="w-6 h-6 text-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{t.focusTitle}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${themeConfig.badge}`}>
                  Çubuk Adam Protokolü
                </span>
              </div>
              <p className={`text-xs mt-1 ${themeConfig.textMuted}`}>{t.focusDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {phase === 'drill_active' ? (
              <button
                id="stop-early-btn"
                onClick={finishDrill}
                className="px-3.5 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Egzersizi Bitir</span>
              </button>
            ) : (
              <button
                id="back-to-chat-btn"
                onClick={onBackToChat}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${themeConfig.surfaceHover} ${themeConfig.textSecondary}`}
              >
                ← {t.backToChat}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STAGE 1: PRE-TEST INTRO WITH CHARACTER SPOTLIGHT */}
      {/* ------------------------------------------------------------- */}
      {phase === 'pre_intro' && (
        <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-6 ${themeConfig.surface} ${themeConfig.borderStrong} shadow-xl`}>
          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">{t.preTestIntro}</h3>
            <p className={`text-sm leading-relaxed ${themeConfig.textSecondary}`}>
              {t.preTestRule}
            </p>
          </div>

          {/* TARGET SPOTLIGHT CARD */}
          <div className="max-w-lg mx-auto p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-3 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              🎯 HEDEF KARAKTERİNİZ:
            </span>
            <div className="flex justify-center py-2">
              <StickmanFigure character={TARGET_STICKMAN} size={150} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-emerald-400">
                Mavi Şapkalı & Yeşil Bedenli Çubuk Adam
              </div>
              <p className={`text-xs ${themeConfig.textMuted}`}>
                Sadece bu karakter ekrana geldiğinde <strong>[Space / Boşluk]</strong> tuşuna basacaksınız.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="start-pretest-btn"
              onClick={startPreTest}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${themeConfig.primaryButton}`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.startPreTestBtn}</span>
            </button>

            {/* Quick jump to custom drill durations */}
            <button
              id="jump-to-durations-btn"
              onClick={() => setPhase('drill_intro')}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-semibold transition-all ${themeConfig.surfaceHover} ${themeConfig.textSecondary}`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
              <span>Süreli Egzersize Doğrudan Geç ({selectedDuration.label})</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 1: ACTIVE PRE-TEST */}
      {/* ------------------------------------------------------------- */}
      {phase === 'pre_testing' && (
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeConfig.surface} ${themeConfig.borderStrong} shadow-xl`}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Ön Değerlendirme Testi
            </span>
            <span className="font-bold opacity-75">
              Tur: {preTestRound} / {TOTAL_PRETEST_TRIALS}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${themeConfig.primaryButton}`}
              style={{ width: `${(preTestRound / TOTAL_PRETEST_TRIALS) * 100}%` }}
            />
          </div>

          {/* Stimulus Canvas Area */}
          <div 
            onClick={handlePreTestResponse}
            className={`cursor-pointer select-none h-72 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all ${
              preTestVisible ? 'border-zinc-500 bg-black/5 dark:bg-white/5' : 'border-zinc-800 bg-black/5'
            }`}
          >
            {preTestVisible && preTestCharacter ? (
              <div className="animate-in zoom-in-75 duration-75">
                <StickmanFigure character={preTestCharacter} size={160} />
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-50">
                <div className="w-3.5 h-3.5 rounded-full bg-current mx-auto animate-ping" />
                <span className="text-xs font-medium tracking-wide">Odaklanın...</span>
              </div>
            )}

            {preTestFeedback && (
              <div className="absolute bottom-3 font-semibold text-xs px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white">
                {preTestFeedback}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              id="pretest-space-btn"
              onClick={handlePreTestResponse}
              className={`w-full py-4 rounded-xl text-sm font-bold border transition-all active:scale-[0.98] ${themeConfig.surfaceActive}`}
            >
              [ BOŞLUK (SPACE) TUŞUNA BAS VEYA BURAYA TIKLA ]
            </button>
            <p className={`text-[11px] text-center ${themeConfig.textMuted}`}>
              İpucu: Klavyenizdeki <strong>Space (Boşluk)</strong> tuşunu kullanabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 1: PRE-TEST RESULT */}
      {/* ------------------------------------------------------------- */}
      {phase === 'pre_result' && preTestScore !== null && (
        <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-6 ${themeConfig.surface} ${themeConfig.borderStrong} shadow-2xl`}>
          {preTestScore >= 85 ? (
            <div className="space-y-5">
              <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {t.testPassedTitle}
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight">
                  Dikkat Skoru: %{preTestScore}
                </h3>
                <p className={`text-sm max-w-lg mx-auto ${themeConfig.textSecondary}`}>
                  {t.testPassedDesc.replace('%{score}', String(preTestScore))}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-300 font-bold text-base max-w-lg mx-auto shadow-inner">
                ✨ {t.testPassedNoNeed}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="passed-back-chat-btn"
                  onClick={onBackToChat}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${themeConfig.primaryButton}`}
                >
                  {t.backToChat}
                </button>
                <button
                  id="practice-anyway-btn"
                  onClick={() => setPhase('drill_intro')}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${themeConfig.surfaceHover} ${themeConfig.textSecondary}`}
                >
                  Süreli Antrenmanı Seç ({selectedDuration.label}) →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
                <AlertTriangle className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  Ön Değerlendirme Tamamlandı
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight">
                  Dikkat Skoru: %{preTestScore}
                </h3>
                <p className={`text-sm max-w-lg mx-auto ${themeConfig.textSecondary}`}>
                  {t.testFailedDesc}
                </p>
              </div>

              <button
                id="proceed-to-drill-btn"
                onClick={() => setPhase('drill_intro')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-[1.02] ${themeConfig.primaryButton}`}
              >
                <span>Antrenman Süresini Seç & Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 2: DRILL INTRO & DURATION / SPEED SELECTION */}
      {/* (User requested 30s, 1.5m, 5m, 10m, 15m, 20m choices!) */}
      {/* ------------------------------------------------------------- */}
      {phase === 'drill_intro' && (
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeConfig.surface} ${themeConfig.borderStrong} shadow-xl`}>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold">Odak Süresi & Hız Modunu Belirleyin</h3>
            <p className={`text-xs ${themeConfig.textMuted}`}>
              İhtiyacınıza göre hızlı refleks (30 sn), ders öncesi odak (5 dk) veya maraton (20 dk) modlarından birini seçin:
            </p>
          </div>

          {/* DURATION SELECTION GRID (6 OPTIONS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {FOCUS_DURATIONS.map((dur) => {
              const isSelected = selectedDuration.seconds === dur.seconds;
              return (
                <button
                  key={dur.seconds}
                  id={`duration-opt-${dur.seconds}`}
                  onClick={() => {
                    setSelectedDuration(dur);
                    soundEffects.playButtonTick();
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/10 font-bold'
                      : 'border-opacity-30 hover:border-opacity-80 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-extrabold text-emerald-400">{dur.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] font-semibold opacity-90">{dur.description}</div>
                  <div className="text-[10px] opacity-50 mt-1">
                    {dur.seconds === 30 ? '⚡ 700ms Uyaran' : dur.seconds <= 90 ? '⏱️ 820ms Uyaran' : '🎯 Standart Hız'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* VISUAL RULE COMPARISON CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
            {/* Target Character Card */}
            <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 space-y-1.5 text-center shadow-md">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                ✓ SADECE BUNA BAS!
              </span>
              <div className="flex justify-center py-1">
                <StickmanFigure character={TARGET_STICKMAN} size={110} />
              </div>
              <div className="text-xs font-extrabold text-emerald-300">
                Mavi Şapka + Yeşil Beden
              </div>
            </div>

            {/* Tricky Distractors Card */}
            <div className="p-3.5 rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 space-y-1.5 text-center">
              <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                ✗ TUZAKLAR! ASLA BASMA!
              </span>
              <div className="flex items-center justify-center gap-2 py-1">
                <StickmanFigure character={DISTRACTOR_STICKMEN[0]} size={80} />
                <StickmanFigure character={DISTRACTOR_STICKMEN[2]} size={80} />
                <StickmanFigure character={DISTRACTOR_STICKMEN[6]} size={80} />
              </div>
              <div className="text-xs font-bold text-rose-300">
                Mor Bedenli, Kırmızı Şapkalı veya Şapkasız
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              id="start-active-drill-btn"
              onClick={() => startDrill(selectedDuration)}
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${themeConfig.primaryButton}`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{selectedDuration.label} Odak Egzersizini Başlat</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 3: ACTIVE DRILL WITH COUNTDOWN & REACTION RECORDING */}
      {/* ------------------------------------------------------------- */}
      {phase === 'drill_active' && (
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeConfig.surface} ${themeConfig.borderStrong} shadow-2xl`}>
          {/* Top Live Dashboard: Live Countdown, Accuracy, Streak */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {/* COUNTDOWN TIMER */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center ${themeConfig.surfaceActive} border-emerald-500/40`}>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Kalan Zaman
              </span>
              <span className="text-2xl font-black font-mono tracking-tight text-emerald-400">
                {formatTime(remainingSeconds)}
              </span>
            </div>

            {/* HITS */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center ${themeConfig.surfaceActive}`}>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Doğru İsabet
              </span>
              <span className="text-2xl font-black">{drillHits}</span>
            </div>

            {/* STREAK */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center ${themeConfig.surfaceActive}`}>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3" /> Seri (Streak)
              </span>
              <span className="text-2xl font-black text-amber-400">{drillStreak}</span>
            </div>

            {/* ACCURACY */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center ${themeConfig.surfaceActive}`}>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                İsabet Oranı
              </span>
              <span className="text-2xl font-black text-blue-400">%{drillAccuracy}</span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${themeConfig.primaryButton}`}
              style={{ width: `${timeProgressPct}%` }}
            />
          </div>

          {/* Stimulus Canvas Area - PURE STICKMAN, NO SPOILER TEXT */}
          <div 
            onClick={handleDrillResponse}
            className={`cursor-pointer select-none h-80 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all ${
              drillVisible 
                ? 'border-zinc-500 bg-black/5 dark:bg-white/5' 
                : 'border-zinc-800 bg-black/5'
            }`}
          >
            {drillVisible && drillCharacter ? (
              <div className="animate-in zoom-in-75 duration-75">
                <StickmanFigure character={drillCharacter} size={175} />
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-50">
                <div className="w-3.5 h-3.5 rounded-full bg-current mx-auto animate-ping" />
                <span className="text-xs font-medium tracking-wide">
                  {selectedDuration.description} Devam Ediyor...
                </span>
              </div>
            )}

            {/* Temporary Micro Feedback */}
            {drillFeedback && (
              <div className={`absolute bottom-3 font-semibold text-xs px-4 py-1.5 rounded-full backdrop-blur-md shadow-md animate-in fade-in duration-100 ${
                drillFeedback.type === 'hit' 
                  ? 'bg-emerald-500/90 text-black font-extrabold' 
                  : 'bg-rose-500/90 text-white'
              }`}>
                {drillFeedback.text} {drillFeedback.ms ? `(${drillFeedback.ms} ms)` : ''}
              </div>
            )}
          </div>

          {/* Giant Touch Button for Space or Phone taps */}
          <div className="space-y-2">
            <button
              id="drill-space-btn"
              onClick={handleDrillResponse}
              className={`w-full py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-black border tracking-wider transition-all active:scale-[0.98] ${themeConfig.surfaceActive} hover:border-emerald-500`}
            >
              [ BOŞLUK (SPACE) TUŞUNA BAS VEYA BURAYA TIKLA ]
            </button>
            <div className="flex items-center justify-between text-[11px] opacity-65 px-1">
              <span>Hedef: Mavi Şapka + Yeşil Gövde</span>
              <span>Mod: {selectedDuration.label} ({selectedDuration.speedMode})</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 4: DRILL COMPLETED (Comprehensive Report) */}
      {/* ------------------------------------------------------------- */}
      {phase === 'drill_completed' && (
        <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-6 ${themeConfig.surface} ${themeConfig.borderStrong} shadow-2xl`}>
          <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {selectedDuration.label} Egzersizi Başarıyla Tamamlandı!
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Bilişsel Odak Raporu
            </h3>
            <p className={`text-sm max-w-lg mx-auto ${themeConfig.textSecondary}`}>
              Beyninizin dürtü kontrolü (Inhibition Control) ve hedef seçici dikkat refleksleri test edildi.
            </p>
          </div>

          {/* STATS MATRIX */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className={`p-4 rounded-xl border ${themeConfig.surfaceActive}`}>
              <div className="text-[11px] font-bold opacity-60">Doğru İsabet</div>
              <div className="text-2xl font-black text-emerald-400">{drillHits}</div>
            </div>
            <div className={`p-4 rounded-xl border ${themeConfig.surfaceActive}`}>
              <div className="text-[11px] font-bold opacity-60">Tuzak Alarmı (Hata)</div>
              <div className="text-2xl font-black text-rose-400">{drillFalseAlarms}</div>
            </div>
            <div className={`p-4 rounded-xl border ${themeConfig.surfaceActive}`}>
              <div className="text-[11px] font-bold opacity-60">Ortalama Reaksiyon</div>
              <div className="text-2xl font-black text-amber-400">{avgDrillReaction} ms</div>
            </div>
            <div className={`p-4 rounded-xl border ${themeConfig.surfaceActive}`}>
              <div className="text-[11px] font-bold opacity-60">En Hızlı Refleks</div>
              <div className="text-2xl font-black text-purple-400">{fastestDrillReaction || 0} ms</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs text-left max-w-lg mx-auto space-y-1.5">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Bilişsel Geri Bildirim:
            </div>
            <p className="opacity-90 leading-relaxed">
              {drillAccuracy >= 85
                ? 'Tebrikler! Dürtü kontrolünüz ve odak hızınız mükemmel. Sınavlarda ve ders çalışırken soru köklerini daha hızlı ve hatasız kavrayacaksınız.'
                : 'Antrenmanı tamamladınız. Düzenli olarak 5-10 dakikalık egzersizlerle zihinsel dalgalanmaları en aza indirebilir ve reaksiyon sürenizi 400 ms altına düşürebilirsiniz.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="drill-restart-btn"
              onClick={() => setPhase('drill_intro')}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl border text-xs font-semibold transition-all ${themeConfig.surfaceHover}`}
            >
              Farklı Süre Seç & Yeniden Başla
            </button>

            <button
              id="drill-finish-chat-btn"
              onClick={onBackToChat}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${themeConfig.primaryButton}`}
            >
              Ders Çalışmaya Dön (Sohbet) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
