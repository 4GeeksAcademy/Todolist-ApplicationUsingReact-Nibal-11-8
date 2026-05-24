import React from 'react'

const TodoItem = ({ todo, index, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(todo.label)

  const handleSaveEdit = () => {
    if (editValue.trim() !== '') {
      onEdit(index, editValue.trim())
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(todo.label)
    }
  }

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(index)}
        className="w-5 h-5 text-blue-500 rounded cursor-pointer accent-blue-500 flex-shrink-0"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={handleSaveEdit}
          autoFocus
          className="flex-1 px-3 py-1 text-lg border border-blue-500 rounded focus:outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-1 text-lg cursor-pointer ${
            todo.done
              ? 'line-through text-gray-400'
              : 'text-gray-700'
          }`}
        >
          {todo.label}
        </span>
      )}
      
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
