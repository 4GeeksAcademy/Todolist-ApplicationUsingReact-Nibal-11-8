import React, { useState, useEffect } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [username] = useState('nibal-' + Math.random().toString(36).substr(2, 9))
  const [userCreated, setUserCreated] = useState(false)

  const API_BASE = 'https://playground.4geeks.com/todo'

  // Create user and load todos on mount
  useEffect(() => {
    createUser()
  }, [])

  const createUser = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Creating user:', username)
      
      const response = await fetch(`${API_BASE}/user/${username}`, {
        method: 'POST'
      })

      console.log('Create user response:', response.status)

      if (response.ok || response.status === 400) {
        // 400 means user already exists (which is fine)
        console.log('User created/loaded successfully')
        setUserCreated(true)
        await loadTodos()
      } else {
        throw new Error(`Failed with status ${response.status}`)
      }
    } catch (err) {
      setError('⚠️ Failed to initialize: ' + err.message)
      console.error('User creation error:', err)
      setLoading(false)
    }
  }

  const loadTodos = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Loading todos for:', username)
      
      const response = await fetch(`${API_BASE}/todos/${username}`)
      console.log('Load todos response:', response.status)

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log('Todos loaded:', data)
      setTodos(data.todos || [])
      setLoading(false)
    } catch (err) {
      setError('⚠️ Failed to load todos: ' + err.message)
      console.error('Load todos error:', err)
      setLoading(false)
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

        console.log('Adding task:', task)

        const response = await fetch(`${API_BASE}/todos/${username}`, {
          method: 'POST',
          body: JSON.stringify(task),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Add task response:', response.status)

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        const data = await response.json()
        console.log('Task added:', data)
        setInput('')
        await loadTodos()
      } catch (err) {
        setError('⚠️ Failed to add task: ' + err.message)
        console.error('Add todo error:', err)
      }
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError('')
      console.log('Deleting task:', id)

      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE'
      })

      console.log('Delete response:', response.status)

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`)
      }

      console.log('Task deleted')
      await loadTodos()
    } catch (err) {
      setError('⚠️ Failed to delete task: ' + err.message)
      console.error('Delete todo error:', err)
    }
  }

  const toggleComplete = async (id, currentDone) => {
    try {
      setError('')
      const todoToUpdate = todos.find(t => t.id === id)
      
      if (!todoToUpdate) {
        throw new Error('Task not found')
      }

      console.log('Updating task:', id, 'done:', !currentDone)

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

      console.log('Update response:', response.status)

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`)
      }

      console.log('Task updated')
      await loadTodos()
    } catch (err) {
      setError('⚠️ Failed to update task: ' + err.message)
      console.error('Toggle todo error:', err)
    }
  }

  const clearAllTodos = async () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
      try {
        setError('')
        console.log('Clearing all tasks for:', username)

        const response = await fetch(`${API_BASE}/user/${username}`, {
          method: 'DELETE'
        })

        console.log('Clear all response:', response.status)

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`)
        }

        setTodos([])
        console.log('All tasks cleared')
      } catch (err) {
        setError('⚠️ Failed to clear all tasks: ' + err.message)
        console.error('Clear all error:', err)
      }
    }
  }

  const itemsLeft = todos.filter(todo => !todo.done).length

  return (
    <div className="w-full max-w-2xl">
      {/* Title */}
      <h1 className="text-6xl font-light text-gray-300 text-center mb-2 tracking-widest">todos</h1>
      <p className="text-center text-gray-400 text-sm mb-6">
        {loading ? 'Initializing...' : `User: ${username}`}
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center">
          <i className="fas fa-spinner fa-spin mr-2"></i> Initializing your TODO list...
        </div>
      ) : (
        <>
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Input Section */}
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

            {/* Todos List */}
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

            {/* Footer */}
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

          {/* Info */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>✨ Synced with 4Geeks API</p>
            <p className="mt-1">All changes are saved to the server automatically</p>
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
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.done}
        onChange={onToggle}
        className="w-5 h-5 text-blue-500 rounded cursor-pointer accent-blue-500 flex-shrink-0"
      />

      {/* Todo Text */}
      <span
        className={`flex-1 text-lg transition-all duration-200 ${
          todo.done
            ? 'line-through text-gray-400'
            : 'text-gray-700'
        }`}
      >
        {todo.label}
      </span>

      {/* Delete Button - Shows on Hover */}
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
