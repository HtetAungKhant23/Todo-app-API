-- AlterTable
ALTER TABLE `todo` ADD COLUMN `complete_status` ENUM('DONE', 'UNDONE') NOT NULL DEFAULT 'UNDONE';
