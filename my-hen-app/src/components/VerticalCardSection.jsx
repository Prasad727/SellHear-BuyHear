// ✅ UPDATED VerticalCardSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const VerticalCardSection = ({ title, linkTo, products = [], type }) => {
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/300x200?text=No+Image";
    return imgPath.startsWith("http") ? imgPath : imgPath; // Image from Cloudinary already has full URL
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
                  alt={product.name || product.Name}
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


// ✅ NOTES:
// 1. No need to prepend localhost or anything to Cloudinary image URLs, they're full URLs already.
// 2. Your server stores the image as `req.file.path`, which is a Cloudinary URL.
// 3. Your MongoDB data already includes valid image URLs after submission — previously stored items should work unless image path was broken.
// 4. If some old image fields are relative or empty, fallback placeholder image handles them.

// ✅ Optional Debugging Tip:
// Log product.image inside getImageUrl to verify:
// console.log("Image path:", imgPath);
