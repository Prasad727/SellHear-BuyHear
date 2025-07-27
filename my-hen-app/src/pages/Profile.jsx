import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      console.log("Checking localStorage:", savedUser);

      if (savedUser && savedUser !== "undefined") {
        const parsed = JSON.parse(savedUser);
        if (parsed.email) {
          setUserData(parsed);
        } else {
          throw new Error("Invalid user object");
        }
      } else {
        throw new Error("No valid user");
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData(null);
    navigate("/login");
  };

  if (!userData) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>👤</h2>
      <p><strong>Email:</strong> {userData.email}</p>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}
