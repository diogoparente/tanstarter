import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  avatar_url: text(),
  email: text().unique().notNull(),
  // Auth fields
  password: text(), // For email/password auth
  provider: text(), // 'email', 'google', etc.
  provider_user_id: text(), // OAuth provider's user ID
  email_verified: boolean().default(false).notNull(),
  // Timestamps
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  setup_at: timestamp(),
  terms_accepted_at: timestamp(),
});

export const session = pgTable("session", {
  id: text().primaryKey(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  expires_at: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
