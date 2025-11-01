const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Get applications'
  })
})

router.post('/', (req, res) => {
  res.json({
    message: 'Create application',
    data: req.body
  })
})

module.exports = router