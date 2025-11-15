"""Authentication Endpoints"""

import logging
from datetime import datetime
from fastapi import APIRouter
from app.models.schemas import LoginRequest, LoginResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Dummy login endpoint. Accepts any email/password and returns a mock JWT token.
    
    Args:
        request: LoginRequest with email and password
    
    Returns:
        LoginResponse with mock token
    """
    # In a real app, validate credentials against database
    # For now, accept any email/password
    mock_token = f"mock_jwt_token_{request.email}_{datetime.now().timestamp()}"
    logger.info(f"✓ Login: {request.email}")
    return LoginResponse(access_token=mock_token)
