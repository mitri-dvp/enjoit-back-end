/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles_on_user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_on_user_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "roles_on_user_roles" DROP CONSTRAINT "roles_on_user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "roles_on_user_roles" DROP CONSTRAINT "roles_on_user_roles_user_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_user_roles" DROP CONSTRAINT "users_on_user_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_on_user_roles" DROP CONSTRAINT "users_on_user_roles_user_role_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "Role" DEFAULT 'USER';

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "roles_on_user_roles";

-- DropTable
DROP TABLE "user_role";

-- DropTable
DROP TABLE "users_on_user_roles";
