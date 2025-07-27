import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyOtp = async () => {
    const email = localStorage.getItem("pendingEmail");
    if (!email) {
      alert("No pending email found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.removeItem("pendingEmail");

        // ✅ Save user session
        localStorage.setItem("user", JSON.stringify({ email: data.email }));

        alert("✅ OTP verified successfully!");
        navigate("/profile");
      } else {
        alert("❌ Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>📩 Enter OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="form-control mb-3"
        maxLength={6}
      />
      <button
        className="btn btn-success"
        onClick={verifyOtp}
        disabled={!otp.trim()}
      >
        Verify OTP
      </button>
    </div>
  );
}
