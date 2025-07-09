"use client";
import React, { useEffect, useState } from "react";
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from "@/services/friendService";
import { Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { FriendRequest } from "@/models/FriendRequests";

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const load = () => {
    getFriendRequests().then(setRequests).catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);
  

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id);
    load();
  };

  const handleReject = async (id: string) => {
    await rejectFriendRequest(id);
    load();
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Typography variant="h6">Friend Requests</Typography>
      <List>
        {requests.map(req => (
          <ListItem key={req.id}>
            <ListItemText primary={req.requesterDisplayName} secondary={req.requesterEmail} />
            <Button onClick={() => handleAccept(req.id)}>Accept</Button>
            <Button onClick={() => handleReject(req.id)} color="error">Reject</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
