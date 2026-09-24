/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  liveDemo: string;
  github: string;
  category: 'Full-stack' | 'Frontend' | 'System' | 'Creative';
  caseStudy: {
    challenge: string;
    solution: string;
    results: string[];
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  description: string[];
  skillsLearned: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: { name: string; level: number; icon: string }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  priceEstimate: string;
  deliverables: string[];
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
  badgeColor: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
  topic?: string;
}

export interface AdminUser {
  username: string;
  email: string;
  role: string;
  lastLogin?: string;
}
