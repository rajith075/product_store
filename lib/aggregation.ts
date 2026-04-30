import { PipelineStage } from "mongoose";

export const comparePipeline = (): PipelineStage[] => [
  {
    $lookup: {
      from: "prices",
      localField: "_id",
      foreignField: "product_id",
      as: "prices",
    },
  },
  {
    $addFields: {
      min_price: { $min: "$prices.price" },
    },
  },
  {
    $addFields: {
      score: {
        $add: [
          { $multiply: ["$avg_rating", 20] },
          { $divide: [100000, "$min_price"] },
        ],
      },
    },
  },
  {
    $sort: {
      score: -1 as 1 | -1, // ✅ FIX HERE
    },
  },
];