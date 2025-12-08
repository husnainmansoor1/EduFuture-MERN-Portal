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

        <div className="setting-content py-7.5 px-7.5 rounded-xl">
          <h2 className="text-2xl mb-5">Theme Setting</h2>

          <div className="theme-btn py-2.5 px-3.5 rounded-lg flex justify-between items-center gap-3.5">
            <span className="text-sm">
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </span>
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