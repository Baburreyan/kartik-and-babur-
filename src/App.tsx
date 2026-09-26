import React, { useState } from 'react';
import { ClinicalTab, Patient, IPassHandoff, ClinicalActionItem } from './types/clinical';
import { INITIAL_PATIENTS, INITIAL_CALLAHAN_HANDOFF, INITIAL_ACTIONS } from './data/mockClinicalData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { HandoffCreateView } from './components/HandoffCreateView';
import { HandoffRecordView } from './components/HandoffRecordView';
import { PendingActionsView } from './components/PendingActionsView';
import { TimelineView } from './components/TimelineView';
import { CodexExportView } from './components/CodexExportView';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ClinicalTab>('help');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-callahan');
  const [handoffMode, setHandoffMode] = useState<'create' | 'record'>('record');
  const [callahanHandoff, setCallahanHandoff] = useState<IPassHandoff>(INITIAL_CALLAHAN_HANDOFF);
  const [actions, setActions] = useState<ClinicalActionItem[]>(INITIAL_ACTIONS);
  const [codexModalOpen, setCodexModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('timeline');
  };

  const handleCreateHandoff = (patientId?: string) => {
    if (patientId) setSelectedPatientId(patientId);
    setHandoffMode('create');
    setActiveTab('handoffs');
  };

  const handleReviewHandoff = (patientId: string) => {
    setSelectedPatientId(patientId);
    setHandoffMode('record');
    setActiveTab('handoffs');
  };

  const handleAcknowledgeCare = () => {
    setCallahanHandoff((prev) => ({
      ...prev,
      isAcknowledged: true,
      acknowledgedAt: '14:45 EST',
    }));
    setPatients((prev) =>
      prev.map((p) =>
        p.id === 'pt-callahan' ? { ...p, handoffStatus: 'Completed' } : p
      )
    );
    showToast('Clinical custody of Margaret Callahan transferred to Dr. Eleanor Vance, MD.');
  };

  const handleSaveHandoffDraft = () => {
    showToast('Handoff draft saved to Epic EMR staging server.');
  };

  const handleSubmitForSignoff = (updated: IPassHandoff) => {
    setCallahanHandoff(updated);
    setHandoffMode('record');
    showToast('Handoff submitted and awaiting incoming physician verbal verification.');
  };

  const handleBatchAcknowledge = () => {
    setPatients((prev) =>
      prev.map((p) => ({
        ...p,
        handoffStatus: p.handoffStatus === 'Pending Acknowledgment' ? 'Completed' : p.handoffStatus,
      }))
    );
    showToast('Batch dual-physician sign-off completed for 4 eligible patients.');
  };

  const handleToggleActionComplete = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleAddAction = (newAction: ClinicalActionItem) => {
    setActions((prev) => [newAction, ...prev]);
    showToast(`Order ${newAction.orderId} queued in Epic Order Stream.`);
  };

  const pendingCount = actions.filter((a) => !a.completed).length;

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-[12px] animate-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        onOpenZipModal={() => setActiveTab('codex-zip')}
      />

      {/* Main Container */}
      <div className="pl-[230px]">
        {/* Global Hospital Header */}
        <Header
          onOpenZipModal={() => setActiveTab('codex-zip')}
        />

        {/* View Content Router */}
        <main className="relative pt-14 min-h-screen bg-surface">
          {activeTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              onSelectPatient={handleSelectPatient}
              onCreateHandoff={handleCreateHandoff}
              onReviewHandoff={handleReviewHandoff}
              onBatchAcknowledge={handleBatchAcknowledge}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onSelectPatient={handleSelectPatient}
              onCreateHandoff={handleCreateHandoff}
              onReviewHandoff={handleReviewHandoff}
            />
          )}

          {activeTab === 'handoffs' && (
            <div>
              {/* Toggle bar between Create and Record view */}
              <div className="w-full max-w-7xl mx-auto px-gutter-desktop pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
                  <button
                    onClick={() => setHandoffMode('record')}
                    className={`px-3 py-1 rounded font-label-md text-[11px] font-semibold transition-all cursor-pointer ${
                      handoffMode === 'record'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    View & Acknowledge Record
                  </button>
                  <button
                    onClick={() => setHandoffMode('create')}
                    className={`px-3 py-1 rounded font-label-md text-[11px] font-semibold transition-all cursor-pointer ${
                      handoffMode === 'create'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Create I-PASS Handoff
                  </button>
                </div>

                <div className="text-[11px] text-on-surface-variant">
                  Current Target Patient: <strong className="text-on-surface">{selectedPatient.name}</strong> ({selectedPatient.bed})
                </div>
              </div>

              {handoffMode === 'record' ? (
                <HandoffRecordView
                  patient={selectedPatient}
                  handoff={callahanHandoff}
                  onAcknowledgeCare={handleAcknowledgeCare}
                  onNavigateBack={() => setActiveTab('dashboard')}
                />
              ) : (
                <HandoffCreateView
                  patient={selectedPatient}
                  handoffData={callahanHandoff}
                  onSaveDraft={handleSaveHandoffDraft}
                  onSubmitForSignoff={handleSubmitForSignoff}
                  onCancel={() => setHandoffMode('record')}
                />
              )}
            </div>
          )}

          {activeTab === 'pending-actions' && (
            <PendingActionsView
              actions={actions}
              onToggleComplete={handleToggleActionComplete}
              onAddAction={handleAddAction}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              patient={selectedPatient}
              onNavigateBack={() => setActiveTab('patients')}
            />
          )}

          {activeTab === 'codex-zip' && (
            <CodexExportView onClose={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'help' && <HelpView />}
        </main>
      </div>
    </div>
  );
}
