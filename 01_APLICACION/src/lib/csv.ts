export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);

  const escape = (value: unknown) => {
    if (value == null) return "";
    let str = String(value);
    // Prevent spreadsheet formula injection in untrusted textual fields.
    // Numeric values remain numeric, including negative amounts.
    if (typeof value === "string" && /^[\u0000-\u0020]*[=+\-@]/.test(str)) {
      str = `'${str}`;
    }
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}
