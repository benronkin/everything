/**
 *
 */
export function debounce(cb, delay) {
  let timeoutID
  return () => {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      cb()
    }, delay)
  }
}
