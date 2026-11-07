import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_query(meeting):

    prompt = f"""
    You are an expert meeting research assistant.

    Your job is to convert meeting details into
    a detailed research query.

    Meeting Details:
    {meeting.model_dump(exclude_none=True)}

    Instructions:
    1. Understand the company and meeting agenda.
    2. Identify the important research areas.
    3. Consider the participants and their roles.
    4. Include relevant recent developments.
    5. Make the query specific and comprehensive.
    6. Do not invent missing meeting details.
    7. Return only the refined research query.
    """

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt
    )

    return response.text
