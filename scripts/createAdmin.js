require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const connectDB = require('../src/config/db')
const User = require('../src/models/User')
const bcrypt = require('bcrypt')

async function run() {
  await connectDB()
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'password123'
  const existing = await User.findOne({ email })
  if (existing) {
    console.log('Admin already exists:', email)
    process.exit(0)
  }
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)
  const user = new User({ name: 'Admin', email, passwordHash, role: 'admin' })
  await user.save()
  console.log('Created admin:', email)
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })
