// const express = require('express')
// const {
//   getTransactions,
//   getTransactionById,
//   createTransaction,
//   updateTransaction,
// } = require('../controllers/transactionController')

// const router = express.Router()

// router.get('/', getTransactions)

// // ':id' is a route parameter — a placeholder segment. It matches
// // anything in that position of the URL (e.g. /api/transactions/abc123)
// // and Express hands that captured value to the controller through
// // req.params.id. We don't write '/api/transactions/:id' here because
// // server.js already mounts this whole router under '/api/transactions'.
// router.get('/:id', getTransactionById)

// // POST is used here instead of GET because this request is asking the
// // server to CREATE something new, not just retrieve existing data.
// // HTTP methods carry meaning: GET = "give me data," POST = "here's
// // data, please create something with it." Using the right method
// // isn't just convention — it's part of communicating intent clearly
// // between client and server.
// router.post('/', createTransaction)

// // PUT signals "update the resource at this exact location" — the
// // client is telling the server which existing document to modify (by
// // ID), as opposed to POST, which asks the server to create a brand
// // new resource with no ID yet.
// router.put('/:id', updateTransaction)

// module.exports = router




const express = require('express')
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// authMiddleware runs BEFORE every transaction controller now. If the
// request has no valid JWT, authMiddleware responds with 401 itself
// and calls next() only on success — meaning the controller functions
// below never even run for an unauthenticated request. This is also
// what makes req.userId available inside every one of these
// controllers: authMiddleware sets it, and Express passes the same
// req object down the chain.
router.get('/', authMiddleware, getTransactions)

// ':id' is a route parameter — a placeholder segment. It matches
// anything in that position of the URL (e.g. /api/transactions/abc123)
// and Express hands that captured value to the controller through
// req.params.id. We don't write '/api/transactions/:id' here because
// server.js already mounts this whole router under '/api/transactions'.
router.get('/:id', authMiddleware, getTransactionById)

// POST is used here instead of GET because this request is asking the
// server to CREATE something new, not just retrieve existing data.
// HTTP methods carry meaning: GET = "give me data," POST = "here's
// data, please create something with it." Using the right method
// isn't just convention — it's part of communicating intent clearly
// between client and server.
router.post('/', authMiddleware, createTransaction)

// PUT signals "update the resource at this exact location" — the
// client is telling the server which existing document to modify (by
// ID), as opposed to POST, which asks the server to create a brand
// new resource with no ID yet.
router.put('/:id', authMiddleware, updateTransaction)

// DELETE signals "remove the resource at this exact location" — the
// client identifies which existing document to remove by ID, same
// as PUT does for updates.
router.delete('/:id', authMiddleware, deleteTransaction)

module.exports = router