'use client';

import React from 'react';
import Image from 'next/image';
import { Database, Mail, ShieldCheck, Sparkles, SendHorizontal, LayoutDashboard, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalLeads: number;
  cleanLeads: number;
  sentLeads: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalLeads,
  cleanLeads,
  sentLeads,
  onReset
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Overview Cockpit', icon: LayoutDashboard },
    { id: 'medscout', label: 'Pulsus MedScout', icon: Database, badge: '34 Sources' },
    { id: 'nih', label: 'NIH Explorer', icon: Globe, badge: 'PubMed/PMC' },
    { id: 'mdpi', label: 'MDPI Automator', icon: ShieldCheck, badge: 'Data Hygiene' },
    { id: 'zoho', label: 'Zoho Mail Porter', icon: Mail, badge: 'MimicMail' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#2d0f19] bg-[#0c0307]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] to-[#b3002d] p-0.5 shadow-lg shadow-rose-950/40 flex items-center justify-center overflow-hidden">
              <Image 
                src="/pulsus_logo.png" 
                alt="Pulsus Logo" 
                width={36} 
                height={36} 
                className="object-contain"
                onError={(e) => {
                  // Fallback if image fails
                  const target = e.currentTarget as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-white font-bold text-lg select-none">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">
                  PULSUS <span className="text-rose-500">MEDSCOUT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40">
                  Suite v2.5
                </span>
              </div>
              <p className="text-xs text-rose-200/60 font-mono tracking-tight hidden sm:block">
                Federated Intelligence • MDPI Campaign Engine • Zoho Mail Porter
              </p>
            </div>
          </div>

          {/* Real-time Metric Badges */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18060f] border border-rose-900/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-neutral-400">Harvested:</span>
              <span className="text-white font-bold">{totalLeads}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18060f] border border-rose-900/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-neutral-400">Cleaned:</span>
              <span className="text-emerald-300 font-bold">{cleanLeads}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18060f] border border-rose-900/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-neutral-400">Dispatched:</span>
              <span className="text-rose-300 font-bold">{sentLeads}</span>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded-md">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Live on Vercel</span>
            </div>

            <button
              onClick={onReset}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-[#1e0713] hover:bg-[#2e0b1d] border border-rose-900/30 transition-colors"
              title="Reset to default verified sample leads"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#800020] to-[#a00029] text-white shadow-md shadow-rose-950/60 border border-rose-500/40 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-[#1f0714] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-200' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-black/30 text-rose-100' : 'bg-[#290a1a] text-neutral-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
