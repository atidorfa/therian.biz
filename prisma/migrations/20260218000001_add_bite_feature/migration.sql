-- Add bite-related fields to Therian
ALTER TABLE "Therian" ADD COLUMN "name" TEXT;
ALTER TABLE "Therian" ADD COLUMN "bites" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Therian" ADD COLUMN "lastBiteAt" TIMESTAMP(3);

-- Unique constraint on Therian name
CREATE UNIQUE INDEX "Therian_name_key" ON "Therian"("name");

-- CreateTable BattleLog
CREATE TABLE "BattleLog" (
  "id" TEXT NOT NULL,
  "challengerId" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "winnerId" TEXT NOT NULL,
  "rounds" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BattleLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey BattleLog -> Therian (challenger)
ALTER TABLE "BattleLog" ADD CONSTRAINT "BattleLog_challengerId_fkey"
  FOREIGN KEY ("challengerId") REFERENCES "Therian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey BattleLog -> Therian (target)
ALTER TABLE "BattleLog" ADD CONSTRAINT "BattleLog_targetId_fkey"
  FOREIGN KEY ("targetId") REFERENCES "Therian"("id") ON DELETE CASCADE ON UPDATE CASCADE;
