import type { Achiever, Category, AchieverConnection, CategorySlug } from '@/types/achiever';

/* ─── Categories ─── */

export const CATEGORIES: Category[] = [
  { id: 'cat-1', slug: 'science',      label: 'Science & Physics', color: '#006a4e', icon: '🔬', orbitRadius: 3.0 },
  { id: 'cat-2', slug: 'technology',   label: 'Computing & Tech',  color: '#059669', icon: '💻', orbitRadius: 3.5 },
  { id: 'cat-3', slug: 'academia',     label: 'Higher Academia',   color: '#0284c7', icon: '📚', orbitRadius: 4.0 },
  { id: 'cat-4', slug: 'humanitarian', label: 'Education & Impact',color: '#f42a41', icon: '🎓', orbitRadius: 4.5 },
  { id: 'cat-5', slug: 'business',     label: 'Industry Leadership',color: '#d97706', icon: '🌐', orbitRadius: 5.0 },
  { id: 'cat-6', slug: 'arts',         label: 'Design & Culture',  color: '#8b5cf6', icon: '🏛️', orbitRadius: 5.5 },
];

/* ─── Seed Achievers: Purely Education, Academic, and Scientific Pioneers ─── */

export const ACHIEVERS: Achiever[] = [
  {
    id: 'ach-01',
    slug: 'muhammad-yunus',
    name: 'Prof. Muhammad Yunus',
    title: 'Nobel Peace Laureate & Pioneer of Microfinance',
    bio: 'Earned his PhD in Economics from Vanderbilt University as a Fulbright Scholar and served as Professor of Economics. Founder of Grameen Bank, his groundbreaking economic models for microcredit and social business have lifted tens of millions out of poverty worldwide.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'humanitarian',
    profession: 'Economist, Academic & Social Entrepreneur',
    awards: [
      { title: 'Nobel Peace Prize', year: 2006, organization: 'Norwegian Nobel Committee' },
      { title: 'Presidential Medal of Freedom', year: 2009, organization: 'United States' },
      { title: 'Congressional Gold Medal', year: 2010, organization: 'US Congress' },
    ],
    institutions: [
      { name: 'Vanderbilt University', role: 'PhD in Economics (Fulbright)', current: false },
      { name: 'University of Chittagong', role: 'Head of Economics Department', current: false },
      { name: 'Grameen Bank', role: 'Founder', current: false },
    ],
    tags: ['economics', 'microfinance', 'vanderbilt', 'nobel laureate', 'social business'],
    featured: true,
  },
  {
    id: 'ach-02',
    slug: 'satyendra-nath-bose',
    name: 'Satyendra Nath Bose',
    title: 'Father of Bose-Einstein Statistics & Quantum Physics Pioneer',
    bio: 'Theoretical physicist whose foundational paper on quantum mechanics led to Bose-Einstein statistics and the prediction of the Bose-Einstein condensate. The fundamental subatomic particle class "Boson" is named in his honor. Served as Professor of Physics and Head of Department at the University of Dhaka.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'science',
    profession: 'Theoretical Physicist & Polymath',
    awards: [
      { title: 'Fellow of the Royal Society (FRS)', year: 1958, organization: 'Royal Society London' },
      { title: 'Padma Vibhushan', year: 1954 },
    ],
    institutions: [
      { name: 'University of Dhaka', role: 'Professor & Head of Physics Dept', current: false },
      { name: 'University of Calcutta', role: 'Professor of Physics', current: false },
    ],
    tags: ['quantum physics', 'boson', 'einstein', 'dhaka university', 'theoretical physics'],
    featured: true,
  },
  {
    id: 'ach-03',
    slug: 'jagadish-chandra-bose',
    name: 'Sir Jagadish Chandra Bose',
    title: 'Pioneer of Radio Microwave Optics & Plant Biophysics',
    bio: 'Pioneered the investigation of radio microwave optics, making the first public demonstration of wireless millimeter-wave transmission in 1895. Educated at Christ\'s College Cambridge and University of London (D.Sc.), he also invented the crescograph to measure biological responses in plants.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'science',
    profession: 'Physicist, Biophysicist & Polymath',
    awards: [
      { title: 'Fellow of the Royal Society (FRS)', year: 1920, organization: 'Royal Society London' },
      { title: 'Knighthood (Knight Bachelor)', year: 1917, organization: 'United Kingdom' },
    ],
    institutions: [
      { name: 'Christ\'s College, University of Cambridge', role: 'Natural Sciences Tripos Scholar', current: false },
      { name: 'Bose Institute', role: 'Founder & Director', current: false },
    ],
    tags: ['radio science', 'biophysics', 'microwaves', 'cambridge', 'polymath'],
    featured: true,
  },
  {
    id: 'ach-04',
    slug: 'fazlur-rahman-khan',
    name: 'Dr. Fazlur Rahman Khan',
    title: 'Father of Tubular Structural Engineering for Modern Skylines',
    bio: 'Earned his MS and PhD in Structural Engineering from the University of Illinois Urbana-Champaign. Revolutionized skyscraper construction with tubular systems, making iconic megastructures such as the Willis (Sears) Tower and John Hancock Center possible.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-American',
    category: 'science',
    profession: 'Structural Engineer & Architect',
    awards: [
      { title: 'ACI Special Award', year: 1972 },
      { title: 'ASCE Outstanding Engineer Award', year: 1973 },
      { title: 'International Award of Merit in Structural Engineering', year: 1983 },
    ],
    institutions: [
      { name: 'University of Illinois at Urbana-Champaign', role: 'MS & PhD in Structural Engineering', current: false },
      { name: 'Skidmore, Owings & Merrill (SOM)', role: 'Partner & Head of Structural Engineering', current: false },
    ],
    tags: ['skyscrapers', 'structural engineering', 'uiuc', 'architecture', 'innovation'],
    featured: true,
  },
  {
    id: 'ach-05',
    slug: 'jamal-nazrul-islam',
    name: 'Prof. Jamal Nazrul Islam',
    title: 'Renowned Mathematical Cosmologist & Theoretical Physicist',
    bio: 'Obtained his PhD and prestigious Sc.D. in Applied Mathematics and Theoretical Physics from the University of Cambridge. Collaborated with Stephen Hawking, Freeman Dyson, and Roger Penrose. Author of the seminal text "The Ultimate Fate of the Universe."',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'academia',
    profession: 'Theoretical Physicist & Mathematician',
    awards: [
      { title: 'Ekushey Padak', year: 2001, organization: 'Government of Bangladesh' },
      { title: 'Bangladesh Academy of Sciences Gold Medal', year: 1985 },
    ],
    institutions: [
      { name: 'University of Cambridge (Trinity College)', role: 'PhD & Sc.D. in Theoretical Physics', current: false },
      { name: 'University of Chittagong', role: 'Professor of Mathematics & Research Director', current: false },
    ],
    tags: ['cosmology', 'general relativity', 'cambridge', 'theoretical physics', 'mathematics'],
    featured: true,
  },
  {
    id: 'ach-06',
    slug: 'zahid-hasan',
    name: 'Prof. Dr. M. Zahid Hasan',
    title: 'Eugene Higgins Professor of Physics at Princeton University',
    bio: 'Global authority on quantum matter who discovered topological insulators and Weyl fermions. Earned his PhD from Stanford University and currently holds the Eugene Higgins Chair in Physics at Princeton, leading pioneering experiments on the frontiers of quantum computing.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-American',
    category: 'science',
    profession: 'Quantum Physicist & Academic',
    awards: [
      { title: 'Ernest Orlando Lawrence Award', year: 2020, organization: 'US Department of Energy' },
      { title: 'Guggenheim Fellowship', year: 2013 },
      { title: 'Fellow of the American Physical Society', year: 2013 },
    ],
    institutions: [
      { name: 'Princeton University', role: 'Eugene Higgins Professor of Physics', current: true },
      { name: 'Stanford University', role: 'PhD in Physics', current: false },
      { name: 'Lawrence Berkeley National Laboratory', role: 'Visiting Scientist', current: true },
    ],
    tags: ['quantum physics', 'topological insulators', 'weyl fermion', 'princeton', 'stanford'],
    featured: true,
  },
  {
    id: 'ach-07',
    slug: 'salman-khan-educator',
    name: 'Sal Khan',
    title: 'Founder of Khan Academy — World Education Innovator',
    bio: 'Educator and technologist who holds three degrees from MIT (BS in Mathematics, BS in EECS, MEng) and an MBA from Harvard Business School. Founded Khan Academy to provide free, high-caliber education for anyone, anywhere, empowering over 150 million learners.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-American',
    category: 'technology',
    profession: 'Educator & Technologist',
    awards: [
      { title: 'Heinz Award in the Human Condition', year: 2014 },
      { title: 'Princess of Asturias Award for International Cooperation', year: 2019 },
    ],
    institutions: [
      { name: 'Massachusetts Institute of Technology (MIT)', role: 'BS & MEng in EECS and Mathematics', current: false },
      { name: 'Harvard Business School', role: 'MBA', current: false },
      { name: 'Khan Academy', role: 'Founder & CEO', current: true },
    ],
    tags: ['education', 'khan academy', 'mit', 'harvard', 'edtech', 'mathematics'],
    featured: true,
  },
  {
    id: 'ach-08',
    slug: 'maqsudul-alam',
    name: 'Dr. Maqsudul Alam',
    title: 'Pioneering Molecular Biologist & Genome Scientist',
    bio: 'Molecular biologist who earned his PhD and D.Sc. from Moscow State University and conducted research at the Max Planck Institute. Led the global scientific consortium that decoded the genomes of Jute, Rubber, and Papaya, cementing Bangladesh\'s status in agricultural genomics.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi-American',
    category: 'science',
    profession: 'Genomics Scientist & Biochemist',
    awards: [
      { title: 'Ekushey Padak', year: 2012, organization: 'Government of Bangladesh' },
      { title: 'Independence Day Award (Posthumous)', year: 2016 },
    ],
    institutions: [
      { name: 'Moscow State University', role: 'PhD & D.Sc. in Microbiology', current: false },
      { name: 'University of Hawaii', role: 'Director of Genomics Research Center', current: false },
    ],
    tags: ['genomics', 'molecular biology', 'jute genome', 'biochemistry', 'dna research'],
    featured: false,
  },
  {
    id: 'ach-09',
    slug: 'abul-hussam',
    name: 'Prof. Dr. Abul Hussam',
    title: 'Inventor of the SONO Water Filter & Environmental Chemist',
    bio: 'Graduated from Dhaka University and received his PhD in Analytical Chemistry from the University of Pittsburgh. As Professor of Chemistry at George Mason University, he developed the life-saving SONO arsenic water filter, which purifies contaminated groundwater for millions of people.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-American',
    category: 'science',
    profession: 'Analytical Chemist & Inventor',
    awards: [
      { title: 'Grainger Challenge Prize for Sustainability', year: 2007, organization: 'National Academy of Engineering' },
    ],
    institutions: [
      { name: 'University of Pittsburgh', role: 'PhD in Analytical Chemistry', current: false },
      { name: 'George Mason University', role: 'Professor of Chemistry', current: true },
    ],
    tags: ['chemistry', 'arsenic mitigation', 'clean water', 'invention', 'george mason'],
    featured: true,
  },
  {
    id: 'ach-10',
    slug: 'mohammad-kaykobad',
    name: 'Prof. Dr. Mohammad Kaykobad',
    title: 'Distinguished Professor & Pioneer of Computer Science Education',
    bio: 'Earned his PhD from Flinders University, Australia. Served as Distinguished Professor of CSE at BUET, inspiring generations of Bangladeshi software engineers, researchers, and competitive programmers to reach global leadership at ACM-ICPC, Google, and top universities.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'academia',
    profession: 'Computer Scientist & Academic',
    awards: [
      { title: 'National ICT Award', year: 2017 },
      { title: 'Bangladesh Academy of Sciences Fellow', year: 2008 },
      { title: 'ACM-ICPC Senior Coach Award', year: 2015 },
    ],
    institutions: [
      { name: 'Flinders University', role: 'PhD in Computer Science', current: false },
      { name: 'BUET', role: 'Distinguished Professor of CSE', current: false },
      { name: 'BRAC University', role: 'Distinguished Professor of CSE', current: true },
    ],
    tags: ['buet', 'acm icpc', 'computer science', 'algorithms', 'higher education'],
    featured: true,
  },
  {
    id: 'ach-11',
    slug: 'sultana-nahar',
    name: 'Prof. Dr. Sultana N. Nahar',
    title: 'Atomic Astrophysicist & Research Professor at Ohio State',
    bio: 'Earned her PhD in Atomic Physics from Wayne State University following degrees from the University of Dhaka. A Fellow of the American Physical Society, her research on atomic processes in astrophysical plasmas and x-ray spectroscopy is utilized by NASA and observatories worldwide.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-American',
    category: 'science',
    profession: 'Atomic Astrophysicist & Academic',
    awards: [
      { title: 'Fellow of the American Physical Society (APS)', year: 2006 },
      { title: 'APS Woman Physicist of the Month', year: 2013 },
    ],
    institutions: [
      { name: 'Wayne State University', role: 'PhD in Atomic Physics', current: false },
      { name: 'Ohio State University', role: 'Research Professor of Astronomy', current: true },
    ],
    tags: ['astrophysics', 'spectroscopy', 'atomic physics', 'ohio state', 'nasa'],
    featured: false,
  },
  {
    id: 'ach-12',
    slug: 'fazle-hasan-abed',
    name: 'Sir Fazle Hasan Abed',
    title: 'Pioneer of Human Education & Development — Founder of BRAC',
    bio: 'Educated in accounting at the University of Glasgow and ICAEW London. Transformed social education and community development by establishing BRAC and BRAC University, providing primary schooling and higher education opportunities to tens of millions across Asia and Africa.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'humanitarian',
    profession: 'Educator & Social Development Pioneer',
    awards: [
      { title: 'Yidan Prize for Education Development', year: 2019, organization: 'Yidan Prize Foundation' },
      { title: 'World Food Prize', year: 2015 },
      { title: 'Knight Commander of the Order of St Michael and St George (KCMG)', year: 2009 },
    ],
    institutions: [
      { name: 'University of Glasgow', role: 'Alumnus & Honorary Doctor of Laws', current: false },
      { name: 'BRAC & BRAC University', role: 'Founder & Chairperson Emeritus', current: false },
    ],
    tags: ['education development', 'yidan prize', 'brac', 'literacy', 'brac university'],
    featured: true,
  },
  {
    id: 'ach-13',
    slug: 'qudrat-i-khuda',
    name: 'Dr. Muhammad Qudrat-i-Khuda',
    title: 'Pioneering Organic Chemist & Architect of National Education',
    bio: 'Earned his D.Sc. in Organic Chemistry from Imperial College London. Renowned scientist who founded the Bangladesh Council of Scientific and Industrial Research (BCSIR) and chaired the landmark 1974 National Education Commission of Bangladesh.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'science',
    profession: 'Organic Chemist & Educationist',
    awards: [
      { title: 'Ekushey Padak', year: 1976 },
      { title: 'Independence Day Award', year: 1984 },
    ],
    institutions: [
      { name: 'Imperial College London', role: 'D.Sc. in Chemistry', current: false },
      { name: 'National Education Commission', role: 'Chairman (Qudrat-i-Khuda Education Commission)', current: false },
      { name: 'BCSIR', role: 'Founder & Director', current: false },
    ],
    tags: ['organic chemistry', 'imperial college', 'bcsir', 'education commission', 'science'],
    featured: false,
  },
  {
    id: 'ach-14',
    slug: 'omar-ishrak',
    name: 'Dr. Omar Ishrak',
    title: 'Former Chairman of Intel Corporation & Biomedical Engineer',
    bio: 'Earned his BSc and PhD in Electrical Engineering from King\'s College London. Pioneered ultrasound imaging breakthroughs at GE Healthcare before serving as CEO of Medtronic and Chairman of Intel Corporation, demonstrating world-class leadership in engineering and technology.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-American',
    category: 'technology',
    profession: 'Biomedical Engineer & Tech Executive',
    awards: [
      { title: 'Member of the National Academy of Engineering (NAE)', year: 2020 },
      { title: 'King\'s College London Fellow', year: 2017 },
    ],
    institutions: [
      { name: 'King\'s College London', role: 'BSc & PhD in Electrical Engineering', current: false },
      { name: 'Intel Corporation', role: 'Chairman of the Board', current: false },
      { name: 'Medtronic', role: 'Chairman & CEO', current: false },
    ],
    tags: ['intel', 'biomedical engineering', 'kings college london', 'medtech', 'leadership'],
    featured: false,
  },
  {
    id: 'ach-15',
    slug: 'jawed-karim',
    name: 'Jawed Karim',
    title: 'Computer Scientist & Co-Founder of YouTube',
    bio: 'Computer scientist who studied at the University of Illinois Urbana-Champaign and earned his Master\'s degree in Computer Science from Stanford University. Co-founded YouTube, creating the infrastructure for the world\'s largest open educational and video ecosystem.',
    photoUrl: '',
    country: 'United States',
    countryFlag: '🇺🇸',
    nationality: 'Bangladeshi-German-American',
    category: 'technology',
    profession: 'Computer Scientist & Technologist',
    awards: [
      { title: 'UIUC Distinguished Alumni Award', year: 2013 },
    ],
    institutions: [
      { name: 'University of Illinois at Urbana-Champaign', role: 'BS in Computer Science', current: false },
      { name: 'Stanford University', role: 'MS in Computer Science', current: false },
      { name: 'YouTube', role: 'Co-Founder', current: false },
    ],
    tags: ['computer science', 'stanford', 'uiuc', 'youtube', 'technology education'],
    featured: true,
  },
  {
    id: 'ach-16',
    slug: 'saadia-zahidi',
    name: 'Dr. Saadia Zahidi',
    title: 'Managing Director at World Economic Forum (Future of Education)',
    bio: 'Educated at Smith College, Dartmouth College, and Harvard Kennedy School (Master in Public Administration). As Managing Director at the World Economic Forum, she leads global initiatives on education, skill resurgence, gender equality, and the future of work.',
    photoUrl: '',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    nationality: 'Bangladeshi',
    category: 'business',
    profession: 'Economist & Global Education Strategist',
    awards: [
      { title: 'Young Global Leader', year: 2013, organization: 'World Economic Forum' },
    ],
    institutions: [
      { name: 'Harvard Kennedy School', role: 'Master in Public Administration (MPA)', current: false },
      { name: 'Dartmouth College', role: 'Master\'s in Economics', current: false },
      { name: 'World Economic Forum', role: 'Managing Director', current: true },
    ],
    tags: ['economics', 'harvard', 'future of education', 'wef', 'skills roadmap'],
    featured: false,
  },
  {
    id: 'ach-17',
    slug: 'humayun-azad',
    name: 'Prof. Dr. Humayun Azad',
    title: 'Eminent Linguist & University of Dhaka Professor',
    bio: 'Distinguished linguist and scholar who received his PhD in Linguistics from the University of Edinburgh. Authored definitive structural linguistic works on Bengali syntax and phonetics, serving as Professor of Bengali Literature & Linguistics at the University of Dhaka.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'academia',
    profession: 'Linguist, Scholar & Academic Professor',
    awards: [
      { title: 'Bangla Academy Literary Award', year: 1986 },
      { title: 'Ekushey Padak (Posthumous)', year: 2012 },
    ],
    institutions: [
      { name: 'University of Edinburgh', role: 'PhD in Linguistics', current: false },
      { name: 'University of Dhaka', role: 'Professor of Bengali & Linguistics', current: false },
    ],
    tags: ['linguistics', 'syntax', 'edinburgh', 'dhaka university', 'higher academia'],
    featured: false,
  },
  {
    id: 'ach-18',
    slug: 'marina-tabassum',
    name: 'Prof. Marina Tabassum',
    title: 'Acclaimed Architectural Scholar & Visiting Professor',
    bio: 'BUET graduate and visiting professor at Harvard University Graduate School of Design and Technical University of Delft. Her research-backed architectural philosophy merges vernacular sustainability with institutional structures, earning the Aga Khan Award and the Soane Medal.',
    photoUrl: '',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    nationality: 'Bangladeshi',
    category: 'arts',
    profession: 'Architect & Academic Visiting Professor',
    awards: [
      { title: 'Aga Khan Award for Architecture', year: 2016 },
      { title: 'Soane Medal for Architecture', year: 2021, organization: 'Sir John Soane Museum London' },
      { title: 'Jameel Prize', year: 2018, organization: 'Victoria & Albert Museum' },
    ],
    institutions: [
      { name: 'BUET', role: 'Bachelor of Architecture (B.Arch)', current: false },
      { name: 'Harvard University Graduate School of Design', role: 'Visiting Professor of Architecture', current: false },
      { name: 'Marina Tabassum Architects', role: 'Principal Architect & Researcher', current: true },
    ],
    tags: ['architecture', 'buet', 'harvard gsd', 'sustainable design', 'research'],
    featured: true,
  },
];

