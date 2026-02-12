from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeAnalysis(BaseModel):
    match_percentage: float = Field(description="The percentage match between the resume and the job description (0-100).", ge=0, le=100)
    missing_keywords: List[str] = Field(description="List of critical keywords or skills found in the JD but missing from the resume.")
    missing_skills: List[str] = Field(description="List of technical or soft skills that are missing.")
    recommended_projects: List[str] = Field(description="Suggestions for projects to add to the resume to boost the score.")
    resume_improvement_suggestions: List[str] = Field(description="Specific, actionable advice on where and how to update the resume (e.g., 'Add X to the Skills section', 'Quantify impact in Y role').")
    summary: str = Field(description="A brief summary of the analysis.")
