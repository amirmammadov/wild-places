"use server";

import { signIn, signOut, auth } from "./auth";
import { getBookings } from "./data-service";

import { supabase } from "./supabase";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteReservation = async (bookingId: number) => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in !");
  }

  //@ts-ignore
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are now allowed to delete this booking!");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted!");
  }

  revalidatePath("/account/reservations");
};

export const updateReservation = async (formData: any) => {
  const session = await auth();

  if (!session) {
    throw new Error("You must be logged in!");
  }

  const bookingId = Number(formData.get("id"));
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations").slice(0, 100);

  //@ts-ignore
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are now allowed to update this booking!");
  }

  const updateData = { numGuests, observations };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    //@ts-ignore
    .eq("id", bookingId);

  if (error) {
    throw new Error("Guest could not be updated!");
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
};

export const updateProfile = async (formData: any) => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in!");
  }

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please, provide a valid national ID!");
  }

  const updateData = { nationalID, nationality, countryFlag };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    //@ts-ignore
    .eq("id", session.user?.guestId);

  if (error) {
    throw new Error("Guest could not be updated!");
  }

  revalidatePath("/accout/profile");
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
