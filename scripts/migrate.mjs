import { closeDatabase, migrateDatabase } from "../src/server/db.mjs";

try {
  await migrateDatabase();
  console.log("Banco FARO pronto; somente migrações pendentes foram aplicadas.");
} catch (error) {
  console.error(`Migração FARO falhou: ${error?.code || error?.name || "unknown"}`);
  process.exitCode = 1;
} finally {
  await closeDatabase().catch(() => {});
}
