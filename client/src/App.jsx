import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:7000"), []);

  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState(null)

  const [recievedMessage, setRecievedmessage] = useState([]);

  console.log(recievedMessage)

  const handleSubmit = (e) => {
    e.preventDefault();
   
    socket.emit("message", {message,room});

    setMessage("");
    // setRoom("")
  };


  const handleCreateRoom = (e)=>{
    e.preventDefault()
    socket.emit("join", roomName)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id);
    });

    socket.on("recieved-message", (m) => {
      setRecievedmessage(prev=>[...prev, m]);
    });

    socket.on("Welcome", (e) => {
      console.log(e);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm" style={{display:"flex",  alignItems:"center", flexDirection:"column", height:"100vh", marginTop:"50px"}}>
      <Typography variant="h" component="div" gutterBottom>
       Your RoomID : {socketId}
      </Typography>

      <form onSubmit={handleCreateRoom} style={{display:"flex", alignItems:"center", gap: "10px", flexDirection:"column", marginTop:"10px"}} >
        <TextField
          variant="outlined"
          label="Create new room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>

      <form onSubmit={handleSubmit} style={{display:"flex", alignItems:"center", gap: "10px", flexDirection:"column", marginTop:"10px"}} >
        <TextField
          variant="outlined"
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="RoomID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>

      {recievedMessage.length> 0 && (
        recievedMessage.map((message,i)=> (
          
          <li key={i}>{message}</li>
        ) )
      )}
      </Stack>
      
    </Container>
  );
};

export default App;
