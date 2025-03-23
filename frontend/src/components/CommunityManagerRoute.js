import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const CommunityManagerRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth)

  return userInfo && (userInfo.role === "communityManager" || userInfo.role === "admin") ? (
    children
  ) : (
    <Navigate to="/" />
  )
}

export default CommunityManagerRoute

