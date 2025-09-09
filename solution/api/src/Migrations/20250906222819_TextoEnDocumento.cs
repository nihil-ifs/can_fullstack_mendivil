using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hub.Migrations
{
    public partial class TextoEnDocumento : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Texto",
                table: "Documentos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Texto",
                table: "Documentos");
        }
    }
}
