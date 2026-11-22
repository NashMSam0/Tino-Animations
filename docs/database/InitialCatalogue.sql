IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261116100240_InitialCatalogue'
)
BEGIN
    IF SCHEMA_ID(N'catalogue') IS NULL EXEC(N'CREATE SCHEMA [catalogue];');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261116100240_InitialCatalogue'
)
BEGIN
    CREATE TABLE [catalogue].[Stories] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Slug] nvarchar(200) NOT NULL,
        [Synopsis] nvarchar(4000) NOT NULL,
        [IsPublished] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Stories] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261116100240_InitialCatalogue'
)
BEGIN
    CREATE INDEX [IX_Stories_IsPublished_Title_Id] ON [catalogue].[Stories] ([IsPublished], [Title], [Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261116100240_InitialCatalogue'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Stories_Slug] ON [catalogue].[Stories] ([Slug]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261116100240_InitialCatalogue'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261116100240_InitialCatalogue', N'10.0.14');
END;

COMMIT;
GO

