export interface SiteSettings {
  churchName: string;
  tagline: string;
  affiliation: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  worshipTimes: {
    title: string;
    day: string;
    time: string;
    description: string;
  }[];
  scriptureHighlight: {
    verse: string;
    reference: string;
    theme: string;
  };
  giving: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    sortCode?: string;
    onlineGivingUrl?: string;
    notes: string;
  };
  socialLinks: {
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  date: string;
  photographer?: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  series: string;
  thumbnailUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  description: string;
  transcript?: string;
  isFeatured: boolean;
  duration?: string;
}

export interface Event {
  id: string;
  title: string;
  coverImage: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  organizer: string;
  registrationLink?: string;
  contact?: string;
  isFeatured: boolean;
  category: string;
  isPublished: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  description: string;
  purpose: string;
  meetingTime: string;
  leader: string;
  contact: string;
  category: string;
  order: number;
}

export interface Leadership {
  id: string;
  name: string;
  role: string;
  category: "Pastoral" | "Deacons" | "Ministers" | "Heads";
  bio: string;
  image: string;
  phone?: string;
  email?: string;
  order: number;
  isSeniorLeader: boolean;
}

export interface PrayerRequest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  request: string;
  isAnonymous: boolean;
  preferredContact?: string;
  category: string;
  status: "unread" | "prayed" | "archived";
  pastoralNotes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "superadmin" | "content_admin" | "staff";
  createdAt: string;
}
