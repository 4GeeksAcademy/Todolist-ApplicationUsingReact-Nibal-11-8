import React from 'react'

const TodoFooter = ({ itemsLeft, onClearAll, hasItems }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
      <span>{itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left</span>
      {hasItems && (
        <button
          onClick={onClearAll}
          className="text-red-600 hover:text-red-800 font-semibold"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

export default TodoFooter