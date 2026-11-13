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

# Defined Parameters
class BriefInput(BaseModel):
    company: str = Field(min_length=1)
    date: str
    query: str = Field(min_length=1)

class BriefResponse(BaseModel):
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
       
    print (Query(company,date,query))

    return 