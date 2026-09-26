import React from 'react';

export const HelpView: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
        <div>
          <h1 className="font-headline-lg text-on-surface font-bold text-[18px]">
            I-PASS Clinical Handover Protocol Reference
          </h1>
          <p className="font-body-sm text-on-surface-variant text-[12px] mt-1">
            Standard Operating Procedures for Shift Sign-Out and Inter-Provider Patient Custody Transfer
          </p>
        </div>
        <div className="font-mono text-[11px] text-primary font-bold tracking-wider shrink-0 select-none">
          ACGME &amp; Joint Commission Approved
        </div>
      </div>

      {/* 5 Standard I-PASS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-stretch">
        {/* Card 1: Illness Severity */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border-t-4 border-t-[#0F172A] flex flex-col justify-start space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[#0037b0] text-white font-mono font-bold flex items-center justify-center text-[12px] shrink-0">
              I
            </span>
            <span className="font-bold text-[14px] text-on-surface leading-tight">
              Illness Severity
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Categorize patient stability into Stable, Watcher/Guarded, or Unstable/Critical to anchor clinical anticipation for the incoming team.
          </p>
        </div>

        {/* Card 2: Patient Summary */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border-t-4 border-t-[#0F172A] flex flex-col justify-start space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[#0037b0] text-white font-mono font-bold flex items-center justify-center text-[12px] shrink-0">
              P
            </span>
            <span className="font-bold text-[14px] text-on-surface leading-tight">
              Patient Summary
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Concise clinical synopsis of admitting diagnosis, hospital course to date, current physiological parameters, and active organ systems.
          </p>
        </div>

        {/* Card 3: Action List */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border-t-4 border-t-[#0F172A] flex flex-col justify-start space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[#0037b0] text-white font-mono font-bold flex items-center justify-center text-[12px] shrink-0">
              A
            </span>
            <span className="font-bold text-[14px] text-on-surface leading-tight">
              Action List
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Specific to-do tasks, time-sensitive lab intervals (e.g. Troponin delta checks), radiology follow-ups, and designated clinical owners.
          </p>
        </div>

        {/* Card 4: Situation Awareness */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border-t-4 border-t-[#0F172A] flex flex-col justify-start space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded bg-[#0037b0] text-white font-mono font-bold flex items-center justify-center text-[12px] shrink-0 mt-0.5">
              S
            </span>
            <div className="font-bold text-[14px] text-on-surface leading-tight">
              Situation<br />Awareness
            </div>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Anticipate clinical crises through structured &quot;If/Then&quot; contingency plans (e.g. SBP drops &lt; 95, telemetry reveals RVR recurrence).
          </p>
        </div>

        {/* Card 5: Synthesis by Receiver */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border-t-4 border-t-[#0F172A] flex flex-col justify-start space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded bg-[#0037b0] text-white font-mono font-bold flex items-center justify-center text-[12px] shrink-0 mt-0.5">
              S
            </span>
            <div className="font-bold text-[14px] text-on-surface leading-tight">
              Synthesis by<br />Receiver
            </div>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            The receiving clinician restates key items, asks clarifying questions, and electronically accepts custody before shift lock at 19:30.
          </p>
        </div>
      </div>
    </div>
  );
};
