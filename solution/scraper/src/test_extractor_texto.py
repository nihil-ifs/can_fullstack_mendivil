from extractor_texto import get_text_from_document

url_pdf = "https://www.comunidadandina.org/DocOficialesFiles/ResolucionesJunta/RES271.pdf"
url_docx = "https://www.comunidadandina.org/DocOficialesFiles/resoluciones/RESOLUCION2178.docx"
url_doc = "https://www.comunidadandina.org/DocOficialesFiles/decisiones/DEC011.doc"

for url in [url_pdf, url_docx, url_doc]:
    print(f"\n=== Extrayendo {url} ===")
    texto = get_text_from_document(url, None)
    print(texto[:300])
