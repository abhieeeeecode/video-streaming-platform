import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function UploadBox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadVideo = async () => {
    if (!file) {
      alert("Select a video first");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", file.name);

    try {
      setLoading(true);
      await axios.post(`${API}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Upload successful");
      window.location.reload();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Video</h3>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadVideo} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default UploadBox;
