from pydantic import ValidationError
from input_Schema import Model1

sample_data = {
    "company_name": "",
    "agenda": "Discuss AI developments"
}

try:
    meeting = Model1(**sample_data)
    print("Valid")
    print(meeting)

except ValidationError as e:
    print("Some error Happened Please Check that")

