import React from 'react'
import TodoItem from './TodoItem'

const TodoListDisplay = ({ todos, onToggle, onDelete }) => {
  return (
    <div className="divide-y divide-gray-200">
      {todos.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <p className="text-lg">No tasks, add a task</p>
        </div>
      ) : (
        todos.map((todo, idx) => (
          <TodoItem
            key={idx}
            todo={todo}
            index={idx}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

export default TodoListDisplay