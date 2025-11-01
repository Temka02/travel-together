const express = require('express')
const router = express.Router()

router.post('/register', (req, res) => {
  res.json({
    message: 'Register',
    data: req.body
  })
})

router.post('/login', (req, res) => {
  res.json({
    message: 'Login', 
    data: req.body
  })
})

module.exports = router