// const Transaction = require('../models/Transaction')

// async function getTransactions(req, res) {
//   try {
//     const allTransactions = await Transaction.find()
//     res.json(allTransactions)
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch transactions' })
//   }
// }

// // req.params holds whatever values were captured by dynamic segments
// // in the route path. Because the route is defined as '/:id', Express
// // takes whatever the client sent in that position of the URL and
// // makes it available here as req.params.id.
// async function getTransactionById(req, res) {
//   try {
//     const foundTransaction = await Transaction.findById(req.params.id)

//     // findById() successfully ran a valid query, but no document in
//     // the collection matched that _id. This is not an error — it's a
//     // normal outcome of a well-formed request, so it gets its own
//     // status code (404) rather than being treated as a server failure.
//     if (!foundTransaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     res.json(foundTransaction)
//   } catch (error) {
//     // Mongoose throws a CastError specifically when the string passed
//     // in can't be converted into a valid MongoDB ObjectId (e.g. "hello"
//     // instead of a 24-character hex string). This happens BEFORE any
//     // database query runs, so it means the client sent bad input —
//     // not that something broke on our end.
//     if (error.name === 'CastError') {
//       return res.status(400).json({ message: 'Invalid transaction ID' })
//     }

//     res.status(500).json({ message: 'Failed to fetch transaction' })
//   }
// }

// async function createTransaction(req, res) {
//   try {
//     const createdTransaction = await Transaction.create(req.body)
//     res.status(201).json(createdTransaction)
//   } catch (error) {
//     // Mongoose gives every error it throws a `name` property. When
//     // Schema validation fails (a required field is missing, or the
//     // wrong type was sent), the error's name is specifically
//     // "ValidationError" — this lets us tell "the client sent bad
//     // data" apart from "something else went wrong on our end,"
//     // and respond with the correct status code for each case.
//     if (error.name === 'ValidationError') {
//       // error.errors is an object where each key is a field that
//       // failed validation, and each value describes what went wrong.
//       // Object.values() turns that into an array, and we map each
//       // one down to just its human-readable message — the client
//       // doesn't need Mongoose's internal error structure, just a
//       // clear explanation of what's wrong.
//       const validationMessages = Object.values(error.errors).map(
//         (fieldError) => fieldError.message
//       )

//       return res.status(400).json({
//         message: 'Invalid transaction data',
//         errors: validationMessages,
//       })
//     }

//     // Anything that isn't a validation error is treated as a genuine
//     // unexpected failure — MongoDB being unreachable, a network
//     // issue, etc. — and still correctly reported as a 500.
//     res.status(500).json({ message: 'Failed to create transaction' })
//   }
// }

// // findByIdAndUpdate() locates the document by _id and updates it in
// // one operation. By default Mongoose would (1) skip Schema validation
// // on updates and (2) hand back the document as it looked BEFORE the
// // update — so we pass a third argument with two options that override
// // both of those defaults.
// async function updateTransaction(req, res) {
//   try {
//     const updatedTransaction = await Transaction.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         // Without this, findByIdAndUpdate() returns the pre-update
//         // document. Setting new: true tells Mongoose to return the
//         // document as it looks AFTER the update is applied.
//         new: true,
//         // findByIdAndUpdate() does NOT run Schema validation by
//         // default (unlike create()). This option turns validation
//         // back on, so required/type rules are still enforced on
//         // update, not just on creation.
//         runValidators: true,
//       }
//     )

//     // The ID was validly formatted and the query ran successfully,
//     // but nothing in the collection matched that _id.
//     if (!updatedTransaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     res.json(updatedTransaction)
//   } catch (error) {
//     // Same reasoning as getTransactionById(): a malformed ID string
//     // never reaches the database — Mongoose rejects it up front.
//     if (error.name === 'CastError') {
//       return res.status(400).json({ message: 'Invalid transaction ID' })
//     }

//     // Same reasoning as createTransaction(): runValidators: true means
//     // update data that breaks the Schema (missing/wrong-typed fields)
//     // produces a ValidationError, handled the same way as on create.
//     if (error.name === 'ValidationError') {
//       const validationMessages = Object.values(error.errors).map(
//         (fieldError) => fieldError.message
//       )

//       return res.status(400).json({
//         message: 'Invalid transaction data',
//         errors: validationMessages,
//       })
//     }

//     res.status(500).json({ message: 'Failed to update transaction' })
//   }
// }

// module.exports = {
//   getTransactions,
//   getTransactionById,
//   createTransaction,
//   updateTransaction,
// }






// const Transaction = require('../models/Transaction')

// // Ownership means every query is scoped to { user: req.userId } — the
// // authenticated user only, never every document in the collection.
// // req.userId exists because authMiddleware already ran and verified
// // the JWT before this controller function was ever called.
// async function getTransactions(req, res, next) {
//   try {
//     const allTransactions = await Transaction.find({ user: req.userId })
//     res.json(allTransactions)
//   } catch (error) {
//     next(error)
//   }
// }

