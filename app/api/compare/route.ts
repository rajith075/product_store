import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { comparePipeline } from "@/lib/aggregation";
import { PipelineStage, Types } from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const ids = searchParams.get("ids"); // 🔥 NEW

    let pipeline: PipelineStage[] = [];

    // 🔥 FILTER BY IDS (MOST IMPORTANT FIX)
    if (ids) {
      const idArray = ids.split(","); // ✅ NO ObjectId

      pipeline.push({
        $match: { _id: { $in: idArray } },
      } as PipelineStage);
    }

    // 🔥 CATEGORY FILTER
    if (category) {
      pipeline.push({
        $match: { category },
      } as PipelineStage);
    }

    // 🔍 SEARCH FILTER
    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: "i" },
        },
      } as PipelineStage);
    }

    // 🔥 MAIN AGGREGATION
    pipeline.push(...comparePipeline());

    // ⚡ SORTING
    if (sort === "price") {
      pipeline.push({ $sort: { min_price: 1 } } as PipelineStage);
    } else if (sort === "rating") {
      pipeline.push({ $sort: { avg_rating: -1 } } as PipelineStage);
    }

    const products = await Product.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.error("Compare API Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}