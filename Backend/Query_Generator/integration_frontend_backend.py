"""BriefAI API. Run:  uvicorn main:app --reload --port 8000"""
import json
import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError

from Data_Validation.input_schema import Model1
from Query_Generator.language_to_json import generate_json_data
from Query_Generator.query_generator import generate_query

app = FastAPI(title="BriefAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Schemas (field names match src/types.ts exactly) ----
class BriefRequest(BaseModel):
    company: str = Field(min_length=1, max_length=120)
    date: str = Field(min_length=1, max_length=20)
    query: str = Field(min_length=1, max_length=1000)


class Overview(BaseModel):
    description: str
    industry: str
    hq: str
    products: str
    model: str


class NewsItem(BaseModel):
    date: str
    title: str
    summary: str


class Executive(BaseModel):
    name: str
    role: str
    description: str


class Competitor(BaseModel):
    name: str
    positioning: str
    advantage: str


class BriefContent(BaseModel):
    overview: Overview
    news: list[NewsItem]
    executives: list[Executive]
    talkingPoints: list[str]
    competitors: list[Competitor]
    competitorNote: str
    questions: list[str]
    risks: list[str]
    opportunities: list[str]
    investigate: list[str]
    trends: list[str]


class BriefResponse(BriefContent):
    id: str
    company: str
    date: str
    query: str
    generatedAt: str


# ---- Your model pipeline ----
def run_pipeline(user_query: str) -> dict:
    data = generate_json_data(user_query)      # natural language -> dict
    meeting = Model1(**data)                   # raises ValidationError if invalid
    raw = generate_query(meeting)              # Gemini call
    return json.loads(raw) if isinstance(raw, str) else raw


def build_user_query(req: BriefRequest) -> str:
    return f"I have a meeting on {req.date} with {req.company}. {req.query} Give me a briefing."


def sample_content(req: BriefRequest) -> dict:
    n = req.company
    return {
        "overview": {"description": f"Sample profile for {n}. Connect your model for real research.", "industry": "Sample", "hq": "Not specified", "products": "Sample products", "model": "Sample model"},
        "news": [{"date": datetime.now().strftime("%b %d, %Y"), "title": f"{n} sample update", "summary": "Sample entry, not real news."}],
        "executives": [{"name": "Sample Executive", "role": "CEO", "description": "Sample role description."}],
        "talkingPoints": [f"Clarify goals: {req.query[:80]}"],
        "competitors": [{"name": "Sample Competitor", "positioning": "Sample positioning", "advantage": "Sample advantage"}],
        "competitorNote": "Sample comparison.",
        "questions": ["What are your top priorities this quarter?"],
        "risks": ["Sample risk"], "opportunities": ["Sample opportunity"],
        "investigate": ["Verify all facts from primary sources"], "trends": ["Sample trend"],
    }


# ---- Routes ----
@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/briefs/generate", response_model=BriefResponse)
def generate(req: BriefRequest) -> BriefResponse:
    if os.getenv("USE_SAMPLE") == "1":
        content = BriefContent.model_validate(sample_content(req))
    else:
        try:
            data = run_pipeline(build_user_query(req))
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail="Could not understand the meeting details.") from exc
        except Exception as exc:
            raise HTTPException(status_code=502, detail="The model request failed.") from exc
        try:
            content = BriefContent.model_validate(data)
        except ValidationError as exc:
            raise HTTPException(status_code=502, detail="The model returned an unexpected format.") from exc

    now = datetime.now(timezone.utc)
    return BriefResponse(
        id=f"b{int(now.timestamp() * 1000)}",
        company=req.company.strip(), date=req.date, query=req.query.strip(),
        generatedAt=now.isoformat(), **content.model_dump(),
    )