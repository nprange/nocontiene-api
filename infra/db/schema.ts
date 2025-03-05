import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),

  // Why 254 in length? https://stackoverflow.com/a/1199238
  email: varchar({ length: 254 }).notNull().unique(),

  // Why 72 in length? https://security.stackexchange.com/a/39851
  password: varchar({ length: 72 }).notNull(),

  // Why timestamp with time zone? https://justatheory.com/2012/04/postgres-use-timestamptz/
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
