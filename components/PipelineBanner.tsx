'use client';

import React from 'react';
import { Search, Filter, Send, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PipelineBannerProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  rawCount: number;
  cleanCount: number;
  sentCount: number;
}

export const PipelineBanner: React.FC<PipelineBannerProps> = ({
  currentTab,
  onNavigate,
  rawCount,
  cleanCount,
  sentCount
}) => {
  const steps = [
    {
      id: 'medscout',
      stepNum: '01',
      title: 'Harvest & Extract',
      platform: 'Pulsus MedScout & NIH Explorer',
      desc: '34 Scientific Repositories',
      stat: `${rawCount} Raw Leads`,
      icon: Search,
      color: 'border-sky-500/50 bg-sky-950/20 text-sky-300'
    },
    {
      id: 'mdpi',
      stepNum: '02',
      title: 'Filter & Deduplicate',
      platform: 'MDPI Campaign Automator',
      desc: 'Strict 7-Rule Data Hygiene Engine',
      stat: `${cleanCount} Verified Leads`,
      icon: Filter,
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
    },
    {
      id: 'zoho',
      stepNum: '03',
      title: 'Stealth Outreach Dispatch',
      platform: 'Zoho Mail Porter (MimicMail)',
      desc: 'Multi-Instance & Randomized Templates',
      stat: `${sentCount} Dispatched`,
      icon: Send,
      color: 'border-rose-500/50 bg-rose-950/20 text-rose-300'
    }
  ];

  return (
    <div className="bg-[#12040a] border border-rose-950/60 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
            Integrated Pipeline Architecture
          </span>
          <h2 className="text-lg font-bold text-white mt-1">
            End-to-End Biomedical Outreach Pipeline
          </h2>
          <p className="text-xs text-neutral-400">
            From multi-repository discovery to automated hygiene and stealth Zoho Mail dispatch.
          </p>
        </div>

        {/* Action button to proceed along the pipeline */}
        <div className="flex items-center gap-2">
          {currentTab === 'medscout' || currentTab === 'nih' ? (
            <button
              onClick={() => onNavigate('mdpi')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-950/40"
            >
              <span>Push to MDPI Hygiene</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : currentTab === 'mdpi' ? (
            <button
              onClick={() => onNavigate('zoho')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-950/40"
            >
              <span>Proceed to Zoho Mail Porter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = currentTab === step.id;

          return (
            <div
              key={step.id}
              onClick={() => onNavigate(step.id)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all relative overflow-hidden ${
                isCurrent
                  ? 'border-rose-500 bg-[#240715] shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/50'
                  : 'border-rose-950/40 bg-[#16050e] hover:border-rose-800/60 hover:bg-[#1c0712]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${step.color} border`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase">
                      Stage {step.stepNum}
                    </span>
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/40 text-neutral-300 border border-white/5">
                  {step.stat}
                </span>
              </div>

              <div className="mt-2 text-[11px] text-neutral-400">
                <div className="font-medium text-rose-300/80">{step.platform}</div>
                <div className="text-neutral-500 truncate">{step.desc}</div>
              </div>

              {isCurrent && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-amber-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
