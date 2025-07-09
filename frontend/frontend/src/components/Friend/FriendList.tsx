"use client";
import React, { useEffect, useState } from "react";
import { getFriendList, deleteFriend } from "@/services/friendService";
import { Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { User } from "@/models/User";

export default function FriendList() {
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    getFriendList().then(setFriends).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteFriend(id);
    setFriends(friends.filter(f => f.id !== id));
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Typography variant="h6">Your Friends</Typography>
      <List>
        {friends.map(friend => (
          <ListItem key={friend.id}>
            <ListItemText primary={friend.displayName} secondary={friend.email} />
            <Button color="error" onClick={() => handleDelete(friend.id)}>Remove</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
