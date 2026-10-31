'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Play, Pause, Square, RefreshCw, Send, CheckCircle2, Clock, ShieldCheck, Terminal, Download, Sparkles, Layers } from 'lucide-react';
import { Lead, TemplateSlot, OutreachInstance, DispatchLog } from '@/lib/types';
import { DEFAULT_TEMPLATES, DEFAULT_INSTANCES } from '@/lib/sample-data';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';

interface ZohoPorterTabProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export const ZohoPorterTab: React.FC<ZohoPorterTabProps> = ({ leads, setLeads }) => {
  const [instances, setInstances] = useState<OutreachInstance[]>(DEFAULT_INSTANCES);
  const [activeInstanceId, setActiveInstanceId] = useState<string>('instance-1');
  const [templates, setTemplates] = useState<TemplateSlot[]>(DEFAULT_TEMPLATES);
  const [activeSlotId, setActiveSlotId] = useState<string>('slot-1');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCycleResting, setIsCycleResting] = useState<boolean>(false);
  const [cycleRestSecondsLeft, setCycleRestSecondsLeft] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [logs, setLogs] = useState<DispatchLog[]>([
    {
      id: 'log-0',
      timestamp: 'System Ready',
      level: 'info',
      message: 'Zoho Mail Porter (MimicMail Engine) initialized. 3 template slots loaded in pool.',
      instance: 'System'
    }
  ]);

  const activeInstance = instances.find(i => i.id === activeInstanceId) || instances[0];
  const activeTemplate = templates.find(t => t.id === activeSlotId) || templates[0];

  const logContainerRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isRunningRef.current = isRunning;
    isPausedRef.current = isPaused;
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const appendLog = (level: DispatchLog['level'], message: string, recipient?: string) => {
    setLogs(prev => [
      ...prev.slice(-100),
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        instance: activeInstance.label,
        recipient
      }
    ]);
  };

  // Interpolate template tags
  const renderInterpolatedBody = (rawHtml: string, lead: Lead) => {
    const authorName = lead.author.replace(/^Dr\.\s*|^Prof\.\s*/i, '');
    return rawHtml
      .replace(/{name}/g, authorName)
      .replace(/{author}/g, lead.author)
      .replace(/{title}/g, lead.title)
      .replace(/{paper}/g, lead.title)
      .replace(/{journal}/g, lead.journal || 'Journal of Biomedical & Clinical Research')
      .replace(/{short_journal}/g, lead.journal ? lead.journal.split(' ').slice(0, 3).join(' ') : 'J. Biomed. Clin. Res.')
      .replace(/{date}/g, new Date().toLocaleDateString());
  };

  const renderInterpolatedSubject = (rawSubject: string, lead: Lead) => {
    const authorName = lead.author.replace(/^Dr\.\s*|^Prof\.\s*/i, '');
    return rawSubject
      .replace(/{name}/g, authorName)
      .replace(/{author}/g, lead.author)
      .replace(/{title}/g, lead.title)
      .replace(/{journal}/g, lead.journal || 'Journal of Biomedical & Clinical Research');
  };

  // Start campaign dispatch loop
  const handleStartCampaign = async () => {
    if (leads.length === 0) {
      appendLog('warning', 'Recipient registry is empty. Ingest leads from MedScout or MDPI first.');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    appendLog('stealth', `Initiating Playwright stealth session on ${activeInstance.displayName}...`);
    appendLog('info', `Loaded ${leads.length} recipient rows into campaign queue. Rate delay set to ${activeInstance.rateDelaySec}s with jitter.`);

    let idx = currentIndex;
    while (idx < leads.length) {
      if (!isRunningRef.current) {
        appendLog('warning', 'Campaign dispatch cancelled by operator.');
        break;
      }

      if (isPausedRef.current) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      const currentLead = leads[idx];
      if (currentLead.status === 'sent') {
        idx++;
        setCurrentIndex(idx);
        continue;
      }

      // Randomly pick 1 of 3 templates in pool to prevent content fingerprinting
      const chosenTemplate = templates[Math.floor(Math.random() * templates.length)];
      const subject = renderInterpolatedSubject(chosenTemplate.subject, currentLead);
      const htmlBody = renderInterpolatedBody(chosenTemplate.htmlBody, currentLead);

      appendLog('info', `Simulating human typing into Zoho webmail: ${currentLead.email}...`, currentLead.email);

      // Call API
      try {
        const res = await fetch('/api/zoho-porter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send_single',
            recipient: {
              email: currentLead.email,
              author: currentLead.author,
              title: currentLead.title,
              journal: currentLead.journal
            },
            instanceId: activeInstance.id,
            templateId: chosenTemplate.id,
            subject,
            htmlBody
          })
        });

        const data = await res.json();
        if (data.success) {
          // Update lead status
          setLeads(prev =>
            prev.map((l, i) =>
              i === idx
                ? {
                    ...l,
                    status: 'sent',
                    sentAt: new Date().toLocaleTimeString(),
                    templateUsed: chosenTemplate.title,
                    instanceUsed: activeInstance.label
                  }
                : l
            )
          );

          // Update instance stats
          setInstances(prev =>
            prev.map(ins =>
              ins.id === activeInstance.id ? { ...ins, sentToday: ins.sentToday + 1 } : ins
            )
          );

          appendLog('success', `[250 OK] Delivered via ${activeInstance.label} (${chosenTemplate.title}) → Message-ID: ${data.messageId}`, currentLead.email);
        } else {
          appendLog('error', `Failed dispatch to ${currentLead.email}: ${data.error}`, currentLead.email);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        appendLog('error', `Network error during dispatch to ${currentLead.email}: ${message}`, currentLead.email);
      }

      idx++;
      setCurrentIndex(idx);

      // Every 5 emails, simulate mini anti-bot rest
      if (idx % 8 === 0 && idx < leads.length) {
        appendLog('stealth', 'Cycle safety rest active: pausing 10 seconds to maintain sender reputation...');
        await new Promise(r => setTimeout(r, 10000));
      } else {
        // Normal pacing jitter
        const jitter = Math.floor(Math.random() * 800) + 1200;
        await new Promise(r => setTimeout(r, jitter));
      }
    }

    setIsRunning(false);
    setIsPaused(false);
    if (idx >= leads.length) {
      appendLog('success', 'Campaign dispatch completed! All pending leads in queue processed.');
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    appendLog('warning', 'Campaign paused by operator. Row progress and session cookies preserved.');
  };

  const handleResume = () => {
    setIsPaused(false);
    appendLog('info', 'Campaign resumed.');
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    appendLog('error', 'Campaign stopped.');
  };

  const handleExportTrackingExcel = () => {
    const data = leads.map(l => ({
      'Email': l.email,
      'Author': l.author,
      'Title': l.title,
      'Status': l.status === 'sent' ? 'SENT' : 'PENDING',
      'Sent_At': l.sentAt || '',
      'Template_Used': l.templateUsed || '',
      'Instance_Used': l.instanceUsed || '',
      'Source': l.source || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Outreach_Tracking');
    XLSX.writeFile(wb, `Zoho_Mail_Porter_Tracking_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  const sentCount = leads.filter(l => l.status === 'sent').length;
  const pendingCount = leads.length - sentCount;
  const progressPercent = leads.length > 0 ? Math.round((sentCount / leads.length) * 100) : 0;

  // Active preview recipient
  const previewLead = leads[currentIndex] || leads[0] || {
    id: 'demo',
    author: 'Dr. Sarah M. Jenkins',
    email: 'sjenkins@broadinstitute.harvard.edu',
    title: 'CRISPR-Cas9 Base Editing in Human Hematopoietic Stem Cells',
    journal: 'Nature Biotechnology'
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14040d] border border-rose-950/60 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono font-bold mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>Zoho Mail Porter // MimicMail Outreach Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Stealth Browser Dispatcher & Dynamic Template Pool
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Multi-instance persistent sessions, anti-fingerprinting 3-slot rotation, Times New Roman DOM verification, and fault-tolerant tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportTrackingExcel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e0714] hover:bg-[#2e0b1f] text-neutral-200 border border-rose-900/40 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Tracking Sheet (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mission Control Cockpit */}
      <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Mission Control & Deliverability Metrics</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                isRunning ? (isPaused ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300 animate-pulse') : 'bg-neutral-900 text-neutral-400'
              }`}>
                {isRunning ? (isPaused ? 'PAUSED' : 'ACTIVE DISPATCHING') : 'READY'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Organic micro-delays between emails with Times New Roman DOM styling.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStartCampaign}
                disabled={leads.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#b3002d] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/60 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Outreach ({leads.length} in queue)</span>
              </button>
            ) : isPaused ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Campaign</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/60 transition-all"
              >
                <Pause className="w-4 h-4 fill-black" />
                <span>Pause Outreach</span>
              </button>
            )}

            {isRunning && (
              <button
                onClick={handleStop}
                className="p-2.5 rounded-xl bg-[#2b0818] hover:bg-[#3d0b22] text-rose-300 border border-rose-900/50 transition-colors"
                title="Stop Campaign"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Ratio Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Campaign Dispatch Progress</span>
            <span className="text-white font-bold">{progressPercent}% ({sentCount} of {leads.length})</span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden p-0.5 border border-rose-950/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#800020] via-rose-600 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-[#0e0208] border border-rose-950/40">
              <span className="text-emerald-400 font-bold text-sm block">{sentCount}</span>
              <span className="text-neutral-500 text-[10px]">Delivered (250 OK)</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e0208] border border-rose-950/40">
              <span className="text-amber-400 font-bold text-sm block">{pendingCount}</span>
              <span className="text-neutral-500 text-[10px]">Pending In Queue</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0e0208] border border-rose-950/40">
              <span className="text-rose-400 font-bold text-sm block">0</span>
              <span className="text-neutral-500 text-[10px]">Errors / Bounces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Instance & Template Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Multi-Instance Session Picker */}
        <div className="bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>Multi-Instance Sessions</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">Persistent Profiles</span>
          </div>

          <div className="space-y-2">
            {instances.map(inst => (
              <div
                key={inst.id}
                onClick={() => setActiveInstanceId(inst.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  inst.id === activeInstanceId
                    ? 'border-rose-500 bg-[#250716] shadow-md shadow-rose-950/40'
                    : 'border-rose-950/40 bg-[#0d0208] hover:border-rose-900/40'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">{inst.label}: {inst.displayName}</span>
                  <span className={`w-2 h-2 rounded-full ${inst.connected ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                </div>
                <div className="text-[11px] font-mono text-neutral-400 mt-1 truncate">{inst.email}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-2 pt-2 border-t border-rose-950/40">
                  <span>Daily Quota: {inst.sentToday}/{inst.dailyLimit} rows</span>
                  <span>Delay: {inst.rateDelaySec}s jitter</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-neutral-400 leading-relaxed">
            <span className="text-rose-400 font-semibold">Stealth Pacing Protocol:</span> Automatically applies randomized micro-delays between dispatches with organic mouse jitter to simulate genuine human webmail behavior.
          </div>
        </div>

        {/* Center: 3-Slot HTML Template Pool */}
        <div className="lg:col-span-2 bg-[#12040b] border border-rose-950/60 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  3-Slot HTML Template Pool
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900/40 font-mono">
                  Randomized 1/3 Rotation
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">Anti-Fingerprinting</span>
            </div>

            {/* Template Slot Switcher */}
            <div className="flex space-x-2 border-b border-rose-950/40 pb-2">
              {templates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveSlotId(tmpl.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    tmpl.id === activeSlotId
                      ? 'bg-[#290919] text-rose-300 border border-rose-800/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tmpl.title.split(':')[0]}
                </button>
              ))}
            </div>

            {/* Subject Input */}
            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Email Subject Line (Dynamic Interpolation)
              </label>
              <input
                type="text"
                value={activeTemplate.subject}
                onChange={(e) => {
                  const val = e.target.value;
                  setTemplates(prev =>
                    prev.map(t => (t.id === activeSlotId ? { ...t, subject: val } : t))
                  );
                }}
                className="w-full bg-[#0a0206] border border-rose-950/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Times New Roman Live Preview */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1 font-mono">
                <span>Times New Roman (12pt) Webmail DOM Preview</span>
                <span className="text-rose-400">Target: {previewLead.author}</span>
              </div>

              <div
                className="w-full bg-white text-black p-4 rounded-xl shadow-inner text-sm leading-relaxed max-h-56 overflow-y-auto"
                style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '15px' }}
                dangerouslySetInnerHTML={{
                  __html: renderInterpolatedBody(activeTemplate.htmlBody, previewLead)
                }}
              />
            </div>
          </div>

          <div className="pt-2 text-[10px] font-mono text-neutral-500 flex flex-wrap gap-2">
            <span>Tags:</span>
            <span className="text-rose-400">{`{name}`}</span>
            <span className="text-rose-400">{`{author}`}</span>
            <span className="text-rose-400">{`{title}`}</span>
            <span className="text-rose-400">{`{journal}`}</span>
            <span className="text-rose-400">{`{short_journal}`}</span>
          </div>
        </div>
      </div>

      {/* Real-time Audit Terminal */}
      <div className="bg-[#0b0206] border border-rose-950/80 rounded-2xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-neutral-400 border-b border-rose-950/50 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-white uppercase text-[11px] tracking-wider">
              Live Stealth Dispatch Audit Terminal
            </span>
          </div>
          <span className="text-[10px] text-neutral-500">Auto-Scrolling</span>
        </div>

        <div
          ref={logContainerRef}
          className="h-44 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-rose-950"
        >
          {logs.map(log => {
            let color = 'text-neutral-300';
            if (log.level === 'success') color = 'text-emerald-400 font-semibold';
            else if (log.level === 'warning') color = 'text-amber-400';
            else if (log.level === 'error') color = 'text-rose-400 font-bold';
            else if (log.level === 'stealth') color = 'text-sky-300';

            return (
              <div key={log.id} className="flex items-start gap-2 text-[11px] leading-tight">
                <span className="text-neutral-600 select-none">[{log.timestamp}]</span>
                <span className="text-rose-500 select-none">[{log.instance}]</span>
                <span className={color}>{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
