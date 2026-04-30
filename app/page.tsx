"use client";

import Navbar from "./components/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const router = useRouter();

  // ✅ FIXED IMAGE FUNCTION (STABLE + DIFFERENT IMAGES)
  const getImage = (category: string, index: number) => {
    const images: any = {
      Mobile: [
        "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
        "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
      ],
      Laptop: [
        "https://images.pexels.com/photos/18105/pexels-photo.jpg",
        "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg",
        "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg",
      ],
      Headphones: [
        "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
        "https://images.pexels.com/photos/159853/headphones-headset-audio-equipment-159853.jpeg",
      ],
      TV: [
        "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg",
        "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
        "https://images.pexels.com/photos/276514/pexels-photo-276514.jpeg",
      ],
      Watch: [
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
        "https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg",
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
      ],
    };

    const list = images[category] || images["Mobile"];
    return list[index % list.length];
  };

  const fetchProducts = async (category = "") => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...(category && { category }),
      }).toString();

      const res = await fetch(`/api/compare?${params}`);
      const result = await res.json();

      let data = result?.data || [];

      if (search) {
        data = data.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#020617] text-white overflow-hidden">

      <Navbar />

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/30 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-150px] right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full"></div>
      </div>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-24 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold leading-tight"
        >
          <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
            Smart Comparison
          </span>
        </motion.h1>

        <p className="text-gray-400 mt-6 max-w-xl text-lg">
          Compare products intelligently with real-time pricing,
          ratings, and powerful insights.
        </p>

        {/* SEARCH */}
        <div className="mt-8 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search premium products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchProducts(selectedCategory);
            }}
            className="w-full px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

      </section>

      {/* CATEGORY CARDS */}
      <section className="flex justify-center mb-10">

        <div className="flex gap-6 flex-wrap justify-center">

          {[
            { name: "Mobile", icon: "📱" },
            { name: "Laptop", icon: "💻" },
            { name: "Headphones", icon: "🎧" },
            { name: "TV", icon: "📺" },
            { name: "Watch", icon: "⌚" },
          ].map((cat, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSelectedProducts([]);
                localStorage.removeItem("compare");
                fetchProducts(cat.name);
              }}
              className={`cursor-pointer px-6 py-4 rounded-xl text-center border transition
              ${
                selectedCategory === cat.name
                  ? "bg-purple-600 border-purple-500"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="text-2xl">{cat.icon}</div>
              <p className="mt-1">{cat.name}</p>
            </div>
          ))}

        </div>

      </section>

      {/* COMPARE BUTTON */}
      {selectedProducts.length >= 2 && (
        <div className="text-center mb-12">
          <button
 onClick={() => {
  if (selectedProducts.length < 2) {
    alert("Select at least 2 products");
    return;
  }

  // ✅ FORCE STRING IDS
  const cleanIds = selectedProducts.map(id => String(id));

  console.log("Saving IDs:", cleanIds);

  localStorage.setItem("compare", JSON.stringify(cleanIds));
  localStorage.setItem("category", selectedCategory);

  router.push("/compare");
}}
  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition shadow-[0_0_20px_rgba(168,85,247,0.5)]"
>
  Compare {selectedProducts.length} Products →
</button>
        </div>
      )}

      {/* PRODUCTS */}
      <section className="px-10 pb-20">

        {loading && (
          <p className="text-center text-gray-400">Loading...</p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">
            Select a category to view products
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-10">

          {products.map((item, i) => {
            const id = String(item._id);
            const isSelected = selectedProducts.includes(id);

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`group relative p-6 rounded-2xl backdrop-blur-xl border transition duration-300
                ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                    : "border-white/10 bg-white/5 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                }`}
              >

                {/* ✅ IMAGE FIXED */}
                <div className="mb-4 overflow-hidden rounded-xl">
                  <img
                    src={item.image || getImage(item.category, i)}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-xl transition group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg";
                    }}
                  />
                </div>

                {/* GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl"></div>

                <div className="relative z-10">

                  <h3 className="text-xl font-semibold">{item.name}</h3>

                  <p className="text-gray-400 mt-3">
                    💰 ₹{item.min_price}
                  </p>

                  <p className="text-gray-400">
                    ⭐ {item.avg_rating}
                  </p>

                  <p className="text-purple-400 mt-2 font-medium">
                    Score: {item.score?.toFixed(2)}
                  </p>

                  <button
                    onClick={() => {
                      if (!selectedCategory) {
                        alert("Select category first");
                        return;
                      }

                      let updated = [...selectedProducts];

                      if (updated.includes(id)) {
                        updated = updated.filter((x) => x !== id);
                      } else {
                        updated.push(id);
                      }

                      setSelectedProducts(updated);
                    }}
                    className={`mt-5 w-full py-3 rounded-xl font-medium transition
                    ${
                      isSelected
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
                    }`}
                  >
                    {isSelected ? "Remove" : "Add to Compare"}
                  </button>

                </div>

              </motion.div>
            );
          })}

        </div>

      </section>

    </main>
  );
}