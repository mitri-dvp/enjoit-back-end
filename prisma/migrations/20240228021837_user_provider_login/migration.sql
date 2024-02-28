-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'FACEBOOK', 'GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "provider" "Provider" DEFAULT 'LOCAL';
