import React, { useState } from "react";
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

  // filter states
  const [filters, setFilters] = useState({
    companyName: '',
    position: '',
    status: ''
  });

  // filter change handler
  const handleFilterChange = (field) => (event) => {
    setFilters({
      ...filters,
      [field]: event.target.value
    });
  };

  const filteredProductList = productList.filter(product => {
    return (
      product.name.toLowerCase().includes(filters.companyName.toLowerCase()) &&
      product.position.toLowerCase().includes(filters.position.toLowerCase()) &&
      (filters.status === '' || product.status === filters.status)
    );
  });

  // Sorting logic
  const sortedProductList = [...filteredProductList].sort((a, b) => {
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
          onChange={handleFilterChange('sortBy')}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Sort by
          </MenuItem>
          <MenuItem value="asc">Company (A-Z)</MenuItem>
          <MenuItem value="desc">Company (Z-A)</MenuItem>
        </Select>
        <TextField
          label="Company Name"
          variant="outlined"
          size="small"
          value={filters.companyName}
          onChange={handleFilterChange('companyName')}
        />
        <TextField
          label="Position"
          variant="outlined"
          size="small"
          value={filters.position}
          onChange={handleFilterChange('position')}
        />
        <Select
          label="Status"
          variant="outlined"
          size="small"
          value={filters.status}
          onChange={handleFilterChange('status')}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Status
          </MenuItem>
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
              <TableCell colSpan={4} sx={{ px: 3 }}>
                Company Name
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Position
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Status
              </TableCell>

              <TableCell colSpan={1} sx={{ px: 0 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedProductList.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Avatar src={product.imgUrl} />
                    <Paragraph>{product.name}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  <Paragraph>{product.position}</Paragraph>
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {product.status === "applied" ? (
                    <Small bgcolor={bgSecondary}>Applied</Small>
                  ) : product.status === "interview" ? (
                    <Small bgcolor={bgPrimary}>Interview</Small>
                  ) : (
                    <Small bgcolor={bgError}>Rejected</Small>
                  )}
                </TableCell>

                <TableCell sx={{ px: 0 }} colSpan={1}>
                  <IconButton>
                    <Edit color="primary" />
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

export const productList = [
  {
    imgUrl: "https://logo.clearbit.com/google.com",
    name: "Google",
    position: "SDE I",
    status: "applied"
  },
  {
    imgUrl: "https://logo.clearbit.com/facebook.com",
    name: "Facebook",
    position: "SDE II",
    status: "interview"
  },
  {
    imgUrl: "https://logo.clearbit.com/amazon.com",
    name: "Amazon",
    position: "Senior SDE",
    status: "interview"
  },
  {
    imgUrl: "https://logo.clearbit.com/meta.com",
    name: "Meta",
    position: "SDE III",
    status: "rejected"
  },
  {
    imgUrl: "https://logo.clearbit.com/netflix.com",
    name: "Netflix",
    position: "Principal SDE",
    status: "applied"
  }
];
