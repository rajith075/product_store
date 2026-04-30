import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  product_id: String,
  rating: Number,
  comment: String,
});

const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;