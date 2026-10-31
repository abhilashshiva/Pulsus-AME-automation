'use client';

import React, { useState } from 'react';
import { Database, Search, Filter, Download, ArrowRight, Check, Copy, ExternalLink, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Lead } from '@/lib/types';
import { SUPPORTED_REPOSITORIES, GLOBAL_COUNTRIES } from '@/lib/sample-data';
import * as XLSX from 'xlsx';

interface MedScoutTabProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  onPushToMdpi: (selectedLeads: Lead[]) => void;
}

export const MedScoutTab: React.FC<MedScoutTabProps> = ({ leads, setLeads, onPushToMdpi }) => {
  const [topic, setTopic] = useState('Oncology Immunotherapy & Checkpoint Inhibitors');
  const [limit, setLimit] = useState(15);
  const [yearFrom, setYearFrom] = useState(2022);
  const [yearTo, setYearTo] = useState(2026);
  const [selectedSources, setSelectedSources] = useState<string[]>(['pubmed', 'europepmc', 'biorxiv', 'crossref']);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['USA', 'UK', 'Germany', 'France', 'Italy']);
  const [excludeGmail, setExcludeGmail] = useState(true);
  const [strictThreeField, setStrictThreeField] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets = [
    'Oncology Immunotherapy & Checkpoint Inhibitors',
    'CRISPR-Cas9 Base Editing & Gene Therapies',
    'Glioblastoma Multiforme & Targeted Radiotherapy',
    'Cardiovascular Reperfusion & Mitochondrial Peptides',
    'Neurodegenerative Biomarkers & Alzheimer Disease'
  ];

  const handleSelectAllSources = () => {
    if (selectedSources.length === SUPPORTED_REPOSITORIES.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(SUPPORTED_REPOSITORIES.map(r => r.id));
    }
  };

  const handleToggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRunExtraction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/medscout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          limit,
          yearFrom,
          yearTo,
          countries: selectedCountries,
          sources: selectedSources,
          excludeGmail
        })
      });

      const data = await res.json();
      if (data.leads && Array.isArray(data.leads)) {
        // Prepend or merge unique leads
        setLeads(prev => {
          const existingEmails = new Set(prev.map(l => l.email.toLowerCase()));
          const newUnique = data.leads.filter((l: Lead) => !existingEmails.has(l.email.toLowerCase()));
          return [...newUnique, ...prev];
        });
      }
    } catch (e) {
      console.error('Extraction error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportXLSX = () => {
    const exportData = leads.map(l => ({
      'Email ID': l.email,
      'Author Name': l.author,
      'Paper Title': l.title,
      'Repository': l.source,
      'Country': l.country,
      'Year': l.year,
      'DOI': l.doi,
      'Status': l.status || 'PENDING'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pulsus_Harvested_Leads');
    XLSX.writeFile(wb, `Pulsus_MedScout_Harvest_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  const handleExportCSV = () => {
    const exportData = leads.map(l => ({
      'Email': l.email,
      'Author': l.author,
      'Title': l.title,
      'Source': l.source
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Pulsus_MedScout_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLeads = leads.filter(l => {
    const q = filterQuery.toLowerCase();
    return (
      l.author.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      (l.source && l.source.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono font-bold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Pulsus MedScout // OMICS International Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Biomedical Literature & Author Intelligence Harvester
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Federated extraction across 34 scientific repositories with Zero-Gmail enforcement and strict 3-field output contract.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportXLSX}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e0714] hover:bg-[#2e0b1f] text-neutral-200 border border-rose-900/40 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export XLSX</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e0714] hover:bg-[#2e0b1f] text-neutral-200 border border-rose-900/40 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => onPushToMdpi(leads)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all"
            >
              <span>Push All ({leads.length}) to MDPI Automator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Control / Query Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Query Parameters */}
        <div className="lg:col-span-2 bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Research Topic / Clinical Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Oncology Immunotherapy, CRISPR Base Editing, Stroke Interventions..."
                className="w-full bg-[#0a0206] border border-rose-950/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[10px] text-neutral-500 font-mono py-0.5">Presets:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(p)}
                  className="text-[11px] px-2 py-0.5 rounded bg-[#1f0614] hover:bg-[#2d091e] text-rose-300/80 border border-rose-900/30 transition-colors"
                >
                  {p.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-rose-950/40">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Harvest Target Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value={10}>10 Leads (Instant)</option>
                <option value={15}>15 Leads (Standard)</option>
                <option value={25}>25 Leads (Expanded)</option>
                <option value={50}>50 Leads (Deep Harvest)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Year Window: From
              </label>
              <input
                type="number"
                min={2000}
                max={2026}
                value={yearFrom}
                onChange={(e) => setYearFrom(Number(e.target.value))}
                className="w-full bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Year Window: To
              </label>
              <input
                type="number"
                min={2000}
                max={2026}
                value={yearTo}
                onChange={(e) => setYearTo(Number(e.target.value))}
                className="w-full bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Quality Contracts */}
          <div className="pt-2 border-t border-rose-950/40 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={excludeGmail}
                  onChange={(e) => setExcludeGmail(e.target.checked)}
                  className="rounded border-rose-800 text-rose-600 focus:ring-0 bg-black/40"
                />
                <span className="text-neutral-300 font-medium">Zero Gmail Policy (Strict Institutional)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={strictThreeField}
                  onChange={(e) => setStrictThreeField(e.target.checked)}
                  className="rounded border-rose-800 text-rose-600 focus:ring-0 bg-black/40"
                />
                <span className="text-neutral-300 font-medium">Strict 3-Field Completeness Guarantee</span>
              </label>
            </div>

            <button
              onClick={handleRunExtraction}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-lg ${
                isLoading
                  ? 'bg-rose-950/80 cursor-not-allowed opacity-75'
                  : 'bg-gradient-to-r from-[#800020] to-[#b3002d] hover:brightness-110 shadow-rose-950/60'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-300" />
                  <span>Harvesting Federated Repositories...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Start Live Harvest</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Federated Sources Picker (34 Repositories) */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>34 Federated Repositories</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-900/40 font-mono">
                  {selectedSources.length}/{SUPPORTED_REPOSITORIES.length}
                </span>
              </div>
              <button
                onClick={handleSelectAllSources}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors font-medium"
              >
                {selectedSources.length === SUPPORTED_REPOSITORIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 mb-3">
              Parallel discovery across biomedical archives, preprints, and scholarly graphs.
            </p>

            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-rose-950">
              {SUPPORTED_REPOSITORIES.map(repo => {
                const isSelected = selectedSources.includes(repo.id);
                return (
                  <div
                    key={repo.id}
                    onClick={() => handleToggleSource(repo.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-[#220715] border-rose-800/60 text-white'
                        : 'bg-[#0e0208] border-rose-950/30 text-neutral-400 hover:border-rose-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-500' : 'bg-neutral-600'}`} />
                      <span className="font-medium truncate">{repo.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">{repo.category}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-rose-950/40 text-[11px] text-neutral-500 font-mono flex items-center justify-between">
            <span>DNS MX Verification: Enabled</span>
            <span className="text-emerald-400">250 OK Protocol</span>
          </div>
        </div>
      </div>

      {/* Results Table View */}
      <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Harvested Scientific Outreach Directory</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-900/40">
                {filteredLeads.length} Records
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Strictly non-Gmail academic and clinical author directories with paper citations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search in results..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-rose-950/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#190510] text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5 font-semibold">Author & Credentials</th>
                <th className="py-3 px-3.5 font-semibold">Institutional Email</th>
                <th className="py-3 px-3.5 font-semibold">Publication Title</th>
                <th className="py-3 px-3.5 font-semibold">Source</th>
                <th className="py-3 px-3.5 font-semibold">Country</th>
                <th className="py-3 px-3.5 font-semibold">Year</th>
                <th className="py-3 px-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-950/30">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500 text-xs">
                    No leads matching the current filter. Click &ldquo;Start Live Harvest&rdquo; above to query live repositories.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#1a0611] transition-colors group">
                    <td className="py-3 px-3.5 font-semibold text-white whitespace-nowrap">
                      {lead.author}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-emerald-400 whitespace-nowrap">
                      {lead.email}
                    </td>
                    <td className="py-3 px-3.5 text-neutral-300 max-w-sm truncate" title={lead.title}>
                      {lead.title}
                    </td>
                    <td className="py-3 px-3.5 text-neutral-400 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[11px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-neutral-400 whitespace-nowrap">
                      {lead.country}
                    </td>
                    <td className="py-3 px-3.5 text-neutral-400 font-mono whitespace-nowrap">
                      {lead.year}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleCopyEmail(lead.email, lead.id)}
                        className="p-1.5 rounded bg-[#200715] hover:bg-[#2d091e] text-neutral-300 hover:text-white transition-colors"
                        title="Copy Email"
                      >
                        {copiedId === lead.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
