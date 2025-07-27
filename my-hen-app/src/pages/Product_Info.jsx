import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Product_Info() {
  const { id, type } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://sellhear-buyhear.onrender.com"; // <-- your deployed backend URL

  useEffect(() => {
    fetch(`${BASE_URL}/${type}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id, type, BASE_URL]);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/no-image.png"; // fallback image
    return imgPath.startsWith("http")
      ? imgPath
      : `${BASE_URL}${imgPath}`;
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!product) return <p className="text-center mt-5">Product not found</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <div className="row">
          <div className="col-md-6 text-center">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => (e.target.src = "/no-image.png")}
            />
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">{product.name}</h2>
            <h4 className="text-success">₹{product.price}</h4>
            {product.description && (
              <p className="mt-3">{product.description}</p>
            )}
            {product.milk_capacity && (
              <p>
                <strong>Milk Capacity:</strong> {product.milk_capacity} litres/day
              </p>
            )}
            {product.weight && (
              <p>
                <strong>Weight:</strong> {product.weight} kg
              </p>
            )}
            {product.battle_range && (
              <p>
                <strong>Battle Range:</strong> {product.battle_range}
              </p>
            )}
            <p>
              <strong>Seller:</strong> {product.seller || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {product.sellerphone_no || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {product.location || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
