function debounce(callback, ms) {
  let DelayId = null
  return (...args) => {
    clearTimeout(DelayId)
    DelayId = setTimeout(() => callback(args), ms)
  }
}

const names = [
  'Nick',
  'Bob',
  'Lena',
  'Liza',
  'John',
]

