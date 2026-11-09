from pydantic import ValidationError
from input_schema import Model1

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
    meeting = Model1(**sample_data)
    print("Valid")
    print(meeting)

except ValidationError as e:
    print("Some error Happened Please Check that")

