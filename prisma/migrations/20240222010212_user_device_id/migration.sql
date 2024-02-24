/*
  Warnings:

  - A unique constraint covering the columns `[device_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "device_id" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "user_device_id_key" ON "user"("device_id");
