from pydantic import ValidationError
from Data_Validation.input_schema import Model1
from Query_Generator.query_generator import generate_query

sample_data = {
    "company_name": "Microsoft",
    "agenda": "Discuss AI developments",
    "participants": ["CEO", "CTO", "Managers"]
}

try:
    # Step 1: Validate user input
    meeting = Model1(**sample_data)

    print("Input successfully validated!")

    # Step 2: Generate refined query using Gemini
    query = generate_query(meeting)

    print("\nGenerated Research Query:")
    print(query)

except ValidationError as e:
    print("Please correct your input:")
    print(e)

except Exception as e:
    print("Something went wrong:")
    print(e)
