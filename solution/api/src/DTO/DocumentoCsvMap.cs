/*
    DTO para mapear el CSV a la entidad Documento
*/

namespace DTO
{
    using CsvHelper.Configuration;
    using Models;

    public class DocumentoCsvMap : ClassMap<Documento>
    {
        public DocumentoCsvMap()
        {
            Map(m => m.Nomenclatura).Name("Nomenclatura");
            Map(m => m.Titulo).Name("Título");
            Map(m => m.FechaPublicacion).Name("Fecha de publicación").TypeConverterOption.Format("d/M/yyyy", "dd/MM/yyyy", "yyyy-MM-dd");
            Map(m => m.DocumentoNombre).Name("Documento");
            Map(m => m.UrlDocumento).Name("URL Documento");
            Map(m => m.Paginas).Name("Cantidad de páginas");
            Map(m => m.TipoDocumento).Name("Tipo documento");
        }
    }
}
