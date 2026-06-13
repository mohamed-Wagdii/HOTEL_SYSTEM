import { Box } from "@mui/material";
import GridImages from "../components/detailsComponents/gridImages";
import PlaceOffers from "../components/detailsComponents/placeOffers";
import PlaceReviews from "../components/detailsComponents/placeReviews";
import FooterComponent from "../components/onBoardingComponents/footer";
import DescriptonComponent from "../components/detailsComponents/descriptionComponents";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import { useEffect, useState } from "react";
import axiosInstance from "../axiousInstance/axoiusInstance";
import { useParams } from "react-router-dom";
import WhatYoullDo from "../components/detailsComponents/experienceActivity";
import hotelService from "../services/hotels.service";
import experienceService from "../services/experince.service";

export default function PlaceDetails() {
  const [place, setPlace] = useState(null);
  const { model, id } = useParams();
  const [canReview, setCanReview] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/${model}/${id}`)
        .then((res) => {
          console.log("place" + res.data);

          const placeData = model === "places" ? res.data.data : res.data;
          setPlace(placeData);

          // Fetch related items from the same city
          fetchRelatedItems(placeData.address?.city, model, id);

          if(JSON.parse(localStorage.getItem("user"))){

               model.toLocaleLowerCase() !== "places" &&
            axiosInstance
              .get(
                `/api/reservations/${model === "hotel" ? "hotel" : "experience"}/${id}`
              )
              .then((res) => {
                console.log("reserv");

                if (res.data.length > 0) {
                  setCanReview(true);
                } else {
                  setCanReview(false);
                }
              });
          }   
          else{
            setCanReview(false);
          }    
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, model]);

  const fetchRelatedItems = async (city, currentModel, currentId) => {
    if (!city) {
      setLoading(false);
      return;
    }

    try {
      let allItems = [];

      // Fetch hotels
      const hotels = await hotelService.getAllHotels();
      const cityHotels = hotels
        .filter(
          (hotel) =>
            hotel.address?.city?.toLowerCase() === city.toLowerCase() &&
            hotel._id !== currentId
        )
        .map((hotel) => ({
          image: hotel.images?.[0] || "https://via.placeholder.com/150",
          title: hotel.name,
          rating: hotel.starRating || 4.5,
          price: `${hotel.price} ج.م / night`,
          id: hotel._id,
          model: "hotel",
        }));

      // Fetch experiences
      const experiences = await experienceService.getAllExperiences();
      const cityExperiences = experiences
        .filter(
          (exp) =>
            exp.address?.city?.toLowerCase() === city.toLowerCase() &&
            exp._id !== currentId
        )
        .map((exp) => ({
          image: exp.images?.[0] || "https://via.placeholder.com/400",
          title: exp.name,
          rating: exp.starRating || 4.8,
          price: exp.price ? `${exp.price} ج.م` : "Price not set",
          id: exp._id,
          model: "experiance",
        }));

      // Group by model type
      allItems = {
        hotels: cityHotels,
        experiences: cityExperiences,
      };

      setRelatedItems(allItems);
    } catch (error) {
      console.error("Error fetching related items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!place) return null;

  const formatModel = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const cityName = place.address?.city || "this area";

  // ✅ Helper function to convert model name to schema name
  const getItemType = (modelName) => {
    if (modelName === "hotel") return "Hotel";
    if (modelName === "experiance") return "Experiance";
    if (modelName === "places") return "Place";
    return formatModel(modelName);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <GridImages 
        images={place.images} 
        title={place.name}
        itemId={place._id}
        itemType={getItemType(model)}
        location = {place.address}
      />
      <DescriptonComponent place={place} model={formatModel(model)} />
      {model === "hotel" ? (
        <PlaceOffers amenities={place.amenities} />
      ) : model === "experiance" ? (
        <WhatYoullDo activities={place.activities} />
      ) : null}

      

      {/* Related Items Carousels */}
      {!loading && (
        <Box sx={{ mt: 6, mb: 4 }}>
          {/* Show Hotels Carousel if current item is experience or if there are hotels */}
          {relatedItems.hotels?.length > 0 && model !== "hotel" && (
            <Box sx={{ mb: 4 }}>
              <PopularHomesCarousel
                homes={relatedItems.hotels}
                title={`Popular Hotels in ${cityName}`}
              />
            </Box>
          )}

          {/* Show More Hotels if current item is hotel */}
          {relatedItems.hotels?.length > 0 && model === "hotel" && (
            <Box sx={{ mb: 4 }}>
              <PopularHomesCarousel
                homes={relatedItems.hotels}
                title={`More Hotels in ${cityName}`}
              />
            </Box>
          )}

          {/* Show Experiences Carousel if current item is hotel or if there are experiences */}
          {relatedItems.experiences?.length > 0 && model !== "experiance" && (
            <Box sx={{ mb: 4 }}>
              <PopularHomesCarousel
                homes={relatedItems.experiences}
                title={`Popular Experiences in ${cityName}`}
              />
            </Box>
          )}
    

          {/* Show More Experiences if current item is experience */}
          {relatedItems.experiences?.length > 0 && model === "experiance" && (
            <Box sx={{ mb: 4 }}>
              <PopularHomesCarousel
                homes={relatedItems.experiences}
                title={`More Experiences in ${cityName}`}
              />
            </Box>
          )}
        </Box>
      )}
      {
        <PlaceReviews canReview={canReview} model={model==='places'?'Place':formatModel(model)} itemId={id} />}

      <FooterComponent />
    </Box>
  );
}