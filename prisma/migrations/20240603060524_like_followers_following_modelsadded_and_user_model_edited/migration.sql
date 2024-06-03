/*
  Warnings:

  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followersId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "backgroundImage" TEXT,
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "followersId" INTEGER NOT NULL,
ADD COLUMN     "followingId" INTEGER NOT NULL,
ALTER COLUMN "profileImage" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Followers" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Following" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_tweetId_key" ON "Like"("tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "_LikeToUser_AB_unique" ON "_LikeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LikeToUser_B_index" ON "_LikeToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_followersId_fkey" FOREIGN KEY ("followersId") REFERENCES "Followers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Following"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD CONSTRAINT "_LikeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Like"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD CONSTRAINT "_LikeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
