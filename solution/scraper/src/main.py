from fastapi import FastAPI, BackgroundTasks, HTTPException
from sqlalchemy import select

from src.db import SessionLocal
from src.models import CsvFile
from src.jobs.csv_processor import process_csv_job

app = FastAPI(title="SGCAN Scraper")

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/process/{csv_id}")
def process_csv(csv_id: int, background: BackgroundTasks):
    with SessionLocal() as db:
        exists = db.execute(
            select(CsvFile.Id).where(CsvFile.Id == csv_id)
        ).scalar_one_or_none()

    if not exists:
        raise HTTPException(status_code=404, detail="CSV no encontrado")

    background.add_task(process_csv_job, csv_id)
    return {"message": f"CSV {csv_id} encolado para procesamiento"}
