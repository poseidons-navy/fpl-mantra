CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"manager_id" integer NOT NULL,
	"email" text NOT NULL,
	"wallet_address" text NOT NULL,
	CONSTRAINT "accounts_manager_id_unique" UNIQUE("manager_id"),
	CONSTRAINT "accounts_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "competition" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"league_id" integer,
	"entry_fee" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "competition_members" (
	"competition_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "competition_members_competition_id_member_id_pk" PRIMARY KEY("competition_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "league_members" (
	"league_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "league_members_league_id_member_id_pk" PRIMARY KEY("league_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leagues" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"league_id" integer NOT NULL,
	"events_included" integer NOT NULL,
	CONSTRAINT "leagues_name_unique" UNIQUE("name"),
	CONSTRAINT "leagues_league_id_unique" UNIQUE("league_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "competition" ADD CONSTRAINT "competition_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "competition_members" ADD CONSTRAINT "competition_members_competition_id_competition_id_fk" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "competition_members" ADD CONSTRAINT "competition_members_member_id_accounts_id_fk" FOREIGN KEY ("member_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "league_members" ADD CONSTRAINT "league_members_league_id_leagues_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "leagues"("league_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "league_members" ADD CONSTRAINT "league_members_member_id_accounts_manager_id_fk" FOREIGN KEY ("member_id") REFERENCES "accounts"("manager_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
