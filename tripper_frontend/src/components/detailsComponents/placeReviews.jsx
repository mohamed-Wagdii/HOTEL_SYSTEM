import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import axiosInstance from "../../axiousInstance/axoiusInstance";

export default function PlaceReviews({ model, itemId, canReview }) {
  console.log(model);
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/review/${model}/${itemId}`);
        if (res.data && Array.isArray(res.data.reviews)) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    fetchReviews();
  }, [model, itemId]);

const handleAddReview = async () => {
  if (!newReview.comment || !newReview.rating) return;

  try {
    const token = localStorage.getItem("token"); // هات التوكن

    const res = await axiosInstance.post(
      "/review/addReview",
      {
        comment: newReview.comment,
        rating: newReview.rating,
        refModel: model,
        refId: itemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // لازم الباك يرجع الريڤيو هنا علشان نزوده في الواجهة
    setReviews((prev) => [{ 
      ...res.data.review, 
      userId: { name: "You" } // مؤقت لحد ما تعمل refetch
    }, ...prev]);

    setNewReview({ comment: "", rating: 0 });

  } catch (err) {
    console.error("Error adding review", err);
  }
};

  const ReviewCard = ({ review }) => {
    const [expanded, setExpanded] = useState(false);
    const shortText =
      review.comment.length > 120
        ? review.comment.substring(0, 120) + "..."
        : review.comment;

    return (
      <Card sx={{ borderRadius: 4, maxWidth: 600, margin: "0 auto" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
              {review.userId?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body1">
                {review.userId?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {expanded ? review.comment : shortText}
            {review.comment.length > 120 && (
              <Typography
                component="span"
                sx={{ color: "#1976d2", cursor: "pointer", ml: 1 }}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show Less" : "Show More"}
              </Typography>
            )}
          </Typography>

          <Rating value={review.rating} readOnly />
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ textAlign: "center", py: 6, backgroundColor: "#f9f9f9" }}>
      {
        
        canReview && <Box sx={{ maxWidth: 600, margin: "0 auto", mb: 6, p: 3, background: "#fff", borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Your Review
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          label="Write your review..."
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Rating
            value={newReview.rating}
            onChange={(e, val) => setNewReview({ ...newReview, rating: val })}
          />
          <Button variant="contained" onClick={handleAddReview}>
            Submit
          </Button>
        </Box>
      </Box>}

      <Typography variant="h4" sx={{ mb: 4 }}>
        What Our Guests Say
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {reviews.map((review) => (
          <Grid item xs={12} sm={10} md={6} key={review._id}>
            <ReviewCard review={review} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
