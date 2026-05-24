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
      
      // Create user in backend
      await todoAPI.createUser(username)
      
      // Fetch todos from backend API
      const apiTodos = await todoAPI.getTodos(username)
      setTodos(Array.isArray(apiTodos) ? apiTodos : [])
      
      setLoading(false)
    } catch (err) {
      console.error('Init error:', err)
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      try {
        // POST new todo to backend
        const newTask = await todoAPI.addTodo(username, newTodo.trim())
        
        if (newTask) {
          // Fetch updated list from backend
          const updatedTodos = await todoAPI.getTodos(username)
          setTodos(Array.isArray(updatedTodos) ? updatedTodos : [])
          setNewTodo('')
        }
      } catch (err) {
        console.error('Add error:', err)
      }
    }
  }

  const handleToggle = async (idx) => {
    try {
      const todo = todos[idx]
      // PUT update to backend
      await todoAPI.updateTodo(todo.id, todo.label, !todo.done)
      
      // Fetch updated list from backend
      const updatedTodos = await todoAPI.getTodos(username)
      setTodos(Array.isArray(updatedTodos) ? updatedTodos : [])
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const handleDelete = async (idx) => {
    try {
      const todo = todos[idx]
      // DELETE from backend
      await todoAPI.deleteTodo(todo.id)
      
      // Fetch updated list from backend
      const updatedTodos = await todoAPI.getTodos(username)
      setTodos(Array.isArray(updatedTodos) ? updatedTodos : [])
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleClearAll = async () => {
    if (window.confirm('Delete all tasks?')) {
      try {
        // DELETE all todos from backend
        await todoAPI.deleteAllTodos(username)
        setTodos([])
      } catch (err) {
        console.error('Clear all error:', err)
      }
    }
  }

  const handleEdit = async (idx, newLabel) => {
    try {
      const todo = todos[idx]
      // PUT update to backend
      await todoAPI.updateTodo(todo.id, newLabel, todo.done)
      
      // Fetch updated list from backend
      const updatedTodos = await todoAPI.getTodos(username)
      setTodos(Array.isArray(updatedTodos) ? updatedTodos : [])
    } catch (err) {
      console.error('Edit error:', err)
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
            onEdit={handleEdit}
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
