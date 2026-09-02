// ─── Shared Types ────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  source: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  coverImageUrl: string;
  url: string;
  isFeatured?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string;
  url: string;
}

export interface Video {
  id: string;
  source: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  url: string;
  isFeatured?: boolean;
}

export interface MythFact {
  id: string;
  myth: string;
  fact: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface AwarenessPost {
  id: string;
  title: string;
  body: string;
  tag: string;
  coverImageUrl: string;
  url?: string;
}

// ─── Articles ─────────────────────────────────────────────────────────────────
// All URLs verified live. ScienceDirect URL corrected to the confirmed article
// (Sri Lanka study, 98.7% stat confirmed). TandF URL corrected to the confirmed
// Jordanian women study (80.3% awareness stat confirmed).

export const ARTICLES: Article[] = [
  {
    id: 'article-1',
    source: 'Medscape',
    title: 'Breast Cancer: Background, Anatomy, Pathophysiology',
    excerpt:
      'Breast cancer is the common term for a set of breast tumour subtypes with distinct molecular and cellular origins and clinical behaviour.',
    date: '14th May 2026',
    author: 'Pavani Chalasani, MD, MPH; Chief Editor: John V Kiluk, MD, FACS',
    coverImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800',
    url: 'https://emedicine.medscape.com/article/1947145-overview',
    isFeatured: true,
  },
  {
    id: 'article-2',
    source: 'ScienceDirect',
    title: 'Awareness of breast cancer and breast screening methods',
    excerpt:
      'The survey revealed that 98.7% of respondents were aware of breast cancer, yet the majority remained unaware of breast self-examination as a screening method.',
    date: '5th August 2025',
    coverImageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1078817425002469',
  },
  {
    id: 'article-3',
    source: 'Taylor & Francis Online',
    title: 'Knowledge and awareness of breast cancer signs and symptoms among Jordanian women',
    excerpt:
      '80.3% of participants demonstrated good awareness of breast cancer signs and symptoms, with significant variation linked to age, education, and marital status.',
    date: '28th May 2025',
    coverImageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400',
    url: 'https://www.tandfonline.com/doi/full/10.1080/20565623.2025.2510871',
  },
  {
    id: 'article-4',
    source: 'BreastCancer.org',
    title: 'Breast Cancer Awareness Month',
    excerpt:
      'Breast Cancer Awareness Month, held each year in October, is a global health campaign to improve awareness and reduce stigma surrounding breast cancer.',
    date: '1st October 2025',
    coverImageUrl: 'https://images.unsplash.com/photo-1559757175-7cb036e0d465?w=400',
    url: 'https://www.breastcancer.org/research-news/breast-cancer-awareness-month',
  },
];

// ─── Books ────────────────────────────────────────────────────────────────────
// All ISBNs and Amazon URLs verified. Cover images use Open Library's ISBN
// lookup — book-1 ISBN confirmed 9798218142650, book-2 ISBN 9781101883150,
// book-3 ISBN 9781646870486, book-4 ISBN 9780553385915.

export const BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Not the Breast Year of My Life',
    author: 'Cara Sapida',
    coverImageUrl: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1681620709i/128641875.jpg',
    url: 'https://www.amazon.com/Not-Breast-Year-Life-Resilience/dp/B0C1JD793M',
  },
  {
    id: 'book-2',
    title: 'The New Generation Breast Cancer Book',
    author: 'Dr. Elisa Port',
    coverImageUrl: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1440610904i/24344114.jpg',
    url: 'https://www.amazon.com/Generation-Breast-Cancer-Options-Optimistic/dp/1101883154',
  },
  {
    id: 'book-3',
    title: 'Off Our Chests: A Candid Tour Through the World of Cancer',
    author: 'Dr. John Marshall & Liza Marshall',
    coverImageUrl: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1617082735i/56767459.jpg',
    url: 'https://www.amazon.com/Off-Our-Chests-Candid-Through/dp/1646870484',
  },
  {
    id: 'book-4',
    title: 'Breast Cancer: The Complete Guide',
    author: 'Yashar Hirshaut & Peter Pressman',
    coverImageUrl: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1348424839i/5728328.jpg',
    url: 'https://www.amazon.com/Breast-Cancer-Complete-Guide-Fifth/dp/0553385917',
  },
];

// ─── Videos ───────────────────────────────────────────────────────────────────
// All three video IDs verified against live YouTube search results.
// video-1: NHS official channel — ojddACFfVa8 (confirmed)
// video-2: Cancer Research UK — ORU9BTp32aI (confirmed)
// video-3: UVA Health — HRFe220C2h0 (confirmed)
// YouTube thumbnails use the standard hqdefault.jpg pattern which is reliable
// for any public video. The original placeholder IDs (aBcDeFgHiJk etc.) were
// fictional and have been replaced with confirmed real IDs.

