import { integer, text, pgTable, serial, primaryKey, real } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  manager_id: integer("manager_id").notNull().unique(),
  email: text("email").notNull(),
  wallet_address: text("wallet_address").notNull().unique(),
});

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  creator_id: integer("creator_id").notNull().references(() => accounts.id),
  events_included: integer("events_included").notNull(),
});

export const league_members = pgTable("league_members", {
  league_id: integer("league_id").notNull().references(() => leagues.id),
  member_id: integer("member_id").notNull().references(() => accounts.id),
}, (table) =>  {
    return {
      pk: primaryKey({columns: [table.league_id, table.member_id]}),
      pkWithCustomName: primaryKey({name: 'custom_league_member', columns: [table.league_id, table.member_id]})
    };
});

export const competition = pgTable("competition", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  league_id: integer("league_id").references(() => leagues.id),
  entry_fee: real("entry_fee").notNull()
});

export const competition_members = pgTable("competition_members", {
  competition_id: integer("competition_id").notNull().references(() => competition.id),
  member_id: integer("member_id").notNull().references(() => accounts.id)
}, (table) => {
  return {
    pk: primaryKey({columns: [table.competition_id, table.member_id]}),
    pkWithCustomName: primaryKey({name: 'custom_competition_member', columns: [table.competition_id, table.member_id]})
  }
});
