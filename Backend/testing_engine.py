import json

from Query_Generator.main import Query
from Tavily_Engine.brief_generate import generate_brief
from api import BriefContent


company = "Microsoft"
date = "2026-11-14"
query = "Prepare me for a partnership discussion."

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
print(json.dumps(brief_content, indent=2, ensure_ascii=False))