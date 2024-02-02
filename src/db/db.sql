CREATE TYPE "bet_types" AS ENUM (
  'liquidity',
  'volume',
  'price'
);

CREATE TYPE "wagering_styles" AS ENUM (
  'individual',
  'group'
);

CREATE TYPE "bet_statuses" AS ENUM (
  'initiated',
  'approved',
  'close',
  'settled',
  'voided'
);

CREATE TABLE "tokens_snapshots" (
  "id" SERIAL PRIMARY KEY,
  "token_address" varchar,
  "price" decimal,
  "volume" decimal,
  "liquidity" decimal,
  "pair" varchar,
  "pair_type" varchar,
  "created_at" timestamp
);

CREATE TABLE "bets" (
  "id" SERIAL PRIMARY KEY,
  "token_snapshot_id" integer,
  "duration" integer,
  "bet_type" bet_types,
  "bet_status" bet_statuses,
  "wagering_style" wagering_styles,
  "transaction_hash" varchar,
  "originator_id" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "wallet_address" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "bet_entries" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "bet_id" integer,
  "amount_eth" decimal,
  "group" smallint,
  "transaction_hash" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "transactions" (
  "hash" varchar PRIMARY KEY,
  "from_address" varchar,
  "to_address" varchar,
  "value" varchar,
  "gas_price" varchar,
  "gas_used" varchar,
  "block_number" integer,
  "transaction_index" integer,
  "timestamp" timestamp
);

CREATE TABLE "results" (
  "id" SERIAL PRIMARY KEY,
  "bet_id" integer,
  "token_snapshot_id" integer,
  "winner_group" int,
  "transaction_hash" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "bet_entry_results" (
  "result_id" integer,
  "bet_entry_id" integer,
  "amount_eth" decimal,
  "transaction_hash" varchar,
  "created_at" timestamp,
  "updated_at" timestamp,
  PRIMARY KEY ("result_id", "bet_entry_id")
);

ALTER TABLE "bets" ADD FOREIGN KEY ("token_snapshot_id") REFERENCES "tokens_snapshots" ("id");
ALTER TABLE "bets" ADD FOREIGN KEY ("originator_id") REFERENCES "users" ("id");
ALTER TABLE "bet_entries" ADD FOREIGN KEY ("bet_id") REFERENCES "bets" ("id");
ALTER TABLE "bet_entries" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "bet_entries" ADD FOREIGN KEY ("transaction_hash") REFERENCES "transactions" ("hash");
ALTER TABLE "bets" ADD FOREIGN KEY ("transaction_hash") REFERENCES "transactions" ("hash");
ALTER TABLE "results" ADD FOREIGN KEY ("bet_id") REFERENCES "bets" ("id");
ALTER TABLE "results" ADD FOREIGN KEY ("token_snapshot_id") REFERENCES "tokens_snapshots" ("id");
ALTER TABLE "results" ADD FOREIGN KEY ("transaction_hash") REFERENCES "transactions" ("hash");
ALTER TABLE "bet_entry_results" ADD FOREIGN KEY ("result_id") REFERENCES "results" ("id");
ALTER TABLE "bet_entry_results" ADD FOREIGN KEY ("bet_entry_id") REFERENCES "bet_entries" ("id");
