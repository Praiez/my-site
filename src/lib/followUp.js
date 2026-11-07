export const FOLLOW_UP_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "visited_again", label: "Visited again" },
  { value: "joined_group", label: "Joined a group" },
  { value: "closed", label: "Closed" },
];

export const FOLLOW_UP_VALUES = FOLLOW_UP_STATUSES.map((status) => status.value);
export const NOTES_MAX_CHARS = 2000;

// Someone still marked "New" after this many days is flagged as needing attention.
export const OVERDUE_DAYS = 3;

export const statusLabel = (value) => FOLLOW_UP_STATUSES.find((status) => status.value === value)?.label ?? "New";

export function daysSince(value) {
  if (!value) return 0;
  return Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
}