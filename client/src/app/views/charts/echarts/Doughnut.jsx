import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getJobApplications } from "../../../clientAPI";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ height = "400px", color = [] }) {
  const theme = useTheme();

  const [jobApps, setJobApps] = useState([]);

  // Fetch job applications from the database
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setJobApps(data || []); // Ensure `data` is always an array
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const [selectedField, setSelectedField] = useState("status");

  // Function to count occurrences of each unique value in the selected field
  const getCounts = (field) => {
    return jobApps.reduce((acc, item) => {
      if (field === "status") {
        // Handle "status" field: count "applied," "interview," and "rejected"
        acc["applied"] = (acc["applied"] || 0) + 1;
        if (item.status === "interview") {
          acc["interview"] = (acc["interview"] || 0) + 1;
        } else if (item.status === "rejected") {
          acc["rejected"] = (acc["rejected"] || 0) + 1;
        }
      } else {
        // Generic field counting (e.g., "company" or "position")
        acc[item[field]] = (acc[item[field]] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const counts = getCounts(selectedField);
  const labels = Object.keys(counts);

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
      <Doughnut data={data} options={options} />
    </div>
  );
}
