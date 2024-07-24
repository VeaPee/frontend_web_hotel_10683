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

const Fasilitas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    {
      field: "nama_fasilitas",
      headerName: "Nama Fasilitas",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "satuan",
      headerName: "Satuan",
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

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const response = await axios.get(
        "http://35.198.205.6:5000/api/v1/fasilitas/getAllFasilitas",
        config
      );
      console.log(response); // Check the response object and its structure

      const transformedData = response.data.data.map((item) => {
        return {
          id: item.id,
          nama_fasilitas: item.nama_fasilitas,
          satuan: item.satuan,
          harga: item.harga,
        };
      });
      console.log(transformedData); // Check the transformed data
      setData(transformedData);
      setFilteredData(transformedData); // Initialize filteredData with all data
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/fasilitasupdate/${id}`);
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
        `http://35.198.205.6:5000/api/v1/fasilitas/deleteFasilitas/${id}`,
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
      const lowerCaseName = item.nama_fasilitas.toLowerCase();
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
      <Header title="Fasilitas Tambahan" subtitle="Managing Fasilitas Tambahan" />
      <Box display="flex" justifyContent="first" mt="20px">
        <IconButton
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: "white",
            borderRadius: 0,
          }}
          onClick={() => navigate("/fasilitascreate")}
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

export default Fasilitas;
