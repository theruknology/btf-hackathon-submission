# CompliSense - Compliance Automation Platform

> **AI-powered compliance monitoring, automated reporting, and intelligent Q&A for enterprises**

CompliSense is a full-stack compliance automation platform combining **real-time monitoring**, **AI-driven report generation**, and **intelligent compliance guidance** to help organizations stay compliant with minimal manual effort.

---

## ✨ Key Features

### 🔔 **Watchtower** - Automated Compliance Monitoring
Real-time detection and alerting for regulatory changes
- Continuous monitoring on 2-minute intervals
- Automatic alert generation for compliance issues
- Categorized alerts (SOC 2, GDPR, HIPAA, ISO 27001)
- Alert history and tracking

### 📊 **Executor** - AI-Powered Report Generation
Generate compliance reports automatically using AI agents
- Multi-agent crew (ComplianceAnalyst, DataFetcher, ReportWriter)
- Structured report generation with findings and recommendations
- Background processing with real-time status updates
- Ready-to-export compliance documentation

### 💬 **Reliable Chat** - Compliance Q&A
RAG-based AI chatbot for instant compliance guidance
- Knowledge base search with context
- Gemini-powered responses
- Source attribution
- Mock vector store with 4 compliance topics

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  Dashboard • Alerts • Reports • Chat Interface              │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API (JSON)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                        │
├─────────────────────────────────────────────────────────────┤
│ Routes              │ Services           │ Agents            │
│ ├─ auth.py         │ ├─ watchtower.py  │ └─ executor.py    │
│ ├─ alerts.py       │ └─ scheduler       │                   │
│ ├─ reports.py      │                    │                   │
│ └─ chat.py         │                    │                   │
│                    │                    │                   │
│ Models             │ External Services                      │
│ ├─ database.py    │ ├─ Google Gemini (LLM)                 │
│ └─ schemas.py     │ └─ crew.ai agents                      │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │  SQLite Database     │
         │  - Users             │
         │  - Alerts            │
         │  - Reports           │
         └──────────────────────┘
```

---

## 📂 Project Structure

```
btf-hackathon-submission/
├── 📁 app/                          # Backend application
│   ├── 📄 __init__.py
│   ├── 📄 config.py                 # Configuration & LLM setup
│   ├── 📁 models/
│   │   ├── database.py              # SQLAlchemy ORM models
│   │   └── schemas.py               # Pydantic validation
│   ├── 📁 services/
│   │   └── watchtower.py            # Scheduler & monitoring
│   ├── 📁 agents/
│   │   └── executor.py              # crew.ai agent definitions
│   └── 📁 routes/
│       ├── auth.py                  # Login endpoint
│       ├── alerts.py                # Alert endpoints
│       ├── reports.py               # Report generation
│       └── chat.py                  # Chat endpoint
│
├── 📁 frontend/                     # Next.js frontend
│   └── 📁 v0-compli-sense-app-build/
│       ├── app/                     # Next.js App Router
│       ├── components/              # React components
│       ├── hooks/                   # Custom React hooks
│       ├── lib/                     # Utilities & helpers
│       ├── styles/                  # CSS/Tailwind
│       ├── public/                  # Static assets
│       ├── package.json
│       └── tsconfig.json
│
├── 📄 main.py                       # Application entry point
├── 📄 README.md                     # This file
├── 📄 DOCUMENTATION.md              # Technical deep dive
├── 📄 START_HERE.md                 # Quick navigation guide
└── 📄 BACKEND_STRUCTURE.md          # Code organization details
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- pip & npm/pnpm

### Backend Setup

1. **Clone & navigate to project:**
```bash
cd /path/to/btf-hackathon-submission
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install fastapi uvicorn sqlalchemy pydantic crew-ai langchain-google-genai python-dotenv apscheduler
```

4. **Set up environment variables (optional):**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

5. **Run backend server:**
```bash
python main.py
```

Backend runs at `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs` (Swagger UI)

---

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend/v0-compli-sense-app-build
```

2. **Install dependencies:**
```bash
pnpm install  # or npm install
```

3. **Run development server:**
```bash
pnpm dev  # or npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/login` | User login (returns JWT token) |

### Alerts (Watchtower)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/alerts` | List all compliance alerts |
| GET | `/api/v1/alerts/{id}` | Get alert details |

### Reports (Executor)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/reports/generate` | Generate new report |
| GET | `/api/v1/reports` | List all reports |
| GET | `/api/v1/reports/{id}` | Get report details |

