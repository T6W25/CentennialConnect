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

// New restrictTo function
const restrictTo = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next()
  } else {
    res.status(401)
    throw new Error(`Not authorized as a ${role}`)
  }
}

export { protect, admin, communityManager, eventManager, restrictTo }