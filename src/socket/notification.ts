import { io } from "socket.io-client";

const token = localStorage.getItem("access_token");

export const notificationsSocket = io("https://nestjs-openapi-1.onrender.com/notifications", {
  auth: { token }, // JWT token for authentication
  transports: ["websocket"],
  reconnectionAttempts: 5,
});
