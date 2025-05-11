import React from "react";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Health Hub. All Rights Reserved.</p>
      <nav>
        <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
      </nav>
    </footer>
  );
};

export default Footer;
