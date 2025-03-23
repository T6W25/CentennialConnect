import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
})

// Role-based authorization middleware generator
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401)
      throw new Error("Not authorized")
    }

    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403)
      throw new Error(`Not authorized. Required roles: ${roles.join(", ")}`)
    }

    next()
  }
}

// Specific role middleware (keeping existing ones for backwards compatibility)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as an admin")
  }
}

const communityManager = (req, res, next) => {
  if (req.user && (req.user.role === "communityManager" || req.user.role === "admin")) {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as a community manager")
  }
}

const eventManager = (req, res, next) => {
  if (req.user && (req.user.role === "eventManager" || req.user.role === "admin")) {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as an event manager")
  }
}

// Password reset token verification middleware
const verifyResetToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params

  // Hash the token to compare with stored token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    res.status(400)
    throw new Error('Invalid or expired reset token')
  }

  // Attach user to request object
  req.user = user
  next()
})

export { 
  protect, 
  admin, 
  communityManager, 
  eventManager,
  authorize,
  verifyResetToken
}