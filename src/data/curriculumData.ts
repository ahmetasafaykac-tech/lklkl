import { SubjectItem, GradeLevel } from '../types';

export interface GradeCurriculumTopic {
  id: string;
  grade: GradeLevel;
  subject: string;
  subjectId: string;
  unitTitle: string;
  keyTopics: string[];
  examRelevance: string;
  ebaLinkCode: string;
}

export const GRADE_NAMES: Record<GradeLevel, string> = {
  '1': '1. Sınıf (İlkokul)',
  '2': '2. Sınıf (İlkokul)',
  '3': '3. Sınıf (İlkokul)',
  '4': '4. Sınıf (İlkokul)',
  '5': '5. Sınıf (Ortaokul)',
  '6': '6. Sınıf (Ortaokul)',
  '7': '7. Sınıf (Ortaokul)',
  '8': '8. Sınıf (LGS Hazırlık)',
  '9': '9. Sınıf (Lise Başlangıç)',
  '10': '10. Sınıf (Lise Gelişim)',
  '11': '11. Sınıf (Alan & YKS Temel)',
  '12': '12. Sınıf (YKS / TYT-AYT)',
  'mezun': 'Mezun (YKS Derece Hazırlık)',
};

export const GRADE_TOPICS: GradeCurriculumTopic[] = [
  // 1-4. SINIF (İlkokul Temel)
  {
    id: 'g1-mat-1',
    grade: '1',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Doğal Sayılar & Ritmik Sayma',
    keyTopics: ['20\'ye Kadar Sayma', 'Nesne Sayısı Eşleme', 'Toplama Mantığı'],
    examRelevance: 'İlkokul Temel Matematik Kazanımı',
    ebaLinkCode: 'EBA-1-MAT-U1',
  },
  {
    id: 'g4-fen-1',
    grade: '4',
    subject: 'Fen Bilimleri',
    subjectId: 'fenbilimleri',
    unitTitle: 'Yer Kabuğu ve Dünyamızın Hareketleri',
    keyTopics: ['Kayaçlar ve Madenler', 'Dünyanın Dönme ve Dolanma Hareketi', 'Gece-Gündüz Oluşumu'],
    examRelevance: 'İlkokul Fen Bilimleri Temel Kavramları',
    ebaLinkCode: 'EBA-4-FEN-U1',
  },
  // 5-8. SINIF (Ortaokul & LGS)
  {
    id: 'g8-mat-1',
    grade: '8',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Çarpanlar ve Katlar (EBOB - EKOK)',
    keyTopics: ['Asal Çarpanlara Ayırma', 'EBOB-EKOK Problemleri', 'Aralarında Asal Sayılar'],
    examRelevance: 'LGS Matematik 1. ve 2. Sorular (Her Yıl Kesin)',
    ebaLinkCode: 'EBA-8-MAT-U1',
  },
  {
    id: 'g8-mat-2',
    grade: '8',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Üslü ve Kareköklü İfadeler',
    keyTopics: ['Tam Kare Sayılar', 'Kareköklü İfadelerde Çarpma-Bölme', 'Gerçek Sayılar'],
    examRelevance: 'LGS Sayısal Bölüm En Çok Soru Çıkan Ünite',
    ebaLinkCode: 'EBA-8-MAT-U2',
  },
  {
    id: 'g8-fen-1',
    grade: '8',
    subject: 'Fen Bilimleri',
    subjectId: 'fenbilimleri',
    unitTitle: 'Mevsimler ve İklim & DNA',
    keyTopics: ['Mevsimlerin Oluşumu', 'Hava Olayları ve İklim', 'DNA ve Genetik Kod'],
    examRelevance: 'LGS Fen Bilimleri Belirleyici Yeni Nesil Sorular',
    ebaLinkCode: 'EBA-8-FEN-U1',
  },
  // 9. SINIF (Öncelikli)
  {
    id: 'g9-mat-1',
    grade: '9',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Kümeler & Mantık',
    keyTopics: ['Kümelerde İşlemler', 'Kartezyen Çarpım', 'Önermeler ve Bileşik Önermeler'],
    examRelevance: 'TYT Temel Matematik Soru 1-3 Arası',
    ebaLinkCode: 'EBA-9-MAT-U1',
  },
  {
    id: 'g9-mat-2',
    grade: '9',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Denklem ve Eşitsizlikler',
    keyTopics: ['Mutlak Değer', 'Üslü ve Köklü İfadeler', 'Birinci Dereceden Denklemler', 'Oran-Orantı'],
    examRelevance: 'TYT Problemlerin Temel Çıkış Noktası',
    ebaLinkCode: 'EBA-9-MAT-U2',
  },
  {
    id: 'g9-fiz-1',
    grade: '9',
    subject: 'Fizik',
    subjectId: 'fizik',
    unitTitle: 'Hareket ve Kuvvet',
    keyTopics: ['Konum, Hız, İvme', 'Düzgün Doğrusal Hareket', 'Newton Hareket Yasaları', 'Sürtünme Kuvveti'],
    examRelevance: 'TYT Fizik En Çok Soru Çıkan Konu (Her Yıl Kesin 1 Soru)',
    ebaLinkCode: 'EBA-9-FIZ-U2',
  },
  {
    id: 'g9-fiz-2',
    grade: '9',
    subject: 'Fizik',
    subjectId: 'fizik',
    unitTitle: 'Madde ve Özellikleri',
    keyTopics: ['Özkütle ($d=m/V$)', 'Adezyon ve Kohezyon', 'Yüzey Gerilimi ve Kılcallık'],
    examRelevance: 'TYT Fizik Temel Bilgi Soruları',
    ebaLinkCode: 'EBA-9-FIZ-U1',
  },
  {
    id: 'g9-kim-1',
    grade: '9',
    subject: 'Kimya',
    subjectId: 'kimya',
    unitTitle: 'Atom ve Periyodik Sistem',
    keyTopics: ['Atom Modelleri', 'Proton, Nötron, Elektron', 'Periyodik Tablo Trendleri (Elektronegatiflik, Yarıçap)'],
    examRelevance: 'TYT Kimya Kesin Çıkan Konu',
    ebaLinkCode: 'EBA-9-KIM-U2',
  },
  {
    id: 'g9-biy-1',
    grade: '9',
    subject: 'Biyoloji',
    subjectId: 'biyoloji',
    unitTitle: 'Canlıların Temel Bileşenleri & Hücre',
    keyTopics: ['Karbonhidrat, Yağ, Protein, Enzimler', 'Hücre Zarı ve Organeller', 'Madde Geçişleri (Difüzyon, Osmoz)'],
    examRelevance: 'TYT Biyoloji Garanti 2 Soru',
    ebaLinkCode: 'EBA-9-BIY-U1',
  },
  {
    id: 'g9-edb-1',
    grade: '9',
    subject: 'Türkçe & Edebiyat',
    subjectId: 'turkce',
    unitTitle: 'Paragraf Anlamı & Hikaye/Şiir',
    keyTopics: ['Paragrafta Ana Düşünce & Yardımcı Düşünceler', 'Anlatım Biçimleri', 'Şiir Bilgisi (Ölçü, Uyak)'],
    examRelevance: 'TYT Türkçe 33 Paragraf Sorusunun Temeli',
    ebaLinkCode: 'EBA-9-EDB-U1',
  },

  // 10. SINIF
  {
    id: 'g10-mat-1',
    grade: '10',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Fonksiyonlar & Polinomlar',
    keyTopics: ['Fonksiyon Grafikleri', 'Bileşke ve Ters Fonksiyon', 'Polinomlarda Bölme ve Kalan Bulma'],
    examRelevance: 'TYT ve AYT Ortak Kilit Konusu',
    ebaLinkCode: 'EBA-10-MAT-U2',
  },
  {
    id: 'g10-fiz-1',
    grade: '10',
    subject: 'Fizik',
    subjectId: 'fizik',
    unitTitle: 'Elektrik ve Manyetizma',
    keyTopics: ['Elektrik Akımı ve Direnç ($V=I\\cdot R$)', 'Seri ve Paralel Bağlama', 'Manyetik Alan'],
    examRelevance: 'TYT Fizik Devre ve Lamba Parlaklığı Soruları',
    ebaLinkCode: 'EBA-10-FIZ-U1',
  },
  {
    id: 'g10-kim-1',
    grade: '10',
    subject: 'Kimya',
    subjectId: 'kimya',
    unitTitle: 'Mol Kavramı & Karışımlar',
    keyTopics: ['Avogadro Sayısı ve Mol Hesaplamaları', 'Kütlece Yüzde Derişim', 'Asit-Baz Tepkimeleri'],
    examRelevance: 'TYT Sayısal Kimya Standart Sapması En Yüksek Konu',
    ebaLinkCode: 'EBA-10-KIM-U1',
  },

  // 11. SINIF
  {
    id: 'g11-mat-1',
    grade: '11',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Trigonometri & Analitik Geometri',
    keyTopics: ['Birim Çember', 'Trigonometrik Değerler & Teoremler', 'Noktanın ve Doğrunun Analitiği'],
    examRelevance: 'AYT Matematik 4-5 Soru Ağırlığı',
    ebaLinkCode: 'EBA-11-MAT-U1',
  },
  {
    id: 'g11-fiz-1',
    grade: '11',
    subject: 'Fizik',
    subjectId: 'fizik',
    unitTitle: 'Vektörler & İki Boyutta Hareket',
    keyTopics: ['Atış Hareketleri', 'İtme ve Çizgisel Momentum', 'Tork ve Denge'],
    examRelevance: 'AYT Fizik Mekanik Blokunun Bel Kemiği',
    ebaLinkCode: 'EBA-11-FIZ-U1',
  },

  // 12. SINIF (YKS / AYT)
  {
    id: 'g12-mat-1',
    grade: '12',
    subject: 'Matematik',
    subjectId: 'matematik',
    unitTitle: 'Limit, Türev ve İntegral',
    keyTopics: ['Süreklilik', 'Türev Alma Kuralları ve Geometrik Yorum', 'Belirli ve Belirsiz İntegral ile Alan Hesabı'],
    examRelevance: 'AYT Matematik Yaklaşık 10 Soru (Derece Yaptıran Konular)',
    ebaLinkCode: 'EBA-12-MAT-LTİ',
  },
  {
    id: 'g12-fiz-1',
    grade: '12',
    subject: 'Fizik',
    subjectId: 'fizik',
    unitTitle: 'Çembersel Hareket & Modern Fizik',
    keyTopics: ['Açısal Hız ve Merkezcil Kuvvet', 'Basit Harmonik Hareket', 'Fotoelektrik Olay & Compton'],
    examRelevance: 'AYT Fizik Son Üniteler',
    ebaLinkCode: 'EBA-12-FIZ-U1',
  },
];

