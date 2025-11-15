# CompliOps - Complete Documentation Index

Welcome to CompliOps! This guide will help you understand every aspect of the application.

## 📚 Documentation Files Overview

### 1. **README.md** - Quick Start
- Installation instructions
- How to run the server
- Basic API examples
- Health check verification

### 2. **BACKEND_STRUCTURE.md** - Code Organization
- Project directory structure
- Module responsibilities
- File descriptions
- Development guidelines

### 3. **APP_FLOW.md** - User Journeys & Sign-Up
**Read this to understand:**
- ✅ Complete user onboarding process
- ✅ Sign-up and login flow
- ✅ All three main dashboard sections
- ✅ Step-by-step user journeys
- ✅ Data collection process
- ✅ Frontend & backend state management
- ✅ Complete session timeline

### 4. **DOCUMENTATION.md** - Complete Technical Guide
**Read this for:**
- 📊 System architecture overview
- 🔄 Three core features (Watchtower, Executor, Reliable Chat)
- 📝 Detailed data flow & processing
- 🔌 Full API documentation with examples
- 🎯 Mermaid workflow diagrams
- 💾 Database schema
- ❌ Error handling & fallbacks

### 5. **MAIN.py** - Application Entry Point
- FastAPI initialization
- Route registration
- Lifecycle management
- Server startup

---

## 🗺️ Quick Navigation

### I want to understand...

**The User Experience**
→ Read: `APP_FLOW.md` - User Onboarding & Sign-Up sections

**How to Run the App**
→ Read: `README.md` or `BACKEND_STRUCTURE.md` - Running section

**The Complete System**
→ Read: `DOCUMENTATION.md` - System Architecture & Workflows

**Code Organization**
→ Read: `BACKEND_STRUCTURE.md` - Project Structure

**API Endpoints**
→ Read: `DOCUMENTATION.md` - API Documentation section

**Data Processing**
→ Read: `DOCUMENTATION.md` - Data Flow section or `APP_FLOW.md` - Data Collection

**Workflows & Diagrams**
→ Read: `DOCUMENTATION.md` - Workflow Diagrams (with Mermaid)

**Error Handling**
→ Read: `DOCUMENTATION.md` - Error Handling & Fallbacks

---

## 🎯 Three Core Features at a Glance

### 1️⃣ WATCHTOWER - Automated Change Detection
```
What: Monitors for compliance changes
When: Every 2 minutes automatically
How: Simulates web scraping + Gemini analysis
Output: ComplianceAlert records
Data: Stored in SQLite, displayed in dashboard
```

### 2️⃣ EXECUTOR - AI Report Generation
```
What: Generates detailed compliance reports
When: User clicks "Generate Report" on an alert
How: crew.ai orchestrates 3 AI agents
Output: Markdown formatted report
Data: Stored in database, retrievable via API
```

### 3️⃣ RELIABLE CHAT - RAG Q&A
```
What: Answers compliance questions
When: User types and sends a question
How: Vector store search + Gemini RAG
Output: Answer with source attribution
Data: Not persisted (real-time)
```

---

## 📊 Architecture Overview

```
┌─────────────────┐
│   Frontend      │ (Next.js)
│   (Dashboard)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌──────────────────────────────┐
│  FastAPI Backend             │
│  ──────────────────────────  │
│  • Watchtower (Alerts)       │
│  • Executor (Reports)        │
│  • Reliable Chat (Q&A)       │
│  • Auth (Dummy)              │
└────────┬─────────────────────┘
         │
         ├─────────────────┬──────────────┬──────────────┐
         ▼                 ▼              ▼              ▼
    ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  SQLite    │  │  Gemini  │  │ Vector   │  │ Schedule │
    │  Database  │  │   API    │  │  Store   │  │   Task   │
    │            │  │          │  │          │  │          │
    │ • Users    │  │ • LLM    │  │ • BNPL   │  │ • 2min   │
    │ • Alerts   │  │ • Analysis│ │ • KYC    │  │ • Check  │
    │ • Reports  │  │          │  │ • AML    │  │          │
    └────────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## 🔄 Data Flow Summary

### Watchtower Data Flow
```
Change Detected → Gemini Analysis → ComplianceAlert → Database → Dashboard
```

### Executor Data Flow
```
User Click → Generate Report → crew.ai (3 agents) → GeneratedReport → Display
```

### Chat Data Flow
```
User Query → Vector Search → RAG Prompt → Gemini → Answer → Display
```

---

## 🔑 Key Features

### ✅ Fully Functional Without API Keys
- App runs perfectly in mock mode
- Realistic hardcoded responses
- No crashes or missing features
- Great for development & testing

### ✅ Three Independent Features
- **Watchtower**: Background monitoring
- **Executor**: On-demand AI analysis
- **Reliable Chat**: Instant Q&A

### ✅ Modular Architecture
- `app/models/` - Database & API schemas
- `app/routes/` - Endpoint definitions
- `app/services/` - Business logic
- `app/agents/` - AI agents
- `app/config.py` - Configuration

### ✅ Robust Error Handling
- Database transaction safety
- API fallback to mock
- Schema validation on all inputs
- Comprehensive logging

### ✅ Production Ready
- CORS configured for frontend
- Pydantic validation
- SQLAlchemy ORM
- APScheduler background tasks

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install fastapi uvicorn sqlalchemy apscheduler google-generativeai crew-ai langchain-google-genai
```

