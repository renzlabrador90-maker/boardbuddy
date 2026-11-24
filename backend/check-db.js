let pool;

async function checkDatabase() {
  try {
    pool = require("./config/db");

    const [databaseRows] = await pool.query("SELECT DATABASE() AS database_name");
    const [tableRows] = await pool.query(
      "SELECT table_name FROM information_schema.tables " +
        "WHERE table_schema = DATABASE() AND table_name IN ('users', 'rooms', 'room_assignments')"
    );

    const found = new Set(tableRows.map((row) => row.TABLE_NAME || row.table_name));
    const missing = ["users", "rooms", "room_assignments"].filter(
      (name) => !found.has(name)
    );

    console.log(`Connected to MySQL database: ${databaseRows[0].database_name}`);
    if (missing.length > 0) {
      throw new Error(`Missing tables: ${missing.join(", ")}. Run database/schema.sql in MySQL Workbench.`);
    }
    console.log("BoardBuddy tables are ready.");
  } catch (error) {
    console.error(`Database check failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (pool) await pool.end();
  }
}

checkDatabase();
