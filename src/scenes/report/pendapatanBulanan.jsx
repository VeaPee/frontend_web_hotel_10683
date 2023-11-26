import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
// import Header from "../../components/Header";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import BarChart from "../../components/BarChart";

const PendapatanBulanan = () => {
  const [transformedData, setTransformedData] = useState([]);

  const [token, setToken] = useState("");

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const response = await axios.get(
        "http://localhost:6000/api/v1/customer/getRiwayatTransaksi",
        config
      );

      console.log(response);

      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        customerId: item.customerId,
        tanggal_reservasi: item.tanggal_reservasi,
        jenis_customer: item.Customer.jenis_customer,
        status: item.status,
        total: item.NotaPelunasan?.[0]?.subtotal || 0,
      }));

      console.log(transformedData);
      console.log(transformedData.length);
      setTransformedData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentUserToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const currentUserToken = getCurrentUserToken();
    setToken(currentUserToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const generateReportData = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const reportData = months.map((month, index) => {
      const filteredData = transformedData.filter((customer) => {
        const customerMonth = new Date(customer.tanggal_reservasi).getMonth();
        return customerMonth === index && customer.status === "Sudah Check Out";
      });

      // Calculate the total for Grup and Personal in specific month
      const totalGrup = filteredData
        .filter((customer) => customer.jenis_customer === "Grup")
        .reduce((acc, customer) => acc + customer.total, 0);

      const totalPersonal = filteredData
        .filter((customer) => customer.jenis_customer === "Personal")
        .reduce((acc, customer) => acc + customer.total, 0);

      return {
        No: index + 1,
        Bulan: month,
        Grup: totalGrup,
        Personal: totalPersonal,
        Total: totalGrup + totalPersonal,
      };
    });

    // Calculate the grand total
    const grandTotal = reportData.reduce((acc, row) => acc + row.Total, 0);

    // Add a separate row for the grand total at the bottom
    const totalRow = {
      No: null,
      Bulan: "TOTAL",
      Grup: reportData.reduce((acc, row) => acc + row.Grup, 0),
      Personal: reportData.reduce((acc, row) => acc + row.Personal, 0),
      Total: grandTotal,
    };

    return [...reportData, totalRow];
  };

  return (
    <div ref={componentRef}>
      <Box
        m="20px"
        mt="200px"
        sx={{
          width: "500px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <img alt="profile-user" src={`../../assets/GAH_Logo.jpg`} />
        </Box>

        <Box sx={{ textAlign: "center", m: 1 }}>
          Jl. P. Mangkubumi No.18, Yogyakarta 55233{" "}
        </Box>
        <Box sx={{ textAlign: "center", m: 1 }}>Telp. (0274) 487711.</Box>

        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>
          LAPORAN PENDAPATAN BULANAN
        </Box>
        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box sx={{ textAlign: "left", m: 1, fontWeight: "bold" }}>
          Tahun 2023
        </Box>
        {/* Table to display the report data */}
        <Table sx={{ border: "1px solid #ccc" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #ccc" }}>No</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>Bulan</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>Grup</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>Personal</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateReportData().map((row, index) => (
              <TableRow key={index}>
                {row.No !== undefined && (
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {row.No}
                  </TableCell>
                )}
                {row.Bulan !== undefined && (
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {row.Bulan}
                  </TableCell>
                )}
                <TableCell sx={{ border: "1px solid #ccc" }}>
                  {row.Grup}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc" }}>
                  {row.Personal}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc" }}>
                  {row.Total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ textAlign: "end", m: 1, fontWeight: "bold" }}>
          Dicetak Tanggal {new Date().toLocaleDateString()}
        </Box>
      </Box>


      {/* BarChart component at the bottom */}
      <Box m={4}>
        <BarChart data={generateReportData().slice(0, -1)} />
      </Box>

      <Box sx={{ textAlign: "center", m: 2 }}>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print PDF
        </Button>
      </Box>
    </div>
  );
};

export default PendapatanBulanan;
