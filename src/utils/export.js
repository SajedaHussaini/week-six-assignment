export function exportGoalsToJSON(goals) {
  const dataStr = JSON.stringify(goals, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "goals.json";
  a.click();
}

export function exportGoalsToCSV(goals) {
  if (!Array.isArray(goals) || goals.length === 0) return;

  const cleaned = goals.map(g => ({
    id: g.id,
    title: g.title,
    category: g.category,
    status: g.status,
    progress: g.progress,
    target: g.target,
    createdAt: g.createdAt
  }));

  const headers = Object.keys(cleaned[0]);

  const rows = [
    headers.join(","),
    ...cleaned.map(row =>
      headers.map(h =>
        `"${String(row[h] ?? "").replace(/"/g, '""')}"`
      ).join(",")
    )
  ];

  const blob = new Blob([rows.join("\n")], {
    type: "text/csv;charset=utf-8;"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "goals.csv";
  a.click();
}