// async function getTransactionById(req, res, next) {
//   try {
//     // Checking _id alone would only confirm the transaction EXISTS,
//     // not that it belongs to this user — someone could guess/enumerate
//     // another user's transaction IDs and read their data. Requiring
//     // BOTH _id and user to match in the same query means a transaction
//     // that exists but belongs to someone else looks IDENTICAL to a
//     // transaction that doesn't exist at all — findOne() simply
//     // returns null either way.
//     const foundTransaction = await Transaction.findOne({
//       _id: req.params.id,
//       user: req.userId,
//     })

//     if (!foundTransaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     res.json(foundTransaction)
//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({ message: 'Invalid transaction ID' })
//     }

//     next(error)
//   }
// }

// async function createTransaction(req, res, next) {
//   try {
//     // The owner is taken from req.userId (set by authMiddleware after
//     // verifying the JWT) — never from the client's request body. If
//     // we passed req.body straight into create(), a client could send
//     // { ..., "user": "someone-elses-id" } and create a transaction
//     // under another user's name. Explicitly spreading req.body and
//     // then overwriting `user` guarantees the server, not the client,
//     // decides ownership.
//     const createdTransaction = await Transaction.create({
//       ...req.body,
//       user: req.userId,
//     })
//     res.status(201).json(createdTransaction)
//   } catch (error) {
//     // Mongoose gives every error it throws a `name` property. When
//     // Schema validation fails (a required field is missing, or the
//     // wrong type was sent), the error's name is specifically
//     // "ValidationError" — this lets us tell "the client sent bad
//     // data" apart from "something else went wrong on our end,"
//     // and respond with the correct status code for each case.
//     if (error.name === 'ValidationError') {
//       // error.errors is an object where each key is a field that
//       // failed validation, and each value describes what went wrong.
//       // Object.values() turns that into an array, and we map each
//       // one down to just its human-readable message — the client
//       // doesn't need Mongoose's internal error structure, just a
//       // clear explanation of what's wrong.
//       const validationMessages = Object.values(error.errors).map(
//         (fieldError) => fieldError.message
//       )

//       return res.status(400).json({
//         message: 'Invalid transaction data',
//         errors: validationMessages,
//       })
//     }

//     // Anything that isn't a validation error is treated as a genuine
//     // unexpected failure — MongoDB being unreachable, a network
//     // issue, etc. — and still correctly reported as a 500.
//     next(error)
//   }
// }

// async function updateTransaction(req, res, next) {
//   try {
//     // Same ownership principle as getTransactionById: the query must
//     // match both _id AND user, so a user can't update a transaction
//     // just by knowing/guessing its ID.
//     const updatedTransaction = await Transaction.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         user: req.userId,
//       },
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     )

//     if (!updatedTransaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     res.json(updatedTransaction)
//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({ message: 'Invalid transaction ID' })
//     }

//     if (error.name === 'ValidationError') {
//       const validationMessages = Object.values(error.errors).map(
//         (fieldError) => fieldError.message
//       )

//       return res.status(400).json({
//         message: 'Invalid transaction data',
//         errors: validationMessages,
//       })
//     }

//     next(error)
//   }
// }

// async function deleteTransaction(req, res, next) {
//   try {
//     // Same ownership principle again: deletion is scoped to _id AND
//     // user together, so a user can only ever delete their own data.
//     const deletedTransaction = await Transaction.findOneAndDelete({
//       _id: req.params.id,
//       user: req.userId,
//     })

//     if (!deletedTransaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     res.json(deletedTransaction)
//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({ message: 'Invalid transaction ID' })
//     }

//     next(error)
//   }
// }

// module.exports = {
//   getTransactions,
//   getTransactionById,
//   createTransaction,
//   updateTransaction,
//   deleteTransaction,
// }







const Transaction = require('../models/Transaction')

async function getTransactions(req, res, next) {
  try {
    const allTransactions = await Transaction.find({ user: req.userId })
    res.json(allTransactions)
  } catch (error) {
    next(error)
  }
}

async function getTransactionById(req, res, next) {
  try {
    const foundTransaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!foundTransaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json(foundTransaction)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID' })
    }

    next(error)
  }
}

async function createTransaction(req, res, next) {
  try {
    const createdTransaction = await Transaction.create({
      ...req.body,
      user: req.userId,
    })
    res.status(201).json(createdTransaction)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(
        (fieldError) => fieldError.message
      )

      return res.status(400).json({
        message: 'Invalid transaction data',
        errors: validationMessages,
      })
    }

    // MILESTONE 7 FIX (H1): create() can also throw a CastError — for
    // example, if `date` is sent as a value that can't be converted
    // into a valid Date. This is malformed client input, exactly like
    // an invalid ID is elsewhere in this file, so it belongs on the
    // same 400 path as the other three functions, not the generic
    // 500 it was falling into before.
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction data' })
    }

    next(error)
  }
}

async function updateTransaction(req, res, next) {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json(updatedTransaction)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID' })
    }

    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(
        (fieldError) => fieldError.message
      )

      return res.status(400).json({
        message: 'Invalid transaction data',
        errors: validationMessages,
      })
    }

    next(error)
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json(deletedTransaction)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID' })
    }

    next(error)
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
}