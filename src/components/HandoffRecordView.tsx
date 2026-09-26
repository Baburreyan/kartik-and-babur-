import React, { useState } from 'react';
import { Patient, IPassHandoff } from '../types/clinical';

interface HandoffRecordViewProps {
  patient: Patient;
  handoff: IPassHandoff;
  onAcknowledgeCare: () => void;
  onNavigateBack: () => void;
}

export const HandoffRecordView: React.FC<HandoffRecordViewProps> = ({
  patient,
  handoff,
  onAcknowledgeCare,
  onNavigateBack,
}) => {
  const [acknowledged, setAcknowledged] = useState(handoff.isAcknowledged);
  const [clarifyOpen, setClarifyOpen] = useState(false);
  const [addendumOpen, setAddendumOpen] = useState(false);
  const [clarifyMsg, setClarifyMsg] = useState('');
  const [addendumMsg, setAddendumMsg] = useState('');
  const [auditList, setAuditList] = useState([
    { time: '14:15', title: 'Handoff drafted & finalized', by: 'By Dr. Marcus Chen, MD' },
    { time: '13:45', title: 'Bedside joint exam conducted', by: 'Bed 402-A (Dr. Vance & Dr. Chen)' },
    { time: '11:20', title: 'Lab results auto-attached', by: 'K+ 4.1, Cr 1.45 to sign-out note' },
    { time: '07:05', title: 'Morning handoff initialized', by: 'Transferred from Night Float Team' },
  ]);

  const handleAcceptCare = () => {
    setAcknowledged(true);
    const newEntry = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Care transferred & accepted',
      by: 'By Dr. Eleanor Vance, MD (Attending)',
    };
    setAuditList([newEntry, ...auditList]);
    onAcknowledgeCare();
  };

  const handleSendClarification = () => {
    if (!clarifyMsg.trim()) return;
    alert(`Clarification dispatched via Voicera/Pager to Dr. Marcus Chen:\n"${clarifyMsg}"`);
    setClarifyMsg('');
    setClarifyOpen(false);
  };

  const handleSaveAddendum = () => {
    if (!addendumMsg.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditList([
      {
        time: timeStr,
        title: `Clinical Addendum: ${addendumMsg.slice(0, 30)}...`,
        by: 'By Dr. Eleanor Vance, MD',
      },
      ...auditList,
    ]);
    alert('Addendum appended and permanently committed to the Epic audit trail.');
    setAddendumMsg('');
    setAddendumOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Status & Command Bar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col space-y-1">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 font-data-mono-sm text-[11px] text-on-surface-variant">
              <button onClick={onNavigateBack} className="hover:text-primary transition-colors cursor-pointer">
                Handoffs
              </button>
              <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
              <span className="hover:text-primary transition-colors">Active Sign-Outs</span>
              <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">{patient.name} ({patient.mrn})</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <h1 className="font-headline-lg text-on-surface tracking-tight text-[20px] font-bold">
                Shift Handoff Record — {patient.name}
              </h1>

              {/* Status Badge */}
              {acknowledged ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-300">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                  <span className="font-data-mono text-[11px] font-bold uppercase tracking-wide">
                    Care Accepted • Active
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold uppercase tracking-wide">
                    Pending Your Acknowledgment
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setClarifyOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-[12px] rounded-lg shadow-xs transition-all cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[17px] text-on-surface-variant">chat_bubble_outline</span>
              <span>Request Clarification</span>
            </button>
            <button
              onClick={() => setAddendumOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-[12px] rounded-lg shadow-xs transition-all cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[17px] text-on-surface-variant">post_add</span>
              <span>Add Addendum</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-[12px] rounded-lg shadow-xs transition-all cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[17px] text-on-surface-variant">print</span>
              <span>Print Record</span>
            </button>
            {!acknowledged && (
              <button
                onClick={handleAcceptCare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-[13px] rounded-lg shadow-sm transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Acknowledge & Accept Care</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Patient Quick-Reference Banner */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-surface-variant">
                <img
                  className="w-full h-full object-cover"
                  src={patient.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsB8G5Voe_juiTt_1ltAsLBGP_CLj0vXwUffZLCiifYIPTHnAE9wDe3Rf8FbY92NoHwxEh3Nck0tJxuWkSRHUgFsrmG4M6m4W137CKzmtxsivM16P6QEuXOSNMECTk1uN5WJo2AMCgdV5iD01y9rUX__OhsuG8c4wZ_7cw__LpibSTaQsw72eVwLm2Bwokwzz1jc63TNEf1oh3kqtGGb-6_LDgP1HgpQIMZ4R1W7Z8JbZ_YWlx1SJ0cg'}
                  alt={patient.name}
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-white"></span>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-headline-md text-on-surface font-bold text-[16px]">{patient.name}</span>
                <span className="font-body-md text-on-surface-variant text-[12px]">{patient.age} yo Female</span>
                <span className="text-outline-variant">•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-primary font-data-mono font-bold text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">hotel</span> {patient.bed}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-data-mono-sm text-[11px] text-on-surface-variant">
                <span>MRN: <strong className="text-on-surface font-bold">84920-B</strong></span>
                <span>FIN: <strong>99041288</strong></span>
                <span>DOB: <strong>11/14/1949</strong></span>
                <span>Admitted: <strong>3d ago (May 14)</strong></span>
              </div>
            </div>
          </div>

          {/* Clinical Flags Triage Pill Matrix */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900">
              <span className="material-symbols-outlined text-[16px] text-amber-700">warning</span>
              <span className="font-data-mono text-[11px] font-bold">WATCHER</span>
              <span className="font-data-mono-sm text-[10px] bg-amber-200 text-amber-950 px-1 rounded font-bold">
                NEWS2: 6
              </span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-[11px] font-bold">
              <span className="material-symbols-outlined text-[15px] text-primary">healing</span>
              <span>Full Code</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant font-label-md text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-outline">masks</span>
              <span>Isolation: None</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant font-label-md text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-secondary">groups</span>
              <span>Care Team: Hospitalist Team B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (8 of 12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* 1. Current Clinical Synopsis Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">assignment</span>
                <h2 className="font-headline-sm text-on-surface font-bold text-[13px]">
                  1. Current Clinical Synopsis & Course
                </h2>
              </div>
              <span className="font-data-mono-sm text-on-surface-variant text-[11px]">Last updated 14:15 EST</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="font-body-lg text-on-surface leading-relaxed text-[14px]">
                Admitted for <span className="font-bold text-primary">ADHF with reduced EF (25%)</span> and atrial fibrillation with RVR. Rate currently controlled on oral Metoprolol. Diuresing briskly on IV Furosemide continuous drip at 10mg/hr. Net fluid balance:{' '}
                <span className="inline-flex items-center font-data-mono font-bold text-secondary px-1.5 py-0.5 rounded bg-secondary-container/40">
                  -1,850 mL today
                </span>.
              </p>

              {/* Bedside Telemetry Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="font-data-mono-sm text-[10px] uppercase text-outline block font-bold">
                    Heart Rate
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-data-mono text-[16px] font-bold text-on-surface">81</span>
                    <span className="font-data-mono-sm text-[10px] text-on-surface-variant">bpm / AFib</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="font-data-mono-sm text-[10px] uppercase text-outline block font-bold">
                    Blood Pressure
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-data-mono text-[16px] font-bold text-on-surface">104/68</span>
                    <span className="font-data-mono-sm text-[10px] text-on-surface-variant font-bold text-secondary">
                      MAP 80
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="font-data-mono-sm text-[10px] uppercase text-outline block font-bold">
                    Oxygenation
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-data-mono text-[16px] font-bold text-on-surface">96%</span>
                    <span className="font-data-mono-sm text-[10px] text-on-surface-variant">2L NC</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="font-data-mono-sm text-[10px] uppercase text-outline block font-bold">
                    Resp Rate
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-data-mono text-[16px] font-bold text-on-surface">18</span>
                    <span className="font-data-mono-sm text-[10px] text-on-surface-variant font-medium">unlabored</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low col-span-2 sm:col-span-1">
                  <span className="font-data-mono-sm text-[10px] uppercase text-outline block font-bold">
                    Urine Output
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-data-mono text-[16px] font-bold text-secondary">65</span>
                    <span className="font-data-mono-sm text-[10px] text-on-surface-variant">mL/hr (4h avg)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Active Problems & Organ Systems */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">account_tree</span>
                <h2 className="font-headline-sm text-on-surface font-bold text-[13px]">
                  2. Active Problems & Organ Systems
                </h2>
              </div>
              <span className="font-label-md text-on-surface-variant font-medium text-[11px]">3 Systems Tracked</span>
            </div>

            <div className="p-4 space-y-3">
              {/* CVS */}
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[13px] text-on-surface font-bold">
                        CVS — Cardiovascular
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-data-mono font-bold bg-amber-100 text-amber-800">
                        Controlled AFib
                      </span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mt-0.5 text-[12px]">
                      AFib controlled (HR 78–84). Trace peripheral edema (improved from 2+). JVP down to 8cm. Telemetry monitored continuously.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 font-data-mono-sm text-[11px] text-on-surface bg-surface-container-lowest px-2 py-1 rounded shadow-xs text-right font-medium">
                  Target HR: &lt;95 bpm
                </div>
              </div>

              {/* Renal */}
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[13px] text-on-surface font-bold">
                        Renal / Metabolic
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-data-mono font-bold bg-secondary-container/60 text-secondary">
                        Diuresis Active
                      </span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mt-0.5 text-[12px]">
                      Cr 1.45 (baseline 1.2 mg/dL). Serum K+ 4.1 mEq/L post-repletion. Spot urinary sodium 48 mEq/L indicates adequate loop diuretic response.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 font-data-mono-sm text-[11px] text-on-surface bg-surface-container-lowest px-2 py-1 rounded shadow-xs text-right font-medium">
                  Strict I/O • Daily Wt
                </div>
              </div>

              {/* Pulm */}
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">air</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[13px] text-on-surface font-bold">
                        Pulm — Respiratory
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-data-mono font-bold bg-emerald-100 text-emerald-800">
                        Improving
                      </span>
                    </div>
                    <p className="font-body-md text-on-surface-variant mt-0.5 text-[12px]">
                      Lungs clearing to bases bilaterally with minimal crackles. SpO2 96% on 2L nasal cannula. Able to speak in full sentences comfortably.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 font-data-mono-sm text-[11px] text-on-surface bg-surface-container-lowest px-2 py-1 rounded shadow-xs text-right font-medium">
                  Wean to RA as tol
                </div>
              </div>
            </div>
          </div>

          {/* 3. Shift Changes & Interventions Timeline */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">schedule</span>
                <h2 className="font-headline-sm text-on-surface font-bold text-[13px]">
                  3. Shift Changes & Interventions
                </h2>
              </div>
              <span className="font-data-mono-sm text-[11px] text-on-surface-variant font-medium">Day Shift Log</span>
            </div>
            <div className="p-4">
              <div className="space-y-4 relative pl-5">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-surface-container-high"></div>

                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white"></div>
                  <div className="flex-1 bg-surface-container-low p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono-sm text-[11px] text-primary font-bold">09:30 EST</span>
                      <span className="font-data-mono-sm text-[10px] text-outline">Medication Titration</span>
                    </div>
                    <p className="font-body-md text-on-surface mt-1 font-bold text-[12px]">
                      Weaned off Diltiazem drip to oral beta-blocker
                    </p>
                    <p className="font-body-sm text-on-surface-variant mt-0.5 text-[11px]">
                      Transitioned to Metoprolol Tartrate 25mg PO q6h. Stable hemodynamics maintained throughout transition.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-white"></div>
                  <div className="flex-1 bg-surface-container-low p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono-sm text-[11px] text-secondary font-bold">11:15 EST</span>
                      <span className="font-data-mono-sm text-[10px] text-outline">Bedside Imaging (POCUS)</span>
                    </div>
                    <p className="font-body-md text-on-surface mt-1 font-bold text-[12px]">
                      Lung ultrasound confirmed resolved pleural effusions
                    </p>
                    <p className="font-body-sm text-on-surface-variant mt-0.5 text-[11px]">
                      A-lines predominant in anterior fields, B-lines decreased from 8 to 2 per field in bilateral posterior bases.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white"></div>
                  <div className="flex-1 bg-surface-container-low p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono-sm text-[11px] text-amber-800 font-bold">13:00 EST</span>
                      <span className="font-data-mono-sm text-[10px] text-outline">Electrolyte Repletion</span>
                    </div>
                    <p className="font-body-md text-on-surface mt-1 font-bold text-[12px]">
                      IV KCl 40 mEq administered
                    </p>
                    <p className="font-body-sm text-on-surface-variant mt-0.5 text-[11px]">
                      Infused peripheral IV over 4 hours without phlebitis. Repeat serum potassium 4.1 mEq/L confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Active Pending Actions & Night Orders */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">checklist</span>
                <h2 className="font-headline-sm text-on-surface font-bold text-[13px]">
                  4. Active Pending Actions & Night Orders
                </h2>
              </div>
              <span className="font-data-mono-sm text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                3 Action Items
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                <input className="mt-0.5 h-4 w-4 rounded accent-primary text-primary focus:ring-0 cursor-pointer" type="checkbox" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-headline-sm text-[13px] text-on-surface group-hover:text-primary transition-colors font-semibold">
                      Check Repeat Troponin T @ 16:00
                    </span>
                    <span className="font-data-mono-sm text-[10px] font-bold px-2 py-0.5 rounded bg-error-container text-error uppercase">
                      High Priority • Due in 1h 15m
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-0.5 text-[11px]">
                    Ordered STAT lab label #44091. Rule out acute demand ischemia secondary to rapid ventricular response episode.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                <input className="mt-0.5 h-4 w-4 rounded accent-primary text-primary focus:ring-0 cursor-pointer" type="checkbox" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-headline-sm text-[13px] text-on-surface group-hover:text-primary transition-colors font-semibold">
                      Review Echocardiogram final cardiology report
                    </span>
                    <span className="font-data-mono-sm text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                      Medium Priority
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-0.5 text-[11px]">
                    Echo completed at 10:30 by Cardiology sonographer. Assess RV systolic pressure and valvular regurgitation severity.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                <input className="mt-0.5 h-4 w-4 rounded accent-primary text-primary focus:ring-0 cursor-pointer" type="checkbox" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-headline-sm text-[13px] text-on-surface group-hover:text-primary transition-colors font-semibold">
                      Morning BMP at 04:00 AM (Creatinine & Electrolytes)
                    </span>
                    <span className="font-data-mono-sm text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant uppercase">
                      Scheduled
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-0.5 text-[11px]">
                    Phlebotomy morning draw queued. Re-evaluate diuresis tolerance and verify stability of renal parameters prior to Day rounds.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 5. Overnight Contingency ("If-Then") Plans */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[19px]">emergency_home</span>
                <h2 className="font-headline-sm text-on-surface font-bold text-[13px]">
                  5. Overnight Contingency ("If-Then") Plans
                </h2>
              </div>
              <span className="font-data-mono-sm text-[10px] text-error font-bold uppercase">
                Strict Trigger Thresholds
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3.5 rounded-lg bg-error-container/20 flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="px-2 py-1 rounded bg-error text-on-error font-data-mono-sm text-[10px] font-bold shrink-0 uppercase tracking-wide self-start">
                  IF SBP &lt; 95
                </div>
                <div className="flex-1">
                  <span className="font-headline-sm text-[13px] text-on-surface font-bold">Hypotension Escapes</span>
                  <p className="font-body-md text-on-surface-variant mt-0.5 text-[12px]">
                    Hold oral Metoprolol dose. Reduce IV Lasix infusion from 10mg/hr down to 5mg/hr immediately. Alert night hospitalist on duty and re-check BP in 15 minutes.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50 flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="px-2 py-1 rounded bg-amber-600 text-white font-data-mono-sm text-[10px] font-bold shrink-0 uppercase tracking-wide self-start">
                  IF HR &gt; 115
                </div>
                <div className="flex-1">
                  <span className="font-headline-sm text-[13px] text-on-surface font-bold">
                    Tachycardia / RVR Recurrence
                  </span>
                  <p className="font-body-md text-on-surface-variant mt-0.5 text-[12px]">
                    Administer Metoprolol 5mg IV push x 1 dose. Obtain immediate 12-lead rhythm strip. Confirm SpO2 stability and notify resident on coverage.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="px-2 py-1 rounded bg-secondary text-white font-data-mono-sm text-[10px] font-bold shrink-0 uppercase tracking-wide self-start">
                  IF UOP &lt; 30
                </div>
                <div className="flex-1">
                  <span className="font-headline-sm text-[13px] text-on-surface font-bold">Oliguria Escalation</span>
                  <p className="font-body-md text-on-surface-variant mt-0.5 text-[12px]">
                    If UOP &lt; 30 mL/hr over two consecutive hours: Flush Foley catheter for patency, draw STAT Chem 7, and call Renal fellow on pager #2804.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Verification Status Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-[13px]">Verification Status</h3>
              </div>
              <span className="font-data-mono-sm text-[10px] text-secondary font-bold uppercase bg-secondary-container/40 px-2 py-0.5 rounded">
                Handshake Active
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Outgoing */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">person_outline</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-data-mono-sm text-[10px] uppercase text-outline block font-bold">
                    Outgoing Clinician
                  </span>
                  <p className="font-headline-sm text-on-surface font-bold truncate text-[13px]">
                    Dr. Marcus Chen, MD
                  </p>
                  <p className="font-body-sm text-on-surface-variant text-[11px]">
                    PGY-3 Internal Medicine Resident
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 font-data-mono-sm text-[11px] text-secondary font-medium">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Signed out at 14:15 EST</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-surface-container-low"></div>

              {/* Receiving */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-data-mono-sm text-[10px] uppercase text-primary font-bold block">
                    Receiving Clinician (You)
                  </span>
                  <p className="font-headline-sm text-on-surface font-bold truncate text-[13px]">
                    Dr. Eleanor Vance, MD
                  </p>
                  <p className="font-body-sm text-on-surface-variant text-[11px]">Attending Hospitalist</p>
                  <div className="flex items-center gap-1.5 mt-1 font-data-mono-sm text-[11px]">
                    {acknowledged ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>Acknowledged at 14:45 EST</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                        <span>Acknowledgment Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-surface-container-low"></div>

              {/* Transfer Parameters */}
              <div className="space-y-2 text-body-sm text-on-surface-variant text-[11px]">
                <div className="flex items-center justify-between">
                  <span>Handoff Type</span>
                  <span className="font-data-mono text-on-surface font-medium text-right">Day to Evening Transfer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unit Context</span>
                  <span className="font-data-mono text-on-surface font-medium text-right">4B Telemetry • Bed 402</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Standard Protocol</span>
                  <span className="font-data-mono text-on-surface font-medium text-right">I-PASS Hospital-Wide</span>
                </div>
              </div>

              {/* Completeness Audit */}
              <div className="p-3 rounded-lg bg-surface-container-low space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-[11px] text-on-surface font-bold">Completeness Audit</span>
                  <span className="font-data-mono-sm text-secondary font-bold text-[11px]">96% Compliant</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <p className="font-data-mono-sm text-[10px] text-outline">
                  Sign-out criteria meets ACGME and Joint Commission patient safety benchmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Sign-Off Acknowledgement Execution Box */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border-2 border-primary/20">
            <div className="bg-primary/5 px-4 py-3 flex items-center gap-2 border-b border-primary/10">
              <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
              <h3 className="font-headline-sm text-primary font-bold text-[13px]">Sign-Off Acknowledgement</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 rounded-lg bg-surface-container-low text-on-surface-variant font-body-sm text-[11px] leading-relaxed">
                By clicking <strong className="text-on-surface">"Acknowledge & Accept Care"</strong>, you confirm verbal/bedside transfer of clinical responsibility for this patient for the remainder of this shift.
              </div>

              {acknowledged ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2.5 text-emerald-900">
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">verified</span>
                  <div className="text-[12px]">
                    <strong className="block font-bold">Care Transferred & Acknowledged</strong>
                    <span className="text-[10px] text-emerald-700">Digital signature logged: EVANCE_MD</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAcceptCare}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-[13px] rounded-lg shadow-sm transition-all cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[19px]">check_circle</span>
                  <span>Acknowledge & Accept Care</span>
                </button>
              )}

              <p className="font-data-mono-sm text-[10px] text-center text-outline">
                Electronic signature will be timestamped to Cerner/Epic audit log (User: EVANCE_MD).
              </p>
            </div>
          </div>

          {/* Audit Trail & Change Log */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-[13px]">Audit Trail & Change Log</h3>
              </div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant font-medium">Real-Time</span>
            </div>
            <div className="p-4 space-y-3 font-body-sm text-[11px]">
              {auditList.map((aud, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div className="h-px bg-surface-container-low"></div>}
                  <div className="flex items-start gap-2.5">
                    <span className="font-data-mono-sm text-primary font-bold shrink-0">{aud.time}</span>
                    <div className="flex-1">
                      <span className="text-on-surface font-semibold">{aud.title}</span>
                      <p className="text-on-surface-variant font-data-mono-sm text-[10px]">{aud.by}</p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clarification Modal */}
      {clarifyOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat_bubble_outline</span>
                <h3 className="font-headline-md text-on-surface font-bold text-[15px]">
                  Request Clarification — {patient.name}
                </h3>
              </div>
              <button onClick={() => setClarifyOpen(false)} className="p-1 rounded hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block font-bold text-on-surface mb-1">Target Clinician</label>
                <div className="px-3 py-2 bg-surface-container-low rounded-lg text-on-surface font-medium">
                  Dr. Marcus Chen, MD (PGY-3) — Primary Outgoing Hospitalist
                </div>
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Inquiry / Clinical Question</label>
                <textarea
                  value={clarifyMsg}
                  onChange={(e) => setClarifyMsg(e.target.value)}
                  placeholder="e.g. Confirm if Cardiology approved holding oral ACEi if MAP drops below 75..."
                  className="w-full p-2.5 rounded-lg bg-surface-container-low focus:bg-white focus:ring-1 focus:ring-primary outline-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setClarifyOpen(false)}
                className="px-3 py-1.5 bg-surface-container rounded-lg font-label-lg text-[12px] hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendClarification}
                className="px-4 py-1.5 bg-primary-container text-on-primary rounded-lg font-headline-sm text-[12px] font-bold hover:bg-primary transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send via Voicera/Pager</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Addendum Modal */}
      {addendumOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">post_add</span>
                <h3 className="font-headline-md text-on-surface font-bold text-[15px]">Add Clinical Addendum</h3>
              </div>
              <button onClick={() => setAddendumOpen(false)} className="p-1 rounded hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-[12px]">
              <div className="bg-surface-container-low p-2.5 rounded-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                <span>Addenda are permanently appended with your timestamp and credentials.</span>
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Addendum Content</label>
                <textarea
                  value={addendumMsg}
                  onChange={(e) => setAddendumMsg(e.target.value)}
                  placeholder="Enter clinical addendum, updated lab, or bedside note..."
                  className="w-full p-2.5 rounded-lg bg-surface-container-low focus:bg-white focus:ring-1 focus:ring-primary outline-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setAddendumOpen(false)}
                className="px-3 py-1.5 bg-surface-container rounded-lg font-label-lg text-[12px] hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddendum}
                className="px-4 py-1.5 bg-primary-container text-on-primary rounded-lg font-headline-sm text-[12px] font-bold hover:bg-primary transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Commit Addendum</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
