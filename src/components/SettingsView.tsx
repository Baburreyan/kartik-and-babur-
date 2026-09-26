import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [epicConnected, setEpicConnected] = useState(true);
  const [newsAlertThreshold, setNewsAlertThreshold] = useState(5);
  const [dualSignoffRequired, setDualSignoffRequired] = useState(true);
  const [autoSaveMinutes, setAutoSaveMinutes] = useState(2);
  const [audioAlerts, setAudioAlerts] = useState(true);

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline-lg text-on-surface font-bold text-[20px]">System & EMR Settings</h1>
          <p className="font-body-sm text-on-surface-variant text-[12px] mt-0.5">
            Unit 4B Telemetry Configuration, EMR Bridge (Epic FHIR), and Clinical Alert Policies
          </p>
        </div>
        <span className="font-data-mono-sm text-[10px] bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-bold">
          Unit 4B Active Lock • TLS 1.3
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EMR Bridge */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-2">
            <span className="material-symbols-outlined text-primary">lan</span>
            <h2 className="font-headline-sm text-on-surface font-bold text-[14px]">
              Epic Systems EMR Synchronization Bridge
            </h2>
          </div>

          <div className="space-y-3 text-[12px]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <div>
                <span className="font-bold text-on-surface block">Epic FHIR R4 Inpatient Sync</span>
                <span className="text-on-surface-variant text-[11px]">
                  Real-time ADT orders, lab results, and vitals streaming
                </span>
              </div>
              <button
                onClick={() => setEpicConnected(!epicConnected)}
                className={`px-3 py-1 rounded font-bold text-[11px] cursor-pointer ${
                  epicConnected ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {epicConnected ? 'Connected' : 'Offline'}
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1">Ward FHIR Endpoint URL</label>
              <input
                type="text"
                readOnly
                value="https://epic-gateway.stjude-med.internal/fhir/r4/unit-4b-telemetry"
                className="w-full px-3 py-1.5 bg-surface-container font-mono text-[11px] rounded text-on-surface outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Telemetry Monitor Refresh Frequency</label>
              <select className="w-full px-3 py-1.5 bg-surface-container-low rounded text-[12px]">
                <option>Every 15 seconds (High Acuity)</option>
                <option>Every 30 seconds (Standard)</option>
                <option>Every 60 seconds (Battery conserve)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clinical Policies */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-2">
            <span className="material-symbols-outlined text-primary">policy</span>
            <h2 className="font-headline-sm text-on-surface font-bold text-[14px]">
              I-PASS & Triage Alert Standards
            </h2>
          </div>

          <div className="space-y-3 text-[12px]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <div>
                <span className="font-bold text-on-surface block">Mandatory Dual-Physician Sign-Off</span>
                <span className="text-on-surface-variant text-[11px]">
                  Requires both outgoing and incoming clinicians to acknowledge
                </span>
              </div>
              <input
                type="checkbox"
                checked={dualSignoffRequired}
                onChange={(e) => setDualSignoffRequired(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <div>
                <span className="font-bold text-on-surface block">NEWS2 Critical Triage Score Threshold</span>
                <span className="text-on-surface-variant text-[11px]">
                  Scores at or above this trigger automated Watcher/Acuity alerts
                </span>
              </div>
              <input
                type="number"
                min={3}
                max={9}
                value={newsAlertThreshold}
                onChange={(e) => setNewsAlertThreshold(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-white border border-outline-variant rounded text-center font-bold font-mono"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <div>
                <span className="font-bold text-on-surface block">Audible Telemetry Critical Alarms</span>
                <span className="text-on-surface-variant text-[11px]">
                  Chime upon VT/VF or Troponin alert triggers
                </span>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
