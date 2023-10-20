import React, { useEffect, useState } from 'react';
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';

const Customer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const columns = [
    {
      field: "jenisKamar",
      headerName: "Jenis Kamar",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "jenisBed",
      headerName: "Jenis Bed",
    },
    {
      field: "jumlah_bed",
      headerName: "Jumlah Bed",
      type: "number",
    },
    {
      field: "kapasitas",
      headerName: "Kapasitas",
      type: "number",
    },
    {
      field: "luas",
      headerName: "Luas",
      type: "number",
    },
    {
      field: "fasilitas",
      headerName: "Fasilitas",
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
          sx={{ backgroundColor: colors.greenAccent[500], color: "white", borderRadius: 0 }}
          onClick={() => handleUpdate(params.row.id)}
        >
          Update
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="secondary"
          sx={{ backgroundColor: colors.redAccent[500], color: "white", borderRadius: 0 }}
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </IconButton>
      ),
    },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://p3l-10683.et.r.appspot.com/api/v1/customer/getCustomer");
      console.log(response); // Check the response object and its structure
      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        jenisKamar: item.jenisKamar,
        jenisBed: item.jenisBed,
        jumlah_bed: item.jumlah_bed,
        kapasitas: item.kapasitas,
        luas: item.luas,
        fasilitas: item.fasilitas,
      }));
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Kamar" subtitle="Managing Kamar" />
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
        <DataGrid checkboxSelection rows={data} columns={columns} />
      </Box>
    </Box>
  );
};

export default Kamar;