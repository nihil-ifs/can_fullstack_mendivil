/*
    Modelo de datos para los documentos.
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Documento
    {
        public int Id { get; set; }
        public string Nomenclatura { get; set; } = string.Empty;
        public string Titulo { get; set; } = string.Empty;
        [Column(TypeName = "timestamp")]
        public DateTime FechaPublicacion { get; set; }
        public string DocumentoNombre { get; set; } = string.Empty;
        public string UrlDocumento { get; set; } = string.Empty;
        public int Paginas { get; set; }
        public string TipoDocumento { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public string Estado { get; set; } = "QUEUED";
        public int CsvFileId { get; set; }
        [JsonIgnore]
        public CsvFile CsvFile { get; set; } = null!;
    }
}
