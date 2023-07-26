import { v2 as cloudinary } from "cloudinary";

export const CloudinaryProvider = {
  provide: "CLOUDINARY",
  useFactory: () => {
    return cloudinary.config({
      cloud_name: "dwrgwvvdk",
      api_key: "633877847131888",
      api_secret: "yQoI4OvBtMtvptm0-7FcDkuq_eU",
    });
  },
};
