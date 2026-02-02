import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/glass.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="profile-wrapper">
      <div className="avatar" onClick={() => setOpen(!open)}>
        👤
      </div>

      {open && (
        <div className="glass-card profile-menu">
          <p onClick={() => navigate("/settings")}>⚙ Settings</p>
          <p onClick={logout}>🚪 Logout</p>
        </div>
      )}
    </div>
  );
}
