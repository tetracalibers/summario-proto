CREATE TABLE "folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_folders_parent_name" UNIQUE("parent_id","name")
);
--> statement-breakpoint
CREATE TABLE "term_aliases" (
	"id" serial PRIMARY KEY NOT NULL,
	"term_id" integer NOT NULL,
	"alias" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_alias_per_term" UNIQUE("term_id","alias")
);
--> statement-breakpoint
CREATE TABLE "term_edges" (
	"source_term_id" integer NOT NULL,
	"target_term_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_term_edges" PRIMARY KEY("source_term_id","target_term_id")
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"folder_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "term_aliases" ADD CONSTRAINT "term_aliases_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_edges" ADD CONSTRAINT "term_edges_source_term_id_terms_id_fk" FOREIGN KEY ("source_term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_edges" ADD CONSTRAINT "term_edges_target_term_id_terms_id_fk" FOREIGN KEY ("target_term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_folders_parent" ON "folders" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_term_aliases_alias" ON "term_aliases" USING btree ("alias");--> statement-breakpoint
CREATE INDEX "idx_term_aliases_term" ON "term_aliases" USING btree ("term_id");--> statement-breakpoint
CREATE INDEX "idx_terms_title" ON "terms" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_terms_folder" ON "terms" USING btree ("folder_id");