import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema({
  product_id: String,
  platform: String,
  price: Number,
  date: Date,
});

const Price =
  mongoose.models.Price || mongoose.model("Price", PriceSchema);

export default Price;