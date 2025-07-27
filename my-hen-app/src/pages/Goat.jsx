import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Goat() {
  const [goats, setGoats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/goat")
      .then((res) => res.json())
      .then((data) => setGoats(data))
      .catch((err) => console.error("Goat fetch error:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Goats 🐐</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {goats.map((goat) => (
          <div className="col" key={goat._id}>
            <div className="card h-100 shadow rounded-4">
              <img
                src={
                  goat.image?.startsWith("http")
                    ? goat.image
                    : `http://localhost:3001${goat.image}`
                }
                className="card-img-top"
                alt={goat.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
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
