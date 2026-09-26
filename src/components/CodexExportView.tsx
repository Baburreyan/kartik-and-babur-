import React, { useState } from 'react';
import { downloadProjectZip } from '../utils/zipExporter';

interface CodexExportViewProps {
  onClose?: () => void;
}

export const CodexExportView: React.FC<CodexExportViewProps> = ({ onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const requirementsContent = `# ==============================================================================
# HandoffGuard Clinical EMR v4.2 - Codex & Python Environment Requirements
# ==============================================================================
# Core Web & API Frameworks
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
flask>=3.0.2
flask-cors>=4.0.0
gunicorn>=21.2.0

# Data Validation, Serialization & Schema Definition (FHIR & I-PASS models)
pydantic>=2.6.4
pydantic-settings>=2.2.1

# Clinical Data Science & Telemetry Trajectory Analysis
numpy>=1.26.4
pandas>=2.2.1
scipy>=1.12.0

# Asynchronous HTTP & EMR Integration Clients (Epic / Cerner FHIR API bridging)
httpx>=0.27.0
requests>=2.31.0
aiohttp>=3.9.3

# AI & Language Models Integration (Google GenAI / LLM Clinical Summarization)
google-genai>=0.1.1
google-auth>=2.28.1

# Environment Configuration & Secret Management
python-dotenv>=1.0.1

# Templating & Report Generation (PDF, Markdown, HTML Discharge Summaries)
jinja2>=3.1.3
python-multipart>=0.0.9

# Utility & Zip Packaging for Codex Deployment
typing-extensions>=4.10.0
`;

  const projectFilesManifest = [
    { name: 'requirements.txt', size: '1.2 KB', type: 'Config', desc: 'Python/Codex dependencies' },
    { name: 'server.py', size: '3.4 KB', type: 'Python', desc: 'FastAPI/Codex backend & ZIP generator' },
    { name: 'package.json', size: '1.1 KB', type: 'Config', desc: 'Node.js dependencies & scripts' },
    { name: 'README.md', size: '2.8 KB', type: 'Doc', desc: 'Codex and I-PASS documentation' },
    { name: 'index.html', size: '1.4 KB', type: 'HTML', desc: 'Entry point with fonts & metadata' },
    { name: 'vite.config.ts', size: '0.7 KB', type: 'Config', desc: 'Vite build configuration' },
    { name: 'tsconfig.json', size: '0.6 KB', type: 'Config', desc: 'TypeScript compiler configuration' },
    { name: 'src/main.tsx', size: '0.4 KB', type: 'React', desc: 'React 19 root bootstrap' },
    { name: 'src/App.tsx', size: '6.5 KB', type: 'React', desc: 'Master clinical controller' },
    { name: 'src/index.css', size: '3.8 KB', type: 'CSS', desc: 'Tailwind clinical design system' },
    { name: 'src/types/clinical.ts', size: '3.2 KB', type: 'TS', desc: 'I-PASS & Telemetry data schemas' },
    { name: 'src/data/mockClinicalData.ts', size: '14.2 KB', type: 'Data', desc: 'Unit 4B inpatient telemetry dataset' },
    { name: 'src/components/Sidebar.tsx', size: '5.1 KB', type: 'React', desc: 'EMR sidebar navigation' },
    { name: 'src/components/Header.tsx', size: '4.8 KB', type: 'React', desc: 'Hospital division header & quick zip' },
    { name: 'src/components/DashboardView.tsx', size: '14.8 KB', type: 'React', desc: 'Shift Dashboard (Image 2/4)' },
    { name: 'src/components/PatientsView.tsx', size: '17.2 KB', type: 'React', desc: 'Patient Roster & Census (Image 6)' },
    { name: 'src/components/HandoffCreateView.tsx', size: '19.5 KB', type: 'React', desc: 'I-PASS Protocol Creator (Image 8)' },
    { name: 'src/components/HandoffRecordView.tsx', size: '21.0 KB', type: 'React', desc: 'Handoff Record Review (Image 10)' },
    { name: 'src/components/PendingActionsView.tsx', size: '15.6 KB', type: 'React', desc: 'Action Task Board (Image 12 left)' },
    { name: 'src/components/TimelineView.tsx', size: '18.4 KB', type: 'React', desc: 'Clinical Timeline (Image 12 right)' },
    { name: 'src/utils/zipExporter.ts', size: '2.5 KB', type: 'TS', desc: 'Browser & server ZIP exporter' },
  ];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectZip((status) => setProgressMsg(status));
    } catch (e) {
      console.error(e);
      setProgressMsg('Download failed. Please try again.');
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setProgressMsg('');
      }, 2000);
    }
  };

  const handleCopyRequirements = () => {
    navigator.clipboard.writeText(requirementsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-gutter-desktop space-y-4">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-300 bg-linear-to-r from-amber-50/70 via-white to-amber-50/30">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[28px]">folder_zip</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-on-surface font-bold text-[20px]">
                Codex Project ZIP & Environment Package
              </h1>
              <span className="font-data-mono-sm text-[10px] bg-amber-100 text-amber-900 border border-amber-400 font-bold px-2 py-0.5 rounded-full uppercase">
                Codex Ready
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant text-[13px] mt-1 max-w-3xl">
              This complete project archive includes the full <strong>HandoffGuard Clinical EMR v4.2</strong> source
              code, React 19 frontend components, I-PASS protocol engine, Python Codex server (`server.py`), and
              complete <strong>`requirements.txt`</strong> with all necessary dependencies.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-headline-sm text-[13px] font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {downloading ? 'sync' : 'download'}
            </span>
            <span>{downloading ? 'Packaging Archive...' : 'Download Project ZIP (Ready)'}</span>
          </button>
        </div>
      </div>

      {progressMsg && (
        <div className="p-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[12px] flex items-center gap-2 font-medium">
          <span className="material-symbols-outlined text-[18px] text-amber-700">info</span>
          <span>{progressMsg}</span>
        </div>
      )}

      {/* Two Column Layout: Requirements.txt on left, Instructions & Manifest on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: requirements.txt (6 of 12) */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl shadow-xs p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              <h2 className="font-headline-sm text-on-surface font-bold text-[14px]">
                requirements.txt (All Dependencies Included)
              </h2>
            </div>
            <button
              onClick={handleCopyRequirements}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy File'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[500px]">
              {requirementsContent}
            </pre>
          </div>
          <p className="text-[11px] text-on-surface-variant italic">
            This file is placed at the root of the project (`/requirements.txt`) and packaged inside the `.zip` file.
          </p>
        </div>

        {/* Right Column: Codex Instructions & File Manifest (6 of 12) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Quickstart in Codex */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-surface-container pb-2">
              <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
              <h2 className="font-headline-sm text-on-surface font-bold text-[14px]">
                How to Use Inside OpenAI Codex / Cursor / VS Code
              </h2>
            </div>

            <div className="space-y-2 text-[12px] text-on-surface">
              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="font-bold text-primary block mb-0.5">1. Unzip the downloaded file:</span>
                <code className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface block">
                  unzip handoffguard-project.zip -d my-clinical-app && cd my-clinical-app
                </code>
              </div>

              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="font-bold text-primary block mb-0.5">2. Install Python dependencies:</span>
                <code className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface block">
                  pip install -r requirements.txt
                </code>
              </div>

              <div className="p-2.5 rounded bg-surface-container-low">
                <span className="font-bold text-primary block mb-0.5">3. Run Python Codex Server or Vite Frontend:</span>
                <div className="space-y-1 mt-1">
                  <code className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface block">
                    python3 server.py # Starts FastAPI/Flask backend
                  </code>
                  <code className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface block">
                    npm install && npm run dev # Starts Vite React UI on port 3000
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Project Archive File Manifest */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">inventory_2</span>
                <h2 className="font-headline-sm text-on-surface font-bold text-[14px]">
                  Packaged Files in ZIP Archive ({projectFilesManifest.length} items)
                </h2>
              </div>
              <span className="font-data-mono-sm text-[10px] text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded">
                Excludes node_modules
              </span>
            </div>

            <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 text-[11px]">
              {projectFilesManifest.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-surface-container-low transition-colors font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[15px] text-outline">
                      {f.name.endsWith('.tsx') || f.name.endsWith('.ts')
                        ? 'code'
                        : f.name.endsWith('.py')
                        ? 'terminal'
                        : f.name.endsWith('.txt') || f.name.endsWith('.md')
                        ? 'description'
                        : 'folder'}
                    </span>
                    <span className="font-medium text-on-surface truncate">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-on-surface-variant text-[10px]">{f.desc}</span>
                    <span className="bg-surface-container px-1 rounded text-[10px] text-on-surface">
                      {f.size}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
