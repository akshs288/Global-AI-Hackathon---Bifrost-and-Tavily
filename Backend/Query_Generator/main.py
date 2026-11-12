from pydantic import ValidationError
from Data_Validation.input_schema import Model1
from Query_Generator.query_generator import generate_query
import json
from Query_Generator.language_to_json import generate_json_data

main_query = ""
with open("D:\All Coding files\Global-AI-Hackathon---Bifrost-and-\Backend\Query_Generator\first_input_json.json") as f:
    data = json.dumps(f)
    main_query = f"Company name = {data[0]["Company"]}, Meeting Date = {data[0]['Date']}, Query = {data[0]['Query']}"

query = main_query
sample_data = generate_json_data(query)

try:
    # Step 1: Validate user input
    meeting = Model1(**sample_data)

    print("Input successfully validated!")

    # Step 2: Generate refined query using Gemini
    
    def main_query(meeting):
        query = generate_query(meeting)
        data_json = json.loads(query)         # Convert Json into Python Dictionary

        return data_json

except ValidationError as e:
    print("Please correct your input:")
    print(e)

except Exception as e:
    print("Something went wrong:")
    print(e)
