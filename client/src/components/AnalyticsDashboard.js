import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, useMediaQuery, useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsDashboard = ({ allTransaction }) => {
  const [selectedOption, setSelectedOption] = useState("Income");


  const categories = [
    "Food",
    "Shopping",
    "Bills",
    "Entertainment",
    "Salary",
    "Investment",
    "Others",
  ];

  const totalIncomeTransactions = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryIncomeData = categories.map((category) =>
    totalIncomeTransactions
      .filter((transaction) => transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0)
  );

  const categoryExpenseData = categories.map((category) =>
    totalExpenseTransactions
      .filter((transaction) => transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0)
  );

  // Determine which data to display based on selected option
  const chartData =
    selectedOption === "Income" ? categoryIncomeData : categoryExpenseData;

  // Filter out zero-value categories
  const filteredCategories = categories.filter((_, i) => chartData[i] > 0);
  const filteredData = chartData.filter((value) => value > 0);

  const chartConfig = {
    labels: filteredCategories, // Only show labels with data
    datasets: [
      {
        data: filteredData,
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#ADFF2F",
          "#E6E6FA",
        ].slice(0, filteredData.length), // Adjust colors to match filtered data
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handling the "Please add data" message
  const renderChart = () => {
    if (filteredData.length > 0) {
      return <Doughnut data={chartConfig} options={chartOptions} />;
    } else {
      return (
        <div>Please add data for {selectedOption === "Income" ? "Income" : "Expense"}.</div>
      );
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "column", height: '100%', maxHeight: '200%' }}>
      {/* Dropdown Selection */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", lg: "row" },
          marginBottom: "20px",
          columnGap: "30px",
          justifyContent: { lg: "space-between", xs: "space-between" },
        }}
      >
        <Box>Category wise</Box>
        <Box>
          <select id="select-option" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            <option value="">--Select--</option>
            <option value="Income">💰 INCOME</option>
            <option value="Expense">💸 EXPENSE</option>
          </select>
        </Box>
      </Box>

      {/* Chart & Legend Container */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {/* Doughnut Chart - 50% width */}
        <Box sx={{ flexBasis: "50%", maxWidth: "70%", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", height: isMobile ? 200 : 280 }}>
            {renderChart()}
          </Box>
        </Box>

        {/* Legend - 80% width */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)", // 1 column in mobile view
              sm: "repeat(2, 1fr)", // 2 columns in tablet view
              lg: "repeat(2, 1fr)", // 2 columns in large screens
            },
            gap: '10px',
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "80%",
            marginTop: "10px",
          }}
        >
          {chartConfig.labels.map((label, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: chartConfig.datasets[0].backgroundColor[index],
                  borderRadius: "2px",
                }}
              />
              <span style={{ fontSize: "12px" }}>
                {label}: {chartConfig.datasets[0].data[index]}
              </span>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
