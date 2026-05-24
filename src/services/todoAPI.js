// Complete API service with all required endpoints

// Detect if running in GitHub Codespaces or localhost
const getAPIBase = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // GitHub Codespaces format: *.app.github.dev
    if (hostname.includes('app.github.dev')) {
      // Extract the subdomain prefix (e.g., "super-duper-giggle-9rqxxw5q9p439xg6")
      const parts = hostname.split('.')
      const prefix = parts[0]
      // Construct the 3001 port URL
      return `https://${prefix}-3001.app.github.dev`
    }
    
    // Localhost development
    return 'http://localhost:3001'
  }
  
  return 'http://localhost:3001'
}

const API_BASE = getAPIBase() + '/api'

console.log('🔌 API Base URL:', API_BASE)

export const todoAPI = {
  // GET all todos for user
  async getTodos(username) {
    try {
      const response = await fetch(`${API_BASE}/todos?username=${username}`)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (err) {
      console.error('GET todos error:', err)
      return []
    }
  },

  // POST new todo
  async addTodo(username, label) {
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          label,
          done: false
        })
      })
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (err) {
      console.error('POST todo error:', err)
      return null
    }
  },

  // PUT update todo (toggle complete or edit)
  async updateTodo(id, label, done) {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label,
          done
        })
      })
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (err) {
      console.error('PUT todo error:', err)
      return null
    }
  },

  // DELETE single todo
  async deleteTodo(id) {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (err) {
      console.error('DELETE todo error:', err)
      return false
    }
  },

  // DELETE all todos for user
  async deleteAllTodos(username) {
    try {
      const response = await fetch(`${API_BASE}/todos/user/${username}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (err) {
      console.error('DELETE all error:', err)
      return false
    }
  },

  // Create user
  async createUser(username) {
    try {
      const response = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      return response.ok
    } catch (err) {
      console.error('Create user error:', err)
      return false
    }
  }
}
