/*
  Warnings:

  - You are about to drop the column `assetId` on the `ExistingTrade` table. All the data in the column will be lost.
  - Added the required column `asset` to the `ExistingTrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `margin` to the `ExistingTrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ExistingTrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ExistingTrade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TradeType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "public"."Asset" AS ENUM ('BTC', 'ETH', 'SOL');

-- AlterTable
ALTER TABLE "public"."ExistingTrade" DROP COLUMN "assetId",
ADD COLUMN     "asset" "public"."Asset" NOT NULL,
ADD COLUMN     "margin" INTEGER NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" "public"."TradeType" NOT NULL;
