import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
        <Link className="navbar-brand" to="/">𝑺𝑬𝑳𝑳 𝑯𝑬𝑨𝑹-𝑩𝑼𝒀 𝑯𝑬𝑨𝑹</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" style={{ fontFamily: 'monospace' }} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/punju" style={{ fontStyle: "italic" }}>
                Punju
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/buffalo" style={{ fontStyle: "italic" }}>
                Buffalo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/goat" style={{ fontStyle: "italic" }}>
                Goats
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/seller" style={{ fontStyle: "italic" }}>Sellerid</Link>
            </li>
            {user ? (
              <li className="nav-item">
                <Link className="nav-link active" to="/profile" >👤</Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link active" to="/login">👤</Link>
              </li>

            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
