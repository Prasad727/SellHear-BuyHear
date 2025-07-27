import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-4 pb-2 mt-5">
      <div className="container">
        <div className="row">

          {/* Brand Info */}
          <div className="col-md-4 mb-3">
            <h5 className="text-warning">SellHear-BuyHear.in</h5>
            <p>Your trusted platform to sell and buy livestock easily, securely, and quickly.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/punju" className="text-light text-decoration-none">
                  Roosters
                </Link>
              </li>
              <li>
                <Link to="/goat" className="text-light text-decoration-none">
                  Goats
                </Link>
              </li>
              <li>
                <Link to="/buffalo" className="text-light text-decoration-none">
                  Buffaloes
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-light text-decoration-none">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-3">
            <h6>Contact Us</h6>
            <p className="mb-1">Email: sellhearbuyhear@gmail.com</p>
            <p className="mb-1">Phone: +91 9989844089</p>
            <p>Address: Hyderabad, Telangana, India</p>
          </div>
        </div>

        <hr className="border-secondary" />

        <p className="text-center small mb-0">
          &copy; {new Date().getFullYear()} SellHear-BuyHear.in. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
