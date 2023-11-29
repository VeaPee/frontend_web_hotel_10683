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
import BarChartThe2nd from "../../components/BarChartThe2nd";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const JumlahTamu = () => {
  const [transformedData, setTransformedData] = useState([]);

  const [token, setToken] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const componentRef = useRef();

  const [data, setData] = useState([]);

  // Define the months array
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchData = async (currentUserToken, selectedMonth) => {
    try {
        console.log("Month", selectedMonth)
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
        params: {
          month: selectedMonth + 1, // Send selectedMonth + 1 to match server expectations
        },
      };

      const response = await axios.get(
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi",
        config
      );

      console.log(response);

      const uniqueJenisKamarSet = new Set();

      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        check_in: item.check_in,
        jenis_customer: item.Customer.jenis_customer,
        dewasa: item.jumlahDewasa,
        anak: item.jumlahAnakAnak,

        DetailReservasiKamar: item.DetailReservasiKamar.map((dataKamar) => ({
          jenisKamar: dataKamar.Kamar.jenisKamar,
        })),
      }));

      transformedData.forEach((item) => {
        item.DetailReservasiKamar.forEach((dataKamar) => {
          const jenisKamar = dataKamar.jenisKamar;
          uniqueJenisKamarSet.add(jenisKamar);
        });
      });

      const uniqueJenisKamars = Array.from(uniqueJenisKamarSet);

      console.log(transformedData);
      console.log(uniqueJenisKamars);
      setTransformedData(transformedData);
      setData(uniqueJenisKamars);
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
      fetchData(token, selectedMonth);
    }
  }, [token, selectedMonth]);

  const generateReportData = () => {
    const reportData = [];
    let totalPersonal = 0;
    let totalGrup = 0;
  
    // Iterate over each unique jenisKamar
    data.forEach((jenisKamar, index) => {
      const personalData = transformedData.filter(
        (item) =>
          item.DetailReservasiKamar.some(
            (dataKamar) => dataKamar.jenisKamar === jenisKamar
          ) && item.jenis_customer === "Personal"
      );
  
      const grupData = transformedData.filter(
        (item) =>
          item.DetailReservasiKamar.some(
            (dataKamar) => dataKamar.jenisKamar === jenisKamar
          ) && item.jenis_customer === "Grup"
      );
  
      // Calculate counts and round to the nearest integer
      const personalCount =
        personalData.length > 0
          ? Math.round(
              personalData.reduce((sum, item) => sum + item.dewasa + item.anak, 0) /
                personalData.length
            )
          : 0;
  
      const grupCount =
        grupData.length > 0
          ? Math.round(
              grupData.reduce((sum, item) => sum + item.dewasa + item.anak, 0) /
                grupData.length
            )
          : 0;
  
      totalPersonal += personalCount;
      totalGrup += grupCount;
  
      reportData.push({
        No: index + 1,
        Jenis_Kamar: jenisKamar,
        Grup: grupCount,
        Personal: personalCount,
        Total: personalCount + grupCount,
      });
    });
  
    // Add a row for the totals
    reportData.push({
      No: "",
      Jenis_Kamar: "Total",
      Grup: totalGrup,
      Personal: totalPersonal,
      Total: totalPersonal + totalGrup,
    });
  
    return reportData;
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
          LAPORAN JUMLAH TAMU
        </Box>
        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box sx={{ textAlign: "left", m: 1, fontWeight: "bold" }}>
          Tahun 2023
        </Box>

        {/* BUTTON BULAN */}
        <Box sx={{ textAlign: "center", m: 1 }}>
          {/* Add the month dropdown */}
          <Select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            label="Bulan"
          >
            {months.map((month, index) => (
              <MenuItem key={index} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Table to display the report data */}
        <Table sx={{ border: "1px solid #ccc" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #ccc" }}>No</TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>
                Jenis Kamar
              </TableCell>
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
                {row.Jenis_Kamar !== undefined && (
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {row.Jenis_Kamar}
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
        <BarChartThe2nd data={generateReportData().slice(0, -1)} />
      </Box>

      <Box sx={{ textAlign: "center", m: 2 }}>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print PDF
        </Button>
      </Box>
    </div>
  );
};

export default JumlahTamu;
