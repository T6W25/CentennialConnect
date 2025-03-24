"use client"
import '../styles/Header.css';
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../slices/authSlice"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector((state) => state.auth)
  const { notifications } = useSelector((state) => state.notifications)

  const unreadNotifications = notifications?.filter((n) => !n.read).length || 0

  const logoutHandler = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <header className="bg-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold">
            CentNet
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
            <Link to="/communities" className="hover:text-gray-200">
              Communities
            </Link>
            <Link to="/events" className="hover:text-gray-200">
              Events
            </Link>
            <Link to="/discussions" className="hover:text-gray-200">
              Discussions
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <div className="relative">
                  <button onClick={() => navigate("/notifications")} className="hover:text-gray-200 relative">
                    <span>🔔</span>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center hover:text-gray-200"
                  >
                    <span className="mr-1">{userInfo.name.split(" ")[0]}</span>
                    <span>▼</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      {userInfo.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      {userInfo.role === "communityManager" && (
                        <Link
                          to="/community-manager"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Manage Communities
                        </Link>
                      )}
                      {userInfo.role === "eventManager" && (
                        <Link
                          to="/event-manager"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Manage Events
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          logoutHandler()
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">
                  Sign In
                </Link>
                <Link to="/register" className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100">
                  Sign Up
                </Link>
              </>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white focus:outline-none">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-500">
            <Link to="/" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/communities" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
              Communities
            </Link>
            <Link to="/events" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
              Events
            </Link>
            <Link to="/discussions" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>
              Discussions
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

