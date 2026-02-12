from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.engine import analyze_resume
from models.schemas import ResumeAnalysis
import uvicorn
import os

app = FastAPI(title="ATS/Resume Optimizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, be specific.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ATS System API is running"}

@app.post("/analyze", response_model=ResumeAnalysis)
async def analyze_endpoint(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        content = await resume.read()
        analysis = analyze_resume(content, job_description)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
