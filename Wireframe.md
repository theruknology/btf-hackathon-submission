# CompliSense - User Flow & Sign-Up Process

## Table of Contents

1. [User Onboarding Flow](#user-onboarding-flow)
2. [Main Dashboard Flows](#main-dashboard-flows)
3. [Feature-Specific User Journeys](#feature-specific-user-journeys)
4. [Data Collection & Processing](#data-collection--processing)
5. [State Management](#state-management)

---

## User Onboarding Flow

### Phase 1: Landing & Authentication

```
┌──────────────────────────────────────────────────────────────────┐
│                    COMPLISENSE LANDING PAGE                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Welcome to CompliOps                                   │  │
│  │  AI-Powered Compliance Automation                       │  │
│  │                                                          │  │
│  │  [Sign Up Button]       [Login Button]                  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
    ┌─────────────┐                    ┌─────────────┐
    │  Sign Up    │                    │   Login     │
    │   Modal     │                    │   Modal     │
    └─────────────┘                    └─────────────┘
         │                                    │
         ▼                                    ▼
    Enter Email,                         Enter Email,
    Password                             Password
         │                                    │
         ▼                                    ▼
    ┌──────────────────────────────────────────────┐
    │ Frontend Sends POST /api/v1/login            │
    │ (Same endpoint for sign-up & login)          │
    │ {                                            │
    │   "email": "user@company.com",               │
    │   "password": "any_password_123"             │
    │ }                                            │
    └──────────────────────────────────────────────┘
         │
         ▼
    Backend Processing:
    ├─ Validates request schema (Pydantic)
    ├─ Generates mock JWT token
    ├─ Returns token in response
    └─ (No real DB lookup - dummy auth)
         │
         ▼
    ┌──────────────────────────────────────────────┐
    │ Frontend Receives Response:                  │
    │ {                                            │
    │   "access_token": "mock_jwt_token_...",      │
    │   "token_type": "bearer"                     │
    │ }                                            │
    └──────────────────────────────────────────────┘
         │
         ▼
    Frontend Actions:
    ├─ Save token to localStorage:
    │  localStorage.setItem("token", token)
    │
    ├─ Set Authorization header:
    │  headers["Authorization"] = `Bearer ${token}`
    │
    └─ Redirect to /dashboard
         │
         ▼
    ┌──────────────────────────────────────────────┐
    │         DASHBOARD LOADED                     │
    └──────────────────────────────────────────────┘
```

### Phase 2: First-Time Setup

```
┌──────────────────────────────────────────────────────────────────┐
│                       DASHBOARD LOAD                             │
└──────────────────────────────────────────────────────────────────┘
         │
         ├─ Check token in localStorage
         │
         ├─ GET /health (verify backend is running)
         │
         └─ GET /api/v1/alerts?skip=0&limit=10
                  (initial load of alerts)
         │
         ▼
    ┌──────────────────────────────────────────────┐
    │      EMPTY STATE (First Login)               │
    │                                              │
    │  "No alerts yet"                             │
    │  "Watchtower will start monitoring..."       │
    │                                              │
    │  Three sections visible:                     │
    │  1. Alerts (Watchtower)     - Empty          │
    │  2. Reports (Executor)      - Empty          │
    │  3. Chat (Reliable Chat)    - Ready          │
    │                                              │
    │  [Try Chat]  [Read Docs]  [Settings]         │
    │                                              │
    └──────────────────────────────────────────────┘
```

---

## Main Dashboard Flows

### Flow 1: Viewing Alerts (Watchtower)

```
User Journey:
1. User sees dashboard
2. Watchtower has detected alerts (every 2 minutes)
3. User wants to see compliance alerts

Frontend Flow:
┌─────────────────────────────────────────────────────────────┐
│ Dashboard Component Mounts                                  │
│                                                             │
│ useEffect(() => {                                           │
│   // Poll for alerts every 30 seconds                       │
│   const interval = setInterval(() => {                      │
│     fetch('/api/v1/alerts?skip=0&limit=10', {             │
│       headers: {                                            │
│         'Authorization': `Bearer ${token}`                  │
│       }                                                     │
│     })                                                      │
│     .then(res => res.json())                               │
│     .then(data => setAlerts(data))                         │
│   }, 30000)                                                 │
│   return () => clearInterval(interval)                     │
│ }, [])                                                      │
└─────────────────────────────────────────────────────────────┘

Backend Response:
┌─────────────────────────────────────────────────────────────┐
│ HTTP 200 OK                                                 │
│                                                             │
│ [                                                           │
│   {                                                         │
│     "id": 1,                                               │
│     "source": "watchtower",                                │
│     "summary": "SAMA updated consumer protection...",       │
│     "impact_json": {                                        │
│       "impact": "High",                                     │
│       "actions": [...]                                      │
│     },                                                      │
│     "action_required": true,                                │
│     "created_at": "2025-11-15T10:30:00"                    │
│   }                                                         │
│ ]                                                           │
└─────────────────────────────────────────────────────────────┘

Frontend Display:
┌─────────────────────────────────────────────────────────────┐
│              ALERTS SECTION                                 │
│                                                             │
│  Alert #1 [High Impact] ⚠️                                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ SAMA updated consumer protection guidelines on      │ │
│  │ microfinance lending.                               │ │
│  │                                                      │ │
│  │ Status: Action Required                             │ │
│  │ Detected: 2025-11-15 at 10:30 AM                   │ │
│  │                                                      │ │
│  │ [View Details] [Generate Report] [Dismiss]         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

User Actions:
├─ Click "View Details" → GET /api/v1/alerts/{alert_id}
├─ Click "Generate Report" → POST /api/v1/reports/generate
└─ Click "Dismiss" → Local state only (no API call)
```

### Flow 2: Generating Reports (Executor)

```
User Journey:
1. User sees alert
2. Clicks "Generate Report"
3. Watches report generation progress
4. Views completed report

Step-by-Step Flow:

[1] User clicks "Generate Report" on Alert #1
         │
         ▼
[2] Frontend: POST /api/v1/reports/generate?alert_id=1
    Headers: Authorization: Bearer token
         │
         ▼
[3] Backend Processing:
    ├─ Validates alert exists
    ├─ Creates GeneratedReport record
    │  {
    │    "alert_id": 1,
    │    "status": "in_progress",
    │    "title": "Compliance Report for Alert #1",
    │    "content_markdown": ""
    │  }
    ├─ Queues background task
    └─ Returns immediately
         │
         ▼
[4] Frontend Receives Response:
    {
      "report_id": 1,
      "status": "in_progress"
    }
         │
         ▼
[5] Frontend Shows Loading State:
    ┌──────────────────────────────────────────┐
    │  📋 Generating Report...                 │
    │                                          │
    │  ⏳ Processing with AI                   │
    │                                          │
    │  [Cancel] [View Progress]                │
    └──────────────────────────────────────────┘
         │
         ▼
[6] Frontend Polls Backend:
    GET /api/v1/reports/1
    (Every 2 seconds)
         │
         ▼
[7] Backend Background Task Meanwhile:
    ├─ Fetch alert details
    ├─ Initialize crew.ai agents
    ├─ Run analysis task (ComplianceAnalystAgent)
    ├─ Fetch company data (CompanyDataFetcherAgent)
    ├─ Write report (ReportWriterAgent)
    ├─ Update database:
    │  {
    │    "status": "completed",
    │    "content_markdown": "# Compliance Report\n..."
    │  }
    └─ Done
         │
         ▼
[8] Frontend Poll Result Changes:
    Response status changes from "in_progress" to "completed"
         │
         ▼
[9] Frontend Displays Report:
    ┌──────────────────────────────────────────┐
    │  ✅ Report Generated Successfully        │
    │                                          │
    │  # Compliance Report                     │
    │  ## Executive Summary                    │
    │  ...                                     │
    │  [Download] [Print] [Share] [Back]      │
    └──────────────────────────────────────────┘
```

### Flow 3: Chat Interaction (Reliable Chat)

```
User Journey:
1. User opens chat interface
2. Types compliance question
3. Gets instant answer with sources

Frontend Flow:

[1] User clicks "Chat" tab on dashboard
         │
         ▼
[2] Chat Interface Shows:
    ┌──────────────────────────────────────────┐
    │         Compliance AI Assistant          │
    │                                          │
    │ Message History:                         │
    │ (empty on first load)                    │
    │                                          │
    │ ┌──────────────────────────────────────┐ │
    │ │ Type your question here...            │ │
    │ └──────────────────────────────────────┘ │
    │ [Send Button]                            │
    └──────────────────────────────────────────┘
         │
         ▼
[3] User Types:
    "What are KYC requirements in UAE?"
         │
         ▼
[4] User Clicks Send
         │
         ▼
[5] Frontend: POST /api/v1/chat
    {
      "query": "What are KYC requirements in UAE?"
    }
         │
         ▼
[6] Frontend Shows Loading:
    ┌──────────────────────────────────────────┐
    │ User Message:                            │
    │ "What are KYC requirements in UAE?"     │
    │                                          │
    │ Assistant:                               │
    │ ⏳ Thinking...                            │
    └──────────────────────────────────────────┘
         │
         ▼
[7] Backend Processing:
    ├─ Receive query
    ├─ Search vector store for "kyc"
    ├─ Found match! Retrieve context:
    │  "Know Your Customer (KYC) requirements
    │   mandate that financial institutions
    │   verify customer identity through
    │   government-issued ID..."
    ├─ Call Gemini API with RAG prompt
    ├─ Get back enriched answer
    └─ Return with source
         │
         ▼
[8] Backend Response:
    {
      "answer": "According to UAE compliance standards,
                 KYC requires verification of customer
                 identity through government-issued ID,
                 biometric data, and address verification.
                 Re-verification is required annually or
                 when significant changes are detected.",
      "source": "Compliance DB (Key: kyc)"
    }
         │
         ▼
[9] Frontend Displays Answer:
    ┌──────────────────────────────────────────┐
    │ User Message:                            │
    │ "What are KYC requirements in UAE?"     │
    │                                          │
    │ Assistant: ✅                            │
    │ "According to UAE compliance standards, │
    │  KYC requires verification of customer │
    │  identity through government-issued ID │
    │  ..."                                    │
    │                                          │
    │ Source: Compliance DB (Key: kyc)        │
    │                                          │
    │ [👍 Helpful] [👎 Not Helpful] [Copy]   │
    └──────────────────────────────────────────┘
```

---

## Feature-Specific User Journeys

### Journey A: Compliance Officer Reviewing Alerts

```
Time: Monday 9:00 AM
Persona: Compliance Officer, Ahmed

1. [9:00] Ahmed logs into CompliSense
   └─ Email: ahmed@fintech.ae
   └─ Password: (any - dummy auth)

2. [9:02] Dashboard loads, sees alerts
   └─ Alert #1: SAMA updated guidelines (High Priority)
   └─ Alert #2: New AML procedures (Medium Priority)

3. [9:05] Ahmed clicks Alert #1
   └─ Views full details
   └─ Sees impact analysis
   └─ Reads recommended actions

4. [9:08] Ahmed clicks "Generate Report"
   └─ Report generation starts
   └─ Sees loading indicator

5. [9:12] Report is ready
   └─ Ahmed reviews completed report
   └─ Contains:
      - Executive summary
      - Company details
      - Compliance findings
      - Risk assessment
      - Recommendations (Immediate/Short-term/Follow-up)

6. [9:15] Ahmed exports report
   └─ Downloads as PDF
   └─ Forwards to team

7. [9:20] Ahmed asks AI clarification
   └─ Types: "What's our data residency obligation?"
   └─ Gets instant answer with sources
   └─ Saves chat for reference
```

### Journey B: New Fintech Startup Implementation

```
Time: Week 1
Scenario: New startup "PayNow" implements CompliOps

Day 1:
├─ Founder signs up
├─ Dashboard empty (no alerts yet)
├─ Reads documentation
└─ Familiarizes with three modules

Day 2:
├─ First Watchtower alert detected
├─ Founder sees: "CBUAE updated AML procedures"
├─ Starts first report generation
├─ Waits for completion

Day 3:
├─ Report completed successfully
├─ Reviews recommendations
├─ Updates internal policies based on report
├─ Stores report for regulatory records

Day 4-5:
├─ Multiple alerts accumulate
├─ Founder uses chat to understand requirements
├─ Asks 5+ questions:
│  ├─ "What about BNPL regulations?"
│  ├─ "Data residency requirements?"
│  ├─ "KYC procedures?"
│  ├─ "AML reporting thresholds?"
│  └─ "Complaint handling procedures?"
└─ Gets instant answers with sources

Week 2:
├─ Startup has:
│  ├─ 15+ alerts in system
│  ├─ 8+ generated reports
│  └─ 20+ chat interactions
├─ Uses CompliOps as single source of truth
├─ Implements identified compliance gaps
└─ Stays audit-ready
```

---

## Data Collection & Processing

### What Data Gets Collected

#### 1. Authentication Data
```
Collected on Login:
├─ Email address (not stored, just for logging)
├─ Timestamp of login
└─ JWT token generated

Stored in: 
├─ Users table (if DB persistence enabled)
└─ Frontend localStorage
```

#### 2. Alert Data
```
Generated by Watchtower every 2 minutes:
├─ Source content (simulated web scrape)
├─ Change detection result (boolean)
├─ Gemini analysis (if API available)
├─ Mock analysis (if no API)

Stored in: ComplianceAlerts table
Data Structure:
{
  "id": auto-incrementing,
  "source": "watchtower",
  "summary": string,
  "impact_json": {
    "impact": "Low/Medium/High",
    "actions": [action1, action2, ...],
    "summary": string
  },
  "action_required": boolean,
  "created_at": ISO timestamp
}
```

#### 3. Report Data
```
Generated when user requests:
├─ Alert ID (which alert triggered it)
├─ crew.ai analysis output
├─ Markdown formatted report

Stored in: GeneratedReports table
Data Structure:
{
  "id": auto-incrementing,
  "alert_id": foreign key,
  "status": "in_progress" | "completed" | "failed",
  "title": string,
  "content_markdown": full report text,
  "created_at": ISO timestamp
}
```

#### 4. Chat Data
```
NOT PERSISTED (processed in real-time):
├─ User query string
├─ Matched vector store key
├─ Retrieved context
├─ Gemini response (if available)
└─ Mock response (if no API)

Optional: Frontend could store in local logs
```

### Data Processing Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│         DATA PROCESSING PIPELINE                            │
└─────────────────────────────────────────────────────────────┘

INPUT SOURCES:
│
├─ Watchtower
│  └─ Simulated scraping
│     ├─ Compare previous vs current
│     └─ Detect changes
│
├─ User Actions
│  ├─ Generate Report button
│  ├─ Chat queries
│  └─ Login
│
└─ Background Tasks
   └─ crew.ai orchestration

PROCESSING LAYERS:
│
├─ Layer 1: Validation
│  ├─ Pydantic schema validation
│  ├─ Type checking
│  └─ Required field verification
│
├─ Layer 2: Analysis
│  ├─ Gemini API call (if available)
│  ├─ Mock response (if not available)
│  └─ Error handling & fallback
│
├─ Layer 3: Enrichment
│  ├─ Add timestamps
│  ├─ Add IDs
│  ├─ Format data
│  └─ Structure for storage
│
├─ Layer 4: Persistence
│  ├─ Save to SQLite
│  ├─ Handle conflicts
│  ├─ Maintain referential integrity
│  └─ Transaction management
│
└─ Layer 5: Response
   ├─ Transform to API format
   ├─ Apply Pydantic schema
   └─ Return to client

OUTPUT:
│
├─ HTTP Response
│  ├─ JSON serialized
│  ├─ Proper status codes
│  └─ Error details if needed
│
└─ Database State
   ├─ New records created
   ├─ Relationships maintained
   └─ Historical tracking
```

---

## State Management

### Frontend State Structure

```javascript
// Top-level App State
{
  // Authentication
  auth: {
    isAuthenticated: boolean,
    token: string,
    email: string,
    lastLogin: ISO timestamp
  },

  // Watchtower Alerts
  alerts: {
    items: ComplianceAlert[],
    loading: boolean,
    error: string | null,
    selectedAlertId: number | null,
    pagination: {
      skip: number,
      limit: number,
      total: number
    }
  },

  // Executor Reports
  reports: {
    items: GeneratedReport[],
    loading: boolean,
    error: string | null,
    generatingReportId: number | null,
    reportPollingIntervals: Map<number, setInterval>,
    pagination: {
      skip: number,
      limit: number,
      total: number
    }
  },

  // Reliable Chat
  chat: {
    messages: ChatMessage[],
    loading: boolean,
    error: string | null,
    currentQuery: string
  },

  // System
  system: {
    backendHealthy: boolean,
    apiMode: "Production" | "Mock",
    lastHealthCheck: ISO timestamp
  }
}
```

### Backend State Management

```python
# Global Variables (per process)
global_state = {
    # Watchtower
    "last_scraped_content": str | None,  # Tracks previous state
    "scheduler": BackgroundScheduler,    # APScheduler instance
    
    # LLM
    "llm": ChatGoogleGenerativeAI | None,  # Gemini instance
    "gemini_api_key": str | None,          # Loaded from env
    
    # Mock Data
    "mock_vector_store": dict,  # RAG context store
}

# Database Session
session = SessionLocal()
# Each request gets new session
# Auto-closes after response
```

---

## Complete User Session Timeline

```
Time    Action                  Data Flow              System State
────────────────────────────────────────────────────────────────────────

9:00    User opens website      -                       Frontend ready
        
9:01    Clicks "Login"          -                       Login modal shown
        
9:02    Enters credentials      Email + Password        Frontend waiting
        
9:03    Clicks "Login"          POST /api/v1/login      Backend validates
        
9:03:1  Backend processes       No DB check (dummy)     Returns JWT token
        
9:03:2  Frontend receives       JWT saved              Redirected to
        token                   localStorage            dashboard
        
9:04    Dashboard loads         GET /health            Backend health OK
                                GET /alerts
        
9:04:2  Dashboard rendered      Empty state or         Display alerts
        with alerts             existing alerts        if available
        
9:05    User sees              Alert #1 visible        Ready for action
        Watchtower alert
        
9:06    User clicks alert      GET /alerts/{id}        Show full details
        
9:07    User reads details     -                       Viewing content
        
9:10    Clicks "Generate       POST /reports/          Report created
        Report"                generate               in DB
        
9:10:1  Frontend shows         -                       Loading state
        loading
        
9:10:2  Backend starts         crew.ai initialized     Background task
        background task                                running
        
9:11    Frontend polls         GET /reports/1          Status:
        (every 2 sec)          (status check)          in_progress
        
9:12    Frontend polls         GET /reports/1          Status:
        again                  (status check)          completed
        
9:12:1  Frontend displays      Report content          User reviews
        report                 returned                report
        
9:15    User opens chat        -                       Chat UI shown
        
9:16    Types question         -                       Input captured
        
9:17    Clicks send            POST /api/v1/chat      Query sent
        
9:17:1  Backend processes      Vector store search    Context retrieved
                               + Gemini call
        
9:17:2  Backend responds       Answer + source        Frontend displays
        
9:18    User reads answer      -                       Chat shown
        
9:20    User refreshes         GET /alerts             New alerts
        alerts                 (updated list)         loaded
        
9:25    User logs out          localStorage clear     Session ended
```

---

## Key Insights

### Design Philosophy

1. **Stateless Backend**: No session state, each request is independent
2. **Graceful Degradation**: Everything works in mock mode
3. **Optimistic UI**: Frontend assumes success and updates immediately
4. **Polling Pattern**: Simple frontend polling instead of complex WebSockets
5. **Dummy Auth**: No credentials validation, focus on feature flows

### Data Safety

- All database operations use SQLAlchemy ORM (no SQL injection)
- Pydantic validation on all inputs
- Transaction management prevents partial updates
- Error rollbacks maintain data consistency

### User Experience

- Fast feedback (JWT immediate, reports async but polled)
- Clear loading states
- Error messages are user-friendly
- Chat provides instant answers
- Alerts appear automatically

