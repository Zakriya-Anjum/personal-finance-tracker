// require('dotenv').config()
// const mongoose = require('mongoose')
// const connectDatabase = require('./config/database')
// const User = require('./models/User')

// async function run() {
//   await connectDatabase()

//   // Valid user — should succeed and show normalized email
//   const user = await User.create({
//     name: 'Zakriya',
//     email: '  USERExample.COM  ',
//     password: 'somepassword',
//   })
//   console.log('Created:', user)

//   await mongoose.disconnect()
// }

// run().catch((error) => {
//   console.error('Error:', error.message)
//   mongoose.disconnect()
// })