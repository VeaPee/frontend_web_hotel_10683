import React, { useEffect, useState } from "react";
import { Box, IconButton, useTheme, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Customer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    {
      field: "jenis_customer",
      headerName: "Jenis Customer",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "nama_customer",
      headerName: "Nama Customer",
      flex: 1,
    },
    {
      field: "nama_institusi",
      headerName: "Nama Institusi",
      flex: 1,
    },
    {
      field: "nomor_identitas",
      headerName: "Nomor Identitas",
      flex: 1,
    },
    {
      field: "nomor_telepon",
      headerName: "Nomor Telepon",
      flex: 1,
    },
    {
      field: "email",
      headerName: "email",
      flex: 1,
    },
    {
      field: "alamat",
      headerName: "alamat",
      flex: 1,
    },
    {
      field: "update",
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: colors.greenAccent[500],
            color: "white",
            borderRadius: 0,
          }}
          onClick={() => handleUpdate(params.row.id)}
        >
          Update
        </IconButton>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const response = await axios.get(
        "https://p3l-10683.et.r.appspot.com/api/v1/customer/getCustomer",
        config
      );
      console.log(response); // Check the response object and its structure
      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        jenis_customer: item.jenis_customer,
        nama_customer: item.nama_customer,
        nama_institusi: item.nama_institusi,
        nomor_identitas: item.nomor_identitas,
        nomor_telepon: item.nomor_telepon,
        email: item.email,
        alamat: item.alamat,
      }));
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
      setFilteredData(transformedData); // Initialize filteredData with all data
    } catch (error) {
      console.error(error);
    }
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

  const handleUpdate = (id) => {
    navigate(`/customerupdate/${id}`);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = data.filter((item) => {
      const lowerCaseQuery = query.toLowerCase();
      const lowerCaseName = item.nama_customer.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });

    setFilteredData(filtered);
  };

  return (
    <Box m="20px">
      <Header title="Customer" subtitle="Managing Customer" />
      <Box display="flex" justifyContent="first" mt="20px">
        <IconButton
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: "white",
            borderRadius: 0,
          }}
          onClick={() => navigate("/customercreate")}
        >
          Create
        </IconButton>
      </Box>

      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "20px",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />
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
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Customer;
