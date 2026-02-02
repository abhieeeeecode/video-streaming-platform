import { useEffect, useState } from "react";
import API from "../api";
import Analytics from "../components/Analytics";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Get role from JWT
  const token = localStorage.getItem("token");
  const role = token
    ? JSON.parse(atob(token.split(".")[1])).role
    : null;

  const fetchVideos = async () => {
    try {
      const res = await API.get("/api/videos");
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto-refresh every 5 seconds
  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ Loading state
  if (loading) {
    return (
      <h2 style={{ color: "white", padding: 40 }}>
        Loading dashboard…
      </h2>
    );
  }

  return (
    <div style={{ padding: 40, minHeight: "100vh" }}>
      <h1>Dashboard</h1>
<div style={{ marginTop: 40 }}>
  <Analytics videos={videos} />
</div>

      {/* 📊 STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        <Stat title="Uploads" value={videos.length} />
        <Stat
          title="Safe"
          value={videos.filter((v) => v.status === "safe").length}
        />
        <Stat
          title="Flagged"
          value={videos.filter((v) => v.status === "flagged").length}
        />
      </div>

      {/* 🎥 RECENT VIDEOS */}
      <h2 style={{ marginTop: 40 }}>Recent Videos</h2>

      {videos.length === 0 && <p>No videos yet</p>}

      {videos.map((v) => (
        <div
          key={v._id}
          className="glass-card"
          style={{ marginBottom: 20 }}
        >
          <p>
            <b>{v.title}</b> — <b>{v.status}</b>
          </p>

          {/* ▶️ Stream only SAFE videos */}
          {v.status === "safe" && (
            <video width="320" controls>
              <source
                src={`http://localhost:5000/api/stream/${v.filename}`}
                type="video/mp4"
              />
            </video>
          )}

          {/* 👑 ADMIN ACTIONS */}
          {role === "admin" && v.status !== "safe" && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={async () => {
                  await API.patch(
                    `/api/videos/${v._id}/status`,
                    { status: "safe" }
                  );
                  fetchVideos();
                }}
              >
                ✅ Approve
              </button>

              <button
                style={{ marginLeft: 10 }}
                onClick={async () => {
                  await API.patch(
                    `/api/videos/${v._id}/status`,
                    { status: "flagged" }
                  );
                  fetchVideos();
                }}
              >
                🚫 Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 📦 STAT CARD
const Stat = ({ title, value }) => (
  <div className="glass-card">
    <h3>{title}</h3>
    <h1>{value}</h1>
  </div>
);
