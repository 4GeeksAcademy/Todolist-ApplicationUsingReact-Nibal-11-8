import React, { useState, useEffect } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

  const API_URL = username ? `https://playground.4geeks.com/todo/todos/${username}` : null

  useEffect(() => {
    // Load username from localStorage or create new one
    let savedUsername = localStorage.getItem('todoUsername')
    if (!savedUsername) {
      savedUsername = 'nibal_' + Date.now()
      localStorage.setItem('todoUsername', savedUsername)
    }
    setUsername(savedUsername)
  }, [])

  useEffect(() => {
    if (username) {
      initializeApp()
    }
  }, [username])

  const initializeApp = async () => {
    try {
      setLoading(true)
      // Create user first
      await fetch(`https://playground.4geeks.com/todo/user/${username}`, {
        method: 'POST'
      })
      
      // Wait a bit for server
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Then load todos
      const res = await fetch(API_URL)
      if (res.ok) {
        const data = await res.json()
        setTodos(Array.isArray(data.todos) ? data.todos : [])
      } else {
        setTodos([])
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const updateTodos = async (next) => {
    setTodos(next)
    
    // Update each todo on server
    for (const todo of next) {
      try {
        await fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo)
        })
      } catch (err) {
        console.error('Update error:', err)
      }
    }
  }

  const handleAdd = async (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      try {
        const task = {
          label: newTodo.trim(),
          done: false
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
        })

        if (response.ok) {
          setNewTodo('')
          // Reload todos
          const res = await fetch(API_URL)
          const data = await res.json()
          setTodos(Array.isArray(data.todos) ? data.todos : [])
        }
      } catch (err) {
        console.error('Add error:', err)
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: 'DELETE'
      })
      // Reload todos
      const res = await fetch(API_URL)
      const data = await res.json()
      setTodos(Array.isArray(data.todos) ? data.todos : [])
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const toggleDone = async (id, currentDone) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: todo.label,
          done: !currentDone
        })
      })
      // Reload todos
      const res = await fetch(API_URL)
      const data = await res.json()
      setTodos(Array.isArray(data.todos) ? data.todos : [])
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const clearAll = async () => {
    if (window.confirm('Delete all tasks?')) {
      try {
        for (const todo of todos) {
          await fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
            method: 'DELETE'
          })
        }
        setTodos([])
      } catch (err) {
        console.error('Clear error:', err)
      }
    }
  }

  const itemsLeft = todos.filter(t => !t.done).length

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-6xl font-light text-gray-300 text-center mb-8 tracking-widest">todos</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleAdd}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 text-lg text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="divide-y divide-gray-200">
              {todos.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-lg">No tasks, add a task</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleDone(todo.id, todo.done)}
                      className="w-5 h-5 text-blue-500 rounded cursor-pointer accent-blue-500 flex-shrink-0"
                    />
                    <span
                      className={`flex-1 text-lg ${
                        todo.done
                          ? 'line-through text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {todo.label}
                    </span>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
              <span>{itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left</span>
              {todos.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TodoList
