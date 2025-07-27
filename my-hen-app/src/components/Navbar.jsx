import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sync user state with localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          𝑺𝑬𝑳𝑳 𝑯𝑬𝑨𝑹-𝑩𝑼𝒀 𝑯𝑬𝑨𝑹
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          style={{ fontFamily: "monospace" }}
        >
          <ul className="navbar-nav ms-auto">
            {["punju", "buffalo", "goat"].map((item) => (
              <li className="nav-item" key={item}>
                <Link
                  className="nav-link active"
                  to={`/${item}`}
                  style={{ fontStyle: "italic" }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </li>
            ))}

            <li className="nav-item">
              <Link className="nav-link" to="/seller" style={{ fontStyle: "italic" }}>
                Sellerid
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/profile">
                    👤
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                    style={{ cursor: "pointer", fontStyle: "italic" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link active" to="/login">
                  👤
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
