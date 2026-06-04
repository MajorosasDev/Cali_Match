import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client

from recomendador import recomendar_lugares

# --------------------------------------------------
# ENV
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

load_dotenv(BASE_DIR.parent / ".env")

SUPABASE_URL = (
    os.getenv("SUPABASE_URL")
    or os.getenv("VITE_SUPABASE_URL")
)

SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "Faltan variables SUPABASE_URL y SUPABASE_SECRET_KEY"
    )

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("URL:", SUPABASE_URL)
print("KEY:", SUPABASE_KEY[:20] + "...")

# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(
    title="CaliMatch Recommendation API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# MODELS
# --------------------------------------------------

class RecomendacionRequest(BaseModel):
    group_id: str


class RecomendacionResponse(BaseModel):
    persona_prototipica: dict
    top_lugares: list[dict]
    score: int
    insights: list[str]
    explicacion: str
    saved: bool


# --------------------------------------------------
# HEALTH
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "version": "2.0.0"
    }


# --------------------------------------------------
# DEBUG
# --------------------------------------------------

@app.get("/debug")
def debug():

    resp = (
        supabase
        .table("group_details")
        .select("*")
        .execute()
    )

    return {
        "rows": len(resp.data),
        "data": resp.data
    }


# --------------------------------------------------
# RECOMENDAR
# --------------------------------------------------

@app.post(
    "/recomendar",
    response_model=RecomendacionResponse
)
def recomendar(req: RecomendacionRequest):

    print("=" * 50)
    print("Buscando grupo:", req.group_id)

    try:

        details_resp = (
            supabase
            .table("group_details")
            .select("*")
            .eq("group_id", req.group_id)
            .execute()
        )

    except Exception as exc:

        print("ERROR SUPABASE:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Error consultando Supabase: {exc}"
        )

    if not details_resp.data:

        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el grupo '{req.group_id}'"
        )

    details = details_resp.data[0]

    miembros = details.get("members") or []
    quiz_answers = details.get("quiz_answers") or {}

    result = recomendar_lugares(
        miembros,
        quiz_answers
    )

    supabase.table("group_recommendations").insert({
        "group_id": req.group_id,
        "score": result["score"],
        "resultado": result
    }).execute()

    return RecomendacionResponse(
        persona_prototipica=result["persona_prototipica"],
        top_lugares=result["top_lugares"],
        score=result["score"],
        insights=result["insights"],
        explicacion=result["explicacion"],
        saved=True
    )

    return RecomendacionResponse(
        **result,
        saved=True
    )