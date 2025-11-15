"""Report Generation Endpoints (Executor)"""

import logging
from typing import List
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.database import SessionLocal, ComplianceAlert, GeneratedReport
from app.models.schemas import GeneratedReportResponse
from app.config import GEMINI_API_KEY, llm
from app.agents import (
    get_compliance_analyst_agent,
    get_company_data_fetcher_agent,
    get_report_writer_agent,
    generate_mock_executor_report,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["reports"])


@router.post("/reports/generate")
async def generate_report(alert_id: int, background_tasks: BackgroundTasks):
    """
    Trigger the Executor to generate a compliance report from an alert.
    
    The report generation happens in the background via crew.ai agents.
    
    Query Parameters:
        alert_id: ID of the ComplianceAlert to analyze
    
    Returns:
        Confirmation message with report ID
    """
    db = SessionLocal()
    try:
        # Fetch the alert
        alert = db.query(ComplianceAlert).filter(ComplianceAlert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        # Create report record
        report = GeneratedReport(
            alert_id=alert_id,
            status="in_progress",
            title=f"Compliance Report for Alert #{alert_id}",
            content_markdown="",
        )
        db.add(report)
        db.commit()
        report_id = report.id
        
        # Add background task to generate report
        background_tasks.add_task(
            _execute_report_generation,
            report_id=report_id,
            alert_id=alert_id,
        )
        
        logger.info(f"✓ Report generation started for alert {alert_id} (Report ID: {report_id})")
        return {"report_id": report_id, "status": "in_progress"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"✗ Failed to initiate report generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate report generation")
    finally:
        db.close()


def _execute_report_generation(report_id: int, alert_id: int):
    """
    Background task that executes the Executor crew to generate a report.
    
    Args:
        report_id: ID of the GeneratedReport to update
        alert_id: ID of the ComplianceAlert to analyze
    """
    db = SessionLocal()
    try:
        # Fetch alert and report
        alert = db.query(ComplianceAlert).filter(ComplianceAlert.id == alert_id).first()
        report = db.query(GeneratedReport).filter(GeneratedReport.id == report_id).first()
        
        if not alert or not report:
            logger.error(f"✗ Alert or Report not found: alert_id={alert_id}, report_id={report_id}")
            return
        
        logger.info(f"📋 EXECUTOR: Starting report generation for Alert #{alert_id}")
        
        if GEMINI_API_KEY and llm:
            # Real crew.ai execution
            logger.info("✓ EXECUTOR: Using real Gemini API")
            
            try:
                from crew import Task, Crew
                
                # Mock company data (in real implementation, this would come from a real data source)
                company_data = {
                    "company_name": "Startup Inc.",
                    "data_locations": ["aws-uae-north-1", "gcp-dammam"],
                    "user_count": 45000,
                }
                
                # Define crew.ai tasks
                task_analyze = Task(
                    description=f"""Analyze this compliance alert:
                    {alert.summary}
                    
                    Provide a structured analysis including impact and required actions.""",
                    agent=get_compliance_analyst_agent(),
                    expected_output="Structured compliance analysis",
                )
                
                task_fetch_data = Task(
                    description="Fetch company data for compliance reporting",
                    agent=get_company_data_fetcher_agent(),
                    expected_output="JSON company metadata",
                )
                
                task_write_report = Task(
                    description=f"""Write a comprehensive compliance report in Markdown based on:
                    1. Alert: {alert.summary}
                    2. Company: {company_data['company_name']}
                    3. Impact level: {alert.impact_json.get('impact', 'Medium')}
                    
                    Include executive summary, findings, and recommendations.""",
                    agent=get_report_writer_agent(),
                    expected_output="Full Markdown report",
                )
                
                # Create and execute crew
                crew = Crew(
                    agents=[
                        get_compliance_analyst_agent(),
                        get_company_data_fetcher_agent(),
                        get_report_writer_agent(),
                    ],
                    tasks=[task_analyze, task_fetch_data, task_write_report],
                    verbose=True,
                )
                
                result = crew.kickoff()
                report_content = str(result)
                logger.info("✓ EXECUTOR: Report generation completed with real API")
            
            except Exception as e:
                logger.warning(f"⚠ EXECUTOR: Real API failed: {e}. Falling back to mock.")
                company_data = {
                    "company_name": "Startup Inc.",
                    "data_locations": ["aws-uae-north-1", "gcp-dammam"],
                    "user_count": 45000,
                }
                report_content = generate_mock_executor_report(alert, company_data)
        else:
            # Mock report generation
            logger.info("EXECUTOR: No API key. Generating mock report.")
            company_data = {
                "company_name": "Startup Inc.",
                "data_locations": ["aws-uae-north-1", "gcp-dammam"],
                "user_count": 45000,
            }
            report_content = generate_mock_executor_report(alert, company_data)
        
        # Update report in database
        report.status = "completed"
        report.content_markdown = report_content
        db.commit()
        logger.info(f"✓ EXECUTOR: Report saved to DB (ID: {report_id})")
    
    except Exception as e:
        logger.error(f"✗ EXECUTOR: Report generation failed: {e}")
        try:
            report = db.query(GeneratedReport).filter(GeneratedReport.id == report_id).first()
            if report:
                report.status = "failed"
                db.commit()
        except:
            pass
    finally:
        db.close()


@router.get("/reports", response_model=List[GeneratedReportResponse])
async def get_reports(skip: int = 0, limit: int = 10):
    """
    Fetch all generated compliance reports.
    
    Query Parameters:
        skip: Number of reports to skip (for pagination)
        limit: Maximum number of reports to return
    
    Returns:
        List of GeneratedReport objects
    """
    db = SessionLocal()
    try:
        reports = db.query(GeneratedReport).offset(skip).limit(limit).all()
        logger.info(f"✓ Fetched {len(reports)} reports")
        return reports
    except Exception as e:
        logger.error(f"✗ Failed to fetch reports: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports")
    finally:
        db.close()


@router.get("/reports/{report_id}", response_model=GeneratedReportResponse)
async def get_report(report_id: int):
    """
    Fetch a specific generated report by ID.
    
    Path Parameters:
        report_id: ID of the report
    
    Returns:
        GeneratedReport object
    """
    db = SessionLocal()
    try:
        report = db.query(GeneratedReport).filter(GeneratedReport.id == report_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"✗ Failed to fetch report {report_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch report")
    finally:
        db.close()
