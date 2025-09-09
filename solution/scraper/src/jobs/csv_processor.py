from sqlalchemy import select
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models import CsvFile, Documento
from src.extractor_texto import get_text_from_document
from src.notifications.notificacion import enviar_notificaciones_masivas

def process_csv_job(csv_id: int) -> None:
    db: Session = SessionLocal()
    try:
        csv: CsvFile | None = db.execute(
            select(CsvFile).where(CsvFile.Id == csv_id)
        ).scalar_one_or_none()

        if not csv:
            print(f"[scraper] CSV {csv_id} no encontrado")
            return

        csv.Estado = "PROCESSING"
        db.commit()

        any_error = False
        processed_count = 0

        docs = db.execute(
            select(Documento).where(
                (Documento.CsvFileId == csv_id) &
                (Documento.Estado == "QUEUED")
            )
        ).scalars().all()

        for doc in docs:
            try:
                if doc.Estado == "PROCESSED" and (doc.Texto or "").strip():
                    continue

                text = get_text_from_document(doc.UrlDocumento, doc.DocumentoNombre)
                doc.Texto = (text or "").strip()
                doc.Estado = "PROCESSED"
                processed_count += 1

            except Exception as e:
                doc.Estado = "ERROR"
                any_error = True
                print(f"[scraper] Documento {doc.Id} ERROR: {e}")

            finally:
                db.add(doc)
                try:
                    db.commit()
                except Exception as commit_error:
                    db.rollback()
                    print(f"[scraper] Error commit documento {doc.Id}: {commit_error}")

        csv.EnlacesProcesados = processed_count
        csv.Estado = "ERROR" if any_error else "PROCESSED"
        db.add(csv)
        try:
            db.commit()
        except Exception as commit_error:
            db.rollback()
            print(f"[scraper] Error commit CSV {csv.Id}: {commit_error}")

        print(f"[scraper] CSV {csv_id} finalizado. Estado={csv.Estado}, OK={processed_count}")

        # Envial nitificaciones por mailhog
        if csv.Estado == "PROCESSED":
            recipients = [
                "user1@example.com",
                "user2@example.com",
                "user3@example.com",
            ]
            enviar_notificaciones_masivas(
                subject="Nuevas normativas disponibles",
                body=f"El CSV {csv_id} fue procesado con éxito. Hay {processed_count} documentos disponibles.",
                recipients=recipients
            )

    finally:
        db.close()

def procesar_automaticamente():
    with SessionLocal() as db:
        queued_csvs = db.execute(
            select(CsvFile.Id).where(CsvFile.Estado == "QUEUED")
        ).scalars().all()
        
    for csv_id in queued_csvs:
        process_csv_job(csv_id)

