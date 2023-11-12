import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, Link  } from "react-router-dom";

const RiwayatTransaksi = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
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
      renderCell: (params) => (
        <Link to={`/detailriwayat/${params.row.id}`}>
          <IconButton
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: "white",
              borderRadius: 0,
            }}
            onClick={() => handleDetail(params.row.id)}
          >
            Detail
          </IconButton>
        </Link>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.get(
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi",
        config
      );

      console.log(response); // Check the response object and its structure
      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        tanggal_reservasi: item.tanggal_reservasi,
        check_in: item.check_in,
        check_out: item.check_out,
        jumlahDewasa: item.jumlahDewasa,
        jumlahAnakAnak: item.jumlahAnakAnak,
        status: item.status,
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
      fetchData(token);
    }
  }, [token]);

  return (
    <Box m="20px">
      <Header title="Riwayat Transaksi" subtitle="Melihat Riwayat Transaksi Anda" />
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

export default RiwayatTransaksi;
