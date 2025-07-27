import React from "react";
import { Link } from "react-router-dom";

const VerticalCardSection = ({ title, linkTo, products = [], type }) => {
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/300x200?text=No+Image";
    // Uncomment below to debug image URLs:
    // console.log("Image path:", imgPath);
    return imgPath.startsWith("http") ? imgPath : imgPath;
  };

  return (
    <section className="mt-5">
      <Link to={linkTo} className="text-decoration-none text-dark">
        <h2 className="mx-4">{title}</h2>
      </Link>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 px-4">
        {products.slice(0, 20).map((product) => (
          <div className="col" key={product._id}>
            <div className="card shadow rounded-4 h-100">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={getImageUrl(product.image || product.Image)}
                  alt={product.name || product.Name || "Product image"}
                  className="card-img-top"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  <Link
                    to={`/productinfo/${type}/${product._id}`}
                    className="text-decoration-none text-primary"
                  >
                    {product.name || product.Name}
                  </Link>
                </h5>
                <p className="fw-bold">₹{product.price || product.Price}</p>
                <p className="text-muted">📍 {product.location || product.Location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerticalCardSection;
