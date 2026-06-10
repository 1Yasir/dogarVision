export function sanitizePhoneInput(value) {
  if (!value) return "";

  let result = "";
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (char >= "0" && char <= "9") {
      result += char;
    } else if (char === "+" && result.length === 0) {
      result += char;
    }
  }
  return result;
}

export function isValidPakistaniPhone(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("+92")) {
    return trimmed.length === 13 && /^\+92\d{10}$/.test(trimmed);
  }

  if (trimmed.startsWith("0")) {
    return trimmed.length === 11 && /^0\d{10}$/.test(trimmed);
  }

  return false;
}

export const PAKISTANI_PHONE_ERROR =
  "Please enter a valid Pakistani phone number (e.g., 03xxxxxxxxx)";
