import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ListRiwayatTransaksi = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    {
      field: "prefix_reservasi",
      headerName: "ID Transaksi",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "nama_customer",
      headerName: "Nama Customer",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "tanggal_reservasi",
      headerName: "Tanggal Reservasi",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "check_in",
      headerName: "Check In",
    },
    {
      field: "check_out",
      headerName: "Check Out",
    },
    {
      field: "jumlahDewasa",
      headerName: "Jumlah Dewasa",
      type: "number",
    },
    {
      field: "jumlahAnakAnak",
      headerName: "Jumlah Anak",
      type: "number",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "detail",
      headerName: "",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { id, status } = params.row;

        if (status === "Sudah Dibayar") {
          return (
            <Link to={`/CheckIn/${id}`}>
              <IconButton
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  color: "white",
                  borderRadius: 0,
                }}
                onClick={() => handleDetail(id)}
              >
                Check In
              </IconButton>
            </Link>
          );
        } else if (status === "Sudah Check In") {
          return (
            <Link to={`/CheckOut/${id}`}>
              <IconButton
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  color: "white",
                  borderRadius: 0,
                }}
                onClick={() => handleDetail(id)}
              >
                Check Out
              </IconButton>
            </Link>
          );
        } else if (status === "Sudah Check Out") {
          return (
            <Link to={`/detailriwayat/${id}`}>
              <IconButton
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  color: "white",
                  borderRadius: 0,
                }}
                onClick={() => handleDetail(id)}
              >
                Nota
              </IconButton>
            </Link>
          );
        } else {
          return null;
        }
      },
    },
    {
        field: "fasilitas",
        headerName: "",
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          const { id, status } = params.row;
  
          if (status === "Sudah Check In") {
            return (
              <Link to={`/tambahinFasilitas/${id}`}>
                <IconButton
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    color: "white",
                    borderRadius: 0,
                  }}
                  onClick={() => handleDetail(id)}
                >
                  Fasilitas
                </IconButton>
              </Link>
            );
          }else {
            return null;
          }
        },
      },
  ];

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [reservasiSearchTerm, setReservasiSearchTerm] = useState("");

  const fetchData = async (status, customerSearchTerm, reservasiSearchTerm) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);
      const config = {
        headers: {
          Authorization: token,
        },
        params: {
          status: status === "All" ? undefined : status,
          nama_customer: customerSearchTerm || undefined,
          prefix_reservasi: reservasiSearchTerm || undefined,
          check_in: currentDate,
        },
      };

      const response = await axios.get(
        // "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi",
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi",
        config
      );

      console.log(response); // Check the response object and its structure
      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        customerId: item.customerId,
        tanggal_reservasi: item.tanggal_reservasi,
        check_in: item.check_in,
        check_out: item.check_out,
        jumlahDewasa: item.jumlahDewasa,
        jumlahAnakAnak: item.jumlahAnakAnak,
        status: item.status,
        prefix_reservasi: item.prefix_reservasi,
        nama_customer: item.Customer.nama_customer,
        jenis_customer: item.Customer.jenis_customer,
      }));
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetail = (id) => {
    navigate(`/detailriwayat/${id}`);
  };

  const handleStatusChange = (event, newValue) => {
    fetchData(newValue, customerSearchTerm, reservasiSearchTerm);

    setSelectedStatus(newValue);
  };

  const getCurrentUserToken = () => {
    // Implement the function to retrieve the token for the current user
    // Return the token here
    return localStorage.getItem("token");
  };

  useEffect(() => {
    // Get the token for the current user from your authentication system
    const currentUserToken = getCurrentUserToken();
    console.log(currentUserToken);
    setToken(currentUserToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(selectedStatus, customerSearchTerm, reservasiSearchTerm);
    }
  }, [token, selectedStatus, customerSearchTerm, reservasiSearchTerm]);

  return (
    <Box m="20px">
      <Header title="List Reservasi" subtitle="Melihat List Data Reservasi" />

      <TextField
        label="Search Nama Customer"
        variant="outlined"
        value={customerSearchTerm}
        onChange={(e) => setCustomerSearchTerm(e.target.value)}
      />
      <TextField
        label="Search ID Transaksi"
        variant="outlined"
        value={reservasiSearchTerm}
        onChange={(e) => setReservasiSearchTerm(e.target.value)}
      />

      <Box
        m="20px 0"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Tabs
          value={selectedStatus}
          onChange={handleStatusChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All" value="All" />
          {/* <Tab label="Belum Dibayar" value="Belum Dibayar" /> */}
          <Tab label="Sudah Dibayar" value="Sudah Dibayar" />
          <Tab label="Sudah Check In" value="Sudah Check In" />
          <Tab label="Sudah Check Out" value="Sudah Check Out" />
          {/* <Tab label="Dibatalkan" value="Dibatalkan" /> */}
        </Tabs>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-row": {
            borderBottom: "none !important",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={data} columns={columns} />
      </Box>
    </Box>
  );
};

export default ListRiwayatTransaksi;
