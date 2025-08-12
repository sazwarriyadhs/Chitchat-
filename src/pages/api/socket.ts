
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO, Socket } from "socket.io";
import { Message } from "@/lib/types";

// This is a type assertion for the NextApiResponse
type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

// Path for the socket.io server
export const config = {
  api: {
    bodyParser: false,
  },
};

const socketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    // Adapt the server to socket.io
    const io = new ServerIO(res.socket.server as any, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);
      
      socket.on("join-chat", (chatId: string) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat: ${chatId}`);
      });

      socket.on("leave-chat", (chatId: string) => {
        socket.leave(chatId);
        console.log(`User ${socket.id} left chat: ${chatId}`);
      });

      socket.on("chat-message", ({ chatId, message }: { chatId: string; message: Message }) => {
        // Broadcast the message to all clients in the chat room except the sender
        socket.to(chatId).emit("new-message", message);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  res.end();
};

export default socketHandler;