### Chat (Reliable Chat)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat` | Ask compliance question |

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### ComplianceAlerts Table
```sql
CREATE TABLE compliance_alerts (
    id INTEGER PRIMARY KEY,
    alert_type VARCHAR NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### GeneratedReports Table
```sql
CREATE TABLE generated_reports (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT,
    status VARCHAR DEFAULT 'in_progress',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔑 Environment Variables

```env
# Optional: Google Gemini API Key for LLM features
GEMINI_API_KEY=your_api_key_here
```

**Note:** The application works with graceful degradation. If `GEMINI_API_KEY` is not set, mock responses are used for all AI features.

---

## 🔄 Core Workflows

### User Sign-Up & Authentication
```
1. User opens frontend
2. Enters email & password
3. Frontend: POST /api/v1/login
4. Backend: Returns JWT token
5. Frontend: Stores token in localStorage
6. User: Redirected to dashboard
```

### Alert Generation (Watchtower)
```
1. Backend scheduler runs every 2 minutes
2. Checks for regulatory changes
3. Generates ComplianceAlert records
4. Frontend polls GET /api/v1/alerts
5. New alerts appear on dashboard
```

### Report Generation (Executor)
```
1. User selects alert → clicks "Generate Report"
2. Frontend: POST /api/v1/reports/generate?alert_id=X
3. Backend: Creates report (status: in_progress)
4. Background task: Crew agents analyze
5. Frontend: Polls GET /api/v1/reports/{id}
6. Report complete → displayed on dashboard
```

### Chat Interaction (Reliable Chat)
```
1. User types compliance question
2. Frontend: POST /api/v1/chat
3. Backend: Searches vector store
4. Gemini: Generates answer
5. Frontend: Displays with source attribution
```

---

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI (Python web framework)
- **Server:** Uvicorn (ASGI server)
- **Database:** SQLite with SQLAlchemy ORM
- **AI/ML:** Google Gemini API, crew.ai agents
- **Task Scheduling:** APScheduler
- **Validation:** Pydantic models
- **Async:** asyncio, asynccontextmanager

### Frontend
- **Framework:** Next.js 14+ (React meta-framework)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom React components
- **HTTP Client:** Fetch API
- **State Management:** React hooks

### Infrastructure
- **Containerization:** Docker (ready for deployment)
- **API Format:** REST with JSON
- **Authentication:** JWT tokens
- **CORS:** Enabled for cross-origin requests

---

## 🧪 Testing & Running

### Run Backend in Development
```bash
python main.py
# Starts on http://localhost:8000
# Watchtower scheduler: active (2-minute intervals)
# Auto-reload: available with reload flag
```

### Run Frontend in Development
```bash
cd frontend/v0-compli-sense-app-build
pnpm dev
# Starts on http://localhost:3000
# Hot reload: enabled
```

### Access API Documentation
```
http://localhost:8000/docs          # Swagger UI (interactive)
http://localhost:8000/redoc         # ReDoc (alternative)
```

### Test API Endpoints
```bash
# Login
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get alerts
curl http://localhost:8000/api/v1/alerts

# Generate report
curl -X POST http://localhost:8000/api/v1/reports/generate?alert_id=1

# Chat
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is SOC 2 compliance?"}'
```

---

## 📋 Key Implementation Details

### Graceful Degradation
- **With API Key:** Full AI-powered features using Google Gemini
- **Without API Key:** Mock responses for all AI features
- **No Crashes:** Application runs smoothly in both modes

### Mock Features
- Mock Watchtower alerts (4 compliance topics)
- Mock vector store (4 compliance documents)
- Mock crew.ai agent responses
- Mock user authentication (no database validation)

### Real Features
- SQLite database creation & management
- APScheduler for background tasks
- FastAPI routing & middleware
- Pydantic model validation
- REST API with standard status codes

---

## 📚 Documentation

Comprehensive documentation is included:

| Document | Purpose |
|----------|---------|
| **README.md** (this file) | Project overview, setup, API reference |
| **DOCUMENTATION.md** | Technical deep dive, workflows, diagrams |
| **START_HERE.md** | Navigation guide, reading recommendations |
| **BACKEND_STRUCTURE.md** | Code organization, file-by-file breakdown |

---

## 🎯 Features by Module

### `app/routes/auth.py`
- POST `/api/v1/login` - User authentication
- Returns JWT token for session management

### `app/routes/alerts.py`
- GET `/api/v1/alerts` - List all alerts with pagination
- GET `/api/v1/alerts/{id}` - Get single alert details
- Integration with Watchtower service

### `app/routes/reports.py`
- POST `/api/v1/reports/generate` - Trigger report generation
- GET `/api/v1/reports` - List all generated reports
- GET `/api/v1/reports/{id}` - View report content
- Background task execution via crew.ai

### `app/routes/chat.py`
- POST `/api/v1/chat` - Send compliance question
- Vector store search with context matching
- Gemini LLM integration for responses

### `app/services/watchtower.py`
- APScheduler integration (2-minute intervals)
- Alert generation logic
- Database persistence

### `app/agents/executor.py`
- Crew.ai agent definitions
- Multi-agent report generation
- Mock report fallback

---

## ✅ What's Working

- ✅ User authentication via mock JWT
- ✅ Watchtower scheduler (2-minute intervals)
- ✅ Alert CRUD operations
- ✅ Report generation (async background tasks)
- ✅ Chat with context search
- ✅ SQLite database auto-creation
- ✅ CORS configuration for frontend
- ✅ Graceful API key degradation
- ✅ Pydantic validation
- ✅ Swagger/ReDoc documentation

---

## 🔮 Future Enhancements

- Real database validation for users
- Enhanced vector store with actual compliance documents
- Email notifications for alerts
- Report export (PDF, CSV)
- Advanced analytics dashboard
- Multi-tenant support
- Compliance rule customization
- Integration with external APIs (regulations.gov, etc.)

---

## 📝 License

This project is part of BTF Hackathon Submission 2025.

---

## 🤝 Support

For questions about:
- **Architecture** → See `DOCUMENTATION.md`
- **User Flows** → See `APP_FLOW.md`
- **Code Structure** → See `BACKEND_STRUCTURE.md`
- **Getting Started** → See `START_HERE.md`

---

**Ready to get started?** Run `python main.py` and visit `http://localhost:8000/docs` 🚀
