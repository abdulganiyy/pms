-- CreateEnum
CREATE TYPE "LaundryOrderStatus" AS ENUM ('PENDING', 'RECEIVED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LaundryItemType" AS ENUM ('WASH', 'DRY_CLEAN', 'IRON', 'PRESS', 'FOLD', 'OTHER');

-- CreateEnum
CREATE TYPE "GymMembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GymMembershipDuration" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateTable
CREATE TABLE "LaundryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "LaundryItemType" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaundryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaundryOrder" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "reservationId" TEXT,
    "folioId" TEXT,
    "status" "LaundryOrderStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaundryOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaundryOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "laundryItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaundryOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymMembershipPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" "GymMembershipDuration" NOT NULL,
    "durationValue" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymMembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymMembership" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "GymMembershipStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LaundryItem_type_idx" ON "LaundryItem"("type");

-- CreateIndex
CREATE INDEX "LaundryItem_isActive_idx" ON "LaundryItem"("isActive");

-- CreateIndex
CREATE INDEX "LaundryOrder_guestId_idx" ON "LaundryOrder"("guestId");

-- CreateIndex
CREATE INDEX "LaundryOrder_reservationId_idx" ON "LaundryOrder"("reservationId");

-- CreateIndex
CREATE INDEX "LaundryOrder_folioId_idx" ON "LaundryOrder"("folioId");

-- CreateIndex
CREATE INDEX "LaundryOrder_status_idx" ON "LaundryOrder"("status");

-- CreateIndex
CREATE INDEX "LaundryOrder_createdAt_idx" ON "LaundryOrder"("createdAt");

-- CreateIndex
CREATE INDEX "LaundryOrderItem_orderId_idx" ON "LaundryOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "LaundryOrderItem_laundryItemId_idx" ON "LaundryOrderItem"("laundryItemId");

-- CreateIndex
CREATE INDEX "GymMembershipPlan_isActive_idx" ON "GymMembershipPlan"("isActive");

-- CreateIndex
CREATE INDEX "GymMembership_guestId_idx" ON "GymMembership"("guestId");

-- CreateIndex
CREATE INDEX "GymMembership_planId_idx" ON "GymMembership"("planId");

-- CreateIndex
CREATE INDEX "GymMembership_status_idx" ON "GymMembership"("status");

-- CreateIndex
CREATE INDEX "GymMembership_startDate_idx" ON "GymMembership"("startDate");

-- CreateIndex
CREATE INDEX "GymMembership_endDate_idx" ON "GymMembership"("endDate");

-- AddForeignKey
ALTER TABLE "LaundryOrder" ADD CONSTRAINT "LaundryOrder_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaundryOrder" ADD CONSTRAINT "LaundryOrder_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaundryOrder" ADD CONSTRAINT "LaundryOrder_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "Folio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaundryOrderItem" ADD CONSTRAINT "LaundryOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LaundryOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaundryOrderItem" ADD CONSTRAINT "LaundryOrderItem_laundryItemId_fkey" FOREIGN KEY ("laundryItemId") REFERENCES "LaundryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymMembership" ADD CONSTRAINT "GymMembership_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymMembership" ADD CONSTRAINT "GymMembership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "GymMembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
