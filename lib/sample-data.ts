import { Lead, TemplateSlot, OutreachInstance } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    title: 'CRISPR-Cas9 Base Editing in Human Hematopoietic Stem Cells for Sickle Cell Disease',
    author: 'Dr. Sarah M. Jenkins',
    email: 'sjenkins@broadinstitute.harvard.edu',
    source: 'PubMed / NCBI',
    country: 'USA',
    year: 2025,
    doi: '10.1038/s41587-024-02311-x',
    journal: 'Nature Biotechnology',
    status: 'pending'
  },
  {
    id: 'lead-2',
    title: 'Immune Checkpoint Blockade and CAR-T Cell Synergies in Glioblastoma Multiforme',
    author: 'Prof. Alessandro Conti',
    email: 'alessandro.conti@humanitasresearch.it',
    source: 'Europe PMC',
    country: 'Italy',
    year: 2024,
    doi: '10.1016/j.cell.2024.08.019',
    journal: 'Cell Oncology & Therapeutics',
    status: 'pending'
  },
  {
    id: 'lead-3',
    title: 'Longitudinal Multi-Omics Profiling of Early Neurodegenerative Biomarkers in Cerebrospinal Fluid',
    author: 'Dr. Elena Rostova',
    email: 'elena.rostova@charite.de',
    source: 'bioRxiv',
    country: 'Germany',
    year: 2025,
    doi: '10.1101/2025.01.14.575231',
    journal: 'Annals of Clinical Neurology',
    status: 'pending'
  },
  {
    id: 'lead-4',
    title: 'Endovascular Thrombectomy Efficacy in Large Ischemic Stroke Beyond 24 Hours',
    author: 'Dr. Michael Chen-Wong',
    email: 'mchenwong@stanford.edu',
    source: 'PLOS ONE',
    country: 'USA',
    year: 2024,
    doi: '10.1371/journal.pone.0298412',
    journal: 'Journal of Stroke & Cerebrovascular Diseases',
    status: 'pending'
  },
  {
    id: 'lead-5',
    title: 'Structural Basis of Pan-Coronavirus Neutralizing Monoclonal Antibodies Targeting the S2 Subunit',
    author: 'Prof. Claire Fontaine',
    email: 'cfontaine@pasteur.fr',
    source: 'NIH / PubMed Central',
    country: 'France',
    year: 2025,
    doi: '10.1126/science.ade4312',
    journal: 'Science Translational Medicine',
    status: 'pending'
  },
  {
    id: 'lead-6',
    title: 'Targeting Mitochondrial Dysfunction in Cardiac Reperfusion Injury via Novel Peptides',
    author: 'Dr. David O\'Connor',
    email: 'doconnor@ox.ac.uk',
    source: 'OpenAlex',
    country: 'UK',
    year: 2024,
    doi: '10.1161/CIRCULATIONAHA.123.064512',
    journal: 'Circulation Research',
    status: 'pending'
  },
  {
    id: 'lead-7',
    title: 'Single-Cell Transcriptomics Unravels Macrophage Plasticity in Atherosclerotic Plaques',
    author: 'Dr. Sofia Ramos-Silva',
    email: 'sofia.silva@medicina.ulisboa.pt',
    source: 'Semantic Scholar',
    country: 'Spain',
    year: 2025,
    doi: '10.1093/cvr/cvae082',
    journal: 'Cardiovascular Research',
    status: 'pending'
  },
  {
    id: 'lead-8',
    title: 'Targeted Radioligand Therapy with Actinium-225 in Metastatic Castration-Resistant Prostate Cancer',
    author: 'Prof. Hans-Peter Ziegler',
    email: 'ziegler.h@dkfz-heidelberg.de',
    source: 'ScienceDirect',
    country: 'Germany',
    year: 2024,
    doi: '10.1016/S1470-2045(24)00215-9',
    journal: 'The Lancet Oncology',
    status: 'pending'
  },
  {
    id: 'lead-9',
    title: 'Synthetic Lethality Screen Identifies USP7 Inhibitors as Potent Vulnerabilities in TP53-Mutant Leukemia',
    author: 'Dr. Jonathan Ross',
    email: 'jross@sloan-kettering.csmc.edu',
    source: 'NIH / PubMed Central',
    country: 'USA',
    year: 2025,
    doi: '10.1182/blood.2024021943',
    journal: 'Blood Research & Therapeutics',
    status: 'pending'
  },
  {
    id: 'lead-10',
    title: 'Intestinal Microbiota Modulation of Anti-PD-1 Immunotherapy Outcomes in Advanced Melanoma',
    author: 'Dr. Beatrix van der Merwe',
    email: 'b.vandermerwe@nki.nl',
    source: 'medRxiv',
    country: 'Canada',
    year: 2024,
    doi: '10.1038/s41591-024-02941-w',
    journal: 'Nature Medicine',
    status: 'pending'
  }
];

