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
import { Paragraph } from "app/components/Typography";
import { getJobApplications, updateApplicationStatus } from '../../../clientAPI';

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

  // State for filtering and storing fetched applications
  const [filters, setFilters] = useState({
    companyName: '',
    position: '',
    status: '',
    sortBy: ''
  });
  
  const [jobApps, setJobApps] = useState([]);
  
  // Fetch job applications from the database
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setJobApps(data); // Assuming `setJobApps` is your state setter for job applications
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };
  
    fetchApplications();
    console.log(jobApps);
  }, []);

  // Handle status change (cycle through statuses)
  const handleStatusChange = async (applicationId) => {
    const statusCycle = ["applied", "interview", "rejected"];
    const product = jobApps.find(p => p.id === applicationId);
    const currentStatusIndex = statusCycle.indexOf(product.status);
    const nextStatusIndex = (currentStatusIndex + 1) % statusCycle.length; // Cycle through the statuses
    const updatedStatus = statusCycle[nextStatusIndex];

    try {
      await updateApplicationStatus(applicationId, updatedStatus);
       
      // Update the status in UI
      const updatedJobApps = jobApps.map(jobApp =>
        jobApp.id === applicationId ? { ...jobApp, status: updatedStatus } : jobApp
      );
      setJobApps(updatedJobApps);

    } catch (error) {
      console.log('could not update applic status from action button');
    }
  
  };

  // Filter logic
  const filteredJobApps = jobApps.filter(jobApp => {
    return (
      jobApp?.name?.toLowerCase().includes(filters.companyName.toLowerCase()) &&
      jobApp.position.toLowerCase().includes(filters.position.toLowerCase()) &&
      (filters.status === '' || jobApp.status === filters.status)
    );
  });

  // Sorting logic
  const sortedJobApps = [...filteredJobApps].sort((a, b) => {
    if (filters.sortBy === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Applications</Title>
        <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select>
      </CardHeader>

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

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} sx={{ px: 3 }}>Company Name</TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>Applied</TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>Position</TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>Status</TableCell>
              <TableCell colSpan={1} sx={{ px: 0 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobApps.map((jobApp) => (
              <TableRow key={jobApp.id} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Link to={`/application-details/${jobApp.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Box display="flex" alignItems="center" gap={4}>
                      <Avatar src={jobApp?.imgUrl} />
                      <Paragraph>{jobApp.company}</Paragraph>
                    </Box>
                  </Link>
                </TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0 }}>{jobApp.date_applied ? new Date(jobApp.date_applied).toLocaleDateString('en-US') : "N/A"}</TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
}
