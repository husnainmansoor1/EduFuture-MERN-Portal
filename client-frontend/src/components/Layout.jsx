import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isExpanded, setIsExpanded] = useState(true);   
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />

      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        />
      )}

      <Sidebar isExpanded={isExpanded} isMobileOpen={isMobileOpen} />

      <main
        style={{
          marginLeft: window.innerWidth > 768 ? (isExpanded ? "200px" : "70px") : "0px",
          transition: "0.3s",
          paddingTop: "70px",
        }}
      >
        {children}
      </main>
    </>
  );
}
