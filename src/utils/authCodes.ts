import { AccountTier, UserProfileState } from '../types';

export const VALID_OWNER_CODES = [
  'ASAF-DEV-2026',
  'ATLAS-FOUNDER-PRO',
  'KURUCU-ASAF-77',
  'DEVELOPER-VIP',
  'ATLAS-OWNER-VIP'
];

const STORAGE_KEY = 'atlas_user_profile_v1';

export function isOwnerCode(code: string): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase().replace(/[\s\-_]+/g, '');
  return VALID_OWNER_CODES.some((valid) => valid.replace(/[\s\-_]+/g, '') === clean);
}

export function getStoredUserProfile(): UserProfileState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read user profile from storage', e);
  }
  return {
    tier: 'free',
  };
}

export function saveStoredUserProfile(profile: UserProfileState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not save user profile to storage', e);
  }
}

export function verifyAndActivateOwnerCode(code: string): { success: boolean; message: string; tier: AccountTier } {
  const trimmed = code.trim();
  if (isOwnerCode(trimmed)) {
    const canonicalCode = 'KURUCU-ASAF-77';
    const profile: UserProfileState = {
      tier: 'developer_owner',
      ownerCodeEntered: trimmed.toUpperCase(),
      ownerName: 'Ahmet Asaf Aykaç (Kurucu & Baş Geliştirici)',
      activatedAt: Date.now(),
    };
    saveStoredUserProfile(profile);
    return {
      success: true,
      message: 'Tebrikler Ahmet Asaf! Özel Kurucu & Baş Geliştirici (VIP) statünüz kalıcı olarak aktif edildi. Tüm limitler ve ücretler sınırsız olarak kaldırıldı.',
      tier: 'developer_owner',
    };
  }

  return {
    success: false,
    message: 'Geçersiz kod! Lütfen "KURUCU-ASAF-77" veya "ASAF-DEV-2026" kodunuzu kontrol ediniz.',
    tier: 'free',
  };
}
