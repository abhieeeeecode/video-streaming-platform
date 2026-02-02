import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics({ videos }) {
  const data = [
    { name: "Safe", value: videos.filter(v => v.status === "safe").length },
    { name: "Flagged", value: videos.filter(v => v.status === "flagged").length },
  ];

  return (
    <div className="glass-card">
      <h3>Video Analytics</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
