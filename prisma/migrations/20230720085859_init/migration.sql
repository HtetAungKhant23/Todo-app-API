/*
  Warnings:

  - You are about to drop the column `image_id` on the `profile` table. All the data in the column will be lost.
  - Added the required column `profile_id` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_image_id_fkey`;

-- AlterTable
ALTER TABLE `file` ADD COLUMN `profile_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `image_id`;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
