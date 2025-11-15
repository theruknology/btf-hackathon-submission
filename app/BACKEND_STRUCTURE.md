"""CompliOps Backend - Project Structure Guide"""

# Project Structure

```
btf-hackathon-submission/
├── main.py                          # Main application entry point
├── app/
│   ├── __init__.py                  # Package initialization
│   ├── config.py                    # Configuration (env vars, LLM setup, mock data)
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py              # SQLAlchemy models (User, ComplianceAlert, GeneratedReport)
│   │   └── schemas.py               # Pydantic request/response models
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── watchtower.py            # Background scheduler & change detection logic
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   └── executor.py              # Crew.ai agent definitions & report generation
│   │
│   └── routes/
│       ├── __init__.py
│       ├── auth.py                  # Authentication endpoints
│       ├── alerts.py                # Alert management endpoints (Watchtower)
│       ├── reports.py               # Report generation endpoints (Executor)
│       └── chat.py                  # RAG chat endpoints (Reliable Chat)
```

## File Descriptions

### Core Entry Point
- **main.py**: FastAPI application initialization, CORS setup, route registration, lifecycle management

### Configuration (app/config.py)
- GEMINI_API_KEY environment variable loading
- LLM initialization (ChatGoogleGenerativeAI)
- Mock vector store for RAG

### Models (app/models/)
- **database.py**: SQLAlchemy ORM models
  - User (dummy)
  - ComplianceAlert (Watchtower results)
  - GeneratedReport (Executor output)
- **schemas.py**: Pydantic request/response models for API validation

### Services (app/services/)
- **watchtower.py**: Background scheduler for compliance change detection
  - APScheduler configuration
  - Mock/real analysis logic
  - Database persistence

### Agents (app/agents/)
- **executor.py**: Crew.ai agent definitions
  - ComplianceAnalystAgent
  - CompanyDataFetcherAgent
  - ReportWriterAgent
  - Mock report generation

### Routes (app/routes/)
Modular endpoint definitions by feature:
- **auth.py**: POST /api/v1/login (dummy authentication)
- **alerts.py**: GET /api/v1/alerts, GET /api/v1/alerts/{id} (Watchtower)
- **reports.py**: POST /api/v1/reports/generate, GET /api/v1/reports, GET /api/v1/reports/{id} (Executor)
- **chat.py**: POST /api/v1/chat (Reliable Chat - RAG)

## Key Features

### 1. Watchtower (Change Detection)
- Runs every 2 minutes via APScheduler
- Simulates scraping with even/odd minute toggling
- Real Gemini analysis or realistic mock fallback
- Saves alerts to SQLite database

### 2. Executor (Report Generation)
- Triggered via POST /api/v1/reports/generate
- Uses crew.ai agents for analysis and report writing
- Background task execution
- Mock Markdown reports when API unavailable

### 3. Reliable Chat (RAG)
- POST /api/v1/chat endpoint
- Mock vector store with compliance topics
- Real Gemini-powered answers or mock responses
- Source attribution for all responses

## Running the Application

### Installation
```bash
pip install fastapi uvicorn sqlalchemy apscheduler google-generativeai crew-ai langchain-google-genai
```

### Configuration
Set the Gemini API key:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

### Starting the Server
```bash
python main.py
```

Server runs on `http://0.0.0.0:8000`

### Access Points
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Health Check**: http://localhost:8000/health
- **Root**: http://localhost:8000/

## Mock Mode
The application gracefully runs without `GEMINI_API_KEY`:
- No API calls attempted
- Realistic hardcoded responses
- Full functionality maintained
- Perfect for development and testing

## API Endpoints

### Authentication
- `POST /api/v1/login` - Dummy login (accepts any email/password)

### Alerts (Watchtower)
- `GET /api/v1/alerts` - List all alerts
- `GET /api/v1/alerts/{alert_id}` - Get specific alert

### Reports (Executor)
- `POST /api/v1/reports/generate?alert_id=1` - Generate report
- `GET /api/v1/reports` - List all reports
- `GET /api/v1/reports/{report_id}` - Get specific report

### Chat (Reliable Chat)
- `POST /api/v1/chat` - Submit compliance question

### System
- `GET /health` - Health check with mode info
- `GET /` - API root information

## Development Notes

### Adding New Endpoints
1. Create new route file in `app/routes/`
2. Define router with prefix and tags
3. Import and register in `main.py` via `app.include_router()`

### Extending Services
- Add new service files in `app/services/`
- Import and initialize in lifecycle if background tasks needed
- Export functions in `__init__.py`

### Adding Database Models
- Define model in `app/models/database.py`
- Create Pydantic schema in `app/models/schemas.py`
- Models auto-create on application startup
