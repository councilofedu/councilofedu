/**
 * Types for Council for Mathematics Education
 */

export interface MembershipApplication {
  id: string;
  serialNo: string;
  membershipType: 'Life' | 'General' | 'International';
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  qualification: string;
  affiliation: string;
  contactAddress: string;
  mobileNo: string;
  officeContactNo?: string;
  email: string;
  institution: string;
  designation: string;
  institutionPhone?: string;
  institutionEmail?: string;
  proposedBy?: string;
  proposedAddress?: string;
  proposedDesignation?: string;
  proposedDate?: string;
  paymentMethod: 'QR Code' | 'Bank Transfer' | 'Money Order' | 'Draft';
  voucherNo: string;
  paymentDate: string;
  photoUrl?: string; // Base64 or placeholder URL
  voucherUrl?: string; // Base64 or placeholder URL
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  membershipId?: string; // Generated on approval, e.g., CME-L-2026-0042
}

export interface TeamMember {
  id: string;
  fullName: string;
  role: string; // e.g. "President", "Secretary", "CEO", "Member"
  category: 'Executive Committee' | 'Advisory Board' | 'General Members' | 'Staff';
  bio: string; // e.g., "A complete digital Teacher"
  affiliation: string; // e.g., "Try For Learn"
  email: string;
  phone: string;
  photoUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface InquiryMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  img: string;
  tag: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonLink?: string;
  buttonText?: string;
}

export interface SiteSettings {
  homeTitle: string;
  homeSubtitle: string;
  homeNoticeBanner: string;
  aboutHomeTitle: string;
  aboutHomeText: string;
  ctaButtonText: string;
  supportEmail: string;
  supportPhone: string;
  slides?: HeroSlide[];
  headerTitle?: string;
  headerSubtitle?: string;
  footerDescription?: string;
  footerRegd?: string;
  footerAddress?: string;
  footerCopyright?: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmails?: string;
  contactOfficeHours?: string;
  contactMapEmbed?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  status: 'Published' | 'Draft';
  date: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  affiliation: string;
  message: string;
  rating: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  target: string;
  order?: number;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  type: string;
  published: string;
  size: string;
  fileUrl?: string;
  order?: number;
}

