import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

// This is a placeholder schema to ensure drizzle compiles.
// We will migrate the full DBML schema to Drizzle shortly.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name').notNull(),
  email: varchar('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
