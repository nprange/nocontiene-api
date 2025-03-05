import { query } from 'infra/db/database';
import { sql } from 'drizzle-orm';
import { env } from 'infra/env';
import { type Status, statusSchema } from '../schemas/statusSchema';

export async function getHandler(): Promise<Status> {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await query(sql`SHOW server_version;`);
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await query(sql`SHOW max_connections;`);
  const databaseMaxConnectionsValue = databaseMaxConnectionsResult.rows[0]
    .max_connections as string;

  const databaseName = env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await query(
    sql`SELECT count(*)::int FROM pg_stat_activity WHERE datname = ${databaseName};`
  );
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  return statusSchema.parse({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: Number.parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
