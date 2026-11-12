
import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

start = time.perf_counter()

try:
    print("Sending request to Gemini...")

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Return only the word SUCCESS."
    )

    print("Response:", response.text)
    print(f"Time: {time.perf_counter() - start:.2f} seconds")

except Exception as e:
    print("Gemini request failed:", repr(e))
    print(f"Time: {time.perf_counter() - start:.2f} seconds")
