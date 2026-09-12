// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const User = require('../models/User')

// // A higher salt factor means more computational work per hash, which
// // makes brute-force guessing slower — but also makes hashing itself
// // slower. 10 is the commonly used default that balances security and
// // speed for typical applications.
// const SALT_ROUNDS = 10

// async function registerUser(req, res, next) {
//   try {
//     const { name, email, password } = req.body

//     // Checking for an existing user BEFORE hashing avoids doing
//     // unnecessary (relatively expensive) bcrypt work when we already
//     // know registration will fail.
//     const existingUser = await User.findOne({ email })

//     if (existingUser) {
//       // 409 Conflict specifically means "the request is valid, but it
//       // conflicts with the current state of the server" — a duplicate
//       // email is exactly that: a well-formed request that can't be
//       // fulfilled because of what's already there, which is different
//       // from a 400 (the request itself was malformed).
//       return res.status(409).json({ message: 'Email is already registered' })
//     }

//     // bcrypt.hash() takes the plain-text password and the salt
//     // factor, and returns a hash that encodes the salt within it.
//     // The plain-text password itself is never stored anywhere from
//     // this point forward.
//     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

//     // The User Schema's own validation (required fields, email
//     // format, etc.) still runs here automatically — we're not
//     // duplicating those rules, just supplying the hashed password in
//     // place of the raw one.
//     const createdUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     })

//     // Only safe fields are sent back — never the password or its
//     // hash, even though we have it in `createdUser` at this point.
//     res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: createdUser._id,
//         name: createdUser.name,
//         email: createdUser.email,
//       },
//     })
//   } catch (error) {
//     // Same pattern as transactionController.js: known validation
//     // failures get a specific 400 response, everything else is
//     // unexpected and flows to the centralized error handler.
//     if (error.name === 'ValidationError') {
//       const validationMessages = Object.values(error.errors).map(
//         (fieldError) => fieldError.message
//       )

//       return res.status(400).json({
//         message: 'Invalid registration data',
//         errors: validationMessages,
//       })
//     }

//     next(error)
//   }
// }

// async function loginUser(req, res, next) {
//   try {
//     const { email, password } = req.body

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' })
//     }

//     const foundUser = await User.findOne({ email })

//     // Deliberately vague: whether the email doesn't exist at all, or
//     // it exists but the password is wrong, the client gets the exact
//     // same response. If we replied differently for each case, an
//     // attacker could use that difference to discover which emails
//     // are registered — a classic account-enumeration leak.
//     if (!foundUser) {
//       return res.status(401).json({ message: 'Invalid email or password' })
//     }

//     // bcrypt.compare() re-hashes the supplied plain-text password
//     // using the same salt embedded in the stored hash, then checks if
//     // the result matches. This is how bcrypt verifies a password
//     // WITHOUT ever needing to reverse/decrypt the stored hash — the
//     // hash isn't decrypted, it's recomputed and compared.
//     const passwordMatches = await bcrypt.compare(password, foundUser.password)

//     if (!passwordMatches) {
//       return res.status(401).json({ message: 'Invalid email or password' })
//     }

//     // The token payload only carries the user's ID — nothing else
//     // about the user needs to travel inside the JWT. Anything else
//     // the app needs about the user can be looked up from the database
//     // using that ID later. The JWT is signed with JWT_SECRET, which
//     // lives in .env rather than being hardcoded, for the same reason
//     // MONGO_URI does: it's an environment-specific secret, not
//     // something that belongs in source code.
//     const token = jwt.sign(
//       { userId: foundUser._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     )

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: foundUser._id,
//         name: foundUser.name,
//         email: foundUser.email,
//       },
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// module.exports = { registerUser, loginUser }








const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const SALT_ROUNDS = 10

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // V6.12 — registration now issues a token in the same response
    // login already produces, instead of leaving the frontend to make
    // a second, independent login call right after. That second call
    // was the entire reason a "registered but the follow-up sign-in
    // failed" edge case could exist at all — removing the extra round
    // trip removes the failure mode at its root, rather than needing
    // to keep patching around it on the frontend.
    const token = jwt.sign(
      { userId: createdUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(
        (fieldError) => fieldError.message
      )

      return res.status(400).json({
        message: 'Invalid registration data',
        errors: validationMessages,
      })
    }

    next(error)
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.password)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { registerUser, loginUser }