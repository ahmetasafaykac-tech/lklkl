import React, { useState, useEffect, useRef } from 'react';
import {
  ThemeColor,
  SupportedLanguage,
  SubjectId,
  ChatMessage,
  GradeLevel
} from '../types';
import { translations } from '../translations';
import { THEME_CONFIGS } from '../utils/theme';
import { speechManager, createSpeechRecognition } from '../utils/speech';
import { QUICK_SAMPLE_PROMPTS, GRADE_NAMES } from '../data/curriculumData';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Heart,
  Smile,
  AlertCircle,
  Coffee,
  HelpCircle,
  Flame,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

import { GradeSelectDropdown } from './GradeSelectDropdown';
import { isOwnerCode, verifyAndActivateOwnerCode } from '../utils/authCodes';
import { soundEffects } from '../utils/soundEffects';

interface ChatSectionProps {
  theme: ThemeColor;
  language: SupportedLanguage;
  selectedSubject: SubjectId;
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  autoVoiceEnabled: boolean;
  onToggleAutoVoice: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  theme,
  language,
  selectedSubject,
  currentGrade,
  onSelectGrade,
  autoVoiceEnabled,
  onToggleAutoVoice,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const t = translations[language] || translations.tr;
  const themeConfig = THEME_CONFIGS[theme];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Merhaba! Ben **AtlasAI**, Türkiye MEB ve EBA müfredatına tam uyumlu yeni nesil eğitim yapay zekanım.\n\nŞu anda **${GRADE_NAMES[currentGrade] || currentGrade + '. Sınıf'}** seviyesine ayarlıyım. Yukarıdaki açılır menüden sınıfını 1. sınıftan 12. sınıfa kadar istediğin an değiştirebilirsin.\n\nDakika başı aynı şeyleri tekrarlamadan; anlık yorgunluğunu, sınav stresini veya merakını hissedip ona göre konuşurum. Hangi ders veya konuyla başlayalım?`,
      timestamp: Date.now(),
      detectedEmotion: 'İçten & Pedagojik',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // User momentary state selector
  const [currentMood, setCurrentMood] = useState<'normal' | 'yorucu' | 'stresli' | 'merakli' | 'kaygili'>('normal');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle external prompt if coming from EBA resources
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  // Setup Speech Recognition
  useEffect(() => {
    const rec = createSpeechRecognition(
      language,
      (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    recognitionRef.current = rec;
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor olabilir.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleGradeChangeFromChat = (grade: GradeLevel) => {
    onSelectGrade(grade);
    const confirmationText = `${grade}. Sınıf kademesine geçiş yapıldı. Müfredat ve pedagojik açıklamalar artık ${grade}. Sınıf EBA kazanımları referans alınarak sunulacak.`;
    const noticeMsg: ChatMessage = {
      id: `grade-switch-${Date.now()}`,
      role: 'assistant',
      content: confirmationText,
      timestamp: Date.now(),
      detectedEmotion: 'Müfredat Güncellendi',
    };
    setMessages((prev) => [...prev, noticeMsg]);
    if (autoVoiceEnabled) {
      speechManager.speak(confirmationText, language);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      subject: selectedSubject,
      detectedEmotion: currentMood,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // If user typed the founder/developer VIP code directly in chat!
    if (isOwnerCode(query)) {
      verifyAndActivateOwnerCode(query);
      soundEffects.playCompletionFanfare();
      const founderMsg: ChatMessage = {
        id: `assistant-founder-${Date.now()}`,
        role: 'assistant',
        content: `👑 **KURUCU & BAŞ GELİŞTİRİCİ KODU BAŞARIYLA DOĞRULANDI!**\n\nHoş geldin **Ahmet Asaf**!\n\nGirdiğin kod (**${query.toUpperCase()}**) başarıyla tanındı ve hesabın kalıcı olarak **👑 Kurucu Pro (VIP)** seviyesine yükseltildi:\n\n- ✨ **Ömür Boyu Sınırsız VIP**: Aylık $4 abonelik ücreti ve tüm kullanım kısıtlamaları kaldırıldı.\n- ⚡ **Yüksek Öncelikli Yapay Zeka Çekirdeği**: En hızlı model hattı üzerinden kesintisiz öğrenme.\n- ⚙️ **Merkezi Ayarlar**: Yukarıdaki **"⚙️ Ayarlar"** sekmesinden temayı, dilleri, ses motorunu ve dışa aktarma seçeneklerini anında yönetebilirsin.\n\nAtlasAI seni selamlıyor Kurucu! Bugün hangi konu veya proje üzerinde çalışalım?`,
        timestamp: Date.now(),
        detectedEmotion: '👑 Kurucu Onaylandı',
      };
      setMessages([...newMessages, founderMsg]);
      window.dispatchEvent(new CustomEvent('atlas_profile_updated'));
      return;
    }

    setLoading(true);

    try {
      const moodDescriptions: Record<string, string> = {
        normal: 'Dengeli ve öğrenmeye odaklı',
        yorucu: 'Zihinsel olarak yorgun, dinlenmeye ve net hap bilgilere ihtiyacı var',
        stresli: 'Sınav veya ders konusunda yüksek stresli, rahatlatıcı ve özgüven aşılayıcı bir tona ihtiyacı var',
        merakli: 'Yüksek enerjili ve meraklı, detaylı derinleştirmeye açık',
        kaygili: 'Yapamamaktan korkan kaygılı ruh hali, adım adım destek gerek',
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          subject: selectedSubject,
          grade: currentGrade,
          language,
          userMood: moodDescriptions[currentMood],
        }),
      });

      const data = await res.json();
      const replyContent = data.text || 'Özür dilerim, yanıt alınamadı.';

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: Date.now(),
        subject: selectedSubject,
        detectedEmotion: data.detectedEmotion || 'Duygusal Uyumlu',
      };

      setMessages((prev) => [...prev, botMsg]);

      // If auto-voice is enabled, speak out with humanized voice
      if (autoVoiceEnabled) {
        setSpeakingMessageId(botMsg.id);
        speechManager.speak(
          replyContent,
          language,
          () => setSpeakingMessageId(null),
          () => setSpeakingMessageId(null)
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Bağlantı sırasında bir aksaklık oldu. Lütfen tekrar deneyin.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const playMessageVoice = (msgId: string, content: string) => {
    if (speakingMessageId === msgId) {
      speechManager.stop();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msgId);
      speechManager.speak(
        content,
        language,
        () => setSpeakingMessageId(null),
        () => setSpeakingMessageId(null)
      );
    }
  };

  return (
    <div id="chat-section-container" className="flex flex-col h-[calc(100vh-17rem)] min-h-[520px] max-w-4xl mx-auto w-full">
      {/* Grade Level Fast Switch & Momentary Emotion Status Bar */}
      <div className={`p-2.5 mb-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${themeConfig.surface} ${themeConfig.border}`}>
        {/* Grade selector openable dropdown */}
        <div className="flex items-center gap-2">
          <GradeSelectDropdown
            currentGrade={currentGrade}
            onSelectGrade={handleGradeChangeFromChat}
            theme={theme}
            variant="chat"
          />
        </div>

        {/* Emotion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse ml-1" />
          {[
            { id: 'normal', label: t.moodCalm, icon: Smile, color: 'text-emerald-400' },
            { id: 'stresli', label: t.moodStressed, icon: AlertCircle, color: 'text-amber-400' },
            { id: 'yorucu', label: t.moodTired, icon: Coffee, color: 'text-blue-400' },
            { id: 'merakli', label: t.moodCurious, icon: Flame, color: 'text-purple-400' },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = currentMood === m.id;
            return (
              <button
                key={m.id}
                id={`mood-btn-${m.id}`}
                onClick={() => setCurrentMood(m.id as any)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? `${themeConfig.surfaceActive} font-bold ring-1 ring-current`
                    : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3 h-3 ${m.color}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auto Voice Toggle */}
        <button
          id="toggle-auto-voice-btn"
          onClick={onToggleAutoVoice}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
            autoVoiceEnabled
              ? `${themeConfig.badge} font-semibold`
              : 'opacity-60 hover:opacity-100'
          }`}
          title="Doğal İnsansı Sesli Yanıt"
        >
          {autoVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{autoVoiceEnabled ? 'Sesli Yanıt: Açık' : 'Sesli Yanıt: Kapalı'}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className={`flex-1 overflow-y-auto p-4 rounded-2xl border space-y-4 scrollbar-thin ${themeConfig.surface} ${themeConfig.borderStrong}`}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${themeConfig.surfaceActive}`}>
                  <Bot className="w-4 h-4 text-current" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 space-y-2 ${
                isUser
                  ? `${themeConfig.primaryButton} shadow-md`
                  : `border ${themeConfig.surface} ${themeConfig.border} shadow-xs text-current`
              }`}>
                {/* Header info */}
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-70">
                  <span className="font-semibold">{isUser ? 'Siz' : 'AtlasAI'}</span>
                  <div className="flex items-center gap-2">
                    {msg.detectedEmotion && (
                      <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-medium">
                        {msg.detectedEmotion}
                      </span>
                    )}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Message text */}
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                  {msg.content}
                </div>

                {/* In first message: Quick interactive grade selector pills for direct onboarding */}
                {index === 0 && !isUser && (
                  <div className="p-3 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 mt-2 space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Sınıfınızı Seçin:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['9', '10', '11', '12'] as GradeLevel[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => handleGradeChangeFromChat(g)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                            currentGrade === g
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-extrabold shadow-xs'
                              : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                          }`}
                        >
                          {g}. Sınıf {g === '9' ? '(Sizin İçin)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speaker play button for bot messages */}
                {!isUser && (
                  <div className="flex items-center justify-between pt-1 border-t border-opacity-20 text-[10px]">
                    <span className="opacity-60 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>EBA & Anlık Empati Destekli</span>
                    </span>

                    <button
                      onClick={() => playMessageVoice(msg.id, msg.content)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border transition-all ${
                        isSpeaking
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold animate-pulse'
                          : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>{t.stopVoice}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>İnsansı Sesle Dinle</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${themeConfig.surfaceActive}`}>
                  <User className="w-4 h-4 text-current" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-xs">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${themeConfig.surfaceActive}`}>
              <Bot className="w-4 h-4 text-current animate-spin" />
            </div>
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${themeConfig.surface} ${themeConfig.border}`}>
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
              <span className={`text-[11px] ml-1 ${themeConfig.textMuted}`}>
                {currentGrade}. Sınıf EBA müfredatı taranıyor, anlık duygunuz çözümleniyor...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts tailored to current grade */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        <span className={`text-[10px] uppercase font-bold flex-shrink-0 ${themeConfig.textMuted}`}>
          {currentGrade}. Sınıf Örnekleri:
        </span>
        {QUICK_SAMPLE_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            className={`whitespace-nowrap text-[11px] px-2.5 py-1 rounded-lg border transition-all ${themeConfig.surface} ${themeConfig.border} ${themeConfig.surfaceHover} text-left opacity-80 hover:opacity-100`}
          >
            {p.text.slice(0, 44)}...
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="relative pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              id="chat-message-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? t.listening : `${currentGrade}. Sınıf dersi sorusu sor veya hissettiklerini anlat...`}
              disabled={loading}
              className={`w-full py-3.5 pl-4 pr-12 rounded-2xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 shadow-xs ${themeConfig.inputBg}`}
            />

            {/* Mic Dictation Button */}
            <button
              type="button"
              id="voice-dictation-btn"
              onClick={toggleMic}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : `${themeConfig.textMuted} hover:text-current hover:bg-black/10 dark:hover:bg-white/10`
              }`}
              title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Soru Sor'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            id="chat-send-btn"
            disabled={loading || !inputText.trim()}
            className={`px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${themeConfig.primaryButton}`}
          >
            <span>{t.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
