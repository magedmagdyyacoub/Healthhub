import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SpecialtyList from '../components/SpecialtyList';
import HealthTips from '../components/HealthTips';
import Testimonials from '../components/Testimonials';
import HowItWorks from '../components/HowItWorks';

import Footer from '../components/Footer';
import '../style/Navbar.css'; // Add this if missing in Home.js

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Hero />
        <SpecialtyList />
        <HowItWorks />
        <HealthTips />
        <Testimonials />
        
        <Footer />
      </div>
    </>
  );
}
