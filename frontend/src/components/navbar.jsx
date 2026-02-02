import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { logout } from "../auth";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = token
    ? JSON.parse(atob(token.split(".")[1])).role
    : null;

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="navbar"
    >
      <div className="logo">NebulaStream</div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>

        {role === "admin" && (
          <Link to="/upload" className="upload-btn">
            ⬆ Upload
          </Link>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </motion.nav>
  );
}
