"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { User } from "@/models/User";
import { getFriendList, deleteFriend } from "@/services/friendService";
import { sendMessage } from "@/services/chatService";
import * as signalR from "@microsoft/signalr";
import { getCurrentUser } from "@/services/authService";


export default function FriendList() {
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(console.error);
  }, []);

  // 初始化好友列表
  useEffect(() => {
    const load = () => {
      getFriendList().then(setFriends).catch(console.error);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // 初始化 SignalR
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://backend20250701173222.azurewebsites.net/chathub", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    conn.on("ReceiveMessage", (senderId, text) => {
      setChatHistory((prev) => [...prev, { sender: senderId, text }]);
    });

    conn
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((err) => console.error("SignalR connection error:", err));

    setConnection(conn);

    return () => {
      conn.stop();
    };
  }, []);

  const handleDelete = async (id: string) => {
    await deleteFriend(id);
    setFriends(friends.filter((f) => f.id !== id));
    // 如果当前聊天对象被删除，关闭弹窗
    if (selectedFriend?.id === id) {
      setSelectedFriend(null);
      setChatHistory([]);
      setMessage("");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedFriend || !message) return;
    try {
      await sendMessage(selectedFriend.id, message, currentUser!.id);
      setChatHistory((prev) => [...prev, { sender: "You", text: message }]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Typography variant="h6">Your Friends</Typography>
      <List>
        {friends.map((friend) => (
          <ListItem
            key={friend.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText primary={friend.displayName} secondary={friend.email} />
            <Box>
              <Button
                color="error"
                onClick={() => handleDelete(friend.id)}
                style={{ marginRight: 8 }}
              >
                Remove
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedFriend(friend);
                  setChatHistory([]); // 可选：每次打开清空聊天记录
                }}
              >
                Chat
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={!!selectedFriend} onClose={() => setSelectedFriend(null)} fullWidth>
        <DialogTitle>Chat with {selectedFriend?.displayName}</DialogTitle>
        <DialogContent dividers style={{ maxHeight: "400px", overflowY: "auto" }}>
          {chatHistory.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No messages yet.
            </Typography>
          )}
          {chatHistory.map((m, i) => (
            <Typography
              key={i}
              variant="body2"
              style={{ margin: "4px 0", wordBreak: "break-word" }}
            >
              <strong>{m.sender}:</strong> {m.text}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
