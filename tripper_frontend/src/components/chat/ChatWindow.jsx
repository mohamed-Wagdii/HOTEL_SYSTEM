import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MessageBubble from "./MessageBubble";
import NewMessageInput from "./NewMessageInput";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import {io} from "socket.io-client";


const ChatWindow = ({ conversation, onBack, onSendMessage }) => {
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([]);
const myId = JSON.parse(localStorage.getItem("user"))._id;
  const [reciver, setReciver] = useState({});
  const [socket, setSocket] = useState(null);
useEffect(() => {
  const s = io("http://127.0.0.1:4000");

  s.emit("user-online", myId);

  s.on("receive-message", (message) => {
    console.log("Received message:", message);
    setMessages((prev) => [...prev, message]);
  });

  setSocket(s);

  // cleanup when unmounting
  return () => {
    s.disconnect();
  };
}, [myId]);

  useEffect(() => {
    console.log("convers"+conversation);
    
 //get messages from selected conversation
    conversation && axiosInstance.get(`message/getMessages/${conversation}`).then((res)=>{
      console.log(res.data);
      setMessages(res.data.data.messages);
    })

    conversation && axiosInstance.get(`conversation/getConversationById/${conversation}`).then((res)=>{
      console.log(res.data);
      setReciver(res.data.data.conversation.members[0]._id !== myId ? res.data.data.conversation.members[0] : res.data.data.conversation.members[1]);
    })
      }, [conversation]);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, conversation]);

   const handleSend = (text) => {
    if (text.trim() === "") return;
    axiosInstance.post(`message/sendMessage`,{content:text,conversationid:conversation}).then((res)=>{
      console.log(res.data);
      setMessages([...messages, res.data.data.newMessage]);
      onSendMessage && onSendMessage(text, conversation);
    })
    socket?.emit("send-message", { text: text, recipientId: reciver._id });

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
        {onBack && (
          <IconButton onClick={onBack}>
            <CloseIcon />
          </IconButton>
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#034959" }}>{reciver.name}</Typography>
          <Typography variant="caption" color="gray">Last active: {conversation?.lastSeen || "now"}</Typography>
        </Box>
      </Box>
      <Divider />

      {/* messages list */}
      <Box ref={scrollRef} sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, bgcolor: "#FAFAFB" }}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 6, color: "gray" }}>
            <Typography variant="body2">No messages yet. Say hi 👋</Typography>
          </Box>
        )}

        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showAvatar = !m.fromMe && (!prev || prev.fromMe);
          return <MessageBubble key={m._id?? m.tempKey} message={m} showAvatar={showAvatar} reciver={reciver} />;
        })}

        {/* typing indicator */}
        {conversation?.typing && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <Box sx={{ bgcolor: "#F1F3F5", px: 2, py: 1, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: "gray" }}>Typing...</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* input */}
      <Box sx={{ p: 2 }}>
        <NewMessageInput onSend={handleSend} />
      </Box>
    </Box>
  );
};

export default ChatWindow;
