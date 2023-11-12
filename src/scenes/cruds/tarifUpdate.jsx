import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const tarifUpdate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  const [seasonOptions, setSeasonOptions] = useState([]);
  const [kamarOptions, setKamarOptions] = useState([]);
  
  
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

  const handleFormSubmit = async (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    axios
      .put(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/tarif/updateTarif/${id}`,
        {
            seasonId: values.seasonId,
            kamarId: values.kamarId,
            harga: values.harga,
        },
        config
      )
      .then((result) => {
        console.log(result);
        if (result.data.error === true) {
          setErrorMessage(result.data.message);
          alert(errorMessage);
          navigate("/tarifupdate");
        } else {
          alert("Berhasil mengubah Tarif!.");
          navigate("/tarif");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
  const fetchInitialValues = async (id, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    try {
      const response = await axios.get(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/tarif/getTarifByID/${id}`,
        config
      );

      const tarifData = response.data.data.tarif; // Access the data property of the response

      // Set the initial values with the fetched data
      setInitialValues({
        seasonId: tarifData.seasonId,
        kamarId: tarifData.kamarId,
        harga: tarifData.harga,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const initializeForm = async () => {
    await fetchInitialValues(id, token);
  };

  initializeForm();
}, [id, token]);
  
useEffect(() => {
    const fetchInitialValuesSeason = async (currentUserToken) => {
        const config = {
            headers: {
                Authorization: `Bearer ${currentUserToken}`,
            },
          };
        // Fetch the season options from the backend API
        axios
          .get("https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/season/getAllSeason", config)
          .then((response) => {
            setSeasonOptions(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    const initializeFormSeason = async () => {
        await fetchInitialValuesSeason(token);
      };
    
      initializeFormSeason();
  }, [token]);

  
  useEffect(() => {
    const fetchInitialValuesKamar = async (currentUserToken) => {
        const config = {
            headers: {
                Authorization: `Bearer ${currentUserToken}`,
            },
          };
        // Fetch the kamar options from the backend API
        axios
          .get("https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/getAllKamar", config)
          .then((response) => {
            setKamarOptions(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    const initializeFormKamar = async () => {
        await fetchInitialValuesKamar(token);
      };
    
      initializeFormKamar();
  }, [token]);

//   useEffect(() => {
//     fetchInitialValues(id,token);
//   }, [id,token]);

  if (!initialValues) {
    return <div>Loading...</div>;
  }



  return (
    <Box m="20px">
      <Header title="Update Tarif" subtitle="Change your Tarif" />

      <Formik
        onSubmit={(values) => handleFormSubmit(values, token)}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <Select
                fullWidth
                variant="filled"
                label="Season"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.seasonId}
                name="seasonId"
                error={!!touched.seasonId && !!errors.seasonId}
                helpertext={touched.seasonId && errors.seasonId}
                sx={{ gridColumn: "span 2" }}
              >
                {seasonOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.jenis_season}
                  </MenuItem>
                ))}
              </Select>

              <Select
                fullWidth
                variant="filled"
                label="Kamar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.kamarId}
                name="kamarId"
                error={!!touched.kamarId && !!errors.kamarId}
                helpertext={touched.kamarId && errors.kamarId}
                sx={{ gridColumn: "span 2" }}
              >
                {kamarOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.jenisKamar}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Harga"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.harga}
                name="harga"
                error={!!touched.harga && !!errors.harga}
                helperText={touched.harga && errors.harga}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="first" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
    seasonId: yup.string().required("Season is required"),
    kamarId: yup.string().required("Kamar is required"),
    harga: yup.number().required("Harga is required"),
});

export default tarifUpdate;
