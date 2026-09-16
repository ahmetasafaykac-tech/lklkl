import { SupportedLanguage, BotVoice } from '../types';

export const BOT_VOICES: BotVoice[] = [
  // 5 ÜCRETSİZ (BEDAVA) SES: 3 Kız, 2 Erkek
  {
    id: 'elif-kiz-free',
    name: 'Elif',
    gender: 'kiz',
    isPro: false,
    role: 'Şefkatli Rehber Öğretmen',
    pitch: 1.15,
    rate: 0.98,
    description: 'Sıcak, tane tane ve motive edici rehber öğretmen tonu.',
    samplePhrase: 'Merhaba! Ben Elif Öğretmen. Bugün seninle birlikte çalışmak için sabırsızlanıyorum.'
  },
  {
    id: 'kerem-erkek-free',
    name: 'Kerem',
    gender: 'erkek',
    isPro: false,
    role: 'Dost Canlısı Akran Mentor',
    pitch: 0.92,
    rate: 1.0,
    description: 'Samimi, arkadaş canlısı ve sade anlatımlı çalışma arkadaşı.',
    samplePhrase: 'Selam! Ben Kerem. Bu konuyu birlikte adım adım kolayca halledeceğiz, hiç merak etme!'
  },
  {
    id: 'defne-kiz-free',
    name: 'Defne',
    gender: 'kiz',
    isPro: false,
    role: 'Sakin & Akademik Anlatıcı',
    pitch: 1.08,
    rate: 0.95,
    description: 'Dengeli, duru ve karmaşık kavramları basitleştiren ses.',
    samplePhrase: 'Hoş geldin. Ben Defne. Zihnini toparla, önemli noktaları birlikte not alalım.'
  },
  {
    id: 'tolga-erkek-free',
    name: 'Tolga',
    gender: 'erkek',
    isPro: false,
    role: 'Sabırlı & Net Hoca',
    pitch: 0.88,
    rate: 0.96,
    description: 'Otoriter ama yumuşak, temelleri net inşa eden deneyimli hoca.',
    samplePhrase: 'İyi dersler genç dostum. Ben Tolga Hoca. Soruları adım adım mantığıyla çözelim.'
  },
  {
    id: 'asli-kiz-free',
    name: 'Aslı',
    gender: 'kiz',
    isPro: false,
    role: 'Neşeli & Pozitif Asistan',
    pitch: 1.22,
    rate: 1.03,
    description: 'Canlı, enerjisi yüksek ve odaklanmayı kolaylaştıran genç anlatım.',
    samplePhrase: 'Süper bir gün! Ben Aslı. Hadi başlayalım, yapabileceğine inancım tam!'
  },

  // 5 PRO (PARALI / VIP) SES: 2 Kız, 3 Erkek (Toplam: 5 Kız, 5 Erkek)
  {
    id: 'zeynep-kiz-pro',
    name: 'Zeynep (VIP)',
    gender: 'kiz',
    isPro: true,
    role: 'Ultra Doğal Stüdyo & Koç',
    pitch: 1.12,
    rate: 0.98,
    description: 'Stüdyo kalitesinde, derin diksiyonlu ve yüksek odaklı VIP ses.',
    samplePhrase: 'Merhabalar. Ben Zeynep. Yüksek potansiyelini başarıya dönüştürmek için buradayım.'
  },
  {
    id: 'burak-erkek-pro',
    name: 'Burak (VIP)',
    gender: 'erkek',
    isPro: true,
    role: 'Karizmatik Radyo & Podcast',
    pitch: 0.82,
    rate: 0.96,
    description: 'Derin bas tonlu, etkileyici ve akılda kalıcılığı artıran ses.',
    samplePhrase: 'Selamlar. Ben Burak. Sınavlarda fark yaratacak taktikleri şimdi masaya yatırıyoruz.'
  },
  {
    id: 'selin-kiz-pro',
    name: 'Selin (VIP)',
    gender: 'kiz',
    isPro: true,
    role: 'Bilişsel Bilim & Sınav Koçu',
    pitch: 1.18,
    rate: 1.02,
    description: 'Analitik, hızlı kavratan ve beyin fırtınası yaptıran profesyonel ton.',
    samplePhrase: 'Hoş geldin! Ben Selin. Zihnini en yüksek verime ayarladık, hazırsan başlıyoruz!'
  },
  {
    id: 'emre-erkek-pro',
    name: 'Emre (VIP)',
    gender: 'erkek',
    isPro: true,
    role: 'Felsefi & Sakinleştirici',
    pitch: 0.85,
    rate: 0.92,
    description: 'Sınav stresini azaltan, huzurlu ve derin kavrayış sağlayan anlatım.',
    samplePhrase: 'Derin bir nefes al. Ben Emre. Sakin kalırsan her sorunun bir çözümü olduğunu göreceksin.'
  },
  {
    id: 'kaan-erkek-pro',
    name: 'Kaan (VIP)',
    gender: 'erkek',
    isPro: true,
    role: 'Hızlı Soru & Taktik Ustası',
    pitch: 0.95,
    rate: 1.06,
    description: 'Pratik ipuçları veren, seri ve hedefe odaklı derece koçu.',
    samplePhrase: 'Vakit kaybetmiyoruz! Ben Kaan. En kısa formüller ve kritik püf noktalarıyla ilerliyoruz!'
  }
];

