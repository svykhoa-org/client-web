/**
 * Human course/lesson duration: "N phút" under an hour, "H giờ" or "H giờ M phút"
 * above. Course durations are computed from the curriculum, so short courses
 * (a few minutes) are common — never round them down to "0 giờ".
 */
export function formatDurationMinutes(minutes: number): string {
  const total = Math.max(0, Math.round(minutes))
  if (total < 60) return `${total} phút`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`
}
