-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountUpdatedAt" TIMESTAMP(3),
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
