module.exports = {
    type: 'sqlite',
    name: 'default',
    database: 'src/database.db',
    synchronize: true,
    "entities": [
        "src/entity/**/*.ts"
    ],
    cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration"
    }
}