"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ComparisonChart({ products }: any) {
  if (!products?.length) return null;

  // 🔥 find max for normalization (REAL scaling)
  const maxPrice = Math.max(...products.map((p: any) => p.min_price || 1));
  const maxBattery = Math.max(...products.map((p: any) => p.specs?.battery || 1));
  const maxRam = Math.max(...products.map((p: any) => p.specs?.ram || 1));
  const maxStorage = Math.max(...products.map((p: any) => p.specs?.storage || 1));

  // 🧠 convert each product into radar format
  const data = [
    { subject: "Rating", ...Object.fromEntries(products.map((p: any) => [p.name, (p.avg_rating || 0) * 20])) },
    { subject: "Battery", ...Object.fromEntries(products.map((p: any) => [p.name, ((p.specs?.battery || 0) / maxBattery) * 100])) },
    { subject: "RAM", ...Object.fromEntries(products.map((p: any) => [p.name, ((p.specs?.ram || 0) / maxRam) * 100])) },
    { subject: "Storage", ...Object.fromEntries(products.map((p: any) => [p.name, ((p.specs?.storage || 0) / maxStorage) * 100])) },
    { subject: "Price (Value)", ...Object.fromEntries(products.map((p: any) => [p.name, ((maxPrice - p.min_price) / maxPrice) * 100])) },
  ];

  const colors = ["#8b5cf6", "#3b82f6", "#22c55e", "#facc15"];

  return (
    <div className="w-full h-[450px] bg-gradient-to-br from-[#020617] to-[#0f172a] p-6 rounded-2xl border border-white/10">

      <h2 className="text-xl mb-4 text-white font-semibold">
        🧠 Real Product Comparison
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>

          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#cbd5f5" />
          <PolarRadiusAxis stroke="#64748b" />

          {products.map((p: any, i: number) => (
            <Radar
              key={p._id}
              name={p.name}
              dataKey={p.name}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.3}
            />
          ))}

          <Legend />

        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}