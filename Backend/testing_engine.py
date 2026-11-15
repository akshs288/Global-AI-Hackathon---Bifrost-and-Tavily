import json

from Query_Generator.main import Query
from Tavily_Engine.brief_generate import generate_brief
from pydantic import BaseModel, Field



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
        evidenceIds: list[str] = Field(default_factory=list)

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

    # Rank once, then use the exact same research records for Gemini and the API.
    ranked_results = sorted(
        cleaned_results,
        key=lambda item: item.get("score") or 0,
        reverse=True,
    )[:8]
    sources_for_model = [
        {
            "id": f"src_{index + 1}",
            "title": item.get("title") or "Source",
            "url": item.get("url") or "",
            "content": item.get("content") or "",
            "score": item.get("score"),
        }
        for index, item in enumerate(ranked_results)
        if item.get("url")
    ]

    # Step 2: Generate the brief using source IDs that can be returned to the UI.
    brief_content = generate_brief(
        company=company,
        date=date,
        query=query,
        cleaned_results=sources_for_model,
        response_schema=BriefContent,
    )

    valid_source_ids = {source["id"] for source in sources_for_model}
    for news_item in brief_content.get("news", []):
        news_item["evidenceIds"] = [
            source_id
            for source_id in news_item.get("evidenceIds", [])
            if source_id in valid_source_ids
        ]

    print("\n--- GEMINI BRIEF CONTENT ---\n")
    return {
        "brief": brief_content,
        "sources": [
            {"id": item["id"], "title": item["title"], "url": item["url"]}
            for item in sources_for_model
        ],
    }
