const Budget = require('../models/Budget')

async function getBudgets(req, res, next) {
  try {
    const budgets = await Budget.find({ user: req.userId })
    res.json(budgets)
  } catch (error) {
    next(error)
  }
}

async function createBudget(req, res, next) {
  try {
    const createdBudget = await Budget.create({
      category: req.body.category,
      limit: req.body.limit,
      user: req.userId,
    })
    res.status(201).json(createdBudget)
  } catch (error) {
    // E11000 is MongoDB's duplicate-key error code — thrown here when
    // the { user, category } compound index rejects a second budget
    // for a category this user already has one for. Same pattern as
    // the duplicate-email handling in authController.
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You already have a budget for this category' })
    }

    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(
        (fieldError) => fieldError.message
      )
      return res.status(400).json({ message: 'Invalid budget data', errors: validationMessages })
    }

    next(error)
  }
}

async function updateBudget(req, res, next) {
  try {
    // Only the limit is editable — category is fixed once a budget is
    // created (changing it would just be "delete + create a
    // different one," which the UI already supports directly).
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { limit: req.body.limit },
      { new: true, runValidators: true }
    )

    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json(updatedBudget)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid budget ID' })
    }

    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(
        (fieldError) => fieldError.message
      )
      return res.status(400).json({ message: 'Invalid budget data', errors: validationMessages })
    }

    next(error)
  }
}

async function deleteBudget(req, res, next) {
  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId })

    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json(deletedBudget)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid budget ID' })
    }

    next(error)
  }
}

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget }