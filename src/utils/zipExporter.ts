import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function downloadProjectZip(onProgress?: (status: string) => void): Promise<void> {
  if (onProgress) onProgress('Checking pre-built project ZIP...');

  // Try direct fetch of the server-generated pre-built project.zip first
  try {
    const response = await fetch('/project.zip', { method: 'HEAD' });
    if (response.ok) {
      if (onProgress) onProgress('Downloading pre-packaged Codex ZIP...');
      const anchor = document.createElement('a');
      anchor.href = '/project.zip';
      anchor.download = 'handoffguard-clinical-emr-codex.zip';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      if (onProgress) onProgress('Download initiated!');
      return;
    }
  } catch {
    // Fall back to client-side packaging
  }

  if (onProgress) onProgress('Bundling Codex project structure into ZIP...');
  const zip = new JSZip();

  // Root configuration files
  zip.file(
    'requirements.txt',
    `# ==============================================================================
# HandoffGuard Clinical EMR v4.2 - Codex & Python Environment Requirements
# ==============================================================================
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
flask>=3.0.2
flask-cors>=4.0.0
gunicorn>=21.2.0
pydantic>=2.6.4
numpy>=1.26.4
pandas>=2.2.1
requests>=2.31.0
google-genai>=0.1.1
python-dotenv>=1.0.1
jinja2>=3.1.3
python-multipart>=0.0.9
`
  );

  zip.file(
    'README.md',
    `# HandoffGuard Clinical EMR v4.2 (Codex Project)

Clinical Inpatient Handover and Telemetry Platform adhering to I-PASS standards.

## Quickstart in Codex / Python
\`\`\`bash
pip install -r requirements.txt
python server.py
\`\`\`

## Quickstart in Node.js
\`\`\`bash
npm install
npm run dev
\`\`\`
`
  );

  zip.file(
    'server.py',
    `import os
import sys
import zipfile
from pathlib import Path

def build_zip():
    print("Building project zip...")

if __name__ == "__main__":
    build_zip()
`
  );

  if (onProgress) onProgress('Compressing archive...');
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'handoffguard-clinical-emr-codex.zip');
  if (onProgress) onProgress('Complete!');
}
