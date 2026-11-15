# Global AI Hackathon – Aven AI

The **Global AI Hackathon** is an innovation-driven hackathon focused on building practical, AI-powered solutions to real-world problems using modern AI technologies and tools.

Our team selected **Tavily – Pre-Meeting Briefing Agent (Problem Statement 2)** and developed **Aven AI**, an AI-powered meeting research and briefing agent designed to simplify meeting preparation.

Aven AI takes a company or individual's name and meeting context as input, researches relevant developments from the previous 30 days, and generates a concise, structured, and source-backed briefing. It gathers insights from multiple sources, identifies important announcements, business developments, leadership changes, and industry updates, helping users prepare for important discussions with reliable and relevant information.

**Our vision:** Transform time-consuming manual research into an intelligent, automated meeting-preparation experience through AI-powered research and contextual insights.

## ⚙️ Technical Approach

Aven AI follows a multi-stage AI research pipeline that transforms user-provided meeting context into a structured, evidence-backed briefing.

### 1. User Input & API Communication
- The user provides the company name, meeting date, and meeting query through the frontend.
- The frontend initiates the briefing generation process.
- The request is sent to the backend through a REST API endpoint (`POST /API/Brief/Generate`).

### 2. Meeting Context Extraction & Validation
- The backend uses Gemini to extract structured meeting information from the user's input.
- Key entities such as company name, meeting agenda, participants, and meeting date are identified.
- Pydantic schemas validate the extracted information to ensure structured and consistent input.

### 3. Intelligent Research Query Generation
- The validated meeting context is passed to the query-generation module.
- Gemini generates a structured research plan containing multiple targeted queries.
- These queries focus on relevant areas such as stakeholder activities, competitor developments, company strategy, and industry updates.

### 4. Web Research using Tavily
- The generated research queries are sent to the Tavily Search API.
- Tavily retrieves relevant information from multiple web sources.
- Search results are collected and passed to the backend for further processing.

### 5. Data Processing & AI Brief Generation
- Duplicate content is removed to avoid redundant information.
- Retrieved results are ranked according to their relevance scores.
- The top 8 relevant sources are selected and assigned unique evidence IDs.
- Gemini synthesizes the selected research into a structured briefing using the predefined `BriefContent` response schema.

### 6. Evidence Validation & Response Delivery
- The generated briefing is checked for valid evidence references.
- Invalid or dangling evidence IDs are filtered out.
- The backend returns the final briefing along with its associated sources in JSON format.
- The frontend renders the briefing into 11 structured sections, with citation tooltips and PDF export functionality.

**Outcome:** Aven AI converts complex web research into a concise, structured, and verifiable meeting briefing, helping users prepare for important discussions with relevant information and supporting evidence.

## 🛠️ Technology Stack

Aven AI is built using a modern full-stack architecture, combining a React-based frontend, a Python backend, and AI-powered research capabilities.

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | Building the interactive user interface |
| TypeScript | Type-safe development and structured data handling |
| Vite | Frontend development server and build tooling |
| React Router | Navigation between Home, Previous Briefs, and Settings |
| Lucide React | UI icons and visual elements |
| Custom CSS | Responsive dark glassmorphism UI and styling |
| Browser localStorage | Locally storing generated briefs and user settings |
| jsPDF | Exporting meeting briefings as PDF documents |

### Backend

| Technology | Purpose |
|---|---|
| Python 3.11 | Core backend development |
| FastAPI | REST API development and request handling |
| Uvicorn | Running the FastAPI application |
| Pydantic | Input validation and structured AI output validation |
| python-dotenv | Managing environment variables and API configurations |

### AI & Research Layer

| Technology | Purpose |
|---|---|
| Google Gemini API | Meeting context extraction, intelligent research query generation, and briefing synthesis |
| Tavily API | Web research and retrieval of relevant company, news, executive, and competitor information |

### Architecture Overview

**Frontend:** React 18 + TypeScript + Vite

**Backend:** Python 3.11 + FastAPI + Pydantic

**AI Engine:** Google Gemini API

**Research Engine:** Tavily API

**Report Generation:** jsPDF

**Data Storage:** Currently - Browser localStorage, Later - DataBase    




