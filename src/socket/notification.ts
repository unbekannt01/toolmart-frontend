import { io } from "socket.io-client";

const token = localStorage.getItem("access_token");

export const notificationsSocket = io("http://localhost:3001/notifications", {
  auth: { token }, // JWT token for authentication
  transports: ["websocket"],
  reconnectionAttempts: 5,
});
