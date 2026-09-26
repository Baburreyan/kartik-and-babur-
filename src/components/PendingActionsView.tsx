import React, { useState } from 'react';
import { ClinicalActionItem } from '../types/clinical';

interface PendingActionsViewProps {
  actions: ClinicalActionItem[];
  onToggleComplete: (id: string) => void;
  onAddAction: (action: ClinicalActionItem) => void;
  onSelectPatient: (patientId: string) => void;
}

export const PendingActionsView: React.FC<PendingActionsViewProps> = ({
  actions,
  onToggleComplete,
  onAddAction,
  onSelectPatient,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'overdue' | 'labs' | 'meds' | 'consults' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicianFilter, setClinicianFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newPatientId, setNewPatientId] = useState('pt-callahan');
  const [newCategory, setNewCategory] = useState<'labs' | 'meds' | 'consults' | 'procedures'>('labs');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'routine'>('urgent');
  const [newContingency, setNewContingency] = useState('');

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredActions.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkSelectedComplete = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => onToggleComplete(id));
    setSelectedIds([]);
  };

  const handleCreateAction = () => {
    if (!newTitle.trim()) return;
    const newItem: ClinicalActionItem = {
      id: `act-${Date.now()}`,
      orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      patientId: newPatientId,
      patientName: 'Margaret Callahan (74F)',
      patientDemographics: '74F',
      bed: 'Bed 402-A',
      diagnosisShort: 'NSTEMI',
      dueTimeText: 'Due in 2h',
      dueTimestamp: '17:00 EST',
      isOverdue: false,
      assignedClinician: 'Dr. E. Vance, MD',
      assignedDepartment: 'Cardiology Telemetry',
      contingencyNote: newContingency.trim() || 'Monitor vital signs and re-evaluate.',
      completed: false,
    };
    onAddAction(newItem);
    setNewTitle('');
    setNewContingency('');
    setModalOpen(false);
  };

  const filteredActions = actions.filter((act) => {
    // Tab filter
    if (filterTab === 'overdue' && !act.isOverdue) return false;
    if (filterTab === 'labs' && act.category !== 'labs') return false;
    if (filterTab === 'meds' && act.category !== 'meds') return false;
    if (filterTab === 'consults' && act.category !== 'consults') return false;
    if (filterTab === 'completed' && !act.completed) return false;

    // Clinician filter
    if (clinicianFilter !== 'all') {
      if (clinicianFilter === 'vance' && !act.assignedClinician.includes('Vance')) return false;
      if (clinicianFilter === 'chen' && !act.assignedClinician.includes('Chen')) return false;
      if (clinicianFilter === 'patel' && !act.assignedClinician.includes('Patel')) return false;
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      if (priorityFilter === 'urgent' && act.priority !== 'urgent') return false;
      if (priorityFilter === 'high' && act.priority !== 'high' && act.priority !== 'urgent') return false;
      if (priorityFilter === 'routine' && act.priority !== 'routine') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        act.patientName.toLowerCase().includes(q) ||
        act.orderId.toLowerCase().includes(q) ||
        act.bed.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">checklist_rtl</span>
            <h1 className="font-headline-lg text-on-surface font-bold text-[20px]">Pending Clinical Actions</h1>
            <span className="font-data-mono-sm text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              UNIT 4B / TELEMETRY
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant mt-0.5 text-[12px]">
            Active Shift Task Board • Real-time synchronization with Epic EMR Order Stream
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => alert('Exporting Task List CSV/JSON for shift handoff')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-on-surface hover:bg-surface-container rounded-lg font-label-lg text-[12px] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Task List</span>
          </button>
          <button
            onClick={handleMarkSelectedComplete}
            disabled={selectedIds.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg font-label-lg text-[12px] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Mark Selected Complete ({selectedIds.length})</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-lg text-[12px] shadow-xs transition-colors cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add Clinical Action</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Overdue Actions */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[24px]">emergency</span>
            </div>
            <div>
              <span className="font-label-md text-error uppercase tracking-wider font-bold block text-[10px]">
                Overdue Actions
              </span>
              <span className="font-headline-xl text-on-surface font-bold text-[24px]">4 Tasks</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-data-mono-sm text-[10px] bg-error text-on-error px-2 py-0.5 rounded font-bold animate-pulse">
              BLOCKING SIGN-OFF
            </span>
            <span className="font-body-sm text-on-surface-variant mt-1 text-[11px]">Requires recheck</span>
          </div>
        </div>

        {/* Due Next 2 Hours */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">alarm</span>
            </div>
            <div>
              <span className="font-label-md text-secondary uppercase tracking-wider font-bold block text-[10px]">
                Due Next 2 Hours
              </span>
              <span className="font-headline-xl text-on-surface font-bold text-[24px]">6 Tasks</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-data-mono-sm text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded font-bold">
              WINDOW: 15:00 - 17:00
            </span>
            <span className="font-body-sm text-on-surface-variant mt-1 text-[11px]">2 stat labs pending</span>
          </div>
        </div>

        {/* Completed This Shift */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div>
              <span className="font-label-md text-primary uppercase tracking-wider font-bold block text-[10px]">
                Completed This Shift
              </span>
              <span className="font-headline-xl text-on-surface font-bold text-[24px]">19 Tasks</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-data-mono-sm text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
              82.6% COMPLIANCE
            </span>
            <span className="font-body-sm text-on-surface-variant mt-1 text-[11px]">Day Shift Average: 78%</span>
          </div>
        </div>
      </div>

      {/* Task Board Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
        {/* Tabs & Auto-refresh */}
        <div className="p-3 bg-surface-container-low flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] whitespace-nowrap cursor-pointer transition-colors ${
                filterTab === 'all'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              All Pending ({actions.filter((a) => !a.completed).length})
            </button>
            <button
              onClick={() => setFilterTab('overdue')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
                filterTab === 'overdue'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-error inline-block"></span>
              <span>Overdue (4)</span>
            </button>
            <button
              onClick={() => setFilterTab('labs')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] whitespace-nowrap cursor-pointer transition-colors ${
                filterTab === 'labs'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Labs & Diagnostics (5)
            </button>
            <button
              onClick={() => setFilterTab('meds')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] whitespace-nowrap cursor-pointer transition-colors ${
                filterTab === 'meds'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Medication & Drips (2)
            </button>
            <button
              onClick={() => setFilterTab('consults')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] whitespace-nowrap cursor-pointer transition-colors ${
                filterTab === 'consults'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Consults & Procedures (3)
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded font-label-lg text-[12px] whitespace-nowrap cursor-pointer transition-colors ${
                filterTab === 'completed'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Completed (19)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-data-mono-sm text-[11px] text-on-surface-variant hidden sm:inline">
              Auto-refresh in 42s
            </span>
            <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer" title="Force Sync">
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </button>
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="p-3 bg-surface-container-lowest grid grid-cols-1 md:grid-cols-12 gap-2.5 border-b border-surface-container">
          <div className="md:col-span-6 relative flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low rounded font-body-sm text-[12px] text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
              placeholder="Search action by patient, test name or order ID..."
              type="text"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={clinicianFilter}
              onChange={(e) => setClinicianFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-surface-container-low rounded font-body-sm text-[11px] text-on-surface focus:outline-none focus:bg-surface-container-lowest cursor-pointer"
            >
              <option value="all">Assignee: All Team Clinicians</option>
              <option value="vance">Dr. Eleanor Vance, MD</option>
              <option value="chen">Dr. Marcus Chen, MD</option>
              <option value="patel">PA Alisha Patel</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-surface-container-low rounded font-body-sm text-[11px] text-on-surface focus:outline-none focus:bg-surface-container-lowest cursor-pointer"
            >
              <option value="all">Priority: All Triage Levels</option>
              <option value="urgent">Urgent Only</option>
              <option value="high">High & Urgent</option>
              <option value="routine">Routine</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-sm text-[12px]">
            <thead className="bg-surface-container text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider select-none">
              <tr>
                <th className="w-10 px-3 py-2 text-center">
                  <input
                    checked={selectedIds.length === filteredActions.length && filteredActions.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded accent-primary w-4 h-4 cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th className="w-24 px-2 py-2 font-semibold">Priority</th>
                <th className="px-3 py-2 min-w-[200px] font-semibold">Action & Order Details</th>
                <th className="px-3 py-2 min-w-[170px] font-semibold">Patient & Bed</th>
                <th className="px-3 py-2 min-w-[150px] font-semibold">Due Time & State</th>
                <th className="px-3 py-2 min-w-[180px] font-semibold">Assigned Clinician</th>
                <th className="px-3 py-2 min-w-[240px] font-semibold">Contingency / Escalation</th>
                <th className="px-3 py-2 text-right min-w-[110px] font-semibold">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface">
              {filteredActions.map((act) => {
                const isSelected = selectedIds.includes(act.id);
                return (
                  <tr
                    key={act.id}
                    className={`hover:bg-surface-container-low/70 transition-colors ${
                      act.isOverdue
                        ? 'bg-error-container/20'
                        : isSelected
                        ? 'bg-blue-50/60'
                        : 'bg-surface-container-lowest'
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center">
                      <input
                        checked={isSelected}
                        onChange={() => toggleSelect(act.id)}
                        className="rounded accent-primary w-4 h-4 cursor-pointer"
                        type="checkbox"
                      />
                    </td>

                    {/* Priority Badge */}
                    <td className="px-2 py-2.5">
                      {act.priority === 'urgent' && (
                        <span className="inline-flex items-center gap-1 font-data-mono-sm text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                          URGENT
                        </span>
                      )}
                      {act.priority === 'high' && (
                        <span className="inline-flex items-center gap-1 font-data-mono-sm text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          HIGH
                        </span>
                      )}
                      {act.priority === 'routine' && (
                        <span className="inline-flex items-center gap-1 font-data-mono-sm text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          ROUTINE
                        </span>
                      )}
                    </td>

                    {/* Action & Order */}
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span
                          className={`font-headline-sm text-[12px] font-bold ${
                            act.isOverdue ? 'text-error' : 'text-on-surface'
                          } ${act.completed ? 'line-through text-on-surface-variant' : ''}`}
                        >
                          {act.title}
                        </span>
                        <span className="font-data-mono-sm text-[10px] text-on-surface-variant">
                          {act.orderId} • {act.category.toUpperCase()}
                        </span>
                      </div>
                    </td>

                    {/* Patient & Bed */}
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <button
                          onClick={() => onSelectPatient(act.patientId)}
                          className="font-label-lg font-bold text-on-surface text-[12px] hover:text-primary transition-colors text-left"
                        >
                          {act.patientName}
                        </button>
                        <span className="font-data-mono-sm text-[10px] text-primary font-medium">
                          {act.bed} • {act.diagnosisShort}
                        </span>
                      </div>
                    </td>

                    {/* Due Time */}
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span
                          className={`font-label-lg text-[11px] font-bold ${
                            act.isOverdue ? 'text-error animate-pulse' : 'text-secondary'
                          }`}
                        >
                          {act.dueTimeText}
                        </span>
                        <span className="font-data-mono-sm text-[10px] text-on-surface-variant">
                          {act.dueTimestamp}
                        </span>
                      </div>
                    </td>

                    {/* Clinician */}
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span className="font-body-sm text-[11px] font-medium">{act.assignedClinician}</span>
                        <span className="font-data-mono-sm text-[10px] text-on-surface-variant">
                          {act.assignedDepartment}
                        </span>
                      </div>
                    </td>

                    {/* Contingency */}
                    <td className="px-3 py-2.5">
                      <div
                        className={`p-2 rounded text-[11px] leading-snug ${
                          act.isOverdue ? 'bg-error-container/40 text-on-error-container font-medium' : 'bg-surface-container-low text-on-surface'
                        }`}
                      >
                        {act.contingencyNote}
                      </div>
                    </td>

                    {/* Controls */}
                    <td className="px-3 py-2.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onToggleComplete(act.id)}
                          className={`p-1 hover:bg-surface-container-high rounded cursor-pointer ${
                            act.completed ? 'text-emerald-600' : 'text-primary'
                          }`}
                          title={act.completed ? 'Mark pending' : 'Complete Action'}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {act.completed ? 'check_box' : 'check_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => onSelectPatient(act.patientId)}
                          className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant cursor-pointer"
                          title="Open Chart"
                        >
                          <span className="material-symbols-outlined text-[18px]">launch</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px]">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-error text-[18px]">lock</span>
            <span>
              Showing <strong>{filteredActions.length} active tasks</strong> (
              <strong className="text-error">4 overdue</strong> require immediate attention) •{' '}
              <em>Shift sign-off blocked until overdue tasks resolved or delegated.</em>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-data-mono-sm text-on-surface-variant">Page 1 of 1</span>
            <button className="p-1 rounded bg-surface-container text-outline opacity-50 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="p-1 rounded bg-surface-container text-outline opacity-50 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Action Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 bg-surface-container-low -mx-5 -mt-5 p-4 rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_task</span>
                <h2 className="font-headline-md text-on-surface font-bold text-[15px]">
                  New Clinical Handover Action
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface rounded cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block font-bold text-on-surface mb-1">Target Patient</label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded text-[12px]"
                >
                  <option value="pt-callahan">Margaret Callahan (74F) • Bed 402-A</option>
                  <option value="pt-brooks">Vivian Brooks (68F) • Bed 410-B</option>
                  <option value="pt-pendelton">Arthur Pendelton (52M) • Bed 407-A</option>
                  <option value="pt-henderson">Robert Henderson (61M) • Bed 405-B</option>
                  <option value="pt-sterling">James Sterling (58M) • Bed 414-A</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Action Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-surface-container-low rounded text-[12px]"
                  >
                    <option value="labs">Stat Lab / Blood Draw</option>
                    <option value="consults">Radiology Verification</option>
                    <option value="meds">Medication Drip Titration</option>
                    <option value="procedures">Bedside Evaluation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Priority Triage</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-surface-container-low rounded text-[12px]"
                  >
                    <option value="urgent">URGENT (Stat)</option>
                    <option value="high">HIGH (&lt; 2 Hours)</option>
                    <option value="routine">ROUTINE (Shift End)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Action Title & Order ID</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded text-[12px] outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Check repeat potassium after 40mEq IV infusion"
                  type="text"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Contingency Plan / If-Then Action</label>
                <textarea
                  value={newContingency}
                  onChange={(e) => setNewContingency(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded text-[12px] outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. If K < 3.5, order additional 20mEq PO; if > 5.2, stop infusion and alert attending"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-1.5 bg-surface-container text-on-surface font-label-lg text-[12px] rounded hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAction}
                className="px-4 py-1.5 bg-primary text-on-primary font-label-lg text-[12px] font-bold rounded hover:bg-primary-container shadow-xs cursor-pointer"
              >
                Create & Assign Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
