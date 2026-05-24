import React, { useState, useEffect } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const username = 'nibal'

  const API_BASE = 'https://playground.4geeks.com/todo'

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      setLoading(true)
      setError('')
      
      const createRes = await fetch(`${API_BASE}/user/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (createRes.status !== 201 && createRes.status !== 400) {
        const errorData = await createRes.text()
        throw new Error(`User creation failed: ${errorData}`)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      
      const loadRes = await fetch(`${API_BASE}/todos/${username}`)
      if (!loadRes.ok) {
        throw new Error('Failed to load todos')
      }

      const data = await loadRes.json()
      setTodos(data.todos || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const loadTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos/${username}`)
      if (!response.ok) {
        throw new Error('Failed to load todos')
      }
      const data = await response.json()
      setTodos(data.todos || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const addTodo = async (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      try {
        setError('')
        const task = {
          label: input.trim(),
          done: false
        }

        const response = await fetch(`${API_BASE}/todos/${username}`, {
          method: 'POST',
          body: JSON.stringify(task),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errText = await response.text()
          throw new Error(errText || 'Failed to add task')
        }

        setInput('')
        await loadTodos()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError('')
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      await loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleComplete = async (id, currentDone) => {
    try {
      setError('')
      const todoToUpdate = todos.find(t => t.id === id)
      
      if (!todoToUpdate) {
        throw new Error('Task not found')
      }

      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          label: todoToUpdate.label,
          done: !currentDone
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      await loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  const clearAllTodos = async () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
      try {
        setError('')
        const response = await fetch(`${API_BASE}/user/${username}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to clear tasks')
        }

        setTodos([])
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const itemsLeft = todos.filter(todo => !todo.done).length

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-6xl font-light text-gray-300 text-center mb-2 tracking-widest">todos</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center">
          Loading...
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={addTodo}
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
                todos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggleComplete(todo.id, todo.done)}
                    onDelete={() => deleteTodo(todo.id)}
                  />
                ))
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500 font-light">
                {itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left
              </p>
              {todos.length > 0 && (
                <button
                  onClick={clearAllTodos}
                  className="text-sm text-red-600 hover:text-red-800 font-semibold transition"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Synced with 4Geeks API</p>
          </div>
        </>
      )}
    </div>
  )
}

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={onToggle}
        className="w-5 h-5 text-blue-500 rounded cursor-pointer accent-blue-500 flex-shrink-0"
      />

      <span
        className={`flex-1 text-lg transition-all duration-200 ${
          todo.done
            ? 'line-through text-gray-400'
            : 'text-gray-700'
        }`}
      >
        {todo.label}
      </span>

      {isHovering && (
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0 text-xl font-light"
          aria-label="Delete todo"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default TodoList
