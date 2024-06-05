/*
  Warnings:

  - You are about to drop the `_LikeToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LikeToUser" DROP CONSTRAINT "_LikeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikeToUser" DROP CONSTRAINT "_LikeToUser_B_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "details" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "likeId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likes" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- DropTable
DROP TABLE "_LikeToUser";
