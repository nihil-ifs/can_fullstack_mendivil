/*
    * Proyecto: Prueba Técnica SGCAN-F-21-2025
    * Autor: Pablo Ignacio Mendivil Pereyra
    * Fecha: 6 de Septiembre de 2025
    * Descripción: Controlador para la ingesta de documentos desde un archivo CSV.
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsvHelper;
using System.Globalization;
using Data;
using Models;
using DTO;

namespace Controllers
{
    [ApiController]
    [Route("")]
    public class ArchivoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArchivoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("files")]
        public IActionResult GetFiles()
        {
            var files = _context.CsvFiles
                .Include(c => c.Documentos)
                .ToList(); 
            return Ok(files);
        }

        [HttpGet("files/{fileId}/links")]
        public IActionResult GetLinks(int fileId)
        {
            var links = _context.Documentos
                .Where(d => d.CsvFileId == fileId)
                .ToList();

            return Ok(links);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchCsvFiles([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("El parámetro de búsqueda no puede estar vacío.");

            var results = await _context.CsvFiles
                .Where(c => c.Nombre.Contains(q) 
                    || c.Documentos.Any(d => d.Nomenclatura.Contains(q) || d.Titulo.Contains(q)))
                .Select(c => new 
                {
                    c.Id,
                    c.Nombre,
                    c.Estado,
                    c.FechaSubida,
                    c.Usuario,
                    Documentos = c.Documentos.Select(d => new 
                    {
                        d.Id,
                        d.Nomenclatura,
                        d.Titulo,
                        d.Estado,
                        d.FechaPublicacion,
                        d.DocumentoNombre,
                        d.Paginas,
                        d.TipoDocumento,
                        d.Texto,
                        d.UrlDocumento
                    }),
                    c.EnlacesProcesados
                })
                .ToListAsync();

            return Ok(results);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Archivo CSV requerido.");

            var csvFile = new CsvFile
            {
                Nombre = file.FileName,
                FechaSubida = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                Usuario = 1,
                Estado = "QUEUED",
            };
            _context.CsvFiles.Add(csvFile);
            await _context.SaveChangesAsync();

            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

            csv.Context.RegisterClassMap<DocumentoCsvMap>();
            var documentos = csv.GetRecords<Documento>().ToList();

            documentos.ForEach(d => d.CsvFileId = csvFile.Id);
            
            await _context.Documentos.AddRangeAsync(documentos);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Mensaje = $"{documentos.Count} documentos del archivo '{file.FileName}' han sido puestos en cola.",
                CsvId = csvFile.Id
            });
        }

        [HttpPost("process/{csvId}")]
        public async Task<IActionResult> ProcessCsv(int csvId)
        {
            var pythonUrl = $"http://scraper:8000/process/{csvId}";

            using var client = new HttpClient();
            try
            {
                var response = await client.PostAsync(pythonUrl, null);

                if (!response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new { error = content });
                }

                var data = await response.Content.ReadAsStringAsync();
                return Ok(new { message = "CSV encolado en Python para procesamiento", detail = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

}
