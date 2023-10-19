import React, { useEffect, useState } from 'react';
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';

const Season = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const columns = [
    {
      field: "jenis_season",
      headerName: "Jenis Season",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "tanggal_awal",
      headerName: "Tanggal Awal",
      flex: 1,
    },
    {
      field: "tanggal_akhir",
      headerName: "Tanggal Akhir",
      flex: 1,
    },
    {
      field: "perubahan_harga",
      headerName: "Perubahan Harga",
      type: "number",
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
      const response = await axios.get("http://localhost:6000/api/v1/season/getAllSeason");
      console.log(response); // Check the response object and its structure
      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        jenis_season: item.jenis_season,
        tanggal_awal: item.tanggal_awal,
        tanggal_akhir: item.tanggal_akhir,
        perubahan_harga: item.perubahan_harga,
      }));
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Season" subtitle="Managing Season" />
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

export default Season;