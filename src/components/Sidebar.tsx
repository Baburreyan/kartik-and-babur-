import React from 'react';
import { ClinicalTab } from '../types/clinical';

interface SidebarProps {
  activeTab: ClinicalTab;
  setActiveTab: (tab: ClinicalTab) => void;
  pendingCount: number;
  onOpenZipModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  onOpenZipModal,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[230px] bg-[#0F172A] text-slate-300 z-50 flex flex-col justify-between border-r border-slate-800 select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-slate-800/80 bg-[#0B132B]">
          <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-white tracking-tight leading-none text-[15px] font-bold">
              HandoffGuard
            </span>
            <span className="font-data-mono-sm text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
              CLINICAL EMR v4.2
            </span>
          </div>
        </div>

        {/* Workflow Navigation */}
        <div className="px-3 pt-3 pb-1">
          <span className="font-label-md text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2">
            CLINICAL WORKFLOW
          </span>
        </div>

        <nav className="px-2 space-y-0.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'patients'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">personal_injury</span>
            <span>Patients</span>
          </button>

          <button
            onClick={() => setActiveTab('handoffs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'handoffs'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            <span>Handoffs</span>
          </button>

          <button
            onClick={() => setActiveTab('pending-actions')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'pending-actions'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              <span>Pending Actions</span>
            </div>
            <span className="font-data-mono-sm text-[10px] bg-[#d32f2f] text-white font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
              {pendingCount || 8}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
            <span>Timeline</span>
          </button>

          {/* System Section */}
          <div className="pt-3 pb-1">
            <span className="font-label-md text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2">
              SYSTEM &amp; CODEX
            </span>
          </div>

          <button
            onClick={() => {
              if (onOpenZipModal) onOpenZipModal();
              else setActiveTab('codex-zip');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left font-body-md cursor-pointer ${
              activeTab === 'codex-zip'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-amber-400 hover:bg-amber-950/40 hover:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-amber-400">folder_zip</span>
              <div className="flex flex-col text-left font-bold text-[12px] leading-tight text-amber-400">
                <span>Codex &amp; ZIP</span>
                <span>Export</span>
              </div>
            </div>
            <span className="font-data-mono-sm text-[9px] bg-[#3a2e0a] text-amber-300 border border-amber-500/50 px-1.5 py-0.5 rounded uppercase font-bold">
              .ZIP
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left font-body-md cursor-pointer ${
              activeTab === 'help'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Help &amp; I-PASS Guide</span>
          </button>
        </nav>
      </div>

      {/* Ward Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#0B132B]/60 space-y-2">
        <div className="flex items-center gap-2 px-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-data-mono-sm text-[11px] text-slate-300">Ward Synced • Epic EMR</span>
        </div>
        <div className="flex items-center text-slate-400 px-1 pt-1 font-data-mono-sm text-[10px]">
          <span className="material-symbols-outlined text-[13px] text-slate-400 mr-1">lock</span>
          <span>Unit 4B Active LockTLS 1.3</span>
        </div>
      </div>
    </aside>
  );
};
