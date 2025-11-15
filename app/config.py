"""Configuration: Environment Variables, LLM Setup, Mock Data"""

import os
import logging

logger = logging.getLogger(__name__)

# ============================================================================
# ENVIRONMENT & LLM SETUP
# ============================================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini LLM only if API key exists
llm = None
if GEMINI_API_KEY:
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro-latest",
            google_api_key=GEMINI_API_KEY,
            temperature=0.7,
        )
        logger.info("✓ Gemini API initialized successfully")
    except Exception as e:
        logger.warning(f"⚠ Failed to initialize Gemini API: {e}")
        llm = None
else:
    logger.warning("⚠ GEMINI_API_KEY not set. Running in MOCK mode.")


# ============================================================================
# MOCK DATA STORE (For RAG Chat)
# ============================================================================

mock_vector_store = {
    "bnpl": (
        "SAMA Circular 123 states that 'Buy Now, Pay Later' (BNPL) services must: "
        "1) Clearly disclose all fees and terms before purchase; "
        "2) Comply with consumer protection standards; "
        "3) Maintain adequate capital reserves; "
        "4) Report all transactions to SAMA within 24 hours."
    ),
    "data residency": (
        "The CBUAE rulebook requires all Personally Identifiable Information (PII) data to be "
        "stored within UAE borders unless explicitly approved by the regulator. "
        "Data residency compliance is mandatory for all fintech operators."
    ),
    "kyc": (
        "Know Your Customer (KYC) requirements mandate that financial institutions verify "
        "customer identity through government-issued ID, biometric data, and address verification. "
        "Re-verification is required annually or when significant changes are detected."
    ),
    "aml": (
        "Anti-Money Laundering (AML) regulations require transaction monitoring, "
        "Suspicious Activity Reporting (SAR), and Customer Due Diligence (CDD) at account opening. "
        "Threshold: transactions above AED 500,000 require enhanced due diligence."
    ),
}
