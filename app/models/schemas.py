"""Pydantic Request/Response Models for API"""

from datetime import datetime
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Dummy login request."""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Mock JWT token response."""
    access_token: str = Field(..., description="Mock JWT token")
    token_type: str = "bearer"


class ComplianceAlertResponse(BaseModel):
    """Response model for compliance alerts."""
    id: int
    source: str
    summary: str
    impact_json: dict
    action_required: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class GeneratedReportResponse(BaseModel):
    """Response model for generated reports."""
    id: int
    alert_id: int
    status: str
    title: str
    content_markdown: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    """Request model for the RAG chat endpoint."""
    query: str


class ChatResponse(BaseModel):
    """Response model for the RAG chat endpoint."""
    answer: str
    source: str
