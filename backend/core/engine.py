import os
from llama_index.llms.gemini import Gemini
from llama_index.core import Document, VectorStoreIndex
from llama_index.core.program import LLMTextCompletionProgram
from models.schemas import ResumeAnalysis
from core.config import settings
import io
from pypdf import PdfReader

# Initialize Gemini with temperature=0.0 for deterministic output
llm = Gemini(model_name=settings.GEMINI_MODEL, api_key=settings.GOOGLE_API_KEY, temperature=0.0)

PROMPT_TEMPLATE = """
You are an expert, no-nonsense Applicant Tracking System (ATS) and Career Coach.
Your goal is to BRUTALLY scrutiny a candidate's resume against a specific Job Description (JD) and provide explicit, actionable feedback.

Job Description:
{job_description}

Resume Content:
{resume_content}

Strictly follow these instructions:
1. **Match Percentage**: Calculate a strict match percentage based on skills, experience, and keywords found in the JD. Be realistic, do not inflate the score.
2. **Missing Keywords**: Explicitly list EVERY single critical keyword, tool, or technology mentioned in the JD that is missing from the resume. Do not be vague.
3. **Missing Skills**: Explicitly list soft skills or technical competencies required by the JD that are not evident in the resume.
4. **Recommended Projects**: Suggest 3-5 specific, complex projects the candidate should build to demonstrate the missing skills. Give titles and brief descriptions.
5. **Improvement Guide**: Provide a step-by-step, bulleted list of exactly what lines to change, what to add, and where. Be extremely specific (e.g., "Add 'FastAPI' to the Skills section", "Rewrite the summary to mention 'System Design'").

Output the result as a valid JSON object matching the schema.
"""

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extracts text from a PDF file."""
    reader = PdfReader(io.BytesIO(file_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def analyze_resume(resume_content: bytes, job_description: str) -> ResumeAnalysis:
    """
    Analyzes the resume text against the job description using Gemini.
    """
    resume_text = extract_text_from_pdf(resume_content)
    
    # We use a Pydantic program to get structured output
    program = LLMTextCompletionProgram.from_defaults(
        output_cls=ResumeAnalysis,
        prompt_template_str=PROMPT_TEMPLATE,
        llm=llm,
        verbose=True
    )

    output = program(
        job_description=job_description,
        resume_content=resume_text
    )

    return output
