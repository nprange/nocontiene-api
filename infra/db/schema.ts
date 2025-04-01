import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),

  first_name: varchar({ length: 50 }).notNull(),
  last_name: varchar({ length: 75 }).notNull(),

  // For reference, GitHub limits usernames to 39 characters.
  username: varchar({ length: 30 }).notNull().unique(),

  // Why 254 in length? https://stackoverflow.com/a/1199238
  email: varchar({ length: 254 }).notNull().unique(),

  // Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
  password: varchar({ length: 60 }).notNull(),

  // Why timestamp with time zone? https://justatheory.com/2012/04/postgres-use-timestamptz/
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),

  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
