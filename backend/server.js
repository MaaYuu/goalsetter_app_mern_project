const path = require("path")
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

// GET process.env.PORT from ".env" file
const port = process.env.PORT || 5000

connectDB()

const app = express()

// To use body from a request, we should some middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))


// Serve frontend
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  // Use frontend/build/index.html for static files
  app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
} else {
  app.get('/', (req,res) => res.send('Please set to production'))
}

// Use errorHandler middleware
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
