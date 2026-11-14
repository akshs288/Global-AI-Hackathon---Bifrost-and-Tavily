import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


def generate_brief(
    company: str,
    date: str,
    query: str,
    cleaned_results: list[dict],
    response_schema,
) -> dict:
    """
    Generates only the BriefContent part.
    `response_schema` will be the BriefContent class from api.py.
    """
    if not cleaned_results:
        cleaned_results = []
    else:
        cleaned_results = sorted(
            cleaned_results,
            key=lambda item: item.get("score") or 0,
            reverse=True
        )[:8]

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        gemini_key = gemini_key.strip('"\' ')
    client = genai.Client(api_key=gemini_key)

    prompt = f"""
You are a business research analyst creating a concise meeting brief.

Company: {company}
Meeting date: {date}
Meeting request: {query}

Cleaned research results:
{json.dumps(cleaned_results, ensure_ascii=False, indent=2)}

Use only the research results provided above.

Rules:
- Do not invent facts.
- Return only valid JSON matching the supplied schema.
- Do not return Markdown, explanations, code fences, citations, or extra keys.
- If data is unavailable, use "" for a string and [] for a list.
- Keep every point concise so the final brief can fit on one page.

Field guidance:
- overview: factual description, industry, headquarters, products, and business model.
- news: a list of relevant recent news objects containing date, title, and summary.
- executives: a list of executive objects containing name, role, and description.
- talkingPoints: practical discussion points based on the meeting request.
- competitors: competitor objects containing name, positioning, and advantage.
- competitorNote: a short overall comparison note.
- questions: useful questions to ask in this meeting.
- risks: important company or partnership risks.
- opportunities: possible partnership or business opportunities.
- investigate: facts that should be verified before the meeting.
- trends: relevant industry trends.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
            response_schema=response_schema,
        ),
    )

    return response.parsed.model_dump()
