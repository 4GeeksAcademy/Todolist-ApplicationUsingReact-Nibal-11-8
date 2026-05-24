// API configuration and methods
const API_BASE = 'https://assets.breatheco.de/apis/fake/todos'

export const todoAPI = {
  async createUser(username) {
    const response = await fetch(`${API_BASE}/user/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    })
    return response.ok
  },

  async getTodos(username) {
    const response = await fetch(`${API_BASE}/user/${username}`)
    if (response.ok) {
      return await response.json()
    }
    return []
  },

  async saveTodos(username, todos) {
    const response = await fetch(`${API_BASE}/user/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todos)
    })
    return response.ok
  }
}
