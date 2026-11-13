from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from datetime import datetime, timezone
from Query_Generator.main import Query
# from PipeLine import run_pipeline


# Allowing React to input data
app = FastAPI(title="BriefAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Defined Parameters            JUST MAKE SURE KARNA KI JOH OUTPUT HOGA VOH ISS SCHEMA PE HI BASED HO, KUCH MODIFY HONA H TOH BATA DENA
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
# ..


# Testing If API is running or Not
@app.get("/home")
def Home():
    return {"status": "API is Running"}

@app.post("/API/Brief/Generate", response_model=BriefResponse)
def Brief(req:BriefInput):
    company = req.company
    date = req.date
    query = req.query
    try:
        result = Query(company,date,query)            # Working in CLI
        print(result)

    except Exception as e:
        print(e)

    return {
        "id": "brief_001",
        "company": company,
        "date": date,
        "query": query,
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "overview": {
            "description": "Electric vehicle and clean energy company.",
            "industry": "Automotive",
            "hq": "Austin, Texas",
            "products": "Electric vehicles and batteries",
            "model": "Direct-to-consumer"
        },
        "news": [],
        "executives": [],
        "talkingPoints": [],
        "competitors": [],
        "competitorNote": "",
        "questions": [],
        "risks": [],
        "opportunities": [],
        "investigate": [],
        "trends": []
        }