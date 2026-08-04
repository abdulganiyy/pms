-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ReservationPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('WALK_IN', 'ONLINE', 'PHONE', 'EMAIL', 'OTA', 'CORPORATE', 'GROUP');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'BILLING', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT', 'VISA');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYSTACK', 'FLUTTERWAVE', 'CASH', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "fullname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailOtpHash" TEXT,
    "emailOtpExpiresAt" TIMESTAMP(3),
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordExpiresAt" TIMESTAMP(3),
    "pin" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "paystackCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "nationality" TEXT,
    "language" TEXT,
    "occupation" TEXT,
    "profileImage" TEXT,
    "passportId" TEXT,
    "loyaltyNumber" TEXT,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "vip" BOOLEAN NOT NULL DEFAULT false,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestAddress" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestDocument" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "issuingCountry" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "imageFront" TEXT,
    "imageBack" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestEmergencyContact" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,

    CONSTRAINT "GuestEmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestPaymentMethod" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "token" TEXT NOT NULL,
    "last4" TEXT,
    "brand" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "paymentStatus" "ReservationPaymentStatus" NOT NULL,
    "type" "ReservationType" NOT NULL,
    "status" "ReservationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_loyaltyNumber_key" ON "Guest"("loyaltyNumber");

-- CreateIndex
CREATE INDEX "Guest_lastName_idx" ON "Guest"("lastName");

-- CreateIndex
CREATE INDEX "Guest_phone_idx" ON "Guest"("phone");

-- CreateIndex
CREATE INDEX "Guest_email_idx" ON "Guest"("email");

-- CreateIndex
CREATE INDEX "GuestDocument_documentNumber_idx" ON "GuestDocument"("documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestAddress" ADD CONSTRAINT "GuestAddress_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestDocument" ADD CONSTRAINT "GuestDocument_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestEmergencyContact" ADD CONSTRAINT "GuestEmergencyContact_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPaymentMethod" ADD CONSTRAINT "GuestPaymentMethod_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
