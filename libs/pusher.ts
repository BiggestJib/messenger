import PusherServer from "pusher"; // Importing the Pusher library for server-side usage
import PusherClient from "pusher-js"; // Importing the Pusher JavaScript library for client-side usage

// Initializing a Pusher instance for server-side communication
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!, // The Pusher app ID, retrieved from environment variables (server-side)
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, // The Pusher app public key, accessible from both server and client
  secret: process.env.PUSHER_SECRET!, // The secret key for server-side authentication, kept in environment variables
  cluster: "mt1", // The Pusher cluster, typically depends on the location of the Pusher app (e.g., "eu" for Europe)
  useTLS: true, // Enabling TLS to ensure secure, encrypted communication between the server and Pusher
});

// Initializing a Pusher instance for client-side communication
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, // The Pusher app public key used for client-side communication
  {
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
    cluster: "mt1", // The cluster for the client-side, which must match the server's cluster
  }
);
