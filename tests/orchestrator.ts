import { sql } from 'drizzle-orm';
import retry from 'async-retry';
import { query } from 'infra/db/database';

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

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
