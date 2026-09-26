import React, { useState } from 'react';
import { Patient } from '../types/clinical';

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onCreateHandoff: (patientId: string) => void;
  onReviewHandoff: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onSelectPatient,
  onCreateHandoff,
  onReviewHandoff,
}) => {
  const [activeTab, setActiveTab] = useState<'my' | 'all' | 'high' | 'discharge'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [acuityFilter, setAcuityFilter] = useState('All');
  const [teamFilter, setTeamFilter] = useState('All');
  const [handoffFilter, setHandoffFilter] = useState('All');
  const [codeFilter, setCodeFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [admitModalOpen, setAdmitModalOpen] = useState(false);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPatients.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredPatients = patients.filter((p) => {
    if (activeTab === 'high' && p.news2Score < 5) return false;
    if (activeTab === 'discharge' && !p.primaryDiagnosis.includes('Transitioning') && p.news2Score > 2) return false;

    if (acuityFilter !== 'All') {
      if (acuityFilter === 'High Acuity' && p.news2Score < 5) return false;
      if (acuityFilter === 'Medium Acuity' && (p.news2Score < 3 || p.news2Score >= 5)) return false;
      if (acuityFilter === 'Low Acuity' && p.news2Score >= 3) return false;
    }

    if (codeFilter !== 'All') {
      if (codeFilter === 'FULL CODE' && p.codeStatus !== 'FULL CODE') return false;
      if (codeFilter === 'DNR / DNI' && p.codeStatus !== 'DNR / DNI') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.bed.toLowerCase().includes(q) ||
        p.primaryDiagnosis.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Unit Operations Quick Telemetry & Status Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md mb-space-lg">
        {/* Bed Occupancy */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-space-md">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">airline_seat_flat</span>
            </div>
            <div>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant block uppercase tracking-wider text-[10px]">
                Bed Occupancy
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold text-[15px]">
                24 <span className="font-body-sm text-on-surface-variant font-normal text-[12px]">/ 26 Beds (92%)</span>
              </span>
            </div>
          </div>
          <div className="w-12 h-6 flex items-end gap-0.5">
            <span className="w-2 h-3 bg-teal-300 rounded-xs"></span>
            <span className="w-2 h-4 bg-teal-600 rounded-xs"></span>
            <span className="w-2 h-5 bg-blue-600 rounded-xs"></span>
            <span className="w-2 h-6 bg-blue-800 rounded-xs"></span>
          </div>
        </div>

        {/* NEWS2 Alert */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-space-md">
            <div className="w-9 h-9 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant block uppercase tracking-wider text-[10px]">
                NEWS2 Alert (≥5)
              </span>
              <span className="font-headline-md text-headline-md text-error font-bold text-[15px]">
                5 <span className="font-body-sm text-on-surface-variant font-normal text-[12px]">Critical Patients</span>
              </span>
            </div>
          </div>
          <span className="font-label-md text-[10px] px-2 py-0.5 rounded-full bg-error-container text-error font-bold animate-pulse">
            WATCHLIST
          </span>
        </div>

        {/* Handoff Sign-outs */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-space-md">
            <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
            <div>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant block uppercase tracking-wider text-[10px]">
                Handoff Sign-outs
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold text-[15px]">
                7 <span className="font-body-sm text-on-surface-variant font-normal text-[12px]">Pending Review</span>
              </span>
            </div>
          </div>
          <span className="font-data-mono-sm text-[10px] bg-surface-container px-2 py-0.5 rounded text-primary font-bold">
            4B Telemetry
          </span>
        </div>

        {/* Discharges Today */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-space-md">
            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px]">output</span>
            </div>
            <div>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant block uppercase tracking-wider text-[10px]">
                Discharges Today
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold text-[15px]">
                3 <span className="font-body-sm text-on-surface-variant font-normal text-[12px]">In Clearance</span>
              </span>
            </div>
          </div>
          <span className="font-label-md text-label-md text-secondary font-bold text-[11px]">
            On Track
          </span>
        </div>
      </div>

      {/* Primary Census Header */}
      <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="space-y-1">
            <div className="flex items-center gap-space-md">
              <span className="font-headline-xl text-on-surface tracking-tight text-[22px] font-bold">
                Patient Roster & Bed Census
              </span>
              <span className="inline-flex items-center gap-1 font-data-mono-sm text-[11px] px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Live Stream Active
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-[13px]">
              Unit 4B Telemetry & Step-Down Unit • Total Census:{' '}
              <span className="font-headline-sm text-on-surface font-bold">24/26 Beds Occupied</span> (2 Open Isolations Available)
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Customizing table column view for unit 4B')}
              className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-[12px] px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-on-surface-variant">view_column</span>
              <span>Filter Columns</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-[12px] px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-on-surface-variant">print</span>
              <span>Print Rounding Sheet</span>
            </button>
            <button
              onClick={() => alert('Exporting full inpatient census snapshot PDF')}
              className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-[12px] px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-on-surface-variant">picture_as_pdf</span>
              <span>Export Census PDF</span>
            </button>
            <button
              onClick={() => setAdmitModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-[12px] px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Admit New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Triage Query Control Panel */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs space-y-3">
        {/* Quick Cohort Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pb-1 bg-surface-container-low p-1.5 rounded-lg">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'my'
                  ? 'bg-primary text-on-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">folder_shared</span>
              <span>My Patients</span>
              <span className={`font-data-mono-sm text-[10px] px-1.5 rounded-full ${activeTab === 'my' ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface'}`}>
                8
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-primary text-on-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>All Unit Patients</span>
              <span className={`font-data-mono-sm text-[10px] px-1.5 rounded-full ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface'}`}>
                24
              </span>
            </button>

            <button
              onClick={() => setActiveTab('high')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'high'
                  ? 'bg-primary text-on-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-error">notification_important</span>
              <span>High Acuity / Watchlist</span>
              <span className="bg-error-container text-error font-data-mono-sm text-[10px] px-1.5 rounded-full font-bold">
                5
              </span>
            </button>

            <button
              onClick={() => setActiveTab('discharge')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'discharge'
                  ? 'bg-primary text-on-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">transfer_within_a_station</span>
              <span>Planned Discharges</span>
              <span className="bg-secondary-container text-on-secondary-container font-data-mono-sm text-[10px] px-1.5 rounded-full font-bold">
                3
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <span className="font-data-mono-sm text-[11px] text-on-surface-variant">Auto-Refresh:</span>
            <span className="font-data-mono-sm text-[11px] font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> 30s
            </span>
          </div>
        </div>

        {/* Search and Multifactor Dropdown Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          <div className="md:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-md text-[12px] pl-9 pr-3 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
              placeholder="Search patient by name, MRN, chief complaint, room..."
              type="text"
            />
          </div>

          <div className="md:col-span-2 relative">
            <select
              value={acuityFilter}
              onChange={(e) => setAcuityFilter(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-[11px] px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer pr-8 hover:bg-surface-container transition-colors"
            >
              <option value="All">Acuity / Priority (All)</option>
              <option value="High Acuity">High Acuity (NEWS2 ≥ 5)</option>
              <option value="Medium Acuity">Medium Acuity (NEWS2 3-4)</option>
              <option value="Low Acuity">Low Acuity (NEWS2 0-2)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="md:col-span-2 relative">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-[11px] px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer pr-8 hover:bg-surface-container transition-colors"
            >
              <option value="All">Care Team (All)</option>
              <option value="Team Blue">Care Team (Team Blue)</option>
              <option value="Cardiology">Cardiology Inpatient</option>
              <option value="Hospitalist">Hospitalist Medicine</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="md:col-span-2 relative">
            <select
              value={handoffFilter}
              onChange={(e) => setHandoffFilter(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-[11px] px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer pr-8 hover:bg-surface-container transition-colors"
            >
              <option value="All">Handoff Status (All)</option>
              <option value="Needs Sign-out">Needs Sign-out</option>
              <option value="Completed">Completed</option>
              <option value="Update Required">Update Required</option>
              <option value="Draft in Progress">Draft in Progress</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="md:col-span-2 relative">
            <select
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-[11px] px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer pr-8 hover:bg-surface-container transition-colors"
            >
              <option value="All">Code Status (All)</option>
              <option value="FULL CODE">FULL CODE Only</option>
              <option value="DNR / DNI">DNR / DNI Only</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* High-Density Clinical Census Table Workspace */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    checked={selectedIds.length === filteredPatients.length && filteredPatients.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded bg-surface-container-lowest text-primary focus:ring-0 cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th className="py-3 px-3 min-w-[210px] font-semibold">Patient & Demographics</th>
                <th className="py-3 px-3 min-w-[140px] font-semibold">Bed & Service</th>
                <th className="py-3 px-3 min-w-[190px] font-semibold">Primary Diagnosis & Comorbidities</th>
                <th className="py-3 px-3 min-w-[90px] text-center font-semibold">NEWS2</th>
                <th className="py-3 px-3 min-w-[140px] font-semibold">Clinical Status</th>
                <th className="py-3 px-3 min-w-[85px] text-center font-semibold">Priority</th>
                <th className="py-3 px-3 min-w-[220px] font-semibold">Pending Clinical Actions</th>
                <th className="py-3 px-3 min-w-[150px] font-semibold">Last Handed Off</th>
                <th className="py-3 px-3 min-w-[130px] font-semibold">Handoff Status</th>
                <th className="py-3 px-3 min-w-[110px] text-right pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface text-[12px]">
              {filteredPatients.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-surface-container-low transition-colors group cursor-pointer ${
                      isSelected ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        checked={isSelected}
                        onChange={() => toggleSelect(p.id)}
                        className="w-3.5 h-3.5 rounded bg-surface-container-lowest text-primary focus:ring-0 cursor-pointer"
                        type="checkbox"
                      />
                    </td>

                    {/* Patient & Demographics */}
                    <td className="py-3 px-3">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full font-data-mono text-[11px] flex items-center justify-center font-bold shrink-0 ${
                            p.acuity === 'HIGH'
                              ? 'bg-error text-on-error'
                              : p.acuity === 'MEDIUM'
                              ? 'bg-amber-600 text-white'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {p.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => onSelectPatient(p.id)}
                              className="font-headline-sm text-[13px] text-on-surface font-semibold hover:text-primary transition-colors text-left"
                            >
                              {p.name}
                            </button>
                            <span className="font-data-mono-sm text-[10px] text-on-surface-variant font-medium">
                              {p.age}{p.gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-data-mono-sm text-[10px] text-on-surface-variant font-semibold">
                              MRN {p.mrn}
                            </span>
                            <span
                              className={`font-data-mono-sm text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                p.codeStatus === 'FULL CODE'
                                  ? 'bg-error text-on-error'
                                  : 'bg-tertiary-container text-white'
                              }`}
                            >
                              {p.codeStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Bed & Service */}
                    <td className="py-3 px-3">
                      <div className="font-data-mono text-[12px] font-bold text-on-surface">{p.bed}</div>
                      <div className="font-body-sm text-[11px] text-on-surface-variant truncate">{p.team}</div>
                      {p.isolation && p.isolation !== 'None' ? (
                        <span className="font-data-mono-sm text-[10px] text-error bg-error-container px-1 rounded font-bold">
                          {p.isolation}
                        </span>
                      ) : (
                        <span className="font-data-mono-sm text-[10px] text-primary bg-surface-container-high px-1 rounded">
                          Telemetry
                        </span>
                      )}
                    </td>

                    {/* Primary Diagnosis & Comorbidities */}
                    <td className="py-3 px-3">
                      <div className="font-headline-sm text-[12px] text-on-surface font-medium truncate">
                        {p.primaryDiagnosis}
                      </div>
                      <div className="font-body-sm text-[11px] text-on-surface-variant truncate">
                        {p.comorbidities}
                      </div>
                    </td>

                    {/* NEWS2 */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-6 rounded font-data-mono text-[12px] font-bold ${
                          p.news2Score >= 5
                            ? 'bg-error text-on-error'
                            : p.news2Score >= 3
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {p.news2Score}
                      </span>
                    </td>

                    {/* Clinical Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-label-md text-[11px] font-semibold ${
                          p.acuity === 'HIGH'
                            ? 'text-error'
                            : p.acuity === 'MEDIUM'
                            ? 'text-amber-800'
                            : 'text-secondary'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.acuity === 'HIGH'
                              ? 'bg-error animate-ping'
                              : p.acuity === 'MEDIUM'
                              ? 'bg-amber-500'
                              : 'bg-secondary'
                          }`}
                        ></span>
                        {p.clinicalStatusText}
                      </span>
                      <div className="font-body-sm text-[11px] text-on-surface-variant">
                        {p.clinicalStatusSubtitle}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-label-md text-[10px] font-bold tracking-wide ${
                          p.acuity === 'HIGH'
                            ? 'bg-error-container text-error'
                            : p.acuity === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {p.acuity}
                      </span>
                    </td>

                    {/* Pending Clinical Actions */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-body-sm text-[11px] text-on-surface font-medium">
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              p.urgentActionHighlight ? 'text-error' : 'text-secondary'
                            }`}
                          >
                            {p.urgentActionHighlight ? 'priority_high' : 'task_alt'}
                          </span>
                          <span className="truncate">{p.pendingActionsSummary}</span>
                        </div>
                        {p.urgentActionHighlight && (
                          <div className="font-data-mono-sm text-[10px] text-error bg-error-container/40 px-1.5 py-0.5 rounded inline-block font-semibold">
                            {p.urgentActionHighlight}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Last Handed Off */}
                    <td className="py-3 px-3">
                      <div className="font-data-mono-sm text-[11px] text-on-surface font-medium">
                        {p.lastHandoffTime}
                      </div>
                      <div className="font-body-sm text-[10px] text-on-surface-variant truncate">
                        by {p.lastHandoffBy}
                      </div>
                    </td>

                    {/* Handoff Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-md text-[10px] font-bold ${
                          p.handoffStatus === 'Needs Sign-out' || p.handoffStatus === 'Pending Acknowledgment'
                            ? 'bg-error-container text-error'
                            : p.handoffStatus === 'Completed'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {p.handoffStatus === 'Completed' ? 'check_circle' : 'edit_note'}
                        </span>
                        {p.handoffStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectPatient(p.id)}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface transition-colors cursor-pointer"
                          title="Open Patient Timeline & Dossier"
                        >
                          <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                        </button>
                        <button
                          onClick={() => {
                            if (p.handoffStatus === 'Pending Acknowledgment' || p.handoffStatus === 'Ready for Review') {
                              onReviewHandoff(p.id);
                            } else {
                              onCreateHandoff(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-colors cursor-pointer"
                          title="Handoff Signout Transfer"
                        >
                          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Footer Census Status Bar */}
      <div className="bg-surface-container p-space-md rounded-xl flex flex-col md:flex-row items-center justify-between gap-space-md shadow-xs text-[11px]">
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-lg text-on-surface font-medium">
              Showing <span className="font-bold text-on-surface">{filteredPatients.length} of 24</span> active unit inpatients
            </span>
          </div>
          <span className="text-on-surface-variant">•</span>
          <div className="flex items-center gap-1.5 text-error">
            <span className="material-symbols-outlined text-[16px]">priority_high</span>
            <span className="font-label-md font-bold">5 patients flagged with pending handoff actions</span>
          </div>
          <span className="text-on-surface-variant">•</span>
          <div className="font-data-mono-sm text-on-surface-variant">
            Telemetry bed utilization: <span className="font-bold text-on-surface">92%</span>
          </div>
          <span className="text-on-surface-variant">•</span>
          <div className="font-data-mono-sm text-on-surface-variant">
            Isolation precautions active: <span className="font-bold text-error">2</span> (MRSA Contact, C. diff Enteric)
          </div>
        </div>

        {/* Table Pagination */}
        <div className="flex items-center gap-2">
          <span className="font-data-mono-sm text-on-surface-variant">Page 1 of 3</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded bg-surface-container-lowest text-on-surface-variant disabled:opacity-50 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="p-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Admit New Patient */}
      {admitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                <h3 className="font-headline-md text-on-surface font-bold text-[15px]">
                  Admit Patient to Unit 4B Telemetry
                </h3>
              </div>
              <button onClick={() => setAdmitModalOpen(false)} className="p-1 rounded hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block font-semibold mb-1">Patient Full Name & MRN</label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Rigby (#MRN-99412)"
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded focus:bg-white focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned Bed</label>
                  <select className="w-full px-3 py-1.5 bg-surface-container-low rounded">
                    <option>Bed 403-A (Open Step-down)</option>
                    <option>Bed 416-B (Open Telemetry)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Code Status</label>
                  <select className="w-full px-3 py-1.5 bg-surface-container-low rounded">
                    <option>FULL CODE</option>
                    <option>DNR / DNI</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Primary Admitting Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Acute coronary syndrome / Rule out NSTEMI"
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded focus:bg-white focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setAdmitModalOpen(false)}
                className="px-3.5 py-1.5 bg-surface-container rounded font-label-lg text-[12px] hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Admission requisition dispatched to Epic ADT queue.');
                  setAdmitModalOpen(false);
                }}
                className="px-4 py-1.5 bg-primary text-white rounded font-label-lg text-[12px] font-semibold hover:bg-primary-container cursor-pointer"
              >
                Confirm Admission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
