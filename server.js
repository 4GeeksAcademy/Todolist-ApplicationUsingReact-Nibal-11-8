import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// SQLite database setup
const db = new sqlite3.Database(join(__dirname, 'todos.db'), (err) => {
  if (err) {
    console.error('Database error:', err)
  } else {
    console.log('✅ Connected to SQLite database')
    initializeDatabase()
  }
})

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      label TEXT NOT NULL,
      done BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (username) REFERENCES users(username)
    )
  `)
}

// ============ API ROUTES ============

// POST - Create user
app.post('/api/user', (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({ error: 'Username required' })
  }

  db.run(
    'INSERT OR IGNORE INTO users (username) VALUES (?)',
    [username],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' })
      }
      res.json({ username, created: true })
    }
  )
})

// GET - Get all todos for a user
app.get('/api/todos', (req, res) => {
  const { username } = req.query

  if (!username) {
    return res.status(400).json({ error: 'Username required' })
  }

  db.all(
    'SELECT * FROM todos WHERE username = ? ORDER BY created_at DESC',
    [username],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch todos' })
      }
      res.json(rows || [])
    }
  )
})

// POST - Add new todo
app.post('/api/todos', (req, res) => {
  const { username, label, done } = req.body

  if (!username || !label) {
    return res.status(400).json({ error: 'Username and label required' })
  }

  db.run(
    'INSERT INTO todos (username, label, done) VALUES (?, ?, ?)',
    [username, label, done || false],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create todo' })
      }
      res.json({
        id: this.lastID,
        username,
        label,
        done: done || false
      })
    }
  )
})

// PUT - Update todo (toggle or edit)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params
  const { label, done } = req.body

  if (label === undefined || done === undefined) {
    return res.status(400).json({ error: 'Label and done status required' })
  }

  db.run(
    'UPDATE todos SET label = ?, done = ? WHERE id = ?',
    [label, done, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update todo' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' })
      }
      res.json({ id, label, done })
    }
  )
})

// DELETE - Delete single todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete todo' })
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json({ deleted: true, id })
  })
})

// DELETE - Delete all todos for a user
app.delete('/api/todos/user/:username', (req, res) => {
  const { username } = req.params

  db.run('DELETE FROM todos WHERE username = ?', [username], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete todos' })
    }
    res.json({ deleted: true, username })
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API running ✅' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`)
  console.log(`📡 POST   /api/user - Create user`)
  console.log(`📡 GET    /api/todos - Get all todos`)
  console.log(`📡 POST   /api/todos - Add todo`)
  console.log(`📡 PUT    /api/todos/:id - Update todo`)
  console.log(`📡 DELETE /api/todos/:id - Delete todo`)
  console.log(`📡 DELETE /api/todos/user/:username - Delete all todos`)
})
