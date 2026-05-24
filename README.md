# TODO List Application - React with API Integration

🚀 **A TODO list app that syncs with a real backend API - Assignment 2!**

## ✨ Features

✅ **Create User** - Auto-generates a unique user on first load  
✅ **Fetch Tasks from Server** - Loads todos from 4Geeks API (GET)  
✅ **Add Tasks to Server** - Posts new tasks to backend (POST)  
✅ **Delete Tasks from Server** - Removes tasks from database (DELETE)  
✅ **Toggle Complete** - Mark tasks done/undone (PUT)  
✅ **Clear All Button** - Delete entire list from server  
✅ **Async/Await** - All API calls use modern async programming  
✅ **Error Handling** - Displays errors if API calls fail  
✅ **Loading States** - Shows loading indicator during requests  
✅ **Server Sync** - All data persists on the backend  
✅ **Hover Delete** - X button appears on hover  
✅ **Task Counter** - Shows "X items left"  

## 🚀 Installation

```bash
# Clean install
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Start dev server
npm start
```

The app opens at **http://localhost:3000** 🎯

## 📡 API Integration Details

### Backend Used
**4Geeks TODO API** - `https://playground.4geeks.com/todo`

### Endpoints

#### 1. **Create User** (POST)
```javascript
POST /user/{username}
// Creates a new user
```

#### 2. **Load Tasks** (GET)
```javascript
GET /todos/{username}
// Fetches all tasks for a user
```

#### 3. **Add Task** (POST)
```javascript
POST /todos/{username}
Body: { label: "Task name", done: false }
// Adds a new task
```

#### 4. **Update Task** (PUT)
```javascript
PUT /todos/{id}
Body: { label: "Task name", done: true/false }
// Updates task completion status
```

#### 5. **Delete Task** (DELETE)
```javascript
DELETE /todos/{id}
// Removes a single task
```

#### 6. **Clear All Tasks** (DELETE)
```javascript
DELETE /user/{username}
// Deletes entire user and all their tasks
```

## 💡 How to Use

1. **App loads** → Auto-creates user and loads tasks
2. **Add task** → Type in input and press Enter (syncs to server)
3. **Complete task** → Click checkbox (syncs to server)
4. **Delete task** → Hover and click X (syncs to server)
5. **Clear all** → Click "Clear all" button (deletes from server)
6. **Refresh** → All tasks load from server automatically

## 🎨 Design Features

- Minimalist light gray aesthetic
- Clean white card with shadow
- Smooth hover effects
- X button appears on hover
- Dynamic counter in real-time
- Loading indicators
- Error messages
- Professional typography

## 📦 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests
- **Async/Await** - Asynchronous programming
- **4Geeks API** - Backend service

## 🔄 Async Programming Key Moments

### 1. **Load tasks on start** (useEffect)
```javascript
useEffect(() => {
  createUser()
}, [])

const loadTodos = async () => {
  const response = await fetch(`${API_BASE}/todos/${username}`)
  const data = await response.json()
  setTodos(data.todos || [])
}
```

### 2. **Add a task** (POST + GET)
```javascript
const addTodo = async (e) => {
  const task = { label: input.trim(), done: false }
  const response = await fetch(`${API_BASE}/todos/${username}`, {
    method: 'POST',
    body: JSON.stringify(task)
  })
  await loadTodos() // Refresh list from server
}
```

### 3. **Delete a task** (DELETE + GET)
```javascript
const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE'
  })
  await loadTodos() // Refresh list from server
}
```

### 4. **Clear all tasks** (DELETE)
```javascript
const clearAllTodos = async () => {
  const response = await fetch(`${API_BASE}/user/${username}`, {
    method: 'DELETE'
  })
  setTodos([])
}
```

## 📂 Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Main app component
└── components/
    └── TodoList.jsx      # All logic and UI
```

## ⚠️ Important Notes

✅ **User is auto-created** - Uses random username (nibal-xxxxx)  
✅ **Error handling** - Displays errors if API fails  
✅ **Loading states** - Shows spinner during requests  
✅ **Async/Await** - Modern async programming pattern  
✅ **Auto-refresh** - List updates after every action  
✅ **Confirmation dialog** - Asks before clearing all tasks  

## 🎯 Assignment 2 Checklist

✅ Sync with backend API every time task is added/deleted  
✅ Clear all tasks button that deletes from server  
✅ Load tasks on start (useEffect + GET)  
✅ Add task (POST + GET)  
✅ Delete task (DELETE + GET)  
✅ User creation before adding tasks  
✅ Async/await programming pattern  
✅ Error handling  
✅ Loading indicators  
✅ Server synchronization  

## 🔗 API Documentation

[4Geeks TODO API Docs](https://playground.4geeks.com/swagger/)

---

**Made with ❤️ using React + Fetch API + 4Geeks Backend**

🚀 **Assignment 2 Complete!**