export const DEFAULT_TEMPLATES: TemplateSlot[] = [
  {
    id: 'slot-1',
    title: 'Slot 1: Editorial Invitation (Official)',
    description: 'Formal peer-review submission request for clinical research papers',
    subject: 'Editorial Invitation: Research in {journal} — Following your publication "{title}"',
    htmlBody: `<p>Dear Dr. <b>{name}</b>,</p>
<p>I hope this email finds you well.</p>
<p>We recently came across your distinguished publication, "<b>{title}</b>", and greatly appreciated its notable contribution to clinical and translational science. On behalf of the editorial office of <b>{journal}</b>, we would welcome the opportunity to consider your latest research for publication in our upcoming regular issue.</p>
<p>If you have an ongoing investigation or a recently completed manuscript in your laboratory, we would be pleased to expedite its peer-review process.</p>
<p>Best regards,<br><b>Kevin Miller</b><br>Managing Editor<br><i>{short_journal}</i><br>Editorial Office & Review Council</p>`
  },
  {
    id: 'slot-2',
    title: 'Slot 2: Keynote / Speaker Invitation',
    description: 'Distinguished expert speaker and conference panelist invitation',
    subject: 'Distinguished Speaker Invitation — International Congress & {journal} Symposium',
    htmlBody: `<p>Dear Dr. <b>{name}</b>,</p>
<p>Greetings from the Scientific Advisory Council.</p>
<p>In light of your pioneering track record and your impactful recent research, "<b>{title}</b>", the organizing committee and the editorial board of <b>{journal}</b> cordially invite you to join as an invited speaker and submit your valuable work.</p>
<p>Your expertise would provide an invaluable perspective to our attending clinicians, laboratory directors, and peer researchers.</p>
<p>Sincerely,<br><b>Scientific Review Board</b><br>Symposium Directorate<br><i>{short_journal}</i></p>`
  },
  {
    id: 'slot-3',
    title: 'Slot 3: Advisory Board & Special Issue',
    description: 'Special topic issue guest editor or contributor invitation',
    subject: 'Special Issue Call for Papers: High-Impact Advances in {journal}',
    htmlBody: `<p>Dear Dr. <b>{name}</b>,</p>
<p>I trust you are having a productive week.</p>
<p>We are reaching out regarding your valuable contributions to "<b>{title}</b>". <b>{journal}</b> is currently assembling a curated themed issue highlighting groundbreaking methodologies and clinical paradigms in your therapeutic domain.</p>
<p>Given your authoritative work in this area, we would deeply appreciate the privilege of receiving an original article, clinical trial report, or comprehensive review from your group.</p>
<p>Warm regards,<br><b>Editorial Directorate</b><br>Review Council<br><i>{short_journal}</i></p>`
  }
];

export const DEFAULT_INSTANCES: OutreachInstance[] = [
  {
    id: 'instance-1',
    label: 'Instance 1',
    email: 'editorial.office1@pulsus-journal.org',
    displayName: 'Zoho Mail Primary (Pulsus Dispatcher)',
    connected: true,
    sentToday: 18,
    dailyLimit: 120,
    rateDelaySec: 22,
    active: true
  },
  {
    id: 'instance-2',
    label: 'Instance 2',
    email: 'submissions.coordinator@pulsus-review.org',
    displayName: 'Zoho Mail Secondary (Mimic Stealth)',
    connected: true,
    sentToday: 12,
    dailyLimit: 120,
    rateDelaySec: 28,
    active: true
  },
  {
    id: 'instance-3',
    label: 'Instance 3',
    email: 'executive.editor@pulsus-scientific.org',
    displayName: 'Zoho Mail Tertiary (Special Issues)',
    connected: false,
    sentToday: 0,
    dailyLimit: 120,
    rateDelaySec: 25,
    active: false
  }
];

