from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("TAVILY_API_KEY")

tavily_client = TavilyClient(api_key=api_key)

def remove_duplicate_content(results):
    seen_content = set()
    cleaned_results = []

    for item in results:
        content = item.get("content", "")

        # Normalize case and extra spaces for duplicate checking
        normalized_content = " ".join(content.lower().split())

        if normalized_content and normalized_content not in seen_content:
            seen_content.add(normalized_content)

            cleaned_results.append({
                "url": item.get("url"),
                "title": item.get("title"),
                "content": item.get("content"),
                "score": item.get("score"),
                "raw_content": item.get("raw_content")
            })
    return cleaned_results

def receive_researched_data(whole_query):
    queries = whole_query["research_queries"]
    main_l = []
    for i in queries:
        new_query = i["query"]        # Query is stored
        response = tavily_client.search(new_query)
        main_l.append(response['results'])
        print(response['results'])
        print("\n\n\n")
