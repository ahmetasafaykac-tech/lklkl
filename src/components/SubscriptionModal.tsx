import React, { useState } from 'react';
import { ThemeColor, SupportedLanguage } from '../types';
import { translations } from '../translations';
import { THEME_CONFIGS } from '../utils/theme';
import { soundEffects } from '../utils/soundEffects';
import {
  Sparkles,
  Check,
  ShieldCheck,
  CreditCard,
  X,
  Zap,
  Lock,
  Clock
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscribed: boolean;
  onToggleSubscription: (active: boolean) => void;
  theme: ThemeColor;
  language: SupportedLanguage;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  isSubscribed,
  onToggleSubscription,
  theme,
  language,
}) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const t = translations[language] || translations.tr;
  const themeConfig = THEME_CONFIGS[theme];

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onToggleSubscription(true);
      soundEffects.playCompletionFanfare();
      onClose();
    }, 900);
  };

  const handleCancel = () => {
    onToggleSubscription(false);
    onClose();
  };

  return (
    <div id="subscription-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="subscription-modal-dialog"
        className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl overflow-hidden ${themeConfig.surface} ${themeConfig.borderStrong}`}
      >
        <button
          id="close-sub-modal-btn"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-all ${themeConfig.border} ${themeConfig.surfaceHover}`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">{t.subscriptionPlan}</h2>
          <p className={`text-xs ${themeConfig.textMuted}`}>
            Türkiye EBA kaynakları, anlık empati motoru ve bilişsel odak asistanı ile sınırsız başarı.
          </p>
          
          <div className="py-2">
            <div className="inline-flex items-baseline gap-1.5 px-4 py-2 rounded-2xl bg-black/10 dark:bg-white/10 border border-opacity-30">
              <span className="text-3xl font-extrabold text-current">$4</span>
              <span className="text-xs uppercase tracking-wider opacity-70">/ Aylık Abonelik</span>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="my-6 space-y-2.5">
          {t.subscriptionPerks.map((perk, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={themeConfig.textSecondary}>{perk}</span>
            </div>
          ))}
        </div>

        {/* Card Demo / Activation */}
        <div className={`p-4 rounded-2xl border mb-6 text-xs space-y-3 bg-black/5 dark:bg-white/5 ${themeConfig.border}`}>
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-current" />
              <span>Güvenli Ödeme Doğrulaması</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <Lock className="w-3 h-3" /> 256-Bit SSL
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl border bg-black/10 dark:bg-white/10">
            <span className="font-mono text-xs opacity-80">{cardNumber}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
              Onaylı Kart
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] opacity-70">
            <span>Yenileme: Her ay $4</span>
            <span>İstediğiniz an iptal edilebilir</span>
          </div>
        </div>

        {/* Action Button */}
        {isSubscribed ? (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-center font-bold text-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.subscriptionActive}</span>
            </div>
            <button
              id="cancel-sub-btn"
              onClick={handleCancel}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold opacity-70 hover:opacity-100 transition-all ${themeConfig.surfaceHover}`}
            >
              Aboneliği Durdur
            </button>
          </div>
        ) : (
          <button
            id="confirm-subscribe-btn"
            onClick={handleSubscribe}
            disabled={processing}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${themeConfig.primaryButton}`}
          >
            {processing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>İşleniyor...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>{t.subscribeNow}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
