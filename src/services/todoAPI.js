// Complete API service with all required endpoints
const API_BASE = 'http://localhost:3001/api'

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
