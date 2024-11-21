import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";
import { useState, useEffect } from "react";
import { getJobApplications } from "../../../clientAPI";

export default function ComparisonChart({ height = "400px", color = [] }) {
  const theme = useTheme();
  const [jobApps, setJobApps] = useState([]);

  // Fetch job applications from the database
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setJobApps(data || []); // Ensure `data` is an array or set an empty array
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchApplications();
  }, []);

  // Organize data by month name and status
  const aggregateDataByMonthNameAndStatus = (data) => {
    const monthlyData = {};

    data.forEach((job) => {
      // Get month name (e.g., "March")
      const date = new Date(job.date_applied);
      const monthName = date.toLocaleString("default", { month: "long" });

      if (!monthlyData[monthName]) {
        monthlyData[monthName] = { applied: 0, interview: 0, rejected: 0, offer: 0, hired: 0 };  // Add new statuses here
      }

      // Count every application as "applied"
      monthlyData[monthName].applied += 1;

      // Count specific statuses
      if (job.status === "interview") {
        monthlyData[monthName].interview += 1;
      } else if (job.status === "rejected") {
        monthlyData[monthName].rejected += 1;
      } else if (job.status === "offer") {
        monthlyData[monthName].offer += 1; // New status
      } else if (job.status === "accepted") {
        monthlyData[monthName].hired += 1; // New status
      }
    });

    // Format data for ECharts
    const sourceData = [["Month", "Applied", "Interview", "Rejected", "Offer", "Hired"]];  // Include new statuses in the header
    for (const [month, counts] of Object.entries(monthlyData)) {
      sourceData.push([month, counts.applied, counts.interview, counts.rejected, counts.offer, counts.hired]); // Include new statuses in data
    }
    return sourceData;
  };

  // Generate source data for the chart
  const sourceData = aggregateDataByMonthNameAndStatus(jobApps);

  // Distinct colors for each status
  const statusColors = {
    applied: "#223388",   // Dark blue for "Applied"
    interview: "#6D9EF8", // Light blue for "Interview"
    rejected: "#d9534f",  // Red for "Rejected"
    offer: "#F1C40F",     // Yellow for "Offer"
    accepted: "#2ECC71",     // Green for "accepted"
  };

  // ECharts configuration
  const option = {
    grid: { top: "10%", bottom: "10%", right: "5%" },
    legend: { show: true, data: ["Applied", "Interview", "Rejected", "Offer", "Accepted"] }, // Update legend to include new statuses
    color: [
      statusColors.applied,
      statusColors.interview,
      statusColors.rejected,
      statusColors.offer,
      statusColors.accepted,
    ], // Use the distinct colors for each status
    barGap: 0,
    barMaxWidth: "64px",
    dataset: { source: sourceData },
    xAxis: {
      type: "category",
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 13,
        fontFamily: "Roboto",
        color: theme.palette.text.secondary,
      },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: {
        fontSize: 13,
        fontFamily: "Roboto",
        color: theme.palette.text.secondary,
      },
    },
    series: [
      { type: "bar", name: "Applied", encode: { x: "Month", y: "Applied" } },
      { type: "bar", name: "Interview", encode: { x: "Month", y: "Interview" } },
      { type: "bar", name: "Rejected", encode: { x: "Month", y: "Rejected" } },
      { type: "bar", name: "Offer", encode: { x: "Month", y: "Offer" } },  // New series for "Offer"
      { type: "bar", name: "Accepted", encode: { x: "Month", y: "Hired" } },  // New series for "Hired"
    ],
  };

  return <ReactEcharts style={{ height: height }} option={option} />;
}
