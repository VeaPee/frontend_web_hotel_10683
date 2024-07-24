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

const LaporanTopCustomer = () => {
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
        `http://35.198.205.6:5000/api/v1/report/getTopCustomer`,
        config
      );

      console.log(response);

      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        subtotal: item.subtotal,
        nama_customer: item.Reservasi.Customer.nama_customer
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
    const customerData = {};
  
    transformedData.forEach((item) => {
      const { nama_customer, subtotal } = item;
  
      if (!customerData[nama_customer]) {
        customerData[nama_customer] = {
          count: 1,
          total: subtotal,
        };
      } else {
        customerData[nama_customer].count += 1;
        customerData[nama_customer].total += subtotal;
      }
    });
  
    // Sort customers based on total in descending order
    const sortedCustomers = Object.keys(customerData).sort(
      (a, b) => customerData[b].count - customerData[a].count
    );
  
    // Take only the top 5 customers
    const top5Customers = sortedCustomers.slice(0, 5);
  
    return top5Customers.map((customer, index) => ({
      No: index + 1,
      Nama: customer,
      Jumlah: customerData[customer].count,
      Total: customerData[customer].total,
    }));
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
          LAPORAN 5 CUSTOMER RESERVASI TERBANYAK
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
              <TableCell sx={{ border: "1px solid #ccc" }}>Nama Customer</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>Jumlah Reservasi</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>Total Pembayaran</TableCell>
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
                {row.Nama !== undefined && (
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {row.Nama}
                  </TableCell>
                )}
                <TableCell sx={{ border: "1px solid #ccc" }}>
                  {row.Jumlah}
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
      <Box sx={{ textAlign: "center", m: 2 }}>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print PDF
        </Button>
      </Box>
    </div>
  );
};

export default LaporanTopCustomer;
