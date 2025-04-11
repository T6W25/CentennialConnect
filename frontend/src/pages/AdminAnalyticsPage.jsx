import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUserStats,
  fetchEngagementStats,
  fetchCommunityStats,
  fetchEventStats,
  fetchContentStats
} from "../slices/analyticsSlice"
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
  CircularProgress
} from "@mui/material"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts"
import {
  PeopleAlt,
  Timeline,
  Group,
  Event,
  Description,
  TrendingUp,
  ArrowUpward,
  ArrowDownward
} from "@mui/icons-material"

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch()
  const { userStats, engagementStats, communityStats, eventStats, contentStats } = useSelector(
    (state) => state.analytics
  )
  
  // Local state
  const [tabValue, setTabValue] = useState(0)
  const [timePeriod, setTimePeriod] = useState("month")
  
  useEffect(() => {
    dispatch(fetchUserStats(timePeriod))
    dispatch(fetchEngagementStats(timePeriod))
    dispatch(fetchCommunityStats(timePeriod))
    dispatch(fetchEventStats(timePeriod))
    dispatch(fetchContentStats(timePeriod))
  }, [dispatch, timePeriod])
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  
  // Handle time period change
  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value)
  }
  
  // Generate colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']
  
  // Helper to format dates in charts
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' }
    return new Date(date).toLocaleDateString(undefined, options)
  }
  
  // Helper for calculating percent change
  const calculatePercentChange = (current, previous) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }
  
  // Stat Card Component
  const StatCard = ({ title, value, previousValue, icon: Icon, loading }) => {
    const percentChange = calculatePercentChange(value, previousValue)
    
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box 
              sx={{ 
                backgroundColor: 'primary.light', 
                borderRadius: '50%', 
                p: 1, 
                display: 'flex', 
                mr: 1 
              }}
            >
              <Icon sx={{ color: 'primary.main' }} />
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {title}
            </Typography>
          </Box>
          
          {loading ? (
            <CircularProgress size={24} sx={{ my: 1 }} />
          ) : (
            <>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              
              {percentChange !== 0 && previousValue && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {percentChange > 0 ? (
                    <ArrowUpward color="success" fontSize="small" />
                  ) : (
                    <ArrowDownward color="error" fontSize="small" />
                  )}
                  <Typography 
                    variant="body2" 
                    color={percentChange > 0 ? 'success.main' : 'error.main'}
                  >
                    {Math.abs(percentChange).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Platform Analytics
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            onChange={handleTimePeriodChange}
            label="Time Period"
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="quarter">Last 90 Days</MenuItem>
            <MenuItem value="year">Last 365 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={userStats.totalUsers}
            previousValue={userStats.previousTotalUsers}
            icon={PeopleAlt}
            loading={userStats.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={userStats.activeUsers}
            previousValue={userStats.previousActiveUsers}
            icon={Timeline}
            loading={userStats.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Communities"
            value={communityStats.totalCommunities}
            previousValue={communityStats.previousTotalCommunities}
            icon={Group}
            loading={communityStats.loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={eventStats.totalEvents}
            previousValue={eventStats.previousTotalEvents}
            icon={Event}
            loading={eventStats.loading}
          />
        </Grid>
      </Grid>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="analytics tabs"
          variant="fullWidth"
        >
          <Tab icon={<PeopleAlt />} label="Users" />
          <Tab icon={<Timeline />} label="Engagement" />
          <Tab icon={<Group />} label="Communities" />
          <Tab icon={<Event />} label="Events" />
          <Tab icon={<Description />} label="Content" />
        </Tabs>
        
        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          {userStats.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {userStats.error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="New User Registrations" />
                <Divider />
                <CardContent>
                  {userStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={userStats.registrationsByDay}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, "Registrations"]}
                          labelFormatter={(label) => formatDate(label)}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          fill="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Users by Role" />
                <Divider />
                <CardContent>
                  {userStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={userStats.usersByRole}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="role"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userStats.usersByRole.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [value, props.payload.role]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Engagement Tab */}
        <TabPanel value={tabValue} index={1}>
          {engagementStats.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {engagementStats.error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Daily User Activity" />
                <Divider />
                <CardContent>
                  {engagementStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={engagementStats.actionsPerDay}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, "Actions"]}
                          labelFormatter={(label) => formatDate(label)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="User Actions"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Popular Activity Hours" />
                <Divider />
                <CardContent>
                  {engagementStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={engagementStats.popularHours}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, "Activity Count"]} />
                        <Bar dataKey="count" fill="#82ca9d" name="Activity Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Retention Analysis" />
                <Divider />
                <CardContent>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" component="div" color="primary">
                      {engagementStats.loading ? (
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                      ) : (
                        `${(engagementStats.retentionRate * 100).toFixed(1)}%`
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User Retention Rate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Communities Tab */}
        <TabPanel value={tabValue} index={2}>
          {communityStats.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {communityStats.error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Communities by Size" />
                <Divider />
                <CardContent>
                  {communityStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={communityStats.communitiesBySize}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="members" fill="#8884d8" name="Members" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Communities by Activity" />
                <Divider />
                <CardContent>
                  {communityStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={communityStats.communitiesByActivity}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="posts" fill="#82ca9d" name="Posts" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="New Communities" />
                <Divider />
                <CardContent>
                  {communityStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={communityStats.newCommunities}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, "New Communities"]}
                          labelFormatter={(label) => formatDate(label)}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Events Tab */}
        <TabPanel value={tabValue} index={3}>
          {eventStats.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {eventStats.error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Events by Attendance" />
                <Divider />
                <CardContent>
                  {eventStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={eventStats.eventsByAttendance}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="attendees" fill="#8884d8" name="Attendees" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Events by Type" />
                <Divider />
                <CardContent>
                  {eventStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={eventStats.eventsByType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="type"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {eventStats.eventsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [value, props.payload.type]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Upcoming Events
                  </Typography>
                  <Typography variant="h4" component="div" color="primary.main">
                    {eventStats.loading ? <CircularProgress size={24} /> : eventStats.upcomingEvents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Past Events
                  </Typography>
                  <Typography variant="h4" component="div" color="primary.main">
                    {eventStats.loading ? <CircularProgress size={24} /> : eventStats.pastEvents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Average Attendance
                  </Typography>
                  <Typography variant="h4" component="div" color="primary.main">
                    {eventStats.loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      eventStats.avgAttendance?.toFixed(0) || 0
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Content Tab */}
        <TabPanel value={tabValue} index={4}>
          {contentStats.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {contentStats.error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="Posts Per Day" />
                <Divider />
                <CardContent>
                  {contentStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={contentStats.postsPerDay}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, "Posts"]}
                          labelFormatter={(label) => formatDate(label)}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Content by Type" />
                <Divider />
                <CardContent>
                  {contentStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={contentStats.contentByType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="type"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {contentStats.contentByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [value, props.payload.type]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Popular Tags" />
                <Divider />
                <CardContent>
                  {contentStats.loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={contentStats.popularTags}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Post Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default AdminAnalyticsPage