export function getStoredVoiceId(): string {
  if (typeof window === 'undefined') return 'elif-kiz-free';
  return localStorage.getItem('atlas_selected_voice_id') || 'elif-kiz-free';
}

export function saveStoredVoiceId(voiceId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas_selected_voice_id', voiceId);
    window.dispatchEvent(new CustomEvent('atlas_voice_changed', { detail: voiceId }));
  }
}

export function getBotVoice(id?: string): BotVoice {
  const targetId = id || getStoredVoiceId();
  return BOT_VOICES.find((v) => v.id === targetId) || BOT_VOICES[0];
}

const LANG_LOCALE_MAP: Record<SupportedLanguage, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  ar: 'ar-SA',
  ru: 'ru-RU',
  ja: 'ja-JP',
  ko: 'ko-KR',
  it: 'it-IT',
};

export class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  private findBestVoice(langLocale: string, preferredGender?: 'kiz' | 'erkek'): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const langPrefix = langLocale.slice(0, 2);
    const matchingVoices = this.voices.filter(
      (v) => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
    );

    if (matchingVoices.length === 0) return null;

    if (preferredGender === 'kiz') {
      const femaleCandidate = matchingVoices.find((v) => {
        const n = v.name.toLowerCase();
        return (
          n.includes('female') ||
          n.includes('kadin') ||
          n.includes('suna') ||
          n.includes('yelda') ||
          n.includes('filiz') ||
          n.includes('emel') ||
          n.includes('zira') ||
          n.includes('deniz') ||
          n.includes('samantha') ||
          n.includes('victoria') ||
          n.includes('karen') ||
          n.includes('google türkçe')
        );
      });
      if (femaleCandidate) return femaleCandidate;
    } else if (preferredGender === 'erkek') {
      const maleCandidate = matchingVoices.find((v) => {
        const n = v.name.toLowerCase();
        return (
          n.includes('male') ||
          n.includes('erkek') ||
          n.includes('tolga') ||
          n.includes('cem') ||
          n.includes('ahmet') ||
          n.includes('david') ||
          n.includes('george') ||
          n.includes('stefan') ||
          n.includes('daniel')
        );
      });
      if (maleCandidate) return maleCandidate;
    }

    // Prioritize natural / neural / modern high quality voices
    const naturalVoice = matchingVoices.find(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Neural') ||
        v.name.includes('Google') ||
        v.name.includes('Tolga') ||
        v.name.includes('Emel') ||
        v.name.includes('Cem')
    );

    return naturalVoice || matchingVoices[0];
  }

  speak(
    text: string,
    lang: SupportedLanguage,
    onEnd?: () => void,
    onError?: () => void,
    customVoiceId?: string
  ) {
    if (!this.synth) return;
    this.stop();

    const botVoice = getBotVoice(customVoiceId);

    // Clean text for a fluid, human conversational cadence
    const cleanText = text
      .replace(/[#*`_~\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\$[^$]+\$/g, ' formülü ') // speak math formulas smoothly
      .replace(/•/g, ', ')
      .replace(/\n+/g, '. ')
      .replace(/:\s+/g, ': ')
      .replace(/([0-9]+)\. sınıf/gi, '$1 inci sınıf')
      .slice(0, 1000); // speak up to 1000 characters for fluid latency

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const locale = LANG_LOCALE_MAP[lang] || 'tr-TR';
    utterance.lang = locale;

    // Apply voice-specific pitch and rate personality
    utterance.rate = botVoice.rate;
    utterance.pitch = botVoice.pitch;

    const bestVoice = this.findBestVoice(locale, botVoice.gender);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  speakSample(botVoice: BotVoice, lang: SupportedLanguage = 'tr', onEnd?: () => void) {
    this.speak(botVoice.samplePhrase, lang, onEnd, undefined, botVoice.id);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}

export const speechManager = new SpeechManager();

export function createSpeechRecognition(
  lang: SupportedLanguage,
  onResult: (text: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } | null {
  if (typeof window === 'undefined') return null;

  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRec) {
    return null;
  }

  const recognition = new SpeechRec();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = LANG_LOCALE_MAP[lang] || 'tr-TR';

  recognition.onresult = (event: any) => {
    const transcript = event.results?.[0]?.[0]?.transcript || '';
    if (transcript) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event);
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.warn('SpeechRecognition stop error:', e);
      }
    },
  };
}
