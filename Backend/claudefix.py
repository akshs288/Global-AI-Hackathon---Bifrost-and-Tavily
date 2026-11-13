"""BriefAI API. Run:  uvicorn main:app --reload --port 8000"""
import json
import logging
import os
import re
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError

try:  # loads GEMINI_API_KEY / TAVILY_API_KEY from Backend/.env
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
except ImportError:
    pass

from google import genai
from google.genai import types

from Data_Validation.input_schema import Model1
from Query_Generator.language_to_json import generate_json_data
from Query_Generator.query_generator import generate_query

logger = logging.getLogger("uvicorn.error")

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


# ---- Pipeline ----
def to_dict(value) -> dict:
    """Turn a model reply (JSON string, possibly in ``` fences) into a dict."""
    if isinstance(value, dict):
        return value
    cleaned = re.sub(r"^```(?:json)?|```$", "", str(value).strip(), flags=re.M).strip()
    return json.loads(cleaned)


def tavily_search(query: str) -> str:
    key = os.getenv("TAVILY_API_KEY")
    if not key:
        return ""
    try:
        from tavily import TavilyClient
        res = TavilyClient(api_key=key).search(query=query, max_results=6)
        return "\n".join(
            f"- {r.get('title', '')} ({r.get('url', '')}): {r.get('content', '')}"
            for r in res.get("results", [])
        )
    except Exception:
        logger.exception("Tavily search failed")
        return ""


def synthesize_brief(plan: dict, research: str, req: BriefRequest) -> dict:
    client = genai.Client()  # reads GEMINI_API_KEY from the environment
    prompt = (
        "You are preparing a pre-meeting brief.\n"
        f"Company: {req.company}\nMeeting date: {req.date}\nUser goal: {req.query}\n\n"
        f"Research plan (JSON):\n{json.dumps(plan)}\n\n"
        f"Web research results:\n{research or 'None available.'}\n\n"
        "Write the brief. Use only facts supported by the research or well-established knowledge. "
        "If unsure, say so and add it to 'investigate'. Give 3-5 items per list, "
        "news items with a date (or 'Date unknown'), and tailor talkingPoints and questions to the user goal."
    )
    resp = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=BriefContent,
        ),
    )
    return to_dict(resp.text)


def run_pipeline(user_query: str, req: BriefRequest) -> dict:
    data = to_dict(generate_json_data(user_query))      # natural language -> dict
    meeting = Model1(**data)                            # raises ValidationError if invalid
    plan = to_dict(generate_query(meeting))             # your refined research plan
    research = tavily_search(f"{plan.get('company') or req.company} latest news executives competitors {req.query}")
    return synthesize_brief(plan, research, req)


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
            data = run_pipeline(build_user_query(req), req)
        except ValidationError as exc:
            logger.exception("Input validation failed")
            raise HTTPException(status_code=422, detail="Could not understand the meeting details.") from exc
        except Exception as exc:
            logger.exception("Pipeline failed")
            raise HTTPException(
                status_code=502,
                detail=f"The model request failed: {type(exc).__name__}: {exc}",
            ) from exc
        try:
            content = BriefContent.model_validate(data)
        except ValidationError as exc:
            logger.exception("Model output did not match the brief schema")
            raise HTTPException(status_code=502, detail="The model returned an unexpected format.") from exc

    now = datetime.now(timezone.utc)
    return BriefResponse(
        id=f"b{int(now.timestamp() * 1000)}",
        company=req.company.strip(), date=req.date, query=req.query.strip(),
        generatedAt=now.isoformat(), **content.model_dump(),
    )