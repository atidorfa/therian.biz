-- Add status field for Therian capsule system
ALTER TABLE "Therian" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';
