import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(__dirname, "../../data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error creating db", err);
        process.exit(1);
    }
    console.log("Connected to the database", dbPath);
    db.run("PRAGMA foreign_keys = ON;");

});
