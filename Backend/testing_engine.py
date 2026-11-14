import json

from Query_Generator.main import Query
from Tavily_Engine.brief_generate import generate_brief
from pydantic import BaseModel



def TavilyGenerator(company,date,query):

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



    # company = "Microsoft"
    # date = "2026-11-14"
    # query = "Prepare me for a partnership discussion."

    # Step 1: Test Tavily + cleaning output
    cleaned_results = Query(company, date, query)

    print("\n--- CLEANED TAVILY RESULTS ---\n")
    print(json.dumps(cleaned_results, indent=2, ensure_ascii=False))

    # Step 2: Test Gemini brief generation
    brief_content = generate_brief(
        company=company,
        date=date,
        query=query,
        cleaned_results=cleaned_results,
        response_schema=BriefContent,
    )

    print("\n--- GEMINI BRIEF CONTENT ---\n")
    return brief_content
    