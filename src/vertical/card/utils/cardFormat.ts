export function maskCardNumber(numCard: string, revealed = false): string {
  const digits = numCard.replace(/\s+/g, "");

  if (!revealed) {
    return `•••• •••• •••• ${digits.slice(-4)}`;
  }

  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiration(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${year}`;
}
