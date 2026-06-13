import * as yup from "yup";

export const addHotelSchema = yup.object().shape({
  title: yup.string().min(2, "Title must be at least 2 characters").required("Title is required"),
  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),
  price: yup
  .number()
  .when("type", {
    is: (val) => val !== "hotel",
    then: (schema) =>
      schema
        .typeError("Price must be a number")
        .positive("Price must be greater than 0")
        .required("Price is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
  amenities: yup
    .array()
    .min(1, "Please select at least one amenity")
    .required("Amenities are required"),
  photos: yup
    .array()
    .min(1, "Please upload at least one photo")
    .required("Please upload at least one photo"),
});

export const editHotelSchema = yup.object().shape({
  title: yup.string().min(2).required("Title is required"),
  description: yup.string().min(20).required("Description is required"),
  
  price: yup
    .mixed()
    .when("rooms", {
      is: (rooms) => !rooms || rooms.length === 0,
      then: (schema) =>
        yup.number()
          .typeError("Price must be a number")
          .positive("Price must be greater than 0")
          .required("Price is required"),
      otherwise: (schema) => yup.mixed().notRequired().nullable(),
    }),
    
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
  amenities: yup.array().min(1, "Please select at least one amenity").required(),
  photos: yup.array().test(
    "photos",
    "Please upload at least one photo",
    (value, ctx) => {
      const oldPhotos = ctx.parent.oldPhotos || [];
      return (value && value.length > 0) || (oldPhotos && oldPhotos.length > 0);
    }
  ),
});

