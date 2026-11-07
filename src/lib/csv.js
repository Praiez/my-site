const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const escapeCell = (value) => {
  let text = String(value ?? "");
  // Stops Excel and Google Sheets from running typed text as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

// Phone numbers stay as text so Excel keeps every digit, any leading zero and a leading +.
const phoneCell = (value) => {
  const text = String(value ?? "");
  return /^\+?\d{1,20}$/.test(text) ? `"=""${text}"""` : escapeCell(text);
};

export function buildCsv(rows) {
  const header = [
    "Full name",
    "Phone",
    "Email",
    "Sex",
    "Marital status",
    "Birthday",
    "Occupation",
    "Address",
    "Prayer request",
    "Submitted at",
  ];
  const lines = rows.map((row) =>
    [
      escapeCell(row.full_name),
      phoneCell(row.phone),
      escapeCell(row.email),
      escapeCell(row.sex),
      escapeCell(row.marital_status),
      escapeCell(row.birth_month && row.birth_day ? `${row.birth_day} ${MONTHS[row.birth_month - 1]}` : ""),
      escapeCell(row.occupation),
      escapeCell(row.address),
      escapeCell(row.prayer_request),
      escapeCell(
        row.submitted_at ? new Date(row.submitted_at).toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) : "",
      ),
    ].join(","),
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