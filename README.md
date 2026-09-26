# HandoffGuard Clinical EMR v4.2

> High-Density Clinical Inpatient Handover and Telemetry Platform adhering to **I-PASS Standards** (Illness Severity, Patient Summary, Action List, Situation Awareness & Contingency Plans, Synthesis by Receiver).

Designed for high-reliability acute care, cardiology step-down, and medical telemetry units (such as Unit 4B at St. Jude Academic Medical Center).

---

## 📦 Using This Project in Codex / Python

All project dependencies for OpenAI Codex, Python, and clinical data analysis are specified in `requirements.txt`.

### 1. Python & Codex Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt

# Run the Python Codex backend
python3 server.py
```

### 2. Node.js & React Frontend Setup
```bash
# Install frontend dependencies
npm install

# Run the development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

---

## 🗂️ Generating the Project ZIP
To produce a clean `.zip` archive of the entire source repository (excluding `node_modules`):
```bash
python3 server.py zip
```
The output will be saved to:
- `./project.zip`
- `./public/project.zip`

In the web interface, you can also click the **"Download Project ZIP"** button located on the top header bar or in the **Codex Export** tab.

---

## 🩺 Key Clinical Features
1. **Shift Dashboard**: Unit 4B bed occupancy (24/26, 92%), active NEWS2 acuity alerts, pending handoffs, incoming shift handoff roster with dual-physician sign-offs.
2. **Patient Roster & Bed Census**: High-density census table with vital stats, code status (FULL CODE / DNR / DNI), contact isolation precautions (MRSA, C. diff), pending labs, and primary teams.
3. **Structured I-PASS Clinical Handoff Creator**:
   - **I**llness Severity (Stable, Watcher/Guarded, Unstable/Critical)
   - **P**atient Summary & Current Status with telemetry telemetry strip (BP, HR, SpO2, Resp, Temp)
   - Systems-Based Assessment (CVS, Renal, Pulmonary)
   - Recent Events & Changes (Current Shift log)
   - **A**ction List with countdown timers and stat order links
   - **S**ituation Awareness & If/Then Contingency Plans
   - Receiver synthesis & Night float context
   - 92% Completeness Score Radial Gauge & AI Continuity Audit
4. **Shift Handoff Record & Legal Sign-Off**:
   - Digital handover transfer of care acceptance
   - Clarification request modal & Pager integration
   - Formal clinical addendum logger
   - Real-time audit trail and change log
5. **Pending Clinical Actions Board**:
   - Overdue tasks blocking shift sign-off
   - Priority triage (Urgent, High, Routine)
   - Filter by specialty and provider
   - Interactive checklist with bulk complete & Add action modal
6. **Patient Continuity Timeline**:
   - Next 12 hours protocol forecast
   - 24-hour telemetry trajectory (net fluid balance, cumulative weight, MAP, cardiac rhythm)
   - Interactive SVG telemetry heart rate trend curve
   - Multi-disciplinary team log (Attending, Resident, Primary RN, Case Manager)
