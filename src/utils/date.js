import { parseISO, isValid } from "date-fns";

export function safeDate(input) {
  if (!input) return null;

 
  if (typeof input === "string") {
    const d = parseISO(input);
    return isValid(d) ? d : null;
  }
 
  if (input instanceof Date) {
    return isValid(input) ? input : null;
  }

  return null;
}

export function toISO(input) {
  const d = safeDate(input);
  return d ? d.toISOString() : null;
}

export function formatDate(input) {
  const d = safeDate(input);
  if (!d) return "-";
  return d.toISOString().slice(0, 10);
}
