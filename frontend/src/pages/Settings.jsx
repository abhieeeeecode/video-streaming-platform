import "..//glass.css";

export default function Settings() {
  return (
    <div className="page-center">
      <div className="glass-card settings-card">
        <h2>Settings</h2>

        <input placeholder="New Password" type="password" />
        <input placeholder="Confirm Password" type="password" />

        <button>Update Password</button>
      </div>
    </div>
  );
}
