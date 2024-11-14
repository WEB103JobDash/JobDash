import { Box, styled, useTheme } from "@mui/material";

import Breadcrumb from "app/components/Breadcrumb";
import SimpleCard from "app/components/SimpleCard";

import DoughnutChart from "./Doughnut";
import ComparisonChart from "./ComparisonChart";

// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

export default function AppEchart() {
  const theme = useTheme();

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Analytics" }]} />
      </Box>

      <SimpleCard title="Doughnut Chart">
        <DoughnutChart
          height="350px"
          color={[
            theme.palette.primary.dark,
            theme.palette.primary.main,
            theme.palette.primary.light
          ]}
        />
      </SimpleCard>

      <Box sx={{ py: "12px" }} />


      <SimpleCard title="Comparison Chart">
        <ComparisonChart
          height="350px"
          color={[theme.palette.primary.dark, theme.palette.primary.light]}
        />
      </SimpleCard>

      <Box sx={{ py: "12px" }} />

    </Container>
  );
}
