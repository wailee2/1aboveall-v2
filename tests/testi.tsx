// app/page.tsx (or your custom layout file)
import React from "react";
import { InfiniteCarousel2 } from "@/components/I";

export default function PartnerShowcase() {
  // 1. Define your carousel HTML items (can be images, text, or complex divs)
  const brandLogos = [
    <div key="1" style={cardStyle}>🚀 TechCorp</div>,
    <div key="2" style={cardStyle}>⚡ EnergyX</div>,
    <div key="3" style={cardStyle}>🌐 GlobalNet</div>,
    <div key="4" style={cardStyle}>🎨 DesignStudio</div>,
    <div key="5" style={cardStyle}>📈 FinGrowth</div>,
    <div key="6" style={cardStyle}>🌱 EcoWorld</div>,
  ];

  return (
    <main style={{ padding: "4rem 0", background: "#0f172a", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#f8fafc", marginBottom: "2rem" }}>
        Our Trusted Partners
      </h2>

      {/* 2. Render the carousel component */}
      <InfiniteCarousel2 
        items={brandLogos}
        speed={20}              // Takes 20 seconds to complete one full loop
        direction="forward"     // Travels forward natively
        showPath={false}        // Hides the guide path line for production
      />
    </main>
  );
}

// Simple styling object for the HTML carousel cards
const cardStyle: React.CSSProperties = {
  background: "#1e293b",
  color: "#38bdf8",
  padding: "1rem 2rem",
  borderRadius: "12px",
  border: "1px solid #334155",
  fontWeight: "bold",
  fontSize: "1.1rem",
  whiteSpace: "nowrap",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};
