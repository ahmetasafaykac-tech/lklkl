import { ThemeColor } from '../types';

export interface ThemeConfig {
  name: string;
  dotColor: string;
  swatch: string;
  bgMain: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primaryButton: string;
  primaryButtonText: string;
  badge: string;
  inputBg: string;
  activeTabBg: string;
  highlightGlow: string;
  focusAccent: string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeConfig> = {
  siyah: {
    name: 'Siyah',
    dotColor: '#18181b',
    swatch: 'bg-zinc-900 border-zinc-700',
    bgMain: 'bg-[#090a0f] text-zinc-100',
    surface: 'bg-[#12141c] border-zinc-800/80',
    surfaceHover: 'hover:bg-[#181a25]',
    surfaceActive: 'bg-[#1c1f2e] border-emerald-500/60 text-emerald-400',
    border: 'border-zinc-800',
    borderStrong: 'border-zinc-700',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-300',
    textMuted: 'text-zinc-500',
    primaryButton: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-emerald-950/40',
    primaryButtonText: 'text-zinc-950',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    inputBg: 'bg-[#0f1118] border-zinc-800 text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500/20',
    activeTabBg: 'bg-zinc-800 text-emerald-400 shadow-sm',
    highlightGlow: 'from-emerald-500/10 via-transparent to-transparent',
    focusAccent: 'text-emerald-400',
  },
  beyaz: {
    name: 'Beyaz',
    dotColor: '#ffffff',
    swatch: 'bg-slate-100 border-slate-300',
    bgMain: 'bg-slate-50 text-slate-900',
    surface: 'bg-white border-slate-200/90 shadow-xs',
    surfaceHover: 'hover:bg-slate-100/70',
    surfaceActive: 'bg-blue-50 border-blue-500 text-blue-700',
    border: 'border-slate-200',
    borderStrong: 'border-slate-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-blue-500/20',
    primaryButtonText: 'text-white',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    inputBg: 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20',
    activeTabBg: 'bg-blue-600 text-white shadow-xs',
    highlightGlow: 'from-blue-500/10 via-transparent to-transparent',
    focusAccent: 'text-blue-600',
  },
  mor: {
    name: 'Mor',
    dotColor: '#8b5cf6',
    swatch: 'bg-purple-900 border-purple-600',
    bgMain: 'bg-[#0d071a] text-purple-100',
    surface: 'bg-[#180e30] border-purple-900/60 shadow-xs',
    surfaceHover: 'hover:bg-[#231545]',
    surfaceActive: 'bg-[#291754] border-purple-400 text-purple-200',
    border: 'border-purple-900/50',
    borderStrong: 'border-purple-800/80',
    textPrimary: 'text-purple-100',
    textSecondary: 'text-purple-300',
    textMuted: 'text-purple-400/60',
    primaryButton: 'bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-purple-900/40',
    primaryButtonText: 'text-white',
    badge: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
    inputBg: 'bg-[#140b29] border-purple-900/60 text-purple-100 focus:border-purple-400 focus:ring-purple-500/20',
    activeTabBg: 'bg-purple-700 text-white shadow-sm',
    highlightGlow: 'from-purple-500/15 via-transparent to-transparent',
    focusAccent: 'text-purple-400',
  },
  kirmizi: {
    name: 'Kırmızı',
    dotColor: '#ef4444',
    swatch: 'bg-rose-900 border-rose-600',
    bgMain: 'bg-[#140507] text-rose-100',
    surface: 'bg-[#200a0e] border-rose-950/80 shadow-xs',
    surfaceHover: 'hover:bg-[#2c0e14]',
    surfaceActive: 'bg-[#361119] border-rose-500 text-rose-200',
    border: 'border-rose-950/60',
    borderStrong: 'border-rose-900/70',
    textPrimary: 'text-rose-100',
    textSecondary: 'text-rose-300',
    textMuted: 'text-rose-400/60',
    primaryButton: 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-rose-950/40',
    primaryButtonText: 'text-white',
    badge: 'bg-rose-950/80 text-rose-300 border-rose-900/60',
    inputBg: 'bg-[#1a070a] border-rose-950/80 text-rose-100 focus:border-rose-500 focus:ring-rose-500/20',
    activeTabBg: 'bg-rose-700 text-white shadow-sm',
    highlightGlow: 'from-rose-500/15 via-transparent to-transparent',
    focusAccent: 'text-rose-400',
  },
};
