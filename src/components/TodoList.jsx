import React, { useState, useEffect } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

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
      loadTodos()
    }
  }, [username])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const API_URL = `https://playground.4geeks.com/apis/fake/todos/user/${username}`
      
      const res = await fetch(API_URL)
      if (res.ok) {
        const data = await res.json()
        setTodos(Array.isArray(data) ? data : [])
      } else {
        // Create user if doesn't exist
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        })
        setTodos([])
      }
      setLoading(false)
    } catch (err) {
      console.error('Load error:', err)
      setLoading(false)
    }
  }

  const saveTodosToAPI = async (newTodos) => {
    try {
      const API_URL = `https://playground.4geeks.com/apis/fake/todos/user/${username}`
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodos)
      })
      if (response.ok) {
        setTodos(newTodos)
      }
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleAdd = async (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      const newTodos = [...todos, { label: newTodo.trim(), done: false }]
      setNewTodo('')
      await saveTodosToAPI(newTodos)
    }
  }

  const handleDelete = async (idx) => {
    const newTodos = todos.filter((_, i) => i !== idx)
    await saveTodosToAPI(newTodos)
  }

  const toggleDone = async (idx) => {
    const newTodos = [...todos]
    newTodos[idx].done = !newTodos[idx].done
    await saveTodosToAPI(newTodos)
  }

  const clearAll = async () => {
    if (window.confirm('Delete all tasks?')) {
      await saveTodosToAPI([])
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
                todos.map((todo, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleDone(idx)}
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
                      onClick={() => handleDelete(idx)}
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