export const SUBJECTS: SubjectItem[] = [
  {
    id: 'genel',
    name: 'Tüm Dersler & Rehberlik',
    category: 'Genel',
    iconName: 'Compass',
    description: 'Genel eğitim danışmanlığı, çalışma stratejileri ve sınav rehberliği.'
  },
  {
    id: 'matematik',
    name: 'Matematik & Geometri',
    category: 'Sayısal',
    iconName: 'Calculator',
    description: 'Temel kavramlar, türev, integral, trigonometri, fonksiyonlar ve problem çözümleri.'
  },
  {
    id: 'fizik',
    name: 'Fizik',
    category: 'Sayısal',
    iconName: 'Zap',
    description: 'Mekanik, elektrik, optik, modern fizik ve dalgalar konu kazanımları.'
  },
  {
    id: 'kimya',
    name: 'Kimya',
    category: 'Sayısal',
    iconName: 'FlaskConical',
    description: 'Periyodik sistem, kimyasal bağlar, asit-baz, organik kimya ve termodinamik.'
  },
  {
    id: 'biyoloji',
    name: 'Biyoloji',
    category: 'Sayısal',
    iconName: 'Dna',
    description: 'Hücre yapısı, kalıtım, ekoloji, canlıların çeşitliliği ve insan fizyolojisi.'
  },
  {
    id: 'turkce',
    name: 'Türkçe & Edebiyat',
    category: 'Sözel',
    iconName: 'BookOpen',
    description: 'Paragraf teknikleri, dil bilgisi, Divan ve Tanzimat edebiyatı, Cumhuriyet dönemi.'
  },
  {
    id: 'tarih',
    name: 'Tarih & İnkılap',
    category: 'Sözel',
    iconName: 'Clock',
    description: 'İlk Türk devletleri, Osmanlı tarihi, Kurtuluş Savaşı ve Atatürk ilkeleri.'
  },
  {
    id: 'cografya',
    name: 'Coğrafya',
    category: 'Eşit Ağırlık',
    iconName: 'Globe',
    description: 'İklim bilgisi, Türkiye fiziki ve beşeri coğrafyası, harita bilgisi.'
  },
  {
    id: 'felsefe',
    name: 'Felsefe & Mantık',
    category: 'Eşit Ağırlık',
    iconName: 'Brain',
    description: 'Bilgi felsefesi, ahlak felsefesi, varlık felsefesi ve sembolik mantık.'
  },
  {
    id: 'ingilizce',
    name: 'İngilizce (Yabancı Dil)',
    category: 'Dil',
    iconName: 'Languages',
    description: 'Grammar, reading comprehension, vocabulary ve YDT hazırlık.'
  },
  {
    id: 'dinkulturu',
    name: 'Din Kültürü & Ahlak',
    category: 'Sözel',
    iconName: 'Sparkles',
    description: 'İnanç, ibadet, ahlak ilkeleri ve İslam medeniyet tarihi kazanımları.'
  }
];

