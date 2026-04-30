import Product from "@/models/Product";
import { comparePipeline } from "@/lib/aggregation";
import { connectDB } from "@/lib/mongodb";

export const getComparedProducts = async () => {
  try {
    // ✅ Ensure DB connection
    await connectDB();

    // ✅ Run aggregation
    const data = await Product.aggregate(comparePipeline());

    return data;
  } catch (error) {
    console.error("Compare Service Error:", error);
    throw new Error("Failed to fetch compared products");
  }
};