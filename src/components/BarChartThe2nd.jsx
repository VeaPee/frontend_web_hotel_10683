import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartThe2nd = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.Jenis_Kamar),
    datasets: [
      {
        label: "Grup",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: data.map((entry) => entry.Grup),
      },
      {
        label: "Personal",
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        data: data.map((entry) => entry.Personal),
      },
      {
        label: "Total",
        backgroundColor: "rgba(34,139,34,0.4)",
        borderColor: "rgba(34,139,34,1)",
        borderWidth: 1,
        data: data.map((entry) => entry.Total),
      },
    ],
  };

  const options = {
    indexAxis: 'x',
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return <Bar data={chartData} options={options} style={{ width: "100%", height: "400px" }} />;
};

export default BarChartThe2nd;
