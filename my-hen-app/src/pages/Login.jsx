import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://sellhear-buyhear.onrender.com"; // <-- your deployed backend URL

  const sendOtp = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ OTP sent to your email!");
        localStorage.setItem("pendingEmail", email); // Save email for verify step
        navigate("/verify");
      } else {
        alert(data.message || "❌ Failed to send OTP.");
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>🔐 Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="form-control mb-3"
        required
      />
      <button
        className="btn btn-primary"
        onClick={sendOtp}
        disabled={!email || loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
}
