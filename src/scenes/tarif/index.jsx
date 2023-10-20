import React, { useEffect, useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";

const Tarif = () => {
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
      field: "jenis_kamar",
      headerName: "Jenis Kamar",
      flex: 1,
    },
    {
      field: "harga",
      headerName: "Harga",
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
    {
      field: "delete",
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: colors.redAccent[500],
            color: "white",
            borderRadius: 0,
          }}
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </IconButton>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const response = await axios.get(
        "https://p3l-10683.et.r.appspot.com/api/v1/tarif/getAllTarif",
        config
      );
      console.log(response); // Check the response object and its structure


      // Fetch Data from Kamar
      const kamarResponse = await axios.get(
        "https://p3l-10683.et.r.appspot.com/api/v1/kamar/getAllKamar",
        config
      );
      console.log(kamarResponse); // Check the kamar response object and its structure
  
      const kamarData = kamarResponse.data.data.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      // Fetch Data from Season
      const seasonResponse = await axios.get(
        "https://p3l-10683.et.r.appspot.com/api/v1/season/getAllSeason",
        config
      );
      console.log(seasonResponse); // Check the season response object and its structure
  
      const seasonData = seasonResponse.data.data.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      const transformedData = response.data.data.map((item) => {
        return {
          id: item.id,
          jenis_season: seasonData[item.seasonId].jenis_season,
          jenis_kamar: kamarData[item.kamarId].jenisKamar,
          harga: item.harga,
        };
      });
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
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
    // console.log(currentUserToken);
    setToken(currentUserToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  return (
    <Box m="20px">
      <Header title="Tarif" subtitle="Managing Tarif" />
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

export default Tarif;
