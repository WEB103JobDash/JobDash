import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import { getJobApplications } from "../../../clientAPI";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ height = "", color = [] }) {
  const theme = useTheme();
  const [jobApps, setJobApps] = useState([]);
  const [selectedField, setSelectedField] = useState("status");

  // Fetch job applications from the database
  const fetchApplications = async () => {
    try {
      const data = await getJobApplications();
      setJobApps(data || []); // Ensure `data` is always an array
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  // Function to count occurrences of each unique value in the selected field
  const getCounts = (field) => {
    return jobApps.reduce((acc, item) => {
      const value = field === "status" ? item.status : item[field];

      // For status field, ensure we account for all statuses.
      if (field === "status") {
        if (value === "applied" || value === "interview" || value === "rejected" || value === "offer" || value === "accepted") {
          acc[value] = (acc[value] || 0) + 1;
        }
      } else {
        acc[value] = (acc[value] || 0) + 1;
      }

      return acc;
    }, {});
  };

  const counts = getCounts(selectedField);
  const labels = Object.keys(counts);

  // Dynamically generate color for each segment
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count; // evenly spaced hues around the color wheel
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: generateColors(labels.length),
        hoverBackgroundColor: generateColors(labels.length),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
      },
    },
  };

  // Use effect to fetch data initially when the component is first mounted
  useEffect(() => {
    fetchApplications(); // Initial fetch
  }, []);

  return (
    <div style={{ height }}>
      <div>
        <Select
          label=""
          variant="outlined"
          size="small"
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          displayEmpty
        >
          <MenuItem value="status">Status</MenuItem>
          <MenuItem value="company">Company</MenuItem>
          <MenuItem value="position">Position</MenuItem>
        </Select>
      </div>
      <div>
        {/* still needs to be stylized <Button variant="contained" color="primary" onClick={fetchApplications} style={{ marginTop: "16px" }}>
          Refresh Data
        </Button> */}
      </div>
      <Doughnut data={data} options={options} height="500px"/>
    </div>
  );
}
