'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PipelineBanner } from '@/components/PipelineBanner';
import { DashboardOverview } from '@/components/tabs/DashboardOverview';
import { MedScoutTab } from '@/components/tabs/MedScoutTab';
import { NihExplorerTab } from '@/components/tabs/NihExplorerTab';
import { MdpiAutomatorTab } from '@/components/tabs/MdpiAutomatorTab';
import { ZohoPorterTab } from '@/components/tabs/ZohoPorterTab';
import { Lead } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/sample-data';
import { runDataHygienePipeline } from '@/lib/hygiene-engine';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [cleanLeads, setCleanLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize clean leads and restore state from localStorage on first client render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pulsus_suite_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads(parsed);
          setCleanLeads(runDataHygienePipeline(parsed).cleanedLeads);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
    setCleanLeads(runDataHygienePipeline(INITIAL_LEADS).cleanedLeads);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pulsus_suite_leads', JSON.stringify(leads));
    } catch {}
  }, [leads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    setLeads(INITIAL_LEADS);
    const cleaned = runDataHygienePipeline(INITIAL_LEADS).cleanedLeads;
    setCleanLeads(cleaned);
    try {
      localStorage.removeItem('pulsus_suite_leads');
    } catch {}
    showToast('Reset to default verified scientific leads directory.');
  };

  const handlePushToMdpi = (incomingLeads: Lead[]) => {
    const res = runDataHygienePipeline(incomingLeads);
    setCleanLeads(res.cleanedLeads);
    setActiveTab('mdpi');
    showToast(`Transferred ${incomingLeads.length} leads to MDPI Campaign Automator.`);
  };

  const handlePushToZoho = (cleanedLeads: Lead[]) => {
    setActiveTab('zoho');
    showToast(`Loaded ${cleanedLeads.length} cleaned leads into Zoho Mail Porter.`);
  };

  const handleAddLeadsToPipeline = (newLeads: Lead[]) => {
    setLeads(prev => {
      const existing = new Set(prev.map(l => l.email.toLowerCase()));
      const unique = newLeads.filter(l => !existing.has(l.email.toLowerCase()));
      const combined = [...unique, ...prev];
      setCleanLeads(runDataHygienePipeline(combined).cleanedLeads);
      return combined;
    });
    showToast(`Added ${newLeads.length} leads from NIH Research Explorer to the pipeline.`);
  };

  const sentCount = leads.filter(l => l.status === 'sent').length;

  return (
    <div className="min-h-screen bg-[#080205] text-neutral-100 flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#b3002d] text-white text-xs font-semibold shadow-2xl shadow-rose-950/80 border border-rose-500/50 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLeads={leads.length}
        cleanLeads={cleanLeads.length}
        sentLeads={sentCount}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pipeline Stepper Banner */}
        <PipelineBanner
          currentTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          rawCount={leads.length}
          cleanCount={cleanLeads.length}
          sentCount={sentCount}
        />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onNavigate={(tab) => setActiveTab(tab)}
            totalLeads={leads.length}
            cleanLeads={cleanLeads.length}
            sentLeads={sentCount}
            recentLeads={cleanLeads}
          />
        )}

        {activeTab === 'medscout' && (
          <MedScoutTab
            leads={leads}
            setLeads={setLeads}
            onPushToMdpi={handlePushToMdpi}
          />
        )}

        {activeTab === 'nih' && (
          <NihExplorerTab
            onAddLeadsToPipeline={handleAddLeadsToPipeline}
          />
        )}

        {activeTab === 'mdpi' && (
          <MdpiAutomatorTab
            rawLeads={leads}
            cleanLeads={cleanLeads}
            setCleanLeads={setCleanLeads}
            onPushToZoho={handlePushToZoho}
          />
        )}

        {activeTab === 'zoho' && (
          <ZohoPorterTab
            leads={cleanLeads}
            setLeads={setCleanLeads}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-950/40 bg-[#060103] py-6 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>Pulsus MedScout & Zoho Mail Porter Unified Web Suite</span>
          </div>
          <div>
            Built with Next.js App Router • Tailored for Vercel Deployment • 100% Client & Serverless
          </div>
        </div>
      </footer>
    </div>
  );
}
