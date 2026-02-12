# ATS System - Backend & AI Engine

This directory contains the core intelligence of the ATS Resume Optimizer. It uses **LlamaIndex** and **Google Gemini** to perform deep semantic analysis of resumes against job descriptions.

## AI Architecture

The system is built on a "Brutal Scrutiny" philosophy, designed to give candidates honest, actionable feedback.

### Components
-   **LLM**: Google Gemini 2.5 Flash (via `llama-index-llms-gemini`).
-   **Orchestrator**: LlamaIndex `LLMTextCompletionProgram` for structured data extraction.
-   **Parser**: `pypdf` for extracting text from PDF resumes.
-   **API**: FastAPI for serving the analysis endpoints.

### How It Works
1.  **Ingestion**: The user uploads a PDF resume. The backend extracts the raw text.
2.  **Prompt Engineering**: We use a highly specific prompt that instructs the AI to act as a strict Career Coach.
3.  **Analysis**:
    -   **Match Score**: Calculated based on hard and soft skills.
    -   **Gap Analysis**: Identifies missed keywords from the JD.
    -   **Project Suggestions**: Generates 3-5 specific project ideas to fill skill gaps.
4.  **Structured Output**: The AI returns a strict JSON object (enforced by Pydantic models) containing the analysis.

##  Setup & Installation

### Prerequisites
-   Python 3.10+
-   A Google Cloud Project with Gemini API enabled.

### Installation
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Set up your environment variables:
    Create a `.env` file in the `backend/` root or set it in your shell.
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    ```

##  Running the API

Start the FastAPI server with hot-reload enabled:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Endpoints
-   `GET /`: Health check.
-   `POST /analyze`: Main analysis endpoint.
    -   **Body**: `multipart/form-data`
    -   **Fields**: `resume` (File), `job_description` (String).

##  Project Structure

-   `main.py`: Application entry point and route definitions.
-   `core/engine.py`: The LlamaIndex logic and prompt templates.
-   `core/config.py`: Configuration management.
-   `models/schemas.py`: Pydantic models defining the input/output structure.
