DROP TABLE "oauth_account" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "provider" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "provider_user_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;