export const CAL_URL = "https://api.cal.com/v2";
export const CAL_SLOTS_VERSION = "2024-09-04";
export const CAL_BOOKINGS_VERSION = "2024-08-13";

export function calHeaders(version: string) {
  const key = process.env.CAL_API_KEY;
  if (!key) throw new Error("CAL_API_KEY is missing");
  return {
    Authorization: `Bearer ${key}`,
    "cal-api-version": version,
    "Content-Type": "application/json",
  };
}

export function calEventTypeId() {
  const id = Number(process.env.CAL_EVENT_TYPE_ID);
  if (!id) throw new Error("CAL_EVENT_TYPE_ID is missing");
  return id;
}