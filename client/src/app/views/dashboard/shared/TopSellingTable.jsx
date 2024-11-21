import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { styled, useTheme } from "@mui/material/styles";
import Edit from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Add icon
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Paragraph } from "app/components/Typography";
import DeleteIcon from "@mui/icons-material/Delete";  // Import the delete icon
import { 
  getJobApplications, 
  updateApplicationStatus,
  createJobApplication, // API function for creating job application
  deleteJobApplication
} from '../../../clientAPI';

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));

export default function TopSellingTable() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  const [filters, setFilters] = useState({
    companyName: '',
    position: '',
    status: '',
    sortBy: ''
  });

  const [jobApps, setJobApps] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false); // Modal visibility
  const [newApplication, setNewApplication] = useState({
    company: '',
    date_applied: '',
    pay: '',
    status: '',
    location: '',
    tech_stack: '',
    position: ''
  });

  // Fetch job applications from the database
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setJobApps(data);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchApplications();
  }, []);

  // Handle status change (cycle through statuses)
  const handleStatusChange = async (applicationId) => {
    const statusCycle = ["applied", "interview", "rejected"];
    const product = jobApps.find(p => p.id === applicationId);
    const currentStatusIndex = statusCycle.indexOf(product.status);
    const nextStatusIndex = (currentStatusIndex + 1) % statusCycle.length; 
    const updatedStatus = statusCycle[nextStatusIndex];

    try {
      await updateApplicationStatus(applicationId, updatedStatus);
      const updatedJobApps = jobApps.map(jobApp =>
        jobApp.id === applicationId ? { ...jobApp, status: updatedStatus } : jobApp
      );
      setJobApps(updatedJobApps);
    } catch (error) {
      console.log('Could not update application status from action button');
    }
  };

  // Handle input change for new application form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle new application form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdApplication = await createJobApplication(newApplication);

      // Add the new application to the state
      setJobApps(prevApps => [...prevApps, createdApplication]);

      // Close the modal and reset the form
      setOpenCreateModal(false);
      setNewApplication({
        company: '',
        date_applied: '',
        pay: '',
        status: '',
        location: '',
        tech_stack: '',
        position: ''
      });
    } catch (error) {
      alert('Please fill in all necessary fields');
      console.error("Error creating job application:", error);
    }
  };

  const handleDelete = async (applicationId) => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this job application?");
    
    if (!isConfirmed) return;
  
    try {
      // Call your API to delete the application (make sure you have the delete function in your API)
      await deleteJobApplication(applicationId);
  
      // Remove the deleted job application from the state
      setJobApps(prevApps => prevApps.filter(jobApp => jobApp.id !== applicationId));
    } catch (error) {
      console.error("Error deleting job application:", error);
    }
  };
  

  // Filter and sort job applications (same as before)
  const filteredJobApps = jobApps.filter(jobApp => {
    return (
      jobApp?.company?.toLowerCase().includes(filters.companyName.toLowerCase()) &&
      jobApp?.position?.toLowerCase().includes(filters.position.toLowerCase()) &&
      (filters.status === '' || jobApp?.status === filters.status)
    );
  });

  const sortedJobApps = [...filteredJobApps].sort((a, b) => {
    if (filters.sortBy === 'asc') {
      return a.company.localeCompare(b.company);
    } else if (filters.sortBy === 'desc') {
      return b.company.localeCompare(a.company);
    }
    return 0;
  });

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Applications</Title>
        <IconButton color="primary" onClick={() => setOpenCreateModal(true)}>
          <AddCircleIcon />
        </IconButton>
      </CardHeader>

      {/* Modal for adding a new job application */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Add New Job Application</DialogTitle>
        <DialogContent>
          {/* <TextField
            label="App ID"
            name="user_id"
            value={newApplication.user_id}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          /> */}
          <TextField
            label="Company"
            name="company"
            value={newApplication.company}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date Applied"
            name="date_applied"
            type="date"
            value={newApplication.date_applied}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Pay"
            name="pay"
            value={newApplication.pay}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            name="location"
            value={newApplication.location}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tech Stack"
            name="tech_stack"
            value={newApplication.tech_stack}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Position"
            name="position"
            value={newApplication.position}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Select
            label="Status"
            name="status"
            value={newApplication.status}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="interview">Interview</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Controls */}
      <Box display="flex" justifyContent="space-between" p={2}>
        <Select
          label="Sort by"
          variant="outlined"
          size="small"
          value={filters.sortBy}
          onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
          displayEmpty
        >
          <MenuItem value="" disabled>Sort by</MenuItem>
          <MenuItem value="asc">Company (A-Z)</MenuItem>
          <MenuItem value="desc">Company (Z-A)</MenuItem>
        </Select>
        <TextField
          label="Company Name"
          variant="outlined"
          size="small"
          value={filters.companyName}
          onChange={e => setFilters({ ...filters, companyName: e.target.value })}
        />
        <TextField
          label="Position"
          variant="outlined"
          size="small"
          value={filters.position}
          onChange={e => setFilters({ ...filters, position: e.target.value })}
        />
        <Select
          label="Status"
          variant="outlined"
          size="small"
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          displayEmpty
        >
          <MenuItem value="" disabled>Status</MenuItem>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="applied">Applied</MenuItem>
          <MenuItem value="interview">Interview</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </Box>

      {/* Table with job applications */}
      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} sx={{ px: 3 }}>Company Name</TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>Applied</TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>Position</TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>Status</TableCell>
              <TableCell colSpan={1} sx={{ px: 0 }}>Toggle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedJobApps.map((jobApp) => (
              <TableRow key={jobApp.id} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Link to={`/application-details/${jobApp.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Box display="flex" alignItems="center" gap={4}>
                      <Avatar src={jobApp?.imgUrl} />
                      <Paragraph>{jobApp.company}</Paragraph>
                    </Box>
                  </Link>
                </TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0 }}>
                  {jobApp.date_applied ? new Date(jobApp.date_applied).toLocaleDateString("en-US") : "N/A"}
                </TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0 }}>{jobApp.position}</TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0 }}>
                  <Small bgcolor={jobApp.status === "applied" ? bgSecondary : jobApp.status === "rejected" ? bgError : bgPrimary}>
                    {jobApp.status}
                  </Small>
                </TableCell>
                <TableCell sx={{ p: 1 }}>
                  <IconButton onClick={() => handleStatusChange(jobApp.id)}>
                    <Edit sx={{ color: palette.primary.main }} />
                  </IconButton>
                   {/* Add the delete button */}
                  <IconButton onClick={() => handleDelete(jobApp.id)}>
                    <DeleteIcon sx={{ color: bgError }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
}
