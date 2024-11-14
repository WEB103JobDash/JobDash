import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";
import { productList } from "app/views/dashboard/shared/TopSellingTable";


// Organize data by month name and status
const aggregateDataByMonthNameAndStatus = (data) => {
  const monthlyData = {};

  data.forEach(job => {
    // Get month name (e.g., "March")
    const date = new Date(job.applied);
    const monthName = date.toLocaleString('default', { month: 'long' });

    if (!monthlyData[monthName]) {
      monthlyData[monthName] = { applied: 0, interview: 0, rejected: 0 };
    }

    // Count every application as "applied"
    monthlyData[monthName].applied += 1;

    // Count specific statuses
    if (job.status === "interview") {
      monthlyData[monthName].interview += 1;
    } else if (job.status === "rejected") {
      monthlyData[monthName].rejected += 1;
    }
  });

  // Format data for ECharts
  const sourceData = [["Month", "Applied", "Interview", "Rejected"]];
  for (const [month, counts] of Object.entries(monthlyData)) {
    sourceData.push([month, counts.applied, counts.interview, counts.rejected]);
  }
  return sourceData;
};

const sourceData = aggregateDataByMonthNameAndStatus(productList);

export default function ComparisonChart({ height, color = [] }) {
  const theme = useTheme();

  const option = {
    grid: { top: "10%", bottom: "10%", right: "5%" },
    legend: { show: true, data: ["Applied", "Interview", "Rejected"] },
    color: ["#223388", "#6D9EF8", "#d9534f"],
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
        fontFamily: "roboto",
        color: theme.palette.text.secondary
      }
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: {
        fontSize: 13,
        fontFamily: "roboto",
        color: theme.palette.text.secondary
      }
    },
    series: [
      { type: "bar", name: "Applied", encode: { x: "Month", y: "Applied" } },
      { type: "bar", name: "Interview", encode: { x: "Month", y: "Interview" } },
      { type: "bar", name: "Rejected", encode: { x: "Month", y: "Rejected" } }
    ]
  };

  return <ReactEcharts style={{ height: height }} option={option} />;
}