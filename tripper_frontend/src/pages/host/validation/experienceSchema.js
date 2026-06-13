import * as Yup from "yup";

export const experienceSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  photos: Yup.array()
    .min(1, "Please upload at least one photo")
    .required("Photos are required"),
  activities: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .min(2, "Title must be at least 2 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(5, "Description must be at least 5 characters")
        .required("Description is required"),
      image: Yup.mixed().required("Image is required"), // لو عايز الصورة إلزامية
    })
  ),
  
});

export const basicInfoUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
});



export const activitiesUpdateSchema = Yup.object().shape({
  title: Yup.string().min(2, "Title must be at least 2 characters").required("Title is required"),
  description: Yup.string().min(5, "Description must be at least 5 characters").required("Description is required"),
  image: Yup.mixed().required("Image is required"),
});