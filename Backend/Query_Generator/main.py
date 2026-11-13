#  py -m Query_Generator.main 

from pydantic import ValidationError
from Data_Validation.input_schema import Model1
from Query_Generator.query_generator import generate_query
import json
from Query_Generator.language_to_json import generate_json_data
from Tavily_Engine.integrate_tavily_engine import receive_researched_data

def Query(company, date, quer):
    final_query = f"Company name = {company}, Meeting Date = {date}, Query = {quer}"
    
    try:
        sample_data = generate_json_data(final_query)    # This function is to generate the query for pydantic model. 
        # Step 1: Validate user input
        sample_data = json.loads(sample_data)
        meeting = Model1(**sample_data)
        print("Input successfully validated!")

        # Step 2: Generate refined query using Gemini
        def main_query(meeting):
            query = generate_query(meeting)       # Generated the main query through which tavily will use that query to show fetch the info.
            
            data_json = json.loads(query)         # Convert Json into Python Dictionary
            return data_json

        gemini_query = main_query(meeting=meeting)
        tavily_researched_data = receive_researched_data(gemini_query)
        return tavily_researched_data

    except ValidationError as e:
        print("Please correct your input:")
        print(e)

    except Exception as e:
        print("Something went wrong:")
        print(e)
