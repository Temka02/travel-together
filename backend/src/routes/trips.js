const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Get trips',
    data: [{ id: 1, title: 'Поход в горы' }]
  })
})

router.post('/', (req, res) => {
  res.json({
    message: 'Create trip',
    data: req.body
  })
})

router.get('/:id', (req, res) => {
  res.json({
    message: `Get trip ${req.params.id}`
  })
})

module.exports = router