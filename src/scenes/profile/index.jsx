import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [transformedData, setTransformedData] = useState([]);
  const [transformedDataCustomer, setTransformedDataCustomer] = useState([]);
  const [NotFound, setNotFound] = useState(false);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [role, setRole] = useState("");
  const [customerThing, setCustomerThing] = useState(0);

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const response = await axios.get(
        "https://p3l-10683.et.r.appspot.com/api/v1/akun/profile",
        config
      );

      console.log(response);
      console.log(response.data);
      const transformedData =
        response.data.error === false
          ? [
              {
                id: response.data.message.account.id,
                username: response.data.message.account.username,
                password: response.data.message.account.password,
                roleId: response.data.message.account.roleId,
              },
            ]
          : [];
      console.log(transformedData);
      setTransformedData(transformedData);
      setRole(response.data.message.account.roleId);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
      fetchData(token);
      fetchDataCustomer(token);
    }
  }, [token]);

  const handleUpdateClick = () => {
    navigate("/updatepassword");
  };

  // FETCH CUSTOMER

  const fetchDataCustomer = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const responseCustomer = await axios.get(
        "https://p3l-10683.et.r.appspot.com/api/v1/customer/getCustomer",
        config
      );
      console.log(responseCustomer); // Check the response object and its structure
      console.log(responseCustomer.data);

      const transformedDataCustomer = responseCustomer.data.data.map(
        (item) => ({
          id: item.id,
          jenis_customer: item.jenis_customer,
          nama_customer: item.nama_customer,
          nama_institusi: item.nama_institusi,
          nomor_identitas: item.nomor_identitas,
          nomor_telepon: item.nomor_telepon,
          email: item.email,
          alamat: item.alamat,
        })
      );
      console.log(transformedDataCustomer); // Check the transformed data
      setTransformedDataCustomer(transformedDataCustomer);
      setCustomerThing(transformedDataCustomer[0]?.id || 0);
      console.log(customerThing);
      setNotFound(false);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setNotFound(true);
      setIsLoading(false);
    }
  };

  const handleCreateCustomerClick = () => {
    navigate("/customercreate");
  };
  const handleUpdateCustomerClick = () => {
    navigate(`/customerupdate/${customerThing}`);
  };
  return (
    <Box m="20px">
      <Header title="Profile" subtitle="Manage your Account" />
      <form>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          {!isLoading && transformedData.length > 0 ? (
            <>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                value={transformedData[0].username}
                name="username"
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                value={transformedData[0].password}
                name="password"
                sx={{ gridColumn: "span 3" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </form>
      {!isLoading && transformedData.length > 0 && (
        <Box display="flex" justifyContent="first" mt="20px">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdateClick}
            sx={{ color: "white" }}
          >
            Update Password
          </Button>
        </Box>
      )}

      {!isLoading &&
        role === 6 &&
        NotFound && (
          <Box display="flex" justifyContent="first" mt="20px">
            <Button
              variant="contained"
              
              onClick={handleCreateCustomerClick}
              sx={{ color: "white" }}
              style={{
                backgroundColor: "#FFA500",
            }}
            >
              Create Customer
            </Button>
          </Box>
        )}

      {!isLoading && role === 6 && transformedDataCustomer.length > 0 && (
        <>
          <Box mt="30px">
            <Header title="Data Customer" subtitle="You'll Never Walk Alone" />
          </Box>

          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          >
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Jenis Customer"
              value={transformedDataCustomer[0].jenis_customer}
              name="jenis_customer"
              sx={{ gridColumn: "span 2" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Nama Customer"
              value={transformedDataCustomer[0].nama_customer}
              name="nama_customer"
              sx={{ gridColumn: "span 3" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Nama Institusi"
              value={transformedDataCustomer[0].nama_institusi}
              name="nama_institusi"
              sx={{ gridColumn: "span 4" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Nomor Identitas"
              value={transformedDataCustomer[0].nomor_identitas}
              name="nomor_identitas"
              sx={{ gridColumn: "span 5" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Nomor Telepon"
              value={transformedDataCustomer[0].nomor_telepon}
              name="nomor_telepon"
              sx={{ gridColumn: "span 6" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Email"
              value={transformedDataCustomer[0].email}
              name="email"
              sx={{ gridColumn: "span 7" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Alamat"
              value={transformedDataCustomer[0].alamat}
              name="alamat"
              sx={{ gridColumn: "span 3" }}
              InputProps={{ readOnly: true, disableUnderline: true }}
            />
          </Box>
        </>
      )}

      {!isLoading && role === 6 && transformedDataCustomer.length > 0 && (
        <Box display="flex" justifyContent="first" mt="20px">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdateCustomerClick}
            sx={{ color: "white" }}
          >
            Update Customer Data
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
