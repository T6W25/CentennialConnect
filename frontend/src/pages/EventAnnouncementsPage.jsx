import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import {
  fetchEventAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  sendReminder,
  createSurvey,
  fetchEventSurveys,
  deleteSurvey,
  clearAnnouncementMessages
} from "../slices/announcementSlice"
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  Box
} from "@mui/material"
import {
  Add,
  Announcement,
  Delete,
  Edit,
  NotificationsActive,
  Poll,
  Send
} from "@mui/icons-material"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`announcement-tabpanel-${index}`}
      aria-labelledby={`announcement-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const EventAnnouncementsPage = () => {
  const { id: eventId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { announcements, reminders, surveys, loading, error, successMessage } = useSelector(
    (state) => state.announcements
  )
  const { events } = useSelector((state) => state.events)
  const event = events.find(e => e._id === eventId) || {}
  
  // Local state
  const [tabValue, setTabValue] = useState(0)
  const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false)
  const [openReminderDialog, setOpenReminderDialog] = useState(false)
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  // Form states
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "NORMAL"
  })
  
  const [reminderForm, setReminderForm] = useState({
    title: "",
    content: "",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to tomorrow
  })
  
  const [surveyForm, setSurveyForm] = useState({
    title: "",
    description: "",
    questions: [{ text: "", type: "MULTIPLE_CHOICE", options: ["", ""] }]
  })
  
  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventAnnouncements(eventId))
      dispatch(fetchEventSurveys(eventId))
    }
  }, [dispatch, eventId])
  
  useEffect(() => {
    if (successMessage) {
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearAnnouncementMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, dispatch])
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  
  // Handle announcement form submission
  const handleAnnouncementSubmit = () => {
    if (selectedItem) {
      dispatch(
        updateAnnouncement({
          eventId,
          announcementId: selectedItem._id,
          announcement: announcementForm
        })
      )
    } else {
      dispatch(
        createAnnouncement({
          eventId,
          announcement: { ...announcementForm, type: "ANNOUNCEMENT" }
        })
      )
    }
    setOpenAnnouncementDialog(false)
    setAnnouncementForm({ title: "", content: "", priority: "NORMAL" })
    setSelectedItem(null)
  }
  
  // Handle reminder form submission
  const handleReminderSubmit = () => {
    if (selectedItem) {
      dispatch(
        updateAnnouncement({
          eventId,
          announcementId: selectedItem._id,
          announcement: reminderForm
        })
      )
    } else {
      dispatch(
        createAnnouncement({
          eventId,
          announcement: { ...reminderForm, type: "REMINDER" }
        })
      )
    }
    setOpenReminderDialog(false)
    setReminderForm({
      title: "",
      content: "",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })
    setSelectedItem(null)
  }
  
  // Handle survey form submission
  const handleSurveySubmit = () => {
    // Filter out any empty options
    const processedQuestions = surveyForm.questions.map(q => ({
      ...q,
      options: q.options.filter(opt => opt.trim() !== "")
    }))
    
    dispatch(
      createSurvey({
        eventId,
        survey: { ...surveyForm, questions: processedQuestions }
      })
    )
    
    setOpenSurveyDialog(false)
    setSurveyForm({
      title: "",
      description: "",
      questions: [{ text: "", type: "MULTIPLE_CHOICE", options: ["", ""] }]
    })
  }
  
  // Handle adding a question to the survey
  const handleAddQuestion = () => {
    setSurveyForm({
      ...surveyForm,
      questions: [
        ...surveyForm.questions,
        { text: "", type: "MULTIPLE_CHOICE", options: ["", ""] }
      ]
    })
  }
  
  // Handle updating a question
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...surveyForm.questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    
    // If changing from multiple choice to text, remove options
    if (field === "type" && value === "TEXT") {
      delete updatedQuestions[index].options
    }
    
    // If changing from text to multiple choice, add options
    if (field === "type" && value === "MULTIPLE_CHOICE" && !updatedQuestions[index].options) {
      updatedQuestions[index].options = ["", ""]
    }
    
    setSurveyForm({ ...surveyForm, questions: updatedQuestions })
  }
  
  // Handle adding an option to a question
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...surveyForm.questions]
    updatedQuestions[questionIndex].options.push("")
    setSurveyForm({ ...surveyForm, questions: updatedQuestions })
  }
  
  // Handle option text change
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...surveyForm.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setSurveyForm({ ...surveyForm, questions: updatedQuestions })
  }
  
  // Handle deleting
  const handleDelete = () => {
    if (tabValue === 0) {
      dispatch(deleteAnnouncement({ eventId, announcementId: selectedItem._id }))
    } else if (tabValue === 1) {
      dispatch(deleteAnnouncement({ eventId, announcementId: selectedItem._id }))
    } else if (tabValue === 2) {
      dispatch(deleteSurvey({ eventId, surveyId: selectedItem._id }))
    }
    
    setOpenDeleteDialog(false)
    setSelectedItem(null)
  }
  
  // Handle sending a reminder
  const handleSendReminder = (reminder) => {
    dispatch(sendReminder({ eventId, reminderId: reminder._id }))
  }
  
  // Handle opening edit dialog
  const handleEditItem = (item) => {
    setSelectedItem(item)
    
    if (tabValue === 0) {
      setAnnouncementForm({
        title: item.title,
        content: item.content,
        priority: item.priority
      })
      setOpenAnnouncementDialog(true)
    } else if (tabValue === 1) {
      setReminderForm({
        title: item.title,
        content: item.content,
        scheduledDate: new Date(item.scheduledDate)
      })
      setOpenReminderDialog(true)
    }
  }
  
  // Formatted date display
  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }
  
  // Get the priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "error"
      case "NORMAL":
        return "primary"
      case "LOW":
        return "success"
      default:
        return "primary"
    }
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Event Communications: {event.title || "Event"}
      </Typography>
      
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      {successMessage && (
        <Alert severity="success" sx={{ my: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="announcement tabs"
          variant="fullWidth"
        >
          <Tab icon={<Announcement />} label="Announcements" />
          <Tab icon={<NotificationsActive />} label="Reminders" />
          <Tab icon={<Poll />} label="Surveys" />
        </Tabs>
        
        {/* Announcements Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedItem(null)
                setAnnouncementForm({ title: "", content: "", priority: "NORMAL" })
                setOpenAnnouncementDialog(true)
              }}
            >
              New Announcement
            </Button>
          </Box>
          
          {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
          
          {!loading && announcements.length === 0 ? (
            <Card sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h6">No Announcements Yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first announcement to keep participants informed.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {announcements.map((announcement) => (
                <Grid item xs={12} key={announcement._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {announcement.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Posted: {formatDate(announcement.createdAt)}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1">
                              {announcement.content}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <IconButton
                            onClick={() => handleEditItem(announcement)}
                            aria-label="edit"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedItem(announcement)
                              setOpenDeleteDialog(true)
                            }}
                            aria-label="delete"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        {/* Reminders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedItem(null)
                setReminderForm({
                  title: "",
                  content: "",
                  scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
                })
                setOpenReminderDialog(true)
              }}
            >
              New Reminder
            </Button>
          </Box>
          
          {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
          
          {!loading && reminders.length === 0 ? (
            <Card sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h6">No Reminders Yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Create a reminder to notify participants about important dates.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {reminders.map((reminder) => (
                <Grid item xs={12} key={reminder._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {reminder.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scheduled for: {formatDate(reminder.scheduledDate)}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1">
                              {reminder.content}
                            </Typography>
                          </Box>
                          {reminder.sentAt && (
                            <Typography
                              variant="caption"
                              color="success.main"
                              sx={{ display: "block", mt: 1 }}
                            >
                              Sent at: {formatDate(reminder.sentAt)}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          {!reminder.sentAt && (
                            <Button
                              variant="contained"
                              startIcon={<Send />}
                              size="small"
                              onClick={() => handleSendReminder(reminder)}
                              sx={{ mr: 1 }}
                            >
                              Send Now
                            </Button>
                          )}
                          <IconButton
                            onClick={() => handleEditItem(reminder)}
                            aria-label="edit"
                            disabled={!!reminder.sentAt}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedItem(reminder)
                              setOpenDeleteDialog(true)
                            }}
                            aria-label="delete"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        {/* Surveys Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSurveyForm({
                  title: "",
                  description: "",
                  questions: [{ text: "", type: "MULTIPLE_CHOICE", options: ["", ""] }]
                })
                setOpenSurveyDialog(true)
              }}
            >
              Create Survey
            </Button>
          </Box>
          
          {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
          
          {!loading && surveys.length === 0 ? (
            <Card sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h6">No Surveys Yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Create a survey to gather feedback from participants.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {surveys.map((survey) => (
                <Grid item xs={12} md={6} key={survey._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {survey.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {survey.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created: {formatDate(survey.createdAt)}
                          </Typography>
                          
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/events/${eventId}/surveys/${survey._id}`)}
                            >
                              View Results
                            </Button>
                          </Box>
                        </Box>
                        <Box>
                          <IconButton
                            onClick={() => {
                              setSelectedItem(survey)
                              setOpenDeleteDialog(true)
                            }}
                            aria-label="delete"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Announcement Dialog */}
      <Dialog
        open={openAnnouncementDialog}
        onClose={() => setOpenAnnouncementDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? "Edit Announcement" : "Create Announcement"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={announcementForm.title}
            onChange={(e) =>
              setAnnouncementForm({ ...announcementForm, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            multiline
            rows={4}
            fullWidth
            value={announcementForm.content}
            onChange={(e) =>
              setAnnouncementForm({ ...announcementForm, content: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={announcementForm.priority}
              label="Priority"
              onChange={(e) =>
                setAnnouncementForm({ ...announcementForm, priority: e.target.value })
              }
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="NORMAL">Normal</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnnouncementDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAnnouncementSubmit}
            variant="contained"
            disabled={!announcementForm.title || !announcementForm.content}
          >
            {selectedItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog
        open={openReminderDialog}
        onClose={() => setOpenReminderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedItem ? "Edit Reminder" : "Create Reminder"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={reminderForm.title}
            onChange={(e) =>
              setReminderForm({ ...reminderForm, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            value={reminderForm.content}
            onChange={(e) =>
              setReminderForm({ ...reminderForm, content: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Scheduled Date"
              value={reminderForm.scheduledDate}
              onChange={(newValue) =>
                setReminderForm({ ...reminderForm, scheduledDate: newValue })
              }
              minDateTime={new Date()}
              sx={{ width: "100%", mb: 2 }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReminderDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReminderSubmit}
            variant="contained"
            disabled={!reminderForm.title || !reminderForm.content}
          >
            {selectedItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Survey Dialog */}
      <Dialog
        open={openSurveyDialog}
        onClose={() => setOpenSurveyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Survey</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Survey Title"
            fullWidth
            value={surveyForm.title}
            onChange={(e) => setSurveyForm({ ...surveyForm, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            multiline
            rows={2}
            fullWidth
            value={surveyForm.description}
            onChange={(e) =>
              setSurveyForm({ ...surveyForm, description: e.target.value })
            }
            sx={{ mb: 4 }}
          />
          
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>
          {surveyForm.questions.map((question, questionIndex) => (
            <Paper
              key={questionIndex}
              elevation={1}
              sx={{ p: 2, mb: 3, position: "relative" }}
            >
              <IconButton
                size="small"
                color="error"
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => {
                  if (surveyForm.questions.length > 1) {
                    const updatedQuestions = surveyForm.questions.filter(
                      (_, idx) => idx !== questionIndex
                    )
                    setSurveyForm({ ...surveyForm, questions: updatedQuestions })
                  }
                }}
                disabled={surveyForm.questions.length <= 1}
              >
                <Delete fontSize="small" />
              </IconButton>
              
              <TextField
                label={`Question ${questionIndex + 1}`}
                fullWidth
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, "text", e.target.value)
                }
                sx={{ mb: 2 }}
              />
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Question Type</FormLabel>
                <RadioGroup
                  row
                  value={question.type}
                  onChange={(e) =>
                    handleQuestionChange(questionIndex, "type", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="MULTIPLE_CHOICE"
                    control={<Radio />}
                    label="Multiple Choice"
                  />
                  <FormControlLabel
                    value="TEXT"
                    control={<Radio />}
                    label="Text Answer"
                  />
                </RadioGroup>
              </FormControl>
              
              {question.type === "MULTIPLE_CHOICE" && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Options:
                  </Typography>
                  {question.options.map((option, optionIndex) => (
                    <Box key={optionIndex} sx={{ display: "flex", mb: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                      />
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          if (question.options.length > 2) {
                            const updatedOptions = question.options.filter(
                              (_, idx) => idx !== optionIndex
                            )
                            const updatedQuestions = [...surveyForm.questions]
                            updatedQuestions[questionIndex].options = updatedOptions
                            setSurveyForm({ ...surveyForm, questions: updatedQuestions })
                          }
                        }}
                        disabled={question.options.length <= 2}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => handleAddOption(questionIndex)}
                    sx={{ mt: 1 }}
                  >
                    Add Option
                  </Button>
                </Box>
              )}
            </Paper>
          ))}
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddQuestion}
            sx={{ mt: 1 }}
          >
            Add Question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSurveyDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSurveySubmit}
            variant="contained"
            disabled={
              !surveyForm.title ||
              surveyForm.questions.some(q => !q.text || (q.type === "MULTIPLE_CHOICE" && q.options.every(o => !o)))
            }
          >
            Create Survey
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {tabValue === 0 ? "announcement" : tabValue === 1 ? "reminder" : "survey"}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default EventAnnouncementsPage