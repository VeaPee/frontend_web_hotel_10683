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
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const LaporanCustomerBaru = () => {
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
        `http://35.198.205.6:5000/api/v1/report/getAllCustomer`,
        config
      );

      console.log(response);

      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        createdAt: item.Akun.createdAt,
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
        const customerMonth = new Date(customer.createdAt).getMonth();
        return customerMonth === index;
      });

      return {
        No: index + 1,
        Bulan: month,
        Jumlah: filteredData.length,
      };
    });

    // Calculate the total count
    const totalCount = reportData.reduce((acc, row) => acc + row.Jumlah, 0);

    // Add a separate row for the total count at the bottom
    const totalRow = {
        No: null,
        Bulan: null,
      Jumlah: totalCount,
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
          LAPORAN CUSTOMER BARU
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
              <TableCell sx={{ border: "1px solid #ccc" }}>Jumlah</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateReportData().map((row, index) => (
              <TableRow key={index}>
                {row.No !== undefined && (
                  <TableCell sx={{ border: "1px solid #ccc" }}>{row.No}</TableCell>
                )}
                {row.Bulan !== undefined && (
                  <TableCell sx={{ border: "1px solid #ccc" }}>{row.Bulan}</TableCell>
                )}
                <TableCell sx={{ border: "1px solid #ccc" }}>{row.Jumlah}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ textAlign: "end", m: 1, fontWeight: "bold" }}>
          Dicetak Tanggal {new Date().toLocaleDateString()}
        </Box>

      </Box>
      <Box sx={{ textAlign: "center", m: 2 }}>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print PDF
        </Button>
      </Box>
    </div>
  );
};

export default LaporanCustomerBaru;
