const escapeCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export function buildCsv(rows) {
  const header = ["Full name", "Phone", "Marital status", "Birthday", "Occupation", "Address", "Submitted at"];
  const lines = rows.map((row) =>
    [
      row.full_name,
      row.phone,
      row.marital_status,
      row.birth_month && row.birth_day ? `${row.birth_day}/${row.birth_month}` : "",
      row.occupation,
      row.address,
      row.submitted_at ? new Date(row.submitted_at).toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) : "",
    ]
      .map(escapeCell)
      .join(","),
  );
  return [header.map(escapeCell).join(","), ...lines].join("\r\n");
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}