// API configuration and methods
const API_BASE = 'https://jsonplaceholder.typicode.com'

export const todoAPI = {
  async createUser(username) {
    // JSONPlaceholder doesn't require user creation
    return true
  },

  async getTodos(username) {
    try {
      const response = await fetch(`${API_BASE}/todos?userId=1`)
      if (response.ok) {
        const data = await response.json()
        return data.slice(0, 5) // Get first 5 todos
      }
      return []
    } catch (err) {
      console.error('Get error:', err)
      return []
    }
  },

  async saveTodos(username, todos) {
    try {
      // Save to localStorage as fallback since JSONPlaceholder is read-only
      localStorage.setItem(`todos_${username}`, JSON.stringify(todos))
      return true
    } catch (err) {
      console.error('Save error:', err)
      return false
    }
  },

  async loadFromStorage(username) {
    try {
      const stored = localStorage.getItem(`todos_${username}`)
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      return []
    }
  }
}
