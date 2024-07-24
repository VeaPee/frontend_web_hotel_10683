import React from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link } from 'react-router-dom';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>

      <Box display="flex">
        <IconButton>
          <Link to="/profile"><PersonOutlinedIcon /></Link>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
