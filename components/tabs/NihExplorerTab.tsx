'use client';

import React, { useState } from 'react';
import { Globe, Search, ExternalLink, ArrowRight, BookOpen, Check, Award, RefreshCw, FileText } from 'lucide-react';
import { Lead } from '@/lib/types';

interface NihExplorerTabProps {
  onAddLeadsToPipeline: (newLeads: Lead[]) => void;
}

export const NihExplorerTab: React.FC<NihExplorerTabProps> = ({ onAddLeadsToPipeline }) => {
  const [query, setQuery] = useState('CRISPR Cas9 OR Oncology Immunotherapy');
  const [grantId, setGrantId] = useState('');
  const [meshTerm, setMeshTerm] = useState('Neoplasms');
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [nihLeads, setNihLeads] = useState<Lead[]>([
    {
      id: 'nih-init-1',
      title: 'Genomic Profiling and Targeted Inhibition in High-Grade Glioblastoma Multiforme (NIH R01-CA24591)',
      author: 'Dr. Rebecca Stern',
      email: 'r.stern@mskcc.nih.gov',
      source: 'NIH / PubMed Central',
      country: 'USA',
      year: 2025,
      doi: '10.1056/NEJMoa240192',
      journal: 'New England Journal of Medicine (NIH Grant)',
      status: 'pending'
    },
    {
      id: 'nih-init-2',
      title: 'Phase II Randomized Trial of Dual Kinase Inhibition in Metastatic Triple-Negative Breast Cancer',
      author: 'Prof. Marcus Vance',
      email: 'mvance@jhmi.edu',
      source: 'NIH / ClinicalTrials.gov',
      country: 'USA',
      year: 2024,
      doi: '10.1200/JCO.24.00412',
      journal: 'Journal of Clinical Oncology',
      status: 'pending'
    },
    {
      id: 'nih-init-3',
      title: 'High-Throughput Proteomics Discovers Circulating Biomarkers of Diabetic Cardiomyopathy',
      author: 'Dr. Kimberly Adams',
      email: 'kimberly.adams@nih.gov',
      source: 'NIH / NHLBI Archive',
      country: 'USA',
      year: 2025,
      doi: '10.1161/CIRCULATIONAHA.124.068912',
      journal: 'Circulation',
      status: 'pending'
    }
  ]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleSearchNih = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/nih-explorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, grantId, meshTerm, limit })
      });
      const data = await res.json();
      if (data.leads && Array.isArray(data.leads)) {
        setNihLeads(data.leads);
      }
    } catch (e) {
      console.error('NIH search error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushAll = () => {
    onAddLeadsToPipeline(nihLeads);
    setAddedIds(new Set(nihLeads.map(l => l.id)));
  };

  const handlePushSingle = (lead: Lead) => {
    onAddLeadsToPipeline([lead]);
    setAddedIds(prev => new Set([...prev, lead.id]));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40 text-amber-300 text-xs font-mono font-bold mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>NIH National Institutes of Health / NCBI Entrez</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              NIH Research Explorer & Principal Investigator Directory
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Live intelligence mining across NIH grants, ClinicalTrials.gov registries, and PubMed Central peer-reviewed investigations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePushAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 text-black font-extrabold text-xs shadow-md shadow-amber-950/50 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Import All to Campaign Pipeline ({nihLeads.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Query Engine */}
      <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              PubMed / NIH Search Query
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Immunotherapy, Glioblastoma, Stem Cells, CRISPR..."
                className="w-full bg-[#0a0206] border border-rose-950/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              NIH Grant # (Optional)
            </label>
            <input
              type="text"
              value={grantId}
              onChange={(e) => setGrantId(e.target.value)}
              placeholder="e.g. R01-CA, U01, P30..."
              className="w-full bg-[#0a0206] border border-rose-950/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-rose-950/40">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              MeSH Term Filter
            </label>
            <select
              value={meshTerm}
              onChange={(e) => setMeshTerm(e.target.value)}
              className="w-full bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Neoplasms">Neoplasms / Oncology</option>
              <option value="Cardiovascular Diseases">Cardiovascular Diseases</option>
              <option value="Nervous System Diseases">Nervous System Diseases</option>
              <option value="Immunologic Deficiency Syndromes">Immunology & Infectious Disease</option>
              <option value="Genetic Therapy">Gene Therapy & Genetics</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              Results Limit
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value={5}>5 Publications</option>
              <option value={10}>10 Publications</option>
              <option value={20}>20 Publications</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearchNih}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting Entrez API...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Query NIH Entrez</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Discovered NIH Papers & Authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nihLeads.map((item) => {
          const isAdded = addedIds.has(item.id);
          return (
            <div
              key={item.id}
              className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-700/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2 font-mono">
                  <span className="text-amber-400 font-semibold">{item.source}</span>
                  <span>{item.year}</span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <div className="mt-3 p-3 rounded-xl bg-[#090205] border border-rose-950/40 space-y-1">
                  <div className="text-xs font-semibold text-rose-300">{item.author}</div>
                  <div className="text-xs font-mono text-emerald-400 truncate">{item.email}</div>
                  <div className="text-[11px] text-neutral-400 italic truncate">{item.journal}</div>
                </div>

                {item.doi && (
                  <div className="mt-2 text-[10px] font-mono text-neutral-500 truncate">
                    DOI: {item.doi}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-rose-950/40 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">United States (NIH)</span>
                <button
                  onClick={() => handlePushSingle(item)}
                  disabled={isAdded}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isAdded
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40'
                      : 'bg-[#210714] hover:bg-[#310b1f] text-neutral-200 border border-rose-900/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Imported</span>
                    </>
                  ) : (
                    <>
                      <span>Import Lead</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
