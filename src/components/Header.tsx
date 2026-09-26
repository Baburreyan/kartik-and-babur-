import React, { useState } from 'react';
import { downloadProjectZip } from '../utils/zipExporter';

interface HeaderProps {
  onOpenZipModal: () => void;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenZipModal }) => {
  const [downloading, setDownloading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleQuickDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="fixed top-0 left-[230px] right-0 h-14 bg-surface-container-lowest border-b border-outline-variant z-40 flex items-center justify-between px-6 select-none shadow-xs">
      {/* Hospital and Division Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border border-primary/40 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[15px]">add</span>
          </div>
          <span className="font-headline-sm text-on-surface font-bold text-[14px]">
            St. Jude Academic Medical Center
          </span>
        </div>
        <span className="text-outline-variant font-bold">•</span>
        <span className="font-body-md text-on-surface-variant text-[12px] hidden md:inline">
          Division: Acute Inpatient Medicine - Unit 4B / Telemetry
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Shift Timing Box */}
        <div className="hidden xl:flex items-center gap-2 bg-surface-container-low border border-outline-variant px-3 py-1 rounded-lg text-on-surface-variant font-data-mono text-[11px] leading-tight">
          <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
          <div className="flex flex-col text-left">
            <span>Shift: Day Handover</span>
            <span>(07:00 - 19:30) • 14:45 EST</span>
          </div>
        </div>

        {/* Download Project ZIP button for Codex */}
        <button
          onClick={handleQuickDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#e67e00] hover:bg-[#d67400] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          title="Download complete project ZIP file with requirements.txt for Codex"
        >
          <span className="material-symbols-outlined text-[20px]">
            {downloading ? 'sync' : 'folder_zip'}
          </span>
          <div className="flex flex-col text-left font-bold text-[10px] uppercase leading-tight tracking-tight">
            <span>Download</span>
            <span>ZIP (Codex)</span>
          </div>
        </button>

        {/* Codex Specs Button */}
        <button
          onClick={onOpenZipModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e0edff] hover:bg-[#d0e2ff] text-[#0037b0] border border-blue-200 transition-colors cursor-pointer"
          title="View Codex requirements.txt and project package details"
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          <div className="flex flex-col text-left font-bold text-[10px] leading-tight">
            <span>Codex</span>
            <span>Specs</span>
          </div>
        </button>

        {/* Urgent Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            aria-label="Urgent alerts"
            className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute -top-1 -right-1 font-data-mono-sm text-[10px] bg-amber-500 text-white font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <span className="font-headline-sm text-on-surface text-[13px] font-bold">
                  Clinical Shift Alerts (3)
                </span>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                  Action Required
                </span>
              </div>
              <div className="space-y-2 pt-2 text-[11px]">
                <div className="p-2 rounded bg-red-50 text-red-900 border-l-2 border-red-600">
                  <strong className="block font-semibold">Overdue Venous Lactate</strong>
                  <span>Vivian Brooks (Bed 408-A) overdue by 45 minutes.</span>
                </div>
                <div className="p-2 rounded bg-amber-50 text-amber-900 border-l-2 border-amber-600">
                  <strong className="block font-semibold">Watcher Status Sign-Off</strong>
                  <span>Margaret Callahan (Bed 402-A) requires attending handover verification.</span>
                </div>
                <div className="p-2 rounded bg-blue-50 text-blue-900 border-l-2 border-blue-600">
                  <strong className="block font-semibold">Troponin Repeat @ 16:00</strong>
                  <span>Phlebotomy queue prepped for serial draw in 1h 15m.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-outline-variant"></div>

        {/* Doctor Eleanor Vance Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              alt="Eleanor Vance, MD"
              className="w-8 h-8 rounded-full object-cover border border-outline-variant shadow-xs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM3wC1CNPa8tN8xoouO-7p8H6tiE-iITpX_7YnwhySSUj0COUmyU063unSg1CjFMgxbMYjLGrHO9q8W41XaL3RQQX4sQcdwB1ZvA71pd5YGPX2NOpnyDywgVHCGPJRjv38IWqNF4aaOcQe2fs-2BTJdbFMi85GE2B9Iyadbx0W0zNA6pOB6WE2Aid0hf16Nry9YP4JhY2FSpmxboBSZrV2vLWlSVr9C0xhXK08jnmFBCylC2rzvV6yHQ"
            />
            <div className="flex flex-col text-left">
              <span className="font-label-lg text-on-surface text-[12px] leading-tight font-bold">
                Eleanor Vance, MD
              </span>
              <span className="font-label-md text-on-surface-variant text-[10px] leading-tight">
                Attending Hospitalist
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              expand_more
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
                <img
                  alt="Eleanor Vance, MD"
                  className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM3wC1CNPa8tN8xoouO-7p8H6tiE-iITpX_7YnwhySSUj0COUmyU063unSg1CjFMgxbMYjLGrHO9q8W41XaL3RQQX4sQcdwB1ZvA71pd5YGPX2NOpnyDywgVHCGPJRjv38IWqNF4aaOcQe2fs-2BTJdbFMi85GE2B9Iyadbx0W0zNA6pOB6WE2Aid0hf16Nry9YP4JhY2FSpmxboBSZrV2vLWlSVr9C0xhXK08jnmFBCylC2rzvV6yHQ"
                />
                <div className="flex flex-col">
                  <span className="font-label-lg text-on-surface text-[13px] font-bold">
                    Eleanor Vance, MD
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    NPI: 1948201948 • Pager #4102
                  </span>
                </div>
              </div>
              <div className="pt-2 space-y-1 font-body-sm text-[12px]">
                <div className="flex justify-between py-1 px-1 text-on-surface-variant">
                  <span>Duty Ward:</span>
                  <strong className="text-on-surface">Unit 4B Telemetry</strong>
                </div>
                <div className="flex justify-between py-1 px-1 text-on-surface-variant">
                  <span>Shift Lock:</span>
                  <strong className="text-on-surface">19:30 EST (in 4h 45m)</strong>
                </div>
                <div className="flex justify-between py-1 px-1 text-on-surface-variant">
                  <span>EMR Signature ID:</span>
                  <strong className="text-primary font-mono">EVANCE_MD</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
