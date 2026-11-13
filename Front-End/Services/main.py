"""BriefAI API. Run:  uvicorn main:app --reload --port 8000"""
import json
import re
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError

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


# ---- Model integration ----
def build_prompt(req: BriefRequest) -> str:
    return (
        f"You are a research assistant. Prepare a pre-meeting brief about {req.company} "
        f"for a meeting on {req.date}. The user's goal: {req.query}\n"
        "Reply with ONLY valid JSON with these keys: overview{description,industry,hq,products,model}, "
        "news[{date,title,summary}], executives[{name,role,description}], talkingPoints[str], "
        "competitors[{name,positioning,advantage}], competitorNote, questions[str], risks[str], "
        "opportunities[str], investigate[str], trends[str]."
    )


def call_model(prompt: str) -> str:
    """TODO: call your model here and return its raw text (a JSON string).
    Raise NotImplementedError to use the sample response below."""
    raise NotImplementedError


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


def parse_model_output(raw: str) -> BriefContent:
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.M).strip()
    return BriefContent.model_validate(json.loads(cleaned))


# ---- Routes ----
@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/briefs/generate", response_model=BriefResponse)
def generate(req: BriefRequest) -> BriefResponse:
    try:
        content = parse_model_output(call_model(build_prompt(req)))
    except NotImplementedError:
        content = BriefContent.model_validate(sample_content(req))
    except (ValueError, ValidationError) as exc:
        raise HTTPException(status_code=502, detail="The model returned an invalid response.") from exc
    except Exception as exc:  # model/network failure
        raise HTTPException(status_code=502, detail="The model request failed.") from exc
    now = datetime.now(timezone.utc)
    return BriefResponse(
        id=f"b{int(now.timestamp() * 1000)}",
        company=req.company.strip(), date=req.date, query=req.query.strip(),
        generatedAt=now.isoformat(), **content.model_dump(),
    )
