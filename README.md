# Global AI Hackathon – Aven AI

The **Global AI Hackathon** is an innovation-driven hackathon focused on building practical, AI-powered solutions to real-world problems using modern AI technologies and tools.

Our team selected **Tavily – Pre-Meeting Briefing Agent (Problem Statement 2)** and developed **Aven AI**, an AI-powered meeting research and briefing agent designed to simplify meeting preparation.

Aven AI takes a company or individual's name and meeting context as input, researches relevant developments from the previous 30 days, and generates a concise, structured, and source-backed briefing. It gathers insights from multiple sources, identifies important announcements, business developments, leadership changes, and industry updates, helping users prepare for important discussions with reliable and relevant information.

**Our vision:** Transform time-consuming manual research into an intelligent, automated meeting-preparation experience through AI-powered research and contextual insights.

## Project Structure

```text
Global-AI-Hackathon---Bifrost-and-/
│
├── Backend/
│   ├── api.py                         # Main FastAPI server and API routes
│   ├── testing_engine.py              # Main research and brief-generation pipeline
│   ├── requirements.txt               # Python dependencies
│   │
│   ├── Data_Validation/
│   │   ├── input_schema.py            # Pydantic models for meeting-input validation
│   │   └── input_validation.py        # Validation test/example
│   │
│   ├── Query_Generator/
│   │   ├── main.py                    # Coordinates validation and research-query generation
│   │   ├── language_to_json.py        # Gemini: user input → structured meeting data
│   │   └── query_generator.py         # Gemini: meeting data → research queries
│   │
│   └── Tavily_Engine/
│       ├── integrate_tavily_engine.py # Tavily research, competitor query, deduplication
│       └── brief_generate.py          # Gemini: sources → structured meeting brief
│
├── Front-End/
│   ├── package.json                   # Frontend dependencies and scripts
│   ├── vite.config.ts                 # Vite configuration
│   │
│   └── src/
│       ├── main.tsx                   # React application entry point
│       ├── App.tsx                    # Routes and app layout setup
│       ├── types.ts                   # Shared TypeScript data interfaces
│       ├── constants.ts               # UI section names, loading steps, example prompts
│       ├── styles.css                 # Application styling
│       │
│       ├── components/
│       │   ├── Layout.tsx             # Sidebar and top navigation
│       │   └── BriefResult.tsx        # Brief sections, evidence badges, source links
│       │
│       ├── pages/
│       │   ├── Home.tsx               # Meeting form and generated brief screen
│       │   ├── Briefs.tsx             # Previously saved briefs
│       │   └── Settings.tsx           # Display and saved-data settings
│       │
│       ├── context/
│       │   └── AppContext.tsx         # Global brief, settings, toast, and dialog state
│       │
│       ├── services/
│       │   └── briefService.ts        # Frontend API request to FastAPI backend
│       │
│       └── utils/
│           ├── storage.ts             # Browser localStorage helpers
│           └── pdf.ts                 # PDF meeting-brief export
│
├── .env                               # Gemini and Tavily API keys (not committed)
├── .gitignore
└── README.md
```

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

- **Frontend:** React 18 + TypeScript + Vite

- **Backend:** Python 3.11 + FastAPI + Pydantic

- **AI Engine:** Google Gemini API

- **Research Engine:** Tavily API

- **Report Generation:** jsPDF

**Data Storage:** Currently - Browser localStorage, Later - DataBase    

## 🚀 Getting Started

Follow the instructions below to set up and run **Aven AI** locally.

### Prerequisites

Make sure you have the following installed:

- Python 3.11 or later
- Node.js 18 or later
- npm (comes with Node.js)
- Google Gemini API Key
- Tavily API Key

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Global-AI-Hackathon---Bifrost-and-
```

### 2. Configure Environment Variables

Create a `.env` file in the project root directory and add your API credentials:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

**Optional: Frontend API Configuration**

If your backend runs on a port or host other than the default `8000`, create a `.env` file inside the `Front-End` directory:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run the Application

Choose the instructions for your operating system.

#### Windows

Open two separate PowerShell terminals.

**Terminal 1 – Backend Setup**

```powershell
cd Backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
python -m pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn api:app --reload --port 8000
```

*If PowerShell blocks virtual environment activation, run:*

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate the environment again.

**Terminal 2 – Frontend Setup**

```powershell
cd Front-End

# Install dependencies
npm install

# Start development server
npm run dev
```

#### macOS

Open two separate Terminal windows.

**Terminal 1 – Backend Setup**

```bash
cd Backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
python3 -m pip install -r requirements.txt

# Start FastAPI server
python3 -m uvicorn api:app --reload --port 8000
```

**Terminal 2 – Frontend Setup**

```bash
cd Front-End

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Aven AI

Once both servers are running, open the frontend in your browser:

**Frontend Application:** 

http://localhost:5173

**Backend API Documentation:**

http://localhost:8000/docs

### 5. Verify the Backend API

You can test the backend directly using the FastAPI Swagger documentation.

1. Open `http://localhost:8000/docs`.
2. Locate the `POST /API/Brief/Generate` endpoint.
3. Click **Try it out**.
4. Provide the required meeting details.
5. Execute the request to verify that the API generates a briefing successfully.

### ⚠️ Important Notes

- Each briefing generation involves multiple Gemini API calls and Tavily research requests.
- Gemini API quota errors may occur depending on your API usage limits. Wait for the quota to reset or use an API project with available quota.
- Research sources displayed in the UI are retrieved through Tavily and linked to the generated factual sections.
- Keep your API keys private. Never commit `.env` files or expose API credentials in your public repository.
- Ensure both backend and frontend servers are running simultaneously to use the application.




