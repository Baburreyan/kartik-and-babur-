import React, { useState } from 'react';
import { Patient } from '../types/clinical';

interface DashboardViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onCreateHandoff: (patientId?: string) => void;
  onReviewHandoff: (patientId: string) => void;
  onBatchAcknowledge: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  onSelectPatient,
  onCreateHandoff,
  onReviewHandoff,
  onBatchAcknowledge,
}) => {
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'needs-review' | 'drafting' | 'acknowledged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Acuities');
  const [wardFilter, setWardFilter] = useState('Unit 4B (All 24)');
  const [clinicianFilter, setClinicianFilter] = useState('All Residents');
  const [checklistOpen, setChecklistOpen] = useState(false);

  // Incoming shift handoffs list
  const incomingHandoffs = [
    {
      patientId: 'pt-callahan',
      name: 'Margaret Callahan',
      age: '74F',
      mrn: '#MRN-84920',
      bed: 'Bed 402-A',
      service: 'Cardiology Telemetry',
      diagnosis: 'ADHF, EF 25%, AFib with RVR',
      newsBadge: 'NEWS 6 • High',
      newsColor: 'red',
      vitalsMini: 'HR 118 • BP 94/58',
      priority: 'HIGH',
      clinician: 'Dr. Marcus Chen, PGY-3',
      offGoing: 'Off-going 14:30',
      status: 'Pending Acknowledgment',
      statusColor: 'amber',
      pendingAlert: 'Rep. Troponin @ 16:00',
      pendingNotes: 'Echo read pending • Titrate Lasix gtt',
      actionType: 'ack',
    },
    {
      patientId: 'pt-henderson',
      name: 'Robert K. Henderson',
      age: '61M',
      mrn: '#MRN-91204',
      bed: 'Bed 405-B',
      service: 'Cardiothoracic Surgery',
      diagnosis: 'Post-Op CABG Day 2, Post-extubation atelectasis',
      newsBadge: 'NEWS 4 • Med',
      newsColor: 'amber',
      vitalsMini: 'SpO2 93% on 2L • RR 20',
      priority: 'MEDIUM',
      clinician: 'Dr. Marcus Chen, PGY-3',
      offGoing: 'Off-going 14:30',
      status: 'Pending Acknowledgment',
      statusColor: 'amber',
      pendingAlert: 'CXR 4-hour check • Chest tube output',
      pendingNotes: 'Incentive spirometry q1h',
      actionType: 'ack',
    },
    {
      patientId: 'pt-brooks',
      name: 'Vivian Brooks',
      age: '82F',
      mrn: '#MRN-73319',
      bed: 'Bed 408-A',
      service: 'Hospitalist Medicine',
      diagnosis: 'Severe Sepsis sec. to Pyelonephritis',
      newsBadge: 'NEWS 5 • High',
      newsColor: 'red',
      vitalsMini: 'Lactate 2.8 • Temp 38.8°C',
      priority: 'HIGH',
      clinician: 'Dr. Sarah Lin, MD',
      offGoing: 'Attending Hospitalist',
      status: 'Ready for Review',
      statusColor: 'blue',
      pendingAlert: 'Rep. Lactate 15:30 • Blood CX 24h',
      pendingNotes: 'BP monitoring q1h • Cefepime 4th dose',
      actionType: 'review',
    },
    {
      patientId: 'pt-sterling',
      name: 'James Sterling',
      age: '55M',
      mrn: '#MRN-60284',
      bed: 'Bed 411-B',
      service: 'Endocrinology / Stepdown',
      diagnosis: 'DKA Resolved, Transitioning SubQ Insulin',
      newsBadge: 'NEWS 2 • Low',
      newsColor: 'emerald',
      vitalsMini: 'Gap closed (9) • BG 142',
      priority: 'STABLE',
      clinician: 'Dr. Sarah Lin, MD',
      offGoing: 'Attending Hospitalist',
      status: 'Sign-out Draft',
      statusColor: 'slate',
      pendingAlert: 'Glargine dose calc @ 17:00',
      pendingNotes: 'Check BMP in AM • Diet advanced',
      actionType: 'edit',
    },
    {
      patientId: 'pt-pendelton',
      name: 'Arthur Pendelton',
      age: '68M',
      mrn: '#MRN-49102',
      bed: 'Bed 414-A',
      service: 'Gastroenterology',
      diagnosis: 'Acute Pancreatitis (Alc), hypocalcemia',
      newsBadge: 'NEWS 3 • Med',
      newsColor: 'amber',
      vitalsMini: 'Lipase 840 • Ion Ca 1.02',
      priority: 'MEDIUM',
      clinician: 'Dr. Marcus Chen, PGY-3',
      offGoing: 'Off-going 14:30',
      status: 'Pending Acknowledgment',
      statusColor: 'amber',
      pendingAlert: 'Repeat Ca/Mg panel stat',
      pendingNotes: 'Pain titration: PCA Dilaudid eval',
      actionType: 'ack',
    },
  ];

  const filteredHandoffs = incomingHandoffs.filter((item) => {
    // Tab filter
    if (activeTabFilter === 'needs-review' && item.status !== 'Pending Acknowledgment' && item.status !== 'Ready for Review') {
      return false;
    }
    if (activeTabFilter === 'drafting' && item.status !== 'Sign-out Draft') {
      return false;
    }
    if (activeTabFilter === 'acknowledged') {
      return false; // currently 0 in this sample list
    }

    // Priority filter
    if (priorityFilter === 'High Priority Only' && item.priority !== 'HIGH') {
      return false;
    }
    if (priorityFilter === 'Medium / Watcher' && item.priority !== 'MEDIUM') {
      return false;
    }
    if (priorityFilter === 'Stable' && item.priority !== 'STABLE') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.mrn.toLowerCase().includes(q) ||
        item.bed.toLowerCase().includes(q) ||
        item.diagnosis.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Top Header Section: Clinical Handover Workspace */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-lg text-on-surface tracking-tight text-[22px] font-bold">
              Shift Dashboard
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-data-mono-sm font-data-mono-sm bg-surface-container-high text-primary font-bold">
              UNIT-4B
            </span>
          </div>
          <p className="font-body-md text-on-surface-variant mt-0.5 text-[13px]">
            Acute Inpatient Medicine • Unit 4B Telemetry • Day Handover Cycle
          </p>
        </div>

        {/* Right Side Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">clinical_notes</span>
            <div className="flex flex-col">
              <span className="font-data-mono-sm text-on-surface-variant leading-none text-[10px] uppercase font-bold">
                Shift Schedule
              </span>
              <span className="font-data-mono text-[12px] font-semibold text-on-surface leading-tight">
                Day Shift: 07:00 – 19:30
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-data-mono-sm">
            <span className="material-symbols-outlined text-[15px] text-outline">schedule</span>
            <span>Tuesday, Oct 24 • 14:45 EST</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg cursor-pointer font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Shift Summary</span>
            </button>
            <button
              onClick={() => onCreateHandoff('pt-callahan')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm font-label-lg text-label-lg cursor-pointer font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Create Handoff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Summary Metric Row: High-Density 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Active Patients */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-on-surface-variant uppercase font-bold text-[11px]">
              Active Patients
            </span>
            <span className="p-1 rounded bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-[18px]">bed</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-on-surface font-bold text-[28px]">24</span>
            <span className="font-data-mono-sm text-secondary font-bold">92% Occupancy</span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-[11px] mt-1 line-clamp-1">
            18 telemetry beds, 6 step-down • 2 pending admits
          </p>
        </div>

        {/* Metric 2: Pending Handoffs */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-on-surface-variant uppercase font-bold text-[11px]">
              Pending Handoffs
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded font-data-mono-sm text-[10px] bg-amber-100 text-amber-900 font-bold uppercase tracking-wider">
              Action Needed
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-on-surface font-bold text-[28px]">6</span>
            <span className="font-label-md text-amber-800 font-bold">Incoming</span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-[11px] mt-1 line-clamp-1">
            4 requiring incoming review, 2 outgoing draft
          </p>
        </div>

        {/* Metric 3: High Priority / Critical */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-on-surface-variant uppercase font-bold text-[11px]">
              High Priority / Critical
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded font-data-mono-sm text-[10px] bg-red-100 text-red-900 font-bold uppercase tracking-wider">
              NEWS ≥ 5
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-error font-bold text-[28px]">3</span>
            <span className="font-label-md text-error font-bold">Acuity Alert</span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-[11px] mt-1 line-clamp-1">
            NEWS score ≥ 5 • 1 pending ICU transfer
          </p>
        </div>

        {/* Metric 4: Overdue Actions */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-on-surface-variant uppercase font-bold text-[11px]">
              Overdue Actions
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded font-data-mono-sm text-[10px] bg-red-100 text-red-900 font-bold uppercase tracking-wider">
              Attention
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-error font-bold text-[28px]">4</span>
            <span className="font-data-mono-sm text-on-surface-variant font-medium">Delayed items</span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-[11px] mt-1 line-clamp-1">
            2 labs pending &gt;2h, 1 delayed radiology consult
          </p>
        </div>
      </div>

      {/* Incoming Shift Handoffs Roster Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs flex flex-col overflow-hidden">
        {/* Header Bar with Filter Tabs */}
        <div className="p-3 sm:px-4 sm:py-3 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">swap_horizontal_circle</span>
            <h2 className="font-headline-md text-on-surface text-[15px] font-bold">
              Incoming Shift Handoffs (Unacknowledged & In Progress)
            </h2>
          </div>

          {/* Tab Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-2.5 py-1 rounded font-label-md text-[11px] transition-all cursor-pointer ${
                activeTabFilter === 'all'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setActiveTabFilter('needs-review')}
              className={`px-2.5 py-1 rounded font-label-md text-[11px] transition-all cursor-pointer ${
                activeTabFilter === 'needs-review'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Needs Review (4)
            </button>
            <button
              onClick={() => setActiveTabFilter('drafting')}
              className={`px-2.5 py-1 rounded font-label-md text-[11px] transition-all cursor-pointer ${
                activeTabFilter === 'drafting'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Drafting (2)
            </button>
            <button
              onClick={() => setActiveTabFilter('acknowledged')}
              className={`px-2.5 py-1 rounded font-label-md text-[11px] transition-all cursor-pointer ${
                activeTabFilter === 'acknowledged'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Acknowledged (18)
            </button>
          </div>
        </div>

        {/* Search & Secondary Filter Toolbar */}
        <div className="p-3 bg-surface-container-lowest flex flex-wrap items-center justify-between gap-2.5 border-b border-surface-container">
          <div className="relative flex-1 min-w-[260px] max-w-lg">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low text-on-surface font-body-sm text-[12px] rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              placeholder="Filter by MRN, patient name, bed, diagnosis..."
              type="text"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low text-on-surface font-body-sm text-[11px]">
              <span className="text-on-surface-variant font-label-md font-semibold">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent font-label-md text-on-surface focus:outline-none cursor-pointer"
              >
                <option>All Acuities</option>
                <option>High Priority Only</option>
                <option>Medium / Watcher</option>
                <option>Stable</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low text-on-surface font-body-sm text-[11px]">
              <span className="text-on-surface-variant font-label-md font-semibold">Ward / Bed:</span>
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="bg-transparent font-label-md text-on-surface focus:outline-none cursor-pointer"
              >
                <option>Unit 4B (All 24)</option>
                <option>Telemetry Pod 1 (Beds 401-410)</option>
                <option>Telemetry Pod 2 (Beds 411-424)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low text-on-surface font-body-sm text-[11px]">
              <span className="text-on-surface-variant font-label-md font-semibold">Clinician:</span>
              <select
                value={clinicianFilter}
                onChange={(e) => setClinicianFilter(e.target.value)}
                className="bg-transparent font-label-md text-on-surface focus:outline-none cursor-pointer"
              >
                <option>All Residents</option>
                <option>Dr. Marcus Chen (PGY-3)</option>
                <option>Dr. Sarah Lin (MD)</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('All Acuities');
              }}
              className="p-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface cursor-pointer"
              title="Reset filters"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Clinical High-Density Table View */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider select-none">
                <th className="py-2.5 px-3 font-semibold">Patient Demographic</th>
                <th className="py-2.5 px-3 font-semibold">Bed & Service</th>
                <th className="py-2.5 px-3 font-semibold min-w-[200px]">Diagnosis & Acuity</th>
                <th className="py-2.5 px-2 font-semibold text-center">Priority</th>
                <th className="py-2.5 px-3 font-semibold">Outgoing Clinician</th>
                <th className="py-2.5 px-3 font-semibold">Handoff Status</th>
                <th className="py-2.5 px-3 font-semibold min-w-[190px]">Pending Actions / Labs</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-md font-body-md">
              {filteredHandoffs.map((row) => (
                <tr
                  key={row.patientId}
                  className="hover:bg-surface-container-low/70 transition-colors bg-surface-container-lowest"
                >
                  {/* Demographic */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectPatient(row.patientId)}
                          className="font-headline-sm text-on-surface font-semibold text-[13px] hover:text-primary transition-colors text-left"
                        >
                          {row.name}
                        </button>
                        <span className="px-1 py-0.2 rounded font-data-mono-sm text-[10px] bg-surface-container text-on-surface-variant font-bold">
                          {row.age}
                        </span>
                      </div>
                      <span className="font-data-mono-sm text-[10px] text-on-surface-variant font-medium">
                        {row.mrn}
                      </span>
                    </div>
                  </td>

                  {/* Bed & Service */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[12px] text-on-surface font-semibold">
                        {row.bed}
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        {row.service}
                      </span>
                    </div>
                  </td>

                  {/* Diagnosis & Acuity */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-body-md text-[12px] font-medium text-on-surface">
                        {row.diagnosis}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-data-mono-sm text-[10px] font-bold ${
                            row.newsColor === 'red'
                              ? 'bg-red-100 text-red-950'
                              : row.newsColor === 'amber'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-950'
                          }`}
                        >
                          {row.newsColor === 'red' && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                          )}
                          {row.newsBadge}
                        </span>
                        <span className="font-data-mono-sm text-[10px] text-on-surface-variant">
                          {row.vitalsMini}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-data-mono-sm text-[10px] font-bold tracking-wide ${
                        row.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : row.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.priority}
                    </span>
                  </td>

                  {/* Outgoing Clinician */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-[12px] text-on-surface font-semibold">
                        {row.clinician}
                      </span>
                      <span className="font-data-mono-sm text-[10px] text-on-surface-variant">
                        {row.offGoing}
                      </span>
                    </div>
                  </td>

                  {/* Handoff Status */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          row.statusColor === 'amber'
                            ? 'bg-amber-500 animate-pulse'
                            : row.statusColor === 'blue'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      <span
                        className={`font-label-md text-[11px] font-semibold ${
                          row.statusColor === 'amber'
                            ? 'text-amber-900'
                            : row.statusColor === 'blue'
                            ? 'text-primary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </td>

                  {/* Pending Actions */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`font-body-sm text-[11px] font-medium flex items-center gap-1 ${
                          row.pendingAlert.includes('Troponin') || row.pendingAlert.includes('Lactate')
                            ? 'text-error'
                            : 'text-on-surface'
                        }`}
                      >
                        {row.pendingAlert.includes('Troponin') && (
                          <span className="material-symbols-outlined text-[13px]">alarm</span>
                        )}
                        {row.pendingAlert}
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        {row.pendingNotes}
                      </span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {row.actionType === 'ack' && (
                        <button
                          onClick={() => onReviewHandoff(row.patientId)}
                          className="px-2 py-1 rounded bg-primary text-on-primary hover:bg-primary-container font-label-md text-[11px] transition-colors font-semibold shadow-xs cursor-pointer"
                        >
                          Review & Ack
                        </button>
                      )}
                      {row.actionType === 'review' && (
                        <button
                          onClick={() => onReviewHandoff(row.patientId)}
                          className="px-2 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-[11px] transition-colors font-semibold cursor-pointer"
                        >
                          Review Sign-out
                        </button>
                      )}
                      {row.actionType === 'edit' && (
                        <button
                          onClick={() => onCreateHandoff(row.patientId)}
                          className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[11px] transition-colors font-semibold cursor-pointer"
                        >
                          Edit Draft
                        </button>
                      )}
                      <button
                        onClick={() => onSelectPatient(row.patientId)}
                        className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer"
                        title="View Patient Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Footer Pagination & Summary Strip */}
        <div className="p-2.5 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-on-surface-variant font-label-md text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-on-surface">Displaying 5 of 6 handoffs</span>
            <span>•</span>
            <span className="text-amber-800 font-semibold">4 require dual-physician sign-off</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface-variant disabled:opacity-50 cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <span className="font-data-mono-sm text-[11px] text-on-surface font-medium">Page 1 of 2</span>
            <button className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Handover Protocol Floating / Grounded Banner */}
      <div className="p-3.5 rounded-xl bg-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary text-on-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-[13px] text-on-surface font-bold">
                Clinical Handover Protocol (I-PASS Standards)
              </span>
              <span className="px-1.5 py-0.2 rounded font-data-mono-sm text-[10px] bg-surface-container-lowest text-primary font-bold">
                ACTIVE LOCK IN 4H 45M
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant text-[12px] mt-0.5">
              All 4 pending sign-outs must be dual-verified before shift lock at 19:30. 1 critical code status update verified (Bed 402-A).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setChecklistOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-[11px] hover:bg-surface-container transition-colors font-semibold cursor-pointer"
          >
            View Protocol Checklist
          </button>
          <button
            onClick={onBatchAcknowledge}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-[11px] hover:bg-primary-container transition-colors font-semibold shadow-xs cursor-pointer"
          >
            Batch Acknowledge (4)
          </button>
        </div>
      </div>

      {/* Protocol Checklist Modal */}
      {checklistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">rule</span>
                <h3 className="font-headline-md text-on-surface font-bold text-[15px]">
                  I-PASS Protocol Checklist
                </h3>
              </div>
              <button
                onClick={() => setChecklistOpen(false)}
                className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="p-2.5 rounded bg-surface-container-low flex items-start gap-2">
                <span className="font-bold text-primary font-mono">I</span>
                <div>
                  <strong>Illness Severity:</strong> Stable, Watcher, or Unstable severity assigned.
                </div>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low flex items-start gap-2">
                <span className="font-bold text-primary font-mono">P</span>
                <div>
                  <strong>Patient Summary:</strong> Events leading up to admission, hospital course, and current status reviewed.
                </div>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low flex items-start gap-2">
                <span className="font-bold text-primary font-mono">A</span>
                <div>
                  <strong>Action List:</strong> To-do items, time-sensitive diagnostics, and designated owner confirmed.
                </div>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low flex items-start gap-2">
                <span className="font-bold text-primary font-mono">S</span>
                <div>
                  <strong>Situation Awareness:</strong> Contingency planning (if-then statements) established.
                </div>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low flex items-start gap-2">
                <span className="font-bold text-primary font-mono">S</span>
                <div>
                  <strong>Synthesis by Receiver:</strong> Receiver restates key actions, asks questions, and accepts legal custody.
                </div>
              </div>
            </div>
            <button
              onClick={() => setChecklistOpen(false)}
              className="w-full py-2 bg-primary text-white rounded-lg font-label-lg text-[12px] font-semibold cursor-pointer"
            >
              Close Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
