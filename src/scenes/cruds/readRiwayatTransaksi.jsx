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

const RiwayatTransaksi = () => {
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
      sortable: false,
      renderCell: (params) => {
        const { id, status, jenis_customer } = params.row;

        if (status === "Belum Dibayar") {
          if (jenis_customer === "Personal") {
            return (
              <Link to={`/konfirmasiPembayaran/${id}`}>
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
                  Bayar
                </IconButton>
              </Link>
            );
          } else if (jenis_customer === "Grup") {
            return (
              <Link to={`/konfirmasiPembayaranGrup/${id}`}>
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
                  Bayar
                </IconButton>
              </Link>
            );
          }
        } else if (status === "Sudah Dibayar") {
          return (
            <Link to={`/tandaTerima/${id}`}>
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
                Tanda Terima
              </IconButton>
            </Link>
          );
        } else if (status === "Dibatalkan") {
          // If status is "Dibatalkan", don't show anything
          return null;
        }

        // Default: Render the "Detail" button
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
              Detail
            </IconButton>
          </Link>
        );
      },
    },
    {
      field: "update",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const isBatalkanVisible =
          params.row.status === "Belum Dibayar" ||
          params.row.status === "Sudah Dibayar";

        return isBatalkanVisible ? (
          <IconButton
            variant="contained"
            color="secondary"
            sx={{
              backgroundColor: colors.redAccent[500],
              color: "white",
              borderRadius: 0,
            }}
            onClick={() => handleBatalkan(params.row.id)}
          >
            Batalkan
          </IconButton>
        ) : null;
      },
    },
  ];

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [reservasiSearchTerm, setReservasiSearchTerm] = useState("");

  const [batalDialogOpen, setBatalDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [cancellationMessage, setCancellationMessage] = useState("");

  const fetchData = async (status, customerSearchTerm, reservasiSearchTerm) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
        params: {
          status: status === "All" ? undefined : status,
          nama_customer: customerSearchTerm || undefined,
          prefix_reservasi: reservasiSearchTerm || undefined,
        },
      };

      const response = await axios.get(
        // "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi",
        "http://localhost:6000/api/v1/customer/getRiwayatTransaksi",
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

  const handleConfirmBatal = async (id) => {
    try {
      console.log("Request Payload:", {
        method: "PUT",
        url: `http://localhost:6000/api/v1/transaksi/pembatalanReservasi/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("config:", config);

      const response = await axios.put(
        `http://localhost:6000/api/v1/transaksi/pembatalanReservasi/${id}`,
        {
          status: "Dibatalkan",
        },
        config
      );

      // Refresh the page after successful deletion
      console.log(response);
      fetchData(token);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetail = (id) => {
    navigate(`/detailriwayat/${id}`);
  };

  const handleStatusChange = (event, newValue) => {
    console.log("Selected Status:", newValue);
    setSelectedStatus(newValue);
  };

  const handleBatalkan = (id) => {
    const selectedTransaction = data.find(
      (transaction) => transaction.id === id
    );

    // Convert check_in string to a Date object
    const checkInDate = new Date(selectedTransaction.check_in);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

    // Calculate the day difference
    const dayDifference = Math.floor(
      (checkInDate - today) / (1000 * 60 * 60 * 24)
    );

    let cancellationMessage = "";

    if (dayDifference >= 7) {
      cancellationMessage = "Uang Anda Akan Dikembalikan";
    } else {
      cancellationMessage = "Uang Anda Tidak Dapat Dikembalikan";
    }

    // Check if the status is "Belum Dibayar"
    if (selectedTransaction.status === "Belum Dibayar") {
      // Handle the case where status is "Belum Dibayar" (you may want to show a different message or take other actions)
      cancellationMessage = "...";
    }

    setSelectedRowId(id);
    setBatalDialogOpen(true);
    setCancellationMessage(cancellationMessage);
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
      <Header
        title="Riwayat Transaksi"
        subtitle="Melihat Riwayat Transaksi Anda"
      />

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
          <Tab label="Belum Dibayar" value="Belum Dibayar" />
          <Tab label="Sudah Dibayar" value="Sudah Dibayar" />
          <Tab label="Dibatalkan" value="Dibatalkan" />
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

      <Dialog open={batalDialogOpen} onClose={() => setBatalDialogOpen(false)}>
        <DialogTitle>Batalkan Reservasi?</DialogTitle>
        <DialogContent>
          {cancellationMessage && <p>{cancellationMessage}</p>}
          Are you sure you want to Cancel this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatalDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setBatalDialogOpen(false);
              handleConfirmBatal(selectedRowId);
            }}
            color="error"
          >
            Batalkan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiwayatTransaksi;
