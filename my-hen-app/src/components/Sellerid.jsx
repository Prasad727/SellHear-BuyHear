import React, { useState, useEffect } from "react";

export default function Sellerid() {
  const [activeForm, setActiveForm] = useState("punju");

  const handleFormSwitch = (type) => setActiveForm(type);

  const formConfigs = {
    punju: [
      "name",
      "price",
      "description",
      "battle_range",
      "seller",
      "sellerphone_no",
      "location",
      "image",
    ],
    buffalo: [
      "name",
      "price",
      "description",
      "milk_capacity",
      "seller",
      "sellerphone_no",
      "location",
      "image",
    ],
    goat: [
      "name",
      "price",
      "weight",
      "description",
      "seller",
      "sellerphone_no",
      "location",
      "image",
    ],
  };

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h2 className="mb-3">Seller Entry Panel</h2>
        <div className="btn-group">
          {["punju", "buffalo", "goat"].map((type) => (
            <button
              key={type}
              className={`btn ${
                activeForm === type ? "btn-light border" : "btn-primary"
              }`}
              onClick={() => handleFormSwitch(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Form key={activeForm} title={activeForm} fields={formConfigs[activeForm]} />
    </div>
  );
}

function Form({ title, fields }) {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData({});
    setImagePreview(null);
    setSubmitting(false);
  }, [title]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const maxSize = 2 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Only PNG, JPG, JPEG, and WEBP formats are allowed.");
        return;
      }
      if (file.size > maxSize) {
        alert("Image must be smaller than 2MB.");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    setSubmitting(true);

    const formToSend = new FormData();
    Object.entries(formData).forEach(([key, val]) => formToSend.append(key, val));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/submit/${title}`,
        {
          method: "POST",
          body: formToSend,
        }
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok) {
          alert("Form submitted successfully!");
          console.log(data.message);
        } else {
          alert("Submission failed: " + data.error);
          console.warn("Server response:", data);
        }
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        alert("Server returned unexpected content.");
      }
    } catch (err) {
      console.error("Submit error:", err.message);
      alert("Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
      <h3 className="mb-3 text-center">
        {title.charAt(0).toUpperCase() + title.slice(1)} Form
      </h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {fields.map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">
              {field.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
            </label>
            <input
              type={field === "image" ? "file" : "text"}
              className="form-control"
              name={field}
              onChange={handleChange}
              accept={
                field === "image"
                  ? "image/png, image/jpeg, image/jpg, image/webp"
                  : undefined
              }
              required
              disabled={submitting}
            />
            {field === "image" && formData.image && (
              <div className="text-muted small mt-1">
                Size: {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                <br />
                Type: {formData.image.type}
              </div>
            )}
          </div>
        ))}

        {imagePreview && (
          <div className="mb-3 text-center">
            <label className="form-label">Image Preview:</label>
            <img
              src={imagePreview}
              alt="preview"
              className="img-fluid rounded border"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-success px-4" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
