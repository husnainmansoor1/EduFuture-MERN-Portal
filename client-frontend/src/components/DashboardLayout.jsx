// components/DashboardLayout.jsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
