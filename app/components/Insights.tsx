"use client";

export default function Insights({ products }: any) {
  if (!products?.length) return null;

  // 🏆 BEST SCORE
  const bestScore = products.reduce((a: any, b: any) =>
    (b.score || 0) > (a.score || 0) ? b : a
  );

  // 💰 CHEAPEST
  const cheapest = products.reduce((a: any, b: any) =>
    (b.min_price || Infinity) < (a.min_price || Infinity) ? b : a
  );

  // ⭐ BEST RATING
  const bestRating = products.reduce((a: any, b: any) =>
    (b.avg_rating || 0) > (a.avg_rating || 0) ? b : a
  );

  // ⚡ VALUE SCORE (price vs rating)
  const bestValue = products.reduce((a: any, b: any) => {
    const valA = (a.avg_rating || 0) / (a.min_price || 1);
    const valB = (b.avg_rating || 0) / (b.min_price || 1);
    return valB > valA ? b : a;
  });

  return (
    <div className="grid md:grid-cols-4 gap-6 mt-12">

      {/* 🏆 BEST OVERALL */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/10 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <h3 className="text-purple-400 text-sm mb-2">🏆 Best Overall</h3>
        <p className="text-lg font-semibold">{bestScore.name}</p>
        <p className="text-xs text-gray-400 mt-2">
          Highest combined score based on performance, price & rating
        </p>
      </div>

      {/* 💰 BEST PRICE */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-600/20 to-green-900/10 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <h3 className="text-green-400 text-sm mb-2">💰 Best Price</h3>
        <p className="text-lg font-semibold">{cheapest.name}</p>
        <p className="text-xs text-gray-400 mt-2">
          Lowest price among selected products
        </p>
      </div>

      {/* ⭐ TOP RATED */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-900/10 border border-yellow-400/30 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
        <h3 className="text-yellow-400 text-sm mb-2">⭐ Top Rated</h3>
        <p className="text-lg font-semibold">{bestRating.name}</p>
        <p className="text-xs text-gray-400 mt-2">
          Highest user satisfaction rating
        </p>
      </div>

      {/* ⚡ BEST VALUE */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/10 border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        <h3 className="text-blue-400 text-sm mb-2">⚡ Best Value</h3>
        <p className="text-lg font-semibold">{bestValue.name}</p>
        <p className="text-xs text-gray-400 mt-2">
          Best balance of price and rating
        </p>
      </div>

    </div>
  );
}