/* ─── Connections between Education/Academic Achievers ─── */

export const CONNECTIONS: AchieverConnection[] = [
  { id: 'conn-1', achieverId: 'ach-02', relatedAchieverId: 'ach-03', relationType: 'same_field' },
  { id: 'conn-2', achieverId: 'ach-02', relatedAchieverId: 'ach-05', relationType: 'same_field' },
  { id: 'conn-3', achieverId: 'ach-04', relatedAchieverId: 'ach-15', relationType: 'same_university' }, // both UIUC
  { id: 'conn-4', achieverId: 'ach-06', relatedAchieverId: 'ach-02', relationType: 'same_field' },
  { id: 'conn-5', achieverId: 'ach-07', relatedAchieverId: 'ach-15', relationType: 'same_field' },
  { id: 'conn-6', achieverId: 'ach-10', relatedAchieverId: 'ach-07', relationType: 'same_field' },
  { id: 'conn-7', achieverId: 'ach-01', relatedAchieverId: 'ach-12', relationType: 'same_field' },
  { id: 'conn-8', achieverId: 'ach-08', relatedAchieverId: 'ach-13', relationType: 'same_field' },
  { id: 'conn-9', achieverId: 'ach-09', relatedAchieverId: 'ach-13', relationType: 'same_field' },
  { id: 'conn-10', achieverId: 'ach-11', relatedAchieverId: 'ach-06', relationType: 'same_field' },
  { id: 'conn-11', achieverId: 'ach-14', relatedAchieverId: 'ach-15', relationType: 'same_industry' },
  { id: 'conn-12', achieverId: 'ach-17', relatedAchieverId: 'ach-02', relationType: 'same_university' }, // both DU professors
];

/* ─── Helper: get achievers by category ─── */

export function getAchieversByCategory(category: CategorySlug): Achiever[] {
  return ACHIEVERS.filter(a => a.category === category);
}

export function getCategoryBySlug(slug: CategorySlug): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getAchieverBySlug(slug: string): Achiever | undefined {
  return ACHIEVERS.find(a => a.slug === slug);
}

export function getAchieverById(id: string): Achiever | undefined {
  return ACHIEVERS.find(a => a.id === id);
}

export function getConnectionsForAchiever(achieverId: string): AchieverConnection[] {
  return CONNECTIONS.filter(
    c => c.achieverId === achieverId || c.relatedAchieverId === achieverId
  );
}

export function getFeaturedAchievers(): Achiever[] {
  return ACHIEVERS.filter(a => a.featured);
}

export function getAtlasStats() {
  const countries = new Set(ACHIEVERS.map(a => a.country));
  const fields = new Set(ACHIEVERS.map(a => a.category));
  const totalAwards = ACHIEVERS.reduce((sum, a) => sum + a.awards.length, 0);
  return {
    totalAchievers: ACHIEVERS.length,
    totalCountries: countries.size,
    totalFields: fields.size,
    totalAwards,
  };
}
