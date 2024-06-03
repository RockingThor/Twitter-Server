-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_followersId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_followingId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" SET DEFAULT 'Welcome to my twitter profile.',
ALTER COLUMN "followersId" DROP NOT NULL,
ALTER COLUMN "followingId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_followersId_fkey" FOREIGN KEY ("followersId") REFERENCES "Followers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Following"("id") ON DELETE SET NULL ON UPDATE CASCADE;
