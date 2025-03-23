import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const EventManagerRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth)

  return userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") ? children : <Navigate to="/" />
}

export default EventManagerRoute

