export function generateColor() {
  return Math.ceil(Math.random() * 10).toString()
}

export function updateTagDB(table, data) {
  localStorage.setItem(table, JSON.stringify(data))
}

export function getTagDB(table, data) {
  return JSON.parse(localStorge.setItem(table, JSON.stringify(data)))
}