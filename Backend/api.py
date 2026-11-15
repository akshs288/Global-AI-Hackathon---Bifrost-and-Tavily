import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from datetime import datetime, timezone
from testing_engine import TavilyGenerator

load_dotenv()
# Also search parent directory for .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# from PipeLine import run_pipeline


# Allowing React to input data
app = FastAPI(title="BriefAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Source(BaseModel):
    id: str
    title: str
    url: str

# Defined Parameters            JUST MAKE SURE KARNA KI JOH OUTPUT HOGA VOH ISS SCHEMA PE HI BASED HO, KUCH MODIFY HONA H TOH BATA DENA
class Overview(BaseModel):
    description: str
    industry: str
    hq: str
    products: str
    model: str
    evidenceIds: list[str] = Field(default_factory=list)

class NewsItem(BaseModel):
    date: str
    title: str
    summary: str
    evidenceIds: list[str] = Field(default_factory=list)

class Executive(BaseModel):
    name: str
    role: str
    description: str
    evidenceIds: list[str] = Field(default_factory=list)

class Competitor(BaseModel):
    name: str
    positioning: str
    advantage: str
    evidenceIds: list[str] = Field(default_factory=list)

class EvidenceItem(BaseModel):
    text: str
    evidenceIds: list[str] = Field(default_factory=list)

class BriefContent(BaseModel):
    overview: Overview
    strategicRoadmap: list[EvidenceItem]
    expansionBlueprint: list[EvidenceItem]
    meetingPreparationSummary: list[EvidenceItem]
    news: list[NewsItem]
    executives: list[Executive]
    talkingPoints: list[str]
    competitors: list[Competitor]
    competitorNote: str
    competitorNoteEvidenceIds: list[str] = Field(default_factory=list)
    questions: list[str]
    risks: list[EvidenceItem]
    opportunities: list[EvidenceItem]
    investigate: list[str]
    trends: list[EvidenceItem]

class BriefInput(BaseModel):
    company: str = Field(min_length=1)
    date: str
    query: str = Field(min_length=1)

class BriefResponse(BriefContent):
    id: str
    company: str
    date: str
    query: str
    generatedAt: str
    sources: list[Source]
# ..


# Testing If API is running or Not
@app.get("/home")
def Home():
    return {"status": "API is Running"}

#Main Request Model
@app.post("/API/Brief/Generate", response_model=BriefResponse)
@app.post("/api/briefs/generate", response_model=BriefResponse)
def Brief(req: BriefInput):
#Defining Variables firstly
    company = req.company
    date = req.date
    query = req.query
    
    try:
        result = TavilyGenerator(company,date,query)
        now = datetime.now(timezone.utc)
        return BriefResponse(
            id=f"b{int(now.timestamp() * 1000)}",
            company=company.strip(),
            date=date,
            query=query.strip(),
            generatedAt=now.isoformat(),
            **result["brief"],
            sources=result["sources"],
        )

	#Basic Expceptional Handeling, Might improve later
    except Exception as e:
        message = str(e)

        if "RESOURCE_EXHAUSTED" in message or "quota" in message.lower():
            raise HTTPException(
                status_code=429,
                detail="Gemini daily quota is exhausted. Please retry after the quota resets."
            ) from e

        raise HTTPException(
            status_code=500,
            detail=f"Could not generate brief: {message}"
        ) from e
