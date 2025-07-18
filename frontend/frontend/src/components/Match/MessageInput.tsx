import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface MessageInputProps {
  onSend: (msg: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <>
      <TextField
        fullWidth
        label="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button sx={{ mt: 1 }} variant="contained" onClick={handleSend}>
        Send
      </Button>
    </>
  );
}
