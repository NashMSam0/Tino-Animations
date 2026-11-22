using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tino.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCatalogue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "catalogue");

            migrationBuilder.CreateTable(
                name: "Stories",
                schema: "catalogue",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Synopsis = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stories_IsPublished_Title_Id",
                schema: "catalogue",
                table: "Stories",
                columns: new[] { "IsPublished", "Title", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_Stories_Slug",
                schema: "catalogue",
                table: "Stories",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stories",
                schema: "catalogue");
        }
    }
}
