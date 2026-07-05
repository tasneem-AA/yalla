/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,platform]` on the table `Download` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "Review";

-- CreateIndex
CREATE UNIQUE INDEX "Download_userId_platform_key" ON "Download"("userId", "platform");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
