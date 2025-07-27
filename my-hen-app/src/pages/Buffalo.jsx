import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Buffalo() {
  const [buffaloes, setBuffaloes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/buffalo")
      .then((res) => res.json())
      .then((data) => setBuffaloes(data))
      .catch((err) => console.error("Buffalo fetch error:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Buffaloes 🐃</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {buffaloes.map((buffalo) => (
          <div className="col" key={buffalo._id}>
            <div className="card h-100 shadow rounded-4">
              <img
                src={
                  buffalo.image?.startsWith("http")
                    ? buffalo.image
                    : `http://localhost:3001${buffalo.image}`
                }
                className="card-img-top"
                alt={buffalo.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  <Link
                    to={`/productinfo/buffalo/${buffalo._id}`}
                    className="text-decoration-none text-primary"
                  >
                    {buffalo.name}
                  </Link>
                </h5>
                <p className="card-text fw-bold">₹{buffalo.price}</p>
                <p className="card-text">📍 {buffalo.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
