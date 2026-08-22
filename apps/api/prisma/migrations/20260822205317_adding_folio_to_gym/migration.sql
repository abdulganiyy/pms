-- CreateEnum
CREATE TYPE "LaundryPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'ROOM_CHARGED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "GymPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'ROOM_CHARGED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "GymSettlementMethod" AS ENUM ('DIRECT_PAYMENT', 'ROOM_CHARGE');

-- AlterTable
ALTER TABLE "GymMembership" ADD COLUMN     "paymentStatus" "GymPaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "reservationId" TEXT,
ADD COLUMN     "settlementMethod" "GymSettlementMethod";

-- AlterTable
ALTER TABLE "LaundryOrder" ADD COLUMN     "paymentStatus" "LaundryPaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "gymMembershipId" TEXT,
ADD COLUMN     "laundryOrderId" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_laundryOrderId_fkey" FOREIGN KEY ("laundryOrderId") REFERENCES "LaundryOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_gymMembershipId_fkey" FOREIGN KEY ("gymMembershipId") REFERENCES "GymMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymMembership" ADD CONSTRAINT "GymMembership_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
