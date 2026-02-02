import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const token = localStorage.getItem("token");

  const fetchVideos = async () => {
    if (!token) {
      console.log("No token found, skipping fetch");
      return;
    }

    try {
      const res = await axios.get(`${API}/api/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("Fetch videos failed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Videos</h3>

      {videos.length === 0 && <p>No videos available</p>}

      {videos.map((v) => (
        <div key={v._id} style={{ marginBottom: 30 }}>
          <p>
            <b>{v.title}</b> — {v.status}
          </p>

          <video width="400" controls>
            <source src={`${API}/api/stream/${v.filename}`} />
          </video>
        </div>
      ))}
    </div>
  );
}

export default VideoList;
