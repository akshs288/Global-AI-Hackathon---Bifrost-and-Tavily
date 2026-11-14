from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

api_key = os.getenv("TAVILY_API_KEY")
if api_key:
    api_key = api_key.strip('"\' ')

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
    queries = whole_query.get("research_queries") or whole_query.get("queries") or []
    main_l = []

    for i in queries:
        new_query = i.get("query") if isinstance(i, dict) else str(i)
        if new_query:
            try:
                response = tavily_client.search(new_query)
                main_l.extend(response.get("results", []))
            except Exception as e:
                print(f"Tavily search warning for query '{new_query}': {e}")

    # Fallback if no results found
    if not main_l and "company" in whole_query:
        try:
            fallback_res = tavily_client.search(f"{whole_query['company']} recent news overview")
            main_l.extend(fallback_res.get("results", []))
        except Exception as e:
            print(f"Tavily fallback search failed: {e}")

    return main_l