### 2. Optional: Set API Key
```bash
export GEMINI_API_KEY="your-api-key-here"
# Skip this to run in mock mode
```

### 3. Start Server
```bash
python main.py
```

### 4. Access Points
- **API Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health
- **Frontend**: http://localhost:3000 (separate Next.js app)

---

## 📋 API Endpoints Summary

### Authentication
- `POST /api/v1/login` - Login (accepts any email/password)

### Alerts (Watchtower)
- `GET /api/v1/alerts` - List all alerts
- `GET /api/v1/alerts/{alert_id}` - Get specific alert

### Reports (Executor)
- `POST /api/v1/reports/generate?alert_id=X` - Generate report
- `GET /api/v1/reports` - List all reports
- `GET /api/v1/reports/{report_id}` - Get specific report

### Chat (Reliable Chat)
- `POST /api/v1/chat` - Ask compliance question

### System
- `GET /health` - Health check
- `GET /` - Root info

---

## 💾 Database Tables

### Users
- `id` (primary key)
- `email` (unique)
- `password_hash`
- `created_at`

### ComplianceAlerts
- `id` (primary key)
- `source` (e.g., "watchtower")
- `summary` (alert text)
- `impact_json` (analysis data)
- `action_required` (boolean)
- `created_at`

### GeneratedReports
- `id` (primary key)
- `alert_id` (foreign key)
- `status` ("in_progress", "completed", "failed")
- `title`
- `content_markdown` (full report text)
- `created_at`

---

## 🔍 Understanding the Features

### Watchtower Details
**Location**: `app/services/watchtower.py`
**Trigger**: Automatic every 2 minutes
**Process**: 
1. Simulates web scrape
2. Detects changes via even/odd minute
3. Calls Gemini API for analysis
4. Saves to database
5. Frontend polls for new alerts

**API Response**:
```json
{
  "id": 1,
  "source": "watchtower",
  "summary": "SAMA updated guidelines...",
  "impact_json": {
    "impact": "High",
    "actions": ["Review docs", "Update policies"]
  },
  "action_required": true,
  "created_at": "2025-11-15T10:30:00"
}
```

### Executor Details
**Location**: `app/routes/reports.py`, `app/agents/executor.py`
**Trigger**: User clicks "Generate Report"
**Process**:
1. Create report in "in_progress" state
2. Background task initializes crew.ai
3. Three agents work in sequence
4. Report content generated
5. Database updated
6. Frontend polls and displays

**Report Status Lifecycle**:
```
Request → in_progress → completed/failed
  ↓         ↓              ↓
Created  Processing      Ready
```

### Reliable Chat Details
**Location**: `app/routes/chat.py`
**Trigger**: User submits query
**Process**:
1. Search vector store for context
2. Build RAG prompt with context
3. Call Gemini API
4. Return answer with source

**Response Format**:
```json
{
  "answer": "Full answer text from LLM...",
  "source": "Compliance DB (Key: kyc)"
}
```

---

## 🎓 Learning Path

### For Frontend Developers
1. Read `APP_FLOW.md` - User flows section
2. Read `DOCUMENTATION.md` - API Documentation
3. Test endpoints in `/docs` (Swagger UI)
4. Understand polling patterns for reports

### For Backend Developers
1. Read `BACKEND_STRUCTURE.md` - Project structure
2. Read `DOCUMENTATION.md` - Complete guide
3. Review `app/` module organization
4. Study error handling patterns

### For Product Managers
1. Read `APP_FLOW.md` - Complete user journey
2. Review feature descriptions above
3. Check `DOCUMENTATION.md` - Workflow diagrams
4. Understand mock fallback strategy

### For DevOps/Deployment
1. Check dependencies in main.py
2. Review `app/config.py` - Environment variables
3. Database: SQLite (embedded)
4. Scheduler: APScheduler (in-process)
5. Environment: `export GEMINI_API_KEY="..."`

---

## ❓ FAQ

**Q: Do I need a Gemini API key?**
A: No! The app works perfectly in mock mode without it. Set the key to enable real AI features.

**Q: How often does Watchtower check?**
A: Every 2 minutes automatically in the background.

**Q: How long does report generation take?**
A: Typically 20-30 seconds, depends on crew.ai agent processing.

**Q: Is chat response persisted?**
A: No, chat is real-time only. But you can implement persistence in the frontend.

**Q: Can I add more alerts manually?**
A: Yes, they're stored in SQLite. You can insert them directly or via an admin API.

**Q: What's the difference between mock and real mode?**
A: Real mode uses Gemini API for actual analysis. Mock mode returns hardcoded but realistic responses.

---

## 🔗 File Quick Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| `APP_FLOW.md` | User journeys & sign-up | 15 min |
| `DOCUMENTATION.md` | Complete technical guide | 25 min |
| `BACKEND_STRUCTURE.md` | Code organization | 10 min |
| `main.py` | Entry point & server | 5 min |

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Understand the complete user flow
- ✅ Know how data moves through the system
- ✅ Run and deploy the application
- ✅ Develop frontend integrations
- ✅ Extend with new features

Pick a document based on your role and dive in!

