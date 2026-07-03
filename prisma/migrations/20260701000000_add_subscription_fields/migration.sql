-- AlterTable
ALTER TABLE `Hospital` ADD COLUMN `billingCycle` ENUM('MONTHLY', 'YEARLY') NULL,
    ADD COLUMN `subscriptionEndDate` DATETIME(3) NULL,
    ADD COLUMN `subscriptionPlan` ENUM('STARTER', 'PROFESSIONAL', 'ENTERPRISE') NULL,
    ADD COLUMN `subscriptionStartDate` DATETIME(3) NULL,
    ADD COLUMN `subscriptionStatus` ENUM('TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED') NOT NULL DEFAULT 'TRIAL',
    ADD COLUMN `trialEndDate` DATETIME(3) NULL,
    ADD COLUMN `trialStartDate` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `SubscriptionPayment` (
    `id` VARCHAR(191) NOT NULL,
    `hospitalId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `plan` ENUM('STARTER', 'PROFESSIONAL', 'ENTERPRISE') NOT NULL,
    `cycle` ENUM('MONTHLY', 'YEARLY') NOT NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NOT NULL,
    `notes` TEXT NULL,
    `recordedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SubscriptionPayment_hospitalId_idx`(`hospitalId`),
    INDEX `SubscriptionPayment_hospitalId_paidAt_idx`(`hospitalId`, `paidAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubscriptionPayment` ADD CONSTRAINT `SubscriptionPayment_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospital`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
