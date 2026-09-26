import React, { useState } from 'react';
import { Patient } from '../types/clinical';

interface TimelineViewProps {
  patient: Patient;
  onNavigateBack: () => void;
  onNewEvent?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  patient,
  onNavigateBack,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('meds');
  const [eventNotes, setEventNotes] = useState('');

  const [completedEvents, setCompletedEvents] = useState([
    {
      id: 'evt-1',
      time: '14:15 EST',
      title: 'Shift Handoff: Day Shift Handover Signed',
      badge: '96% COMPLETE HANDOVER',
      badgeColor: 'teal',
      category: 'handoff',
      summary:
        'Formal transition completed from Dr. Marcus Chen (PGY-3) to Dr. Eleanor Vance (Attending Hospitalist). Structured I-PASS protocol validated with synthesis read-back.',
      details: {
        severity: 'Watcher. Heart failure compensated on oral switch. Telemetry rate well-controlled.',
        actions: 'Check AM Troponin; verify SBP > 100 before 18:00 Metoprolol; reassess diuresis.',
      },
    },
    {
      id: 'evt-2',
      time: '13:00 EST',
      title: 'Medication Administered: Potassium Chloride Infusion Complete',
      badge: 'IV Infusion Pump #PU-12',
      badgeColor: 'slate',
      category: 'meds',
      summary:
        'Administered 40 mEq Potassium Chloride in 100 mL Sterile H2O over 2 hours via peripheral IV in right forearm. Site intact, no phlebitis or discomfort reported by patient.',
      meta: 'Pre-Infusion K+: 3.2 mmol/L (Low) | Follow-up: Ordered for 04:00 AM BMP | Administered by: J. Walsh, RN',
    },
    {
      id: 'evt-3',
      time: '11:15 EST',
      title: 'Bedside Ultrasound: Point-of-Care Ultrasound (POCUS)',
      badge: 'Cardiology Fellow Consult',
      badgeColor: 'blue',
      category: 'procedures',
      quote:
        '“B-lines significantly improved compared to admission imaging; no gross pericardial effusion identified; IVC plethoric > 2.1cm with < 50% collapsibility index consistent with moderate persistent volume overload, responsive to IV loop diuresis.”',
      author: 'Operator: Dr. S. Rao, MD (Cardiovascular Fellow) • View 4 CINE Loops Attached',
    },
    {
      id: 'evt-4',
      time: '09:30 EST',
      title: 'Medication Modification: IV Diltiazem Drip Discontinued',
      badge: 'ORAL TRANSITION ACTIVE',
      badgeColor: 'teal',
      category: 'meds',
      summary:
        'IV Diltiazem continuous infusion discontinued (last titration 5 mg/hr). Patient safely transitioned to scheduled oral beta-blocker therapy (Metoprolol tartrate 25 mg PO BID). Line cleared.',
    },
    {
      id: 'evt-5',
      time: '08:15 EST',
      title: 'Vital Signs Alert: Transient Tachycardia Episode',
      badge: 'TELEMETRY UNIT ALARM',
      badgeColor: 'red',
      category: 'vitals',
      isAlert: true,
      summary:
        'Atrial Fibrillation with Rapid Ventricular Response (AFib with RVR). Peak rate recorded at 118 bpm lasting 18 minutes. Blood pressure remained stable at 112/68 mmHg (MAP 82 mmHg). Patient denied acute angina, diaphoresis, or presyncope.',
      resolution:
        'Clinical Resolution: Metoprolol dose titration initiated by Dr. M. Chen; heart rate resolved to baseline 78-84 bpm within 45 minutes.',
    },
    {
      id: 'evt-6',
      time: '07:15 EST',
      title: 'Morning Shift Handoff: Night Float Sign-off Completed',
      badge: 'Overnight Cross-Cover Log',
      badgeColor: 'blue',
      category: 'handoff',
      summary:
        'Night float resident Dr. K. Lin, MD handed off to Day team. Night summary: “Patient rested comfortably overnight without telemetry alerts. Net negative fluid balance 800 mL post-midnight Bumex dose. Supplemental O2 weaned from 3L to room air at 06:00.”',
    },
  ]);

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;
    const newEvt = {
      id: `evt-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      title: eventTitle.trim(),
      badge: 'MANUAL ENTRY',
      badgeColor: 'blue',
      category: eventCategory,
      summary: eventNotes.trim() || 'Clinical event logged into patient timeline.',
    };
    setCompletedEvents([newEvt, ...completedEvents]);
    setEventTitle('');
    setEventNotes('');
    setEventModalOpen(false);
  };

  const filteredStream = completedEvents.filter((item) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'handoff' && item.category === 'handoff') return true;
    if (filterCategory === 'meds' && item.category === 'meds') return true;
    if (filterCategory === 'vitals' && item.category === 'vitals') return true;
    if (filterCategory === 'procedures' && item.category === 'procedures') return true;
    return false;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Top Breadcrumb & Controls */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 font-label-md text-on-surface-variant text-[11px]">
            <button onClick={onNavigateBack} className="hover:text-primary cursor-pointer transition-colors">
              Patients
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">
              {patient.name} <span className="font-data-mono-sm text-on-surface-variant">({patient.mrn})</span>
            </span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Clinical Timeline</span>
          </nav>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-on-surface hover:bg-surface-container rounded-lg font-label-lg text-[12px] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              <span>Today (Oct 24)</span>
              <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-on-surface hover:bg-surface-container rounded-lg font-label-lg text-[12px] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span className="hidden sm:inline">Print Timeline</span>
            </button>
            <button
              onClick={() => setEventModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-lg text-[12px] shadow-xs transition-all cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Clinical Event</span>
            </button>
          </div>
        </div>

        {/* Patient Identity Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="font-headline-lg text-on-surface font-bold text-[18px]">
                Patient Continuity Timeline — {patient.name}
              </span>
              <span className="bg-error-container text-on-error-container font-data-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                WATCHER / TELEMETRY
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-body-sm text-[12px] mt-1">
              <span className="font-bold text-on-surface">{patient.age}{patient.gender}</span>
              <span>•</span>
              <span className="font-data-mono-sm font-bold text-primary">{patient.bed}</span>
              <span>•</span>
              <span>Diagnosis: <strong className="text-on-surface font-semibold">{patient.primaryDiagnosis}</strong></span>
              <span>•</span>
              <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium">Hospital Day 3</span>
              <span>•</span>
              <span className="text-error font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">emergency</span> DNR / DNI Confirmed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-low px-3 py-2 rounded-lg">
            <div className="flex flex-col text-right">
              <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">
                Attending On-Record
              </span>
              <span className="font-label-lg text-on-surface font-bold text-[12px]">
                Dr. Eleanor Vance, MD
              </span>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>
            <div className="flex flex-col text-right">
              <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">Primary RN</span>
              <span className="font-label-lg text-on-surface font-bold text-[12px]">
                Jessica Walsh, RN (Ext. 4412)
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full font-label-md text-[11px] shadow-xs flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>All Events</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded-full font-data-mono text-[10px]">14</span>
          </button>
          <button
            onClick={() => setFilterCategory('handoff')}
            className={`px-3 py-1 rounded-full font-label-md text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'handoff'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span>Handoffs & Sign-outs</span>
            <span className="bg-surface-container-highest px-1.5 py-0.2 rounded-full font-data-mono-sm text-[10px]">4</span>
          </button>
          <button
            onClick={() => setFilterCategory('meds')}
            className={`px-3 py-1 rounded-full font-label-md text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'meds'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Medication Changes</span>
            <span className="bg-surface-container-highest px-1.5 py-0.2 rounded-full font-data-mono-sm text-[10px]">3</span>
          </button>
          <button
            onClick={() => setFilterCategory('vitals')}
            className={`px-3 py-1 rounded-full font-label-md text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'vitals'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span>Vital Sign Alerts</span>
            <span className="bg-error-container text-on-error-container font-bold px-1.5 py-0.2 rounded-full font-data-mono-sm text-[10px]">
              2
            </span>
          </button>
          <button
            onClick={() => setFilterCategory('procedures')}
            className={`px-3 py-1 rounded-full font-label-md text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'procedures'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
            <span>Procedures</span>
            <span className="bg-surface-container-highest px-1.5 py-0.2 rounded-full font-data-mono-sm text-[10px]">1</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 of 12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Upcoming / Scheduled Protocol (Next 12 Hours) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-primary-fixed text-primary">
                  <span className="material-symbols-outlined text-[16px]">update</span>
                </span>
                <span className="font-headline-sm text-on-surface uppercase tracking-wider text-[12px] font-bold">
                  Upcoming / Scheduled Protocol (Next 12 Hours)
                </span>
              </div>
              <span className="font-data-mono-sm text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-medium">
                Current Time: 14:48 EST
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/60 before:border-l-2 before:border-dashed before:border-outline-variant">
              {/* Event 1 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-75"></span>
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                </div>
                <div className="bg-surface-container-low hover:bg-surface-container p-3 rounded-lg shadow-xs transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-[12px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        16:00 EST
                      </span>
                      <span className="font-label-lg text-on-surface font-bold text-[12px]">
                        Scheduled Diagnostic: Repeat Troponin T Draw & Rapid Result
                      </span>
                    </div>
                    <span className="font-data-mono-sm text-[10px] uppercase font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                      Order Active In Phlebotomy Queue
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-1.5 text-[11px]">
                    Serial Troponin sequence #3 post-cardioversion protocol. Phlebotomy bar code generated (
                    <span className="font-data-mono-sm font-bold text-on-surface">LAB-89104</span>). Stat turnaround requested by cardiology.
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                </div>
                <div className="bg-surface-container-low hover:bg-surface-container p-3 rounded-lg shadow-xs transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-[12px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                        17:00 EST
                      </span>
                      <span className="font-label-lg text-on-surface font-bold text-[12px]">
                        Clinical Milestone: Evening Attending Rounding & Family Discussion
                      </span>
                    </div>
                    <span className="font-label-md text-[11px] text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">groups</span> Interdisciplinary Care Conference
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-1.5 text-[11px]">
                    Bedside goals-of-care update with Healthcare Proxy (
                    <strong className="text-on-surface">Sarah Callahan - Daughter / POA</strong>). Will review diuretic response, pacing threshold stability, and anticipated telemetry step-down roadmap.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                </div>
                <div className="bg-surface-container-low hover:bg-surface-container p-3 rounded-lg shadow-xs transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-[12px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded">
                        18:00 EST
                      </span>
                      <span className="font-label-lg text-on-surface font-bold text-[12px]">
                        Medication Due: Oral Metoprolol Tartrate 25 mg BID
                      </span>
                    </div>
                    <span className="font-data-mono-sm text-[10px] uppercase font-bold text-error bg-error-container px-2 py-0.5 rounded">
                      Contingency Trigger
                    </span>
                  </div>
                  <div className="mt-2 bg-error-container/40 p-2 rounded text-on-surface font-body-sm flex items-start gap-2 text-[11px]">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">warning</span>
                    <span>
                      <strong>Standing Safety Parameter:</strong> Verify resting heart rate &gt; 60 bpm and SBP &gt; 100 mmHg prior to administration. If telemetry demonstrates recurrence of AFib &gt; 110, alert cross-cover fellow.
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                </div>
                <div className="bg-surface-container-low hover:bg-surface-container p-3 rounded-lg shadow-xs transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-[12px] font-semibold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded">
                        04:00 AM (Oct 25)
                      </span>
                      <span className="font-label-lg text-on-surface font-bold text-[12px]">
                        Routine Morning Lab Panel
                      </span>
                    </div>
                    <span className="font-data-mono-sm text-[10px] text-on-surface-variant">Scheduled Batch Order</span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-1.5 text-[11px]">
                    Orders pre-authorized: Basic Metabolic Panel (BMP), Serum Magnesium, Complete Blood Count (CBC). Follow-up required for potassium recovery trajectory post-IV repletion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Clinical Stream (Today, Oct 24) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-[16px]">history</span>
                </span>
                <span className="font-headline-sm text-on-surface uppercase tracking-wider text-[12px] font-bold">
                  Completed Clinical Stream (Today, Oct 24)
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-[11px]">
                <span>Sorted Reverse Chronological</span>
                <span className="material-symbols-outlined text-[14px]">sort</span>
              </div>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
              {filteredStream.map((evt) => (
                <div key={evt.id} className="relative">
                  <div
                    className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                      evt.isAlert
                        ? 'bg-error'
                        : evt.category === 'handoff'
                        ? 'bg-primary'
                        : evt.category === 'procedures'
                        ? 'bg-surface-tint'
                        : 'bg-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[10px]">
                      {evt.isAlert ? 'vital_signs' : evt.category === 'handoff' ? 'swap_horiz' : evt.category === 'procedures' ? 'radiology' : 'medication'}
                    </span>
                  </div>

                  <div
                    className={`bg-surface-container-lowest hover:bg-surface-container-low p-4 rounded-xl shadow-xs transition-all ${
                      evt.isAlert ? 'border-l-4 border-l-error' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-data-mono text-[12px] font-bold px-2 py-0.5 rounded ${
                            evt.isAlert ? 'text-error bg-error-container' : 'text-primary bg-primary-fixed'
                          }`}
                        >
                          {evt.time}
                        </span>
                        <span className={`font-headline-sm text-[13px] font-bold ${evt.isAlert ? 'text-error' : 'text-on-surface'}`}>
                          {evt.title}
                        </span>
                      </div>
                      <span className="font-data-mono-sm text-[10px] uppercase font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded flex items-center gap-1">
                        {evt.badge}
                      </span>
                    </div>

                    {evt.summary && (
                      <p className="font-body-sm text-on-surface mt-2 text-[12px]">{evt.summary}</p>
                    )}

                    {evt.quote && (
                      <div className="mt-2 p-3 bg-surface-container-low rounded-lg font-body-sm text-on-surface text-[12px]">
                        <p className="italic text-on-surface-variant font-body-md">{evt.quote}</p>
                        <div className="mt-2 text-on-surface-variant font-data-mono-sm text-[11px]">
                          {evt.author}
                        </div>
                      </div>
                    )}

                    {evt.details && (
                      <div className="mt-3 bg-surface-container p-3 rounded-lg text-on-surface space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-body-sm">
                          <div className="bg-surface-container-lowest p-2 rounded">
                            <span className="font-bold text-primary block text-[10px] uppercase">
                              Illness Severity:
                            </span>
                            <span>{evt.details.severity}</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded">
                            <span className="font-bold text-primary block text-[10px] uppercase">
                              Action List:
                            </span>
                            <span>{evt.details.actions}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {evt.meta && (
                      <div className="mt-2.5 flex items-center gap-3 font-data-mono-sm text-[11px] bg-surface-container-low p-2 rounded">
                        <span>{evt.meta}</span>
                      </div>
                    )}

                    {evt.resolution && (
                      <div className="mt-2.5 flex items-center gap-2 text-on-surface font-body-sm bg-surface-container p-2 rounded text-[11px]">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                        <span>{evt.resolution}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* 24-Hour Clinical Trajectory */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">monitoring</span>
                <span className="font-headline-sm text-on-surface font-bold text-[13px]">
                  24-Hour Clinical Trajectory
                </span>
              </div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-bold">
                Rolling 24h
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between">
                <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">
                  Net Fluid Balance
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-data-mono text-[18px] font-bold text-primary">-1,850</span>
                  <span className="font-data-mono-sm text-[11px] text-on-surface-variant">mL</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="font-label-md text-[10px] text-secondary mt-1 font-bold">
                  Goal: -2,000 mL/day (92.5%)
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between">
                <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">
                  Cumulative Weight
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-data-mono text-[18px] font-bold text-on-surface">76.4</span>
                  <span className="font-data-mono-sm text-[11px] text-on-surface-variant">kg</span>
                </div>
                <span className="font-data-mono-sm text-[11px] text-secondary font-bold flex items-center gap-0.5 mt-2">
                  <span className="material-symbols-outlined text-[13px]">trending_down</span> -2.8 kg since admit
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant mt-0.5">Admit baseline: 79.2 kg</span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between">
                <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">
                  Mean Arterial Pressure (MAP)
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-data-mono text-[18px] font-bold text-on-surface">78</span>
                  <span className="font-data-mono-sm text-[11px] text-on-surface-variant">mmHg</span>
                </div>
                <span className="font-data-mono-sm text-[11px] text-secondary font-bold flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Hemodynamically Stable
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant mt-0.5">Range today: 71 - 84</span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between">
                <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">
                  Cardiac Rhythm Control
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-data-mono text-[18px] font-bold text-on-surface">81</span>
                  <span className="font-data-mono-sm text-[11px] text-on-surface-variant">bpm</span>
                </div>
                <span className="font-data-mono-sm text-[11px] text-on-surface-variant font-bold flex items-center gap-1 mt-2">
                  Rate Controlled AFib
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant mt-0.5">Max: 118 | Min: 66</span>
              </div>
            </div>

            {/* SVG Telemetry Sparkline */}
            <div className="bg-surface-container p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-on-surface-variant uppercase text-[10px] font-bold">
                  24h Telemetry Heart Rate Trend
                </span>
                <span className="font-data-mono-sm text-[10px] text-on-surface-variant">Target &lt; 90 bpm</span>
              </div>
              <div className="w-full h-12 flex items-end">
                <svg className="w-full h-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 240 45">
                  <path
                    d="M 0,25 Q 20,24 40,26 T 80,10 T 120,28 T 160,26 T 200,24 T 240,22"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx="80" cy="10" r="3.5" fill="#ba1a1a" />
                </svg>
              </div>
              <div className="flex justify-between font-data-mono-sm text-[9px] text-on-surface-variant pt-1 font-medium">
                <span>00:00</span>
                <span className="text-error font-bold">08:15 Alert (118)</span>
                <span>12:00</span>
                <span>Now (81)</span>
              </div>
            </div>
          </div>

          {/* Continuity Team Log */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <span className="font-headline-sm text-on-surface font-bold text-[13px]">Continuity Team Log</span>
              </div>
              <span className="font-data-mono-sm text-[10px] text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded">
                Active Shift
              </span>
            </div>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-[12px]">
                    EV
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-on-surface font-bold">Dr. Eleanor Vance, MD</span>
                    <span className="font-label-md text-on-surface-variant text-[10px]">Day Attending Physician</span>
                  </div>
                </div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Direct Pager Link">
                  <span className="material-symbols-outlined text-[18px]">contact_phone</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-surface-tint text-white flex items-center justify-center font-bold text-[12px]">
                    MC
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-on-surface font-bold">Dr. Marcus Chen, MD</span>
                    <span className="font-label-md text-on-surface-variant text-[10px]">Day Resident (PGY-3)</span>
                  </div>
                </div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Direct Pager Link">
                  <span className="material-symbols-outlined text-[18px]">contact_phone</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-[12px]">
                    JW
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-on-surface font-bold">Jessica Walsh, RN</span>
                    <span className="font-label-md text-on-surface-variant text-[10px]">Assigned Primary Nurse • Ext. 4412</span>
                  </div>
                </div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Call Vocera">
                  <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-tertiary-container text-white flex items-center justify-center font-bold text-[12px]">
                    MD
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-on-surface font-bold">Mark Davies, MSW</span>
                    <span className="font-label-md text-on-surface-variant text-[10px]">Case Manager & Social Worker</span>
                  </div>
                </div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Message">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Opening 48-hour provider sign-in archive...')}
                className="w-full py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface font-label-md text-[11px] text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>View Shift Assignment History (48h)</span>
              </button>
            </div>
          </div>

          {/* Discharge Contingency Milestones */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 space-y-2">
            <span className="font-headline-sm text-on-surface block text-[13px] font-bold">
              Discharge Contingency Milestones
            </span>
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span className="line-through text-on-surface-variant">Wean continuous IV inotropes/diltiazem</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span className="line-through text-on-surface-variant">Tolerating PO beta-blockade</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-outline-variant text-[16px]">radio_button_unchecked</span>
                <span>Maintain stable weight for 24h on oral loop diuretic</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-outline-variant text-[16px]">radio_button_unchecked</span>
                <span>Home health nurse coordination for low-sodium diet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <h3 className="font-headline-md text-on-surface font-bold text-[15px]">
                  Add Clinical Event to Timeline
                </h3>
              </div>
              <button onClick={() => setEventModalOpen(false)} className="p-1 rounded hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block font-bold text-on-surface mb-1">Event Title</label>
                <input
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Echo read: EF 25% confirmed"
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded focus:bg-white focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded"
                >
                  <option value="meds">Medication Modification</option>
                  <option value="handoff">Shift Handoff / Transfer</option>
                  <option value="vitals">Vital Signs Alert</option>
                  <option value="procedures">Procedure / Diagnostic</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Clinical Details</label>
                <textarea
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  placeholder="Enter details, physician notes, or dosage updates..."
                  className="w-full p-2.5 bg-surface-container-low rounded focus:bg-white focus:ring-1 focus:ring-primary outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setEventModalOpen(false)}
                className="px-3.5 py-1.5 bg-surface-container rounded font-label-lg text-[12px] hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-1.5 bg-primary text-white rounded font-label-lg text-[12px] font-bold hover:bg-primary-container cursor-pointer"
              >
                Log Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
