/*
  Warnings:

  - You are about to drop the column `full_name` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Manager` table. All the data in the column will be lost.
  - Added the required column `name` to the `Manager` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Manager_google_id_key";

-- DropIndex
DROP INDEX "Manager_username_key";

-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "full_name",
DROP COLUMN "google_id",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL;
