import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export interface AuthenticatedSocket extends Socket {
  userId: string;
  role: string;
  username: string;
}

export const socketAuthMiddleware = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void,
) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.cookie
        ?.split("; ")
        .find((c) => c.startsWith("auth_token="))
        ?.split("=")[1];

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      username: string;
    };

    console.log("token : ", decoded);
    socket.userId = decoded.userId;
    socket.role = decoded.role;
    socket.username = decoded.username;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
