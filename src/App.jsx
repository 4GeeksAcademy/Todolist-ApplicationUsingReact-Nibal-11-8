import React from 'react'
import TodoContainer from './components/TodoContainer'

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      <TodoContainer />
    </div>
  )
}

export default App