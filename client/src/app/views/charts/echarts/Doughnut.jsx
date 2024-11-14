import { useTheme } from "@mui/material/styles";
import { productList } from "app/views/dashboard/shared/TopSellingTable";
import { useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ height, color = [] }) {
  const theme = useTheme();

  const [selectedField, setSelectedField] = useState("status");

  // Function to count occurrences of each unique value in the selected field
  const getCounts = (field) => {
    return productList.reduce((acc, item) => {
      // If the field is "status," count all as "applied" while tracking specific statuses
      if (field === "status") {
        acc["applied"] = (acc["applied"] || 0) + 1;
        if (item.status === "interview") {
          acc["interview"] = (acc["interview"] || 0) + 1;
        } else if (item.status === "rejected") {
          acc["rejected"] = (acc["rejected"] || 0) + 1;
        }
      } else {
        // Otherwise, count the values normally
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
      const hue = (i * 360 / count) % 360; // evenly spaced hues around the color wheel
      colors.push(`hsl(${hue}, 70%, 60%)`); 
    }
    return colors;
  };
  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: generateColors(labels.length),
        hoverBackgroundColor: generateColors(labels.length)
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
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
    <div style={{height}}>
      <div>
        {/* <label htmlFor="fieldSelect">Select Field: </label> */}
        <Select
          label=""
          variant="outlined"
          size="small"
          value={selectedField}
          onChange={(e)=>setSelectedField(e.target.value)}
          displayEmpty
        >
        <MenuItem value="status">Status</MenuItem>
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="position">Position</MenuItem></Select>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};
