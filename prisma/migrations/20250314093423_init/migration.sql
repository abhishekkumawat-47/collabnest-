-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'IN_PROGRESS';

-- CreateTable
CREATE TABLE "Subtask" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "deadline" TIMESTAMP(3),
    "projectId" UUID NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
