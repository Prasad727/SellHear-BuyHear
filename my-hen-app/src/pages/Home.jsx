import React, { useEffect, useState } from "react";
import VerticalCardSection from "../components/VerticalCardSection";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [goats, setGoats] = useState([]);
  const [buffaloes, setBuffaloes] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://sellhear-buyhear.onrender.com"; // ✅ Updated to your actual Render backend

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [punjuRes, goatRes, buffaloRes] = await Promise.all([
          fetch(`${BASE_URL}/punjus`),
          fetch(`${BASE_URL}/goat`),
          fetch(`${BASE_URL}/buffalo`),
        ]);

        if (!punjuRes.ok || !goatRes.ok || !buffaloRes.ok) {
          throw new Error("One or more fetches failed");
        }

        const [punjuData, goatData, buffaloData] = await Promise.all([
          punjuRes.json(),
          goatRes.json(),
          buffaloRes.json(),
        ]);

        const appendImageURL = (items, type) =>
          items.map((item) => ({
            ...item,
            type,
            image: item.image?.startsWith("http")
              ? item.image
              : `${BASE_URL}${item.image}`,
          }));

        setProducts(appendImageURL(punjuData, "punju"));
        setGoats(appendImageURL(goatData, "goat"));
        setBuffaloes(appendImageURL(buffaloData, "buffalo"));
        setError("");
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load product data.");
      }
    };

    fetchData();
  }, [BASE_URL]);

  return (
    <div>
      <VerticalCardSection
        title="Punju 🐓"
        linkTo="/punjus"
        products={products}
        type="punju"
      />
      <VerticalCardSection
        title="Buffaloes 🐃"
        linkTo="/buffalo"
        products={buffaloes}
        type="buffalo"
      />
      <VerticalCardSection
        title="Goats 🐐"
        linkTo="/goat"
        products={goats}
        type="goat"
      />
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
