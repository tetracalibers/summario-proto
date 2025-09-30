ALTER TABLE "term_aliases" RENAME COLUMN "alias" TO "title";--> statement-breakpoint
ALTER TABLE "term_aliases" DROP CONSTRAINT "uniq_alias_per_term";--> statement-breakpoint
DROP INDEX "idx_term_aliases_alias";--> statement-breakpoint
CREATE INDEX "idx_term_aliases_title" ON "term_aliases" USING btree ("title");--> statement-breakpoint
ALTER TABLE "term_aliases" ADD CONSTRAINT "uniq_alias_per_term" UNIQUE("term_id","title");