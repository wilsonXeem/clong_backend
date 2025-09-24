CREATE TABLE IF NOT EXISTS "volunteers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skills" varchar(500),
	"availability" varchar(200),
	"interests" varchar(300),
	"experience" text,
	"motivation" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
