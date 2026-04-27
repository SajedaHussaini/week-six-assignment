import { useMediaQuery } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from "recharts";

export default function ProgressChart({ data }) {

  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? 200 : 300
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

          <XAxis
            dataKey="category"
            tick={{ fontSize: isMobile ? 9 : 11 }}
            interval={0}
            angle={isMobile ? -15 : 0}
            textAnchor={isMobile ? "end" : "middle"}
          />

          <YAxis tick={{ fontSize: isMobile ? 9 : 11 }} />

          <Tooltip
            contentStyle={{ fontSize: "12px" }}
            formatter={(value, name) => {
              if (name === "active") return [`${value}`, "Active"];
              if (name === "completed") return [`${value}`, "Completed"];
              return [value, name];
            }}
          />

          <Legend

            wrapperStyle={{
              fontSize: "11px"
            }}
          />

          <Bar
            dataKey="active"
            fill="#22c55e"
            name="Active"
            radius={[6, 6, 0, 0]}
            barSize={isMobile ? 8 : 18}
          />

          <Bar
            dataKey="completed"
            fill="#3b82f6"
            name="Completed"
            radius={[6, 6, 0, 0]}
            barSize={isMobile ? 8 : 18}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
