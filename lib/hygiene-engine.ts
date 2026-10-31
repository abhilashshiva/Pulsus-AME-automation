import { Lead, HygieneStats } from './types';

export const RESTRICTED_TLDS = ['.in', '.pk', '.ir', '.iq', '.et', '.bd', '.ng', '.tw'];

export interface CleanResult {
  cleanedLeads: Lead[];
  stats: HygieneStats;
  rejected: {
    lead: Partial<Lead>;
    reason: string;
  }[];
}

/**
 * Runs the MDPI Campaign Automator 7-Rule Data Hygiene Pipeline:
 * 1. Column ordering: Email, Author, Title
 * 2. Deduplication strictly on Email
 * 3. Removal of @gmail.com addresses
 * 4. Removal of emails starting with numbers (0-9)
 * 5. Removal of specified country TLDs (.in, .pk, .ir, .iq, .et, .bd, .ng, .tw)
 * 6. Length filter: Email & Author character length strictly between 5 and 39
 * 7. Alphabetical sorting A-Z by Email
 */
export function runDataHygienePipeline(rawLeads: Partial<Lead>[]): CleanResult {
  const rejected: { lead: Partial<Lead>; reason: string }[] = [];
  const rawCount = rawLeads.length;

  let gmailRemoved = 0;
  let numericPrefixRemoved = 0;
  let tldRemoved = 0;
  let lengthFiltered = 0;
  let dedupedCount = 0;

  // Step 1 & 2: Normalize and Deduplicate by Email
  const seenEmails = new Set<string>();
  const intermediateList: Lead[] = [];

  for (const raw of rawLeads) {
    const email = (raw.email || '').trim().toLowerCase();
    const author = (raw.author || '').trim();
    const title = (raw.title || '').trim();

    if (!email || !author || !title) {
      rejected.push({ lead: raw, reason: 'Missing required field (Strict 3-Field check)' });
      continue;
    }

    if (seenEmails.has(email)) {
      dedupedCount++;
      rejected.push({ lead: raw, reason: 'Duplicate email address' });
      continue;
    }
    seenEmails.add(email);

    // Rule 3: Gmail Exclusion
    if (email.endsWith('@gmail.com') || email.includes('gmail.')) {
      gmailRemoved++;
      rejected.push({ lead: raw, reason: 'Excluded: @gmail.com consumer domain' });
      continue;
    }

    // Rule 4: Numeric Prefix Filter
    if (/^[0-9]/.test(email)) {
      numericPrefixRemoved++;
      rejected.push({ lead: raw, reason: 'Excluded: Email starts with a numeric digit' });
      continue;
    }

    // Rule 5: Restricted TLDs
    const isRestrictedTld = RESTRICTED_TLDS.some(tld => email.endsWith(tld));
    if (isRestrictedTld) {
      tldRemoved++;
      rejected.push({ lead: raw, reason: 'Excluded: Restricted regional TLD' });
      continue;
    }

    // Rule 6: Length filter (Email and Author between 5 and 39 characters)
    if (email.length < 5 || email.length >= 40) {
      lengthFiltered++;
      rejected.push({ lead: raw, reason: `Excluded: Email length ${email.length} not in [5, 39]` });
      continue;
    }

    if (author.length < 5 || author.length >= 40) {
      lengthFiltered++;
      rejected.push({ lead: raw, reason: `Excluded: Author length ${author.length} not in [5, 39]` });
      continue;
    }

    // Passed all hygiene tests!
    intermediateList.push({
      id: raw.id || `lead-${Math.random().toString(36).substring(2, 9)}`,
      email,
      author,
      title,
      source: raw.source || 'MDPI / External Import',
      country: raw.country || 'Global',
      year: raw.year || 2025,
      doi: raw.doi || '',
      journal: raw.journal || 'Academic Journal',
      status: 'pending'
    });
  }

  // Rule 7: Sort A -> Z by Email
  intermediateList.sort((a, b) => a.email.localeCompare(b.email));

  const stats: HygieneStats = {
    rawCount,
    dedupedCount,
    gmailRemoved,
    numericPrefixRemoved,
    tldRemoved,
    lengthFiltered,
    finalCleanCount: intermediateList.length,
    processedAt: ''
  };

  return {
    cleanedLeads: intermediateList,
    stats,
    rejected
  };
}

/**
 * Parses raw text input (TSV, CSV, or line-separated) into partial Lead objects.
 */
export function parseRawLeadsInput(rawText: string): Partial<Lead>[] {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const leads: Partial<Lead>[] = [];

  for (const line of lines) {
    // Delimiter check: tab, semicolon, or comma
    let parts: string[] = [];
    if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim());
    } else if (line.includes(';')) {
      parts = line.split(';').map(p => p.trim());
    } else if (line.includes(',')) {
      parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
    }

    if (parts.length >= 3) {
      // Check if email is in pos 0, 1, or 2
      let email = '';
      let author = '';
      let title = '';

      for (const part of parts) {
        if (!email && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(part)) {
          email = part;
        }
      }

      if (email) {
        const remaining = parts.filter(p => p !== email);
        author = remaining[0] || 'Unknown Author';
        title = remaining.slice(1).join(' - ') || 'Research Manuscript';
      } else {
        // Fallback to default ordering [Email, Author, Title] or [Title, Author, Email]
        if (parts[2].includes('@')) {
          title = parts[0];
          author = parts[1];
          email = parts[2];
        } else {
          email = parts[0];
          author = parts[1];
          title = parts[2];
        }
      }

      leads.push({ email, author, title });
    } else if (line.includes('@')) {
      // Single line with email embedded
      const emailMatch = line.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/);
      if (emailMatch) {
        const email = emailMatch[0];
        const rest = line.replace(email, '').trim().replace(/^[-–|,;: ]+|[-–|,;: ]+$/g, '');
        leads.push({
          email,
          author: rest.split(/[-–|]/)[0]?.trim() || 'Corresponding Author',
          title: rest.split(/[-–|]/)[1]?.trim() || 'Medical & Life Sciences Study'
        });
      }
    }
  }

  return leads;
}
