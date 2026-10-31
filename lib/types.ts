export interface Lead {
  id: string;
  title: string;
  author: string;
  email: string;
  source?: string;
  country?: string;
  year?: number | string;
  doi?: string;
  journal?: string;
  status?: 'pending' | 'sending' | 'sent' | 'failed' | 'paused';
  sentAt?: string;
  templateUsed?: string;
  instanceUsed?: string;
  error?: string;
}

export interface ExtractionFilter {
  topic: string;
  countries: string[];
  docTypes: string[];
  yearFrom: number;
  yearTo: number;
  limit: number;
  selectedSources: string[];
  excludeGmail: boolean;
  strictThreeField: boolean;
}

export interface HygieneStats {
  rawCount: number;
  dedupedCount: number;
  gmailRemoved: number;
  numericPrefixRemoved: number;
  tldRemoved: number;
  lengthFiltered: number;
  finalCleanCount: number;
  processedAt: string;
}

export interface TemplateSlot {
  id: string;
  title: string;
  description: string;
  subject: string;
  htmlBody: string;
}

export interface OutreachInstance {
  id: string;
  label: string;
  email: string;
  displayName: string;
  connected: boolean;
  sentToday: number;
  dailyLimit: number;
  rateDelaySec: number;
  active: boolean;
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'stealth';
  message: string;
  instance?: string;
  recipient?: string;
}
