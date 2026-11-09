from pydantic import ValidationError
from Data_Validation.input_schema import Model1
from Query_Generator.query_generator import generate_query
import json

sample_data = {
    "company_name": "Microsoft",
    "agenda": "Discuss AI infrastructure and future partnerships",
    "participants": ["CEO", "CTO", "VP of Engineering"],
    "meeting_datetime": "2026-11-10T15:30:00",
    "meeting_type": "partnership",
    "expected_duration_minutes": 60,
    "location": "New York"
}

try:
    # Step 1: Validate user input
    meeting = Model1(**sample_data)

    print("Input successfully validated!")

    # Step 2: Generate refined query using Gemini
    query = generate_query(meeting)
    data_json = json.loads(query)         # Convert Json into Python Dictionary

    print("\nGenerated Research Query:")
    print(data_json)

except ValidationError as e:
    print("Please correct your input:")
    print(e)

except Exception as e:
    print("Something went wrong:")
    print(e)