export interface EbaResourceGuide {
  id: string;
  title: string;
  source: string;
  category: string;
  description: string;
  keyTopics: string[];
  linkHint: string;
  targetGrades?: string[];
}

export const EBA_CURRICULUM_RESOURCES: EbaResourceGuide[] = [
  {
    id: 'eba-meb-kazanim',
    title: 'MEB & EBA Haftalık Ders Kazanım Rehberi',
    source: 'EBA (Eğitim Bilişim Ağı) & MEB TTKB',
    category: 'Resmi Müfredat',
    description: 'Türkiye MEB Talim ve Terbiye Kurulu Başkanlığı tarafından onaylanmış güncel ders kazanımları ve haftalık konu dağılımları.',
    keyTopics: ['9. Sınıf Temel Kazanımlar', '10-12. Sınıf İleri Kazanımlar', 'Haftalık Ders Planları'],
    linkHint: 'eba.gov.tr / ogmmateryal.eba.gov.tr',
    targetGrades: ['9', '10', '11', '12'],
  },
  {
    id: 'osym-yks-ayt-tyt',
    title: 'ÖSYM Çıkmış Soru & Soru Dağılım Analizleri',
    source: 'ÖSYM & MEB Ölçme ve Değerlendirme',
    category: 'Sınav Hazırlık',
    description: 'TYT, AYT, YDT ve LGS sınavlarında son 10 yılın konu bazlı soru çıkma sıklıkları ve standart sapma analizleri.',
    keyTopics: ['9. Sınıf Temelli TYT Soruları', 'Paragraf Çözüm Taktikleri', 'Matematik Problem Tipleri'],
    linkHint: 'osym.gov.tr / odsgm.meb.gov.tr',
    targetGrades: ['9', '10', '11', '12'],
  },
  {
    id: 'ogm-materyal',
    title: 'OGM Materyal 3D Deneyler & Konu Özetleri',
    source: 'Ortaöğretim Genel Müdürlüğü',
    category: 'Dijital İçerik',
    description: 'Fizik, Kimya ve Biyoloji için simülasyonlar, etkileşimli kitaplar ve interaktif soru bankaları.',
    keyTopics: ['9. Sınıf Simülasyonları', 'Etkileşimli Kitaplar', '3 Boyutlu Modeller'],
    linkHint: 'ogmmateryal.eba.gov.tr',
    targetGrades: ['9', '10', '11', '12'],
  },
  {
    id: 'tubitak-bilim',
    title: 'TÜBİTAK Bilim Genç & Popüler Bilim Makaleleri',
    source: 'TÜBİTAK',
    category: 'Akademik Destek',
    description: 'Türkiye ve dünyadaki bilimsel gelişmeler, fen projeleri ve olimpiyat soruları arşivi.',
    keyTopics: ['Lise Olimpiyat Soruları', 'Bilimsel Deney Rehberleri', 'Teknoloji Trendleri'],
    linkHint: 'bilimgenc.tubitak.gov.tr',
    targetGrades: ['9', '10', '11', '12'],
  }
];

export const QUICK_SAMPLE_PROMPTS = [
  {
    subject: 'fizik',
    grade: '9',
    emotion: 'merakli',
    text: '9. Sınıf Fizik Hareket ve Kuvvet ünitesindeki Newton yasalarını günlük hayattan örneklerle anlatır mısın?'
  },
  {
    subject: 'matematik',
    grade: '9',
    emotion: 'stresli',
    text: '9. Sınıf Kümeler ve Denklem-Eşitsizlikler konusunda TYT tarzı temel mantığı en sade haliyle açıklar mısın?'
  },
  {
    subject: 'kimya',
    grade: '9',
    emotion: 'normal',
    text: '9. Sınıf Kimya Atom modelleri ve periyodik sistemdeki periyodik özellikleri özetler misin?'
  },
  {
    subject: 'turkce',
    grade: '9',
    emotion: 'yorucu',
    text: '9. Sınıf Edebiyat ve TYT paragraf sorularında zaman kaybetmeden odaklanma teknikleri nelerdir?'
  },
  {
    subject: 'matematik',
    grade: '12',
    emotion: 'merakli',
    text: '12. Sınıf AYT Türevde geometrik yorum ve teğetin eğimi mantığını açıklar mısın?'
  }
];
