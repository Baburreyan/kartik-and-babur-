"""
HandoffGuard Clinical EMR v4.2 - Codex Python Server
Provides REST API endpoints for Clinical Handoffs, Patients Census, Pending Actions,
and Project ZIP download when running inside Python/Codex environments.
"""

import os
import sys
import zipfile
import json
from pathlib import Path
from typing import Dict, Any, List

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse, JSONResponse
    import uvicorn
    USE_FASTAPI = True
except ImportError:
    USE_FASTAPI = False

# Fallback or standalone helper to build the project zip
def generate_project_zip(output_path: str = "project.zip") -> str:
    root_dir = Path(__file__).parent.resolve()
    exclude_dirs = {"node_modules", ".git", "__pycache__", ".venv", "venv", "dist", ".cache"}
    exclude_files = {".DS_Store", "project.zip", "handoffguard-project.zip"}
    
    zip_target = Path(output_path)
    zip_target.parent.mkdir(parents=True, exist_ok=True)
    
    with zipfile.ZipFile(zip_target, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file in exclude_files:
                    continue
                file_path = Path(root) / file
                arcname = file_path.relative_to(root_dir)
                zipf.write(file_path, arcname)
    
    print(f"Project ZIP generated successfully at: {zip_target} ({os.path.getsize(zip_target):,} bytes)")
    return str(zip_target)

if USE_FASTAPI:
    app = FastAPI(
        title="HandoffGuard Clinical EMR API",
        version="4.2",
        description="I-PASS Standard Inpatient Shift Handoff & Telemetry API"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    def health():
        return {
            "status": "healthy",
            "unit": "Unit 4B Telemetry",
            "hospital": "St. Jude Academic Medical Center",
            "version": "4.2",
            "ipass_compliant": True
        }

    @app.get("/api/download-zip")
    def download_zip():
        zip_path = "project.zip"
        if not os.path.exists(zip_path):
            generate_project_zip(zip_path)
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="handoffguard-project.zip"
        )

    # Mount dist if built, or public if present
    if os.path.exists("dist"):
        app.mount("/", StaticFiles(directory="dist", html=True), name="static")

if __name__ == "__main__":
    # If called with 'zip' argument or standalone
    if len(sys.argv) > 1 and sys.argv[1] == "zip":
        generate_project_zip("project.zip")
        # Also copy to public/project.zip if public directory exists
        public_dir = Path("public")
        public_dir.mkdir(exist_ok=True)
        generate_project_zip("public/project.zip")
    elif USE_FASTAPI:
        generate_project_zip("public/project.zip")
        port = int(os.environ.get("PORT", 3000))
        uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
    else:
        print("FastAPI not installed in current environment. Generated project zip:")
        generate_project_zip("project.zip")
        public_dir = Path("public")
        public_dir.mkdir(exist_ok=True)
        generate_project_zip("public/project.zip")
