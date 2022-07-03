const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Destructuring body
  const { name, email, password } = req.body
  
  // Checking if any of these are not specified
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  // A salt is a piece of random data added to a password before it is hashed and stored. 
  const salt = await bcrypt.genSalt(10)
  // Hash password now after creating salt
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user by mongoose 'create' function to add new document
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  // Check that the user created
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // Use token as we defined generateToken function
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // Destructuring email and password from request's body
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  // If email is matched 
  // And the password that is from request is equal to password that is hashed in database
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // Use token as we defined generateToken function
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  // Sign token with payload: id, secret key: JWT_SECRET from .env file, and token expires in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}

// What is JWT and Why Should You Use JWT
//JWT is just for authorization, not authentication.

// CLASSIC AUTHORIZATION STEPS:
// 1. Client makes POST /user/login
// 2. Server do the authentication, if the user is correct then store user in session in server memory (as unique session ID)
// 3. And server send this session ID as a cookie to browser. So, the browser always has that session ID
// 4. Client sends request with session ID cookie
// 5. Server get user based on session ID and verify them
// 6. After verifying the user, server sends the response.

// JWT(Json Web Token) AUTHORIZATION STEPS:
// 1. Client makes POST /user/login
// 2. Server create a JWT, and it actually encodes and serializes and signs it with its own secret key. Server does not store anything here as opposed to classic authorization.
// 3. And server sends this JWT to browser.
// 4. Client sends request with JWT.
// 5. Server verifies the JWT that is not changed, deserializes. User info stored in that token. 
// 6. After verifying the user, server sends the response.