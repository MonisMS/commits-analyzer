CREATE TABLE "analytics_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cache_key" text NOT NULL,
	"data" jsonb NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"repository_id" text NOT NULL,
	"github_commit_sha" text NOT NULL,
	"message" text NOT NULL,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"committed_at" timestamp NOT NULL,
	"classification" text NOT NULL,
	"files_changed" integer NOT NULL,
	"additions" integer NOT NULL,
	"deletions" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"github_repo_id" integer NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"private" boolean NOT NULL,
	"language" text,
	"last_sync_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_cache" ADD CONSTRAINT "analytics_cache_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;