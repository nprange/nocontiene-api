import type { SQL } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ServiceError } from '../errors';
import { env } from '../env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: getSSLValues(),
});

export const db = drizzle({
  client: pool,
  schema,
  logger: env.NODE_ENV === 'development',
});

export async function query(sqlStatement: SQL) {
  try {
    const result = await db.execute(sqlStatement);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: 'Error during Database connection or Query execution.',
      cause: error,
    });
    throw serviceErrorObject;
  }
}

export async function closeDatabasePool() {
  await pool.end();
}

function getSSLValues() {
  if (env.POSTGRES_CA) {
    return {
      ca: env.POSTGRES_CA,
    };
  }

  return env.NODE_ENV === 'production';
}
