import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Hamza Aslam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
