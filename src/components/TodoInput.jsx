import React from 'react'

const TodoInput = ({ newTodo, setNewTodo, onAdd }) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={onAdd}
        placeholder="What needs to be done?"
        className="w-full px-4 py-3 text-lg text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
      />
    </div>
  )
}

export default TodoInput