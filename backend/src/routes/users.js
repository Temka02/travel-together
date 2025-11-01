const express = require('express')
const router = express.Router()

router.get('/profile', (req, res) => {
  res.status(200).json({
    message: 'Get user profile endpoint'
  })
})

router.put('/profile', (req, res) => {
  res.status(200).json({
    message: 'Update user profile endpoint',
    data: req.body
  })
})

router.get('/skills', (req, res) => {
  res.status(200).json({
    message: 'Get user skills endpoint'
  })
})

module.exports = router