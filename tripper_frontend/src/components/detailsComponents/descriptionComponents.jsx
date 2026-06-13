import { Avatar, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookingBox from "./bookingBox";
import ExpBookingBox from "./experBookingBox.jsx";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import AirbnbDatePicker from "./availableCalinder";

export default function DescriptonComponent({ place, model }) {
  const navigate = useNavigate();
const [expanded, setExpanded] = useState(false);
const [convid, setConvid] = useState(null);
const myId=JSON.parse(localStorage.getItem("user"))?._id ||null;
const [availableDates, setAvailableDates] = useState([]);
useEffect(() => {
 model.toLowerCase() === "hotel" && axiosInstance
    .get("/api/reservations/availableDates", {
      params: {
        hotelId: place._id,
        
      },
    }).then((res) => {
      console.log("test log");
      
      console.log(res.data);
      
      setAvailableDates(res.data);
    }).catch(err => {
      console.error("Failed to fetch available dates:", err);
  })
}, [place]);

  const host = place.hostId
function startConversation(id) {
  axiosInstance
    .post("conversation/startConversation", {
      receiverid: [id],
    })
    .then((res) => {
      const newConvId = res.data.data.conversation._id;
      console.log("Conversation created:", newConvId);
      setConvid(newConvId);
      navigate("/chat", { state: { convid: newConvId } });
    })
    .catch((err) => {
      console.error("Error starting conversation:", err);
    });
}
  return (
    <Box sx={{ display: "flex", gap: 4, mt: 5, alignItems: "flex-start" }}>
      <Box sx={{ flex: 1 }}>
        
        {
          model!=='Places' &&<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={host.image}
            alt={host.name}
            sx={{
              width: 64,
              height: 64,
              mr: 2,
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
            // onClick={() => navigate(`/profile/${host.id}`)}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Created by{" : "}
              <span style={{ color: "#f27244", cursor: "pointer" }}>
                {host.name}
              </span>
            </Typography>
            

            <Button
              variant="outlined"
              sx={{
                mt: 1.5,
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 600,
                color: "#f27244",
                borderColor: "#f27244",
                "&:hover": {
                  backgroundColor: "#034959",
                  color: "#fff",
                  borderColor: "#034959",
                },
              }}
              onClick={()=>{
                if(myId == null){
                  navigate("/login");
                  return;
                }
                myId===host._id?navigate("/guest/profile"):startConversation(host._id);
              }}
            >
              Message host
            </Button>
          </Box>
        </Box>}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Description
          </Typography>
          <Typography color="text.secondary" sx={{
  lineHeight: 1.6,
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}}>
            {place.description}
          </Typography>
          {
            <Typography
  onClick={() => setExpanded(!expanded)}
  sx={{
    color: "#034959",
    fontWeight: 600,
    cursor: "pointer",
    mt: 1,
    "&:hover": { textDecoration: "underline", color: "#f27244" },
  }}
>
  {expanded ? "See less" : "See more"}
  
</Typography>}
        </Box>
        {
          model==='Hotel' &&<Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <AirbnbDatePicker availableDates={availableDates} />
    </Box>}


      </Box>

      {
        model.toLowerCase()==='hotel' ?<BookingBox place={place} model={model} />:model.toLowerCase()==='experiance' && <ExpBookingBox place={place} model={model} />}
    </Box>
  );
}
