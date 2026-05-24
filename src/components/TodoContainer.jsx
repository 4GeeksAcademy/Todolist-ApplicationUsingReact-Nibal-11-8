import React, { useState, useEffect } from 'react'
import TodoHeader from './TodoHeader'
import TodoInput from './TodoInput'
import TodoListDisplay from './TodoListDisplay'
import TodoFooter from './TodoFooter'
import { todoAPI } from '../services/todoAPI'
import { userStorage } from '../services/userStorage'

const TodoContainer = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const user = userStorage.getUsername()
    setUsername(user)
  }, [])

  useEffect(() => {
    if (username) {
      initializeApp()
    }
  }, [username])

  const initializeApp = async () => {
    try {
      setLoading(true)
      
      // Try to load from localStorage first
      let storedTodos = await todoAPI.loadFromStorage(username)
      
      if (storedTodos.length === 0) {
        // If no stored todos, fetch from API
        const apiTodos = await todoAPI.getTodos(username)
        storedTodos = apiTodos
      }
      
      setTodos(storedTodos)
      setLoading(false)
    } catch (err) {
      console.error('Init error:', err)
      setLoading(false)
    }
  }

  const saveTodos = async (updatedTodos) => {
    try {
      await todoAPI.saveTodos(username, updatedTodos)
      setTodos(updatedTodos)
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleAdd = async (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      const newTask = { label: newTodo.trim(), done: false }
      const updatedTodos = [...todos, newTask]
      setNewTodo('')
      await saveTodos(updatedTodos)
    }
  }

  const handleToggle = async (idx) => {
    const updatedTodos = [...todos]
    updatedTodos[idx].done = !updatedTodos[idx].done
    await saveTodos(updatedTodos)
  }

  const handleDelete = async (idx) => {
    const updatedTodos = todos.filter((_, i) => i !== idx)
    await saveTodos(updatedTodos)
  }

  const handleClearAll = async () => {
    if (window.confirm('Delete all tasks?')) {
      await saveTodos([])
    }
  }

  const itemsLeft = todos.filter(t => !t.done).length

  return (
    <div className="w-full max-w-2xl">
      <TodoHeader />

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <TodoInput newTodo={newTodo} setNewTodo={setNewTodo} onAdd={handleAdd} />
          <TodoListDisplay
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
          <TodoFooter
            itemsLeft={itemsLeft}
            onClearAll={handleClearAll}
            hasItems={todos.length > 0}
          />
        </div>
      )}
    </div>
  )
}

export default TodoContainer