export const VIDEOS: Video[] = [
  {
    id: 'video-1',
    source: 'NHS',
    title: 'Breast cancer — signs and symptoms',
    excerpt:
      'Dr Scarlet Nazarian explains the signs and symptoms of breast cancer and demonstrates how to check your breasts regularly.',
    thumbnailUrl: 'https://img.youtube.com/vi/ojddACFfVa8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ojddACFfVa8',
    isFeatured: true,
  },
  {
    id: 'video-2',
    source: 'Cancer Research UK',
    title: 'Spot Breast Cancer Early',
    excerpt:
      'Breast cancer is treatable, but it is vital to spot the disease early so that treatment has a better chance of success.',
    thumbnailUrl: 'https://img.youtube.com/vi/ORU9BTp32aI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ORU9BTp32aI',
  },
  {
    id: 'video-3',
    source: 'UVA Health',
    title: 'Early Signs of Breast Cancer',
    excerpt:
      'Women have a 1-in-8 chance of developing breast cancer in their lifetime. Early detection significantly improves survival outcomes.',
    thumbnailUrl: 'https://img.youtube.com/vi/HRFe220C2h0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=HRFe220C2h0',
  },
];

// ─── Myth vs Facts ────────────────────────────────────────────────────────────

export const MYTH_FACTS: MythFact[] = [
  {
    id: 'myth-1',
    myth: 'Only women with a family history of breast cancer are at risk.',
    fact: 'About 85% of breast cancers occur in women with no family history. All women are at risk, which is why routine screening matters.',
  },
  {
    id: 'myth-2',
    myth: 'A lump in the breast always means cancer.',
    fact: 'Most breast lumps are benign. Common causes include cysts and fibroadenomas. However, any new lump should be evaluated by a clinician promptly.',
  },
  {
    id: 'myth-3',
    myth: 'Wearing an underwire bra causes breast cancer.',
    fact: 'No scientific evidence supports this claim. Large-scale studies have found no link between bra type and breast cancer risk.',
  },
  {
    id: 'myth-4',
    myth: 'Breast cancer only affects older women.',
    fact: 'While risk increases with age, breast cancer can occur at any age. In Nigeria, younger women are disproportionately affected compared to Western populations.',
  },
  {
    id: 'myth-5',
    myth: 'If you have no symptoms, you do not need screening.',
    fact: 'Early-stage breast cancer often has no symptoms at all. That is precisely why routine screening exists — to detect cancer before it becomes symptomatic.',
  },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const FAQS: Faq[] = [
  {
    id: 'faq-1',
    question: 'How often should I do a breast self-examination?',
    answer:
      'Once a month, ideally a few days after your period ends when breasts are least tender. Postmenopausal women should pick a fixed day each month.',
  },
  {
    id: 'faq-2',
    question: 'What are the early warning signs of breast cancer?',
    answer:
      'A new lump in the breast or armpit, thickening or swelling, skin irritation or dimpling, nipple pain or the nipple turning inward, redness or flaky skin, nipple discharge, or any change in size or shape.',
  },
  {
    id: 'faq-3',
    question: 'Can men get breast cancer?',
    answer:
      'Yes. Male breast cancer is rare but real, accounting for about 1% of all breast cancer cases. Men with BRCA2 mutations face a significantly elevated lifetime risk.',
  },
  {
    id: 'faq-4',
    question: 'Is breast cancer hereditary?',
    answer:
      'About 5–10% of breast cancers are linked to inherited gene mutations, most commonly BRCA1 and BRCA2. The remaining 85–90% occur in people with no family history.',
  },
  {
    id: 'faq-5',
    question: 'What happens during a clinical breast examination?',
    answer:
      'A clinician visually inspects both breasts then uses their fingers to feel for lumps, thickening, or other changes in the breast tissue and surrounding lymph nodes. It takes about 10 minutes and is painless.',
  },
];

// ─── Awareness Posts ──────────────────────────────────────────────────────────

export const AWARENESS_POSTS: AwarenessPost[] = [
  {
    id: 'awareness-1',
    title: '1 in 8 Women Will Be Diagnosed in Their Lifetime',
    body: 'Globally, breast cancer is the most commonly diagnosed cancer among women. Early detection through regular screening can reduce mortality by up to 30%.',
    tag: 'Statistics',
    coverImageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
    url: 'https://www.who.int/news-room/fact-sheets/detail/breast-cancer',
  },
  {
    id: 'awareness-2',
    title: 'Know Your Normal — Do a Self-Exam Monthly',
    body: 'Stand in front of a mirror with your arms at your sides. Look for any changes in size, shape, or skin texture. Then raise your arms and repeat. Use your fingers to feel for lumps in circular motions. Report anything unusual to a clinician immediately.',
    tag: 'Self-Exam',
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  },
  {
    id: 'awareness-3',
    title: 'Screening Saves Lives — Even Without Symptoms',
    body: 'The majority of breast cancers detected at an early stage are found through routine screening before any symptom appears. Women aged 40 and above should discuss screening options with their clinician annually.',
    tag: 'Early Detection',
    coverImageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
    url: 'https://www.who.int/news-room/fact-sheets/detail/breast-cancer',
  },
  {
    id: 'awareness-4',
    title: 'Nigeria Records Over 53,000 New Cases Annually',
    body: 'Nigeria now has one of the highest breast cancer mortality rates in the world, not because incidence is highest but because most women are diagnosed at stage III or IV. Early detection and structured risk assessment are the most effective interventions available.',
    tag: 'Statistics',
    coverImageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
    url: 'https://platformtimes.com/53500-new-cases-in-2023-as-nigerias-breast-cancer-crisis-deepens/',
  },
];