from pydantic import ValidationError
from Data_Validation.input_schema import Model1
from Query_Generator.query_generator import generate_query
import json
from Query_Generator.language_to_json import generate_json_data
from Tavily_Engine.integrate_tavily_engine import receive_researched_data
from Tavily_Engine.integrate_tavily_engine import remove_duplicate_content

with open("D:\\All Coding files\\Global-AI-Hackathon---Bifrost-and-\\Backend\\Query_Generator\\first_input_json.json") as f:
    data = json.load(f)
    final_query = f"Company name = {data[0]['Company']}, Meeting Date = {data[0]['Date']}, Query = {data[0]['Query']}"

query = final_query
try:
    # Step 1: Generate refined query using Gemini
    def main_query(meeting):
        query = generate_query(meeting)       # Generated the main query through which tavily will use that query to show fetch the info.
        
        data_json = json.loads(query)         # Convert Json into Python Dictionary
        return data_json

    data_for_pydantic = generate_json_data(query)    # This function is to generate the query for pydantic model. 
    # Step 2: Validate user input
    data_obj = json.loads(data_for_pydantic)
    meeting = Model1(**data_obj)
    print("Input successfully validated!")


    gemini_query = main_query(meeting=meeting)
    tavily_researched_data = receive_researched_data(gemini_query)
    raw_data_meeting = remove_duplicate_content(tavily_researched_data)         # This will return list of Dictionary

    meeting_brief = 


except ValidationError as e:
    print("Please correct your input:")
    print(e)

except Exception as e:
    print("Something went wrong:")
    print(e)
