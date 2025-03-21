const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
  }
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
  }
  
  export { notFound, errorHandler }
  
//   In the errorMiddleware.js file, we define two middleware functions: notFound and errorHandler. The notFound function is used to handle requests for routes that do not exist. It creates a new Error object with a message indicating that the requested route was not found and sets the response status code to 404. It then calls the next function with the error object to pass it to the errorHandler middleware.  