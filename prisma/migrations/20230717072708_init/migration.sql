-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NULL,
    `otp` VARCHAR(6) NULL,
    `otpUsed` ENUM('USED', 'UNUSED') NOT NULL DEFAULT 'UNUSED',
    `refresh_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todo` (
    `id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
