import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  TextField,
  Typography,
} from "@mui/material";


const ChatSidebar = ({ conversations = [], onSelectConversation, activeId }) => {
  
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  return (
    <Box sx={{ width: { xs: "100%", sm: 340 }, borderRight: { xs: "none", sm: "1px solid #eee" }, height: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">Messages</Typography>
        <TextField
          placeholder="Search messages"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
        />
      </Box>

      <Box sx={{ overflowY: "auto", height: "calc(100% - 96px)", px: 1 }}>
        <List disablePadding>
          {conversations.map((c) => (
            <ListItemButton
              key={c._id}
              selected={activeId === c._id}
              onClick={() => onSelectConversation && onSelectConversation(c._id)}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemAvatar>
                <Badge
                  variant="dot"
                  color={c.online ? "success" : "default"}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar
                    src={
                      Array.isArray(c.members) && c.members.length === 2
                        ? c.members[0]._id === myId
                          ? c.members[1].image
                            ? `${c.members[1].image}`
                            : "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
                          : c.members[0].image
                            ? `${c.members[0].image}`
                            : "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
                        : "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
                    }
                  />
                </Badge>
              </ListItemAvatar>
              <ListItemText
              primaryTypographyProps={{ component: "div" }}
  secondaryTypographyProps={{ component: "div" }}
                primary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#034959" }}>
                      {Array.isArray(c.members) && c.members.length === 2
                        ? (c.members[0]._id === myId
                          ? c.members[1].name
                          : c.members[0].name)
                        : "Unknown User"}</Typography>
                    <Typography variant="caption" sx={{ color: "gray" }}>{c.time}</Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" noWrap sx={{ color: "gray" }}>{c.lastMessage}</Typography>
                    {c.unreadCount > 0 && (
                      <Box sx={{
                        bgcolor: "#f27244",
                        color: "white",
                        px: 0.8,
                        py: 0.3,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: "bold"
                      }}>
                        {c.unreadCount}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
