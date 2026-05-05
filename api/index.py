import sys
import os
# Add root directory to sys.path so Vercel can find nexus_q.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from nexus_q import NexusQ
import asyncio

app = FastAPI(title="Nexus-Q API", version="1.0.0")
engine = NexusQ()

class Query(BaseModel):
    text: str
    recursive: bool = False
    debate: bool = False

@app.get("/")
def read_root():
    return {"status": "online", "engine": "Nexus-Q", "location": "IIIT Pune"}

@app.post("/api/reason")
async def reason(query: Query):
    try:
        if query.debate:
            result = await engine.debate_reason(query.text)
        elif query.recursive:
            result = engine.reason_recursive(query.text)
        else:
            result = engine.reason(query.text)
        return {"query": query.text, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
