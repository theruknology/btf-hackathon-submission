"""
CompliOps Backend Application
A FastAPI-based compliance automation platform with agentic AI capabilities.

This is the main entry point that imports and initializes all modules.

Features:
- Watchtower: Automated compliance change detection
- Executor: Report generation via crew.ai agents
- Reliable Chat: RAG-based compliance Q&A
- Robust mocking for graceful degradation without API keys
"""

import logging
from contextlib import asynccontextmanager
from datetime import datetime

# FastAPI & Web Framework
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import modules
from app.services import start_watchtower_scheduler, stop_watchtower_scheduler
from app.routes import auth, alerts, reports, chat

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============================================================================
# FASTAPI LIFECYCLE
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for FastAPI app.
    Starts background scheduler on startup, stops on shutdown.
    """
    # Startup
    logger.info("🚀 CompliOps Backend Starting...")
    start_watchtower_scheduler()
    yield
    
    # Shutdown
    stop_watchtower_scheduler()
    logger.info("🛑 CompliOps Backend Shutting Down...")


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="CompliOps API",
    description="Compliance Automation Platform with Agentic AI",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# REGISTER ROUTE ROUTERS
# ============================================================================

app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(reports.router)
app.include_router(chat.router)


# ============================================================================
# SYSTEM ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Returns API status and configuration info.
    """
    from app.config import GEMINI_API_KEY
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api_key_configured": bool(GEMINI_API_KEY),
        "mode": "Production" if GEMINI_API_KEY else "Mock",
        "version": "1.0.0",
    }


@app.get("/")
async def root():
    """Root endpoint with API documentation."""
    return {
        "message": "CompliOps API",
        "description": "Compliance Automation Platform with Agentic AI",
        "docs": "/docs",
        "health": "/health",
    }


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🚀 Starting CompliOps Backend Server...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
