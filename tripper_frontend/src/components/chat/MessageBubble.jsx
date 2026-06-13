import React, { useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";


const MessageBubble = ({ message, showAvatar = true ,reciver}) => {
  const { content, createdAt, senderid, myAvater, status } = message;
  const myId = JSON.parse(localStorage.getItem("user"))._id;
const formatChatTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    // show just time, e.g. "5:55 PM"
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (isYesterday) {
    return "Yesterday";
  } else if (date.getFullYear() === now.getFullYear()) {
    // same year → show month + day
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } else {
    // older → show full date
    return date.toLocaleDateString();
  }
};


  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "flex-end",
        justifyContent: senderid === myId ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {senderid !== myId && showAvatar && (
        <Avatar  src={reciver.avatar ? `${reciver.image}` : "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"}
 sx={{ width: 36, height: 36 }} />
      )}

      <Box
        sx={{
          maxWidth: "78%",
          display: "inline-block",
          bgcolor: senderid === myId ? "#f27244" : "#F1F3F5",
          color: senderid === myId ? "white" : "black",
          px: 2,
          py: 1,
          borderRadius: 2,
          borderTopRightRadius: senderid === myId ? 8 : 16,
          borderTopLeftRadius: senderid === myId ? 16 : 8,
          boxShadow: senderid === myId ? "0 6px 18px rgba(255,56,92,0.12)" : "none",
          wordBreak: "break-word",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
          {content??message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            contentAlign: "right",
            opacity: 0.8,
            fontSize: 11,
          }}
        >
          {formatChatTime(createdAt)} {senderid === myId && status ? `• ${status === "read" ? "✓✓" : status === "delivered" ? "✓" : ""}` : ""}
        </Typography>
      </Box>

      {senderid === myId && showAvatar && (
        <Avatar src={!myAvater?`${myAvater}`:"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"}
 sx={{ width: 36, height: 36, opacity: 0 }} />
       
      )}
    </Box>
  );
};

export default MessageBubble;
