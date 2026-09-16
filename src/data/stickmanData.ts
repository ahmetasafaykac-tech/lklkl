import { StickmanCharacter } from '../types';

export const TARGET_STICKMAN: StickmanCharacter = {
  id: 'target-blue-hat-green-body',
  isTarget: true,
  hatColor: '#2563EB', // Mavi Şapka
  hatColorName: 'Mavi',
  bodyColor: '#10B981', // Yeşil Gövde
  bodyColorName: 'Yeşil',
  hasHat: true,
  description: 'Mavi Şapkalı ve Yeşil Gövdeli Çubuk Adam',
};

export const DISTRACTOR_STICKMEN: StickmanCharacter[] = [
  {
    id: 'trick-blue-hat-purple-body',
    isTarget: false,
    hatColor: '#2563EB', // Mavi Şapka
    hatColorName: 'Mavi',
    bodyColor: '#A855F7', // Mor Gövde (Tuzak!)
    bodyColorName: 'Mor',
    hasHat: true,
    description: 'Mavi Şapkalı, Mor Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-purple-hat-green-body',
    isTarget: false,
    hatColor: '#A855F7', // Mor Şapka
    hatColorName: 'Mor',
    bodyColor: '#10B981', // Yeşil Gövde
    bodyColorName: 'Yeşil',
    hasHat: true,
    description: 'Mor Şapkalı, Yeşil Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-red-hat-green-body',
    isTarget: false,
    hatColor: '#EF4444', // Kırmızı Şapka
    hatColorName: 'Kırmızı',
    bodyColor: '#10B981', // Yeşil Gövde
    bodyColorName: 'Yeşil',
    hasHat: true,
    description: 'Kırmızı Şapkalı, Yeşil Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-blue-hat-red-body',
    isTarget: false,
    hatColor: '#2563EB', // Mavi Şapka
    hatColorName: 'Mavi',
    bodyColor: '#EF4444', // Kırmızı Gövde
    bodyColorName: 'Kırmızı',
    hasHat: true,
    description: 'Mavi Şapkalı, Kırmızı Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-yellow-hat-green-body',
    isTarget: false,
    hatColor: '#F59E0B', // Sarı/Turuncu Şapka
    hatColorName: 'Sarı',
    bodyColor: '#10B981', // Yeşil Gövde
    bodyColorName: 'Yeşil',
    hasHat: true,
    description: 'Sarı Şapkalı, Yeşil Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-blue-hat-yellow-body',
    isTarget: false,
    hatColor: '#2563EB', // Mavi Şapka
    hatColorName: 'Mavi',
    bodyColor: '#F59E0B', // Sarı Gövde
    bodyColorName: 'Sarı',
    hasHat: true,
    description: 'Mavi Şapkalı, Sarı Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-no-hat-green-body',
    isTarget: false,
    hatColor: '#000000',
    hatColorName: 'Yok',
    bodyColor: '#10B981', // Yeşil Gövde
    bodyColorName: 'Yeşil',
    hasHat: false, // Şapkasız!
    description: 'Şapkasız, Yeşil Gövdeli Çubuk Adam',
  },
  {
    id: 'trick-blue-hat-blue-body',
    isTarget: false,
    hatColor: '#2563EB', // Mavi Şapka
    hatColorName: 'Mavi',
    bodyColor: '#2563EB', // Mavi Gövde
    bodyColorName: 'Mavi',
    hasHat: true,
    description: 'Mavi Şapkalı, Mavi Gövdeli Çubuk Adam',
  },
];
