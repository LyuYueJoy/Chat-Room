"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  initMatchConnection,
  onMatched,
  onMessageReceived,
  sendMessage,
  startMatching,
} from "@/services/matchService";
import { getCurrentUser } from "@/services/authService";
import { getUserInterestsById } from "@/services/userService";
import { sendFriendRequest } from "@/services/friendService";

import {
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

type ChatMessage = {
  id: string;
  from: string;
  content: string;
  system?: boolean;
};

export default function MatchPage() {
  const [userId, setUserId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [matchedSnackbarOpen, setMatchedSnackbarOpen] = useState(false);
  const [partnerInterests, setPartnerInterests] = useState<string[]>([]);

  const [addingFriend, setAddingFriend] = useState(false);                // ✅ 新增
  const [addFriendSuccess, setAddFriendSuccess] = useState<string | null>(null); // ✅ 新增
  const [addFriendError, setAddFriendError] = useState<string | null>(null);     // ✅ 新增

  const matchedOnce = useRef(false);
  const userIdRef = useRef<string>("");

  useEffect(() => {
    async function connect() {
      const user = await getCurrentUser();
      setUserId(user.id);
      userIdRef.current = user.id;

      await initMatchConnection(user.id);

      onMatched(async (pid) => {
        if (!matchedOnce.current) {
          matchedOnce.current = true;
          setPartnerId(pid);
          setMatchedSnackbarOpen(true);
          addSystemMessage(`🎉 Matched with user ${pid}`);

          try {
            const interests = await getUserInterestsById(pid);
            type UserInterest = { interest: string };
            setPartnerInterests((interests as UserInterest[]).map((i) => i.interest));
          } catch (error) {
            console.error("Failed to load partner interests", error);
          }
        }
      });

      onMessageReceived((from, msg) => {
        if (from === userIdRef.current) return;
        addChatMessage({ from, content: msg });
      });
    }

    connect();
  }, []);

  const addSystemMessage = (content: string) => {
    setChatLog((prev) => [
      ...prev,
      { id: `sys-${Date.now()}`, from: "system", content, system: true },
    ]);
  };

  const addChatMessage = (msg: { from: string; content: string }) => {
    setChatLog((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-${Math.random()}`, ...msg },
    ]);
  };

  const handleStartMatching = () => {
    if (userId) startMatching(userId);
  };

  const handleSend = () => {
    if (message.trim() && partnerId) {
      sendMessage(partnerId, message);
      addChatMessage({ from: "me", content: message });
      setMessage("");
    }
  };

  // ✅ 新增 添加好友逻辑
  const handleAddFriend = async () => {
    if (!partnerId) return;
    setAddingFriend(true);
    setAddFriendError(null);
    setAddFriendSuccess(null);

    try {
      await sendFriendRequest(partnerId);
      setAddFriendSuccess("✅ Friend request sent!");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "❌ Failed to send request";
      setAddFriendError(errMsg);
    } finally {
      setAddingFriend(false);
    }
  };

  return (
    <Box p={4} maxWidth={600} margin="auto">
      <Typography variant="h5" mb={2}>
        🤝 Match & Add Friend
      </Typography>

      {!partnerId && (
        <Button variant="contained" onClick={handleStartMatching}>
          Start Matching
        </Button>
      )}

      {partnerId && (
        <>
          {/* ✅ 展示兴趣 */}
          {partnerInterests.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Partner&apos;s Interests:
              </Typography>
              <Typography variant="body2">
                {partnerInterests.join(", ")}
              </Typography>
            </Box>
          )}

          {/* ✅ 聊天窗口 */}
          <Box
            mb={2}
            p={2}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              height: 300,
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {chatLog.map(({ id, from, content, system }) => {
              if (system) {
                return (
                  <Typography
                    key={id}
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ fontStyle: "italic", mb: 1 }}
                  >
                    {content}
                  </Typography>
                );
              }

              const isMe = from === "me";
              return (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      maxWidth: "70%",
                      bgcolor: isMe ? "primary.main" : "grey.300",
                      color: isMe ? "primary.contrastText" : "text.primary",
                      p: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1">{content}</Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>

          {/* ✅ 输入和发送按钮 */}
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
          <Button sx={{ mt: 1, mr: 2 }} variant="contained" onClick={handleSend}>
            Send
          </Button>

          {/* ✅ 添加好友按钮 */}
          <Button
            sx={{ mt: 1 }}
            variant="outlined"
            color="secondary"
            onClick={handleAddFriend}
            disabled={addingFriend}
          >
            {addingFriend ? "Adding..." : "Add Friend"}
          </Button>

          {/* ✅ 显示反馈 */}
          {addFriendSuccess && (
            <Typography color="success.main" mt={1}>
              {addFriendSuccess}
            </Typography>
          )}
          {addFriendError && (
            <Typography color="error.main" mt={1}>
              {addFriendError}
            </Typography>
          )}
        </>
      )}

      {/* ✅ Snackbar 通知 */}
      <Snackbar
        open={matchedSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setMatchedSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          🎉 Matched with user {partnerId}
        </Alert>
      </Snackbar>
    </Box>
  );
}
