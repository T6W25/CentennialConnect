import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchReports, resolveReport, deleteReportedContent, clearReportMessages } from "../slices/reportSlice"
import { 
  Alert, 
  Button, 
  Card, 
  Container, 
  Divider, 
  Paper, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Box,
  Chip
} from "@mui/material"
import { Check, Delete, PriorityHigh, Flag, RemoveCircle } from "@mui/icons-material"

const ReportManagementPage = () => {
  const dispatch = useDispatch()
  const { id: communityId } = useParams()
  const { reports, loading, error, successMessage } = useSelector((state) => state.reports)
  
  const [selectedReport, setSelectedReport] = useState(null)
  const [resolution, setResolution] = useState("")
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reportFilter, setReportFilter] = useState("PENDING")
  
  useEffect(() => {
    dispatch(fetchReports(communityId))
  }, [dispatch, communityId])
  
  useEffect(() => {
    // Clear success message after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearReportMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, dispatch])

  const handleResolveReport = () => {
    dispatch(resolveReport({
      reportId: selectedReport._id,
      resolution,
      actionTaken: resolution === "CONTENT_KEPT" ? "NONE" : "WARNING"
    }))
    setOpen(false)
    setSelectedReport(null)
  }

  const handleDeleteContent = () => {
    dispatch(deleteReportedContent({
      reportId: selectedReport._id,
      contentType: selectedReport.contentType,
      contentId: selectedReport.contentId
    }))
    setDeleteDialogOpen(false)
    setSelectedReport(null)
  }

  const filteredReports = reports.filter(report => 
    reportFilter === "ALL" ? true : report.status === reportFilter
  )

  // Helper for displaying severity level
  const getSeverityChip = (severity) => {
    const severityMap = {
      LOW: { color: "success", label: "Low", icon: <Flag fontSize="small" /> },
      MEDIUM: { color: "warning", label: "Medium", icon: <Flag fontSize="small" /> },
      HIGH: { color: "error", label: "High", icon: <PriorityHigh fontSize="small" /> },
    }
    
    const config = severityMap[severity] || severityMap.LOW
    
    return (
      <Chip 
        icon={config.icon} 
        label={config.label} 
        color={config.color} 
        size="small" 
        variant="outlined"
      />
    )
  }

  // Helper for displaying status
  const getStatusChip = (status) => {
    const statusMap = {
      PENDING: { color: "warning", label: "Pending" },
      RESOLVED: { color: "success", label: "Resolved" },
      DISMISSED: { color: "default", label: "Dismissed" },
    }
    
    const config = statusMap[status] || statusMap.PENDING
    
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small"
      />
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Report Management
      </Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Filter Reports</InputLabel>
          <Select
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
            label="Filter Reports"
          >
            <MenuItem value="ALL">All Reports</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
            <MenuItem value="DISMISSED">Dismissed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Typography>Loading reports...</Typography>
      ) : filteredReports.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reported Content</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <Typography variant="body2">
                      {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                      {report.contentPreview}
                    </Typography>
                  </TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.reportedBy.username}</TableCell>
                  <TableCell>{getSeverityChip(report.severity)}</TableCell>
                  <TableCell>{getStatusChip(report.status)}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {report.status === "PENDING" && (
                      <>
                        <Button
                          size="small"
                          startIcon={<Check />}
                          onClick={() => {
                            setSelectedReport(report)
                            setOpen(true)
                          }}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => {
                            setSelectedReport(report)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {report.status !== "PENDING" && (
                      <Typography variant="body2" color="text.secondary">
                        {report.resolution === "CONTENT_KEPT" ? "Content kept" : "Content removed"}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">No reports found</Typography>
          <Typography variant="body2" color="text.secondary">
            There are no reports matching your current filter.
          </Typography>
        </Card>
      )}
      
      {/* Resolution Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Resolve Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How would you like to resolve this report?
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Resolution</InputLabel>
            <Select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              label="Resolution"
            >
              <MenuItem value="CONTENT_KEPT">Keep content (no violation found)</MenuItem>
              <MenuItem value="WARNING_ISSUED">Keep content but issue a warning</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleResolveReport} variant="contained" disabled={!resolution}>
            Resolve
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Reported Content?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the reported content and resolve the report. 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteContent} color="error" variant="contained">
            Delete Content
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ReportManagementPage