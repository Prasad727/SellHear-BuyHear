import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Punju() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/punjus")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const processedData = data.map((product) => ({
          ...product,
          image: product.image?.startsWith("http")
            ? product.image
            : `http://localhost:3001${product.image}`, // ✅ Fixed: removed duplicate /uploads
        }));
        setProducts(processedData);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching punjus:", err);
        setError("Failed to load fighting rooster data. Please try again later.");
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Fighting Roosters 🐓</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100 shadow-sm">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={product.image}
                  alt="punju"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  <Link
                    to={`/productinfo/punju/${product._id}`}
                    className="text-decoration-none"
                  >
                    {product.name}
                  </Link>
                </h5>
                <p className="fw-bold mb-1">₹{product.price}</p>
                <p className="text-muted small mb-0">📍 {product.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


