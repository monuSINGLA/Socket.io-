## Socket.io for chat application



import express from "express";
import cors from "cors";

import { Server } from "socket.io";
import { createServer } from "http";


const PORT = 7000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log("User Connected",socket.id);


  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("message", ({message, room})=>{
    console.log({message, room})
    socket.to(room).emit("recieved-message", message)

  })
  

  socket.on("disconnect", ()=>{
    console.log("User Disconnected", socket.id)
  })
  
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
