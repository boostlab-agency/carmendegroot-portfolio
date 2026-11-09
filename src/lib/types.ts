export type ProjectStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  path?: string | null;
  alt: string;
  caption?: string | null;
  sortOrder: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  intro: string;
  body: string;
  challenge: string;
  approach: string;
  result: string;
  coverImage: string | null;
  coverAlt: string;
  images: ProjectImage[];
  tags: string[];
  date: string; // ISO yyyy-mm-dd
  category: Category | null;
  client: string;
  role: string;
  duration: string;
  team: string;
  seoTitle: string;
  seoDescription: string;
  status: ProjectStatus;
  featured: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  keywords: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  availableForWork: boolean;
  socials: LinkItem[];
  cvUrl: string;
  portraitUrl: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  organisation: string;
  description: string;
}

export interface ToolItem {
  name: string;
  level: number; // 0–4, steps of 0.5
}

export interface HomeContent {
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  facts: { label: string; value: string }[];
  marquee: string[];
  approachEyebrow: string;
  approachTitle: string;
  approachText: string;
  approachSteps: { title: string; text: string }[];
  featuredTitle: string;
  featuredText: string;
  skillsTitle: string;
  skillsText: string;
  experienceTitle: string;
  educationTitle: string;
  testimonialsTitle: string;
  testimonials: { quote: string; name: string; role: string }[];
  contactTitle: string;
  contactText: string;
  contactCtaLabel: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  lead: string;
  story: string; // markdown
  principles: { title: string; text: string }[];
  knowledgeTitle: string;
  knowledgeAreas: { title: string; text: string }[];
  careerTitle: string;
  cvTitle: string;
  cvText: string;
}

export interface CvContent {
  profile: string;
  skills: string[];
  tools: ToolItem[];
  experience: TimelineItem[];
  education: TimelineItem[];
  otherExperience: string[];
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  intro: string;
  formTitle: string;
  responseNote: string;
  successMessage: string;
}

export interface PageContentMap {
  home: HomeContent;
  about: AboutContent;
  cv: CvContent;
  contact: ContactContent;
}

export type PageKey = keyof PageContentMap;

export interface PageRecord<K extends PageKey = PageKey> {
  key: K;
  title: string;
  content: PageContentMap[K];
  seoTitle: string;
  seoDescription: string;
  updatedAt: string | null;
}
