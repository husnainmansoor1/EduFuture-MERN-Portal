import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Oops! The page you are looking for doesn’t exist.</p>
      <Link to="/login" className="notfound-btn">
        Go Back Home
      </Link>
    </div>
  );
}
