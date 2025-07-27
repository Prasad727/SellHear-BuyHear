import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Goat() {
  const [goats, setGoats] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://sellhear-buyhear.onrender.com"; // <-- your deployed backend URL

  useEffect(() => {
    fetch(`${BASE_URL}/goat`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const processedData = data.map((goat) => ({
          ...goat,
          image: goat.image?.startsWith("http")
            ? goat.image
            : `${BASE_URL}${goat.image}`,
        }));
        setGoats(processedData);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching goats:", err);
        setError("Failed to load goat data. Please try again later.");
      });
  }, [BASE_URL]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Goats 🐐</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {goats.map((goat) => (
          <div className="col" key={goat._id}>
            <div className="card h-100 shadow rounded-4">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={goat.image}
                  alt={goat.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  <Link
                    to={`/productinfo/goat/${goat._id}`}
                    className="text-decoration-none text-primary"
                  >
                    {goat.name}
                  </Link>
                </h5>
                <p className="card-text fw-bold">₹{goat.price}</p>
                <p className="card-text">📍 {goat.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
