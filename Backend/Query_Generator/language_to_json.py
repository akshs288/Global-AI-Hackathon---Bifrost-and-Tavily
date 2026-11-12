import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_json_data(query):

    prompt = f"""
    You are an expert meeting information extraction assistant.

    Your task is to convert the user's natural-language meeting
    request into structured JSON according to the provided schema.

    USER QUERY:
    {query}

    REQUIRED JSON STRUCTURE:
    {{
        "company_name": "string",
        "agenda": "string",
        "participants": ["string"],
        "meeting_date": "date in YYYY-MM-DD format or null",
        "meeting_type": "string or null",
        "expected_duration_minutes": "integer or null",
        "location": "string or null"
    }}

    EXTRACTION RULES:

    1. company_name:
       - Extract the organization/company involved in the meeting.
       - This field is mandatory.

    2. agenda:
       - Identify the primary purpose and topics of the meeting.
       - Preserve the user's original intent.
       - This field is mandatory.

    3. participants:
       - Extract explicitly mentioned meeting participants.
       - Include their roles or designations where available.
       - Return an empty list if no participants are mentioned.
       - Do not assume that a company's CEO is attending just because
         the user mentions the company.

    4. meeting_date:
      - Extract the meeting date if explicitly provided.
      - Return it in YYYY-MM-DD format.
      - If no date is specified or it is ambiguous, return null.

    5. meeting_type:
       - Identify the meeting type if it can reasonably be determined
         from the user's query.
       - Examples: partnership, technical, strategic, interview,
         business, review, or discussion.
       - Return null if it cannot be determined.

    6. expected_duration_minutes:
       - Extract the expected meeting duration in integer minutes.
       - Convert hours into minutes when necessary.
       - Return null if not specified.

    7. location:
       - Extract the meeting location if mentioned.
       - Return null if not specified.

    IMPORTANT RULES:
    - Never fabricate or assume missing information.
    - Use null for missing optional fields.
    - Never return explanations, Markdown, or additional text.
    - Return only valid JSON.
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text

