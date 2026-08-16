import { ReservationType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DetailItem } from "../DetailItem";
import { format, differenceInCalendarDays } from "date-fns";
import Image from "next/image";
import EditReservation from "./EditReservation";
import { useState } from "react";
import CancelReservation from "./CancelReservation";
import ChangeReservationRoom from "./ChangeReservationRoom";
import CheckInReservation from "./CheckInReservation";
import CheckOutReservation from "./CheckOutReservation";
import ViewReservationFolio from "./ViewReservationFolio";
import MakeReservationPayment from "./MakeReservationPayment";

type ReservationDetailsProps = {
  reservation: ReservationType;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const ReservationDetails = ({
  reservation,
  openDialog,
  setOpenDialog,
}: ReservationDetailsProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openChangeRoom, setOpenChangeRoom] = useState(false);
  const [openCheckin, setOpenCheckin] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openFolio, setOpenFoilio] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const canEdit =
    reservation.status === "CONFIRMED" || reservation.status === "CHECKED_IN";

  const canChangeRoom =
    reservation.status === "CONFIRMED" || reservation.status === "CHECKED_IN";

  const canCheckIn =
    reservation.status === "CONFIRMED" || reservation.status === "PENDING";

  const canCheckOut = reservation.status === "CHECKED_IN";

  const canCancel =
    reservation.status === "CONFIRMED" || reservation.status === "PENDING";

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="min-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Booking Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="CheckIn Date"
                value={
                  reservation.checkIn
                    ? format(new Date(reservation.checkIn), "PPP")
                    : undefined
                }
              />
              <DetailItem
                label="CheckOut Date"
                value={
                  reservation.checkOut
                    ? format(new Date(reservation.checkOut), "PPP")
                    : undefined
                }
              />

              <DetailItem
                label="Nights"
                value={differenceInCalendarDays(
                  reservation.checkOut,
                  reservation.checkIn,
                )}
              />

              <DetailItem
                label="Rate"
                value={`${new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: `${reservation.roomRate?.currency ?? "NGN"}`,
                  maximumFractionDigits: 0,
                }).format(reservation.roomRate?.price ?? 0)} / night`}
              />

              <DetailItem
                label="Total Amount"
                value={`${new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: `${reservation.roomRate?.currency ?? "NGN"}`,
                  maximumFractionDigits: 0,
                }).format(reservation.totalAmount ?? 0)}`}
              />

              <DetailItem
                label="Reservation Type"
                value={reservation.type}
                statusType="reservationType"
              />

              {/* <DetailItem
                label="Payment Status"
                value={reservation.paymentStatus}
                statusType="payment"
              /> */}

              <DetailItem
                label="Status"
                value={reservation.status}
                statusType="reservation"
              />

              <DetailItem label="Adults" value={reservation.adults} />

              <DetailItem label="Children" value={reservation.children} />
            </div>
          </section>

          <Separator />

          {/* Personal Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="First Name"
                value={reservation?.guest.firstName}
              />

              <DetailItem
                label="Last Name"
                value={reservation?.guest.lastName}
              />

              <DetailItem label="Email" value={reservation?.guest.email} />

              <DetailItem label="Phone" value={reservation?.guest.phone} />

              <DetailItem label="Gender" value={reservation?.guest.gender} />

              <DetailItem
                label="Date of Birth"
                value={
                  reservation?.guest.dateOfBirth
                    ? format(new Date(reservation?.guest.dateOfBirth), "PPP")
                    : undefined
                }
              />
            </div>
          </section>

          <Separator />

          {/* Address */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Address
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Country"
                value={reservation?.guest.nationality}
              />
            </div>
          </section>

          <Separator />

          {/* Identification */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Identification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Nationality"
                value={reservation?.guest.nationality}
              />
            </div>
          </section>

          <Separator />

          {/* Additional */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Additional Information
            </h3>

            {reservation.guest.passportId && (
              <Image
                alt="Profile image"
                src={reservation.guest.passportId}
                width={100}
                height={100}
              />
            )}
          </section>

          <Separator />

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Financial Actions
            </h3>
            <div className="flex gap-2">
              {reservation.status == "CHECKED_IN" && (
                <ViewReservationFolio
                  reservationId={reservation.id}
                  open={openFolio}
                  setOpen={setOpenFoilio}
                />
              )}

              {reservation.status == "CHECKED_IN" && (
                <MakeReservationPayment
                  reservation={reservation}
                  open={openPaymentModal}
                  setOpen={setOpenPaymentModal}
                />
              )}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Actions
            </h3>
            <div className="flex gap-2">
              {canEdit && (
                <EditReservation
                  reservation={reservation}
                  open={openEdit}
                  setOpen={setOpenEdit}
                />
              )}

              {canChangeRoom && (
                <ChangeReservationRoom
                  reservation={reservation}
                  open={openChangeRoom}
                  setOpen={setOpenChangeRoom}
                />
              )}

              {canCheckIn && (
                <CheckInReservation
                  reservationId={reservation.id}
                  open={openCheckin}
                  setOpen={setOpenCheckin}
                />
              )}

              {canCheckOut && (
                <CheckOutReservation
                  reservationId={reservation.id}
                  open={openCheckout}
                  setOpen={setOpenCheckout}
                />
              )}

              {canCancel && (
                <CancelReservation
                  reservationId={reservation.id}
                  open={openCancel}
                  setOpen={setOpenCancel}
                />
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetails;
