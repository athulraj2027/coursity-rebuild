import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createWorker } from "./mediasoup/worker.js";
import { roomSocket, transportSocket } from "./socket/socket.js";
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware.js";
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

(async () => {
  await createWorker();
  io.on("connection", (socket) => {
    roomSocket(socket);
    transportSocket(socket);
  });

  server.listen(PORT, () => {
    console.log("Server running on port 5000");
  });
})();
