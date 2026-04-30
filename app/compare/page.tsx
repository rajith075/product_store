"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
import ComparisonChart from "../components/ComparisonChart";
import Insights from "../components/Insights";

export default function ComparePage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  // ✅ SAFE FETCH
  const fetchData = async () => {
    try {
      setLoading(true);

      if (typeof window === "undefined") return;

      const ids = JSON.parse(localStorage.getItem("compare") || "[]");
      const storedCategory = localStorage.getItem("category");

      setSelectedIds(ids);
      setCategory(storedCategory);

      if (!ids.length) {
        setProducts([]);
        return;
      }

      const res = await fetch(`/api/compare?category=${storedCategory}`);
      const result = await res.json();

      const data = result?.data || [];

      const selected = data.filter((p: any) =>
        ids.includes(String(p._id))
      );

      setProducts(selected);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🏆 BEST PRODUCT (SAFE)
  const bestProduct =
    products.length > 0
      ? products.reduce((a, b) =>
          (b.score || 0) > (a.score || 0) ? b : a
        )
      : null;

  // ✅ SAFE BEST FINDER
  const getBest = (key: string, nested = false) => {
    if (!products.length) return null;

    return products.reduce((a, b) => {
      const valA = nested ? a?.specs?.[key] || 0 : a?.[key] || 0;
      const valB = nested ? b?.specs?.[key] || 0 : b?.[key] || 0;
      return valB > valA ? b : a;
    });
  };

  // ❌ REMOVE PRODUCT
  const removeProduct = (id: string) => {
    const updated = selectedIds.filter((x) => x !== id);
    localStorage.setItem("compare", JSON.stringify(updated));
    setSelectedIds(updated);
    fetchData();
  };

  // ✅ FIXED ROUTER
  const clearAll = () => {
    localStorage.removeItem("compare");
    localStorage.removeItem("category");

    router.push("/");
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        Loading comparison...
      </div>
    );
  }

  // 🚫 EMPTY STATE
  if (!products.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white gap-4">
        No products selected
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-hidden">

      <Navbar />

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/30 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-150px] right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full"></div>
      </div>

      <div className="pt-28 px-6 md:px-16">

        {/* HEADER */}
        <h1 className="text-5xl md:text-6xl text-center font-bold mb-8">
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            {category || "Product"} Comparison
          </span>
        </h1>

        {/* ACTION */}
        <div className="flex justify-center mb-12">
          <button
            onClick={clearAll}
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 transition"
          >
            Clear All
          </button>
        </div>

        {/* PRODUCT CARDS */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {products.map((p: any) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl backdrop-blur-xl border transition
              ${
                bestProduct?._id === p._id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>

              <p className="text-gray-400 mt-3">💰 ₹{p.min_price}</p>
              <p className="text-gray-400">⭐ {p.avg_rating}</p>

              <p className="text-purple-400 mt-2">
                Score: {p.score?.toFixed(2)}
              </p>

              {bestProduct?._id === p._id && (
                <span className="inline-block mt-2 px-3 py-1 text-xs bg-purple-600 rounded-full">
                  🏆 Best
                </span>
              )}

              <button
                onClick={() => removeProduct(String(p._id))}
                className="mt-4 w-full py-2 bg-red-500 rounded"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>

        {/* 💎 INSIGHTS */}
        <Insights products={products} />

        {/* 📊 CHART */}
        <div className="mt-12 w-full h-[400px]">
          <ComparisonChart products={products} />
        </div>

        {/* 📋 TABLE */}
        <div className="overflow-x-auto mt-16">
          <table className="w-full bg-white/5 border border-white/10 rounded-xl text-center">

            <thead>
              <tr>
                <th className="p-4 text-left">Feature</th>
                {products.map((p: any) => (
                  <th key={p._id}>{p.name}</th>
                ))}
              </tr>
            </thead>

            <tbody>

              {["min_price", "avg_rating"].map((key) => (
                <tr key={key} className="border-t border-white/10">
                  <td className="p-4 text-left">{key}</td>
                  {products.map((p: any) => (
                    <td key={p._id}>
                      {p[key]}
                    </td>
                  ))}
                </tr>
              ))}

              {["ram", "storage", "battery"].map((key) => (
                <tr key={key} className="border-t border-white/10">
                  <td className="p-4 text-left">{key}</td>
                  {products.map((p: any) => (
                    <td key={p._id}>
                      {p.specs?.[key]}
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}