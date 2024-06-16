"use client";

import { useOptimistic } from "react";

import { deleteReservation } from "../_lib/actions";

import ReservationCard from "./ReservationCard";

const ReservationList = ({ bookings }: { bookings: any }) => {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBooking, bookingId) => {
      return curBooking.filter((booking: any) => booking.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking: any) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
