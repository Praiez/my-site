// Numbers starting with 0 are treated as local and get this country code.
// 234 = Nigeria. Change it here if you ever need a different default.
export const DEFAULT_COUNTRY_CODE = "234";

// Turns a stored phone number into digits that include the country code,
// for example "08012345678" -> "2348012345678", "+447911123456" -> "447911123456".
export function toInternational(phone) {
  const raw = String(phone ?? "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return DEFAULT_COUNTRY_CODE + digits.slice(1);
  if (digits.length >= 11) return digits;
  return DEFAULT_COUNTRY_CODE + digits;
}

export function telLink(phone) {
  const number = toInternational(phone);
  return number ? `tel:+${number}` : "";
}

export function whatsappLink(phone) {
  const number = toInternational(phone);
  return number ? `https://wa.me/${number}` : "";
}