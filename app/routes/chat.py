"""RAG Chat Endpoints (Reliable Chat)"""

import logging
from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.config import GEMINI_API_KEY, llm, mock_vector_store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    RAG-based compliance Q&A endpoint.
    
    Searches mock vector store for relevant context and returns an answer.
    
    Args:
        request: ChatRequest with query string
    
    Returns:
        ChatResponse with answer and source
    """
    query = request.query.lower()
    
    # Search mock vector store for relevant context
    context = None
    matched_key = None
    for key in mock_vector_store:
        if key in query:
            context = mock_vector_store[key]
            matched_key = key
            break
    
    # If no context found, provide a generic response
    if not context:
        context = (
            "No specific compliance context found for this query. "
            "Please refine your question or contact compliance team."
        )
        matched_key = "general"
    
    logger.info(f"🤖 CHAT: Query received: '{request.query}' (Matched: {matched_key})")
    
    if GEMINI_API_KEY and llm:
        # Real API call with RAG
        try:
            rag_prompt = f"""You are a compliance expert assistant. 
            
Context from compliance documentation:
{context}

User Question: {request.query}

Answer based ONLY on the context above. If the context doesn't answer the question, say so."""
            
            response = llm.invoke(rag_prompt)
            answer = response.content
            source = f"Compliance DB (Key: {matched_key})"
            logger.info("✓ CHAT: Real API response generated")
        
        except Exception as e:
            logger.warning(f"⚠ CHAT: Real API failed: {e}. Falling back to mock.")
            answer = f"This is a mock answer. Based on your query, I found this context: {context}"
            source = f"Mock: {matched_key.upper()}"
    else:
        # Mock response (no API key)
        logger.info("CHAT: No API key. Generating mock response.")
        answer = f"This is a mock answer. Based on your query, I found this context: {context}"
        source = f"Mock: {matched_key.upper()}"
    
    return ChatResponse(answer=answer, source=source)
