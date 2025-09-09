export interface CsvFile {
  id: number;
  nombre: string;
  estado: string;
  fechaSubida: string;
  usuario: number;
  enlacesProcesados: number;
  documentos: Documento[];
}

export interface Documento {
  id: number;
  nomenclatura: string;
  titulo: string;
  fechaPublicacion: string;
  documentoNombre: string;
  urlDocumento: string;
  paginas: number;
  tipoDocumento: string;
  texto: string;
  estado: string;
  csvFileId: number;
}