import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

let pool;

export function getDbPool() {
  if (!process.env.DATABASE_URL) throw new Error("database_unavailable");
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL, {
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 2,
      idleTimeout: 60_000,
      enableKeepAlive: true,
      timezone: "Z",
    });
  }
  return pool;
}

export async function migrateDatabase() {
  const db = getDbPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS faro_schema_migrations (
      version INT NOT NULL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const migrationDir = path.resolve(process.cwd(), "migrations");
  const files = fs
    .readdirSync(migrationDir)
    .filter((name) => /^\d{3}_[a-z0-9_-]+\.sql$/i.test(name))
    .sort();

  for (const filename of files) {
    const version = Number(filename.slice(0, 3));
    const [applied] = await db.execute(
      "SELECT version FROM faro_schema_migrations WHERE version = ? LIMIT 1",
      [version],
    );
    if (applied.length) continue;

    const sql = fs
      .readFileSync(path.join(migrationDir, filename), "utf8")
      .split("\n")
      .filter((line) => !line.trimStart().startsWith("--"))
      .join("\n");
    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) await db.query(statement);
    await db.execute(
      "INSERT IGNORE INTO faro_schema_migrations (version, filename) VALUES (?, ?)",
      [version, filename],
    );
    console.log(`database_migration_applied=${version}`);
  }

  await db.query("SELECT 1");
}

export async function closeDatabase() {
  if (!pool) return;
  const active = pool;
  pool = undefined;
  await active.end();
}
