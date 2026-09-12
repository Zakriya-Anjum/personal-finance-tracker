// const mongoose = require('mongoose')

// // This connection string tells Mongoose WHERE to connect: a MongoDB
// // server running locally (127.0.0.1, the default port 27017), and
// // WHICH database to use inside that server — "personal-finance-tracker".
// // If that database doesn't exist yet, MongoDB will create it
// // automatically the first time we actually save something to it.
// const MONGO_URI = 'mongodb://127.0.0.1:27017/personal-finance-tracker'

// // Connecting to a database is an asynchronous operation — it takes
// // time to establish a network connection, so we can't know whether it
// // succeeded or failed immediately. async/await lets us write this as
// // if it were simple top-to-bottom code, while still correctly waiting
// // for the real-world connection attempt to finish before moving on.
// async function connectDatabase() {
//   try {
//     // mongoose.connect() does the actual work of opening a connection
//     // to the MongoDB server at the given address and selecting the
//     // named database. It returns a promise that resolves once the
//     // connection is successfully established.
//     await mongoose.connect(MONGO_URI)
//     console.log('MongoDB Connected Successfully')
//   } catch (error) {
//     // If the connection fails (MongoDB isn't running, wrong address,
//     // etc.), we log the actual error so we can see what went wrong,
//     // rather than the app silently continuing as if nothing happened.
//     console.error('MongoDB connection failed:', error.message)
//   }
// }

// // Exporting the function itself (not calling it here) — this file's
// // only job is DEFINING how to connect. Deciding WHEN to actually
// // connect belongs to whoever imports this, which is server.js.
// module.exports = connectDatabase







const mongoose = require('mongoose')

// The connection string now comes from an environment variable
// instead of being hardcoded here. This means the SAME code can
// connect to a different database (local, staging, production) just
// by changing what's in .env — nothing in this file has to change.
const MONGO_URI = process.env.MONGO_URI

async function connectDatabase() {
  try {
    // mongoose.connect() does the actual work of opening a connection
    // to the MongoDB server at the given address and selecting the
    // named database. It returns a promise that resolves once the
    // connection is successfully established.
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB Connected Successfully')
  } catch (error) {
    //If the connection fails (MongoDB isn't running, wrong address,
    // etc.), we log the actual error so we can see what went wrong,
    // rather than the app silently continuing as if nothing happened.
    console.error('MongoDB connection failed:', error.message)
  }
}

module.exports = connectDatabase