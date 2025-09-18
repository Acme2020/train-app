// Filters an array of board entries (departures/arrivals) by duration in minutes from now
export function filterByDuration<T extends { when?: string }>(
  entries: T[],
  duration: number
): T[] {
  const now = Date.now();
  const cutoff = now + duration * 60 * 1000;
  return entries.filter((entry) => {
    const when = entry.when ? new Date(entry.when).getTime() : 0;
    return when >= now && when <= cutoff;
  });
}
