const express = require('express')
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getBudgets)
router.post('/', authMiddleware, createBudget)
router.put('/:id', authMiddleware, updateBudget)
router.delete('/:id', authMiddleware, deleteBudget)

module.exports = router