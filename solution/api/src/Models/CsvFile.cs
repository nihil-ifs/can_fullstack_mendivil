/*
    Modelo de datos para los csv.
*/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class CsvFile
    {
        
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Estado { get; set; } = "QUEUED"; 
        [Column(TypeName = "timestamp")]
        public DateTime FechaSubida { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
        public int Usuario { get; set; } = 1; 
        public int EnlacesProcesados { get; set; } = 0;

        public ICollection<Documento> Documentos { get; set; } = new List<Documento>();
    }
}