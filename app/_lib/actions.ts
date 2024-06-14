"use server";

import { signIn, signOut, auth } from "./auth";

import { supabase } from "./supabase";

import { revalidatePath } from "next/cache";

export const updateProfile = async (formData: any) => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in !");
  }

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please, provide a valid national ID !");
  }

  const updateData = { nationalID, nationality, countryFlag };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    //@ts-ignore
    .eq("id", session.user?.guestId);

  if (error) {
    throw new Error("Guest could not be updated !");
  }

  revalidatePath("/accout/profile");
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
