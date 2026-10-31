'use client';

import React, { useState } from 'react';
import { ShieldCheck, Filter, Download, ArrowRight, Upload, Trash2, CheckCircle2, AlertTriangle, FileSpreadsheet, Sparkles } from 'lucide-react';
import { Lead, HygieneStats } from '@/lib/types';
import { runDataHygienePipeline, parseRawLeadsInput, RESTRICTED_TLDS } from '@/lib/hygiene-engine';
import * as XLSX from 'xlsx';

interface MdpiAutomatorTabProps {
  rawLeads: Lead[];
  cleanLeads: Lead[];
  setCleanLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  onPushToZoho: (leads: Lead[]) => void;
}

export const MdpiAutomatorTab: React.FC<MdpiAutomatorTabProps> = ({
  rawLeads,
  cleanLeads,
  setCleanLeads,
  onPushToZoho
}) => {
  const [inputText, setInputText] = useState('');
  const [stats, setStats] = useState<HygieneStats | null>(null);
  const [rejectedItems, setRejectedItems] = useState<{ lead: Partial<Lead>; reason: string }[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'clean' | 'rules' | 'rejected'>('clean');

  // Run hygiene on raw leads in state or text
  const handleExecuteHygiene = (inputList?: Partial<Lead>[]) => {
    let listToClean = inputList;

    if (!listToClean) {
      if (inputText.trim()) {
        listToClean = parseRawLeadsInput(inputText);
      } else {
        listToClean = rawLeads;
      }
    }

    const result = runDataHygienePipeline(listToClean);
    setCleanLeads(result.cleanedLeads);
    setStats(result.stats);
    setRejectedItems(result.rejected);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: unknown[] = XLSX.utils.sheet_to_json(ws);

        // Map columns
        const parsed: Partial<Lead>[] = (data as Record<string, unknown>[]).map(row => {
          const email = String(row['Email'] || row['email'] || row['Email ID'] || '');
          const author = String(row['Author'] || row['author'] || row['Author Name'] || '');
          const title = String(row['Title'] || row['title'] || row['Paper Title'] || '');
          return { email, author, title };
        });

        handleExecuteHygiene(parsed);
      } catch (err) {
        console.error('File parse error:', err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExportTwoSheetExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Raw Data
    const rawDataRows = rawLeads.map(l => ({
      'Raw Email': l.email,
      'Raw Author': l.author,
      'Raw Title': l.title,
      'Source': l.source || 'External'
    }));
    const rawWs = XLSX.utils.json_to_sheet(rawDataRows);
    XLSX.utils.book_append_sheet(wb, rawWs, 'Raw Data');

    // Sheet 2: final sheet (Col A: Email, Col B: Author, Col C: Title)
    const cleanDataRows = cleanLeads.map(l => ({
      'Email': l.email,
      'Author': l.author,
      'Title': l.title
    }));
    const cleanWs = XLSX.utils.json_to_sheet(cleanDataRows);
    XLSX.utils.book_append_sheet(wb, cleanWs, 'final sheet');

    const filename = `MDPI_Cleaned_Campaign_${new Date().toISOString().substring(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 text-xs font-mono font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MDPI Campaign Automator // Data Hygiene Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Automated 7-Rule Data Sanitization & Campaign Registry
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Replaces manual Word macros with deterministic deduplication, consumer domain purging, and strict column formatting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportTwoSheetExcel}
              disabled={cleanLeads.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e0714] hover:bg-[#2e0b1f] text-neutral-200 border border-rose-900/40 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export 2-Sheet Excel (Raw + Clean)</span>
            </button>
            <button
              onClick={() => onPushToZoho(cleanLeads)}
              disabled={cleanLeads.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-700 to-rose-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-rose-950/50 transition-all disabled:opacity-50"
            >
              <span>Transfer ({cleanLeads.length}) to Zoho Mail Porter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hygiene Audit Statistics Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-[#12040b] border border-rose-950/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-neutral-500 uppercase">1. Raw Total</div>
            <div className="text-lg font-bold text-white mt-0.5">{stats.rawCount}</div>
          </div>
          <div className="bg-[#12040b] border border-rose-950/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-amber-500 uppercase">2. Deduped</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">-{stats.dedupedCount}</div>
          </div>
          <div className="bg-[#12040b] border border-rose-950/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-rose-500 uppercase">3. Gmails Purged</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">-{stats.gmailRemoved}</div>
          </div>
          <div className="bg-[#12040b] border border-rose-950/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-purple-500 uppercase">4. Numeric Prefixes</div>
            <div className="text-lg font-bold text-purple-400 mt-0.5">-{stats.numericPrefixRemoved}</div>
          </div>
          <div className="bg-[#12040b] border border-rose-950/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-orange-500 uppercase">5. Restricted TLDs</div>
            <div className="text-lg font-bold text-orange-400 mt-0.5">-{stats.tldRemoved}</div>
          </div>
          <div className="bg-[#12040b] border border-rose-950/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-neutral-500 uppercase">6. Length Bounds</div>
            <div className="text-lg font-bold text-neutral-400 mt-0.5">-{stats.lengthFiltered}</div>
          </div>
          <div className="bg-[#07190e] border border-emerald-900/60 rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">7. Clean Registry</div>
            <div className="text-lg font-extrabold text-emerald-300 mt-0.5">{stats.finalCleanCount}</div>
          </div>
        </div>
      )}

      {/* Input / Control Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Sources */}
        <div className="lg:col-span-2 bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ingest Raw Author Records
            </h3>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#210714] hover:bg-[#310b1f] text-neutral-200 border border-rose-900/40 transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload XLSX / CSV</span>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={() => handleExecuteHygiene()}
                className="text-xs flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-all shadow-md shadow-emerald-950/40"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Execute 7-Rule Hygiene</span>
              </button>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            placeholder={`Paste raw author lines here or leave blank to process the ${rawLeads.length} leads harvested by MedScout & NIH Explorer.\nFormat: Email [Tab / Comma] Author [Tab / Comma] Title\nExample: sjenkins@broadinstitute.harvard.edu \t Dr. Sarah Jenkins \t CRISPR Cas9 Base Editing`}
            className="w-full bg-[#0a0206] border border-rose-950/80 rounded-xl p-3 text-xs text-neutral-200 font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-rose-950/40">
            <span>
              Ingestion pool: <strong className="text-white">{rawLeads.length} leads</strong> from MedScout
            </span>
            <button
              onClick={() => {
                setInputText('');
                handleExecuteHygiene(rawLeads);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Sync MedScout Pipeline Leads →
            </button>
          </div>
        </div>

        {/* Right: The 7 Rules Blueprint */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>MDPI 7-Rule Data Contract</span>
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">1. Strict Columns:</span> Col A = Email, Col B = Author, Col C = Title
            </div>
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">2. Email Dedup:</span> Retains first occurrence, strips duplicate addresses
            </div>
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">3. Zero Gmail:</span> Purges consumer <code className="text-rose-300">@gmail.com</code> domains
            </div>
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">4. Numeric Filter:</span> Drops emails beginning with numeric digits (0–9)
            </div>
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">5. TLD Purge:</span> Drops <code className="text-amber-300">.in, .pk, .ir, .iq, .et, .bd, .ng, .tw</code>
            </div>
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">6. Length Filter:</span> Restricts Email & Author character length to [5, 39]
            </div>
            <div className="p-2 rounded-lg bg-[#0d0207] border border-rose-950/40">
              <span className="font-semibold text-rose-400">7. A → Z Sort:</span> Alphabetical sorting by email address
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab view: Clean Results vs Rejected Audits */}
      <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-950/50 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSubTab('clean')}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'clean'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Clean Campaign Registry ({cleanLeads.length})
            </button>
            <button
              onClick={() => setActiveSubTab('rejected')}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                activeSubTab === 'rejected'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Rejected Audit Log ({rejectedItems.length})
            </button>
          </div>

          <span className="text-xs font-mono text-neutral-500">
            A-Z Alphabetized by Col A
          </span>
        </div>

        {activeSubTab === 'clean' ? (
          <div className="overflow-x-auto rounded-xl border border-rose-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#190510] text-neutral-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-emerald-400">Col A: Email</th>
                  <th className="py-3 px-4 font-semibold">Col B: Author</th>
                  <th className="py-3 px-4 font-semibold">Col C: Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-950/30">
                {cleanLeads.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-neutral-500 text-xs">
                      No cleaned leads yet. Click &ldquo;Execute 7-Rule Hygiene&rdquo; to process the raw records.
                    </td>
                  </tr>
                ) : (
                  cleanLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#1a0611] transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold whitespace-nowrap">
                        {lead.email}
                      </td>
                      <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                        {lead.author}
                      </td>
                      <td className="py-3 px-4 text-neutral-300 max-w-lg truncate" title={lead.title}>
                        {lead.title}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-rose-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#190510] text-neutral-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-rose-400">Exclusion Reason</th>
                  <th className="py-3 px-4 font-semibold">Flagged Email</th>
                  <th className="py-3 px-4 font-semibold">Author Candidate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-950/30">
                {rejectedItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-neutral-500 text-xs">
                      No rejected entries recorded.
                    </td>
                  </tr>
                ) : (
                  rejectedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1a0611] transition-colors">
                      <td className="py-3 px-4 text-rose-400 font-semibold whitespace-nowrap">
                        {item.reason}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-400 whitespace-nowrap">
                        {item.lead.email || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                        {item.lead.author || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
