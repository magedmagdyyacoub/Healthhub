import React from "react";
import "../style/Hero.css"; // Ensure this CSS file exists
import doctorImg from "../assets/doctor.jpg"; // Replace with the actual image path

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-text">
        <h1>Your Health, Our Priority</h1>
        <p>Connect with top doctors, book appointments, and get the care you need — anytime, anywhere.</p>
        <button className="hero-btn">Find a Doctor</button>
      </div>
      <div className="hero-image">
        <img src={doctorImg} alt="Doctor" />
      </div>
    </div>
  );
};

export default Hero;
