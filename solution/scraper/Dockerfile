FROM python:3.10-slim

WORKDIR /app

# Dependencias necesarias para procesamiento de documentos
RUN apt-get update && apt-get install -y --no-install-recommends \
    antiword \
    poppler-utils \
    tesseract-ocr \
    libxml2 \
    libxslt1.1 \
    libjpeg62-turbo \
    libpng16-16 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
