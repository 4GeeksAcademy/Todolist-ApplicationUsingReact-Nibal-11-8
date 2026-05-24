import React from 'react'

const TodoItem = ({ todo, index, onToggle, onDelete }) => {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(index)}
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
        onClick={() => onDelete(index)}
        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-xl"
      >
        ×
      </button>
    </div>
  )
}

export default TodoItem