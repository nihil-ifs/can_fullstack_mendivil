from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey

Base = declarative_base()

class CsvFile(Base):
    __tablename__ = "CsvFiles"
    Id = Column(Integer, primary_key=True, index=True)
    Nombre = Column(String)
    Estado = Column(String, default="QUEUED")
    FechaSubida = Column(DateTime(timezone=False))
    Usuario = Column(Integer)
    EnlacesProcesados = Column(Integer, default=0)

    Documentos = relationship("Documento", back_populates="CsvFile")


class Documento(Base):
    __tablename__ = "Documentos"
    Id = Column(Integer, primary_key=True, index=True)

    Nomenclatura = Column(String)
    Titulo = Column(String)
    FechaPublicacion = Column(DateTime(timezone=False))
    DocumentoNombre = Column(String)
    UrlDocumento = Column(String)
    Paginas = Column(Integer)
    TipoDocumento = Column(String)
    Estado = Column(String, default="QUEUED")

    CsvFileId = Column(Integer, ForeignKey("CsvFiles.Id"))
    Texto = Column(Text)

    CsvFile = relationship("CsvFile", back_populates="Documentos")
