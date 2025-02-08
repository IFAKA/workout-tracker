import {
  addUser,
  deleteUser,
  getUserByAuthId,
  updateUser,
} from "@/app/actions/user";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { toKebabCase } from "@/utils/string";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with the payload
  if (evt.type === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    const newUser = {
      authId: id,
      email: email_addresses[0].email_address,
      username: username ?? toKebabCase(`${first_name} ${last_name}`),
      imageUrl: image_url,
    };

    const existingUser = await getUserByAuthId(id);

    if (existingUser) {
      return NextResponse.json({
        message: "User already exists",
        user: existingUser,
      });
    }

    const addedUser = await addUser(newUser);

    return NextResponse.json({ message: "addedUser OK", user: addedUser });
  }
  // UPDATE
  if (evt.type === "user.updated") {
    const {
      id: authId,
      email_addresses,
      image_url,
      username,
      first_name,
      last_name,
    } = evt.data;

    const user = {
      email_addresses: email_addresses[0].email_address,
      username: username ?? toKebabCase(`${first_name} ${last_name}`),
      imageUrl: image_url,
    };

    const updatedUser = await updateUser(authId, user);

    return NextResponse.json({ message: "updatedUser OK", user: updatedUser });
  }

  // DELETE
  if (evt.type === "user.deleted") {
    const { id: authId } = evt.data;

    if (!authId) {
      return new Response("Error occured -- no authId", {
        status: 400,
      });
    }

    const deletedUser = await deleteUser(authId);

    return NextResponse.json({ message: "deletedUser OK", user: deletedUser });
  }

  return new Response("Webhook received", { status: 200 });
}
