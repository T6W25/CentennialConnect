import request from "supertest"
import app from "../server.js"
import mongoose from "mongoose"
import User from "../models/userModel.js"
import bcrypt from "bcryptjs"

describe("User Login Controller", () => {
  beforeAll(async () => {
    // Connect to test DB if needed
  })

  beforeEach(async () => {
    // Clear DB and create a test user
    await User.deleteMany({})

    const hashedPassword = await bcrypt.hash("Test@1234", 10)
    await User.create({
      name: "Login Test User",
      email: "logintest@my.centennialcollege.ca",
      password: hashedPassword,
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  test("should login successfully with correct credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "logintest@my.centennialcollege.ca",
      password: "Test@1234",
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
    expect(response.body.email).toBe("logintest@my.centennialcollege.ca")
  })

  test("should fail with incorrect password", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "logintest@my.centennialcollege.ca",
      password: "wrongpass",
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Invalid email or password")
  })

  test("should fail if email is not @my.centennialcollege.ca", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "someone@gmail.com",
      password: "any",
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Only Centennial College emails are allowed")
  })
})
