import os
import re
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

gemini_key = os.getenv("GEMINI_API_KEY")
if gemini_key:
    gemini_key = gemini_key.strip('"\' ')

client = genai.Client(
    api_key=gemini_key
)

def generate_query(meeting_details):
    prompt = f"""
    You are an expert meeting research assistant.

    Your job is to convert meeting details into
    a detailed research query.

    Meeting Details:
    {meeting_details.model_dump(exclude_none=True)}

    Instructions:
    1. Understand the company and meeting agenda.
    2. Identify the important research areas.
    3. Consider the participants and their roles.
    4. Include relevant recent developments.
    5. Make the query specific and comprehensive.
    6. Do not invent missing meeting details.
    7. Return only the refined research query (And please return me query in json format like example - {{ 
    "company": "Microsoft",
    "research_queries": [
        {{
            "category": "Business Strategy",
            "target": "CEO",
            "query": "..."
        }},
        {{
            "category": "Technical Architecture",
            "target": "CTO",
            "query": "..."
        }}
    ],
    "source_preferences": [
        "Official company announcements",
        "Investor relations",
        "Technical documentation"
    ]
}}).
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    clean_text = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.text.strip())
    return clean_text