export const SUPPORTED_REPOSITORIES = [
  { id: 'pubmed', name: 'PubMed / NCBI', category: 'Biomedical', mode: 'Entrez eUtils' },
  { id: 'europepmc', name: 'Europe PMC', category: 'Biomedical', mode: 'REST Core API' },
  { id: 'biorxiv', name: 'bioRxiv', category: 'Preprints', mode: 'Cold Spring Harbor' },
  { id: 'medrxiv', name: 'medRxiv', category: 'Preprints', mode: 'Health Sci API' },
  { id: 'plos', name: 'PLOS ONE', category: 'Biomedical', mode: 'PLOS Search' },
  { id: 'crossref', name: 'Crossref', category: 'Global', mode: 'DOI Registry' },
  { id: 'openalex', name: 'OpenAlex', category: 'Global', mode: '250M+ Scholar Graph' },
  { id: 'arxiv', name: 'arXiv.org', category: 'Preprints', mode: 'e-Print API' },
  { id: 'semanticscholar', name: 'Semantic Scholar', category: 'Global', mode: 'AI Graph API' },
  { id: 'sciencedirect', name: 'ScienceDirect', category: 'Global', mode: 'Elsevier OA' },
  { id: 'elife', name: 'eLife', category: 'Biomedical', mode: 'Life Sciences API' },
  { id: 'imedpub', name: 'iMedPub Group', category: 'Biomedical', mode: 'Clinical Journals' },
  { id: 'pmc', name: 'PMC (PubMed Central)', category: 'Biomedical', mode: 'NIH NLM Full-Text' },
  { id: 'mdpi', name: 'MDPI Publications', category: 'Biomedical', mode: 'MDPI Engine' },
  { id: 'frontiers', name: 'Frontiers in Medicine', category: 'Biomedical', mode: 'Frontiers Index' },
  { id: 'bmc', name: 'BioMed Central (BMC)', category: 'Biomedical', mode: 'Springer Nature' },
  { id: 'f1000', name: 'F1000Research', category: 'Biomedical', mode: 'Open Research' },
  { id: 'doaj', name: 'DOAJ Index', category: 'Global', mode: 'Directory OA' },
  { id: 'core', name: 'CORE OA', category: 'Global', mode: 'Global Repositories' },
  { id: 'zenodo', name: 'Zenodo', category: 'Preprints', mode: 'CERN Repository' },
  { id: 'chemrxiv', name: 'ChemRxiv', category: 'Preprints', mode: 'ACS Chem Sciences' },
  { id: 'peerj', name: 'PeerJ', category: 'Biomedical', mode: 'Biological Sci' },
  { id: 'springer', name: 'Springer Open', category: 'Global', mode: 'Springer Nature' },
  { id: 'taylor', name: 'Taylor & Francis OA', category: 'Global', mode: 'T&F Engine' },
  { id: 'hindawi', name: 'Hindawi', category: 'Biomedical', mode: 'OA Archive' },
  { id: 'preprints_org', name: 'Preprints.org', category: 'Preprints', mode: 'Multidisciplinary' },
  { id: 'osf', name: 'OSF Preprints', category: 'Preprints', mode: 'Center for Open Sci' },
  { id: 'ssrn', name: 'SSRN Health', category: 'Preprints', mode: 'Social Sci & Health' },
  { id: 'scielo', name: 'SciELO', category: 'Global', mode: 'Global Network' },
  { id: 'hal', name: 'HAL Open Archive', category: 'Global', mode: 'French National Archive' },
  { id: 'base', name: 'BASE Search', category: 'Global', mode: 'Bielefeld Engine' },
  { id: 'researchgate', name: 'ResearchGate Index', category: 'Global', mode: 'Academic Index' },
  { id: 'eartharxiv', name: 'EarthArXiv', category: 'Preprints', mode: 'Planetary Archive' },
  { id: 'essoar', name: 'ESSOAr', category: 'Preprints', mode: 'Space & Earth' }
];

export const GLOBAL_COUNTRIES = [
  'USA', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Canada', 'Australia',
  'Japan', 'Netherlands', 'Sweden', 'Switzerland', 'Belgium', 'Denmark',
  'Norway', 'Austria', 'Finland', 'Ireland', 'New Zealand', 'Singapore',
  'South Korea', 'Brazil', 'Mexico', 'Israel', 'Poland', 'Portugal',
  'Czech Republic', 'Greece', 'Chile', 'Argentina', 'South Africa'
];
