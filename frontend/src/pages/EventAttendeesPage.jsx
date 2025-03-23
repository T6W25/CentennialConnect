import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getEventById } from "../slices/eventSlice";
import { getEventAttendees } from '../actions/eventActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'
import '../styles/EventAttendeesPage.css'

const EventAttendeesPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [activeTab, setActiveTab] = useState('registered')
  const [markingAttendance, setMarkingAttendance] = useState(false)
  const [attendanceSuccess, setAttendanceSuccess] = useState(null)
  const [attendanceError, setAttendanceError] = useState(null)
  
  const { userInfo } = useSelector(state => state.auth)
  
  const { event, loading: loadingEvent, error: errorEvent } = useSelector(state => state.events)
  
  const eventAttendees = useSelector(state => state.eventAttendees)
  const { 
    loading: loadingAttendees, 
    attendees, 
    error: errorAttendees 
  } = eventAttendees || {}
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
      return
    }
    
    dispatch(getEventById(id))
    dispatch(getEventAttendees(id))
  }, [dispatch, id, userInfo, navigate])
  
  const markAttendance = async (userId) => {
    try {
      setMarkingAttendance(true)
      setAttendanceError(null)
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      
      await axios.put(`/api/events/${id}/attendance/${userId}`, {}, config)
      
      setAttendanceSuccess(`Attendance marked successfully`)
      dispatch(getEventAttendees(id))
    } catch (error) {
      setAttendanceError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    } finally {
      setMarkingAttendance(false)
    }
  }
  
  // Check if user is authorized (organizer or admin)
  useEffect(() => {
    if (event && userInfo) {
      const isAuthorized = event.creator?._id === userInfo._id || userInfo.role === 'admin' || userInfo.role === 'eventManager'
      if (!isAuthorized) {
        navigate(`/events/${id}`)
      }
    }
  }, [event, userInfo, id, navigate])
  
  return (
    <div className="attendees-container">
      <div className="attendees-header">
        <Link to={`/events/${id}`} className="attendees-back-link">
          <span className="attendees-back-icon">←</span> Back to Event
        </Link>
        <h1 className="attendees-title">Attendee Management</h1>
        
        {event && <h2 className="attendees-subtitle">{event.title}</h2>}
      </div>
      
      {loadingEvent ? (
        <Loader />
      ) : errorEvent ? (
        <Message variant="error">{errorEvent}</Message>
      ) : null}
      
      {attendanceSuccess && (
        <div className="attendance-message attendance-message-success">
          {attendanceSuccess}
          <button 
            className="attendance-message-close" 
            onClick={() => setAttendanceSuccess(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {attendanceError && (
        <div className="attendance-message attendance-message-error">
          {attendanceError}
          <button 
            className="attendance-message-close" 
            onClick={() => setAttendanceError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {loadingAttendees ? (
        <Loader />
      ) : errorAttendees ? (
        <Message variant="error">{errorAttendees}</Message>
      ) : attendees ? (
        <>
          <div className="attendees-tabs">
            <div 
              className={`attendees-tab ${activeTab === 'registered' ? 'active' : ''}`}
              onClick={() => setActiveTab('registered')}
            >
              Registered
              <span className="attendees-tab-badge">
                {attendees.registered?.length || 0}
              </span>
            </div>
            <div 
              className={`attendees-tab ${activeTab === 'waitlisted' ? 'active' : ''}`}
              onClick={() => setActiveTab('waitlisted')}
            >
              Waitlisted
              <span className="attendees-tab-badge">
                {attendees.waitlisted?.length || 0}
              </span>
            </div>
            <div 
              className={`attendees-tab ${activeTab === 'attended' ? 'active' : ''}`}
              onClick={() => setActiveTab('attended')}
            >
              Attended
              <span className="attendees-tab-badge">
                {attendees.attended?.length || 0}
              </span>
            </div>
            <div 
              className={`attendees-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
              <span className="attendees-tab-badge">
                {attendees.cancelled?.length || 0}
              </span>
            </div>
          </div>
          
          {activeTab === 'registered' && (
            <AttendeeTable 
              attendees={attendees.registered} 
              markAttendance={markAttendance}
              isLoading={markingAttendance}
            />
          )}
          
          {activeTab === 'waitlisted' && (
            <AttendeeTable 
              attendees={attendees.waitlisted} 
              markAttendance={markAttendance}
              isLoading={markingAttendance}
            />
          )}
          
          {activeTab === 'attended' && (
            <AttendeeTable 
              attendees={attendees.attended} 
              markAttendance={markAttendance}
              isLoading={markingAttendance}
              isAttendedTab={true}
            />
          )}
          
          {activeTab === 'cancelled' && (
            <AttendeeTable 
              attendees={attendees.cancelled} 
              markAttendance={markAttendance}
              isLoading={markingAttendance}
            />
          )}
        </>
      ) : null}
    </div>
  )
}

const AttendeeTable = ({ attendees, markAttendance, isLoading, isAttendedTab = false }) => {
  if (!attendees || attendees.length === 0) {
    return (
      <div className="no-attendees-message">
        <span className="no-attendees-icon">👥</span>
        No attendees in this category
      </div>
    )
  }
  
  return (
    <table className="attendees-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Registered</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {attendees.map(attendee => (
          <tr key={attendee.user._id} className="attendees-table-row">
            <td>
              <div className="attendee-name">
                <div className="attendee-avatar">
                  {attendee.user.profilePicture ? (
                    <img src={attendee.user.profilePicture} alt={attendee.user.name} />
                  ) : (
                    <span className="attendee-avatar-placeholder">👤</span>
                  )}
                </div>
                <div className="attendee-details">
                  <span>{attendee.user.name}</span>
                  <span className="attendee-email">{attendee.user.email}</span>
                </div>
              </div>
            </td>
            <td>{attendee.user.email}</td>
            <td className="attendee-date">
              {new Date(attendee.registeredAt).toLocaleDateString()}
            </td>
            <td>
              {!isAttendedTab && (
                <button
                  className="mark-attendance-button"
                  onClick={() => markAttendance(attendee.user._id)}
                  disabled={isLoading}
                >
                  <span className="mark-attendance-icon">✓</span> Mark Attended
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default EventAttendeesPage