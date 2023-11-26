import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const NomorKamar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    {
      field: "jenisKamar",
      headerName: "Jenis Kamar",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "nomor_kamar",
      headerName: "Nomor Kamar",
      flex: 1,
    },
    {
      field: "update",
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/nomorkamarupdate/${params.row.id}`}>
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
        </Link>
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

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.get(
        // "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/getAllKamar",
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/getAllNomorKamar",
        config
      );

      console.log(response); // Check the response object and its structure
      const transformedData = response.data.data.map((kamar) => ({
          id: kamar.id,
          kamarId: kamar.kamarId,
          nomor_kamar: kamar.nomor_kamar,
          jenisKamar: kamar.Kamar.jenisKamar,
      }));
      
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
      setFilteredData(transformedData); // Initialize filteredData with all data

    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/nomorkamarupdate/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedRowId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };

      await axios.delete(
        // `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/deleteKamar/${id}`,
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/deleteNomorKamar/${id}`,
        config
      );

      // Refresh the page after successful deletion
      fetchData(token);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = data.filter((item) => {
      const lowerCaseQuery = query.toLowerCase();
      const lowerCaseName = item.jenisKamar.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });

    setFilteredData(filtered);
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
      <Header title="Kamar" subtitle="Managing Nomor Kamar" />
      <Box display="flex" justifyContent="first" mt="20px">
        <IconButton
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: "white",
            borderRadius: 0,
          }}
          onClick={() => navigate("/nomorkamarcreate")}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              handleConfirmDelete(selectedRowId);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NomorKamar;
