import React, { useState } from "react";
import "../styles/Setting.css";
import { useTheme } from "../context/ThemeContext";
import Switch from "react-switch";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Setting() {
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // sidebar toggle state

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="setting-page">
      <Navbar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="setting-layout">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="setting-content">
          <h2>Theme Setting</h2>

          <div className="theme-btn">
            <span>Switch to {theme === "light" ? "Dark" : "Light"} Mode</span>
            <Switch
              checked={theme === "dark"}
              onChange={toggleTheme}
              onColor="#2196f3"
              offColor="#ccc"
              uncheckedIcon={false}
              checkedIcon={false}
              height={25}
              width={40}
              handleDiameter={18}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
