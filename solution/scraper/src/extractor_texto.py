import io
import os
import tempfile
import requests
from pathlib import Path
from pdfminer.high_level import extract_text as pdf_extract_text
import docx
import textract

class DownloadError(Exception):
    pass

def _guess_ext(url: str | None, nombre: str | None) -> str:
    cand = ""
    if url:
        cand = Path(url).suffix.lower()
    if not cand and nombre:
        cand = Path(nombre).suffix.lower()
    return cand

def _download_bytes(url: str, timeout: int = 60) -> bytes:
    try:
        r = requests.get(url, timeout=timeout)
        r.raise_for_status()
        return r.content
    except Exception as e:
        raise DownloadError(str(e)) from e

def extract_text_from_pdf(data: bytes) -> str:
    with tempfile.NamedTemporaryFile(suffix=".pdf") as tmp:
        tmp.write(data)
        tmp.flush()
        return pdf_extract_text(tmp.name) or ""

def extract_text_from_docx(data: bytes) -> str:
    bio = io.BytesIO(data)
    d = docx.Document(bio)
    return "\n".join([p.text for p in d.paragraphs]) or ""

def extract_text_from_doc(data: bytes) -> str:
    with tempfile.NamedTemporaryFile(suffix=".doc", delete=True) as tmp:
        tmp.write(data)
        tmp.flush()
        txt = textract.process(tmp.name, extension="doc")
        return txt.decode("utf-8", errors="replace")

def get_text_from_document(url: str, nombre: str | None = None) -> str:
    ext = _guess_ext(url, nombre)
    data = _download_bytes(url)

    if ext == ".pdf":
        return extract_text_from_pdf(data)

    if ext == ".docx":
        return extract_text_from_docx(data)

    if ext == ".doc":
        return extract_text_from_doc(data)

    for extractor in (extract_text_from_pdf, extract_text_from_doc, extract_text_from_docx):
        try:
            return extractor(data)
        except Exception:
            continue
    return ""
