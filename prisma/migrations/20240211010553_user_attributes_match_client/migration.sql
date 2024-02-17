/*
  Warnings:

  - Added the required column `birth_date` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `birth_country` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_state` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_city` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_prefix` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "document_type" DROP NOT NULL,
ALTER COLUMN "document_id" DROP NOT NULL,
DROP COLUMN "birth_date",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "birth_country" SET NOT NULL,
ALTER COLUMN "birth_state" SET NOT NULL,
ALTER COLUMN "birth_city" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "phone_prefix" SET NOT NULL;
