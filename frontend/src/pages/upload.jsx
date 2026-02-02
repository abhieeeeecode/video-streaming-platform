import { useState } from "react";
import API from "../api";

export default function Upload() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const fd = new FormData();
    fd.append("video", file);
    fd.append("title", file.name);

    await API.post("/api/upload", fd);
    alert("Uploaded");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Upload</h1>

      <div className="glass-card">
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
        <button onClick={upload}>Upload</button>
      </div>
    </div>
  );
}
