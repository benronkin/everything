export function debounce(cb, delay) {
  let timeoutID

  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID)

    timeoutID = setTimeout(() => cb(...args), delay)
  }
}
