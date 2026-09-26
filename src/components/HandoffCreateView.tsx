import React, { useState } from 'react';
import { Patient, IPassHandoff, IllnessSeverity } from '../types/clinical';

interface HandoffCreateViewProps {
  patient: Patient;
  handoffData: IPassHandoff;
  onSaveDraft: () => void;
  onSubmitForSignoff: (updatedHandoff: IPassHandoff) => void;
  onCancel: () => void;
}

export const HandoffCreateView: React.FC<HandoffCreateViewProps> = ({
  patient,
  handoffData,
  onSaveDraft,
  onSubmitForSignoff,
  onCancel,
}) => {
  const [acuity, setAcuity] = useState<IllnessSeverity>(handoffData.illnessSeverity);
  const [summary, setSummary] = useState(handoffData.patientSummary);
  const [socialNotes, setSocialNotes] = useState(handoffData.nightFloatNotes);
  const [actionItems, setActionItems] = useState(handoffData.actionList);
  const [newActionText, setNewActionText] = useState('');
  const [showAddAction, setShowAddAction] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleAction = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddNewAction = () => {
    if (!newActionText.trim()) return;
    const newItem = {
      id: `act-${Date.now()}`,
      title: newActionText.trim(),
      priorityLabel: 'ROUTINE • ASSIGNED TONIGHT',
      priorityColor: 'neutral' as const,
      completed: false,
    };
    setActionItems([...actionItems, newItem]);
    setNewActionText('');
    setShowAddAction(false);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const updated: IPassHandoff = {
        ...handoffData,
        illnessSeverity: acuity,
        patientSummary: summary,
        nightFloatNotes: socialNotes,
        actionList: actionItems,
        isAcknowledged: false,
        signedOutAt: '14:45 EST',
      };
      onSubmitForSignoff(updated);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-surface-container-lowest p-3.5 rounded-xl shadow-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider">
            <button onClick={onCancel} className="hover:text-primary transition-colors cursor-pointer">
              Patients
            </button>
            <span>/</span>
            <span className="font-data-mono-sm font-semibold text-on-surface">
              {patient.name} ({patient.mrn})
            </span>
            <span>/</span>
            <span className="text-primary font-bold">New Shift Handoff</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h1 className="font-headline-lg text-on-surface font-bold tracking-tight text-[20px]">
              Create Structured Clinical Handoff
            </h1>
            <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-data-mono-sm text-[11px] font-bold uppercase tracking-wide">
              I-PASS PROTOCOL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onSaveDraft}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-lg text-[12px] hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-outline">bookmark_border</span>
            <span>Save as Draft</span>
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-error font-label-lg text-[12px] hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer font-medium"
            type="button"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-[12px] font-bold hover:bg-primary transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {submitting ? 'sync' : 'verified_user'}
            </span>
            <span>{submitting ? 'Verifying with Epic...' : 'Submit Handoff for Sign-off'}</span>
          </button>
        </div>
      </div>

      {/* Sticky Mini-Chart Patient Demographic Strip */}
      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-y-2 text-on-surface">
        <div className="flex flex-wrap items-center gap-3 text-body-sm text-[12px]">
          <div className="flex items-center gap-2 pr-2">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            <span className="font-headline-sm text-on-surface font-bold">{patient.name}</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-data-mono-sm font-semibold">
              {patient.age}{patient.gender}
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-data-mono-sm bg-surface-container px-2 py-0.5 rounded">
            <span>MRN:</span>
            <strong className="text-on-surface font-bold">#{patient.mrn}</strong>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-data-mono-sm bg-surface-container px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[14px] text-secondary">meeting_room</span>
            <span>Bed:</span>
            <strong className="text-on-surface font-bold">{patient.bed}</strong>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-highest px-2 py-0.5 rounded text-on-surface font-label-md">
            <span>Code Status:</span>
            <span className="font-bold text-on-surface uppercase">{patient.codeStatus}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-md">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="font-bold">Allergies: {patient.allergies || 'NKDA'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-body-sm text-[12px] text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-outline">stethoscope</span>
            <span>Attending:</span>
            <strong className="text-on-surface font-semibold">{patient.attending}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-outline">calendar_today</span>
            <span>Admit:</span>
            <strong className="text-on-surface font-semibold">{patient.admitDate || 'Oct 21 (Day 3)'}</strong>
          </div>
        </div>
      </div>

      {/* Primary Two-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Left Column (7 of 10) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Acuity / Illness Severity Segmented Selector (I of I-PASS) */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-data-mono-sm font-bold text-[11px]">
                  I
                </span>
                <label className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  Illness Severity / Patient Acuity
                </label>
              </div>
              <span className="text-on-surface-variant font-label-md text-[11px]">
                Mandatory clinical triage classification
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Stable */}
              <label
                onClick={() => setAcuity('stable')}
                className={`cursor-pointer flex flex-col p-2.5 rounded-lg transition-all ${
                  acuity === 'stable'
                    ? 'bg-surface-container-highest ring-2 ring-secondary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="font-label-lg text-on-surface font-bold text-[12px]">Stable</span>
                  </div>
                  <input
                    type="radio"
                    name="acuity"
                    checked={acuity === 'stable'}
                    onChange={() => setAcuity('stable')}
                    className="accent-secondary h-4 w-4"
                  />
                </div>
                <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
                  Low risk of clinical decompensation overnight
                </p>
              </label>

              {/* Watcher / Guarded */}
              <label
                onClick={() => setAcuity('watcher')}
                className={`cursor-pointer flex flex-col p-2.5 rounded-lg transition-all ${
                  acuity === 'watcher'
                    ? 'bg-surface-container-highest ring-2 ring-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse"></span>
                    <span className="font-label-lg text-on-surface font-bold text-[12px]">
                      Watcher / Guarded
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="acuity"
                    checked={acuity === 'watcher'}
                    onChange={() => setAcuity('watcher')}
                    className="accent-primary h-4 w-4"
                  />
                </div>
                <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
                  Active titration, lab alert, or physiological shift
                </p>
              </label>

              {/* Unstable / Critical */}
              <label
                onClick={() => setAcuity('unstable')}
                className={`cursor-pointer flex flex-col p-2.5 rounded-lg transition-all ${
                  acuity === 'unstable'
                    ? 'bg-surface-container-highest ring-2 ring-error shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error"></span>
                    <span className="font-label-lg text-on-surface font-bold text-[12px]">
                      Unstable / Critical
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="acuity"
                    checked={acuity === 'unstable'}
                    onChange={() => setAcuity('unstable')}
                    className="accent-error h-4 w-4"
                  />
                </div>
                <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
                  Immediate intervention or ICU step-up anticipated
                </p>
              </label>
            </div>
          </div>

          {/* Section 1: Patient Summary & Current Clinical Status (P of I-PASS) */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-data-mono-sm font-bold text-[11px]">
                  P
                </span>
                <label className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  Patient Summary & Current Status
                </label>
              </div>
              <span className="font-data-mono-sm text-[11px] text-secondary font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> EMR Auto-Synthesized
              </span>
            </div>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-md text-[13px] p-3 rounded-lg resize-y focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-xs"
              rows={4}
            />

            {/* Vitals Metric Bar Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="font-data-mono-sm text-[10px] text-on-surface-variant block uppercase font-bold">
                  BP (NIBP)
                </span>
                <span className="font-data-mono text-[13px] font-bold text-on-surface">118/72</span>
                <span className="font-label-md text-[10px] text-secondary ml-1 font-bold">MAP 87</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="font-data-mono-sm text-[10px] text-on-surface-variant block uppercase font-bold">
                  HR (Telemetry)
                </span>
                <span className="font-data-mono text-[13px] font-bold text-on-surface">82 bpm</span>
                <span className="font-label-md text-[10px] text-on-surface-variant ml-1 font-bold">AFib SR</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="font-data-mono-sm text-[10px] text-on-surface-variant block uppercase font-bold">
                  SpO2
                </span>
                <span className="font-data-mono text-[13px] font-bold text-on-surface">95%</span>
                <span className="font-label-md text-[10px] text-on-surface-variant ml-1 font-bold">2L NC</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="font-data-mono-sm text-[10px] text-on-surface-variant block uppercase font-bold">
                  Resp. Rate
                </span>
                <span className="font-data-mono text-[13px] font-bold text-on-surface">18 /min</span>
                <span className="font-label-md text-[10px] text-secondary ml-1 font-bold">Reg</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <span className="font-data-mono-sm text-[10px] text-on-surface-variant block uppercase font-bold">
                  Temp (Oral)
                </span>
                <span className="font-data-mono text-[13px] font-bold text-on-surface">36.8 °C</span>
                <span className="font-label-md text-[10px] text-secondary ml-1 font-bold">Afebrile</span>
              </div>
            </div>
          </div>

          {/* Section 2: Active Clinical Issues & Systems Assessment */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">account_tree</span>
                <h3 className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  Active Clinical Issues & Systems Assessment
                </h3>
              </div>
              <span className="text-on-surface-variant font-label-md text-[11px]">3 Active Systems Tracked</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {handoffData.systemsAssessment.map((sys, idx) => (
                <div key={idx} className="p-3 bg-surface-container-low rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-surface-container">
                      <span className="font-label-lg text-[12px] font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">
                          {sys.system.includes('Cardio') ? 'cardiology' : sys.system.includes('Renal') ? 'water_drop' : 'air'}
                        </span>
                        {sys.system}
                      </span>
                      <span className="font-data-mono-sm text-[10px] text-secondary bg-surface-container px-1 rounded font-bold">
                        {sys.statusBadge}
                      </span>
                    </div>
                    <p className="font-body-sm text-[11px] text-on-surface">{sys.details}</p>
                  </div>
                  {sys.metric && (
                    <div className="mt-2 text-on-surface-variant font-data-mono-sm text-[10px] font-semibold">
                      {sys.metric}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recent Events & Changes (Current Shift) */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">schedule</span>
                <h3 className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  Recent Events & Changes (Current Shift)
                </h3>
              </div>
              <span className="text-on-surface-variant font-data-mono-sm text-[11px]">3 events recorded</span>
            </div>

            <div className="space-y-1.5">
              {handoffData.recentShiftEvents.map((evt, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-3">
                  <span className="font-data-mono-sm text-[11px] font-bold text-primary bg-surface-container px-1.5 py-0.5 rounded">
                    {evt.time}
                  </span>
                  <div className="text-body-sm text-[12px] text-on-surface">
                    {evt.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Pending Investigations & Diagnostic Checks (A of I-PASS) */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-data-mono-sm font-bold text-[11px]">
                  A
                </span>
                <h3 className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  Action List & Pending Diagnostic Checks
                </h3>
              </div>
              <button
                onClick={() => setShowAddAction(!showAddAction)}
                className="text-primary font-label-md text-[11px] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">add</span> Add Action Item
              </button>
            </div>

            {showAddAction && (
              <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center gap-2">
                <input
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  placeholder="Enter new diagnostic or clinical to-do item..."
                  className="flex-1 px-3 py-1.5 bg-white text-[12px] rounded border border-outline-variant outline-none"
                />
                <button
                  onClick={handleAddNewAction}
                  className="px-3 py-1.5 bg-primary text-white text-[11px] font-bold rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            )}

            <div className="space-y-2">
              {actionItems.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 bg-surface-container-low rounded-lg flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      checked={act.completed}
                      onChange={() => toggleAction(act.id)}
                      className="h-4 w-4 rounded accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <label
                      className={`font-body-md text-[12px] text-on-surface cursor-pointer ${
                        act.completed ? 'line-through text-on-surface-variant' : ''
                      }`}
                    >
                      {act.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-data-mono-sm text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        act.priorityColor === 'error'
                          ? 'bg-error-container text-on-error-container'
                          : act.priorityColor === 'amber'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-surface-container text-on-surface-variant font-medium'
                      }`}
                    >
                      {act.priorityLabel}
                    </span>
                    <span className="material-symbols-outlined text-outline text-[18px]">more_vert</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: "If/Then" Contingency Action Plans (S of I-PASS) */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-data-mono-sm font-bold text-[11px]">
                  S
                </span>
                <h3 className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  "If / Then" Contingency Action Plans
                </h3>
              </div>
              <span className="font-label-md text-error flex items-center gap-1 font-bold text-[11px]">
                <span className="material-symbols-outlined text-[15px]">crisis_alert</span> High Risk Thresholds
              </span>
            </div>

            <div className="space-y-2">
              {handoffData.contingencies.map((ctg, idx) => (
                <div key={idx} className="p-3 bg-surface-container-low rounded-lg flex items-start gap-3">
                  <div
                    className={`px-1.5 py-0.5 rounded font-data-mono-sm text-[10px] font-bold ${
                      ctg.isHighRisk ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    IF
                  </div>
                  <div className="space-y-1">
                    <div className="font-headline-sm text-[13px] text-on-surface font-semibold">
                      {ctg.condition}:
                    </div>
                    <div className="font-body-md text-[12px] text-on-surface-variant flex items-center gap-1.5">
                      <span className="font-bold text-primary">THEN →</span> {ctg.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Night Float Notes & Social Context */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">family_restroom</span>
                <label className="font-headline-sm text-on-surface uppercase tracking-wide text-[13px] font-bold">
                  Night Float Notes & Social Context
                </label>
              </div>
              <span className="text-on-surface-variant font-label-md text-[11px]">Family & Disposition Alignment</span>
            </div>
            <textarea
              value={socialNotes}
              onChange={(e) => setSocialNotes(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-md text-[12px] p-3 rounded-lg resize-y focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-xs"
              rows={2}
            />
          </div>
        </div>

        {/* Right Column (3 of 10) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Completeness Score */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-on-surface font-bold text-[13px]">Completeness Score</span>
              <span className="font-data-mono-sm text-[10px] text-secondary bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 rounded font-bold">
                High Reliability
              </span>
            </div>

            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg">
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-data-mono font-bold text-on-surface text-[14px]">92%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-on-surface font-bold text-[12px]">Ready for Handover</span>
                <span className="font-body-sm text-on-surface-variant text-[11px]">5 of 6 verification gates passed</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Patient acuity categorized ({acuity === 'watcher' ? 'Watcher' : acuity})</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Core problem & issues documented</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Actionable tasks with clear deadlines</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>"If/Then" contingency rules specified</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Code status & surrogate verified</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-outline text-[16px]">radio_button_unchecked</span>
                <span>Dual-clinician acknowledgment pending</span>
              </div>
            </div>
          </div>

          {/* Clinician Transfer Roles */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[19px]">swap_horizontal_circle</span>
              <h3 className="font-headline-sm text-on-surface font-bold text-[13px]">Clinician Transfer Roles</h3>
            </div>

            <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1">
              <span className="font-label-md text-on-surface-variant uppercase tracking-wider block text-[10px] font-bold">
                Off-Going Clinician
              </span>
              <div className="flex items-center gap-2.5">
                <img
                  className="w-7 h-7 rounded-full object-cover"
                  src={handoffData.offGoingClinician.photoUrl}
                  alt={handoffData.offGoingClinician.name}
                />
                <div className="flex flex-col">
                  <span className="font-label-lg font-bold text-on-surface text-[12px]">
                    {handoffData.offGoingClinician.name}
                  </span>
                  <span className="font-data-mono-sm text-on-surface-variant text-[10px]">
                    {handoffData.offGoingClinician.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-on-surface-variant uppercase tracking-wider block text-[10px] font-bold">
                Receiving Clinician (Incoming)
              </label>
              <div className="relative">
                <select className="w-full bg-surface-container-low text-on-surface font-body-md text-[12px] p-2 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-primary pr-8">
                  <option>Dr. Eleanor Vance, MD (Attending Hospitalist)</option>
                  <option>Dr. Daniel Thorne, MD (Night Hospitalist)</option>
                  <option>Dr. Sofia Alvarez, MD (Night PGY-2 Resident)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-on-surface-variant pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-on-surface-variant uppercase tracking-wider block text-[10px] font-bold">
                Sign-Out Mode
              </label>
              <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">how_to_reg</span>
                  <span className="font-label-md font-bold text-on-surface text-[11px]">
                    Bedside + Digital Sign
                  </span>
                </div>
                <span className="font-data-mono-sm text-primary uppercase font-bold text-[10px]">Required</span>
              </div>
            </div>
          </div>

          {/* Safety & Audit Guard */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[19px]">verified</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-[13px]">Safety & Audit Guard</h3>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-data-mono-sm text-[10px] font-bold">
                v4.2
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">neurology</span>
              <div className="space-y-1">
                <div className="font-label-lg font-bold text-on-surface text-[12px]">AI Continuity Assist</div>
                <p className="font-body-sm text-on-surface-variant leading-snug text-[11px]">
                  Verified no drug-drug or pharmacokinetic contraindications between Metoprolol and recent KCl repletion order. Fluid balance calculations conform to telemetry target thresholds.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-surface-container rounded-lg flex items-center justify-between font-data-mono-sm text-[10px]">
              <span className="text-on-surface-variant">EMR Direct Telemetry Link</span>
              <span className="text-secondary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Synchronized
              </span>
            </div>
          </div>

          {/* Bottom Submission Warning & Sign Off Callout */}
          <div className="bg-surface-container-high p-3.5 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-on-surface font-headline-sm text-[13px] font-bold">
              <span className="material-symbols-outlined text-primary text-[18px]">security</span>
              <span>Legal Transfer of Custody</span>
            </div>
            <p className="font-body-sm text-on-surface-variant leading-tight text-[11px]">
              Submitting this shift handoff transfers responsibility for clinical telemetry, lab follow-ups, and crisis triggers to the receiving provider upon verbal confirmation.
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2 bg-primary text-on-primary font-label-lg text-[12px] font-bold rounded-lg hover:bg-primary-container transition-colors shadow-xs flex items-center justify-center gap-2 mt-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              <span>{submitting ? 'Signing...' : 'Sign & Dispatch Handoff'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
