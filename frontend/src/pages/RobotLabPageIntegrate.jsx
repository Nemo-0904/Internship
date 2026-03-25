import React from "react";
import { ExternalLink, Bot, Cpu } from "lucide-react";
import "../styles/RobotLabPage.css";

const RobotLabPageIntegrate = () => {
  const handleLaunch = () => {
    window.open("https://robotmanipulator.vercel.app/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="robot-lab-page" style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      width: "100vw" 
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "3rem",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        margin: "1rem"
      }}>
        {/* Animated Icon Ring */}
        <div style={{
          background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto 1.5rem",
          boxShadow: "0 0 30px rgba(78, 205, 196, 0.3)",
        }}>
          <Bot size={40} color="#ffffff" strokeWidth={1.5} />
        </div>

        <h1 style={{
          color: "var(--text-white)",
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "1rem",
          letterSpacing: "-0.025em"
        }}>
          Advanced Robot Lab
        </h1>

        <p style={{
          color: "var(--text-soft)",
          fontSize: "1rem",
          lineHeight: "1.6",
          marginBottom: "2rem"
        }}>
          Launch the 3D manipulator and real-time vision workspace in a dedicated fullscreen tab for **optimal performance** and **smoother frame rates**.
        </p>

        <button 
          onClick={handleLaunch}
          style={{
            background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
            color: "white",
            border: "none",
            padding: "12px 32px",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 10px 20px rgba(0, 114, 255, 0.3)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 15px 25px rgba(0, 114, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 114, 255, 0.3)";
          }}
        >
          Launch Workspace
          <ExternalLink size={18} />
        </button>

        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "8px", color: "var(--text-soft)", fontSize: "0.85rem" }}>
          <Cpu size={16} />
          <span>Requires Camera & WebGL access</span>
        </div>
      </div>
    </div>
  );
};

export default RobotLabPageIntegrate;