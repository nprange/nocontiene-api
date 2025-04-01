import { resolve } from 'node:path';
import { sql } from 'drizzle-orm';
import retry from 'async-retry';
import { query, db, closeDatabasePool } from 'infra/db/database';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3333/api/v1/status');

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await query(sql`drop schema public cascade; create schema public;`);
}

async function runPendingMigrations() {
  await migrate(db, {
    migrationsFolder: resolve('infra', 'migrations'),
    migrationsTable: 'pgmigrations',
    migrationsSchema: 'public',
  });
}

async function closeDatabaseConnection() {
  await closeDatabasePool();
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  closeDatabaseConnection,
};

export default orchestrator;
