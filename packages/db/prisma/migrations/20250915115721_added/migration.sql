-- AlterTable
ALTER TABLE "public"."ExistingTrade" ALTER COLUMN "liquidated" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "lastLoggedIn" DROP NOT NULL;
