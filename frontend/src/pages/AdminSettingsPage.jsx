import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchSystemSettings,
  updateSystemSettings,
  fetchContentRules,
  updateContentRules,
  fetchUserRoles,
  updateUserRole,
  fetchPlugins,
  togglePlugin,
  clearAdminMessages
} from "../slices/adminSlice"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import {
  Add,
  Close,
  Delete,
  Settings,
  Security,
  SupervisorAccount,
  Extension
} from "@mui/icons-material"
import { ChromePicker } from "react-color"

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const AdminSettingsPage = () => {
  const dispatch = useDispatch()
  const { systemSettings, contentRules, userRoles, plugins, loading, error, successMessage } = useSelector(
    (state) => state.admin
  )
  
  // Local state
  const [tabValue, setTabValue] = useState(0)
  const [editedSettings, setEditedSettings] = useState(systemSettings)
  const [editedContentRules, setEditedContentRules] = useState(contentRules)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRoleDialog, setNewRoleDialog] = useState(false)
  const [newRole, setNewRole] = useState("")
  const [newKeyword, setNewKeyword] = useState("")
  const [newMediaType, setNewMediaType] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerType, setColorPickerType] = useState("primary")
  
  useEffect(() => {
    dispatch(fetchSystemSettings())
    dispatch(fetchContentRules())
    dispatch(fetchUserRoles())
    dispatch(fetchPlugins())
  }, [dispatch])
  
  useEffect(() => {
    setEditedSettings(systemSettings)
  }, [systemSettings])
  
  useEffect(() => {
    setEditedContentRules(contentRules)
  }, [contentRules])
  
  useEffect(() => {
    if (successMessage) {
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearAdminMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, dispatch])
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  
  // Handle system settings change
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditedSettings({
      ...editedSettings,
      [name]: type === "checkbox" ? checked : value
    })
  }
  
  // Handle color change
  const handleColorChange = (color) => {
    setEditedSettings({
      ...editedSettings,
      [colorPickerType + "Color"]: color.hex
    })
  }
  
  // Save settings
  const handleSaveSettings = () => {
    dispatch(updateSystemSettings(editedSettings))
  }
  
  // Handle content rules change
  const handleContentRulesChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditedContentRules({
      ...editedContentRules,
      [name]: type === "checkbox" ? checked : value
    })
  }
  
  // Add keyword to prohibited list
  const handleAddKeyword = () => {
    if (newKeyword && !editedContentRules.prohibitedKeywords.includes(newKeyword)) {
      setEditedContentRules({
        ...editedContentRules,
        prohibitedKeywords: [...editedContentRules.prohibitedKeywords, newKeyword]
      })
      setNewKeyword("")
    }
  }
  
  // Remove keyword from prohibited list
  const handleRemoveKeyword = (keyword) => {
    setEditedContentRules({
      ...editedContentRules,
      prohibitedKeywords: editedContentRules.prohibitedKeywords.filter(k => k !== keyword)
    })
  }
  
  // Add media type to allowed list
  const handleAddMediaType = () => {
    if (newMediaType && !editedContentRules.allowedMediaTypes.includes(newMediaType)) {
      setEditedContentRules({
        ...editedContentRules,
        allowedMediaTypes: [...editedContentRules.allowedMediaTypes, newMediaType]
      })
      setNewMediaType("")
    }
  }
  
  // Remove media type from allowed list
  const handleRemoveMediaType = (mediaType) => {
    setEditedContentRules({
      ...editedContentRules,
      allowedMediaTypes: editedContentRules.allowedMediaTypes.filter(m => m !== mediaType)
    })
  }
  
  // Save content rules
  const handleSaveContentRules = () => {
    dispatch(updateContentRules(editedContentRules))
  }
  
  // Handle role change
  const handleRoleChange = () => {
    if (selectedUser && newRole) {
      dispatch(updateUserRole({ userId: selectedUser._id, role: newRole }))
      setNewRoleDialog(false)
      setSelectedUser(null)
      setNewRole("")
    }
  }
  
  // Toggle plugin
  const handleTogglePlugin = (pluginId, enabled) => {
    dispatch(togglePlugin({ pluginId, enabled: !enabled }))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Platform Settings
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
          variant="fullWidth"
        >
          <Tab icon={<Settings />} label="General Settings" />
          <Tab icon={<Security />} label="Content Rules" />
          <Tab icon={<SupervisorAccount />} label="User Roles" />
          <Tab icon={<Extension />} label="Plugins & Integrations" />
        </Tabs>
        
        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Platform Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <TextField
                    label="Platform Name"
                    name="platformName"
                    value={editedSettings.platformName}
                    onChange={handleSettingsChange}
                    fullWidth
                    margin="normal"
                  />
                  
                  <TextField
                    label="Logo URL"
                    name="logoUrl"
                    value={editedSettings.logoUrl}
                    onChange={handleSettingsChange}
                    fullWidth
                    margin="normal"
                    helperText="Enter a URL for your platform logo"
                  />
                  
                  <TextField
                    label="Contact Email"
                    name="contactEmail"
                    value={editedSettings.contactEmail}
                    onChange={handleSettingsChange}
                    fullWidth
                    margin="normal"
                    type="email"
                  />
                  
                  <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Primary Color
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: editedSettings.primaryColor,
                          cursor: "pointer",
                          mr: 2,
                          border: "1px solid #ddd",
                        }}
                        onClick={() => {
                          setColorPickerType("primary")
                          setShowColorPicker(true)
                        }}
                      />
                      <TextField
                        value={editedSettings.primaryColor}
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Secondary Color
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: editedSettings.secondaryColor,
                          cursor: "pointer",
                          mr: 2,
                          border: "1px solid #ddd",
                        }}
                        onClick={() => {
                          setColorPickerType("secondary")
                          setShowColorPicker(true)
                        }}
                      />
                      <TextField
                        value={editedSettings.secondaryColor}
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {showColorPicker && (
                    <Box sx={{ mt: 2, position: "relative" }}>
                      <Paper
                        elevation={3}
                        sx={{ position: "absolute", zIndex: 10 }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => setShowColorPicker(false)}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                        <ChromePicker
                          color={
                            colorPickerType === "primary"
                              ? editedSettings.primaryColor
                              : editedSettings.secondaryColor
                          }
                          onChange={handleColorChange}
                          disableAlpha
                        />
                      </Paper>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Platform Configuration
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <TextField
                    label="Max Upload Size (MB)"
                    name="maxUploadSize"
                    value={editedSettings.maxUploadSize}
                    onChange={handleSettingsChange}
                    fullWidth
                    margin="normal"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">MB</InputAdornment>
                    }}
                  />
                  
                  <FormGroup sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedSettings.allowUserRegistration}
                          onChange={handleSettingsChange}
                          name="allowUserRegistration"
                        />
                      }
                      label="Allow User Registration"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedSettings.requireEmailVerification}
                          onChange={handleSettingsChange}
                          name="requireEmailVerification"
                        />
                      }
                      label="Require Email Verification"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedSettings.autoApproveContent}
                          onChange={handleSettingsChange}
                          name="autoApproveContent"
                        />
                      }
                      label="Auto-Approve User Content"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Settings"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Content Rules Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Content Moderation
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedContentRules.contentReviewEnabled}
                          onChange={handleContentRulesChange}
                          name="contentReviewEnabled"
                        />
                      }
                      label="Enable Content Review"
                    />
                  </FormGroup>
                  
                  <TextField
                    label="Flag Threshold"
                    name="flagThreshold"
                    value={editedContentRules.flagThreshold}
                    onChange={handleContentRulesChange}
                    fullWidth
                    margin="normal"
                    type="number"
                    helperText="Number of flags needed for automatic moderation review"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Prohibited Keywords
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      label="Add Prohibited Keyword"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddKeyword}
                      disabled={!newKeyword}
                      sx={{ ml: 1 }}
                    >
                      <Add />
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {editedContentRules.prohibitedKeywords.map((keyword) => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        onDelete={() => handleRemoveKeyword(keyword)}
                        color="error"
                        variant="outlined"
                      />
                    ))}
                    {editedContentRules.prohibitedKeywords.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No prohibited keywords defined
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Allowed Media Types
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      label="Add Allowed Media Type"
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., image/jpeg, video/mp4"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddMediaType}
                      disabled={!newMediaType}
                      sx={{ ml: 1 }}
                    >
                      <Add />
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {editedContentRules.allowedMediaTypes.map((mediaType) => (
                      <Chip
                        key={mediaType}
                        label={mediaType}
                        onDelete={() => handleRemoveMediaType(mediaType)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {editedContentRules.allowedMediaTypes.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No media types defined (all types allowed)
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveContentRules}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Content Rules"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* User Roles Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Role Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Current Role</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userRoles.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={user.role} 
                                  color={
                                    user.role === "ADMIN" 
                                      ? "error" 
                                      : user.role === "COMMUNITY_MANAGER" || user.role === "EVENT_MANAGER"
                                      ? "warning"
                                      : "primary"
                                  } 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setNewRole(user.role)
                                    setNewRoleDialog(true)
                                  }}
                                >
                                  Change Role
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Plugins Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {plugins.map((plugin) => (
              <Grid item xs={12} md={6} key={plugin._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <Typography variant="h6">{plugin.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plugin.description}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Version: {plugin.version}
                        </Typography>
                      </div>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={plugin.enabled}
                            onChange={() => handleTogglePlugin(plugin._id, plugin.enabled)}
                            name={`plugin-${plugin._id}`}
                          />
                        }
                        label={plugin.enabled ? "Enabled" : "Disabled"}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {plugins.length === 0 && !loading && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6">No Plugins Available</Typography>
                    <Typography variant="body2" color="text.secondary">
                      There are currently no plugins installed.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {loading && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* Change Role Dialog */}
      <Dialog
        open={newRoleDialog}
        onClose={() => setNewRoleDialog(false)}
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update role for user: {selectedUser?.username}
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="COMMUNITY_MANAGER">Community Manager</MenuItem>
              <MenuItem value="EVENT_MANAGER">Event Manager</MenuItem>
              <MenuItem value="ADMIN">Administrator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleRoleChange} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminSettingsPage