const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const authRoutes = require('./src/routes/auth')
const usersRoutes = require('./src/routes/users')
const tripsRoutes = require('./src/routes/trips')
const applicationsRoutes = require('./src/routes/application')

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/trips', tripsRoutes)
app.use('/api/applications', applicationsRoutes)

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'TravelTogether API is running'
  })
})

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}/api`)
  console.log(`Health: http://localhost:${PORT}/api/health`)
})