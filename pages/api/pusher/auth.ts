// pages/api/pusher/auth.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/libs/pusher";
import { authOptions } from "@/app/libs/authOptions";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);

  if (!session?.user?.email) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const socketId = request.body.socket_id; // Should be `socket_id` as per Pusher's convention
  const channel = request.body.channel_name;

  if (!socketId || !channel) {
    return response.status(400).json({ message: "Missing parameters" });
  }

  const data = {
    user_id: session.user.email,
  };

  try {
    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return response.send(authResponse);
  } catch (error) {
    console.error("Pusher authorization error:", error);
    return response
      .status(500)
      .json({ message: "Pusher authorization failed" });
  }
}
