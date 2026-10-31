'use client';

import React from 'react';
import { Database, Filter, Send, Globe, CheckCircle, ArrowUpRight, Flame, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { Lead } from '@/lib/types';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  totalLeads: number;
  cleanLeads: number;
  sentLeads: number;
  recentLeads: Lead[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  totalLeads,
  cleanLeads,
  sentLeads,
  recentLeads
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d0612] via-[#12030a] to-[#080204] border border-rose-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/50 text-rose-300 text-xs font-semibold mb-4">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>OMICS International & Pulsus Group Clinical Outreach Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Unified Scientific Lead Extraction, Campaign Hygiene & Stealth Outreach
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
            Consolidated master control room uniting <span className="text-rose-400 font-semibold">Pulsus MedScout</span>,{' '}
            <span className="text-sky-400 font-semibold">NIH Research Explorer</span>,{' '}
            <span className="text-emerald-400 font-semibold">MDPI Campaign Automator</span>, and{' '}
            <span className="text-amber-400 font-semibold">Zoho Mail Porter</span> into a synchronized, high-deliverability clinical engine.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('medscout')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#b3002d] text-white font-semibold text-sm shadow-lg shadow-rose-950/50 hover:brightness-110 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Launch MedScout (34 Repos)</span>
            </button>
            <button
              onClick={() => onNavigate('mdpi')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d0815] hover:bg-[#280c1f] text-neutral-200 border border-rose-900/50 font-semibold text-sm transition-all"
            >
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>MDPI Data Hygiene Engine</span>
            </button>
            <button
              onClick={() => onNavigate('zoho')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d0815] hover:bg-[#280c1f] text-neutral-200 border border-rose-900/50 font-semibold text-sm transition-all"
            >
              <Send className="w-4 h-4 text-rose-400" />
              <span>Zoho Stealth Mail Porter</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-5 hover:border-rose-900/80 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Federated Repositories</span>
            <div className="p-2 rounded-lg bg-sky-950/40 text-sky-400 border border-sky-800/30">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">34</div>
          <p className="text-xs text-neutral-400 mt-1">PubMed, bioRxiv, EuropePMC, Crossref & more</p>
        </div>

        <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-5 hover:border-rose-900/80 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Harvested Leads</span>
            <div className="p-2 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-800/30">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalLeads}</div>
          <p className="text-xs text-neutral-400 mt-1">Strict Title + Author + Email contract</p>
        </div>

        <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-5 hover:border-rose-900/80 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clean Campaign Leads</span>
            <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{cleanLeads}</div>
          <p className="text-xs text-neutral-400 mt-1">Zero-Gmail & TLD filtered registry</p>
        </div>

        <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-5 hover:border-rose-900/80 transition-all">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outreach Sent</span>
            <div className="p-2 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/30">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{sentLeads}</div>
          <p className="text-xs text-neutral-400 mt-1">Zoho humanized browser dispatches</p>
        </div>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pulsus MedScout Card */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/30">
                Component 01
              </span>
              <span className="text-xs text-neutral-400 font-mono">Flask 3.0 / Next.js API</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-3">Pulsus MedScout</h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Biomedical literature & corresponding author email extractor across 34 federated clinical and preprint archives. Built with zero-Gmail enforcement, DNS MX validation, and multi-country geographic targeting.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>34 Live scientific repositories with unified query</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Zero-tolerance Gmail filter for strictly institutional domains</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Direct Excel (.xlsx) / CSV export with formatted columns</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-950/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400">Explore Harvester</span>
            <button
              onClick={() => onNavigate('medscout')}
              className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NIH Explorer Card */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                Component 02
              </span>
              <span className="text-xs text-neutral-400 font-mono">Entrez eUtils & PMC</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-3">NIH Research Explorer</h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Direct intelligence retrieval for NIH-funded biomedical projects, ClinicalTrials.gov citations, and PubMed Central full-text author affiliations to identify grant PIs and laboratory directors.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>NCBI Entrez eSearch & eSummary live integration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>MeSH Medical terms & NIH Grant Number filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Automatic affiliation email extraction and PI resolution</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-950/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400">Open NIH Explorer</span>
            <button
              onClick={() => onNavigate('nih')}
              className="p-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MDPI Campaign Automator Card */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                Component 03
              </span>
              <span className="text-xs text-neutral-400 font-mono">Streamlit / Python Engine</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-3">MDPI Campaign Automator</h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Strict 7-rule automated data hygiene and formatting pipeline replacing manual Word macros. Formats leads into Email (Col A), Author (Col B), Title (Col C), filtering restricted TLDs and deduplicating records.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>7-Rule Data Hygiene Pipeline (TLD, Numeric, Length, Dedup)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Dual-Sheet Excel output (`Raw Data` + `final sheet`)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>One-click lead handoff directly to Zoho Mail Porter</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-950/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">Launch Automator</span>
            <button
              onClick={() => onNavigate('mdpi')}
              className="p-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoho Mail Porter Card */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/30">
                Component 04
              </span>
              <span className="text-xs text-neutral-400 font-mono">MimicMail / Playwright Stealth</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-3">Zoho Mail Porter (MimicMail)</h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Clinical-grade stealth email outreach dispatcher. Multi-instance sessions with anti-fingerprinting 3-slot template rotation, Times New Roman DOM formatting, human jitter typing, and safety cycle rest timers.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>3-Slot randomized HTML template rotation with dynamic tags</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Multi-instance persistent browser sessions (Instance 1-3)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>1-Hour cycle rest countdown & non-destructive Excel tracking</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-950/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400">Open Mission Control</span>
            <button
              onClick={() => onNavigate('zoho')}
              className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Verified Leads Snapshot */}
      <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Active Research Leads In Queue</h3>
            <p className="text-xs text-neutral-400">Showing first 5 leads currently ready in pipeline</p>
          </div>
          <button
            onClick={() => onNavigate('medscout')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            View All ({recentLeads.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-rose-950/50 text-neutral-400">
                <th className="py-2.5 px-3 font-semibold">Author Name</th>
                <th className="py-2.5 px-3 font-semibold">Verified Institutional Email</th>
                <th className="py-2.5 px-3 font-semibold">Paper Title</th>
                <th className="py-2.5 px-3 font-semibold">Repository</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-950/30">
              {recentLeads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-[#1a0611] transition-colors">
                  <td className="py-3 px-3 font-medium text-white whitespace-nowrap">{lead.author}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 whitespace-nowrap">{lead.email}</td>
                  <td className="py-3 px-3 text-neutral-300 max-w-xs truncate" title={lead.title}>
                    {lead.title}
                  </td>
                  <td className="py-3 px-3 text-neutral-400 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[11px]">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        lead.status === 'sent'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      {lead.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
