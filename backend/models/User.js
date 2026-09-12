// const mongoose = require('mongoose')

// // A Schema is a BLUEPRINT — it describes the SHAPE that every User
// // document should have, the same role Transaction.js's schema plays
// // for transactions. The User Schema represents an application account:
// // who someone is (name), how they're identified/logged in (email),
// // and their credential (password) — nothing about transactions lives
// // here.
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     validate: {
//       validator: function (value) {
//         return value.length > 0
//       },
//       message: 'Name cannot be empty',
//     },
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     // Emails are normalized to lowercase because email addresses are
//     // effectively case-insensitive in practice, but MongoDB string
//     // comparisons ARE case-sensitive. Without this, "user@example.com"
//     // and "User@Example.com" would be treated as two different users
//     // instead of the same account.
//     lowercase: true,
//     // A simple format check: something, then @, then something, then
//     // a dot, then something — enough to catch obviously malformed
//     // input like "notanemail" without pretending to be a full RFC
//     // email validator (which is a notoriously deep rabbit hole).
//     validate: {
//       validator: function (value) {
//         return /^\S+@\S+\.\S+$/.test(value)
//       },
//       message: 'Please provide a valid email address',
//     },
//     // unique: true tells MongoDB to build a unique INDEX on this
//     // field — it's a database-level constraint, not a Mongoose
//     // validation rule. That means a duplicate email doesn't produce
//     // a ValidationError like our other rules do; it produces a
//     // separate MongoDB duplicate-key error. We're not handling that
//     // error case yet — that's Milestone 5 (Register), where we'll
//     // actually attempt to create duplicate users through an endpoint.
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     // This stores the password AS PLAIN TEXT for now — intentionally
//     // incomplete. Hashing (so we never store or compare raw
//     // passwords) is a Milestone 5 concern, done at registration time
//     // with a library like bcrypt. Adding hashing here, without a
//     // register flow to actually call it, would be building ahead of
//     // where the architecture needs it yet.
//   },
// })

// // Same pattern as Transaction: the Model is what actually gives us
// // .find(), .create(), etc. against MongoDB. The name 'User' gets
// // lowercased and pluralized by Mongoose into the "users" collection —
// // a separate collection from "transactions", since these represent
// // different kinds of things.
// const User = mongoose.model('User', userSchema)

// module.exports = User









const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value.length > 0
      },
      message: 'Name cannot be empty',
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^\S+@\S+\.\S+$/.test(value)
      },
      message: 'Please provide a valid email address',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // Hashed with bcrypt at registration time, in authController.js —
    // this field never stores a plain-text password. (V6.12: this
    // comment previously and incorrectly described the field as
    // currently storing plain text pending a future milestone, which
    // was stale — hashing has been implemented since the register
    // endpoint was first built.)
    minlength: [8, 'Password must be at least 8 characters'],
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User