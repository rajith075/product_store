import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  specs: {
    ram: Number,
    storage: Number,
    battery: Number
  },
  avg_rating: Number
});

// ✅ FIXED EXPORT
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;