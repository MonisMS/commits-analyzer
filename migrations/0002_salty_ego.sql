ALTER TABLE "user" ADD COLUMN "github_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "github_token" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_github_id_unique" UNIQUE("github_id");