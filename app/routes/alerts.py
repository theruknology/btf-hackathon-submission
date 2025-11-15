"""Alert Management Endpoints (Watchtower)"""

import logging
from typing import List
from fastapi import APIRouter, HTTPException
from app.models.database import SessionLocal, ComplianceAlert
from app.models.schemas import ComplianceAlertResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["alerts"])


@router.get("/alerts", response_model=List[ComplianceAlertResponse])
async def get_alerts(skip: int = 0, limit: int = 10):
    """
    Fetch all compliance alerts detected by Watchtower.
    
    Query Parameters:
        skip: Number of alerts to skip (for pagination)
        limit: Maximum number of alerts to return
    
    Returns:
        List of ComplianceAlert objects
    """
    db = SessionLocal()
    try:
        alerts = db.query(ComplianceAlert).offset(skip).limit(limit).all()
        logger.info(f"✓ Fetched {len(alerts)} alerts")
        return alerts
    except Exception as e:
        logger.error(f"✗ Failed to fetch alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch alerts")
    finally:
        db.close()


@router.get("/alerts/{alert_id}", response_model=ComplianceAlertResponse)
async def get_alert(alert_id: int):
    """
    Fetch a specific compliance alert by ID.
    
    Path Parameters:
        alert_id: ID of the alert
    
    Returns:
        ComplianceAlert object
    """
    db = SessionLocal()
    try:
        alert = db.query(ComplianceAlert).filter(ComplianceAlert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return alert
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"✗ Failed to fetch alert {alert_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch alert")
    finally:
        db.close()
