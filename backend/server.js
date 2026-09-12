

// // dotenv.config() reads the .env file and loads its key=value pairs
// // into process.env. This MUST run before anything that depends on
// // those variables — which is why it's the very first line executed,
// // before database.js (or anything else) gets a chance to read
// // process.env.MONGO_URI.
// require('dotenv').config()

// const express = require('express')
// const cors = require('cors')
// const helmet = require('helmet')

// const homeRoutes = require('./routes/homeRoutes')
// const transactionRoutes = require('./routes/transactionRoutes')
// const authRoutes = require('./routes/authRoutes')
// const settingsRoutes = require('./routes/settingsRoutes')
// const budgetRoutes = require('./routes/budgetRoutes')

// const connectDatabase = require('./config/database')
// const errorHandler = require('./middleware/errorHandler')

// const app = express()
// const PORT = 5000

// connectDatabase()

// // Helmet first, before anything else touches the response — it sets
// // a handful of defensive HTTP headers (removing X-Powered-By,
// // adding X-Content-Type-Options: nosniff, HSTS when served over
// // HTTPS, etc.). Using its default configuration is intentional: this
// // backend serves JSON only, never renders HTML, so Helmet's more
// // elaborate protections (Content-Security-Policy tuning) aren't
// // relevant here — the safe, zero-configuration defaults are enough.
// app.use(helmet())

// // CORS now uses an explicit allowlist instead of the previous
// // no-options cors() call, which reflected ANY request origin back —
// // effectively allowing any website to call this authenticated API.
// // CLIENT_ORIGIN comes from .env so the same code works unchanged
// // across local development and any future deployed frontend; it
// // falls back to Vite's default local dev port if the variable isn't
// // set, so nothing changes for existing local development.
// const allowedOrigins = process.env.CLIENT_ORIGIN
//   ? process.env.CLIENT_ORIGIN.split(',')
//   : ['http://localhost:5173']

// app.use(cors({ origin: allowedOrigins }))

// app.use(express.json())

// app.use(homeRoutes)
// app.use('/api/transactions', transactionRoutes)
// app.use('/api/auth', authRoutes)
// app.use('/api/settings', settingsRoutes)
// app.use('/api/budgets', budgetRoutes)


// // Error-handling middleware is registered LAST, after all routes.
// app.use(errorHandler)

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })













require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const homeRoutes = require('./routes/homeRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const authRoutes = require('./routes/authRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const budgetRoutes = require('./routes/budgetRoutes')

const connectDatabase = require('./config/database')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// V6.14.1 — the port is now read from the hosting platform's PORT
// environment variable, falling back to 5000 only when it isn't set.
// Render (and most hosting platforms) assign their own port at
// runtime and expect the application to bind to whatever value they
// provide — a hardcoded port would mean the deployed server never
// actually receives traffic. Local development is unaffected: .env
// doesn't define PORT today, so this resolves to the same 5000 as
// before.
const PORT = process.env.PORT || 5000

connectDatabase()

app.use(helmet())

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins }))

app.use(express.json())

app.use(homeRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/budgets', budgetRoutes)


app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})