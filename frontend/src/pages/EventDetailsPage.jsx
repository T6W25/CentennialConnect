import '../styles/EventDetailsPage.css';
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEventById,
  registerForEvent,
  sendEventAnnouncement,
  clearError,
  resetSuccess,
} from "../slices/eventSlice";
import { 
  cancelRegistration 
} from "../actions/eventActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatDate, formatTime } from "../utils/formatDate";
import Modal from "../components/Modal";

const EventDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [responses, setResponses] = useState({});
  
  const { event, loading, error, success } = useSelector((state) => state.events);
  const { userInfo } = useSelector((state) => state.auth);
  
  const eventRegister = useSelector(state => state.eventRegister);
  const { 
    loading: loadingRegister, 
    success: successRegister, 
    error: errorRegister 
  } = eventRegister || {};
  
  const eventCancelRegistration = useSelector(state => state.eventCancelRegistration);
  const { 
    loading: loadingCancel, 
    success: successCancel, 
    error: errorCancel 
  } = eventCancelRegistration || {};
  
  const eventRegistrationStatus = useSelector(state => state.eventRegistrationStatus);
  const { 
    loading: loadingStatus, 
    registrationStatus, 
    error: errorStatus 
  } = eventRegistrationStatus || {};
  
  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (success || successRegister || successCancel) {
      dispatch(resetSuccess());
      dispatch(getEventById(id));
    }
  }, [success, successRegister, successCancel, dispatch, id]);
  
  const isRegistered = event?.attendees.some(
    (attendee) => attendee._id === userInfo._id
  );
  
  const isCreator = event?.creator._id === userInfo._id;
  const isEventManager =
    userInfo.role === "eventManager" || userInfo.role === "admin";
  
  const isFull = event && event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees;
  
  const openRegistrationModal = () => {
    setShowRegistrationModal(true);
  };
  
  const closeRegistrationModal = () => {
    setShowRegistrationModal(false);
  };
  
  const handleRegister = () => {
    dispatch(registerForEvent(id, responses));
    closeRegistrationModal();
  };
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      dispatch(cancelRegistration(id));
    }
  };
  
  const handleResponseChange = (e, index) => {
    setResponses({
      ...responses,
      [`question_${index}`]: e.target.value
    });
  };
  
  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (announcementMessage.trim()) {
      dispatch(sendEventAnnouncement({ id, message: announcementMessage }));
      setAnnouncementMessage("");
    }
  };
  
  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <Link to="/events" className="event-details-back-link">
          <span className="event-details-back-icon">←</span> Back to Events
        </Link>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : event ? (
        <div className="event-details-content">
          <div className="event-details-main">
            <div className="event-details-image">
              {event.image ? (
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                />
              ) : (
                <div className="event-details-image-placeholder">
                  <span className="event-details-image-placeholder-icon">📅</span>
                </div>
              )}
            </div>
            <div className="event-details-body">
              <h1 className="event-details-title">{event.title}</h1>
              <div className="event-details-meta">
                <div className="event-details-meta-item">
                  <span className="event-details-meta-icon">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="event-details-meta-item">
                  <span className="event-details-meta-icon">🕒</span>
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="event-details-meta-item">
                  <span className="event-details-meta-icon">📍</span>
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="event-details-category">
                {event.category}
              </div>
              <div className="event-details-description">
                {event.description}
              </div>
              
              <div className="event-details-actions">
                {loadingStatus ? (
                  <Loader />
                ) : (
                  <>
                    {registrationStatus?.registered ? (
                      <>
                        <div className="registration-info registration-success">
                          You're {registrationStatus.status} for this event
                        </div>
                        {loadingCancel ? (
                          <Loader />
                        ) : (
                          <button 
                            className="event-details-cancel-button"
                            disabled={registrationStatus.status === 'attended'}
                            onClick={handleCancel}
                          >
                            Cancel Registration
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {isFull && !event.allowWaitlist ? (
                          <button 
                            className="event-details-register-button"
                            disabled
                          >
                            Event Full
                          </button>
                        ) : (
                          <>
                            {errorRegister && (
                              <Message variant="error">
                                {errorRegister}
                              </Message>
                            )}
                            <button 
                              className="event-details-register-button"
                              onClick={openRegistrationModal}
                              disabled={loadingRegister}
                            >
                              {isFull ? 'Join Waitlist' : 'Register for Event'}
                            </button>
                          </>
                        )}
                      </>
                    )}
                    {isCreator || isEventManager ? (
                      <Link to={`/events/${id}/attendees`} className="event-details-manage-button">
                        Manage Attendees
                      </Link>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="event-details-sidebar">
            <div className="event-details-sidebar-section">
              <h2 className="event-details-sidebar-title">Organizer</h2>
              <div className="event-details-creator">
                <div className="event-details-creator-avatar">
                  {event.creator.profilePicture ? (
                    <img
                      src={event.creator.profilePicture || "/placeholder.svg"}
                      alt={event.creator.name}
                    />
                  ) : (
                    <span className="event-details-creator-avatar-placeholder">👤</span>
                  )}
                </div>
                <div>
                  <div className="event-details-creator-name">{event.creator.name}</div>
                  <div className="event-details-creator-role">{event.creator.role}</div>
                </div>
              </div>
            </div>
            
            <div className="event-details-sidebar-section">
              <h2 className="event-details-sidebar-title">
                Attendees ({event.attendees.length}
                {event.maxAttendees > 0 ? ` / ${event.maxAttendees}` : ""})
              </h2>
              
              {event.maxAttendees > 0 && (
                <div className="capacity-container">
                  <div className="capacity-bar">
                    <div 
                      className={`capacity-bar-fill ${isFull ? 'capacity-full' : ''}`} 
                      style={{ width: `${Math.min(100, (event.attendees.length / event.maxAttendees) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="capacity-text">
                    {event.attendees.length} of {event.maxAttendees} spots filled
                  </div>
                </div>
              )}
              
              {event.attendees.length > 0 ? (
                <div className="event-details-attendees-list">
                  {event.attendees.slice(0, 10).map((attendee) => (
                    <div
                      key={attendee._id}
                      className="event-details-attendee"
                      title={attendee.name}
                    >
                      {attendee.profilePicture ? (
                        <img
                          src={attendee.profilePicture || "/placeholder.svg"}
                          alt={attendee.name}
                        />
                      ) : (
                        <span className="event-details-attendee-placeholder">👤</span>
                      )}
                    </div>
                  ))}
                  {event.attendees.length > 10 && (
                    <div className="event-details-attendee-count">
                      +{event.attendees.length - 10}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No attendees yet</p>
              )}
            </div>
            
            <div className="event-details-sidebar-section">
              <h2 className="event-details-sidebar-title">Announcements</h2>
              {event.announcements && event.announcements.length > 0 ? (
                <div className="event-details-announcements-list">
                  {event.announcements.map((announcement, index) => (
                    <div key={index} className="event-details-announcement">
                      <p className="event-details-announcement-message">{announcement.message}</p>
                      <p className="event-details-announcement-date">
                        {formatDate(announcement.date)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-6">No announcements yet</p>
              )}
              
              {(isCreator || isEventManager) && (
                <form onSubmit={handleSendAnnouncement} className="event-details-announcement-form">
                  <textarea
                    className="event-details-announcement-textarea"
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    placeholder="Write an announcement..."
                    rows="3"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="event-details-announcement-button"
                  >
                    Send Announcement
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Message variant="error">Event not found</Message>
      )}
      
      {/* Registration Modal */}
      {showRegistrationModal && (
        <Modal title={`Register for ${event.title}`} onClose={closeRegistrationModal}>
          <div className="registration-modal-body">
            {event.registrationQuestions && event.registrationQuestions.length > 0 ? (
              <div className="questions-container">
                {event.registrationQuestions.map((question, index) => (
                  <div key={index} className="registration-question">
                    <label className="registration-question-label">
                      {question.questionText}
                      {question.required && <span className="registration-question-required">*</span>}
                    </label>
                    
                    {question.type === 'text' ? (
                      <input
                        type="text"
                        className="registration-question-input"
                        required={question.required}
                        onChange={(e) => handleResponseChange(e, index)}
                      />
                    ) : question.type === 'select' ? (
                      <select
                        className="registration-question-select"
                        required={question.required}
                        onChange={(e) => handleResponseChange(e, index)}
                      >
                        <option value="">Select an option</option>
                        {question.options.map((option, optIdx) => (
                          <option key={optIdx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="registration-checkbox-group">
                        {question.options.map((option, optIdx) => (
                          <div key={optIdx}>
                            <input
                              type="checkbox"
                              id={`question_${index}_option_${optIdx}`}
                              className="registration-checkbox"
                              onChange={(e) => {
                                const currentVal = responses[`question_${index}`] || '';
                                const values = currentVal ? currentVal.split(',') : [];
                                
                                if (e.target.checked) {
                                  values.push(option);
                                } else {
                                  const idx = values.indexOf(option);
                                  if (idx !== -1) values.splice(idx, 1);
                                }
                                
                                handleResponseChange({
                                  target: { value: values.join(',') }
                                }, index);
                              }}
                            />
                            <label htmlFor={`question_${index}_option_${optIdx}`}>
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>
                You're about to register for {event.title}. Click "Register" to confirm.
                {isFull && event.allowWaitlist && (
                  <span className="registration-waitlist-notice">
                    This event is full. You'll be added to the waitlist.
                  </span>
                )}
              </p>
            )}
            
            <div className="event-details-actions">
              <button className="event-details-cancel-button" onClick={closeRegistrationModal}>
                Cancel
              </button>
              <button className="event-details-register-button" onClick={handleRegister}>
                {isFull && event.allowWaitlist ? 'Join Waitlist' : 'Register'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventDetailsPage;