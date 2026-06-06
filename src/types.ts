export interface Project {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
  tech: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  pipeline?: string[];
  metrics?: { label: string; count: string; color?: string }[];
  team?: { name: string; isUser: boolean }[];
  guide?: string;
  coordinator?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  icon: string;
  credentialId?: string;
  url?: string;
  image?: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  org: string;
  desc: string;
  tags: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  inst: string;
  year: string;
  score: string;
}
