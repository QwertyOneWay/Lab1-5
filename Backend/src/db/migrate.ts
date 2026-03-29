import fs from "fs";
import path from "path";
import { run, all } from "./dbClient";

export const migrate = async () => {
    try {
        // 1. Створюємо "щоденник" міграцій (вимога методички)
        await run(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Дізнаємося, які міграції ВЖЕ були виконані раніше
        const appliedMigrations = await all("SELECT filename FROM schema_migrations;");
        const appliedFiles = appliedMigrations.map((m: any) => m.filename);

        // 3. Шукаємо всі файли .sql у папці migrations
        const migrationsDir = path.join(__dirname, "../migrations");
        const files = fs.readdirSync(migrationsDir).sort();

        // 4. Проходимося по кожному файлу
        for (const file of files) {
            if (!appliedFiles.includes(file)) {
                console.log(`⏳ Виконується міграція: ${file}...`);

                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, "utf-8");

                // === ВИПРАВЛЕННЯ БАГУ БІБЛІОТЕКИ ===
                // Розрізаємо великий текст файлу на окремі команди по символу ";"
                const queries = sql.split(";").map((q) => q.trim()).filter((q) => q.length > 0);

                // Виконуємо кожну команду строго по черзі
                for (const query of queries) {
                    await run(query);
                }
                // ===================================

                // 5. Записуємо в "щоденник", що цей файл успішно виконано
                await run(`INSERT INTO schema_migrations (filename) VALUES ('${file}');`);
                console.log(`✅ Міграція ${file} успішно застосована!`);
            }
        }

        console.log("🚀 Усі міграції бази даних актуальні!");
    } catch (error) {
        console.error("🛑 Помилка під час міграції бази даних:", error);
    }
};