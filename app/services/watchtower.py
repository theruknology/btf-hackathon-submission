"""Watchtower Service: Background Change Detection & Monitoring"""

import logging
import json
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from app.models.database import SessionLocal, ComplianceAlert
from app.config import GEMINI_API_KEY, llm

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = BackgroundScheduler()
last_scraped_content = None


def run_watchtower_check():
    """
    Simulates Watchtower checking for compliance changes every 2 minutes.
    
    Logic:
    - Uses even/odd minutes to toggle between two different "scraped" contents
    - If content changes, triggers Gemini analysis (or mock if no API key)
    - Saves alert to database
    """
    global last_scraped_content
    
    # Simulate scraping: alternate content based on even/odd minute
    current_minute = datetime.now().minute
    if current_minute % 2 == 0:
        new_content = "SAMA updated consumer protection guidelines on microfinance lending."
    else:
        new_content = "CBUAE released new AML screening procedures for fintech operators."
    
    # Check if content changed
    if last_scraped_content != new_content:
        logger.info(f"🔔 WATCHTOWER: Change detected! Content: {new_content}")
        last_scraped_content = new_content
        
        # Analyze the change
        if GEMINI_API_KEY and llm:
            # Real API call
            try:
                analysis_prompt = f"""Analyze this compliance update and provide:
                1. A one-line summary
                2. Impact level (Low/Medium/High)
                3. Required actions (list 2-3 items)
                
                Update: {new_content}
                
                Return as JSON."""
                
                response = llm.invoke(analysis_prompt)
                analysis_text = response.content
                
                # Parse JSON from response
                try:
                    analysis = json.loads(analysis_text)
                except json.JSONDecodeError:
                    # Fallback if response isn't valid JSON
                    analysis = {
                        "summary": new_content,
                        "impact": "Medium",
                        "action_required": True,
                        "actions": ["Review update", "Update compliance docs"]
                    }
                
                logger.info(f"✓ WATCHTOWER: Real API analysis completed")
            except Exception as e:
                logger.error(f"✗ WATCHTOWER: API error: {e}. Falling back to mock.")
                analysis = generate_mock_watchtower_analysis(new_content)
        else:
            # Mock analysis (no API key)
            logger.info("WATCHTOWER: No API key. Generating mock analysis.")
            analysis = generate_mock_watchtower_analysis(new_content)
        
        # Save to database
        db = SessionLocal()
        try:
            alert = ComplianceAlert(
                source="watchtower",
                summary=analysis.get("summary", new_content),
                impact_json=analysis,
                action_required=analysis.get("action_required", True),
            )
            db.add(alert)
            db.commit()
            logger.info(f"✓ WATCHTOWER: Alert saved to DB (ID: {alert.id})")
        except Exception as e:
            logger.error(f"✗ WATCHTOWER: Failed to save alert: {e}")
            db.rollback()
        finally:
            db.close()


def generate_mock_watchtower_analysis(content: str) -> dict:
    """
    Generates realistic mock analysis for Watchtower when API is unavailable.
    
    Args:
        content: The scraped compliance content to analyze
    
    Returns:
        Dictionary with analysis results
    """
    return {
        "summary": content,
        "impact": "High",
        "action_required": True,
        "actions": [
            "Review compliance documentation",
            "Update internal policies",
            "Notify compliance team immediately"
        ],
        "source": "Mock Watchtower Analysis"
    }


def start_watchtower_scheduler():
    """
    Starts the APScheduler background scheduler for Watchtower.
    
    Runs the change detection check every 2 minutes.
    """
    if not scheduler.running:
        scheduler.add_job(run_watchtower_check, "interval", minutes=2, id="watchtower")
        scheduler.start()
        logger.info("✓ Watchtower scheduler started (runs every 2 minutes)")


def stop_watchtower_scheduler():
    """Stops the APScheduler background scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("🛑 Watchtower scheduler stopped")
